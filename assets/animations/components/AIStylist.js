/**
 * AIStylist generates intelligent, occasion-specific fashion recommendations
 * with couture commentary, harmonic balance metrics, and instant 3D model try-on.
 */
export class AIStylist {
  constructor(modelManager) {
    this.modelManager = modelManager;

    // Curated high-fashion knowledge base
    this.stylesDB = {
      gala: {
        title: 'Red Carpet Gala Haute Couture',
        palette: '#d8b87d',
        fabric: 'satin',
        pattern: 'solid',
        pose: 'editorial',
        lighting: 'milano',
        ensemble: {
          dress: 'Sculptural Silk Crepe Mermaid Gown with Trailing Train',
          jacket: 'Cropped Velvet Tuxedo Bolero with Peak Lapels',
          shoes: '24K Gold Stiletto Pumps with Crystal Buckle',
          handbag: 'Minaudière Clutch in Hammered Champagne Brass',
          accessories: 'Tiered Diamond Choker & Deco Drop Earrings'
        },
        rationale: 'For high-society galas, fluid silk satin offers majestic light reflection under warm spotlighting. The contrast of the sculptural mermaid silhouette against a structured velvet bolero delivers quintessential modern regal poise.',
        scores: { harmony: 98, versatility: 75, elegance: 99, drama: 94 }
      },
      office: {
        title: 'Executive Architectural Power Tailoring',
        palette: '#141419',
        fabric: 'wool',
        pattern: 'solid',
        pose: 'chic',
        lighting: 'midnight',
        ensemble: {
          suit: 'Double-Breasted Italian Super-150s Wool Suit',
          shirt: 'Silk Georgette Button-Up with Extended Cuffs',
          trousers: 'High-Waisted Pleated Cigarette Trousers',
          shoes: 'Burnished Patent Leather Oxford Loafers',
          handbag: 'Structured Geometric Calfskin Portfolio Tote',
          accessories: 'Rolex Luxury Chronograph & Minimalist Gold Cuff'
        },
        rationale: 'Precision tailoring commands boardroom presence. Deep obsidian wool absorbs light to accentuate clean razor-sharp lines, balanced by supple georgette silk for an effortless luxury feel.',
        scores: { harmony: 96, versatility: 95, elegance: 92, drama: 78 }
      },
      street: {
        title: 'Cyberpunk Vanguard Avant-Garde',
        palette: '#00f2fe',
        fabric: 'lame',
        pattern: 'cyber',
        pose: 'runway',
        lighting: 'cyber',
        ensemble: {
          jacket: 'Reflective Technical Lamé Trench with High Funnel Collar',
          top: 'Ribbed Compression Base Layer with Laser Cutouts',
          trousers: 'Wide-Leg Techno Satin Cargo Trousers with Ankle Straps',
          shoes: 'Lug-Sole Chunky Futuristic Chelsea Boots',
          handbag: 'Modular Crossbody Harness Bag in Ballistic Canvas',
          accessories: 'Mirrored Cyber Visor & Titanium Signet Ring'
        },
        rationale: 'Merging Tokyo streetwear with brutalist runway shapes. Iridescent metallic lamé catches dynamic cyber neon lighting, projecting high-energy futurism while retaining sartorial utility.',
        scores: { harmony: 94, versatility: 82, elegance: 88, drama: 97 }
      },
      wedding: {
        title: 'Celestial Ivory & Rose Gold Nuptial Luxury',
        palette: '#f0ece3',
        fabric: 'satin',
        pattern: 'solid',
        pose: 'chic',
        lighting: 'golden',
        ensemble: {
          dress: 'Alabaster Silk Organza Draped Corset Gown',
          jacket: 'Sheer Gossamer Feather-Trimmed Silk Chiffon Cape',
          shoes: 'Pearl-Embellished Satin Ankle-Strap Sandals',
          handbag: 'Mother-of-Pearl Structured Hexagon Clutch',
          accessories: 'South Sea Pearl Drop Earrings & Platinum Hairpin'
        },
        rationale: 'Romantic timelessness reimagined. Multi-tiered translucent organza creates angelic diffusion in warm golden hour light, accented by pearlescent finishes for heirloom-grade radiance.',
        scores: { harmony: 99, versatility: 68, elegance: 100, drama: 91 }
      },
      traditional: {
        title: 'Imperial Heritage & Hand-Woven Brocade',
        palette: '#e8a5b8',
        fabric: 'satin',
        pattern: 'jacquard',
        pose: 'editorial',
        lighting: 'milano',
        ensemble: {
          dress: 'Hand-Embroidered Zari Silk Kurta & Pleated Lehenga Gown',
          jacket: 'Sculptured Raw Silk Sherwani Longcoat with Antique Zardozi',
          shoes: 'Intricate Threadwork Velvet Mojaris / Handcrafted Juttis',
          handbag: 'Antique Potli Bag with Hand-Strung Freshwater Pearls',
          accessories: 'Polki Kundan Choker & Jadau Temple Armlet'
        },
        rationale: 'A celebration of centuries of couture craftsmanship. Gold zari weaves interlock with blush rose silk, celebrating artisanal heritage while maintaining a sharp contemporary silhouette.',
        scores: { harmony: 97, versatility: 72, elegance: 98, drama: 95 }
      },
      casual: {
        title: 'Riviera Casual Luxe & Cashmere Essentials',
        palette: '#d8b87d',
        fabric: 'wool',
        pattern: 'solid',
        pose: 'runway',
        lighting: 'golden',
        ensemble: {
          top: 'Featherlight Sand Dune Cashmere Knit Sweater',
          trousers: 'Relaxed Wide-Leg Raw Denim & Silk Blend Slacks',
          jacket: 'Deconstructed Linen Unlined Overshirt',
          shoes: 'Hand-Stitched Italian Suede Moccasins',
          handbag: 'Woven Raffia & Calfskin Weekend Carryall',
          accessories: 'Tortoiseshell Acetate Sunglasses & Braided Leather Strap'
        },
        rationale: 'Understated quiet luxury for resort living. Textural tactile interplay between breathable linen, plush cashmere, and supple suede evokes effortless Mediterranean sophistication.',
        scores: { harmony: 95, versatility: 98, elegance: 90, drama: 70 }
      }
    };
  }

  generateRecommendation(occasion, styleVibe, colorPreference) {
    // Select base look according to occasion
    const base = this.stylesDB[occasion] || this.stylesDB.gala;
    
    // Synthesize tailored recommendation
    const result = {
      occasion: occasion.toUpperCase(),
      styleVibe,
      colorPreference,
      title: base.title,
      ensemble: { ...base.ensemble },
      rationale: base.rationale,
      palette: colorPreference || base.palette,
      fabric: base.fabric,
      pattern: base.pattern,
      pose: base.pose,
      lighting: base.lighting,
      scores: { ...base.scores }
    };

    // Fine-tune rationale dynamically
    result.customizedRationale = `Our AI Atelier analyzed your request for a ${styleVibe} look for a ${occasion} event. ${base.rationale} The ${colorPreference} colorway was selected to harmonize skin undertones and amplify structural contrast.`;

    return result;
  }

  applyRecommendationToModel(rec) {
    if (!this.modelManager) return;

    // Apply colorway
    this.modelManager.applyColor(rec.palette);

    // Apply fabric finish
    this.modelManager.applyFabric(rec.fabric);

    // Apply pose
    this.modelManager.setPose(rec.pose);

    // Switch lighting if studioScene available
    if (this.modelManager.studioScene) {
      this.modelManager.studioScene.setLightingPreset(rec.lighting);
    }
  }
}
