import { prismaClient } from "../server.js";
import { Context } from "../types/express.js";

// QUERY
export const getUserListedRoomStats = async (_: any, arg: { id: string }) => {
  const [cityWiseStats, overallStats] = await Promise.all([
    prismaClient.room.groupBy({
      by: ["city"],
      where: { listerId: arg.id },
      _count: {
        _all: true,
        available: true,
      },
    }),
    prismaClient.room.aggregate({
      where: { listerId: arg.id },
      _count: {
        _all: true,
        available: true,
      },
    }),
  ]);

  return {
    totalRoomsListed: overallStats._count._all,
    totalAvailableRooms: overallStats._count.available,
    cityWiseStats: cityWiseStats.map((stat) => ({
      city: stat.city,
      totalRooms: stat._count._all,
      availableRooms: stat._count.available,
      unavailableRooms: stat._count._all - stat._count.available,
    })),
  };
};

export const userCategoryStats = async (
  _: any,
  arg: { id: string },
  context: Context
) => {
  if (context.user?.role !== "ADMIN") {
    throw new Error("You are not authorized to access this data");
  }

  const RoleWiseStats = await prismaClient.user.aggregateRaw({
    pipeline: [
      {
        $match: {
          role: { $in: ["BROKER", "OWNER"] },
        },
      },
      {
        $group: {
          _id: "$role",
          total: { $sum: 1 },
          users: {
            $push: {
              role: "$role",
              email: "$email",
              permission: "$permission",
              id: { $toString: "$_id" },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          k: "$_id",
          v: { total: "$total", users: "$users" },
        },
      },
      {
        $group: {
          _id: null,
          data: { $push: { k: "$k", v: "$v" } },
        },
      },
      {
        $replaceWith: { $arrayToObject: "$data" },
      },
    ],
  });

  return RoleWiseStats;
};
