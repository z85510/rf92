#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generate a new module based on the _template_ module
 * Usage: npm run generate:module <module-name>
 * Example: npm run generate:module products
 */

function generateModule() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('❌ Please provide a module name');
    console.log('📖 Usage: npm run generate:module <module-name>');
    console.log('📖 Example: npm run generate:module products');
    process.exit(1);
  }

  const moduleName = args[0].toLowerCase();
  const moduleNamePascal = toPascalCase(moduleName);
  const moduleNameCamel = toCamelCase(moduleName);
  
  // Validate module name
  if (!/^[a-z][a-z0-9]*$/.test(moduleName)) {
    console.error('❌ Module name must be lowercase letters and numbers only (e.g., products, userprofiles)');
    process.exit(1);
  }

  const templateDir = path.join(__dirname, '../src/modules/_template_');
  const targetDir = path.join(__dirname, `../src/modules/${moduleName}`);

  // Check if template exists
  if (!fs.existsSync(templateDir)) {
    console.error('❌ Template directory not found at:', templateDir);
    process.exit(1);
  }

  // Check if module already exists
  if (fs.existsSync(targetDir)) {
    console.error(`❌ Module '${moduleName}' already exists at:`, targetDir);
    process.exit(1);
  }

  console.log(`🚀 Generating module: ${moduleName}`);
  console.log(`📁 Target directory: ${targetDir}`);
  
  try {
    // Copy template directory
    copyDirectorySync(templateDir, targetDir);
    
    // Replace placeholders in all files
    replaceInDirectory(targetDir, {
      'Template': moduleNamePascal,
      'template': moduleName,
      'templates': `${moduleName}s`, // pluralize for API endpoints
      'TEMPLATE': moduleName.toUpperCase(),
    });

    // Rename files
    renameFilesInDirectory(targetDir, 'template', moduleName);
    renameFilesInDirectory(targetDir, 'Template', moduleNamePascal);

    console.log('✅ Module generated successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log(`1. Add the ${moduleNamePascal}Module to src/app.module.ts:`);
    console.log(`   import { ${moduleNamePascal}Module } from './modules/${moduleName}/${moduleName}.module';`);
    console.log(`   // Add ${moduleNamePascal}Module to imports array`);
    console.log('');
    console.log(`2. Update the Prisma schema if needed for ${moduleName} model`);
    console.log('3. Run: npx prisma generate && npx prisma db push');
    console.log('4. Start development: npm run start:dev');
    console.log('');
    console.log(`📚 API Documentation will be available at: /api/docs#tag-${moduleName}s`);
    
  } catch (error) {
    console.error('❌ Error generating module:', error.message);
    // Clean up on error
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    process.exit(1);
  }
}

function copyDirectorySync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(src);
  
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectorySync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function replaceInDirectory(dir, replacements) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    
    if (fs.statSync(itemPath).isDirectory()) {
      replaceInDirectory(itemPath, replacements);
    } else if (item.endsWith('.ts') || item.endsWith('.js') || item.endsWith('.json') || item.endsWith('.md')) {
      replaceInFile(itemPath, replacements);
    }
  }
}

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  for (const [search, replace] of Object.entries(replacements)) {
    const regex = new RegExp(search, 'g');
    content = content.replace(regex, replace);
  }
  
  fs.writeFileSync(filePath, content);
}

function renameFilesInDirectory(dir, oldName, newName) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    
    if (fs.statSync(itemPath).isDirectory()) {
      renameFilesInDirectory(itemPath, oldName, newName);
      
      // Rename directory if it contains the old name
      if (item.includes(oldName)) {
        const newItemName = item.replace(new RegExp(oldName, 'g'), newName);
        const newItemPath = path.join(dir, newItemName);
        fs.renameSync(itemPath, newItemPath);
      }
    } else {
      // Rename file if it contains the old name
      if (item.includes(oldName)) {
        const newItemName = item.replace(new RegExp(oldName, 'g'), newName);
        const newItemPath = path.join(dir, newItemName);
        fs.renameSync(itemPath, newItemPath);
      }
    }
  }
}

function toPascalCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\s+/g, '');
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

// Run the script
generateModule();