import express from "express";
import books from "../data/books.js";

const router = express.Router();

// Small helper so IDs keep increasing even after items are added.
function getNextId() {
  if (books.length === 0) return 1;
  return Math.max(...books.map((b) => b.id)) + 1;
}

// GET /api/books
// Returns the full list of books. Supports optional filtering by genre,
// e.g. GET /api/books?genre=History
router.get("/", (req, res) => {
  const { genre } = req.query;

  let result = books;
  if (genre) {
    result = books.filter(
      (b) => b.genre.toLowerCase() === genre.toLowerCase()
    );
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
});

// GET /api/books/:id
// Returns a single book by its numeric id.
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Book id must be a number."
    });
  }

  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: `No book found with id ${id}.`
    });
  }

  res.status(200).json({
    success: true,
    data: book
  });
});

// POST /api/books
// Creates a new book. Expects JSON body: { title, author, genre, year }
router.post("/", (req, res) => {
  const { title, author, genre, year } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      success: false,
      message: "Both 'title' and 'author' are required fields."
    });
  }

  const newBook = {
    id: getNextId(),
    title,
    author,
    genre: genre || "Unspecified",
    year: year || null
  };

  books.push(newBook);

  res.status(201).json({
    success: true,
    message: "Book created successfully.",
    data: newBook
  });
});

export default router;
