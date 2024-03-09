import Cors from "cors";

const AvailableCors = [
  "http://localhost:3000",
  "http://localhost:1234",
  "http://localhost:5000",
  "https://midu.dev",
  "http://localhost:5500",
  "https://movies.com",
  "http://127.0.0.1:5500",
];

export const CorsMiddleware = ({ passHost = AvailableCors } = {}) =>
  Cors({
    origin: (origin, callback) => {
      if (passHost.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, true);
    },
  });
