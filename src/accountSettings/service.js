// import prisma from "../utils/auth-utils/prisma-transport.js";

// export async function getProfileByEmail(email) {
//   return await prisma.profileImage.findUnique({
//     where: { email },
//   });
// }

// export async function updateProfileImage(email, imageUrl) {
//   const existing = await prisma.profileImage.findUnique({ where: { email } });

//   if (existing) {
//     return await prisma.profileImage.update({
//       where: { email },
//       data: { imageUrl },
//     });
//   } else {
//     return await prisma.profileImage.create({
//       data: { email, imageUrl },
//     });
//   }
// }
