import express from "express";
import members from "../data/members.js";

const router = express.Router();

function getNextId() {
  if (members.length === 0) return 1;
  return Math.max(...members.map((m) => m.id)) + 1;
}

// GET /api/members
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    count: members.length,
    data: members
  });
});

// GET /api/members/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Member id must be a number."
    });
  }

  const member = members.find((m) => m.id === id);

  if (!member) {
    return res.status(404).json({
      success: false,
      message: `No member found with id ${id}.`
    });
  }

  res.status(200).json({
    success: true,
    data: member
  });
});

// POST /api/members
// Expects JSON body: { name, email }
router.post("/", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Both 'name' and 'email' are required fields."
    });
  }

  const emailExists = members.some(
    (m) => m.email.toLowerCase() === email.toLowerCase()
  );
  if (emailExists) {
    return res.status(409).json({
      success: false,
      message: "A member with this email already exists."
    });
  }

  const newMember = { id: getNextId(), name, email };
  members.push(newMember);

  res.status(201).json({
    success: true,
    message: "Member registered successfully.",
    data: newMember
  });
});

export default router;
