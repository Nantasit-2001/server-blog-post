import connectionPool from "../utils/db.mjs";

export const updateLike = async (postId,userId,checkLike)=>{
    try{
      if(checkLike.rowCount > 0){
      await connectionPool.query(`DELETE FROM likes WHERE post_id = $1 AND user_id = $2`,[postId, userId]);
      return {liked:false}   
    }else {
      await connectionPool.query(`INSERT INTO likes (post_id, user_id, liked_at) VALUES ($1, $2, NOW())`, [postId, userId])
      return {liked:true  }
    }
    }catch(e){return(res.status(500).json({ error: 'Failed to update profile' }))}
};
  
export const getLike_Count = async(postId)=>{
    try {
        const res = await connectionPool.query(`SELECT COUNT(*) FROM likes WHERE post_id = $1;`,[postId]);
        return res.rows[0]
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update profile' });
    }
};

export const checkLikeByUser = async (postId,userId)=>{
    try{ 
        const res = await connectionPool.query(`SELECT id FROM likes WHERE post_id = $1 AND user_id = $2`,
        [postId, userId]);
       return res
     }catch(e){console.log(e)
    }
}