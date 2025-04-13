import { startTransition, useEffect, useRef } from 'react'
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import './App.css'

function App() {
  const containerRef = useRef()
  useEffect(() => {
    const loadScripts = async () => {
      const arScript = document.createElement('script');
      arScript.src = 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/three.js/build/ar-threex.min.js';
      document.body.appendChild(arScript);
      arScript.onload = () => {
        startAR();
      };
    }; 

    const startAR = () => {
      const scene = new THREE.Scene();
      const camara = new THREE.Camera();
      scene.add(camara);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true,  preserveDrawingBuffer: true, powerPreference: 'high-performance' });
      renderer.setSize(window.innerWidth, window.innerHeight); // Sirve para que el canvas ocupe toda la pantalla
      containerRef.current.appendChild(renderer.domElement);

      const arSource = new window.THREEx.ArToolkitSource({ sourceType: 'webcam', });
      arSource.init(() => setTimeout(onResize, 1000));

      const arContext = new window.THREEx.ArToolkitContext({
        cameraParametersUrl: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/data/camera_para.dat',
        detectionMode: 'mono',
      }); 

      arContext.init(() => {
        camara.projectionMatrix.copy(arContext.getProjectionMatrix());
      })


  return (
    <>
      
    </>
  )
}

export default App
