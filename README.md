# 🧠 SkillBridge AI

An AI-powered skill gap analysis platform that helps students identify missing skills for their target role — built around the Smart India Hackathon problem statement.

---

## 🎯 Problem Statement

Students often don't know which skills they're missing for their target job role. They study random topics without knowing the gap between their current skills and industry requirements. SkillBridge AI aims to bridge this gap.

---

## 💡 How It Works

1. User uploads their current resume or selects their existing skills
2. User selects a target role (e.g., Frontend Developer, Data Analyst)
3. System compares skills against role requirements
4. Skill gap score and recommended skills to learn are displayed
5. User gets a personalized learning path

---

## ✨ Features

- 📄 Resume / skill input
- 🎯 Target role selection
- 📊 Skill gap score visualization
- 🧩 Recommended skills with priority
- 📈 Dashboard with progress tracking
- 🎨 Clean, modern UI

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React.js + Vite |
| Backend | Node.js + Express |
| Database | MySQL (planned) |
| AI / NLP | In Progress — planned: OpenAI API / Sentence-BERT |
| Deployment | Vercel (frontend) + Render (backend) |

> **Note:** The current backend uses a mock algorithm to simulate skill gap analysis for demo purposes. Real AI/NLP integration is under development.

---

## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Skill Gap Analysis
![Analysis](./screenshots/analysis.png)

---

## 🚀 Getting Started

### Frontend

```bash
git clone https://github.com/rushikeshkhambat-webdevloper/SkillBridge-AI.git
cd SkillBridge-AI
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
node server.js
```

Backend runs on http://localhost:5000

---

## 📁 Folder Structure

```
SkillBridge-AI/
├── src/                  # Frontend (React)
│   ├── components/
│   ├── pages/
│   └── App.jsx
├── backend/              # Express server
│   └── server.js
└── README.md
```

---

## 🔮 Roadmap

- [x] Frontend UI
- [x] Mock backend API
- [ ] Real AI integration (OpenAI / Hugging Face)
- [ ] User authentication (JWT)
- [ ] Database integration (PostgreSQL + Prisma)
- [ ] Save analysis history
- [ ] Resume PDF parsing

---

## 🏆 Acknowledgement

Built for Smart India Hackathon (SIH) problem statement.

---

## 👨‍💻 Author

**Rushikesh Khambat**
- GitHub: https://github.com/rushikeshkhambat-webdevloper

---

## 📄 License

MIT License
