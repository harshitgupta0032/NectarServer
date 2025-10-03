import express from "express";
import { dbCheck } from "../controller/dbCheck.controller.js";
import {
  allUsers,
  createUser,
  loginUser,
  userProfile,
} from "../controller/authUsers.controller.js";
import { authMiddleware } from "../middlewatre/index.middleware.js";

const routers = express.Router();

// for create new database
// routers.get("/create-db/:name", CreateDatabaseName)

// create users table
// routers.get("/createTableUsers-456", createtableUsers)

routers.get("/checkdb", dbCheck);

routers.post("/createUser", createUser);
routers.post("/login", loginUser);
routers.get("/alluser", allUsers);
routers.get("/profile", authMiddleware, userProfile);

export default routers;
