import * as THREE from 'three';
import { StudioScene } from './components/StudioScene.js';
import { CameraRig } from './components/CameraRig.js';
import { ModelManager } from './components/ModelManager.js';
import { WardrobeStorage } from './components/WardrobeStorage.js';
import { AIStylist } from './components/AIStylist.js';
import { AvatarCustomizer } from './components/AvatarCustomizer.js';
import { RunwayDirector } from './components/RunwayDirector.js';
import { UIController } from './components/UIController.js';

/**
 * Main Application Orchestrator for the Complete Virtual AI Fashion Universe
 */
class FashionStudioApp {
  constructor() {
    this.canvasContainer = document.getElementById('canvasContainer');
    this.clock = new THREE.Clock();
    this.isInitialized = false;

    this.init();
  }

  async init() {
    try {
      // 1. Initialize LocalStorage Manager
      this.wardrobeStorage = new WardrobeStorage();

      // 2. Initialize 3D Studio Scene
      this.studioScene = new StudioScene(this.canvasContainer);

      // 3. Initialize Camera Rig & Controls
      this.cameraRig = new CameraRig(this.canvasContainer, this.studioScene);

      // 4. Initialize Model Manager with loading callbacks
      this.modelManager = new ModelManager(
        this.studioScene,
        (msg, pct) => {
          if (this.uiController) {
            this.uiController.setLoadingProgress(msg, pct);
          }
        },
        (errMsg) => {
          if (this.uiController) {
            this.uiController.showToast(errMsg);
          }
        }
      );

      // 5. Initialize Sub-systems
      this.aiStylist = new AIStylist(this.modelManager);
      this.avatarCustomizer = new AvatarCustomizer(this.modelManager, this.wardrobeStorage);
      this.runwayDirector = new RunwayDirector(this.studioScene, this.cameraRig, this.modelManager);

      // 6. Initialize UI Controller for all 9 Pages
      this.uiController = new UIController(
        this.studioScene,
        this.cameraRig,
        this.modelManager,
        this.wardrobeStorage,
        this.aiStylist,
        this.avatarCustomizer,
        this.runwayDirector
      );

      // 7. Load 3D Models & Accessories
      await this.modelManager.init();

      // 8. Start High-Performance Animation Loop
      this.isInitialized = true;
      this.animate();

      // Hide loading screen
      this.uiController.setLoadingProgress('Studio Initialized', 100);

    } catch (err) {
      console.error('Failed to initialize 3D Studio:', err);
      if (this.uiController) {
        this.uiController.showToast('Initialization error: ' + err.message);
      }
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();

    // 1. Update Camera transitions & controls
    this.cameraRig.update(delta);

    // 2. Update Model animation mixer
    this.modelManager.update(delta);

    // 3. Update Runway Director (catwalk path & spotlights)
    this.runwayDirector.update(delta);

    // 4. Update atmospheric dust particles
    this.studioScene.updateAtmosphere(delta);

    // 5. Render Studio scene
    this.studioScene.render(this.cameraRig.camera);
  }
}

// Bootstrap on DOM content loaded
window.addEventListener('DOMContentLoaded', () => {
  new FashionStudioApp();
});
