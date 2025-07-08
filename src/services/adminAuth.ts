import { Preferences } from '@capacitor/preferences';

const ADMIN_PASSWORD = '4004';
const AUTH_KEY = 'nat_admin_session';

export class AdminAuthService {
  static async login(password: string): Promise<boolean> {
    if (password === ADMIN_PASSWORD) {
      const session = {
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      };
      
      await Preferences.set({
        key: AUTH_KEY,
        value: JSON.stringify(session)
      });
      
      return true;
    }
    return false;
  }

  static async logout(): Promise<void> {
    await Preferences.remove({ key: AUTH_KEY });
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const { value } = await Preferences.get({ key: AUTH_KEY });
      if (!value) return false;

      const session = JSON.parse(value);
      // Session expires after 24 hours
      const loginTime = new Date(session.loginTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff > 24) {
        await this.logout();
        return false;
      }

      return session.isAuthenticated;
    } catch {
      return false;
    }
  }

  static async getSession() {
    try {
      const { value } = await Preferences.get({ key: AUTH_KEY });
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }
}