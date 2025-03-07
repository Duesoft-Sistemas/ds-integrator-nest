import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class CryptoService {
  private iv?: string;
  private password?: string;

  constructor(private readonly configService: ConfigService) {
    this.iv = this.configService.get('CRYPTO_IV');
    this.password = this.configService.get('CRYPTO_PASSWORD');
  }

  generatePassword(): string {
    return randomBytes(12)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 12);
  }

  async encrypt(text: string): Promise<string> {
    if (!this.password || !this.iv) {
      throw new Error('Parâmetros para criptografia não configurado');
    }

    const iv = Buffer.from(this.iv, 'utf8');
    const key = (await promisify(scrypt)(this.password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const buffer = Buffer.concat([cipher.update(text), cipher.final()]);
    return buffer.toString('base64');
  }

  async decrypt(text: string): Promise<string> {
    if (!this.password || !this.iv) {
      throw new Error('Parâmetros para criptografia não configurado');
    }

    const iv = Buffer.from(this.iv, 'utf8');
    const key = (await promisify(scrypt)(this.password, 'salt', 32)) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, iv);

    const buffer = Buffer.from(text, 'base64');
    const decryptedText = Buffer.concat([decipher.update(buffer), decipher.final()]);

    return decryptedText.toString('utf8');
  }
}
