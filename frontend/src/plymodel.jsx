import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";

const PLYModel = ({ url }) => {
  const meshRef = useRef(); // Reference for the model

  // Load the PLY file
  const geometry = useLoader(PLYLoader, url);

  // Automatically rotate the model
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += .02;
      meshRef.current.y = -20;
     meshRef.current.rotation.y += 0.01; 
    meshRef.current.rotation.x += 0.01;  // Adjust speed here
    }
  });

  return (
    <mesh ref={meshRef}>
      <primitive object={geometry} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
};

export default PLYModel;
