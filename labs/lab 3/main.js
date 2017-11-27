const fs = require('fs')

let args = process.argv.slice(2);

if (args.length < 0) {
	console.log('Invalid args');
}


if (args[0] == 'scan'){
	let signatures = fs.readFileSync(args[0]);
	let toScan = walkSync(args[1])

	let quarentine = './quarentine/';
	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}

	toScan.forEach(file => {
		let contents = fs.readFileSync(file);

		signaures.forEach(signature => {
			if (contents.indexOf(signature) >=0) {
				console.log(`Virus found in ${file}`)
			}
		})

	}


	const walkSync = (dir, filelist = []) => {
	  fs.readdirSync(dir).forEach(file => {
	    filelist = fs.statSync(path.join(dir, file)).isDirectory()
	      ? walkSync(path.join(dir, file), filelist)
	      : filelist.concat(path.join(dir, file));

	  });
	return filelist;
	}
} else if (args[0] == 'undo') {
	//TOD
}
