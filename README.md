# VOGUE AI — 3D Virtual AI Fashion Studio Universe

A premium, luxury 3D AI-powered fashion universe combining high-end haute couture design, interactive 3D human models, a 12-category virtual try-on dressing room, custom avatar creator, AI fashion stylist, dynamic 3D catwalk runway with generative soundtrack, editorial photoshoot studio, and side-by-side outfit comparison.

Live Local Server: **http://localhost:5173/**

---

## 🌟 The 9 Interactive Sections & Experiences

1. **Home (Digital Atelier)**
   - Editorial hero presentation with luxury typography, ambient lighting, and interactive quick-access portals to every fashion experience.
2. **3D Fashion Studio**
   - High-fashion 3D viewing area with stylized female (*Aria*), male (*Julian*), and procedural (*Kira*) models.
   - Poses: *Runway Walk*, *Editorial Stance*, *Chic Silhouette*, *T-Pose Fitting*.
   - Lighting: *Milano Runway*, *Cyberpunk Neon*, *Midnight Noir*, *Golden Hour*.
3. **Virtual Clothes Try-On**
   - 12 Garment Categories: **Tops, Shirts, Jeans, Trousers, Skirts, Dresses, Jackets, Coats, Suits, Shoes, Handbags, Accessories**.
   - Textile finishes: *Silk Satin*, *Matte Wool*, *Patent Gloss*, *Metallic Lamé*.
   - Patterns: *Solid Luxury*, *Jacquard Monogram*, *Houndstooth Weave*, *Cyber Grid*.
   - View angles: *Front View*, *Side View*, *Back View*, *360° Turntable*.
   - Persistence: "Save Look to My Wardrobe".
4. **AI Fashion Stylist**
   - Intelligent fashion recommendation engine based on occasion (*Gala, Office, Streetwear, Wedding, Traditional Heritage, Casual Chic*), style vibe (*Minimalist Luxe, Cyber-Futurism, High-Glamour, Architectural*), and color harmony.
   - Outputs full curated ensemble breakdown, harmonic balance scores, and detailed couture rationale.
   - Instant *"Try On Recommended Look in 3D"* button that equips the outfit onto the active 3D model.
5. **Custom Avatar Creator**
   - Female & Male base model selection.
   - Facial and skin undertones (5 realistic luxury swatches).
   - Hairstyle shades (Obsidian Noir, Espresso Brunette, Champagne Blonde, Auburn, Rose Quartz).
   - Eye/Iris color customization (Azure Cerulean, Emerald, Deep Amber, Midnight Black).
   - Height slider (165 cm to 195 cm) with real-time 3D model scaling.
   - Body proportions & silhouettes: *Slender Couture*, *Athletic Defined*, *Runway Supermodel*, *Sculptural Curvy*.
   - Saves customized digital identity to personal avatar archive.
6. **Virtual Runway**
   - 3D fashion show on a 14-meter elevated catwalk stage with glowing LED rails, overhead truss spotlights, and turnaround stage pad.
   - Animated walking stride with turnaround pose sequence.
   - Web Audio ambient catwalk soundtrack synthesizer with 124 BPM deep-house rhythm, kick drum, hi-hats, and synth bassline (with Play / Pause / Replay / Mute controls).
   - Cinematic tracking camera modes: *Frontal Telephoto*, *Catwalk Follow*, *Low-Angle Hero*, *Overhead Drone*.
   - Venues: *Paris Grand Palais*, *Cyberpunk Tokyo*, *Milano Duomo Square*.
7. **Fashion Photoshoot**
   - Studio backdrops: *Obsidian Cyclorama*, *Champagne Silk*, *Brutalist Concrete*, *Sunset Rose Gradient*.
   - Camera angles: *Close-up Beauty Portrait*, *Silhouette Torso*, *Dramatic Low Angle*, *Full-Length Cover*.
   - High-Res Capture tool: Renders magazine editorial cover photos with *"VOGUE AI PARIS • HAUTE COUTURE SPECIAL ISSUE"* watermark and date stamp, automatically downloading and saving to the user's photoshoot gallery.
8. **My Wardrobe & Looks**
   - Personal wardrobe dashboard with three tabs: *Saved Outfits*, *Saved Avatars*, and *Editorial Photos*.
   - Equip saved outfits directly into the 3D studio, activate custom avatars, and delete/manage items.
9. **Outfit Comparison**
   - Side-by-side comparative analysis of Look A (*Milano Gala Elegance*) vs Look B (*Cyberpunk Vanguard*).
   - Metrics: Silhouette balance, Color harmony score, Occasion suitability, Versatility index.
   - Single-click action to equip either look into the 3D studio.

---

## 📂 Project Architecture

```
AiFashion/
├── index.html                    # Luxury dark UI with glassmorphism for all 9 pages
├── style.css                     # Haute couture theme: obsidian, champagne & blush
├── script.js                     # Main application orchestrator & animation loop
│
├── assets/
│   ├── models/
│   │   ├── female.glb            # Stylized female model (Aria – Haute Couture)
│   │   ├── male.glb              # Stylized male model (Julian – Modern Tailored)
│   │   └── rolex.glb             # 3D luxury chronograph accessory
│   ├── textures/                 # PBR textures & procedural canvas patterns
│   └── animations/               # Model skeletal animation clips
│
├── components/
│   ├── StudioScene.js            # Three.js scene, lighting, runway podium, backdrops, editorial watermark
│   ├── ModelManager.js           # GLB loader, 12 wardrobe categories, accessories, pattern textures
│   ├── CameraRig.js              # OrbitControls, view presets (front/side/back/hero), transitions
│   ├── WardrobeStorage.js        # LocalStorage persistence for outfits, avatars & photos
│   ├── AIStylist.js              # Occasion-based AI styling recommendations & rationale
│   ├── AvatarCustomizer.js       # Skin tones, hair, eyes, height slider & body silhouettes
│   ├── RunwayDirector.js         # 3D catwalk stage, walking trajectory, camera tracks & Web Audio synth
│   └── UIController.js           # Single-page app router & event controller for all 9 views
│
├── package.json                  # Dependencies & Vite scripts
└── README.md                     # Documentation
```

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism & luxury dark design tokens), JavaScript (ES Modules).
- **3D Graphics Engine**: Three.js (`WebGLRenderer`, `PerspectiveCamera`, `OrbitControls`, `GLTFLoader`, `AnimationMixer`).
- **Audio**: Web Audio API (real-time synthesizers and rhythm oscillators for catwalk music).
- **Tooling**: Vite.
- **Persistence**: LocalStorage with schema versioning for outfits, avatars, and editorial snapshots.
- **Tone Mapping**: ACES Filmic Tone Mapping with PCF Soft Shadows.

---

## 🚀 Running the Project

```bash
# Start local development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.
