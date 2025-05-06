import { Router } from "express";
import bcrypt from 'bcryptjs';
import { validateToken } from "../middleware/ValidateToken.js";
import { findUserById,findUserByUsername,updateUserPasswordById,updateUserProfileById,getUserProfileById } from "../models/userModel.mjs";
import { uploadImageToCloudinary,deleteImageToCloudinary } from "../models/cloudinary.mjs";
import unpackFormData from "../middleware/unpackFormData.js";
const Profile = Router();

Profile.get("/",validateToken,async(req,res)=>{
  const userId = req.user.userId
  try{
  const result = await getUserProfileById(userId)
  return res.status(200).json(result)
}catch (error) {
  console.error("❌ error:", error);
  res.status(500).json({ message: "Internal server error" });}
})

Profile.patch('/reset-password',validateToken, async (req, res) => {
    const userId = req.user.userId;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ field: "currentPassword", message: "Incorrect current password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPasswordById(userId, hashedNewPassword);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Change password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

Profile.patch('/reset-profile', validateToken,unpackFormData.single('image'), async (req, res) => {
  const { name, username } = req.body;
  const image = req.file;
  const userId = req.user.userId;
  try {
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingUsername = await findUserByUsername(username);
    if (existingUsername && existingUsername.id !== userId) {
      return res.status(400).json({ field: "username", message: "Username already in use" });
    }

    let imageUrl = user.profile_pic;
    if (image) {
      if(imageUrl){
          await deleteImageToCloudinary(imageUrl)
      }
      const uploadResult = await uploadImageToCloudinary(image);
      console.log(uploadResult)
      imageUrl = uploadResult.secure_url;
    }

    await updateUserProfileById(userId, name, username, imageUrl);

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

  export default Profile;