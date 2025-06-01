# Hallucinate

> Got too many League of Legends accounts?
> Tired of digging through spreadsheets just to find your rank?
> **Hallucinate** has your back.

**Hallucinate** is an open-source desktop app for managing all your League of Legends accounts in one place. Inspired by tools like *Deceive*, this Shaco-flavored manager helps you organize account names and check public rank info all locally.

---

## 🔒 Privacy First

- All data stays on your computer
- No Riot credentials are ever stored or requested
- No external database or API
- Encryption ensures your data remains secure

---

## 🎯 Key Features

- Save and label multiple League of Legends accounts
- Instantly fetch public **rank**, **tier**, **winrate**, and more
- All rank icons courtesy of Riot Games
- Fully local

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- Rust (for Tauri)
- A Riot Games API key

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/hallucinate.git
cd hallucinate
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your configuration:

```env
SECRET_KEY=your_42_character_secret_key_here_abcdefghijk
VITE_SECRET_KEY=your_42_character_secret_key_here_abcdefghijk
RIOT_API_KEY=your_riot_api_key_here
```

**Important Notes:**
- `SECRET_KEY` and `VITE_SECRET_KEY` must be identical 42-character strings
- Get your Riot API key from [Riot Developer Portal](https://developer.riotgames.com/)
- Generate a secure 42-character secret key (you can use online generators or create your own)

### 4. Run the Application
```bash
# Start the backend server
npm start

# In a new terminal, start the Tauri desktop app
npm run tauri dev
```

The application will launch as a desktop app with the backend running locally.

---

## 🧰 Tech Stack

Built with a modern full-stack setup for speed, security, and portability:

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + SQLite (local storage)
- **Desktop Shell**: [Tauri](https://tauri.app/)
- **Package Management**: npm + Cargo (for Tauri)

---

## 📁 Assets & Credits

- All rank icons and tier images are property of **Riot Games**
- This project is **not affiliated** with Riot Games
- Built for **local use only**, using Riot's **public API** for summoner info

---

## 📝 License

[MIT License](LICENSE)

---

> Hallucinate: because managing accounts shouldn't feel like fighting clones.
