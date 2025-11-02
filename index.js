const express = require("express");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;

// Google Drive setup
const KEYFILE = process.env.GOOGLE_APPLICATION_CREDENTIALS || "/etc/secrets/drive-key.json";
const FOLDER_ID = process.env.DRIVE_FOLDER_ID || "1i-qnXZs4xw_xR3tP_h6vLQMNV0Dzg8Z5"; // 👈 Yahan apna folder ID daalna

async function createDriveClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILE,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  return google.drive({ version: "v3", auth });
}

app.get("/", (req, res) => {
  res.send("✅ Render VPS connected to Google Drive!");
});

app.get("/list", async (req, res) => {
  try {
    const drive = await createDriveClient();
    const response = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and trashed=false`,
      fields: "files(id, name)",
    });
    res.json(response.data.files);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => console.log("🚀 Server running on port", PORT));
