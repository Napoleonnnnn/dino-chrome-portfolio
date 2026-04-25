/**
 * Helper script to generate a bcrypt password hash.
 * Usage: node api/_lib/hash-password.mjs YOUR_PASSWORD
 */
import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: node api/_lib/hash-password.mjs YOUR_PASSWORD');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log('\n🔐 Password hash generated!\n');
console.log('Hash:', hash);
console.log('\nAdd this to your Vercel environment variables as ADMIN_PASSWORD_HASH\n');
