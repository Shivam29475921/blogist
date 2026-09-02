import secrets
import logging
import threading
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)


def generate_otp():
    """Generate a secure 6-digit numeric OTP."""
    return f"{secrets.randbelow(900000) + 100000}"


def _send_email_worker(email, otp):
    subject = f"Your Blogist Verification Code: {otp}"
    message = (
        f"Welcome to Blogist.\n\n"
        f"Your 6-digit verification code is: {otp}\n\n"
        f"This code will expire in 10 minutes.\n"
        f"If you did not request this, you can safely ignore this email.\n"
    )

    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Blogist Verification</title>
    </head>
    <body style="margin: 0; padding: 28px 16px; background-color: #080808; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e5e5e5;">
      <div style="max-width: 480px; margin: 0 auto; background-color: #0d0d0d; border: 1px solid rgba(255,255,255,0.12); padding: 36px 32px; box-sizing: border-box;">
        <div style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="font-family: Georgia, serif; font-size: 26px; font-weight: 700; margin: 0; color: #ffffff; letter-spacing: -0.02em;">Blogist</h1>
          <p style="font-family: monospace; font-size: 10px; letter-spacing: 0.25em; color: rgba(255,255,255,0.4); margin: 6px 0 0 0;">NEW ACCOUNT · VERIFICATION DISPATCH</p>
        </div>
        
        <p style="font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.85); margin: 0 0 16px 0;">
          Welcome to Blogist. Use the verification code below to verify your email address and activate your account:
        </p>

        <div style="background-color: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.15); padding: 18px 24px; text-align: center; margin: 26px 0;">
          <span style="font-family: 'SF Mono', Menlo, Monaco, Consolas, monospace; font-size: 32px; font-weight: 700; letter-spacing: 0.35em; color: #ffffff;">
            {otp}
          </span>
        </div>

        <p style="font-size: 12px; line-height: 1.6; color: rgba(255,255,255,0.45); margin: 0 0 20px 0; font-family: monospace;">
          ⏱ Valid for 10 minutes. Do not share this code with anyone.
        </p>

        <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; font-size: 11px; color: rgba(255,255,255,0.3); font-family: monospace;">
          If you didn't attempt to sign up for Blogist, please ignore this dispatch.
        </div>
      </div>
    </body>
    </html>
    """

    # Always log the OTP to stdout/console for instant access in dev / if SMTP is blocked
    print(f"\n=======================================================", flush=True)
    print(f" [BLOGIST OTP] Verification code for {email}: {otp}", flush=True)
    print(f"=======================================================\n", flush=True)

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"OTP email sent successfully to {email}")
        return True
    except Exception as e:
        logger.warning(f"SMTP dispatch to {email} failed: {e}. (OTP logged to console above)")
        return False


def send_otp_email(email, otp, async_send=True):
    """
    Send an editorial verification email with the OTP code.
    Sends asynchronously in a background thread by default so the HTTP response is never blocked.
    """
    if async_send:
        t = threading.Thread(target=_send_email_worker, args=(email, otp), daemon=True)
        t.start()
        return True
    else:
        return _send_email_worker(email, otp)
