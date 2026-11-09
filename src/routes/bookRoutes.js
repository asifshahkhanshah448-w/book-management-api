/**
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

module.exports = router;
