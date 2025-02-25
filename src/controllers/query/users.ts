import { User } from "@prisma/client";

import { prismaClient } from "../../server.js";
import { Context } from "../../types/express";

// QUERY
export const getUser = async (
  _: User,
  args: { id: string; offset: number; limit: number },
  context: Context
) => {
  if (context.user?.role === "USER" && context.user?.permission.length === 0) {
    throw new Error("You are not authorized to access this data");
  }

  return await prismaClient.user.findUnique({
    where: { id: args.id },
  });
};

export const getUsers = async (_: User, __: any, context: Context) => {
  if (context.user?.role !== "ADMIN") {
    throw new Error("You are not authorized to access this data");
  }

  return await prismaClient.user.findMany();
};

export const userByEmailOrNumber = async (
  _: User,
  args: { email?: string; number?: string },
  context: Context
) => {
  if (context.user?.role !== "ADMIN") {
    throw new Error("You are not authorized to access this data");
  }

  if (!args.email && !args.number) {
    throw new Error("Provide filtering value to find user");
  }

  console.log(args);
  return await prismaClient.user.findFirst({
    where: args.email ? { email: args.email } : { number: args.number },
  });
};
