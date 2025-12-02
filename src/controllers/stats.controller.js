import { pool } from "../db.js";

export const getStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) AS total_records,
        AVG(value) AS avg_value,
        SUM(value) AS total_value
      FROM history
    `);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get stats" });
  }
};
