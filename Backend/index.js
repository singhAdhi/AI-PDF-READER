// Import required packages and modules
const fs = require("fs");
const pdfParse = require("pdf-parse"); // PDF parsing library
const express = require("express"); // Web framework to set up server and routes
const mongoose = require("mongoose"); // MongoDB ORM for data handling
const cors = require("cors"); // Allow cross-origin requests
const multer = require("multer"); // Middleware for handling file uploads
const fileModel = require("./model/files"); // Mongoose model to store file metadata in the database
const mammoth = require("mammoth"); // Library for extracting text from Word documents

// Initialize express app
const app = express();

// Enable CORS to allow requests from different origins (like frontend on a different port)
app.use(cors());

// Enable URL-encoded data parsing for form submissions
app.use(express.urlencoded({ extended: false }));

// Serve files in "uploads" directory as static files accessible at "/files" endpoint
app.use("/files", express.static("uploads"));

// Configure multer for file storage and naming
const storage = multer.diskStorage({
  // Directory where files will be stored
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Save files in the "uploads" directory
  },
  // Define filename to keep the original file name
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use only the original file name
  },
});

// Initialize multer with the defined storage configuration
const upload = multer({ storage: storage });

// Connect to MongoDB database
mongoose
  .connect(
    "mongodb+srv://adhirajsingh7303:w83ikHnkYuHVyTqX@cluster0.848kx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected")) // Success message upon connection
  .catch((err) => console.error("MongoDB connection error:", err)); // Error message if connection fails

// Define route to handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  console.log(req.file, req.body); // Log file and form data to console for debugging

  // Check if file is uploaded
  if (!req.file) {
    return res.status(400).send("No file uploaded."); // Return error if no file is found
  }

  // Create new file metadata entry using the model
  let fileData = new fileModel({
    filename: req.file.filename, // Store file name
    path: req.file.path, // Store file path
    size: req.file.size, // Store file size
  });

  try {
    // Save file metadata to the MongoDB database
    await fileData.save();

    let parsedData = "";

    // Process the file based on its MIME type
    const fileType = req.file.mimetype;

    switch (fileType) {
      case "application/pdf":
        // Parse PDF and extract text
        const pdfBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(pdfBuffer);
        parsedData = pdfData.text;
        break;

      case "image/jpeg":
      case "image/png":
        // Handle image files (JPG, PNG)
        parsedData = `Uploaded image file: ${req.file.originalname}`;
        break;

      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        // Parse Word document and extract text
        const wordBuffer = fs.readFileSync(req.file.path);
        const wordData = await mammoth.extractRawText({ buffer: wordBuffer });
        parsedData = wordData.value;
        break;

      default:
        // Default response for unsupported file types
        parsedData = `File uploaded: ${req.file.originalname}`;
    }

    // Respond with the file metadata and parsed content
    res.status(200).json({
      status: "File uploaded successfully",
      file: fileData, // Send back the saved file's metadata
      parsedContent: parsedData, // Send back parsed content if applicable
    });
  } catch (error) {
    console.error("Error processing file upload:", error); // Log any error during saving
    res.status(500).send("Error processing file upload."); // Send server error response
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000"); // Log message when server starts successfully
});
