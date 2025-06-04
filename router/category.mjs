import { Router } from "express";
import { getCategory,postCategory,deleteCategory,putCategory } from "../models/category.mjs";

const Categories = Router();

Categories.get('/', async (req,res)=>{
  try{
    const Category = await getCategory()
    return res.status(200).json(Category);
}catch (error) {
  console.error("❌ error:", error);
  res.status(500).json({ message: "Internal server error" });
}
})

Categories.post('/', async (req,res)=>{
    const {category} = req.body
    try{
    const newCategory = await postCategory(category)
    return res.status(200).json(newCategory);
}catch (error) {
  console.error("❌ error:", error);
  res.status(500).json({ message: "Internal server error" });
}
})

Categories.put('/', async (req,res)=>{
    const {oldCategory,newCategory} = req.body
    try{
    const updateCategory = await putCategory(oldCategory,newCategory)
    return res.status(200).json(updateCategory);
}catch (error) {
  console.error("❌ error:", error);
  res.status(500).json({ message: "Internal server error" });
}
})

Categories.delete('/', async (req, res) => {
  const category = req.query.category; // ✅ รับจาก query string เช่น ?category=food
  try {
    const result = await deleteCategory(category); // สมมุติใช้ฟังก์ชัน deleteCategory()
    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

  export default Categories;