# AI & Learn Through Traps 🧠🪤

A Gamified Learning Platform that uses AI to generate deceptive questions, testing student's understanding by luring them into common misconceptions ("traps") and providing targeted feedback.

## 🚀 Features

- **AI Trap Generation**: Dynamically creates questions with "Trap" answers based on cognitive bias patterns.
- **Mobile App**: Cross-platform (iOS/Android) for learning on the go.
- **Web Dashboard**: Admin panel for teachers to upload textbooks and view analytics.
- **Textbook Parsing**: Upload PDFs to automatically extract curriculum concepts.
- **Gamification**: XP, Levels, Badges, and Leaderboards.
- **Dark Mode**: Beautiful, student-friendly UI.

## 📂 Project Structure

- **`/mobile`**: React Native (Expo) application.
- **`/backend`**: Python FastAPI server with AI & SQLite.
- **`/src`**: Original React Web Prototype (Legacy/Admin).

## 🛠️ Quick Start

For detailed installation instructions, see [INSTALL_GUIDE.md](./INSTALL_GUIDE.md).

### 1. Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 2. Mobile App
```bash
cd mobile
npm install
npm run android
```

## 📱 Exporting APK
To build the Android APK for production, see [APK_EXPORT_GUIDE.md](./APK_EXPORT_GUIDE.md).

## 🤝 Contributing
1. Clone the repo.
2. Create feature branch.
3. Submit PR.

## 📜 License
MIT
