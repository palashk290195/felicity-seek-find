import fs from 'fs';
import { execSync, exec } from 'child_process';
import path from 'path';
import readline from 'readline';

// Concurrency limiter class
class ConcurrencyLimiter {
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
  }

  async runTask(task) {
    if (this.running >= this.maxConcurrent) {
      await new Promise(resolve => this.queue.push(resolve));
    }
    this.running++;
    try {
      return await task();
    } finally {
      this.running--;
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        next();
      }
    }
  }
}

function ensureDirectoryExists(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir);
}

function copyBuildOutput(network, language) { 
  try {
    const uploadDir = `playable-ad-builds-${language}`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    if (network === 'applovin') {
      const source = path.join(`dist-inline-${network}-${language}`, 'index.html');
      if (!fs.existsSync(source)) throw new Error('index.html not found');
      fs.copyFileSync(source, path.join(uploadDir, `${network}.html`));
    } else {
      const sourceDir = network === 'meta' ? `dist-split-${network}-${language}` : `dist-inline-${network}-${language}`;
      const files = fs.readdirSync(sourceDir);
      const zipFile = files.find(f => f.endsWith('.zip'));
      if (!zipFile) throw new Error('Zip file not found');
      fs.copyFileSync(
        path.join(sourceDir, zipFile), 
        path.join(uploadDir, `${network}.zip`)
      );
    }
  } catch (error) {
    console.error(`Error processing ${network} for ${language}:`, error.message);
    throw error;
  }
}

function cleanup() {
  // Clean up all network-specific dist directories
  fs.readdirSync('.').forEach(dir => {
    if (dir.startsWith('dist-inline-') || dir.startsWith('dist-split-')) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
}

function buildNetwork(network, language) {
  return new Promise((resolve, reject) => {
    console.log(`Building ${network} for ${language}...`);
    
    const command = `AD_NETWORK=${network} LANGUAGE=${language} vite build --config vite/${network === 'meta' ? 'config-zip' : 'config-inline'}.prod.mjs`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error building ${network} for ${language}:`, stderr);
        reject(error);
        return;
      }
      
      try {
        copyBuildOutput(network, language);
        console.log(`✓ ${network} build complete for ${language}`);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const validNetworks = [
    'google', 'meta', 'mintegral', 'tiktok', 'ironsource',
    'vungle', 'unityads', 'applovin', 'adcolony', 'kayzen'
  ];

  const validLanguages = [
    'en', 'fr', 'ko', 'pt', 'ru', 'de', 'jp'
  ];

  // Create a limiter that allows 3 concurrent builds
  const limiter = new ConcurrencyLimiter(8);

  try {
    // Remove old playable-ad-builds-* directories
    fs.readdirSync('.').forEach(dir => {
      if (dir.startsWith('playable-ad-builds-')) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });

    const answer = await new Promise(resolve => {
      rl.question('Which ad networks would you like to build? (comma-separated, e.g., google,meta,mintegral,unityads):', resolve);
    });

    const selectedNetworks = answer.trim() === '' ? 
      validNetworks : 
      answer.split(',')
        .map(n => n.trim())
        .filter(n => validNetworks.includes(n));

    if (selectedNetworks.length === 0) {
      throw new Error('No valid networks selected');
    }

    console.log(`Starting builds for: ${selectedNetworks.join(', ')} in languages: ${validLanguages.join(', ')}`);
    console.log('Running with max 8 concurrent builds to prevent system overload...');
    
    // Create all combinations of networks and languages
    const buildTasks = selectedNetworks.flatMap(network => 
      validLanguages.map(language => () => limiter.runTask(() => buildNetwork(network, language)))
    );

    // Run builds with concurrency limit
    await Promise.all(buildTasks.map(task => task()));
    
    cleanup();
    console.log('\nAll builds completed successfully! Files are in language-specific "playable-ad-builds-{lang}" folders');
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();