import prisma from "../utils/auth-utils/prisma-transport.js";

export const getProfileByEmail = async (email) => {
  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      first_name: true,
      last_name: true,
      email: true,
      profile_picture: true,
      department_users_departmentTodepartment: {
        select: { name: true },
      },
      position_users_positionToposition: {
        select: { name: true },
      },
    },
  });

  if (!user) return null;

  return {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    profile_picture: user.profile_picture,
    department: user.department_users_departmentTodepartment?.name || null,
    position: user.position_users_positionToposition?.name || null,
  };
};

export const updateProfileImage = async (email, imagePath) => {
  return await prisma.users.update({
    where: { email },
    data: { profile_picture: imagePath },
  });
};
