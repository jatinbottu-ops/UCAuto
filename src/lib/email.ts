import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "U&C Auto Connect <noreply@ucautoconnect.com>";

export async function sendVerificationEmail(
  to: string,
  firstName: string,
  token: string
) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Verify your email - U&C Auto Connect",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A3A6B; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">U&C Auto Connect</h1>
        </div>
        <div style="padding: 32px;">
          <h2>Hi ${firstName},</h2>
          <p>Thanks for signing up! Please verify your email address to get started.</p>
          <a href="${verifyUrl}" style="display: inline-block; background: #E87722; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">Verify Email</a>
          <p style="color: #64748B; font-size: 14px;">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(
  to: string,
  firstName: string,
  token: string
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Reset your password - U&C Auto Connect",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A3A6B; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">U&C Auto Connect</h1>
        </div>
        <div style="padding: 32px;">
          <h2>Hi ${firstName},</h2>
          <p>We received a request to reset your password.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #E87722; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">Reset Password</a>
          <p style="color: #64748B; font-size: 14px;">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  });
}

export async function sendApplicationSubmittedEmail(
  to: string,
  firstName: string,
  vehicleName: string
) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Application Received - U&C Auto Connect",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A3A6B; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">U&C Auto Connect</h1>
        </div>
        <div style="padding: 32px;">
          <h2>Hi ${firstName},</h2>
          <p>We've received your application for the <strong>${vehicleName}</strong>. Our team will review it within 1-2 business days.</p>
          <p>You'll receive an email notification when your application status changes.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #E87722; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">View Dashboard</a>
        </div>
      </div>
    `,
  });
}

export async function sendApplicationApprovedEmail(
  to: string,
  firstName: string,
  vehicleName: string,
  applicationId: string
) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Application Approved! - U&C Auto Connect",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A3A6B; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">U&C Auto Connect</h1>
        </div>
        <div style="padding: 32px;">
          <div style="background: #ECFDF5; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="color: #1B7A3E; font-weight: 600; margin: 0;">Your application has been approved!</p>
          </div>
          <h2>Congratulations, ${firstName}!</h2>
          <p>Your application for the <strong>${vehicleName}</strong> has been approved. Complete your payment to finalize your rental.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/checkout/${applicationId}" style="display: inline-block; background: #E87722; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">Complete Payment</a>
        </div>
      </div>
    `,
  });
}

export async function sendApplicationRejectedEmail(
  to: string,
  firstName: string,
  vehicleName: string
) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Application Update - U&C Auto Connect",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A3A6B; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">U&C Auto Connect</h1>
        </div>
        <div style="padding: 32px;">
          <h2>Hi ${firstName},</h2>
          <p>Unfortunately, we were unable to approve your application for the <strong>${vehicleName}</strong> at this time.</p>
          <p>You're welcome to browse other available vehicles or contact us if you have questions.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/cars" style="display: inline-block; background: #1A3A6B; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">Browse Other Cars</a>
        </div>
      </div>
    `,
  });
}

export async function sendPaymentConfirmedEmail(
  to: string,
  firstName: string,
  vehicleName: string,
  amountCents: number
) {
  const amount = (amountCents / 100).toFixed(2);
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Payment Confirmed - U&C Auto Connect",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A3A6B; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">U&C Auto Connect</h1>
        </div>
        <div style="padding: 32px;">
          <h2>Payment Confirmed!</h2>
          <p>Hi ${firstName}, your payment of <strong>$${amount}</strong> for the <strong>${vehicleName}</strong> has been processed successfully.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #E87722; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">View Dashboard</a>
        </div>
      </div>
    `,
  });
}

export async function sendWaitlistJoinedEmail(
  to: string,
  name: string,
  vehicleName: string,
  position: number
) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "You're on the waitlist - U&C Auto Connect",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A3A6B; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">U&C Auto Connect</h1>
        </div>
        <div style="padding: 32px;">
          <h2>Hi ${name},</h2>
          <p>You're now on the waitlist for the <strong>${vehicleName}</strong>. You are position <strong>#${position}</strong> in the queue.</p>
          <p>We'll notify you as soon as a spot opens up!</p>
        </div>
      </div>
    `,
  });
}

export async function sendWaitlistNotifiedEmail(
  to: string,
  name: string,
  vehicleName: string
) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "A spot is available! - U&C Auto Connect",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1A3A6B; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">U&C Auto Connect</h1>
        </div>
        <div style="padding: 32px;">
          <h2>Great news, ${name}!</h2>
          <p>A spot has opened up for the <strong>${vehicleName}</strong>. Act fast to secure your rental!</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/cars" style="display: inline-block; background: #E87722; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">Apply Now</a>
        </div>
      </div>
    `,
  });
}
