# 💰 AI Finance Tracker

**AI Finance Tracker** is a smart personal finance assistant that combines the ease of **Telegram** with the power of **Google Gemini AI**.

Simply send a photo of your receipt to the Telegram Bot, and the AI will automatically extract the transaction details (Store, Date, Items, Total) and save them to your database. You can then monitor, edit, and analyze your finances through a professional **Web Dashboard**.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Dashboard+Preview)

## ✨ Key Features

-   **📸 Zero-Friction Input**: Just snap a photo of your receipt and send it to Telegram. No typing needed.
-   **🧠 AI-Powered Extraction**: Uses **Gemini 2.5 Pro** to accurately read receipts, including handwritten ones.
-   **📊 Professional Dashboard**:
    -   **Real-time Stats**: Monitor Income, Expense, and Balance.
    -   **Budgeting**: Set monthly budgets per category with visual progress bars.
    -   **Dynamic Categories**: Create, edit, and customize your own expense categories.
-   **📝 Hybrid Entry**:
    -   **Auto**: Scan receipt via Bot.
    -   **Manual**: Input transaction details manually via Web (supports itemized details).
-   **📱 Responsive Design**: Works perfectly on Desktop and Mobile.

## �️ Tech Stack

-   **Frontend**: [Next.js 15](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/).
-   **Backend (Bot)**: Node.js, [Telegraf](https://telegraf.js.org/) (Telegram Bot API).
-   **AI Engine**: [Google Gemini API](https://ai.google.dev/).
-   **Database**: [Supabase](https://supabase.com/) (PostgreSQL).

## 🚀 Getting Started

### Prerequisites

1.  **Node.js** (v18 or higher).
2.  **Supabase Account** (Free Tier is enough).
3.  **Google AI Studio API Key** (Gemini).
4.  **Telegram Bot Token** (from @BotFather).

### 1. Database Setup (Supabase)

1.  Create a new project in Supabase.
2.  Go to **SQL Editor** and run the script located in `database/schema.sql`.
3.  This will create the necessary tables: `users`, `transactions`, `transaction_items`, `categories`.

### 2. Bot Setup

1.  Navigate to the `bot` directory:
    ```bash
    cd bot
    npm install
    ```
2.  Copy `.env.example` to `.env` and fill in your credentials:
    ```env
    TELEGRAM_BOT_TOKEN=...
    GEMINI_API_KEY=...
    SUPABASE_URL=...
    SUPABASE_KEY=... (Service Role Key)
    ```
3.  Start the bot:
    ```bash
    npm run dev
    ```

### 3. Web Dashboard Setup

1.  Navigate to the `web` directory:
    ```bash
    cd web
    npm install
    ```
2.  Copy `env.example` to `.env.local` and fill in your credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:3000` in your browser.

## � Usage Guide

1.  **Start the Bot**: Send `/start` to your Telegram Bot. This registers your User ID.
2.  **Send Receipt**: Take a photo of any shopping receipt and send it to the bot.
3.  **Wait for AI**: The bot will reply "Sedang menganalisis struk...". Tunggu sebentar.
4.  **Confirmation**: Bot will reply with the extracted data. Reply "Ya" to save.
5.  **Check Dashboard**: Refresh your web dashboard to see the new transaction!

## 🤝 Contributing

Feel free to fork this project and submit Pull Requests. Any contributions to improve the AI accuracy or Dashboard UI are welcome!

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
# finance-tracker
