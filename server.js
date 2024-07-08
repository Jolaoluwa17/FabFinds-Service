const express = require("express");
const app = express();
const connectDB = require("./migrations/index.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions.js");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerConfig.js");
// const cleanupExpiredOtps = require("./utils/cleanupExpiredOtps");

app.use(cors(corsOptions)); // Use cors middleware

app.use(express.json()); // Parse JSON-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the cron job to clean up expired OTPs
// cleanupExpiredOtps();

// add swagger and dto for form validation

const { routes } = require("./routes/main.js");

routes({ app });

app.get("/", (req, res) => {
  res.send("Server Running");
});

connectDB();

const port = process.env.ACCESS_PORT || 5500;

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
