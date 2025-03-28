import { InterestedRooms } from "@prisma/client";

import { prismaClient } from "../../server.js";

export const getInterestedRooms = async (
  _: InterestedRooms,
  arg: { listerId: string }
) => {
  return await prismaClient.interestedRooms.findMany({
    where: {
      listerId: arg.listerId,
    },
    select: {
      id: true,
      roomId: true,
      room: {
        select: {
          city: true,
          price: true,
          location: true,
          amenities: true,
          direction: true,
          available: true,
          mincapacity: true,
          maxcapacity: true,
          ownerContact: true,
          primaryContact: true,
          furnishingStatus: true,
        },
      },
      interestedBy: {
        select: {
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              number: true,
            },
          },
        },
      },
    },
  });
};
