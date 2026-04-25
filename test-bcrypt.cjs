const bcrypt = require('bcryptjs');
const hash = "$2b$12$v./BfUiJUuKtWDSIkFO/GuzBnn7tC7rjYgfc7eGtLnOWL6uqhyK0.";
bcrypt.compare("DinoAdmin@2026", hash).then(console.log).catch(console.error);
