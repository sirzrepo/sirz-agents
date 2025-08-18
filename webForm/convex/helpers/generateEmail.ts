const brandName = process.env.APP_NAME ?? "Rekobo";
const fromEmail = process.env.AUTH_EMAIL ?? "Rekobo <support@unclereubengrills.com>";

export function generateEmail({
  email,
  subject = `Sign in to ${brandName}`,
  token,
  expires,
  message = "Please enter the following code on the sign in page.",
  cta = "Verification Code",
  disclaimer = "If you didn’t request a password reset, you can safely ignore this email.",
}: {
  email: string;
  subject?: string;
  token: string;
  expires: number;
  message?: string;
  cta?: string;
  disclaimer?: string;
}) {
//   const hoursValid = Math.floor((+expires - Date.now()) / (60 * 60 * 1000));
const minutesValid = Math.floor((+expires - Date.now()) / (60 * 1000));

  return {
    from: fromEmail,
    to: [email],
    subject,
    html: `
       <div class="wrapper">
     <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background: linear-gradient(135deg, #f3f4f6, #f9fafb, #d1fae5); background-color: #f9fafb; padding: 24px;">
         
        <div style="max-width: 520px; margin: auto; background: white; border-radius: 8px; padding: 32px; box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);">
            <div>
             <img src="https://rekobo.vercel.app/images/logo.png" alt="Rekobo logo" width="120" style="margin-bottom: 20px; " />
         </div>
          <h1 style="font-size: 20px; font-weight: 600; color: #111;">${subject}</h1>
          <p style="font-size: 14px; color: #333;">${message}</p>
          <div style="text-align: center; margin: 24px 0;">
            <p style="font-weight: 500; font-size: 15px; margin-bottom: 4px;">${cta}</p>
            <p style="font-weight: bold; font-size: 32px; color: #00b894; letter-spacing: 2px;">${token}</p>
            <p style="font-size: 12px; color: #888; margin-top: 12px;">
              For your security, this code will expire in ${minutesValid} minutes.
            </p>
          </div>
          <p style="font-size: 13px; color: #999;">${disclaimer}</p>
        </div>
        <table width="100%" style="margin-top: 30px;" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <p style="font-size: 13px; color: #ccc; margin-bottom: 8px;">Follow us on social media</p>
              <a href="https://x.com/rekobo" style="margin: 0 8px;" target="_blank">
                <img src="https://cdn-icons-png.flaticon.com/512/3670/3670151.png" width="24" alt="X (Twitter)" style="vertical-align: middle;" />
              </a>
              <a href="https://instagram.com/rekobo" style="margin: 0 8px;" target="_blank">
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="24" alt="Instagram" style="vertical-align: middle;" />
              </a>
              <a href="https://tiktok.com/@rekobo" style="margin: 0 8px;" target="_blank">
                <img src="https://cdn-icons-png.flaticon.com/512/3046/3046122.png" width="24" alt="TikTok" style="vertical-align: middle;" />
              </a>
              <a href="https://facebook.com/rekobo" style="margin: 0 8px;" target="_blank">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="24" alt="Facebook" style="vertical-align: middle;" />
              </a>
            </td>
          </tr>
        </table>
        <div style="text-align: center; font-size: 12px; color: #aaa; margin-top: 16px;">
            
          © ${new Date().getFullYear()} ${brandName}. All rights reserved.
        </div>
      </div>
  </div>
    `,
  };
}
