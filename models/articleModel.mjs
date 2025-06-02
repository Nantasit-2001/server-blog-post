import connectionPool from "../utils/db.mjs";

export const getArticleInfo = async () => {
    try {
        const res = await connectionPool.query(
            `SELECT 
                posts.id,
                categories.name AS category_name,
                statuses.status AS status_name,
                posts.title
            FROM posts
            JOIN categories ON posts.category_Id = categories.id
            JOIN statuses ON posts.status_id = statuses.id;`
        );
        return res.rows;
    } catch (err) {
        console.error("Error fetching Article:", err);
        throw new Error("Error fetching Article");
    }
};

export const getArticleById = async (id) => {
    try {
        const res = await connectionPool.query(
            `SELECT 
                posts.image,
                posts.title,
                posts.description,
                posts.content,
                categories.name AS category_name
            FROM posts
            JOIN categories ON posts.category_id = categories.id
            WHERE posts.id = $1;`,
            [id]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Error fetching Article by ID:", err);
        throw new Error("Error fetching Article by ID");
    }
};

export const postArticle = async (title, description, content, category_Id, status,image_url) => {
    try {
        
        let status_Id;
        (status==="publish"? status_Id=2:status_Id=1);
        const res = await connectionPool.query(
            `INSERT INTO posts (title, description, content, category_id, status_id, date, image)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [title, description, content, category_Id, status_Id, new Date(), image_url]
        );
        return res.rows[0];
    }catch (err) {
        console.error("Error inserting Article:", err);
        throw new Error("Error inserting Article");
    }
}


export const putArticle = async (id, title, description, content, category_Id, status,imageUrl) => {
    try {
        let status_Id;
        (status==="publish"? status_Id=2:status_Id=1);
        const res = await connectionPool.query(
            `UPDATE posts
             SET title = $1, description = $2, content = $3, category_id = $4, status_id = $5, image = $6
             WHERE id = $7
             RETURNING *`,
            [title, description, content, category_Id, status_Id,imageUrl, id ]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Error updating Article:", err);
        throw new Error("Error updating Article");
    }
}

export const deleteArticle = async (id) => {
    try {
        const res = await connectionPool.query(
            `DELETE FROM posts
             WHERE id = $1
             RETURNING *`,
            [id]
        );
        return res.rows[0];
    } catch (err) {
        console.error("Error deleting Article:", err);
        throw new Error("Error deleting Article");
    }
};

  export const getImageUrlByPostId = async (postId) => {
  try {
    const result = await connectionPool.query(
      'SELECT image FROM posts WHERE id = $1',
      [postId]
    );

    if (result.rows.length === 0) {
      return null; // ไม่เจอ postId
    }

    return result.rows[0].image;
  } catch (error) {
    console.error('❌ Error in getImageUrlByPostId:', error);
    throw error;
  }
};