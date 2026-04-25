/**
 * Helper script to generate a bcrypt password hash.
 * Usage: node api/_lib/hash-password.js YOUR_PASSWORD
 */
const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node api/_lib/hash-password.js YOUR_PASSWORD');
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  console.log('\n🔐 Password hash generated!\n');
  console.log('Hash:', hash);
  console.log('\nAdd this to your Vercel environment variables as ADMIN_PASSWORD_HASH');
  console.log('');
});
