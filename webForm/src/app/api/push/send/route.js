export default async function handler(req, res) {
  // Temporarily disable all logic and return a static response
  res.status(200).json({ message: 'Push notifications are disabled for testing.' });
}