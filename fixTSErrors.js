const fs = require('fs');
const path = require('path');

// List of files to process - these are the TypeScript files that have been created
const directories = ['./src'];

// Function to get all TS files recursively
function getAllTsFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // Recursively process subdirectories
      results = results.concat(getAllTsFiles(filePath));
    } else {
      // Check if file is .ts or .tsx
      if (path.extname(filePath) === '.ts' || path.extname(filePath) === '.tsx') {
        results.push(filePath);
      }
    }
  });

  return results;
}

// Common fixes for TypeScript files
function fixTypescriptFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // 1. Fix createContext() calls - add default value as parameter
  const createContextRegex = /createContext\(\);/g;
  if (createContextRegex.test(content)) {
    content = content.replace(createContextRegex, 'createContext(null);');
    hasChanges = true;
    console.log(`Fixed createContext in ${filePath}`);
  }

  // 2. Add types to React component props
  if (filePath.endsWith('.tsx')) {
    // Fix basic component props
    const componentPropsRegex = /const (\w+) = \(\{ ([^}]+) \}\) =>/g;
    let match;
    while ((match = componentPropsRegex.exec(content)) !== null) {
      const componentName = match[1];
      const propsString = match[2];
      const props = propsString.split(',').map(p => p.trim());

      // Only do this replacement if there are no type annotations already
      if (!propsString.includes(':')) {
        const typed = props.map(p => `${p}: any`).join(', ');
        const replacement = `const ${componentName}: React.FC<{ ${typed} }> = ({ ${propsString} }) =>`;
        content = content.replace(match[0], replacement);
        hasChanges = true;
        console.log(`Added props interface for ${componentName} in ${filePath}`);
      }
    }
  }

  // 3. Fix useState calls without types
  const useStateRegex = /useState\(([^<][^)]*)\)/g;
  let match2;
  while ((match2 = useStateRegex.exec(content)) !== null) {
    const initialValue = match2[1].trim();
    let type = 'any';

    // Try to guess the type based on the initial value
    if (initialValue === '[]') {
      type = 'any[]';
    } else if (initialValue === '{}') {
      type = 'Record<string, any>';
    } else if (initialValue === 'false' || initialValue === 'true') {
      type = 'boolean';
    } else if (initialValue === '0' || /^-?\d+(\.\d+)?$/.test(initialValue)) {
      type = 'number';
    } else if (initialValue === "''") {
      type = 'string';
    }

    const replacement = `useState<${type}>(${initialValue})`;
    content = content.replace(match2[0], replacement);
    hasChanges = true;
  }

  // 4. Fix FONTS usage in StyleSheet
  if (content.includes('...FONTS.')) {
    // Find all style definitions containing ...FONTS
    const styleRegex = /(\w+):\s*{[^}]*\.\.\.FONTS\.\w+[^}]*}/g;
    let match3;
    while ((match3 = styleRegex.exec(content)) !== null) {
      // For each matched style, modify to address the fontWeight issue
      const styleName = match3[1];
      const styleSection = match3[0];

      // Extract the fontWeight value if present
      const fontWeightRegex = /fontWeight:\s*['"](\w+)['"]/;
      const fontWeightMatch = styleSection.match(fontWeightRegex);

      if (fontWeightMatch) {
        // Get the fontWeight value and create a valid typescript value
        const fontWeight = fontWeightMatch[1];
        let validFontWeight;

        // Map string weights to TypeScript compatible values
        switch (fontWeight) {
          case 'bold':
            validFontWeight = '"bold"';
            break;
          case 'normal':
            validFontWeight = '"normal"';
            break;
          case 'medium':
            validFontWeight = '"500"';
            break;
          case 'light':
            validFontWeight = '"300"';
            break;
          case '400':
          case '500':
          case '600':
          case '700':
          case '800':
          case '900':
          case '300':
          case '200':
          case '100':
            validFontWeight = `"${fontWeight}"`;
            break;
          default:
            validFontWeight = '"normal"';
        }

        // Create the new style with a valid fontWeight for TypeScript
        const newStyle = styleSection.replace(
          fontWeightRegex,
          `fontWeight: ${validFontWeight}`
        );

        // Replace in the content
        content = content.replace(styleSection, newStyle);
        hasChanges = true;
        console.log(`Fixed fontWeight in ${styleName} style in ${filePath}`);
      }
    }
  }

  // 5. Function parameter typing
  // Add 'any' type to common parameter patterns
  const parameterRegex = /const (\w+) = \((\w+)(?:, |\))/g;
  content = content.replace(parameterRegex, 'const $1 = ($2: any$3');

  const multiParamRegex = /const (\w+) = \((\w+), (\w+)(?:, |\))/g;
  content = content.replace(multiParamRegex, 'const $1 = ($2: any, $3: any$4');

  // 6. Handle "error is of type unknown" issues
  const errorMessageRegex = /(error)\.message/g;
  content = content.replace(errorMessageRegex, '($1 as Error).message');

  // If we made any changes, write the file back
  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`Applied fixes to ${filePath}`);
  }
}

// Process each directory
directories.forEach(dir => {
  const tsFiles = getAllTsFiles(dir);
  console.log(`Found ${tsFiles.length} TypeScript files in ${dir}`);

  // Process each TS file
  tsFiles.forEach(file => {
    console.log(`Processing ${file}...`);
    fixTypescriptFile(file);
  });
});

console.log('Completed fixing common TypeScript errors.');
console.log('Next steps:');
console.log('1. Run "npx tsc --noEmit" to see remaining errors');
console.log('2. Fix the remaining errors manually');
console.log('3. Test the application to ensure it works correctly'); 