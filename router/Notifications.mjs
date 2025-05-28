import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validatePost } from "../middleware/validatePost.js";
import { validateToken } from "../middleware/ValidateToken.js";
import { updateLikes_Count } from "../models/postModel.mjs";
import { updateLike,getLike_Count,checkLikeByUser } from "../models/likeModel.mjs";
import { getCommentByPostId,createComment } from "../models/comment.mjs";

const Notifications = Router();


  export default Notifications;