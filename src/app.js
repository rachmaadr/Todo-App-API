import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import todorouter from "./routes/todos.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/todos", todorouter);
app.get("/", (req, res) => {
  res.json({
    message: "Todo API with prisma"
  });
});
app.use(errorHandler);

export default app;
