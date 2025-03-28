import { Permission, Role, User } from "@prisma/client";

import { prismaClient } from "../../server.js";
import { Context } from "../../types/express.js";

export const updateRolePermission = async (
  _: User,
  args: {
    role?: Role;
    userId: string;
    durationInDays: number;
    permission: Permission;
  },
  context: Context
) => {
  if (context.user?.role !== "ADMIN") {
    throw new Error("You are not authorized to access this data");
  }

  const { userId, permission, durationInDays, role } = args;

  const subscription = await prismaClient.subscription.findUnique({
    where: { userId: userId },
    select: { permissions: true },
  });

  const currentDate = new Date();
  const existingPermissions =
    (subscription?.permissions as Record<string, string>) || {};

  const currentExpiry = existingPermissions[permission]
    ? new Date(existingPermissions[permission])
    : currentDate;
  currentExpiry.setDate(currentExpiry.getDate() + durationInDays);

  const updatedPermissions = {
    ...existingPermissions,
    [permission]: currentExpiry.toISOString(),
  };

  const expiresAt = new Date(
    Math.min(
      ...Object.values(updatedPermissions).map((date) =>
        new Date(date as string).getTime()
      )
    )
  );

  await prismaClient.$transaction([
    prismaClient.subscription.upsert({
      where: { userId },
      update: {
        permissions: updatedPermissions,
        expiresAt: new Date(expiresAt),
      },
      create: {
        userId,
        permissions: updatedPermissions,
        expiresAt: new Date(expiresAt),
      },
    }),
    prismaClient.user.update({
      where: { id: userId },
      data: {
        permission: Object.keys(updatedPermissions) as Permission[],
        role: role,
      },
    }),
    ...(permission === "room"
      ? [
          prismaClient.room.updateMany({
            where: { userId },
            data: { isActive: true },
          }),
        ]
      : []),
    ...(permission === "store"
      ? [
          prismaClient.store.updateMany({
            where: { userId },
            data: { isActive: true },
          }),
        ]
      : []),
  ]);

  return {
    message: "Subscription updated successfully.",
  };
};

export const downgradePermission = async (
  _: User,
  args: {
    userId: string;
    permission: Permission;
  },
  context: Context
) => {
  if (context.user?.role !== "ADMIN") {
    throw new Error("You are not authorized to access this data");
  }

  const { userId, permission } = args;

  const subscription = await prismaClient.subscription.findUnique({
    where: { userId: userId },
    select: { permissions: true, expiresAt: true },
  });

  const existingPermissions = {
    ...(subscription?.permissions as Record<string, string>),
  };

  delete existingPermissions[permission];

  const newExpiresAt = new Date(
    Math.min(...Object.values(existingPermissions).map(Date.parse))
  );

  await prismaClient.$transaction([
    prismaClient.subscription.update({
      where: { userId },
      data: { permissions: existingPermissions, expiresAt: newExpiresAt },
    }),
    prismaClient.user.update({
      where: { id: userId },
      data: {
        permission: Object.keys(existingPermissions) as Permission[],
      },
    }),
    ...(permission === "room"
      ? [
          prismaClient.room.updateMany({
            where: { userId: userId },
            data: { isActive: false },
          }),
        ]
      : []),
    ...(permission === "store"
      ? [
          prismaClient.store.updateMany({
            where: { userId: userId },
            data: { isActive: false },
          }),
        ]
      : []),
  ]);

  return {
    message: "Downgraded Permission successfully.",
  };
};

export const removeUserSubs = async (
  _: User,
  args: {
    userId: string;
    permission: Permission;
  },
  context: Context
) => {
  if (context.user?.role !== "ADMIN") {
    throw new Error("You are not authorized to access this data");
  }

  const { userId } = args;

  await prismaClient.$transaction([
    prismaClient.subscription.delete({
      where: { userId },
    }),
    prismaClient.user.update({
      where: { id: userId },
      data: {
        role: "USER",
        permission: [],
      },
    }),
    prismaClient.room.updateMany({
      where: { userId: userId },
      data: { isActive: false },
    }),
    prismaClient.store.updateMany({
      where: { userId: userId },
      data: { isActive: false },
    }),
  ]);

  return {
    message: "Removed User Subscription successfully.",
  };
};
