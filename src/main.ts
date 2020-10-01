const download = require('download');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { spawnSync } = require('child_process');

const core = require('@actions/core');

const installerUrl = (version: string) =>
    `https://download.racket-lang.org/releases/${version}/installers/racket-${version}-x86_64-linux.sh`

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

async function installRacket(dst: string, ver: string) {
    const installer = await downloadFile(installerUrl(ver),
                                         'racket-installer.sh');
    core.debug(`Racket ${ver} installer downloaded to ${installer}`);

    const proc = spawnSync(installer, [], { input: `no\n${dst}\n\n` });
    if (proc.error) throw proc.error;
    core.debug(`Racket ${ver} installed to ${dst}`);

    const binDir = path.join(dst, 'bin');
    core.addPath(binDir);
}

async function main() {
    try {
        const destination = core.getInput('destination');
        const version = core.getInput('version');
        await installRacket(destination, version);
    } catch (error) {
        core.setFailed(error.message);
    }
}

main().then(() => {}, console.error)
