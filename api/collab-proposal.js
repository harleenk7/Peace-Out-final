export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const { name, email, type, purpose, message } = req.body;

    if (!name || !email || !type || !purpose || !message) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const webappUrl = process.env.GOOGLE_SHEETS_WEBAPP_URL;
    if (!webappUrl) {
      console.warn("GOOGLE_SHEETS_WEBAPP_URL is not configured.");
      return res.status(500).json({
        success: false,
        message: "Server environment variable GOOGLE_SHEETS_WEBAPP_URL is not configured.",
      });
    }

    // Forward payload to Google Sheets Web App
    const response = await fetch(webappUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        type,
        purpose,
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return res.status(502).json({
        success: false,
        message: data.message || "Failed to submit to Google Sheets",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Proposal submitted successfully",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + err.message,
    });
  }
}
