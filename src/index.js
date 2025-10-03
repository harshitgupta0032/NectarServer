import express from "express";
import dotenv from "dotenv";
import routers from "./Routes/Router.dbRoutes.js";
import pool from "./DB/db.js";

// 1/10/2025

dotenv.config();
const port = process.env.PORT;
const app = express();

app.use(express.json());

app.use("/api", routers);

const result = await pool.query('SELECT current_user');
console.log('Current connected user:', result.rows[0].current_user);



app.listen(port, () => {
  return console.log(`Server run on port no. ${port}`);
});
