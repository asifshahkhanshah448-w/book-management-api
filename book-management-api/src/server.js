/**
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

// Request logger middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root welcome & health-check route
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
    },
    documentation: 'See README.md or import postman/BOOK_API_Postman_Collection.json'
  });
});

// Mount book routes at /books
app.use('/books', bookRoutes);

// Catch-all 404 handler for undefined routes
app.use(notFoundHandler);

// Centralized error handling middleware
app.use(errorHandler);

// Start listening only when run directly (enables supertest/testing without port conflicts)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`  Elevate Labs - Book Management REST API is Running `);
    console.log(`  Server Port    : http://localhost:${PORT}`);
    console.log(`  Books Endpoint : http://localhost:${PORT}/books`);
    console.log('====================================================');
  });
}

module.exports = app;
