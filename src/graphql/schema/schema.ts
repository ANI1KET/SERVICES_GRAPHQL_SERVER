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
    rooms:[Room!]
    number:String
    password:String
    createdAt:String!
    updatedAt:String!
    permission:[Permission]
    roomReviews:[RoomReview!]
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
    roomNumber:String!
    available:Boolean!
    amenities:[Amenities]
    reviews:[RoomReview!]
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

type Query{
    # USER
    users:[User]
    user(id:ID!):User
    # ROOM
    rooms:[Room]
    room(id:ID!):Room
    # REVIEW
    reviews:[RoomReview]
    review(id:ID!):RoomReview
}

type Mutation{
  # ROOM UPDATION
  updateRoomAvailability(id:ID!,availability: Boolean!):Room
}

`;
