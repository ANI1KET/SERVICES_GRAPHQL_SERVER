import { Room, RoomReview, User } from "@prisma/client";

import { prismaClient } from "../server.js";
import { Context } from "../types/express.js";

// QUERY
export const getUserById = async (room: Room) =>
  await prismaClient.user.findUnique({
    where: {
      id: room.userId,
    },
  });

export const getUserReviewsById = async (roomReview: RoomReview) =>
  await prismaClient.user.findUnique({
    where: {
      id: roomReview.userId,
    },
  });

export const getUser = async (
  _: User,
  args: { id: string; offset: number; limit: number }
) =>
  await prismaClient.user.findUnique({
    where: { id: args.id },
  });

export const getUsers = async (_: User, __: any, context: Context) =>
  await prismaClient.user.findMany();
