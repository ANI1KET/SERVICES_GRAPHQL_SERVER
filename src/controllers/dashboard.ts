import { prismaClient } from "../server.js";

// QUERY
export const getUserListedRoomStats = async (_: any, arg: { id: string }) => {
  //   const stats = await prismaClient.room.groupBy({
  //     by: ["city"],
  //     where: { userId: arg.id },
  //     _count: {
  //       _all: true,
  //       available: true,
  //     },
  //   });
  const [cityWiseStats, overallStats] = await Promise.all([
    prismaClient.room.groupBy({
      by: ["city"],
      where: { userId: arg.id },
      _count: {
        _all: true,
        available: true,
      },
    }),
    prismaClient.room.aggregate({
      where: { userId: arg.id },
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
