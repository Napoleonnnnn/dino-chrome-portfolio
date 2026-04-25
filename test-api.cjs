try {
  const login = require('./api/auth/login.ts');
  console.log("Login module loaded", Object.keys(login));
} catch (e) {
  console.error(e);
}
