import Posts from "../router/posts.mjs";
import connectionPool from "../utils/db.mjs";

export const findUserByEmail = async (email) => {
    try {
      const res = await connectionPool.query('SELECT * FROM users WHERE email = $1', [email]);
      return res.rows[0];
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  };

export const findUserByUsername = async (username) => {
    try {
      const res = await connectionPool.query('SELECT * FROM users WHERE username = $1', [username]);
      return res.rows[0];
    } catch (error) {
      console.error("Error finding user by username:", error);
      throw error;
    }
  };
  
  export const findUserById = async (id) => {
    try {
      const res = await connectionPool.query('SELECT * FROM users WHERE id = $1', [id]);
      return res.rows[0];
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  };

  export const createUser = async (name,username, email, hashedPassword,role) => {
    const pic = "https://placehold.co/100x100?text=Profile"
    try {
      const res = await connectionPool.query(
        'INSERT INTO users (name,username, email, password,role,profile_pic) VALUES ($1, $2, $3,$4,$5,$6) RETURNING *',
        [name,username, email, hashedPassword,role,pic]
      );
      return res.rows[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  export const updateUserPasswordById = async (id, hashedPassword) => {
    try {
      const res = await connectionPool.query(
        'UPDATE users SET password = $1 WHERE id = $2 RETURNING id, email',
        [hashedPassword, id]
      );
      return res.rows[0]; 
    } catch (error) {
      console.error("Error updating user password:", error);
      throw error;
    }
  };

  export const updateUserProfileById = async (id,name,username,image)=>{
    try {
      const res = await connectionPool.query(
          `UPDATE users SET name = $1, username = $2, profile_pic = $3 WHERE id = $4 `,
          [name, username, image, id],
      );
      return res.rows[0];
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update profile' });
  }
  };

  export const getUserProfileById = async (id) =>{
    try {
      const res = await connectionPool.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      return res.rows[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };