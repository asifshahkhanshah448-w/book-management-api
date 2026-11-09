/**
 * In-Memory Data Store for Books
 * 
 * NOTE: Data is stored strictly in memory (RAM).
 * Any changes (created, updated, or deleted books) will persist only
 * while the Node.js server process is running. When the server restarts
 * or crashes, the array will reset to its initial seed state.
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

module.exports = books;
