var bCrypt = require("./bCrypt");

console.log("\n\n Salts \n");

var salt1 = bCrypt.genSaltSync(8);
console.log(salt1);

var salt2 = bCrypt.genSaltSync(10);
console.log(salt2);


console.log("\n\n Hashes \n");

var hash1 = bCrypt.hashSync("super secret", salt1, null);
console.log(hash1);

var hash2 = bCrypt.hashSync("super secret", salt1, null);
console.log(hash2);

var hash3 = bCrypt.hashSync("supersecret", salt1, null);
console.log(hash3);

var hash4 = bCrypt.hashSync("supersecret", salt1, null);
console.log(hash4);

var hash5 = bCrypt.hashSync("super secret", salt2, null);
console.log(hash5);

var hash6 = bCrypt.hashSync("super secret", salt2, null);
console.log(hash6);

var hash7 = bCrypt.hashSync("supersecret", salt2, null);
console.log(hash7);

var hash8 = bCrypt.hashSync("supersecret", salt2, null);
console.log(hash8);

var hash9 = bCrypt.hashSync("super secret", null, null);
console.log(hash9);

var hash0 = bCrypt.hashSync("supersecret", null, null);
console.log(hash0);

console.log("\n\n First Set of Compares \n");

console.log(bCrypt.compareSync("super secret", hash1));
console.log(bCrypt.compareSync("super secret", hash2));
console.log(bCrypt.compareSync("super secret", hash5));
console.log(bCrypt.compareSync("super secret", hash6));
console.log(bCrypt.compareSync("super secret", hash9));
console.log(bCrypt.compareSync("super secret", hash3));
console.log(bCrypt.compareSync("super secret", hash4));
console.log(bCrypt.compareSync("super secret", hash7));
console.log(bCrypt.compareSync("super secret", hash8));
console.log(bCrypt.compareSync("super secret", hash0));

console.log("\n\n Second Set of Compares \n");

console.log(bCrypt.compareSync("supersecret", hash1));
console.log(bCrypt.compareSync("supersecret", hash2));
console.log(bCrypt.compareSync("supersecret", hash5));
console.log(bCrypt.compareSync("supersecret", hash6));
console.log(bCrypt.compareSync("supersecret", hash9));
console.log(bCrypt.compareSync("supersecret", hash3));
console.log(bCrypt.compareSync("supersecret", hash4));
console.log(bCrypt.compareSync("supersecret", hash7));
console.log(bCrypt.compareSync("supersecret", hash8));
console.log(bCrypt.compareSync("supersecret", hash0));
