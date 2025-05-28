import connectionPool from "../utils/db.mjs";

export async function createNotifications({ type, senderId, postId, commentId = null }) {
  try {
    let receiverQuery = "";
    let queryParams = [];

    // เลือก query ตามประเภท
    switch (type) {
      case "user_commented":
        receiverQuery = `SELECT id FROM users WHERE is_admin = TRUE`;
        break;

      case "admin_posted":
        receiverQuery = `SELECT id FROM users WHERE is_admin = FALSE`;
        break;

      case "other_user_commented":
        receiverQuery = `
          SELECT DISTINCT user_id FROM comments 
          WHERE post_id = $1 AND user_id != $2
        `;
        queryParams = [postId, senderId];
        break;

      default:
        throw new Error("Unknown notification type: " + type);
    }

    const result = await connectionPool.query(receiverQuery, queryParams);
    const receivers = result.rows.map((row) => row.id || row.user_id);
    if (receivers.length === 0) return;

    const values = receivers
      .map(
        (id, i) =>
          `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${i * 7 + 4}, $${i * 7 + 5}, $${i * 7 + 6}, $${i * 7 + 7})`
      )
      .join(", ");

    const params = receivers.flatMap((id) => [
      id,
      senderId,
      postId,
      commentId,
      type,
      false,
      new Date(),
    ]);

    const sql = `
      INSERT INTO notifications 
        (receiver_user_id, sender_user_id, post_id, comment_id, type, is_read, created_at)
      VALUES ${values}
    `;

    await connectionPool.query(sql, params);
  } catch (error) {
    console.error("Error creating notifications:", error);
  }
}