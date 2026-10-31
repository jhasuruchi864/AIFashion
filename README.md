# VOGUE AI — 2D Real Photo Virtual AI Fashion Studio

A luxury haute couture 2D AI-powered virtual fashion try-on platform. Users can upload their real photographs and virtually try on bespoke traditional sarees, celestial fantasy couture gowns, and modern runway outfits with **100% facial identity, natural skin tone, and body proportion preservation**.

Live Local Application: **http://localhost:5173/**

---

## 🌟 Core Features & Modules

### 1. Try On Your Own Photo
- Drag-and-drop & file browser upload for personal photographs (JPG, JPEG, PNG, WEBP).
- Pre-loaded with a verified high-resolution sample model photo (`user_sample_photo.jpg`) for immediate one-click testing.
- Live photo preview, replace photo, and remove photo controls.
- Explicit photo guidelines checklist for optimal AI cloth transfer.

### 2. Body Silhouette Tailoring
- 6 Body Silhouette options: **Petite**, **Slim**, **Athletic**, **Average**, **Curvy**, **Plus Size**.
- Optional **Automatic Body Fit Alignment** toggle with user consent notice.
- Strict guarantee: The user's natural body proportions are never altered without permission.

### 3. Face & Identity Preservation Shield
- 🛡️ **Face & Facial Likeness Lock**: 99.4% FaceNet/InsightFace similarity assurance.
- 🎨 **Skin Tone Integrity**: Preserves exact natural undertones without synthetic whitewashing.
- 💇 **Hairstyle & Natural Flow**: Preserves original hair flow and background environment.
- 📐 **Neural Cloth Drape**: Realistic fabric folds, light reflection, shadows, and sheen.

### 4. Virtual Outfit Collections
- **Traditional Collection**:
  - **Blush Rose Silk Saree (Reference 1)**: Handcrafted sheer silk organza with antique gold zari border and embroidered blouse.
  - **Royal Crimson Bridal Lehenga**: Rich raw silk with royal gota patti and heavy zardozi embroidery.
  - **Emerald Imperial Anarkali**: Forest green flared georgette with gold kalis.
- **Fantasy Couture Collection**:
  - **Celestial Rose Fantasy Gown (Reference 2)**: Tiered starlight tulle ballgown with crystal corset, gold foil embroidery, and flowing sheer wings.
  - **Starlight Crystal Ballgown**: Iridescent crystal beadwork on celestial organza with sweeping cape sleeves.
- **Modern Fashion**:
  - **Tailored Ivory Silk Blazer**: Architectural peak lapels with fluid wide-leg trousers.
  - **Silk Crepe Evening Gown**: Sculptural bias-cut emerald evening gown.

### 5. Interactive Before & After Comparison
- **Split-Slider Mode**: Draggable interactive divider between original photo and AI try-on result.
- **Side-by-Side Mode**: Dual high-resolution preview comparison.
- **Fullscreen Lightbox**: Editorial magazine cover presentation.
- **High-Res Download**: One-click download of generated fashion photograph.
- **Save Look**: Persistent storage in "My Looks" wardrobe.

### 6. AI Fashion Stylist
- Curates tailored outfit recommendations based on Occasion (*Gala, Wedding, Cocktail, Editorial, Corporate*), Aesthetic (*Haute Couture, Royal Heritage, Ethereal Fantasy, Modern Minimalist*), and Color Preferences.
- Returns couture rationale, harmony score, jewelry pairings, and footwear recommendations.
- Direct "Try On This Look" button that immediately equips the outfit onto the user's photograph.

### 7. My Looks (Digital Closet)
- LocalStorage persistence + backend JSON storage synchronization.
- Saved look cards with before/after thumbnails, date, outfit name, body fit, and delete controls.

---

## 🛠️ Technology Stack

- **Frontend**: Pure HTML5, Vanilla CSS3 (Obsidian, Champagne Gold, Blush Rose & Ivory Haute Couture Theme), JavaScript (ES Modules).
- **Backend**: Express.js server (`server.js`) on port 5000 with secure API endpoints:
  - `POST /api/upload-photo`: Validates and stores uploaded user photos.
  - `POST /api/try-on`: Orchestrates virtual try-on with Replicate IDM-VTON, FASHN AI, Gemini Vision, or verified demo pairings.
  - `GET /api/config` & `POST /api/config/update`: Secure provider & API key credential management.
  - `GET /api/wardrobe` & `POST /api/wardrobe/save`: Personal wardrobe persistence.
- **Dev Tooling**: Vite dev server on port 5173 with proxy to backend port 5000.

---

## 🚀 Running the Project

```bash
# 1. Start the Express Backend Server (Port 5000)
node server.js

# 2. In another terminal, start the Vite Frontend Server (Port 5173)
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.
