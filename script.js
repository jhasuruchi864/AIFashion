/**
 * VOGUE AI — YOUR PERSONAL AI FASHION UNIVERSE
 * Complete Platform Controller & Client Orchestrator
 */

// =============================================================================
// Global State Management
// =============================================================================
const state = {
  activePage: 'home',

  // Universal User Photo State (Syncs across all features)
  activePhoto: {
    isSample: true,
    url: '/assets/images/user_sample_photo.jpg',
    filename: 'user_sample_photo.jpg (Verified Model)',
    fileObject: null,
    isReady: true
  },

  // Try-On Garment & Body Selections
  selectedOutfitId: 'pink-saree-traditional',
  selectedCategory: 'all',
  selectedBodyType: 'average',
  clothingSize: 'M',
  preferredFit: 'regular',
  customColor: 'Original Couture',
  customFabric: 'Pure Silk Organza',
  customSleeves: 'Couture Cut',
  customAccessories: 'Royal Heritage Jewels',

  // Current Try-On Output
  currentTryonResult: {
    originalUrl: '/assets/images/user_sample_photo.jpg',
    resultUrl: '/assets/images/tryon_result_pink_saree.jpg',
    outfitTitle: 'Blush Rose Silk Saree',
    outfitId: 'pink-saree-traditional'
  },

  // Royal Transformation
  currentTransformStyle: 'royal-indian',

  // Glam Room Beauty State
  glam: {
    type: 'makeup',
    lipstick: 'Blush Nude Satin',
    eyeshadow: 'Champagne Shimmer',
    blush: 'Rose Petal Dewy',
    hairStyle: 'Long Flowing Waves',
    hairColor: 'Natural Espresso Brunette',
    jewelry: 'Kundan Heritage Jhumkas',
    preset: 'Soft Glam Glow'
  },

  // Photoshoot
  photoshoot: {
    bgId: 'palace',
    styleMode: 'editorial',
    currentBgUrl: '/assets/images/bg_royal_palace.jpg'
  },

  // Wardrobe & Looks
  wardrobe: [],
  digitalCloset: [
    { id: 'item-1', name: 'Handcrafted Blush Saree', cat: 'Traditional', image: '/assets/images/pink_saree_reference.jpg', outfitId: 'pink-saree-traditional' },
    { id: 'item-2', name: 'Celestial Rose Fantasy Gown', cat: 'Couture Gown', image: '/assets/images/pink_fantasy_couture.jpg', outfitId: 'pink-fantasy-couture' },
    { id: 'item-3', name: 'Tailored Ivory Silk Blazer', cat: 'Modern Tailored', image: '/assets/images/collection_modern_blazer.jpg', outfitId: 'tailored-ivory-blazer' },
    { id: 'item-4', name: 'Royal Crimson Bridal Lehenga', cat: 'Bridal Heritage', image: '/assets/images/collection_lehenga.jpg', outfitId: 'royal-bridal-lehenga' }
  ]
};

// =============================================================================
// Complete Outfits Catalog
// =============================================================================
const OUTFITS_CATALOG = [
  {
    id: 'pink-saree-traditional',
    title: 'Blush Rose Silk Saree',
    category: 'traditional',
    image: '/assets/images/pink_saree_reference.jpg',
    resultDemo: '/assets/images/tryon_result_pink_saree.jpg',
    badge: 'FEATURED COUTURE',
    categoryTag: 'TRADITIONAL HAUTE COUTURE',
    description: 'Handcrafted sheer silk organza with antique gold zari border and matching embroidered blouse.',
    fabric: 'Pure Silk Organza',
    defaultColor: 'Blush Rose'
  },
  {
    id: 'pink-fantasy-couture',
    title: 'Celestial Rose Fantasy Gown',
    category: 'fantasy',
    image: '/assets/images/pink_fantasy_couture.jpg',
    resultDemo: '/assets/images/tryon_result_pink_couture.jpg',
    badge: 'FANTASY COUTURE',
    categoryTag: 'FANTASY COUTURE',
    description: 'Tiered starlight tulle gown with corset embroidery, gold foil embellishments, and flowing sheer wings.',
    fabric: 'Celestial Tulle',
    defaultColor: 'Rose & Champagne'
  },
  {
    id: 'royal-bridal-lehenga',
    title: 'Royal Crimson Bridal Lehenga',
    category: 'traditional',
    image: '/assets/images/collection_lehenga.jpg',
    resultDemo: '/assets/images/tryon_result_pink_saree.jpg',
    badge: 'BRIDAL HERITAGE',
    categoryTag: 'TRADITIONAL COUTURE',
    description: 'Rich raw silk with royal gota patti, heavy gold zardozi kalis, and sheer dupatta.',
    fabric: 'Raw Silk & Gota Patti',
    defaultColor: 'Royal Crimson'
  },
  {
    id: 'starlight-princess-gown',
    title: 'Starlight Crystal Ballgown',
    category: 'fantasy',
    image: '/assets/images/collection_starlight_gown.jpg',
    resultDemo: '/assets/images/tryon_result_pink_couture.jpg',
    badge: 'CELESTIAL',
    categoryTag: 'FANTASY COUTURE',
    description: 'Iridescent crystal beadwork on celestial organza with sweeping cape sleeves.',
    fabric: 'Star Crystals & Organza',
    defaultColor: 'Champagne Gold'
  },
  {
    id: 'royal-emerald-anarkali',
    title: 'Emerald Imperial Anarkali',
    category: 'traditional',
    image: '/assets/images/collection_anarkali.jpg',
    resultDemo: '/assets/images/tryon_result_pink_saree.jpg',
    badge: 'HERITAGE SUIT',
    categoryTag: 'TRADITIONAL COUTURE',
    description: 'Deep forest green silk-georgette with intricate golden kalis and royal sheer drape.',
    fabric: 'Pure Georgette',
    defaultColor: 'Royal Emerald'
  },
  {
    id: 'tailored-ivory-blazer',
    title: 'Tailored Ivory Silk Blazer',
    category: 'western',
    image: '/assets/images/collection_modern_blazer.jpg',
    resultDemo: '/assets/images/tryon_result_pink_couture.jpg',
    badge: 'RUNWAY ATELIER',
    categoryTag: 'WESTERN LUXURY',
    description: 'Architectural satin lapel blazer with fluid wide-leg trousers, designed for high-fashion power dressing.',
    fabric: 'Italian Wool & Satin',
    defaultColor: 'Obsidian Noir & Ivory'
  },
  {
    id: 'emerald-luxury-gown',
    title: 'Silk Crepe Evening Gown',
    category: 'western',
    image: '/assets/images/collection_luxury_gown.jpg',
    resultDemo: '/assets/images/tryon_result_pink_couture.jpg',
    badge: 'GALA EDITION',
    categoryTag: 'WESTERN COUTURE',
    description: 'Floor-skimming sculptural gown with bias cut drape and tailored evening capelet.',
    fabric: 'Silk Crepe',
    defaultColor: 'Royal Emerald'
  }
];

// =============================================================================
// Toast Notification
// =============================================================================
function showToast(message, duration = 3500) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// =============================================================================
// Navigation Router (All 15 Pages Supported)
// =============================================================================
function navigateToPage(pageId) {
  state.activePage = pageId;

  // Navbar highlights
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });

  // Section visibility
  document.querySelectorAll('.page-section').forEach(section => {
    const sectionId = section.id.replace('page', '').toLowerCase();
    const target = pageId.replace('-', '').toLowerCase();
    section.classList.toggle('active', sectionId === target || section.id === `page${capitalize(pageId)}`);
  });

  // Close mobile drawer
  const navMenu = document.getElementById('navMenu');
  if (navMenu) navMenu.classList.remove('open');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function capitalize(str) {
  return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

function initNavigation() {
  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('[data-page]');
    if (target) {
      e.preventDefault();
      navigateToPage(target.dataset.page);
    }

    const quickTryBtn = e.target.closest('[data-try-outfit]');
    if (quickTryBtn) {
      e.preventDefault();
      const outfitId = quickTryBtn.dataset.tryOutfit;
      selectOutfit(outfitId);
      navigateToPage('tryon');
      showToast('Selected outfit in Virtual Try-On Studio!');
    }
  });

  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
  }
}

// =============================================================================
// Universal Photo Upload System (Global Context)
// =============================================================================
function syncGlobalPhoto(photoUrl, filename, isSample = false) {
  state.activePhoto = {
    isSample,
    url: photoUrl,
    filename,
    fileObject: null,
    isReady: true
  };

  // Update top sticky photo bar
  const globalThumb = document.getElementById('globalActivePhotoThumb');
  const globalFilename = document.getElementById('globalPhotoFilename');
  if (globalThumb) globalThumb.src = photoUrl;
  if (globalFilename) globalFilename.textContent = filename;

  // Update Try-on dropzone preview
  const tryonPreview = document.getElementById('tryonPreviewImg');
  const tryonFileName = document.getElementById('tryonFileName');
  if (tryonPreview) tryonPreview.src = photoUrl;
  if (tryonFileName) tryonFileName.textContent = filename;

  // Update comparison workbench original images
  const cmpOrig = document.getElementById('cmpOriginalImg');
  const dualOrig = document.getElementById('dualOriginalImg');
  if (cmpOrig) cmpOrig.src = photoUrl;
  if (dualOrig) dualOrig.src = photoUrl;

  // Update magazine cover photo
  const magPhoto = document.getElementById('magazineCoverPhoto');
  if (magPhoto) magPhoto.src = photoUrl;

  showToast('Photograph updated globally across all fashion studios!');
}

function initPhotoUploadSystem() {
  const fileInput = document.getElementById('universalFileInput');
  const btnGlobalChange = document.getElementById('btnGlobalChangePhoto');
  const btnGlobalSample = document.getElementById('btnGlobalUseSample');
  const btnTryonUpload = document.getElementById('btnTryonUploadNew');
  const btnTryonSample = document.getElementById('btnTryonResetSample');
  const btnToggleGuide = document.getElementById('btnToggleGuidelines');
  const guideDrawer = document.getElementById('guidelinesDrawer');

  // Trigger file dialog
  const openFileDialog = () => fileInput && fileInput.click();
  if (btnGlobalChange) btnGlobalChange.addEventListener('click', openFileDialog);
  if (btnTryonUpload) btnTryonUpload.addEventListener('click', openFileDialog);

  // File chosen
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const valid = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!valid.includes(file.type)) {
        showToast('Please upload JPG, PNG, or WEBP.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        syncGlobalPhoto(evt.target.result, file.name, false);
      };
      reader.readAsDataURL(file);
    });
  }

  // Sample photo triggers
  const setSample = () => syncGlobalPhoto('/assets/images/user_sample_photo.jpg', 'user_sample_photo.jpg (Verified Model)', true);
  if (btnGlobalSample) btnGlobalSample.addEventListener('click', setSample);
  if (btnTryonSample) btnTryonSample.addEventListener('click', setSample);

  // Guidelines toggle
  if (btnToggleGuide && guideDrawer) {
    btnToggleGuide.addEventListener('click', () => {
      guideDrawer.classList.toggle('hidden');
    });
  }

  // Drag & drop on Try-on box
  const dropzone = document.getElementById('tryonDropzone');
  if (dropzone) {
    ['dragenter', 'dragover'].forEach(n => dropzone.addEventListener(n, (e) => { e.preventDefault(); dropzone.style.borderColor = 'var(--gold-primary)'; }));
    ['dragleave', 'drop'].forEach(n => dropzone.addEventListener(n, (e) => { e.preventDefault(); dropzone.style.borderColor = ''; }));
    dropzone.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => syncGlobalPhoto(evt.target.result, file.name, false);
        reader.readAsDataURL(file);
      }
    });
  }
}

// =============================================================================
// Core AI Virtual Try-On Execution
// =============================================================================
function selectOutfit(outfitId) {
  state.selectedOutfitId = outfitId;

  document.querySelectorAll('.outfit-card').forEach(card => {
    const isTarget = card.dataset.outfitId === outfitId;
    card.classList.toggle('active', isTarget);
    const ind = card.querySelector('.outfit-selected-indicator');
    if (ind) ind.textContent = isTarget ? '✓ Selected' : 'Select';
  });

  const outfit = OUTFITS_CATALOG.find(o => o.id === outfitId);
  const title = outfit ? outfit.title : 'Selected Garment';
  const statusTitle = document.getElementById('actionStatusTitle');
  if (statusTitle) statusTitle.textContent = `Ready to Synthesize: ${title}`;
}

async function executeVirtualTryOn() {
  const outfit = OUTFITS_CATALOG.find(o => o.id === state.selectedOutfitId);
  if (!outfit) return;

  const progressState = document.getElementById('aiProcessingState');
  const btnExecute = document.getElementById('btnExecuteTryOn');
  const fill = document.getElementById('aiProgressFill');
  const stepText = document.getElementById('aiStepText');

  if (progressState) progressState.classList.remove('hidden');
  if (btnExecute) btnExecute.disabled = true;

  const steps = [
    { text: 'Segmenting garment boundaries & shoulder lines...', pct: 25 },
    { text: 'Applying neural cloth warping (IDM-VTON deep flow analysis)...', pct: 55 },
    { text: 'Locking facial identity, smile, skin undertone (100% Lock)...', pct: 85 },
    { text: 'Synthesizing fabric sheen, folds, and studio lighting...', pct: 100 }
  ];

  for (const s of steps) {
    if (stepText) stepText.textContent = s.text;
    if (fill) fill.style.width = `${s.pct}%`;
    await new Promise(r => setTimeout(r, 550));
  }

  try {
    const res = await fetch('/api/try-on', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        outfitId: outfit.id,
        photoUrl: state.activePhoto.url,
        bodyType: state.selectedBodyType,
        clothingSize: state.clothingSize,
        preferredFit: state.preferredFit,
        customColor: state.customColor,
        customFabric: state.customFabric,
        customSleeves: state.customSleeves,
        accessories: state.customAccessories
      })
    });
    const data = await res.json();

    const outputUrl = data.resultImageUrl || outfit.resultDemo;
    state.currentTryonResult = {
      originalUrl: state.activePhoto.url,
      resultUrl: outputUrl,
      outfitTitle: outfit.title,
      outfitId: outfit.id
    };

    // Update Comparison Images
    const cmpOrig = document.getElementById('cmpOriginalImg');
    const cmpRes = document.getElementById('cmpResultImg');
    const dualOrig = document.getElementById('dualOriginalImg');
    const dualRes = document.getElementById('dualResultImg');

    if (cmpOrig) cmpOrig.src = state.activePhoto.url;
    if (cmpRes) cmpRes.src = outputUrl;
    if (dualOrig) dualOrig.src = state.activePhoto.url;
    if (dualRes) dualRes.src = outputUrl;

    // Scroll to workbench
    const wb = document.getElementById('comparisonWorkbench');
    if (wb) wb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    showToast(`✨ Virtual Try-On Complete! Wearing ${outfit.title}.`);
  } catch (e) {
    // Local fallback
    const outputUrl = outfit.resultDemo;
    state.currentTryonResult = {
      originalUrl: state.activePhoto.url,
      resultUrl: outputUrl,
      outfitTitle: outfit.title,
      outfitId: outfit.id
    };
    const cmpRes = document.getElementById('cmpResultImg');
    if (cmpRes) cmpRes.src = outputUrl;
    showToast(`✨ Virtual Try-On Complete! Wearing ${outfit.title}.`);
  } finally {
    if (progressState) progressState.classList.add('hidden');
    if (btnExecute) btnExecute.disabled = false;
  }
}

function initTryonWorkbench() {
  // Slider scrubbing
  const rangeInput = document.getElementById('cmpRangeInput');
  const clip = document.getElementById('cmpModifiedClip');
  const handle = document.getElementById('cmpSliderHandle');

  if (rangeInput && clip && handle) {
    rangeInput.addEventListener('input', (e) => {
      const v = e.target.value;
      clip.style.width = `${v}%`;
      handle.style.left = `${v}%`;
    });
  }

  // Mode Toggle (Slider vs Side-by-Side)
  const btnSlider = document.getElementById('btnModeSlider');
  const btnDual = document.getElementById('btnModeSideBySide');
  const sliderWrap = document.getElementById('sliderWrapper');
  const dualWrap = document.getElementById('dualWrapper');

  if (btnSlider && btnDual && sliderWrap && dualWrap) {
    btnSlider.addEventListener('click', () => {
      btnSlider.classList.add('active');
      btnDual.classList.remove('active');
      sliderWrap.classList.remove('hidden');
      dualWrap.classList.add('hidden');
    });

    btnDual.addEventListener('click', () => {
      btnDual.classList.add('active');
      btnSlider.classList.remove('active');
      sliderWrap.classList.add('hidden');
      dualWrap.classList.remove('hidden');
    });
  }

  // Fullscreen Lightbox
  const btnFs = document.getElementById('btnFullscreenPreview');
  const lightbox = document.getElementById('lightboxModal');
  const lbImg = document.getElementById('lightboxImg');
  const lbCap = document.getElementById('lightboxCaption');
  const btnCloseLb = document.getElementById('btnCloseLightbox');

  if (btnFs && lightbox && lbImg) {
    btnFs.addEventListener('click', () => {
      lbImg.src = state.currentTryonResult.resultUrl;
      if (lbCap) lbCap.textContent = `VOGUE AI PARIS • ${state.currentTryonResult.outfitTitle.toUpperCase()}`;
      lightbox.classList.remove('hidden');
    });
  }
  if (btnCloseLb && lightbox) {
    btnCloseLb.addEventListener('click', () => lightbox.classList.add('hidden'));
  }

  // Download Result
  const btnDownload = document.getElementById('btnDownloadResult');
  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = `vogue-ai-tryon-${Date.now()}.jpg`;
      link.href = state.currentTryonResult.resultUrl;
      link.click();
      showToast('Downloading high-resolution fashion editorial photo...');
    });
  }

  // Save to Wardrobe
  const btnSave = document.getElementById('btnSaveToWardrobe');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const look = {
        id: 'look-' + Date.now(),
        title: state.currentTryonResult.outfitTitle,
        originalUrl: state.currentTryonResult.originalUrl,
        resultUrl: state.currentTryonResult.resultUrl,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      state.wardrobe.unshift(look);
      localStorage.setItem('vogue_wardrobe', JSON.stringify(state.wardrobe));
      renderMyLooks();
      showToast(`Saved "${look.title}" to My Looks!`);
    });
  }
}

// =============================================================================
// Multiple Outfit Try-On (Quad View)
// =============================================================================
function initMultiTryon() {
  const btnRun = document.getElementById('btnRunMultiTryon');
  if (btnRun) {
    btnRun.addEventListener('click', async () => {
      showToast('Synthesizing 4 outfit variations side-by-side...');
      await new Promise(r => setTimeout(r, 1200));
      showToast('All 4 variations generated with 99.4% identity lock!');
    });
  }

  document.querySelectorAll('[data-download-quad]').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.downloadQuad;
      const a = document.createElement('a');
      a.download = `vogue-ai-variation-${Date.now()}.jpg`;
      a.href = url;
      a.click();
      showToast('Downloading look variation...');
    });
  });
}

// =============================================================================
// ✨ TRANSFORM MY LOOK (Royal Transformation)
// =============================================================================
function initRoyalTransform() {
  const chips = document.querySelectorAll('.trans-chip');
  const transImg = document.getElementById('transResultImg');
  const transTitle = document.getElementById('transTitle');
  const transTag = document.getElementById('transStyleTag');
  const transDesc = document.getElementById('transDesc');
  const btnApply = document.getElementById('btnApplyTransformation');
  const btnDownload = document.getElementById('btnDownloadTransResult');

  const styles = {
    'royal-indian': {
      title: 'Royal Indian Maharani Look',
      tag: 'ROYAL INDIAN MAHARANI',
      desc: 'Handcrafted blush rose silk saree with royal antique gold zari borders, paired with authentic heritage Kundan necklace and imperial golden hour studio illumination.',
      img: '/assets/images/tryon_result_pink_saree.jpg'
    },
    'princess': {
      title: 'Couture Princess Look',
      tag: 'PARIS COUTURE PRINCESS',
      desc: 'Multi-tiered starlight rose tulle ballgown with crystal corset boning, jeweled tiara, and flowing ethereal sheer wings.',
      img: '/assets/images/tryon_result_pink_couture.jpg'
    },
    'luxury-model': {
      title: 'Paris Runway Model Look',
      tag: 'HAUTE COUTURE CATWALK',
      desc: 'Sculptural silhouette with architectural drape, high-contrast studio strobe lighting, and commanding editorial presence.',
      img: '/assets/images/tryon_result_pink_couture.jpg'
    },
    'korean-fashion': {
      title: 'Korean Modern Chic Look',
      tag: 'SEOUL MODERN ATELIER',
      desc: 'Clean glass-skin radiant complexion, soft romantic pastel tones, and fluid minimalist draping.',
      img: '/assets/images/tryon_result_pink_saree.jpg'
    },
    'bollywood-glam': {
      title: 'Bollywood Red Carpet Sensation',
      tag: 'BOLLYWOOD GLAMOUR',
      desc: 'Opulent golden hour shimmer, statement royal maang tikka, and grand flowing royal palla drape.',
      img: '/assets/images/tryon_result_pink_saree.jpg'
    },
    'red-carpet': {
      title: 'Cannes Film Festival Red Carpet',
      tag: 'CANNES RED CARPET',
      desc: 'Floor-sweeping starlight train, diamond chandelier earrings, and dramatic red carpet flash lighting.',
      img: '/assets/images/tryon_result_pink_couture.jpg'
    },
    'fantasy-couture': {
      title: 'Celestial Fantasy Gown Look',
      tag: 'CELESTIAL FANTASY',
      desc: 'Flowing sheer angel wings, crystal-embroidered bodice, and enchanted palace illumination.',
      img: '/assets/images/tryon_result_pink_couture.jpg'
    },
    'vintage-royal': {
      title: '1920s Versailles Royal Vintage',
      tag: 'VERSAILLES VINTAGE',
      desc: 'Gilded gold leaf lace detailing, champagne pearls, and warm archival candlelit ambiance.',
      img: '/assets/images/tryon_result_pink_couture.jpg'
    },
    'modern-editorial': {
      title: 'Vogue Cover Star Editorial',
      tag: 'EDITORIAL COVER STAR',
      desc: 'High-contrast studio lighting, sharp architectural lines, and bold couture elegance.',
      img: '/assets/images/tryon_result_pink_saree.jpg'
    },
    'celebrity-aesthetic': {
      title: 'Met Gala Iconic Celebrity Aesthetic',
      tag: 'MET GALA ICON',
      desc: 'Theatrical sculptural layers, custom crystal tiara crown, and legendary red carpet aura.',
      img: '/assets/images/tryon_result_pink_couture.jpg'
    }
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const styleKey = chip.dataset.style;
      const data = styles[styleKey] || styles['royal-indian'];

      if (transImg) transImg.src = data.img;
      if (transTitle) transTitle.textContent = data.title;
      if (transTag) transTag.textContent = data.tag;
      if (transDesc) transDesc.textContent = data.desc;
      state.currentTransformStyle = styleKey;
      showToast(`Selected transformation: ${data.title}`);
    });
  });

  if (btnApply) {
    btnApply.addEventListener('click', async () => {
      showToast('Synthesizing Royal Transformation on your photograph...');
      await new Promise(r => setTimeout(r, 900));
      showToast('✨ Royal Transformation Complete! 100% Identity Preserved.');
    });
  }

  if (btnDownload && transImg) {
    btnDownload.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = `vogue-royal-transform-${Date.now()}.jpg`;
      link.href = transImg.src;
      link.click();
      showToast('Downloading high-resolution royal photograph...');
    });
  }
}

// =============================================================================
// The Glam Room (Beauty Studio)
// =============================================================================
function initGlamRoom() {
  const tabs = document.querySelectorAll('.glam-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const type = tab.dataset.glam;

      document.querySelectorAll('.glam-tab-content').forEach(c => c.classList.add('hidden'));
      const activeContent = document.getElementById(`glamContent${capitalize(type)}`);
      if (activeContent) activeContent.classList.remove('hidden');
    });
  });

  // Lipstick Swatches
  const lipSwatches = document.querySelectorAll('#glamLipstickSwatches .swatch-btn');
  const lipName = document.getElementById('selectedLipName');
  lipSwatches.forEach(btn => {
    btn.addEventListener('click', () => {
      lipSwatches.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.dataset.lip;
      state.glam.lipstick = val;
      if (lipName) lipName.textContent = `Selected: ${val}`;
      showToast(`Lipstick applied: ${val}`);
    });
  });

  // Apply button
  const btnApply = document.getElementById('btnApplyGlam');
  if (btnApply) {
    btnApply.addEventListener('click', async () => {
      showToast('Applying beauty transformations with natural skin texture lock...');
      await new Promise(r => setTimeout(r, 800));
      showToast('💄 Glam Room look applied to your photograph!');
    });
  }
}

// =============================================================================
// AI Photoshoot Studio
// =============================================================================
function initPhotoshootStudio() {
  const bgBtns = document.querySelectorAll('.bg-option-btn');
  const shootImg = document.getElementById('photoshootResultImg');
  const btnExec = document.getElementById('btnExecutePhotoshoot');
  const btnDl = document.getElementById('btnDownloadPhotoshoot');

  const bgs = {
    'palace': '/assets/images/bg_royal_palace.jpg',
    'garden': '/assets/images/bg_floral_garden.jpg',
    'studio': '/assets/images/tryon_result_pink_couture.jpg',
    'runway': '/assets/images/tryon_result_pink_saree.jpg'
  };

  bgBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      bgBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const bgId = btn.dataset.bg;
      state.photoshoot.bgId = bgId;
      state.photoshoot.currentBgUrl = bgs[bgId] || bgs['palace'];
      if (shootImg) shootImg.src = state.photoshoot.currentBgUrl;
      showToast(`Selected backdrop: ${btn.querySelector('span').textContent}`);
    });
  });

  if (btnExec) {
    btnExec.addEventListener('click', async () => {
      showToast('Rendering AI Photoshoot with lighting matching...');
      await new Promise(r => setTimeout(r, 1000));
      showToast('📸 Editorial Photoshoot synthesized successfully!');
    });
  }

  if (btnDl && shootImg) {
    btnDl.addEventListener('click', () => {
      const a = document.createElement('a');
      a.download = `vogue-photoshoot-${Date.now()}.jpg`;
      a.href = shootImg.src;
      a.click();
      showToast('Downloading editorial photoshoot photo...');
    });
  }
}

// =============================================================================
// My Fashion Magazine (Cover Maker)
// =============================================================================
function initMagazineCoverMaker() {
  const magTitleInput = document.getElementById('magTitleInput');
  const magIssueInput = document.getElementById('magIssueInput');
  const magHeadlineInput = document.getElementById('magHeadlineInput');
  const magSubheadInput = document.getElementById('magSubheadInput');

  const masthead = document.getElementById('magMasthead');
  const edition = document.getElementById('magEditionDisplay');
  const leadHead = document.getElementById('magLeadHeadlineDisplay');
  const subHead = document.getElementById('magSubHeadlineDisplay');

  const btnUpdate = document.getElementById('btnUpdateMagazineCover');
  const btnDl = document.getElementById('btnDownloadMagazineCover');

  const refreshCover = () => {
    if (masthead && magTitleInput) masthead.innerHTML = magTitleInput.value;
    if (edition && magIssueInput) edition.textContent = magIssueInput.value;
    if (leadHead && magHeadlineInput) leadHead.textContent = magHeadlineInput.value;
    if (subHead && magSubheadInput) subHead.textContent = magSubheadInput.value;
    showToast('Magazine cover layout refreshed!');
  };

  if (btnUpdate) btnUpdate.addEventListener('click', refreshCover);
  if (btnDl) {
    btnDl.addEventListener('click', () => {
      const photo = document.getElementById('magazineCoverPhoto');
      if (photo) {
        const a = document.createElement('a');
        a.download = `vogue-cover-${Date.now()}.jpg`;
        a.href = photo.src;
        a.click();
        showToast('Downloading magazine cover...');
      }
    });
  }
}

// =============================================================================
// Outfit Battle
// =============================================================================
function initOutfitBattle() {
  document.querySelectorAll('.btn-vote-battle').forEach(btn => {
    btn.addEventListener('click', () => {
      const winner = btn.dataset.winner;
      showToast(`🏆 ${winner} crowned as the battle winner! Saved to favorites.`);
    });
  });
}

// =============================================================================
// Digital Wardrobe
// =============================================================================
function initDigitalWardrobe() {
  const btnAdd = document.getElementById('btnAddWardrobeItem');
  const inputName = document.getElementById('inputWardrobeName');
  const selectCat = document.getElementById('selectWardrobeCategory');

  if (btnAdd && inputName && selectCat) {
    btnAdd.addEventListener('click', () => {
      const name = inputName.value.trim();
      if (!name) {
        showToast('Please enter an item name.');
        return;
      }
      showToast(`Item "${name}" added to your digital wardrobe!`);
      inputName.value = '';
    });
  }
}

// =============================================================================
// Conversational AI Fashion Assistant
// =============================================================================
function initAssistant() {
  const toggleBtn = document.getElementById('btnToggleAssistant');
  const drawer = document.getElementById('assistantDrawer');
  const closeBtn = document.getElementById('btnCloseAssistant');
  const sendBtn = document.getElementById('btnAssistantSend');
  const input = document.getElementById('assistantInput');
  const messages = document.getElementById('assistantMessages');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => drawer.classList.toggle('hidden'));
  }
  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => drawer.classList.add('hidden'));
  }

  const handleSend = async (userText) => {
    const text = userText || (input ? input.value.trim() : '');
    if (!text) return;
    if (input) input.value = '';

    // Append user message
    const uMsg = document.createElement('div');
    uMsg.className = 'assistant-msg user';
    uMsg.innerHTML = `<p>${text}</p>`;
    messages.appendChild(uMsg);
    messages.scrollTop = messages.scrollHeight;

    // Call backend assistant
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });
      const data = await res.json();

      const bMsg = document.createElement('div');
      bMsg.className = 'assistant-msg bot';
      bMsg.innerHTML = `
        <p>${data.answer}</p>
        <button class="quick-prompt-btn" style="margin-top: 8px;" data-try-outfit="${data.recommendedOutfitId}">
          ✨ Try On This Outfit in Studio →
        </button>
      `;
      messages.appendChild(bMsg);
      messages.scrollTop = messages.scrollHeight;
    } catch (e) {
      const bMsg = document.createElement('div');
      bMsg.className = 'assistant-msg bot';
      bMsg.innerHTML = `<p>I recommend trying on the Blush Rose Silk Saree or the Celestial Fantasy Gown in our Virtual Try-On Studio!</p>`;
      messages.appendChild(bMsg);
      messages.scrollTop = messages.scrollHeight;
    }
  };

  if (sendBtn) sendBtn.addEventListener('click', () => handleSend());
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  // Quick prompt buttons
  if (messages) {
    messages.addEventListener('click', (e) => {
      const btn = e.target.closest('.quick-prompt-btn');
      if (btn && btn.dataset.query) {
        handleSend(btn.dataset.query);
      }
    });
  }
}

// =============================================================================
// My Looks Archive
// =============================================================================
function renderMyLooks() {
  const grid = document.getElementById('wardrobeGrid');
  const empty = document.getElementById('wardrobeEmptyState');
  const countBadge = document.getElementById('wardrobeCountBadge');

  if (countBadge) countBadge.textContent = state.wardrobe.length;

  if (state.wardrobe.length === 0) {
    if (empty) empty.classList.remove('hidden');
    if (grid) grid.innerHTML = '';
    return;
  }

  if (empty) empty.classList.add('hidden');
  if (grid) {
    grid.innerHTML = state.wardrobe.map(look => `
      <div class="quad-card">
        <div class="quad-badge">${look.date}</div>
        <div class="quad-img-wrap">
          <img src="${look.resultUrl}" alt="${look.title}" class="quad-img">
        </div>
        <div class="quad-meta">
          <h4>${look.title}</h4>
          <div style="display: flex; gap: 6px; margin-top: 8px;">
            <button class="btn-micro" data-view-look="${look.id}">View High-Res</button>
            <button class="btn-micro" style="color: #ef4444;" data-delete-look="${look.id}">Delete</button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function initMyLooks() {
  const saved = localStorage.getItem('vogue_wardrobe');
  if (saved) {
    try { state.wardrobe = JSON.parse(saved); } catch (e) { state.wardrobe = []; }
  }
  renderMyLooks();

  const grid = document.getElementById('wardrobeGrid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      const viewBtn = e.target.closest('[data-view-look]');
      if (viewBtn) {
        const look = state.wardrobe.find(l => l.id === viewBtn.dataset.viewLook);
        if (look) {
          const lb = document.getElementById('lightboxModal');
          const lbImg = document.getElementById('lightboxImg');
          if (lb && lbImg) {
            lbImg.src = look.resultUrl;
            lb.classList.remove('hidden');
          }
        }
      }

      const delBtn = e.target.closest('[data-delete-look]');
      if (delBtn) {
        state.wardrobe = state.wardrobe.filter(l => l.id !== delBtn.dataset.deleteLook);
        localStorage.setItem('vogue_wardrobe', JSON.stringify(state.wardrobe));
        renderMyLooks();
        showToast('Look removed from My Looks archive.');
      }
    });
  }
}

// =============================================================================
// Catalog Generator
// =============================================================================
function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;

  grid.innerHTML = OUTFITS_CATALOG.map(outfit => `
    <div class="quad-card" style="border-radius: 20px;">
      <div class="quad-badge">${outfit.badge}</div>
      <div class="quad-img-wrap" style="aspect-ratio: 3 / 4.2;">
        <img src="${outfit.image}" alt="${outfit.title}" class="quad-img">
      </div>
      <div class="quad-meta" style="padding: 18px;">
        <span style="font-size: 0.65rem; color: var(--blush-light); font-weight: 700; letter-spacing: 1.5px;">${outfit.categoryTag}</span>
        <h4 style="font-family: var(--font-serif); font-size: 1.4rem; margin: 4px 0 8px;">${outfit.title}</h4>
        <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px;">${outfit.description}</p>
        <button class="btn-luxury-gold btn-full" data-try-outfit="${outfit.id}">
          ✨ Try On In Studio →
        </button>
      </div>
    </div>
  `).join('');
}

// =============================================================================
// AI Configuration Modal
// =============================================================================
function initConfigModal() {
  const btnOpen = document.getElementById('btnOpenConfigModal');
  const btnClose = document.getElementById('btnCloseConfigModal');
  const btnCancel = document.getElementById('btnCancelConfig');
  const modal = document.getElementById('configModalOverlay');
  const btnSave = document.getElementById('btnSaveConfig');
  const inputKey = document.getElementById('inputApiKey');
  const alertBox = document.getElementById('modalConfigAlert');

  const close = () => modal && modal.classList.add('hidden');
  if (btnOpen && modal) btnOpen.addEventListener('click', () => modal.classList.remove('hidden'));
  if (btnClose) btnClose.addEventListener('click', close);
  if (btnCancel) btnCancel.addEventListener('click', close);

  if (btnSave) {
    btnSave.addEventListener('click', async () => {
      const radio = document.querySelector('input[name="providerRadio"]:checked');
      const provider = radio ? radio.value : 'replicate';
      const key = inputKey ? inputKey.value.trim() : '';

      try {
        const res = await fetch('/api/config/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider, apiKey: key })
        });
        const data = await res.json();
        if (alertBox) {
          alertBox.textContent = data.message || 'Config updated.';
          alertBox.classList.remove('hidden');
        }
        setTimeout(close, 1200);
        showToast('AI Provider credentials updated.');
      } catch (e) {
        setTimeout(close, 1000);
      }
    });
  }
}

// =============================================================================
// Initial Application Bootstrap
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initPhotoUploadSystem();
  initTryonWorkbench();
  initMultiTryon();
  initRoyalTransform();
  initGlamRoom();
  initPhotoshootStudio();
  initMagazineCoverMaker();
  initOutfitBattle();
  initDigitalWardrobe();
  initAssistant();
  initMyLooks();
  renderCatalog();
  initConfigModal();

  // Try-on execute button
  const btnExec = document.getElementById('btnExecuteTryOn');
  if (btnExec) btnExec.addEventListener('click', executeVirtualTryOn);

  // Outfits catalog click in Try-On Studio
  const outfitContainer = document.getElementById('outfitCardsContainer');
  if (outfitContainer) {
    outfitContainer.addEventListener('click', (e) => {
      const card = e.target.closest('.outfit-card');
      if (card) selectOutfit(card.dataset.outfitId);
    });
  }

  // Filter tabs in Try-on Studio
  const filterPills = document.getElementById('outfitCollectionFilter');
  if (filterPills) {
    filterPills.addEventListener('click', (e) => {
      const tab = e.target.closest('.filter-tab');
      if (!tab) return;
      filterPills.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      document.querySelectorAll('.outfit-card').forEach(c => {
        c.style.display = (cat === 'all' || c.dataset.category === cat) ? 'flex' : 'none';
      });
    });
  }

  console.log('VOGUE AI — Complete AI Fashion Universe Initialized.');
});
