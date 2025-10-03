import { Client } from "pg";
import pool from "../DB/db.js";

// check database
export const dbCheck = async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`Database connected! Current time: ${result.rows[0].now}`);
  } catch (error) {
    console.log(`erro found in dbcheck controller :: ${error}`);
  }
};

// create database
const createDatabase = async (dbName) => {
  try {
    const client = new Client({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      password: process.env.PG_PASSWORD,
      port: process.env.PG_PORT,
      database: process.env.PG_DATABASE,
    });

    await client.connect();

    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`Database "${dbName}" created successfully!`);

    await client.end();
  } catch (err) {
    console.error("Error creating database:", err.message);
  }
};

export const CreateDatabaseName = async (req, res) => {
  const dbName = req.params.name;
  await createDatabase(dbName);
  res.send(`Attempted to create database: ${dbName}`);
};

const createUserTable = `create table if not exists users(
id serial primary key,
name varchar(30),
email varchar(50),
phone varchar(30),
password varchar(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

export const createtableUsers = async (req, res) => {
  try {
    const response = await pool.query(createUserTable);
    console.log("table created successfully :: ", response.command);
    return res.status(200).send("users creted successfully ");
  } catch (error) {
    console.log(
      `There are Problem to create table for users, error :: ${error}`
    );
    return res.status(500).send("Failed to create users table.");
  }
};
