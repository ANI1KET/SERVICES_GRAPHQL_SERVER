import { FurnishingStatusEnum, Room } from "@prisma/client";

import { prismaClient } from "../../server.js";
import { updateRoomSchema } from "../../graphql/ZodValidation/validation.js";

// MUTATION
export const updateRoomAvailability = async (
  _: Room,
  args: {
    id: string;
    price?: number;
    available?: boolean;
    amenities?: string[];
    ownerContact?: string;
    primaryContact?: string;
    furnishingStatus?: FurnishingStatusEnum;
  }
) => {
  const validatedData = updateRoomSchema.parse(args);

  const data: Record<string, any> = {};
  if (validatedData.price !== undefined) data.price = validatedData.price;
  if (validatedData.available !== undefined)
    data.available = validatedData.available;
  if (validatedData.ownerContact !== undefined)
    data.ownerContact = validatedData.ownerContact;
  if (validatedData.primaryContact !== undefined)
    data.primaryContact = validatedData.primaryContact;
  if (validatedData.furnishingStatus !== undefined)
    data.furnishingStatus = validatedData.furnishingStatus;
  if (validatedData.amenities && validatedData.amenities.length > 0) {
    data.amenities = { push: validatedData.amenities };
  }

  if (Object.keys(data).length === 0) {
    return { message: "No valid fields provided for update." };
  }

  await prismaClient.room.update({
    where: { id: validatedData.id },
    data,
  });

  return { message: "Update success" };
};

export const deleteRoom = async (_: Room, arg: { id: string }) => {
  await prismaClient.room.delete({
    where: {
      id: arg.id,
    },
  });

  return { message: "Deleted Successfully" };
};
