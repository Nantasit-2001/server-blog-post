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
  
  export const createUser = async (name,username, email, hashedPassword,role) => {
    try {
      const res = await connectionPool.query(
        'INSERT INTO users (name,username, email, password,role) VALUES ($1, $2, $3,$4,$5) RETURNING *',
        [name,username, email, hashedPassword,role]
      );
      return res.rows[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  