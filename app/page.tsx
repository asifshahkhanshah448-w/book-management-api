'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Send,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit3,
  Plus,
  RefreshCw,
  Download,
  Copy,
  Check,
  FileCode,
  Folder,
  Layers,
  Cpu,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Server,
  Code2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
}

// Complete source files for the standalone book-management-api project
const projectFiles: { [filename: string]: { path: string; language: string; content: string } } = {
  'server.js': {
    path: 'book-management-api/src/server.js',
    language: 'javascript',
    content: `/**
 * Elevate Labs - Web Development Internship
 * Task 3: Book Management REST API
 * 
 * Main Server Entry Point
 */

const express = require('express');
const bookRoutes = require('./routes/bookRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Built-in middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next();
});

// Root welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'Book Management REST API',
    internship: 'Elevate Labs - Web Development Internship',
    task: 'Task 3 - REST API to Manage a List of Books',
    status: 'ONLINE',
    port: PORT,
    endpoints: {
      getAllBooks: 'GET /books',
      createBook: 'POST /books',
      updateBook: 'PUT /books/:id',
      deleteBook: 'DELETE /books/:id'
    }
  });
});

// Mount book routes at /books
app.use('/books', bookRoutes);

// 404 handler for unknown routes
app.use(notFoundHandler);

// Centralized error handling middleware
app.use(errorHandler);

// Start server listening
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('====================================================');
    console.log(\`  Elevate Labs - Book Management REST API is Running \`);
    console.log(\`  Server Port    : http://localhost:\${PORT}\`);
    console.log(\`  Books Endpoint : http://localhost:\${PORT}/books\`);
    console.log('====================================================');
  });
}

module.exports = app;`
  },
  'bookRoutes.js': {
    path: 'book-management-api/src/routes/bookRoutes.js',
    language: 'javascript',
    content: `/**
 * Book Routes
 * Express router mapping RESTful HTTP verbs to controller actions.
 */

const express = require('express');
const router = express.Router();

const {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

// GET /books - Retrieve all books
// POST /books - Create a new book
router.route('/')
  .get(getAllBooks)
  .post(createBook);

// PUT /books/:id - Update an existing book by ID
// DELETE /books/:id - Delete a book by ID
router.route('/:id')
  .put(updateBook)
  .delete(deleteBook);

module.exports = router;`
  },
  'bookController.js': {
    path: 'book-management-api/src/controllers/bookController.js',
    language: 'javascript',
    content: `/**
 * Book Controller
 * Handles business logic and request/response lifecycle for Book operations.
 */

const books = require('../data/books');

// GET /books - Fetch all books
const getAllBooks = (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// POST /books - Create a new book
const createBook = (req, res, next) => {
  try {
    const { title, author } = req.body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: "title" is required and must be a non-empty string.'
      });
    }

    if (!author || typeof author !== 'string' || author.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: "author" is required and must be a non-empty string.'
      });
    }

    // Generate unique ID (max ID + 1)
    const newId = books.length > 0 ? Math.max(...books.map(b => Number(b.id) || 0)) + 1 : 1;

    const newBook = {
      id: newId,
      title: title.trim(),
      author: author.trim()
    };

    books.push(newBook);

    return res.status(201).json({
      success: true,
      message: 'Book created successfully.',
      data: newBook
    });
  } catch (error) {
    next(error);
  }
};

// PUT /books/:id - Update an existing book
const updateBook = (req, res, next) => {
  try {
    const bookId = parseInt(req.params.id, 10);

    if (isNaN(bookId) || bookId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Invalid book ID format. ID must be a positive integer.'
      });
    }

    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
      return res.status(404).json({
        success: false,
        error: \`Book Not Found: No book exists with ID \${bookId}.\`
      });
    }

    const { title, author } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: "title" is required and must be a non-empty string.'
      });
    }

    if (!author || typeof author !== 'string' || author.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: "author" is required and must be a non-empty string.'
      });
    }

    books[bookIndex] = {
      id: bookId,
      title: title.trim(),
      author: author.trim()
    };

    return res.status(200).json({
      success: true,
      message: \`Book with ID \${bookId} updated successfully.\`,
      data: books[bookIndex]
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /books/:id - Delete a book by ID
const deleteBook = (req, res, next) => {
  try {
    const bookId = parseInt(req.params.id, 10);

    if (isNaN(bookId) || bookId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Invalid book ID format. ID must be a positive integer.'
      });
    }

    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
      return res.status(404).json({
        success: false,
        error: \`Book Not Found: No book exists with ID \${bookId}.\`
      });
    }

    const [deletedBook] = books.splice(bookIndex, 1);

    return res.status(200).json({
      success: true,
      message: \`Book with ID \${bookId} deleted successfully.\`,
      data: deletedBook
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook
};`
  },
  'books.js': {
    path: 'book-management-api/src/data/books.js',
    language: 'javascript',
    content: `/**
 * In-Memory Data Store for Books
 * 
 * NOTE: Data is stored strictly in memory (RAM).
 * Any changes will reset when the Node.js server process restarts.
 */

const books = [
  {
    id: 1,
    title: "The Alchemist",
    author: "Paulo Coelho"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell"
  },
  {
    id: 4,
    title: "Clean Code",
    author: "Robert C. Martin"
  }
];

module.exports = books;`
  },
  'errorHandler.js': {
    path: 'book-management-api/src/middleware/errorHandler.js',
    language: 'javascript',
    content: `/**
 * Error Handling Middleware
 */

// Catch-all 404 for undefined routes
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: \`Cannot \${req.method} \${req.originalUrl} - Route Not Found\`
  });
};

// Centralized error handling middleware (requires 4 arguments)
const errorHandler = (err, req, res, next) => {
  // Handle invalid/malformed JSON syntax from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Malformed JSON payload: Please verify that your JSON syntax is valid.'
    });
  }

  console.error('[SERVER ERROR]:', err.stack || err.message || err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  return res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};`
  },
  'package.json': {
    path: 'book-management-api/package.json',
    language: 'json',
    content: `{
  "name": "book-management-api",
  "version": "1.0.0",
  "description": "Elevate Labs Web Development Internship - Task 3: REST API to Manage a List of Books Using Node.js and Express",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "keywords": [
    "nodejs",
    "express",
    "rest-api",
    "crud",
    "in-memory",
    "elevate-labs"
  ],
  "author": "Asif Shah Khan",
  "license": "ISC",
  "dependencies": {
    "express": "^4.21.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}`
  },
  'BOOK_API_Postman_Collection.json': {
    path: 'book-management-api/postman/BOOK_API_Postman_Collection.json',
    language: 'json',
    content: `{
  "info": {
    "_postman_id": "a98dfb32-8e12-4299-9134-8c812c3f8901",
    "name": "Elevate Labs - Book Management REST API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    }
  ],
  "item": [
    {
      "name": "1. GET All Books",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/books"
      }
    },
    {
      "name": "2. POST Add New Book",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\\n  \\"title\\": \\"Atomic Habits\\",\\n  \\"author\\": \\"James Clear\\"\\n}"
        },
        "url": "{{baseUrl}}/books"
      }
    },
    {
      "name": "3. PUT Update Book",
      "request": {
        "method": "PUT",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\\n  \\"title\\": \\"The Alchemist - 25th Anniversary Edition\\",\\n  \\"author\\": \\"Paulo Coelho\\"\\n}"
        },
        "url": "{{baseUrl}}/books/1"
      }
    },
    {
      "name": "4. DELETE Book",
      "request": {
        "method": "DELETE",
        "url": "{{baseUrl}}/books/1"
      }
    }
  ]
}`
  },
  'README.md': {
    path: 'book-management-api/README.md',
    language: 'markdown',
    content: `# Book Management REST API

> Elevate Labs – Web Development Internship  
> Task 3: Create a REST API to Manage a List of Books Using Node.js and Express.

## Features
- Full CRUD: GET, POST, PUT, DELETE /books
- In-memory data store with 4 initial sample books
- Strict validation for required fields
- Centralized error handler and 404 handler
- Automated Postman test collection

## How to Run on Windows 11
1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Run server:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Server runs on http://localhost:3000`
  }
};

const interviewQuestionsData = [
  {
    category: 'Node.js & Concurrency',
    q: 'How does Node.js handle concurrency if JavaScript execution is single-threaded?',
    a: 'Node.js uses an event-driven, non-blocking I/O model powered by the Libuv library and the Event Loop. While user JavaScript runs on a single thread (call stack), all asynchronous operations (file system, network I/O, timers) are delegated to the OS kernel or Libuv worker threads. When background I/O completes, its callback is enqueued into the event loop. This allows thousands of simultaneous connections without thread contention.'
  },
  {
    category: 'Node.js & Concurrency',
    q: 'Why did we use CommonJS (require/module.exports) for this project?',
    a: 'CommonJS is the native, reliable module format supported across all Node.js LTS versions without requiring extra transpilers, Babel, or experimental flags. It satisfies the strict internship requirement for standard Node.js/Express architecture.'
  },
  {
    category: 'REST Architecture',
    q: 'What is the core distinction between PUT and POST in REST API design?',
    a: 'POST is non-idempotent and used to create a new resource. Calling POST /books multiple times creates multiple distinct books with unique IDs. PUT is idempotent and used to replace/update a resource at a known URI (e.g., PUT /books/1). Calling PUT /books/1 multiple times with the same payload results in the exact same server state.'
  },
  {
    category: 'REST Architecture',
    q: 'What makes an API "Stateless" in REST design?',
    a: 'Statelessness means that every incoming HTTP request must contain all the information necessary for the server to understand and process it. The server stores no client session context in memory between requests. This allows any server instance in a cluster to handle any request independently, maximizing horizontal scalability.'
  },
  {
    category: 'Express & Middleware',
    q: 'How does Express middleware work and what happens if next() is omitted?',
    a: 'Middleware functions have sequential access to the request object (req), response object (res), and the next() callback. Each middleware can inspect or mutate req/res, terminate the request cycle with res.json(), or invoke next() to pass execution to the subsequent handler. If a middleware neither sends a response nor calls next(), the request hangs until the client or server times out.'
  },
  {
    category: 'Express & Middleware',
    q: 'Why does error-handling middleware in Express require exactly 4 parameters (err, req, res, next)?',
    a: 'Express checks the function length property (the number of declared parameters in the signature). Standard middleware has 2 or 3 parameters. Express will only identify and invoke a function as an error handler when an error is passed to next(err) if the handler explicitly declares 4 parameters: (err, req, res, next).'
  },
  {
    category: 'Status Codes & Errors',
    q: 'When and why do we return HTTP 201 vs 200?',
    a: 'HTTP 200 OK signals that the request succeeded and returns existing or modified state. HTTP 201 Created is the specific REST standard for successful POST requests where a brand-new resource was created and allocated an identifier. It informs clients that a permanent new entity now exists.'
  },
  {
    category: 'Data Storage',
    q: 'What are the architectural trade-offs of using an in-memory array vs an external database?',
    a: 'In-memory storage delivers near-instant read/write speeds with zero network overhead and zero installation dependencies. However, it is volatile (all data is lost when the Node.js process terminates or restarts), limited by available RAM, and cannot be shared across multiple server instances. In production, persistent databases like PostgreSQL or MongoDB provide durability, ACID compliance, and multi-node clustering.'
  }
];

export default function BookApiDashboard() {
  const [activeTab, setActiveTab] = useState<'tester' | 'code' | 'postman' | 'qa' | 'docs'>('tester');
  const [selectedFile, setSelectedFile] = useState<string>('server.js');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live tester state
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [endpoint, setEndpoint] = useState<string>('/books');
  const [requestBody, setRequestBody] = useState<string>(
    JSON.stringify({ title: 'Atomic Habits', author: 'James Clear' }, null, 2)
  );
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseStatusText, setResponseStatusText] = useState<string>('');
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseBody, setResponseBody] = useState<any>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Live data table state
  const [booksList, setBooksList] = useState<Book[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [editBookId, setEditBookId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editAuthor, setEditAuthor] = useState<string>('');

  // Fetch live books on load
  const fetchCurrentBooks = async () => {
    setTableLoading(true);
    try {
      const res = await fetch('/books');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setBooksList(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch books:', err);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetch('/books')
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.success && Array.isArray(data.data)) {
          setBooksList(data.data);
        }
      })
      .catch((err) => console.error('Failed to fetch books:', err));
    return () => {
      ignore = true;
    };
  }, []);

  // Execute request in the Live Tester
  const handleSendRequest = async () => {
    setIsLoading(true);
    setResponseStatus(null);
    setResponseBody(null);

    const startTime = performance.now();

    try {
      const options: RequestInit = {
        method,
        headers: {
          Accept: 'application/json',
          ...(method === 'POST' || method === 'PUT' ? { 'Content-Type': 'application/json' } : {})
        }
      };

      if ((method === 'POST' || method === 'PUT') && requestBody.trim()) {
        options.body = requestBody;
      }

      const res = await fetch(endpoint, options);
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(res.status);
      setResponseStatusText(res.statusText || (res.status === 200 ? 'OK' : res.status === 201 ? 'Created' : res.status === 400 ? 'Bad Request' : res.status === 404 ? 'Not Found' : ''));

      // Headers extraction
      const headersMap: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        headersMap[key] = value;
      });
      setResponseHeaders(headersMap);

      const json = await res.json();
      setResponseBody(json);

      // Refresh table if mutated
      if (method !== 'GET') {
        fetchCurrentBooks();
      }
    } catch (error: any) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(500);
      setResponseStatusText('Network/Client Error');
      setResponseBody({ success: false, error: error.message || 'Request failed' });
    } finally {
      setIsLoading(false);
    }
  };

  // Quick preset loader
  const loadPreset = (
    m: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    body?: object
  ) => {
    setMethod(m);
    setEndpoint(url);
    if (body) {
      setRequestBody(JSON.stringify(body, null, 2));
    }
  };

  // Reset in-memory database
  const handleResetData = async () => {
    try {
      const res = await fetch('/books/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchCurrentBooks();
        loadPreset('GET', '/books');
        handleSendRequest();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Banner / Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Book Management REST API
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Port 3000 Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Elevate Labs Web Development Internship • Task 3
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetData}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Reset in-memory storage to initial 4 sample books"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset RAM Data
            </button>
            <button
              onClick={() => {
                const content = projectFiles['BOOK_API_Postman_Collection.json'].content;
                downloadFile('BOOK_API_Postman_Collection.json', content);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow shadow-indigo-600/30 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Postman JSON
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto border-t border-slate-800/80 scrollbar-none">
          <nav className="flex space-x-2 py-2">
            {[
              { id: 'tester', label: 'Interactive Live Tester', icon: Terminal },
              { id: 'code', label: 'Source Code & Project Files', icon: FileCode },
              { id: 'postman', label: 'Postman Test Suite', icon: Send },
              { id: 'qa', label: 'Technical Interview Q&A', icon: HelpCircle },
              { id: 'docs', label: 'Architecture & Endpoints', icon: Layers }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* TAB 1: INTERACTIVE LIVE TESTER */}
        {activeTab === 'tester' && (
          <div className="space-y-6">
            {/* Quick Presets Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Quick Endpoint Presets (1-Click Run)
                </span>
                <span className="text-xs text-slate-500">
                  Click any preset below to populate and trigger the request
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                <button
                  onClick={() => {
                    loadPreset('GET', '/books');
                    setTimeout(handleSendRequest, 50);
                  }}
                  className="px-2.5 py-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-left transition"
                >
                  <div className="text-[11px] font-bold text-emerald-400">GET /books</div>
                  <div className="text-[10px] text-slate-400 truncate">Fetch all books</div>
                </button>

                <button
                  onClick={() => {
                    loadPreset('POST', '/books', { title: 'Atomic Habits', author: 'James Clear' });
                    setTimeout(handleSendRequest, 50);
                  }}
                  className="px-2.5 py-2 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/50 text-left transition"
                >
                  <div className="text-[11px] font-bold text-indigo-400">POST /books</div>
                  <div className="text-[10px] text-slate-400 truncate">Add new book</div>
                </button>

                <button
                  onClick={() => {
                    loadPreset('PUT', '/books/1', {
                      title: 'The Alchemist - Special Edition',
                      author: 'Paulo Coelho'
                    });
                    setTimeout(handleSendRequest, 50);
                  }}
                  className="px-2.5 py-2 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/50 text-left transition"
                >
                  <div className="text-[11px] font-bold text-amber-400">PUT /books/1</div>
                  <div className="text-[10px] text-slate-400 truncate">Update book ID 1</div>
                </button>

                <button
                  onClick={() => {
                    loadPreset('DELETE', '/books/1');
                    setTimeout(handleSendRequest, 50);
                  }}
                  className="px-2.5 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-left transition"
                >
                  <div className="text-[11px] font-bold text-rose-400">DELETE /books/1</div>
                  <div className="text-[10px] text-slate-400 truncate">Delete book ID 1</div>
                </button>

                <button
                  onClick={() => {
                    loadPreset('POST', '/books', { title: 'Missing Author Book' });
                    setTimeout(handleSendRequest, 50);
                  }}
                  className="px-2.5 py-2 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/50 text-left transition"
                >
                  <div className="text-[11px] font-bold text-purple-400">400 Bad Request</div>
                  <div className="text-[10px] text-slate-400 truncate">Test missing field</div>
                </button>

                <button
                  onClick={() => {
                    loadPreset('PUT', '/books/9999', { title: 'Not Exists', author: 'Ghost' });
                    setTimeout(handleSendRequest, 50);
                  }}
                  className="px-2.5 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-left transition"
                >
                  <div className="text-[11px] font-bold text-orange-400">404 Not Found</div>
                  <div className="text-[10px] text-slate-400 truncate">Test invalid ID</div>
                </button>
              </div>
            </div>

            {/* Request & Response Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Request Builder Box */}
              <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-sm font-semibold text-white">HTTP Request Builder</h2>
                  </div>
                  <span className="text-xs text-slate-400">Target: Port 3000 / Next & Express</span>
                </div>

                {/* Method & URL Input Bar */}
                <div className="flex gap-2">
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    aria-label="HTTP Method"
                    className={`font-mono text-xs font-bold px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                      method === 'GET'
                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60'
                        : method === 'POST'
                        ? 'bg-indigo-950/70 text-indigo-300 border-indigo-700/60'
                        : method === 'PUT'
                        ? 'bg-amber-950/70 text-amber-300 border-amber-700/60'
                        : 'bg-rose-950/70 text-rose-300 border-rose-700/60'
                    }`}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>

                  <input
                    type="text"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    placeholder="/books"
                    aria-label="API Endpoint Path"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <button
                    onClick={handleSendRequest}
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    Send
                  </button>
                </div>

                {/* Request Body (For POST & PUT) */}
                {(method === 'POST' || method === 'PUT') && (
                  <div className="space-y-2 flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-400">
                        JSON Request Body (`req.body`)
                      </label>
                      <button
                        onClick={() =>
                          setRequestBody(
                            JSON.stringify(
                              {
                                title: method === 'POST' ? 'The Hobbit' : 'Updated Title',
                                author: method === 'POST' ? 'J.R.R. Tolkien' : 'Updated Author'
                              },
                              null,
                              2
                            )
                          )
                        }
                        className="text-[11px] text-indigo-400 hover:text-indigo-300"
                      >
                        Reset Template
                      </button>
                    </div>
                    <textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      rows={6}
                      aria-label="JSON Request Body"
                      className="w-full flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      spellCheck={false}
                    />
                  </div>
                )}

                {/* Explanatory notes */}
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1 text-slate-300 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    Input Validation Rules:
                  </div>
                  <p>• `title`: required, non-empty trimmed string</p>
                  <p>• `author`: required, non-empty trimmed string</p>
                  <p>• `:id`: positive integer (for PUT & DELETE)</p>
                </div>
              </div>

              {/* Response Viewer Box */}
              <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-sm font-semibold text-white">Live HTTP Response</h2>
                  </div>

                  {responseStatus !== null && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                          responseStatus >= 200 && responseStatus < 300
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : responseStatus >= 400 && responseStatus < 500
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {responseStatus} {responseStatusText}
                      </span>
                      {responseTime !== null && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {responseTime} ms
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Response Body Output */}
                <div className="flex-1 flex flex-col min-h-[260px]">
                  {responseBody !== null ? (
                    <div className="relative flex-1 flex flex-col bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/60 border-b border-slate-800/80 text-[11px] text-slate-400">
                        <span>Content-Type: application/json</span>
                        <button
                          onClick={() =>
                            copyToClipboard(JSON.stringify(responseBody, null, 2), 'response')
                          }
                          className="flex items-center gap-1 hover:text-white transition"
                        >
                          {copiedKey === 'response' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy JSON</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3.5 text-xs font-mono text-emerald-300 overflow-auto flex-1 max-h-[340px]">
                        {JSON.stringify(responseBody, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs text-center">
                      <Send className="w-8 h-8 mb-2 text-slate-600 opacity-60" />
                      <p>No request sent yet.</p>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Select an endpoint above or click Send to execute against the active server.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Current In-Memory Books Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-violet-400" />
                  <h3 className="text-sm font-semibold text-white">
                    Live In-Memory Array State (`src/data/books.js`)
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    RAM Volatile
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    Total Books: <strong className="text-white">{booksList.length}</strong>
                  </span>
                  <button
                    onClick={fetchCurrentBooks}
                    disabled={tableLoading}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Refresh array"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${tableLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3 w-16">ID</th>
                      <th className="py-2.5 px-3">Title</th>
                      <th className="py-2.5 px-3">Author</th>
                      <th className="py-2.5 px-3 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {booksList.length > 0 ? (
                      booksList.map((book) => (
                        <tr key={book.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-2.5 px-3 font-mono font-bold text-indigo-400">
                            #{book.id}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-white">
                            {editBookId === book.id ? (
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="bg-slate-950 border border-indigo-500 rounded px-2 py-1 text-xs text-white w-full"
                              />
                            ) : (
                              book.title
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">
                            {editBookId === book.id ? (
                              <input
                                type="text"
                                value={editAuthor}
                                onChange={(e) => setEditAuthor(e.target.value)}
                                className="bg-slate-950 border border-indigo-500 rounded px-2 py-1 text-xs text-white w-full"
                              />
                            ) : (
                              book.author
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right space-x-2">
                            {editBookId === book.id ? (
                              <>
                                <button
                                  onClick={async () => {
                                    loadPreset('PUT', `/books/${book.id}`, {
                                      title: editTitle,
                                      author: editAuthor
                                    });
                                    setEditBookId(null);
                                    await handleSendRequest();
                                  }}
                                  className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px]"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditBookId(null)}
                                  className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-[11px]"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditBookId(book.id);
                                    setEditTitle(book.title);
                                    setEditAuthor(book.author);
                                    loadPreset('PUT', `/books/${book.id}`, {
                                      title: book.title,
                                      author: book.author
                                    });
                                  }}
                                  className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition"
                                  title="Edit via PUT"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={async () => {
                                    loadPreset('DELETE', `/books/${book.id}`);
                                    await handleSendRequest();
                                  }}
                                  className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition"
                                  title="Delete via DELETE"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-slate-500 italic">
                          No books found in memory. Use POST /books to add records or click &quot;Reset RAM Data&quot;.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPLETE SOURCE CODE & PROJECT FILES */}
        {activeTab === 'code' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[580px]">
            {/* Sidebar / File Tree */}
            <div className="w-full md:w-64 bg-slate-950/90 border-b md:border-b-0 md:border-r border-slate-800 p-4 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Folder className="w-4 h-4 text-amber-400" />
                <span>book-management-api/</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-[11px] font-semibold text-slate-500 uppercase px-2 pt-1">
                  Source (`src/`)
                </div>
                {['server.js', 'bookRoutes.js', 'bookController.js', 'books.js', 'errorHandler.js'].map(
                  (file) => (
                    <button
                      key={file}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition font-mono ${
                        selectedFile === file
                          ? 'bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>{file}</span>
                    </button>
                  )
                )}

                <div className="text-[11px] font-semibold text-slate-500 uppercase px-2 pt-3">
                  Config & Docs
                </div>
                {['package.json', 'BOOK_API_Postman_Collection.json', 'README.md'].map((file) => (
                  <button
                    key={file}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition font-mono text-[11px] ${
                      selectedFile === file
                        ? 'bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span className="truncate">{file}</span>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <div className="text-[11px] text-slate-500 space-y-1">
                  <p>• Clean Architecture</p>
                  <p>• Controller/Route split</p>
                  <p>• Zero heavy dependencies</p>
                </div>
              </div>
            </div>

            {/* Code Content Viewer */}
            <div className="flex-1 flex flex-col bg-slate-950">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-400" />
                  <span className="font-mono text-xs font-semibold text-white">
                    {projectFiles[selectedFile]?.path}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      copyToClipboard(projectFiles[selectedFile].content, selectedFile)
                    }
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    {copiedKey === selectedFile ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() =>
                      downloadFile(selectedFile, projectFiles[selectedFile].content)
                    }
                    className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <div className="p-4 flex-1 overflow-auto max-h-[620px]">
                <pre className="font-mono text-xs text-slate-200 leading-relaxed">
                  <code>{projectFiles[selectedFile]?.content}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: POSTMAN TEST SUITE */}
        {activeTab === 'postman' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Send className="w-5 h-5 text-indigo-400" />
                    Automated Postman Collection
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Pre-configured collection with HTTP endpoints, assertions, test scripts, and edge cases.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        projectFiles['BOOK_API_Postman_Collection.json'].content,
                        'postman_json'
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    {copiedKey === 'postman_json' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">JSON Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Postman JSON</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() =>
                      downloadFile(
                        'BOOK_API_Postman_Collection.json',
                        projectFiles['BOOK_API_Postman_Collection.json'].content
                      )
                    }
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Collection (.json)</span>
                  </button>
                </div>
              </div>

              {/* Instructions steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="text-xs font-bold text-white">Import Collection</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Open Postman, click <strong>Import</strong> in the top left, and select the downloaded <code>BOOK_API_Postman_Collection.json</code>.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="text-xs font-bold text-white">Verify Variable</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ensure the collection variable <code>baseUrl</code> is set to <code>http://localhost:3000</code>.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="text-xs font-bold text-white">Run Collection</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Click <strong>Run collection</strong> in Postman to execute all automated test scripts and view the 100% green test assertions.
                  </p>
                </div>
              </div>

              {/* Automated Tests Table */}
              <div className="pt-2">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Included Automated Tests & Assertions
                </h3>
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
                  {[
                    {
                      num: '1',
                      name: 'GET All Books',
                      method: 'GET',
                      url: '/books',
                      expectedStatus: '200 OK',
                      tests: 'pm.response.to.have.status(200); validates success: true; checks that data is an Array and items have id, title, author'
                    },
                    {
                      num: '2',
                      name: 'POST Add New Book',
                      method: 'POST',
                      url: '/books',
                      expectedStatus: '201 Created',
                      tests: 'pm.response.to.have.status(201); asserts id was assigned; sets pm.collectionVariables.set("createdBookId", id)'
                    },
                    {
                      num: '3',
                      name: 'PUT Update Book',
                      method: 'PUT',
                      url: '/books/1',
                      expectedStatus: '200 OK',
                      tests: 'pm.response.to.have.status(200); verifies updated title and author properties match payload'
                    },
                    {
                      num: '4',
                      name: 'DELETE Book',
                      method: 'DELETE',
                      url: '/books/1',
                      expectedStatus: '200 OK',
                      tests: 'pm.response.to.have.status(200); confirms deletion message and removal of book'
                    },
                    {
                      num: '5',
                      name: 'Negative: Missing Author',
                      method: 'POST',
                      url: '/books',
                      expectedStatus: '400 Bad Request',
                      tests: 'pm.response.to.have.status(400); validates that error string mentions "author"'
                    },
                    {
                      num: '6',
                      name: 'Negative: Non-Existent Book',
                      method: 'PUT',
                      url: '/books/99999',
                      expectedStatus: '404 Not Found',
                      tests: 'pm.response.to.have.status(404); asserts that error contains "No book exists"'
                    }
                  ].map((t) => (
                    <div key={t.num} className="p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 text-slate-500 font-mono">{t.num}.</span>
                        <span
                          className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            t.method === 'GET'
                              ? 'bg-emerald-950 text-emerald-400'
                              : t.method === 'POST'
                              ? 'bg-indigo-950 text-indigo-400'
                              : t.method === 'PUT'
                              ? 'bg-amber-950 text-amber-400'
                              : 'bg-rose-950 text-rose-400'
                          }`}
                        >
                          {t.method}
                        </span>
                        <span className="font-semibold text-white">{t.name}</span>
                        <code className="text-slate-400 font-mono text-[11px]">{t.url}</code>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300">
                          {t.expectedStatus}
                        </span>
                        <span className="text-[11px] text-slate-500 hidden lg:inline">
                          {t.tests}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TECHNICAL INTERVIEW Q&A */}
        {activeTab === 'qa' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                Technical Interview Preparation & Defense
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Deep explanations for questions frequently asked in backend developer interviews regarding Node.js, Express, REST, and HTTP protocols.
              </p>
            </div>

            <div className="space-y-3">
              {interviewQuestionsData.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Q{idx + 1}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{item.q}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ARCHITECTURE & ENDPOINT SPECIFICATIONS */}
        {activeTab === 'docs' && (
          <div className="space-y-6">
            {/* Endpoints Matrix */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                API Endpoint Specifications
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3">Endpoint</th>
                      <th className="py-2.5 px-3">Required Body</th>
                      <th className="py-2.5 px-3">Success Status</th>
                      <th className="py-2.5 px-3">Error Status</th>
                      <th className="py-2.5 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    <tr>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">GET</td>
                      <td className="py-3 px-3 font-mono text-white">/books</td>
                      <td className="py-3 px-3 text-slate-500">None</td>
                      <td className="py-3 px-3 font-mono text-emerald-300">200 OK</td>
                      <td className="py-3 px-3 font-mono text-rose-400">500</td>
                      <td className="py-3 px-3 text-slate-300">Returns list of all available books</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-mono font-bold text-indigo-400">POST</td>
                      <td className="py-3 px-3 font-mono text-white">/books</td>
                      <td className="py-3 px-3 font-mono text-amber-300">{"{ title, author }"}</td>
                      <td className="py-3 px-3 font-mono text-emerald-300">201 Created</td>
                      <td className="py-3 px-3 font-mono text-rose-400">400, 500</td>
                      <td className="py-3 px-3 text-slate-300">Creates new book with auto-incremented ID</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">PUT</td>
                      <td className="py-3 px-3 font-mono text-white">/books/:id</td>
                      <td className="py-3 px-3 font-mono text-amber-300">{"{ title, author }"}</td>
                      <td className="py-3 px-3 font-mono text-emerald-300">200 OK</td>
                      <td className="py-3 px-3 font-mono text-rose-400">400, 404, 500</td>
                      <td className="py-3 px-3 text-slate-300">Updates title & author of book with matching ID</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-mono font-bold text-rose-400">DELETE</td>
                      <td className="py-3 px-3 font-mono text-white">/books/:id</td>
                      <td className="py-3 px-3 text-slate-500">None</td>
                      <td className="py-3 px-3 font-mono text-emerald-300">200 OK</td>
                      <td className="py-3 px-3 font-mono text-rose-400">400, 404, 500</td>
                      <td className="py-3 px-3 text-slate-300">Removes book from in-memory array by ID</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Architecture Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-400" />
                  MVC Request Flow
                </h3>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5">
                  <div className="text-indigo-400">Client (Postman / Browser)</div>
                  <div className="text-slate-500">  ↓ HTTP Request</div>
                  <div className="text-amber-400">server.js (express.json() & Logger)</div>
                  <div className="text-slate-500">  ↓ Routing match</div>
                  <div className="text-cyan-400">routes/bookRoutes.js (/books, /books/:id)</div>
                  <div className="text-slate-500">  ↓ Method delegation</div>
                  <div className="text-emerald-400">controllers/bookController.js (Validation & CRUD)</div>
                  <div className="text-slate-500">  ↓ Read / Write</div>
                  <div className="text-violet-400">data/books.js (In-Memory Array)</div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Internship Compliance Checklist
                </h3>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pure Node.js and Express.js (CommonJS `require`/`module.exports`)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Separation of routes, controllers, and in-memory data store</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Built-in `express.json()` parsing with malformed JSON safety</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Exact status codes: 200, 201, 400, 404, 500</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Importable Postman Collection with automated test scripts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>No MongoDB, no SQL, no authentication, no external paid APIs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          Elevate Labs Web Development Internship • Task 3: Node.js & Express Book Management API
        </p>
        <p className="mt-1">
          Developed by <strong>Asif Shah Khan</strong> • Complete standalone code in{' '}
          <code className="text-indigo-400">book-management-api/</code>
        </p>
      </footer>
    </div>
  );
}
