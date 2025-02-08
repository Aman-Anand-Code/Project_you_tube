from fastapi import FastAPI
from pydantic import BaseModel
import yt_dlp
from imageio_ffmpeg import get_ffmpeg_exe
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# CORS Middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    url: str
    quality: str  # Example: '1080p', '720p', '480p'

def download_youtube_video(url: str, quality: str):
    ydl_opts = {
        'format': f'bestvideo[height<={quality[:-1]}]+bestaudio/best',
        'noplaylist': True,
        'merge_output_format': 'mp4',
        'ffmpeg_location': get_ffmpeg_exe(),
        'outtmpl': f"downloads/%(title)s_{quality}.mp4",
        'postprocessor_args': [
            '-c:v', 'copy',
            '-c:a', 'aac'
        ],
        'verbose': True,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        return f"downloads/{info['title']}_{quality}.mp4"

@app.post("/download/")
def download_video(request: VideoRequest):
    try:
        file_path = download_youtube_video(request.url, request.quality)
        return {"message": "Download started", "file_path": file_path}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    os.makedirs("downloads", exist_ok=True)
    uvicorn.run(app, host="0.0.0.0", port=8000)
