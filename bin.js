#!/usr/bin/env node

var bcrypt = require("./bCrypt");

if (4 !== process.argv.length) {
    console.error("Usage: bcrypt-nodejs <cycles> <password-to-hash>");
}

bcrypt.genSalt(process.argv[2], function (err, salt) {
    if (err) {
        throw err;
    }

    bcrypt.hash(process.argv[3], salt, checkProgress, gotHash);

    function checkProgress(progress) {
        process.stdout.write("...");
    }
    function gotHash(err, hash) {
        if (err) {
            throw err;
        }

        console.log();
        console.log(hash);
    }
});
