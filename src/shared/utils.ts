import * as bcrypt from 'bcrypt';
import { createCipheriv } from 'crypto';

export class Utils {
  private static instance: Utils;
  public static getInstance(): Utils {
    if (!Utils.instance) {
      Utils.instance = new Utils();
    }
    return Utils.instance;
  }

  async encryptPassword(pass: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(pass, saltOrRounds);
  }
  async encrypt(password: string): Promise<string> {
    const padSize = 16 - (((password.length + 16 - 1) % 16) + 1);
    const data = String.fromCharCode(padSize);
    const cipher = createCipheriv('aes-128-cbc', 'G!P@4#1$1%M4SC4D', 'C#&UjO){QwzFcsPs');
    cipher.setAutoPadding(false);
    let pass = password + data.repeat(padSize);
    let enc = cipher.update(pass, 'utf8', 'base64');
    return enc + cipher.final('base64');
  }
}
