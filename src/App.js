import React, { useState } from "react";

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchResult, setSearchResult] = useState("");

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file first");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/upload_file", {
        method: "POST",
        body: formData,
      });
      const text = await res.text();
      alert(text);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleSearch = async () => {
    if (!searchName.trim()) return;
    try {
      const res = await fetch(`/api/check_file?name=${encodeURIComponent(searchName)}`);
      const data = await res.json();
      setSearchResult(data.exists ? "✅ File exists" : "❌ File not found");
    } catch (err) {
      console.error(err);
      setSearchResult("Error checking file");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          {/* Upload Section */}
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="block w-full text-sm text-gray-600
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-600 file:text-white
                       hover:file:bg-blue-700"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow"
          >
            Upload
          </button>

          {/* Divider */}
          <div className="w-full h-px bg-gray-200 my-4"></div>

          {/* Search Section */}
          <input
            type="text"
            placeholder="Insert filename to search"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 shadow"
          >
            Search
          </button>

          {searchResult && (
            <p className="mt-4 text-lg font-medium">{searchResult}</p>
          )}
        </div>
      </div>
    </div>
  );
}
