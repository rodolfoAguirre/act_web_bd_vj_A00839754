import { connectDB } from "../utils/sql.js";
import { hashPassword } from "../utils/hash.js";

export const login = async (req, res) => {
  try {
    const sql = await connectDB();
    const query = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [req.body.username],
    };

    const data = await sql.query(query);

    if (data.rows.length === 0) {
      return res.json({ isLogin: false, user: {} });
    }

    const user = data.rows[0];

    // Obtener la sal almacenada en la BD
    const saltLength = Number(process.env.SALT);
    const salt = user.password.substring(0, saltLength);

    // Hashear la contraseña ingresada con la misma sal
    const { hash } = hashPassword(req.body.password, salt);
    const saltedHash = salt + hash;

    // Comparar el hash generado con el de la BD
    if (saltedHash === user.password) {
      return res.json({ isLogin: true, user });
    }

    return res.json({ isLogin: false, user: {} });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};
