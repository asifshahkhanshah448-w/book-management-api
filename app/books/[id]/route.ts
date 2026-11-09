import { NextRequest, NextResponse } from 'next/server';
import { getBooks, updateBookById, deleteBookById } from '@/lib/bookStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /books/:id
 * Retrieve a specific book by ID
 */
export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const bookId = parseInt(id, 10);

  if (isNaN(bookId) || bookId <= 0) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation Error: Invalid book ID format. ID must be a positive integer.',
      },
      { status: 400 }
    );
  }

  const book = getBooks().find((b) => b.id === bookId);
  if (!book) {
    return NextResponse.json(
      {
        success: false,
        error: `Book Not Found: No book exists with ID ${bookId}.`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: book,
    },
    { status: 200 }
  );
}

/**
 * PUT /books/:id
 * Update title and author of a book by ID.
 * Returns HTTP 200 on success, HTTP 404 if not found, HTTP 400 on invalid input.
 */
export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const bookId = parseInt(id, 10);

    if (isNaN(bookId) || bookId <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error: Invalid book ID format. ID must be a positive integer.',
        },
        { status: 400 }
      );
    }

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

    const updatedBook = updateBookById(bookId, title, author);

    if (!updatedBook) {
      return NextResponse.json(
        {
          success: false,
          error: `Book Not Found: No book exists with ID ${bookId}.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Book with ID ${bookId} updated successfully.`,
        data: updatedBook,
      },
      { status: 200 }
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

/**
 * DELETE /books/:id
 * Delete a book by ID.
 * Returns HTTP 200 with success message, or HTTP 404 if not found.
 */
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const bookId = parseInt(id, 10);

    if (isNaN(bookId) || bookId <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error: Invalid book ID format. ID must be a positive integer.',
        },
        { status: 400 }
      );
    }

    const deletedBook = deleteBookById(bookId);

    if (!deletedBook) {
      return NextResponse.json(
        {
          success: false,
          error: `Book Not Found: No book exists with ID ${bookId}.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Book with ID ${bookId} deleted successfully.`,
        data: deletedBook,
      },
      { status: 200 }
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
