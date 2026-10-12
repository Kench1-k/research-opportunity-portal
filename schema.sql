-- schema.sql
CREATE DATABASE IF NOT EXISTS research_db;
USE research_db;

DROP TABLE IF EXISTS research_opportunities;

CREATE TABLE research_opportunities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    research_area VARCHAR(100) NOT NULL,
    faculty_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    required_skills TEXT NOT NULL,
    available_positions INT NOT NULL DEFAULT 1,
    application_deadline DATE NOT NULL,
    status ENUM('Open', 'Closed') NOT NULL DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial test records
INSERT INTO research_opportunities 
(title, description, research_area, faculty_name, department, required_skills, available_positions, application_deadline, status)
VALUES 
('AI in Healthcare', 'Developing deep learning models for medical image diagnosis.', 'Artificial Intelligence', 'Dr. Alan Turing', 'Computer Science', 'Python, PyTorch, OpenCV', 2, '2026-12-31', 'Open'),
('Quantum Cryptography', 'Exploring quantum-resistant encryption primitives.', 'Cybersecurity', 'Dr. Grace Hopper', 'Computer Science', 'C++, Network Security, Mathematics', 1, '2026-11-15', 'Open');

SELECT * FROM research-opportunity-portal;