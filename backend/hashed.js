const bcrypt = require('bcryptjs');

async function hashed() {
    const password = "test1234"; // Your desired password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Hashed Password:", hashedPassword);
}

hashed();
