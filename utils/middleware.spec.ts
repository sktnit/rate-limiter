import RateLimiterMiddleware from "./rateLimiter";
import { Request, Response, NextFunction } from "express";
interface RateLimiterOptions {
  maxRequests: number;
  timeWindow: number; // in milliseconds
}

function createMockReqRes(ip = "127.0.0.1") {
  const req = {
    ip,
    headers: {},
  } as unknown as Request;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  return { req, res, next };
}

describe("RateLimiterMiddleware", () => {
  let middlewareFn: ReturnType<RateLimiterMiddleware["middleware"]>;

  beforeEach(() => {
    const options: RateLimiterOptions = {
      maxRequests: 5,
      timeWindow: 1000,
    };
    const limiter = new RateLimiterMiddleware(options);
    middlewareFn = limiter.middleware();

    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("allows requests within limit", () => {
    const { req, res, next } = createMockReqRes();

    middlewareFn(req, res, next);
    middlewareFn(req, res, next);

    expect(next).toHaveBeenCalledTimes(2);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("blocks requests exceeding limit", () => {
    const { req, res, next } = createMockReqRes();

    middlewareFn(req, res, next); // 1st
    middlewareFn(req, res, next); // 2nd
    middlewareFn(req, res, next); // 3rd - should be blocked

    expect(next).toHaveBeenCalledTimes(2); // only first two allowed

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({
      message: "You have exceeded the rate limit. Please try again later.",
    });
  });

  it("resets the count after time window", () => {
    const { req, res, next } = createMockReqRes();

    middlewareFn(req, res, next); // 1
    middlewareFn(req, res, next); // 2

    // Move time forward beyond the time window (1 sec = 1000 ms)
    jest.advanceTimersByTime(1001);

    middlewareFn(req, res, next); // should be allowed again

    expect(next).toHaveBeenCalledTimes(3);
  });
});
