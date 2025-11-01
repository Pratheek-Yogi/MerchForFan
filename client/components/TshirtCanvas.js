import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry';

const TshirtCanvas = forwardRef(({ color, textureImage, decalScale, decalPositionX, decalPositionY, onModelLoad }, ref) => {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const decalRef = useRef(null);
  const [tshirtMesh, setTshirtMesh] = useState(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(35, 1, 0.1, 1000));
  const materialRef = useRef(new THREE.MeshStandardMaterial({ color: 0xffffff }));
  const onModelLoadRef = useRef(onModelLoad);

  // Expose canvas via ref
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current
  }));

  // Keep the onModelLoad callback reference up-to-date
  useEffect(() => {
    onModelLoadRef.current = onModelLoad;
  }, [onModelLoad]);

  // Effect for initialization and cleanup
  useEffect(() => {
    const mount = mountRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const material = materialRef.current;
    
    if (!mount) return;

    // Set background
    scene.background = new THREE.Color(0xf2f2f5);

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    canvas.style.display = 'block';
    mount.appendChild(canvas);

    // Renderer with preserveDrawingBuffer for image capture
    const renderer = new THREE.WebGLRenderer({ 
      canvas,
      antialias: true, 
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true // CRITICAL FOR IMAGE CAPTURE
    });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    ambientLight.name = 'ambientLight';
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.name = 'directionalLight';
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);

    // Resize handler
    const handleResize = () => {
      if (!mount) return;
      const style = window.getComputedStyle(mount);
      const maxH = parseInt(style.maxHeight, 10) || 640;
      const w = mount.clientWidth;
      let h = mount.clientHeight;
      if (h > maxH) h = maxH;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Animation loop
    let animationId = null;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      '/assets/source/TSHIRT.glb',
      (gltf) => {
        const object = gltf.scene;
        let mesh = null;
        object.traverse((child) => {
          if (child.isMesh) {
            child.material = material;
            mesh = child;
          }
        });

        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        object.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const desiredSize = 2.5;
        const scaleFactor = desiredSize / (maxDim || 1);
        object.scale.setScalar(scaleFactor);

        const boxAfter = new THREE.Box3().setFromObject(object);
        const sphere = boxAfter.getBoundingSphere(new THREE.Sphere());
        const centerAfter = boxAfter.getCenter(new THREE.Vector3());
        object.position.sub(centerAfter);

        handleResize();

        const vFOV = (camera.fov * Math.PI) / 180;
        const hFOV = 2 * Math.atan(Math.tan(vFOV / 2) * camera.aspect);
        const distanceV = Math.abs(sphere.radius / Math.sin(vFOV / 2));
        const distanceH = Math.abs(sphere.radius / Math.sin(hFOV / 2));
        const cameraDistance = Math.max(distanceV, distanceH) + 0.6;
        const cameraYOffset = Math.max(sphere.radius * 0.25, 0.25);
        camera.position.set(0, cameraYOffset, cameraDistance);

        if (controlsRef.current) {
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.update();
        }
        camera.lookAt(0, 0, 0);

        const oldModel = scene.getObjectByName('tshirt_model');
        if (oldModel) scene.remove(oldModel);
        object.name = 'tshirt_model';
        scene.add(object);
        setTshirtMesh(mesh);
        handleResize();
        if (onModelLoadRef.current) onModelLoadRef.current();
      },
      undefined,
      (err) => console.error('GLTF load error', err)
    );

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) cancelAnimationFrame(animationId);
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      if (canvasRef.current && mount.contains(canvasRef.current)) {
        mount.removeChild(canvasRef.current);
      }
      
      // Clean up scene
      scene.clear();
    };
  }, []);

  // Update material color when prop changes
  useEffect(() => {
    if (materialRef.current) materialRef.current.color.set(color || '#ffffff');
  }, [color]);

  // Apply decal texture when uploaded
  useEffect(() => {
    const scene = sceneRef.current;
    
    // Clean up the previous decals
    if (decalRef.current && Array.isArray(decalRef.current)) {
      decalRef.current.forEach(decal => {
        scene.remove(decal);
        if (decal.geometry) decal.geometry.dispose();
        if (decal.material) {
          if (decal.material.map) decal.material.map.dispose();
          decal.material.dispose();
        }
      });
    }
    decalRef.current = [];

    if (textureImage && tshirtMesh) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(textureImage, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = rendererRef.current ? rendererRef.current.capabilities.getMaxAnisotropy() : 1;

        const decalMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          depthTest: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -4,
        });

        tshirtMesh.parent.traverse((node) => {
          if (node.isMesh) {
            const decalGeometry = new DecalGeometry(
              node,
              new THREE.Vector3(0, 0.15, 0.1),
              new THREE.Euler(0, 0, 0),
              new THREE.Vector3(1, 1, 1)
            );
            const decalMesh = new THREE.Mesh(decalGeometry, decalMaterial);
            decalMesh.scale.set(decalScale, decalScale, 1);
            decalMesh.position.x = decalPositionX;
            decalMesh.position.y = decalPositionY;
            decalRef.current.push(decalMesh);
            scene.add(decalMesh);
          }
        });
      });
    }
  }, [textureImage, tshirtMesh]);

  useEffect(() => {
    if (decalRef.current && Array.isArray(decalRef.current)) {
      decalRef.current.forEach(decal => decal.scale.set(decalScale, decalScale, 1));
    }
  }, [decalScale]);

  useEffect(() => {
    if (decalRef.current && Array.isArray(decalRef.current)) {
      decalRef.current.forEach(decal => {
        decal.position.x = decalPositionX;
        decal.position.y = decalPositionY;
      });
    }
  }, [decalPositionX, decalPositionY]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '420px',
        cursor: 'grab',
      }}
    />
  );
});

export default TshirtCanvas;
