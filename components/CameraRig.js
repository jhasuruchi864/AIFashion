import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * CameraRig manages the camera, OrbitControls, view presets (Full Body, Portrait, Apparel, Shoes),
 * smooth animated camera transitions, zoom in/out, and auto-rotation.
 */
export class CameraRig {
  constructor(canvasContainer, studioScene) {
    this.container = canvasContainer;
    this.studioScene = studioScene;

    const aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 50);
    this.container.__activeCamera = this.camera;

    // OrbitControls
    this.controls = new OrbitControls(this.camera, studioScene.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 0.8;
    this.controls.maxDistance = 7.0;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.02; // prevent going below ground
    this.controls.minPolarAngle = 0.1;
    this.controls.autoRotate = false;
    this.controls.autoRotateSpeed = 1.2;

    // View Presets
    this.presets = {
      full: {
        pos: new THREE.Vector3(0, 1.15, 3.4),
        target: new THREE.Vector3(0, 0.95, 0),
        fov: 45
      },
      portrait: {
        pos: new THREE.Vector3(0, 1.58, 1.25),
        target: new THREE.Vector3(0, 1.52, 0),
        fov: 38
      },
      apparel: {
        pos: new THREE.Vector3(0, 1.2, 2.1),
        target: new THREE.Vector3(0, 1.1, 0),
        fov: 42
      },
      shoes: {
        pos: new THREE.Vector3(0, 0.42, 1.6),
        target: new THREE.Vector3(0, 0.2, 0),
        fov: 40
      },
      front: {
        pos: new THREE.Vector3(0, 1.2, 3.2),
        target: new THREE.Vector3(0, 1.0, 0),
        fov: 44
      },
      side: {
        pos: new THREE.Vector3(3.2, 1.2, 0),
        target: new THREE.Vector3(0, 1.0, 0),
        fov: 44
      },
      back: {
        pos: new THREE.Vector3(0, 1.2, -3.2),
        target: new THREE.Vector3(0, 1.0, 0),
        fov: 44
      },
      hero: {
        pos: new THREE.Vector3(1.1, 0.45, 2.1),
        target: new THREE.Vector3(0, 1.35, 0),
        fov: 42
      }
    };

    // Transition state
    this.isTransitioning = false;
    this.transitionProgress = 1;
    this.startPos = new THREE.Vector3();
    this.targetPos = new THREE.Vector3();
    this.startTarget = new THREE.Vector3();
    this.targetTarget = new THREE.Vector3();

    // Default to full body
    this.setPreset('full', false);

    // Resize listener
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  setPreset(presetKey, animate = true) {
    const config = this.presets[presetKey] || this.presets.full;

    if (!animate) {
      this.camera.position.copy(config.pos);
      this.controls.target.copy(config.target);
      this.camera.fov = config.fov;
      this.camera.updateProjectionMatrix();
      this.controls.update();
      this.isTransitioning = false;
      return;
    }

    this.startPos.copy(this.camera.position);
    this.targetPos.copy(config.pos);
    this.startTarget.copy(this.controls.target);
    this.targetTarget.copy(config.target);
    this.startFov = this.camera.fov;
    this.endFov = config.fov;

    this.transitionProgress = 0;
    this.isTransitioning = true;
  }

  resetCamera() {
    this.setPreset('full', true);
  }

  zoomIn() {
    const dir = new THREE.Vector3().subVectors(this.controls.target, this.camera.position).normalize();
    if (this.camera.position.distanceTo(this.controls.target) > this.controls.minDistance + 0.3) {
      this.camera.position.addScaledVector(dir, 0.4);
      this.controls.update();
    }
  }

  zoomOut() {
    const dir = new THREE.Vector3().subVectors(this.controls.target, this.camera.position).normalize();
    if (this.camera.position.distanceTo(this.controls.target) < this.controls.maxDistance - 0.4) {
      this.camera.position.addScaledVector(dir, -0.4);
      this.controls.update();
    }
  }

  toggleAutoRotate(forceState) {
    if (typeof forceState === 'boolean') {
      this.controls.autoRotate = forceState;
    } else {
      this.controls.autoRotate = !this.controls.autoRotate;
    }
    return this.controls.autoRotate;
  }

  update(delta) {
    if (this.isTransitioning) {
      this.transitionProgress += delta * 2.2; // ~0.45s smooth transition
      if (this.transitionProgress >= 1) {
        this.transitionProgress = 1;
        this.isTransitioning = false;
      }

      // Smooth ease-in-out curve
      const t = 0.5 - 0.5 * Math.cos(this.transitionProgress * Math.PI);
      this.camera.position.lerpVectors(this.startPos, this.targetPos, t);
      this.controls.target.lerpVectors(this.startTarget, this.targetTarget, t);
      this.camera.fov = THREE.MathUtils.lerp(this.startFov, this.endFov, t);
      this.camera.updateProjectionMatrix();
    }

    this.controls.update();
  }

  handleResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  dispose() {
    window.removeEventListener('resize', this.handleResize);
    this.controls.dispose();
  }
}
