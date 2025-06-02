import { Router } from "express";
import { getNotificationAdmin,getNotification,is_readNotification } from "../models/notifications.mjs";
import { getUserProfileById } from "../models/userModel.mjs";
const Notifications = Router();

Notifications.get("/admin", async (req, res) => {
    try {
      const notification = await getNotificationAdmin()
      const notificationsWithProfile = await Promise.all(
      notification.map(async (notif) => {
      const profile = await getUserProfileById(notif.sender_user_id);
        return {
            ...notif,
            name: profile.name,
            image: profile.profile_pic,
        };
      })
      );
      return res.status(200).json(notificationsWithProfile)
    } catch (error) {
      console.error("adminNotification error:", error);
      return res.status(500).json({
        message: "Server error (Notification).",
      });
    }
  });

Notifications.get("/user", async (req, res) => {
    try {
      const notification = await getNotification()
      const notificationsWithProfile = await Promise.all(
      notification.map(async (notif) => {
      const profile = await getUserProfileById(notif.sender_user_id);
        return {
            ...notif,
            name: profile.name,
            image: profile.profile_pic,
        };
      })
      );
      return res.status(200).json(notificationsWithProfile)
    } catch (error) {
      console.error("Notification error:", error);
      return res.status(500).json({
        message: "Server error (Notification).",
      });
    }
  });

  Notifications.patch("/read",async(req,res)=>{
    try {
      const {id_notification} =req.body
      await is_readNotification(id_notification)
      return res.status(200).json({message: "is_reade = true"})
    } catch (e) {
      console.error('Failed to update notification:', e);
      return null;
    }
  })

  export default Notifications;