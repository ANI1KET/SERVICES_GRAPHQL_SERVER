import { User } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { Request, NextFunction, Response } from "express";

import { ErrorCode } from "../exceptions/errorhandler.js";
import { UnauthorizedException } from "../exceptions/unauthorized.js";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decodedToken = await getToken({
      req,
      secret: process.env.JWT_TOKEN_SECRET,
    });
    console.log("! ", req.cookies);

    if (!decodedToken) {
      return res.status(401).json({ message: "Please log in to continue" });
    }

    if (decodedToken.role === "USER") {
      return res
        .status(403)
        .json({ message: "You are not authorized to access" });
    }

    req.user = {
      id: decodedToken.userId,
      name: decodedToken.name,
      role: decodedToken.role,
      email: decodedToken.email,
      number: decodedToken.number,
      permission: decodedToken.permission,
    } as User;

    return next();
  } catch (e) {
    return new UnauthorizedException(
      "Unauthorized Excess",
      ErrorCode.UNAUTHORIZED
    );
  }
};

export default authMiddleware;
