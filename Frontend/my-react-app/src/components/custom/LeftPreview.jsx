import React from "react";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const LeftPreview = ({ className, previewUrl }) => {
  return (
    <div className={className}>
      {previewUrl && (
        <div style={{ width: "600px", height: "800px", marginTop: "20px" }}>
          <Viewer fileUrl={previewUrl} /> {/* Display PDF preview */}
        </div>
      )}
    </div>
  );
};

export default LeftPreview;
