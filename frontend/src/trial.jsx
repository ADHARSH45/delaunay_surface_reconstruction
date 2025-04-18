import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import * as THREE from "three";

function Trial() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        alert("Error processing file: " + data.error);
        setLoading(false);
        return;
      }

      const filename = data.filename;
      fetchModel(filename);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed!");
      setLoading(false);
    }
  };

  const fetchModel = async (filename) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/output`);
      console.log(response);
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });
      console.log("Fetched PLY file:", blob);

      const loader = new PLYLoader();
      const geometry = loader.parse(arrayBuffer);
      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({ color: "skyblue" });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);

      setModel(mesh);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching model:", error);
      alert("Failed to fetch processed model!");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">XYZ to PLY Converter</h1>

      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96">
        <input
          type="file"
          accept=".xyz"
          className="w-full text-sm text-gray-300
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-lg file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-600 file:text-white
                     hover:file:bg-blue-700"
          onChange={handleFileChange}
        />

        {preview && <p className="mt-4 text-green-400">File selected: {file.name}</p>}

        <button
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full"
          onClick={handleUpload}
        >
          {loading ? "Processing..." : "Upload & Convert"}
        </button>
      </div>

      {/* 3D Viewer */}
      {model && (
        <div className="mt-8 w-full h-96">
          <Canvas camera={{ position: [0, 0, 5] }} className="w-full h-full">
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls enableZoom enableRotate enablePan />
            <primitive object={model} />
          </Canvas>
        </div>
      )}
    </div>
  );
}

export default Trial;
