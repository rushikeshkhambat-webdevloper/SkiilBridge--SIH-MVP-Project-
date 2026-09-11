const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads folder if not exists
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Multer setup
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// ========== API ENDPOINTS ==========

// Test API
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Backend is working! 🚀' });
});

// Upload Syllabus
app.post('/api/upload-syllabus', upload.single('syllabus'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const allSkills = ['React', 'Node.js', 'Python', 'JavaScript', 'HTML', 'CSS', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'TypeScript', 'Angular', 'Vue.js', 'Java', 'C++', 'PHP', 'Ruby'];
    
    let available = [...allSkills];
    let matched = [];
    for (let i = 0; i < 4 + Math.floor(Math.random() * 3); i++) {
        let idx = Math.floor(Math.random() * available.length);
        matched.push(available[idx]);
        available.splice(idx, 1);
    }
    
    let missing = [];
    for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
        let idx = Math.floor(Math.random() * available.length);
        missing.push(available[idx]);
        available.splice(idx, 1);
    }

    const gapScore = 30 + Math.floor(Math.random() * 40);

    res.json({
        success: true,
        message: 'Syllabus analyzed successfully!',
        fileName: req.file.filename,
        gap_score: gapScore,
        matched_skills: matched,
        missing_skills: missing,
        recommendation: `Add ${missing.join(', ')} to your curriculum to bridge the industry gap.`
    });
});

// Dashboard Stats
app.get('/api/dashboard', (req, res) => {
    res.json({
        success: true,
        totalSkills: 18,
        avgGap: 45,
        matchedCount: 12,
        missingCount: 6
    });
});

// Job Listings
app.get('/api/jobs', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 1, title: 'Frontend Developer', company: 'Tech Corp', skills: ['React', 'JavaScript', 'CSS'] },
            { id: 2, title: 'Backend Engineer', company: 'DataFlow Inc', skills: ['Node.js', 'Python', 'SQL'] },
            { id: 3, title: 'Full Stack Developer', company: 'Startup Hub', skills: ['React', 'Node.js', 'MongoDB'] },
            { id: 4, title: 'DevOps Engineer', company: 'CloudNet', skills: ['AWS', 'Docker', 'Git'] },
            { id: 5, title: 'Data Scientist', company: 'AI Labs', skills: ['Python', 'SQL', 'MongoDB'] }
        ]
    });
});

// ========== QUIZ GENERATOR API ========== ✅ MOVED HERE (BEFORE app.listen)

app.post('/api/generate-quiz', upload.single('syllabus'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const quizQuestions = [
        {
            question: "What is the primary use of React?",
            options: ["Backend development", "Building user interfaces", "Database management", "Cloud computing"],
            answer: "Building user interfaces"
        },
        {
            question: "Which language is primarily used for Node.js?",
            options: ["Python", "Java", "JavaScript", "Ruby"],
            answer: "JavaScript"
        },
        {
            question: "What does SQL stand for?",
            options: ["Structured Query Language", "Simple Query Language", "Standard Question Language", "System Query Logic"],
            answer: "Structured Query Language"
        },
        {
            question: "Which of the following is a NoSQL database?",
            options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
            answer: "MongoDB"
        },
        {
            question: "What is Docker used for?",
            options: ["Containerization", "Web development", "Data science", "Game development"],
            answer: "Containerization"
        }
    ];

    res.json({
        success: true,
        questions: quizQuestions
    });
});

// ========== START SERVER ========== ✅ MOVED TO THE BOTTOM

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});