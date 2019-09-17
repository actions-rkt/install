const download = require('download');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { spawnSync } = require('child_process');

const core = require('@actions/core');
const exec = require('@actions/exec');

const baseUrl = 'https://plt.eecs.northwestern.edu/snapshots/current/installers';
const linuxInstaller = 'racket-test-current-x86_64-linux-precise.sh';
const installerUrl = `${baseUrl}/${linuxInstaller}`;

function downloadFile(url: string, name: string): Promise<string> {
    const absPath = path.join(os.tmpdir(), name);

    return new Promise((resolve, reject) => {
        let req = download(url);
        let output = fs.createWriteStream(absPath, { mode: 0o755 });
        req.pipe(output);
        req.on('end', () => {
            output.close(resolve);
        });
        req.on('error', reject);
        output.on('error', reject);
    }).then(() => {
        return absPath;
    });
}

async function installRacket(dst: string) {
    const installer = await downloadFile(installerUrl, 'racket-installer.sh');
    core.debug(`Installer downloaded to ${installer}`);
    const proc = spawnSync(installer, [], { input: `no\n${dst}\n\n` });
    if (proc.error) throw proc.error;
    core.debug(`Racket installed to ${dst}`
}

async function main() {
    try {
        const destination = core.getInput('destination');
        await installRacket(destination);
    } catch (error) {
        core.setFailed(error.message);
    }
}

main();
