-- ============================================
-- SKILLBRIDGE DATABASE SCHEMA
-- Smart India Hackathon 2026
-- ============================================

-- Drop database if exists (for fresh setup)
DROP DATABASE IF EXISTS skillbridge;

-- Create database
CREATE DATABASE skillbridge;
USE skillbridge;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty', 'admin', 'policymaker') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. SKILLS TABLE
-- ============================================
CREATE TABLE skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. JOBS TABLE
-- ============================================
CREATE TABLE jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(100),
    location VARCHAR(100),
    salary VARCHAR(100),
    description TEXT,
    posted_date DATE,
    source VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. JOB SKILLS TABLE (Many-to-Many)
-- ============================================
CREATE TABLE job_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT,
    skill_id INT,
    demand_percentage DECIMAL(5,2),
    trend ENUM('hot', 'rising', 'stable', 'declining'),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- ============================================
-- 5. SYLLABI TABLE
-- ============================================
CREATE TABLE syllabi (
    id INT PRIMARY KEY AUTO_INCREMENT,
    program_name VARCHAR(200) NOT NULL,
    institution VARCHAR(100),
    file_path VARCHAR(255),
    file_name VARCHAR(100),
    uploaded_by INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- ============================================
-- 6. SYLLABUS SKILLS TABLE (Many-to-Many)
-- ============================================
CREATE TABLE syllabus_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    syllabus_id INT,
    skill_id INT,
    FOREIGN KEY (syllabus_id) REFERENCES syllabi(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

-- ============================================
-- 7. GAP REPORTS TABLE
-- ============================================
CREATE TABLE gap_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    syllabus_id INT,
    gap_score DECIMAL(5,2),
    matched_skills TEXT,
    missing_skills TEXT,
    recommendation TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (syllabus_id) REFERENCES syllabi(id) ON DELETE CASCADE
);

-- ============================================
-- 8. MARKET DATA TABLE (For Job Scanner)
-- ============================================
CREATE TABLE market_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    location VARCHAR(100),
    role VARCHAR(100),
    skill_id INT,
    demand_percentage DECIMAL(5,2),
    trend ENUM('hot', 'rising', 'stable', 'declining'),
    total_jobs INT,
    companies TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (skill_id) REFERENCES skills(id)
);

-- ============================================
-- SAMPLE DATA INSERTION
-- ============================================

-- Insert Sample Skills
INSERT INTO skills (name, category) VALUES
('React', 'Frontend'),
('Node.js', 'Backend'),
('Python', 'Programming'),
('JavaScript', 'Frontend'),
('HTML', 'Frontend'),
('CSS', 'Frontend'),
('SQL', 'Database'),
('MongoDB', 'Database'),
('AWS', 'Cloud'),
('Docker', 'DevOps'),
('Git', 'DevOps'),
('TypeScript', 'Frontend'),
('Angular', 'Frontend'),
('Vue.js', 'Frontend'),
('Java', 'Programming'),
('C++', 'Programming'),
('PHP', 'Backend'),
('Ruby', 'Backend'),
('Swift', 'Mobile'),
('Kotlin', 'Mobile');

-- Insert Sample Jobs
INSERT INTO jobs (title, company, location, posted_date) VALUES
('Frontend Developer', 'Tech Corp', 'Pune', CURDATE()),
('Backend Engineer', 'DataFlow Inc', 'Mumbai', CURDATE()),
('Full Stack Developer', 'Startup Hub', 'Bangalore', CURDATE()),
('DevOps Engineer', 'CloudNet', 'Pune', CURDATE()),
('Data Scientist', 'AI Labs', 'Hyderabad', CURDATE());

-- Insert Sample Job Skills
INSERT INTO job_skills (job_id, skill_id, demand_percentage, trend) VALUES
(1, 1, 82, 'hot'),   -- React
(1, 4, 76, 'hot'),   -- JavaScript
(1, 5, 71, 'hot'),   -- HTML
(2, 2, 64, 'rising'), -- Node.js
(2, 3, 58, 'rising'), -- Python
(2, 7, 55, 'stable'), -- SQL
(3, 1, 70, 'hot'),   -- React
(3, 2, 65, 'rising'), -- Node.js
(3, 8, 60, 'rising'), -- MongoDB
(4, 9, 68, 'rising'), -- AWS
(4, 10, 62, 'rising'), -- Docker
(4, 11, 58, 'stable'), -- Git
(5, 3, 75, 'hot'),   -- Python
(5, 7, 70, 'hot'),   -- SQL
(5, 8, 55, 'stable'); -- MongoDB

-- Insert Sample Market Data
INSERT INTO market_data (location, role, skill_id, demand_percentage, trend, total_jobs, companies) VALUES
('Pune', 'Software Developer', 1, 82, 'hot', 547, 'TCS, Infosys, Wipro, Accenture, Tech Mahindra'),
('Pune', 'Software Developer', 7, 76, 'hot', 547, 'TCS, Infosys, Wipro, Accenture, Tech Mahindra'),
('Pune', 'Software Developer', 11, 71, 'hot', 547, 'TCS, Infosys, Wipro, Accenture, Tech Mahindra'),
('Pune', 'Software Developer', 9, 64, 'rising', 547, 'TCS, Infosys, Wipro, Accenture, Tech Mahindra'),
('Pune', 'Software Developer', 3, 58, 'rising', 547, 'TCS, Infosys, Wipro, Accenture, Tech Mahindra'),
('Pune', 'Software Developer', 15, 32, 'declining', 547, 'TCS, Infosys, Wipro, Accenture, Tech Mahindra');

-- Insert Sample User
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@skillbridge.com', 'admin123', 'admin');

-- ============================================
-- VIEWS (For Easy Queries)
-- ============================================

-- View: Get skill demand for a specific location/role
CREATE VIEW market_demand_view AS
SELECT 
    md.location,
    md.role,
    s.name AS skill_name,
    md.demand_percentage,
    md.trend,
    md.total_jobs,
    md.companies
FROM market_data md
JOIN skills s ON md.skill_id = s.id;

-- View: Get gap analysis with skill details
CREATE VIEW gap_analysis_view AS
SELECT 
    gr.id AS report_id,
    sy.program_name,
    sy.institution,
    gr.gap_score,
    gr.matched_skills,
    gr.missing_skills,
    gr.recommendation,
    gr.generated_at
FROM gap_reports gr
JOIN syllabi sy ON gr.syllabus_id = sy.id;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_job_skills_job_id ON job_skills(job_id);
CREATE INDEX idx_job_skills_skill_id ON job_skills(skill_id);
CREATE INDEX idx_syllabus_skills_syllabus_id ON syllabus_skills(syllabus_id);
CREATE INDEX idx_syllabus_skills_skill_id ON syllabus_skills(skill_id);
CREATE INDEX idx_gap_reports_syllabus_id ON gap_reports(syllabus_id);
CREATE INDEX idx_market_location ON market_data(location);
CREATE INDEX idx_market_role ON market_data(role);

-- ============================================
-- DONE!
-- ============================================