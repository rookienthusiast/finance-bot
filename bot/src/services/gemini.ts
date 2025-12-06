import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import axios from 'axios';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey || '');

export const processReceipt = async (imageUrl: string): Promise<any> => {
  try {
    // 1. Download Image from Telegram URL
    // Telegram URL is directly accessible
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);

    // 2. Prepare for Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    
    const prompt = `
      Analisis gambar struk belanja ini. Ekstrak informasi berikut dalam format JSON murni (tanpa markdown \`\`\`json).
      
      Format yang diinginkan:
      {
        "date": "YYYY-MM-DD", (jika tidak ada tahun, asumsikan tahun ini)
        "store": "Nama Toko",
        "items": [
          {
            "name": "Nama Barang",
            "qty": 1, (number)
            "price": 0, (number, harga satuan)
            "total": 0 (number, harga total item ini)
          }
        ],
        "total": 0 (number, total belanja)
      }
      
      Pastikan semua angka dalam format number (bukan string). Jika ada diskon, anggap sebagai item dengan harga negatif.
    `;

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: 'image/jpeg', 
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const responseGemini = await result.response;
    const text = responseGemini.text();

    // Clean up markdown if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText);

  } catch (error) {
    console.error('Error processing receipt with Gemini:', error);
    return null;
  }
};
