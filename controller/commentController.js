import pool from "../db.js";

export const postComment = async (req, res) => {
  const { postId } = req.params;
  const { content, parentId = null } = req.body;

  try {
    await pool.query(
      `INSERT INTO comments (post_id, user_id, content, parent_id)
       VALUES ($1, $2, $3, $4)`,
      [postId, req.user.id, content, parentId]
    );

    res.status(201).json({ message: "Comment posted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error posting comment" });
  }
};

export const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await pool.query(
      `SELECT c.*, u.username
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at ASC`,
      [postId]
    );

    // Nest replies under parent comments
    const comments = result.rows;
    const nested = [];

    const commentMap = {};

    comments.forEach((comment) => {
      comment.replies = [];
      commentMap[comment.id] = comment;
    });

    comments.forEach((comment) => {
      if (comment.parent_id) {
        commentMap[comment.parent_id]?.replies.push(comment);
      } else {
        nested.push(comment);
      }
    });

    res.json({ comments: nested });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching comments" });
  }
};
