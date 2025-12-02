export const config = {
  runtime: "edge"
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/proxy/", "");

  const backend = process.env.BACKEND_URL;
  if (!backend) {
    return new Response(
      JSON.stringify({ error: "Missing BACKEND_URL" }),
      { status: 500 }
    );
  }

  const targetUrl = `${backend}/${path}`;

  const backendRes = await fetch(targetUrl, {
    method: req.method,
    headers: req.headers,
    body: req.method === "GET" || req.method === "HEAD" ? null : req.body
  });

  return new Response(backendRes.body, {
    status: backendRes.status,
    headers: backendRes.headers
  });
}
