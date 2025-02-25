import { User } from "@prisma/client";
import { Request, NextFunction, Response } from "express";

import { ErrorCode } from "../exceptions/errorhandler.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = req.headers["x-user-role"] as string;
    const permissionHeader = req.headers["x-user-permission"] as string;

    const permission = permissionHeader ? JSON.parse(permissionHeader) : [];

    if (!role || !permission.length) {
      return res.status(401).json({ message: "Please log in to continue" });
    }

    if (role === "USER") {
      return res
        .status(403)
        .json({ message: "You are not authorized to access" });
    }

    req.user = { role, permission } as User;

    return next();
  } catch (e) {
    return new UnauthorizedException(
      "Unauthorized Excess",
      ErrorCode.UNAUTHORIZED
    );
  }
};

export default authMiddleware;
