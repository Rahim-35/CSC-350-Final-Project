const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// store scores (for now in memory)
let scores = [];

const users = [
  { u: "alice.judge", p: "alice123", role: "judge" },
  { u: "brian.judge", p: "brian123", role: "judge" },
  { u: "carla.judge", p: "carla123", role: "judge" },
  { u: "daniel.judge", p: "daniel123", role: "judge" },
  { u: "admin", p: "admin123", role: "admin" }
];

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const found = users.find(
    x => x.u === username && x.p === password
  );

  if (!found) {
    return res.json({ success: false });
  }

  res.json({
    success: true,
    admin: found.role === "admin"
  });
});

app.post("/submit", (req, res) => {
  const { user, total } = req.body;
  scores.push({ user, total });

  res.json({ message: "Saved" });
});

app.get("/average", (req, res) => {
  if (scores.length === 0) {
    return res.json({ avg: 0, count: 0 });
  }

  let sum = scores.reduce((acc, s) => acc + s.total, 0);
  let avg = sum / scores.length;

  res.json({ avg, count: scores.length });
});

// ✅ IMPORTANT FOR RENDER
app.listen(process.env.PORT || 3000, () =>
  console.log("Server running")
);
