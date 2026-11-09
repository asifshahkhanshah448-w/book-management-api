/**
 * Book Controller
 * Handles business logic and request/response lifecycle for Book operations.
 */

const books = require('../data/books');

/**
 * @desc   Fetch all books
 * @route  GET /books
 * @access Public
 */
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

/**
 * @desc   Create a new book
 * @route  POST /books
 * @access Public
 */
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

    // Generate unique ID (max existing ID + 1 or 1 if empty)
    const newId = books.length > 0 ? Math.max(...books.map((b) => Number(b.id) || 0)) + 1 : 1;

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

/**
 * @desc   Update an existing book by ID
 * @route  PUT /books/:id
 * @access Public
 */
const updateBook = (req, res, next) => {
  try {
    const bookId = parseInt(req.params.id, 10);

    // Validate ID parameter
    if (isNaN(bookId) || bookId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Invalid book ID format. ID must be a positive integer.'
      });
    }

    // Find book index
    const bookIndex = books.findIndex((b) => b.id === bookId);

    if (bookIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `Book Not Found: No book exists with ID ${bookId}.`
      });
    }

    const { title, author } = req.body;

    // Validate input fields
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

    // Update book in-place
    books[bookIndex] = {
      id: bookId,
      title: title.trim(),
      author: author.trim()
    };

    return res.status(200).json({
      success: true,
      message: `Book with ID ${bookId} updated successfully.`,
      data: books[bookIndex]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a book by ID
 * @route  DELETE /books/:id
 * @access Public
 */
const deleteBook = (req, res, next) => {
  try {
    const bookId = parseInt(req.params.id, 10);

    // Validate ID parameter
    if (isNaN(bookId) || bookId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Invalid book ID format. ID must be a positive integer.'
      });
    }

    // Find book index
    const bookIndex = books.findIndex((b) => b.id === bookId);

    if (bookIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `Book Not Found: No book exists with ID ${bookId}.`
      });
    }

    // Remove book from in-memory array
    const [deletedBook] = books.splice(bookIndex, 1);

    return res.status(200).json({
      success: true,
      message: `Book with ID ${bookId} deleted successfully.`,
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
};
