import { Room, RoomReview, User } from "@prisma/client";

import { prismaClient } from "../../server.js";
import { Context } from "../../types/express.js";

// UNDER PARENT
export const getUserById = async (room: Room, _: any, context: Context) => {
  if (!context.user?.permission.includes("room")) {
    throw new Error("You are not authorized to access this data");
  }

  return await prismaClient.user.findUnique({
    where: {
      id: room.listerId,
    },
  });
};

export const getUserReviewsById = async (
  roomReview: RoomReview,
  _: any,
  context: Context
) => {
  if (!context.user?.permission.includes("room")) {
    throw new Error("You are not authorized to access this data");
  }

  return await prismaClient.user.findUnique({
    where: {
      id: roomReview.userId,
    },
  });
};
