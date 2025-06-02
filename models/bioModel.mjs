import connectionPool from "../utils/db.mjs";

export const getBioByUserId = async (userId) => {
    try {
        const res = await connectionPool.query(
            `SELECT id, user_id, bio, updated_at 
             FROM bio
             WHERE user_id = $1`,
            [userId]
        );
        
        return res.rows[0];  // สมมติ user มี bio แค่ 1 record
    } catch (err) {
        console.error("Error fetching bio:", err);
        throw new Error("Error fetching bio");
    }
};

export const upsertBioByUserId = async (userId, newBioText) => {
  try {
    const res = await connectionPool.query(
      `INSERT INTO bio (user_id, bio, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id)
       DO UPDATE SET bio = EXCLUDED.bio, updated_at = NOW()
       RETURNING *`,
      [userId, newBioText]
    );
    return res.rows[0];
  } catch (err) {
    console.error("Error upserting bio:", err);
    throw new Error("Error upserting bio");
  }
};