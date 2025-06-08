import express from "express";
import RateLimiterMiddleware from "../utils/rateLimiter";
import { rateLimiterOptions } from "../utils/option";

const router = express.Router();

const rateLimiter = new RateLimiterMiddleware(rateLimiterOptions).middleware();

router.get("/", (req, res) => {
  res.send("Welcome to the rate-limited API!");
});

router.get("/api", rateLimiter, (req, res) => {
  res.json({ message: "Welcome to the rate-limited API!" });
});

export default router;
