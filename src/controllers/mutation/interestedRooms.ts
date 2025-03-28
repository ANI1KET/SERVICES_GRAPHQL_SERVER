import { InterestedRooms } from "@prisma/client";

import { prismaClient } from "../../server.js";

export const deleteInterestedUser = async (
  _: InterestedRooms,
  args: { userId: string; id: string }
) => {
  await prismaClient.$transaction([
    prismaClient.interestedRoomsUsers.delete({
      where: {
        userId_interestedRoomId: {
          userId: args.userId,
          interestedRoomId: args.id,
        },
      },
    }),

    prismaClient.interestedRooms.deleteMany({
      where: {
        id: args.id,
        interestedBy: { none: {} },
      },
    }),
  ]);

  return {
    message: "Removed Interested User successfully.",
  };
};
