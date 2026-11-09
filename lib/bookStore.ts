/**
 * In-Memory Book Store for Next.js API Routes
 * Matches the exact data schema and behavior of src/data/books.js
 */

export interface Book {
  id: number;
  title: string;
  author: string;
}

// Initial seed books
const initialBooks: Book[] = [
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

// In-memory array maintained in process RAM
let liveBooks: Book[] = [...initialBooks];

export const getBooks = (): Book[] => {
  return liveBooks;
};

export const addBook = (title: string, author: string): Book => {
  const newId = liveBooks.length > 0 ? Math.max(...liveBooks.map(b => b.id)) + 1 : 1;
  const newBook: Book = {
    id: newId,
    title: title.trim(),
    author: author.trim()
  };
  liveBooks.push(newBook);
  return newBook;
};

export const updateBookById = (id: number, title: string, author: string): Book | null => {
  const index = liveBooks.findIndex(b => b.id === id);
  if (index === -1) return null;
  liveBooks[index] = {
    id,
    title: title.trim(),
    author: author.trim()
  };
  return liveBooks[index];
};

export const deleteBookById = (id: number): Book | null => {
  const index = liveBooks.findIndex(b => b.id === id);
  if (index === -1) return null;
  const [deleted] = liveBooks.splice(index, 1);
  return deleted;
};

export const resetBooksToSeed = (): Book[] => {
  liveBooks = [...initialBooks];
  return liveBooks;
};
