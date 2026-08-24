import { encrypt, decrypt } from './encryption';

// Prisma CLI loads .env automatically, but plain `jest` doesn't --
// set a throwaway 32-byte test key so these tests don't depend on
// your real .env being loaded.
beforeAll(() => {
  process.env.CARD_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString('base64');
});

describe('encryption utility', () => {
  it('round-trips: decrypt(encrypt(x)) === x', () => {
    const original = '4242424242424242';
    const ciphertext = encrypt(original);
    const result = decrypt(ciphertext);

    expect(result).toBe(original);
  });

  it('produces different ciphertext for the same value on repeated calls (IV is randomized)', () => {
    const value = 'nickname: HDFC Millennia';
    const first = encrypt(value);
    const second = encrypt(value);

    expect(first).not.toBe(second);
    // but both still decrypt back to the same original value
    expect(decrypt(first)).toBe(value);
    expect(decrypt(second)).toBe(value);
  });

  it('throws on tampered ciphertext (GCM auth tag catches modification)', () => {
    const ciphertext = encrypt('sensitive-value');
    const [iv, authTag, encrypted] = ciphertext.split(':');
    // flip a character in the encrypted payload
    const tampered = [iv, authTag, encrypted.slice(0, -1) + (encrypted.slice(-1) === 'A' ? 'B' : 'A')].join(':');

    expect(() => decrypt(tampered)).toThrow();
  });

  it('throws a clear error if CARD_ENCRYPTION_KEY is missing', () => {
    const saved = process.env.CARD_ENCRYPTION_KEY;
    delete process.env.CARD_ENCRYPTION_KEY;

    expect(() => encrypt('x')).toThrow(/CARD_ENCRYPTION_KEY is not set/);

    process.env.CARD_ENCRYPTION_KEY = saved;
  });
});
