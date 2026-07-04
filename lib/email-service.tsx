import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function notifySubscribers(emails: string[], event: any) {
  try {
    await resend.emails.send({
      from: 'Hawassa Nexus <updates@hawassanexus.com>',
      to: emails,
      subject: `New Event in Hawassa: ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <img src="${event.image}" style="width: 100%; height: 250px; object-fit: cover;" alt="Event" />
          <div style="padding: 24px;">
            <h2 style="color: #0ea5e9; margin-top: 0;">${event.title}</h2>
            <p style="color: #64748b;">ሰላም! አዲስ ዝግጅት በሐይቁ ከተማ ተዘጋጅቷል። ዝርዝሩን ከታች ይመልከቱ:</p>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
            <p><strong>📅 Date:</strong> ${event.date}</p>
            <p><strong>📍 Location:</strong> ${event.location}</p>
            <a href="https://hawassapulse.com/events" 
               style="display: block; text-align: center; background: #0ea5e9; color: white; padding: 14px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 25px;">
               See Full Details
            </a>
          </div>
          <div style="background: #f8fafc; padding: 15px; text-align: center; font-size: 11px; color: #94a3b8;">
            © ${new Date().getFullYear()} Hawassa Nexus. Connecting Hawassa's community.
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Resend error:", err);
  }
}