from fastapi import FastAPI, File, UploadFile
import shutil
import os

app = FastAPI()

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

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

@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(OUTPUT_FOLDER, filename)
    return {"url": f"http://127.0.0.1:8000/static/{filename}"}

