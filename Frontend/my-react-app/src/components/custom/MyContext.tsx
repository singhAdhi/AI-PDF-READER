import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

// Define the shape of the question-answer item
interface QAItem {
  id: number; // Unique ID for each question-answer pair
  question: string; // The question text
  answer?: string; // The answer text (optional, initially empty)
}

// Define the shape of the context value
interface MyContextType {
  data: QAItem[]; // Array of question-answer items
  setData: Dispatch<SetStateAction<QAItem[]>>; // Function to update the state
}

// Create the context with an initial default value of `null`
export const MyContext = createContext<MyContextType | null>(null);

// Define props type for MyContextProvider
interface MyContextProviderProps {
  children: ReactNode; // The children passed to this provider
}

// The MyContextProvider component
export const MyContextProvider: React.FC<MyContextProviderProps> = ({ children }) => {
  // State to store the question-answer pairs
  const [data, setData] = useState<QAItem[]>([]); // Initialize as an empty array

  // Log the current context state for debugging
  console.log("MyContext Data:", data);

  return (
    <MyContext.Provider value={{ data, setData }}>
      {children}
    </MyContext.Provider>
  );
};
