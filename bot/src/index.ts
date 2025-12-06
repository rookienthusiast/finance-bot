import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { config } from './config';
import { processReceipt } from './services/gemini';
import { 
  saveStagingTransaction, 
  getPendingTransaction, 
  saveTransaction, 
  confirmTransaction,
  getUserByPhone, // Kita akan ubah ini jadi getUserByTelegramId nanti
  createUser
} from './services/supabase';

// Inisialisasi Bot
const bot = new Telegraf(config.telegram.token);

// Middleware Logging
bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date().getTime() - start.getTime();
  console.log('Response time: %sms', ms);
});

// Command: /start
bot.start(async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const name = ctx.from.first_name;

  // Cek user di database (sementara pakai field phone_number untuk nyimpen telegram_id)
  // Idealnya kita alter table users, tapi untuk cepat kita pakai kolom yg ada dulu
  let user = await getUserByPhone(telegramId); 
  if (!user) {
    user = await createUser(telegramId, name);
  }

  ctx.reply(`Halo ${name}! 👋\n\nSaya adalah asisten keuanganmu.\nKirimkan foto struk belanja, dan saya akan mencatatnya untukmu.`);
});

// Handle Photo
bot.on(message('photo'), async (ctx) => {
  const telegramId = ctx.from.id.toString();
  
  try {
    await ctx.reply('⏳ Sedang memproses struk... Mohon tunggu sebentar.');

    // Ambil link foto resolusi tertinggi
    const photo = ctx.message.photo.pop(); // Ambil yang paling besar
    if (!photo) return;

    const fileLink = await ctx.telegram.getFileLink(photo.file_id);
    
    // Process with Gemini
    // Note: Gemini service kita butuh URL, Telegram kasih URL. Cocok!
    const data = await processReceipt(fileLink.href);

    if (data) {
      // Save to staging
      await saveStagingTransaction(telegramId, data);

      // Format message
      let itemsList = '';
      if (data.items && Array.isArray(data.items)) {
          itemsList = data.items.map((item: any) => `- ${item.name} (${item.qty}x) : ${item.total}`).join('\n');
      }

      const summary = `
📅 *Tanggal:* ${data.date}
🏪 *Toko:* ${data.store}

🛒 *Item:*
${itemsList}

💰 *Total:* ${data.total}

_Apakah data ini benar?_
(Ketik "Ya" untuk menyimpan)
      `.trim();

      await ctx.replyWithMarkdown(summary);
    } else {
      await ctx.reply('❌ Maaf, saya gagal membaca struk tersebut. Pastikan gambar jelas.');
    }

  } catch (error) {
    console.error('Error processing photo:', error);
    await ctx.reply('❌ Terjadi kesalahan saat memproses gambar.');
  }
});

// Handle Text (Konfirmasi)
bot.on(message('text'), async (ctx) => {
  const text = ctx.message.text.toLowerCase().trim();
  const telegramId = ctx.from.id.toString();

  if (['ya', 'yes', 'y', 'ok', 'benar'].includes(text)) {
    try {
      const user = await getUserByPhone(telegramId);
      if (!user) {
          return ctx.reply('Silakan ketik /start terlebih dahulu.');
      }

      const pending = await getPendingTransaction(telegramId);
      
      if (pending) {
          await saveTransaction(user.id, pending.data);
          await confirmTransaction(pending.id);
          await ctx.reply('✅ Data berhasil disimpan ke database! 🎉');
      } else {
          await ctx.reply('❓ Tidak ada data struk yang menunggu konfirmasi. Kirim foto struk dulu ya.');
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      await ctx.reply('❌ Gagal menyimpan data.');
    }
  } else {
    // Ignore other text or give hint
    // ctx.reply('Kirim foto struk untuk dicatat, atau ketik "Ya" untuk konfirmasi.');
  }
});

// Start Bot
console.log('🤖 Bot Telegram sedang berjalan...');
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
