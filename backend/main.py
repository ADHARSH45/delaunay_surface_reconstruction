from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import shutil
import os

app = FastAPI()

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change to specific domains in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    
    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    print(f"Received file: {file_path}")  # Debugging console log
    
    # Simulate running 4 scripts
    output_file_path = os.path.join(OUTPUT_FOLDER, file.filename.replace(".xyz", ".ply"))
    open(output_file_path, "w").write("PLY file generated")  # Simulated processing
    
    return {"filename": os.path.basename(output_file_path)}

@app.get("/output")
async def get_output():
    # Find the latest generated PLY file
    files = [f for f in os.listdir(OUTPUT_FOLDER) if f.endswith(".ply")]
    if not files:
        return {"error": "No output files found"}

    latest_file = max(files, key=lambda f: os.path.getctime(os.path.join(OUTPUT_FOLDER, f)))
    file_path = os.path.join(OUTPUT_FOLDER, latest_file)

    return FileResponse(file_path, filename=latest_file)

