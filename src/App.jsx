import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

function App() {
  const containerRef = useRef();
  const markers = ['/pattern-una-taza-de-javascript.patt'];
  const videos = ['/2024-07-03 19-13-35.mp4'];

  useEffect(() => {
    let arSource, arContext, camera, scene, renderer;
    let videoGroup = null;
    let videoEl = null;

    const loadScripts = async () => {
      window.THREE = THREE;

      const arScript = document.createElement('script');
      arScript.src = 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/three.js/build/ar-threex.min.js';
      arScript.onload = () => {
        console.log('AR.js cargado');
        startAR();
      };
      arScript.onerror = () => {
        console.error('Error cargando AR.js');
      };
      document.body.appendChild(arScript);
    };

    const startAR = () => {
      scene = new THREE.Scene();
      camera = new THREE.Camera();
      scene.add(camera);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      arSource = new window.THREEx.ArToolkitSource({ sourceType: 'webcam' });
      arSource.init(() => setTimeout(onResize, 1000));

      arContext = new window.THREEx.ArToolkitContext({
        cameraParametersUrl: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/data/data/camera_para.dat',
        detectionMode: 'mono'
      });

      arContext.init(() => {
        camera.projectionMatrix.copy(arContext.getProjectionMatrix());
        createVideoMarker(markers[0], videos[0]);
      });

      window.addEventListener('resize', onResize);

      function onResize() {
        arSource.onResizeElement();
        arSource.copyElementSizeTo(renderer.domElement);
        if (arContext.arController) {
          arSource.copyElementSizeTo(arContext.arController.canvas);
        }
      }

      function animate() {
        requestAnimationFrame(animate);
        if (arSource.ready) arContext.update(arSource.domElement);

        // Si el marcador es visible y el video está cargado
        if (videoGroup && videoEl) {
          if (videoGroup.visible) {
            if (videoEl.paused) videoEl.play();
          } else {
            if (!videoEl.paused) videoEl.pause();
          }
        }

        renderer.render(scene, camera);
      }

      animate();
    };

    const createVideoMarker = (patternUrl, videoUrl) => {
      videoGroup = new THREE.Group();
      scene.add(videoGroup);

      new window.THREEx.ArMarkerControls(arContext, videoGroup, {
        type: 'pattern',
        patternUrl,
      });

      videoEl = document.createElement('video');
      videoEl.src = videoUrl;
      videoEl.crossOrigin = 'anonymous';
      videoEl.loop = true;
      videoEl.muted = false;
      videoEl.playsInline = true;
      videoEl.autoplay = false;

      videoEl.addEventListener('loadeddata', () => {
        const texture = new THREE.VideoTexture(videoEl);
        const geometry = new THREE.PlaneGeometry(1, 0.6);
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2;
        
        videoGroup.add(mesh);
      });
    };

    loadScripts();

    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  return <div ref={containerRef} style={{  position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  }} />;
}

export default App;