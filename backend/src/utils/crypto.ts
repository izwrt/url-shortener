import crypto from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(crypto.scrypt);

export const secureThePassword = async (plainPassword: string) => {
    const newSalt = crypto.randomBytes(16).toString('hex');

    const scrambledBuffer = await scryptAsync(plainPassword, newSalt, 64) as Buffer;

    const newHash = scrambledBuffer.toString('hex');

    return { 
        hash: newHash,
        salt: newSalt
    };
}