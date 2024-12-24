import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// Helper function to remove a directory if it exists
function removeDirectoryIfExists(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.rmSync(directoryPath, { recursive: true, force: true });
  }
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

adNetworks.forEach(network => {
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

  // Run the inline build command with Vite
  console.log(`Running inline build for ${network}`);
  execSync(`vite build --config vite/config-inline.prod.mjs`, { stdio: 'inherit' });

  // Run the zip build command with Vite
  console.log(`Running zip build for ${network}`);
  execSync(`vite build --config vite/config-zip.prod.mjs`, { stdio: 'inherit' });

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

  // Move the dist-inline and dist-split folders into the network directory
  const distInlinePath = './dist-inline';
  const distSplitPath = './dist-split';

  if (fs.existsSync(distInlinePath)) {
    fs.renameSync(distInlinePath, path.join(networkDir, 'dist-inline'));
  }

  if (fs.existsSync(distSplitPath)) {
    fs.renameSync(distSplitPath, path.join(networkDir, 'dist-split'));
  }
});