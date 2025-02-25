import { Room, RoomReview, User } from "@prisma/client";

import { prismaClient } from "../../server.js";

// UNDER PARENT
export const getRoomReviews = async (room: Room) =>
  await prismaClient.roomReview.findMany({ where: { roomId: room.id } });

export const getUserRoomReviews = async (user: User) =>
  await prismaClient.roomReview.findMany({ where: { userId: user.id } });
