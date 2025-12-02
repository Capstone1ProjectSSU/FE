export default async function handler(req, res) {
  const backend = process.env.VITE_API_BASE_URL;

  const targetUrl = `${backend}/api/${req.query.path.join("/")}`;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: { ...req.headers },
    body: req.method !== "GET" ? req.body : undefined
  });

  const data = await response.text();

  res.status(response.status).send(data);
}
