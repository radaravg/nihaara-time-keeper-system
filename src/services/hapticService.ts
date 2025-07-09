import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// Audio context for click sounds
let audioContext: AudioContext | null = null;

const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Generate click sound using Web Audio API
const generateClickSound = (frequency: number = 800, duration: number = 50) => {
  const ctx = initAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration / 1000);
};

// Different sound presets
const soundPresets = {
  tap: () => generateClickSound(800, 50),
  success: () => generateClickSound(1000, 100),
  error: () => generateClickSound(400, 150),
  swipe: () => generateClickSound(600, 80),
  toggle: () => generateClickSound(900, 60),
};

export class HapticService {
  static async light() {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  }

  static async medium() {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  }

  static async heavy() {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  }

  static async success() {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  }

  static async error() {
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  }

  static async warning() {
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch (error) {
      console.log('Haptics not available:', error);
    }
  }

  // Combined haptic + sound feedback
  static async tapFeedback() {
    await this.light();
    soundPresets.tap();
  }

  static async successFeedback() {
    await this.success();
    soundPresets.success();
  }

  static async errorFeedback() {
    await this.error();
    soundPresets.error();
  }

  static async swipeFeedback() {
    await this.medium();
    soundPresets.swipe();
  }

  static async toggleFeedback() {
    await this.light();
    soundPresets.toggle();
  }

  static async buttonPress() {
    await this.light();
    soundPresets.tap();
  }

  static async longPress() {
    await this.heavy();
    soundPresets.swipe();
  }
}