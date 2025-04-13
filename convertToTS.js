const fs = require('fs');
const path = require('path');

// Directories to process
const directories = ['./src'];

// Function to get all JS files recursively
function getAllJsFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // Recursively process subdirectories
      results = results.concat(getAllJsFiles(filePath));
    } else {
      // Check if file is .js
      if (path.extname(filePath) === '.js') {
        results.push(filePath);
      }
    }
  });

  return results;
}

// Function to create a TS version of the file
function createTsFile(jsFilePath) {
  const content = fs.readFileSync(jsFilePath, 'utf8');

  // Determine new file extension - if it has JSX syntax, use .tsx
  const hasJSX = content.includes('import React') &&
    (content.includes('return (') || content.includes('return ('));

  const newExt = hasJSX ? '.tsx' : '.ts';
  const tsFilePath = jsFilePath.replace('.js', newExt);

  // Log the conversion
  console.log(`Converting ${jsFilePath} to ${tsFilePath}`);

  // Copy the content to the new file
  fs.writeFileSync(tsFilePath, content);

  // Log completion
  console.log(`Created ${tsFilePath}`);
}

// Process each directory
directories.forEach(dir => {
  const jsFiles = getAllJsFiles(dir);
  console.log(`Found ${jsFiles.length} JS files in ${dir}`);

  // Process each JS file
  jsFiles.forEach(file => {
    createTsFile(file);
  });
});

console.log('Conversion complete! You will need to:');
console.log('1. Add proper type definitions to each file');
console.log('2. Fix any TypeScript errors');
console.log('3. Delete the original JS files once you\'ve verified the TS versions work') 