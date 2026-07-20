export default async function handler(req, res) {
  // Allow POST only
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Send subscription request to Substack
    const response = await fetch(
      "https://peaceeout.substack.com/api/v1/free",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Vercel",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    // Read Substack response
    const data = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: data,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subscribed successfully",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
