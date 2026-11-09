# Book Management REST API

> **Elevate Labs – Web Development Internship**  
> **Task 3:** Create a REST API to Manage a List of Books Using Node.js and Express.

---

## 📌 Project Overview

The **Book Management REST API** is a clean, modular, and production-ready backend service designed for managing a catalog of books. Built strictly with **Node.js** and **Express.js**, the application provides full **CRUD** (Create, Read, Update, Delete) capabilities over HTTP, backed by an in-memory JavaScript data store.

This project adheres to professional software engineering standards, including controller-route separation, middleware-based request parsing, defensive input validation, centralized error handling, and a complete automated Postman QA test suite.

---

## 🚀 Key Features

- **Full RESTful CRUD Operations**:
  - `GET /books`: Retrieve the collection of books.
  - `POST /books`: Add a new book with auto-generated unique identifier.
  - `PUT /books/:id`: Update existing book details by ID.
  - `DELETE /books/:id`: Remove a book from the system by ID.
- **Robust Input Validation**: Validates existence, types, and non-empty string constraints for required parameters (`title`, `author`, numeric `id`).
- **Defensive Error Handling**:
  - Gracefully intercepts and reports malformed JSON payloads.
  - Handles unmatched routes with informative 404 responses.
  - Centralized error-handling middleware preventing server crashes.
- **Zero Heavy Dependencies**: Pure Node.js and Express without database overhead or external paid dependencies.
- **Automated Postman Collection**: Importable collection containing end-to-end integration tests, schema verifications, and edge cases.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **Node.js** (v18+) | JavaScript runtime environment |
| **Express.js** (v4.x) | Fast, unopinionated minimalist web framework |
| **JavaScript (CommonJS)** | Core programming language (`require` / `module.exports`) |
| **REST & JSON** | Architectural style and standard data exchange format |
| **Express Middleware** | Body parser (`express.json()`) & custom error interception |
| **In-Memory Array** | Fast, zero-config RAM storage for book items |
| **Postman** | API exploration, documentation, and automated test assertion |
| **VS Code** | Recommended IDE for development and debugging |

---

## 📂 Project Structure

```text
book-management-api/
│
├── src/
│   ├── server.js               # Application entry point & middleware mounting
│   ├── routes/
│   │   └── bookRoutes.js       # Express router definitions for /books
│   ├── controllers/
│   │   └── bookController.js   # Request handling, input validation & business logic
│   ├── data/
│   │   └── books.js            # In-memory array initialized with seed books
│   └── middleware/
│       └── errorHandler.js     # 404 route catcher & centralized error handler
│
├── postman/
│   └── BOOK_API_Postman_Collection.json   # Full Postman collection with tests
│
├── package.json                # Project dependencies and npm scripts
├── .gitignore                  # Git ignore rules for node_modules and logs
└── README.md                   # Comprehensive technical documentation
```

---

## 💾 In-Memory Storage Explanation

This API stores all book records inside an in-memory JavaScript array located in `src/data/books.js`.

> ⚠️ **Important Persistence Note**:  
> Because data lives exclusively in RAM:
> - Any book additions (`POST`), modifications (`PUT`), or removals (`DELETE`) are stored during the active server runtime.
> - **Whenever the Node.js server process restarts or stops**, the memory is cleared and re-initialized back to the original seed data.
> - This conforms strictly to the internship requirements (no MongoDB or SQL database setup required).

---

## 💻 Installation & Setup Guide

### Prerequisites
- **Node.js** (Version 18.0.0 or higher recommended). Download from [nodejs.org](https://nodejs.org/).
- **npm** (Bundled with Node.js).
- **Postman** (Desktop application or Web client). Download from [postman.com](https://www.postman.com/).

### 1. Clone or Extract the Project
Open your terminal (PowerShell, Command Prompt, or Git Bash) and navigate to the project directory:

```bash
cd book-management-api
```

### 2. Install Dependencies
Run npm install to fetch Express and Nodemon:

```bash
npm install
```

---

## 🖥️ How to Run on Windows 11

You can launch the server using either **PowerShell**, **Windows Terminal**, or **Command Prompt**:

### Option A: Standard Production Mode
```bash
npm start
```
*Executes `node src/server.js`.*

### Option B: Development Mode (Auto-Restart on Edit)
```bash
npm run dev
```
*Executes `nodemon src/server.js` which automatically reloads the server whenever code is saved.*

Upon successful launch, you will see:
```text
====================================================
  Elevate Labs - Book Management REST API is Running 
  Server Port    : http://localhost:3000
  Books Endpoint : http://localhost:3000/books
====================================================
```

Verify the server is running by opening `http://localhost:3000/` in your browser.

---

## 📡 API Endpoints & Usage

### Base URL
```text
http://localhost:3000
```

---

### 1. Get All Books
- **Method**: `GET`
- **Endpoint**: `/books`
- **Description**: Returns an array of all books currently stored in memory.
- **Headers**: None required (`Accept: application/json` recommended)
- **Response Status**: `200 OK`

**Example Response:**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": 1,
      "title": "The Alchemist",
      "author": "Paulo Coelho"
    },
    {
      "id": 2,
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee"
    },
    {
      "id": 3,
      "title": "1984",
      "author": "George Orwell"
    },
    {
      "id": 4,
      "title": "Clean Code",
      "author": "Robert C. Martin"
    }
  ]
}
```

---

### 2. Add New Book
- **Method**: `POST`
- **Endpoint**: `/books`
- **Description**: Creates a new book and appends it to the in-memory array with an auto-incremented unique ID.
- **Headers**: `Content-Type: application/json`
- **Response Status**: `201 Created`

**Request Body:**
```json
{
  "title": "Atomic Habits",
  "author": "James Clear"
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Book created successfully.",
  "data": {
    "id": 5,
    "title": "Atomic Habits",
    "author": "James Clear"
  }
}
```

**Validation Error Response (`400 Bad Request`):**
```json
{
  "success": false,
  "error": "Validation Error: \"author\" is required and must be a non-empty string."
}
```

---

### 3. Update Existing Book
- **Method**: `PUT`
- **Endpoint**: `/books/:id`
- **Description**: Updates the `title` and `author` of the specified book ID.
- **Headers**: `Content-Type: application/json`
- **Response Status**: `200 OK`

**Request Body:**
```json
{
  "title": "The Alchemist - 25th Anniversary Edition",
  "author": "Paulo Coelho"
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Book with ID 1 updated successfully.",
  "data": {
    "id": 1,
    "title": "The Alchemist - 25th Anniversary Edition",
    "author": "Paulo Coelho"
  }
}
```

**Not Found Response (`404 Not Found`):**
```json
{
  "success": false,
  "error": "Book Not Found: No book exists with ID 999."
}
```

---

### 4. Delete a Book
- **Method**: `DELETE`
- **Endpoint**: `/books/:id`
- **Description**: Removes the book matching the given ID from memory.
- **Response Status**: `200 OK`

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Book with ID 1 deleted successfully.",
  "data": {
    "id": 1,
    "title": "The Alchemist",
    "author": "Paulo Coelho"
  }
}
```

**Not Found Response (`404 Not Found`):**
```json
{
  "success": false,
  "error": "Book Not Found: No book exists with ID 999."
}
```

---

## 🚦 HTTP Status Codes Reference

| Status Code | Meaning | When It Is Used in This Project |
|---|---|---|
| **`200 OK`** | Request succeeded | `GET /books`, `PUT /books/:id`, `DELETE /books/:id` |
| **`201 Created`** | Resource successfully created | `POST /books` |
| **`400 Bad Request`** | Client input failed validation or malformed JSON | Missing `title`/`author`, non-numeric ID, invalid JSON |
| **`404 Not Found`** | Resource or route does not exist | Book ID does not exist, or unmatched endpoint route |
| **`500 Internal Server Error`** | Unhandled server exception | Caught by centralized error middleware |

---

## 🧪 Postman Testing Instructions

1. **Launch Postman**.
2. Click the **Import** button in the top left workspace corner.
3. Drag & drop or browse to:
   `book-management-api/postman/BOOK_API_Postman_Collection.json`
4. The collection **"Elevate Labs - Book Management REST API"** will appear in your sidebar.
5. Ensure your server is running on `http://localhost:3000`.
6. Open the collection options and click **Run collection** to run all test scripts sequentially.
7. Verify that all automated assertions (status 200, 201, schema validations, 400/404 negative tests) pass green!

---

## 🔧 Common Troubleshooting Steps

| Issue | Cause | Solution |
|---|---|---|
| `Error: listen EADDRINUSE: address already in use :::3000` | Another process is occupying port 3000 | Kill process: In Windows PowerShell run `Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force` or change port in `server.js` |
| `Cannot find module 'express'` | Dependencies not yet installed | Run `npm install` inside `book-management-api/` |
| `SyntaxError: Unexpected token ... in JSON at position ...` | Client sent malformed JSON | Check your request body in Postman for missing commas or unclosed quotation marks |
| `Cannot GET /book` | Typo in endpoint URI (singular instead of plural) | The endpoint is `/books` (plural), as per REST conventions |
| Data disappeared after server restart | Server restarted | Expected behavior for in-memory storage. Seed data is restored on each boot |

---

## 👨‍💻 Author

- **Intern Name**: Asif Shah Khan
- **Internship Program**: Elevate Labs Web Development Internship
- **Task Number**: Task 3 – Node.js & Express REST API
- **GitHub**: [github.com/asifshahkhan](https://github.com/asifshahkhan)
