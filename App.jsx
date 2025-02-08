import { useState } from "react";

export default function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [quality, setQuality] = useState("1080p");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDownload = async () => {
    if (!videoUrl.trim()) {
      alert("Please enter a valid YouTube URL.");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://railway.com/project/dc74c985-8ffc-4d0a-a9d7-c892f7024ac0", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoUrl, quality }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.error) {
        setMessage("Error: " + data.error);
      } else {
        setMessage("Download started successfully!");
      }
    } catch (error) {
      setLoading(false);
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white relative">
      <h1 className="text-3xl font-bold mb-4">YouTube Video Downloader</h1>
      <input
        type="text"
        placeholder="Enter YouTube URL"
        className="p-2 border border-gray-400 rounded-md text-black w-80"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <select
        className="p-2 mt-2 border border-gray-400 rounded-md text-black w-80"
        value={quality}
        onChange={(e) => setQuality(e.target.value)}
      >
        <option value="1080p">1080p</option>
        <option value="720p">720p</option>
        <option value="480p">480p</option>
      </select>
      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-6 py-2 mt-3 rounded-md hover:bg-blue-800"
      >
        {loading ? "Downloading..." : "Download Video"}
      </button>
      {message && <p className="mt-3 text-lg">{message}</p>}

      {/* ✅ Watermark - Created by Aman Anand */}
      <div className="absolute bottom-2 right-2 text-sm text-gray-400">
        Created By Aman Anand
      </div>
    </div>
  );
}
