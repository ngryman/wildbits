export const ENCRYPTION_KEY_BITS = 128

export async function generateKey(): Promise<string> {
  const key = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: ENCRYPTION_KEY_BITS,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  )
  return (await window.crypto.subtle.exportKey('jwk', key)).k!
}
