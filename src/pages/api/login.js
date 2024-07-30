// pages/api/login.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Replace with your authentication logic
    if (email === 'test@example.com' && password === 'password123') {
      // Simulate successful login
      res.status(200).json({ message: 'Login successful' });
    } else {
      // Simulate login failure
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
