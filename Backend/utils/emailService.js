/**
 * Email Service helper
 * Dispatches emails using Resend REST API if RESEND_API_KEY is configured.
 * Otherwise, logs details to the console for easy local development testing.
 */
exports.sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("\n========================================");
    console.log("📨 [DEVELOPMENT EMAIL LOG]");
    console.log(`TO:      ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log("CONTENT:");
    console.log(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
    console.log("========================================\n");
    return { success: true, mock: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Expense Tracker <onboarding@resend.dev>",
        to,
        subject,
        html,
      }),
    });

    const resData = await response.json();
    if (!response.ok) {
      console.error("Resend API error response:", resData);
      throw new Error(resData.message || "Failed to send email");
    }

    return { success: true, data: resData };
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    console.log("\n🚨 [EMAIL SEND FAILED - FALLBACK LOG]");
    console.log(`TO:      ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log("CONTENT:");
    console.log(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
    console.log("========================================\n");
    return { success: false, error: error.message };
  }
};
