const bcrypt = require('bcrypt');
const saltRounds = 10;

const password = 'admin'; // Plain text password

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Hashed Password: ${hash}`);
});