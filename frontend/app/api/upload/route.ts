import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

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

    // Validate file type
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PNG and JPEG/JPG allowed.' },
        { status: 400 }
      );
    }

    // Only allow files less than 20MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds the limit of 10MB.' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads');

    // Convert the file to a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    // Use the Sha 256 hash as filename
    const hash = crypto.subtle.digest('SHA-256', new TextEncoder().encode(file.name));
    const hashArray = Array.from(new Uint8Array(await hash));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const filename = hashHex;
    // const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    // const extension = file.type.split('/')[1];
    // const filename = `${uniqueSuffix}.${extension}`;
    // const filepath = join(uploadsDir, filename);

    // Write the file to the uploads directory
    await writeFile(`${uploadsDir}/${filename}`, buffer);

    // Return the path where the file was saved
    return NextResponse.json({ 
      message: 'File uploaded successfully',
      filename: filename
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