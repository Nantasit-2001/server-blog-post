import { Router } from "express";
import bcrypt from 'bcryptjs';
import { validateToken } from "../middleware/ValidateToken.js";
import { findUserById,findUserByUsername,updateUserPasswordById,updateUserProfileById } from "../models/userModel.mjs";

const Profile = Router();

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
      return res.status(401).json({ field: "currentPassword", message: "Incorrect current password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPasswordById(userId, hashedNewPassword);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Change password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

Profile.patch('/reset-profile', validateToken, async (req, res) => {
  const { name, username, image } = req.body;
  const userId = req.user.userId;
  try {
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const existingUsername = await findUserByUsername(username);
    console.log(existingUsername,existingUsername.id)
        if (existingUsername && existingUsername.id !== userId ) {
          console.log(existingUsername,existingUsername.userId)
          return res.status(400).json({ field: "username", message: "Username already in use" });
        }

    await updateUserProfileById( userId, name,username,image)
    res.status(200).json({message:"Profile updated successfully"});
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

  export default Profile;