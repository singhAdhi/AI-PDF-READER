import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Header = ({ className, handleFileChange, handleFileUpload, modal }) => {
  return (
    <div className={className}>
      {modal && (
        <Dialog>
          <DialogTrigger className="">Uplpad Pdf file</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <form
                action="/upload"
                method="post"
                class="flex flex-col items-center gap-4 p-6 rounded-md mx-auto"
              >
                <label class="block text-gray-700 font-medium">
                  <span class="mb-2 block">Upload File</span>
                  <input
                    type="file"
                    name="file"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    onChange={handleFileChange}
                  />
                </label>
                <button
                  type="submit"
                  onClick={handleFileUpload}
                  class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  Upload
                </button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Header;
