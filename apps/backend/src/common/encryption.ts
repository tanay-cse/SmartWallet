import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// AES-256-GCM: authenticated encryption (confidentiality + integrity).
// Used for any sensitive Card field that must be encrypted at rest
// (e.g. tokenized card reference metadata), per docs/SRS.md's
// Security NFR ("AES-256 at rest").
//
// Ciphertext format stored/returned: base64(iv):base64(authTag):base64(encrypted)
// The IV is regenerated on every call, so encrypting the same value twice
// produces two different ciphertexts (required — a fixed/reused IV would
// leak whether two stored cards have the same underlying value).

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // recommended IV length for GCM

function getKey(): Buffer {
  const key = process.env.CARD_ENCRYPTION_KEY;
  if (!key) {
    throw new Error(
      'CARD_ENCRYPTION_KEY is not set. Generate one with: ' +
        'node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"',
    );
  }
  const buf = Buffer.from(key, 'base64');
  if (buf.length !== 32) {
    throw new Error(
      `CARD_ENCRYPTION_KEY must decode to exactly 32 bytes for AES-256 (got ${buf.length}).`,
    );
  }
  return buf;
}

export function encrypt(value: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString('base64'),
    authTag.toString('base64'),
    encrypted.toString('base64'),
  ].join(':');
}

export function decrypt(ciphertext: string): string {
  const key = getKey();
  const [ivB64, authTagB64, encryptedB64] = ciphertext.split(':');

  if (!ivB64 || !authTagB64 || !encryptedB64) {
    throw new Error('Malformed ciphertext: expected "iv:authTag:encrypted" format.');
  }

  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(authTagB64, 'base64');
  const encrypted = Buffer.from(encryptedB64, 'base64');

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
}
