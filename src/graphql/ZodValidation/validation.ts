import { permission } from "process";
import { z } from "zod";

export const updateRoomSchema = z.object({
  ownerContact: z
    .string()
    .length(10, "Owner contact must be exactly 10 digits")
    .optional(),
  primaryContact: z
    .string()
    .length(10, "Primary contact must be exactly 10 digits")
    .optional(),
  id: z.string().length(24),
  price: z.number().optional(),
  available: z.boolean().optional(),
  amenities: z.array(z.string()).optional(),
  furnishingStatus: z
    .enum(["UNFURNISHED", "SEMIFURNISHED", "FURNISHED"])
    .optional(),
});

export const updateRolePermissionSchema = z.object({
  role: z.enum(["USER", "OWNER", "BROKER"]),
  permission: z.array(
    z.enum([
      "room",
      "land",
      "store",
      "rental",
      "repair",
      "hostel",
      "restaurant",
    ])
  ),
});
