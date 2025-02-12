import { Room, RoomReview, User } from "@prisma/client";

import { prismaClient } from "../server.js";

// QUERY
export const getUserCreatedRooms = async (
  user: User,
  args: { offset?: number; limit?: number }
) =>
  await prismaClient.room.findMany({
    where: { userId: user.id },
    skip: args.offset,
    take: args.limit,
  });

export const getRoomReviewsById = async (roomReview: RoomReview) =>
  await prismaClient.room.findMany({ where: { id: roomReview.roomId } });

export const getRoom = async (_: Room, arg: { id: string }) =>
  await prismaClient.room.findUnique({
    where: { id: arg.id },
  });

export const getRooms = async () => await prismaClient.room.findMany();

// MUTATION
export const updateRoomAvailability = async (
  _: Room,
  args: { id: string; availability: boolean }
) =>
  await prismaClient.room.update({
    where: { id: args.id },
    data: {
      available: args.availability,
    },
  });
