import { NextResponse } from 'next/server';
import { resetBooksToSeed } from '@/lib/bookStore';

/**
 * POST /books/reset
 * Resets the in-memory data store to the initial seed array
 */
export async function POST() {
  const books = resetBooksToSeed();
  return NextResponse.json(
    {
      success: true,
      message: 'In-memory book database successfully reset to default seed items.',
      data: books,
    },
    { status: 200 }
  );
}
