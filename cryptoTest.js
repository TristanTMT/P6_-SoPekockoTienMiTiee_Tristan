const crypto = require('crypto');

const hash = crypto.createHash('sha256').update('foo').digest('hex');

console.log(hash);

/* Faire un $ node cryptoTest.js dans la console pour voir si ça fonctionne */