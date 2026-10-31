import * as THREE from 'three';

/**
 * AvatarCustomizer handles digital avatar creation, morphing skin tones,
 * hair colors & styles, eye colors, body height scaling, proportions, and accessories.
 */
export class AvatarCustomizer {
  constructor(modelManager, wardrobeStorage) {
    this.modelManager = modelManager;
    this.wardrobeStorage = wardrobeStorage;

    this.currentAvatar = {
      name: 'Custom Atelier Avatar',
      gender: 'female',
      skinTone: '#f5d0bd',
      hairStyle: 'sleek_bun',
      hairColor: '#1c1715',
      eyeColor: '#2b5368',
      height: 179,
      silhouette: 'slender',
      accessories: ['glasses', 'choker']
    };
  }

  setGender(gender) {
    this.currentAvatar.gender = gender;
    this.modelManager.displayModel(gender);
    this.applyCurrentCustomizations();
  }

  setSkinTone(hexColor) {
    this.currentAvatar.skinTone = hexColor;
    const model = this.modelManager.activeModel;
    if (!model) return;

    const color = new THREE.Color(hexColor);
    model.traverse((child) => {
      if (child.isMesh && child.material) {
        const name = child.name.toLowerCase();
        const matName = child.material.name ? child.material.name.toLowerCase() : '';
        if (
          name.includes('skin') ||
          name.includes('head') ||
          name.includes('arm') ||
          matName.includes('skin')
        ) {
          child.material.color.copy(color);
        }
      }
    });
  }

  setHairColor(hexColor) {
    this.currentAvatar.hairColor = hexColor;
    const model = this.modelManager.activeModel;
    if (!model) return;

    const color = new THREE.Color(hexColor);
    model.traverse((child) => {
      if (child.isMesh && child.material) {
        const name = child.name.toLowerCase();
        const matName = child.material.name ? child.material.name.toLowerCase() : '';
        if (
          name.includes('hair') ||
          matName.includes('hair') ||
          matName.includes('beard')
        ) {
          child.material.color.copy(color);
        }
      }
    });
  }

  setEyeColor(hexColor) {
    this.currentAvatar.eyeColor = hexColor;
    const model = this.modelManager.activeModel;
    if (!model) return;

    const color = new THREE.Color(hexColor);
    model.traverse((child) => {
      if (child.isMesh && child.material) {
        const name = child.name.toLowerCase();
        const matName = child.material.name ? child.material.name.toLowerCase() : '';
        if (name.includes('eye') || matName.includes('eye')) {
          child.material.color.copy(color);
        }
      }
    });
  }

  setHeight(heightCm) {
    this.currentAvatar.height = heightCm;
    const model = this.modelManager.activeModel;
    if (!model) return;

    // Standard model height is 180cm -> scale factor
    const baseHeight = 180;
    const scaleFactor = heightCm / baseHeight;
    model.scale.set(scaleFactor, scaleFactor, scaleFactor);
  }

  setSilhouette(silhouetteType) {
    this.currentAvatar.silhouette = silhouetteType;
    const model = this.modelManager.activeModel;
    if (!model) return;

    const currentY = model.scale.y;
    switch (silhouetteType) {
      case 'slender':
        model.scale.set(currentY * 0.94, currentY, currentY * 0.92);
        break;
      case 'athletic':
        model.scale.set(currentY * 1.06, currentY, currentY * 1.04);
        break;
      case 'tall':
        model.scale.set(currentY * 0.95, currentY * 1.05, currentY * 0.95);
        break;
      case 'curvy':
        model.scale.set(currentY * 1.08, currentY * 0.98, currentY * 1.05);
        break;
      default:
        model.scale.set(currentY, currentY, currentY);
        break;
    }
  }

  applyCurrentCustomizations() {
    this.setSkinTone(this.currentAvatar.skinTone);
    this.setHairColor(this.currentAvatar.hairColor);
    this.setEyeColor(this.currentAvatar.eyeColor);
    this.setHeight(this.currentAvatar.height);
    this.setSilhouette(this.currentAvatar.silhouette);
  }

  saveAvatar(name) {
    if (name) this.currentAvatar.name = name;
    return this.wardrobeStorage.addAvatar({
      ...this.currentAvatar
    });
  }

  loadAvatar(avatar) {
    this.currentAvatar = { ...avatar };
    this.setGender(avatar.gender || 'female');
    this.applyCurrentCustomizations();
  }
}
