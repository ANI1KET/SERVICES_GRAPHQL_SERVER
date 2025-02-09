import { Room, RoomReview, User } from "@prisma/client";

import { prismaClient } from "../server.js";

// QUERY
export const getUserRoomReviews = async (user: User) =>
  await prismaClient.roomReview.findMany({ where: { userId: user.id } });

export const getRoomReviews = async (room: Room) =>
  await prismaClient.roomReview.findMany({ where: { roomId: room.id } });

export const getReview = async (_: RoomReview, arg: { id: string }) =>
  await prismaClient.roomReview.findUnique({
    where: { id: arg.id },
  });

export const getReviews = async () => await prismaClient.roomReview.findMany();
