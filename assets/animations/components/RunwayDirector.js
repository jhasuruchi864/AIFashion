import * as THREE from 'three';

/**
 * RunwayDirector manages the 3D catwalk stage, walking model trajectory,
 * camera motion paths, ambient soundtrack synthesis, and show controls.
 */
export class RunwayDirector {
  constructor(studioScene, cameraRig, modelManager) {
    this.studioScene = studioScene;
    this.cameraRig = cameraRig;
    this.modelManager = modelManager;

    this.isPlaying = false;
    this.runwayProgress = 0; // 0 to 1
    this.walkSpeed = 0.14;
    this.cameraMode = 'frontal'; // 'frontal', 'follow', 'hero', 'drone'
    this.currentEnv = 'paris'; // 'paris', 'cyber', 'milano'

    this.initRunwayStage();
    this.initAudioSynthesizer();
  }

  initRunwayStage() {
    this.runwayGroup = new THREE.Group();
    this.runwayGroup.name = 'virtual_runway_stage';

    // 1. Long Elevated Catwalk (14m x 2.4m)
    const catwalkGeo = new THREE.BoxGeometry(2.4, 0.22, 14);
    const catwalkMat = new THREE.MeshStandardMaterial({
      color: 0x0f0f15,
      roughness: 0.12,
      metalness: 0.88
    });
    this.catwalkMesh = new THREE.Mesh(catwalkGeo, catwalkMat);
    this.catwalkMesh.position.set(0, 0.05, 0);
    this.catwalkMesh.receiveShadow = true;
    this.runwayGroup.add(this.catwalkMesh);

    // 2. Catwalk Glowing Neon Edge Rails
    const railMat = new THREE.MeshStandardMaterial({
      color: 0xe6c687,
      emissive: 0xe6c687,
      emissiveIntensity: 1.6
    });
    this.railMat = railMat;

    const leftRailGeo = new THREE.BoxGeometry(0.04, 0.06, 14);
    const leftRail = new THREE.Mesh(leftRailGeo, railMat);
    leftRail.position.set(-1.22, 0.17, 0);
    this.runwayGroup.add(leftRail);

    const rightRail = new THREE.Mesh(leftRailGeo, railMat);
    rightRail.position.set(1.22, 0.17, 0);
    this.runwayGroup.add(rightRail);

    // 3. Runway Front Turntable / Turnaround Pad
    const turnGeo = new THREE.CylinderGeometry(1.5, 1.6, 0.24, 48);
    const turnMesh = new THREE.Mesh(turnGeo, catwalkMat);
    turnMesh.position.set(0, 0.05, 7.2);
    turnMesh.receiveShadow = true;
    this.runwayGroup.add(turnMesh);

    const turnRingGeo = new THREE.TorusGeometry(1.52, 0.02, 16, 48);
    turnRingGeo.rotateX(Math.PI / 2);
    const turnRing = new THREE.Mesh(turnRingGeo, railMat);
    turnRing.position.set(0, 0.17, 7.2);
    this.runwayGroup.add(turnRing);

    // 4. Overhead Stage Truss & Spotlights
    this.spotlights = [];
    for (let z = -5; z <= 6; z += 3.5) {
      const spot = new THREE.SpotLight(0xfff5e6, 2.5);
      spot.position.set((z % 2 === 0 ? 2.5 : -2.5), 6.5, z);
      spot.target.position.set(0, 0.2, z);
      spot.angle = Math.PI / 7;
      spot.penumbra = 0.6;
      spot.decay = 1.4;
      spot.distance = 15;
      spot.castShadow = true;
      this.runwayGroup.add(spot);
      this.runwayGroup.add(spot.target);
      this.spotlights.push(spot);
    }

    // Runway starts hidden until Runway tab is selected
    this.runwayGroup.visible = false;
    this.studioScene.scene.add(this.runwayGroup);
  }

  initAudioSynthesizer() {
    this.audioCtx = null;
    this.isMuted = true;
    this.synthTimer = null;
  }

  startAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.isMuted = false;
    this.scheduleBeats();
  }

  stopAudio() {
    this.isMuted = true;
    if (this.synthTimer) {
      clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
  }

  scheduleBeats() {
    if (this.synthTimer) clearInterval(this.synthTimer);
    let step = 0;
    // 124 BPM runway electronic deep-house rhythm
    const intervalMs = (60 / 124 / 4) * 1000;

    this.synthTimer = setInterval(() => {
      if (this.isMuted || !this.audioCtx) return;
      const t = this.audioCtx.currentTime;

      // Kick drum on quarters (0, 4, 8, 12)
      if (step % 4 === 0) {
        this.playKick(t);
      }
      // Hi-hat on offbeats (2, 6, 10, 14)
      if (step % 4 === 2) {
        this.playHat(t);
      }
      // Chic synth bass note
      if (step % 8 === 0 || step % 8 === 6) {
        this.playBass(t, step % 8 === 0 ? 65 : 78);
      }

      step = (step + 1) % 16;
    }, intervalMs);
  }

  playKick(time) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.frequency.setValueAtTime(120, time);
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.12);
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.18);
  }

  playHat(time) {
    const bufferSize = this.audioCtx.sampleRate * 0.04;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6000, time);
    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);
    noise.start(time);
  }

  playBass(time, freq) {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, time);
    filter.frequency.exponentialRampToValueAtTime(180, time + 0.25);
    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.28);
  }

  enterRunwayMode() {
    this.runwayGroup.visible = true;
    this.studioScene.podiumGroup.visible = false;
    this.modelManager.setPose('runway');
    this.start();
  }

  exitRunwayMode() {
    this.pause();
    this.stopAudio();
    this.runwayGroup.visible = false;
    this.studioScene.podiumGroup.visible = true;
    const model = this.modelManager.activeModel;
    if (model) {
      model.position.set(0, 0.12, 0);
      model.rotation.set(0, 0, 0);
    }
  }

  start() {
    this.isPlaying = true;
    this.startAudio();
  }

  pause() {
    this.isPlaying = false;
    this.stopAudio();
  }

  replay() {
    this.runwayProgress = 0;
    this.start();
  }

  setEnvironment(envKey) {
    this.currentEnv = envKey;
    switch (envKey) {
      case 'cyber':
        this.railMat.color.setHex(0x00f2fe);
        this.railMat.emissive.setHex(0x00f2fe);
        this.spotlights.forEach((s, idx) => {
          s.color.setHex(idx % 2 === 0 ? 0x00f2fe : 0xfe0979);
          s.intensity = 3.2;
        });
        this.studioScene.setLightingPreset('cyber');
        break;
      case 'milano':
        this.railMat.color.setHex(0xffaa5e);
        this.railMat.emissive.setHex(0xffaa5e);
        this.spotlights.forEach((s) => {
          s.color.setHex(0xffaa5e);
          s.intensity = 2.6;
        });
        this.studioScene.setLightingPreset('golden');
        break;
      case 'paris':
      default:
        this.railMat.color.setHex(0xe6c687);
        this.railMat.emissive.setHex(0xe6c687);
        this.spotlights.forEach((s) => {
          s.color.setHex(0xfff5e6);
          s.intensity = 2.8;
        });
        this.studioScene.setLightingPreset('milano');
        break;
    }
  }

  setCameraMode(mode) {
    this.cameraMode = mode;
  }

  update(delta) {
    if (!this.runwayGroup.visible) return;

    if (this.isPlaying) {
      this.runwayProgress += delta * this.walkSpeed;
      if (this.runwayProgress > 1) {
        this.runwayProgress = 0; // loop runway walk
      }
    }

    const model = this.modelManager.activeModel;
    if (!model) return;

    // Runway trajectory path:
    // 0.0 to 0.45: walks from z = -6 to z = 7.2 (front turnaround pad)
    // 0.45 to 0.55: turns around at front, strikes fashion pose
    // 0.55 to 1.0: walks back from z = 7.2 to z = -6
    const p = this.runwayProgress;
    if (p < 0.45) {
      // Forward walk
      const walkT = p / 0.45;
      model.position.z = THREE.MathUtils.lerp(-6, 7.2, walkT);
      model.position.y = 0.16;
      model.rotation.y = 0; // facing front
    } else if (p < 0.55) {
      // Front of runway pose
      model.position.z = 7.2;
      model.position.y = 0.16;
      const turnT = (p - 0.45) / 0.1;
      model.rotation.y = turnT * Math.PI; // smooth turn
    } else {
      // Walk back
      const returnT = (p - 0.55) / 0.45;
      model.position.z = THREE.MathUtils.lerp(7.2, -6, returnT);
      model.position.y = 0.16;
      model.rotation.y = Math.PI; // facing back
    }

    // Camera Cinematics
    const camera = this.cameraRig.camera;
    const controls = this.cameraRig.controls;

    if (this.cameraMode === 'frontal') {
      // Fixed telephoto lens at end of catwalk
      camera.position.set(0, 1.45, 11.2);
      controls.target.set(0, 1.15, model.position.z);
    } else if (this.cameraMode === 'follow') {
      // Behind model follow cam
      const offsetZ = model.rotation.y === 0 ? -2.8 : 2.8;
      camera.position.set(0.6, 1.6, model.position.z + offsetZ);
      controls.target.set(0, 1.2, model.position.z);
    } else if (this.cameraMode === 'hero') {
      // Low angle runway hero
      camera.position.set(1.5, 0.45, model.position.z + 1.8);
      controls.target.set(0, 1.4, model.position.z);
    } else if (this.cameraMode === 'drone') {
      // Sweeping overhead drone
      const angle = p * Math.PI * 2;
      camera.position.set(Math.cos(angle) * 5.5, 5.2, Math.sin(angle) * 5.5);
      controls.target.set(0, 0.5, model.position.z);
    }
  }
}
