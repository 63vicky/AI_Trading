import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    console.log('Resending verification email to:', email);

    const response = await fetch(
      'http://localhost:5000/api/auth/resend-verification',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();
    console.log('Backend response:', data);

    if (!response.ok) {
      console.error('Resend verification failed:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to resend verification email' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
