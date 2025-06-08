# Node.js Rate Limiter

This project implements a custom rate limiter middleware for Express.js using TypeScript. The middleware restricts the number of API requests from a single IP address within a specified time window — without using any third-party store like Redis.

## 📂 Project Structure

├── src/
│ ├── index.ts # Express app entry point
│ ├── route.ts # API routes
│ └── utils/
│ └── middleware.ts # RateLimiterMiddleware class
├── tests/
│ └── middleware.spec.ts # Unit tests using Jest
├── package.json
└── README.md

---

## 🚀 Features

- Limits the number of requests per IP
- Resets after configurable time window
- Custom headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
- No external dependencies like Redis
- Written in TypeScript
- Tested with Jest

---

## ⚙️ Configuration

You can configure the rate limiter by passing options:

```ts
const options = {
  maxRequests: 5, // Max allowed requests
  timeWindow: 1000, // Time window in milliseconds (1 second)
};
```

## 🧪 Running Tests

Install dependencies:

```ts
npm install
```

Run the tests:

```ts
npx jest
```

Tests are written using Jest and cover:

Allowing requests within the limit

Blocking requests exceeding the limit

Resetting after the time window
