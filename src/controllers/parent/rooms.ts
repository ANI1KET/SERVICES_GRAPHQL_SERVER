import { RoomReview, User } from "@prisma/client";

import { prismaClient } from "../../server.js";

// UNDER PARENT
export const getUserCreatedRooms = async (
  user: User,
  args: { offset?: number; limit?: number }
) =>
  await prismaClient.room.findMany({
    where: { listerId: user.id },
    skip: args.offset,
    take: args.limit,
  });

export const getRoomReviewsById = async (roomReview: RoomReview) =>
  await prismaClient.room.findMany({ where: { id: roomReview.roomId } });
