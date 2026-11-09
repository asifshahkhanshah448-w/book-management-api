import { NextRequest, NextResponse } from 'next/server';
import { getBooks, addBook } from '@/lib/bookStore';

/**
 * GET /books
 * Return all available books in memory with HTTP 200
 */
export async function GET() {
  const books = getBooks();
  return NextResponse.json(
    {
      success: true,
      count: books.length,
      data: books,
    },
    { status: 200 }
  );
}

/**
 * POST /books
 * Add a new book using request body.
 * Required fields: title, author
 * Generates unique ID, returns HTTP 201
 */
export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Malformed JSON payload: Please verify that your JSON syntax is valid.',
        },
        { status: 400 }
      );
    }

    const { title, author } = body || {};

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error: "title" is required and must be a non-empty string.',
        },
        { status: 400 }
      );
    }

    if (!author || typeof author !== 'string' || author.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error: "author" is required and must be a non-empty string.',
        },
        { status: 400 }
      );
    }

    const newBook = addBook(title, author);

    return NextResponse.json(
      {
        success: true,
        message: 'Book created successfully.',
        data: newBook,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
