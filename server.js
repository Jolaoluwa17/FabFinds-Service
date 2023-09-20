const express = require("express");
const app = express();
const connectDB = require("./migrations/index.js");
const cors = require("cors");

app.use(cors()); // Use cors middleware

app.use(express.json()); // Parse JSON-encoded bodies
app.use(express.urlencoded({ extended: true }));

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
