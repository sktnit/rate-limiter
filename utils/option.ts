interface RateLimiterOptions {
  maxRequests: number;
  timeWindow: number; // in milliseconds
}
export const rateLimiterOptions: RateLimiterOptions = {
  maxRequests: 5,
  timeWindow: 1000, // 1 second
};
