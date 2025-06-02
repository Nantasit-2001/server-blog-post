import connectionPool from "../utils/db.mjs";

export async function createNotifications( type, senderId, postId, commentId = null ) {
  try {
    let receiverQuery = ""; // คนที่จะเป็น คนรับ
    let queryParams = [];
    // เลือก query ตามประเภท
    switch (type) {
      case "user_commented":
        receiverQuery = `SELECT id FROM users WHERE role = 'admin'`;
        break;

      case "admin_posted":
        receiverQuery = `SELECT id FROM users WHERE role != 'admin'`;
        break;

      case "other_user_commented":
        receiverQuery = `
          SELECT DISTINCT c.user_id
          FROM comments c
          JOIN users u ON c.user_id = u.id
          WHERE c.post_id = $1 AND c.user_id != $2 AND u.role != 'admin'
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
        (_, i) =>
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

export async function getNotificationAdmin(){
  try{
    const notification = await connectionPool.query(
    `SELECT 
  n.sender_user_id,
  n.post_id,
  n.is_read,
  n.type,
  n.created_at,
  n.id,
  c.comment_text,
  p.title
FROM notifications n
JOIN (
  SELECT DISTINCT ON (post_id) post_id, comment_text
  FROM comments
  ORDER BY post_id, created_at DESC
) c ON c.post_id = n.post_id
JOIN posts p ON p.id = n.post_id
WHERE n.is_read = false AND n.type = 'user_commented'

`
    )
    return notification.rows
  }catch(e){
    console.log(e)
  }
}

export async function getNotification(){
  try{
    const notification = await connectionPool.query(
    `SELECT sender_user_id, post_id, is_read, type, created_at,id
      FROM notifications
      WHERE is_read = false AND type != 'user_commented'`
    )
    return notification.rows
  }catch(e){
    console.log(e)
  }
}

export async function is_readNotification(id_notification){
  try {
     const result = await connectionPool.query(
      `UPDATE notifications
       SET is_read = true
       WHERE id = $1
       RETURNING *`,
      [id_notification]
    );
    return result.rows[0];
  } catch (e) {
    console.error('Failed to update notification:', e);
    return null;
  }
}