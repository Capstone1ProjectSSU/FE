export default async function handler(req: any, res: any) {
  const backend = process.env.VITE_API_BASE_URL;

  if (!backend) {
    return res.status(500).json({
      error: "Missing VITE_API_BASE_URL environment variable",
    });
  }

  const path = Array.isArray(req.query.path)
    ? req.query.path.join("/")
    : req.query.path;

  const targetUrl = `${backend}/${path}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined,
      },
      body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    });

    const contentType = response.headers.get("content-type");
    if (contentType) {
      res.setHeader("content-type", contentType);
    }

    const responseBody = await response.text();
    res.status(response.status).send(responseBody);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({
      error: "Proxy request failed",
      details: String(error),
    });
  }
}
