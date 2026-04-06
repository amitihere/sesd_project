import express from "express";
import authRoutes from "./routes/auth.routes";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});