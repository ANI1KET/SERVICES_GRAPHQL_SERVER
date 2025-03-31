import { Permission } from "@prisma/client";

import { prismaClient } from "../server.js";

export const downGradeUser = async () => {
  const currentDate = new Date();

  const expiredSubs = await prismaClient.subscription.findMany({
    where: { expiresAt: { lte: currentDate } },
    select: {
      userId: true,
      permissions: true,
      user: { select: { role: true } },
    },
  });

  if (!expiredSubs.length) return;

  const subscriptionUpdates = [];
  const userUpdates = [];
  const roomDeactivations = [];
  const storeDeactivations = [];
  const subscriptionDeletions = [];

  for (const { userId, permissions, user } of expiredSubs) {
    const existingPermissions = { ...(permissions as Record<string, string>) };
    const expiredPermissions = Object.keys(existingPermissions).filter(
      (perm) => new Date(existingPermissions[perm]) <= currentDate
    );

    expiredPermissions.forEach((perm) => delete existingPermissions[perm]);
    const remainingPermissions = Object.keys(existingPermissions);

    let newRole = user.role;
    if (!remainingPermissions.length) {
      subscriptionDeletions.push(
        prismaClient.subscription.delete({ where: { userId } })
      );

      if (user.role === "OWNER" || user.role === "BROKER") {
        newRole = "USER";
      }

      userUpdates.push({
        where: { id: userId },
        data: { permission: [], role: newRole },
      });
    } else {
      const newExpiresAt = new Date(
        Math.min(...Object.values(existingPermissions).map(Date.parse))
      );

      subscriptionUpdates.push({
        where: { userId },
        data: { permissions: existingPermissions, expiresAt: newExpiresAt },
      });

      userUpdates.push({
        where: { id: userId },
        data: {
          permission: remainingPermissions as Permission[],
          role: newRole,
        },
      });
    }

    if (expiredPermissions.includes("room")) roomDeactivations.push(userId);
    if (expiredPermissions.includes("store")) storeDeactivations.push(userId);
  }

  await prismaClient.$transaction([
    ...subscriptionUpdates.map((update) =>
      prismaClient.subscription.update(update)
    ),
    ...userUpdates.map((update) => prismaClient.user.update(update)),
    ...(roomDeactivations.length
      ? [
          prismaClient.room.updateMany({
            where: { listerId: { in: roomDeactivations } },
            data: { isActive: false },
          }),
        ]
      : []),
    ...subscriptionDeletions,
  ]);
};
