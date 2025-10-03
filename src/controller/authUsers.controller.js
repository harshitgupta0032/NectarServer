import pool from "../DB/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtToken.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "All field are required",
      });
    }
    if (String(phone).length < 10 || String(phone).length > 13) {
      return res.status(400).json({
        message: "Phone number must be between 10 and 13 digits",
      });
    }

    const checkEmail = await pool.query(
      `select * from users where email = $1`,
      [email]
    );

    if (checkEmail.rows.length > 0) {
      return res.status(409).json({ message: "User already exist" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await pool.query(
      `insert into users (name, email, phone, password) values($1, $2, $3, $4) RETURNING *;`,
      [name, email, phone, hashedPassword]
    );
    return res.status(201).json({
      message: "User registered successfully",
      users: user.rows[0],
    });
  } catch (error) {
    console.error("Error in createUser :: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(`select * from users where email=$1`, [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const user = result.rows[0];

    const matchUser = await bcrypt.compare(password, user.password);

    if (!matchUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    return res.status(201).json({
      token: token,
    });
  } catch (error) {
    console.log("Error in login User :: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const allUsers = async (req, res) => {
  try {
    const result = await pool.query(`select * from users`);

    const usersWithoutPassword = result.rows.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return res.status(200).json({
      data: usersWithoutPassword,
      length: result.rowCount,
    });
  } catch (error) {
    console.log("Error in All User :: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const userProfile = async (req, res) => {
  try {
    const userid = req.user.id;

    const result = await pool.query(
      `
        select * from users where id=$1
        `,
      [userid]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    const usersWithoutPassword = result.rows.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return res.status(200).json({
      data: usersWithoutPassword[0],
    });
  } catch (error) {
    console.log("Error in  User profile :: ", error);
    return res.status(500).json({ message: "Server error" });
  }
};
