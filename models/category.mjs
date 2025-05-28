import connectionPool from "../utils/db.mjs";

export const getCategory = async () => {
    try {
        const res = await connectionPool.query(
            `SELECT * 
             FROM categories`
        );
        return res.rows;
    } catch (err) {
        console.error("Error fetching bio:", err);
        throw new Error("Error fetching bio");
    }
};

export const postCategory = async (category) => {
    try {
        const res = await connectionPool.query(
            `INSERT INTO categories (name)
             VALUES ($1)
             RETURNING *`,  // หรือ RETURNING id ถ้าต้องการแค่ id
            [category]
        );
        return res.rows[0]; // ส่งข้อมูลแถวที่เพิ่มกลับไป
    } catch (err) {
        console.error("Error inserting category:", err);
        throw new Error("Error inserting category");
    }
};

export const putCategory = async (oldName, newName) => {
  try {
    const res = await connectionPool.query(
      `UPDATE categories
       SET name = $1
       WHERE name = $2
       RETURNING *`,  // ส่งข้อมูลที่ถูกอัปเดตกลับไป
      [newName, oldName]
    );
    return res.rows[0]; // ส่งข้อมูลแถวที่อัปเดตกลับไป
  } catch (err) {
    console.error("Error updating category:", err);
    throw new Error("Error updating category");
  }
};


export const deleteCategory = async (category) => {
  try {
    const res = await connectionPool.query(
      `DELETE FROM categories
       WHERE name = $1
       RETURNING *`, // RETURNING สำหรับส่งข้อมูลที่ถูกลบกลับไป
      [category]
    );
    return res.rows[0]; // ส่งข้อมูลแถวที่ถูกลบกลับไป
  } catch (err) {
    console.error("Error deleting category:", err);
    throw new Error("Error deleting category");
  }
};

