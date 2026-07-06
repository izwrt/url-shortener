import crypto from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(crypto.scrypt);

export const secureThePassword = async (plainPassword: string, savedSalt?: string) => {
    const newSalt = savedSalt ?? crypto.randomBytes(16).toString('hex');

    const scrambledBuffer = await scryptAsync(plainPassword, savedSalt ?? newSalt, 64) as Buffer;

    const newHash = scrambledBuffer.toString('hex');

    return { 
        hash: newHash,
        salt: newSalt
    };
}