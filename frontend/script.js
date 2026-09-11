const API = 'http://localhost:5000';

// ============================================
// LOAD DASHBOARD
// ============================================
async function loadDashboard() {
    try {
        const res = await fetch(`${API}/api/dashboard`);
        const data = await res.json();
        document.getElementById('totalSkills').innerText = data.totalSkills;
        document.getElementById('avgGap').innerText = data.avgGap + '%';
        document.getElementById('matchedCount').innerText = data.matchedCount;
        document.getElementById('missingCount').innerText = data.missingCount;
    } catch (error) {
        console.error('Dashboard error:', error);
    }
}

// ============================================
// LOAD JOBS
// ============================================
async function loadJobs() {
    try {
        const res = await fetch(`${API}/api/jobs`);
        const data = await res.json();
        const container = document.getElementById('jobList');
        container.innerHTML = data.data.map(job => `
            <div class="job-item">
                <div><span class="company">${job.title}</span> at ${job.company}</div>
                <div class="skills">${job.skills.join(', ')}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Jobs error:', error);
    }
}

// ============================================
// UPLOAD FILE + ANALYZE + QUIZ (ALL IN ONE)
// ============================================
async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const statusDiv = document.getElementById('uploadStatus');
    const file = fileInput.files[0];
    
    if (!file) {
        statusDiv.innerHTML = '⚠️ Please select a file.';
        statusDiv.style.color = 'red';
        return;
    }

    statusDiv.innerHTML = '⏳ Uploading, analyzing, and generating quiz...';
    statusDiv.style.color = '#2b6cb0';

    const formData = new FormData();
    formData.append('syllabus', file);

    try {
        const res = await fetch(`${API}/api/upload-syllabus`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();

        if (data.success) {
            statusDiv.innerHTML = '✅ Analysis complete! Quiz ready!';
            statusDiv.style.color = 'green';

            // ---- SHOW GAP ANALYSIS ----
            document.getElementById('results').style.display = 'block';
            document.getElementById('gapScore').innerText = data.gap_score + '%';
            document.getElementById('matchedSkills').innerText = data.matched_skills.join(', ');
            document.getElementById('missingSkills').innerText = data.missing_skills.join(', ');
            document.getElementById('recommendation').innerText = data.recommendation;

            // ---- SHOW QUIZ ----
            displayQuiz(data.questions);
            document.getElementById('quizSection').style.display = 'block';

            loadDashboard();
        } else {
            statusDiv.innerHTML = '❌ Error: ' + data.error;
            statusDiv.style.color = 'red';
        }
    } catch (error) {
        statusDiv.innerHTML = '❌ Failed to connect to backend. Make sure server is running.';
        statusDiv.style.color = 'red';
        console.error('Upload error:', error);
    }
}

// ============================================
// DISPLAY QUIZ
// ============================================
function displayQuiz(questions) {
    const container = document.getElementById('quizContainer');
    container.innerHTML = '';

    const answers = questions.map(q => q.answer);
    container.dataset.answers = JSON.stringify(answers);

    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';
        questionDiv.innerHTML = `
            <p><strong>Q${index + 1}: ${q.question}</strong></p>
            <div class="quiz-options">
                ${q.options.map(opt => `
                    <label>
                        <input type="radio" name="q${index}" value="${opt}">
                        ${opt}
                    </label><br>
                `).join('')}
            </div>
        `;
        container.appendChild(questionDiv);
    });

    const submitBtn = document.createElement('button');
    submitBtn.textContent = '📤 Submit Answers';
    submitBtn.className = 'submit-quiz-btn';
    submitBtn.onclick = submitQuiz;
    container.appendChild(submitBtn);

    const answerDiv = document.createElement('div');
    answerDiv.id = 'quizAnswers';
    answerDiv.className = 'quiz-answers';
    container.appendChild(answerDiv);
}

// ============================================
// SUBMIT QUIZ
// ============================================
function submitQuiz() {
    const questions = document.querySelectorAll('.quiz-question');
    const container = document.getElementById('quizContainer');
    const answers = JSON.parse(container.dataset.answers || '[]');
    let correct = 0;
    let total = questions.length;
    let results = [];

    questions.forEach((q, index) => {
        const selected = q.querySelector(`input[name="q${index}"]:checked`);
        const correctAnswer = answers[index] || '';

        if (selected) {
            if (selected.value === correctAnswer) {
                correct++;
                results.push(`Q${index + 1}: ✅ Correct`);
            } else {
                results.push(`Q${index + 1}: ❌ Incorrect (Correct: ${correctAnswer})`);
            }
        } else {
            results.push(`Q${index + 1}: ⚠️ Not answered (Correct: ${correctAnswer})`);
        }
    });

    const answerDiv = document.getElementById('quizAnswers');
    const percentage = Math.round((correct / total) * 100);
    let emoji = '📚';
    let message = 'Keep learning! Review the materials and try again.';
    let bgColor = '#f8d7da';
    let textColor = '#721c24';

    if (percentage >= 80) {
        emoji = '🎉';
        message = 'Excellent! You\'ve mastered these skills!';
        bgColor = '#d4edda';
        textColor = '#155724';
    } else if (percentage >= 50) {
        emoji = '💪';
        message = 'Good job! Keep practicing to improve.';
        bgColor = '#fff3cd';
        textColor = '#856404';
    }

    answerDiv.innerHTML = `
        <h4>📊 Results</h4>
        <p><strong>Score:</strong> ${correct}/${total}</p>
        <p><strong>Percentage:</strong> ${percentage}%</p>
        <div style="margin: 10px 0;">
            ${results.map(r => `<p>${r}</p>`).join('')}
        </div>
        <div style="background: ${bgColor}; padding: 10px; border-radius: 8px; margin-top: 10px; color: ${textColor};">
            ${emoji} ${message}
        </div>
    `;
}

// ============================================
// MARKET SCANNER
// ============================================
async function loadMarketData() {
    const location = document.getElementById('locationFilter').value;
    const role = document.getElementById('roleFilter').value;
    const statusDiv = document.getElementById('uploadStatus');

    if (statusDiv) {
        statusDiv.innerHTML = '⏳ Fetching market data...';
        statusDiv.style.color = '#2b6cb0';
    }

    try {
        const res = await fetch(`${API}/api/market-scanner?location=${location}&role=${role}`);
        const result = await res.json();

        if (result.success) {
            const data = result.data;
            displayMarketData(data);
            if (statusDiv) {
                statusDiv.innerHTML = '✅ Market data updated!';
                statusDiv.style.color = 'green';
            }
        } else {
            if (statusDiv) {
                statusDiv.innerHTML = '❌ Failed to fetch market data.';
                statusDiv.style.color = 'red';
            }
        }
    } catch (error) {
        console.error('Market scanner error:', error);
        if (statusDiv) {
            statusDiv.innerHTML = '❌ Failed to connect to backend.';
            statusDiv.style.color = 'red';
        }
    }
}

function displayMarketData(data) {
    document.getElementById('marketLocation').innerText = data.location;
    document.getElementById('marketRole').innerText = data.role;
    document.getElementById('totalJobs').innerText = data.totalJobs;
    document.getElementById('topCompanies').innerText = data.companies.join(', ');

    const grid = document.getElementById('skillDemandGrid');
    grid.innerHTML = '';

    data.skills.forEach(skill => {
        const card = document.createElement('div');
        card.className = 'skill-card';
        let trendIcon = skill.trend === 'hot' ? '🔥' : skill.trend === 'rising' ? '🚀' : '📉';
        card.innerHTML = `
            <span class="skill-name">${skill.name}</span>
            <span class="skill-demand ${skill.trend}">${skill.demand}% ${trendIcon}</span>
        `;
        grid.appendChild(card);
    });

    const trendDiv = document.getElementById('trendAnalysis');
    trendDiv.innerHTML = `
        <h4>📈 Trend Analysis</h4>
        <p>
            <span class="highlight">${data.trendAnalysis.skills.join(' + ')}</span>
            demand increased <span class="highlight">${data.trendAnalysis.increase}%</span>
            in the last <span class="highlight">${data.trendAnalysis.period}</span>.
        </p>
        <p style="margin-top: 6px; font-size: 14px; color: var(--text-light);">
            📊 Based on ${data.totalJobs} job postings from ${data.companies.join(', ')}
        </p>
    `;
}

// ============================================
// PAGE FUNCTIONS
// ============================================
function showDashboard() {
    document.getElementById('dashboard').style.display = 'grid';
    document.getElementById('jobsSection').style.display = 'block';
    document.getElementById('marketScanner').style.display = 'none';
    loadDashboard();
}

function showJobs() {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('jobsSection').style.display = 'block';
    document.getElementById('marketScanner').style.display = 'none';
    loadJobs();
}

function showMarketScanner() {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('jobsSection').style.display = 'none';
    document.getElementById('marketScanner').style.display = 'block';
    loadMarketData();
}

// ============================================
// DARK MODE
// ============================================
function toggleDarkMode() {
    const body = document.body;
    const toggleBtn = document.getElementById('darkModeToggle');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        toggleBtn.innerHTML = '☀️ Light';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        toggleBtn.innerHTML = '🌙 Dark';
        localStorage.setItem('darkMode', 'disabled');
    }
}

// ============================================
// LOAD ON START
// ============================================
window.onload = function() {
    loadDashboard();
    loadJobs();
    
    const darkMode = localStorage.getItem('darkMode');
    const toggleBtn = document.getElementById('darkModeToggle');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        if (toggleBtn) toggleBtn.innerHTML = '☀️ Light';
    }
};