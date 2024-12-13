import React, { useState, useContext } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Send, Paperclip, Mic } from "lucide-react";
import { MyContext } from "./MyContext";

const RightChat = ({ className, handleQuestion, loading }) => {
  const [input, setInput] = useState("");
  const { data } = useContext(MyContext);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    handleQuestion(input); // Pass input to the parent function
    if (input.trim()) {
      setInput("");
    }
  };
  return (
    <div
      className={`flex flex-col h-[600px] border rounded-lg shadow-lg ${className}`}
    >
      {loading ? (
        <>...Loading</>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
          {data.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sent ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  message.sent ? "bg-green-100" : ""
                }`}
              >
                {/* Question on the left */}
                <div className="text-left bg-white text-black px-4 py-2 rounded w-auto max-w-[70%]">
                  {message.question}
                </div>

                {/* Answer on the right */}
                <div className="text-right bg-blue-300 text-black px-4 py-2 rounded w-auto max-w-[70%] ml-auto">
                  {message.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
          >
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            className="flex-1 rounded-full bg-gray-100"
          />
          {input.trim() ? (
            <Button
              type="submit"
              size="icon"
              className="shrink-0 rounded-full bg-green-500 hover:bg-green-600"
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
            >
              <Mic className="h-5 w-5 text-gray-500" />
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default RightChat;
