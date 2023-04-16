const fs = require("fs");


createPackageJsonFiles();

function createPackageJsonFiles() {
	// Create package.json for CommonJS
	const cjsPackageJson = {
		type: "commonjs"
	};
	fs.writeFileSync("./dist/cjs/package.json", JSON.stringify(cjsPackageJson, null, 2));

	// Create package.json for ES modules
	const mjsPackageJson = {
		type: "module"
	};
	fs.writeFileSync("./dist/esm/package.json", JSON.stringify(mjsPackageJson, null, 2));
}