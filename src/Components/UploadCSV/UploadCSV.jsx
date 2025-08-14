import React, { useState } from "react";
import { toast } from "react-toastify";
import "./UploadCSV.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function UploadCSV({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("⚠ Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await fetch(`${API_URL}/api/csv/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle duplicate order error from backend
        if (data.error && data.error.toLowerCase().includes("duplicate")) {
          toast.warn(`⚠ ${data.error}`);
        } else {
          toast.error(`❌ ${data.error || "Upload failed"}`);
        }
        return;
      }

      // Success case
      onUploaded();
      toast.success(`✅ ${data.savedOrders.length} orders uploaded successfully!`);
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-csv-container">
      <label className="file-upload-label">
        Choose File
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
      </label>
      <span className="file-name">{file ? file.name : "No file chosen"}</span>
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload CSV"}
      </button>
    </div>
  );
}
