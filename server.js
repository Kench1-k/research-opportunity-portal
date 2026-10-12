const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Input Validation Helper Function
const validateInput = (body) => {
    const { title, description, research_area, faculty_name, department, required_skills, available_positions, application_deadline } = body;
    if (!title || !description || !research_area || !faculty_name || !department || !required_skills || available_positions === undefined || !application_deadline) {
        return 'All required fields must be provided.';
    }
    if (isNaN(available_positions) || parseInt(available_positions) < 0) {
        return 'Available positions must be a non-negative number.';
    }
    return null;
};

// 1. GET ALL Opportunities
app.get('/api/opportunities', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM research_opportunities ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET ONE Opportunity by ID
app.get('/api/opportunities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM research_opportunities WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: `Opportunity with ID ${id} not found.` });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. CREATE a New Opportunity
app.post('/api/opportunities', async (req, res) => {
    try {
        const validationError = validateInput(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const { title, description, research_area, faculty_name, department, required_skills, available_positions, application_deadline, status } = req.body;
        const itemStatus = status && ['Open', 'Closed'].includes(status) ? status : 'Open';

        const sql = `INSERT INTO research_opportunities 
            (title, description, research_area, faculty_name, department, required_skills, available_positions, application_deadline, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await db.query(sql, [
            title, description, research_area, faculty_name, department, required_skills, parseInt(available_positions), application_deadline, itemStatus
        ]);

        const [inserted] = await db.query('SELECT * FROM research_opportunities WHERE id = ?', [result.insertId]);
        res.status(201).json({ message: 'Research opportunity created successfully.', data: inserted[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. UPDATE an Opportunity (or update status to Closed)
app.put('/api/opportunities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT * FROM research_opportunities WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({ error: `Opportunity with ID ${id} not found.` });
        }

        const current = existing[0];
        const {
            title = current.title,
            description = current.description,
            research_area = current.research_area,
            faculty_name = current.faculty_name,
            department = current.department,
            required_skills = current.required_skills,
            available_positions = current.available_positions,
            application_deadline = current.application_deadline,
            status = current.status
        } = req.body;

        if (status && !['Open', 'Closed'].includes(status)) {
            return res.status(400).json({ error: "Status must be 'Open' or 'Closed'." });
        }

        const formattedDeadline = typeof application_deadline === 'string' ? application_deadline.split('T')[0] : application_deadline;

        const sql = `UPDATE research_opportunities SET 
            title=?, description=?, research_area=?, faculty_name=?, department=?, 
            required_skills=?, available_positions=?, application_deadline=?, status=? 
            WHERE id=?`;

        await db.query(sql, [
            title, description, research_area, faculty_name, department, 
            required_skills, parseInt(available_positions), formattedDeadline, status, id
        ]);

        const [updated] = await db.query('SELECT * FROM research_opportunities WHERE id = ?', [id]);
        res.status(200).json({ message: 'Research opportunity updated successfully.', data: updated[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE an Opportunity
app.delete('/api/opportunities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [existing] = await db.query('SELECT * FROM research_opportunities WHERE id = ?', [id]);

        if (existing.length === 0) {
            return res.status(404).json({ error: `Opportunity with ID ${id} not found.` });
        }

        await db.query('DELETE FROM research_opportunities WHERE id = ?', [id]);
        res.status(200).json({ message: `Opportunity with ID ${id} deleted successfully.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve frontend for all non-API routes (Express 5 compatible)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});