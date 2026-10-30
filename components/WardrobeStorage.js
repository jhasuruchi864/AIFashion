/**
 * WardrobeStorage manages persistence of saved outfits, custom avatars,
 * and photoshoot snapshots using localStorage with robust fallback.
 */
export class WardrobeStorage {
  constructor() {
    this.STORAGE_KEY_OUTFITS = 'vogue_ai_saved_outfits_v1';
    this.STORAGE_KEY_AVATARS = 'vogue_ai_saved_avatars_v1';
    this.STORAGE_KEY_PHOTOS = 'vogue_ai_photoshoot_gallery_v1';

    this.initDefaults();
  }

  initDefaults() {
    // Seed default outfits if empty
    if (!localStorage.getItem(this.STORAGE_KEY_OUTFITS)) {
      const defaultOutfits = [
        {
          id: 'look-1',
          name: 'Milano Gala Elegance',
          model: 'female',
          category: 'Red Carpet',
          date: '2026-10-30',
          items: {
            dress: 'Silk Crepe Evening Gown',
            jacket: 'Tuxedo Satin Blazer',
            shoes: 'Gold Stiletto Heels',
            accessories: 'Diamond Collar Choker & Minaudière'
          },
          fabric: 'satin',
          color: '#d8b87d',
          pattern: 'solid',
          thumbnail: 'assets/models/female_thumb.png'
        },
        {
          id: 'look-2',
          name: 'Cyberpunk Vanguard',
          model: 'male',
          category: 'Streetwear',
          date: '2026-10-30',
          items: {
            top: 'Sculptural Compression Top',
            jacket: 'Architectural Trench Coat',
            trousers: 'Tapered Techno Wool Slacks',
            shoes: 'High-Top Platform Boots',
            accessories: 'Rolex Luxury Chronograph'
          },
          fabric: 'lame',
          color: '#00f2fe',
          pattern: 'cyber',
          thumbnail: 'assets/models/male_thumb.png'
        },
        {
          id: 'look-3',
          name: 'Minimalist Power Tailoring',
          model: 'female',
          category: 'Business Power',
          date: '2026-10-30',
          items: {
            suit: 'Double-Breasted Wool Suit',
            shirt: 'Crisp Poplin Shirt',
            shoes: 'Patent Leather Pumps',
            accessories: 'Structured Minimalist Leather Tote'
          },
          fabric: 'wool',
          color: '#141419',
          pattern: 'solid',
          thumbnail: 'assets/models/female_thumb.png'
        }
      ];
      this.saveOutfits(defaultOutfits);
    }

    // Seed default avatars if empty
    if (!localStorage.getItem(this.STORAGE_KEY_AVATARS)) {
      const defaultAvatars = [
        {
          id: 'avatar-1',
          name: 'Aria Couture',
          gender: 'female',
          skinTone: '#f5d0bd',
          hairStyle: 'sleek_bun',
          hairColor: '#1c1715',
          eyeColor: '#2b5368',
          height: 179,
          silhouette: 'slender',
          outfitColor: '#d8b87d',
          date: '2026-10-30'
        },
        {
          id: 'avatar-2',
          name: 'Julian Atelier',
          gender: 'male',
          skinTone: '#deb887',
          hairStyle: 'modern_crop',
          hairColor: '#2a231f',
          eyeColor: '#4b382a',
          height: 186,
          silhouette: 'athletic',
          outfitColor: '#141419',
          date: '2026-10-30'
        }
      ];
      this.saveAvatars(defaultAvatars);
    }

    if (!localStorage.getItem(this.STORAGE_KEY_PHOTOS)) {
      this.savePhotos([]);
    }
  }

  // --- Outfits ---
  getOutfits() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY_OUTFITS)) || [];
    } catch {
      return [];
    }
  }

  saveOutfits(outfits) {
    localStorage.setItem(this.STORAGE_KEY_OUTFITS, JSON.stringify(outfits));
  }

  addOutfit(outfit) {
    const list = this.getOutfits();
    list.unshift({
      ...outfit,
      id: 'look-' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    });
    this.saveOutfits(list);
    return list;
  }

  deleteOutfit(id) {
    let list = this.getOutfits();
    list = list.filter((item) => item.id !== id);
    this.saveOutfits(list);
    return list;
  }

  // --- Avatars ---
  getAvatars() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY_AVATARS)) || [];
    } catch {
      return [];
    }
  }

  saveAvatars(avatars) {
    localStorage.setItem(this.STORAGE_KEY_AVATARS, JSON.stringify(avatars));
  }

  addAvatar(avatar) {
    const list = this.getAvatars();
    list.unshift({
      ...avatar,
      id: 'avatar-' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    });
    this.saveAvatars(list);
    return list;
  }

  deleteAvatar(id) {
    let list = this.getAvatars();
    list = list.filter((item) => item.id !== id);
    this.saveAvatars(list);
    return list;
  }

  // --- Photoshoot Gallery ---
  getPhotos() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY_PHOTOS)) || [];
    } catch {
      return [];
    }
  }

  savePhotos(photos) {
    localStorage.setItem(this.STORAGE_KEY_PHOTOS, JSON.stringify(photos));
  }

  addPhoto(photoDataUrl, title = 'Vogue AI Studio Editorial') {
    const list = this.getPhotos();
    list.unshift({
      id: 'photo-' + Date.now(),
      title,
      dataUrl: photoDataUrl,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    });
    // Keep last 15 photos to avoid quota limit
    if (list.length > 15) list.pop();
    this.savePhotos(list);
    return list;
  }

  deletePhoto(id) {
    let list = this.getPhotos();
    list = list.filter((p) => p.id !== id);
    this.savePhotos(list);
    return list;
  }
}
