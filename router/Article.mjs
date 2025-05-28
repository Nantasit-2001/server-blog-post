import { Router } from "express";
import { getArticleInfo,getArticleById,deleteArticle,putArticle ,postArticle,getImageUrlByPostId} from "../models/articleModel.mjs";
import unpackFormData from "../middleware/unpackFormData.js";
import { deleteImageToCloudinary,uploadImageToCloudinary } from "../models/cloudinary.mjs";
const Article = Router();

Article.get('/', async (req,res)=>{
  try{
    const article = await getArticleInfo()
    return res.status(200).json(article);
}catch (error) {
  console.error("❌ error:", error);
  res.status(500).json({ message: "Internal server error" });
}
})


Article.get('/:postId', async (req,res)=>{
  try{
    const {postId} = req.params;
    const post = await getArticleById(postId)
    return res.status(200).json(post);
}catch (error) {
  console.error("❌ error:", error);
  res.status(500).json({ message: "Internal server error" });
}
})

Article.put('/:postId', unpackFormData.single('image'), async (req, res) => {
  try {
    let { title, description, content, category_id, status, imageUrl } = req.body;
    const image = req.file;
    const { postId } = req.params;
    if (image) {
      // หากมี image ใหม่ และมี imageUrl เดิม → ลบภาพเก่าก่อน
      if (imageUrl && imageUrl.includes("res.cloudinary.com")) {
        try {
          await deleteImageToCloudinary(imageUrl);
        } catch (err) {
          console.warn("⚠️ ไม่สามารถลบรูปจาก Cloudinary ได้:", err.message);
        }
      }
      const uploadResult = await uploadImageToCloudinary(image, "article-images");
  
      imageUrl = uploadResult.secure_url;
    }
     const isUpdate = await putArticle(postId,title,description,content,category_id,status,imageUrl);
     return res.status(200).json(isUpdate);
  }catch (error) {
    console.error("❌ error:", error);
    res.status(500).json({ message: "Internal server error" });
  } 
})


Article.post('/', unpackFormData.single('image'), async (req, res) => {
  try {
    const { title, description, content, category_id, status} = req.body;
    const image = req.file;
    
    const uploadResult = await uploadImageToCloudinary(image, "article-images");
    console.log("✅ uploadResult:", uploadResult);
    
    const imageUrl = uploadResult.secure_url;
    const isPosted = await postArticle(title,description,content,category_id,status,imageUrl);
     return res.status(200).json(isPosted);
  }catch (error) {
    console.error("❌ error:", error);
    res.status(500).json({ message: "Internal server error" });
  } 
})

Article.delete('/:postId', async (req,res)=>{
  try{
    const {postId} = req.params;
    const imageUrl = await getImageUrlByPostId(postId)
     if (imageUrl && imageUrl.includes("res.cloudinary.com")) {
        try {
          await deleteImageToCloudinary(imageUrl);
        } catch (err) {
          console.warn("⚠️ ไม่สามารถลบรูปจาก Cloudinary ได้:", err.message);
        }
      }

    const isDeleteArticle = await deleteArticle(postId)

    return res.status(200).json(isDeleteArticle);
}catch (error) {
  console.error("❌ error:", error);
  res.status(500).json({ message: "Internal server error" });
}
})
export default Article;