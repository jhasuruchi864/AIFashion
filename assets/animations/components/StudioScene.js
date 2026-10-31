import * as THREE from 'three';

/**
 * StudioScene manages the Three.js scene, renderer, studio backdrop,
 * circular fashion podium, cinematic studio lights, and atmospheric particles.
 */
export class StudioScene {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.width = canvasContainer.clientWidth || window.innerWidth;
    this.height = canvasContainer.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0f);
    this.scene.fog = new THREE.FogExp2(0x0a0a0f, 0.045);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true // Allows high-res studio snapshots
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // Lighting container and references
    this.lights = {};
    this.podiumGlows = [];

    // Build environment
    this.createStudioEnvironment();
    this.createLighting();
    this.createAtmosphericParticles();

    // Window resize binding
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  createStudioEnvironment() {
    // 1. Studio backdrop dome / subtle curved cyclorama
    const backdropGeo = new THREE.SphereGeometry(18, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const backdropMat = new THREE.MeshStandardMaterial({
      color: 0x0f0f15,
      roughness: 0.95,
      metalness: 0.05,
      side: THREE.BackSide
    });
    this.backdrop = new THREE.Mesh(backdropGeo, backdropMat);
    this.backdrop.position.y = -0.05;
    this.scene.add(this.backdrop);

    // 2. Multi-tier Circular Runway Podium
    this.podiumGroup = new THREE.Group();

    // Base podium tier (wider)
    const baseGeo = new THREE.CylinderGeometry(2.6, 2.7, 0.12, 64);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x14141c,
      roughness: 0.4,
      metalness: 0.6
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.06;
    baseMesh.receiveShadow = true;
    this.podiumGroup.add(baseMesh);

    // Main top podium tier (reflective high-gloss dark lacquer)
    const topGeo = new THREE.CylinderGeometry(2.2, 2.3, 0.16, 64);
    this.topMat = new THREE.MeshStandardMaterial({
      color: 0x121218,
      roughness: 0.18,
      metalness: 0.82
    });
    const topMesh = new THREE.Mesh(topGeo, this.topMat);
    topMesh.position.y = 0.04;
    topMesh.receiveShadow = true;
    this.podiumGroup.add(topMesh);

    // Glowing LED Ring between tiers
    const ringGeo = new THREE.TorusGeometry(2.22, 0.022, 16, 64);
    ringGeo.rotateX(Math.PI / 2);
    this.glowMat = new THREE.MeshStandardMaterial({
      color: 0xe6c687, // Champagne gold
      emissive: 0xe6c687,
      emissiveIntensity: 1.8,
      roughness: 0.2,
      metalness: 0.1
    });
    const ringMesh = new THREE.Mesh(ringGeo, this.glowMat);
    ringMesh.position.y = 0.12;
    this.podiumGroup.add(ringMesh);
    this.podiumGlows.push(this.glowMat);

    // Outer runway accent ring
    const outerRingGeo = new THREE.TorusGeometry(2.68, 0.012, 16, 64);
    outerRingGeo.rotateX(Math.PI / 2);
    this.outerRingMat = new THREE.MeshStandardMaterial({
      color: 0xf4a7b9, // Soft blush pink
      emissive: 0xf4a7b9,
      emissiveIntensity: 0.9,
      roughness: 0.3
    });
    const outerRingMesh = new THREE.Mesh(outerRingGeo, this.outerRingMat);
    outerRingMesh.position.y = 0.005;
    this.podiumGroup.add(outerRingMesh);
    this.podiumGlows.push(this.outerRingMat);

    // Ground reflector shadow plane
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x08080c,
      roughness: 0.35,
      metalness: 0.75
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.12;
    floor.receiveShadow = true;
    this.scene.add(floor);

    this.scene.add(this.podiumGroup);
  }

  createLighting() {
    // Ambient soft fill
    this.lights.ambient = new THREE.AmbientLight(0x22222a, 0.7);
    this.scene.add(this.lights.ambient);

    // Key Light - Fashion directional sunlight with crisp, soft shadows
    this.lights.key = new THREE.DirectionalLight(0xfff4e6, 2.4);
    this.lights.key.position.set(3.5, 4.8, 3.2);
    this.lights.key.castShadow = true;
    this.lights.key.shadow.mapSize.width = 2048;
    this.lights.key.shadow.mapSize.height = 2048;
    this.lights.key.shadow.camera.near = 0.5;
    this.lights.key.shadow.camera.far = 15;
    this.lights.key.shadow.camera.left = -2.5;
    this.lights.key.shadow.camera.right = 2.5;
    this.lights.key.shadow.camera.top = 2.8;
    this.lights.key.shadow.camera.bottom = -1.2;
    this.lights.key.shadow.bias = -0.0004;
    this.lights.key.shadow.normalBias = 0.02;
    this.scene.add(this.lights.key);

    // Fill Light - Soft, cool counter-balance
    this.lights.fill = new THREE.DirectionalLight(0xd9e4f5, 1.1);
    this.lights.fill.position.set(-3.5, 3.2, 2.5);
    this.scene.add(this.lights.fill);

    // Rim / Backlight - High fashion rim light separating model from background
    this.lights.rim = new THREE.DirectionalLight(0xffdfba, 2.6);
    this.lights.rim.position.set(0, 4.2, -3.8);
    this.scene.add(this.lights.rim);

    // Center Spotlight - Focused stage beam onto the podium center
    this.lights.spot = new THREE.SpotLight(0xffeedd, 3.2);
    this.lights.spot.position.set(0, 6.2, 0.8);
    this.lights.spot.target.position.set(0, 1.1, 0);
    this.lights.spot.angle = Math.PI / 6;
    this.lights.spot.penumbra = 0.5;
    this.lights.spot.decay = 1.2;
    this.lights.spot.distance = 12;
    this.lights.spot.castShadow = true;
    this.lights.spot.shadow.mapSize.width = 1024;
    this.lights.spot.shadow.mapSize.height = 1024;
    this.scene.add(this.lights.spot);
    this.scene.add(this.lights.spot.target);

    // Soft underglow spotlight for floating luxury look
    this.lights.underglow = new THREE.PointLight(0xe6c687, 0.8, 4.5);
    this.lights.underglow.position.set(0, 0.15, 0);
    this.scene.add(this.lights.underglow);
  }

  createAtmosphericParticles() {
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 6; // x
      positions[i * 3 + 1] = Math.random() * 4;         // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6; // z
      speeds[i] = 0.003 + Math.random() * 0.006;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleSpeeds = speeds;

    // Soft circular particle canvas texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 240, 220, 0.85)');
    grad.addColorStop(0.4, 'rgba(230, 198, 135, 0.35)');
    grad.addColorStop(1, 'rgba(230, 198, 135, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.08,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.65
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  updateAtmosphere(timeDelta) {
    if (!this.particles) return;
    const positions = this.particles.geometry.attributes.position.array;
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += this.particleSpeeds[i];
      if (positions[i * 3 + 1] > 4.2) {
        positions[i * 3 + 1] = 0.05;
        positions[i * 3 + 0] = (Math.random() - 0.5) * 6;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      }
    }
    this.particles.geometry.attributes.position.needsUpdate = true;
  }

  setLightingPreset(presetName) {
    switch (presetName) {
      case 'cyber':
        // Cyberpunk Runway: Electric Cyan & Neon Rose
        this.lights.key.color.setHex(0x00e5ff);
        this.lights.key.intensity = 2.6;
        this.lights.fill.color.setHex(0xff007f);
        this.lights.fill.intensity = 1.4;
        this.lights.rim.color.setHex(0x9d00ff);
        this.lights.rim.intensity = 3.0;
        this.lights.spot.color.setHex(0x00f2fe);
        this.glowMat.color.setHex(0x00f2fe);
        this.glowMat.emissive.setHex(0x00f2fe);
        this.outerRingMat.color.setHex(0xff007f);
        this.outerRingMat.emissive.setHex(0xff007f);
        this.lights.underglow.color.setHex(0x00f2fe);
        this.scene.background.setHex(0x06060c);
        break;

      case 'midnight':
        // Midnight Editorial: Stark monochromatic high-fashion contrast
        this.lights.key.color.setHex(0xffffff);
        this.lights.key.intensity = 3.0;
        this.lights.fill.color.setHex(0x606070);
        this.lights.fill.intensity = 0.6;
        this.lights.rim.color.setHex(0xbfd7ea);
        this.lights.rim.intensity = 3.2;
        this.lights.spot.color.setHex(0xf0f4f8);
        this.glowMat.color.setHex(0xe0e0e0);
        this.glowMat.emissive.setHex(0xcccccc);
        this.outerRingMat.color.setHex(0x888899);
        this.outerRingMat.emissive.setHex(0x777788);
        this.lights.underglow.color.setHex(0x99aacc);
        this.scene.background.setHex(0x050507);
        break;

      case 'golden':
        // Golden Hour: Warm sunset amber and soft peach rose
        this.lights.key.color.setHex(0xffaa5e);
        this.lights.key.intensity = 2.8;
        this.lights.fill.color.setHex(0xcca3ff);
        this.lights.fill.intensity = 1.0;
        this.lights.rim.color.setHex(0xffd166);
        this.lights.rim.intensity = 2.8;
        this.lights.spot.color.setHex(0xff9f43);
        this.glowMat.color.setHex(0xffa502);
        this.glowMat.emissive.setHex(0xff9f43);
        this.outerRingMat.color.setHex(0xf48fb1);
        this.outerRingMat.emissive.setHex(0xf48fb1);
        this.lights.underglow.color.setHex(0xffaa5e);
        this.scene.background.setHex(0x0a070a);
        break;

      case 'milano':
      default:
        // Milano Haute Couture: Champagne gold, charcoal, soft blush
        this.lights.key.color.setHex(0xfff4e6);
        this.lights.key.intensity = 2.4;
        this.lights.fill.color.setHex(0xd9e4f5);
        this.lights.fill.intensity = 1.1;
        this.lights.rim.color.setHex(0xffdfba);
        this.lights.rim.intensity = 2.6;
        this.lights.spot.color.setHex(0xffeedd);
        this.glowMat.color.setHex(0xe6c687);
        this.glowMat.emissive.setHex(0xe6c687);
        this.outerRingMat.color.setHex(0xf4a7b9);
        this.outerRingMat.emissive.setHex(0xf4a7b9);
        this.lights.underglow.color.setHex(0xe6c687);
        this.scene.background.setHex(0x0a0a0f);
        break;
    }
  }

  setBackdropPreset(preset) {
    if (!this.backdrop) return;
    switch (preset) {
      case 'champagne':
        this.backdrop.material.color.setHex(0x241d14);
        this.backdrop.material.roughness = 0.5;
        this.backdrop.material.metalness = 0.4;
        this.scene.background.setHex(0x1a150e);
        break;
      case 'concrete':
        this.backdrop.material.color.setHex(0x18181f);
        this.backdrop.material.roughness = 0.9;
        this.backdrop.material.metalness = 0.05;
        this.scene.background.setHex(0x101014);
        break;
      case 'sunset':
        this.backdrop.material.color.setHex(0x2a1420);
        this.backdrop.material.roughness = 0.7;
        this.scene.background.setHex(0x180c14);
        break;
      case 'cyclorama':
      default:
        this.backdrop.material.color.setHex(0x0f0f15);
        this.backdrop.material.roughness = 0.95;
        this.backdrop.material.metalness = 0.05;
        this.scene.background.setHex(0x0a0a0f);
        break;
    }
  }

  handleResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  render(camera) {
    this.renderer.render(this.scene, camera);
  }

  captureSnapshot() {
    this.renderer.render(this.scene, this.container.__activeCamera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  captureEditorialSnapshot(title = 'VOGUE AI PARIS') {
    this.renderer.render(this.scene, this.container.__activeCamera);
    const canvas = this.renderer.domElement;

    // Create high-res composite with luxury fashion magazine watermark
    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const ctx = offscreen.getContext('2d');

    // Draw 3D scene
    ctx.drawImage(canvas, 0, 0);

    // Editorial overlay styling
    const w = offscreen.width;
    const h = offscreen.height;

    // Subtle vignette border
    ctx.strokeStyle = 'rgba(216, 184, 125, 0.4)';
    ctx.lineWidth = Math.max(2, Math.round(w * 0.004));
    ctx.strokeRect(w * 0.03, h * 0.03, w * 0.94, h * 0.94);

    // Magazine Masthead
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(h * 0.055)}px "Syne", sans-serif`;
    ctx.textAlign = 'center';
    ctx.letterSpacing = '0.2em';
    ctx.fillText('VOGUE AI', w / 2, h * 0.1);

    // Subtitle
    ctx.fillStyle = '#d8b87d';
    ctx.font = `${Math.round(h * 0.02)}px "Plus Jakarta Sans", sans-serif`;
    ctx.letterSpacing = '0.3em';
    ctx.fillText('PARIS • HAUTE COUTURE SPECIAL ISSUE', w / 2, h * 0.135);

    // Bottom metadata
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = `${Math.round(h * 0.018)}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('ATELIER VIRTUEL 3.0', w * 0.05, h * 0.94);

    ctx.textAlign = 'right';
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
    ctx.fillText(`N° 01 • ${dateStr}`, w * 0.95, h * 0.94);

    return offscreen.toDataURL('image/png');
  }

  dispose() {
    window.removeEventListener('resize', this.handleResize);
    this.renderer.dispose();
  }
}
