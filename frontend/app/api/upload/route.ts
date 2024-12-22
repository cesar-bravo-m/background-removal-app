import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file received.' },
        { status: 400 }
      );
    }

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PNG and JPEG/JPG allowed.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const filename = hash;

    const filepath = join(process.cwd(), 'uploads', filename);
    await writeFile(filepath, buffer);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    // const backendUrl = 'http://127.0.0.1:5000';
    const key = process.env.SECRET_KEY;
    const response = await fetch(`${backendUrl}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key: key, filename: filename }),
    });

    if (!response.ok) {
      throw new Error('Failed to process image');
    }

    const blob = await response.blob();

    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'image/png'
      }
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 