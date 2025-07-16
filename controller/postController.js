import pool from "../db.js";
import { verifyToken } from "../middleware/auth.js";

export const getAllPost = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT posts.*, users.username 
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.user_id = $1
       ORDER BY posts.created_at DESC`,
      [req.user.id]
    );
    res.json({ posts: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching posts" });
  }
};

export const getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );

    const postsWithUsername = result.rows.map((post) => ({
      ...post,
      username: req.user.username,
    }));

    res.json({ posts: postsWithUsername });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching your posts" });
  }
};

export const postBlog = async (req, res) => {
  const { title, content } = req.body;

  try {
    await pool.query(
      "INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3)",
      [req.user.id, title, content]
    );
    res.status(201).json({ message: "Post created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating post" });
  }
};
