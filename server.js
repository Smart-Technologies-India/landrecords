const next = require("next");
const multer = require("multer");
const express = require("express");
const { mkdir } = require("fs/promises");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 6060;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const filepath = __dirname + "/files/";
      await mkdir(filepath, { recursive: true });

      cb(null, filepath);
    } catch (err) {
      console.error("Error in destination function:", err);
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().getTime() + "_upload." + file.originalname.split(".").pop()
    );
  },
});

// Create multer instance with defined storage
const upload = multer({ storage: storage });

app.prepare().then(() => {
  const server = express();
  server.use("/files", express.static(__dirname + "/files"));

  server.post("/fileupload", upload.single("file"), (req, res) => {
    try {
      // If file uploaded successfully, you can handle it here
      // You can access uploaded file information via req.file
      const filePath = "/files/" + req.file.filename;
      res.json({
        status: true,
        message: "File uploaded successfully",
        filePath: filePath,
      });
    } catch (error) {
      // If any error occurs during file upload or processing
      res.json({ status: false, message: "File upload failed" });
    }
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`------------> Ready on http://localhost:${port}`);
  });
});
