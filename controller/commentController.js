import commentModel from "../model/commentModel.js";
import { models } from "../sequelizeInit.js";

const { Comment } = models;

export const postComment = async (req, res) => {
  const { postId } = req.params;
  const { content, parentId = commentModel.parent_id } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const comment = await Comment.create({
      post_id: postId,
      user_id: req.user.id,
      content,
      parent_id: parentId,
    });

    res.status(201).json({ message: "Comment posted", comment });
  } catch (err) {
    console.error("Error posting comment:", err);
    res.status(500).json({ error: "Failed to post comment" });
  }
};

export const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const rawComments = await Comment.findAll({
      where: { post_id: postId },
      order: [["createdAt", "ASC"]],
    });

    const comments = rawComments.map((comment) => comment.get({ plain: true }));

    const commentMap = {};
    const nestedComments = [];

    comments.forEach((comment) => {
      comment.replies = [];
      commentMap[comment.id] = comment;
    });

    comments.forEach((comment) => {
      if (comment.parent_id) {
        const parent = commentMap[comment.parent_id];
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        nestedComments.push(comment);
      }
    });

    res.status(200).json({ comments: nestedComments });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};
