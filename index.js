import express from "express";
import cors from "cors";
import { connectDB } from "./connectDb.js";
import http from "http";
import userRouter from "./routes/userRoutes.js";
import passport from "./passportConfig.js";
import session from "express-session";
import jwt from "jsonwebtoken";
const SECRET = "VCET";
const port = 3000;
const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(
  cors({
    origin: "*", // This allows all origins. You can specify specific origins.
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
connectDB();

// Session middleware (must be before passport.initialize())
app.use(
  session({
    secret: "VCET", // Use a strong secret in production
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// User routes
app.use("/users", userRouter);

// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth routes in your main app file or routes file
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication
    const token = jwt.sign(
      { email: req.user.email, id: req.user._id },
      SECRET,
      {
        expiresIn: "30d",
      }
    );

    // Send the token back to the client, e.g., as JSON
    res.json({ message: "Login successful", token, user: req.user });
  }
);

// Start the server
server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});
