const BEEHIIV_PUBLICATION_ID = "pub_8f8c02f4-0beb-4848-b010-bb76be6b8026";
const ALLOWED_ORIGINS = new Set([
  "https://joindialoglab.com",
  "https://www.joindialoglab.com",
  "http://localhost:8080",
]);

function corsHeaders(origin) {
  const allowOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://joindialoglab.com";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch (e) {
      return json({ error: "Invalid JSON body" }, 400, origin);
    }

    const email = (payload.email || "").toString().trim();
    const interestedAndroid = payload.interest_android === true;
    const interestedWeb = payload.interest_web === true;

    if (!email || !EMAIL_RE.test(email) || email.length > 128) {
      return json({ error: "A valid email is required" }, 400, origin);
    }

    const beehiivRes = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.BEEHIIV_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          custom_fields: [
            {
              name: "Platform Preference",
              value: [
                ...(interestedAndroid ? ["Android"] : []),
                ...(interestedWeb ? ["Web"] : []),
              ],
            },
          ],
        }),
      }
    );

    if (!beehiivRes.ok) {
      let detail = "";
      try {
        detail = JSON.stringify(await beehiivRes.json());
      } catch (e) {}
      console.error("beehiiv subscribe failed", beehiivRes.status, detail);
      return json({ error: "Something went wrong. Please try again." }, 502, origin);
    }

    return json({ ok: true }, 200, origin);
  },
};
