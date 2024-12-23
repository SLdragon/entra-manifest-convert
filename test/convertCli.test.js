import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { expect } from 'chai';
import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

describe('convert.cli.js', () => {
  const testManifest = path.join(__dirname, 'test-resources', 'aad.manifest.new.json');
  const backupManifest = `${testManifest}.bak`;

  before(async () => {
    // Backup the original file
    await fs.copy(testManifest, backupManifest);
  });

  after(async () => {
    // Restore the original file
    await fs.copy(backupManifest, testManifest);
    await fs.remove(backupManifest);
  });

  it('should process the manifest without error', () => {
    const result = spawnSync('node', ['../convert.cli.js', testManifest], {
      cwd: __dirname
    });
    expect(result.status).to.equal(0);
    expect(result.stdout.toString()).to.include('Successfully converted and saved');
  });

  it('should result in a file with expected properties', async () => {
    const content = await fs.readJson(testManifest);
    expect(content).to.have.property('appId');
    expect(content).to.have.property('web');
    expect(content).to.have.property('id');
  });

  it('should allow specifying an output file', () => {
    const outputPath = path.join(__dirname, 'test-resources', 'aad.manifest.output.json');
    // Clean up if exists
    if (fs.existsSync(outputPath)) fs.removeSync(outputPath);

    const result = spawnSync('node', [
      '../convert.cli.js',
      testManifest,
      '--out',
      outputPath
    ], { cwd: __dirname });

    expect(result.status).to.equal(0);
    expect(fs.existsSync(outputPath)).to.be.true;
  });
});