# 🎓 University Research Opportunity Portal

A full-stack, web-based centralized portal designed for university faculty members to post, update, track, close, and manage research opportunities, allowing students to seamlessly discover active research positions in one place.

---

## 🔗 GitHub Repository
**Repository Link:** [https://github.com/Kench1-k/research-opportunity-portal](https://github.com/Kench1-k/research-opportunity-portal)

---

## 📌 Problem Statement & Solution Overview

Previously, university research opportunities were informally distributed across scattered noticeboards, WhatsApp groups, and email threads. This caused students to miss critical deadlines and made it difficult for faculty to track applicants. 

This **Research Opportunity Portal** provides:
1. **Centralized Platform:** A single web application connecting faculty postings directly with students.
2. **RESTful Architecture:** Decoupled Express.js API performing CRUD operations on a MySQL database.
3. **Interactive UI:** A responsive single-page interface powered by Bootstrap 5 and dynamic Fetch API calls.

---

## 🛠️ Technology Stack & Dependencies

### Backend
- **Runtime Environment:** Node.js (v18+ LTS)
- **Framework:** Express.js (v4.19.2) - Handles web routing, middleware, and HTTP requests/responses.
- **Database Driver:** `mysql2` (v3.9.7) - Enables asynchronous connection pooling and parameterized SQL queries.
- **Environment Management:** `dotenv` (v16.4.5) - Loads environment configurations securely from a `.env` file.
- **Cross-Origin Handling:** `cors` (v2.8.5) - Permits API accessibility across cross-origin requests.
- **Development Tool:** `nodemon` (v3.1.0) - Automatically restarts the server during development on file changes.

### Database
- **Database Engine:** MySQL Server (v8.0+) / MariaDB via XAMPP.

### Frontend
- **Markup & Styling:** HTML5, CSS3, Bootstrap 5.3 (CDN), Bootstrap Icons.
- **Client Logic:** Vanilla JavaScript (ES6+) utilizing asynchronous `async/await` Fetch API calls.

### API Testing & Version Control
- **API Client:** Postman (Exported Collection v2.1)
- **Version Control:** Git & GitHub

---

## 🗄️ Database Schema (`research_db`)

The database consists of a table named `research_opportunities` designed with proper constraints and data types:

### Table Structure: `research_opportunities`

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY AUTO_INCREMENT` | Unique identifier for each opportunity |
| `title` | `VARCHAR(255)` | `NOT NULL` | Research title/topic |
| `description` | `TEXT` | `NOT NULL` | Comprehensive project description |
| `research_area` | `VARCHAR(100)` | `NOT NULL` | Subject domain (e.g., AI, Robotics) |
| `faculty_name` | `VARCHAR(100)` | `NOT NULL` | Name of supervising professor |
| `department` | `VARCHAR(100)` | `NOT NULL` | Academic department name |
| `required_skills` | `TEXT` | `NOT NULL` | Required prerequisites or programming skills |
| `available_positions` | `INT` | `NOT NULL DEFAULT 1` | Number of open student slots |
| `application_deadline` | `DATE` | `NOT NULL` | Closing date for applications |
| `status` | `ENUM('Open', 'Closed')` | `NOT NULL DEFAULT 'Open'` | Current availability status |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | System timestamp of record creation |

---

## 📡 REST API Documentation

The backend REST API provides 5 primary CRUD endpoints under the `/api/opportunities` namespace.

### Summary of Endpoints

| Method | Endpoint Route | Request Body | Success Status | Description |
| :---: | :--- | :--- | :---: | :--- |
| **POST** | `/api/opportunities` | JSON (All required fields) | `201 Created` | Create and store a new research posting |
| **GET** | `/api/opportunities` | None | `200 OK` | Fetch all research opportunities |
| **GET** | `/api/opportunities/:id` | None | `200 OK` | Fetch details of a specific opportunity by ID |
| **PUT** | `/api/opportunities/:id` | JSON (Fields to update) | `200 OK` | Update opportunity details or toggle status |
| **DELETE** | `/api/opportunities/:id` | None | `200 OK` | Delete an opportunity from the database |

---

### Detailed Request / Response Specifications

#### 1. Create a Research Opportunity
- **Route:** `POST /api/opportunities`
- **Headers:** `Content-Type: application/json`
- **Request Body Example:**
  ```json
  {
    "title": "Autonomous Drone Navigation",
    "description": "Researching SLAM algorithms for GPS-denied quadcopter navigation.",
    "research_area": "Robotics",
    "faculty_name": "Dr. Nikola Tesla",
    "department": "Electrical Engineering",
    "required_skills": "ROS, C++, Python, Computer Vision",
    "available_positions": 3,
    "application_deadline": "2026-11-30",
    "status": "Open"
  }