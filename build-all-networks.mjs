import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import readline from 'readline';

// Helper function to remove a directory if it exists
function removeDirectoryIfExists(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.rmSync(directoryPath, { recursive: true, force: true });
  }
}

// Helper function to rename a zip file
function renameZipFile(directory, network) {
  const files = fs.readdirSync(directory);
  const zipFiles = files.filter(file => file.endsWith('.zip'));

  zipFiles.forEach(zipFile => {
    const oldZipPath = path.join(directory, zipFile);
    const newZipPath = path.join(directory, `${network}.zip`);
    fs.renameSync(oldZipPath, newZipPath);
  });
}

// Read the existing config.js file
const configPath = './src/config.js';
const configContent = fs.readFileSync(configPath, 'utf-8');

// Extract the store links from the existing config
const googlePlayStoreLinkMatch = configContent.match(/googlePlayStoreLink:\s*"(.*?)"/);
const appleStoreLinkMatch = configContent.match(/appleStoreLink:\s*"(.*?)"/);

const googlePlayStoreLink = googlePlayStoreLinkMatch ? googlePlayStoreLinkMatch[1] : '';
const appleStoreLink = appleStoreLinkMatch ? appleStoreLinkMatch[1] : '';

const adNetworks = [
  'google',
  'meta',
  'mintegral',
  'tiktok',
  'ironsource',
  'vungle',
  'unityads',
  'applovin',
  'adcolony',
  'kayzen'
];

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask the user which networks to build
rl.question(`Which ad networks would you like to build? (comma-separated, e.g., google,meta,mintegral,unityads): `, (answer) => {
  let selectedNetworks = answer.split(',').map(network => network.trim()).filter(network => adNetworks.includes(network));

  // If no networks are specified, build all
  if (selectedNetworks.length === 0 && answer.trim() === '') {
    selectedNetworks = adNetworks;
  }

  if (selectedNetworks.length === 0) {
    console.log('No valid ad networks selected. Exiting.');
    rl.close();
    return;
  }

  selectedNetworks.forEach(network => {
    console.log(`Building for ad network: ${network}`);

    // Update the config.js file with the current ad network type
    const updatedConfigContent = `
      export const config = {
        adNetworkType: "${network}",
        googlePlayStoreLink: "${googlePlayStoreLink}",
        appleStoreLink: "${appleStoreLink}",
      };
    `;
    fs.writeFileSync(configPath, updatedConfigContent);

    // Run the appropriate build command with Vite
    if (network === 'meta') {
      console.log(`Running zip build for ${network}`);
      execSync(`vite build --config vite/config-zip.prod.mjs`, { stdio: 'inherit' });
    } else {
      console.log(`Running inline build for ${network}`);
      execSync(`vite build --config vite/config-inline.prod.mjs`, { stdio: 'inherit' });
    }

    // Create the playable-ad-builds directory if it doesn't exist
    const buildsDir = './playable-ad-builds';
    if (!fs.existsSync(buildsDir)) {
      fs.mkdirSync(buildsDir);
    }

    // Create a directory for the current ad network
    const networkDir = path.join(buildsDir, network);
    if (!fs.existsSync(networkDir)) {
      fs.mkdirSync(networkDir);
    }

    // Remove existing dist-inline and dist-split directories in the network directory
    removeDirectoryIfExists(path.join(networkDir, 'dist-inline'));
    removeDirectoryIfExists(path.join(networkDir, 'dist-split'));

    // Move the appropriate dist folder into the network directory
    const distInlinePath = './dist-inline';
    const distSplitPath = './dist-split';

    if (fs.existsSync(distInlinePath)) {
      fs.renameSync(distInlinePath, path.join(networkDir, 'dist-inline'));
      renameZipFile(path.join(networkDir, 'dist-inline'), network);
    }

    if (fs.existsSync(distSplitPath)) {
      fs.renameSync(distSplitPath, path.join(networkDir, 'dist-split'));
      renameZipFile(path.join(networkDir, 'dist-split'), network);
    }
  });

  rl.close();
});