import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

export default async function handler(req, res) {
  const id = req.url.split('/').pop();

  // GET all todos
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // POST - add todo
  if (req.method === 'POST') {
    const { text } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO todos (text) VALUES ($1) RETURNING *',
        [text]
      );
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // PATCH - toggle completed
  if (req.method === 'PATCH') {
    const { completed } = req.body;
    try {
      const result = await pool.query(
        'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *',
        [completed, id]
      );
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // DELETE - remove todo
  if (req.method === 'DELETE') {
    try {
      await pool.query('DELETE FROM todos WHERE id = $1', [id]);
      return res.json({ message: 'Deleted' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}