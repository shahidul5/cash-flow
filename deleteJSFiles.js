const fs = require('fs');
const path = require('path');

// Directories to process
const directories = ['./src', '.'];

// Function to get all JS files recursively
function getAllJsFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
      // Recursively process subdirectories, but skip node_modules and .git
      results = results.concat(getAllJsFiles(filePath));
    } else {
      // Check if file is .js and has a matching .ts/.tsx file
      if (path.extname(filePath) === '.js') {
        const tsFilePath = filePath.replace('.js', '.ts');
        const tsxFilePath = filePath.replace('.js', '.tsx');

        if (fs.existsSync(tsFilePath) || fs.existsSync(tsxFilePath)) {
          results.push(filePath);
        }
      }
    }
  });

  return results;
}

// Delete JavaScript files
function deleteJsFiles(jsFiles) {
  jsFiles.forEach(file => {
    try {
      fs.unlinkSync(file);
      console.log(`Deleted: ${file}`);
    } catch (err) {
      console.error(`Error deleting ${file}: ${err.message}`);
    }
  });
}

// Process each directory
directories.forEach(dir => {
  const jsFiles = getAllJsFiles(dir);
  console.log(`Found ${jsFiles.length} JS files with TS equivalents in ${dir}`);

  if (jsFiles.length > 0) {
    console.log('The following files will be deleted:');
    jsFiles.forEach(file => console.log(`  - ${file}`));

    const confirmDelete = process.argv.includes('--confirm');

    if (confirmDelete) {
      deleteJsFiles(jsFiles);
      console.log('JS files deleted successfully.');
    } else {
      console.log('\nTo delete these files, run this script with --confirm flag:');
      console.log('node deleteJSFiles.js --confirm');
    }
  }
}); 