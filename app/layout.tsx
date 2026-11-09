import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Book Management REST API | Elevate Labs Internship Task 3',
  description: 'A professional RESTful API built with Node.js and Express for managing books through CRUD operations, with centralized error handling and Postman suite.',
  openGraph: {
    title: 'Book Management REST API | Elevate Labs Internship Task 3',
    description: 'A professional RESTful API built with Node.js and Express for managing books through CRUD operations, with centralized error handling and Postman suite.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Management REST API | Elevate Labs Internship Task 3',
    description: 'A professional RESTful API built with Node.js and Express for managing books through CRUD operations, with centralized error handling and Postman suite.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
