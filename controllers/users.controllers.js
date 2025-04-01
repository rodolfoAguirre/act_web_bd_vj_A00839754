import { connectDB } from "../utils/sql.js";
import {getSalt, hashPassword} from "../utils/hash.js";

export const getUsers = async (req, res) => {
  const sql = connectDB();
  const data = await sql.query("select * from users");
  res.json(data.rows);
};

export const getUser = async (req, res) => {
  const sql = connectDB();
  const query = {
    text: "select * from users where id = $1",
    values: [req.params.id],
  };
  const data = await sql.query(query);
  res.json(data.rows[0]);
};

export const postUser = async (req, res) => {
  const { name, username, password, points } = req.body;
  const salt = getSalt();
  const { hash} = hashPassword(password, salt);

  const saltedHash = salt + hash;

  const sql = connectDB();
  const query = {
    text: "insert into users(name, username, password, points) values($1, $2, $3, $4)",
    values: [name, username, saltedHash, points],
  };
  const data = await sql.query(query);
  res.json(data.rows);
};

export const putUser = async (req, res) => {
  const { name, username, password, points } = req.body;
  const sql = connectDB();
  const query = {
    text: "update users set name = $1, username = $2, password = $3, points = $4 where id = $5",
    values: [name, username, password, points, req.params.id],
  };
  const data = await sql.query(query);
  res.json(data.rows);
};

export const deleteUser = async (req, res) => {
  try {
    const sql = connectDB();
    const query = {
      text: "delete from users where id = $1",
      values: [req.params.id],
    };
    await sql.query(query);
    res.status(200).json({ msg: "ya se borro" });
  } catch (error) {
    res.status(500).json({ msg: error.msg });
  }
};
