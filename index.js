import "dotenv/config";
import express from "express";
import indexRoutes from "./routes/index.routes.js";
import usersRoutes from "./routes/users.routes.js";
import loginRoutes from "./routes/login.routes.js";
import morgan from "morgan";
import cors from "cors";
import { connectDB} from "./utils/sql.js"; // Importa la conexión y la prueba

const app = express();
const port = 5000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(indexRoutes);
app.use(usersRoutes);
app.use(loginRoutes);

app.listen(port, console.log("http://localhost:" + port));


// Probar conexión a la base de datos
(async () => {
    await connectDB(); // Verifica si la conexión se establece
  })();