// utils/middleware.ts
interface RateLimiterOptions {
  maxRequests: number;
  timeWindow: number; // in milliseconds
}

interface RequestData {
  requestCount: number;
  firstRequestTime: number;
}

export default class RateLimiterMiddleware {
  private maxRequests: number;
  private timeWindow: number;
  private rateLimitStore: Map<string, RequestData>;

  constructor(options: RateLimiterOptions) {
    this.maxRequests = options.maxRequests;
    this.timeWindow = options.timeWindow;
    this.rateLimitStore = new Map();
  }

  middleware() {
    return (req: any, res: any, next: () => void) => {
      const ip = req.ip || req.connection.remoteAddress;
      const now = Date.now();

      let userData = this.rateLimitStore.get(ip);

      if (!userData) {
        userData = { requestCount: 1, firstRequestTime: now };
      } else {
        if (now - userData.firstRequestTime > this.timeWindow) {
          userData = { requestCount: 1, firstRequestTime: now };
        } else {
          userData.requestCount++;
        }
      }

      this.rateLimitStore.set(ip, userData);

      const remaining = Math.max(0, this.maxRequests - userData.requestCount);
      const resetTime = userData.firstRequestTime + this.timeWindow;

      res.setHeader("X-RateLimit-Limit", this.maxRequests);
      res.setHeader("X-RateLimit-Remaining", remaining);
      res.setHeader("X-RateLimit-Reset", resetTime);

      if (userData.requestCount > this.maxRequests) {
        return res.status(429).json({
          message: "You have exceeded the rate limit. Please try again later.",
        });
      }

      next();
    };
  }

  reset(): void {
    this.rateLimitStore.clear();
  }
}
