export const graphQLSchema = `#graphql

enum Role {
  USER
  ADMIN
  OWNER
  BROKER
}

enum Permission {
  room
  land
  store
  hostel
  repair
  rental
  restaurant
}

type User{
  id:ID!
  role:Role!
  name:String!
  image:String
  email:String!
  number:String
  password:String
  createdAt:String!
  updatedAt:String!
  permission:[Permission]
  roomReviews:[RoomReview!]
  rooms(offset: Int!, limit: Int!): [Room!]
}

enum Amenities {
  WIFI
  WATER
  PARKING
}

enum FurnishingStatusEnum {
  FURNISHED
  UNFURNISHED
  SEMIFURNISHED
}

type Room{
    id:ID!
    hall:Int
    userId:ID!
    user:User!
    bedroom:Int
    kitchen:Int
    bathroom:Int
    name:String!
    city:String!
    price:Float!
    videos:String
    ratings:Float!
    postedBy:Role!
    mincapacity:Int!
    maxcapacity:Int!
    photos:[String]!
    roomtype:String!
    location:String!
    direction:String
    createdAt:String!
    updatedAt:String!
    verified:Boolean!
    available:Boolean!
    ownerContact:String!
    amenities:[Amenities]
    reviews:[RoomReview!]
    primaryContact:String!
    furnishingStatus:FurnishingStatusEnum
}

type RoomReview{
    id:ID!
    room:Room!
    user:User!
    rating:Float
    roomId:String!
    userId:String!
    comment:String
    createdAt:String!
    updatedAt:String!
}

type CityRoomStats {
  city: String!
  totalRooms: Int!
  availableRooms: Int!
  unavailableRooms: Int!
}

type RoomStats {
  totalRoomsListed:String!
  totalAvailableRooms:String!
  cityWiseStats:[CityRoomStats!]!
}

type RoomCitiesLocations {
  city:String!
  location:String!
}

type UserCategory {
  total: Int!
  users: [User!]!
}

type UserCategoryStats {
  # ADMIN: UserCategory
  OWNER: UserCategory
  BROKER: UserCategory
}

type InterestedBy {
  user: User!
  createdAt: String!
}

type RoomData {
  id:ID!
  room: Room!
  roomId: ID!
  interestedBy: [InterestedBy!]!
}

type Query{
    # USER
    users:[User]
    user(id:ID!):User
    userByEmailOrNumber(email:String,number:String):User
    # ROOM
    rooms:[Room]
    room(id:ID!):Room
    listedRoomCitiesLocations(id:ID!):[RoomCitiesLocations!]!
    cityLocationRooms(city:String!,location:String,offset: Int!, limit: Int!):[Room!]!
    # REVIEW
    reviews:[RoomReview]
    review(id:ID!):RoomReview
    # DASHBOARD
    totalListedRoom(id:ID!):RoomStats!
    userCategoryStats:[UserCategoryStats!]!,
    # INTERESTEDROOMS
    interestedRooms(listerId:ID!):[RoomData!]!
}

type MutationResponse {
  message: String
}

type Mutation{
  # ROLE AND PERMISSION UPDATION
  removeUserSubs(userId:ID!):MutationResponse
  downgradePermission(userId:ID!,permission:Permission!):MutationResponse
  updateRolePermission(userId:ID!,role:Role,durationInDays:Int!,permission:Permission!):MutationResponse
  # ROOM UPDATION
  updateRoomAvailability(
    id:ID!,
    price:Int,
    amenities:[String],
    available: Boolean,
    ownerContact:String,
    primaryContact:String
    furnishingStatus:FurnishingStatusEnum,
  ): MutationResponse
  # ROOM DELETION
  deleteRoom(id:ID!):MutationResponse
  # INTERESTEDROOM DELETION
  deleteInterestedUser(userId:ID!,id:ID!):MutationResponse
}

`;
