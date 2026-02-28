const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || "zh7934465";

const rootDir = __dirname;
const videosDir = path.join(rootDir, "videos");
const manifestPath = path.join(videosDir, "manifest.json");
const dataDir = path.join(rootDir, "data");
const submissionsPath = path.join(dataDir, "submissions.json");
const pendingDir = path.join(rootDir, "uploads", "pending");

[videosDir, dataDir, pendingDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: pendingDir,
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".mp4";
    cb(null, unique + ext);
  }
});

const upload = multer({ storage });

app.use(express.static(rootDir));
app.use(express.json());

function readSubmissions() {
  try {
    const raw = fs.readFileSync(submissionsPath, "utf8");
    const parsed = JSON.parse(raw);
    return {
      pending: Array.isArray(parsed.pending) ? parsed.pending : [],
      approved: Array.isArray(parsed.approved) ? parsed.approved : []
    };
  } catch {
    return { pending: [], approved: [] };
  }
}

function writeSubmissions(data) {
  fs.writeFileSync(
    submissionsPath,
    JSON.stringify(
      {
        pending: Array.isArray(data.pending) ? data.pending : [],
        approved: Array.isArray(data.approved) ? data.approved : []
      },
      null,
      2
    ),
    "utf8"
  );
}

function readManifest() {
  try {
    const raw = fs.readFileSync(manifestPath, "utf8");
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeManifest(list) {
  const uniqueSorted = Array.from(new Set(list)).sort((a, b) =>
    a.localeCompare(b, "ru", { sensitivity: "base" })
  );
  fs.writeFileSync(manifestPath, JSON.stringify(uniqueSorted, null, 2), "utf8");
}

app.post("/api/submit", upload.single("video"), (req, res) => {
  const { title = "", tags = "" } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "NO_FILE" });
  }

  const cleanTitle = String(title).trim();
  if (!cleanTitle) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: "NO_TITLE" });
  }

  const parsedTags = String(tags)
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);

  const data = readSubmissions();
  const submission = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    title: cleanTitle,
    tags: parsedTags,
    originalFilename: req.file.originalname,
    storedFilename: req.file.filename,
    createdAt: new Date().toISOString(),
    status: "pending"
  };

  data.pending.push(submission);
  writeSubmissions(data);

  res.json({ ok: true });
});

function checkAdmin(req, res) {
  const key = req.query.key || req.headers["x-admin-key"];
  if (!key || key !== ADMIN_KEY) {
    res.status(403).json({ error: "FORBIDDEN" });
    return false;
  }
  return true;
}

app.get("/api/admin/pending", (req, res) => {
  if (!checkAdmin(req, res)) return;

  const data = readSubmissions();
  res.json({ pending: data.pending });
});

app.post("/api/admin/approve/:id", (req, res) => {
  if (!checkAdmin(req, res)) return;

  const { id } = req.params;
  const data = readSubmissions();
  const idx = data.pending.findIndex(x => x.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  const item = data.pending[idx];
  const sourcePath = path.join(pendingDir, item.storedFilename);
  const targetName = item.title + path.extname(item.originalFilename || ".mp4");
  const targetPath = path.join(videosDir, targetName);

  fs.renameSync(sourcePath, targetPath);

  let manifest = readManifest();
  if (manifest.length === 0 && fs.existsSync(videosDir)) {
    const videoExt = /\.(mp4|mov|webm|m4v)$/i;
    manifest = fs.readdirSync(videosDir).filter(f => videoExt.test(f));
  }
  manifest.push(targetName);
  writeManifest(manifest);

  item.status = "approved";
  data.pending.splice(idx, 1);
  data.approved.push(item);
  writeSubmissions(data);

  res.json({ ok: true });
});

app.post("/api/admin/reject/:id", (req, res) => {
  if (!checkAdmin(req, res)) return;

  const { id } = req.params;
  const data = readSubmissions();
  const idx = data.pending.findIndex(x => x.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  const item = data.pending[idx];
  const filePath = path.join(pendingDir, item.storedFilename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  data.pending.splice(idx, 1);
  writeSubmissions(data);

  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
