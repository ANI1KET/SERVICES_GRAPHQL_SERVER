import {
  getUser,
  getUsers,
  getUserById,
  getUserReviewsById,
} from "../../controllers/users.js";
import {
  getRoom,
  getRooms,
  getRoomReviewsById,
  getUserCreatedRooms,
  updateRoomAvailability,
} from "../../controllers/rooms.js";
import {
  getReview,
  getReviews,
  getRoomReviews,
  getUserRoomReviews,
} from "../../controllers/reviews.js";
import { getUserListedRoomStats } from "../../controllers/dashboard.js";
import { User } from "@prisma/client";

export const graphQLResolver = {
  Mutation: {
    // ROOM UPDATE
    updateRoomAvailability,
  },
  Query: {
    // USER
    user: getUser,
    users: getUsers,
    // ROOM
    room: getRoom,
    rooms: getRooms,
    // REVIEW
    review: getReview,
    reviews: getReviews,
    // DASHBOARD
    totalListedRoom: getUserListedRoomStats,
  },
  User: {
    rooms: getUserCreatedRooms,
    roomReviews: getUserRoomReviews,
  },
  Room: {
    user: getUserById,
    reviews: getRoomReviews,
  },
  RoomReview: {
    user: getUserReviewsById,
    room: getRoomReviewsById,
  },
};
