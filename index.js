import express from "express";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import booksRouter from "./routes/books.js";
import membersRouter from "./routes/members.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Parses incoming JSON bodies (req.body) — required for POST requests.
app.use(express.json());

// Simple request logger — helps while developing and debugging.
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Root route 
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Library REST API is running.",
    endpoints: {
      books: "/api/books",
      members: "/api/members",
      
    }
  });
});


app.use("/api/books", booksRouter);
app.use("/api/members", membersRouter);

// 404 handler — must come after all valid routes.
app.use(notFound);

// Error handler — must be the last middleware registered.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
