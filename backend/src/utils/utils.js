function generateReferralCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    // Generate 9 random alphanumeric characters
    for (let i = 0; i < 9; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];

        // Add a dash after every 3 characters (except the last group)
        if ((i + 1) % 3 === 0 && i !== 8) {
            code += '-';
        }
    }

    return code;
}

module.exports = { generateReferralCode }