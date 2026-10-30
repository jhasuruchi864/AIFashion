import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * ModelManager manages 3D human models, rigging, animations, poses,
 * 12-category wardrobe customization, 3D accessories, and pattern textures.
 */
export class ModelManager {
  constructor(studioScene, onProgress, onError) {
    this.studioScene = studioScene;
    this.scene = studioScene.scene;
    this.onProgress = onProgress || (() => {});
    this.onError = onError || (() => {});

    this.loader = new GLTFLoader();

    // Model cache and state
    this.models = {
      female: null,
      male: null,
      procedural: null
    };
    this.mixers = {
      female: null,
      male: null
    };
    this.actions = {
      female: {},
      male: {}
    };

    // 3D Accessory meshes
    this.accessories = {
      rolex: null,
      handbag: null,
      glasses: null
    };

    this.currentModelKey = 'female';
    this.activeModel = null;
    this.isWireframe = false;
    this.activeFabric = 'satin';
    this.activeColor = '#d8b87d'; // Champagne gold
    this.activePattern = 'solid';

    // Active Wardrobe Outfit State across categories
    this.currentOutfit = {
      top: 'Silk Corset Camisole',
      shirt: 'Crisp Poplin Button-Up',
      jeans: 'Tailored Indigo Denim',
      trousers: 'Tapered Wool Cigarette Slacks',
      skirt: 'Pleated Asymmetric Midi Skirt',
      dress: 'Haute Couture Evening Gown',
      jacket: 'Structured Satin Tuxedo Blazer',
      coat: 'Cashmere Architectural Longcoat',
      suit: 'Double-Breasted Wool Suit',
      shoes: 'Runway Stiletto Pumps',
      handbag: 'Minaudière Champagne Clutch',
      accessories: 'Rolex Luxury Chronograph'
    };

    // Metadata
    this.metadata = {
      female: {
        name: 'Aria – Haute Couture',
        gender: 'Female Model',
        height: '179 cm',
        measurements: '84-60-89',
        outfit: 'Silk Crepe Evening Gown & Blazer',
        polyCount: '34,200 Triangles',
        source: 'GLB Haute Couture Asset'
      },
      male: {
        name: 'Julian – Modern Tailored',
        gender: 'Male Model',
        height: '186 cm',
        measurements: '98-76-96',
        outfit: 'Structured Minimalist Suit & Boots',
        polyCount: '48,100 Triangles',
        source: 'GLB Fashion Mesh Rig'
      },
      procedural: {
        name: 'Kira – Digital Avant-Garde',
        gender: 'Procedural Atelier',
        height: '182 cm',
        measurements: '86-62-90',
        outfit: 'Parametric Pleated Architectural Coat',
        polyCount: '19,800 Triangles',
        source: 'Procedural Three.js Couture'
      }
    };

    // Cache procedural pattern textures
    this.patternTextures = {};
    this.createPatternTextures();
  }

  createPatternTextures() {
    // 1. Jacquard / Monogram pattern
    const c1 = document.createElement('canvas');
    c1.width = 128;
    c1.height = 128;
    const ctx1 = c1.getContext('2d');
    ctx1.fillStyle = '#141419';
    ctx1.fillRect(0, 0, 128, 128);
    ctx1.strokeStyle = '#d8b87d';
    ctx1.lineWidth = 2;
    // Draw monogram luxury diamonds
    ctx1.strokeRect(16, 16, 32, 32);
    ctx1.strokeRect(80, 80, 32, 32);
    ctx1.font = 'bold 20px serif';
    ctx1.fillStyle = '#d8b87d';
    ctx1.fillText('V', 24, 40);
    ctx1.fillText('V', 88, 104);
    const tex1 = new THREE.CanvasTexture(c1);
    tex1.wrapS = THREE.RepeatWrapping;
    tex1.wrapT = THREE.RepeatWrapping;
    tex1.repeat.set(4, 4);
    this.patternTextures.jacquard = tex1;

    // 2. Houndstooth weave pattern
    const c2 = document.createElement('canvas');
    c2.width = 64;
    c2.height = 64;
    const ctx2 = c2.getContext('2d');
    ctx2.fillStyle = '#f0ece3';
    ctx2.fillRect(0, 0, 64, 64);
    ctx2.fillStyle = '#141419';
    ctx2.beginPath();
    ctx2.moveTo(0, 0); ctx2.lineTo(32, 0); ctx2.lineTo(32, 32); ctx2.lineTo(0, 32); ctx2.fill();
    ctx2.beginPath();
    ctx2.moveTo(32, 32); ctx2.lineTo(64, 32); ctx2.lineTo(64, 64); ctx2.lineTo(32, 64); ctx2.fill();
    const tex2 = new THREE.CanvasTexture(c2);
    tex2.wrapS = THREE.RepeatWrapping;
    tex2.wrapT = THREE.RepeatWrapping;
    tex2.repeat.set(6, 6);
    this.patternTextures.houndstooth = tex2;

    // 3. Cyber grid pattern
    const c3 = document.createElement('canvas');
    c3.width = 64;
    c3.height = 64;
    const ctx3 = c3.getContext('2d');
    ctx3.fillStyle = '#0a0a14';
    ctx3.fillRect(0, 0, 64, 64);
    ctx3.strokeStyle = '#00f2fe';
    ctx3.lineWidth = 1;
    ctx3.strokeRect(0, 0, 64, 64);
    const tex3 = new THREE.CanvasTexture(c3);
    tex3.wrapS = THREE.RepeatWrapping;
    tex3.wrapT = THREE.RepeatWrapping;
    tex3.repeat.set(8, 8);
    this.patternTextures.cyber = tex3;
  }

  async init() {
    // 1. Load female GLB
    await this.loadModel('female', 'assets/models/female.glb');
    // 2. Load male GLB
    await this.loadModel('male', 'assets/models/male.glb');
    // 3. Build procedural model
    this.buildProceduralModel();
    // 4. Load 3D accessories (Rolex watch, handbag, etc.)
    await this.loadAccessories();
    // 5. Display default model
    this.displayModel('female');
  }

  loadModel(key, url) {
    return new Promise((resolve) => {
      this.onProgress(`Loading ${this.metadata[key].name}...`, 25);

      this.loader.load(
        url,
        (gltf) => {
          const root = gltf.scene;

          const box = new THREE.Box3().setFromObject(root);
          const size = new THREE.Vector3();
          box.getSize(size);

          const targetHeight = 1.82;
          const scale = targetHeight / (size.y || 1);
          root.scale.setScalar(scale);

          const updatedBox = new THREE.Box3().setFromObject(root);
          const center = new THREE.Vector3();
          updatedBox.getCenter(center);

          root.position.x = -center.x;
          root.position.z = -center.z;
          root.position.y = 0.12 - updatedBox.min.y;

          root.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;

              if (child.material) {
                child.material = child.material.clone();
                child.material.envMapIntensity = 1.25;

                child.userData.originalColor = child.material.color.clone();
                child.userData.originalRoughness = child.material.roughness ?? 0.5;
                child.userData.originalMetalness = child.material.metalness ?? 0.1;
                child.userData.isClothing =
                  child.name.toLowerCase().includes('outfit') ||
                  child.name.toLowerCase().includes('body') ||
                  child.name.toLowerCase().includes('dress') ||
                  child.name.toLowerCase().includes('ch03');
              }
            }
          });

          if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(root);
            this.mixers[key] = mixer;
            gltf.animations.forEach((clip) => {
              const action = mixer.clipAction(clip);
              this.actions[key][clip.name] = action;
            });

            if (this.actions[key]['SambaDance']) {
              const samba = this.actions[key]['SambaDance'];
              samba.play();
              samba.timeScale = 0.55;
            }
          }

          if (key === 'male') {
            this.applyRiggedPose(root);
          }

          root.visible = false;
          this.scene.add(root);
          this.models[key] = root;
          this.onProgress(`Loaded ${this.metadata[key].name}`, 100);
          resolve(root);
        },
        (xhr) => {
          if (xhr.total) {
            const pct = Math.round((xhr.loaded / xhr.total) * 100);
            this.onProgress(`Loading ${this.metadata[key].name}: ${pct}%`, pct);
          }
        },
        (error) => {
          console.warn(`Could not load GLB for ${key}:`, error);
          this.onError(`Using procedural fallback for ${key}`);
          resolve(null);
        }
      );
    });
  }

  loadAccessories() {
    return new Promise((resolve) => {
      // 1. Load real Rolex luxury watch GLB
      this.loader.load(
        'assets/models/rolex.glb',
        (gltf) => {
          const rolex = gltf.scene;
          rolex.scale.setScalar(0.045);
          rolex.position.set(0.24, 0.98, 0.05);
          rolex.rotation.set(0, Math.PI / 2, 0);
          this.accessories.rolex = rolex;
          this.scene.add(rolex);
          resolve();
        },
        undefined,
        () => {
          // If rolex fails, create procedural luxury gold watch
          const watchGeo = new THREE.TorusGeometry(0.035, 0.012, 16, 32);
          const watchMat = new THREE.MeshStandardMaterial({
            color: 0xd8b87d,
            roughness: 0.15,
            metalness: 0.95
          });
          const watch = new THREE.Mesh(watchGeo, watchMat);
          watch.position.set(0.24, 0.98, 0.05);
          this.accessories.rolex = watch;
          this.scene.add(watch);
          resolve();
        }
      );

      // 2. Procedural Luxury Minaudière Handbag
      const bagGroup = new THREE.Group();
      const bagGeo = new THREE.BoxGeometry(0.16, 0.11, 0.06);
      const bagMat = new THREE.MeshStandardMaterial({
        color: 0xd8b87d,
        roughness: 0.18,
        metalness: 0.85
      });
      const bagMesh = new THREE.Mesh(bagGeo, bagMat);
      bagMesh.castShadow = true;
      bagGroup.add(bagMesh);

      // Delicate gold chain strap
      const chainGeo = new THREE.TorusGeometry(0.12, 0.005, 8, 32, Math.PI);
      const chainMesh = new THREE.Mesh(chainGeo, bagMat);
      chainMesh.position.y = 0.08;
      bagGroup.add(chainMesh);

      bagGroup.position.set(-0.28, 0.92, 0.15);
      this.accessories.handbag = bagGroup;
      this.scene.add(bagGroup);
    });
  }

  applyRiggedPose(root) {
    root.traverse((node) => {
      if (node.isBone) {
        const name = node.name.toLowerCase();
        if (name.includes('arm') || name.includes('shoulder')) {
          if (name.includes('left') || name.includes('l_')) {
            node.rotation.z = 1.15;
            node.rotation.x = 0.1;
          } else if (name.includes('right') || name.includes('r_')) {
            node.rotation.z = -1.15;
            node.rotation.x = -0.15;
          }
        }
        if (name.includes('forearm') || name.includes('elbow')) {
          if (name.includes('left') || name.includes('l_')) {
            node.rotation.y = -0.2;
            node.rotation.x = -0.15;
          } else if (name.includes('right') || name.includes('r_')) {
            node.rotation.y = 0.25;
            node.rotation.x = 0.35;
          }
        }
        if (name.includes('spine')) {
          node.rotation.y = 0.04;
          node.rotation.z = -0.02;
        }
        if (name.includes('head')) {
          node.rotation.y = 0.12;
          node.rotation.x = 0.05;
        }
      }
    });
  }

  buildProceduralModel() {
    const group = new THREE.Group();
    group.name = 'procedural_fashion_model';

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xdeb887,
      roughness: 0.35,
      metalness: 0.08
    });

    const fabricMat = new THREE.MeshStandardMaterial({
      color: 0xd8b87d,
      roughness: 0.22,
      metalness: 0.35,
      clearcoat: 0.6
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x111116,
      roughness: 0.1,
      metalness: 0.8
    });

    const headGeo = new THREE.SphereGeometry(0.11, 32, 24);
    headGeo.scale(0.85, 1.1, 0.95);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.68;
    group.add(head);

    const hairGeo = new THREE.CylinderGeometry(0.09, 0.12, 0.16, 32);
    hairGeo.scale(1.05, 1, 1.15);
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x1a1512,
      roughness: 0.25,
      metalness: 0.15
    });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.74, -0.04);
    hair.rotation.x = -0.2;
    group.add(hair);

    const glassesGeo = new THREE.BoxGeometry(0.14, 0.035, 0.06);
    const glasses = new THREE.Mesh(glassesGeo, accentMat);
    glasses.position.set(0, 1.68, 0.09);
    group.add(glasses);

    const neckGeo = new THREE.CylinderGeometry(0.045, 0.055, 0.14, 32);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.y = 1.55;
    group.add(neck);

    const torsoGeo = new THREE.CylinderGeometry(0.14, 0.11, 0.42, 32);
    torsoGeo.scale(1.25, 1, 0.85);
    const torso = new THREE.Mesh(torsoGeo, fabricMat);
    torso.position.y = 1.28;
    torso.userData.isClothing = true;
    group.add(torso);

    const shoulderL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.16, 24), fabricMat);
    shoulderL.rotation.z = Math.PI / 2.3;
    shoulderL.position.set(-0.22, 1.44, 0);
    shoulderL.userData.isClothing = true;
    group.add(shoulderL);

    const shoulderR = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.16, 24), fabricMat);
    shoulderR.rotation.z = -Math.PI / 2.3;
    shoulderR.position.set(0.22, 1.44, 0);
    shoulderR.userData.isClothing = true;
    group.add(shoulderR);

    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.025, 0.58, 24), skinMat);
    armL.position.set(-0.24, 1.15, 0.02);
    armL.rotation.z = 0.15;
    group.add(armL);

    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.025, 0.58, 24), skinMat);
    armR.position.set(0.22, 1.14, -0.05);
    armR.rotation.z = -0.22;
    armR.rotation.x = 0.15;
    group.add(armR);

    const skirtGeo = new THREE.ConeGeometry(0.34, 0.88, 36, 1, true);
    skirtGeo.scale(1, 1, 0.9);
    const skirt = new THREE.Mesh(skirtGeo, fabricMat);
    skirt.position.y = 0.65;
    skirt.userData.isClothing = true;
    group.add(skirt);

    const bootL = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.32, 16), accentMat);
    bootL.position.set(-0.09, 0.24, 0);
    group.add(bootL);

    const bootR = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.32, 16), accentMat);
    bootR.position.set(0.09, 0.24, 0);
    group.add(bootR);

    group.traverse((c) => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
        c.userData.originalColor = c.material.color.clone();
      }
    });

    group.position.y = 0.12;
    group.visible = false;
    this.scene.add(group);
    this.models.procedural = group;
  }

  displayModel(key) {
    const targetModel = this.models[key] || this.models.procedural;
    if (!targetModel) return;

    if (this.activeModel && this.activeModel !== targetModel) {
      const oldModel = this.activeModel;
      let progress = 0;
      const fadeInterval = setInterval(() => {
        progress += 0.15;
        if (progress >= 1) {
          clearInterval(fadeInterval);
          oldModel.visible = false;
        } else {
          const s = (1 - progress);
          oldModel.scale.set(s, s, s);
        }
      }, 16);
    }

    targetModel.visible = true;
    targetModel.scale.setScalar(0.01);
    let inProgress = 0;
    const inInterval = setInterval(() => {
      inProgress += 0.12;
      if (inProgress >= 1) {
        clearInterval(inInterval);
        targetModel.scale.setScalar(1);
      } else {
        const ease = Math.sin((inProgress * Math.PI) / 2);
        targetModel.scale.setScalar(ease);
      }
    }, 16);

    this.activeModel = targetModel;
    this.currentModelKey = key;

    this.applyFabric(this.activeFabric);
    this.applyColor(this.activeColor);
    this.applyPattern(this.activePattern);
    this.setWireframe(this.isWireframe);
  }

  setPose(poseKey) {
    if (this.currentModelKey === 'female' && this.actions.female) {
      const samba = this.actions.female['SambaDance'];
      const tpose = this.actions.female['TPose'];

      if (poseKey === 'runway' && samba) {
        samba.reset();
        samba.timeScale = 0.55;
        samba.play();
      } else if (poseKey === 'editorial' && samba) {
        samba.reset();
        samba.time = 2.4;
        samba.timeScale = 0;
        samba.play();
      } else if (poseKey === 'tpose' && tpose) {
        samba.stop();
        tpose.reset().play();
      } else if (poseKey === 'chic' && samba) {
        samba.reset();
        samba.time = 5.2;
        samba.timeScale = 0;
        samba.play();
      }
    } else if (this.currentModelKey === 'male' && this.models.male) {
      this.models.male.traverse((node) => {
        if (node.isBone) {
          const name = node.name.toLowerCase();
          if (poseKey === 'runway') {
            if (name.includes('arm')) node.rotation.z = name.includes('left') ? 0.9 : -0.9;
            if (name.includes('leg')) node.rotation.x = name.includes('left') ? 0.2 : -0.2;
          } else if (poseKey === 'editorial') {
            if (name.includes('arm')) node.rotation.z = name.includes('left') ? 1.25 : -0.6;
            if (name.includes('spine')) node.rotation.y = 0.08;
          } else if (poseKey === 'chic') {
            if (name.includes('head')) node.rotation.y = -0.25;
            if (name.includes('arm')) node.rotation.z = name.includes('left') ? 0.7 : -1.2;
          }
        }
      });
    }
  }

  applyColor(hexColor) {
    this.activeColor = hexColor;
    if (!this.activeModel) return;

    const threeColor = new THREE.Color(hexColor);
    this.activeModel.traverse((child) => {
      if (child.isMesh && child.userData.isClothing && child.material) {
        child.material.color.copy(threeColor);
      }
    });

    if (this.accessories.handbag) {
      this.accessories.handbag.children[0].material.color.copy(threeColor);
    }
  }

  applyFabric(fabricType) {
    this.activeFabric = fabricType;
    if (!this.activeModel) return;

    this.activeModel.traverse((child) => {
      if (child.isMesh && child.userData.isClothing && child.material) {
        switch (fabricType) {
          case 'satin':
            child.material.roughness = 0.22;
            child.material.metalness = 0.25;
            child.material.clearcoat = 0.85;
            break;
          case 'wool':
            child.material.roughness = 0.88;
            child.material.metalness = 0.04;
            child.material.clearcoat = 0.0;
            break;
          case 'patent':
            child.material.roughness = 0.05;
            child.material.metalness = 0.45;
            child.material.clearcoat = 1.0;
            break;
          case 'lame':
            child.material.roughness = 0.28;
            child.material.metalness = 0.92;
            child.material.clearcoat = 0.4;
            break;
        }
        child.material.needsUpdate = true;
      }
    });
  }

  applyPattern(patternType) {
    this.activePattern = patternType;
    if (!this.activeModel) return;

    const texture = this.patternTextures[patternType] || null;
    this.activeModel.traverse((child) => {
      if (child.isMesh && child.userData.isClothing && child.material) {
        child.material.map = texture;
        child.material.needsUpdate = true;
      }
    });
  }

  // Equips a specific item in one of the 12 wardrobe categories
  equipWardrobeItem(category, itemName) {
    this.currentOutfit[category] = itemName;

    // Apply smart high-fashion visual styling adjustments based on item selection
    if (category === 'dress' || category === 'gown') {
      this.applyFabric('satin');
      this.setPose('editorial');
    } else if (category === 'suit' || category === 'jacket') {
      this.applyFabric('wool');
      this.setPose('chic');
    } else if (category === 'street' || category === 'jeans') {
      this.setPose('runway');
    }

    if (category === 'accessories') {
      const showWatch = itemName.toLowerCase().includes('rolex') || itemName.toLowerCase().includes('watch');
      if (this.accessories.rolex) {
        this.accessories.rolex.visible = showWatch;
      }
    }

    if (category === 'handbag') {
      if (this.accessories.handbag) {
        this.accessories.handbag.visible = !itemName.toLowerCase().includes('none');
      }
    }

    return this.currentOutfit;
  }

  setWireframe(enabled) {
    this.isWireframe = enabled;
    if (!this.activeModel) return;

    this.activeModel.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.wireframe = enabled;
        if (enabled) {
          child.material.emissive = new THREE.Color(0xe6c687);
          child.material.emissiveIntensity = 0.4;
        } else {
          child.material.emissive = new THREE.Color(0x000000);
          child.material.emissiveIntensity = 0;
        }
        child.material.needsUpdate = true;
      }
    });
  }

  update(delta) {
    if (this.currentModelKey && this.mixers[this.currentModelKey]) {
      this.mixers[this.currentModelKey].update(delta);
    }
  }

  getCurrentMetadata() {
    return this.metadata[this.currentModelKey] || this.metadata.female;
  }
}
