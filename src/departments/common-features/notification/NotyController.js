// import axios from "axios";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// // import {
// //   createNotification,
// //   markAsRead,
// //   markAsStarred,
// //   unStarNotification,
// //   getNotificationsByRecepient,
// //   deleteNotification,
// // } from "./noty-sql.js";
// import errorResponse from "../../../utils/auth-utils/error-response.js";
// import logger from "../../../utils/auth-utils/logger.js";
// import Utils from "../../../utils/auth-utils/utils.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// class NotyController {
//   constructor() {
//     this.imageDirPath = path.join(__dirname, "../../../assets/profile-images");
//     this.defaultImageUrl = path.join(
//       __dirname,
//       "../../../assets/profile-images/profile_pic.png"
//     );
//     this.defaultEmailSubject = "VGAD Notification";
//     this.VISION_GROUP_CMS_ROOT_URL = process.env.VISION_GROUP_CMS_ROOT_URL;
//   }

//   async createNotification(recepient, body, image_url = "") {
//     if (!recepient || !body) {
//       logger.warn("Recepient or body is missing.");
//       return errorResponse(400, "Recepient and body are required.");
//     }

//     try {
//       const imagePath = await Utils.getImagePath(this.imageDirPath, recepient);
//       image_url = imagePath || this.defaultImageUrl;

//       //Uncomment this code when we connect to the Vision Group Custom Api
//       // await this.#sendEmailNotification(
//       //   recepient,
//       //   this.defaultEmailSubject,
//       //   body
//       // );

//       const notification = await createNotification(body, image_url, recepient);

//       if (!notification) {
//         return errorResponse(500, "Failed to create notification");
//       }

//       return notification;
//     } catch (error) {
//       logger.error("Error creating notification:", error.message || error);
//       return errorResponse(
//         500,
//         "An error occurred while creating the notification"
//       );
//     }
//   }

//   async markAsRead(id) {
//     logger.info(`Marking notification with id ${id} as read.`);
//     const notification = await markAsRead(id);
//     if (!notification) {
//       return errorResponse(500, "Failed to mark notification as read");
//     }
//     return notification;
//   }

//   async markAsStarred(id) {
//     logger.info(`Marking notification with id ${id} as starred.`);
//     const notification = await markAsStarred(id);
//     if (!notification) {
//       return errorResponse(500, "Failed to mark notification as starred");
//     }
//     return notification;
//   }

//   async unmark(id) {
//     logger.info(`Unmarking a notification with id ${id}`);
//     const notification = await unStarNotification(id);
//     if (!notification) {
//       return errorResponse(500, "Failed to unmark notification");
//     }
//     return notification;
//   }

//   async getNotificationsByRecepient(recepient) {
//     logger.info(`Getting notifications for ${recepient}.`);
//     const notifications = await getNotificationsByRecepient(recepient);
//     if (!notifications) {
//       return errorResponse(500, "Failed to get notifications");
//     }
//     return notifications;
//   }

//   async deleteNotification(id) {
//     logger.info(`Deleting notification with id ${id}.`);
//     const notification = await deleteNotification(id);
//     if (!notification) {
//       return errorResponse(500, "Failed to delete notification");
//     }
//     return notification;
//   }

//   //Do not delete even when it shows a red underline warning
//   async #sendEmailNotification(recepient, subject, body) {
//     try {
//       logger.info(`Sending email notification to ${recepient}.`);
//       await axios.post(this.VISION_GROUP_CMS_ROOT_URL + "send-email", {
//         recepient,
//         subject,
//         body,
//       });
//     } catch (error) {
//       logger.error(
//         "Failed to send email notification:",
//         error.message || error
//       );
//     }
//   }
// }

// export default NotyController;
