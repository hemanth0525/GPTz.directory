import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
    const { to, subject, body } = await request.json()

    if (!subject || !body) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST || 'smtp.ethereal.email',
        port: Number(process.env.MAIL_PORT || 587),
        secure: process.env.MAIL_SECURE === 'true' || false,
        auth: {
            user: process.env.MAIL_USER || '',
            pass: process.env.MAIL_PASSWORD || '',
        }
    })

    try {
        await transporter.sendMail({
            from: '"GPTz.directory" <mail@gptz.directory>',
            to: to || process.env.MAIL_USER || '',
            subject,
            text: body,
        })

        return NextResponse.json({ message: 'Email sent successfully' })
    } catch (error) {
        console.error('Error sending email:', error)
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }
}
