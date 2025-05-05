import connectionPool from "../utils/db.mjs";

export const getCommentByPostId = async (postId) => {
    try{
        const res = await connectionPool.query(
            `SELECT comments.id, comments.comment_text, comments.created_at, users.id AS user_id, users.name AS user_name, users.profile_pic
            FROM comments 
            JOIN users ON comments.user_id = users.id
            WHERE comments.post_id = $1
            ORDER BY comments.created_at ASC`,
            [postId]
        );    
        return res.rows
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching comments" });
    }
}

export const createComment = async (postId,userId,comment) => {
    const date = new Date()
    try {
        const res = await connectionPool.query(
          `INSERT INTO comments (post_id, user_id,comment_text,created_at) 
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [postId, userId,comment,date]
        );
        return res.rows        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching comments" });
    }
}
