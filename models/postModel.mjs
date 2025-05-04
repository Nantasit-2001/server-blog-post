import connectionPool from "../utils/db.mjs";

export const updateLikes_Count = async (postId,likes_Count) =>{
    try {
      await connectionPool.query(
          `UPDATE posts SET likes_count = $1 WHERE id = $2 `,
          [likes_Count,postId],
      );
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update profile' });
  }
  };