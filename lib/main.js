"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const download = require('download');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const core = require('@actions/core');
const baseUrl = 'https://plt.eecs.northwestern.edu/snapshots/current/installers';
const linuxInstaller = 'racket-test-current-x86_64-linux-precise.sh';
const installerUrl = `${baseUrl}/${linuxInstaller}`;
function downloadFile(url, name) {
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
function installRacket(dst) {
    return __awaiter(this, void 0, void 0, function* () {
        const installer = yield downloadFile(installerUrl, 'racket-installer.sh');
        core.debug(`Racket installer downloaded to ${installer}`);
        const proc = spawnSync(installer, [], { input: `no\n${dst}\n\n` });
        if (proc.error)
            throw proc.error;
        core.debug(`Racket installed to ${dst}`);
        const binDir = path.join(dst, 'bin');
        core.addPath(binDir);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const destination = core.getInput('destination');
            yield installRacket(destination);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
main();
