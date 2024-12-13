import { useState, useContext } from "react";
import * as React from "react";
import "./App.css";
import Header from "./components/custom/Header.jsx";
import RightChat from "./components/custom/RightChat";
import LeftPreview from "./components/custom/LeftPreview";
import axios from "axios";
import { GlobalWorkerOptions } from "pdfjs-dist";
import { chatSession } from "./service/ALModal.jsx";
import { MyContext } from "./components/custom/MyContext.tsx";

GlobalWorkerOptions.workerSrc =
  "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(); // Allow undefined
  const [file, setFile] = useState<File | undefined>(); // Store the file
  const [modal, setModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const context = useContext(MyContext);

  // Ensure `context` is not null
  if (!context) {
    throw new Error("App must be used within a MyContextProvider");
  }

  const { data, setData } = context;

  // Handle file input
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }
// Handle the initial PDF summarization (does not update UI context)
async function handleInitialSummarization(parsedContent: string) {
  try {
    console.log("Summarizing PDF content...");
    const result = await chatSession.sendMessage(
      `give the html struture for the given content so that i can paste it any where:\n\n${parsedContent}`
    );
    console.log("Summarization result:", result);

    // Add only the summarization response to the context
    setData([
      ...data,
      {
        id: data.length + 1,
        question: "Summarize the uploaded PDF",
        answer: result.response.candidates[0].content.parts[0].text,
      },
    ]);
    
  } catch (error) {
    console.error("Error fetching summary:", error);
  }
}

// Handle file upload (calls the initial summarization function)
async function handleFileUpload(e: React.FormEvent) {
  e.preventDefault();

  if (!file) {
    console.log("No file selected");
    return;
  }

  let formData = new FormData();
  formData.append("file", file); // Append file to FormData
  setLoading(true);
  try {
    let response = await axios.post("http://localhost:3000/upload", formData);
    console.log("File uploaded:", response.data);
    setSelectedFile(response.data.file); // Store file data from response
    setPreviewUrl(
      `http://localhost:3000/files/${response.data.file.filename}`
    );
    setModal(false);
    
    // Call the initial summarization function
    await handleInitialSummarization(response.data.parsedContent);
  } catch (error) {
    console.error("Error uploading file:", error);
  }finally {
    setLoading(false); // End loading after the request completes
  }
}

// Handle user-asked questions (updates UI context)
async function handleQuestion(input: string) {
  console.log("Input question:", input);
  try {
    const result = await chatSession.sendMessage(input);
    console.log("Received answer:", result);

    // Add question-answer pair to the context
    setLoading(true);
    setData([
      ...data,
      {
        id: data.length + 1,
        question: input,
        answer: result.response.candidates[0].content.parts[0].text,
      },
    ]);
    
  } catch (error) {
    console.error("Error fetching answer:", error);
  }finally {
    setLoading(false); // End loading after the request completes
  }
}


  return (
    <div className="flex flex-col min-h-screen">
    {/* Header */}
    <Header
      className="w-full bg-white shadow-lg py-4 px-6 flex items-center justify-between sticky top-0"
      handleFileChange={handleFileChange}
      handleFileUpload={handleFileUpload}
      modal={modal}
    />

    {/* Main Content Area */}
    <div className="flex flex-col md:flex-row flex-grow">
      {/* Left Preview Section */}
      <LeftPreview
        className="w-full md:w-1/2 lg:w-1/2 p-4 border-r border-gray-200"
        previewUrl={previewUrl}
      />
      {/* Right Chat Section */}
      <RightChat
          className="w-full md:w-1/2 lg:w-1/2 p-4"
          handleQuestion={handleQuestion}
          loading={loading}
      />
    </div>
  </div>
  );
}

export default App;
