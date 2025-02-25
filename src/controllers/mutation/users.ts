import { Permission, Role, User } from "@prisma/client";

import { prismaClient } from "../../server.js";
import { Context } from "../../types/express.js";

export const updateRolePermission = async (
  _: User,
  args: { id: string; role?: Role; permission: [Permission] },
  context: Context
) => {
  if (context.user?.role !== "ADMIN") {
    throw new Error("You are not authorized to access this data");
  }

  await prismaClient.user.update({
    where: { id: args.id },
    data: {
      ...(args.role && { role: args.role }),
      permission: args.permission,
    },
  });

  return { message: "Update success" };
};
