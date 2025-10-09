import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send auto-reply to user
    
    // For now, we'll just log the contact form data
    console.log('Contact Form Submission:', {
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString()
    });

    // Simulate email sending (in production, use a service like SendGrid, Nodemailer, etc.)
    // await sendContactEmail({ name, email, phone, subject, message });

    return NextResponse.json({
      message: 'Pesan berhasil dikirim! Terima kasih atas feedbacknya.',
      success: true
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengirim pesan' },
      { status: 500 }
    );
  }
}

// Optional: Function to send email (requires email service setup)
async function sendContactEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  // Example using a service like SendGrid, Nodemailer, etc.
  // This is just a placeholder
  console.log('Would send email:', data);
}
