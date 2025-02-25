import { Room, RoomReview, User } from "@prisma/client";

import { prismaClient } from "../../server.js";

// QUERY
export const getReview = async (_: RoomReview, arg: { id: string }) =>
  await prismaClient.roomReview.findUnique({
    where: { id: arg.id },
  });

export const getReviews = async () => await prismaClient.roomReview.findMany();
