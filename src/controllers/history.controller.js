import { pool } from "../db.js";

export const getHistory = async (req, res) => {
  const { limit = 50 } = req.query;

  const result = await pool.query(
    `SELECT * FROM history ORDER BY timestamp DESC LIMIT $1`,
    [limit]
  );

  res.json(result.rows);
};
