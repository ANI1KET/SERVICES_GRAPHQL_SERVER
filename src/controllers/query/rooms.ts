import { Room } from "@prisma/client";

import { prismaClient } from "../../server.js";

// QUERY
export const getRoom = async (_: Room, arg: { id: string }) =>
  await prismaClient.room.findUnique({
    where: { id: arg.id },
  });

export const getRooms = async () => await prismaClient.room.findMany();

export const getUserListedRoomCitiesLocations = async (
  _: Room,
  arg: { id: string }
) => {
  const roomsCitiesLocations = await prismaClient.room.findMany({
    where: { userId: arg.id },
    select: {
      city: true,
      location: true,
    },
  });

  return roomsCitiesLocations;
};

export const getCityLocationRooms = async (
  _: Room,
  args: { city: string; location?: string; offset: number; limit: number }
) =>
  await prismaClient.room.findMany({
    where: {
      city: args.city,
      ...(args.location && { location: args.location }),
    },
    skip: args.offset,
    take: args.limit,
  });
