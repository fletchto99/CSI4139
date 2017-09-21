const readline = require('readline');
const process = require('process');
const crypto = require('crypto')
const ursa = require('ursa');
const fs = require('fs');
const path = require('path');

//Commands to run...
//genkeys keys/aprv keys/apub keys/bprv keys/bpub
//encrypt test/file password keys/aprv keys/bpub
//decrypt test/file.enc test/file.enc.key test/file.sig keys/apub keys/bprv

const commands = {

    encrypt: (file, encryptionKey, senderPrivKey, recipientPubKey) => {

        //read input file
    	let input = fs.readFileSync(file);

        //Sign and Hash file
		let sigKey = ursa.createPrivateKey(fs.readFileSync(senderPrivKey));
        let signature = sigKey.hashAndSign('sha256', input);

        //Encrypting file
		let cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
        let encrypted = Buffer.concat([cipher.update(input),cipher.final()])

        //Encrypting symmetric key
        let recPubKey = ursa.createPublicKey(fs.readFileSync(recipientPubKey));
		let encryptedKey = recPubKey.encrypt(encryptionKey);

        //Write files to disk
		fs.writeFileSync(`${file}.enc`, encrypted);
		fs.writeFileSync(`${file}.enc.key`, encryptedKey);
		fs.writeFileSync(`${file}.sig`, signature);

        //Let the user know the processs id done
        console.log(`Done saving files! ${file}.enc ${file}.key.enc ${file}.asc`);

    },

    decrypt: (encFile, encSymKey, signature, senderPubKey, recipientPrivKey) => {

        //Decrypt symmetric key
        let privKey = ursa.createPrivateKey(fs.readFileSync(recipientPrivKey));
        let symKey = privKey.decrypt(fs.readFileSync(encSymKey));

        //Decrypt file
        let decipher = crypto.createDecipher('aes-256-cbc', symKey.toString());
        let decrypted = Buffer.concat([decipher.update(fs.readFileSync(encFile)) , decipher.final()]);

        //verify signed file
        let senderSigKey = ursa.createPublicKey(fs.readFileSync(senderPubKey));
        let verified = senderSigKey.hashAndVerify('sha256', decrypted, fs.readFileSync(signature));

        console.log(`Verified: ${verified}`);

        //Write out decrypted file
        if (verified) {
           let output = `${encFile.substr(0, encFile.lastIndexOf('.'))}.dec`;
           fs.writeFileSync(output, decrypted);
           console.log(`File saved to: ${output}`);
        }
    },

    genkeys: (alicePriv, alicePub, bobPriv, bobPub) => {

        //Create Alice's key
        let alice = ursa.generatePrivateKey(1024);
        let alicePrivKey= alice.toPrivatePem();
        let alicePubKey = alice.toPublicPem();

        //Create Bob's keypair
        let bob = ursa.generatePrivateKey(1024);
        let bobPrivKey= bob.toPrivatePem();
        let bobPubKey = bob.toPublicPem();

        //Write keyfiles to disk
        fs.writeFileSync(alicePriv, alicePrivKey);
        fs.writeFileSync(alicePub, alicePubKey);
        fs.writeFileSync(bobPriv, bobPrivKey);
        fs.writeFileSync(bobPub, bobPubKey);

        //Let the user know that the operation is complete
        console.log(`Keys generated and saved to disk!`);
    }

};

readline.createInterface({
    input: process.stdin,
    output: process.stdout,
}).on('line', line => {
    const [command, ...args] = line.split(' ');
    const action = commands[command];
    if (!action) {
        console.error(`Invalid command: ${command}`);
        return;
    }
    action.apply(null, args);
});
