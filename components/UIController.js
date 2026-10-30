/**
 * UIController coordinates all 9 application pages/views, DOM controls,
 * state changes, event bindings, modals, toasts, and HUD updates.
 */
export class UIController {
  constructor(studioScene, cameraRig, modelManager, wardrobeStorage, aiStylist, avatarCustomizer, runwayDirector) {
    this.studioScene = studioScene;
    this.cameraRig = cameraRig;
    this.modelManager = modelManager;
    this.wardrobeStorage = wardrobeStorage;
    this.aiStylist = aiStylist;
    this.avatarCustomizer = avatarCustomizer;
    this.runwayDirector = runwayDirector;

    this.activeView = 'studio';

    this.initElements();
    this.bindNavigation();
    this.bindStudioControls();
    this.bindTryOnControls();
    this.bindAIStylistControls();
    this.bindAvatarCreatorControls();
    this.bindRunwayControls();
    this.bindPhotoshootControls();
    this.bindWardrobeDashboard();
    this.bindComparisonControls();
    this.bindViewportActionDock();

    this.updateModelSpecsHUD();
  }

  initElements() {
    // Navigation
    this.navButtons = document.querySelectorAll('[data-page]');
    this.viewSections = document.querySelectorAll('.page-view-panel');
    this.homeOverlay = document.getElementById('homeOverlay');

    // Drawer and Toasts
    this.leftPanel = document.getElementById('leftPanel');
    this.btnToggleDrawer = document.getElementById('btnToggleDrawer');
    this.toast = document.getElementById('toastNotification');

    // Studio HUD Elements
    this.hudModelName = document.getElementById('hudModelName');
    this.hudModelHeight = document.getElementById('hudModelHeight');
    this.hudModelOutfit = document.getElementById('hudModelOutfit');
    this.hudModelPoly = document.getElementById('hudModelPoly');
    this.hudLightingMood = document.getElementById('hudLightingMood');
    this.loadingOverlay = document.getElementById('loadingOverlay');
    this.loadingText = document.getElementById('loadingText');
    this.loadingBar = document.getElementById('loadingBar');
  }

  // ==========================================================================
  // Page Navigation (9 Views)
  // ==========================================================================
  bindNavigation() {
    this.navButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        this.navigateTo(page);
      });
    });

    // Portal cards on Home overlay
    const portalCards = document.querySelectorAll('[data-portal]');
    portalCards.forEach((card) => {
      card.addEventListener('click', () => {
        const page = card.dataset.portal;
        this.navigateTo(page);
      });
    });

    // Enter Studio CTA
    const btnEnterStudio = document.getElementById('btnEnterStudio');
    if (btnEnterStudio) {
      btnEnterStudio.addEventListener('click', () => {
        this.navigateTo('studio');
      });
    }

    if (this.btnToggleDrawer && this.leftPanel) {
      this.btnToggleDrawer.addEventListener('click', () => {
        this.leftPanel.classList.toggle('open');
      });
    }
  }

  navigateTo(pageKey) {
    this.activeView = pageKey;

    // Update nav buttons
    this.navButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.page === pageKey);
    });

    // Hide / show panels
    this.viewSections.forEach((panel) => {
      panel.classList.toggle('active', panel.id === `view-${pageKey}`);
    });

    // Handle home overlay visibility
    if (this.homeOverlay) {
      this.homeOverlay.classList.toggle('active', pageKey === 'home');
    }

    // Handle Runway mode transition
    if (pageKey === 'runway') {
      this.runwayDirector.enterRunwayMode();
      this.showToast('Virtual Runway Activated — Catwalk Music & Stride');
    } else {
      if (this.runwayDirector.runwayGroup.visible) {
        this.runwayDirector.exitRunwayMode();
      }
    }

    // Refresh dynamic lists for Wardrobe or Comparison
    if (pageKey === 'wardrobe') {
      this.renderWardrobeDashboard();
    } else if (pageKey === 'compare') {
      this.renderComparisonView();
    } else if (pageKey === 'photoshoot') {
      this.cameraRig.setPreset('portrait', true);
    } else if (pageKey === 'studio') {
      this.cameraRig.setPreset('full', true);
    }

    this.showToast(`Mode: ${pageKey.toUpperCase().replace('-', ' ')}`);
  }

  // ==========================================================================
  // 1. Studio Controls
  // ==========================================================================
  bindStudioControls() {
    // Model Selection
    const modelBtns = document.querySelectorAll('[data-model]');
    modelBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.model;
        modelBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.modelManager.displayModel(key);
        this.updateModelSpecsHUD();
        this.showToast(`Model: ${this.modelManager.getCurrentMetadata().name}`);
      });
    });

    // Studio Poses
    const poseBtns = document.querySelectorAll('[data-pose]');
    poseBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const pose = btn.dataset.pose;
        poseBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.modelManager.setPose(pose);
        this.showToast(`Pose: ${btn.textContent.trim()}`);
      });
    });

    // Lighting Presets
    const lightingBtns = document.querySelectorAll('[data-lighting]');
    lightingBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const preset = btn.dataset.lighting;
        lightingBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.studioScene.setLightingPreset(preset);
        if (this.hudLightingMood) {
          this.hudLightingMood.textContent = btn.textContent.trim();
        }
        this.showToast(`Lighting: ${btn.textContent.trim()}`);
      });
    });
  }

  // ==========================================================================
  // 2. Virtual Try-On Controls (12 Categories)
  // ==========================================================================
  bindTryOnControls() {
    const categoryTabs = document.querySelectorAll('[data-wardrobe-cat]');
    const wardrobeItemsContainer = document.getElementById('wardrobeItemsContainer');

    const wardrobeCatalog = {
      tops: ['Silk Corset Camisole', 'Cashmere Knit Turtleneck', 'Sheer Organza Blouse', 'Sculptural Asymmetric Top'],
      shirts: ['Oversized Poplin Oxford', 'Pleated Silk Evening Shirt', 'Modern Camp-Collar Shirt'],
      jeans: ['Tailored Indigo Raw Denim', 'Wide-Leg Relaxed Denim', 'High-Rise Bleached Slacks'],
      trousers: ['Tapered Wool Cigarette Slacks', 'Fluid Satin Palazzo Pants', 'Double-Pleated Trousers'],
      skirts: ['Pleated Asymmetric Midi Skirt', 'High-Waisted Pencil Skirt', 'Voluminous Silk Ball Skirt'],
      dresses: ['Haute Couture Evening Gown', 'Architectural Column Dress', 'Draped Silk Slip Dress', 'Mermaid Gala Gown'],
      jackets: ['Structured Satin Tuxedo Blazer', 'Cropped Leather Biker Jacket', 'Velvet Smoking Jacket'],
      coats: ['Cashmere Architectural Longcoat', 'Belted Double-Face Trench', 'Cocoon Wool Overcoat'],
      suits: ['Double-Breasted Italian Wool Suit', 'Minimalist Monochromatic Tuxedo', 'Tailored Power Suit'],
      shoes: ['Runway Stiletto Pumps', 'Lug-Sole Futuristic Chelsea Boots', 'Crystal Strappy Sandals', 'Italian Suede Loafers'],
      handbags: ['Minaudière Champagne Clutch', 'Structured Calfskin Leather Tote', 'Geometric Crossbody Bag'],
      accessories: ['Rolex Luxury Chronograph', 'Tiered Diamond Choker', 'Acetate Avant-Garde Eyewear', 'Polki Heritage Drop Earrings']
    };

    const renderItemsForCategory = (cat) => {
      if (!wardrobeItemsContainer) return;
      const items = wardrobeCatalog[cat] || [];
      wardrobeItemsContainer.innerHTML = items
        .map(
          (item) => `
        <button class="tryon-item-card ${this.modelManager.currentOutfit[cat] === item ? 'active' : ''}" data-cat="${cat}" data-item="${item}">
          <span class="tryon-item-icon">✦</span>
          <div class="tryon-item-meta">
            <span class="tryon-item-name">${item}</span>
            <span class="tryon-item-desc">Haute Couture Collection</span>
          </div>
          <span class="tryon-equip-tag">Equip</span>
        </button>
      `
        )
        .join('');

      wardrobeItemsContainer.querySelectorAll('.tryon-item-card').forEach((card) => {
        card.addEventListener('click', () => {
          wardrobeItemsContainer.querySelectorAll('.tryon-item-card').forEach((c) => c.classList.remove('active'));
          card.classList.add('active');
          const c = card.dataset.cat;
          const i = card.dataset.item;
          this.modelManager.equipWardrobeItem(c, i);
          this.updateModelSpecsHUD();
          this.showToast(`Equipped: ${i}`);
        });
      });
    };

    categoryTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.wardrobeCat;
        renderItemsForCategory(cat);
      });
    });

    renderItemsForCategory('dresses');

    // Fabric & Color for Try-On
    const fabricBtns = document.querySelectorAll('[data-fabric]');
    fabricBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        fabricBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.modelManager.applyFabric(btn.dataset.fabric);
        this.showToast(`Fabric: ${btn.dataset.fabric.toUpperCase()}`);
      });
    });

    const colorChips = document.querySelectorAll('[data-color]');
    colorChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        colorChips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        this.modelManager.applyColor(chip.dataset.color);
        this.showToast(`Colorway: ${chip.dataset.color}`);
      });
    });

    const customColorInput = document.getElementById('customColorInput');
    if (customColorInput) {
      customColorInput.addEventListener('input', (e) => {
        this.modelManager.applyColor(e.target.value);
      });
    }

    // Pattern Selector (Solid, Jacquard, Houndstooth, Cyber)
    const patternBtns = document.querySelectorAll('[data-pattern]');
    patternBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        patternBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.modelManager.applyPattern(btn.dataset.pattern);
        this.showToast(`Pattern: ${btn.dataset.pattern.toUpperCase()}`);
      });
    });

    // Try-on Angle Presets: Front, Side, Back, 360
    const angleBtns = document.querySelectorAll('[data-angle]');
    angleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        angleBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const angle = btn.dataset.angle;
        if (angle === '360') {
          this.cameraRig.toggleAutoRotate(true);
        } else {
          this.cameraRig.toggleAutoRotate(false);
          this.cameraRig.setPreset(angle, true);
        }
      });
    });

    // Save Look Button
    const btnSaveLook = document.getElementById('btnSaveLook');
    if (btnSaveLook) {
      btnSaveLook.addEventListener('click', () => {
        const name = prompt('Name this custom look:', 'Atelier Ensemble N° ' + Math.floor(Math.random() * 900 + 100));
        if (name) {
          this.wardrobeStorage.addOutfit({
            name,
            model: this.modelManager.currentModelKey,
            items: { ...this.modelManager.currentOutfit },
            fabric: this.modelManager.activeFabric,
            color: this.modelManager.activeColor,
            pattern: this.modelManager.activePattern
          });
          this.showToast(`Look "${name}" saved to My Wardrobe!`);
        }
      });
    }
  }

  // ==========================================================================
  // 3. AI Fashion Stylist Controls
  // ==========================================================================
  bindAIStylistControls() {
    const btnGenerateAI = document.getElementById('btnGenerateAI');
    const aiOccasionSelect = document.getElementById('aiOccasionSelect');
    const aiStyleSelect = document.getElementById('aiStyleSelect');
    const aiColorSelect = document.getElementById('aiColorSelect');

    const aiResultCard = document.getElementById('aiResultCard');
    const aiResultTitle = document.getElementById('aiResultTitle');
    const aiResultRationale = document.getElementById('aiResultRationale');
    const aiEnsembleList = document.getElementById('aiEnsembleList');
    const btnEquipAILook = document.getElementById('btnEquipAILook');

    let currentAIRec = null;

    if (btnGenerateAI) {
      btnGenerateAI.addEventListener('click', () => {
        const occ = aiOccasionSelect ? aiOccasionSelect.value : 'gala';
        const style = aiStyleSelect ? aiStyleSelect.value : 'Minimalist Luxe';
        const color = aiColorSelect ? aiColorSelect.value : '#d8b87d';

        this.showToast('AI Stylist analyzing silhouette & color harmony...');
        btnGenerateAI.disabled = true;
        btnGenerateAI.textContent = 'Curating Ensemble...';

        setTimeout(() => {
          btnGenerateAI.disabled = false;
          btnGenerateAI.textContent = 'Generate AI Recommendation ✦';

          currentAIRec = this.aiStylist.generateRecommendation(occ, style, color);

          if (aiResultCard) aiResultCard.classList.remove('hidden');
          if (aiResultTitle) aiResultTitle.textContent = currentAIRec.title;
          if (aiResultRationale) aiResultRationale.textContent = currentAIRec.customizedRationale;

          if (aiEnsembleList) {
            aiEnsembleList.innerHTML = Object.entries(currentAIRec.ensemble)
              .map(([cat, item]) => `<li><strong>${cat.toUpperCase()}:</strong> ${item}</li>`)
              .join('');
          }

          this.showToast('AI Couture Recommendation Generated!');
        }, 600);
      });
    }

    if (btnEquipAILook) {
      btnEquipAILook.addEventListener('click', () => {
        if (currentAIRec) {
          this.aiStylist.applyRecommendationToModel(currentAIRec);
          this.updateModelSpecsHUD();
          this.showToast('AI Look Equipped onto 3D Avatar!');
        }
      });
    }
  }

  // ==========================================================================
  // 4. Custom Avatar Creator Controls
  // ==========================================================================
  bindAvatarCreatorControls() {
    const avatarGenderBtns = document.querySelectorAll('[data-avatar-gender]');
    avatarGenderBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        avatarGenderBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.avatarCustomizer.setGender(btn.dataset.avatarGender);
        this.showToast(`Avatar Base: ${btn.dataset.avatarGender.toUpperCase()}`);
      });
    });

    const skinToneBtns = document.querySelectorAll('[data-skintone]');
    skinToneBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        skinToneBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.avatarCustomizer.setSkinTone(btn.dataset.skintone);
        this.showToast(`Skin Undertone: ${btn.dataset.skintone}`);
      });
    });

    const hairColorBtns = document.querySelectorAll('[data-haircolor]');
    hairColorBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        hairColorBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.avatarCustomizer.setHairColor(btn.dataset.haircolor);
        this.showToast('Hair shade updated');
      });
    });

    const eyeColorBtns = document.querySelectorAll('[data-eyecolor]');
    eyeColorBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        eyeColorBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.avatarCustomizer.setEyeColor(btn.dataset.eyecolor);
        this.showToast('Eye shade updated');
      });
    });

    const heightSlider = document.getElementById('avatarHeightSlider');
    const heightDisplay = document.getElementById('avatarHeightDisplay');
    if (heightSlider) {
      heightSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        if (heightDisplay) heightDisplay.textContent = `${val} cm`;
        this.avatarCustomizer.setHeight(val);
      });
    }

    const silhouetteBtns = document.querySelectorAll('[data-silhouette]');
    silhouetteBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        silhouetteBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.avatarCustomizer.setSilhouette(btn.dataset.silhouette);
        this.showToast(`Silhouette: ${btn.dataset.silhouette.toUpperCase()}`);
      });
    });

    const btnSaveAvatar = document.getElementById('btnSaveAvatar');
    if (btnSaveAvatar) {
      btnSaveAvatar.addEventListener('click', () => {
        const name = prompt('Name your custom digital avatar:', 'My Atelier Avatar');
        if (name) {
          this.avatarCustomizer.saveAvatar(name);
          this.showToast(`Avatar "${name}" saved to My Wardrobe!`);
        }
      });
    }
  }

  // ==========================================================================
  // 5. Virtual Runway Controls
  // ==========================================================================
  bindRunwayControls() {
    const btnRunwayPlay = document.getElementById('btnRunwayPlay');
    const btnRunwayReplay = document.getElementById('btnRunwayReplay');
    const btnRunwayAudio = document.getElementById('btnRunwayAudio');

    if (btnRunwayPlay) {
      btnRunwayPlay.addEventListener('click', () => {
        if (this.runwayDirector.isPlaying) {
          this.runwayDirector.pause();
          btnRunwayPlay.textContent = '▶ Resume Runway Show';
        } else {
          this.runwayDirector.start();
          btnRunwayPlay.textContent = '⏸ Pause Runway Show';
        }
      });
    }

    if (btnRunwayReplay) {
      btnRunwayReplay.addEventListener('click', () => {
        this.runwayDirector.replay();
        if (btnRunwayPlay) btnRunwayPlay.textContent = '⏸ Pause Runway Show';
        this.showToast('Replaying Runway Show from start');
      });
    }

    if (btnRunwayAudio) {
      btnRunwayAudio.addEventListener('click', () => {
        if (this.runwayDirector.isMuted) {
          this.runwayDirector.startAudio();
          btnRunwayAudio.textContent = '🔊 Soundtrack: ON';
        } else {
          this.runwayDirector.stopAudio();
          btnRunwayAudio.textContent = '🔇 Soundtrack: MUTED';
        }
      });
    }

    // Runway Camera Angles
    const runwayCamBtns = document.querySelectorAll('[data-runway-cam]');
    runwayCamBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        runwayCamBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.runwayDirector.setCameraMode(btn.dataset.runwayCam);
        this.showToast(`Runway Camera: ${btn.textContent.trim()}`);
      });
    });

    // Runway Environments
    const runwayEnvBtns = document.querySelectorAll('[data-runway-env]');
    runwayEnvBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        runwayEnvBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.runwayDirector.setEnvironment(btn.dataset.runwayEnv);
        this.showToast(`Runway Venue: ${btn.textContent.trim()}`);
      });
    });
  }

  // ==========================================================================
  // 6. Fashion Photoshoot Controls
  // ==========================================================================
  bindPhotoshootControls() {
    const backdropBtns = document.querySelectorAll('[data-backdrop]');
    backdropBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        backdropBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.studioScene.setBackdropPreset(btn.dataset.backdrop);
        this.showToast(`Backdrop: ${btn.textContent.trim()}`);
      });
    });

    const shootPoseBtns = document.querySelectorAll('[data-shoot-pose]');
    shootPoseBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        shootPoseBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.modelManager.setPose(btn.dataset.shootPose);
        this.showToast(`Editorial Pose: ${btn.textContent.trim()}`);
      });
    });

    const shootCamBtns = document.querySelectorAll('[data-shoot-cam]');
    shootCamBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        shootCamBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.cameraRig.setPreset(btn.dataset.shootCam, true);
        this.showToast(`Camera Angle: ${btn.textContent.trim()}`);
      });
    });

    // High-Resolution Editorial Capture Button
    const btnCapturePhoto = document.getElementById('btnCapturePhoto');
    if (btnCapturePhoto) {
      btnCapturePhoto.addEventListener('click', () => {
        this.showToast('Rendering high-resolution magazine editorial...');
        setTimeout(() => {
          const photoUrl = this.studioScene.captureEditorialSnapshot('VOGUE AI PARIS');
          this.wardrobeStorage.addPhoto(photoUrl, `${this.modelManager.getCurrentMetadata().name} – Editorial`);

          // Download immediately
          const link = document.createElement('a');
          link.download = `VogueAI_Editorial_${Date.now()}.png`;
          link.href = photoUrl;
          link.click();

          this.showToast('Editorial photograph captured & saved to My Wardrobe!');
        }, 150);
      });
    }
  }

  // ==========================================================================
  // 7. My Wardrobe Dashboard
  // ==========================================================================
  bindWardrobeDashboard() {
    const tabBtns = document.querySelectorAll('[data-wardrobe-tab]');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderWardrobeDashboard(btn.dataset.wardrobeTab);
      });
    });
  }

  renderWardrobeDashboard(activeTab = 'outfits') {
    const container = document.getElementById('wardrobeContentGrid');
    if (!container) return;

    if (activeTab === 'outfits') {
      const outfits = this.wardrobeStorage.getOutfits();
      if (outfits.length === 0) {
        container.innerHTML = '<p class="empty-state">No saved outfits yet. Create one in Virtual Try-On or AI Stylist!</p>';
        return;
      }
      container.innerHTML = outfits
        .map(
          (o) => `
        <div class="wardrobe-card glass-card">
          <div class="wardrobe-card-header">
            <span class="wardrobe-card-tag">${o.category || 'Atelier Look'}</span>
            <button class="btn-card-del" data-del-outfit="${o.id}">&times;</button>
          </div>
          <h4>${o.name}</h4>
          <p class="wardrobe-card-date">Created on ${o.date || 'Recent'}</p>
          <div class="wardrobe-card-items">
            ${Object.entries(o.items || {})
              .slice(0, 3)
              .map(([k, v]) => `<div><span>${k}:</span> ${v}</div>`)
              .join('')}
          </div>
          <div class="wardrobe-card-footer">
            <button class="btn-luxury-cta sm" data-equip-outfit="${o.id}">Equip to Studio</button>
          </div>
        </div>
      `
        )
        .join('');

      container.querySelectorAll('[data-equip-outfit]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.equipOutfit;
          const outfit = outfits.find((x) => x.id === id);
          if (outfit) {
            this.modelManager.displayModel(outfit.model || 'female');
            if (outfit.color) this.modelManager.applyColor(outfit.color);
            if (outfit.fabric) this.modelManager.applyFabric(outfit.fabric);
            this.updateModelSpecsHUD();
            this.navigateTo('studio');
            this.showToast(`Equipped "${outfit.name}"`);
          }
        });
      });

      container.querySelectorAll('[data-del-outfit]').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.wardrobeStorage.deleteOutfit(btn.dataset.delOutfit);
          this.renderWardrobeDashboard('outfits');
          this.showToast('Outfit removed from wardrobe');
        });
      });
    } else if (activeTab === 'avatars') {
      const avatars = this.wardrobeStorage.getAvatars();
      if (avatars.length === 0) {
        container.innerHTML = '<p class="empty-state">No custom avatars saved yet. Customize one in Avatar Creator!</p>';
        return;
      }
      container.innerHTML = avatars
        .map(
          (a) => `
        <div class="wardrobe-card glass-card">
          <div class="wardrobe-card-header">
            <span class="wardrobe-card-tag">${(a.gender || 'Avatar').toUpperCase()}</span>
            <button class="btn-card-del" data-del-avatar="${a.id}">&times;</button>
          </div>
          <h4>${a.name}</h4>
          <p class="wardrobe-card-date">${a.height || 180} cm • ${(a.silhouette || 'Slender').toUpperCase()}</p>
          <div class="avatar-swatch-row">
            <span class="swatch-circle" style="background: ${a.skinTone};" title="Skin"></span>
            <span class="swatch-circle" style="background: ${a.hairColor};" title="Hair"></span>
            <span class="swatch-circle" style="background: ${a.eyeColor};" title="Eyes"></span>
          </div>
          <div class="wardrobe-card-footer">
            <button class="btn-luxury-cta sm" data-load-avatar="${a.id}">Activate Avatar</button>
          </div>
        </div>
      `
        )
        .join('');

      container.querySelectorAll('[data-load-avatar]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const a = avatars.find((x) => x.id === btn.dataset.loadAvatar);
          if (a) {
            this.avatarCustomizer.loadAvatar(a);
            this.navigateTo('studio');
            this.showToast(`Activated avatar "${a.name}"`);
          }
        });
      });

      container.querySelectorAll('[data-del-avatar]').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.wardrobeStorage.deleteAvatar(btn.dataset.delAvatar);
          this.renderWardrobeDashboard('avatars');
          this.showToast('Avatar deleted');
        });
      });
    } else if (activeTab === 'photos') {
      const photos = this.wardrobeStorage.getPhotos();
      if (photos.length === 0) {
        container.innerHTML = '<p class="empty-state">No photoshoot photos yet. Capture some in Fashion Photoshoot!</p>';
        return;
      }
      container.innerHTML = photos
        .map(
          (p) => `
        <div class="wardrobe-card glass-card photo-card">
          <img src="${p.dataUrl}" alt="${p.title}" class="photo-thumb" />
          <div class="photo-meta">
            <h4>${p.title}</h4>
            <p class="wardrobe-card-date">${p.date}</p>
            <div class="photo-actions">
              <a href="${p.dataUrl}" download="VogueAI_${p.id}.png" class="btn-luxury-cta sm">Download</a>
              <button class="btn-card-del" data-del-photo="${p.id}">&times;</button>
            </div>
          </div>
        </div>
      `
        )
        .join('');

      container.querySelectorAll('[data-del-photo]').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.wardrobeStorage.deletePhoto(btn.dataset.delPhoto);
          this.renderWardrobeDashboard('photos');
          this.showToast('Photograph removed');
        });
      });
    }
  }

  // ==========================================================================
  // 8. Outfit Comparison Controls (Look A vs Look B)
  // ==========================================================================
  bindComparisonControls() {
    this.comparisonLooks = {
      lookA: {
        title: 'Milano Gala Elegance',
        model: 'female',
        fabric: 'Silk Satin',
        color: '#d8b87d',
        ensemble: 'Crepe Evening Gown & Blazer',
        occasion: 'Red Carpet Gala',
        harmony: '98%',
        versatility: '78%'
      },
      lookB: {
        title: 'Cyberpunk Vanguard',
        model: 'male',
        fabric: 'Metallic Lamé',
        color: '#00f2fe',
        ensemble: 'Techno Trench & Chelsea Platform',
        occasion: 'Streetwear / Avant-Garde',
        harmony: '95%',
        versatility: '88%'
      }
    };

    const btnEquipLookA = document.getElementById('btnEquipLookA');
    const btnEquipLookB = document.getElementById('btnEquipLookB');

    if (btnEquipLookA) {
      btnEquipLookA.addEventListener('click', () => {
        this.modelManager.displayModel(this.comparisonLooks.lookA.model);
        this.modelManager.applyColor(this.comparisonLooks.lookA.color);
        this.modelManager.applyFabric('satin');
        this.navigateTo('studio');
        this.showToast('Look A Equipped to 3D Studio');
      });
    }

    if (btnEquipLookB) {
      btnEquipLookB.addEventListener('click', () => {
        this.modelManager.displayModel(this.comparisonLooks.lookB.model);
        this.modelManager.applyColor(this.comparisonLooks.lookB.color);
        this.modelManager.applyFabric('lame');
        this.navigateTo('studio');
        this.showToast('Look B Equipped to 3D Studio');
      });
    }
  }

  renderComparisonView() {
    // Refresh comparison specs if needed
  }

  // ==========================================================================
  // 9. Floating Viewport Action Dock
  // ==========================================================================
  bindViewportActionDock() {
    const btnAutoRotate = document.getElementById('btnAutoRotate');
    const btnResetCamera = document.getElementById('btnResetCamera');
    const btnZoomIn = document.getElementById('btnZoomIn');
    const btnZoomOut = document.getElementById('btnZoomOut');
    const btnWireframe = document.getElementById('btnWireframe');
    const btnSnapshot = document.getElementById('btnSnapshot');

    if (btnAutoRotate) {
      btnAutoRotate.addEventListener('click', () => {
        const active = this.cameraRig.toggleAutoRotate();
        btnAutoRotate.classList.toggle('active', active);
        this.showToast(`360° Turntable: ${active ? 'ON' : 'PAUSED'}`);
      });
    }

    if (btnResetCamera) {
      btnResetCamera.addEventListener('click', () => {
        this.cameraRig.resetCamera();
        this.showToast('Camera View Reset');
      });
    }

    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => this.cameraRig.zoomIn());
    }

    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => this.cameraRig.zoomOut());
    }

    if (btnWireframe) {
      btnWireframe.addEventListener('click', () => {
        const nextState = !this.modelManager.isWireframe;
        this.modelManager.setWireframe(nextState);
        btnWireframe.classList.toggle('active', nextState);
        this.showToast(`Hologram Wireframe: ${nextState ? 'ON' : 'OFF'}`);
      });
    }

    if (btnSnapshot) {
      btnSnapshot.addEventListener('click', () => {
        this.showToast('Rendering high-res studio snapshot...');
        setTimeout(() => {
          const dataUrl = this.studioScene.captureSnapshot();
          const link = document.createElement('a');
          link.download = `VogueAI_Studio_${Date.now()}.png`;
          link.href = dataUrl;
          link.click();
          this.showToast('Snapshot saved to Downloads');
        }, 150);
      });
    }
  }

  updateModelSpecsHUD() {
    const meta = this.modelManager.getCurrentMetadata();
    if (this.hudModelName) this.hudModelName.textContent = meta.name;
    if (this.hudModelHeight) this.hudModelHeight.textContent = meta.height;
    if (this.hudModelOutfit) this.hudModelOutfit.textContent = meta.outfit;
    if (this.hudModelPoly) this.hudModelPoly.textContent = meta.polyCount;
  }

  showToast(message) {
    if (!this.toast) return;
    this.toast.textContent = message;
    this.toast.classList.add('visible');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toast.classList.remove('visible');
    }, 2400);
  }

  setLoadingProgress(message, percentage) {
    if (this.loadingText) this.loadingText.textContent = message;
    if (this.loadingBar) this.loadingBar.style.width = `${percentage}%`;
    if (percentage >= 100) {
      setTimeout(() => {
        if (this.loadingOverlay) {
          this.loadingOverlay.classList.add('hidden');
        }
      }, 400);
    }
  }
}
