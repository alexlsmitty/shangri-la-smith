export default function handler(req, res) {
  return res.status(200).json({
    status: 'ok',
    message: 'API is running',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
}
