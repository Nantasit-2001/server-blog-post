import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validatePost } from "../middleware/validatePost.js";
import { validateToken } from "../middleware/ValidateToken.js";
import { updateLikes_Count } from "../models/postModel.mjs";
import { updateLike,getLike_Count,checkLikeByUser } from "../models/likeModel.mjs";
import { getCommentByPostId,createComment } from "../models/comment.mjs";
import { createNotifications } from "../models/notifications.mjs";
import { getUserProfileById } from "../models/userModel.mjs";

const Posts = Router();

Posts.get("/", async (req, res) => {
  try {
    let category = req.query.category || "";
    if (category === "Highlight") {
      category = "";
    }
    const keyword = req.query.keyword || "";

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(100, limit));
    const offset = (safePage - 1) * safeLimit;

let query = `
  SELECT 
    posts.id, posts.image, categories.name AS category, posts.title, posts.description, 
    posts.date, posts.content, statuses.status, posts.likes_count,
    u.name AS author_name, u.profile_pic AS author_profile_pic
  FROM posts
  INNER JOIN categories ON posts.category_id = categories.id
  INNER JOIN statuses ON posts.status_id = statuses.id
  LEFT JOIN (
    SELECT name, profile_pic
    FROM users
    WHERE role = 'admin'
    LIMIT 1
  ) u ON true
  WHERE statuses.status = 'publish'
  `;


    let values = [];

    if (category && keyword) {
      query += `
        WHERE categories.name ILIKE $1 
        AND (posts.title ILIKE $2 OR posts.description ILIKE $2 OR posts.content ILIKE $2)
      `;
      values = [`%${category}%`, `%${keyword}%`];
    } else if (category) {
      query += ` WHERE categories.name ILIKE $1`;
      values = [`%${category}%`];
    } else if (keyword) {
      query += `
        WHERE posts.title ILIKE $1 
        OR posts.description ILIKE $1 
        OR posts.content ILIKE $1
      `;
      values = [`%${keyword}%`];
    }

    query += ` ORDER BY posts.date DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;

    values.push(safeLimit, offset);
    const result = await connectionPool.query(query, values);

    // Count query
    let countQuery = `
      SELECT COUNT(*)
      FROM posts
      INNER JOIN categories ON posts.category_id = categories.id
      INNER JOIN statuses ON posts.status_id = statuses.id
    `;

    let countValues = values.slice(0, -2);

    if (category && keyword) {
      countQuery += `
        WHERE categories.name ILIKE $1 
        AND (posts.title ILIKE $2 OR posts.description ILIKE $2 OR posts.content ILIKE $2)
      `;
    } else if (category) {
      countQuery += ` WHERE categories.name ILIKE $1`;
    } else if (keyword) {
      countQuery += `
        WHERE posts.title ILIKE $1 
        OR posts.description ILIKE $1 
        OR posts.content ILIKE $1
      `;
    }

    const countResult = await connectionPool.query(countQuery, countValues);
    const totalPosts = parseInt(countResult.rows[0].count, 10);

    const results = {
      totalPosts,
      totalPages: Math.ceil(totalPosts / safeLimit),
      currentPage: safePage,
      limit: safeLimit,
      posts: result.rows,
    };

    if (offset + safeLimit < totalPosts) {
      results.nextPage = safePage + 1;
    }
    if (offset > 0) {
      results.previousPage = safePage - 1;
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
});

Posts.get("/:postId", async (req, res) => {
    const postIdFromClient = req.params.postId;
  
    try {
      const results = await connectionPool.query(`
SELECT 
  posts.id, posts.image, categories.name AS category, posts.title, posts.description, posts.date, posts.content, statuses.status, posts.likes_count,
  u.name AS author_name, u.profile_pic AS author_profile_pic, u.bio
FROM posts
INNER JOIN categories ON posts.category_id = categories.id
INNER JOIN statuses ON posts.status_id = statuses.id
LEFT JOIN (
  SELECT 
    users.id,
    users.name, 
    users.profile_pic,
    bio.bio
  FROM users
  LEFT JOIN bio ON bio.user_id = users.id
  WHERE users.role = 'admin'
  LIMIT 1
) u ON true
WHERE posts.id = $1 AND statuses.status = 'publish'
`,
        [postIdFromClient]
      );
  
      if (!results.rows[0]) {
        return res.status(404).json({
          message: `Server could not find a requested post (post id: ${postIdFromClient})`,
        });
      }
  
      return res.status(200).json({
        data: results.rows[0],
      });
    } catch {
      return res.status(500).json({
        message: `Server could not read post because database connection`,
      });
    }
  });

Posts.put("/:postId",validatePost, async (req, res) => {

    const postIdFromClient = req.params.postId;
    const updatedPost = { ...req.body, date: new Date() };
    try {
        const result = await connectionPool.query(
        `
          UPDATE posts
          SET title = $2,
              image = $3,
              category_id = $4,
              description = $5,
              content = $6,
              status_id = $7,
              date = $8
          WHERE id = $1
        `,
        [
          postIdFromClient,
          updatedPost.title,
          updatedPost.image,
          updatedPost.category_id,
          updatedPost.description,
          updatedPost.content,
          updatedPost.status_id,
          updatedPost.date,
        ]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({
          message: "Server could not find a requested post to update",
        });
      }
      return res.status(200).json({
        message: "Updated post successfully",
      });
    } catch {
      return res.status(500).json({
        message: `Server could not update post because database connection`,
      });
    }
  });

Posts.delete("/:postId", async (req, res) => {
    const postIdFromClient = req.params.postId;
    try {
      const result = await connectionPool.query(
        `DELETE FROM posts
         WHERE id = $1`,
        [postIdFromClient]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({message: "Server could not find a requested post to delete"});
      }
      return res.status(200).json({
        message: "Deleted post successfully",
      });
    } catch {
      return res.status(500).json({
        message: `Server could not delete post because database connection`,
      });
    }
  });

Posts.patch("/:postId/like",validateToken, async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user.userId 
    try {
      const checkLike = await checkLikeByUser(postId,userId)
      const  liked = await updateLike(postId,userId,checkLike)
      const likes_Count = await getLike_Count(postId)
      await updateLikes_Count(postId,likes_Count.count)
      return res.status(200).json(liked,likes_Count)
    } catch (error) {
      console.error("Toggle like error:", error);
      return res.status(500).json({
        message: "Server error occurred while toggling like.",
      });
    }
  });

Posts.get("/:postId/comment", async (req, res) => {
  const postId = req.params.postId;
  try {
    const comments = await getCommentByPostId(postId);
    return res.status(200).json(comments);
  } catch (error) {
    console.error("Toggle like error:", error);
    return res.status(500).json({ message: "Server error occurred while toggling like." });
  }
});

Posts.post("/:postId/comment",validateToken,async (req,res)=>{
  const postId = req.params.postId;
  const userId = req.user.userId 
  const {comment} = req.body
  try{
    const newComment = await createComment(postId,userId,comment)
    const comments = await getCommentByPostId(postId)
    const user = await getUserProfileById(userId)
    if(user.role!=="admin"){createNotifications("user_commented", userId, postId, newComment[0].id)}
    createNotifications("other_user_commented", userId, postId,newComment[0].id)
    return res.status(200).json(comments)
  }catch (error) {
    console.error("Toggle like error:", error);
    return res.status(500).json({message: "Server error occurred while toggling like.",})
  }
});
  
export default Posts;
