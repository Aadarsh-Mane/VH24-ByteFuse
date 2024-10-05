import express from "express";
import cors from "cors";
import { connectDB } from "./connectDb.js";
import http from "http";
import userRouter from "./routes/userRoutes.js";
const port = 3000;
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "*", // This will allow all origins. You can also specify a specific origin like 'http://your-frontend-url.com'.
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
connectDB();
app.use("/users", userRouter);

server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});
