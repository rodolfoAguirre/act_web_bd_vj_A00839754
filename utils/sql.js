import fs from "fs";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.BD_NAME,
  ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync(path.join(__dirname, "../ca.pem")).toString(),
  },
};

// export const connectDB = () => {
//   const client = new pg.Client(config);
//   client.connect();
//   return client;
// };

export const connectDB = async () => {
  const client = new pg.Client(config);
  
  try {
    await client.connect();
    console.log("✅ Conexión exitosa a la base de datos.");
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
  }
  return client;
};
