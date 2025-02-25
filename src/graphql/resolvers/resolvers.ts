import {
  getRoom,
  getRooms,
  getCityLocationRooms,
  getUserListedRoomCitiesLocations,
} from "../../controllers/query/rooms.js";
import {
  getRoomReviewsById,
  getUserCreatedRooms,
} from "../../controllers/parent/rooms.js";
import {
  getUserById,
  getUserReviewsById,
} from "../../controllers/parent/users.js";
import {
  deleteRoom,
  updateRoomAvailability,
} from "../../controllers/mutation/rooms.js";
import {
  getRoomReviews,
  getUserRoomReviews,
} from "../../controllers/parent/roomReviews.js";
import {
  userCategoryStats,
  getUserListedRoomStats,
} from "../../controllers/dashboard.js";
import {
  getUser,
  getUsers,
  userByEmailOrNumber,
} from "../../controllers/query/users.js";
import { updateRolePermission } from "../../controllers/mutation/users.js";
import { getReview, getReviews } from "../../controllers/query/roomReviews.js";

export const graphQLResolver = {
  Mutation: {
    // USER UPDATE
    updateRolePermission,
    // ROOM UPDATE
    deleteRoom,
    updateRoomAvailability,
  },
  Query: {
    // USER
    user: getUser,
    users: getUsers,
    userByEmailOrNumber,
    // ROOM
    room: getRoom,
    rooms: getRooms,
    cityLocationRooms: getCityLocationRooms,
    listedRoomCitiesLocations: getUserListedRoomCitiesLocations,
    // REVIEW
    review: getReview,
    reviews: getReviews,
    // DASHBOARD
    userCategoryStats,
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
