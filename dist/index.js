require('./sourcemap-register.js');module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 3758:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pushPackages = exports.login = exports.filterPackages = exports.buildPackages = exports.createFullImageName = void 0;
const path_1 = __importDefault(__nccwpck_require__(5622));
const fs_1 = __importDefault(__nccwpck_require__(5747));
const child_process_1 = __importDefault(__nccwpck_require__(3129));
const github = __importStar(__nccwpck_require__(5438));
const core = __importStar(__nccwpck_require__(2186));
const execa_1 = __importDefault(__nccwpck_require__(5447));
const util_1 = __nccwpck_require__(4024);
function getDockerfile(packageDir) {
    const packagesPath = util_1.getPackagesDir();
    return path_1.default.resolve(packagesPath, packageDir, 'Dockerfile');
}
function createImageName(packageDir) {
    const registry = core.getInput('registry');
    const prefix = core.getInput('prefix');
    return `${registry}${prefix ? `/${prefix}` : ''}/${packageDir}`;
}
function createTag() {
    const { sha } = github.context;
    return sha.substring(0, 7);
}
function createFullImageName(packageDir) {
    return `${createImageName(packageDir)}:${createTag()}`;
}
exports.createFullImageName = createFullImageName;
function buildPackage(packageDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const dockerfile = getDockerfile(packageDir);
        const directory = core.getInput('directory');
        const args = [
            'build',
            '-f',
            dockerfile,
            '-t',
            `${createFullImageName(packageDir)}`,
            directory,
        ];
        try {
            yield execa_1.default('docker', args);
            core.info(`${packageDir} docker build success`);
        }
        catch (e) {
            core.error(e);
            throw new Error(`${packageDir} build fail: ${dockerfile}, ${createFullImageName(packageDir)}`);
        }
    });
}
function buildPackages(packages) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(Array.from(packages).map(buildPackage));
    });
}
exports.buildPackages = buildPackages;
function filterPackages(packages) {
    return new Set(Array.from(packages).filter((packageDir) => {
        const dockerfile = getDockerfile(packageDir);
        return fs_1.default.existsSync(dockerfile);
    }));
}
exports.filterPackages = filterPackages;
const isEcr = (registry) => !!registry && registry.includes('amazonaws');
const getRegion = (registry) => registry.substring(registry.indexOf('ecr.') + 4, registry.indexOf('.amazonaws'));
const isWindows = () => process.env.RUNNER_OS === 'Windows';
function login() {
    return __awaiter(this, void 0, void 0, function* () {
        const registry = core.getInput('registry');
        const username = core.getInput('username');
        const password = core.getInput('password');
        // If using ECR, use the AWS CLI login command in favor of docker login
        if (isEcr(registry)) {
            const region = getRegion(registry);
            core.info(`Logging into ECR region ${region}...`);
            // Determine whether to run bash or PowerShell version of login command
            if (isWindows()) {
                execa_1.default.sync(`aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${registry}`);
            }
            else {
                execa_1.default.sync(`$(aws ecr get-login --region ${region} --no-include-email)`);
            }
        }
        else if (username && password) {
            core.info(`Logging into Docker registry ${registry}...`);
            const result = child_process_1.default.execSync(`docker login ${registry} -u ${username} --password-stdin`, {
                input: password,
            });
            core.info(result.toString());
        }
    });
}
exports.login = login;
function pushPackage(packageDir) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            child_process_1.default.execSync(`docker push ${createFullImageName(packageDir)}`, {
                maxBuffer: 50 * 1024 * 1024,
                stdio: 'inherit',
            });
            core.info(`${packageDir} docker push success`);
        }
        catch (e) {
            core.error(e);
            throw new Error(`${packageDir} push fail`);
        }
    });
}
function pushPackages(packages) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(Array.from(packages).map(pushPackage));
    });
}
exports.pushPackages = pushPackages;


/***/ }),

/***/ 3109:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const path_1 = __importDefault(__nccwpck_require__(5622));
const github = __importStar(__nccwpck_require__(5438));
const core = __importStar(__nccwpck_require__(2186));
const util_1 = __nccwpck_require__(4024);
const packages_1 = __nccwpck_require__(7874);
const docker_1 = __nccwpck_require__(3758);
const swarm_1 = __nccwpck_require__(7805);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const octokit = github.getOctokit(util_1.getToken());
        const { context } = github;
        if (!context.payload.pull_request) {
            core.setFailed('need pull request');
            return;
        }
        const { pull_request } = context.payload;
        const octokitBaseFormData = {
            repo: context.repo.repo,
            owner: context.repo.owner,
            pull_number: pull_request.number,
        };
        try {
            const { data: files } = yield octokit.pulls.listFiles(octokitBaseFormData);
            const { sha } = context.payload.pull_request.head;
            packages_1.resolveDeps();
            const changedPackageDirs = new Set();
            files.forEach((file) => {
                const filePath = file.blob_url.split(sha)[1].replace(/^\//, '');
                if (new RegExp(`^${util_1.getPackagesDir()}/([^/]+)/`).exec(path_1.default.resolve('.', filePath))) {
                    changedPackageDirs.add(RegExp.$1);
                }
            });
            const all = packages_1.getAllChangedPackageDirs(changedPackageDirs);
            core.info(`will build dirs: ${Array.from(all).join(', ')}`);
            const filteredPackages = docker_1.filterPackages(all);
            yield docker_1.buildPackages(filteredPackages);
            yield docker_1.login();
            yield docker_1.pushPackages(filteredPackages);
            yield swarm_1.deploy(filteredPackages);
        }
        catch (e) {
            if (pull_request) {
                try {
                    yield octokit.issues.createComment(Object.assign(Object.assign({}, octokitBaseFormData), { issue_number: octokitBaseFormData.pull_number, body: e.toString() }));
                    yield octokit.pulls.update(Object.assign(Object.assign({}, octokitBaseFormData), { state: 'closed' }));
                }
                catch (err) {
                    core.error(err);
                }
                core.setFailed(e);
                process.exit(1);
            }
        }
    });
}
run();


/***/ }),

/***/ 7874:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAllChangedPackageDirs = exports.resolveDeps = exports.getPackageJson = void 0;
const path_1 = __importDefault(__nccwpck_require__(5622));
const fs_1 = __importDefault(__nccwpck_require__(5747));
const util_1 = __nccwpck_require__(4024);
const parentMap = new Map();
const childrenMap = new Map();
const dirMap = new Map();
const nameMap = new Map();
function getPackageJson(packageDir) {
    const packagesPath = util_1.getPackagesDir();
    return require(path_1.default.resolve(packagesPath, packageDir, 'package.json'));
}
exports.getPackageJson = getPackageJson;
function resolvePackage(packageDir) {
    const packageJson = getPackageJson(packageDir);
    const { name } = packageJson;
    dirMap.set(name, packageDir);
    nameMap.set(packageDir, name);
    const parents = new Set();
    if (typeof packageJson.dependencies === 'object') {
        Object.entries(packageJson.dependencies)
            .filter(([, version]) => /^workspaces/.exec(version))
            .forEach(([key]) => {
            parents.add(key);
        });
    }
    parentMap.set(name, parents);
    Array.from(parents).forEach((dep) => {
        var _a;
        if (childrenMap.has(dep)) {
            (_a = childrenMap.get(dep)) === null || _a === void 0 ? void 0 : _a.add(name);
        }
        else {
            const children = new Set();
            children.add(name);
            childrenMap.set(dep, children);
        }
    });
}
function resolveDeps() {
    const packagesPath = util_1.getPackagesDir();
    const packages = fs_1.default.readdirSync(path_1.default.resolve(__dirname, packagesPath));
    packages.forEach(resolvePackage);
}
exports.resolveDeps = resolveDeps;
function getAllChangedPackageDirs(changedPackageDirs) {
    const changedArr = Array.from(changedPackageDirs);
    const all = new Set();
    changedArr.forEach((changedDir) => {
        const children = childrenMap.get(nameMap.get(changedDir));
        if (children) {
            Array.from(children).forEach((child) => dirMap.get(child) && all.add(dirMap.get(child)));
        }
        all.add(changedDir);
    });
    return all;
}
exports.getAllChangedPackageDirs = getAllChangedPackageDirs;


/***/ }),

/***/ 7805:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deploy = void 0;
const ssh2_1 = __nccwpck_require__(6063);
const core = __importStar(__nccwpck_require__(2186));
const docker_1 = __nccwpck_require__(3758);
const packages_1 = __nccwpck_require__(7874);
function getSwarmOptions(packageDir) {
    var _a;
    const packageJson = packages_1.getPackageJson(packageDir);
    return (_a = packageJson.swarmOptions) !== null && _a !== void 0 ? _a : {};
}
function getExistServices(conn) {
    return __awaiter(this, void 0, void 0, function* () {
        const services = new Set();
        return new Promise((resolve, reject) => {
            conn.exec('docker service ls', (err, stream) => {
                if (err) {
                    core.error(err);
                    reject(new Error('docker service ls error'));
                }
                else {
                    let result = '';
                    stream
                        .on('data', (data) => {
                        if (typeof data === 'string')
                            result += data;
                        else
                            result += data.toString('utf8');
                    })
                        .on('exit', (exitCode) => {
                        if (exitCode !== 0) {
                            const error = new Error(`docker service ls error ${exitCode}`);
                            core.error(error);
                            reject(error);
                        }
                        else {
                            result.split('\n').map((row) => row.split(/\s+/)[1]).forEach((service) => service && services.add(service));
                            resolve(services);
                        }
                    });
                }
            });
        });
    });
}
function deployPackage(conn, services, packageDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const networkName = core.getInput('network_name');
        return new Promise((resolve, reject) => {
            var _a;
            const registry = core.getInput('registry');
            const options = getSwarmOptions(packageDir);
            const serviceName = (_a = options.name) !== null && _a !== void 0 ? _a : packageDir;
            options.name = serviceName;
            core.info(`${serviceName} is existed？${services.has(serviceName)}`);
            let command = '';
            if (services.has(serviceName)) {
                command = `docker service update --image ${registry}/${docker_1.createFullImageName(packageDir)} ${serviceName}`;
            }
            else {
                const args = Object.entries(options).map(([key, value]) => `--${key} ${value}`).join(' ');
                command = `docker service create --restart-condition none -e MODE=swarm --network ${networkName} ${args} ${registry}/${docker_1.createFullImageName(packageDir)} `;
            }
            conn.exec(command, (err, stream) => {
                if (err) {
                    core.error(err);
                    reject(new Error(`${packageDir} service ${command} error: ${err.message}`));
                }
                else {
                    stream
                        .on('exit', (exitCode) => {
                        if (exitCode !== 0) {
                            const error = new Error(`docker service ${packageDir} deploy error ${exitCode}`);
                            core.error(error);
                            reject(error);
                        }
                        else {
                            core.info(`${packageDir} deploy success`);
                            resolve();
                        }
                    })
                        .on('data', (data) => {
                        core.info(data.toString('utf8'));
                    })
                        .stderr.on('data', (data) => {
                        core.error(data.toString('utf8'));
                    });
                }
            });
        });
    });
}
function deploy(packages) {
    return __awaiter(this, void 0, void 0, function* () {
        const host = core.getInput('remote_host');
        const port = parseInt(core.getInput('ssh_port'), 10);
        const username = core.getInput('ssh_username');
        const privateKey = core.getInput('ssh_private_key');
        const password = core.getInput('ssh_password');
        const networkName = core.getInput('network_name');
        if (!host || !networkName || !(password || privateKey))
            return;
        const conn = new ssh2_1.Client();
        yield new Promise((resolve, reject) => {
            try {
                conn.connect({
                    host,
                    port,
                    username,
                    password,
                    privateKey,
                });
                conn.on('ready', () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const services = yield getExistServices(conn);
                        core.info(Array.from(services).join(', '));
                        // eslint-disable-next-line no-restricted-syntax
                        for (const packageDir of Array.from(packages)) {
                            yield deployPackage(conn, services, packageDir);
                        }
                        conn.end();
                        resolve();
                    }
                    catch (e) {
                        reject(e);
                    }
                }));
            }
            catch (e) {
                core.error(e);
                reject(e);
            }
        });
    });
}
exports.deploy = deploy;


/***/ }),

/***/ 4024:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getToken = exports.getPackagesDir = void 0;
const path_1 = __importDefault(__nccwpck_require__(5622));
const core_1 = __nccwpck_require__(2186);
function getPackagesDir() {
    const packagesPath = core_1.getInput('packages_path');
    return path_1.default.resolve('./', packagesPath);
}
exports.getPackagesDir = getPackagesDir;
function getToken() {
    return core_1.getInput('token');
}
exports.getToken = getToken;


/***/ }),

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2087));
const path = __importStar(__nccwpck_require__(5622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(5747));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 4087:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Context = void 0;
const fs_1 = __nccwpck_require__(5747);
const os_1 = __nccwpck_require__(2087);
class Context {
    /**
     * Hydrate the context from the environment
     */
    constructor() {
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
            if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH)) {
                this.payload = JSON.parse(fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
            }
            else {
                const path = process.env.GITHUB_EVENT_PATH;
                process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${os_1.EOL}`);
            }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
        this.job = process.env.GITHUB_JOB;
        this.runNumber = parseInt(process.env.GITHUB_RUN_NUMBER, 10);
        this.runId = parseInt(process.env.GITHUB_RUN_ID, 10);
    }
    get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pull_request || payload).number });
    }
    get repo() {
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
            return { owner, repo };
        }
        if (this.payload.repository) {
            return {
                owner: this.payload.repository.owner.login,
                repo: this.payload.repository.name
            };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map

/***/ }),

/***/ 5438:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOctokit = exports.context = void 0;
const Context = __importStar(__nccwpck_require__(4087));
const utils_1 = __nccwpck_require__(3030);
exports.context = new Context.Context();
/**
 * Returns a hydrated octokit ready to use for GitHub Actions
 *
 * @param     token    the repo PAT or GITHUB_TOKEN
 * @param     options  other options to set
 */
function getOctokit(token, options) {
    return new utils_1.GitHub(utils_1.getOctokitOptions(token, options));
}
exports.getOctokit = getOctokit;
//# sourceMappingURL=github.js.map

/***/ }),

/***/ 7914:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getApiBaseUrl = exports.getProxyAgent = exports.getAuthString = void 0;
const httpClient = __importStar(__nccwpck_require__(9925));
function getAuthString(token, options) {
    if (!token && !options.auth) {
        throw new Error('Parameter token or opts.auth is required');
    }
    else if (token && options.auth) {
        throw new Error('Parameters token and opts.auth may not both be specified');
    }
    return typeof options.auth === 'string' ? options.auth : `token ${token}`;
}
exports.getAuthString = getAuthString;
function getProxyAgent(destinationUrl) {
    const hc = new httpClient.HttpClient();
    return hc.getAgent(destinationUrl);
}
exports.getProxyAgent = getProxyAgent;
function getApiBaseUrl() {
    return process.env['GITHUB_API_URL'] || 'https://api.github.com';
}
exports.getApiBaseUrl = getApiBaseUrl;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 3030:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOctokitOptions = exports.GitHub = exports.context = void 0;
const Context = __importStar(__nccwpck_require__(4087));
const Utils = __importStar(__nccwpck_require__(7914));
// octokit + plugins
const core_1 = __nccwpck_require__(6762);
const plugin_rest_endpoint_methods_1 = __nccwpck_require__(3044);
const plugin_paginate_rest_1 = __nccwpck_require__(4193);
exports.context = new Context.Context();
const baseUrl = Utils.getApiBaseUrl();
const defaults = {
    baseUrl,
    request: {
        agent: Utils.getProxyAgent(baseUrl)
    }
};
exports.GitHub = core_1.Octokit.plugin(plugin_rest_endpoint_methods_1.restEndpointMethods, plugin_paginate_rest_1.paginateRest).defaults(defaults);
/**
 * Convience function to correctly format Octokit Options to pass into the constructor.
 *
 * @param     token    the repo PAT or GITHUB_TOKEN
 * @param     options  other options to set
 */
function getOctokitOptions(token, options) {
    const opts = Object.assign({}, options || {}); // Shallow clone - don't mutate the object provided by the caller
    // Auth
    const auth = Utils.getAuthString(token, opts);
    if (auth) {
        opts.auth = auth;
    }
    return opts;
}
exports.getOctokitOptions = getOctokitOptions;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 9925:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const http = __nccwpck_require__(8605);
const https = __nccwpck_require__(7211);
const pm = __nccwpck_require__(6443);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = new URL(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __nccwpck_require__(4294);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`,
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new HttpClientError(msg, statusCode);
                err.result = response.result;
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 6443:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = new URL(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 334:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

async function auth(token) {
  const tokenType = token.split(/\./).length === 3 ? "app" : /^v\d+\./.test(token) ? "installation" : "oauth";
  return {
    type: "token",
    token: token,
    tokenType
  };
}

/**
 * Prefix token for usage in the Authorization header
 *
 * @param token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }

  return `token ${token}`;
}

async function hook(token, request, route, parameters) {
  const endpoint = request.endpoint.merge(route, parameters);
  endpoint.headers.authorization = withAuthorizationPrefix(token);
  return request(endpoint);
}

const createTokenAuth = function createTokenAuth(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }

  if (typeof token !== "string") {
    throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
  }

  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};

exports.createTokenAuth = createTokenAuth;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 6762:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var universalUserAgent = __nccwpck_require__(5030);
var beforeAfterHook = __nccwpck_require__(3682);
var request = __nccwpck_require__(6234);
var graphql = __nccwpck_require__(8467);
var authToken = __nccwpck_require__(334);

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

const VERSION = "3.2.5";

class Octokit {
  constructor(options = {}) {
    const hook = new beforeAfterHook.Collection();
    const requestDefaults = {
      baseUrl: request.request.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, options.request, {
        hook: hook.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    }; // prepend default user agent with `options.userAgent` if set

    requestDefaults.headers["user-agent"] = [options.userAgent, `octokit-core.js/${VERSION} ${universalUserAgent.getUserAgent()}`].filter(Boolean).join(" ");

    if (options.baseUrl) {
      requestDefaults.baseUrl = options.baseUrl;
    }

    if (options.previews) {
      requestDefaults.mediaType.previews = options.previews;
    }

    if (options.timeZone) {
      requestDefaults.headers["time-zone"] = options.timeZone;
    }

    this.request = request.request.defaults(requestDefaults);
    this.graphql = graphql.withCustomRequest(this.request).defaults(requestDefaults);
    this.log = Object.assign({
      debug: () => {},
      info: () => {},
      warn: console.warn.bind(console),
      error: console.error.bind(console)
    }, options.log);
    this.hook = hook; // (1) If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
    //     is unauthenticated. The `this.auth()` method is a no-op and no request hook is registered.
    // (2) If only `options.auth` is set, use the default token authentication strategy.
    // (3) If `options.authStrategy` is set then use it and pass in `options.auth`. Always pass own request as many strategies accept a custom request instance.
    // TODO: type `options.auth` based on `options.authStrategy`.

    if (!options.authStrategy) {
      if (!options.auth) {
        // (1)
        this.auth = async () => ({
          type: "unauthenticated"
        });
      } else {
        // (2)
        const auth = authToken.createTokenAuth(options.auth); // @ts-ignore  ¯\_(ツ)_/¯

        hook.wrap("request", auth.hook);
        this.auth = auth;
      }
    } else {
      const {
        authStrategy
      } = options,
            otherOptions = _objectWithoutProperties(options, ["authStrategy"]);

      const auth = authStrategy(Object.assign({
        request: this.request,
        log: this.log,
        // we pass the current octokit instance as well as its constructor options
        // to allow for authentication strategies that return a new octokit instance
        // that shares the same internal state as the current one. The original
        // requirement for this was the "event-octokit" authentication strategy
        // of https://github.com/probot/octokit-auth-probot.
        octokit: this,
        octokitOptions: otherOptions
      }, options.auth)); // @ts-ignore  ¯\_(ツ)_/¯

      hook.wrap("request", auth.hook);
      this.auth = auth;
    } // apply plugins
    // https://stackoverflow.com/a/16345172


    const classConstructor = this.constructor;
    classConstructor.plugins.forEach(plugin => {
      Object.assign(this, plugin(this, options));
    });
  }

  static defaults(defaults) {
    const OctokitWithDefaults = class extends this {
      constructor(...args) {
        const options = args[0] || {};

        if (typeof defaults === "function") {
          super(defaults(options));
          return;
        }

        super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent ? {
          userAgent: `${options.userAgent} ${defaults.userAgent}`
        } : null));
      }

    };
    return OctokitWithDefaults;
  }
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */


  static plugin(...newPlugins) {
    var _a;

    const currentPlugins = this.plugins;
    const NewOctokit = (_a = class extends this {}, _a.plugins = currentPlugins.concat(newPlugins.filter(plugin => !currentPlugins.includes(plugin))), _a);
    return NewOctokit;
  }

}
Octokit.VERSION = VERSION;
Octokit.plugins = [];

exports.Octokit = Octokit;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 9440:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var isPlainObject = __nccwpck_require__(558);
var universalUserAgent = __nccwpck_require__(5030);

function lowercaseKeys(object) {
  if (!object) {
    return {};
  }

  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach(key => {
    if (isPlainObject.isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, {
        [key]: options[key]
      });else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, {
        [key]: options[key]
      });
    }
  });
  return result;
}

function removeUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }

  return obj;
}

function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? {
      method,
      url
    } : {
      url: method
    }, options);
  } else {
    options = Object.assign({}, route);
  } // lowercase header names before merging with defaults to avoid duplicates


  options.headers = lowercaseKeys(options.headers); // remove properties with undefined values before merging

  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options); // mediaType.previews arrays are merged, instead of overwritten

  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(preview => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(preview => preview.replace(/-preview/, ""));
  return mergedOptions;
}

function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);

  if (names.length === 0) {
    return url;
  }

  return url + separator + names.map(name => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }

    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}

const urlVariableRegex = /\{[^}]+\}/g;

function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}

function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);

  if (!matches) {
    return [];
  }

  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
  return Object.keys(object).filter(option => !keysToOmit.includes(option)).reduce((obj, key) => {
    obj[key] = object[key];
    return obj;
  }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/* istanbul ignore file */
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }

    return part;
  }).join("");
}

function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);

  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}

function getValues(context, operator, key, modifier) {
  var value = context[key],
      result = [];

  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();

      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }

      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];

        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            tmp.push(encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }

  return result;
}

function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}

function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
    if (expression) {
      let operator = "";
      const values = [];

      if (operators.indexOf(expression.charAt(0)) !== -1) {
        operator = expression.charAt(0);
        expression = expression.substr(1);
      }

      expression.split(/,/g).forEach(function (variable) {
        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
        values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
      });

      if (operator && operator !== "+") {
        var separator = ",";

        if (operator === "?") {
          separator = "&";
        } else if (operator !== "#") {
          separator = operator;
        }

        return (values.length !== 0 ? operator : "") + values.join(separator);
      } else {
        return values.join(",");
      }
    } else {
      return encodeReserved(literal);
    }
  });
}

function parse(options) {
  // https://fetch.spec.whatwg.org/#methods
  let method = options.method.toUpperCase(); // replace :varname with {varname} to make it RFC 6570 compatible

  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]); // extract variable names from URL to calculate remaining variables later

  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);

  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }

  const omittedParameters = Object.keys(options).filter(option => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);

  if (!isBinaryRequest) {
    if (options.mediaType.format) {
      // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
      headers.accept = headers.accept.split(/,/).map(preview => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
    }

    if (options.mediaType.previews.length) {
      const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
      headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map(preview => {
        const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
        return `application/vnd.github.${preview}-preview${format}`;
      }).join(",");
    }
  } // for GET/HEAD requests, set URL query parameters from remaining parameters
  // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters


  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      } else {
        headers["content-length"] = 0;
      }
    }
  } // default content-type for JSON if body is set


  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  } // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
  // fetch does not allow to set `content-length` header, but we can set body to an empty string


  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  } // Only return body/request keys if present


  return Object.assign({
    method,
    url,
    headers
  }, typeof body !== "undefined" ? {
    body
  } : null, options.request ? {
    request: options.request
  } : null);
}

function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  });
}

const VERSION = "6.0.11";

const userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`; // DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.

const DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: "",
    previews: []
  }
};

const endpoint = withDefaults(null, DEFAULTS);

exports.endpoint = endpoint;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 558:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

exports.isPlainObject = isPlainObject;


/***/ }),

/***/ 8467:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var request = __nccwpck_require__(6234);
var universalUserAgent = __nccwpck_require__(5030);

const VERSION = "4.6.0";

class GraphqlError extends Error {
  constructor(request, response) {
    const message = response.data.errors[0].message;
    super(message);
    Object.assign(this, response.data);
    Object.assign(this, {
      headers: response.headers
    });
    this.name = "GraphqlError";
    this.request = request; // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

}

const NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query", "mediaType"];
const GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request, query, options) {
  if (typeof query === "string" && options && "query" in options) {
    return Promise.reject(new Error(`[@octokit/graphql] "query" cannot be used as variable name`));
  }

  const parsedOptions = typeof query === "string" ? Object.assign({
    query
  }, options) : query;
  const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = parsedOptions[key];
      return result;
    }

    if (!result.variables) {
      result.variables = {};
    }

    result.variables[key] = parsedOptions[key];
    return result;
  }, {}); // workaround for GitHub Enterprise baseUrl set with /api/v3 suffix
  // https://github.com/octokit/auth-app.js/issues/111#issuecomment-657610451

  const baseUrl = parsedOptions.baseUrl || request.endpoint.DEFAULTS.baseUrl;

  if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
    requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
  }

  return request(requestOptions).then(response => {
    if (response.data.errors) {
      const headers = {};

      for (const key of Object.keys(response.headers)) {
        headers[key] = response.headers[key];
      }

      throw new GraphqlError(requestOptions, {
        headers,
        data: response.data
      });
    }

    return response.data.data;
  });
}

function withDefaults(request$1, newDefaults) {
  const newRequest = request$1.defaults(newDefaults);

  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };

  return Object.assign(newApi, {
    defaults: withDefaults.bind(null, newRequest),
    endpoint: request.request.endpoint
  });
}

const graphql$1 = withDefaults(request.request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}

exports.graphql = graphql$1;
exports.withCustomRequest = withCustomRequest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 4193:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

const VERSION = "2.10.0";

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint.
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not.
 *
 * We check if a "total_count" key is present in the response data, but also make sure that
 * a "url" property is not, as the "Get the combined status for a specific ref" endpoint would
 * otherwise match: https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
 */
function normalizePaginatedListResponse(response) {
  const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
  if (!responseNeedsNormalization) return response; // keep the additional properties intact as there is currently no other way
  // to retrieve the same information.

  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;

  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }

  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }

  response.data.total_count = totalCount;
  return response;
}

function iterator(octokit, route, parameters) {
  const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
  const requestMethod = typeof route === "function" ? route : octokit.request;
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (!url) return {
          done: true
        };
        const response = await requestMethod({
          method,
          url,
          headers
        });
        const normalizedResponse = normalizePaginatedListResponse(response); // `response.headers.link` format:
        // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
        // sets `url` to undefined if "next" URL is not present or `link` header is not set

        url = ((normalizedResponse.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
        return {
          value: normalizedResponse
        };
      }

    })
  };
}

function paginate(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = undefined;
  }

  return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}

function gather(octokit, results, iterator, mapFn) {
  return iterator.next().then(result => {
    if (result.done) {
      return results;
    }

    let earlyExit = false;

    function done() {
      earlyExit = true;
    }

    results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);

    if (earlyExit) {
      return results;
    }

    return gather(octokit, results, iterator, mapFn);
  });
}

const composePaginateRest = Object.assign(paginate, {
  iterator
});

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */

function paginateRest(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
}
paginateRest.VERSION = VERSION;

exports.composePaginateRest = composePaginateRest;
exports.paginateRest = paginateRest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 3044:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

const Endpoints = {
  actions: {
    addSelectedRepoToOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
    cancelWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
    createOrUpdateRepoSecret: ["PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    createRegistrationTokenForOrg: ["POST /orgs/{org}/actions/runners/registration-token"],
    createRegistrationTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/registration-token"],
    createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
    createRemoveTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/remove-token"],
    createWorkflowDispatch: ["POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"],
    deleteArtifact: ["DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
    deleteRepoSecret: ["DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    deleteSelfHostedRunnerFromOrg: ["DELETE /orgs/{org}/actions/runners/{runner_id}"],
    deleteSelfHostedRunnerFromRepo: ["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"],
    deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
    deleteWorkflowRunLogs: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
    disableSelectedRepositoryGithubActionsOrganization: ["DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"],
    disableWorkflow: ["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"],
    downloadArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"],
    downloadJobLogsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"],
    downloadWorkflowRunLogs: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
    enableSelectedRepositoryGithubActionsOrganization: ["PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"],
    enableWorkflow: ["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"],
    getAllowedActionsOrganization: ["GET /orgs/{org}/actions/permissions/selected-actions"],
    getAllowedActionsRepository: ["GET /repos/{owner}/{repo}/actions/permissions/selected-actions"],
    getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    getGithubActionsPermissionsOrganization: ["GET /orgs/{org}/actions/permissions"],
    getGithubActionsPermissionsRepository: ["GET /repos/{owner}/{repo}/actions/permissions"],
    getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
    getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
    getRepoPermissions: ["GET /repos/{owner}/{repo}/actions/permissions", {}, {
      renamed: ["actions", "getGithubActionsPermissionsRepository"]
    }],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
    getSelfHostedRunnerForRepo: ["GET /repos/{owner}/{repo}/actions/runners/{runner_id}"],
    getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
    getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
    getWorkflowRunUsage: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"],
    getWorkflowUsage: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"],
    listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
    listJobsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"],
    listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
    listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
    listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
    listRunnerApplicationsForRepo: ["GET /repos/{owner}/{repo}/actions/runners/downloads"],
    listSelectedReposForOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}/repositories"],
    listSelectedRepositoriesEnabledGithubActionsOrganization: ["GET /orgs/{org}/actions/permissions/repositories"],
    listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
    listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
    listWorkflowRunArtifacts: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"],
    listWorkflowRuns: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"],
    listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
    reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
    removeSelectedRepoFromOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
    setAllowedActionsOrganization: ["PUT /orgs/{org}/actions/permissions/selected-actions"],
    setAllowedActionsRepository: ["PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"],
    setGithubActionsPermissionsOrganization: ["PUT /orgs/{org}/actions/permissions"],
    setGithubActionsPermissionsRepository: ["PUT /repos/{owner}/{repo}/actions/permissions"],
    setSelectedReposForOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"],
    setSelectedRepositoriesEnabledGithubActionsOrganization: ["PUT /orgs/{org}/actions/permissions/repositories"]
  },
  activity: {
    checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
    deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
    deleteThreadSubscription: ["DELETE /notifications/threads/{thread_id}/subscription"],
    getFeeds: ["GET /feeds"],
    getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
    getThread: ["GET /notifications/threads/{thread_id}"],
    getThreadSubscriptionForAuthenticatedUser: ["GET /notifications/threads/{thread_id}/subscription"],
    listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
    listNotificationsForAuthenticatedUser: ["GET /notifications"],
    listOrgEventsForAuthenticatedUser: ["GET /users/{username}/events/orgs/{org}"],
    listPublicEvents: ["GET /events"],
    listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
    listPublicEventsForUser: ["GET /users/{username}/events/public"],
    listPublicOrgEvents: ["GET /orgs/{org}/events"],
    listReceivedEventsForUser: ["GET /users/{username}/received_events"],
    listReceivedPublicEventsForUser: ["GET /users/{username}/received_events/public"],
    listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
    listRepoNotificationsForAuthenticatedUser: ["GET /repos/{owner}/{repo}/notifications"],
    listReposStarredByAuthenticatedUser: ["GET /user/starred"],
    listReposStarredByUser: ["GET /users/{username}/starred"],
    listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
    listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
    listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
    listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
    markNotificationsAsRead: ["PUT /notifications"],
    markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
    markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
    setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
    setThreadSubscription: ["PUT /notifications/threads/{thread_id}/subscription"],
    starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
    unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
  },
  apps: {
    addRepoToInstallation: ["PUT /user/installations/{installation_id}/repositories/{repository_id}"],
    checkToken: ["POST /applications/{client_id}/token"],
    createContentAttachment: ["POST /content_references/{content_reference_id}/attachments", {
      mediaType: {
        previews: ["corsair"]
      }
    }],
    createFromManifest: ["POST /app-manifests/{code}/conversions"],
    createInstallationAccessToken: ["POST /app/installations/{installation_id}/access_tokens"],
    deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
    deleteInstallation: ["DELETE /app/installations/{installation_id}"],
    deleteToken: ["DELETE /applications/{client_id}/token"],
    getAuthenticated: ["GET /app"],
    getBySlug: ["GET /apps/{app_slug}"],
    getInstallation: ["GET /app/installations/{installation_id}"],
    getOrgInstallation: ["GET /orgs/{org}/installation"],
    getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
    getSubscriptionPlanForAccount: ["GET /marketplace_listing/accounts/{account_id}"],
    getSubscriptionPlanForAccountStubbed: ["GET /marketplace_listing/stubbed/accounts/{account_id}"],
    getUserInstallation: ["GET /users/{username}/installation"],
    getWebhookConfigForApp: ["GET /app/hook/config"],
    listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
    listAccountsForPlanStubbed: ["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"],
    listInstallationReposForAuthenticatedUser: ["GET /user/installations/{installation_id}/repositories"],
    listInstallations: ["GET /app/installations"],
    listInstallationsForAuthenticatedUser: ["GET /user/installations"],
    listPlans: ["GET /marketplace_listing/plans"],
    listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
    listReposAccessibleToInstallation: ["GET /installation/repositories"],
    listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
    listSubscriptionsForAuthenticatedUserStubbed: ["GET /user/marketplace_purchases/stubbed"],
    removeRepoFromInstallation: ["DELETE /user/installations/{installation_id}/repositories/{repository_id}"],
    resetToken: ["PATCH /applications/{client_id}/token"],
    revokeInstallationAccessToken: ["DELETE /installation/token"],
    scopeToken: ["POST /applications/{client_id}/token/scoped"],
    suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
    unsuspendInstallation: ["DELETE /app/installations/{installation_id}/suspended"],
    updateWebhookConfigForApp: ["PATCH /app/hook/config"]
  },
  billing: {
    getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
    getGithubActionsBillingUser: ["GET /users/{username}/settings/billing/actions"],
    getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
    getGithubPackagesBillingUser: ["GET /users/{username}/settings/billing/packages"],
    getSharedStorageBillingOrg: ["GET /orgs/{org}/settings/billing/shared-storage"],
    getSharedStorageBillingUser: ["GET /users/{username}/settings/billing/shared-storage"]
  },
  checks: {
    create: ["POST /repos/{owner}/{repo}/check-runs"],
    createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
    get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
    getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
    listAnnotations: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"],
    listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
    listForSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"],
    listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
    rerequestSuite: ["POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"],
    setSuitesPreferences: ["PATCH /repos/{owner}/{repo}/check-suites/preferences"],
    update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
  },
  codeScanning: {
    deleteAnalysis: ["DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"],
    getAlert: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}", {}, {
      renamedParameters: {
        alert_id: "alert_number"
      }
    }],
    getAnalysis: ["GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"],
    getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    listAlertsInstances: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"],
    listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
    updateAlert: ["PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"],
    uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
  },
  codesOfConduct: {
    getAllCodesOfConduct: ["GET /codes_of_conduct", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }],
    getConductCode: ["GET /codes_of_conduct/{key}", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }],
    getForRepo: ["GET /repos/{owner}/{repo}/community/code_of_conduct", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }]
  },
  emojis: {
    get: ["GET /emojis"]
  },
  enterpriseAdmin: {
    disableSelectedOrganizationGithubActionsEnterprise: ["DELETE /enterprises/{enterprise}/actions/permissions/organizations/{org_id}"],
    enableSelectedOrganizationGithubActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/organizations/{org_id}"],
    getAllowedActionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions/selected-actions"],
    getGithubActionsPermissionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions"],
    listSelectedOrganizationsEnabledGithubActionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions/organizations"],
    setAllowedActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/selected-actions"],
    setGithubActionsPermissionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions"],
    setSelectedOrganizationsEnabledGithubActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/organizations"]
  },
  gists: {
    checkIsStarred: ["GET /gists/{gist_id}/star"],
    create: ["POST /gists"],
    createComment: ["POST /gists/{gist_id}/comments"],
    delete: ["DELETE /gists/{gist_id}"],
    deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
    fork: ["POST /gists/{gist_id}/forks"],
    get: ["GET /gists/{gist_id}"],
    getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
    getRevision: ["GET /gists/{gist_id}/{sha}"],
    list: ["GET /gists"],
    listComments: ["GET /gists/{gist_id}/comments"],
    listCommits: ["GET /gists/{gist_id}/commits"],
    listForUser: ["GET /users/{username}/gists"],
    listForks: ["GET /gists/{gist_id}/forks"],
    listPublic: ["GET /gists/public"],
    listStarred: ["GET /gists/starred"],
    star: ["PUT /gists/{gist_id}/star"],
    unstar: ["DELETE /gists/{gist_id}/star"],
    update: ["PATCH /gists/{gist_id}"],
    updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
  },
  git: {
    createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
    createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
    createRef: ["POST /repos/{owner}/{repo}/git/refs"],
    createTag: ["POST /repos/{owner}/{repo}/git/tags"],
    createTree: ["POST /repos/{owner}/{repo}/git/trees"],
    deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
    getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
    getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
    getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
    getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
    getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
    listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
    updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
  },
  gitignore: {
    getAllTemplates: ["GET /gitignore/templates"],
    getTemplate: ["GET /gitignore/templates/{name}"]
  },
  interactions: {
    getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
    getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
    getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
    getRestrictionsForYourPublicRepos: ["GET /user/interaction-limits", {}, {
      renamed: ["interactions", "getRestrictionsForAuthenticatedUser"]
    }],
    removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
    removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
    removeRestrictionsForRepo: ["DELETE /repos/{owner}/{repo}/interaction-limits"],
    removeRestrictionsForYourPublicRepos: ["DELETE /user/interaction-limits", {}, {
      renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"]
    }],
    setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
    setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
    setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
    setRestrictionsForYourPublicRepos: ["PUT /user/interaction-limits", {}, {
      renamed: ["interactions", "setRestrictionsForAuthenticatedUser"]
    }]
  },
  issues: {
    addAssignees: ["POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
    create: ["POST /repos/{owner}/{repo}/issues"],
    createComment: ["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    createLabel: ["POST /repos/{owner}/{repo}/labels"],
    createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
    deleteComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
    deleteMilestone: ["DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"],
    get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
    getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
    getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
    getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
    list: ["GET /issues"],
    listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
    listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
    listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
    listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
    listEventsForTimeline: ["GET /repos/{owner}/{repo}/issues/{issue_number}/timeline", {
      mediaType: {
        previews: ["mockingbird"]
      }
    }],
    listForAuthenticatedUser: ["GET /user/issues"],
    listForOrg: ["GET /orgs/{org}/issues"],
    listForRepo: ["GET /repos/{owner}/{repo}/issues"],
    listLabelsForMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"],
    listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
    listLabelsOnIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
    lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    removeAllLabels: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    removeAssignees: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    removeLabel: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"],
    setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
    updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
    updateMilestone: ["PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"]
  },
  licenses: {
    get: ["GET /licenses/{license}"],
    getAllCommonlyUsed: ["GET /licenses"],
    getForRepo: ["GET /repos/{owner}/{repo}/license"]
  },
  markdown: {
    render: ["POST /markdown"],
    renderRaw: ["POST /markdown/raw", {
      headers: {
        "content-type": "text/plain; charset=utf-8"
      }
    }]
  },
  meta: {
    get: ["GET /meta"],
    getOctocat: ["GET /octocat"],
    getZen: ["GET /zen"],
    root: ["GET /"]
  },
  migrations: {
    cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
    deleteArchiveForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    deleteArchiveForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    downloadArchiveForOrg: ["GET /orgs/{org}/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getArchiveForAuthenticatedUser: ["GET /user/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
    getImportStatus: ["GET /repos/{owner}/{repo}/import"],
    getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
    getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listForAuthenticatedUser: ["GET /user/migrations", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listForOrg: ["GET /orgs/{org}/migrations", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listReposForUser: ["GET /user/migrations/{migration_id}/repositories", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
    setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
    startForAuthenticatedUser: ["POST /user/migrations"],
    startForOrg: ["POST /orgs/{org}/migrations"],
    startImport: ["PUT /repos/{owner}/{repo}/import"],
    unlockRepoForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    unlockRepoForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    updateImport: ["PATCH /repos/{owner}/{repo}/import"]
  },
  orgs: {
    blockUser: ["PUT /orgs/{org}/blocks/{username}"],
    cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
    checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
    checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
    checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
    convertMemberToOutsideCollaborator: ["PUT /orgs/{org}/outside_collaborators/{username}"],
    createInvitation: ["POST /orgs/{org}/invitations"],
    createWebhook: ["POST /orgs/{org}/hooks"],
    deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
    get: ["GET /orgs/{org}"],
    getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
    getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
    getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
    getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
    list: ["GET /organizations"],
    listAppInstallations: ["GET /orgs/{org}/installations"],
    listBlockedUsers: ["GET /orgs/{org}/blocks"],
    listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
    listForAuthenticatedUser: ["GET /user/orgs"],
    listForUser: ["GET /users/{username}/orgs"],
    listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
    listMembers: ["GET /orgs/{org}/members"],
    listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
    listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
    listPendingInvitations: ["GET /orgs/{org}/invitations"],
    listPublicMembers: ["GET /orgs/{org}/public_members"],
    listWebhooks: ["GET /orgs/{org}/hooks"],
    pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
    removeMember: ["DELETE /orgs/{org}/members/{username}"],
    removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
    removeOutsideCollaborator: ["DELETE /orgs/{org}/outside_collaborators/{username}"],
    removePublicMembershipForAuthenticatedUser: ["DELETE /orgs/{org}/public_members/{username}"],
    setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
    setPublicMembershipForAuthenticatedUser: ["PUT /orgs/{org}/public_members/{username}"],
    unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
    update: ["PATCH /orgs/{org}"],
    updateMembershipForAuthenticatedUser: ["PATCH /user/memberships/orgs/{org}"],
    updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
  },
  packages: {
    deletePackageForAuthenticatedUser: ["DELETE /user/packages/{package_type}/{package_name}"],
    deletePackageForOrg: ["DELETE /orgs/{org}/packages/{package_type}/{package_name}"],
    deletePackageVersionForAuthenticatedUser: ["DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    deletePackageVersionForOrg: ["DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    getAllPackageVersionsForAPackageOwnedByAnOrg: ["GET /orgs/{org}/packages/{package_type}/{package_name}/versions"],
    getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}/versions"],
    getAllPackageVersionsForPackageOwnedByUser: ["GET /users/{username}/packages/{package_type}/{package_name}/versions"],
    getPackageForAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}"],
    getPackageForOrganization: ["GET /orgs/{org}/packages/{package_type}/{package_name}"],
    getPackageForUser: ["GET /users/{username}/packages/{package_type}/{package_name}"],
    getPackageVersionForAuthenticatedUser: ["GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    getPackageVersionForOrganization: ["GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    getPackageVersionForUser: ["GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"],
    restorePackageForAuthenticatedUser: ["POST /user/packages/{package_type}/{package_name}/restore"],
    restorePackageForOrg: ["POST /orgs/{org}/packages/{package_type}/{package_name}/restore"],
    restorePackageVersionForAuthenticatedUser: ["POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"],
    restorePackageVersionForOrg: ["POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"]
  },
  projects: {
    addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createCard: ["POST /projects/columns/{column_id}/cards", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createColumn: ["POST /projects/{project_id}/columns", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForAuthenticatedUser: ["POST /user/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForOrg: ["POST /orgs/{org}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForRepo: ["POST /repos/{owner}/{repo}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    delete: ["DELETE /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    deleteCard: ["DELETE /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    deleteColumn: ["DELETE /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    get: ["GET /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getCard: ["GET /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getColumn: ["GET /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getPermissionForUser: ["GET /projects/{project_id}/collaborators/{username}/permission", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listCards: ["GET /projects/columns/{column_id}/cards", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listCollaborators: ["GET /projects/{project_id}/collaborators", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listColumns: ["GET /projects/{project_id}/columns", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForOrg: ["GET /orgs/{org}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForRepo: ["GET /repos/{owner}/{repo}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForUser: ["GET /users/{username}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    moveCard: ["POST /projects/columns/cards/{card_id}/moves", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    moveColumn: ["POST /projects/columns/{column_id}/moves", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    removeCollaborator: ["DELETE /projects/{project_id}/collaborators/{username}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    update: ["PATCH /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    updateCard: ["PATCH /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    updateColumn: ["PATCH /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }]
  },
  pulls: {
    checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    create: ["POST /repos/{owner}/{repo}/pulls"],
    createReplyForReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"],
    createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    createReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    deletePendingReview: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    deleteReviewComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    dismissReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"],
    get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
    getReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    list: ["GET /repos/{owner}/{repo}/pulls"],
    listCommentsForReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"],
    listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
    listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
    listRequestedReviewers: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    listReviewComments: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
    listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    removeRequestedReviewers: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    requestReviewers: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    submitReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"],
    update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
    updateBranch: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch", {
      mediaType: {
        previews: ["lydian"]
      }
    }],
    updateReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    updateReviewComment: ["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]
  },
  rateLimit: {
    get: ["GET /rate_limit"]
  },
  reactions: {
    createForCommitComment: ["POST /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForIssue: ["POST /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForIssueComment: ["POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForPullRequestReviewComment: ["POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForTeamDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForTeamDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForIssue: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForIssueComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForPullRequestComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForTeamDiscussion: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForTeamDiscussionComment: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteLegacy: ["DELETE /reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }, {
      deprecated: "octokit.reactions.deleteLegacy() is deprecated, see https://docs.github.com/v3/reactions/#delete-a-reaction-legacy"
    }],
    listForCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForIssueComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForPullRequestReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForTeamDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForTeamDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }]
  },
  repos: {
    acceptInvitation: ["PATCH /user/repository_invitations/{invitation_id}"],
    addAppAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
    addStatusCheckContexts: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    addTeamAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    addUserAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
    checkVulnerabilityAlerts: ["GET /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
    createCommitComment: ["POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    createCommitSignatureProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
    createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
    createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
    createDeploymentStatus: ["POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
    createForAuthenticatedUser: ["POST /user/repos"],
    createFork: ["POST /repos/{owner}/{repo}/forks"],
    createInOrg: ["POST /orgs/{org}/repos"],
    createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
    createPagesSite: ["POST /repos/{owner}/{repo}/pages", {
      mediaType: {
        previews: ["switcheroo"]
      }
    }],
    createRelease: ["POST /repos/{owner}/{repo}/releases"],
    createUsingTemplate: ["POST /repos/{template_owner}/{template_repo}/generate", {
      mediaType: {
        previews: ["baptiste"]
      }
    }],
    createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
    declineInvitation: ["DELETE /user/repository_invitations/{invitation_id}"],
    delete: ["DELETE /repos/{owner}/{repo}"],
    deleteAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
    deleteAdminBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    deleteBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection"],
    deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
    deleteCommitSignatureProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
    deleteDeployment: ["DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"],
    deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
    deleteInvitation: ["DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"],
    deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages", {
      mediaType: {
        previews: ["switcheroo"]
      }
    }],
    deletePullRequestReviewProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
    deleteReleaseAsset: ["DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
    disableAutomatedSecurityFixes: ["DELETE /repos/{owner}/{repo}/automated-security-fixes", {
      mediaType: {
        previews: ["london"]
      }
    }],
    disableVulnerabilityAlerts: ["DELETE /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    downloadArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}", {}, {
      renamed: ["repos", "downloadZipballArchive"]
    }],
    downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
    downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
    enableAutomatedSecurityFixes: ["PUT /repos/{owner}/{repo}/automated-security-fixes", {
      mediaType: {
        previews: ["london"]
      }
    }],
    enableVulnerabilityAlerts: ["PUT /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    get: ["GET /repos/{owner}/{repo}"],
    getAccessRestrictions: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
    getAdminBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    getAllStatusCheckContexts: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"],
    getAllTopics: ["GET /repos/{owner}/{repo}/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    getAppsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"],
    getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
    getBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection"],
    getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
    getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
    getCollaboratorPermissionLevel: ["GET /repos/{owner}/{repo}/collaborators/{username}/permission"],
    getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
    getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
    getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
    getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
    getCommitSignatureProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
    getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
    getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
    getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
    getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
    getDeploymentStatus: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"],
    getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
    getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
    getPages: ["GET /repos/{owner}/{repo}/pages"],
    getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
    getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
    getPullRequestReviewProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
    getReadme: ["GET /repos/{owner}/{repo}/readme"],
    getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
    getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
    getStatusChecksProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    getTeamsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"],
    getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
    getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
    getUsersWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"],
    getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
    getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
    getWebhookConfigForRepo: ["GET /repos/{owner}/{repo}/hooks/{hook_id}/config"],
    listBranches: ["GET /repos/{owner}/{repo}/branches"],
    listBranchesForHeadCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head", {
      mediaType: {
        previews: ["groot"]
      }
    }],
    listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
    listCommentsForCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
    listCommitStatusesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/statuses"],
    listCommits: ["GET /repos/{owner}/{repo}/commits"],
    listContributors: ["GET /repos/{owner}/{repo}/contributors"],
    listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
    listDeploymentStatuses: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
    listForAuthenticatedUser: ["GET /user/repos"],
    listForOrg: ["GET /orgs/{org}/repos"],
    listForUser: ["GET /users/{username}/repos"],
    listForks: ["GET /repos/{owner}/{repo}/forks"],
    listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
    listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
    listLanguages: ["GET /repos/{owner}/{repo}/languages"],
    listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
    listPublic: ["GET /repositories"],
    listPullRequestsAssociatedWithCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls", {
      mediaType: {
        previews: ["groot"]
      }
    }],
    listReleaseAssets: ["GET /repos/{owner}/{repo}/releases/{release_id}/assets"],
    listReleases: ["GET /repos/{owner}/{repo}/releases"],
    listTags: ["GET /repos/{owner}/{repo}/tags"],
    listTeams: ["GET /repos/{owner}/{repo}/teams"],
    listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
    merge: ["POST /repos/{owner}/{repo}/merges"],
    pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
    removeAppAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    removeCollaborator: ["DELETE /repos/{owner}/{repo}/collaborators/{username}"],
    removeStatusCheckContexts: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    removeStatusCheckProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    removeTeamAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    removeUserAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
    replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
    setAdminBranchProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    setAppAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    setStatusCheckContexts: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    setTeamAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    setUserAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
    transfer: ["POST /repos/{owner}/{repo}/transfer"],
    update: ["PATCH /repos/{owner}/{repo}"],
    updateBranchProtection: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection"],
    updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
    updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
    updateInvitation: ["PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"],
    updatePullRequestReviewProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
    updateReleaseAsset: ["PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    updateStatusCheckPotection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks", {}, {
      renamed: ["repos", "updateStatusCheckProtection"]
    }],
    updateStatusCheckProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
    updateWebhookConfigForRepo: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"],
    uploadReleaseAsset: ["POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}", {
      baseUrl: "https://uploads.github.com"
    }]
  },
  search: {
    code: ["GET /search/code"],
    commits: ["GET /search/commits", {
      mediaType: {
        previews: ["cloak"]
      }
    }],
    issuesAndPullRequests: ["GET /search/issues"],
    labels: ["GET /search/labels"],
    repos: ["GET /search/repositories"],
    topics: ["GET /search/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    users: ["GET /search/users"]
  },
  secretScanning: {
    getAlert: ["GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
    updateAlert: ["PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"]
  },
  teams: {
    addOrUpdateMembershipForUserInOrg: ["PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    addOrUpdateProjectPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    addOrUpdateRepoPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    checkPermissionsForProjectInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    checkPermissionsForRepoInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    create: ["POST /orgs/{org}/teams"],
    createDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
    createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
    deleteDiscussionCommentInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    deleteDiscussionInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
    getByName: ["GET /orgs/{org}/teams/{team_slug}"],
    getDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    getDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    getMembershipForUserInOrg: ["GET /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    list: ["GET /orgs/{org}/teams"],
    listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
    listDiscussionCommentsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
    listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
    listForAuthenticatedUser: ["GET /user/teams"],
    listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
    listPendingInvitationsInOrg: ["GET /orgs/{org}/teams/{team_slug}/invitations"],
    listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
    removeMembershipForUserInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    removeProjectInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"],
    removeRepoInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    updateDiscussionCommentInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    updateDiscussionInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
  },
  users: {
    addEmailForAuthenticated: ["POST /user/emails"],
    block: ["PUT /user/blocks/{username}"],
    checkBlocked: ["GET /user/blocks/{username}"],
    checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
    checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
    createGpgKeyForAuthenticated: ["POST /user/gpg_keys"],
    createPublicSshKeyForAuthenticated: ["POST /user/keys"],
    deleteEmailForAuthenticated: ["DELETE /user/emails"],
    deleteGpgKeyForAuthenticated: ["DELETE /user/gpg_keys/{gpg_key_id}"],
    deletePublicSshKeyForAuthenticated: ["DELETE /user/keys/{key_id}"],
    follow: ["PUT /user/following/{username}"],
    getAuthenticated: ["GET /user"],
    getByUsername: ["GET /users/{username}"],
    getContextForUser: ["GET /users/{username}/hovercard"],
    getGpgKeyForAuthenticated: ["GET /user/gpg_keys/{gpg_key_id}"],
    getPublicSshKeyForAuthenticated: ["GET /user/keys/{key_id}"],
    list: ["GET /users"],
    listBlockedByAuthenticated: ["GET /user/blocks"],
    listEmailsForAuthenticated: ["GET /user/emails"],
    listFollowedByAuthenticated: ["GET /user/following"],
    listFollowersForAuthenticatedUser: ["GET /user/followers"],
    listFollowersForUser: ["GET /users/{username}/followers"],
    listFollowingForUser: ["GET /users/{username}/following"],
    listGpgKeysForAuthenticated: ["GET /user/gpg_keys"],
    listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
    listPublicEmailsForAuthenticated: ["GET /user/public_emails"],
    listPublicKeysForUser: ["GET /users/{username}/keys"],
    listPublicSshKeysForAuthenticated: ["GET /user/keys"],
    setPrimaryEmailVisibilityForAuthenticated: ["PATCH /user/email/visibility"],
    unblock: ["DELETE /user/blocks/{username}"],
    unfollow: ["DELETE /user/following/{username}"],
    updateAuthenticated: ["PATCH /user"]
  }
};

const VERSION = "4.12.0";

function endpointsToMethods(octokit, endpointsMap) {
  const newMethods = {};

  for (const [scope, endpoints] of Object.entries(endpointsMap)) {
    for (const [methodName, endpoint] of Object.entries(endpoints)) {
      const [route, defaults, decorations] = endpoint;
      const [method, url] = route.split(/ /);
      const endpointDefaults = Object.assign({
        method,
        url
      }, defaults);

      if (!newMethods[scope]) {
        newMethods[scope] = {};
      }

      const scopeMethods = newMethods[scope];

      if (decorations) {
        scopeMethods[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
        continue;
      }

      scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
    }
  }

  return newMethods;
}

function decorate(octokit, scope, methodName, defaults, decorations) {
  const requestWithDefaults = octokit.request.defaults(defaults);
  /* istanbul ignore next */

  function withDecorations(...args) {
    // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
    let options = requestWithDefaults.endpoint.merge(...args); // There are currently no other decorations than `.mapToData`

    if (decorations.mapToData) {
      options = Object.assign({}, options, {
        data: options[decorations.mapToData],
        [decorations.mapToData]: undefined
      });
      return requestWithDefaults(options);
    }

    if (decorations.renamed) {
      const [newScope, newMethodName] = decorations.renamed;
      octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
    }

    if (decorations.deprecated) {
      octokit.log.warn(decorations.deprecated);
    }

    if (decorations.renamedParameters) {
      // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
      const options = requestWithDefaults.endpoint.merge(...args);

      for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
        if (name in options) {
          octokit.log.warn(`"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`);

          if (!(alias in options)) {
            options[alias] = options[name];
          }

          delete options[name];
        }
      }

      return requestWithDefaults(options);
    } // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488


    return requestWithDefaults(...args);
  }

  return Object.assign(withDecorations, requestWithDefaults);
}

function restEndpointMethods(octokit) {
  return endpointsToMethods(octokit, Endpoints);
}
restEndpointMethods.VERSION = VERSION;

exports.restEndpointMethods = restEndpointMethods;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 537:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = __nccwpck_require__(8932);
var once = _interopDefault(__nccwpck_require__(1223));

const logOnce = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    this.headers = options.headers || {}; // redact request credentials without mutating original request options

    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }

}

exports.RequestError = RequestError;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 6234:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var endpoint = __nccwpck_require__(9440);
var universalUserAgent = __nccwpck_require__(5030);
var isPlainObject = __nccwpck_require__(9062);
var nodeFetch = _interopDefault(__nccwpck_require__(467));
var requestError = __nccwpck_require__(537);

const VERSION = "5.4.14";

function getBufferResponse(response) {
  return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
  if (isPlainObject.isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  let headers = {};
  let status;
  let url;
  const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
  return fetch(requestOptions.url, Object.assign({
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    redirect: requestOptions.redirect
  }, requestOptions.request)).then(response => {
    url = response.url;
    status = response.status;

    for (const keyAndValue of response.headers) {
      headers[keyAndValue[0]] = keyAndValue[1];
    }

    if (status === 204 || status === 205) {
      return;
    } // GitHub API returns 200 for HEAD requests


    if (requestOptions.method === "HEAD") {
      if (status < 400) {
        return;
      }

      throw new requestError.RequestError(response.statusText, status, {
        headers,
        request: requestOptions
      });
    }

    if (status === 304) {
      throw new requestError.RequestError("Not modified", status, {
        headers,
        request: requestOptions
      });
    }

    if (status >= 400) {
      return response.text().then(message => {
        const error = new requestError.RequestError(message, status, {
          headers,
          request: requestOptions
        });

        try {
          let responseBody = JSON.parse(error.message);
          Object.assign(error, responseBody);
          let errors = responseBody.errors; // Assumption `errors` would always be in Array format

          error.message = error.message + ": " + errors.map(JSON.stringify).join(", ");
        } catch (e) {// ignore, see octokit/rest.js#684
        }

        throw error;
      });
    }

    const contentType = response.headers.get("content-type");

    if (/application\/json/.test(contentType)) {
      return response.json();
    }

    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
      return response.text();
    }

    return getBufferResponse(response);
  }).then(data => {
    return {
      status,
      url,
      headers,
      data
    };
  }).catch(error => {
    if (error instanceof requestError.RequestError) {
      throw error;
    }

    throw new requestError.RequestError(error.message, 500, {
      headers,
      request: requestOptions
    });
  });
}

function withDefaults(oldEndpoint, newDefaults) {
  const endpoint = oldEndpoint.defaults(newDefaults);

  const newApi = function (route, parameters) {
    const endpointOptions = endpoint.merge(route, parameters);

    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint.parse(endpointOptions));
    }

    const request = (route, parameters) => {
      return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
    };

    Object.assign(request, {
      endpoint,
      defaults: withDefaults.bind(null, endpoint)
    });
    return endpointOptions.request.hook(request, endpointOptions);
  };

  return Object.assign(newApi, {
    endpoint,
    defaults: withDefaults.bind(null, endpoint)
  });
}

const request = withDefaults(endpoint.endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  }
});

exports.request = request;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 9062:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

exports.isPlainObject = isPlainObject;


/***/ }),

/***/ 9348:
/***/ ((module) => {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.


module.exports = {

  newInvalidAsn1Error: function (msg) {
    var e = new Error();
    e.name = 'InvalidAsn1Error';
    e.message = msg || '';
    return e;
  }

};


/***/ }),

/***/ 194:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

var errors = __nccwpck_require__(9348);
var types = __nccwpck_require__(2473);

var Reader = __nccwpck_require__(290);
var Writer = __nccwpck_require__(3200);


// --- Exports

module.exports = {

  Reader: Reader,

  Writer: Writer

};

for (var t in types) {
  if (types.hasOwnProperty(t))
    module.exports[t] = types[t];
}
for (var e in errors) {
  if (errors.hasOwnProperty(e))
    module.exports[e] = errors[e];
}


/***/ }),

/***/ 290:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

var assert = __nccwpck_require__(2357);
var Buffer = __nccwpck_require__(5118).Buffer;

var ASN1 = __nccwpck_require__(2473);
var errors = __nccwpck_require__(9348);


// --- Globals

var newInvalidAsn1Error = errors.newInvalidAsn1Error;



// --- API

function Reader(data) {
  if (!data || !Buffer.isBuffer(data))
    throw new TypeError('data must be a node Buffer');

  this._buf = data;
  this._size = data.length;

  // These hold the "current" state
  this._len = 0;
  this._offset = 0;
}

Object.defineProperty(Reader.prototype, 'length', {
  enumerable: true,
  get: function () { return (this._len); }
});

Object.defineProperty(Reader.prototype, 'offset', {
  enumerable: true,
  get: function () { return (this._offset); }
});

Object.defineProperty(Reader.prototype, 'remain', {
  get: function () { return (this._size - this._offset); }
});

Object.defineProperty(Reader.prototype, 'buffer', {
  get: function () { return (this._buf.slice(this._offset)); }
});


/**
 * Reads a single byte and advances offset; you can pass in `true` to make this
 * a "peek" operation (i.e., get the byte, but don't advance the offset).
 *
 * @param {Boolean} peek true means don't move offset.
 * @return {Number} the next byte, null if not enough data.
 */
Reader.prototype.readByte = function (peek) {
  if (this._size - this._offset < 1)
    return null;

  var b = this._buf[this._offset] & 0xff;

  if (!peek)
    this._offset += 1;

  return b;
};


Reader.prototype.peek = function () {
  return this.readByte(true);
};


/**
 * Reads a (potentially) variable length off the BER buffer.  This call is
 * not really meant to be called directly, as callers have to manipulate
 * the internal buffer afterwards.
 *
 * As a result of this call, you can call `Reader.length`, until the
 * next thing called that does a readLength.
 *
 * @return {Number} the amount of offset to advance the buffer.
 * @throws {InvalidAsn1Error} on bad ASN.1
 */
Reader.prototype.readLength = function (offset) {
  if (offset === undefined)
    offset = this._offset;

  if (offset >= this._size)
    return null;

  var lenB = this._buf[offset++] & 0xff;
  if (lenB === null)
    return null;

  if ((lenB & 0x80) === 0x80) {
    lenB &= 0x7f;

    if (lenB === 0)
      throw newInvalidAsn1Error('Indefinite length not supported');

    if (lenB > 4)
      throw newInvalidAsn1Error('encoding too long');

    if (this._size - offset < lenB)
      return null;

    this._len = 0;
    for (var i = 0; i < lenB; i++)
      this._len = (this._len << 8) + (this._buf[offset++] & 0xff);

  } else {
    // Wasn't a variable length
    this._len = lenB;
  }

  return offset;
};


/**
 * Parses the next sequence in this BER buffer.
 *
 * To get the length of the sequence, call `Reader.length`.
 *
 * @return {Number} the sequence's tag.
 */
Reader.prototype.readSequence = function (tag) {
  var seq = this.peek();
  if (seq === null)
    return null;
  if (tag !== undefined && tag !== seq)
    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
                              ': got 0x' + seq.toString(16));

  var o = this.readLength(this._offset + 1); // stored in `length`
  if (o === null)
    return null;

  this._offset = o;
  return seq;
};


Reader.prototype.readInt = function () {
  return this._readTag(ASN1.Integer);
};


Reader.prototype.readBoolean = function () {
  return (this._readTag(ASN1.Boolean) === 0 ? false : true);
};


Reader.prototype.readEnumeration = function () {
  return this._readTag(ASN1.Enumeration);
};


Reader.prototype.readString = function (tag, retbuf) {
  if (!tag)
    tag = ASN1.OctetString;

  var b = this.peek();
  if (b === null)
    return null;

  if (b !== tag)
    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
                              ': got 0x' + b.toString(16));

  var o = this.readLength(this._offset + 1); // stored in `length`

  if (o === null)
    return null;

  if (this.length > this._size - o)
    return null;

  this._offset = o;

  if (this.length === 0)
    return retbuf ? Buffer.alloc(0) : '';

  var str = this._buf.slice(this._offset, this._offset + this.length);
  this._offset += this.length;

  return retbuf ? str : str.toString('utf8');
};

Reader.prototype.readOID = function (tag) {
  if (!tag)
    tag = ASN1.OID;

  var b = this.readString(tag, true);
  if (b === null)
    return null;

  var values = [];
  var value = 0;

  for (var i = 0; i < b.length; i++) {
    var byte = b[i] & 0xff;

    value <<= 7;
    value += byte & 0x7f;
    if ((byte & 0x80) === 0) {
      values.push(value);
      value = 0;
    }
  }

  value = values.shift();
  values.unshift(value % 40);
  values.unshift((value / 40) >> 0);

  return values.join('.');
};


Reader.prototype._readTag = function (tag) {
  assert.ok(tag !== undefined);

  var b = this.peek();

  if (b === null)
    return null;

  if (b !== tag)
    throw newInvalidAsn1Error('Expected 0x' + tag.toString(16) +
                              ': got 0x' + b.toString(16));

  var o = this.readLength(this._offset + 1); // stored in `length`
  if (o === null)
    return null;

  if (this.length > 4)
    throw newInvalidAsn1Error('Integer too long: ' + this.length);

  if (this.length > this._size - o)
    return null;
  this._offset = o;

  var fb = this._buf[this._offset];
  var value = 0;

  for (var i = 0; i < this.length; i++) {
    value <<= 8;
    value |= (this._buf[this._offset++] & 0xff);
  }

  if ((fb & 0x80) === 0x80 && i !== 4)
    value -= (1 << (i * 8));

  return value >> 0;
};



// --- Exported API

module.exports = Reader;


/***/ }),

/***/ 2473:
/***/ ((module) => {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.


module.exports = {
  EOC: 0,
  Boolean: 1,
  Integer: 2,
  BitString: 3,
  OctetString: 4,
  Null: 5,
  OID: 6,
  ObjectDescriptor: 7,
  External: 8,
  Real: 9, // float
  Enumeration: 10,
  PDV: 11,
  Utf8String: 12,
  RelativeOID: 13,
  Sequence: 16,
  Set: 17,
  NumericString: 18,
  PrintableString: 19,
  T61String: 20,
  VideotexString: 21,
  IA5String: 22,
  UTCTime: 23,
  GeneralizedTime: 24,
  GraphicString: 25,
  VisibleString: 26,
  GeneralString: 28,
  UniversalString: 29,
  CharacterString: 30,
  BMPString: 31,
  Constructor: 32,
  Context: 128
};


/***/ }),

/***/ 3200:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

var assert = __nccwpck_require__(2357);
var Buffer = __nccwpck_require__(5118).Buffer;
var ASN1 = __nccwpck_require__(2473);
var errors = __nccwpck_require__(9348);


// --- Globals

var newInvalidAsn1Error = errors.newInvalidAsn1Error;

var DEFAULT_OPTS = {
  size: 1024,
  growthFactor: 8
};


// --- Helpers

function merge(from, to) {
  assert.ok(from);
  assert.equal(typeof (from), 'object');
  assert.ok(to);
  assert.equal(typeof (to), 'object');

  var keys = Object.getOwnPropertyNames(from);
  keys.forEach(function (key) {
    if (to[key])
      return;

    var value = Object.getOwnPropertyDescriptor(from, key);
    Object.defineProperty(to, key, value);
  });

  return to;
}



// --- API

function Writer(options) {
  options = merge(DEFAULT_OPTS, options || {});

  this._buf = Buffer.alloc(options.size || 1024);
  this._size = this._buf.length;
  this._offset = 0;
  this._options = options;

  // A list of offsets in the buffer where we need to insert
  // sequence tag/len pairs.
  this._seq = [];
}

Object.defineProperty(Writer.prototype, 'buffer', {
  get: function () {
    if (this._seq.length)
      throw newInvalidAsn1Error(this._seq.length + ' unended sequence(s)');

    return (this._buf.slice(0, this._offset));
  }
});

Writer.prototype.writeByte = function (b) {
  if (typeof (b) !== 'number')
    throw new TypeError('argument must be a Number');

  this._ensure(1);
  this._buf[this._offset++] = b;
};


Writer.prototype.writeInt = function (i, tag) {
  if (typeof (i) !== 'number')
    throw new TypeError('argument must be a Number');
  if (typeof (tag) !== 'number')
    tag = ASN1.Integer;

  var sz = 4;

  while ((((i & 0xff800000) === 0) || ((i & 0xff800000) === 0xff800000 >> 0)) &&
        (sz > 1)) {
    sz--;
    i <<= 8;
  }

  if (sz > 4)
    throw newInvalidAsn1Error('BER ints cannot be > 0xffffffff');

  this._ensure(2 + sz);
  this._buf[this._offset++] = tag;
  this._buf[this._offset++] = sz;

  while (sz-- > 0) {
    this._buf[this._offset++] = ((i & 0xff000000) >>> 24);
    i <<= 8;
  }

};


Writer.prototype.writeNull = function () {
  this.writeByte(ASN1.Null);
  this.writeByte(0x00);
};


Writer.prototype.writeEnumeration = function (i, tag) {
  if (typeof (i) !== 'number')
    throw new TypeError('argument must be a Number');
  if (typeof (tag) !== 'number')
    tag = ASN1.Enumeration;

  return this.writeInt(i, tag);
};


Writer.prototype.writeBoolean = function (b, tag) {
  if (typeof (b) !== 'boolean')
    throw new TypeError('argument must be a Boolean');
  if (typeof (tag) !== 'number')
    tag = ASN1.Boolean;

  this._ensure(3);
  this._buf[this._offset++] = tag;
  this._buf[this._offset++] = 0x01;
  this._buf[this._offset++] = b ? 0xff : 0x00;
};


Writer.prototype.writeString = function (s, tag) {
  if (typeof (s) !== 'string')
    throw new TypeError('argument must be a string (was: ' + typeof (s) + ')');
  if (typeof (tag) !== 'number')
    tag = ASN1.OctetString;

  var len = Buffer.byteLength(s);
  this.writeByte(tag);
  this.writeLength(len);
  if (len) {
    this._ensure(len);
    this._buf.write(s, this._offset);
    this._offset += len;
  }
};


Writer.prototype.writeBuffer = function (buf, tag) {
  if (typeof (tag) !== 'number')
    throw new TypeError('tag must be a number');
  if (!Buffer.isBuffer(buf))
    throw new TypeError('argument must be a buffer');

  this.writeByte(tag);
  this.writeLength(buf.length);
  this._ensure(buf.length);
  buf.copy(this._buf, this._offset, 0, buf.length);
  this._offset += buf.length;
};


Writer.prototype.writeStringArray = function (strings) {
  if ((!strings instanceof Array))
    throw new TypeError('argument must be an Array[String]');

  var self = this;
  strings.forEach(function (s) {
    self.writeString(s);
  });
};

// This is really to solve DER cases, but whatever for now
Writer.prototype.writeOID = function (s, tag) {
  if (typeof (s) !== 'string')
    throw new TypeError('argument must be a string');
  if (typeof (tag) !== 'number')
    tag = ASN1.OID;

  if (!/^([0-9]+\.){3,}[0-9]+$/.test(s))
    throw new Error('argument is not a valid OID string');

  function encodeOctet(bytes, octet) {
    if (octet < 128) {
        bytes.push(octet);
    } else if (octet < 16384) {
        bytes.push((octet >>> 7) | 0x80);
        bytes.push(octet & 0x7F);
    } else if (octet < 2097152) {
      bytes.push((octet >>> 14) | 0x80);
      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
      bytes.push(octet & 0x7F);
    } else if (octet < 268435456) {
      bytes.push((octet >>> 21) | 0x80);
      bytes.push(((octet >>> 14) | 0x80) & 0xFF);
      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
      bytes.push(octet & 0x7F);
    } else {
      bytes.push(((octet >>> 28) | 0x80) & 0xFF);
      bytes.push(((octet >>> 21) | 0x80) & 0xFF);
      bytes.push(((octet >>> 14) | 0x80) & 0xFF);
      bytes.push(((octet >>> 7) | 0x80) & 0xFF);
      bytes.push(octet & 0x7F);
    }
  }

  var tmp = s.split('.');
  var bytes = [];
  bytes.push(parseInt(tmp[0], 10) * 40 + parseInt(tmp[1], 10));
  tmp.slice(2).forEach(function (b) {
    encodeOctet(bytes, parseInt(b, 10));
  });

  var self = this;
  this._ensure(2 + bytes.length);
  this.writeByte(tag);
  this.writeLength(bytes.length);
  bytes.forEach(function (b) {
    self.writeByte(b);
  });
};


Writer.prototype.writeLength = function (len) {
  if (typeof (len) !== 'number')
    throw new TypeError('argument must be a Number');

  this._ensure(4);

  if (len <= 0x7f) {
    this._buf[this._offset++] = len;
  } else if (len <= 0xff) {
    this._buf[this._offset++] = 0x81;
    this._buf[this._offset++] = len;
  } else if (len <= 0xffff) {
    this._buf[this._offset++] = 0x82;
    this._buf[this._offset++] = len >> 8;
    this._buf[this._offset++] = len;
  } else if (len <= 0xffffff) {
    this._buf[this._offset++] = 0x83;
    this._buf[this._offset++] = len >> 16;
    this._buf[this._offset++] = len >> 8;
    this._buf[this._offset++] = len;
  } else {
    throw newInvalidAsn1Error('Length too long (> 4 bytes)');
  }
};

Writer.prototype.startSequence = function (tag) {
  if (typeof (tag) !== 'number')
    tag = ASN1.Sequence | ASN1.Constructor;

  this.writeByte(tag);
  this._seq.push(this._offset);
  this._ensure(3);
  this._offset += 3;
};


Writer.prototype.endSequence = function () {
  var seq = this._seq.pop();
  var start = seq + 3;
  var len = this._offset - start;

  if (len <= 0x7f) {
    this._shift(start, len, -2);
    this._buf[seq] = len;
  } else if (len <= 0xff) {
    this._shift(start, len, -1);
    this._buf[seq] = 0x81;
    this._buf[seq + 1] = len;
  } else if (len <= 0xffff) {
    this._buf[seq] = 0x82;
    this._buf[seq + 1] = len >> 8;
    this._buf[seq + 2] = len;
  } else if (len <= 0xffffff) {
    this._shift(start, len, 1);
    this._buf[seq] = 0x83;
    this._buf[seq + 1] = len >> 16;
    this._buf[seq + 2] = len >> 8;
    this._buf[seq + 3] = len;
  } else {
    throw newInvalidAsn1Error('Sequence too long');
  }
};


Writer.prototype._shift = function (start, len, shift) {
  assert.ok(start !== undefined);
  assert.ok(len !== undefined);
  assert.ok(shift);

  this._buf.copy(this._buf, start + shift, start, start + len);
  this._offset += shift;
};

Writer.prototype._ensure = function (len) {
  assert.ok(len);

  if (this._size - this._offset < len) {
    var sz = this._size * this._options.growthFactor;
    if (sz - this._offset < len)
      sz += len;

    var buf = Buffer.alloc(sz);

    this._buf.copy(buf, 0, 0, this._offset);
    this._buf = buf;
    this._size = sz;
  }
};



// --- Exported API

module.exports = Writer;


/***/ }),

/***/ 970:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Copyright 2011 Mark Cavage <mcavage@gmail.com> All rights reserved.

// If you have no idea what ASN.1 or BER is, see this:
// ftp://ftp.rsa.com/pub/pkcs/ascii/layman.asc

var Ber = __nccwpck_require__(194);



// --- Exported API

module.exports = {

  Ber: Ber,

  BerReader: Ber.Reader,

  BerWriter: Ber.Writer

};


/***/ }),

/***/ 958:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var crypto_hash_sha512 = __nccwpck_require__(8729).lowlevel.crypto_hash;

/*
 * This file is a 1:1 port from the OpenBSD blowfish.c and bcrypt_pbkdf.c. As a
 * result, it retains the original copyright and license. The two files are
 * under slightly different (but compatible) licenses, and are here combined in
 * one file.
 *
 * Credit for the actual porting work goes to:
 *  Devi Mandiri <me@devi.web.id>
 */

/*
 * The Blowfish portions are under the following license:
 *
 * Blowfish block cipher for OpenBSD
 * Copyright 1997 Niels Provos <provos@physnet.uni-hamburg.de>
 * All rights reserved.
 *
 * Implementation advice by David Mazieres <dm@lcs.mit.edu>.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. The name of the author may not be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * The bcrypt_pbkdf portions are under the following license:
 *
 * Copyright (c) 2013 Ted Unangst <tedu@openbsd.org>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

/*
 * Performance improvements (Javascript-specific):
 *
 * Copyright 2016, Joyent Inc
 * Author: Alex Wilson <alex.wilson@joyent.com>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

// Ported from OpenBSD bcrypt_pbkdf.c v1.9

var BLF_J = 0;

var Blowfish = function() {
  this.S = [
    new Uint32Array([
      0xd1310ba6, 0x98dfb5ac, 0x2ffd72db, 0xd01adfb7,
      0xb8e1afed, 0x6a267e96, 0xba7c9045, 0xf12c7f99,
      0x24a19947, 0xb3916cf7, 0x0801f2e2, 0x858efc16,
      0x636920d8, 0x71574e69, 0xa458fea3, 0xf4933d7e,
      0x0d95748f, 0x728eb658, 0x718bcd58, 0x82154aee,
      0x7b54a41d, 0xc25a59b5, 0x9c30d539, 0x2af26013,
      0xc5d1b023, 0x286085f0, 0xca417918, 0xb8db38ef,
      0x8e79dcb0, 0x603a180e, 0x6c9e0e8b, 0xb01e8a3e,
      0xd71577c1, 0xbd314b27, 0x78af2fda, 0x55605c60,
      0xe65525f3, 0xaa55ab94, 0x57489862, 0x63e81440,
      0x55ca396a, 0x2aab10b6, 0xb4cc5c34, 0x1141e8ce,
      0xa15486af, 0x7c72e993, 0xb3ee1411, 0x636fbc2a,
      0x2ba9c55d, 0x741831f6, 0xce5c3e16, 0x9b87931e,
      0xafd6ba33, 0x6c24cf5c, 0x7a325381, 0x28958677,
      0x3b8f4898, 0x6b4bb9af, 0xc4bfe81b, 0x66282193,
      0x61d809cc, 0xfb21a991, 0x487cac60, 0x5dec8032,
      0xef845d5d, 0xe98575b1, 0xdc262302, 0xeb651b88,
      0x23893e81, 0xd396acc5, 0x0f6d6ff3, 0x83f44239,
      0x2e0b4482, 0xa4842004, 0x69c8f04a, 0x9e1f9b5e,
      0x21c66842, 0xf6e96c9a, 0x670c9c61, 0xabd388f0,
      0x6a51a0d2, 0xd8542f68, 0x960fa728, 0xab5133a3,
      0x6eef0b6c, 0x137a3be4, 0xba3bf050, 0x7efb2a98,
      0xa1f1651d, 0x39af0176, 0x66ca593e, 0x82430e88,
      0x8cee8619, 0x456f9fb4, 0x7d84a5c3, 0x3b8b5ebe,
      0xe06f75d8, 0x85c12073, 0x401a449f, 0x56c16aa6,
      0x4ed3aa62, 0x363f7706, 0x1bfedf72, 0x429b023d,
      0x37d0d724, 0xd00a1248, 0xdb0fead3, 0x49f1c09b,
      0x075372c9, 0x80991b7b, 0x25d479d8, 0xf6e8def7,
      0xe3fe501a, 0xb6794c3b, 0x976ce0bd, 0x04c006ba,
      0xc1a94fb6, 0x409f60c4, 0x5e5c9ec2, 0x196a2463,
      0x68fb6faf, 0x3e6c53b5, 0x1339b2eb, 0x3b52ec6f,
      0x6dfc511f, 0x9b30952c, 0xcc814544, 0xaf5ebd09,
      0xbee3d004, 0xde334afd, 0x660f2807, 0x192e4bb3,
      0xc0cba857, 0x45c8740f, 0xd20b5f39, 0xb9d3fbdb,
      0x5579c0bd, 0x1a60320a, 0xd6a100c6, 0x402c7279,
      0x679f25fe, 0xfb1fa3cc, 0x8ea5e9f8, 0xdb3222f8,
      0x3c7516df, 0xfd616b15, 0x2f501ec8, 0xad0552ab,
      0x323db5fa, 0xfd238760, 0x53317b48, 0x3e00df82,
      0x9e5c57bb, 0xca6f8ca0, 0x1a87562e, 0xdf1769db,
      0xd542a8f6, 0x287effc3, 0xac6732c6, 0x8c4f5573,
      0x695b27b0, 0xbbca58c8, 0xe1ffa35d, 0xb8f011a0,
      0x10fa3d98, 0xfd2183b8, 0x4afcb56c, 0x2dd1d35b,
      0x9a53e479, 0xb6f84565, 0xd28e49bc, 0x4bfb9790,
      0xe1ddf2da, 0xa4cb7e33, 0x62fb1341, 0xcee4c6e8,
      0xef20cada, 0x36774c01, 0xd07e9efe, 0x2bf11fb4,
      0x95dbda4d, 0xae909198, 0xeaad8e71, 0x6b93d5a0,
      0xd08ed1d0, 0xafc725e0, 0x8e3c5b2f, 0x8e7594b7,
      0x8ff6e2fb, 0xf2122b64, 0x8888b812, 0x900df01c,
      0x4fad5ea0, 0x688fc31c, 0xd1cff191, 0xb3a8c1ad,
      0x2f2f2218, 0xbe0e1777, 0xea752dfe, 0x8b021fa1,
      0xe5a0cc0f, 0xb56f74e8, 0x18acf3d6, 0xce89e299,
      0xb4a84fe0, 0xfd13e0b7, 0x7cc43b81, 0xd2ada8d9,
      0x165fa266, 0x80957705, 0x93cc7314, 0x211a1477,
      0xe6ad2065, 0x77b5fa86, 0xc75442f5, 0xfb9d35cf,
      0xebcdaf0c, 0x7b3e89a0, 0xd6411bd3, 0xae1e7e49,
      0x00250e2d, 0x2071b35e, 0x226800bb, 0x57b8e0af,
      0x2464369b, 0xf009b91e, 0x5563911d, 0x59dfa6aa,
      0x78c14389, 0xd95a537f, 0x207d5ba2, 0x02e5b9c5,
      0x83260376, 0x6295cfa9, 0x11c81968, 0x4e734a41,
      0xb3472dca, 0x7b14a94a, 0x1b510052, 0x9a532915,
      0xd60f573f, 0xbc9bc6e4, 0x2b60a476, 0x81e67400,
      0x08ba6fb5, 0x571be91f, 0xf296ec6b, 0x2a0dd915,
      0xb6636521, 0xe7b9f9b6, 0xff34052e, 0xc5855664,
      0x53b02d5d, 0xa99f8fa1, 0x08ba4799, 0x6e85076a]),
    new Uint32Array([
      0x4b7a70e9, 0xb5b32944, 0xdb75092e, 0xc4192623,
      0xad6ea6b0, 0x49a7df7d, 0x9cee60b8, 0x8fedb266,
      0xecaa8c71, 0x699a17ff, 0x5664526c, 0xc2b19ee1,
      0x193602a5, 0x75094c29, 0xa0591340, 0xe4183a3e,
      0x3f54989a, 0x5b429d65, 0x6b8fe4d6, 0x99f73fd6,
      0xa1d29c07, 0xefe830f5, 0x4d2d38e6, 0xf0255dc1,
      0x4cdd2086, 0x8470eb26, 0x6382e9c6, 0x021ecc5e,
      0x09686b3f, 0x3ebaefc9, 0x3c971814, 0x6b6a70a1,
      0x687f3584, 0x52a0e286, 0xb79c5305, 0xaa500737,
      0x3e07841c, 0x7fdeae5c, 0x8e7d44ec, 0x5716f2b8,
      0xb03ada37, 0xf0500c0d, 0xf01c1f04, 0x0200b3ff,
      0xae0cf51a, 0x3cb574b2, 0x25837a58, 0xdc0921bd,
      0xd19113f9, 0x7ca92ff6, 0x94324773, 0x22f54701,
      0x3ae5e581, 0x37c2dadc, 0xc8b57634, 0x9af3dda7,
      0xa9446146, 0x0fd0030e, 0xecc8c73e, 0xa4751e41,
      0xe238cd99, 0x3bea0e2f, 0x3280bba1, 0x183eb331,
      0x4e548b38, 0x4f6db908, 0x6f420d03, 0xf60a04bf,
      0x2cb81290, 0x24977c79, 0x5679b072, 0xbcaf89af,
      0xde9a771f, 0xd9930810, 0xb38bae12, 0xdccf3f2e,
      0x5512721f, 0x2e6b7124, 0x501adde6, 0x9f84cd87,
      0x7a584718, 0x7408da17, 0xbc9f9abc, 0xe94b7d8c,
      0xec7aec3a, 0xdb851dfa, 0x63094366, 0xc464c3d2,
      0xef1c1847, 0x3215d908, 0xdd433b37, 0x24c2ba16,
      0x12a14d43, 0x2a65c451, 0x50940002, 0x133ae4dd,
      0x71dff89e, 0x10314e55, 0x81ac77d6, 0x5f11199b,
      0x043556f1, 0xd7a3c76b, 0x3c11183b, 0x5924a509,
      0xf28fe6ed, 0x97f1fbfa, 0x9ebabf2c, 0x1e153c6e,
      0x86e34570, 0xeae96fb1, 0x860e5e0a, 0x5a3e2ab3,
      0x771fe71c, 0x4e3d06fa, 0x2965dcb9, 0x99e71d0f,
      0x803e89d6, 0x5266c825, 0x2e4cc978, 0x9c10b36a,
      0xc6150eba, 0x94e2ea78, 0xa5fc3c53, 0x1e0a2df4,
      0xf2f74ea7, 0x361d2b3d, 0x1939260f, 0x19c27960,
      0x5223a708, 0xf71312b6, 0xebadfe6e, 0xeac31f66,
      0xe3bc4595, 0xa67bc883, 0xb17f37d1, 0x018cff28,
      0xc332ddef, 0xbe6c5aa5, 0x65582185, 0x68ab9802,
      0xeecea50f, 0xdb2f953b, 0x2aef7dad, 0x5b6e2f84,
      0x1521b628, 0x29076170, 0xecdd4775, 0x619f1510,
      0x13cca830, 0xeb61bd96, 0x0334fe1e, 0xaa0363cf,
      0xb5735c90, 0x4c70a239, 0xd59e9e0b, 0xcbaade14,
      0xeecc86bc, 0x60622ca7, 0x9cab5cab, 0xb2f3846e,
      0x648b1eaf, 0x19bdf0ca, 0xa02369b9, 0x655abb50,
      0x40685a32, 0x3c2ab4b3, 0x319ee9d5, 0xc021b8f7,
      0x9b540b19, 0x875fa099, 0x95f7997e, 0x623d7da8,
      0xf837889a, 0x97e32d77, 0x11ed935f, 0x16681281,
      0x0e358829, 0xc7e61fd6, 0x96dedfa1, 0x7858ba99,
      0x57f584a5, 0x1b227263, 0x9b83c3ff, 0x1ac24696,
      0xcdb30aeb, 0x532e3054, 0x8fd948e4, 0x6dbc3128,
      0x58ebf2ef, 0x34c6ffea, 0xfe28ed61, 0xee7c3c73,
      0x5d4a14d9, 0xe864b7e3, 0x42105d14, 0x203e13e0,
      0x45eee2b6, 0xa3aaabea, 0xdb6c4f15, 0xfacb4fd0,
      0xc742f442, 0xef6abbb5, 0x654f3b1d, 0x41cd2105,
      0xd81e799e, 0x86854dc7, 0xe44b476a, 0x3d816250,
      0xcf62a1f2, 0x5b8d2646, 0xfc8883a0, 0xc1c7b6a3,
      0x7f1524c3, 0x69cb7492, 0x47848a0b, 0x5692b285,
      0x095bbf00, 0xad19489d, 0x1462b174, 0x23820e00,
      0x58428d2a, 0x0c55f5ea, 0x1dadf43e, 0x233f7061,
      0x3372f092, 0x8d937e41, 0xd65fecf1, 0x6c223bdb,
      0x7cde3759, 0xcbee7460, 0x4085f2a7, 0xce77326e,
      0xa6078084, 0x19f8509e, 0xe8efd855, 0x61d99735,
      0xa969a7aa, 0xc50c06c2, 0x5a04abfc, 0x800bcadc,
      0x9e447a2e, 0xc3453484, 0xfdd56705, 0x0e1e9ec9,
      0xdb73dbd3, 0x105588cd, 0x675fda79, 0xe3674340,
      0xc5c43465, 0x713e38d8, 0x3d28f89e, 0xf16dff20,
      0x153e21e7, 0x8fb03d4a, 0xe6e39f2b, 0xdb83adf7]),
    new Uint32Array([
      0xe93d5a68, 0x948140f7, 0xf64c261c, 0x94692934,
      0x411520f7, 0x7602d4f7, 0xbcf46b2e, 0xd4a20068,
      0xd4082471, 0x3320f46a, 0x43b7d4b7, 0x500061af,
      0x1e39f62e, 0x97244546, 0x14214f74, 0xbf8b8840,
      0x4d95fc1d, 0x96b591af, 0x70f4ddd3, 0x66a02f45,
      0xbfbc09ec, 0x03bd9785, 0x7fac6dd0, 0x31cb8504,
      0x96eb27b3, 0x55fd3941, 0xda2547e6, 0xabca0a9a,
      0x28507825, 0x530429f4, 0x0a2c86da, 0xe9b66dfb,
      0x68dc1462, 0xd7486900, 0x680ec0a4, 0x27a18dee,
      0x4f3ffea2, 0xe887ad8c, 0xb58ce006, 0x7af4d6b6,
      0xaace1e7c, 0xd3375fec, 0xce78a399, 0x406b2a42,
      0x20fe9e35, 0xd9f385b9, 0xee39d7ab, 0x3b124e8b,
      0x1dc9faf7, 0x4b6d1856, 0x26a36631, 0xeae397b2,
      0x3a6efa74, 0xdd5b4332, 0x6841e7f7, 0xca7820fb,
      0xfb0af54e, 0xd8feb397, 0x454056ac, 0xba489527,
      0x55533a3a, 0x20838d87, 0xfe6ba9b7, 0xd096954b,
      0x55a867bc, 0xa1159a58, 0xcca92963, 0x99e1db33,
      0xa62a4a56, 0x3f3125f9, 0x5ef47e1c, 0x9029317c,
      0xfdf8e802, 0x04272f70, 0x80bb155c, 0x05282ce3,
      0x95c11548, 0xe4c66d22, 0x48c1133f, 0xc70f86dc,
      0x07f9c9ee, 0x41041f0f, 0x404779a4, 0x5d886e17,
      0x325f51eb, 0xd59bc0d1, 0xf2bcc18f, 0x41113564,
      0x257b7834, 0x602a9c60, 0xdff8e8a3, 0x1f636c1b,
      0x0e12b4c2, 0x02e1329e, 0xaf664fd1, 0xcad18115,
      0x6b2395e0, 0x333e92e1, 0x3b240b62, 0xeebeb922,
      0x85b2a20e, 0xe6ba0d99, 0xde720c8c, 0x2da2f728,
      0xd0127845, 0x95b794fd, 0x647d0862, 0xe7ccf5f0,
      0x5449a36f, 0x877d48fa, 0xc39dfd27, 0xf33e8d1e,
      0x0a476341, 0x992eff74, 0x3a6f6eab, 0xf4f8fd37,
      0xa812dc60, 0xa1ebddf8, 0x991be14c, 0xdb6e6b0d,
      0xc67b5510, 0x6d672c37, 0x2765d43b, 0xdcd0e804,
      0xf1290dc7, 0xcc00ffa3, 0xb5390f92, 0x690fed0b,
      0x667b9ffb, 0xcedb7d9c, 0xa091cf0b, 0xd9155ea3,
      0xbb132f88, 0x515bad24, 0x7b9479bf, 0x763bd6eb,
      0x37392eb3, 0xcc115979, 0x8026e297, 0xf42e312d,
      0x6842ada7, 0xc66a2b3b, 0x12754ccc, 0x782ef11c,
      0x6a124237, 0xb79251e7, 0x06a1bbe6, 0x4bfb6350,
      0x1a6b1018, 0x11caedfa, 0x3d25bdd8, 0xe2e1c3c9,
      0x44421659, 0x0a121386, 0xd90cec6e, 0xd5abea2a,
      0x64af674e, 0xda86a85f, 0xbebfe988, 0x64e4c3fe,
      0x9dbc8057, 0xf0f7c086, 0x60787bf8, 0x6003604d,
      0xd1fd8346, 0xf6381fb0, 0x7745ae04, 0xd736fccc,
      0x83426b33, 0xf01eab71, 0xb0804187, 0x3c005e5f,
      0x77a057be, 0xbde8ae24, 0x55464299, 0xbf582e61,
      0x4e58f48f, 0xf2ddfda2, 0xf474ef38, 0x8789bdc2,
      0x5366f9c3, 0xc8b38e74, 0xb475f255, 0x46fcd9b9,
      0x7aeb2661, 0x8b1ddf84, 0x846a0e79, 0x915f95e2,
      0x466e598e, 0x20b45770, 0x8cd55591, 0xc902de4c,
      0xb90bace1, 0xbb8205d0, 0x11a86248, 0x7574a99e,
      0xb77f19b6, 0xe0a9dc09, 0x662d09a1, 0xc4324633,
      0xe85a1f02, 0x09f0be8c, 0x4a99a025, 0x1d6efe10,
      0x1ab93d1d, 0x0ba5a4df, 0xa186f20f, 0x2868f169,
      0xdcb7da83, 0x573906fe, 0xa1e2ce9b, 0x4fcd7f52,
      0x50115e01, 0xa70683fa, 0xa002b5c4, 0x0de6d027,
      0x9af88c27, 0x773f8641, 0xc3604c06, 0x61a806b5,
      0xf0177a28, 0xc0f586e0, 0x006058aa, 0x30dc7d62,
      0x11e69ed7, 0x2338ea63, 0x53c2dd94, 0xc2c21634,
      0xbbcbee56, 0x90bcb6de, 0xebfc7da1, 0xce591d76,
      0x6f05e409, 0x4b7c0188, 0x39720a3d, 0x7c927c24,
      0x86e3725f, 0x724d9db9, 0x1ac15bb4, 0xd39eb8fc,
      0xed545578, 0x08fca5b5, 0xd83d7cd3, 0x4dad0fc4,
      0x1e50ef5e, 0xb161e6f8, 0xa28514d9, 0x6c51133c,
      0x6fd5c7e7, 0x56e14ec4, 0x362abfce, 0xddc6c837,
      0xd79a3234, 0x92638212, 0x670efa8e, 0x406000e0]),
    new Uint32Array([
      0x3a39ce37, 0xd3faf5cf, 0xabc27737, 0x5ac52d1b,
      0x5cb0679e, 0x4fa33742, 0xd3822740, 0x99bc9bbe,
      0xd5118e9d, 0xbf0f7315, 0xd62d1c7e, 0xc700c47b,
      0xb78c1b6b, 0x21a19045, 0xb26eb1be, 0x6a366eb4,
      0x5748ab2f, 0xbc946e79, 0xc6a376d2, 0x6549c2c8,
      0x530ff8ee, 0x468dde7d, 0xd5730a1d, 0x4cd04dc6,
      0x2939bbdb, 0xa9ba4650, 0xac9526e8, 0xbe5ee304,
      0xa1fad5f0, 0x6a2d519a, 0x63ef8ce2, 0x9a86ee22,
      0xc089c2b8, 0x43242ef6, 0xa51e03aa, 0x9cf2d0a4,
      0x83c061ba, 0x9be96a4d, 0x8fe51550, 0xba645bd6,
      0x2826a2f9, 0xa73a3ae1, 0x4ba99586, 0xef5562e9,
      0xc72fefd3, 0xf752f7da, 0x3f046f69, 0x77fa0a59,
      0x80e4a915, 0x87b08601, 0x9b09e6ad, 0x3b3ee593,
      0xe990fd5a, 0x9e34d797, 0x2cf0b7d9, 0x022b8b51,
      0x96d5ac3a, 0x017da67d, 0xd1cf3ed6, 0x7c7d2d28,
      0x1f9f25cf, 0xadf2b89b, 0x5ad6b472, 0x5a88f54c,
      0xe029ac71, 0xe019a5e6, 0x47b0acfd, 0xed93fa9b,
      0xe8d3c48d, 0x283b57cc, 0xf8d56629, 0x79132e28,
      0x785f0191, 0xed756055, 0xf7960e44, 0xe3d35e8c,
      0x15056dd4, 0x88f46dba, 0x03a16125, 0x0564f0bd,
      0xc3eb9e15, 0x3c9057a2, 0x97271aec, 0xa93a072a,
      0x1b3f6d9b, 0x1e6321f5, 0xf59c66fb, 0x26dcf319,
      0x7533d928, 0xb155fdf5, 0x03563482, 0x8aba3cbb,
      0x28517711, 0xc20ad9f8, 0xabcc5167, 0xccad925f,
      0x4de81751, 0x3830dc8e, 0x379d5862, 0x9320f991,
      0xea7a90c2, 0xfb3e7bce, 0x5121ce64, 0x774fbe32,
      0xa8b6e37e, 0xc3293d46, 0x48de5369, 0x6413e680,
      0xa2ae0810, 0xdd6db224, 0x69852dfd, 0x09072166,
      0xb39a460a, 0x6445c0dd, 0x586cdecf, 0x1c20c8ae,
      0x5bbef7dd, 0x1b588d40, 0xccd2017f, 0x6bb4e3bb,
      0xdda26a7e, 0x3a59ff45, 0x3e350a44, 0xbcb4cdd5,
      0x72eacea8, 0xfa6484bb, 0x8d6612ae, 0xbf3c6f47,
      0xd29be463, 0x542f5d9e, 0xaec2771b, 0xf64e6370,
      0x740e0d8d, 0xe75b1357, 0xf8721671, 0xaf537d5d,
      0x4040cb08, 0x4eb4e2cc, 0x34d2466a, 0x0115af84,
      0xe1b00428, 0x95983a1d, 0x06b89fb4, 0xce6ea048,
      0x6f3f3b82, 0x3520ab82, 0x011a1d4b, 0x277227f8,
      0x611560b1, 0xe7933fdc, 0xbb3a792b, 0x344525bd,
      0xa08839e1, 0x51ce794b, 0x2f32c9b7, 0xa01fbac9,
      0xe01cc87e, 0xbcc7d1f6, 0xcf0111c3, 0xa1e8aac7,
      0x1a908749, 0xd44fbd9a, 0xd0dadecb, 0xd50ada38,
      0x0339c32a, 0xc6913667, 0x8df9317c, 0xe0b12b4f,
      0xf79e59b7, 0x43f5bb3a, 0xf2d519ff, 0x27d9459c,
      0xbf97222c, 0x15e6fc2a, 0x0f91fc71, 0x9b941525,
      0xfae59361, 0xceb69ceb, 0xc2a86459, 0x12baa8d1,
      0xb6c1075e, 0xe3056a0c, 0x10d25065, 0xcb03a442,
      0xe0ec6e0e, 0x1698db3b, 0x4c98a0be, 0x3278e964,
      0x9f1f9532, 0xe0d392df, 0xd3a0342b, 0x8971f21e,
      0x1b0a7441, 0x4ba3348c, 0xc5be7120, 0xc37632d8,
      0xdf359f8d, 0x9b992f2e, 0xe60b6f47, 0x0fe3f11d,
      0xe54cda54, 0x1edad891, 0xce6279cf, 0xcd3e7e6f,
      0x1618b166, 0xfd2c1d05, 0x848fd2c5, 0xf6fb2299,
      0xf523f357, 0xa6327623, 0x93a83531, 0x56cccd02,
      0xacf08162, 0x5a75ebb5, 0x6e163697, 0x88d273cc,
      0xde966292, 0x81b949d0, 0x4c50901b, 0x71c65614,
      0xe6c6c7bd, 0x327a140a, 0x45e1d006, 0xc3f27b9a,
      0xc9aa53fd, 0x62a80f00, 0xbb25bfe2, 0x35bdd2f6,
      0x71126905, 0xb2040222, 0xb6cbcf7c, 0xcd769c2b,
      0x53113ec0, 0x1640e3d3, 0x38abbd60, 0x2547adf0,
      0xba38209c, 0xf746ce76, 0x77afa1c5, 0x20756060,
      0x85cbfe4e, 0x8ae88dd8, 0x7aaaf9b0, 0x4cf9aa7e,
      0x1948c25c, 0x02fb8a8c, 0x01c36ae4, 0xd6ebe1f9,
      0x90d4f869, 0xa65cdea0, 0x3f09252d, 0xc208e69f,
      0xb74e6132, 0xce77e25b, 0x578fdfe3, 0x3ac372e6])
    ];
  this.P = new Uint32Array([
    0x243f6a88, 0x85a308d3, 0x13198a2e, 0x03707344,
    0xa4093822, 0x299f31d0, 0x082efa98, 0xec4e6c89,
    0x452821e6, 0x38d01377, 0xbe5466cf, 0x34e90c6c,
    0xc0ac29b7, 0xc97c50dd, 0x3f84d5b5, 0xb5470917,
    0x9216d5d9, 0x8979fb1b]);
};

function F(S, x8, i) {
  return (((S[0][x8[i+3]] +
            S[1][x8[i+2]]) ^
            S[2][x8[i+1]]) +
            S[3][x8[i]]);
};

Blowfish.prototype.encipher = function(x, x8) {
  if (x8 === undefined) {
    x8 = new Uint8Array(x.buffer);
    if (x.byteOffset !== 0)
      x8 = x8.subarray(x.byteOffset);
  }
  x[0] ^= this.P[0];
  for (var i = 1; i < 16; i += 2) {
    x[1] ^= F(this.S, x8, 0) ^ this.P[i];
    x[0] ^= F(this.S, x8, 4) ^ this.P[i+1];
  }
  var t = x[0];
  x[0] = x[1] ^ this.P[17];
  x[1] = t;
};

Blowfish.prototype.decipher = function(x) {
  var x8 = new Uint8Array(x.buffer);
  if (x.byteOffset !== 0)
    x8 = x8.subarray(x.byteOffset);
  x[0] ^= this.P[17];
  for (var i = 16; i > 0; i -= 2) {
    x[1] ^= F(this.S, x8, 0) ^ this.P[i];
    x[0] ^= F(this.S, x8, 4) ^ this.P[i-1];
  }
  var t = x[0];
  x[0] = x[1] ^ this.P[0];
  x[1] = t;
};

function stream2word(data, databytes){
  var i, temp = 0;
  for (i = 0; i < 4; i++, BLF_J++) {
    if (BLF_J >= databytes) BLF_J = 0;
    temp = (temp << 8) | data[BLF_J];
  }
  return temp;
};

Blowfish.prototype.expand0state = function(key, keybytes) {
  var d = new Uint32Array(2), i, k;
  var d8 = new Uint8Array(d.buffer);

  for (i = 0, BLF_J = 0; i < 18; i++) {
    this.P[i] ^= stream2word(key, keybytes);
  }
  BLF_J = 0;

  for (i = 0; i < 18; i += 2) {
    this.encipher(d, d8);
    this.P[i]   = d[0];
    this.P[i+1] = d[1];
  }

  for (i = 0; i < 4; i++) {
    for (k = 0; k < 256; k += 2) {
      this.encipher(d, d8);
      this.S[i][k]   = d[0];
      this.S[i][k+1] = d[1];
    }
  }
};

Blowfish.prototype.expandstate = function(data, databytes, key, keybytes) {
  var d = new Uint32Array(2), i, k;

  for (i = 0, BLF_J = 0; i < 18; i++) {
    this.P[i] ^= stream2word(key, keybytes);
  }

  for (i = 0, BLF_J = 0; i < 18; i += 2) {
    d[0] ^= stream2word(data, databytes);
    d[1] ^= stream2word(data, databytes);
    this.encipher(d);
    this.P[i]   = d[0];
    this.P[i+1] = d[1];
  }

  for (i = 0; i < 4; i++) {
    for (k = 0; k < 256; k += 2) {
      d[0] ^= stream2word(data, databytes);
      d[1] ^= stream2word(data, databytes);
      this.encipher(d);
      this.S[i][k]   = d[0];
      this.S[i][k+1] = d[1];
    }
  }
  BLF_J = 0;
};

Blowfish.prototype.enc = function(data, blocks) {
  for (var i = 0; i < blocks; i++) {
    this.encipher(data.subarray(i*2));
  }
};

Blowfish.prototype.dec = function(data, blocks) {
  for (var i = 0; i < blocks; i++) {
    this.decipher(data.subarray(i*2));
  }
};

var BCRYPT_BLOCKS = 8,
    BCRYPT_HASHSIZE = 32;

function bcrypt_hash(sha2pass, sha2salt, out) {
  var state = new Blowfish(),
      cdata = new Uint32Array(BCRYPT_BLOCKS), i,
      ciphertext = new Uint8Array([79,120,121,99,104,114,111,109,97,116,105,
            99,66,108,111,119,102,105,115,104,83,119,97,116,68,121,110,97,109,
            105,116,101]); //"OxychromaticBlowfishSwatDynamite"

  state.expandstate(sha2salt, 64, sha2pass, 64);
  for (i = 0; i < 64; i++) {
    state.expand0state(sha2salt, 64);
    state.expand0state(sha2pass, 64);
  }

  for (i = 0; i < BCRYPT_BLOCKS; i++)
    cdata[i] = stream2word(ciphertext, ciphertext.byteLength);
  for (i = 0; i < 64; i++)
    state.enc(cdata, cdata.byteLength / 8);

  for (i = 0; i < BCRYPT_BLOCKS; i++) {
    out[4*i+3] = cdata[i] >>> 24;
    out[4*i+2] = cdata[i] >>> 16;
    out[4*i+1] = cdata[i] >>> 8;
    out[4*i+0] = cdata[i];
  }
};

function bcrypt_pbkdf(pass, passlen, salt, saltlen, key, keylen, rounds) {
  var sha2pass = new Uint8Array(64),
      sha2salt = new Uint8Array(64),
      out = new Uint8Array(BCRYPT_HASHSIZE),
      tmpout = new Uint8Array(BCRYPT_HASHSIZE),
      countsalt = new Uint8Array(saltlen+4),
      i, j, amt, stride, dest, count,
      origkeylen = keylen;

  if (rounds < 1)
    return -1;
  if (passlen === 0 || saltlen === 0 || keylen === 0 ||
      keylen > (out.byteLength * out.byteLength) || saltlen > (1<<20))
    return -1;

  stride = Math.floor((keylen + out.byteLength - 1) / out.byteLength);
  amt = Math.floor((keylen + stride - 1) / stride);

  for (i = 0; i < saltlen; i++)
    countsalt[i] = salt[i];

  crypto_hash_sha512(sha2pass, pass, passlen);

  for (count = 1; keylen > 0; count++) {
    countsalt[saltlen+0] = count >>> 24;
    countsalt[saltlen+1] = count >>> 16;
    countsalt[saltlen+2] = count >>>  8;
    countsalt[saltlen+3] = count;

    crypto_hash_sha512(sha2salt, countsalt, saltlen + 4);
    bcrypt_hash(sha2pass, sha2salt, tmpout);
    for (i = out.byteLength; i--;)
      out[i] = tmpout[i];

    for (i = 1; i < rounds; i++) {
      crypto_hash_sha512(sha2salt, tmpout, tmpout.byteLength);
      bcrypt_hash(sha2pass, sha2salt, tmpout);
      for (j = 0; j < out.byteLength; j++)
        out[j] ^= tmpout[j];
    }

    amt = Math.min(amt, keylen);
    for (i = 0; i < amt; i++) {
      dest = i * stride + (count - 1);
      if (dest >= origkeylen)
        break;
      key[dest] = out[i];
    }
    keylen -= i;
  }

  return 0;
};

module.exports = {
      BLOCKS: BCRYPT_BLOCKS,
      HASHSIZE: BCRYPT_HASHSIZE,
      hash: bcrypt_hash,
      pbkdf: bcrypt_pbkdf
};


/***/ }),

/***/ 3682:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var register = __nccwpck_require__(4670)
var addHook = __nccwpck_require__(5549)
var removeHook = __nccwpck_require__(6819)

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind
var bindable = bind.bind(bind)

function bindApi (hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state])
  hook.api = { remove: removeHookRef }
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind]
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args)
  })
}

function HookSingular () {
  var singularHookName = 'h'
  var singularHookState = {
    registry: {}
  }
  var singularHook = register.bind(null, singularHookState, singularHookName)
  bindApi(singularHook, singularHookState, singularHookName)
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  bindApi(hook, state)

  return hook
}

var collectionHookDeprecationMessageDisplayed = false
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4')
    collectionHookDeprecationMessageDisplayed = true
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind()
Hook.Collection = HookCollection.bind()

module.exports = Hook
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook
module.exports.Singular = Hook.Singular
module.exports.Collection = Hook.Collection


/***/ }),

/***/ 5549:
/***/ ((module) => {

module.exports = addHook;

function addHook(state, kind, name, hook) {
  var orig = hook;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }

  if (kind === "before") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options));
    };
  }

  if (kind === "after") {
    hook = function (method, options) {
      var result;
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_;
          return orig(result, options);
        })
        .then(function () {
          return result;
        });
    };
  }

  if (kind === "error") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options);
        });
    };
  }

  state.registry[name].push({
    hook: hook,
    orig: orig,
  });
}


/***/ }),

/***/ 4670:
/***/ ((module) => {

module.exports = register;

function register(state, name, method, options) {
  if (typeof method !== "function") {
    throw new Error("method for before hook must be a function");
  }

  if (!options) {
    options = {};
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options);
    }, method)();
  }

  return Promise.resolve().then(function () {
    if (!state.registry[name]) {
      return method(options);
    }

    return state.registry[name].reduce(function (method, registered) {
      return registered.hook.bind(null, method, options);
    }, method)();
  });
}


/***/ }),

/***/ 6819:
/***/ ((module) => {

module.exports = removeHook;

function removeHook(state, name, method) {
  if (!state.registry[name]) {
    return;
  }

  var index = state.registry[name]
    .map(function (registered) {
      return registered.orig;
    })
    .indexOf(method);

  if (index === -1) {
    return;
  }

  state.registry[name].splice(index, 1);
}


/***/ }),

/***/ 2746:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const cp = __nccwpck_require__(3129);
const parse = __nccwpck_require__(6855);
const enoent = __nccwpck_require__(4101);

function spawn(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

module.exports = spawn;
module.exports.spawn = spawn;
module.exports.sync = spawnSync;

module.exports._parse = parse;
module.exports._enoent = enoent;


/***/ }),

/***/ 4101:
/***/ ((module) => {

"use strict";


const isWin = process.platform === 'win32';

function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args,
    });
}

function hookChildProcess(cp, parsed) {
    if (!isWin) {
        return;
    }

    const originalEmit = cp.emit;

    cp.emit = function (name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = verifyENOENT(arg1, parsed, 'spawn');

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}

function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    return null;
}

module.exports = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError,
};


/***/ }),

/***/ 6855:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const path = __nccwpck_require__(5622);
const resolveCommand = __nccwpck_require__(7274);
const escape = __nccwpck_require__(4274);
const readShebang = __nccwpck_require__(1252);

const isWin = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

function detectShebang(parsed) {
    parsed.file = resolveCommand(parsed);

    const shebang = parsed.file && readShebang(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;

        return resolveCommand(parsed);
    }

    return parsed.file;
}

function parseNonShell(parsed) {
    if (!isWin) {
        return parsed;
    }

    // Detect & add support for shebangs
    const commandFile = detectShebang(parsed);

    // We don't need a shell if the command filename is an executable
    const needsShell = !isExecutableRegExp.test(commandFile);

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = path.normalize(parsed.command);

        // Escape command & arguments
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));

        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original

    // Build our parsed object
    const parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            command,
            args,
        },
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parsed : parseNonShell(parsed);
}

module.exports = parse;


/***/ }),

/***/ 4274:
/***/ ((module) => {

"use strict";


// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;

    // Algorithm below is based on https://qntm.org/cmd

    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1');

    // All other backslashes occur literally

    // Quote the whole thing:
    arg = `"${arg}"`;

    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, '^$1');
    }

    return arg;
}

module.exports.command = escapeCommand;
module.exports.argument = escapeArgument;


/***/ }),

/***/ 1252:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(5747);
const shebangCommand = __nccwpck_require__(7032);

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    const buffer = Buffer.alloc(size);

    let fd;

    try {
        fd = fs.openSync(command, 'r');
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

module.exports = readShebang;


/***/ }),

/***/ 7274:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const path = __nccwpck_require__(5622);
const which = __nccwpck_require__(4207);
const getPathKey = __nccwpck_require__(9060);

function resolveCommandAttempt(parsed, withoutPathExt) {
    const env = parsed.options.env || process.env;
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;
    // Worker threads do not have process.chdir()
    const shouldSwitchCwd = hasCustomCwd && process.chdir !== undefined && !process.chdir.disabled;

    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (shouldSwitchCwd) {
        try {
            process.chdir(parsed.options.cwd);
        } catch (err) {
            /* Empty */
        }
    }

    let resolved;

    try {
        resolved = which.sync(parsed.command, {
            path: env[getPathKey({ env })],
            pathExt: withoutPathExt ? path.delimiter : undefined,
        });
    } catch (e) {
        /* Empty */
    } finally {
        if (shouldSwitchCwd) {
            process.chdir(cwd);
        }
    }

    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) {
        resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    }

    return resolved;
}

function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

module.exports = resolveCommand;


/***/ }),

/***/ 9060:
/***/ ((module) => {

"use strict";


const pathKey = (options = {}) => {
	const environment = options.env || process.env;
	const platform = options.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(environment).reverse().find(key => key.toUpperCase() === 'PATH') || 'Path';
};

module.exports = pathKey;
// TODO: Remove this for the next major release
module.exports.default = pathKey;


/***/ }),

/***/ 8932:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

exports.Deprecation = Deprecation;


/***/ }),

/***/ 5447:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const path = __nccwpck_require__(5622);
const childProcess = __nccwpck_require__(3129);
const crossSpawn = __nccwpck_require__(2746);
const stripFinalNewline = __nccwpck_require__(8174);
const npmRunPath = __nccwpck_require__(502);
const onetime = __nccwpck_require__(9082);
const makeError = __nccwpck_require__(2187);
const normalizeStdio = __nccwpck_require__(166);
const {spawnedKill, spawnedCancel, setupTimeout, setExitHandler} = __nccwpck_require__(9819);
const {handleInput, getSpawnedResult, makeAllStream, validateInputSync} = __nccwpck_require__(2592);
const {mergePromise, getSpawnedPromise} = __nccwpck_require__(7814);
const {joinCommand, parseCommand} = __nccwpck_require__(8286);

const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;

const getEnv = ({env: envOption, extendEnv, preferLocal, localDir, execPath}) => {
	const env = extendEnv ? {...process.env, ...envOption} : envOption;

	if (preferLocal) {
		return npmRunPath.env({env, cwd: localDir, execPath});
	}

	return env;
};

const handleArguments = (file, args, options = {}) => {
	const parsed = crossSpawn._parse(file, args, options);
	file = parsed.command;
	args = parsed.args;
	options = parsed.options;

	options = {
		maxBuffer: DEFAULT_MAX_BUFFER,
		buffer: true,
		stripFinalNewline: true,
		extendEnv: true,
		preferLocal: false,
		localDir: options.cwd || process.cwd(),
		execPath: process.execPath,
		encoding: 'utf8',
		reject: true,
		cleanup: true,
		all: false,
		windowsHide: true,
		...options
	};

	options.env = getEnv(options);

	options.stdio = normalizeStdio(options);

	if (process.platform === 'win32' && path.basename(file, '.exe') === 'cmd') {
		// #116
		args.unshift('/q');
	}

	return {file, args, options, parsed};
};

const handleOutput = (options, value, error) => {
	if (typeof value !== 'string' && !Buffer.isBuffer(value)) {
		// When `execa.sync()` errors, we normalize it to '' to mimic `execa()`
		return error === undefined ? undefined : '';
	}

	if (options.stripFinalNewline) {
		return stripFinalNewline(value);
	}

	return value;
};

const execa = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);

	let spawned;
	try {
		spawned = childProcess.spawn(parsed.file, parsed.args, parsed.options);
	} catch (error) {
		// Ensure the returned error is always both a promise and a child process
		const dummySpawned = new childProcess.ChildProcess();
		const errorPromise = Promise.reject(makeError({
			error,
			stdout: '',
			stderr: '',
			all: '',
			command,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		}));
		return mergePromise(dummySpawned, errorPromise);
	}

	const spawnedPromise = getSpawnedPromise(spawned);
	const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
	const processDone = setExitHandler(spawned, parsed.options, timedPromise);

	const context = {isCanceled: false};

	spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
	spawned.cancel = spawnedCancel.bind(null, spawned, context);

	const handlePromise = async () => {
		const [{error, exitCode, signal, timedOut}, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
		const stdout = handleOutput(parsed.options, stdoutResult);
		const stderr = handleOutput(parsed.options, stderrResult);
		const all = handleOutput(parsed.options, allResult);

		if (error || exitCode !== 0 || signal !== null) {
			const returnedError = makeError({
				error,
				exitCode,
				signal,
				stdout,
				stderr,
				all,
				command,
				parsed,
				timedOut,
				isCanceled: context.isCanceled,
				killed: spawned.killed
			});

			if (!parsed.options.reject) {
				return returnedError;
			}

			throw returnedError;
		}

		return {
			command,
			exitCode: 0,
			stdout,
			stderr,
			all,
			failed: false,
			timedOut: false,
			isCanceled: false,
			killed: false
		};
	};

	const handlePromiseOnce = onetime(handlePromise);

	handleInput(spawned, parsed.options.input);

	spawned.all = makeAllStream(spawned, parsed.options);

	return mergePromise(spawned, handlePromiseOnce);
};

module.exports = execa;

module.exports.sync = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);

	validateInputSync(parsed.options);

	let result;
	try {
		result = childProcess.spawnSync(parsed.file, parsed.args, parsed.options);
	} catch (error) {
		throw makeError({
			error,
			stdout: '',
			stderr: '',
			all: '',
			command,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		});
	}

	const stdout = handleOutput(parsed.options, result.stdout, result.error);
	const stderr = handleOutput(parsed.options, result.stderr, result.error);

	if (result.error || result.status !== 0 || result.signal !== null) {
		const error = makeError({
			stdout,
			stderr,
			error: result.error,
			signal: result.signal,
			exitCode: result.status,
			command,
			parsed,
			timedOut: result.error && result.error.code === 'ETIMEDOUT',
			isCanceled: false,
			killed: result.signal !== null
		});

		if (!parsed.options.reject) {
			return error;
		}

		throw error;
	}

	return {
		command,
		exitCode: 0,
		stdout,
		stderr,
		failed: false,
		timedOut: false,
		isCanceled: false,
		killed: false
	};
};

module.exports.command = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa(file, args, options);
};

module.exports.commandSync = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa.sync(file, args, options);
};

module.exports.node = (scriptPath, args, options = {}) => {
	if (args && !Array.isArray(args) && typeof args === 'object') {
		options = args;
		args = [];
	}

	const stdio = normalizeStdio.node(options);
	const defaultExecArgv = process.execArgv.filter(arg => !arg.startsWith('--inspect'));

	const {
		nodePath = process.execPath,
		nodeOptions = defaultExecArgv
	} = options;

	return execa(
		nodePath,
		[
			...nodeOptions,
			scriptPath,
			...(Array.isArray(args) ? args : [])
		],
		{
			...options,
			stdin: undefined,
			stdout: undefined,
			stderr: undefined,
			stdio,
			shell: false
		}
	);
};


/***/ }),

/***/ 8286:
/***/ ((module) => {

"use strict";

const SPACES_REGEXP = / +/g;

const joinCommand = (file, args = []) => {
	if (!Array.isArray(args)) {
		return file;
	}

	return [file, ...args].join(' ');
};

// Handle `execa.command()`
const parseCommand = command => {
	const tokens = [];
	for (const token of command.trim().split(SPACES_REGEXP)) {
		// Allow spaces to be escaped by a backslash if not meant as a delimiter
		const previousToken = tokens[tokens.length - 1];
		if (previousToken && previousToken.endsWith('\\')) {
			// Merge previous token with current one
			tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
		} else {
			tokens.push(token);
		}
	}

	return tokens;
};

module.exports = {
	joinCommand,
	parseCommand
};


/***/ }),

/***/ 2187:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {signalsByName} = __nccwpck_require__(2779);

const getErrorPrefix = ({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled}) => {
	if (timedOut) {
		return `timed out after ${timeout} milliseconds`;
	}

	if (isCanceled) {
		return 'was canceled';
	}

	if (errorCode !== undefined) {
		return `failed with ${errorCode}`;
	}

	if (signal !== undefined) {
		return `was killed with ${signal} (${signalDescription})`;
	}

	if (exitCode !== undefined) {
		return `failed with exit code ${exitCode}`;
	}

	return 'failed';
};

const makeError = ({
	stdout,
	stderr,
	all,
	error,
	signal,
	exitCode,
	command,
	timedOut,
	isCanceled,
	killed,
	parsed: {options: {timeout}}
}) => {
	// `signal` and `exitCode` emitted on `spawned.on('exit')` event can be `null`.
	// We normalize them to `undefined`
	exitCode = exitCode === null ? undefined : exitCode;
	signal = signal === null ? undefined : signal;
	const signalDescription = signal === undefined ? undefined : signalsByName[signal].description;

	const errorCode = error && error.code;

	const prefix = getErrorPrefix({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled});
	const execaMessage = `Command ${prefix}: ${command}`;
	const isError = Object.prototype.toString.call(error) === '[object Error]';
	const shortMessage = isError ? `${execaMessage}\n${error.message}` : execaMessage;
	const message = [shortMessage, stderr, stdout].filter(Boolean).join('\n');

	if (isError) {
		error.originalMessage = error.message;
		error.message = message;
	} else {
		error = new Error(message);
	}

	error.shortMessage = shortMessage;
	error.command = command;
	error.exitCode = exitCode;
	error.signal = signal;
	error.signalDescription = signalDescription;
	error.stdout = stdout;
	error.stderr = stderr;

	if (all !== undefined) {
		error.all = all;
	}

	if ('bufferedData' in error) {
		delete error.bufferedData;
	}

	error.failed = true;
	error.timedOut = Boolean(timedOut);
	error.isCanceled = isCanceled;
	error.killed = killed && !timedOut;

	return error;
};

module.exports = makeError;


/***/ }),

/***/ 9819:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const os = __nccwpck_require__(2087);
const onExit = __nccwpck_require__(4931);

const DEFAULT_FORCE_KILL_TIMEOUT = 1000 * 5;

// Monkey-patches `childProcess.kill()` to add `forceKillAfterTimeout` behavior
const spawnedKill = (kill, signal = 'SIGTERM', options = {}) => {
	const killResult = kill(signal);
	setKillTimeout(kill, signal, options, killResult);
	return killResult;
};

const setKillTimeout = (kill, signal, options, killResult) => {
	if (!shouldForceKill(signal, options, killResult)) {
		return;
	}

	const timeout = getForceKillAfterTimeout(options);
	const t = setTimeout(() => {
		kill('SIGKILL');
	}, timeout);

	// Guarded because there's no `.unref()` when `execa` is used in the renderer
	// process in Electron. This cannot be tested since we don't run tests in
	// Electron.
	// istanbul ignore else
	if (t.unref) {
		t.unref();
	}
};

const shouldForceKill = (signal, {forceKillAfterTimeout}, killResult) => {
	return isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
};

const isSigterm = signal => {
	return signal === os.constants.signals.SIGTERM ||
		(typeof signal === 'string' && signal.toUpperCase() === 'SIGTERM');
};

const getForceKillAfterTimeout = ({forceKillAfterTimeout = true}) => {
	if (forceKillAfterTimeout === true) {
		return DEFAULT_FORCE_KILL_TIMEOUT;
	}

	if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
		throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
	}

	return forceKillAfterTimeout;
};

// `childProcess.cancel()`
const spawnedCancel = (spawned, context) => {
	const killResult = spawned.kill();

	if (killResult) {
		context.isCanceled = true;
	}
};

const timeoutKill = (spawned, signal, reject) => {
	spawned.kill(signal);
	reject(Object.assign(new Error('Timed out'), {timedOut: true, signal}));
};

// `timeout` option handling
const setupTimeout = (spawned, {timeout, killSignal = 'SIGTERM'}, spawnedPromise) => {
	if (timeout === 0 || timeout === undefined) {
		return spawnedPromise;
	}

	if (!Number.isFinite(timeout) || timeout < 0) {
		throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
	}

	let timeoutId;
	const timeoutPromise = new Promise((resolve, reject) => {
		timeoutId = setTimeout(() => {
			timeoutKill(spawned, killSignal, reject);
		}, timeout);
	});

	const safeSpawnedPromise = spawnedPromise.finally(() => {
		clearTimeout(timeoutId);
	});

	return Promise.race([timeoutPromise, safeSpawnedPromise]);
};

// `cleanup` option handling
const setExitHandler = async (spawned, {cleanup, detached}, timedPromise) => {
	if (!cleanup || detached) {
		return timedPromise;
	}

	const removeExitHandler = onExit(() => {
		spawned.kill();
	});

	return timedPromise.finally(() => {
		removeExitHandler();
	});
};

module.exports = {
	spawnedKill,
	spawnedCancel,
	setupTimeout,
	setExitHandler
};


/***/ }),

/***/ 7814:
/***/ ((module) => {

"use strict";


const nativePromisePrototype = (async () => {})().constructor.prototype;
const descriptors = ['then', 'catch', 'finally'].map(property => [
	property,
	Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
]);

// The return value is a mixin of `childProcess` and `Promise`
const mergePromise = (spawned, promise) => {
	for (const [property, descriptor] of descriptors) {
		// Starting the main `promise` is deferred to avoid consuming streams
		const value = typeof promise === 'function' ?
			(...args) => Reflect.apply(descriptor.value, promise(), args) :
			descriptor.value.bind(promise);

		Reflect.defineProperty(spawned, property, {...descriptor, value});
	}

	return spawned;
};

// Use promises instead of `child_process` events
const getSpawnedPromise = spawned => {
	return new Promise((resolve, reject) => {
		spawned.on('exit', (exitCode, signal) => {
			resolve({exitCode, signal});
		});

		spawned.on('error', error => {
			reject(error);
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', error => {
				reject(error);
			});
		}
	});
};

module.exports = {
	mergePromise,
	getSpawnedPromise
};



/***/ }),

/***/ 166:
/***/ ((module) => {

"use strict";

const aliases = ['stdin', 'stdout', 'stderr'];

const hasAlias = options => aliases.some(alias => options[alias] !== undefined);

const normalizeStdio = options => {
	if (!options) {
		return;
	}

	const {stdio} = options;

	if (stdio === undefined) {
		return aliases.map(alias => options[alias]);
	}

	if (hasAlias(options)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map(alias => `\`${alias}\``).join(', ')}`);
	}

	if (typeof stdio === 'string') {
		return stdio;
	}

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const length = Math.max(stdio.length, aliases.length);
	return Array.from({length}, (value, index) => stdio[index]);
};

module.exports = normalizeStdio;

// `ipc` is pushed unless it is already present
module.exports.node = options => {
	const stdio = normalizeStdio(options);

	if (stdio === 'ipc') {
		return 'ipc';
	}

	if (stdio === undefined || typeof stdio === 'string') {
		return [stdio, stdio, stdio, 'ipc'];
	}

	if (stdio.includes('ipc')) {
		return stdio;
	}

	return [...stdio, 'ipc'];
};


/***/ }),

/***/ 2592:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const isStream = __nccwpck_require__(1554);
const getStream = __nccwpck_require__(1766);
const mergeStream = __nccwpck_require__(2621);

// `input` option
const handleInput = (spawned, input) => {
	// Checking for stdin is workaround for https://github.com/nodejs/node/issues/26852
	// TODO: Remove `|| spawned.stdin === undefined` once we drop support for Node.js <=12.2.0
	if (input === undefined || spawned.stdin === undefined) {
		return;
	}

	if (isStream(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
};

// `all` interleaves `stdout` and `stderr`
const makeAllStream = (spawned, {all}) => {
	if (!all || (!spawned.stdout && !spawned.stderr)) {
		return;
	}

	const mixed = mergeStream();

	if (spawned.stdout) {
		mixed.add(spawned.stdout);
	}

	if (spawned.stderr) {
		mixed.add(spawned.stderr);
	}

	return mixed;
};

// On failure, `result.stdout|stderr|all` should contain the currently buffered stream
const getBufferedData = async (stream, streamPromise) => {
	if (!stream) {
		return;
	}

	stream.destroy();

	try {
		return await streamPromise;
	} catch (error) {
		return error.bufferedData;
	}
};

const getStreamPromise = (stream, {encoding, buffer, maxBuffer}) => {
	if (!stream || !buffer) {
		return;
	}

	if (encoding) {
		return getStream(stream, {encoding, maxBuffer});
	}

	return getStream.buffer(stream, {maxBuffer});
};

// Retrieve result of child process: exit code, signal, error, streams (stdout/stderr/all)
const getSpawnedResult = async ({stdout, stderr, all}, {encoding, buffer, maxBuffer}, processDone) => {
	const stdoutPromise = getStreamPromise(stdout, {encoding, buffer, maxBuffer});
	const stderrPromise = getStreamPromise(stderr, {encoding, buffer, maxBuffer});
	const allPromise = getStreamPromise(all, {encoding, buffer, maxBuffer: maxBuffer * 2});

	try {
		return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
	} catch (error) {
		return Promise.all([
			{error, signal: error.signal, timedOut: error.timedOut},
			getBufferedData(stdout, stdoutPromise),
			getBufferedData(stderr, stderrPromise),
			getBufferedData(all, allPromise)
		]);
	}
};

const validateInputSync = ({input}) => {
	if (isStream(input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}
};

module.exports = {
	handleInput,
	makeAllStream,
	getSpawnedResult,
	validateInputSync
};



/***/ }),

/***/ 1585:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {PassThrough: PassThroughStream} = __nccwpck_require__(2413);

module.exports = options => {
	options = {...options};

	const {array} = options;
	let {encoding} = options;
	const isBuffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || isBuffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (isBuffer) {
		encoding = null;
	}

	const stream = new PassThroughStream({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	let length = 0;
	const chunks = [];

	stream.on('data', chunk => {
		chunks.push(chunk);

		if (objectMode) {
			length = chunks.length;
		} else {
			length += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return chunks;
		}

		return isBuffer ? Buffer.concat(chunks, length) : chunks.join('');
	};

	stream.getBufferedLength = () => length;

	return stream;
};


/***/ }),

/***/ 1766:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {constants: BufferConstants} = __nccwpck_require__(4293);
const stream = __nccwpck_require__(2413);
const {promisify} = __nccwpck_require__(1669);
const bufferStream = __nccwpck_require__(1585);

const streamPipelinePromisified = promisify(stream.pipeline);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

async function getStream(inputStream, options) {
	if (!inputStream) {
		throw new Error('Expected a stream');
	}

	options = {
		maxBuffer: Infinity,
		...options
	};

	const {maxBuffer} = options;
	const stream = bufferStream(options);

	await new Promise((resolve, reject) => {
		const rejectPromise = error => {
			// Don't retrieve an oversized buffer.
			if (error && stream.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
				error.bufferedData = stream.getBufferedValue();
			}

			reject(error);
		};

		(async () => {
			try {
				await streamPipelinePromisified(inputStream, stream);
				resolve();
			} catch (error) {
				rejectPromise(error);
			}
		})();

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	});

	return stream.getBufferedValue();
}

module.exports = getStream;
module.exports.buffer = (stream, options) => getStream(stream, {...options, encoding: 'buffer'});
module.exports.array = (stream, options) => getStream(stream, {...options, array: true});
module.exports.MaxBufferError = MaxBufferError;


/***/ }),

/***/ 8213:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.SIGNALS=void 0;

const SIGNALS=[
{
name:"SIGHUP",
number:1,
action:"terminate",
description:"Terminal closed",
standard:"posix"},

{
name:"SIGINT",
number:2,
action:"terminate",
description:"User interruption with CTRL-C",
standard:"ansi"},

{
name:"SIGQUIT",
number:3,
action:"core",
description:"User interruption with CTRL-\\",
standard:"posix"},

{
name:"SIGILL",
number:4,
action:"core",
description:"Invalid machine instruction",
standard:"ansi"},

{
name:"SIGTRAP",
number:5,
action:"core",
description:"Debugger breakpoint",
standard:"posix"},

{
name:"SIGABRT",
number:6,
action:"core",
description:"Aborted",
standard:"ansi"},

{
name:"SIGIOT",
number:6,
action:"core",
description:"Aborted",
standard:"bsd"},

{
name:"SIGBUS",
number:7,
action:"core",
description:
"Bus error due to misaligned, non-existing address or paging error",
standard:"bsd"},

{
name:"SIGEMT",
number:7,
action:"terminate",
description:"Command should be emulated but is not implemented",
standard:"other"},

{
name:"SIGFPE",
number:8,
action:"core",
description:"Floating point arithmetic error",
standard:"ansi"},

{
name:"SIGKILL",
number:9,
action:"terminate",
description:"Forced termination",
standard:"posix",
forced:true},

{
name:"SIGUSR1",
number:10,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGSEGV",
number:11,
action:"core",
description:"Segmentation fault",
standard:"ansi"},

{
name:"SIGUSR2",
number:12,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGPIPE",
number:13,
action:"terminate",
description:"Broken pipe or socket",
standard:"posix"},

{
name:"SIGALRM",
number:14,
action:"terminate",
description:"Timeout or timer",
standard:"posix"},

{
name:"SIGTERM",
number:15,
action:"terminate",
description:"Termination",
standard:"ansi"},

{
name:"SIGSTKFLT",
number:16,
action:"terminate",
description:"Stack is empty or overflowed",
standard:"other"},

{
name:"SIGCHLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"posix"},

{
name:"SIGCLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"other"},

{
name:"SIGCONT",
number:18,
action:"unpause",
description:"Unpaused",
standard:"posix",
forced:true},

{
name:"SIGSTOP",
number:19,
action:"pause",
description:"Paused",
standard:"posix",
forced:true},

{
name:"SIGTSTP",
number:20,
action:"pause",
description:"Paused using CTRL-Z or \"suspend\"",
standard:"posix"},

{
name:"SIGTTIN",
number:21,
action:"pause",
description:"Background process cannot read terminal input",
standard:"posix"},

{
name:"SIGBREAK",
number:21,
action:"terminate",
description:"User interruption with CTRL-BREAK",
standard:"other"},

{
name:"SIGTTOU",
number:22,
action:"pause",
description:"Background process cannot write to terminal output",
standard:"posix"},

{
name:"SIGURG",
number:23,
action:"ignore",
description:"Socket received out-of-band data",
standard:"bsd"},

{
name:"SIGXCPU",
number:24,
action:"core",
description:"Process timed out",
standard:"bsd"},

{
name:"SIGXFSZ",
number:25,
action:"core",
description:"File too big",
standard:"bsd"},

{
name:"SIGVTALRM",
number:26,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGPROF",
number:27,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGWINCH",
number:28,
action:"ignore",
description:"Terminal window size changed",
standard:"bsd"},

{
name:"SIGIO",
number:29,
action:"terminate",
description:"I/O is available",
standard:"other"},

{
name:"SIGPOLL",
number:29,
action:"terminate",
description:"Watched event",
standard:"other"},

{
name:"SIGINFO",
number:29,
action:"ignore",
description:"Request for process information",
standard:"other"},

{
name:"SIGPWR",
number:30,
action:"terminate",
description:"Device running out of power",
standard:"systemv"},

{
name:"SIGSYS",
number:31,
action:"core",
description:"Invalid system call",
standard:"other"},

{
name:"SIGUNUSED",
number:31,
action:"terminate",
description:"Invalid system call",
standard:"other"}];exports.SIGNALS=SIGNALS;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 2779:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.signalsByNumber=exports.signalsByName=void 0;var _os=__nccwpck_require__(2087);

var _signals=__nccwpck_require__(6435);
var _realtime=__nccwpck_require__(5295);



const getSignalsByName=function(){
const signals=(0,_signals.getSignals)();
return signals.reduce(getSignalByName,{});
};

const getSignalByName=function(
signalByNameMemo,
{name,number,description,supported,action,forced,standard})
{
return{
...signalByNameMemo,
[name]:{name,number,description,supported,action,forced,standard}};

};

const signalsByName=getSignalsByName();exports.signalsByName=signalsByName;




const getSignalsByNumber=function(){
const signals=(0,_signals.getSignals)();
const length=_realtime.SIGRTMAX+1;
const signalsA=Array.from({length},(value,number)=>
getSignalByNumber(number,signals));

return Object.assign({},...signalsA);
};

const getSignalByNumber=function(number,signals){
const signal=findSignalByNumber(number,signals);

if(signal===undefined){
return{};
}

const{name,description,supported,action,forced,standard}=signal;
return{
[number]:{
name,
number,
description,
supported,
action,
forced,
standard}};


};



const findSignalByNumber=function(number,signals){
const signal=signals.find(({name})=>_os.constants.signals[name]===number);

if(signal!==undefined){
return signal;
}

return signals.find(signalA=>signalA.number===number);
};

const signalsByNumber=getSignalsByNumber();exports.signalsByNumber=signalsByNumber;
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 5295:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.SIGRTMAX=exports.getRealtimeSignals=void 0;
const getRealtimeSignals=function(){
const length=SIGRTMAX-SIGRTMIN+1;
return Array.from({length},getRealtimeSignal);
};exports.getRealtimeSignals=getRealtimeSignals;

const getRealtimeSignal=function(value,index){
return{
name:`SIGRT${index+1}`,
number:SIGRTMIN+index,
action:"terminate",
description:"Application-specific signal (realtime)",
standard:"posix"};

};

const SIGRTMIN=34;
const SIGRTMAX=64;exports.SIGRTMAX=SIGRTMAX;
//# sourceMappingURL=realtime.js.map

/***/ }),

/***/ 6435:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.getSignals=void 0;var _os=__nccwpck_require__(2087);

var _core=__nccwpck_require__(8213);
var _realtime=__nccwpck_require__(5295);



const getSignals=function(){
const realtimeSignals=(0,_realtime.getRealtimeSignals)();
const signals=[..._core.SIGNALS,...realtimeSignals].map(normalizeSignal);
return signals;
};exports.getSignals=getSignals;







const normalizeSignal=function({
name,
number:defaultNumber,
description,
action,
forced=false,
standard})
{
const{
signals:{[name]:constantSignal}}=
_os.constants;
const supported=constantSignal!==undefined;
const number=supported?constantSignal:defaultNumber;
return{name,number,description,supported,action,forced,standard};
};
//# sourceMappingURL=signals.js.map

/***/ }),

/***/ 1554:
/***/ ((module) => {

"use strict";


const isStream = stream =>
	stream !== null &&
	typeof stream === 'object' &&
	typeof stream.pipe === 'function';

isStream.writable = stream =>
	isStream(stream) &&
	stream.writable !== false &&
	typeof stream._write === 'function' &&
	typeof stream._writableState === 'object';

isStream.readable = stream =>
	isStream(stream) &&
	stream.readable !== false &&
	typeof stream._read === 'function' &&
	typeof stream._readableState === 'object';

isStream.duplex = stream =>
	isStream.writable(stream) &&
	isStream.readable(stream);

isStream.transform = stream =>
	isStream.duplex(stream) &&
	typeof stream._transform === 'function' &&
	typeof stream._transformState === 'object';

module.exports = isStream;


/***/ }),

/***/ 7126:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var fs = __nccwpck_require__(5747)
var core
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = __nccwpck_require__(2001)
} else {
  core = __nccwpck_require__(9728)
}

module.exports = isexe
isexe.sync = sync

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er)
        } else {
          resolve(is)
        }
      })
    })
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null
        is = false
      }
    }
    cb(er, is)
  })
}

function sync (path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}


/***/ }),

/***/ 9728:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __nccwpck_require__(5747)

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode
  var uid = stat.uid
  var gid = stat.gid

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid()
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid()

  var u = parseInt('100', 8)
  var g = parseInt('010', 8)
  var o = parseInt('001', 8)
  var ug = u | g

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0

  return ret
}


/***/ }),

/***/ 2001:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __nccwpck_require__(5747)

function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';')
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase()
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), path, options)
}


/***/ }),

/***/ 2621:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { PassThrough } = __nccwpck_require__(2413);

module.exports = function (/*streams...*/) {
  var sources = []
  var output  = new PassThrough({objectMode: true})

  output.setMaxListeners(0)

  output.add = add
  output.isEmpty = isEmpty

  output.on('unpipe', remove)

  Array.prototype.slice.call(arguments).forEach(add)

  return output

  function add (source) {
    if (Array.isArray(source)) {
      source.forEach(add)
      return this
    }

    sources.push(source);
    source.once('end', remove.bind(null, source))
    source.once('error', output.emit.bind(output, 'error'))
    source.pipe(output, {end: false})
    return this
  }

  function isEmpty () {
    return sources.length == 0;
  }

  function remove (source) {
    sources = sources.filter(function (it) { return it !== source })
    if (!sources.length && output.readable) { output.end() }
  }
}


/***/ }),

/***/ 6047:
/***/ ((module) => {

"use strict";


const mimicFn = (to, from) => {
	for (const prop of Reflect.ownKeys(from)) {
		Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	}

	return to;
};

module.exports = mimicFn;
// TODO: Remove this for the next major release
module.exports.default = mimicFn;


/***/ }),

/***/ 467:
/***/ ((module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Stream = _interopDefault(__nccwpck_require__(2413));
var http = _interopDefault(__nccwpck_require__(8605));
var Url = _interopDefault(__nccwpck_require__(8835));
var https = _interopDefault(__nccwpck_require__(7211));
var zlib = _interopDefault(__nccwpck_require__(8761));

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = __nccwpck_require__(2877).convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

module.exports = exports = fetch;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = exports;
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.FetchError = FetchError;


/***/ }),

/***/ 502:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const path = __nccwpck_require__(5622);
const pathKey = __nccwpck_require__(7278);

const npmRunPath = options => {
	options = {
		cwd: process.cwd(),
		path: process.env[pathKey()],
		execPath: process.execPath,
		...options
	};

	let previous;
	let cwdPath = path.resolve(options.cwd);
	const result = [];

	while (previous !== cwdPath) {
		result.push(path.join(cwdPath, 'node_modules/.bin'));
		previous = cwdPath;
		cwdPath = path.resolve(cwdPath, '..');
	}

	// Ensure the running `node` binary is used
	const execPathDir = path.resolve(options.cwd, options.execPath, '..');
	result.push(execPathDir);

	return result.concat(options.path).join(path.delimiter);
};

module.exports = npmRunPath;
// TODO: Remove this for the next major release
module.exports.default = npmRunPath;

module.exports.env = options => {
	options = {
		env: process.env,
		...options
	};

	const env = {...options.env};
	const path = pathKey({env});

	options.path = env[path];
	env[path] = module.exports(options);

	return env;
};


/***/ }),

/***/ 7278:
/***/ ((module) => {

"use strict";


const pathKey = (options = {}) => {
	const environment = options.env || process.env;
	const platform = options.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(environment).reverse().find(key => key.toUpperCase() === 'PATH') || 'Path';
};

module.exports = pathKey;
// TODO: Remove this for the next major release
module.exports.default = pathKey;


/***/ }),

/***/ 1223:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(2940)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 9082:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const mimicFn = __nccwpck_require__(6047);

const calledFunctions = new WeakMap();

const onetime = (function_, options = {}) => {
	if (typeof function_ !== 'function') {
		throw new TypeError('Expected a function');
	}

	let returnValue;
	let callCount = 0;
	const functionName = function_.displayName || function_.name || '<anonymous>';

	const onetime = function (...arguments_) {
		calledFunctions.set(onetime, ++callCount);

		if (callCount === 1) {
			returnValue = function_.apply(this, arguments_);
			function_ = null;
		} else if (options.throw === true) {
			throw new Error(`Function \`${functionName}\` can only be called once`);
		}

		return returnValue;
	};

	mimicFn(onetime, function_);
	calledFunctions.set(onetime, callCount);

	return onetime;
};

module.exports = onetime;
// TODO: Remove this for the next major release
module.exports.default = onetime;

module.exports.callCount = function_ => {
	if (!calledFunctions.has(function_)) {
		throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
	}

	return calledFunctions.get(function_);
};


/***/ }),

/***/ 5118:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/* eslint-disable node/no-deprecated-api */



var buffer = __nccwpck_require__(4293)
var Buffer = buffer.Buffer

var safer = {}

var key

for (key in buffer) {
  if (!buffer.hasOwnProperty(key)) continue
  if (key === 'SlowBuffer' || key === 'Buffer') continue
  safer[key] = buffer[key]
}

var Safer = safer.Buffer = {}
for (key in Buffer) {
  if (!Buffer.hasOwnProperty(key)) continue
  if (key === 'allocUnsafe' || key === 'allocUnsafeSlow') continue
  Safer[key] = Buffer[key]
}

safer.Buffer.prototype = Buffer.prototype

if (!Safer.from || Safer.from === Uint8Array.from) {
  Safer.from = function (value, encodingOrOffset, length) {
    if (typeof value === 'number') {
      throw new TypeError('The "value" argument must not be of type number. Received type ' + typeof value)
    }
    if (value && typeof value.length === 'undefined') {
      throw new TypeError('The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type ' + typeof value)
    }
    return Buffer(value, encodingOrOffset, length)
  }
}

if (!Safer.alloc) {
  Safer.alloc = function (size, fill, encoding) {
    if (typeof size !== 'number') {
      throw new TypeError('The "size" argument must be of type number. Received type ' + typeof size)
    }
    if (size < 0 || size >= 2 * (1 << 30)) {
      throw new RangeError('The value "' + size + '" is invalid for option "size"')
    }
    var buf = Buffer(size)
    if (!fill || fill.length === 0) {
      buf.fill(0)
    } else if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
    return buf
  }
}

if (!safer.kStringMaxLength) {
  try {
    safer.kStringMaxLength = process.binding('buffer').kStringMaxLength
  } catch (e) {
    // we can't determine kStringMaxLength in environments where process.binding
    // is unsupported, so let's not set it
  }
}

if (!safer.constants) {
  safer.constants = {
    MAX_LENGTH: safer.kMaxLength
  }
  if (safer.kStringMaxLength) {
    safer.constants.MAX_STRING_LENGTH = safer.kStringMaxLength
  }
}

module.exports = safer


/***/ }),

/***/ 7032:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const shebangRegex = __nccwpck_require__(2638);

module.exports = (string = '') => {
	const match = string.match(shebangRegex);

	if (!match) {
		return null;
	}

	const [path, argument] = match[0].replace(/#! ?/, '').split(' ');
	const binary = path.split('/').pop();

	if (binary === 'env') {
		return argument;
	}

	return argument ? `${binary} ${argument}` : binary;
};


/***/ }),

/***/ 2638:
/***/ ((module) => {

"use strict";

module.exports = /^#!(.*)/;


/***/ }),

/***/ 4931:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
var assert = __nccwpck_require__(2357)
var signals = __nccwpck_require__(3710)
var isWin = /^win/i.test(process.platform)

var EE = __nccwpck_require__(8614)
/* istanbul ignore if */
if (typeof EE !== 'function') {
  EE = EE.EventEmitter
}

var emitter
if (process.__signal_exit_emitter__) {
  emitter = process.__signal_exit_emitter__
} else {
  emitter = process.__signal_exit_emitter__ = new EE()
  emitter.count = 0
  emitter.emitted = {}
}

// Because this emitter is a global, we have to check to see if a
// previous version of this library failed to enable infinite listeners.
// I know what you're about to say.  But literally everything about
// signal-exit is a compromise with evil.  Get used to it.
if (!emitter.infinite) {
  emitter.setMaxListeners(Infinity)
  emitter.infinite = true
}

module.exports = function (cb, opts) {
  assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler')

  if (loaded === false) {
    load()
  }

  var ev = 'exit'
  if (opts && opts.alwaysLast) {
    ev = 'afterexit'
  }

  var remove = function () {
    emitter.removeListener(ev, cb)
    if (emitter.listeners('exit').length === 0 &&
        emitter.listeners('afterexit').length === 0) {
      unload()
    }
  }
  emitter.on(ev, cb)

  return remove
}

module.exports.unload = unload
function unload () {
  if (!loaded) {
    return
  }
  loaded = false

  signals.forEach(function (sig) {
    try {
      process.removeListener(sig, sigListeners[sig])
    } catch (er) {}
  })
  process.emit = originalProcessEmit
  process.reallyExit = originalProcessReallyExit
  emitter.count -= 1
}

function emit (event, code, signal) {
  if (emitter.emitted[event]) {
    return
  }
  emitter.emitted[event] = true
  emitter.emit(event, code, signal)
}

// { <signal>: <listener fn>, ... }
var sigListeners = {}
signals.forEach(function (sig) {
  sigListeners[sig] = function listener () {
    // If there are no other listeners, an exit is coming!
    // Simplest way: remove us and then re-send the signal.
    // We know that this will kill the process, so we can
    // safely emit now.
    var listeners = process.listeners(sig)
    if (listeners.length === emitter.count) {
      unload()
      emit('exit', null, sig)
      /* istanbul ignore next */
      emit('afterexit', null, sig)
      /* istanbul ignore next */
      if (isWin && sig === 'SIGHUP') {
        // "SIGHUP" throws an `ENOSYS` error on Windows,
        // so use a supported signal instead
        sig = 'SIGINT'
      }
      process.kill(process.pid, sig)
    }
  }
})

module.exports.signals = function () {
  return signals
}

module.exports.load = load

var loaded = false

function load () {
  if (loaded) {
    return
  }
  loaded = true

  // This is the number of onSignalExit's that are in play.
  // It's important so that we can count the correct number of
  // listeners on signals, and don't wait for the other one to
  // handle it instead of us.
  emitter.count += 1

  signals = signals.filter(function (sig) {
    try {
      process.on(sig, sigListeners[sig])
      return true
    } catch (er) {
      return false
    }
  })

  process.emit = processEmit
  process.reallyExit = processReallyExit
}

var originalProcessReallyExit = process.reallyExit
function processReallyExit (code) {
  process.exitCode = code || 0
  emit('exit', process.exitCode, null)
  /* istanbul ignore next */
  emit('afterexit', process.exitCode, null)
  /* istanbul ignore next */
  originalProcessReallyExit.call(process, process.exitCode)
}

var originalProcessEmit = process.emit
function processEmit (ev, arg) {
  if (ev === 'exit') {
    if (arg !== undefined) {
      process.exitCode = arg
    }
    var ret = originalProcessEmit.apply(this, arguments)
    emit('exit', process.exitCode, null)
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null)
    return ret
  } else {
    return originalProcessEmit.apply(this, arguments)
  }
}


/***/ }),

/***/ 3710:
/***/ ((module) => {

// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
]

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  )
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  )
}


/***/ }),

/***/ 792:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = {
  SFTPStream: __nccwpck_require__(1517),
  SSH2Stream: __nccwpck_require__(1788),
  utils: __nccwpck_require__(4928),
  constants: __nccwpck_require__(4617)
};

/***/ }),

/***/ 9419:
/***/ ((module) => {

module.exports = {
  readUInt32BE: function readUInt32BE(buf, offset) {
    return buf[offset++] * 16777216
           + buf[offset++] * 65536
           + buf[offset++] * 256
           + buf[offset];
  },
  writeUInt32BE: function writeUInt32BE(buf, value, offset) {
    buf[offset++] = (value >>> 24);
    buf[offset++] = (value >>> 16);
    buf[offset++] = (value >>> 8);
    buf[offset++] = value;
    return offset;
  },
  writeUInt32LE: function writeUInt32LE(buf, value, offset) {
    buf[offset++] = value;
    buf[offset++] = (value >>> 8);
    buf[offset++] = (value >>> 16);
    buf[offset++] = (value >>> 24);
    return offset;
  }
};


/***/ }),

/***/ 4617:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

var i;
var keys;
var len;

var crypto = __nccwpck_require__(6417);
var eddsaSupported = (function() {
  if (typeof crypto.sign === 'function'
      && typeof crypto.verify === 'function') {
    var key = '-----BEGIN PRIVATE KEY-----\r\nMC4CAQAwBQYDK2VwBCIEIHKj+sVa9WcD'
              + '/q2DJUJaf43Kptc8xYuUQA4bOFj9vC8T\r\n-----END PRIVATE KEY-----';
    var data = Buffer.from('a');
    var sig;
    var verified;
    try {
      sig = crypto.sign(null, data, key);
      verified = crypto.verify(null, data, key, sig);
    } catch (ex) {}
    return (Buffer.isBuffer(sig) && sig.length === 64 && verified === true);
  }

  return false;
})();

var curve25519Supported = (typeof crypto.diffieHellman === 'function'
                           && typeof crypto.generateKeyPairSync === 'function'
                           && typeof crypto.createPublicKey === 'function');

var MESSAGE = exports.MESSAGE = {
  // Transport layer protocol -- generic (1-19)
  DISCONNECT: 1,
  IGNORE: 2,
  UNIMPLEMENTED: 3,
  DEBUG: 4,
  SERVICE_REQUEST: 5,
  SERVICE_ACCEPT: 6,

  // Transport layer protocol -- algorithm negotiation (20-29)
  KEXINIT: 20,
  NEWKEYS: 21,

  // Transport layer protocol -- key exchange method-specific (30-49)

  // User auth protocol -- generic (50-59)
  USERAUTH_REQUEST: 50,
  USERAUTH_FAILURE: 51,
  USERAUTH_SUCCESS: 52,
  USERAUTH_BANNER: 53,

  // User auth protocol -- user auth method-specific (60-79)

  // Connection protocol -- generic (80-89)
  GLOBAL_REQUEST: 80,
  REQUEST_SUCCESS: 81,
  REQUEST_FAILURE: 82,

  // Connection protocol -- channel-related (90-127)
  CHANNEL_OPEN: 90,
  CHANNEL_OPEN_CONFIRMATION: 91,
  CHANNEL_OPEN_FAILURE: 92,
  CHANNEL_WINDOW_ADJUST: 93,
  CHANNEL_DATA: 94,
  CHANNEL_EXTENDED_DATA: 95,
  CHANNEL_EOF: 96,
  CHANNEL_CLOSE: 97,
  CHANNEL_REQUEST: 98,
  CHANNEL_SUCCESS: 99,
  CHANNEL_FAILURE: 100

  // Reserved for client protocols (128-191)

  // Local extensions (192-155)
};
for (i = 0, keys = Object.keys(MESSAGE), len = keys.length; i < len; ++i)
  MESSAGE[MESSAGE[keys[i]]] = keys[i];
// context-specific message codes:
MESSAGE.KEXDH_INIT = 30;
MESSAGE.KEXDH_REPLY = 31;
MESSAGE.KEXDH_GEX_REQUEST = 34;
MESSAGE.KEXDH_GEX_GROUP = 31;
MESSAGE.KEXDH_GEX_INIT = 32;
MESSAGE.KEXDH_GEX_REPLY = 33;
MESSAGE.KEXECDH_INIT = 30; // included here for completeness
MESSAGE.KEXECDH_REPLY = 31; // included here for completeness
MESSAGE.USERAUTH_PASSWD_CHANGEREQ = 60;
MESSAGE.USERAUTH_PK_OK = 60;
MESSAGE.USERAUTH_INFO_REQUEST = 60;
MESSAGE.USERAUTH_INFO_RESPONSE = 61;

var DYNAMIC_KEXDH_MESSAGE = exports.DYNAMIC_KEXDH_MESSAGE = {};
DYNAMIC_KEXDH_MESSAGE[MESSAGE.KEXDH_GEX_GROUP] = 'KEXDH_GEX_GROUP';
DYNAMIC_KEXDH_MESSAGE[MESSAGE.KEXDH_GEX_REPLY] = 'KEXDH_GEX_REPLY';

var KEXDH_MESSAGE = exports.KEXDH_MESSAGE = {};
KEXDH_MESSAGE[MESSAGE.KEXDH_INIT] = 'KEXDH_INIT';
KEXDH_MESSAGE[MESSAGE.KEXDH_REPLY] = 'KEXDH_REPLY';

var DISCONNECT_REASON = exports.DISCONNECT_REASON = {
  HOST_NOT_ALLOWED_TO_CONNECT: 1,
  PROTOCOL_ERROR: 2,
  KEY_EXCHANGE_FAILED: 3,
  RESERVED: 4,
  MAC_ERROR: 5,
  COMPRESSION_ERROR: 6,
  SERVICE_NOT_AVAILABLE: 7,
  PROTOCOL_VERSION_NOT_SUPPORTED: 8,
  HOST_KEY_NOT_VERIFIABLE: 9,
  CONNECTION_LOST: 10,
  BY_APPLICATION: 11,
  TOO_MANY_CONNECTIONS: 12,
  AUTH_CANCELED_BY_USER: 13,
  NO_MORE_AUTH_METHODS_AVAILABLE: 14,
  ILLEGAL_USER_NAME: 15
};
for (i = 0, keys = Object.keys(DISCONNECT_REASON), len = keys.length;
     i < len;
     ++i) {
  DISCONNECT_REASON[DISCONNECT_REASON[keys[i]]] = keys[i];
}

var CHANNEL_OPEN_FAILURE = exports.CHANNEL_OPEN_FAILURE = {
  ADMINISTRATIVELY_PROHIBITED: 1,
  CONNECT_FAILED: 2,
  UNKNOWN_CHANNEL_TYPE: 3,
  RESOURCE_SHORTAGE: 4
};
for (i = 0, keys = Object.keys(CHANNEL_OPEN_FAILURE), len = keys.length;
     i < len;
     ++i) {
  CHANNEL_OPEN_FAILURE[CHANNEL_OPEN_FAILURE[keys[i]]] = keys[i];
}

var TERMINAL_MODE = exports.TERMINAL_MODE = {
  TTY_OP_END: 0,        // Indicates end of options.
  VINTR: 1,             // Interrupt character; 255 if none. Similarly for the
                        //  other characters.  Not all of these characters are
                        //  supported on all systems.
  VQUIT: 2,             // The quit character (sends SIGQUIT signal on POSIX
                        //  systems).
  VERASE: 3,            // Erase the character to left of the cursor.
  VKILL: 4,             // Kill the current input line.
  VEOF: 5,              // End-of-file character (sends EOF from the terminal).
  VEOL: 6,              // End-of-line character in addition to carriage return
                        //  and/or linefeed.
  VEOL2: 7,             // Additional end-of-line character.
  VSTART: 8,            // Continues paused output (normally control-Q).
  VSTOP: 9,             // Pauses output (normally control-S).
  VSUSP: 10,            // Suspends the current program.
  VDSUSP: 11,           // Another suspend character.
  VREPRINT: 12,         // Reprints the current input line.
  VWERASE: 13,          // Erases a word left of cursor.
  VLNEXT: 14,           // Enter the next character typed literally, even if it
                        //  is a special character
  VFLUSH: 15,           // Character to flush output.
  VSWTCH: 16,           // Switch to a different shell layer.
  VSTATUS: 17,          // Prints system status line (load, command, pid, etc).
  VDISCARD: 18,         // Toggles the flushing of terminal output.
  IGNPAR: 30,           // The ignore parity flag.  The parameter SHOULD be 0
                        //  if this flag is FALSE, and 1 if it is TRUE.
  PARMRK: 31,           // Mark parity and framing errors.
  INPCK: 32,            // Enable checking of parity errors.
  ISTRIP: 33,           // Strip 8th bit off characters.
  INLCR: 34,            // Map NL into CR on input.
  IGNCR: 35,            // Ignore CR on input.
  ICRNL: 36,            // Map CR to NL on input.
  IUCLC: 37,            // Translate uppercase characters to lowercase.
  IXON: 38,             // Enable output flow control.
  IXANY: 39,            // Any char will restart after stop.
  IXOFF: 40,            // Enable input flow control.
  IMAXBEL: 41,          // Ring bell on input queue full.
  ISIG: 50,             // Enable signals INTR, QUIT, [D]SUSP.
  ICANON: 51,           // Canonicalize input lines.
  XCASE: 52,            // Enable input and output of uppercase characters by
                        //  preceding their lowercase equivalents with "\".
  ECHO: 53,             // Enable echoing.
  ECHOE: 54,            // Visually erase chars.
  ECHOK: 55,            // Kill character discards current line.
  ECHONL: 56,           // Echo NL even if ECHO is off.
  NOFLSH: 57,           // Don't flush after interrupt.
  TOSTOP: 58,           // Stop background jobs from output.
  IEXTEN: 59,           // Enable extensions.
  ECHOCTL: 60,          // Echo control characters as ^(Char).
  ECHOKE: 61,           // Visual erase for line kill.
  PENDIN: 62,           // Retype pending input.
  OPOST: 70,            // Enable output processing.
  OLCUC: 71,            // Convert lowercase to uppercase.
  ONLCR: 72,            // Map NL to CR-NL.
  OCRNL: 73,            // Translate carriage return to newline (output).
  ONOCR: 74,            // Translate newline to carriage return-newline
                        // (output).
  ONLRET: 75,           // Newline performs a carriage return (output).
  CS7: 90,              // 7 bit mode.
  CS8: 91,              // 8 bit mode.
  PARENB: 92,           // Parity enable.
  PARODD: 93,           // Odd parity, else even.
  TTY_OP_ISPEED: 128,   // Specifies the input baud rate in bits per second.
  TTY_OP_OSPEED: 129    // Specifies the output baud rate in bits per second.
};
for (i = 0, keys = Object.keys(TERMINAL_MODE), len = keys.length; i < len; ++i)
  TERMINAL_MODE[TERMINAL_MODE[keys[i]]] = keys[i];

var CHANNEL_EXTENDED_DATATYPE = exports.CHANNEL_EXTENDED_DATATYPE = {
  STDERR: 1
};
for (i = 0, keys = Object.keys(CHANNEL_EXTENDED_DATATYPE), len = keys.length;
     i < len;
     ++i) {
  CHANNEL_EXTENDED_DATATYPE[CHANNEL_EXTENDED_DATATYPE[keys[i]]] = keys[i];
}

exports.SIGNALS = ['ABRT', 'ALRM', 'FPE', 'HUP', 'ILL', 'INT',
                   'QUIT', 'SEGV', 'TERM', 'USR1', 'USR2', 'KILL',
                   'PIPE'];

var DEFAULT_KEX = [
  // https://tools.ietf.org/html/rfc5656#section-10.1
  'ecdh-sha2-nistp256',
  'ecdh-sha2-nistp384',
  'ecdh-sha2-nistp521',

  // https://tools.ietf.org/html/rfc4419#section-4
  'diffie-hellman-group-exchange-sha256',

  'diffie-hellman-group14-sha256',
  'diffie-hellman-group16-sha512',
  'diffie-hellman-group18-sha512',

  'diffie-hellman-group14-sha1', // REQUIRED
];
if (curve25519Supported) {
  DEFAULT_KEX.unshift('curve25519-sha256');
  DEFAULT_KEX.unshift('curve25519-sha256@libssh.org');
}
var SUPPORTED_KEX = [
  // https://tools.ietf.org/html/rfc4419#section-4
  'diffie-hellman-group-exchange-sha1',

  'diffie-hellman-group1-sha1'  // REQUIRED
];
var KEX_BUF = Buffer.from(DEFAULT_KEX.join(','), 'ascii');
SUPPORTED_KEX = DEFAULT_KEX.concat(SUPPORTED_KEX);

var DEFAULT_SERVER_HOST_KEY = [
  'ecdsa-sha2-nistp256',
  'ecdsa-sha2-nistp384',
  'ecdsa-sha2-nistp521',
  'ssh-rsa',
];
if (eddsaSupported)
  DEFAULT_SERVER_HOST_KEY.unshift('ssh-ed25519');
var SUPPORTED_SERVER_HOST_KEY = [
  'ssh-dss'
];
var SERVER_HOST_KEY_BUF = Buffer.from(DEFAULT_SERVER_HOST_KEY.join(','),
                                      'ascii');
SUPPORTED_SERVER_HOST_KEY = DEFAULT_SERVER_HOST_KEY.concat(
  SUPPORTED_SERVER_HOST_KEY
);

var DEFAULT_CIPHER = [
  // http://tools.ietf.org/html/rfc4344#section-4
  'aes128-ctr',
  'aes192-ctr',
  'aes256-ctr',

  // http://tools.ietf.org/html/rfc5647
  'aes128-gcm',
  'aes128-gcm@openssh.com',
  'aes256-gcm',
  'aes256-gcm@openssh.com'
];
var SUPPORTED_CIPHER = [
  'aes256-cbc',
  'aes192-cbc',
  'aes128-cbc',
  'blowfish-cbc',
  '3des-cbc',

  // http://tools.ietf.org/html/rfc4345#section-4:
  'arcfour256',
  'arcfour128',

  'cast128-cbc',
  'arcfour'
];
var CIPHER_BUF = Buffer.from(DEFAULT_CIPHER.join(','), 'ascii');
SUPPORTED_CIPHER = DEFAULT_CIPHER.concat(SUPPORTED_CIPHER);

var DEFAULT_HMAC = [
  'hmac-sha2-256',
  'hmac-sha2-512',
  'hmac-sha1',
];
var SUPPORTED_HMAC = [
  'hmac-md5',
  'hmac-sha2-256-96', // first 96 bits of HMAC-SHA256
  'hmac-sha2-512-96', // first 96 bits of HMAC-SHA512
  'hmac-ripemd160',
  'hmac-sha1-96',     // first 96 bits of HMAC-SHA1
  'hmac-md5-96'       // first 96 bits of HMAC-MD5
];
var HMAC_BUF = Buffer.from(DEFAULT_HMAC.join(','), 'ascii');
SUPPORTED_HMAC = DEFAULT_HMAC.concat(SUPPORTED_HMAC);

var DEFAULT_COMPRESS = [
  'none',
  'zlib@openssh.com', // ZLIB (LZ77) compression, except
                      // compression/decompression does not start until after
                      // successful user authentication
  'zlib'              // ZLIB (LZ77) compression
];
var SUPPORTED_COMPRESS = [];
var COMPRESS_BUF = Buffer.from(DEFAULT_COMPRESS.join(','), 'ascii');
SUPPORTED_COMPRESS = DEFAULT_COMPRESS.concat(SUPPORTED_COMPRESS);

function makeCipherInfo(blockLen, keyLen, ivLen, authLen, discardLen, stream) {
  return {
    blockLen: blockLen,
    keyLen: keyLen,
    ivLen: ivLen === 0 ? blockLen : ivLen,
    authLen: authLen,
    discardLen: discardLen,
    stream: stream,
  };
}
exports.CIPHER_INFO = {
  'aes128-gcm': makeCipherInfo(16, 16, 12, 16, 0, false),
  'aes256-gcm': makeCipherInfo(16, 32, 12, 16, 0, false),
  'aes128-gcm@openssh.com': makeCipherInfo(16, 16, 12, 16, 0, false),
  'aes256-gcm@openssh.com': makeCipherInfo(16, 32, 12, 16, 0, false),

  'aes128-cbc': makeCipherInfo(16, 16, 0, 0, 0, false),
  'aes192-cbc': makeCipherInfo(16, 24, 0, 0, 0, false),
  'aes256-cbc': makeCipherInfo(16, 32, 0, 0, 0, false),
  'rijndael-cbc@lysator.liu.se': makeCipherInfo(16, 32, 0, 0, 0, false),
  '3des-cbc': makeCipherInfo(8, 24, 0, 0, 0, false),
  'blowfish-cbc': makeCipherInfo(8, 16, 0, 0, 0, false),
  'idea-cbc': makeCipherInfo(8, 16, 0, 0, 0, false),
  'cast128-cbc': makeCipherInfo(8, 16, 0, 0, 0, false),
  'camellia128-cbc': makeCipherInfo(16, 16, 0, 0, 0, false),
  'camellia192-cbc': makeCipherInfo(16, 24, 0, 0, 0, false),
  'camellia256-cbc': makeCipherInfo(16, 32, 0, 0, 0, false),
  'camellia128-cbc@openssh.com': makeCipherInfo(16, 16, 0, 0, 0, false),
  'camellia192-cbc@openssh.com': makeCipherInfo(16, 24, 0, 0, 0, false),
  'camellia256-cbc@openssh.com': makeCipherInfo(16, 32, 0, 0, 0, false),

  'aes128-ctr': makeCipherInfo(16, 16, 0, 0, 0, false),
  'aes192-ctr': makeCipherInfo(16, 24, 0, 0, 0, false),
  'aes256-ctr': makeCipherInfo(16, 32, 0, 0, 0, false),
  '3des-ctr': makeCipherInfo(8, 24, 0, 0, 0, false),
  'blowfish-ctr': makeCipherInfo(8, 16, 0, 0, 0, false),
  'cast128-ctr': makeCipherInfo(8, 16, 0, 0, 0, false),
  'camellia128-ctr': makeCipherInfo(16, 16, 0, 0, 0, false),
  'camellia192-ctr': makeCipherInfo(16, 24, 0, 0, 0, false),
  'camellia256-ctr': makeCipherInfo(16, 32, 0, 0, 0, false),
  'camellia128-ctr@openssh.com': makeCipherInfo(16, 16, 0, 0, 0, false),
  'camellia192-ctr@openssh.com': makeCipherInfo(16, 24, 0, 0, 0, false),
  'camellia256-ctr@openssh.com': makeCipherInfo(16, 32, 0, 0, 0, false),

  /* The "arcfour128" algorithm is the RC4 cipher, as described in
     [SCHNEIER], using a 128-bit key.  The first 1536 bytes of keystream
     generated by the cipher MUST be discarded, and the first byte of the
     first encrypted packet MUST be encrypted using the 1537th byte of
     keystream.

     -- http://tools.ietf.org/html/rfc4345#section-4 */
  'arcfour': makeCipherInfo(8, 16, 0, 0, 1536, true),
  'arcfour128': makeCipherInfo(8, 16, 0, 0, 1536, true),
  'arcfour256': makeCipherInfo(8, 32, 0, 0, 1536, true),
  'arcfour512': makeCipherInfo(8, 64, 0, 0, 1536, true),
};

function makeHMACInfo(len, actualLen) {
  return { len: len, actualLen: actualLen };
}
exports.HMAC_INFO = {
  'hmac-md5': makeHMACInfo(16, 16),
  'hmac-md5-96': makeHMACInfo(16, 12),
  'hmac-ripemd160': makeHMACInfo(20, 20),
  'hmac-sha1': makeHMACInfo(20, 20),
  'hmac-sha1-96': makeHMACInfo(20, 12),
  'hmac-sha2-256': makeHMACInfo(32, 32),
  'hmac-sha2-256-96': makeHMACInfo(32, 12),
  'hmac-sha2-512': makeHMACInfo(64, 64),
  'hmac-sha2-512-96': makeHMACInfo(64, 12),
};

exports.ALGORITHMS = {
  KEX: DEFAULT_KEX,
  KEX_BUF: KEX_BUF,
  SUPPORTED_KEX: SUPPORTED_KEX,

  SERVER_HOST_KEY: DEFAULT_SERVER_HOST_KEY,
  SERVER_HOST_KEY_BUF: SERVER_HOST_KEY_BUF,
  SUPPORTED_SERVER_HOST_KEY: SUPPORTED_SERVER_HOST_KEY,

  CIPHER: DEFAULT_CIPHER,
  CIPHER_BUF: CIPHER_BUF,
  SUPPORTED_CIPHER: SUPPORTED_CIPHER,

  HMAC: DEFAULT_HMAC,
  HMAC_BUF: HMAC_BUF,
  SUPPORTED_HMAC: SUPPORTED_HMAC,

  COMPRESS: DEFAULT_COMPRESS,
  COMPRESS_BUF: COMPRESS_BUF,
  SUPPORTED_COMPRESS: SUPPORTED_COMPRESS
};
exports.SSH_TO_OPENSSL = {
  // ECDH key exchange
  'ecdh-sha2-nistp256': 'prime256v1', // OpenSSL's name for 'secp256r1'
  'ecdh-sha2-nistp384': 'secp384r1',
  'ecdh-sha2-nistp521': 'secp521r1',
  // Ciphers
  'aes128-gcm': 'aes-128-gcm',
  'aes256-gcm': 'aes-256-gcm',
  'aes128-gcm@openssh.com': 'aes-128-gcm',
  'aes256-gcm@openssh.com': 'aes-256-gcm',
  '3des-cbc': 'des-ede3-cbc',
  'blowfish-cbc': 'bf-cbc',
  'aes256-cbc': 'aes-256-cbc',
  'aes192-cbc': 'aes-192-cbc',
  'aes128-cbc': 'aes-128-cbc',
  'idea-cbc': 'idea-cbc',
  'cast128-cbc': 'cast-cbc',
  'rijndael-cbc@lysator.liu.se': 'aes-256-cbc',
  'arcfour128': 'rc4',
  'arcfour256': 'rc4',
  'arcfour512': 'rc4',
  'arcfour': 'rc4',
  'camellia128-cbc': 'camellia-128-cbc',
  'camellia192-cbc': 'camellia-192-cbc',
  'camellia256-cbc': 'camellia-256-cbc',
  'camellia128-cbc@openssh.com': 'camellia-128-cbc',
  'camellia192-cbc@openssh.com': 'camellia-192-cbc',
  'camellia256-cbc@openssh.com': 'camellia-256-cbc',
  '3des-ctr': 'des-ede3',
  'blowfish-ctr': 'bf-ecb',
  'aes256-ctr': 'aes-256-ctr',
  'aes192-ctr': 'aes-192-ctr',
  'aes128-ctr': 'aes-128-ctr',
  'cast128-ctr': 'cast5-ecb',
  'camellia128-ctr': 'camellia-128-ecb',
  'camellia192-ctr': 'camellia-192-ecb',
  'camellia256-ctr': 'camellia-256-ecb',
  'camellia128-ctr@openssh.com': 'camellia-128-ecb',
  'camellia192-ctr@openssh.com': 'camellia-192-ecb',
  'camellia256-ctr@openssh.com': 'camellia-256-ecb',
  // HMAC
  'hmac-sha1-96': 'sha1',
  'hmac-sha1': 'sha1',
  'hmac-sha2-256': 'sha256',
  'hmac-sha2-256-96': 'sha256',
  'hmac-sha2-512': 'sha512',
  'hmac-sha2-512-96': 'sha512',
  'hmac-md5-96': 'md5',
  'hmac-md5': 'md5',
  'hmac-ripemd160': 'ripemd160'
};

var BUGS = exports.BUGS = {
  BAD_DHGEX: 1,
  OLD_EXIT: 2,
  DYN_RPORT_BUG: 4
};

exports.BUGGY_IMPLS = [
  [ 'Cisco-1.25', BUGS.BAD_DHGEX ],
  [ /^[0-9.]+$/, BUGS.OLD_EXIT ], // old SSH.com implementations
  [ /^OpenSSH_5\.\d+/, BUGS.DYN_RPORT_BUG ]
];

exports.EDDSA_SUPPORTED = eddsaSupported;
exports.CURVE25519_SUPPORTED = curve25519Supported;


/***/ }),

/***/ 4950:
/***/ ((module) => {

// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);

// (public) Constructor
function BigInteger(a,b,c) {
  if(a != null)
    if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}

// return new, unset BigInteger
function nbi() { return new BigInteger(null); }

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// Set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
  var xl = x&0x3fff, xh = x>>14;
  while(--n >= 0) {
    var l = this[i]&0x3fff;
    var h = this[i++]>>14;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
    c = (l>>28)+(m>>14)+xh*h;
    w[j++] = l&0xfffffff;
  }
  return c;
}
BigInteger.prototype.am = am3;
dbits = 28;

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = (x<0)?-1:0;
  if(x > 0) this[0] = x;
  else if(x < -1) this[0] = x+this.DV;
  else this.t = 0;
}

// return bigint initialized to value
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

// (protected) set from string and radix
function bnpFromString(s,b) {
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 256) k = 8; // byte array
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else { this.fromRadix(s,b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while(--i >= 0) {
    var x = (k==8)?s[i]&0xff:intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if(sh == 0)
      this[this.t++] = x;
    else if(sh+k > this.DB) {
      this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
      this[this.t++] = (x>>(this.DB-sh));
    }
    else
      this[this.t-1] |= x<<sh;
    sh += k;
    if(sh >= this.DB) sh -= this.DB;
  }
  if(k == 8 && (s[0]&0x80) != 0) {
    this.s = -1;
    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
  }
  this.clamp();
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s&this.DM;
  while(this.t > 0 && this[this.t-1] == c) --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
  if(this.s < 0) return "-"+this.negate().toString(b);
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
  var p = this.DB-(i*this.DB)%k;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
    while(i >= 0) {
      if(p < k) {
        d = (this[i]&((1<<p)-1))<<(k-p);
        d |= this[--i]>>(p+=this.DB-k);
      }
      else {
        d = (this[i]>>(p-=k))&km;
        if(p <= 0) { p += this.DB; --i; }
      }
      if(d > 0) m = true;
      if(m) r += int2char(d);
    }
  }
  return m?r:"0";
}

// (public) -this
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

// (public) |this|
function bnAbs() { return (this.s<0)?this.negate():this; }

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s-a.s;
  if(r != 0) return r;
  var i = this.t;
  r = i-a.t;
  if(r != 0) return (this.s<0)?-r:r;
  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if(this.t <= 0) return 0;
  return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n,r) {
  var i;
  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
  for(i = n-1; i >= 0; --i) r[i] = 0;
  r.t = this.t+n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n,r) {
  for(var i = n; i < this.t; ++i) r[i-n] = this[i];
  r.t = Math.max(this.t-n,0);
  r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n,r) {
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<cbs)-1;
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
  for(i = this.t-1; i >= 0; --i) {
    r[i+ds+1] = (this[i]>>cbs)|c;
    c = (this[i]&bm)<<bs;
  }
  for(i = ds-1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t+ds+1;
  r.s = this.s;
  r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n,r) {
  r.s = this.s;
  var ds = Math.floor(n/this.DB);
  if(ds >= this.t) { r.t = 0; return; }
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<bs)-1;
  r[0] = this[ds]>>bs;
  for(var i = ds+1; i < this.t; ++i) {
    r[i-ds-1] |= (this[i]&bm)<<cbs;
    r[i-ds] = this[i]>>bs;
  }
  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
  r.t = this.t-ds;
  r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]-a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c -= a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c -= a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c<0)?-1:0;
  if(c < -1) r[i++] = this.DV+c;
  else if(c > 0) r[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a,r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i+y.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
  r.s = 0;
  r.clamp();
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2*x.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < x.t-1; ++i) {
    var c = x.am(i,x[i],r,2*i,0,1);
    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
      r[i+x.t] -= x.DV;
      r[i+x.t+1] = 1;
    }
  }
  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
  r.s = 0;
  r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m,q,r) {
  var pm = m.abs();
  if(pm.t <= 0) return;
  var pt = this.abs();
  if(pt.t < pm.t) {
    if(q != null) q.fromInt(0);
    if(r != null) this.copyTo(r);
    return;
  }
  if(r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB-nbits(pm[pm.t-1]);   // normalize modulus
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
  else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y[ys-1];
  if(y0 == 0) return;
  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
  var i = r.t, j = i-ys, t = (q==null)?nbi():q;
  y.dlShiftTo(j,t);
  if(r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t,r);
  }
  BigInteger.ONE.dlShiftTo(ys,t);
  t.subTo(y,y);  // "negative" y so we can replace sub with am later
  while(y.t < ys) y[y.t++] = 0;
  while(--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {   // Try it out
      y.dlShiftTo(j,t);
      r.subTo(t,r);
      while(r[i] < --qd) r.subTo(t,r);
    }
  }
  if(q != null) {
    r.drShiftTo(ys,q);
    if(ts != ms) BigInteger.ZERO.subTo(q,q);
  }
  r.t = ys;
  r.clamp();
  if(nsh > 0) r.rShiftTo(nsh,r); // Denormalize remainder
  if(ts < 0) BigInteger.ZERO.subTo(r,r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a,null,r);
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
  return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) { this.m = m; }
function cConvert(x) {
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) { return x; }
function cReduce(x) { x.divRemTo(this.m,null,x); }
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if(this.t < 1) return 0;
  var x = this[0];
  if((x&1) == 0) return 0;
  var y = x&3;       // y == 1/x mod 2^2
  y = (y*(2-(x&0xf)*y))&0xf; // y == 1/x mod 2^4
  y = (y*(2-(x&0xff)*y))&0xff;   // y == 1/x mod 2^8
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;    // y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y*(2-x*y%this.DV))%this.DV;       // y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y>0)?this.DV-y:-y;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t,r);
  r.divRemTo(this.m,null,r);
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while(x.t <= this.mt2) // pad x so am has enough room later
    x[x.t++] = 0;
  for(var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i]&0x7fff;
    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i+this.m.t;
    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
    // propagate carry
    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t,x);
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = "xy/R mod m"; x,y != r
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e,z) {
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
  g.copyTo(r);
  while(--i >= 0) {
    z.sqrTo(r,r2);
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e,m) {
  var z;
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e,z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

// Copyright (c) 2005-2009  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Extended JavaScript BN functions, required for RSA private ops.

// Version 1.1: new BigInteger("0", 10) returns "proper" zero
// Version 1.2: square() API, isProbablePrime fix

// (public)
function bnClone() { var r = nbi(); this.copyTo(r); return r; }

// (public) return value as integer
function bnIntValue() {
  if(this.s < 0) {
    if(this.t == 1) return this[0]-this.DV;
    else if(this.t == 0) return -1;
  }
  else if(this.t == 1) return this[0];
  else if(this.t == 0) return 0;
  // assumes 16 < DB < 32
  return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
}

// (public) return value as byte
function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }

// (public) return value as short (assumes DB>=16)
function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }

// (protected) return x s.t. r^x < DV
function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

// (public) 0 if this == 0, 1 if this > 0
function bnSigNum() {
  if(this.s < 0) return -1;
  else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
  else return 1;
}

// (protected) convert to radix string
function bnpToRadix(b) {
  if(b == null) b = 10;
  if(this.signum() == 0 || b < 2 || b > 36) return "0";
  var cs = this.chunkSize(b);
  var a = Math.pow(b,cs);
  var d = nbv(a), y = nbi(), z = nbi(), r = "";
  this.divRemTo(d,y,z);
  while(y.signum() > 0) {
    r = (a+z.intValue()).toString(b).substr(1) + r;
    y.divRemTo(d,y,z);
  }
  return z.intValue().toString(b) + r;
}

// (protected) convert from radix string
function bnpFromRadix(s,b) {
  this.fromInt(0);
  if(b == null) b = 10;
  var cs = this.chunkSize(b);
  var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
  for(var i = 0; i < s.length; ++i) {
    var x = intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
      continue;
    }
    w = b*w+x;
    if(++j >= cs) {
      this.dMultiply(d);
      this.dAddOffset(w,0);
      j = 0;
      w = 0;
    }
  }
  if(j > 0) {
    this.dMultiply(Math.pow(b,j));
    this.dAddOffset(w,0);
  }
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) alternate constructor
function bnpFromNumber(a,b,c) {
  if("number" == typeof b) {
    // new BigInteger(int,int,RNG)
    if(a < 2) this.fromInt(1);
    else {
      this.fromNumber(a,c);
      if(!this.testBit(a-1))  // force MSB set
        this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
      if(this.isEven()) this.dAddOffset(1,0); // force odd
      while(!this.isProbablePrime(b)) {
        this.dAddOffset(2,0);
        if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
      }
    }
  }
  else {
    // new BigInteger(int,RNG)
    var x = new Array(), t = a&7;
    x.length = (a>>3)+1;
    b.nextBytes(x);
    if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
    this.fromString(x,256);
  }
}

// (public) convert to bigendian byte array
function bnToByteArray() {
  var i = this.t, r = new Array();
  r[0] = this.s;
  var p = this.DB-(i*this.DB)%8, d, k = 0;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
      r[k++] = d|(this.s<<(this.DB-p));
    while(i >= 0) {
      if(p < 8) {
        d = (this[i]&((1<<p)-1))<<(8-p);
        d |= this[--i]>>(p+=this.DB-8);
      }
      else {
        d = (this[i]>>(p-=8))&0xff;
        if(p <= 0) { p += this.DB; --i; }
      }
      if((d&0x80) != 0) d |= -256;
      if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
      if(k > 0 || d != this.s) r[k++] = d;
    }
  }
  return r;
}

function bnEquals(a) { return(this.compareTo(a)==0); }
function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
function bnMax(a) { return(this.compareTo(a)>0)?this:a; }

// (protected) r = this op a (bitwise)
function bnpBitwiseTo(a,op,r) {
  var i, f, m = Math.min(a.t,this.t);
  for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
  if(a.t < this.t) {
    f = a.s&this.DM;
    for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
    r.t = this.t;
  }
  else {
    f = this.s&this.DM;
    for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
    r.t = a.t;
  }
  r.s = op(this.s,a.s);
  r.clamp();
}

// (public) this & a
function op_and(x,y) { return x&y; }
function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }

// (public) this | a
function op_or(x,y) { return x|y; }
function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }

// (public) this ^ a
function op_xor(x,y) { return x^y; }
function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }

// (public) this & ~a
function op_andnot(x,y) { return x&~y; }
function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }

// (public) ~this
function bnNot() {
  var r = nbi();
  for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
  r.t = this.t;
  r.s = ~this.s;
  return r;
}

// (public) this << n
function bnShiftLeft(n) {
  var r = nbi();
  if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
  return r;
}

// (public) this >> n
function bnShiftRight(n) {
  var r = nbi();
  if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
  return r;
}

// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
  if(x == 0) return -1;
  var r = 0;
  if((x&0xffff) == 0) { x >>= 16; r += 16; }
  if((x&0xff) == 0) { x >>= 8; r += 8; }
  if((x&0xf) == 0) { x >>= 4; r += 4; }
  if((x&3) == 0) { x >>= 2; r += 2; }
  if((x&1) == 0) ++r;
  return r;
}

// (public) returns index of lowest 1-bit (or -1 if none)
function bnGetLowestSetBit() {
  for(var i = 0; i < this.t; ++i)
    if(this[i] != 0) return i*this.DB+lbit(this[i]);
  if(this.s < 0) return this.t*this.DB;
  return -1;
}

// return number of 1 bits in x
function cbit(x) {
  var r = 0;
  while(x != 0) { x &= x-1; ++r; }
  return r;
}

// (public) return number of set bits
function bnBitCount() {
  var r = 0, x = this.s&this.DM;
  for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
  return r;
}

// (public) true iff nth bit is set
function bnTestBit(n) {
  var j = Math.floor(n/this.DB);
  if(j >= this.t) return(this.s!=0);
  return((this[j]&(1<<(n%this.DB)))!=0);
}

// (protected) this op (1<<n)
function bnpChangeBit(n,op) {
  var r = BigInteger.ONE.shiftLeft(n);
  this.bitwiseTo(r,op,r);
  return r;
}

// (public) this | (1<<n)
function bnSetBit(n) { return this.changeBit(n,op_or); }

// (public) this & ~(1<<n)
function bnClearBit(n) { return this.changeBit(n,op_andnot); }

// (public) this ^ (1<<n)
function bnFlipBit(n) { return this.changeBit(n,op_xor); }

// (protected) r = this + a
function bnpAddTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]+a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c += a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c += a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += a.s;
  }
  r.s = (c<0)?-1:0;
  if(c > 0) r[i++] = c;
  else if(c < -1) r[i++] = this.DV+c;
  r.t = i;
  r.clamp();
}

// (public) this + a
function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }

// (public) this - a
function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }

// (public) this * a
function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }

// (public) this^2
function bnSquare() { var r = nbi(); this.squareTo(r); return r; }

// (public) this / a
function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }

// (public) this % a
function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }

// (public) [this/a,this%a]
function bnDivideAndRemainder(a) {
  var q = nbi(), r = nbi();
  this.divRemTo(a,q,r);
  return new Array(q,r);
}

// (protected) this *= n, this >= 0, 1 < n < DV
function bnpDMultiply(n) {
  this[this.t] = this.am(0,n-1,this,0,0,this.t);
  ++this.t;
  this.clamp();
}

// (protected) this += n << w words, this >= 0
function bnpDAddOffset(n,w) {
  if(n == 0) return;
  while(this.t <= w) this[this.t++] = 0;
  this[w] += n;
  while(this[w] >= this.DV) {
    this[w] -= this.DV;
    if(++w >= this.t) this[this.t++] = 0;
    ++this[w];
  }
}

// A "null" reducer
function NullExp() {}
function nNop(x) { return x; }
function nMulTo(x,y,r) { x.multiplyTo(y,r); }
function nSqrTo(x,r) { x.squareTo(r); }

NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

// (public) this^e
function bnPow(e) { return this.exp(e,new NullExp()); }

// (protected) r = lower n words of "this * a", a.t <= n
// "this" should be the larger one if appropriate.
function bnpMultiplyLowerTo(a,n,r) {
  var i = Math.min(this.t+a.t,n);
  r.s = 0; // assumes a,this >= 0
  r.t = i;
  while(i > 0) r[--i] = 0;
  var j;
  for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
  for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
  r.clamp();
}

// (protected) r = "this * a" without lower n words, n > 0
// "this" should be the larger one if appropriate.
function bnpMultiplyUpperTo(a,n,r) {
  --n;
  var i = r.t = this.t+a.t-n;
  r.s = 0; // assumes a,this >= 0
  while(--i >= 0) r[i] = 0;
  for(i = Math.max(n-this.t,0); i < a.t; ++i)
    r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
  r.clamp();
  r.drShiftTo(1,r);
}

// Barrett modular reduction
function Barrett(m) {
  // setup Barrett
  this.r2 = nbi();
  this.q3 = nbi();
  BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
  this.mu = this.r2.divide(m);
  this.m = m;
}

function barrettConvert(x) {
  if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
  else if(x.compareTo(this.m) < 0) return x;
  else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
}

function barrettRevert(x) { return x; }

// x = x mod m (HAC 14.42)
function barrettReduce(x) {
  x.drShiftTo(this.m.t-1,this.r2);
  if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
  this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
  this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
  while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
  x.subTo(this.r2,x);
  while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = x^2 mod m; x != r
function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = x*y mod m; x,y != r
function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

// (public) this^e % m (HAC 14.85)
function bnModPow(e,m) {
  var i = e.bitLength(), k, r = nbv(1), z;
  if(i <= 0) return r;
  else if(i < 18) k = 1;
  else if(i < 48) k = 3;
  else if(i < 144) k = 4;
  else if(i < 768) k = 5;
  else k = 6;
  if(i < 8)
    z = new Classic(m);
  else if(m.isEven())
    z = new Barrett(m);
  else
    z = new Montgomery(m);

  // precomputation
  var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
  g[1] = z.convert(this);
  if(k > 1) {
    var g2 = nbi();
    z.sqrTo(g[1],g2);
    while(n <= km) {
      g[n] = nbi();
      z.mulTo(g2,g[n-2],g[n]);
      n += 2;
    }
  }

  var j = e.t-1, w, is1 = true, r2 = nbi(), t;
  i = nbits(e[j])-1;
  while(j >= 0) {
    if(i >= k1) w = (e[j]>>(i-k1))&km;
    else {
      w = (e[j]&((1<<(i+1))-1))<<(k1-i);
      if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
    }

    n = k;
    while((w&1) == 0) { w >>= 1; --n; }
    if((i -= n) < 0) { i += this.DB; --j; }
    if(is1) {  // ret == 1, don't bother squaring or multiplying it
      g[w].copyTo(r);
      is1 = false;
    }
    else {
      while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
      if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
      z.mulTo(r2,g[w],r);
    }

    while(j >= 0 && (e[j]&(1<<i)) == 0) {
      z.sqrTo(r,r2); t = r; r = r2; r2 = t;
      if(--i < 0) { i = this.DB-1; --j; }
    }
  }
  return z.revert(r);
}

// (public) gcd(this,a) (HAC 14.54)
function bnGCD(a) {
  var x = (this.s<0)?this.negate():this.clone();
  var y = (a.s<0)?a.negate():a.clone();
  if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
  var i = x.getLowestSetBit(), g = y.getLowestSetBit();
  if(g < 0) return x;
  if(i < g) g = i;
  if(g > 0) {
    x.rShiftTo(g,x);
    y.rShiftTo(g,y);
  }
  while(x.signum() > 0) {
    if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
    if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
    if(x.compareTo(y) >= 0) {
      x.subTo(y,x);
      x.rShiftTo(1,x);
    }
    else {
      y.subTo(x,y);
      y.rShiftTo(1,y);
    }
  }
  if(g > 0) y.lShiftTo(g,y);
  return y;
}

// (protected) this % n, n < 2^26
function bnpModInt(n) {
  if(n <= 0) return 0;
  var d = this.DV%n, r = (this.s<0)?n-1:0;
  if(this.t > 0)
    if(d == 0) r = this[0]%n;
    else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
  return r;
}

// (public) 1/this % m (HAC 14.61)
function bnModInverse(m) {
  var ac = m.isEven();
  if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
  var u = m.clone(), v = this.clone();
  var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
  while(u.signum() != 0) {
    while(u.isEven()) {
      u.rShiftTo(1,u);
      if(ac) {
        if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
        a.rShiftTo(1,a);
      }
      else if(!b.isEven()) b.subTo(m,b);
      b.rShiftTo(1,b);
    }
    while(v.isEven()) {
      v.rShiftTo(1,v);
      if(ac) {
        if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
        c.rShiftTo(1,c);
      }
      else if(!d.isEven()) d.subTo(m,d);
      d.rShiftTo(1,d);
    }
    if(u.compareTo(v) >= 0) {
      u.subTo(v,u);
      if(ac) a.subTo(c,a);
      b.subTo(d,b);
    }
    else {
      v.subTo(u,v);
      if(ac) c.subTo(a,c);
      d.subTo(b,d);
    }
  }
  if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
  if(d.compareTo(m) >= 0) return d.subtract(m);
  if(d.signum() < 0) d.addTo(m,d); else return d;
  if(d.signum() < 0) return d.add(m); else return d;
}

var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
var lplim = (1<<26)/lowprimes[lowprimes.length-1];

// (public) test primality with certainty >= 1-.5^t
function bnIsProbablePrime(t) {
  var i, x = this.abs();
  if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
    for(i = 0; i < lowprimes.length; ++i)
      if(x[0] == lowprimes[i]) return true;
    return false;
  }
  if(x.isEven()) return false;
  i = 1;
  while(i < lowprimes.length) {
    var m = lowprimes[i], j = i+1;
    while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
    m = x.modInt(m);
    while(i < j) if(m%lowprimes[i++] == 0) return false;
  }
  return x.millerRabin(t);
}

// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
function bnpMillerRabin(t) {
  var n1 = this.subtract(BigInteger.ONE);
  var k = n1.getLowestSetBit();
  if(k <= 0) return false;
  var r = n1.shiftRight(k);
  t = (t+1)>>1;
  if(t > lowprimes.length) t = lowprimes.length;
  var a = nbi();
  for(var i = 0; i < t; ++i) {
    //Pick bases at random, instead of starting at 2
    a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
    var y = a.modPow(r,this);
    if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
      var j = 1;
      while(j++ < k && y.compareTo(n1) != 0) {
        y = y.modPowInt(2,this);
        if(y.compareTo(BigInteger.ONE) == 0) return false;
      }
      if(y.compareTo(n1) != 0) return false;
    }
  }
  return true;
}

// protected
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;

// public
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

// JSBN-specific extension
BigInteger.prototype.square = bnSquare;

// Expose the Barrett function
BigInteger.prototype.Barrett = Barrett

// BigInteger interfaces not implemented in jsbn:

// BigInteger(int signum, byte[] magnitude)
// double doubleValue()
// float floatValue()
// int hashCode()
// long longValue()
// static BigInteger valueOf(long val)

module.exports = BigInteger;



/***/ }),

/***/ 8820:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// TODO:
//    * utilize `crypto.create(Private|Public)Key()` and `keyObject.export()`
//    * handle multi-line header values (OpenSSH)?
//    * more thorough validation?

var crypto = __nccwpck_require__(6417);
var cryptoSign = crypto.sign;
var cryptoVerify = crypto.verify;
var createSign = crypto.createSign;
var createVerify = crypto.createVerify;
var createDecipheriv = crypto.createDecipheriv;
var createHash = crypto.createHash;
var createHmac = crypto.createHmac;
var supportedOpenSSLCiphers = crypto.getCiphers();

var utils;
var Ber = __nccwpck_require__(970).Ber;
var bcrypt_pbkdf = __nccwpck_require__(958).pbkdf;

var bufferHelpers = __nccwpck_require__(9419);
var readUInt32BE = bufferHelpers.readUInt32BE;
var writeUInt32BE = bufferHelpers.writeUInt32BE;
var constants = __nccwpck_require__(4617);
var SUPPORTED_CIPHER = constants.ALGORITHMS.SUPPORTED_CIPHER;
var CIPHER_INFO = constants.CIPHER_INFO;
var SSH_TO_OPENSSL = constants.SSH_TO_OPENSSL;
var EDDSA_SUPPORTED = constants.EDDSA_SUPPORTED;

var SYM_HASH_ALGO = Symbol('Hash Algorithm');
var SYM_PRIV_PEM = Symbol('Private key PEM');
var SYM_PUB_PEM = Symbol('Public key PEM');
var SYM_PUB_SSH = Symbol('Public key SSH');
var SYM_DECRYPTED = Symbol('Decrypted Key');

// Create OpenSSL cipher name -> SSH cipher name conversion table
var CIPHER_INFO_OPENSSL = Object.create(null);
(function() {
  var keys = Object.keys(CIPHER_INFO);
  for (var i = 0; i < keys.length; ++i) {
    var cipherName = SSH_TO_OPENSSL[keys[i]];
    if (!cipherName || CIPHER_INFO_OPENSSL[cipherName])
      continue;
    CIPHER_INFO_OPENSSL[cipherName] = CIPHER_INFO[keys[i]];
  }
})();

var trimStart = (function() {
  if (typeof String.prototype.trimStart === 'function') {
    return function trimStart(str) {
      return str.trimStart();
    };
  }

  return function trimStart(str) {
    var start = 0;
    for (var i = 0; i < str.length; ++i) {
      switch (str.charCodeAt(i)) {
        case 32: // ' '
        case 9: // '\t'
        case 13: // '\r'
        case 10: // '\n'
        case 12: // '\f'
          ++start;
          continue;
      }
      break;
    }
    if (start === 0)
      return str;
    return str.slice(start);
  };
})();

function makePEM(type, data) {
  data = data.toString('base64');
  return '-----BEGIN ' + type + ' KEY-----\n'
         + data.replace(/.{64}/g, '$&\n')
         + (data.length % 64 ? '\n' : '')
         + '-----END ' + type + ' KEY-----';
}

function combineBuffers(buf1, buf2) {
  var result = Buffer.allocUnsafe(buf1.length + buf2.length);
  buf1.copy(result, 0);
  buf2.copy(result, buf1.length);
  return result;
}

function skipFields(buf, nfields) {
  var bufLen = buf.length;
  var pos = (buf._pos || 0);
  for (var i = 0; i < nfields; ++i) {
    var left = (bufLen - pos);
    if (pos >= bufLen || left < 4)
      return false;
    var len = readUInt32BE(buf, pos);
    if (left < 4 + len)
      return false;
    pos += 4 + len;
  }
  buf._pos = pos;
  return true;
}

function genOpenSSLRSAPub(n, e) {
  var asnWriter = new Ber.Writer();
  asnWriter.startSequence();
    // algorithm
    asnWriter.startSequence();
      asnWriter.writeOID('1.2.840.113549.1.1.1'); // rsaEncryption
      // algorithm parameters (RSA has none)
      asnWriter.writeNull();
    asnWriter.endSequence();

    // subjectPublicKey
    asnWriter.startSequence(Ber.BitString);
      asnWriter.writeByte(0x00);
      asnWriter.startSequence();
        asnWriter.writeBuffer(n, Ber.Integer);
        asnWriter.writeBuffer(e, Ber.Integer);
      asnWriter.endSequence();
    asnWriter.endSequence();
  asnWriter.endSequence();
  return makePEM('PUBLIC', asnWriter.buffer);
}

function genOpenSSHRSAPub(n, e) {
  var publicKey = Buffer.allocUnsafe(4 + 7 // "ssh-rsa"
                                     + 4 + n.length
                                     + 4 + e.length);

  writeUInt32BE(publicKey, 7, 0);
  publicKey.write('ssh-rsa', 4, 7, 'ascii');

  var i = 4 + 7;
  writeUInt32BE(publicKey, e.length, i);
  e.copy(publicKey, i += 4);

  writeUInt32BE(publicKey, n.length, i += e.length);
  n.copy(publicKey, i + 4);

  return publicKey;
}

var genOpenSSLRSAPriv = (function() {
  function genRSAASN1Buf(n, e, d, p, q, dmp1, dmq1, iqmp) {
    var asnWriter = new Ber.Writer();
    asnWriter.startSequence();
      asnWriter.writeInt(0x00, Ber.Integer);
      asnWriter.writeBuffer(n, Ber.Integer);
      asnWriter.writeBuffer(e, Ber.Integer);
      asnWriter.writeBuffer(d, Ber.Integer);
      asnWriter.writeBuffer(p, Ber.Integer);
      asnWriter.writeBuffer(q, Ber.Integer);
      asnWriter.writeBuffer(dmp1, Ber.Integer);
      asnWriter.writeBuffer(dmq1, Ber.Integer);
      asnWriter.writeBuffer(iqmp, Ber.Integer);
    asnWriter.endSequence();
    return asnWriter.buffer;
  }

  function bigIntFromBuffer(buf) {
    return BigInt('0x' + buf.toString('hex'));
  }

  function bigIntToBuffer(bn) {
    var hex = bn.toString(16);
    if ((hex.length & 1) !== 0) {
      hex = '0' + hex;
    } else {
      var sigbit = hex.charCodeAt(0);
      // BER/DER integers require leading zero byte to denote a positive value
      // when first byte >= 0x80
      if (sigbit === 56 || (sigbit >= 97 && sigbit <= 102))
        hex = '00' + hex;
    }
    return Buffer.from(hex, 'hex');
  }

  // Feature detect native BigInt availability and use it when possible
  try {
    var code = [
      'return function genOpenSSLRSAPriv(n, e, d, iqmp, p, q) {',
      '  var bn_d = bigIntFromBuffer(d);',
      '  var dmp1 = bigIntToBuffer(bn_d % (bigIntFromBuffer(p) - 1n));',
      '  var dmq1 = bigIntToBuffer(bn_d % (bigIntFromBuffer(q) - 1n));',
      '  return makePEM(\'RSA PRIVATE\', '
        + 'genRSAASN1Buf(n, e, d, p, q, dmp1, dmq1, iqmp));',
      '};'
    ].join('\n');
    return new Function(
      'bigIntFromBuffer, bigIntToBuffer, makePEM, genRSAASN1Buf',
      code
    )(bigIntFromBuffer, bigIntToBuffer, makePEM, genRSAASN1Buf);
  } catch (ex) {
    return (function() {
      var BigInteger = __nccwpck_require__(4950);
      return function genOpenSSLRSAPriv(n, e, d, iqmp, p, q) {
        var pbi = new BigInteger(p, 256);
        var qbi = new BigInteger(q, 256);
        var dbi = new BigInteger(d, 256);
        var dmp1bi = dbi.mod(pbi.subtract(BigInteger.ONE));
        var dmq1bi = dbi.mod(qbi.subtract(BigInteger.ONE));
        var dmp1 = Buffer.from(dmp1bi.toByteArray());
        var dmq1 = Buffer.from(dmq1bi.toByteArray());
        return makePEM('RSA PRIVATE',
                       genRSAASN1Buf(n, e, d, p, q, dmp1, dmq1, iqmp));
      };
    })();
  }
})();

function genOpenSSLDSAPub(p, q, g, y) {
  var asnWriter = new Ber.Writer();
  asnWriter.startSequence();
    // algorithm
    asnWriter.startSequence();
      asnWriter.writeOID('1.2.840.10040.4.1'); // id-dsa
      // algorithm parameters
      asnWriter.startSequence();
        asnWriter.writeBuffer(p, Ber.Integer);
        asnWriter.writeBuffer(q, Ber.Integer);
        asnWriter.writeBuffer(g, Ber.Integer);
      asnWriter.endSequence();
    asnWriter.endSequence();

    // subjectPublicKey
    asnWriter.startSequence(Ber.BitString);
      asnWriter.writeByte(0x00);
      asnWriter.writeBuffer(y, Ber.Integer);
    asnWriter.endSequence();
  asnWriter.endSequence();
  return makePEM('PUBLIC', asnWriter.buffer);
}

function genOpenSSHDSAPub(p, q, g, y) {
  var publicKey = Buffer.allocUnsafe(4 + 7 // ssh-dss
                                     + 4 + p.length
                                     + 4 + q.length
                                     + 4 + g.length
                                     + 4 + y.length);

  writeUInt32BE(publicKey, 7, 0);
  publicKey.write('ssh-dss', 4, 7, 'ascii');

  var i = 4 + 7;
  writeUInt32BE(publicKey, p.length, i);
  p.copy(publicKey, i += 4);

  writeUInt32BE(publicKey, q.length, i += p.length);
  q.copy(publicKey, i += 4);

  writeUInt32BE(publicKey, g.length, i += q.length);
  g.copy(publicKey, i += 4);

  writeUInt32BE(publicKey, y.length, i += g.length);
  y.copy(publicKey, i + 4);

  return publicKey;
}

function genOpenSSLDSAPriv(p, q, g, y, x) {
  var asnWriter = new Ber.Writer();
  asnWriter.startSequence();
    asnWriter.writeInt(0x00, Ber.Integer);
    asnWriter.writeBuffer(p, Ber.Integer);
    asnWriter.writeBuffer(q, Ber.Integer);
    asnWriter.writeBuffer(g, Ber.Integer);
    asnWriter.writeBuffer(y, Ber.Integer);
    asnWriter.writeBuffer(x, Ber.Integer);
  asnWriter.endSequence();
  return makePEM('DSA PRIVATE', asnWriter.buffer);
}

function genOpenSSLEdPub(pub) {
  var asnWriter = new Ber.Writer();
  asnWriter.startSequence();
    // algorithm
    asnWriter.startSequence();
      asnWriter.writeOID('1.3.101.112'); // id-Ed25519
    asnWriter.endSequence();

    // PublicKey
    asnWriter.startSequence(Ber.BitString);
      asnWriter.writeByte(0x00);
      // XXX: hack to write a raw buffer without a tag -- yuck
      asnWriter._ensure(pub.length);
      pub.copy(asnWriter._buf, asnWriter._offset, 0, pub.length);
      asnWriter._offset += pub.length;
    asnWriter.endSequence();
  asnWriter.endSequence();
  return makePEM('PUBLIC', asnWriter.buffer);
}

function genOpenSSHEdPub(pub) {
  var publicKey = Buffer.allocUnsafe(4 + 11 // ssh-ed25519
                                     + 4 + pub.length);

  writeUInt32BE(publicKey, 11, 0);
  publicKey.write('ssh-ed25519', 4, 11, 'ascii');

  writeUInt32BE(publicKey, pub.length, 15);
  pub.copy(publicKey, 19);

  return publicKey;
}

function genOpenSSLEdPriv(priv) {
  var asnWriter = new Ber.Writer();
  asnWriter.startSequence();
    // version
    asnWriter.writeInt(0x00, Ber.Integer);

    // algorithm
    asnWriter.startSequence();
      asnWriter.writeOID('1.3.101.112'); // id-Ed25519
    asnWriter.endSequence();

    // PrivateKey
    asnWriter.startSequence(Ber.OctetString);
      asnWriter.writeBuffer(priv, Ber.OctetString);
    asnWriter.endSequence();
  asnWriter.endSequence();
  return makePEM('PRIVATE', asnWriter.buffer);
}

function genOpenSSLECDSAPub(oid, Q) {
  var asnWriter = new Ber.Writer();
  asnWriter.startSequence();
    // algorithm
    asnWriter.startSequence();
      asnWriter.writeOID('1.2.840.10045.2.1'); // id-ecPublicKey
      // algorithm parameters (namedCurve)
      asnWriter.writeOID(oid);
    asnWriter.endSequence();

    // subjectPublicKey
    asnWriter.startSequence(Ber.BitString);
      asnWriter.writeByte(0x00);
      // XXX: hack to write a raw buffer without a tag -- yuck
      asnWriter._ensure(Q.length);
      Q.copy(asnWriter._buf, asnWriter._offset, 0, Q.length);
      asnWriter._offset += Q.length;
      // end hack
    asnWriter.endSequence();
  asnWriter.endSequence();
  return makePEM('PUBLIC', asnWriter.buffer);
}

function genOpenSSHECDSAPub(oid, Q) {
  var curveName;
  switch (oid) {
    case '1.2.840.10045.3.1.7':
      // prime256v1/secp256r1
      curveName = 'nistp256';
      break;
    case '1.3.132.0.34':
      // secp384r1
      curveName = 'nistp384';
      break;
    case '1.3.132.0.35':
      // secp521r1
      curveName = 'nistp521';
      break;
    default:
      return;
  }

  var publicKey = Buffer.allocUnsafe(4 + 19 // ecdsa-sha2-<curve name>
                                     + 4 + 8 // <curve name>
                                     + 4 + Q.length);

  writeUInt32BE(publicKey, 19, 0);
  publicKey.write('ecdsa-sha2-' + curveName, 4, 19, 'ascii');

  writeUInt32BE(publicKey, 8, 23);
  publicKey.write(curveName, 27, 8, 'ascii');

  writeUInt32BE(publicKey, Q.length, 35);
  Q.copy(publicKey, 39);

  return publicKey;
}

function genOpenSSLECDSAPriv(oid, pub, priv) {
  var asnWriter = new Ber.Writer();
  asnWriter.startSequence();
    // version
    asnWriter.writeInt(0x01, Ber.Integer);
    // privateKey
    asnWriter.writeBuffer(priv, Ber.OctetString);
    // parameters (optional)
    asnWriter.startSequence(0xA0);
      asnWriter.writeOID(oid);
    asnWriter.endSequence();
    // publicKey (optional)
    asnWriter.startSequence(0xA1);
      asnWriter.startSequence(Ber.BitString);
        asnWriter.writeByte(0x00);
        // XXX: hack to write a raw buffer without a tag -- yuck
        asnWriter._ensure(pub.length);
        pub.copy(asnWriter._buf, asnWriter._offset, 0, pub.length);
        asnWriter._offset += pub.length;
        // end hack
      asnWriter.endSequence();
    asnWriter.endSequence();
  asnWriter.endSequence();
  return makePEM('EC PRIVATE', asnWriter.buffer);
}

function genOpenSSLECDSAPubFromPriv(curveName, priv) {
  var tempECDH = crypto.createECDH(curveName);
  tempECDH.setPrivateKey(priv);
  return tempECDH.getPublicKey();
}

var baseKeySign = (function() {
  if (typeof cryptoSign === 'function') {
    return function sign(data) {
      var pem = this[SYM_PRIV_PEM];
      if (pem === null)
        return new Error('No private key available');
      try {
        return cryptoSign(this[SYM_HASH_ALGO], data, pem);
      } catch (ex) {
        return ex;
      }
    };
  } else {
    function trySign(signature, privKey) {
      try {
        return signature.sign(privKey);
      } catch (ex) {
        return ex;
      }
    }

    return function sign(data) {
      var pem = this[SYM_PRIV_PEM];
      if (pem === null)
        return new Error('No private key available');
      var signature = createSign(this[SYM_HASH_ALGO]);
      signature.update(data);
      return trySign(signature, pem);
    };
  }
})();

var baseKeyVerify = (function() {
  if (typeof cryptoVerify === 'function') {
    return function verify(data, signature) {
      var pem = this[SYM_PUB_PEM];
      if (pem === null)
        return new Error('No public key available');
      try {
        return cryptoVerify(this[SYM_HASH_ALGO], data, pem, signature);
      } catch (ex) {
        return ex;
      }
    };
  } else {
    function tryVerify(verifier, pubKey, signature) {
      try {
        return verifier.verify(pubKey, signature);
      } catch (ex) {
        return ex;
      }
    }

    return function verify(data, signature) {
      var pem = this[SYM_PUB_PEM];
      if (pem === null)
        return new Error('No public key available');
      var verifier = createVerify(this[SYM_HASH_ALGO]);
      verifier.update(data);
      return tryVerify(verifier, pem, signature);
    };
  }
})();

var BaseKey = {
  sign: baseKeySign,
  verify: baseKeyVerify,
  getPrivatePEM: function getPrivatePEM() {
    return this[SYM_PRIV_PEM];
  },
  getPublicPEM: function getPublicPEM() {
    return this[SYM_PUB_PEM];
  },
  getPublicSSH: function getPublicSSH() {
    return this[SYM_PUB_SSH];
  },
};



function OpenSSH_Private(type, comment, privPEM, pubPEM, pubSSH, algo, decrypted) {
  this.type = type;
  this.comment = comment;
  this[SYM_PRIV_PEM] = privPEM;
  this[SYM_PUB_PEM] = pubPEM;
  this[SYM_PUB_SSH] = pubSSH;
  this[SYM_HASH_ALGO] = algo;
  this[SYM_DECRYPTED] = decrypted;
}
OpenSSH_Private.prototype = BaseKey;
(function() {
  var regexp = /^-----BEGIN OPENSSH PRIVATE KEY-----(?:\r\n|\n)([\s\S]+)(?:\r\n|\n)-----END OPENSSH PRIVATE KEY-----$/;
  OpenSSH_Private.parse = function(str, passphrase) {
    var m = regexp.exec(str);
    if (m === null)
      return null;
    var ret;
    var data = Buffer.from(m[1], 'base64');
    if (data.length < 31) // magic (+ magic null term.) + minimum field lengths
      return new Error('Malformed OpenSSH private key');
    var magic = data.toString('ascii', 0, 15);
    if (magic !== 'openssh-key-v1\0')
      return new Error('Unsupported OpenSSH key magic: ' + magic);

    // avoid cyclic require by requiring on first use
    if (!utils)
      utils = __nccwpck_require__(4928);

    var cipherName = utils.readString(data, 15, 'ascii');
    if (cipherName === false)
      return new Error('Malformed OpenSSH private key');
    if (cipherName !== 'none' && SUPPORTED_CIPHER.indexOf(cipherName) === -1)
      return new Error('Unsupported cipher for OpenSSH key: ' + cipherName);

    var kdfName = utils.readString(data, data._pos, 'ascii');
    if (kdfName === false)
      return new Error('Malformed OpenSSH private key');
    if (kdfName !== 'none') {
      if (cipherName === 'none')
        return new Error('Malformed OpenSSH private key');
      if (kdfName !== 'bcrypt')
        return new Error('Unsupported kdf name for OpenSSH key: ' + kdfName);
      if (!passphrase) {
        return new Error(
          'Encrypted private OpenSSH key detected, but no passphrase given'
        );
      }
    } else if (cipherName !== 'none') {
      return new Error('Malformed OpenSSH private key');
    }

    var encInfo;
    var cipherKey;
    var cipherIV;
    if (cipherName !== 'none')
      encInfo = CIPHER_INFO[cipherName];
    var kdfOptions = utils.readString(data, data._pos);
    if (kdfOptions === false)
      return new Error('Malformed OpenSSH private key');
    if (kdfOptions.length) {
      switch (kdfName) {
        case 'none':
          return new Error('Malformed OpenSSH private key');
        case 'bcrypt':
          /*
            string salt
            uint32 rounds
          */
          var salt = utils.readString(kdfOptions, 0);
          if (salt === false || kdfOptions._pos + 4 > kdfOptions.length)
            return new Error('Malformed OpenSSH private key');
          var rounds = readUInt32BE(kdfOptions, kdfOptions._pos);
          var gen = Buffer.allocUnsafe(encInfo.keyLen + encInfo.ivLen);
          var r = bcrypt_pbkdf(passphrase,
                               passphrase.length,
                               salt,
                               salt.length,
                               gen,
                               gen.length,
                               rounds);
          if (r !== 0)
            return new Error('Failed to generate information to decrypt key');
          cipherKey = gen.slice(0, encInfo.keyLen);
          cipherIV = gen.slice(encInfo.keyLen);
          break;
      }
    } else if (kdfName !== 'none') {
      return new Error('Malformed OpenSSH private key');
    }

    var keyCount = utils.readInt(data, data._pos);
    if (keyCount === false)
      return new Error('Malformed OpenSSH private key');
    data._pos += 4;

    if (keyCount > 0) {
      // TODO: place sensible limit on max `keyCount`

      // Read public keys first
      for (var i = 0; i < keyCount; ++i) {
        var pubData = utils.readString(data, data._pos);
        if (pubData === false)
          return new Error('Malformed OpenSSH private key');
        var type = utils.readString(pubData, 0, 'ascii');
        if (type === false)
          return new Error('Malformed OpenSSH private key');
      }

      var privBlob = utils.readString(data, data._pos);
      if (privBlob === false)
        return new Error('Malformed OpenSSH private key');

      if (cipherKey !== undefined) {
        // encrypted private key(s)
        if (privBlob.length < encInfo.blockLen
            || (privBlob.length % encInfo.blockLen) !== 0) {
          return new Error('Malformed OpenSSH private key');
        }
        try {
          var options = { authTagLength: encInfo.authLen };
          var decipher = createDecipheriv(SSH_TO_OPENSSL[cipherName],
                                          cipherKey,
                                          cipherIV,
                                          options);
          if (encInfo.authLen > 0) {
            if (data.length - data._pos < encInfo.authLen)
              return new Error('Malformed OpenSSH private key');
            decipher.setAuthTag(
              data.slice(data._pos, data._pos += encInfo.authLen)
            );
          }
          privBlob = combineBuffers(decipher.update(privBlob),
                                    decipher.final());
        } catch (ex) {
          return ex;
        }
      }
      // Nothing should we follow the private key(s), except a possible
      // authentication tag for relevant ciphers
      if (data._pos !== data.length)
        return new Error('Malformed OpenSSH private key');

      ret = parseOpenSSHPrivKeys(privBlob, keyCount, cipherKey !== undefined);
    } else {
      ret = [];
    }
    return ret;
  };

  function parseOpenSSHPrivKeys(data, nkeys, decrypted) {
    var keys = [];
    /*
      uint32	checkint
      uint32	checkint
      string	privatekey1
      string	comment1
      string	privatekey2
      string	comment2
      ...
      string	privatekeyN
      string	commentN
      char	1
      char	2
      char	3
      ...
      char	padlen % 255
    */
    if (data.length < 8)
      return new Error('Malformed OpenSSH private key');
    var check1 = readUInt32BE(data, 0);
    var check2 = readUInt32BE(data, 4);
    if (check1 !== check2) {
      if (decrypted)
        return new Error('OpenSSH key integrity check failed -- bad passphrase?');
      return new Error('OpenSSH key integrity check failed');
    }
    data._pos = 8;
    var i;
    var oid;
    for (i = 0; i < nkeys; ++i) {
      var algo = undefined;
      var privPEM = undefined;
      var pubPEM = undefined;
      var pubSSH = undefined;
      // The OpenSSH documentation for the key format actually lies, the entirety
      // of the private key content is not contained with a string field, it's
      // actually the literal contents of the private key, so to be able to find
      // the end of the key data you need to know the layout/format of each key
      // type ...
      var type = utils.readString(data, data._pos, 'ascii');
      if (type === false)
        return new Error('Malformed OpenSSH private key');

      switch (type) {
        case 'ssh-rsa':
          /*
            string  n -- public
            string  e -- public
            string  d -- private
            string  iqmp -- private
            string  p -- private
            string  q -- private
          */
          var n = utils.readString(data, data._pos);
          if (n === false)
            return new Error('Malformed OpenSSH private key');
          var e = utils.readString(data, data._pos);
          if (e === false)
            return new Error('Malformed OpenSSH private key');
          var d = utils.readString(data, data._pos);
          if (d === false)
            return new Error('Malformed OpenSSH private key');
          var iqmp = utils.readString(data, data._pos);
          if (iqmp === false)
            return new Error('Malformed OpenSSH private key');
          var p = utils.readString(data, data._pos);
          if (p === false)
            return new Error('Malformed OpenSSH private key');
          var q = utils.readString(data, data._pos);
          if (q === false)
            return new Error('Malformed OpenSSH private key');

          pubPEM = genOpenSSLRSAPub(n, e);
          pubSSH = genOpenSSHRSAPub(n, e);
          privPEM = genOpenSSLRSAPriv(n, e, d, iqmp, p, q);
          algo = 'sha1';
          break;
        case 'ssh-dss':
          /*
            string  p -- public
            string  q -- public
            string  g -- public
            string  y -- public
            string  x -- private
          */
          var p = utils.readString(data, data._pos);
          if (p === false)
            return new Error('Malformed OpenSSH private key');
          var q = utils.readString(data, data._pos);
          if (q === false)
            return new Error('Malformed OpenSSH private key');
          var g = utils.readString(data, data._pos);
          if (g === false)
            return new Error('Malformed OpenSSH private key');
          var y = utils.readString(data, data._pos);
          if (y === false)
            return new Error('Malformed OpenSSH private key');
          var x = utils.readString(data, data._pos);
          if (x === false)
            return new Error('Malformed OpenSSH private key');

          pubPEM = genOpenSSLDSAPub(p, q, g, y);
          pubSSH = genOpenSSHDSAPub(p, q, g, y);
          privPEM = genOpenSSLDSAPriv(p, q, g, y, x);
          algo = 'sha1';
          break;
        case 'ssh-ed25519':
          if (!EDDSA_SUPPORTED)
            return new Error('Unsupported OpenSSH private key type: ' + type);
          /*
            * string  public key
            * string  private key + public key
          */
          var edpub = utils.readString(data, data._pos);
          if (edpub === false || edpub.length !== 32)
            return new Error('Malformed OpenSSH private key');
          var edpriv = utils.readString(data, data._pos);
          if (edpriv === false || edpriv.length !== 64)
            return new Error('Malformed OpenSSH private key');

          pubPEM = genOpenSSLEdPub(edpub);
          pubSSH = genOpenSSHEdPub(edpub);
          privPEM = genOpenSSLEdPriv(edpriv.slice(0, 32));
          algo = null;
          break;
        case 'ecdsa-sha2-nistp256':
          algo = 'sha256';
          oid = '1.2.840.10045.3.1.7';
        case 'ecdsa-sha2-nistp384':
          if (algo === undefined) {
            algo = 'sha384';
            oid = '1.3.132.0.34';
          }
        case 'ecdsa-sha2-nistp521':
          if (algo === undefined) {
            algo = 'sha512';
            oid = '1.3.132.0.35';
          }
          /*
            string  curve name
            string  Q -- public
            string  d -- private
          */
          // TODO: validate curve name against type
          if (!skipFields(data, 1)) // Skip curve name
            return new Error('Malformed OpenSSH private key');
          var ecpub = utils.readString(data, data._pos);
          if (ecpub === false)
            return new Error('Malformed OpenSSH private key');
          var ecpriv = utils.readString(data, data._pos);
          if (ecpriv === false)
            return new Error('Malformed OpenSSH private key');

          pubPEM = genOpenSSLECDSAPub(oid, ecpub);
          pubSSH = genOpenSSHECDSAPub(oid, ecpub);
          privPEM = genOpenSSLECDSAPriv(oid, ecpub, ecpriv);
          break;
        default:
          return new Error('Unsupported OpenSSH private key type: ' + type);
      }

      var privComment = utils.readString(data, data._pos, 'utf8');
      if (privComment === false)
        return new Error('Malformed OpenSSH private key');

      keys.push(
        new OpenSSH_Private(type, privComment, privPEM, pubPEM, pubSSH, algo,
                            decrypted)
      );
    }
    var cnt = 0;
    for (i = data._pos; i < data.length; ++i) {
      if (data[i] !== (++cnt % 255))
        return new Error('Malformed OpenSSH private key');
    }

    return keys;
  }
})();



function OpenSSH_Old_Private(type, comment, privPEM, pubPEM, pubSSH, algo, decrypted) {
  this.type = type;
  this.comment = comment;
  this[SYM_PRIV_PEM] = privPEM;
  this[SYM_PUB_PEM] = pubPEM;
  this[SYM_PUB_SSH] = pubSSH;
  this[SYM_HASH_ALGO] = algo;
  this[SYM_DECRYPTED] = decrypted;
}
OpenSSH_Old_Private.prototype = BaseKey;
(function() {
  var regexp = /^-----BEGIN (RSA|DSA|EC) PRIVATE KEY-----(?:\r\n|\n)((?:[^:]+:\s*[\S].*(?:\r\n|\n))*)([\s\S]+)(?:\r\n|\n)-----END (RSA|DSA|EC) PRIVATE KEY-----$/;
  OpenSSH_Old_Private.parse = function(str, passphrase) {
    var m = regexp.exec(str);
    if (m === null)
      return null;
    var privBlob = Buffer.from(m[3], 'base64');
    var headers = m[2];
    var decrypted = false;
    if (headers !== undefined) {
      // encrypted key
      headers = headers.split(/\r\n|\n/g);
      for (var i = 0; i < headers.length; ++i) {
        var header = headers[i];
        var sepIdx = header.indexOf(':');
        if (header.slice(0, sepIdx) === 'DEK-Info') {
          var val = header.slice(sepIdx + 2);
          sepIdx = val.indexOf(',');
          if (sepIdx === -1)
            continue;
          var cipherName = val.slice(0, sepIdx).toLowerCase();
          if (supportedOpenSSLCiphers.indexOf(cipherName) === -1) {
            return new Error(
              'Cipher ('
              + cipherName
              + ') not supported for encrypted OpenSSH private key'
            );
          }
          var encInfo = CIPHER_INFO_OPENSSL[cipherName];
          if (!encInfo) {
            return new Error(
              'Cipher ('
              + cipherName
              + ') not supported for encrypted OpenSSH private key'
            );
          }
          var cipherIV = Buffer.from(val.slice(sepIdx + 1), 'hex');
          if (cipherIV.length !== encInfo.ivLen)
            return new Error('Malformed encrypted OpenSSH private key');
          if (!passphrase) {
            return new Error(
              'Encrypted OpenSSH private key detected, but no passphrase given'
            );
          }
          var cipherKey = createHash('md5')
                            .update(passphrase)
                            .update(cipherIV.slice(0, 8))
                            .digest();
          while (cipherKey.length < encInfo.keyLen) {
            cipherKey = combineBuffers(
              cipherKey,
              (createHash('md5')
                .update(cipherKey)
                .update(passphrase)
                .update(cipherIV)
                .digest()).slice(0, 8)
            );
          }
          if (cipherKey.length > encInfo.keyLen)
            cipherKey = cipherKey.slice(0, encInfo.keyLen);
          try {
            var decipher = createDecipheriv(cipherName, cipherKey, cipherIV);
            decipher.setAutoPadding(false);
            privBlob = combineBuffers(decipher.update(privBlob),
                                      decipher.final());
            decrypted = true;
          } catch (ex) {
            return ex;
          }
        }
      }
    }

    var type;
    var privPEM;
    var pubPEM;
    var pubSSH;
    var algo;
    var reader;
    var errMsg = 'Malformed OpenSSH private key';
    if (decrypted)
      errMsg += '. Bad passphrase?';
    switch (m[1]) {
      case 'RSA':
        type = 'ssh-rsa';
        privPEM = makePEM('RSA PRIVATE', privBlob);
        try {
          reader = new Ber.Reader(privBlob);
          reader.readSequence();
          reader.readInt(); // skip version
          var n = reader.readString(Ber.Integer, true);
          if (n === null)
            return new Error(errMsg);
          var e = reader.readString(Ber.Integer, true);
          if (e === null)
            return new Error(errMsg);
          pubPEM = genOpenSSLRSAPub(n, e);
          pubSSH = genOpenSSHRSAPub(n, e);
        } catch (ex) {
          return new Error(errMsg);
        }
        algo = 'sha1';
        break;
      case 'DSA':
        type = 'ssh-dss';
        privPEM = makePEM('DSA PRIVATE', privBlob);
        try {
          reader = new Ber.Reader(privBlob);
          reader.readSequence();
          reader.readInt(); // skip version
          var p = reader.readString(Ber.Integer, true);
          if (p === null)
            return new Error(errMsg);
          var q = reader.readString(Ber.Integer, true);
          if (q === null)
            return new Error(errMsg);
          var g = reader.readString(Ber.Integer, true);
          if (g === null)
            return new Error(errMsg);
          var y = reader.readString(Ber.Integer, true);
          if (y === null)
            return new Error(errMsg);
          pubPEM = genOpenSSLDSAPub(p, q, g, y);
          pubSSH = genOpenSSHDSAPub(p, q, g, y);
        } catch (ex) {
          return new Error(errMsg);
        }
        algo = 'sha1';
        break;
      case 'EC':
        var ecSSLName;
        var ecPriv;
        try {
          reader = new Ber.Reader(privBlob);
          reader.readSequence();
          reader.readInt(); // skip version
          ecPriv = reader.readString(Ber.OctetString, true);
          reader.readByte(); // Skip "complex" context type byte
          var offset = reader.readLength(); // Skip context length
          if (offset !== null) {
            reader._offset = offset;
            var oid = reader.readOID();
            if (oid === null)
              return new Error(errMsg);
            switch (oid) {
              case '1.2.840.10045.3.1.7':
                // prime256v1/secp256r1
                ecSSLName = 'prime256v1';
                type = 'ecdsa-sha2-nistp256';
                algo = 'sha256';
                break;
              case '1.3.132.0.34':
                // secp384r1
                ecSSLName = 'secp384r1';
                type = 'ecdsa-sha2-nistp384';
                algo = 'sha384';
                break;
              case '1.3.132.0.35':
                // secp521r1
                ecSSLName = 'secp521r1';
                type = 'ecdsa-sha2-nistp521';
                algo = 'sha512';
                break;
              default:
                return new Error('Unsupported private key EC OID: ' + oid);
            }
          } else {
            return new Error(errMsg);
          }
        } catch (ex) {
          return new Error(errMsg);
        }
        privPEM = makePEM('EC PRIVATE', privBlob);
        var pubBlob = genOpenSSLECDSAPubFromPriv(ecSSLName, ecPriv);
        pubPEM = genOpenSSLECDSAPub(oid, pubBlob);
        pubSSH = genOpenSSHECDSAPub(oid, pubBlob);
        break;
    }

    return new OpenSSH_Old_Private(type, '', privPEM, pubPEM, pubSSH, algo,
                                   decrypted);
  };
})();



function PPK_Private(type, comment, privPEM, pubPEM, pubSSH, algo, decrypted) {
  this.type = type;
  this.comment = comment;
  this[SYM_PRIV_PEM] = privPEM;
  this[SYM_PUB_PEM] = pubPEM;
  this[SYM_PUB_SSH] = pubSSH;
  this[SYM_HASH_ALGO] = algo;
  this[SYM_DECRYPTED] = decrypted;
}
PPK_Private.prototype = BaseKey;
(function() {
  var EMPTY_PASSPHRASE = Buffer.alloc(0);
  var PPK_IV = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  var PPK_PP1 = Buffer.from([0, 0, 0, 0]);
  var PPK_PP2 = Buffer.from([0, 0, 0, 1]);
  var regexp = /^PuTTY-User-Key-File-2: (ssh-(?:rsa|dss))\r?\nEncryption: (aes256-cbc|none)\r?\nComment: ([^\r\n]*)\r?\nPublic-Lines: \d+\r?\n([\s\S]+?)\r?\nPrivate-Lines: \d+\r?\n([\s\S]+?)\r?\nPrivate-MAC: ([^\r\n]+)/;
  PPK_Private.parse = function(str, passphrase) {
    var m = regexp.exec(str);
    if (m === null)
      return null;
    // m[1] = key type
    // m[2] = encryption type
    // m[3] = comment
    // m[4] = base64-encoded public key data:
    //         for "ssh-rsa":
    //          string "ssh-rsa"
    //          mpint  e    (public exponent)
    //          mpint  n    (modulus)
    //         for "ssh-dss":
    //          string "ssh-dss"
    //          mpint p     (modulus)
    //          mpint q     (prime)
    //          mpint g     (base number)
    //          mpint y     (public key parameter: g^x mod p)
    // m[5] = base64-encoded private key data:
    //         for "ssh-rsa":
    //          mpint  d    (private exponent)
    //          mpint  p    (prime 1)
    //          mpint  q    (prime 2)
    //          mpint  iqmp ([inverse of q] mod p)
    //         for "ssh-dss":
    //          mpint x     (private key parameter)
    // m[6] = SHA1 HMAC over:
    //          string  name of algorithm ("ssh-dss", "ssh-rsa")
    //          string  encryption type
    //          string  comment
    //          string  public key data
    //          string  private-plaintext (including the final padding)
    var cipherName = m[2];
    var encrypted = (cipherName !== 'none');
    if (encrypted && !passphrase) {
      return new Error(
        'Encrypted PPK private key detected, but no passphrase given'
      );
    }

    var privBlob = Buffer.from(m[5], 'base64');

    if (encrypted) {
      var encInfo = CIPHER_INFO[cipherName];
      var cipherKey = combineBuffers(
        createHash('sha1').update(PPK_PP1).update(passphrase).digest(),
        createHash('sha1').update(PPK_PP2).update(passphrase).digest()
      );
      if (cipherKey.length > encInfo.keyLen)
        cipherKey = cipherKey.slice(0, encInfo.keyLen);
      try {
        var decipher = createDecipheriv(SSH_TO_OPENSSL[cipherName],
                                        cipherKey,
                                        PPK_IV);
        decipher.setAutoPadding(false);
        privBlob = combineBuffers(decipher.update(privBlob),
                                  decipher.final());
        decrypted = true;
      } catch (ex) {
        return ex;
      }
    }

    var type = m[1];
    var comment = m[3];
    var pubBlob = Buffer.from(m[4], 'base64');

    var mac = m[6];
    var typeLen = type.length;
    var cipherNameLen = cipherName.length;
    var commentLen = Buffer.byteLength(comment);
    var pubLen = pubBlob.length;
    var privLen = privBlob.length;
    var macData = Buffer.allocUnsafe(4 + typeLen
                                     + 4 + cipherNameLen
                                     + 4 + commentLen
                                     + 4 + pubLen
                                     + 4 + privLen);
    var p = 0;

    writeUInt32BE(macData, typeLen, p);
    macData.write(type, p += 4, typeLen, 'ascii');
    writeUInt32BE(macData, cipherNameLen, p += typeLen);
    macData.write(cipherName, p += 4, cipherNameLen, 'ascii');
    writeUInt32BE(macData, commentLen, p += cipherNameLen);
    macData.write(comment, p += 4, commentLen, 'utf8');
    writeUInt32BE(macData, pubLen, p += commentLen);
    pubBlob.copy(macData, p += 4);
    writeUInt32BE(macData, privLen, p += pubLen);
    privBlob.copy(macData, p + 4);

    if (!passphrase)
      passphrase = EMPTY_PASSPHRASE;

    var calcMAC = createHmac('sha1',
                             createHash('sha1')
                               .update('putty-private-key-file-mac-key')
                               .update(passphrase)
                               .digest())
                    .update(macData)
                    .digest('hex');

    if (calcMAC !== mac) {
      if (encrypted) {
        return new Error(
          'PPK private key integrity check failed -- bad passphrase?'
        );
      } else {
        return new Error('PPK private key integrity check failed');
      }
    }

    // avoid cyclic require by requiring on first use
    if (!utils)
      utils = __nccwpck_require__(4928);

    var pubPEM;
    var pubSSH;
    var privPEM;
    pubBlob._pos = 0;
    skipFields(pubBlob, 1); // skip (duplicate) key type
    switch (type) {
      case 'ssh-rsa':
        var e = utils.readString(pubBlob, pubBlob._pos);
        if (e === false)
          return new Error('Malformed PPK public key');
        var n = utils.readString(pubBlob, pubBlob._pos);
        if (n === false)
          return new Error('Malformed PPK public key');
        var d = utils.readString(privBlob, 0);
        if (d === false)
          return new Error('Malformed PPK private key');
        var p = utils.readString(privBlob, privBlob._pos);
        if (p === false)
          return new Error('Malformed PPK private key');
        var q = utils.readString(privBlob, privBlob._pos);
        if (q === false)
          return new Error('Malformed PPK private key');
        var iqmp = utils.readString(privBlob, privBlob._pos);
        if (iqmp === false)
          return new Error('Malformed PPK private key');
        pubPEM = genOpenSSLRSAPub(n, e);
        pubSSH = genOpenSSHRSAPub(n, e);
        privPEM = genOpenSSLRSAPriv(n, e, d, iqmp, p, q);
        break;
      case 'ssh-dss':
        var p = utils.readString(pubBlob, pubBlob._pos);
        if (p === false)
          return new Error('Malformed PPK public key');
        var q = utils.readString(pubBlob, pubBlob._pos);
        if (q === false)
          return new Error('Malformed PPK public key');
        var g = utils.readString(pubBlob, pubBlob._pos);
        if (g === false)
          return new Error('Malformed PPK public key');
        var y = utils.readString(pubBlob, pubBlob._pos);
        if (y === false)
          return new Error('Malformed PPK public key');
        var x = utils.readString(privBlob, 0);
        if (x === false)
          return new Error('Malformed PPK private key');

        pubPEM = genOpenSSLDSAPub(p, q, g, y);
        pubSSH = genOpenSSHDSAPub(p, q, g, y);
        privPEM = genOpenSSLDSAPriv(p, q, g, y, x);
        break;
    }

    return new PPK_Private(type, comment, privPEM, pubPEM, pubSSH, 'sha1',
                           encrypted);
  };
})();


function parseDER(data, baseType, comment, fullType) {
  // avoid cyclic require by requiring on first use
  if (!utils)
    utils = __nccwpck_require__(4928);

  var algo;
  var pubPEM = null;
  var pubSSH = null;
  switch (baseType) {
    case 'ssh-rsa':
      var e = utils.readString(data, data._pos);
      if (e === false)
        return new Error('Malformed OpenSSH public key');
      var n = utils.readString(data, data._pos);
      if (n === false)
        return new Error('Malformed OpenSSH public key');
      pubPEM = genOpenSSLRSAPub(n, e);
      pubSSH = genOpenSSHRSAPub(n, e);
      algo = 'sha1';
      break;
    case 'ssh-dss':
      var p = utils.readString(data, data._pos);
      if (p === false)
        return new Error('Malformed OpenSSH public key');
      var q = utils.readString(data, data._pos);
      if (q === false)
        return new Error('Malformed OpenSSH public key');
      var g = utils.readString(data, data._pos);
      if (g === false)
        return new Error('Malformed OpenSSH public key');
      var y = utils.readString(data, data._pos);
      if (y === false)
        return new Error('Malformed OpenSSH public key');
      pubPEM = genOpenSSLDSAPub(p, q, g, y);
      pubSSH = genOpenSSHDSAPub(p, q, g, y);
      algo = 'sha1';
      break;
    case 'ssh-ed25519':
      var edpub = utils.readString(data, data._pos);
      if (edpub === false || edpub.length !== 32)
        return new Error('Malformed OpenSSH public key');
      pubPEM = genOpenSSLEdPub(edpub);
      pubSSH = genOpenSSHEdPub(edpub);
      algo = null;
      break;
    case 'ecdsa-sha2-nistp256':
      algo = 'sha256';
      oid = '1.2.840.10045.3.1.7';
    case 'ecdsa-sha2-nistp384':
      if (algo === undefined) {
        algo = 'sha384';
        oid = '1.3.132.0.34';
      }
    case 'ecdsa-sha2-nistp521':
      if (algo === undefined) {
        algo = 'sha512';
        oid = '1.3.132.0.35';
      }
      // TODO: validate curve name against type
      if (!skipFields(data, 1)) // Skip curve name
        return new Error('Malformed OpenSSH public key');
      var ecpub = utils.readString(data, data._pos);
      if (ecpub === false)
        return new Error('Malformed OpenSSH public key');
      pubPEM = genOpenSSLECDSAPub(oid, ecpub);
      pubSSH = genOpenSSHECDSAPub(oid, ecpub);
      break;
    default:
      return new Error('Unsupported OpenSSH public key type: ' + baseType);
  }

  return new OpenSSH_Public(fullType, comment, pubPEM, pubSSH, algo);
}
function OpenSSH_Public(type, comment, pubPEM, pubSSH, algo) {
  this.type = type;
  this.comment = comment;
  this[SYM_PRIV_PEM] = null;
  this[SYM_PUB_PEM] = pubPEM;
  this[SYM_PUB_SSH] = pubSSH;
  this[SYM_HASH_ALGO] = algo;
  this[SYM_DECRYPTED] = false;
}
OpenSSH_Public.prototype = BaseKey;
(function() {
  var regexp;
  if (EDDSA_SUPPORTED)
    regexp = /^(((?:ssh-(?:rsa|dss|ed25519))|ecdsa-sha2-nistp(?:256|384|521))(?:-cert-v0[01]@openssh.com)?) ([A-Z0-9a-z\/+=]+)(?:$|\s+([\S].*)?)$/;
  else
    regexp = /^(((?:ssh-(?:rsa|dss))|ecdsa-sha2-nistp(?:256|384|521))(?:-cert-v0[01]@openssh.com)?) ([A-Z0-9a-z\/+=]+)(?:$|\s+([\S].*)?)$/;
  OpenSSH_Public.parse = function(str) {
    var m = regexp.exec(str);
    if (m === null)
      return null;
    // m[1] = full type
    // m[2] = base type
    // m[3] = base64-encoded public key
    // m[4] = comment

    // avoid cyclic require by requiring on first use
    if (!utils)
      utils = __nccwpck_require__(4928);

    var fullType = m[1];
    var baseType = m[2];
    var data = Buffer.from(m[3], 'base64');
    var comment = (m[4] || '');

    var type = utils.readString(data, data._pos, 'ascii');
    if (type === false || type.indexOf(baseType) !== 0)
      return new Error('Malformed OpenSSH public key');

    return parseDER(data, baseType, comment, fullType);
  };
})();



function RFC4716_Public(type, comment, pubPEM, pubSSH, algo) {
  this.type = type;
  this.comment = comment;
  this[SYM_PRIV_PEM] = null;
  this[SYM_PUB_PEM] = pubPEM;
  this[SYM_PUB_SSH] = pubSSH;
  this[SYM_HASH_ALGO] = algo;
  this[SYM_DECRYPTED] = false;
}
RFC4716_Public.prototype = BaseKey;
(function() {
  var regexp = /^---- BEGIN SSH2 PUBLIC KEY ----(?:\r\n|\n)((?:(?:[\x21-\x7E]+?):(?:(?:.*?\\\r?\n)*.*)(?:\r\n|\n))*)((?:[A-Z0-9a-z\/+=]+(?:\r\n|\n))+)---- END SSH2 PUBLIC KEY ----$/;
  var RE_HEADER = /^([\x21-\x7E]+?):((?:.*?\\\r?\n)*.*)$/gm;
  var RE_HEADER_ENDS = /\\\r?\n/g;
  RFC4716_Public.parse = function(str) {
    var m = regexp.exec(str);
    if (m === null)
      return null;
    // m[1] = header(s)
    // m[2] = base64-encoded public key

    var headers = m[1];
    var data = Buffer.from(m[2], 'base64');
    var comment = '';

    if (headers !== undefined) {
      while (m = RE_HEADER.exec(headers)) {
        if (m[1].toLowerCase() === 'comment') {
          comment = trimStart(m[2].replace(RE_HEADER_ENDS, ''));
          if (comment.length > 1
              && comment.charCodeAt(0) === 34/*'"'*/
              && comment.charCodeAt(comment.length - 1) === 34/*'"'*/) {
            comment = comment.slice(1, -1);
          }
        }
      }
    }

    // avoid cyclic require by requiring on first use
    if (!utils)
      utils = __nccwpck_require__(4928);

    var type = utils.readString(data, 0, 'ascii');
    if (type === false)
      return new Error('Malformed RFC4716 public key');

    var pubPEM = null;
    var pubSSH = null;
    switch (type) {
      case 'ssh-rsa':
        var e = utils.readString(data, data._pos);
        if (e === false)
          return new Error('Malformed RFC4716 public key');
        var n = utils.readString(data, data._pos);
        if (n === false)
          return new Error('Malformed RFC4716 public key');
        pubPEM = genOpenSSLRSAPub(n, e);
        pubSSH = genOpenSSHRSAPub(n, e);
        break;
      case 'ssh-dss':
        var p = utils.readString(data, data._pos);
        if (p === false)
          return new Error('Malformed RFC4716 public key');
        var q = utils.readString(data, data._pos);
        if (q === false)
          return new Error('Malformed RFC4716 public key');
        var g = utils.readString(data, data._pos);
        if (g === false)
          return new Error('Malformed RFC4716 public key');
        var y = utils.readString(data, data._pos);
        if (y === false)
          return new Error('Malformed RFC4716 public key');
        pubPEM = genOpenSSLDSAPub(p, q, g, y);
        pubSSH = genOpenSSHDSAPub(p, q, g, y);
        break;
      default:
        return new Error('Malformed RFC4716 public key');
    }

    return new RFC4716_Public(type, comment, pubPEM, pubSSH, 'sha1');
  };
})();



module.exports = {
  parseDERKey: function parseDERKey(data, type) {
    return parseDER(data, type, '', type);
  },
  parseKey: function parseKey(data, passphrase) {
    if (Buffer.isBuffer(data))
      data = data.toString('utf8').trim();
    else if (typeof data !== 'string')
      return new Error('Key data must be a Buffer or string');
    else
      data = data.trim();

    // intentional !=
    if (passphrase != undefined) {
      if (typeof passphrase === 'string')
        passphrase = Buffer.from(passphrase);
      else if (!Buffer.isBuffer(passphrase))
        return new Error('Passphrase must be a string or Buffer when supplied');
    }

    var ret;

    // Private keys
    if ((ret = OpenSSH_Private.parse(data, passphrase)) !== null)
      return ret;
    if ((ret = OpenSSH_Old_Private.parse(data, passphrase)) !== null)
      return ret;
    if ((ret = PPK_Private.parse(data, passphrase)) !== null)
      return ret;

    // Public keys
    if ((ret = OpenSSH_Public.parse(data)) !== null)
      return ret;
    if ((ret = RFC4716_Public.parse(data)) !== null)
      return ret;

    return new Error('Unsupported key format');
  }
}


/***/ }),

/***/ 5265:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var inspect = __nccwpck_require__(1669).inspect;

function assert(value, message) {
  if (!value)
    throw new ERR_INTERNAL_ASSERTION(message);
}
assert.fail = function fail(message) {
  throw new ERR_INTERNAL_ASSERTION(message);
};

// Only use this for integers! Decimal numbers do not work with this function.
function addNumericalSeparator(val) {
  var res = '';
  var i = val.length;
  var start = val[0] === '-' ? 1 : 0;
  for (; i >= start + 4; i -= 3)
    res = `_${val.slice(i - 3, i)}${res}`;
  return `${val.slice(0, i)}${res}`;
}

function oneOf(expected, thing) {
  assert(typeof thing === 'string', '`thing` has to be of type string');
  if (Array.isArray(expected)) {
    var len = expected.length;
    assert(len > 0, 'At least one expected value needs to be specified');
    expected = expected.map((i) => String(i));
    if (len > 2) {
      return `one of ${thing} ${expected.slice(0, len - 1).join(', ')}, or `
              + expected[len - 1];
    } else if (len === 2) {
      return `one of ${thing} ${expected[0]} or ${expected[1]}`;
    } else {
      return `of ${thing} ${expected[0]}`;
    }
  } else {
    return `of ${thing} ${String(expected)}`;
  }
}



exports.ERR_INTERNAL_ASSERTION = class ERR_INTERNAL_ASSERTION extends Error {
  constructor(message) {
    super();
    Error.captureStackTrace(this, ERR_INTERNAL_ASSERTION);

    var suffix = 'This is caused by either a bug in ssh2-streams '
                 + 'or incorrect usage of ssh2-streams internals.\n'
                 + 'Please open an issue with this stack trace at '
                 + 'https://github.com/mscdex/ssh2-streams/issues\n';

    this.message = (message === undefined ? suffix : `${message}\n${suffix}`);
  }
};

var MAX_32BIT_INT = Math.pow(2, 32);
var MAX_32BIT_BIGINT = (function() {
  try {
    return new Function('return 2n ** 32n')();
  } catch (ex) {}
})();
exports.ERR_OUT_OF_RANGE = class ERR_OUT_OF_RANGE extends RangeError {
  constructor(str, range, input, replaceDefaultBoolean) {
    super();
    Error.captureStackTrace(this, ERR_OUT_OF_RANGE);

    assert(range, 'Missing "range" argument');
    var msg = (replaceDefaultBoolean
               ? str
               : `The value of "${str}" is out of range.`);
    var received;
    if (Number.isInteger(input) && Math.abs(input) > MAX_32BIT_INT) {
      received = addNumericalSeparator(String(input));
    } else if (typeof input === 'bigint') {
      received = String(input);
      if (input > MAX_32BIT_BIGINT || input < -MAX_32BIT_BIGINT)
        received = addNumericalSeparator(received);
      received += 'n';
    } else {
      received = inspect(input);
    }
    msg += ` It must be ${range}. Received ${received}`;

    this.message = msg;
  }
};

exports.ERR_INVALID_ARG_TYPE = class ERR_INVALID_ARG_TYPE extends TypeError {
  constructor(name, expected, actual) {
    super();
    Error.captureStackTrace(this, ERR_INVALID_ARG_TYPE);

    assert(typeof name === 'string', `'name' must be a string`);

    // determiner: 'must be' or 'must not be'
    var determiner;
    if (typeof expected === 'string' && expected.startsWith('not ')) {
      determiner = 'must not be';
      expected = expected.replace(/^not /, '');
    } else {
      determiner = 'must be';
    }

    var msg;
    if (name.endsWith(' argument')) {
      // For cases like 'first argument'
      msg = `The ${name} ${determiner} ${oneOf(expected, 'type')}`;
    } else {
      var type = (name.includes('.') ? 'property' : 'argument');
      msg = `The "${name}" ${type} ${determiner} ${oneOf(expected, 'type')}`;
    }

    msg += `. Received type ${typeof actual}`;

    this.message = msg;
  }
};

exports.validateNumber = function validateNumber(value, name) {
  if (typeof value !== 'number')
    throw new ERR_INVALID_ARG_TYPE(name, 'number', value);
};


// =============================================================================
// Following code is only needed to support node v6.x ....

// Undocumented cb() API, needed for core, not for public API
exports.destroyImpl = function destroy(err, cb) {
  const readableDestroyed = this._readableState &&
    this._readableState.destroyed;
  const writableDestroyed = this._writableState &&
    this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err) {
      if (!this._writableState) {
        process.nextTick(emitErrorNT, this, err);
      } else if (!this._writableState.errorEmitted) {
        this._writableState.errorEmitted = true;
        process.nextTick(emitErrorNT, this, err);
      }
    }

    return this;
  }

  // We set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // If this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, (err) => {
    if (!cb && err) {
      if (!this._writableState) {
        process.nextTick(emitErrorAndCloseNT, this, err);
      } else if (!this._writableState.errorEmitted) {
        this._writableState.errorEmitted = true;
        process.nextTick(emitErrorAndCloseNT, this, err);
      } else {
        process.nextTick(emitCloseNT, this);
      }
    } else if (cb) {
      process.nextTick(emitCloseNT, this);
      cb(err);
    } else {
      process.nextTick(emitCloseNT, this);
    }
  });

  return this;
};

function emitErrorAndCloseNT(self, err) {
  emitErrorNT(self, err);
  emitCloseNT(self);
}

function emitCloseNT(self) {
  if (self._writableState && !self._writableState.emitClose)
    return;
  if (self._readableState && !self._readableState.emitClose)
    return;
  self.emit('close');
}
// =============================================================================


/***/ }),

/***/ 1517:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// TODO: support EXTENDED request packets

var TransformStream = __nccwpck_require__(2413).Transform;
var ReadableStream = __nccwpck_require__(2413).Readable;
var WritableStream = __nccwpck_require__(2413).Writable;
var constants = __nccwpck_require__(5747).constants || process.binding('constants');
var util = __nccwpck_require__(1669);
var inherits = util.inherits;
var isDate = util.isDate;
var listenerCount = __nccwpck_require__(8614).EventEmitter.listenerCount;
var fs = __nccwpck_require__(5747);

var readString = __nccwpck_require__(4928).readString;
var readInt = __nccwpck_require__(4928).readInt;
var readUInt32BE = __nccwpck_require__(9419).readUInt32BE;
var writeUInt32BE = __nccwpck_require__(9419).writeUInt32BE;

var ATTR = {
  SIZE: 0x00000001,
  UIDGID: 0x00000002,
  PERMISSIONS: 0x00000004,
  ACMODTIME: 0x00000008,
  EXTENDED: 0x80000000
};

var STATUS_CODE = {
  OK: 0,
  EOF: 1,
  NO_SUCH_FILE: 2,
  PERMISSION_DENIED: 3,
  FAILURE: 4,
  BAD_MESSAGE: 5,
  NO_CONNECTION: 6,
  CONNECTION_LOST: 7,
  OP_UNSUPPORTED: 8
};
Object.keys(STATUS_CODE).forEach(function(key) {
  STATUS_CODE[STATUS_CODE[key]] = key;
});
var STATUS_CODE_STR = {
  0: 'No error',
  1: 'End of file',
  2: 'No such file or directory',
  3: 'Permission denied',
  4: 'Failure',
  5: 'Bad message',
  6: 'No connection',
  7: 'Connection lost',
  8: 'Operation unsupported'
};
SFTPStream.STATUS_CODE = STATUS_CODE;

var REQUEST = {
  INIT: 1,
  OPEN: 3,
  CLOSE: 4,
  READ: 5,
  WRITE: 6,
  LSTAT: 7,
  FSTAT: 8,
  SETSTAT: 9,
  FSETSTAT: 10,
  OPENDIR: 11,
  READDIR: 12,
  REMOVE: 13,
  MKDIR: 14,
  RMDIR: 15,
  REALPATH: 16,
  STAT: 17,
  RENAME: 18,
  READLINK: 19,
  SYMLINK: 20,
  EXTENDED: 200
};
Object.keys(REQUEST).forEach(function(key) {
  REQUEST[REQUEST[key]] = key;
});

var RESPONSE = {
  VERSION: 2,
  STATUS: 101,
  HANDLE: 102,
  DATA: 103,
  NAME: 104,
  ATTRS: 105,
  EXTENDED: 201
};
Object.keys(RESPONSE).forEach(function(key) {
  RESPONSE[RESPONSE[key]] = key;
});

var OPEN_MODE = {
  READ: 0x00000001,
  WRITE: 0x00000002,
  APPEND: 0x00000004,
  CREAT: 0x00000008,
  TRUNC: 0x00000010,
  EXCL: 0x00000020
};
SFTPStream.OPEN_MODE = OPEN_MODE;

var MAX_PKT_LEN = 34000;
var MAX_REQID = Math.pow(2, 32) - 1;
var CLIENT_VERSION_BUFFER = Buffer.from([0, 0, 0, 5 /* length */,
                                         REQUEST.INIT,
                                         0, 0, 0, 3 /* version */]);
var SERVER_VERSION_BUFFER = Buffer.from([0, 0, 0, 5 /* length */,
                                         RESPONSE.VERSION,
                                         0, 0, 0, 3 /* version */]);
/*
  http://tools.ietf.org/html/draft-ietf-secsh-filexfer-02:

     The maximum size of a packet is in practice determined by the client
     (the maximum size of read or write requests that it sends, plus a few
     bytes of packet overhead).  All servers SHOULD support packets of at
     least 34000 bytes (where the packet size refers to the full length,
     including the header above).  This should allow for reads and writes
     of at most 32768 bytes.

  OpenSSH caps this to 256kb instead of the ~34kb as mentioned in the sftpv3
  spec.
*/
var RE_OPENSSH = /^SSH-2.0-(?:OpenSSH|dropbear)/;
var OPENSSH_MAX_DATA_LEN = (256 * 1024) - (2 * 1024)/*account for header data*/;

function DEBUG_NOOP(msg) {}

function SFTPStream(cfg, remoteIdentRaw) {
  if (typeof cfg === 'string' && !remoteIdentRaw) {
    remoteIdentRaw = cfg;
    cfg = undefined;
  }
  if (typeof cfg !== 'object' || !cfg)
    cfg = {};

  TransformStream.call(this, {
    highWaterMark: (typeof cfg.highWaterMark === 'number'
                    ? cfg.highWaterMark
                    : 32 * 1024)
  });

  this.debug = (typeof cfg.debug === 'function' ? cfg.debug : DEBUG_NOOP);
  this.server = (cfg.server ? true : false);
  this._isOpenSSH = (remoteIdentRaw && RE_OPENSSH.test(remoteIdentRaw));
  this._needContinue = false;
  this._state = {
    // common
    status: 'packet_header',
    writeReqid: -1,
    pktLeft: undefined,
    pktHdrBuf: Buffer.allocUnsafe(9), // room for pktLen + pktType + req id
    pktBuf: undefined,
    pktType: undefined,
    version: undefined,
    extensions: {},

    // client
    maxDataLen: (this._isOpenSSH ? OPENSSH_MAX_DATA_LEN : 32768),
    requests: {}
  };

  var self = this;
  this.on('end', function() {
    self.readable = false;
  }).on('finish', onFinish)
    .on('prefinish', onFinish);
  function onFinish() {
    self.writable = false;
    self._cleanup(false);
  }

  if (!this.server)
    this.push(CLIENT_VERSION_BUFFER);
}
inherits(SFTPStream, TransformStream);

SFTPStream.prototype.__read = TransformStream.prototype._read;
SFTPStream.prototype._read = function(n) {
  if (this._needContinue) {
    this._needContinue = false;
    this.emit('continue');
  }
  return this.__read(n);
};
SFTPStream.prototype.__push = TransformStream.prototype.push;
SFTPStream.prototype.push = function(chunk, encoding) {
  if (!this.readable)
    return false;
  if (chunk === null)
    this.readable = false;
  var ret = this.__push(chunk, encoding);
  this._needContinue = (ret === false);
  return ret;
};

SFTPStream.prototype._cleanup = function(callback) {
  var state = this._state;

  state.pktBuf = undefined; // give GC something to do

  var requests = state.requests;
  var keys = Object.keys(requests);
  var len = keys.length;
  if (len) {
    if (this.readable) {
      var err = new Error('SFTP session ended early');
      for (var i = 0, cb; i < len; ++i)
        (cb = requests[keys[i]].cb) && cb(err);
    }
    state.requests = {};
  }

  if (this.readable)
    this.push(null);
  if (!this._readableState.endEmitted && !this._readableState.flowing) {
    // Ugh!
    this.resume();
  }
  if (callback !== false) {
    this.debug('DEBUG[SFTP]: Parser: Malformed packet');
    callback && callback(new Error('Malformed packet'));
  }
};

SFTPStream.prototype._transform = function(chunk, encoding, callback) {
  var state = this._state;
  var server = this.server;
  var status = state.status;
  var pktType = state.pktType;
  var pktBuf = state.pktBuf;
  var pktLeft = state.pktLeft;
  var version = state.version;
  var pktHdrBuf = state.pktHdrBuf;
  var requests = state.requests;
  var debug = this.debug;
  var chunkLen = chunk.length;
  var chunkPos = 0;
  var buffer;
  var chunkLeft;
  var id;

  while (true) {
    if (status === 'discard') {
      chunkLeft = (chunkLen - chunkPos);
      if (pktLeft <= chunkLeft) {
        chunkPos += pktLeft;
        pktLeft = 0;
        status = 'packet_header';
        buffer = pktBuf = undefined;
      } else {
        pktLeft -= chunkLeft;
        break;
      }
    } else if (pktBuf !== undefined) {
      chunkLeft = (chunkLen - chunkPos);
      if (pktLeft <= chunkLeft) {
        chunk.copy(pktBuf,
                   pktBuf.length - pktLeft,
                   chunkPos,
                   chunkPos + pktLeft);
        chunkPos += pktLeft;
        pktLeft = 0;
        buffer = pktBuf;
        pktBuf = undefined;
        continue;
      } else {
        chunk.copy(pktBuf, pktBuf.length - pktLeft, chunkPos);
        pktLeft -= chunkLeft;
        break;
      }
    } else if (status === 'packet_header') {
      if (!buffer) {
        pktLeft = 5;
        pktBuf = pktHdrBuf;
      } else {
        // here we read the right-most 5 bytes from buffer (pktHdrBuf)
        pktLeft = readUInt32BE(buffer, 4) - 1; // account for type byte
        pktType = buffer[8];

        if (server) {
          if (version === undefined && pktType !== REQUEST.INIT) {
            debug('DEBUG[SFTP]: Parser: Unexpected packet before init');
            this._cleanup(false);
            return callback(new Error('Unexpected packet before init'));
          } else if (version !== undefined && pktType === REQUEST.INIT) {
            debug('DEBUG[SFTP]: Parser: Unexpected duplicate init');
            status = 'bad_pkt';
          } else if (pktLeft > MAX_PKT_LEN) {
            var msg = 'Packet length ('
                      + pktLeft
                      + ') exceeds max length ('
                      + MAX_PKT_LEN
                      + ')';
            debug('DEBUG[SFTP]: Parser: ' + msg);
            this._cleanup(false);
            return callback(new Error(msg));
          } else if (pktType === REQUEST.EXTENDED) {
            status = 'bad_pkt';
          } else if (REQUEST[pktType] === undefined) {
            debug('DEBUG[SFTP]: Parser: Unsupported packet type: ' + pktType);
            status = 'discard';
          }
        } else if (version === undefined && pktType !== RESPONSE.VERSION) {
          debug('DEBUG[SFTP]: Parser: Unexpected packet before version');
          this._cleanup(false);
          return callback(new Error('Unexpected packet before version'));
        } else if (version !== undefined && pktType === RESPONSE.VERSION) {
          debug('DEBUG[SFTP]: Parser: Unexpected duplicate version');
          status = 'bad_pkt';
        } else if (RESPONSE[pktType] === undefined) {
          status = 'discard';
        }

        if (status === 'bad_pkt') {
          // Copy original packet info to left of pktHdrBuf
          writeUInt32BE(pktHdrBuf, pktLeft + 1, 0);
          pktHdrBuf[4] = pktType;

          pktLeft = 4;
          pktBuf = pktHdrBuf;
        } else {
          pktBuf = Buffer.allocUnsafe(pktLeft);
          status = 'payload';
        }
      }
    } else if (status === 'payload') {
      if (pktType === RESPONSE.VERSION || pktType === REQUEST.INIT) {
        /*
          uint32 version
          <extension data>
        */
        version = state.version = readInt(buffer, 0, this, callback);
        if (version === false)
          return;
        if (version < 3) {
          this._cleanup(false);
          return callback(new Error('Incompatible SFTP version: ' + version));
        } else if (server)
          this.push(SERVER_VERSION_BUFFER);

        var buflen = buffer.length;
        var extname;
        var extdata;
        buffer._pos = 4;
        while (buffer._pos < buflen) {
          extname = readString(buffer, buffer._pos, 'ascii', this, callback);
          if (extname === false)
            return;
          extdata = readString(buffer, buffer._pos, 'ascii', this, callback);
          if (extdata === false)
            return;
          if (state.extensions[extname])
            state.extensions[extname].push(extdata);
          else
            state.extensions[extname] = [ extdata ];
        }

        this.emit('ready');
      } else {
        /*
          All other packets (client and server) begin with a (client) request
          id:
          uint32     id
        */
        id = readInt(buffer, 0, this, callback);
        if (id === false)
          return;

        var filename;
        var attrs;
        var handle;
        var data;

        if (!server) {
          var req = requests[id];
          var cb = req && req.cb;
          debug('DEBUG[SFTP]: Parser: Response: ' + RESPONSE[pktType]);
          if (req && cb) {
            if (pktType === RESPONSE.STATUS) {
              /*
                uint32     error/status code
                string     error message (ISO-10646 UTF-8)
                string     language tag
              */
              var code = readInt(buffer, 4, this, callback);
              if (code === false)
                return;
              if (code === STATUS_CODE.OK) {
                cb();
              } else {
                // We borrow OpenSSH behavior here, specifically we make the
                // message and language fields optional, despite the
                // specification requiring them (even if they are empty). This
                // helps to avoid problems with buggy implementations that do
                // not fully conform to the SFTP(v3) specification.
                var msg;
                var lang = '';
                if (buffer.length >= 12) {
                  msg = readString(buffer, 8, 'utf8', this, callback);
                  if (msg === false)
                    return;
                  if ((buffer._pos + 4) < buffer.length) {
                    lang = readString(buffer,
                                      buffer._pos,
                                      'ascii',
                                      this,
                                      callback);
                    if (lang === false)
                      return;
                  }
                }
                var err = new Error(msg
                                    || STATUS_CODE_STR[code]
                                    || 'Unknown status');
                err.code = code;
                err.lang = lang;
                cb(err);
              }
            } else if (pktType === RESPONSE.HANDLE) {
              /*
                string     handle
              */
              handle = readString(buffer, 4, this, callback);
              if (handle === false)
                return;
              cb(undefined, handle);
            } else if (pktType === RESPONSE.DATA) {
              /*
                string     data
              */
              if (req.buffer) {
                // we have already pre-allocated space to store the data
                var dataLen = readInt(buffer, 4, this, callback);
                if (dataLen === false)
                  return;
                var reqBufLen = req.buffer.length;
                if (dataLen > reqBufLen) {
                  // truncate response data to fit expected size
                  writeUInt32BE(buffer, reqBufLen, 4);
                }
                data = readString(buffer, 4, req.buffer, this, callback);
                if (data === false)
                  return;
                cb(undefined, data, dataLen);
              } else {
                data = readString(buffer, 4, this, callback);
                if (data === false)
                  return;
                cb(undefined, data);
              }
            } else if (pktType === RESPONSE.NAME) {
              /*
                uint32     count
                repeats count times:
                        string     filename
                        string     longname
                        ATTRS      attrs
              */
              var namesLen = readInt(buffer, 4, this, callback);
              if (namesLen === false)
                return;
              var names = [],
                  longname;
              buffer._pos = 8;
              for (var i = 0; i < namesLen; ++i) {
                // we are going to assume UTF-8 for filenames despite the SFTPv3
                // spec not specifying an encoding because the specs for newer
                // versions of the protocol all explicitly specify UTF-8 for
                // filenames
                filename = readString(buffer,
                                      buffer._pos,
                                      'utf8',
                                      this,
                                      callback);
                if (filename === false)
                  return;
                // `longname` only exists in SFTPv3 and since it typically will
                // contain the filename, we assume it is also UTF-8
                longname = readString(buffer,
                                      buffer._pos,
                                      'utf8',
                                      this,
                                      callback);
                if (longname === false)
                  return;
                attrs = readAttrs(buffer, buffer._pos, this, callback);
                if (attrs === false)
                  return;
                names.push({
                  filename: filename,
                  longname: longname,
                  attrs: attrs
                });
              }
              cb(undefined, names);
            } else if (pktType === RESPONSE.ATTRS) {
              /*
                ATTRS      attrs
              */
              attrs = readAttrs(buffer, 4, this, callback);
              if (attrs === false)
                return;
              cb(undefined, attrs);
            } else if (pktType === RESPONSE.EXTENDED) {
              if (req.extended) {
                switch (req.extended) {
                  case 'statvfs@openssh.com':
                  case 'fstatvfs@openssh.com':
                    /*
                      uint64    f_bsize   // file system block size
                      uint64    f_frsize  // fundamental fs block size
                      uint64    f_blocks  // number of blocks (unit f_frsize)
                      uint64    f_bfree   // free blocks in file system
                      uint64    f_bavail  // free blocks for non-root
                      uint64    f_files   // total file inodes
                      uint64    f_ffree   // free file inodes
                      uint64    f_favail  // free file inodes for to non-root
                      uint64    f_fsid    // file system id
                      uint64    f_flag    // bit mask of f_flag values
                      uint64    f_namemax // maximum filename length
                    */
                    var stats = {
                      f_bsize: undefined,
                      f_frsize: undefined,
                      f_blocks: undefined,
                      f_bfree: undefined,
                      f_bavail: undefined,
                      f_files: undefined,
                      f_ffree: undefined,
                      f_favail: undefined,
                      f_sid: undefined,
                      f_flag: undefined,
                      f_namemax: undefined
                    };
                    stats.f_bsize = readUInt64BE(buffer, 4, this, callback);
                    if (stats.f_bsize === false)
                      return;
                    stats.f_frsize = readUInt64BE(buffer, 12, this, callback);
                    if (stats.f_frsize === false)
                      return;
                    stats.f_blocks = readUInt64BE(buffer, 20, this, callback);
                    if (stats.f_blocks === false)
                      return;
                    stats.f_bfree = readUInt64BE(buffer, 28, this, callback);
                    if (stats.f_bfree === false)
                      return;
                    stats.f_bavail = readUInt64BE(buffer, 36, this, callback);
                    if (stats.f_bavail === false)
                      return;
                    stats.f_files = readUInt64BE(buffer, 44, this, callback);
                    if (stats.f_files === false)
                      return;
                    stats.f_ffree = readUInt64BE(buffer, 52, this, callback);
                    if (stats.f_ffree === false)
                      return;
                    stats.f_favail = readUInt64BE(buffer, 60, this, callback);
                    if (stats.f_favail === false)
                      return;
                    stats.f_sid = readUInt64BE(buffer, 68, this, callback);
                    if (stats.f_sid === false)
                      return;
                    stats.f_flag = readUInt64BE(buffer, 76, this, callback);
                    if (stats.f_flag === false)
                      return;
                    stats.f_namemax = readUInt64BE(buffer, 84, this, callback);
                    if (stats.f_namemax === false)
                      return;
                    cb(undefined, stats);
                  break;
                }
              }
              // XXX: at least provide the raw buffer data to the callback in
              // case of unexpected extended response?
              cb();
            }
          }
          if (req)
            delete requests[id];
        } else {
          // server
          var evName = REQUEST[pktType];
          var offset;
          var path;

          debug('DEBUG[SFTP]: Parser: Request: ' + evName);
          if (listenerCount(this, evName)) {
            if (pktType === REQUEST.OPEN) {
              /*
                string        filename
                uint32        pflags
                ATTRS         attrs
              */
              filename = readString(buffer, 4, 'utf8', this, callback);
              if (filename === false)
                return;
              var pflags = readInt(buffer, buffer._pos, this, callback);
              if (pflags === false)
                return;
              attrs = readAttrs(buffer, buffer._pos + 4, this, callback);
              if (attrs === false)
                return;
              this.emit(evName, id, filename, pflags, attrs);
            } else if (pktType === REQUEST.CLOSE
                       || pktType === REQUEST.FSTAT
                       || pktType === REQUEST.READDIR) {
              /*
                string     handle
              */
              handle = readString(buffer, 4, this, callback);
              if (handle === false)
                return;
              this.emit(evName, id, handle);
            } else if (pktType === REQUEST.READ) {
              /*
                string     handle
                uint64     offset
                uint32     len
              */
              handle = readString(buffer, 4, this, callback);
              if (handle === false)
                return;
              offset = readUInt64BE(buffer, buffer._pos, this, callback);
              if (offset === false)
                return;
              var len = readInt(buffer, buffer._pos, this, callback);
              if (len === false)
                return;
              this.emit(evName, id, handle, offset, len);
            } else if (pktType === REQUEST.WRITE) {
              /*
                string     handle
                uint64     offset
                string     data
              */
              handle = readString(buffer, 4, this, callback);
              if (handle === false)
                return;
              offset = readUInt64BE(buffer, buffer._pos, this, callback);
              if (offset === false)
                return;
              data = readString(buffer, buffer._pos, this, callback);
              if (data === false)
                return;
              this.emit(evName, id, handle, offset, data);
            } else if (pktType === REQUEST.LSTAT
                       || pktType === REQUEST.STAT
                       || pktType === REQUEST.OPENDIR
                       || pktType === REQUEST.REMOVE
                       || pktType === REQUEST.RMDIR
                       || pktType === REQUEST.REALPATH
                       || pktType === REQUEST.READLINK) {
              /*
                string     path
              */
              path = readString(buffer, 4, 'utf8', this, callback);
              if (path === false)
                return;
              this.emit(evName, id, path);
            } else if (pktType === REQUEST.SETSTAT
                       || pktType === REQUEST.MKDIR) {
              /*
                string     path
                ATTRS      attrs
              */
              path = readString(buffer, 4, 'utf8', this, callback);
              if (path === false)
                return;
              attrs = readAttrs(buffer, buffer._pos, this, callback);
              if (attrs === false)
                return;
              this.emit(evName, id, path, attrs);
            } else if (pktType === REQUEST.FSETSTAT) {
              /*
                string     handle
                ATTRS      attrs
              */
              handle = readString(buffer, 4, this, callback);
              if (handle === false)
                return;
              attrs = readAttrs(buffer, buffer._pos, this, callback);
              if (attrs === false)
                return;
              this.emit(evName, id, handle, attrs);
            } else if (pktType === REQUEST.RENAME
                       || pktType === REQUEST.SYMLINK) {
              /*
                RENAME:
                  string     oldpath
                  string     newpath
                SYMLINK:
                  string     linkpath
                  string     targetpath
              */
              var str1;
              var str2;
              str1 = readString(buffer, 4, 'utf8', this, callback);
              if (str1 === false)
                return;
              str2 = readString(buffer, buffer._pos, 'utf8', this, callback);
              if (str2 === false)
                return;
              if (pktType === REQUEST.SYMLINK && this._isOpenSSH) {
                // OpenSSH has linkpath and targetpath positions switched
                this.emit(evName, id, str2, str1);
              } else
                this.emit(evName, id, str1, str2);
            }
          } else {
            // automatically reject request if no handler for request type
            this.status(id, STATUS_CODE.OP_UNSUPPORTED);
          }
        }
      }

      // prepare for next packet
      status = 'packet_header';
      buffer = pktBuf = undefined;
    } else if (status === 'bad_pkt') {
      if (server && buffer[4] !== REQUEST.INIT) {
        var errCode = (buffer[4] === REQUEST.EXTENDED
                       ? STATUS_CODE.OP_UNSUPPORTED
                       : STATUS_CODE.FAILURE);

        // no request id for init/version packets, so we have no way to send a
        // status response, so we just close up shop ...
        if (buffer[4] === REQUEST.INIT || buffer[4] === RESPONSE.VERSION)
          return this._cleanup(callback);

        id = readInt(buffer, 5, this, callback);
        if (id === false)
          return;
        this.status(id, errCode);
      }

      // by this point we have already read the type byte and the id bytes, so
      // we subtract those from the number of bytes to skip
      pktLeft = readUInt32BE(buffer, 0) - 5;

      status = 'discard';
    }

    if (chunkPos >= chunkLen)
      break;
  }

  state.status = status;
  state.pktType = pktType;
  state.pktBuf = pktBuf;
  state.pktLeft = pktLeft;
  state.version = version;

  callback();
};

// client
SFTPStream.prototype.createReadStream = function(path, options) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  return new ReadStream(this, path, options);
};
SFTPStream.prototype.createWriteStream = function(path, options) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  return new WriteStream(this, path, options);
};
SFTPStream.prototype.open = function(path, flags_, attrs, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  if (typeof attrs === 'function') {
    cb = attrs;
    attrs = undefined;
  }

  var flags = (typeof flags_ === 'number' ? flags_ : stringToFlags(flags_));
  if (flags === null)
    throw new Error('Unknown flags string: ' + flags_);

  var attrFlags = 0;
  var attrBytes = 0;
  if (typeof attrs === 'string' || typeof attrs === 'number') {
    attrs = { mode: attrs };
  }
  if (typeof attrs === 'object' && attrs !== null) {
    attrs = attrsToBytes(attrs);
    attrFlags = attrs.flags;
    attrBytes = attrs.nbytes;
    attrs = attrs.bytes;
  }

  /*
    uint32        id
    string        filename
    uint32        pflags
    ATTRS         attrs
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathlen + 4 + 4 + attrBytes);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.OPEN;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);

  writeUInt32BE(buf, pathlen, p);
  buf.write(path, p += 4, pathlen, 'utf8');
  writeUInt32BE(buf, flags, p += pathlen);
  writeUInt32BE(buf, attrFlags, p += 4);
  if (attrs && attrFlags) {
    p += 4;
    for (var i = 0, len = attrs.length; i < len; ++i)
      for (var j = 0, len2 = attrs[i].length; j < len2; ++j)
        buf[p++] = attrs[i][j];
  }
  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing OPEN');
  return this.push(buf);
};
SFTPStream.prototype.close = function(handle, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!Buffer.isBuffer(handle))
    throw new Error('handle is not a Buffer');

  var state = this._state;

  /*
    uint32     id
    string     handle
  */
  var handlelen = handle.length;
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + handlelen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.CLOSE;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);

  writeUInt32BE(buf, handlelen, p);
  handle.copy(buf, p += 4);

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing CLOSE');
  return this.push(buf);
};
SFTPStream.prototype.readData = function(handle, buf, off, len, position, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!Buffer.isBuffer(handle))
    throw new Error('handle is not a Buffer');
  else if (!Buffer.isBuffer(buf))
    throw new Error('buffer is not a Buffer');
  else if (off >= buf.length)
    throw new Error('offset is out of bounds');
  else if (off + len > buf.length)
    throw new Error('length extends beyond buffer');
  else if (position === null)
    throw new Error('null position currently unsupported');

  var state = this._state;

  /*
    uint32     id
    string     handle
    uint64     offset
    uint32     len
  */
  var handlelen = handle.length;
  var p = 9;
  var pos = position;
  var out = Buffer.allocUnsafe(4 + 1 + 4 + 4 + handlelen + 8 + 4);

  writeUInt32BE(out, out.length - 4, 0);
  out[4] = REQUEST.READ;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(out, reqid, 5);

  writeUInt32BE(out, handlelen, p);
  handle.copy(out, p += 4);
  p += handlelen;
  for (var i = 7; i >= 0; --i) {
    out[p + i] = pos & 0xFF;
    pos /= 256;
  }
  writeUInt32BE(out, len, p += 8);

  state.requests[reqid] = {
    cb: function(err, data, nb) {
      if (err) {
        if (cb._wantEOFError || err.code !== STATUS_CODE.EOF)
          return cb(err);
      } else if (nb > len) {
        return cb(new Error('Received more data than requested'));
      }
      cb(undefined, nb || 0, data, position);
    },
    buffer: buf.slice(off, off + len)
  };

  this.debug('DEBUG[SFTP]: Outgoing: Writing READ');
  return this.push(out);
};
SFTPStream.prototype.writeData = function(handle, buf, off, len, position, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!Buffer.isBuffer(handle))
    throw new Error('handle is not a Buffer');
  else if (!Buffer.isBuffer(buf))
    throw new Error('buffer is not a Buffer');
  else if (off > buf.length)
    throw new Error('offset is out of bounds');
  else if (off + len > buf.length)
    throw new Error('length extends beyond buffer');
  else if (position === null)
    throw new Error('null position currently unsupported');

  var self = this;
  var state = this._state;

  if (!len) {
    cb && process.nextTick(function() { cb(undefined, 0); });
    return;
  }

  var overflow = (len > state.maxDataLen
                  ? len - state.maxDataLen
                  : 0);
  var origPosition = position;

  if (overflow)
    len = state.maxDataLen;

  /*
    uint32     id
    string     handle
    uint64     offset
    string     data
  */
  var handlelen = handle.length;
  var p = 9;
  var out = Buffer.allocUnsafe(4 + 1 + 4 + 4 + handlelen + 8 + 4 + len);

  writeUInt32BE(out, out.length - 4, 0);
  out[4] = REQUEST.WRITE;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(out, reqid, 5);

  writeUInt32BE(out, handlelen, p);
  handle.copy(out, p += 4);
  p += handlelen;
  for (var i = 7; i >= 0; --i) {
    out[p + i] = position & 0xFF;
    position /= 256;
  }
  writeUInt32BE(out, len, p += 8);
  buf.copy(out, p += 4, off, off + len);

  state.requests[reqid] = {
    cb: function(err) {
      if (err)
        cb && cb(err);
      else if (overflow) {
        self.writeData(handle,
                       buf,
                       off + len,
                       overflow,
                       origPosition + len,
                       cb);
      } else
        cb && cb(undefined, off + len);
    }
  };

  this.debug('DEBUG[SFTP]: Outgoing: Writing WRITE');
  return this.push(out);
};
function tryCreateBuffer(size) {
  try {
    return Buffer.allocUnsafe(size);
  } catch (ex) {
    return ex;
  }
}
function fastXfer(src, dst, srcPath, dstPath, opts, cb) {
  var concurrency = 64;
  var chunkSize = 32768;
  //var preserve = false;
  var onstep;
  var mode;
  var fileSize;

  if (typeof opts === 'function') {
    cb = opts;
  } else if (typeof opts === 'object' && opts !== null) {
    if (typeof opts.concurrency === 'number'
        && opts.concurrency > 0
        && !isNaN(opts.concurrency))
      concurrency = opts.concurrency;
    if (typeof opts.chunkSize === 'number'
        && opts.chunkSize > 0
        && !isNaN(opts.chunkSize))
      chunkSize = opts.chunkSize;
    if (typeof opts.fileSize === 'number'
        && opts.fileSize > 0
        && !isNaN(opts.fileSize))
      fileSize = opts.fileSize;
    if (typeof opts.step === 'function')
      onstep = opts.step;
    //preserve = (opts.preserve ? true : false);
    if (typeof opts.mode === 'string' || typeof opts.mode === 'number')
      mode = modeNum(opts.mode);
  }

  // internal state variables
  var fsize;
  var pdst = 0;
  var total = 0;
  var hadError = false;
  var srcHandle;
  var dstHandle;
  var readbuf;
  var bufsize = chunkSize * concurrency;

  function onerror(err) {
    if (hadError)
      return;

    hadError = true;

    var left = 0;
    var cbfinal;

    if (srcHandle || dstHandle) {
      cbfinal = function() {
        if (--left === 0)
          cb(err);
      };
      if (srcHandle && (src === fs || src.writable))
        ++left;
      if (dstHandle && (dst === fs || dst.writable))
        ++left;
      if (srcHandle && (src === fs || src.writable))
        src.close(srcHandle, cbfinal);
      if (dstHandle && (dst === fs || dst.writable))
        dst.close(dstHandle, cbfinal);
    } else
      cb(err);
  }

  src.open(srcPath, 'r', function(err, sourceHandle) {
    if (err)
      return onerror(err);

    srcHandle = sourceHandle;

    if (fileSize === undefined)
      src.fstat(srcHandle, tryStat);
    else
      tryStat(null, { size: fileSize });

    function tryStat(err, attrs) {
      if (err) {
        if (src !== fs) {
          // Try stat() for sftp servers that may not support fstat() for
          // whatever reason
          src.stat(srcPath, function(err_, attrs_) {
            if (err_)
              return onerror(err);
            tryStat(null, attrs_);
          });
          return;
        }
        return onerror(err);
      }
      fsize = attrs.size;

      dst.open(dstPath, 'w', function(err, destHandle) {
        if (err)
          return onerror(err);

        dstHandle = destHandle;

        if (fsize <= 0)
          return onerror();

        // Use less memory where possible
        while (bufsize > fsize) {
          if (concurrency === 1) {
            bufsize = fsize;
            break;
          }
          bufsize -= chunkSize;
          --concurrency;
        }

        readbuf = tryCreateBuffer(bufsize);
        if (readbuf instanceof Error)
          return onerror(readbuf);

        if (mode !== undefined) {
          dst.fchmod(dstHandle, mode, function tryAgain(err) {
            if (err) {
              // Try chmod() for sftp servers that may not support fchmod() for
              // whatever reason
              dst.chmod(dstPath, mode, function(err_) {
                tryAgain();
              });
              return;
            }
            startReads();
          });
        } else {
          startReads();
        }

        function onread(err, nb, data, dstpos, datapos, origChunkLen) {
          if (err)
            return onerror(err);

          datapos = datapos || 0;

          if (src === fs)
            dst.writeData(dstHandle, readbuf, datapos, nb, dstpos, writeCb);
          else
            dst.write(dstHandle, readbuf, datapos, nb, dstpos, writeCb);

          function writeCb(err) {
            if (err)
              return onerror(err);

            total += nb;
            onstep && onstep(total, nb, fsize);

            if (nb < origChunkLen)
              return singleRead(datapos, dstpos + nb, origChunkLen - nb);

            if (total === fsize) {
              dst.close(dstHandle, function(err) {
                dstHandle = undefined;
                if (err)
                  return onerror(err);
                src.close(srcHandle, function(err) {
                  srcHandle = undefined;
                  if (err)
                    return onerror(err);
                  cb();
                });
              });
              return;
            }

            if (pdst >= fsize)
              return;

            var chunk = (pdst + chunkSize > fsize ? fsize - pdst : chunkSize);
            singleRead(datapos, pdst, chunk);
            pdst += chunk;
          }
        }

        function makeCb(psrc, pdst, chunk) {
          return function(err, nb, data) {
            onread(err, nb, data, pdst, psrc, chunk);
          };
        }

        function singleRead(psrc, pdst, chunk) {
          if (src === fs) {
            src.read(srcHandle,
                     readbuf,
                     psrc,
                     chunk,
                     pdst,
                     makeCb(psrc, pdst, chunk));
          } else {
            src.readData(srcHandle,
                         readbuf,
                         psrc,
                         chunk,
                         pdst,
                         makeCb(psrc, pdst, chunk));
          }
        }

        function startReads() {
          var reads = 0;
          var psrc = 0;
          while (pdst < fsize && reads < concurrency) {
            var chunk = (pdst + chunkSize > fsize ? fsize - pdst : chunkSize);
            singleRead(psrc, pdst, chunk);
            psrc += chunk;
            pdst += chunk;
            ++reads;
          }
        }
      });
    }
  });
}
SFTPStream.prototype.fastGet = function(remotePath, localPath, opts, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  fastXfer(this, fs, remotePath, localPath, opts, cb);
};
SFTPStream.prototype.fastPut = function(localPath, remotePath, opts, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  fastXfer(fs, this, localPath, remotePath, opts, cb);
};
SFTPStream.prototype.readFile = function(path, options, callback_) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var callback;
  if (typeof callback_ === 'function') {
    callback = callback_;
  } else if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }

  var self = this;

  if (typeof options === 'string')
    options = { encoding: options, flag: 'r' };
  else if (!options)
    options = { encoding: null, flag: 'r' };
  else if (typeof options !== 'object')
    throw new TypeError('Bad arguments');

  var encoding = options.encoding;
  if (encoding && !Buffer.isEncoding(encoding))
    throw new Error('Unknown encoding: ' + encoding);

  // first, stat the file, so we know the size.
  var size;
  var buffer; // single buffer with file data
  var buffers; // list for when size is unknown
  var pos = 0;
  var handle;

  // SFTPv3 does not support using -1 for read position, so we have to track
  // read position manually
  var bytesRead = 0;

  var flag = options.flag || 'r';
  this.open(path, flag, 438 /*=0666*/, function(er, handle_) {
    if (er)
      return callback && callback(er);
    handle = handle_;

    self.fstat(handle, function tryStat(er, st) {
      if (er) {
        // Try stat() for sftp servers that may not support fstat() for
        // whatever reason
        self.stat(path, function(er_, st_) {
          if (er_) {
            return self.close(handle, function() {
              callback && callback(er);
            });
          }
          tryStat(null, st_);
        });
        return;
      }

      size = st.size || 0;
      if (size === 0) {
        // the kernel lies about many files.
        // Go ahead and try to read some bytes.
        buffers = [];
        return read();
      }

      buffer = Buffer.allocUnsafe(size);
      read();
    });
  });

  function read() {
    if (size === 0) {
      buffer = Buffer.allocUnsafe(8192);
      self.readData(handle, buffer, 0, 8192, bytesRead, afterRead);
    } else {
      self.readData(handle, buffer, pos, size - pos, bytesRead, afterRead);
    }
  }

  function afterRead(er, nbytes) {
    var eof;
    if (er) {
      eof = (er.code === STATUS_CODE.EOF);
      if (!eof) {
        return self.close(handle, function() {
          return callback && callback(er);
        });
      }
    } else {
      eof = false;
    }

    if (eof || (size === 0 && nbytes === 0))
      return close();

    bytesRead += nbytes;
    pos += nbytes;
    if (size !== 0) {
      if (pos === size)
        close();
      else
        read();
    } else {
      // unknown size, just read until we don't get bytes.
      buffers.push(buffer.slice(0, nbytes));
      read();
    }
  }
  afterRead._wantEOFError = true;

  function close() {
    self.close(handle, function(er) {
      if (size === 0) {
        // collected the data into the buffers list.
        buffer = Buffer.concat(buffers, pos);
      } else if (pos < size) {
        buffer = buffer.slice(0, pos);
      }

      if (encoding)
        buffer = buffer.toString(encoding);
      return callback && callback(er, buffer);
    });
  }
};
function writeAll(self, handle, buffer, offset, length, position, callback_) {
  var callback = (typeof callback_ === 'function' ? callback_ : undefined);

  self.writeData(handle,
                 buffer,
                 offset,
                 length,
                 position,
                 function(writeErr, written) {
    if (writeErr) {
      return self.close(handle, function() {
        callback && callback(writeErr);
      });
    }
    if (written === length)
      self.close(handle, callback);
    else {
      offset += written;
      length -= written;
      position += written;
      writeAll(self, handle, buffer, offset, length, position, callback);
    }
  });
}
SFTPStream.prototype.writeFile = function(path, data, options, callback_) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var callback;
  if (typeof callback_ === 'function') {
    callback = callback_;
  } else if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }
  var self = this;

  if (typeof options === 'string')
    options = { encoding: options, mode: 438, flag: 'w' };
  else if (!options)
    options = { encoding: 'utf8', mode: 438 /*=0666*/, flag: 'w' };
  else if (typeof options !== 'object')
    throw new TypeError('Bad arguments');

  if (options.encoding && !Buffer.isEncoding(options.encoding))
    throw new Error('Unknown encoding: ' + options.encoding);

  var flag = options.flag || 'w';
  this.open(path, flag, options.mode, function(openErr, handle) {
    if (openErr)
      callback && callback(openErr);
    else {
      var buffer = (Buffer.isBuffer(data)
                    ? data
                    : Buffer.from('' + data, options.encoding || 'utf8'));
      var position = (/a/.test(flag) ? null : 0);

      // SFTPv3 does not support the notion of 'current position'
      // (null position), so we just attempt to append to the end of the file
      // instead
      if (position === null) {
        self.fstat(handle, function tryStat(er, st) {
          if (er) {
            // Try stat() for sftp servers that may not support fstat() for
            // whatever reason
            self.stat(path, function(er_, st_) {
              if (er_) {
                return self.close(handle, function() {
                  callback && callback(er);
                });
              }
              tryStat(null, st_);
            });
            return;
          }
          writeAll(self, handle, buffer, 0, buffer.length, st.size, callback);
        });
        return;
      }
      writeAll(self, handle, buffer, 0, buffer.length, position, callback);
    }
  });
};
SFTPStream.prototype.appendFile = function(path, data, options, callback_) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var callback;
  if (typeof callback_ === 'function') {
    callback = callback_;
  } else if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }

  if (typeof options === 'string')
    options = { encoding: options, mode: 438, flag: 'a' };
  else if (!options)
    options = { encoding: 'utf8', mode: 438 /*=0666*/, flag: 'a' };
  else if (typeof options !== 'object')
    throw new TypeError('Bad arguments');

  if (!options.flag)
    options = util._extend({ flag: 'a' }, options);
  this.writeFile(path, data, options, callback);
};
SFTPStream.prototype.exists = function(path, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  this.stat(path, function(err) {
    cb && cb(err ? false : true);
  });
};
SFTPStream.prototype.unlink = function(filename, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     filename
  */
  var fnamelen = Buffer.byteLength(filename);
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + fnamelen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.REMOVE;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);

  writeUInt32BE(buf, fnamelen, p);
  buf.write(filename, p += 4, fnamelen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing REMOVE');
  return this.push(buf);
};
SFTPStream.prototype.rename = function(oldPath, newPath, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     oldpath
    string     newpath
  */
  var oldlen = Buffer.byteLength(oldPath);
  var newlen = Buffer.byteLength(newPath);
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + oldlen + 4 + newlen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.RENAME;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);

  writeUInt32BE(buf, oldlen, p);
  buf.write(oldPath, p += 4, oldlen, 'utf8');
  writeUInt32BE(buf, newlen, p += oldlen);
  buf.write(newPath, p += 4, newlen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing RENAME');
  return this.push(buf);
};
SFTPStream.prototype.mkdir = function(path, attrs, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var flags = 0;
  var attrBytes = 0;
  var state = this._state;

  if (typeof attrs === 'function') {
    cb = attrs;
    attrs = undefined;
  }
  if (typeof attrs === 'object' && attrs !== null) {
    attrs = attrsToBytes(attrs);
    flags = attrs.flags;
    attrBytes = attrs.nbytes;
    attrs = attrs.bytes;
  }

  /*
    uint32     id
    string     path
    ATTRS      attrs
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathlen + 4 + attrBytes);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.MKDIR;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);

  writeUInt32BE(buf, pathlen, p);
  buf.write(path, p += 4, pathlen, 'utf8');
  writeUInt32BE(buf, flags, p += pathlen);
  if (flags) {
    p += 4;
    for (var i = 0, len = attrs.length; i < len; ++i)
      for (var j = 0, len2 = attrs[i].length; j < len2; ++j)
        buf[p++] = attrs[i][j];
  }

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing MKDIR');
  return this.push(buf);
};
SFTPStream.prototype.rmdir = function(path, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     path
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathlen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.RMDIR;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);

  writeUInt32BE(buf, pathlen, p);
  buf.write(path, p += 4, pathlen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing RMDIR');
  return this.push(buf);
};
SFTPStream.prototype.readdir = function(where, opts, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;
  var doFilter;

  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  if (typeof opts !== 'object' || opts === null)
    opts = {};

  doFilter = (opts && opts.full ? false : true);

  if (!Buffer.isBuffer(where) && typeof where !== 'string')
    throw new Error('missing directory handle or path');

  if (typeof where === 'string') {
    var self = this;
    var entries = [];
    var e = 0;

    return this.opendir(where, function reread(err, handle) {
      if (err)
        return cb(err);

      self.readdir(handle, opts, function(err, list) {
        var eof = (err && err.code === STATUS_CODE.EOF);

        if (err && !eof) {
          return self.close(handle, function() {
            cb(err);
          });
        } else if (eof) {
          return self.close(handle, function(err) {
            if (err)
              return cb(err);
            cb(undefined, entries);
          });
        }

        for (var i = 0, len = list.length; i < len; ++i, ++e)
          entries[e] = list[i];

        reread(undefined, handle);
      });
    });
  }

  /*
    uint32     id
    string     handle
  */
  var handlelen = where.length;
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + handlelen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.READDIR;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);

  writeUInt32BE(buf, handlelen, p);
  where.copy(buf, p += 4);

  state.requests[reqid] = {
    cb: (doFilter
         ? function(err, list) {
             if (err)
               return cb(err);

             for (var i = list.length - 1; i >= 0; --i) {
               if (list[i].filename === '.' || list[i].filename === '..')
                 list.splice(i, 1);
             }

             cb(undefined, list);
           }
         : cb)
  };

  this.debug('DEBUG[SFTP]: Outgoing: Writing READDIR');
  return this.push(buf);
};
SFTPStream.prototype.fstat = function(handle, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!Buffer.isBuffer(handle))
    throw new Error('handle is not a Buffer');

  var state = this._state;

  /*
    uint32     id
    string     handle
  */
  var handlelen = handle.length;
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + handlelen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.FSTAT;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);

  writeUInt32BE(buf, handlelen, p);
  handle.copy(buf, p += 4);

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing FSTAT');
  return this.push(buf);
};
SFTPStream.prototype.stat = function(path, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     path
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathlen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.STAT;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);

  writeUInt32BE(buf, pathlen, p);
  buf.write(path, p += 4, pathlen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing STAT');
  return this.push(buf);
};
SFTPStream.prototype.lstat = function(path, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     path
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathlen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.LSTAT;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);

  writeUInt32BE(buf, pathlen, p);
  buf.write(path, p += 4, pathlen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing LSTAT');
  return this.push(buf);
};
SFTPStream.prototype.opendir = function(path, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     path
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathlen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.OPENDIR;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);

  writeUInt32BE(buf, pathlen, p);
  buf.write(path, p += 4, pathlen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing OPENDIR');
  return this.push(buf);
};
SFTPStream.prototype.setstat = function(path, attrs, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var flags = 0;
  var attrBytes = 0;
  var state = this._state;

  if (typeof attrs === 'object' && attrs !== null) {
    attrs = attrsToBytes(attrs);
    flags = attrs.flags;
    attrBytes = attrs.nbytes;
    attrs = attrs.bytes;
  } else if (typeof attrs === 'function')
    cb = attrs;

  /*
    uint32     id
    string     path
    ATTRS      attrs
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathlen + 4 + attrBytes);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.SETSTAT;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);

  writeUInt32BE(buf, pathlen, p);
  buf.write(path, p += 4, pathlen, 'utf8');
  writeUInt32BE(buf, flags, p += pathlen);
  if (flags) {
    p += 4;
    for (var i = 0, len = attrs.length; i < len; ++i)
      for (var j = 0, len2 = attrs[i].length; j < len2; ++j)
        buf[p++] = attrs[i][j];
  }

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing SETSTAT');
  return this.push(buf);
};
SFTPStream.prototype.fsetstat = function(handle, attrs, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!Buffer.isBuffer(handle))
    throw new Error('handle is not a Buffer');

  var flags = 0;
  var attrBytes = 0;
  var state = this._state;

  if (typeof attrs === 'object' && attrs !== null) {
    attrs = attrsToBytes(attrs);
    flags = attrs.flags;
    attrBytes = attrs.nbytes;
    attrs = attrs.bytes;
  } else if (typeof attrs === 'function')
    cb = attrs;

  /*
    uint32     id
    string     handle
    ATTRS      attrs
  */
  var handlelen = handle.length;
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + handlelen + 4 + attrBytes);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.FSETSTAT;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);

  writeUInt32BE(buf, handlelen, p);
  handle.copy(buf, p += 4);
  writeUInt32BE(buf, flags, p += handlelen);
  if (flags) {
    p += 4;
    for (var i = 0, len = attrs.length; i < len; ++i)
      for (var j = 0, len2 = attrs[i].length; j < len2; ++j)
        buf[p++] = attrs[i][j];
  }

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing FSETSTAT');
  return this.push(buf);
};
SFTPStream.prototype.futimes = function(handle, atime, mtime, cb) {
  return this.fsetstat(handle, {
    atime: toUnixTimestamp(atime),
    mtime: toUnixTimestamp(mtime)
  }, cb);
};
SFTPStream.prototype.utimes = function(path, atime, mtime, cb) {
  return this.setstat(path, {
    atime: toUnixTimestamp(atime),
    mtime: toUnixTimestamp(mtime)
  }, cb);
};
SFTPStream.prototype.fchown = function(handle, uid, gid, cb) {
  return this.fsetstat(handle, {
    uid: uid,
    gid: gid
  }, cb);
};
SFTPStream.prototype.chown = function(path, uid, gid, cb) {
  return this.setstat(path, {
    uid: uid,
    gid: gid
  }, cb);
};
SFTPStream.prototype.fchmod = function(handle, mode, cb) {
  return this.fsetstat(handle, {
    mode: mode
  }, cb);
};
SFTPStream.prototype.chmod = function(path, mode, cb) {
  return this.setstat(path, {
    mode: mode
  }, cb);
};
SFTPStream.prototype.readlink = function(path, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     path
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathlen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.READLINK;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);

  writeUInt32BE(buf, pathlen, p);
  buf.write(path, p += 4, pathlen, 'utf8');

  state.requests[reqid] = {
    cb: function(err, names) {
      if (err)
        return cb(err);
      else if (!names || !names.length)
        return cb(new Error('Response missing link info'));
      cb(undefined, names[0].filename);
    }
  };

  this.debug('DEBUG[SFTP]: Outgoing: Writing READLINK');
  return this.push(buf);
};
SFTPStream.prototype.symlink = function(targetPath, linkPath, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     linkpath
    string     targetpath
  */
  var linklen = Buffer.byteLength(linkPath);
  var targetlen = Buffer.byteLength(targetPath);
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + linklen + 4 + targetlen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.SYMLINK;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);

  if (this._isOpenSSH) {
    // OpenSSH has linkpath and targetpath positions switched
    writeUInt32BE(buf, targetlen, p);
    buf.write(targetPath, p += 4, targetlen, 'utf8');
    writeUInt32BE(buf, linklen, p += targetlen);
    buf.write(linkPath, p += 4, linklen, 'utf8');
  } else {
    writeUInt32BE(buf, linklen, p);
    buf.write(linkPath, p += 4, linklen, 'utf8');
    writeUInt32BE(buf, targetlen, p += linklen);
    buf.write(targetPath, p += 4, targetlen, 'utf8');
  }

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing SYMLINK');
  return this.push(buf);
};
SFTPStream.prototype.realpath = function(path, cb) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var state = this._state;

  /*
    uint32     id
    string     path
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + pathlen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.REALPATH;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);

  writeUInt32BE(buf, pathlen, p);
  buf.write(path, p += 4, pathlen, 'utf8');

  state.requests[reqid] = {
    cb: function(err, names) {
      if (err)
        return cb(err);
      else if (!names || !names.length)
        return cb(new Error('Response missing path info'));
      cb(undefined, names[0].filename);
    }
  };

  this.debug('DEBUG[SFTP]: Outgoing: Writing REALPATH');
  return this.push(buf);
};
// extended requests
SFTPStream.prototype.ext_openssh_rename = function(oldPath, newPath, cb) {
  var state = this._state;

  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!state.extensions['posix-rename@openssh.com']
           || state.extensions['posix-rename@openssh.com'].indexOf('1') === -1)
    throw new Error('Server does not support this extended request');

  /*
    uint32    id
    string    "posix-rename@openssh.com"
    string    oldpath
    string    newpath
  */
  var oldlen = Buffer.byteLength(oldPath);
  var newlen = Buffer.byteLength(newPath);
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + 24 + 4 + oldlen + 4 + newlen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.EXTENDED;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);
  writeUInt32BE(buf, 24, p);
  buf.write('posix-rename@openssh.com', p += 4, 24, 'ascii');

  writeUInt32BE(buf, oldlen, p += 24);
  buf.write(oldPath, p += 4, oldlen, 'utf8');
  writeUInt32BE(buf, newlen, p += oldlen);
  buf.write(newPath, p += 4, newlen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing posix-rename@openssh.com');
  return this.push(buf);
};
SFTPStream.prototype.ext_openssh_statvfs = function(path, cb) {
  var state = this._state;

  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!state.extensions['statvfs@openssh.com']
           || state.extensions['statvfs@openssh.com'].indexOf('2') === -1)
    throw new Error('Server does not support this extended request');

  /*
    uint32    id
    string    "statvfs@openssh.com"
    string    path
  */
  var pathlen = Buffer.byteLength(path);
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + 19 + 4 + pathlen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.EXTENDED;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);
  writeUInt32BE(buf, 19, p);
  buf.write('statvfs@openssh.com', p += 4, 19, 'ascii');

  writeUInt32BE(buf, pathlen, p += 19);
  buf.write(path, p += 4, pathlen, 'utf8');

  state.requests[reqid] = {
    extended: 'statvfs@openssh.com',
    cb: cb
  };

  this.debug('DEBUG[SFTP]: Outgoing: Writing statvfs@openssh.com');
  return this.push(buf);
};
SFTPStream.prototype.ext_openssh_fstatvfs = function(handle, cb) {
  var state = this._state;

  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!state.extensions['fstatvfs@openssh.com']
           || state.extensions['fstatvfs@openssh.com'].indexOf('2') === -1)
    throw new Error('Server does not support this extended request');
  else if (!Buffer.isBuffer(handle))
    throw new Error('handle is not a Buffer');

  /*
    uint32    id
    string    "fstatvfs@openssh.com"
    string    handle
  */
  var handlelen = handle.length;
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + 20 + 4 + handlelen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.EXTENDED;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);
  writeUInt32BE(buf, 20, p);
  buf.write('fstatvfs@openssh.com', p += 4, 20, 'ascii');

  writeUInt32BE(buf, handlelen, p += 20);
  buf.write(handle, p += 4, handlelen, 'utf8');

  state.requests[reqid] = {
    extended: 'fstatvfs@openssh.com',
    cb: cb
  };

  this.debug('DEBUG[SFTP]: Outgoing: Writing fstatvfs@openssh.com');
  return this.push(buf);
};
SFTPStream.prototype.ext_openssh_hardlink = function(oldPath, newPath, cb) {
  var state = this._state;

  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!state.extensions['hardlink@openssh.com']
           || state.extensions['hardlink@openssh.com'].indexOf('1') === -1)
    throw new Error('Server does not support this extended request');

  /*
    uint32    id
    string    "hardlink@openssh.com"
    string    oldpath
    string    newpath
  */
  var oldlen = Buffer.byteLength(oldPath);
  var newlen = Buffer.byteLength(newPath);
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + 20 + 4 + oldlen + 4 + newlen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.EXTENDED;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);
  writeUInt32BE(buf, 20, p);
  buf.write('hardlink@openssh.com', p += 4, 20, 'ascii');

  writeUInt32BE(buf, oldlen, p += 20);
  buf.write(oldPath, p += 4, oldlen, 'utf8');
  writeUInt32BE(buf, newlen, p += oldlen);
  buf.write(newPath, p += 4, newlen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing hardlink@openssh.com');
  return this.push(buf);
};
SFTPStream.prototype.ext_openssh_fsync = function(handle, cb) {
  var state = this._state;

  if (this.server)
    throw new Error('Client-only method called in server mode');
  else if (!state.extensions['fsync@openssh.com']
           || state.extensions['fsync@openssh.com'].indexOf('1') === -1)
    throw new Error('Server does not support this extended request');
  else if (!Buffer.isBuffer(handle))
    throw new Error('handle is not a Buffer');

  /*
    uint32    id
    string    "fsync@openssh.com"
    string    handle
  */
  var handlelen = handle.length;
  var p = 9;
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + 17 + 4 + handlelen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = REQUEST.EXTENDED;
  var reqid = state.writeReqid = (state.writeReqid + 1) % MAX_REQID;
  writeUInt32BE(buf, reqid, 5);
  writeUInt32BE(buf, 17, p);
  buf.write('fsync@openssh.com', p += 4, 17, 'ascii');

  writeUInt32BE(buf, handlelen, p += 17);
  buf.write(handle, p += 4, handlelen, 'utf8');

  state.requests[reqid] = { cb: cb };

  this.debug('DEBUG[SFTP]: Outgoing: Writing fsync@openssh.com');
  return this.push(buf);
};

// server
SFTPStream.prototype.status = function(id, code, message, lang) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  if (!STATUS_CODE[code] || typeof code !== 'number')
    throw new Error('Bad status code: ' + code);

  message || (message = '');
  lang || (lang = '');

  var msgLen = Buffer.byteLength(message);
  var langLen = Buffer.byteLength(lang);
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + 4 + msgLen + 4 + langLen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = RESPONSE.STATUS;
  writeUInt32BE(buf, id, 5);

  writeUInt32BE(buf, code, 9);

  writeUInt32BE(buf, msgLen, 13);
  if (msgLen)
    buf.write(message, 17, msgLen, 'utf8');

  writeUInt32BE(buf, langLen, 17 + msgLen);
  if (langLen)
    buf.write(lang, 17 + msgLen + 4, langLen, 'ascii');

  this.debug('DEBUG[SFTP]: Outgoing: Writing STATUS');
  return this.push(buf);
};
SFTPStream.prototype.handle = function(id, handle) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  if (!Buffer.isBuffer(handle))
    throw new Error('handle is not a Buffer');

  var handleLen = handle.length;

  if (handleLen > 256)
    throw new Error('handle too large (> 256 bytes)');

  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + handleLen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = RESPONSE.HANDLE;
  writeUInt32BE(buf, id, 5);

  writeUInt32BE(buf, handleLen, 9);
  if (handleLen)
    handle.copy(buf, 13);

  this.debug('DEBUG[SFTP]: Outgoing: Writing HANDLE');
  return this.push(buf);
};
SFTPStream.prototype.data = function(id, data, encoding) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var isBuffer = Buffer.isBuffer(data);

  if (!isBuffer && typeof data !== 'string')
    throw new Error('data is not a Buffer or string');

  if (!isBuffer)
    encoding || (encoding = 'utf8');

  var dataLen = (isBuffer ? data.length : Buffer.byteLength(data, encoding));
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + dataLen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = RESPONSE.DATA;
  writeUInt32BE(buf, id, 5);

  writeUInt32BE(buf, dataLen, 9);
  if (dataLen) {
    if (isBuffer)
      data.copy(buf, 13);
    else
      buf.write(data, 13, dataLen, encoding);
  }

  this.debug('DEBUG[SFTP]: Outgoing: Writing DATA');
  return this.push(buf);
};
SFTPStream.prototype.name = function(id, names) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  if (!Array.isArray(names)) {
    if (typeof names !== 'object' || names === null)
      throw new Error('names is not an object or array');
    names = [ names ];
  }

  var count = names.length;
  var namesLen = 0;
  var nameAttrs;
  var attrs = [];
  var name;
  var filename;
  var longname;
  var attr;
  var len;
  var len2;
  var buf;
  var p;
  var i;
  var j;
  var k;

  for (i = 0; i < count; ++i) {
    name = names[i];
    filename = (!name || !name.filename || typeof name.filename !== 'string'
                ? ''
                : name.filename);
    namesLen += 4 + Buffer.byteLength(filename);
    longname = (!name || !name.longname || typeof name.longname !== 'string'
                ? ''
                : name.longname);
    namesLen += 4 + Buffer.byteLength(longname);

    if (typeof name.attrs === 'object' && name.attrs !== null) {
      nameAttrs = attrsToBytes(name.attrs);
      namesLen += 4 + nameAttrs.nbytes;
      attrs.push(nameAttrs);
    } else {
      namesLen += 4;
      attrs.push(null);
    }
  }

  buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + namesLen);

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = RESPONSE.NAME;
  writeUInt32BE(buf, id, 5);

  writeUInt32BE(buf, count, 9);

  p = 13;

  for (i = 0; i < count; ++i) {
    name = names[i];

    filename = (!name || !name.filename || typeof name.filename !== 'string'
                ? ''
                : name.filename);
    len = Buffer.byteLength(filename);
    writeUInt32BE(buf, len, p);
    p += 4;
    if (len) {
      buf.write(filename, p, len, 'utf8');
      p += len;
    }

    longname = (!name || !name.longname || typeof name.longname !== 'string'
                ? ''
                : name.longname);
    len = Buffer.byteLength(longname);
    writeUInt32BE(buf, len, p);
    p += 4;
    if (len) {
      buf.write(longname, p, len, 'utf8');
      p += len;
    }

    attr = attrs[i];
    if (attr) {
      writeUInt32BE(buf, attr.flags, p);
      p += 4;
      if (attr.flags && attr.bytes) {
        var bytes = attr.bytes;
        for (j = 0, len = bytes.length; j < len; ++j)
          for (k = 0, len2 = bytes[j].length; k < len2; ++k)
            buf[p++] = bytes[j][k];
      }
    } else {
      writeUInt32BE(buf, 0, p);
      p += 4;
    }
  }

  this.debug('DEBUG[SFTP]: Outgoing: Writing NAME');
  return this.push(buf);
};
SFTPStream.prototype.attrs = function(id, attrs) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  if (typeof attrs !== 'object' || attrs === null)
    throw new Error('attrs is not an object');

  var info = attrsToBytes(attrs);
  var buf = Buffer.allocUnsafe(4 + 1 + 4 + 4 + info.nbytes);
  var p = 13;

  writeUInt32BE(buf, buf.length - 4, 0);
  buf[4] = RESPONSE.ATTRS;
  writeUInt32BE(buf, id, 5);

  writeUInt32BE(buf, info.flags, 9);

  if (info.flags && info.bytes) {
    var bytes = info.bytes;
    for (var j = 0, len = bytes.length; j < len; ++j)
      for (var k = 0, len2 = bytes[j].length; k < len2; ++k)
        buf[p++] = bytes[j][k];
  }

  this.debug('DEBUG[SFTP]: Outgoing: Writing ATTRS');
  return this.push(buf);
};

function readAttrs(buf, p, stream, callback) {
  /*
    uint32   flags
    uint64   size           present only if flag SSH_FILEXFER_ATTR_SIZE
    uint32   uid            present only if flag SSH_FILEXFER_ATTR_UIDGID
    uint32   gid            present only if flag SSH_FILEXFER_ATTR_UIDGID
    uint32   permissions    present only if flag SSH_FILEXFER_ATTR_PERMISSIONS
    uint32   atime          present only if flag SSH_FILEXFER_ACMODTIME
    uint32   mtime          present only if flag SSH_FILEXFER_ACMODTIME
    uint32   extended_count present only if flag SSH_FILEXFER_ATTR_EXTENDED
    string   extended_type
    string   extended_data
    ...      more extended data (extended_type - extended_data pairs),
               so that number of pairs equals extended_count
  */
  var flags = readUInt32BE(buf, p);
  var attrs = new Stats();

  p += 4;

  if (flags & ATTR.SIZE) {
    var size = readUInt64BE(buf, p, stream, callback);
    if (size === false)
      return false;
    attrs.size = size;
    p += 8;
  }
  if (flags & ATTR.UIDGID) {
    var uid;
    var gid;
    uid = readInt(buf, p, this, callback);
    if (uid === false)
      return false;
    attrs.uid = uid;
    p += 4;
    gid = readInt(buf, p, this, callback);
    if (gid === false)
      return false;
    attrs.gid = gid;
    p += 4;
  }
  if (flags & ATTR.PERMISSIONS) {
    var mode = readInt(buf, p, this, callback);
    if (mode === false)
      return false;
    attrs.mode = mode;
    // backwards compatibility
    attrs.permissions = mode;
    p += 4;
  }
  if (flags & ATTR.ACMODTIME) {
    var atime;
    var mtime;
    atime = readInt(buf, p, this, callback);
    if (atime === false)
      return false;
    attrs.atime = atime;
    p += 4;
    mtime = readInt(buf, p, this, callback);
    if (mtime === false)
      return false;
    attrs.mtime = mtime;
    p += 4;
  }
  if (flags & ATTR.EXTENDED) {
    // TODO: read/parse extended data
    var extcount = readInt(buf, p, this, callback);
    if (extcount === false)
      return false;
    p += 4;
    for (var i = 0, len; i < extcount; ++i) {
      len = readInt(buf, p, this, callback);
      if (len === false)
        return false;
      p += 4 + len;
    }
  }

  buf._pos = p;

  return attrs;
}

function readUInt64BE(buffer, p, stream, callback) {
  if ((buffer.length - p) < 8) {
    stream && stream._cleanup(callback);
    return false;
  }

  var val = 0;

  for (var len = p + 8; p < len; ++p) {
    val *= 256;
    val += buffer[p];
  }

  buffer._pos = p;

  return val;
}

function attrsToBytes(attrs) {
  var flags = 0;
  var attrBytes = 0;
  var ret = [];
  var i = 0;

  if (typeof attrs !== 'object' || attrs === null)
    return { flags: flags, nbytes: attrBytes, bytes: ret };

  if (typeof attrs.size === 'number') {
    flags |= ATTR.SIZE;
    attrBytes += 8;
    var sizeBytes = new Array(8);
    var val = attrs.size;
    for (i = 7; i >= 0; --i) {
      sizeBytes[i] = val & 0xFF;
      val /= 256;
    }
    ret.push(sizeBytes);
  }
  if (typeof attrs.uid === 'number' && typeof attrs.gid === 'number') {
    flags |= ATTR.UIDGID;
    attrBytes += 8;
    ret.push([(attrs.uid >> 24) & 0xFF, (attrs.uid >> 16) & 0xFF,
              (attrs.uid >> 8) & 0xFF, attrs.uid & 0xFF]);
    ret.push([(attrs.gid >> 24) & 0xFF, (attrs.gid >> 16) & 0xFF,
              (attrs.gid >> 8) & 0xFF, attrs.gid & 0xFF]);
  }
  if (typeof attrs.permissions === 'number'
      || typeof attrs.permissions === 'string'
      || typeof attrs.mode === 'number'
      || typeof attrs.mode === 'string') {
    var mode = modeNum(attrs.mode || attrs.permissions);
    flags |= ATTR.PERMISSIONS;
    attrBytes += 4;
    ret.push([(mode >> 24) & 0xFF,
              (mode >> 16) & 0xFF,
              (mode >> 8) & 0xFF,
              mode & 0xFF]);
  }
  if ((typeof attrs.atime === 'number' || isDate(attrs.atime))
      && (typeof attrs.mtime === 'number' || isDate(attrs.mtime))) {
    var atime = toUnixTimestamp(attrs.atime);
    var mtime = toUnixTimestamp(attrs.mtime);

    flags |= ATTR.ACMODTIME;
    attrBytes += 8;
    ret.push([(atime >> 24) & 0xFF, (atime >> 16) & 0xFF,
              (atime >> 8) & 0xFF, atime & 0xFF]);
    ret.push([(mtime >> 24) & 0xFF, (mtime >> 16) & 0xFF,
              (mtime >> 8) & 0xFF, mtime & 0xFF]);
  }
  // TODO: extended attributes

  return { flags: flags, nbytes: attrBytes, bytes: ret };
}

function toUnixTimestamp(time) {
  if (typeof time === 'number' && !isNaN(time))
    return time;
  else if (isDate(time))
    return parseInt(time.getTime() / 1000, 10);
  throw new Error('Cannot parse time: ' + time);
}

function modeNum(mode) {
  if (typeof mode === 'number' && !isNaN(mode))
    return mode;
  else if (typeof mode === 'string')
    return modeNum(parseInt(mode, 8));
  throw new Error('Cannot parse mode: ' + mode);
}

var stringFlagMap = {
  'r': OPEN_MODE.READ,
  'r+': OPEN_MODE.READ | OPEN_MODE.WRITE,
  'w': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.WRITE,
  'wx': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.WRITE | OPEN_MODE.EXCL,
  'xw': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.WRITE | OPEN_MODE.EXCL,
  'w+': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE,
  'wx+': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE
         | OPEN_MODE.EXCL,
  'xw+': OPEN_MODE.TRUNC | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE
         | OPEN_MODE.EXCL,
  'a': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.WRITE,
  'ax': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.WRITE | OPEN_MODE.EXCL,
  'xa': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.WRITE | OPEN_MODE.EXCL,
  'a+': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE,
  'ax+': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE
         | OPEN_MODE.EXCL,
  'xa+': OPEN_MODE.APPEND | OPEN_MODE.CREAT | OPEN_MODE.READ | OPEN_MODE.WRITE
         | OPEN_MODE.EXCL
};
var stringFlagMapKeys = Object.keys(stringFlagMap);

function stringToFlags(str) {
  var flags = stringFlagMap[str];
  if (flags !== undefined)
    return flags;
  return null;
}
SFTPStream.stringToFlags = stringToFlags;

function flagsToString(flags) {
  for (var i = 0; i < stringFlagMapKeys.length; ++i) {
    var key = stringFlagMapKeys[i];
    if (stringFlagMap[key] === flags)
      return key;
  }
  return null;
}
SFTPStream.flagsToString = flagsToString;

function Stats(initial) {
  this.mode = (initial && initial.mode);
  this.permissions = this.mode; // backwards compatiblity
  this.uid = (initial && initial.uid);
  this.gid = (initial && initial.gid);
  this.size = (initial && initial.size);
  this.atime = (initial && initial.atime);
  this.mtime = (initial && initial.mtime);
}
Stats.prototype._checkModeProperty = function(property) {
  return ((this.mode & constants.S_IFMT) === property);
};
Stats.prototype.isDirectory = function() {
  return this._checkModeProperty(constants.S_IFDIR);
};
Stats.prototype.isFile = function() {
  return this._checkModeProperty(constants.S_IFREG);
};
Stats.prototype.isBlockDevice = function() {
  return this._checkModeProperty(constants.S_IFBLK);
};
Stats.prototype.isCharacterDevice = function() {
  return this._checkModeProperty(constants.S_IFCHR);
};
Stats.prototype.isSymbolicLink = function() {
  return this._checkModeProperty(constants.S_IFLNK);
};
Stats.prototype.isFIFO = function() {
  return this._checkModeProperty(constants.S_IFIFO);
};
Stats.prototype.isSocket = function() {
  return this._checkModeProperty(constants.S_IFSOCK);
};
SFTPStream.Stats = Stats;

// =============================================================================
// ReadStream/WriteStream-related
var fsCompat = __nccwpck_require__(5265);
var validateNumber = fsCompat.validateNumber;
var destroyImpl = fsCompat.destroyImpl;
var ERR_OUT_OF_RANGE = fsCompat.ERR_OUT_OF_RANGE;
var ERR_INVALID_ARG_TYPE = fsCompat.ERR_INVALID_ARG_TYPE;

var kMinPoolSpace = 128;

var pool;
// It can happen that we expect to read a large chunk of data, and reserve
// a large chunk of the pool accordingly, but the read() call only filled
// a portion of it. If a concurrently executing read() then uses the same pool,
// the "reserved" portion cannot be used, so we allow it to be re-used as a
// new pool later.
var poolFragments = [];

function allocNewPool(poolSize) {
  if (poolFragments.length > 0)
    pool = poolFragments.pop();
  else
    pool = Buffer.allocUnsafe(poolSize);
  pool.used = 0;
}

// Check the `this.start` and `this.end` of stream.
function checkPosition(pos, name) {
  if (!Number.isSafeInteger(pos)) {
    validateNumber(pos, name);
    if (!Number.isInteger(pos))
      throw new ERR_OUT_OF_RANGE(name, 'an integer', pos);
    throw new ERR_OUT_OF_RANGE(name, '>= 0 and <= 2 ** 53 - 1', pos);
  }
  if (pos < 0)
    throw new ERR_OUT_OF_RANGE(name, '>= 0 and <= 2 ** 53 - 1', pos);
}

function roundUpToMultipleOf8(n) {
  return (n + 7) & ~7;  // Align to 8 byte boundary.
}

function ReadStream(sftp, path, options) {
  if (options === undefined)
    options = {};
  else if (typeof options === 'string')
    options = { encoding: options };
  else if (options === null || typeof options !== 'object')
    throw new TypeError('"options" argument must be a string or an object');
  else
    options = Object.create(options);

  // A little bit bigger buffer and water marks by default
  if (options.highWaterMark === undefined)
    options.highWaterMark = 64 * 1024;

  // For backwards compat do not emit close on destroy.
  options.emitClose = false;

  ReadableStream.call(this, options);

  this.path = path;
  this.flags = options.flags === undefined ? 'r' : options.flags;
  this.mode = options.mode === undefined ? 0o666 : options.mode;

  this.start = options.start;
  this.end = options.end;
  this.autoClose = options.autoClose === undefined ? true : options.autoClose;
  this.pos = 0;
  this.bytesRead = 0;
  this.closed = false;

  this.handle = options.handle === undefined ? null : options.handle;
  this.sftp = sftp;
  this._opening = false;

  if (this.start !== undefined) {
    checkPosition(this.start, 'start');

    this.pos = this.start;
  }

  if (this.end === undefined) {
    this.end = Infinity;
  } else if (this.end !== Infinity) {
    checkPosition(this.end, 'end');

    if (this.start !== undefined && this.start > this.end) {
      throw new ERR_OUT_OF_RANGE(
        'start',
        `<= "end" (here: ${this.end})`,
        this.start
      );
    }
  }

  this.on('end', function() {
    if (this.autoClose)
      this.destroy();
  });

  if (!Buffer.isBuffer(this.handle))
    this.open();
}
inherits(ReadStream, ReadableStream);

ReadStream.prototype.open = function() {
  if (this._opening)
    return;

  this._opening = true;

  this.sftp.open(this.path, this.flags, this.mode, (er, handle) => {
    this._opening = false;

    if (er) {
      this.emit('error', er);
      if (this.autoClose)
        this.destroy();
      return;
    }

    this.handle = handle;
    this.emit('open', handle);
    this.emit('ready');
    // start the flow of data.
    this.read();
  });
};

ReadStream.prototype._read = function(n) {
  if (!Buffer.isBuffer(this.handle)) {
    return this.once('open', function() {
      this._read(n);
    });
  }

  // XXX: safe to remove this?
  if (this.destroyed)
    return;

  if (!pool || pool.length - pool.used < kMinPoolSpace) {
    // discard the old pool.
    allocNewPool(this.readableHighWaterMark
                 || this._readableState.highWaterMark);
  }

  // Grab another reference to the pool in the case that while we're
  // in the thread pool another read() finishes up the pool, and
  // allocates a new one.
  var thisPool = pool;
  var toRead = Math.min(pool.length - pool.used, n);
  var start = pool.used;

  if (this.end !== undefined)
    toRead = Math.min(this.end - this.pos + 1, toRead);

  // Already read everything we were supposed to read!
  // treat as EOF.
  if (toRead <= 0)
    return this.push(null);

  // the actual read.
  this.sftp.readData(this.handle,
                     pool,
                     pool.used,
                     toRead,
                     this.pos,
                     (er, bytesRead) => {
    if (er) {
      this.emit('error', er);
      if (this.autoClose)
        this.destroy();
      return;
    }
    var b = null;

    // Now that we know how much data we have actually read, re-wind the
    // 'used' field if we can, and otherwise allow the remainder of our
    // reservation to be used as a new pool later.
    if (start + toRead === thisPool.used && thisPool === pool) {
      var newUsed = thisPool.used + bytesRead - toRead;
      thisPool.used = roundUpToMultipleOf8(newUsed);
    } else {
      // Round down to the next lowest multiple of 8 to ensure the new pool
      // fragment start and end positions are aligned to an 8 byte boundary.
      var alignedEnd = (start + toRead) & ~7;
      var alignedStart = roundUpToMultipleOf8(start + bytesRead);
      if (alignedEnd - alignedStart >= kMinPoolSpace)
        poolFragments.push(thisPool.slice(alignedStart, alignedEnd));
    }

    if (bytesRead > 0) {
      this.bytesRead += bytesRead;
      b = thisPool.slice(start, start + bytesRead);
    }

    // Move the pool positions, and internal position for reading.
    this.pos += bytesRead;

    this.push(b);
  });

  pool.used = roundUpToMultipleOf8(pool.used + toRead);
};

if (typeof ReadableStream.prototype.destroy !== 'function')
  ReadStream.prototype.destroy = destroyImpl;

ReadStream.prototype._destroy = function(err, cb) {
  if (this._opening && !Buffer.isBuffer(this.handle)) {
    this.once('open', closeStream.bind(null, this, cb, err));
    return;
  }

  closeStream(this, cb, err);
  this.handle = null;
  this._opening = false;
};

function closeStream(stream, cb, err) {
  if (!stream.handle)
    return onclose();

  stream.sftp.close(stream.handle, onclose);

  function onclose(er) {
    er = er || err;
    cb(er);
    stream.closed = true;
    if (!er)
      stream.emit('close');
  }
}

ReadStream.prototype.close = function(cb) {
  this.destroy(null, cb);
};

Object.defineProperty(ReadStream.prototype, 'pending', {
  get() { return this.handle === null; },
  configurable: true
});

function WriteStream(sftp, path, options) {
  if (options === undefined)
    options = {};
  else if (typeof options === 'string')
    options = { encoding: options };
  else if (options === null || typeof options !== 'object')
    throw new TypeError('"options" argument must be a string or an object');
  else
    options = Object.create(options);

  // For backwards compat do not emit close on destroy.
  options.emitClose = false;

  WritableStream.call(this, options);

  this.path = path;
  this.flags = options.flags === undefined ? 'w' : options.flags;
  this.mode = options.mode === undefined ? 0o666 : options.mode;

  this.start = options.start;
  this.autoClose = options.autoClose === undefined ? true : options.autoClose;
  this.pos = 0;
  this.bytesWritten = 0;
  this.closed = false;

  this.handle = options.handle === undefined ? null : options.handle;
  this.sftp = sftp;
  this._opening = false;

  if (this.start !== undefined) {
    checkPosition(this.start, 'start');

    this.pos = this.start;
  }

  if (options.encoding)
    this.setDefaultEncoding(options.encoding);

  // Node v6.x only
  this.on('finish', function() {
    if (this._writableState.finalCalled)
      return;
    if (this.autoClose)
      this.destroy();
  });

  if (!Buffer.isBuffer(this.handle))
    this.open();
}
inherits(WriteStream, WritableStream);

WriteStream.prototype._final = function(cb) {
  if (this.autoClose)
    this.destroy();
  cb();
};

WriteStream.prototype.open = function() {
  if (this._opening)
    return;

  this._opening = true;

  this.sftp.open(this.path, this.flags, this.mode, (er, handle) => {
    this._opening = false;

    if (er) {
      this.emit('error', er);
      if (this.autoClose)
        this.destroy();
      return;
    }

    this.handle = handle;

    var tryAgain = (err) => {
      if (err) {
        // Try chmod() for sftp servers that may not support fchmod() for
        // whatever reason
        this.sftp.chmod(this.path, this.mode, (err_) => {
          tryAgain();
        });
        return;
      }

      // SFTPv3 requires absolute offsets, no matter the open flag used
      if (this.flags[0] === 'a') {
        var tryStat = (err, st) => {
          if (err) {
            // Try stat() for sftp servers that may not support fstat() for
            // whatever reason
            this.sftp.stat(this.path, (err_, st_) => {
              if (err_) {
                this.destroy();
                this.emit('error', err);
                return;
              }
              tryStat(null, st_);
            });
            return;
          }

          this.pos = st.size;
          this.emit('open', handle);
          this.emit('ready');
        };

        this.sftp.fstat(handle, tryStat);
        return;
      }

      this.emit('open', handle);
      this.emit('ready');
    };

    this.sftp.fchmod(handle, this.mode, tryAgain);
  });
};

WriteStream.prototype._write = function(data, encoding, cb) {
  if (!Buffer.isBuffer(data)) {
    const err = new ERR_INVALID_ARG_TYPE('data', 'Buffer', data);
    return this.emit('error', err);
  }

  if (!Buffer.isBuffer(this.handle)) {
    return this.once('open', function() {
      this._write(data, encoding, cb);
    });
  }

  this.sftp.writeData(this.handle,
                      data,
                      0,
                      data.length,
                      this.pos,
                      (er, bytes) => {
    if (er) {
      if (this.autoClose)
        this.destroy();
      return cb(er);
    }
    this.bytesWritten += bytes;
    cb();
  });

  this.pos += data.length;
};

WriteStream.prototype._writev = function(data, cb) {
  if (!Buffer.isBuffer(this.handle)) {
    return this.once('open', function() {
      this._writev(data, cb);
    });
  }

  var sftp = this.sftp;
  var handle = this.handle;
  var writesLeft = data.length;

  var onwrite = (er, bytes) => {
    if (er) {
      this.destroy();
      return cb(er);
    }
    this.bytesWritten += bytes;
    if (--writesLeft === 0)
      cb();
  };

  // TODO: try to combine chunks to reduce number of requests to the server
  for (var i = 0; i < data.length; ++i) {
    var chunk = data[i].chunk;

    sftp.writeData(handle, chunk, 0, chunk.length, this.pos, onwrite);
    this.pos += chunk.length;
  }
};

if (typeof WritableStream.prototype.destroy !== 'function')
  WriteStream.prototype.destroy = ReadStream.prototype.destroy;

WriteStream.prototype._destroy = ReadStream.prototype._destroy;
WriteStream.prototype.close = function(cb) {
  if (cb) {
    if (this.closed) {
      process.nextTick(cb);
      return;
    } else {
      this.on('close', cb);
    }
  }

  // If we are not autoClosing, we should call
  // destroy on 'finish'.
  if (!this.autoClose)
    this.on('finish', this.destroy.bind(this));

  this.end();
};

// There is no shutdown() for files.
WriteStream.prototype.destroySoon = WriteStream.prototype.end;

Object.defineProperty(WriteStream.prototype, 'pending', {
  get() { return this.handle === null; },
  configurable: true
});

module.exports = SFTPStream;



/***/ }),

/***/ 1788:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// TODO: * Automatic re-key every (configurable) n bytes or length of time
//         - RFC suggests every 1GB of transmitted data or 1 hour, whichever
//           comes sooner
//       * Filter control codes from strings
//         (as per http://tools.ietf.org/html/rfc4251#section-9.2)

var crypto = __nccwpck_require__(6417);
var zlib = __nccwpck_require__(8761);
var TransformStream = __nccwpck_require__(2413).Transform;
var inherits = __nccwpck_require__(1669).inherits;
var inspect = __nccwpck_require__(1669).inspect;

var StreamSearch = __nccwpck_require__(2405);
var Ber = __nccwpck_require__(970).Ber;

var readUInt32BE = __nccwpck_require__(9419).readUInt32BE;
var writeUInt32BE = __nccwpck_require__(9419).writeUInt32BE;
var consts = __nccwpck_require__(4617);
var utils = __nccwpck_require__(4928);
var iv_inc = utils.iv_inc;
var readString = utils.readString;
var readInt = utils.readInt;
var DSASigBERToBare = utils.DSASigBERToBare;
var ECDSASigASN1ToSSH = utils.ECDSASigASN1ToSSH;
var sigSSHToASN1 = utils.sigSSHToASN1;
var parseDERKey = __nccwpck_require__(8820).parseDERKey;

var CIPHER_INFO = consts.CIPHER_INFO;
var HMAC_INFO = consts.HMAC_INFO;
var MESSAGE = consts.MESSAGE;
var DYNAMIC_KEXDH_MESSAGE = consts.DYNAMIC_KEXDH_MESSAGE;
var KEXDH_MESSAGE = consts.KEXDH_MESSAGE;
var ALGORITHMS = consts.ALGORITHMS;
var DISCONNECT_REASON = consts.DISCONNECT_REASON;
var CHANNEL_OPEN_FAILURE = consts.CHANNEL_OPEN_FAILURE;
var SSH_TO_OPENSSL = consts.SSH_TO_OPENSSL;
var TERMINAL_MODE = consts.TERMINAL_MODE;
var SIGNALS = consts.SIGNALS;
var EDDSA_SUPPORTED = consts.EDDSA_SUPPORTED;
var CURVE25519_SUPPORTED = consts.CURVE25519_SUPPORTED;
var BUGS = consts.BUGS;
var BUGGY_IMPLS = consts.BUGGY_IMPLS;
var BUGGY_IMPLS_LEN = BUGGY_IMPLS.length;
var MODULE_VER = __nccwpck_require__(5129)/* .version */ .i8;
var I = 0;
var IN_INIT = I++;
var IN_GREETING = I++;
var IN_HEADER = I++;
var IN_PACKETBEFORE = I++;
var IN_PACKET = I++;
var IN_PACKETDATA = I++;
var IN_PACKETDATAVERIFY = I++;
var IN_PACKETDATAAFTER = I++;
var OUT_INIT = I++;
var OUT_READY = I++;
var OUT_REKEYING = I++;
var MAX_SEQNO = 4294967295;
var MAX_PACKET_SIZE = 35000;
var MAX_PACKETS_REKEYING = 50;
var EXP_TYPE_HEADER = 0;
var EXP_TYPE_LF = 1;
var EXP_TYPE_BYTES = 2; // Waits until n bytes have been seen
var Z_PARTIAL_FLUSH = zlib.Z_PARTIAL_FLUSH;
var ZLIB_OPTS = { flush: Z_PARTIAL_FLUSH };

var RE_NULL = /\x00/g;

var IDENT_PREFIX_BUFFER = Buffer.from('SSH-');
var EMPTY_BUFFER = Buffer.allocUnsafe(0);
var HMAC_COMPUTE = Buffer.allocUnsafe(9);
var PING_PACKET = Buffer.from([
  MESSAGE.GLOBAL_REQUEST,
  // "keepalive@openssh.com"
  0, 0, 0, 21,
    107, 101, 101, 112, 97, 108, 105, 118, 101, 64, 111, 112, 101, 110, 115,
    115, 104, 46, 99, 111, 109,
  // Request a reply
  1
]);
var NEWKEYS_PACKET = Buffer.from([MESSAGE.NEWKEYS]);
var USERAUTH_SUCCESS_PACKET = Buffer.from([MESSAGE.USERAUTH_SUCCESS]);
var REQUEST_SUCCESS_PACKET = Buffer.from([MESSAGE.REQUEST_SUCCESS]);
var REQUEST_FAILURE_PACKET = Buffer.from([MESSAGE.REQUEST_FAILURE]);
var NO_TERMINAL_MODES_BUFFER = Buffer.from([TERMINAL_MODE.TTY_OP_END]);
var KEXDH_GEX_REQ_PACKET = Buffer.from([
  MESSAGE.KEXDH_GEX_REQUEST,
  // Minimal size in bits of an acceptable group
  0, 0, 4, 0, // 1024, modp2
  // Preferred size in bits of the group the server will send
  0, 0, 16, 0, // 4096, modp16
  // Maximal size in bits of an acceptable group
  0, 0, 32, 0 // 8192, modp18
]);

function DEBUG_NOOP(msg) {}

function SSH2Stream(cfg) {
  if (typeof cfg !== 'object' || cfg === null)
    cfg = {};

  TransformStream.call(this, {
    highWaterMark: (typeof cfg.highWaterMark === 'number'
                    ? cfg.highWaterMark
                    : 32 * 1024)
  });

  this._needContinue = false;
  this.bytesSent = this.bytesReceived = 0;
  this.debug = (typeof cfg.debug === 'function' ? cfg.debug : DEBUG_NOOP);
  this.server = (cfg.server === true);
  this.maxPacketSize = (typeof cfg.maxPacketSize === 'number'
                        ? cfg.maxPacketSize
                        : MAX_PACKET_SIZE);
  // Bitmap that indicates any bugs the remote side has. This is determined
  // by the reported software version.
  this.remoteBugs = 0;

  if (this.server) {
    // TODO: Remove when we support group exchange for server implementation
    this.remoteBugs = BUGS.BAD_DHGEX;
  }

  this.readable = true;

  var self = this;

  var hostKeys = cfg.hostKeys;
  if (this.server && (typeof hostKeys !== 'object' || hostKeys === null))
    throw new Error('hostKeys must be an object keyed on host key type');

  this.config = {
    // Server
    hostKeys: hostKeys, // All keys supported by server

    // Client/Server
    ident: 'SSH-2.0-'
           + (cfg.ident
              || ('ssh2js' + MODULE_VER + (this.server ? 'srv' : ''))),
    algorithms: {
      kex: ALGORITHMS.KEX,
      kexBuf: ALGORITHMS.KEX_BUF,
      serverHostKey: ALGORITHMS.SERVER_HOST_KEY,
      serverHostKeyBuf: ALGORITHMS.SERVER_HOST_KEY_BUF,
      cipher: ALGORITHMS.CIPHER,
      cipherBuf: ALGORITHMS.CIPHER_BUF,
      hmac: ALGORITHMS.HMAC,
      hmacBuf: ALGORITHMS.HMAC_BUF,
      compress: ALGORITHMS.COMPRESS,
      compressBuf: ALGORITHMS.COMPRESS_BUF
    }
  };
  // RFC 4253 states the identification string must not contain NULL
  this.config.ident.replace(RE_NULL, '');

  if (this.config.ident.length + 2 /* Account for "\r\n" */ > 255)
    throw new Error('ident too long');

  if (typeof cfg.algorithms === 'object' && cfg.algorithms !== null) {
    var algos = cfg.algorithms;
    if (Array.isArray(algos.kex) && algos.kex.length > 0) {
      this.config.algorithms.kex = algos.kex;
      if (!Buffer.isBuffer(algos.kexBuf))
        algos.kexBuf = Buffer.from(algos.kex.join(','), 'ascii');
      this.config.algorithms.kexBuf = algos.kexBuf;
    }
    if (Array.isArray(algos.serverHostKey) && algos.serverHostKey.length > 0) {
      this.config.algorithms.serverHostKey = algos.serverHostKey;
      if (!Buffer.isBuffer(algos.serverHostKeyBuf)) {
        algos.serverHostKeyBuf = Buffer.from(algos.serverHostKey.join(','),
                                             'ascii');
      }
      this.config.algorithms.serverHostKeyBuf = algos.serverHostKeyBuf;
    }
    if (Array.isArray(algos.cipher) && algos.cipher.length > 0) {
      this.config.algorithms.cipher = algos.cipher;
      if (!Buffer.isBuffer(algos.cipherBuf))
        algos.cipherBuf = Buffer.from(algos.cipher.join(','), 'ascii');
      this.config.algorithms.cipherBuf = algos.cipherBuf;
    }
    if (Array.isArray(algos.hmac) && algos.hmac.length > 0) {
      this.config.algorithms.hmac = algos.hmac;
      if (!Buffer.isBuffer(algos.hmacBuf))
        algos.hmacBuf = Buffer.from(algos.hmac.join(','), 'ascii');
      this.config.algorithms.hmacBuf = algos.hmacBuf;
    }
    if (Array.isArray(algos.compress) && algos.compress.length > 0) {
      this.config.algorithms.compress = algos.compress;
      if (!Buffer.isBuffer(algos.compressBuf))
        algos.compressBuf = Buffer.from(algos.compress.join(','), 'ascii');
      this.config.algorithms.compressBuf = algos.compressBuf;
    }
  }

  this.reset(true);

  // Common events
  this.on('end', function() {
    // Let GC collect any Buffers we were previously storing
    self.readable = false;
    self._state = undefined;
    self.reset();
    self._state.outgoing.bufSeqno = undefined;
  });
  this.on('DISCONNECT', function(reason, code, desc, lang) {
    onDISCONNECT(self, reason, code, desc, lang);
  });
  this.on('KEXINIT', function(init, firstFollows) {
    onKEXINIT(self, init, firstFollows);
  });
  this.on('NEWKEYS', function() { onNEWKEYS(self); });

  if (this.server) {
    // Server-specific events
    this.on('KEXDH_INIT', function(e) { onKEXDH_INIT(self, e); });
  } else {
    // Client-specific events
    this.on('KEXDH_REPLY', function(info) { onKEXDH_REPLY(self, info); })
        .on('KEXDH_GEX_GROUP',
            function(prime, gen) { onKEXDH_GEX_GROUP(self, prime, gen); });
  }

  if (this.server) {
    // Greeting displayed before the ssh identification string is sent, this is
    // usually ignored by most clients
    if (typeof cfg.greeting === 'string' && cfg.greeting.length) {
      if (cfg.greeting.slice(-2) === '\r\n')
        this.push(cfg.greeting);
      else
        this.push(cfg.greeting + '\r\n');
    }
    // Banner shown after the handshake completes, but before user
    // authentication begins
    if (typeof cfg.banner === 'string' && cfg.banner.length) {
      if (cfg.banner.slice(-2) === '\r\n')
        this.banner = cfg.banner;
      else
        this.banner = cfg.banner + '\r\n';
    }
  }
  this.debug('DEBUG: Local ident: ' + inspect(this.config.ident));
  this.push(this.config.ident + '\r\n');

  this._state.incoming.expectedPacket = 'KEXINIT';
}
inherits(SSH2Stream, TransformStream);

SSH2Stream.prototype.__read = TransformStream.prototype._read;
SSH2Stream.prototype._read = function(n) {
  if (this._needContinue) {
    this._needContinue = false;
    this.emit('continue');
  }
  return this.__read(n);
};
SSH2Stream.prototype.__push = TransformStream.prototype.push;
SSH2Stream.prototype.push = function(chunk, encoding) {
  var ret = this.__push(chunk, encoding);
  this._needContinue = (ret === false);
  return ret;
};

SSH2Stream.prototype._cleanup = function(callback) {
  this.reset();
  this.debug('DEBUG: Parser: Malformed packet');
  callback && callback(new Error('Malformed packet'));
};

SSH2Stream.prototype._transform = function(chunk, encoding, callback, decomp) {
  var skipDecrypt = false;
  var decryptAuthMode = false;
  var state = this._state;
  var instate = state.incoming;
  var outstate = state.outgoing;
  var expect = instate.expect;
  var decrypt = instate.decrypt;
  var decompress = instate.decompress;
  var chlen = chunk.length;
  var chleft = 0;
  var debug = this.debug;
  var self = this;
  var i = 0;
  var p = i;
  var blockLen;
  var buffer;
  var buf;
  var r;

  this.bytesReceived += chlen;

  while (true) {
    if (expect.type !== undefined) {
      if (i >= chlen)
        break;
      if (expect.type === EXP_TYPE_BYTES) {
        chleft = (chlen - i);
        var pktLeft = (expect.buf.length - expect.ptr);
        if (pktLeft <= chleft) {
          chunk.copy(expect.buf, expect.ptr, i, i + pktLeft);
          i += pktLeft;
          buffer = expect.buf;
          expect.buf = undefined;
          expect.ptr = 0;
          expect.type = undefined;
        } else {
          chunk.copy(expect.buf, expect.ptr, i);
          expect.ptr += chleft;
          i += chleft;
        }
        continue;
      } else if (expect.type === EXP_TYPE_HEADER) {
        i += instate.search.push(chunk);
        if (expect.type !== undefined)
          continue;
      } else if (expect.type === EXP_TYPE_LF) {
        if (++expect.ptr + 4 /* Account for "SSH-" */ > 255) {
          this.reset();
          debug('DEBUG: Parser: Identification string exceeded 255 characters');
          return callback(new Error('Max identification string size exceeded'));
        }
        if (chunk[i] === 0x0A) {
          expect.type = undefined;
          if (p < i) {
            if (expect.buf === undefined)
              expect.buf = chunk.toString('ascii', p, i);
            else
              expect.buf += chunk.toString('ascii', p, i);
          }
          buffer = expect.buf;
          expect.buf = undefined;
          ++i;
        } else {
          if (++i === chlen && p < i) {
            if (expect.buf === undefined)
              expect.buf = chunk.toString('ascii', p, i);
            else
              expect.buf += chunk.toString('ascii', p, i);
          }
          continue;
        }
      }
    }

    if (instate.status === IN_INIT) {
      if (!this.readable)
        return callback();
      if (this.server) {
        // Retrieve what should be the start of the protocol version exchange
        if (!buffer) {
          debug('DEBUG: Parser: IN_INIT (waiting for identification begin)');
          expectData(this, EXP_TYPE_BYTES, 4);
        } else {
          if (buffer[0] === 0x53       // S
              && buffer[1] === 0x53    // S
              && buffer[2] === 0x48    // H
              && buffer[3] === 0x2D) { // -
            instate.status = IN_GREETING;
            debug('DEBUG: Parser: IN_INIT (waiting for rest of identification)');
          } else {
            this.reset();
            debug('DEBUG: Parser: Bad identification start');
            return callback(new Error('Bad identification start'));
          }
        }
      } else {
        debug('DEBUG: Parser: IN_INIT');
        // Retrieve any bytes that may come before the protocol version exchange
        var ss = instate.search = new StreamSearch(IDENT_PREFIX_BUFFER);
        ss.on('info', function onInfo(matched, data, start, end) {
          if (data) {
            if (instate.greeting === undefined)
              instate.greeting = data.toString('binary', start, end);
            else
              instate.greeting += data.toString('binary', start, end);
          }
          if (matched) {
            expect.type = undefined;
            instate.search.removeListener('info', onInfo);
          }
        });
        ss.maxMatches = 1;
        expectData(this, EXP_TYPE_HEADER);
        instate.status = IN_GREETING;
      }
    } else if (instate.status === IN_GREETING) {
      debug('DEBUG: Parser: IN_GREETING');
      instate.search = undefined;
      // Retrieve the identification bytes after the "SSH-" header
      p = i;
      expectData(this, EXP_TYPE_LF);
      instate.status = IN_HEADER;
    } else if (instate.status === IN_HEADER) {
      debug('DEBUG: Parser: IN_HEADER');
      if (buffer.charCodeAt(buffer.length - 1) === 13)
        buffer = buffer.slice(0, -1);
      var idxDash = buffer.indexOf('-');
      var idxSpace = buffer.indexOf(' ');
      var header = {
        // RFC says greeting SHOULD be utf8
        greeting: instate.greeting,
        identRaw: 'SSH-' + buffer,
        versions: {
          protocol: buffer.substr(0, idxDash),
          software: (idxSpace === -1
                     ? buffer.substring(idxDash + 1)
                     : buffer.substring(idxDash + 1, idxSpace))
        },
        comments: (idxSpace > -1 ? buffer.substring(idxSpace + 1) : undefined)
      };
      instate.greeting = undefined;

      if (header.versions.protocol !== '1.99'
          && header.versions.protocol !== '2.0') {
        this.reset();
        debug('DEBUG: Parser: protocol version not supported: '
              + header.versions.protocol);
        return callback(new Error('Protocol version not supported'));
      } else
        this.emit('header', header);

      if (instate.status === IN_INIT) {
        // We reset from an event handler, possibly due to an unsupported SSH
        // protocol version?
        return;
      }

      var identRaw = header.identRaw;
      var software = header.versions.software;
      this.debug('DEBUG: Remote ident: ' + inspect(identRaw));
      for (var j = 0, rule; j < BUGGY_IMPLS_LEN; ++j) {
        rule = BUGGY_IMPLS[j];
        if (typeof rule[0] === 'string') {
          if (software === rule[0])
            this.remoteBugs |= rule[1];
        } else if (rule[0].test(software))
          this.remoteBugs |= rule[1];
      }
      instate.identRaw = identRaw;
      // Adjust bytesReceived first otherwise it will have an incorrectly larger
      // total when we call back into this function after completing KEXINIT
      this.bytesReceived -= (chlen - i);
      KEXINIT(this, function() {
        if (i === chlen)
          callback();
        else
          self._transform(chunk.slice(i), encoding, callback);
      });
      instate.status = IN_PACKETBEFORE;
      return;
    } else if (instate.status === IN_PACKETBEFORE) {
      blockLen = (decrypt.instance ? decrypt.info.blockLen : 8);
      debug('DEBUG: Parser: IN_PACKETBEFORE (expecting ' + blockLen + ')');
      // Wait for the right number of bytes so we can determine the incoming
      // packet length
      expectData(this, EXP_TYPE_BYTES, blockLen, decrypt.buf);
      instate.status = IN_PACKET;
    } else if (instate.status === IN_PACKET) {
      debug('DEBUG: Parser: IN_PACKET');
      if (decrypt.instance) {
        decryptAuthMode = (decrypt.info.authLen > 0);
        if (!decryptAuthMode)
          buffer = decryptData(this, buffer);
        blockLen = decrypt.info.blockLen;
      } else {
        decryptAuthMode = false;
        blockLen = 8;
      }

      r = readInt(buffer, 0, this, callback);
      if (r === false)
        return;
      var hmacInfo = instate.hmac.info;
      var macSize;
      if (hmacInfo)
        macSize = hmacInfo.actualLen;
      else
        macSize = 0;
      var fullPacketLen = r + 4 + macSize;
      var maxPayloadLen = this.maxPacketSize;
      if (decompress.instance) {
        // Account for compressed payloads
        // This formula is taken from dropbear which derives it from zlib's
        // documentation. Explanation from dropbear:
        /* For exact details see http://www.zlib.net/zlib_tech.html
         * 5 bytes per 16kB block, plus 6 bytes for the stream.
         * We might allocate 5 unnecessary bytes here if it's an
         * exact multiple. */
        maxPayloadLen += (((this.maxPacketSize / 16384) + 1) * 5 + 6);
      }
      if (r > maxPayloadLen
          // TODO: Change 16 to "MAX(16, decrypt.info.blockLen)" when/if SSH2
          // adopts 512-bit ciphers
          || fullPacketLen < (16 + macSize)
          || ((r + (decryptAuthMode ? 0 : 4)) % blockLen) !== 0) {
        this.disconnect(DISCONNECT_REASON.PROTOCOL_ERROR);
        debug('DEBUG: Parser: Bad packet length (' + fullPacketLen + ')');
        return callback(new Error('Bad packet length'));
      }

      instate.pktLen = r;
      var remainLen = instate.pktLen + 4 - blockLen;
      if (decryptAuthMode) {
        decrypt.instance.setAAD(buffer.slice(0, 4));
        debug('DEBUG: Parser: pktLen:'
              + instate.pktLen
              + ',remainLen:'
              + remainLen);
      } else {
        instate.padLen = buffer[4];
        debug('DEBUG: Parser: pktLen:'
              + instate.pktLen
              + ',padLen:'
              + instate.padLen
              + ',remainLen:'
              + remainLen);
      }
      if (remainLen > 0) {
        if (decryptAuthMode)
          instate.pktExtra = buffer.slice(4);
        else
          instate.pktExtra = buffer.slice(5);
        // Grab the rest of the packet
        expectData(this, EXP_TYPE_BYTES, remainLen);
        instate.status = IN_PACKETDATA;
      } else if (remainLen < 0)
        instate.status = IN_PACKETBEFORE;
      else {
        // Entire message fit into one block
        skipDecrypt = true;
        instate.status = IN_PACKETDATA;
        continue;
      }
    } else if (instate.status === IN_PACKETDATA) {
      debug('DEBUG: Parser: IN_PACKETDATA');
      if (decrypt.instance) {
        decryptAuthMode = (decrypt.info.authLen > 0);
        if (!skipDecrypt) {
          if (!decryptAuthMode)
            buffer = decryptData(this, buffer);
        } else {
          skipDecrypt = false;
        }
      } else {
        decryptAuthMode = false;
        skipDecrypt = false;
      }
      var padStart = instate.pktLen - instate.padLen - 1;
      // TODO: Allocate a Buffer once that is slightly larger than maxPacketSize
      // (to accommodate for packet length field and MAC) and re-use that
      // instead
      if (instate.pktExtra) {
        buf = Buffer.allocUnsafe(instate.pktExtra.length + buffer.length);
        instate.pktExtra.copy(buf);
        buffer.copy(buf, instate.pktExtra.length);
        instate.payload = buf.slice(0, padStart);
      } else {
        // Entire message fit into one block
        if (decryptAuthMode)
          buf = buffer.slice(4);
        else
          buf = buffer.slice(5);
        instate.payload = buffer.slice(5, 5 + padStart);
      }
      if (instate.hmac.info !== undefined) {
        // Wait for hmac hash
        var inHMACSize = decrypt.info.authLen || instate.hmac.info.actualLen;
        debug('DEBUG: Parser: HMAC size:' + inHMACSize);
        expectData(this, EXP_TYPE_BYTES, inHMACSize, instate.hmac.buf);
        instate.status = IN_PACKETDATAVERIFY;
        instate.packet = buf;
      } else
        instate.status = IN_PACKETDATAAFTER;
      instate.pktExtra = undefined;
      buf = undefined;
    } else if (instate.status === IN_PACKETDATAVERIFY) {
      debug('DEBUG: Parser: IN_PACKETDATAVERIFY');
      // Verify packet data integrity
      if (hmacVerify(this, buffer)) {
        debug('DEBUG: Parser: IN_PACKETDATAVERIFY (Valid HMAC)');
        instate.status = IN_PACKETDATAAFTER;
        instate.packet = undefined;
      } else {
        this.reset();
        debug('DEBUG: Parser: IN_PACKETDATAVERIFY (Invalid HMAC)');
        return callback(new Error('Invalid HMAC'));
      }
    } else if (instate.status === IN_PACKETDATAAFTER) {
      if (decompress.instance) {
        if (!decomp) {
          debug('DEBUG: Parser: Decompressing');
          decompress.instance.write(instate.payload);
          var decompBuf = [];
          var decompBufLen = 0;
          decompress.instance.on('readable', function() {
            var buf;
            while (buf = this.read()) {
              decompBuf.push(buf);
              decompBufLen += buf.length;
            }
          }).flush(Z_PARTIAL_FLUSH, function() {
            decompress.instance.removeAllListeners('readable');
            if (decompBuf.length === 1)
              instate.payload = decompBuf[0];
            else
              instate.payload = Buffer.concat(decompBuf, decompBufLen);
            decompBuf = null;
            var nextSlice;
            if (i === chlen)
              nextSlice = EMPTY_BUFFER; // Avoid slicing a zero-length buffer
            else
              nextSlice = chunk.slice(i);
            self._transform(nextSlice, encoding, callback, true);
          });
          return;
        } else {
          // Make sure we reset this after this first time in the loop,
          // otherwise we could end up trying to interpret as-is another
          // compressed packet that is within the same chunk
          decomp = false;
        }
      }

      this.emit('packet');

      var ptype = instate.payload[0];

      if (debug !== DEBUG_NOOP) {
        var msgPacket = 'DEBUG: Parser: IN_PACKETDATAAFTER, packet: ';
        var authMethod = state.authsQueue[0];
        var msgPktType = null;

        if (outstate.status === OUT_REKEYING
            && !(ptype <= 4 || (ptype >= 20 && ptype <= 49)))
          msgPacket += '(enqueued) ';

        if (ptype === MESSAGE.KEXDH_INIT) {
          switch (state.kex.type) {
            case 'group':
              msgPktType = 'KEXDH_INIT';
              break;
            case 'groupex':
              msgPktType = 'KEXDH_GEX_REQUEST';
              break;
            default:
              msgPktType = 'KEXECDH_INIT';
          }
        } else if (ptype === MESSAGE.KEXDH_REPLY) {
          switch (state.kex.type) {
            case 'group':
              msgPktType = 'KEXDH_REPLY';
              break;
            case 'groupex':
              msgPktType = 'KEXDH_GEX_GROUP';
              break;
            default:
              msgPktType = 'KEXECDH_REPLY';
          }
        } else if (ptype === MESSAGE.KEXDH_GEX_GROUP) {
          msgPktType = 'KEXDH_GEX_GROUP';
        } else if (ptype === MESSAGE.KEXDH_GEX_REPLY) {
          msgPktType = 'KEXDH_GEX_REPLY';
        } else if (ptype === 60) {
          if (authMethod === 'password')
            msgPktType = 'USERAUTH_PASSWD_CHANGEREQ';
          else if (authMethod === 'keyboard-interactive')
            msgPktType = 'USERAUTH_INFO_REQUEST';
          else if (authMethod === 'publickey')
            msgPktType = 'USERAUTH_PK_OK';
          else
            msgPktType = 'UNKNOWN PACKET 60';
        } else if (ptype === 61) {
          if (authMethod === 'keyboard-interactive')
            msgPktType = 'USERAUTH_INFO_RESPONSE';
          else
            msgPktType = 'UNKNOWN PACKET 61';
        }

        if (msgPktType === null)
          msgPktType = MESSAGE[ptype];

        // Don't write debug output for messages we custom make in parsePacket()
        if (ptype !== MESSAGE.CHANNEL_OPEN
            && ptype !== MESSAGE.CHANNEL_REQUEST
            && ptype !== MESSAGE.CHANNEL_SUCCESS
            && ptype !== MESSAGE.CHANNEL_FAILURE
            && ptype !== MESSAGE.CHANNEL_EOF
            && ptype !== MESSAGE.CHANNEL_CLOSE
            && ptype !== MESSAGE.CHANNEL_DATA
            && ptype !== MESSAGE.CHANNEL_EXTENDED_DATA
            && ptype !== MESSAGE.CHANNEL_WINDOW_ADJUST
            && ptype !== MESSAGE.DISCONNECT
            && ptype !== MESSAGE.USERAUTH_REQUEST
            && ptype !== MESSAGE.GLOBAL_REQUEST)
          debug(msgPacket + msgPktType);
      }

      // Only parse packet if we are not re-keying or the packet is not a
      // transport layer packet needed for re-keying
      if (outstate.status === OUT_READY
          || ptype <= 4
          || (ptype >= 20 && ptype <= 49)) {
        if (parsePacket(this, callback) === false)
          return;

        if (instate.status === IN_INIT) {
          // We were reset due to some error/disagreement ?
          return;
        }
      } else if (outstate.status === OUT_REKEYING) {
        if (instate.rekeyQueue.length === MAX_PACKETS_REKEYING) {
          debug('DEBUG: Parser: Max incoming re-key queue length reached');
          this.disconnect(DISCONNECT_REASON.PROTOCOL_ERROR);
          return callback(
            new Error('Incoming re-key queue length limit reached')
          );
        }

        // Make sure to record the sequence number in case we need it later on
        // when we drain the queue (e.g. unknown packet)
        var seqno = instate.seqno;
        if (++instate.seqno > MAX_SEQNO)
          instate.seqno = 0;

        instate.rekeyQueue.push([seqno, instate.payload]);
      }

      instate.status = IN_PACKETBEFORE;
      instate.payload = undefined;
    }
    if (buffer !== undefined)
      buffer = undefined;
  }

  callback();
};

SSH2Stream.prototype.reset = function(noend) {
  if (this._state) {
    var state = this._state;
    state.incoming.status = IN_INIT;
    state.outgoing.status = OUT_INIT;
  } else {
    this._state = {
      authsQueue: [],
      hostkeyFormat: undefined,
      kex: undefined,

      incoming: {
        status: IN_INIT,
        expectedPacket: undefined,
        search: undefined,
        greeting: undefined,
        seqno: 0,
        pktLen: undefined,
        padLen: undefined,
        pktExtra: undefined,
        payload: undefined,
        packet: undefined,
        kexinit: undefined,
        identRaw: undefined,
        rekeyQueue: [],
        ignoreNext: false,

        expect: {
          amount: undefined,
          type: undefined,
          ptr: 0,
          buf: undefined
        },

        decrypt: {
          instance: false,
          info: undefined,
          iv: undefined,
          key: undefined,
          buf: undefined,
          type: undefined
        },

        hmac: {
          info: undefined,
          key: undefined,
          buf: undefined,
          type: false
        },

        decompress: {
          instance: false,
          type: false
        }
      },

      outgoing: {
        status: OUT_INIT,
        seqno: 0,
        bufSeqno: Buffer.allocUnsafe(4),
        rekeyQueue: [],
        kexinit: undefined,
        kexsecret: undefined,
        pubkey: undefined,
        exchangeHash: undefined,
        sessionId: undefined,
        sentNEWKEYS: false,

        encrypt: {
          instance: false,
          info: undefined,
          iv: undefined,
          key: undefined,
          type: undefined
        },

        hmac: {
          info: undefined,
          key: undefined,
          buf: undefined,
          type: false
        },

        compress: {
          instance: false,
          type: false,
          queue: null
        }
      }
    };
  }
  if (!noend) {
    if (this.readable)
      this.push(null);
  }
};

// Common methods
// Global
SSH2Stream.prototype.disconnect = function(reason) {
  /*
    byte      SSH_MSG_DISCONNECT
    uint32    reason code
    string    description in ISO-10646 UTF-8 encoding
    string    language tag
  */
  var buf = Buffer.alloc(1 + 4 + 4 + 4);

  buf[0] = MESSAGE.DISCONNECT;

  if (DISCONNECT_REASON[reason] === undefined)
    reason = DISCONNECT_REASON.BY_APPLICATION;
  writeUInt32BE(buf, reason, 1);

  this.debug('DEBUG: Outgoing: Writing DISCONNECT ('
             + DISCONNECT_REASON[reason]
             + ')');
  send(this, buf);
  this.reset();

  return false;
};
SSH2Stream.prototype.ping = function() {
  this.debug('DEBUG: Outgoing: Writing ping (GLOBAL_REQUEST: keepalive@openssh.com)');
  return send(this, PING_PACKET);
};
SSH2Stream.prototype.rekey = function() {
  var status = this._state.outgoing.status;
  if (status === OUT_REKEYING)
    throw new Error('A re-key is already in progress');
  else if (status !== OUT_READY)
    throw new Error('Cannot re-key yet');

  this.debug('DEBUG: Outgoing: Starting re-key');
  return KEXINIT(this);
};

// 'ssh-connection' service-specific
SSH2Stream.prototype.requestSuccess = function(data) {
  var buf;
  if (Buffer.isBuffer(data)) {
    buf = Buffer.allocUnsafe(1 + data.length);

    buf[0] = MESSAGE.REQUEST_SUCCESS;

    data.copy(buf, 1);
  } else
    buf = REQUEST_SUCCESS_PACKET;

  this.debug('DEBUG: Outgoing: Writing REQUEST_SUCCESS');
  return send(this, buf);
};
SSH2Stream.prototype.requestFailure = function() {
  this.debug('DEBUG: Outgoing: Writing REQUEST_FAILURE');
  return send(this, REQUEST_FAILURE_PACKET);
};
SSH2Stream.prototype.channelSuccess = function(chan) {
  // Does not consume window space
  var buf = Buffer.allocUnsafe(1 + 4);

  buf[0] = MESSAGE.CHANNEL_SUCCESS;

  writeUInt32BE(buf, chan, 1);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_SUCCESS (' + chan + ')');
  return send(this, buf);
};
SSH2Stream.prototype.channelFailure = function(chan) {
  // Does not consume window space
  var buf = Buffer.allocUnsafe(1 + 4);

  buf[0] = MESSAGE.CHANNEL_FAILURE;

  writeUInt32BE(buf, chan, 1);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_FAILURE (' + chan + ')');
  return send(this, buf);
};
SSH2Stream.prototype.channelEOF = function(chan) {
  // Does not consume window space
  var buf = Buffer.allocUnsafe(1 + 4);

  buf[0] = MESSAGE.CHANNEL_EOF;

  writeUInt32BE(buf, chan, 1);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_EOF (' + chan + ')');
  return send(this, buf);
};
SSH2Stream.prototype.channelClose = function(chan) {
  // Does not consume window space
  var buf = Buffer.allocUnsafe(1 + 4);

  buf[0] = MESSAGE.CHANNEL_CLOSE;

  writeUInt32BE(buf, chan, 1);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_CLOSE (' + chan + ')');
  return send(this, buf);
};
SSH2Stream.prototype.channelWindowAdjust = function(chan, amount) {
  // Does not consume window space
  var buf = Buffer.allocUnsafe(1 + 4 + 4);

  buf[0] = MESSAGE.CHANNEL_WINDOW_ADJUST;

  writeUInt32BE(buf, chan, 1);

  writeUInt32BE(buf, amount, 5);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_WINDOW_ADJUST ('
             + chan
             + ', '
             + amount
             + ')');
  return send(this, buf);
};
SSH2Stream.prototype.channelData = function(chan, data) {
  var dataIsBuffer = Buffer.isBuffer(data);
  var dataLen = (dataIsBuffer ? data.length : Buffer.byteLength(data));
  var buf = Buffer.allocUnsafe(1 + 4 + 4 + dataLen);

  buf[0] = MESSAGE.CHANNEL_DATA;

  writeUInt32BE(buf, chan, 1);

  writeUInt32BE(buf, dataLen, 5);
  if (dataIsBuffer)
    data.copy(buf, 9);
  else
    buf.write(data, 9, dataLen, 'utf8');

  this.debug('DEBUG: Outgoing: Writing CHANNEL_DATA (' + chan + ')');
  return send(this, buf);
};
SSH2Stream.prototype.channelExtData = function(chan, data, type) {
  var dataIsBuffer = Buffer.isBuffer(data);
  var dataLen = (dataIsBuffer ? data.length : Buffer.byteLength(data));
  var buf = Buffer.allocUnsafe(1 + 4 + 4 + 4 + dataLen);

  buf[0] = MESSAGE.CHANNEL_EXTENDED_DATA;

  writeUInt32BE(buf, chan, 1);

  writeUInt32BE(buf, type, 5);

  writeUInt32BE(buf, dataLen, 9);
  if (dataIsBuffer)
    data.copy(buf, 13);
  else
    buf.write(data, 13, dataLen, 'utf8');

  this.debug('DEBUG: Outgoing: Writing CHANNEL_EXTENDED_DATA (' + chan + ')');
  return send(this, buf);
};
SSH2Stream.prototype.channelOpenConfirm = function(remoteChan, localChan,
                                                   initWindow, maxPacket) {
  var buf = Buffer.allocUnsafe(1 + 4 + 4 + 4 + 4);

  buf[0] = MESSAGE.CHANNEL_OPEN_CONFIRMATION;

  writeUInt32BE(buf, remoteChan, 1);

  writeUInt32BE(buf, localChan, 5);

  writeUInt32BE(buf, initWindow, 9);

  writeUInt32BE(buf, maxPacket, 13);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_OPEN_CONFIRMATION (r:'
             + remoteChan
             + ', l:'
             + localChan
             + ')');
  return send(this, buf);
};
SSH2Stream.prototype.channelOpenFail = function(remoteChan, reason, desc,
                                                lang) {
  if (typeof desc !== 'string')
    desc = '';
  if (typeof lang !== 'string')
    lang = '';

  var descLen = Buffer.byteLength(desc);
  var langLen = Buffer.byteLength(lang);
  var p = 9;
  var buf = Buffer.allocUnsafe(1 + 4 + 4 + 4 + descLen + 4 + langLen);

  buf[0] = MESSAGE.CHANNEL_OPEN_FAILURE;

  writeUInt32BE(buf, remoteChan, 1);

  writeUInt32BE(buf, reason, 5);

  writeUInt32BE(buf, descLen, p);
  p += 4;
  if (descLen) {
    buf.write(desc, p, descLen, 'utf8');
    p += descLen;
  }

  writeUInt32BE(buf, langLen, p);
  if (langLen)
    buf.write(lang, p += 4, langLen, 'ascii');

  this.debug('DEBUG: Outgoing: Writing CHANNEL_OPEN_FAILURE ('
             + remoteChan
             + ')');
  return send(this, buf);
};

// Client-specific methods
// Global
SSH2Stream.prototype.service = function(svcName) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var svcNameLen = Buffer.byteLength(svcName);
  var buf = Buffer.allocUnsafe(1 + 4 + svcNameLen);

  buf[0] = MESSAGE.SERVICE_REQUEST;

  writeUInt32BE(buf, svcNameLen, 1);
  buf.write(svcName, 5, svcNameLen, 'ascii');

  this.debug('DEBUG: Outgoing: Writing SERVICE_REQUEST (' + svcName + ')');
  return send(this, buf);
};
// 'ssh-connection' service-specific
SSH2Stream.prototype.tcpipForward = function(bindAddr, bindPort, wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var addrlen = Buffer.byteLength(bindAddr);
  var buf = Buffer.allocUnsafe(1 + 4 + 13 + 1 + 4 + addrlen + 4);

  buf[0] = MESSAGE.GLOBAL_REQUEST;

  writeUInt32BE(buf, 13, 1);
  buf.write('tcpip-forward', 5, 13, 'ascii');

  buf[18] = (wantReply === undefined || wantReply === true ? 1 : 0);

  writeUInt32BE(buf, addrlen, 19);
  buf.write(bindAddr, 23, addrlen, 'ascii');

  writeUInt32BE(buf, bindPort, 23 + addrlen);

  this.debug('DEBUG: Outgoing: Writing GLOBAL_REQUEST (tcpip-forward)');
  return send(this, buf);
};
SSH2Stream.prototype.cancelTcpipForward = function(bindAddr, bindPort,
                                                   wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var addrlen = Buffer.byteLength(bindAddr);
  var buf = Buffer.allocUnsafe(1 + 4 + 20 + 1 + 4 + addrlen + 4);

  buf[0] = MESSAGE.GLOBAL_REQUEST;

  writeUInt32BE(buf, 20, 1);
  buf.write('cancel-tcpip-forward', 5, 20, 'ascii');

  buf[25] = (wantReply === undefined || wantReply === true ? 1 : 0);

  writeUInt32BE(buf, addrlen, 26);
  buf.write(bindAddr, 30, addrlen, 'ascii');

  writeUInt32BE(buf, bindPort, 30 + addrlen);

  this.debug('DEBUG: Outgoing: Writing GLOBAL_REQUEST (cancel-tcpip-forward)');
  return send(this, buf);
};
SSH2Stream.prototype.openssh_streamLocalForward = function(socketPath,
                                                           wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var pathlen = Buffer.byteLength(socketPath);
  var buf = Buffer.allocUnsafe(1 + 4 + 31 + 1 + 4 + pathlen);

  buf[0] = MESSAGE.GLOBAL_REQUEST;

  writeUInt32BE(buf, 31, 1);
  buf.write('streamlocal-forward@openssh.com', 5, 31, 'ascii');

  buf[36] = (wantReply === undefined || wantReply === true ? 1 : 0);

  writeUInt32BE(buf, pathlen, 37);
  buf.write(socketPath, 41, pathlen, 'utf8');

  this.debug('DEBUG: Outgoing: Writing GLOBAL_REQUEST (streamlocal-forward@openssh.com)');
  return send(this, buf);
};
SSH2Stream.prototype.openssh_cancelStreamLocalForward = function(socketPath,
                                                                 wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var pathlen = Buffer.byteLength(socketPath);
  var buf = Buffer.allocUnsafe(1 + 4 + 38 + 1 + 4 + pathlen);

  buf[0] = MESSAGE.GLOBAL_REQUEST;

  writeUInt32BE(buf, 38, 1);
  buf.write('cancel-streamlocal-forward@openssh.com', 5, 38, 'ascii');

  buf[43] = (wantReply === undefined || wantReply === true ? 1 : 0);

  writeUInt32BE(buf, pathlen, 44);
  buf.write(socketPath, 48, pathlen, 'utf8');

  this.debug('DEBUG: Outgoing: Writing GLOBAL_REQUEST (cancel-streamlocal-forward@openssh.com)');
  return send(this, buf);
};
SSH2Stream.prototype.directTcpip = function(chan, initWindow, maxPacket, cfg) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var srclen = Buffer.byteLength(cfg.srcIP);
  var dstlen = Buffer.byteLength(cfg.dstIP);
  var p = 29;
  var buf = Buffer.allocUnsafe(1 + 4 + 12 + 4 + 4 + 4 + 4 + srclen + 4 + 4
                               + dstlen + 4);

  buf[0] = MESSAGE.CHANNEL_OPEN;

  writeUInt32BE(buf, 12, 1);
  buf.write('direct-tcpip', 5, 12, 'ascii');

  writeUInt32BE(buf, chan, 17);

  writeUInt32BE(buf, initWindow, 21);

  writeUInt32BE(buf, maxPacket, 25);

  writeUInt32BE(buf, dstlen, p);
  buf.write(cfg.dstIP, p += 4, dstlen, 'ascii');

  writeUInt32BE(buf, cfg.dstPort, p += dstlen);

  writeUInt32BE(buf, srclen, p += 4);
  buf.write(cfg.srcIP, p += 4, srclen, 'ascii');

  writeUInt32BE(buf, cfg.srcPort, p += srclen);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_OPEN ('
             + chan
             + ', direct-tcpip)');
  return send(this, buf);
};
SSH2Stream.prototype.openssh_directStreamLocal = function(chan, initWindow,
                                                          maxPacket, cfg) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var pathlen = Buffer.byteLength(cfg.socketPath);
  var p = 47;
  var buf = Buffer.allocUnsafe(1 + 4 + 30 + 4 + 4 + 4 + 4 + pathlen + 4 + 4);

  buf[0] = MESSAGE.CHANNEL_OPEN;

  writeUInt32BE(buf, 30, 1);
  buf.write('direct-streamlocal@openssh.com', 5, 30, 'ascii');

  writeUInt32BE(buf, chan, 35);

  writeUInt32BE(buf, initWindow, 39);

  writeUInt32BE(buf, maxPacket, 43);

  writeUInt32BE(buf, pathlen, p);
  buf.write(cfg.socketPath, p += 4, pathlen, 'utf8');

  // reserved fields (string and uint32)
  buf.fill(0, buf.length - 8);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_OPEN ('
             + chan
             + ', direct-streamlocal@openssh.com)');
  return send(this, buf);
};
SSH2Stream.prototype.openssh_noMoreSessions = function(wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var buf = Buffer.allocUnsafe(1 + 4 + 28 + 1);

  buf[0] = MESSAGE.GLOBAL_REQUEST;

  writeUInt32BE(buf, 28, 1);
  buf.write('no-more-sessions@openssh.com', 5, 28, 'ascii');

  buf[33] = (wantReply === undefined || wantReply === true ? 1 : 0);

  this.debug('DEBUG: Outgoing: Writing GLOBAL_REQUEST (no-more-sessions@openssh.com)');
  return send(this, buf);
};
SSH2Stream.prototype.session = function(chan, initWindow, maxPacket) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // Does not consume window space
  var buf = Buffer.allocUnsafe(1 + 4 + 7 + 4 + 4 + 4);

  buf[0] = MESSAGE.CHANNEL_OPEN;

  writeUInt32BE(buf, 7, 1);
  buf.write('session', 5, 7, 'ascii');

  writeUInt32BE(buf, chan, 12);

  writeUInt32BE(buf, initWindow, 16);

  writeUInt32BE(buf, maxPacket, 20);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_OPEN ('
             + chan
             + ', session)');
  return send(this, buf);
};
SSH2Stream.prototype.windowChange = function(chan, rows, cols, height, width) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // Does not consume window space
  var buf = Buffer.allocUnsafe(1 + 4 + 4 + 13 + 1 + 4 + 4 + 4 + 4);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  writeUInt32BE(buf, chan, 1);

  writeUInt32BE(buf, 13, 5);
  buf.write('window-change', 9, 13, 'ascii');

  buf[22] = 0;

  writeUInt32BE(buf, cols, 23);

  writeUInt32BE(buf, rows, 27);

  writeUInt32BE(buf, width, 31);

  writeUInt32BE(buf, height, 35);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', window-change)');
  return send(this, buf);
};
SSH2Stream.prototype.pty = function(chan, rows, cols, height,
                                    width, term, modes, wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // Does not consume window space
  if (!term || !term.length)
    term = 'vt100';
  if (modes
      && !Buffer.isBuffer(modes)
      && !Array.isArray(modes)
      && typeof modes === 'object')
    modes = modesToBytes(modes);
  if (!modes || !modes.length)
    modes = NO_TERMINAL_MODES_BUFFER;

  var termLen = term.length;
  var modesLen = modes.length;
  var p = 21;
  var buf = Buffer.allocUnsafe(1 + 4 + 4 + 7 + 1 + 4 + termLen + 4 + 4 + 4 + 4
                               + 4 + modesLen);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  writeUInt32BE(buf, chan, 1);

  writeUInt32BE(buf, 7, 5);
  buf.write('pty-req', 9, 7, 'ascii');

  buf[16] = (wantReply === undefined || wantReply === true ? 1 : 0);

  writeUInt32BE(buf, termLen, 17);
  buf.write(term, 21, termLen, 'utf8');

  writeUInt32BE(buf, cols, p += termLen);

  writeUInt32BE(buf, rows, p += 4);

  writeUInt32BE(buf, width, p += 4);

  writeUInt32BE(buf, height, p += 4);

  writeUInt32BE(buf, modesLen, p += 4);
  p += 4;
  if (Array.isArray(modes)) {
    for (var i = 0; i < modesLen; ++i)
      buf[p++] = modes[i];
  } else if (Buffer.isBuffer(modes)) {
    modes.copy(buf, p);
  }

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', pty-req)');
  return send(this, buf);
};
SSH2Stream.prototype.shell = function(chan, wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // Does not consume window space
  var buf = Buffer.allocUnsafe(1 + 4 + 4 + 5 + 1);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  writeUInt32BE(buf, chan, 1);

  writeUInt32BE(buf, 5, 5);
  buf.write('shell', 9, 5, 'ascii');

  buf[14] = (wantReply === undefined || wantReply === true ? 1 : 0);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', shell)');
  return send(this, buf);
};
SSH2Stream.prototype.exec = function(chan, cmd, wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // Does not consume window space
  var cmdlen = (Buffer.isBuffer(cmd) ? cmd.length : Buffer.byteLength(cmd));
  var buf = Buffer.allocUnsafe(1 + 4 + 4 + 4 + 1 + 4 + cmdlen);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  writeUInt32BE(buf, chan, 1);

  writeUInt32BE(buf, 4, 5);
  buf.write('exec', 9, 4, 'ascii');

  buf[13] = (wantReply === undefined || wantReply === true ? 1 : 0);

  writeUInt32BE(buf, cmdlen, 14);
  if (Buffer.isBuffer(cmd))
    cmd.copy(buf, 18);
  else
    buf.write(cmd, 18, cmdlen, 'utf8');

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', exec)');
  return send(this, buf);
};
SSH2Stream.prototype.signal = function(chan, signal) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // Does not consume window space
  signal = signal.toUpperCase();
  if (signal.slice(0, 3) === 'SIG')
    signal = signal.substring(3);

  if (SIGNALS.indexOf(signal) === -1)
    throw new Error('Invalid signal: ' + signal);

  var signalLen = signal.length;
  var buf = Buffer.allocUnsafe(1 + 4 + 4 + 6 + 1 + 4 + signalLen);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  writeUInt32BE(buf, chan, 1);

  writeUInt32BE(buf, 6, 5);
  buf.write('signal', 9, 6, 'ascii');

  buf[15] = 0;

  writeUInt32BE(buf, signalLen, 16);
  buf.write(signal, 20, signalLen, 'ascii');

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', signal)');
  return send(this, buf);
};
SSH2Stream.prototype.env = function(chan, key, val, wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // Does not consume window space
  var keyLen = Buffer.byteLength(key);
  var valLen = (Buffer.isBuffer(val) ? val.length : Buffer.byteLength(val));
  var buf = Buffer.allocUnsafe(1 + 4 + 4 + 3 + 1 + 4 + keyLen + 4 + valLen);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  writeUInt32BE(buf, chan, 1);

  writeUInt32BE(buf, 3, 5);
  buf.write('env', 9, 3, 'ascii');

  buf[12] = (wantReply === undefined || wantReply === true ? 1 : 0);

  writeUInt32BE(buf, keyLen, 13);
  buf.write(key, 17, keyLen, 'ascii');

  writeUInt32BE(buf, valLen, 17 + keyLen);
  if (Buffer.isBuffer(val))
    val.copy(buf, 17 + keyLen + 4);
  else
    buf.write(val, 17 + keyLen + 4, valLen, 'utf8');

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', env)');
  return send(this, buf);
};
SSH2Stream.prototype.x11Forward = function(chan, cfg, wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // Does not consume window space
  var protolen = Buffer.byteLength(cfg.protocol);
  var cookielen = Buffer.byteLength(cfg.cookie);
  var buf = Buffer.allocUnsafe(1 + 4 + 4 + 7 + 1 + 1 + 4 + protolen + 4
                               + cookielen + 4);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  writeUInt32BE(buf, chan, 1);

  writeUInt32BE(buf, 7, 5);
  buf.write('x11-req', 9, 7, 'ascii');

  buf[16] = (wantReply === undefined || wantReply === true ? 1 : 0);

  buf[17] = (cfg.single ? 1 : 0);

  writeUInt32BE(buf, protolen, 18);
  var bp = 22;
  if (Buffer.isBuffer(cfg.protocol))
    cfg.protocol.copy(buf, bp);
  else
    buf.write(cfg.protocol, bp, protolen, 'utf8');
  bp += protolen;

  writeUInt32BE(buf, cookielen, bp);
  bp += 4;
  if (Buffer.isBuffer(cfg.cookie))
    cfg.cookie.copy(buf, bp);
  else
    buf.write(cfg.cookie, bp, cookielen, 'binary');
  bp += cookielen;

  writeUInt32BE(buf, (cfg.screen || 0), bp);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', x11-req)');
  return send(this, buf);
};
SSH2Stream.prototype.subsystem = function(chan, name, wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // Does not consume window space
  var nameLen = Buffer.byteLength(name);
  var buf = Buffer.allocUnsafe(1 + 4 + 4 + 9 + 1 + 4 + nameLen);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  writeUInt32BE(buf, chan, 1);

  writeUInt32BE(buf, 9, 5);
  buf.write('subsystem', 9, 9, 'ascii');

  buf[18] = (wantReply === undefined || wantReply === true ? 1 : 0);

  writeUInt32BE(buf, nameLen, 19);
  buf.write(name, 23, nameLen, 'ascii');

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', subsystem: '
             + name
             + ')');
  return send(this, buf);
};
SSH2Stream.prototype.openssh_agentForward = function(chan, wantReply) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  // Does not consume window space
  var buf = Buffer.allocUnsafe(1 + 4 + 4 + 26 + 1);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  writeUInt32BE(buf, chan, 1);

  writeUInt32BE(buf, 26, 5);
  buf.write('auth-agent-req@openssh.com', 9, 26, 'ascii');

  buf[35] = (wantReply === undefined || wantReply === true ? 1 : 0);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', auth-agent-req@openssh.com)');
  return send(this, buf);
};
// 'ssh-userauth' service-specific
SSH2Stream.prototype.authPassword = function(username, password) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var userLen = Buffer.byteLength(username);
  var passLen = Buffer.byteLength(password);
  var p = 0;
  var buf = Buffer.allocUnsafe(1
                               + 4 + userLen
                               + 4 + 14 // "ssh-connection"
                               + 4 + 8 // "password"
                               + 1
                               + 4 + passLen);

  buf[p] = MESSAGE.USERAUTH_REQUEST;

  writeUInt32BE(buf, userLen, ++p);
  buf.write(username, p += 4, userLen, 'utf8');

  writeUInt32BE(buf, 14, p += userLen);
  buf.write('ssh-connection', p += 4, 14, 'ascii');

  writeUInt32BE(buf, 8, p += 14);
  buf.write('password', p += 4, 8, 'ascii');

  buf[p += 8] = 0;

  writeUInt32BE(buf, passLen, ++p);
  buf.write(password, p += 4, passLen, 'utf8');

  this._state.authsQueue.push('password');
  this.debug('DEBUG: Outgoing: Writing USERAUTH_REQUEST (password)');
  return send(this, buf);
};
SSH2Stream.prototype.authPK = function(username, pubKey, cbSign) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var self = this;
  var outstate = this._state.outgoing;
  var keyType;

  if (typeof pubKey.getPublicSSH === 'function') {
    keyType = pubKey.type;
    pubKey = pubKey.getPublicSSH();
  } else {
    keyType = pubKey.toString('ascii',
                              4,
                              4 + readUInt32BE(pubKey, 0));
  }

  var userLen = Buffer.byteLength(username);
  var algoLen = Buffer.byteLength(keyType);
  var pubKeyLen = pubKey.length;
  var sesLen = outstate.sessionId.length;
  var p = 0;
  var buf = Buffer.allocUnsafe((cbSign ? 4 + sesLen : 0)
                               + 1
                               + 4 + userLen
                               + 4 + 14 // "ssh-connection"
                               + 4 + 9 // "publickey"
                               + 1
                               + 4 + algoLen
                               + 4 + pubKeyLen
                              );

  if (cbSign) {
    writeUInt32BE(buf, sesLen, p);
    outstate.sessionId.copy(buf, p += 4);
    buf[p += sesLen] = MESSAGE.USERAUTH_REQUEST;
  } else {
    buf[p] = MESSAGE.USERAUTH_REQUEST;
  }

  writeUInt32BE(buf, userLen, ++p);
  buf.write(username, p += 4, userLen, 'utf8');

  writeUInt32BE(buf, 14, p += userLen);
  buf.write('ssh-connection', p += 4, 14, 'ascii');

  writeUInt32BE(buf, 9, p += 14);
  buf.write('publickey', p += 4, 9, 'ascii');

  buf[p += 9] = (cbSign ? 1 : 0);

  writeUInt32BE(buf, algoLen, ++p);
  buf.write(keyType, p += 4, algoLen, 'ascii');

  writeUInt32BE(buf, pubKeyLen, p += algoLen);
  pubKey.copy(buf, p += 4);

  if (!cbSign) {
    this._state.authsQueue.push('publickey');
    this.debug('DEBUG: Outgoing: Writing USERAUTH_REQUEST (publickey -- check)');
    return send(this, buf);
  }

  cbSign(buf, function(signature) {
    signature = convertSignature(signature, keyType);
    if (signature === false)
      throw new Error('Error while converting handshake signature');

    var sigLen = signature.length;
    var sigbuf = Buffer.allocUnsafe(1
                                    + 4 + userLen
                                    + 4 + 14 // "ssh-connection"
                                    + 4 + 9 // "publickey"
                                    + 1
                                    + 4 + algoLen
                                    + 4 + pubKeyLen
                                    + 4 // 4 + algoLen + 4 + sigLen
                                    + 4 + algoLen
                                    + 4 + sigLen);

    p = 0;

    sigbuf[p] = MESSAGE.USERAUTH_REQUEST;

    writeUInt32BE(sigbuf, userLen, ++p);
    sigbuf.write(username, p += 4, userLen, 'utf8');

    writeUInt32BE(sigbuf, 14, p += userLen);
    sigbuf.write('ssh-connection', p += 4, 14, 'ascii');

    writeUInt32BE(sigbuf, 9, p += 14);
    sigbuf.write('publickey', p += 4, 9, 'ascii');

    sigbuf[p += 9] = 1;

    writeUInt32BE(sigbuf, algoLen, ++p);
    sigbuf.write(keyType, p += 4, algoLen, 'ascii');

    writeUInt32BE(sigbuf, pubKeyLen, p += algoLen);
    pubKey.copy(sigbuf, p += 4);
    writeUInt32BE(sigbuf, 4 + algoLen + 4 + sigLen, p += pubKeyLen);
    writeUInt32BE(sigbuf, algoLen, p += 4);
    sigbuf.write(keyType, p += 4, algoLen, 'ascii');
    writeUInt32BE(sigbuf, sigLen, p += algoLen);
    signature.copy(sigbuf, p += 4);

    // Servers shouldn't send packet type 60 in response to signed publickey
    // attempts, but if they do, interpret as type 60.
    self._state.authsQueue.push('publickey');
    self.debug('DEBUG: Outgoing: Writing USERAUTH_REQUEST (publickey)');
    return send(self, sigbuf);
  });
  return true;
};
SSH2Stream.prototype.authHostbased = function(username, pubKey, hostname,
                                              userlocal, cbSign) {
  // TODO: Make DRY by sharing similar code with authPK()

  if (this.server)
    throw new Error('Client-only method called in server mode');

  var self = this;
  var outstate = this._state.outgoing;
  var keyType;

  if (typeof pubKey.getPublicSSH === 'function') {
    keyType = pubKey.type;
    pubKey = pubKey.getPublicSSH();
  } else {
    keyType = pubKey.toString('ascii',
                              4,
                              4 + readUInt32BE(pubKey, 0));
  }

  var userLen = Buffer.byteLength(username);
  var algoLen = Buffer.byteLength(keyType);
  var pubKeyLen = pubKey.length;
  var sesLen = outstate.sessionId.length;
  var hostnameLen = Buffer.byteLength(hostname);
  var userlocalLen = Buffer.byteLength(userlocal);
  var p = 0;
  var buf = Buffer.allocUnsafe(4 + sesLen
                               + 1
                               + 4 + userLen
                               + 4 + 14 // "ssh-connection"
                               + 4 + 9 // "hostbased"
                               + 4 + algoLen
                               + 4 + pubKeyLen
                               + 4 + hostnameLen
                               + 4 + userlocalLen
                              );

  writeUInt32BE(buf, sesLen, p);
  outstate.sessionId.copy(buf, p += 4);

  buf[p += sesLen] = MESSAGE.USERAUTH_REQUEST;

  writeUInt32BE(buf, userLen, ++p);
  buf.write(username, p += 4, userLen, 'utf8');

  writeUInt32BE(buf, 14, p += userLen);
  buf.write('ssh-connection', p += 4, 14, 'ascii');

  writeUInt32BE(buf, 9, p += 14);
  buf.write('hostbased', p += 4, 9, 'ascii');

  writeUInt32BE(buf, algoLen, p += 9);
  buf.write(keyType, p += 4, algoLen, 'ascii');

  writeUInt32BE(buf, pubKeyLen, p += algoLen);
  pubKey.copy(buf, p += 4);

  writeUInt32BE(buf, hostnameLen, p += pubKeyLen);
  buf.write(hostname, p += 4, hostnameLen, 'ascii');

  writeUInt32BE(buf, userlocalLen, p += hostnameLen);
  buf.write(userlocal, p += 4, userlocalLen, 'utf8');

  cbSign(buf, function(signature) {
    signature = convertSignature(signature, keyType);
    if (signature === false)
      throw new Error('Error while converting handshake signature');

    var sigLen = signature.length;
    var sigbuf = Buffer.allocUnsafe((buf.length - sesLen) + sigLen);

    buf.copy(sigbuf, 0, 4 + sesLen);
    writeUInt32BE(sigbuf, sigLen, sigbuf.length - sigLen - 4);
    signature.copy(sigbuf, sigbuf.length - sigLen);

    self._state.authsQueue.push('hostbased');
    self.debug('DEBUG: Outgoing: Writing USERAUTH_REQUEST (hostbased)');
    return send(self, sigbuf);
  });
  return true;
};
SSH2Stream.prototype.authKeyboard = function(username) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var userLen = Buffer.byteLength(username);
  var p = 0;
  var buf = Buffer.allocUnsafe(1
                               + 4 + userLen
                               + 4 + 14 // "ssh-connection"
                               + 4 + 20 // "keyboard-interactive"
                               + 4 // no language set
                               + 4 // no submethods
                              );

  buf[p] = MESSAGE.USERAUTH_REQUEST;

  writeUInt32BE(buf, userLen, ++p);
  buf.write(username, p += 4, userLen, 'utf8');

  writeUInt32BE(buf, 14, p += userLen);
  buf.write('ssh-connection', p += 4, 14, 'ascii');

  writeUInt32BE(buf, 20, p += 14);
  buf.write('keyboard-interactive', p += 4, 20, 'ascii');

  writeUInt32BE(buf, 0, p += 20);

  writeUInt32BE(buf, 0, p += 4);

  this._state.authsQueue.push('keyboard-interactive');
  this.debug('DEBUG: Outgoing: Writing USERAUTH_REQUEST (keyboard-interactive)');
  return send(this, buf);
};
SSH2Stream.prototype.authNone = function(username) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var userLen = Buffer.byteLength(username);
  var p = 0;
  var buf = Buffer.allocUnsafe(1
                               + 4 + userLen
                               + 4 + 14 // "ssh-connection"
                               + 4 + 4 // "none"
                              );

  buf[p] = MESSAGE.USERAUTH_REQUEST;

  writeUInt32BE(buf, userLen, ++p);
  buf.write(username, p += 4, userLen, 'utf8');

  writeUInt32BE(buf, 14, p += userLen);
  buf.write('ssh-connection', p += 4, 14, 'ascii');

  writeUInt32BE(buf, 4, p += 14);
  buf.write('none', p += 4, 4, 'ascii');

  this._state.authsQueue.push('none');
  this.debug('DEBUG: Outgoing: Writing USERAUTH_REQUEST (none)');
  return send(this, buf);
};
SSH2Stream.prototype.authInfoRes = function(responses) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  var responsesLen = 0;
  var p = 0;
  var resLen;
  var len;
  var i;

  if (responses) {
    for (i = 0, len = responses.length; i < len; ++i)
      responsesLen += 4 + Buffer.byteLength(responses[i]);
  }
  var buf = Buffer.allocUnsafe(1 + 4 + responsesLen);

  buf[p++] = MESSAGE.USERAUTH_INFO_RESPONSE;

  writeUInt32BE(buf, responses ? responses.length : 0, p);
  if (responses) {
    p += 4;
    for (i = 0, len = responses.length; i < len; ++i) {
      resLen = Buffer.byteLength(responses[i]);
      writeUInt32BE(buf, resLen, p);
      p += 4;
      if (resLen) {
        buf.write(responses[i], p, resLen, 'utf8');
        p += resLen;
      }
    }
  }

  this.debug('DEBUG: Outgoing: Writing USERAUTH_INFO_RESPONSE');
  return send(this, buf);
};

// Server-specific methods
// Global
SSH2Stream.prototype.serviceAccept = function(svcName) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var svcNameLen = svcName.length;
  var buf = Buffer.allocUnsafe(1 + 4 + svcNameLen);

  buf[0] = MESSAGE.SERVICE_ACCEPT;

  writeUInt32BE(buf, svcNameLen, 1);
  buf.write(svcName, 5, svcNameLen, 'ascii');

  this.debug('DEBUG: Outgoing: Writing SERVICE_ACCEPT (' + svcName + ')');
  send(this, buf);

  if (this.server && this.banner && svcName === 'ssh-userauth') {
    /*
      byte      SSH_MSG_USERAUTH_BANNER
      string    message in ISO-10646 UTF-8 encoding
      string    language tag
    */
    var bannerLen = Buffer.byteLength(this.banner);
    var packetLen = 1 + 4 + bannerLen + 4;
    var packet = Buffer.allocUnsafe(packetLen);
    packet[0] = MESSAGE.USERAUTH_BANNER;
    writeUInt32BE(packet, bannerLen, 1);
    packet.write(this.banner, 5, bannerLen, 'utf8');
    packet.fill(0, packetLen - 4); // Empty language tag
    this.debug('DEBUG: Outgoing: Writing USERAUTH_BANNER');
    send(this, packet);
    this.banner = undefined; // Prevent banner from being displayed again
  }
};
// 'ssh-connection' service-specific
SSH2Stream.prototype.forwardedTcpip = function(chan, initWindow, maxPacket,
                                               cfg) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var boundAddrLen = Buffer.byteLength(cfg.boundAddr);
  var remoteAddrLen = Buffer.byteLength(cfg.remoteAddr);
  var p = 36 + boundAddrLen;
  var buf = Buffer.allocUnsafe(1 + 4 + 15 + 4 + 4 + 4 + 4 + boundAddrLen + 4 + 4
                               + remoteAddrLen + 4);

  buf[0] = MESSAGE.CHANNEL_OPEN;

  writeUInt32BE(buf, 15, 1);
  buf.write('forwarded-tcpip', 5, 15, 'ascii');

  writeUInt32BE(buf, chan, 20);

  writeUInt32BE(buf, initWindow, 24);

  writeUInt32BE(buf, maxPacket, 28);

  writeUInt32BE(buf, boundAddrLen, 32);
  buf.write(cfg.boundAddr, 36, boundAddrLen, 'ascii');

  writeUInt32BE(buf, cfg.boundPort, p);

  writeUInt32BE(buf, remoteAddrLen, p += 4);
  buf.write(cfg.remoteAddr, p += 4, remoteAddrLen, 'ascii');

  writeUInt32BE(buf, cfg.remotePort, p += remoteAddrLen);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_OPEN ('
             + chan
             + ', forwarded-tcpip)');
  return send(this, buf);
};
SSH2Stream.prototype.x11 = function(chan, initWindow, maxPacket, cfg) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var addrLen = Buffer.byteLength(cfg.originAddr);
  var p = 24 + addrLen;
  var buf = Buffer.allocUnsafe(1 + 4 + 3 + 4 + 4 + 4 + 4 + addrLen + 4);

  buf[0] = MESSAGE.CHANNEL_OPEN;

  writeUInt32BE(buf, 3, 1);
  buf.write('x11', 5, 3, 'ascii');

  writeUInt32BE(buf, chan, 8);

  writeUInt32BE(buf, initWindow, 12);

  writeUInt32BE(buf, maxPacket, 16);

  writeUInt32BE(buf, addrLen, 20);
  buf.write(cfg.originAddr, 24, addrLen, 'ascii');

  writeUInt32BE(buf, cfg.originPort, p);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_OPEN ('
             + chan
             + ', x11)');
  return send(this, buf);
};
SSH2Stream.prototype.openssh_authAgent = function(chan, initWindow, maxPacket) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var buf = Buffer.allocUnsafe(1 + 4 + 22 + 4 + 4 + 4);

  buf[0] = MESSAGE.CHANNEL_OPEN;

  writeUInt32BE(buf, 22, 1);
  buf.write('auth-agent@openssh.com', 5, 22, 'ascii');

  writeUInt32BE(buf, chan, 27);

  writeUInt32BE(buf, initWindow, 31);

  writeUInt32BE(buf, maxPacket, 35);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_OPEN ('
             + chan
             + ', auth-agent@openssh.com)');
  return send(this, buf);
};
SSH2Stream.prototype.openssh_forwardedStreamLocal = function(chan, initWindow,
                                                             maxPacket, cfg) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var pathlen = Buffer.byteLength(cfg.socketPath);
  var buf = Buffer.allocUnsafe(1 + 4 + 33 + 4 + 4 + 4 + 4 + pathlen + 4);

  buf[0] = MESSAGE.CHANNEL_OPEN;

  writeUInt32BE(buf, 33, 1);
  buf.write('forwarded-streamlocal@openssh.com', 5, 33, 'ascii');

  writeUInt32BE(buf, chan, 38);

  writeUInt32BE(buf, initWindow, 42);

  writeUInt32BE(buf, maxPacket, 46);

  writeUInt32BE(buf, pathlen, 50);
  buf.write(cfg.socketPath, 54, pathlen, 'utf8');

  writeUInt32BE(buf, 0, 54 + pathlen);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_OPEN ('
             + chan
             + ', forwarded-streamlocal@openssh.com)');
  return send(this, buf);
};
SSH2Stream.prototype.exitStatus = function(chan, status) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  // Does not consume window space
  var buf = Buffer.allocUnsafe(1 + 4 + 4 + 11 + 1 + 4);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  writeUInt32BE(buf, chan, 1);

  writeUInt32BE(buf, 11, 5);
  buf.write('exit-status', 9, 11, 'ascii');

  buf[20] = 0;

  writeUInt32BE(buf, status, 21);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', exit-status)');
  return send(this, buf);
};
SSH2Stream.prototype.exitSignal = function(chan, name, coreDumped, msg) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  // Does not consume window space
  var nameLen = Buffer.byteLength(name);
  var msgLen = (msg ? Buffer.byteLength(msg) : 0);
  var p = 25 + nameLen;
  var buf = Buffer.allocUnsafe(1 + 4 + 4 + 11 + 1 + 4 + nameLen + 1 + 4 + msgLen
                               + 4);

  buf[0] = MESSAGE.CHANNEL_REQUEST;

  writeUInt32BE(buf, chan, 1);

  writeUInt32BE(buf, 11, 5);
  buf.write('exit-signal', 9, 11, 'ascii');

  buf[20] = 0;

  writeUInt32BE(buf, nameLen, 21);
  buf.write(name, 25, nameLen, 'utf8');

  buf[p++] = (coreDumped ? 1 : 0);

  writeUInt32BE(buf, msgLen, p);
  p += 4;
  if (msgLen) {
    buf.write(msg, p, msgLen, 'utf8');
    p += msgLen;
  }

  writeUInt32BE(buf, 0, p);

  this.debug('DEBUG: Outgoing: Writing CHANNEL_REQUEST ('
             + chan
             + ', exit-signal)');
  return send(this, buf);
};
// 'ssh-userauth' service-specific
SSH2Stream.prototype.authFailure = function(authMethods, isPartial) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var authsQueue = this._state.authsQueue;
  if (!authsQueue.length)
    throw new Error('No auth in progress');

  var methods;

  if (typeof authMethods === 'boolean') {
    isPartial = authMethods;
    authMethods = undefined;
  }

  if (authMethods) {
    methods = [];
    for (var i = 0, len = authMethods.length; i < len; ++i) {
      if (authMethods[i].toLowerCase() === 'none')
        continue;
      methods.push(authMethods[i]);
    }
    methods = methods.join(',');
  } else
    methods = '';

  var methodsLen = methods.length;
  var buf = Buffer.allocUnsafe(1 + 4 + methodsLen + 1);

  buf[0] = MESSAGE.USERAUTH_FAILURE;

  writeUInt32BE(buf, methodsLen, 1);
  buf.write(methods, 5, methodsLen, 'ascii');

  buf[5 + methodsLen] = (isPartial === true ? 1 : 0);

  this._state.authsQueue.shift();
  this.debug('DEBUG: Outgoing: Writing USERAUTH_FAILURE');
  return send(this, buf);
};
SSH2Stream.prototype.authSuccess = function() {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var authsQueue = this._state.authsQueue;
  if (!authsQueue.length)
    throw new Error('No auth in progress');

  var state = this._state;
  var outstate = state.outgoing;
  var instate = state.incoming;

  state.authsQueue.shift();

  this.debug('DEBUG: Outgoing: Writing USERAUTH_SUCCESS');
  var ret = send(this, USERAUTH_SUCCESS_PACKET);

  if (outstate.compress.type === 'zlib@openssh.com') {
    outstate.compress.instance = zlib.createDeflate(ZLIB_OPTS);
    outstate.compress.queue = [];
  }
  if (instate.decompress.type === 'zlib@openssh.com')
    instate.decompress.instance = zlib.createInflate(ZLIB_OPTS);

  return ret;
};
SSH2Stream.prototype.authPKOK = function(keyAlgo, key) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var authsQueue = this._state.authsQueue;
  if (!authsQueue.length || authsQueue[0] !== 'publickey')
    throw new Error('"publickey" auth not in progress');

  var keyAlgoLen = keyAlgo.length;
  var keyLen = key.length;
  var buf = Buffer.allocUnsafe(1 + 4 + keyAlgoLen + 4 + keyLen);

  buf[0] = MESSAGE.USERAUTH_PK_OK;

  writeUInt32BE(buf, keyAlgoLen, 1);
  buf.write(keyAlgo, 5, keyAlgoLen, 'ascii');

  writeUInt32BE(buf, keyLen, 5 + keyAlgoLen);
  key.copy(buf, 5 + keyAlgoLen + 4);

  this._state.authsQueue.shift();
  this.debug('DEBUG: Outgoing: Writing USERAUTH_PK_OK');
  return send(this, buf);
};
SSH2Stream.prototype.authPasswdChg = function(prompt, lang) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var promptLen = Buffer.byteLength(prompt);
  var langLen = lang ? lang.length : 0;
  var p = 0;
  var buf = Buffer.allocUnsafe(1 + 4 + promptLen + 4 + langLen);

  buf[p] = MESSAGE.USERAUTH_PASSWD_CHANGEREQ;

  writeUInt32BE(buf, promptLen, ++p);
  buf.write(prompt, p += 4, promptLen, 'utf8');

  writeUInt32BE(buf, langLen, p += promptLen);
  if (langLen)
    buf.write(lang, p += 4, langLen, 'ascii');

  this.debug('DEBUG: Outgoing: Writing USERAUTH_PASSWD_CHANGEREQ');
  return send(this, buf);
};
SSH2Stream.prototype.authInfoReq = function(name, instructions, prompts) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  var promptsLen = 0;
  var nameLen = name ? Buffer.byteLength(name) : 0;
  var instrLen = instructions ? Buffer.byteLength(instructions) : 0;
  var p = 0;
  var promptLen;
  var prompt;
  var len;
  var i;

  for (i = 0, len = prompts.length; i < len; ++i)
    promptsLen += 4 + Buffer.byteLength(prompts[i].prompt) + 1;
  var buf = Buffer.allocUnsafe(1 + 4 + nameLen + 4 + instrLen + 4 + 4
                               + promptsLen);

  buf[p++] = MESSAGE.USERAUTH_INFO_REQUEST;

  writeUInt32BE(buf, nameLen, p);
  p += 4;
  if (name) {
    buf.write(name, p, nameLen, 'utf8');
    p += nameLen;
  }

  writeUInt32BE(buf, instrLen, p);
  p += 4;
  if (instructions) {
    buf.write(instructions, p, instrLen, 'utf8');
    p += instrLen;
  }

  writeUInt32BE(buf, 0, p);
  p += 4;

  writeUInt32BE(buf, prompts.length, p);
  p += 4;
  for (i = 0, len = prompts.length; i < len; ++i) {
    prompt = prompts[i];
    promptLen = Buffer.byteLength(prompt.prompt);
    writeUInt32BE(buf, promptLen, p);
    p += 4;
    if (promptLen) {
      buf.write(prompt.prompt, p, promptLen, 'utf8');
      p += promptLen;
    }
    buf[p++] = (prompt.echo ? 1 : 0);
  }

  this.debug('DEBUG: Outgoing: Writing USERAUTH_INFO_REQUEST');
  return send(this, buf);
};

// Shared incoming/parser functions
function onDISCONNECT(self, reason, code, desc, lang) { // Client/Server
  if (code !== DISCONNECT_REASON.BY_APPLICATION) {
    var err = new Error(desc || reason);
    err.code = code;
    self.emit('error', err);
  }
  self.reset();
}

function onKEXINIT(self, init, firstFollows) { // Client/Server
  var state = self._state;
  var outstate = state.outgoing;

  if (outstate.status === OUT_READY) {
    self.debug('DEBUG: Received re-key request');
    outstate.status = OUT_REKEYING;
    outstate.kexinit = undefined;
    KEXINIT(self, check);
  } else {
    check();
  }

  function check() {
    if (check_KEXINIT(self, init, firstFollows) === true) {
      if (!self.server) {
        if (state.kex.type === 'groupex')
          KEXDH_GEX_REQ(self);
        else
          KEXDH_INIT(self);
      } else {
        state.incoming.expectedPacket = state.kex.pktInit;
      }
    }
  }
}

function check_KEXINIT(self, init, firstFollows) {
  var state = self._state;
  var instate = state.incoming;
  var outstate = state.outgoing;
  var debug = self.debug;
  var serverList;
  var clientList;
  var val;
  var len;
  var i;

  debug('DEBUG: Comparing KEXINITs ...');

  var algos = self.config.algorithms;

  var kexList = algos.kex;
  if (self.remoteBugs & BUGS.BAD_DHGEX) {
    var copied = false;
    for (var j = kexList.length - 1; j >= 0; --j) {
      if (kexList[j].indexOf('group-exchange') !== -1) {
        if (!copied) {
          kexList = kexList.slice();
          copied = true;
        }
        kexList.splice(j, 1);
      }
    }
  }

  debug('DEBUG: (local) KEX algorithms: ' + kexList);
  debug('DEBUG: (remote) KEX algorithms: ' + init.algorithms.kex);
  if (self.server) {
    serverList = kexList;
    clientList = init.algorithms.kex;
  } else {
    serverList = init.algorithms.kex;
    clientList = kexList;
  }
  // Check for agreeable key exchange algorithm
  for (i = 0, len = clientList.length;
       i < len && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === len) {
    // No suitable match found!
    debug('DEBUG: No matching key exchange algorithm');
    var err = new Error('Handshake failed: no matching key exchange algorithm');
    err.level = 'handshake';
    self.emit('error', err);
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  var kex_algorithm = clientList[i];
  debug('DEBUG: KEX algorithm: ' + kex_algorithm);
  if (firstFollows
      && (!init.algorithms.kex.length
          || kex_algorithm !== init.algorithms.kex[0])) {
    // Ignore next incoming packet, it was a wrong first guess at KEX algorithm
    instate.ignoreNext = true;
  }

  debug('DEBUG: (local) Host key formats: ' + algos.serverHostKey);
  debug('DEBUG: (remote) Host key formats: ' + init.algorithms.srvHostKey);
  if (self.server) {
    serverList = algos.serverHostKey;
    clientList = init.algorithms.srvHostKey;
  } else {
    serverList = init.algorithms.srvHostKey;
    clientList = algos.serverHostKey;
  }
  // Check for agreeable server host key format
  for (i = 0, len = clientList.length;
       i < len && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === len) {
    // No suitable match found!
    debug('DEBUG: No matching host key format');
    var err = new Error('Handshake failed: no matching host key format');
    err.level = 'handshake';
    self.emit('error', err);
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  state.hostkeyFormat = clientList[i];
  debug('DEBUG: Host key format: ' + state.hostkeyFormat);

  debug('DEBUG: (local) Client->Server ciphers: ' + algos.cipher);
  debug('DEBUG: (remote) Client->Server ciphers: '
        + init.algorithms.cs.encrypt);
  if (self.server) {
    serverList = algos.cipher;
    clientList = init.algorithms.cs.encrypt;
  } else {
    serverList = init.algorithms.cs.encrypt;
    clientList = algos.cipher;
  }
  // Check for agreeable client->server cipher
  for (i = 0, len = clientList.length;
       i < len && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === len) {
    // No suitable match found!
    debug('DEBUG: No matching Client->Server cipher');
    var err = new Error('Handshake failed: no matching client->server cipher');
    err.level = 'handshake';
    self.emit('error', err);
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  if (self.server)
    val = instate.decrypt.type = clientList[i];
  else
    val = outstate.encrypt.type = clientList[i];
  debug('DEBUG: Client->Server Cipher: ' + val);

  debug('DEBUG: (local) Server->Client ciphers: ' + algos.cipher);
  debug('DEBUG: (remote) Server->Client ciphers: '
        + (init.algorithms.sc.encrypt));
  if (self.server) {
    serverList = algos.cipher;
    clientList = init.algorithms.sc.encrypt;
  } else {
    serverList = init.algorithms.sc.encrypt;
    clientList = algos.cipher;
  }
  // Check for agreeable server->client cipher
  for (i = 0, len = clientList.length;
       i < len && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === len) {
    // No suitable match found!
    debug('DEBUG: No matching Server->Client cipher');
    var err = new Error('Handshake failed: no matching server->client cipher');
    err.level = 'handshake';
    self.emit('error', err);
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  if (self.server)
    val = outstate.encrypt.type = clientList[i];
  else
    val = instate.decrypt.type = clientList[i];
  debug('DEBUG: Server->Client Cipher: ' + val);

  debug('DEBUG: (local) Client->Server HMAC algorithms: ' + algos.hmac);
  debug('DEBUG: (remote) Client->Server HMAC algorithms: '
        + init.algorithms.cs.mac);
  if (self.server) {
    serverList = algos.hmac;
    clientList = init.algorithms.cs.mac;
  } else {
    serverList = init.algorithms.cs.mac;
    clientList = algos.hmac;
  }
  // Check for agreeable client->server hmac algorithm
  for (i = 0, len = clientList.length;
       i < len && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === len) {
    // No suitable match found!
    debug('DEBUG: No matching Client->Server HMAC algorithm');
    var err = new Error('Handshake failed: no matching client->server HMAC');
    err.level = 'handshake';
    self.emit('error', err);
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  if (self.server)
    val = instate.hmac.type = clientList[i];
  else
    val = outstate.hmac.type = clientList[i];
  debug('DEBUG: Client->Server HMAC algorithm: ' + val);

  debug('DEBUG: (local) Server->Client HMAC algorithms: ' + algos.hmac);
  debug('DEBUG: (remote) Server->Client HMAC algorithms: '
        + init.algorithms.sc.mac);
  if (self.server) {
    serverList = algos.hmac;
    clientList = init.algorithms.sc.mac;
  } else {
    serverList = init.algorithms.sc.mac;
    clientList = algos.hmac;
  }
  // Check for agreeable server->client hmac algorithm
  for (i = 0, len = clientList.length;
       i < len && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === len) {
    // No suitable match found!
    debug('DEBUG: No matching Server->Client HMAC algorithm');
    var err = new Error('Handshake failed: no matching server->client HMAC');
    err.level = 'handshake';
    self.emit('error', err);
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  if (self.server)
    val = outstate.hmac.type = clientList[i];
  else
    val = instate.hmac.type = clientList[i];
  debug('DEBUG: Server->Client HMAC algorithm: ' + val);

  debug('DEBUG: (local) Client->Server compression algorithms: '
        + algos.compress);
  debug('DEBUG: (remote) Client->Server compression algorithms: '
        + init.algorithms.cs.compress);
  if (self.server) {
    serverList = algos.compress;
    clientList = init.algorithms.cs.compress;
  } else {
    serverList = init.algorithms.cs.compress;
    clientList = algos.compress;
  }
  // Check for agreeable client->server compression algorithm
  for (i = 0, len = clientList.length;
       i < len && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === len) {
    // No suitable match found!
    debug('DEBUG: No matching Client->Server compression algorithm');
    var err = new Error('Handshake failed: no matching client->server '
                        + 'compression algorithm');
    err.level = 'handshake';
    self.emit('error', err);
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  if (self.server)
    val = instate.decompress.type = clientList[i];
  else
    val = outstate.compress.type = clientList[i];
  debug('DEBUG: Client->Server compression algorithm: ' + val);

  debug('DEBUG: (local) Server->Client compression algorithms: '
        + algos.compress);
  debug('DEBUG: (remote) Server->Client compression algorithms: '
        + init.algorithms.sc.compress);
  if (self.server) {
    serverList = algos.compress;
    clientList = init.algorithms.sc.compress;
  } else {
    serverList = init.algorithms.sc.compress;
    clientList = algos.compress;
  }
  // Check for agreeable server->client compression algorithm
  for (i = 0, len = clientList.length;
       i < len && serverList.indexOf(clientList[i]) === -1;
       ++i);
  if (i === len) {
    // No suitable match found!
    debug('DEBUG: No matching Server->Client compression algorithm');
    var err = new Error('Handshake failed: no matching server->client '
                        + 'compression algorithm');
    err.level = 'handshake';
    self.emit('error', err);
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  if (self.server)
    val = outstate.compress.type = clientList[i];
  else
    val = instate.decompress.type = clientList[i];
  debug('DEBUG: Server->Client compression algorithm: ' + val);

  state.kex = new KeyExchange(kex_algorithm);
  state.kex.generateKeys();
  outstate.pubkey = state.kex.getPublicKey();

  return true;
}

function onKEXDH_GEX_GROUP(self, prime, gen) {
  var state = self._state;
  var outstate = state.outgoing;

  state.kex.setDHParams(prime, gen);
  state.kex.generateKeys();
  outstate.pubkey = state.kex.getPublicKey();

  KEXDH_INIT(self);
}

function onKEXDH_INIT(self, e) { // Server
  KEXDH_REPLY(self, e);
}

function onKEXDH_REPLY(self, info, verifiedHost) { // Client
  var state = self._state;
  var instate = state.incoming;
  var outstate = state.outgoing;
  var debug = self.debug;
  var len;
  var i;

  if (verifiedHost === undefined) {
    instate.expectedPacket = 'NEWKEYS';
    outstate.sentNEWKEYS = false;

    debug('DEBUG: Checking host key format');
    // Ensure all host key formats agree
    var hostkey_format = readString(info.hostkey, 0, 'ascii', self);
    if (hostkey_format === false)
      return false;
    if (info.hostkey_format !== state.hostkeyFormat
        || info.hostkey_format !== hostkey_format) {
      // Expected and actual server host key format do not match!
      debug('DEBUG: Host key format mismatch');
      self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
      self.reset();
      var err = new Error('Handshake failed: host key format mismatch');
      err.level = 'handshake';
      self.emit('error', err);
      return false;
    }

    debug('DEBUG: Checking signature format');
    // Ensure signature formats agree
    var sig_format = readString(info.sig, 0, 'ascii', self);
    if (sig_format === false)
      return false;
    if (info.sig_format !== sig_format) {
      debug('DEBUG: Signature format mismatch');
      self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
      self.reset();
      var err = new Error('Handshake failed: signature format mismatch');
      err.level = 'handshake';
      self.emit('error', err);
      return false;
    }
  }

  // Verify the host fingerprint first if needed
  if (outstate.status === OUT_INIT) {
    if (verifiedHost === undefined) {
      debug('DEBUG: Verifying host fingerprint');
      var sync = true;
      var emitted = self.emit('fingerprint', info.hostkey, function(permitted) {
        // Prevent multiple calls to this callback
        if (verifiedHost !== undefined)
          return;
        verifiedHost = !!permitted;
        if (!sync) {
          // Continue execution by re-entry
          onKEXDH_REPLY(self, info, verifiedHost);
        }
      });
      sync = false;
      // Support async calling of verification callback
      if (emitted && verifiedHost === undefined)
        return;
    }
    if (verifiedHost === undefined)
      debug('DEBUG: Host accepted by default (no verification)');
    else if (verifiedHost === true)
      debug('DEBUG: Host accepted (verified)');
    else {
      debug('DEBUG: Host denied via fingerprint verification');
      self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
      self.reset();
      var err = new Error('Handshake failed: '
                          + 'host fingerprint verification failed');
      err.level = 'handshake';
      self.emit('error', err);
      return false;
    }
  }

  info.pubkey = state.kex.convertPublicKey(info.pubkey);

  info.secret = state.kex.computeSecret(info.pubkey);

  if (info.secret instanceof Error) {
    info.secret.message = 'Error while computing DH secret ('
                          + state.kex.type + '): '
                          + info.secret.message;
    info.secret.level = 'handshake';
    self.emit('error', info.secret);
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  var hash = crypto.createHash(state.kex.hash);

  var len_ident = Buffer.byteLength(self.config.ident);
  var len_sident = Buffer.byteLength(instate.identRaw);
  var len_init = outstate.kexinit.length;
  var len_sinit = instate.kexinit.length;
  var len_hostkey = info.hostkey.length;
  var len_pubkey = outstate.pubkey.length;
  var len_spubkey = info.pubkey.length;
  var len_secret = info.secret.length;

  var exchangeBufLen = len_ident
                       + len_sident
                       + len_init
                       + len_sinit
                       + len_hostkey
                       + len_pubkey
                       + len_spubkey
                       + len_secret
                       + (4 * 8); // Length fields for above values

  // Group exchange-related
  var len_gex_prime;
  var len_gex_gen;
  var gex_prime;
  var gex_gen;
  var dhParams = state.kex.getDHParams();
  if (dhParams) {
    gex_prime = dhParams.prime;
    gex_gen = dhParams.generator;
    len_gex_prime = gex_prime.length;
    len_gex_gen = gex_gen.length;
    exchangeBufLen += (4 * 3); // min, n, max values
    exchangeBufLen += (4 * 2); // prime, generator length fields
    exchangeBufLen += len_gex_prime;
    exchangeBufLen += len_gex_gen;
  }

  var bp = 0;
  var exchangeBuf = Buffer.allocUnsafe(exchangeBufLen);

  writeUInt32BE(exchangeBuf, len_ident, bp);
  bp += 4;
  exchangeBuf.write(self.config.ident, bp, 'utf8'); // V_C
  bp += len_ident;

  writeUInt32BE(exchangeBuf, len_sident, bp);
  bp += 4;
  exchangeBuf.write(instate.identRaw, bp, 'utf8'); // V_S
  bp += len_sident;

  writeUInt32BE(exchangeBuf, len_init, bp);
  bp += 4;
  outstate.kexinit.copy(exchangeBuf, bp); // I_C
  bp += len_init;
  outstate.kexinit = undefined;

  writeUInt32BE(exchangeBuf, len_sinit, bp);
  bp += 4;
  instate.kexinit.copy(exchangeBuf, bp); // I_S
  bp += len_sinit;
  instate.kexinit = undefined;

  writeUInt32BE(exchangeBuf, len_hostkey, bp);
  bp += 4;
  info.hostkey.copy(exchangeBuf, bp); // K_S
  bp += len_hostkey;

  if (dhParams) {
    KEXDH_GEX_REQ_PACKET.slice(1).copy(exchangeBuf, bp); // min, n, max
    bp += (4 * 3); // Skip over bytes just copied

    writeUInt32BE(exchangeBuf, len_gex_prime, bp);
    bp += 4;
    gex_prime.copy(exchangeBuf, bp); // p
    bp += len_gex_prime;

    writeUInt32BE(exchangeBuf, len_gex_gen, bp);
    bp += 4;
    gex_gen.copy(exchangeBuf, bp); // g
    bp += len_gex_gen;
  }

  writeUInt32BE(exchangeBuf, len_pubkey, bp);
  bp += 4;
  outstate.pubkey.copy(exchangeBuf, bp); // e
  bp += len_pubkey;

  writeUInt32BE(exchangeBuf, len_spubkey, bp);
  bp += 4;
  info.pubkey.copy(exchangeBuf, bp); // f
  bp += len_spubkey;

  writeUInt32BE(exchangeBuf, len_secret, bp);
  bp += 4;
  info.secret.copy(exchangeBuf, bp); // K

  outstate.exchangeHash = hash.update(exchangeBuf).digest(); // H

  var rawsig = readString(info.sig, info.sig._pos, self); // s
  if (rawsig === false
      || !(rawsig = sigSSHToASN1(rawsig, info.sig_format, self))) {
    return false;
  }

  var hostPubKey = parseDERKey(info.hostkey, info.sig_format);
  if (hostPubKey instanceof Error)
    return false;

  debug('DEBUG: Verifying signature');

  if (hostPubKey.verify(outstate.exchangeHash, rawsig) !== true) {
    debug('DEBUG: Signature verification failed');
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    self.reset();
    var err = new Error('Handshake failed: signature verification failed');
    err.level = 'handshake';
    self.emit('error', err);
    return false;
  }

  if (outstate.sessionId === undefined)
    outstate.sessionId = outstate.exchangeHash;
  outstate.kexsecret = info.secret;

  debug('DEBUG: Outgoing: Writing NEWKEYS');
  if (outstate.status === OUT_REKEYING)
    send(self, NEWKEYS_PACKET, undefined, true);
  else
    send(self, NEWKEYS_PACKET);
  outstate.sentNEWKEYS = true;

  if (verifiedHost !== undefined && instate.expectedPacket === undefined) {
    // We received NEWKEYS while we were waiting for the fingerprint
    // verification callback to be called. In this case we have to re-execute
    // onNEWKEYS to finish the handshake.
    onNEWKEYS(self);
  }
}

function onNEWKEYS(self) { // Client/Server
  var state = self._state;
  var outstate = state.outgoing;
  var instate = state.incoming;

  instate.expectedPacket = undefined;

  if (!outstate.sentNEWKEYS)
    return;

  var len = outstate.kexsecret.length;

  var outCipherInfo = outstate.encrypt.info = CIPHER_INFO[outstate.encrypt.type];
  var p = 0;

  var dhHashAlgo = state.kex.hash;

  var secret = Buffer.allocUnsafe(4 + len);
  var iv;
  var key;

  // Whenever the client sends a new authentication request, it is enqueued
  // here.  Once the request is resolved (success, fail, or PK_OK),
  // dequeue.  Whatever is at the front of the queue determines how we
  // interpret packet type 60.
  state.authsQueue = [];

  writeUInt32BE(secret, len, p);
  p += 4;
  outstate.kexsecret.copy(secret, p);
  outstate.kexsecret = undefined;
  if (!outCipherInfo.stream) {
    iv = crypto.createHash(dhHashAlgo)
               .update(secret)
               .update(outstate.exchangeHash)
               .update(!self.server ? 'A' : 'B', 'ascii')
               .update(outstate.sessionId)
               .digest();
    while (iv.length < outCipherInfo.ivLen) {
      iv = Buffer.concat([iv,
                          crypto.createHash(dhHashAlgo)
                                .update(secret)
                                .update(outstate.exchangeHash)
                                .update(iv)
                                .digest()]);
    }
    if (iv.length > outCipherInfo.ivLen)
      iv = iv.slice(0, outCipherInfo.ivLen);
  } else {
    iv = EMPTY_BUFFER; // Streaming ciphers don't use an IV upfront
  }

  key = crypto.createHash(dhHashAlgo)
              .update(secret)
              .update(outstate.exchangeHash)
              .update(!self.server ? 'C' : 'D', 'ascii')
              .update(outstate.sessionId)
              .digest();
  while (key.length < outCipherInfo.keyLen) {
    key = Buffer.concat([key,
                         crypto.createHash(dhHashAlgo)
                               .update(secret)
                               .update(outstate.exchangeHash)
                               .update(key)
                               .digest()]);
  }
  if (key.length > outCipherInfo.keyLen)
    key = key.slice(0, outCipherInfo.keyLen);

  if (outCipherInfo.authLen > 0) {
    outstate.encrypt.iv = iv;
    outstate.encrypt.key = key;
    outstate.encrypt.instance = true;
  } else {
    var cipherAlgo = SSH_TO_OPENSSL[outstate.encrypt.type];
    outstate.encrypt.instance = crypto.createCipheriv(cipherAlgo, key, iv);
    outstate.encrypt.instance.setAutoPadding(false);
  }

  // And now for decrypting ...

  var inCipherInfo = instate.decrypt.info = CIPHER_INFO[instate.decrypt.type];
  if (!inCipherInfo.stream) {
    iv = crypto.createHash(dhHashAlgo)
               .update(secret)
               .update(outstate.exchangeHash)
               .update(!self.server ? 'B' : 'A', 'ascii')
               .update(outstate.sessionId)
               .digest();
    while (iv.length < inCipherInfo.ivLen) {
      iv = Buffer.concat([iv,
                          crypto.createHash(dhHashAlgo)
                                .update(secret)
                                .update(outstate.exchangeHash)
                                .update(iv)
                                .digest()]);
    }
    if (iv.length > inCipherInfo.ivLen)
      iv = iv.slice(0, inCipherInfo.ivLen);
  } else {
    iv = EMPTY_BUFFER; // Streaming ciphers don't use an IV upfront
  }

  // Create a reusable buffer for decryption purposes
  instate.decrypt.buf = Buffer.allocUnsafe(inCipherInfo.blockLen);

  key = crypto.createHash(dhHashAlgo)
              .update(secret)
              .update(outstate.exchangeHash)
              .update(!self.server ? 'D' : 'C', 'ascii')
              .update(outstate.sessionId)
              .digest();
  while (key.length < inCipherInfo.keyLen) {
    key = Buffer.concat([key,
                         crypto.createHash(dhHashAlgo)
                               .update(secret)
                               .update(outstate.exchangeHash)
                               .update(key)
                               .digest()]);
  }
  if (key.length > inCipherInfo.keyLen)
    key = key.slice(0, inCipherInfo.keyLen);

  var decipherAlgo = SSH_TO_OPENSSL[instate.decrypt.type];
  instate.decrypt.instance = crypto.createDecipheriv(decipherAlgo, key, iv);
  instate.decrypt.instance.setAutoPadding(false);
  instate.decrypt.iv = iv;
  instate.decrypt.key = key;

  var emptyBuf;
  if (outCipherInfo.discardLen > 0) {
    emptyBuf = Buffer.alloc(outCipherInfo.discardLen);
    outstate.encrypt.instance.update(emptyBuf);
  }
  if (inCipherInfo.discardLen > 0) {
    if (!emptyBuf || emptyBuf.length !== inCipherInfo.discardLen)
      emptyBuf = Buffer.alloc(outCipherInfo.discardLen);
    instate.decrypt.instance.update(emptyBuf);
  }

  var outHMACInfo = outstate.hmac.info = HMAC_INFO[outstate.hmac.type];
  var inHMACInfo = instate.hmac.info = HMAC_INFO[instate.hmac.type];

  if (outCipherInfo.authLen === 0) {
    key = crypto.createHash(dhHashAlgo)
                .update(secret)
                .update(outstate.exchangeHash)
                .update(!self.server ? 'E' : 'F', 'ascii')
                .update(outstate.sessionId)
                .digest();
    while (key.length < outHMACInfo.len) {
      key = Buffer.concat([key,
                           crypto.createHash(dhHashAlgo)
                                 .update(secret)
                                 .update(outstate.exchangeHash)
                                 .update(key)
                                 .digest()]);
    }
    if (key.length > outHMACInfo.len)
      key = key.slice(0, outHMACInfo.len);
    outstate.hmac.key = key;
  } else {
    outstate.hmac.key = undefined;
  }
  if (inCipherInfo.authLen === 0) {
    key = crypto.createHash(dhHashAlgo)
                .update(secret)
                .update(outstate.exchangeHash)
                .update(!self.server ? 'F' : 'E', 'ascii')
                .update(outstate.sessionId)
                .digest();
    while (key.length < inHMACInfo.len) {
      key = Buffer.concat([key,
                           crypto.createHash(dhHashAlgo)
                                 .update(secret)
                                 .update(outstate.exchangeHash)
                                 .update(key)
                                 .digest()]);
    }
    if (key.length > inHMACInfo.len)
      key = key.slice(0, inHMACInfo.len);
    instate.hmac.key = key;
  } else {
    instate.hmac.key = undefined;
  }

  // Create a reusable buffer for message verification purposes
  var inHMACSize = inCipherInfo.authLen || instate.hmac.info.actualLen;
  if (!instate.hmac.buf
      || instate.hmac.buf.length !== inHMACSize) {
    instate.hmac.buf = Buffer.allocUnsafe(inHMACSize);
  }

  outstate.exchangeHash = undefined;

  if (outstate.compress.type === 'zlib') {
    outstate.compress.instance = zlib.createDeflate(ZLIB_OPTS);
    outstate.compress.queue = [];
  } else if (outstate.compress.type === 'none') {
    outstate.compress.instance = false;
    outstate.compress.queue = null;
  }
  if (instate.decompress.type === 'zlib')
    instate.decompress.instance = zlib.createInflate(ZLIB_OPTS);
  else if (instate.decompress.type === 'none')
    instate.decompress.instance = false;

  self.bytesSent = self.bytesReceived = 0;

  if (outstate.status === OUT_REKEYING) {
    outstate.status = OUT_READY;

    // Empty our outbound buffer of any data we tried to send during the
    // re-keying process
    var queue = outstate.rekeyQueue;
    var qlen = queue.length;
    var q = 0;

    outstate.rekeyQueue = [];

    for (; q < qlen; ++q) {
      if (Buffer.isBuffer(queue[q]))
        send(self, queue[q]);
      else
        send(self, queue[q][0], queue[q][1]);
    }

    // Now empty our inbound buffer of any non-transport layer packets we
    // received during the re-keying process
    queue = instate.rekeyQueue;
    qlen = queue.length;
    q = 0;

    instate.rekeyQueue = [];

    var curSeqno = instate.seqno;
    for (; q < qlen; ++q) {
      instate.seqno = queue[q][0];
      instate.payload = queue[q][1];
      if (parsePacket(self) === false)
        return;

      if (instate.status === IN_INIT) {
        // We were reset due to some error/disagreement ?
        return;
      }
    }
    instate.seqno = curSeqno;
  } else {
    outstate.status = OUT_READY;
    if (instate.status === IN_PACKET) {
      // Explicitly update incoming packet parser status in order to get the
      // correct decipher, hmac, etc. states.

      // We only get here if the host fingerprint callback was called
      // asynchronously and the incoming packet parser is still expecting an
      // unencrypted packet, etc.

      self.debug('DEBUG: Parser: IN_PACKETBEFORE (update) (expecting '
                 + inCipherInfo.blockLen + ')');
      // Wait for the right number of bytes so we can determine the incoming
      // packet length
      expectData(self,
                 EXP_TYPE_BYTES,
                 inCipherInfo.blockLen,
                 instate.decrypt.buf);
    }
    self.emit('ready');
  }
}

function getPacketType(self, pktType) {
  var kex = self._state.kex;
  if (kex) {
    // Disambiguate
    switch (pktType) {
      case 30:
        return kex.pktInit;
      case 31:
        switch (kex.type) {
          case 'group':
            return 'KEXDH_REPLY';
          case 'groupex':
            return 'KEXDH_GEX_GROUP';
          default:
            return 'KEXECDH_REPLY';
        }
        break;
      case 33:
        if (kex.type === 'groupex')
          return 'KEXDH_GEX_REPLY';
    }
  }
  return MESSAGE[pktType];
}

function parsePacket(self, callback) {
  var instate = self._state.incoming;
  var outstate = self._state.outgoing;
  var payload = instate.payload;
  var seqno = instate.seqno;
  var serviceName;
  var lang;
  var message;
  var info;
  var chan;
  var data;
  var srcIP;
  var srcPort;
  var sender;
  var window;
  var packetSize;
  var recipient;
  var description;
  var socketPath;

  if (++instate.seqno > MAX_SEQNO)
    instate.seqno = 0;

  if (instate.ignoreNext) {
    self.debug('DEBUG: Parser: Packet ignored');
    instate.ignoreNext = false;
    return;
  }

  var type = payload[0];
  if (type === undefined)
    return false;

  // If we receive a packet during handshake that is not the expected packet
  // and it is not one of: DISCONNECT, IGNORE, UNIMPLEMENTED, or DEBUG, then we
  // close the stream
  if (outstate.status !== OUT_READY
      && getPacketType(self, type) !== instate.expectedPacket
      && type < 1
      && type > 4) {
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, expected: '
               + instate.expectedPacket
               + ' but got: '
               + getPacketType(self, type));
    // XXX: Potential issue where the module user decides to initiate a rekey
    // via KEXINIT() (which sets `expectedPacket`) after receiving a packet
    // and there is still another packet already waiting to be parsed at the
    // time the KEXINIT is written. this will cause an unexpected disconnect...
    self.disconnect(DISCONNECT_REASON.PROTOCOL_ERROR);
    var err = new Error('Received unexpected packet');
    err.level = 'protocol';
    self.emit('error', err);
    return false;
  }

  if (type === MESSAGE.CHANNEL_DATA) {
    /*
      byte      SSH_MSG_CHANNEL_DATA
      uint32    recipient channel
      string    data
    */
    chan = readInt(payload, 1, self, callback);
    if (chan === false)
      return false;
    // TODO: MAX_CHAN_DATA_LEN here should really be dependent upon the
    //       channel's packet size. The ssh2 module uses 32KB, so we'll hard
    //       code this for now ...
    data = readString(payload, 5, self, callback, 32768);
    if (data === false)
      return false;
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: CHANNEL_DATA ('
               + chan
               + ')');
    self.emit('CHANNEL_DATA:' + chan, data);
  } else if (type === MESSAGE.CHANNEL_EXTENDED_DATA) {
    /*
      byte      SSH_MSG_CHANNEL_EXTENDED_DATA
      uint32    recipient channel
      uint32    data_type_code
      string    data
    */
    chan = readInt(payload, 1, self, callback);
    if (chan === false)
      return false;
    var dataType = readInt(payload, 5, self, callback);
    if (dataType === false)
      return false;
    data = readString(payload, 9, self, callback);
    if (data === false)
      return false;
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: '
               + 'CHANNEL_EXTENDED_DATA ('
               + chan
               + ')');
    self.emit('CHANNEL_EXTENDED_DATA:' + chan, dataType, data);
  } else if (type === MESSAGE.CHANNEL_WINDOW_ADJUST) {
    /*
      byte      SSH_MSG_CHANNEL_WINDOW_ADJUST
      uint32    recipient channel
      uint32    bytes to add
    */
    chan = readInt(payload, 1, self, callback);
    if (chan === false)
      return false;
    var bytesToAdd = readInt(payload, 5, self, callback);
    if (bytesToAdd === false)
      return false;
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: '
               + 'CHANNEL_WINDOW_ADJUST ('
               + chan
               + ', '
               + bytesToAdd
               + ')');
    self.emit('CHANNEL_WINDOW_ADJUST:' + chan, bytesToAdd);
  } else if (type === MESSAGE.CHANNEL_SUCCESS) {
    /*
      byte      SSH_MSG_CHANNEL_SUCCESS
      uint32    recipient channel
    */
    chan = readInt(payload, 1, self, callback);
    if (chan === false)
      return false;
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: CHANNEL_SUCCESS ('
               + chan
               + ')');
    self.emit('CHANNEL_SUCCESS:' + chan);
  } else if (type === MESSAGE.CHANNEL_FAILURE) {
    /*
      byte      SSH_MSG_CHANNEL_FAILURE
      uint32    recipient channel
    */
    chan = readInt(payload, 1, self, callback);
    if (chan === false)
      return false;
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: CHANNEL_FAILURE ('
               + chan
               + ')');
    self.emit('CHANNEL_FAILURE:' + chan);
  } else if (type === MESSAGE.CHANNEL_EOF) {
    /*
      byte      SSH_MSG_CHANNEL_EOF
      uint32    recipient channel
    */
    chan = readInt(payload, 1, self, callback);
    if (chan === false)
      return false;
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: CHANNEL_EOF ('
               + chan
               + ')');
    self.emit('CHANNEL_EOF:' + chan);
  } else if (type === MESSAGE.CHANNEL_OPEN) {
    /*
      byte      SSH_MSG_CHANNEL_OPEN
      string    channel type in US-ASCII only
      uint32    sender channel
      uint32    initial window size
      uint32    maximum packet size
      ....      channel type specific data follows
    */
    var chanType = readString(payload, 1, 'ascii', self, callback);
    if (chanType === false)
      return false;
    sender = readInt(payload, payload._pos, self, callback);
    if (sender === false)
      return false;
    window = readInt(payload, payload._pos += 4, self, callback);
    if (window === false)
      return false;
    packetSize = readInt(payload, payload._pos += 4, self, callback);
    if (packetSize === false)
      return false;
    var channel;

    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: CHANNEL_OPEN ('
               + sender
               + ', '
               + chanType
               + ')');

    if (chanType === 'forwarded-tcpip' // Server->Client
        || chanType === 'direct-tcpip') { // Client->Server
      /*
        string    address that was connected / host to connect
        uint32    port that was connected / port to connect
        string    originator IP address
        uint32    originator port
      */
      var destIP = readString(payload,
                              payload._pos += 4,
                              'ascii',
                              self,
                              callback);
      if (destIP === false)
        return false;
      var destPort = readInt(payload, payload._pos, self, callback);
      if (destPort === false)
        return false;
      srcIP = readString(payload, payload._pos += 4, 'ascii', self, callback);
      if (srcIP === false)
        return false;
      srcPort = readInt(payload, payload._pos, self, callback);
      if (srcPort === false)
        return false;
      channel = {
        type: chanType,
        sender: sender,
        window: window,
        packetSize: packetSize,
        data: {
          destIP: destIP,
          destPort: destPort,
          srcIP: srcIP,
          srcPort: srcPort
        }
      };
    } else if (// Server->Client
               chanType === 'forwarded-streamlocal@openssh.com'
               // Client->Server
               || chanType === 'direct-streamlocal@openssh.com') {
      /*
        string    socket path
        string    reserved for future use
      */
      socketPath = readString(payload,
                              payload._pos += 4,
                              'utf8',
                              self,
                              callback);
      if (socketPath === false)
        return false;
      channel = {
        type: chanType,
        sender: sender,
        window: window,
        packetSize: packetSize,
        data: {
          socketPath: socketPath,
        }
      };
    } else if (chanType === 'x11') { // Server->Client
      /*
        string    originator address (e.g., "192.168.7.38")
        uint32    originator port
      */
      srcIP = readString(payload, payload._pos += 4, 'ascii', self, callback);
      if (srcIP === false)
        return false;
      srcPort = readInt(payload, payload._pos, self, callback);
      if (srcPort === false)
        return false;
      channel = {
        type: chanType,
        sender: sender,
        window: window,
        packetSize: packetSize,
        data: {
          srcIP: srcIP,
          srcPort: srcPort
        }
      };
    } else {
      // 'session' (Client->Server), 'auth-agent@openssh.com' (Server->Client)
      channel = {
        type: chanType,
        sender: sender,
        window: window,
        packetSize: packetSize,
        data: {}
      };
    }

    self.emit('CHANNEL_OPEN', channel);
  } else if (type === MESSAGE.CHANNEL_OPEN_CONFIRMATION) {
    /*
      byte      SSH_MSG_CHANNEL_OPEN_CONFIRMATION
      uint32    recipient channel
      uint32    sender channel
      uint32    initial window size
      uint32    maximum packet size
      ....      channel type specific data follows
    */
    // "The 'recipient channel' is the channel number given in the
    // original open request, and 'sender channel' is the channel number
    // allocated by the other side."
    recipient = readInt(payload, 1, self, callback);
    if (recipient === false)
      return false;
    sender = readInt(payload, 5, self, callback);
    if (sender === false)
      return false;
    window = readInt(payload, 9, self, callback);
    if (window === false)
      return false;
    packetSize = readInt(payload, 13, self, callback);
    if (packetSize === false)
      return false;

    info = {
      recipient: recipient,
      sender: sender,
      window: window,
      packetSize: packetSize
    };

    if (payload.length > 17)
      info.data = payload.slice(17);

    self.emit('CHANNEL_OPEN_CONFIRMATION:' + info.recipient, info);
  } else if (type === MESSAGE.CHANNEL_OPEN_FAILURE) {
    /*
      byte      SSH_MSG_CHANNEL_OPEN_FAILURE
      uint32    recipient channel
      uint32    reason code
      string    description in ISO-10646 UTF-8 encoding
      string    language tag
    */
    recipient = readInt(payload, 1, self, callback);
    if (recipient === false)
      return false;
    var reasonCode = readInt(payload, 5, self, callback);
    if (reasonCode === false)
      return false;
    description = readString(payload, 9, 'utf8', self, callback);
    if (description === false)
      return false;
    lang = readString(payload, payload._pos, 'utf8', self, callback);
    if (lang === false)
      return false;
    payload._pos = 9;
    info = {
      recipient: recipient,
      reasonCode: reasonCode,
      reason: CHANNEL_OPEN_FAILURE[reasonCode],
      description: description,
      lang: lang
    };

    self.emit('CHANNEL_OPEN_FAILURE:' + info.recipient, info);
  } else if (type === MESSAGE.CHANNEL_CLOSE) {
    /*
      byte      SSH_MSG_CHANNEL_CLOSE
      uint32    recipient channel
    */
    chan = readInt(payload, 1, self, callback);
    if (chan === false)
      return false;
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: CHANNEL_CLOSE ('
               + chan
               + ')');
    self.emit('CHANNEL_CLOSE:' + chan);
  } else if (type === MESSAGE.IGNORE) {
    /*
      byte      SSH_MSG_IGNORE
      string    data
    */
  } else if (type === MESSAGE.DISCONNECT) {
    /*
      byte      SSH_MSG_DISCONNECT
      uint32    reason code
      string    description in ISO-10646 UTF-8 encoding
      string    language tag
    */
    var reason = readInt(payload, 1, self, callback);
    if (reason === false)
      return false;
    var reasonText = DISCONNECT_REASON[reason];
    description = readString(payload, 5, 'utf8', self, callback);
    if (description === false)
      return false;

    if (payload._pos < payload.length)
      lang = readString(payload, payload._pos, 'ascii', self, callback);

    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: DISCONNECT ('
               + reasonText
               + ')');

    self.emit('DISCONNECT', reasonText, reason, description, lang);
  } else if (type === MESSAGE.DEBUG) {
    /*
      byte      SSH_MSG_DEBUG
      boolean   always_display
      string    message in ISO-10646 UTF-8 encoding
      string    language tag
    */
    message = readString(payload, 2, 'utf8', self, callback);
    if (message === false)
      return false;
    lang = readString(payload, payload._pos, 'ascii', self, callback);
    if (lang === false)
      return false;

    self.emit('DEBUG', message, lang);
  } else if (type === MESSAGE.NEWKEYS) {
    /*
      byte      SSH_MSG_NEW_KEYS
    */
    self.emit('NEWKEYS');
  } else if (type === MESSAGE.SERVICE_REQUEST) {
    /*
      byte      SSH_MSG_SERVICE_REQUEST
      string    service name
    */
    serviceName = readString(payload, 1, 'ascii', self, callback);
    if (serviceName === false)
      return false;

    self.emit('SERVICE_REQUEST', serviceName);
  } else if (type === MESSAGE.SERVICE_ACCEPT) {
    /*
      byte      SSH_MSG_SERVICE_ACCEPT
      string    service name
    */
    serviceName = readString(payload, 1, 'ascii', self, callback);
    if (serviceName === false)
      return false;

    self.emit('SERVICE_ACCEPT', serviceName);
  } else if (type === MESSAGE.USERAUTH_REQUEST) {
    /*
      byte      SSH_MSG_USERAUTH_REQUEST
      string    user name in ISO-10646 UTF-8 encoding [RFC3629]
      string    service name in US-ASCII
      string    method name in US-ASCII
      ....      method specific fields
    */
    var username = readString(payload, 1, 'utf8', self, callback);
    if (username === false)
      return false;
    var svcName = readString(payload, payload._pos, 'ascii', self, callback);
    if (svcName === false)
      return false;
    var method = readString(payload, payload._pos, 'ascii', self, callback);
    if (method === false)
      return false;

    var methodData;
    var methodDesc;

    if (method === 'password') {
      methodData = readString(payload,
                              payload._pos + 1,
                              'utf8',
                              self,
                              callback);
      if (methodData === false)
        return false;
    } else if (method === 'publickey' || method === 'hostbased') {
      var pkSigned;
      var keyAlgo;
      var key;
      var signature;
      var blob;
      var hostname;
      var userlocal;
      if (method === 'publickey') {
        pkSigned = payload[payload._pos++];
        if (pkSigned === undefined)
          return false;
        pkSigned = (pkSigned !== 0);
      }
      keyAlgo = readString(payload, payload._pos, 'ascii', self, callback);
      if (keyAlgo === false)
        return false;
      key = readString(payload, payload._pos, self, callback);
      if (key === false)
        return false;

      if (pkSigned || method === 'hostbased') {
        if (method === 'hostbased') {
          hostname = readString(payload, payload._pos, 'ascii', self, callback);
          if (hostname === false)
            return false;
          userlocal = readString(payload, payload._pos, 'utf8', self, callback);
          if (userlocal === false)
            return false;
        }

        var blobEnd = payload._pos;
        signature = readString(payload, blobEnd, self, callback);
        if (signature === false)
          return false;

        if (signature.length > (4 + keyAlgo.length + 4)
            && signature.toString('ascii', 4, 4 + keyAlgo.length) === keyAlgo) {
          // Skip algoLen + algo + sigLen
          signature = signature.slice(4 + keyAlgo.length + 4);
        }

        signature = sigSSHToASN1(signature, keyAlgo, self, callback);
        if (signature === false)
          return false;

        blob = Buffer.allocUnsafe(4 + outstate.sessionId.length + blobEnd);
        writeUInt32BE(blob, outstate.sessionId.length, 0);
        outstate.sessionId.copy(blob, 4);
        payload.copy(blob, 4 + outstate.sessionId.length, 0, blobEnd);
      } else {
        methodDesc = 'publickey -- check';
      }

      methodData = {
        keyAlgo: keyAlgo,
        key: key,
        signature: signature,
        blob: blob,
        localHostname: hostname,
        localUsername: userlocal
      };
    } else if (method === 'keyboard-interactive') {
      // Skip language, it's deprecated
      var skipLen = readInt(payload, payload._pos, self, callback);
      if (skipLen === false)
        return false;
      methodData = readString(payload,
                              payload._pos + 4 + skipLen,
                              'utf8',
                              self,
                              callback);
      if (methodData === false)
        return false;
    } else if (method !== 'none')
      methodData = payload.slice(payload._pos);

    if (methodDesc === undefined)
      methodDesc = method;

    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: USERAUTH_REQUEST ('
               + methodDesc
               + ')');

    self._state.authsQueue.push(method);
    self.emit('USERAUTH_REQUEST', username, svcName, method, methodData);
  } else if (type === MESSAGE.USERAUTH_SUCCESS) {
    /*
      byte      SSH_MSG_USERAUTH_SUCCESS
    */
    if (outstate.compress.type === 'zlib@openssh.com') {
      outstate.compress.instance = zlib.createDeflate(ZLIB_OPTS);
      outstate.compress.queue = [];
    }
    if (instate.decompress.type === 'zlib@openssh.com')
      instate.decompress.instance = zlib.createInflate(ZLIB_OPTS);

    self._state.authsQueue.shift();

    self.emit('USERAUTH_SUCCESS');
  } else if (type === MESSAGE.USERAUTH_FAILURE) {
    /*
      byte      SSH_MSG_USERAUTH_FAILURE
      name-list    authentications that can continue
      boolean      partial success
    */
    var auths = readString(payload, 1, 'ascii', self, callback);
    if (auths === false)
      return false;
    var partSuccess = payload[payload._pos];
    if (partSuccess === undefined)
      return false;

    partSuccess = (partSuccess !== 0);
    auths = auths.split(',');

    self._state.authsQueue.shift();
    self.emit('USERAUTH_FAILURE', auths, partSuccess);
  } else if (type === MESSAGE.USERAUTH_BANNER) {
    /*
      byte      SSH_MSG_USERAUTH_BANNER
      string    message in ISO-10646 UTF-8 encoding
      string    language tag
    */
    message = readString(payload, 1, 'utf8', self, callback);
    if (message === false)
      return false;
    lang = readString(payload, payload._pos, 'utf8', self, callback);
    if (lang === false)
      return false;

    self.emit('USERAUTH_BANNER', message, lang);
  } else if (type === MESSAGE.GLOBAL_REQUEST) {
    /*
      byte      SSH_MSG_GLOBAL_REQUEST
      string    request name in US-ASCII only
      boolean   want reply
      ....      request-specific data follows
    */
    var request = readString(payload, 1, 'ascii', self, callback);
    if (request === false) {
      self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: GLOBAL_REQUEST');
      return false;
    }
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: GLOBAL_REQUEST ('
               + request
               + ')');

    var wantReply = payload[payload._pos++];
    if (wantReply === undefined)
      return false;
    wantReply = (wantReply !== 0);

    var reqData;
    if (request === 'tcpip-forward' || request === 'cancel-tcpip-forward') {
      var bindAddr = readString(payload, payload._pos, 'ascii', self, callback);
      if (bindAddr === false)
        return false;
      var bindPort = readInt(payload, payload._pos, self, callback);
      if (bindPort === false)
        return false;
      reqData = {
        bindAddr: bindAddr,
        bindPort: bindPort
      };
    } else if (request === 'streamlocal-forward@openssh.com'
               || request === 'cancel-streamlocal-forward@openssh.com') {
      socketPath = readString(payload, payload._pos, 'utf8', self, callback);
      if (socketPath === false)
        return false;
      reqData = {
        socketPath: socketPath
      };
    } else if (request === 'no-more-sessions@openssh.com') {
      // No data
    } else {
      reqData = payload.slice(payload._pos);
    }

    self.emit('GLOBAL_REQUEST', request, wantReply, reqData);
  } else if (type === MESSAGE.REQUEST_SUCCESS) {
    /*
      byte      SSH_MSG_REQUEST_SUCCESS
      ....      response specific data
    */
    if (payload.length > 1)
      self.emit('REQUEST_SUCCESS', payload.slice(1));
    else
      self.emit('REQUEST_SUCCESS');
  } else if (type === MESSAGE.REQUEST_FAILURE) {
    /*
      byte      SSH_MSG_REQUEST_FAILURE
    */
    self.emit('REQUEST_FAILURE');
  } else if (type === MESSAGE.UNIMPLEMENTED) {
    /*
      byte      SSH_MSG_UNIMPLEMENTED
      uint32    packet sequence number of rejected message
    */
    // TODO
  } else if (type === MESSAGE.KEXINIT)
    return parse_KEXINIT(self, callback);
  else if (type === MESSAGE.CHANNEL_REQUEST)
    return parse_CHANNEL_REQUEST(self, callback);
  else if (type >= 30 && type <= 49) // Key exchange method-specific messages
    return parse_KEX(self, type, callback);
  else if (type >= 60 && type <= 70) // User auth context-specific messages
    return parse_USERAUTH(self, type, callback);
  else {
    // Unknown packet type
    var unimpl = Buffer.allocUnsafe(1 + 4);
    unimpl[0] = MESSAGE.UNIMPLEMENTED;
    writeUInt32BE(unimpl, seqno, 1);
    send(self, unimpl);
  }
}

function parse_KEXINIT(self, callback) {
  var instate = self._state.incoming;
  var payload = instate.payload;

  /*
    byte         SSH_MSG_KEXINIT
    byte[16]     cookie (random bytes)
    name-list    kex_algorithms
    name-list    server_host_key_algorithms
    name-list    encryption_algorithms_client_to_server
    name-list    encryption_algorithms_server_to_client
    name-list    mac_algorithms_client_to_server
    name-list    mac_algorithms_server_to_client
    name-list    compression_algorithms_client_to_server
    name-list    compression_algorithms_server_to_client
    name-list    languages_client_to_server
    name-list    languages_server_to_client
    boolean      first_kex_packet_follows
    uint32       0 (reserved for future extension)
  */
  var init = {
    algorithms: {
      kex: undefined,
      srvHostKey: undefined,
      cs: {
        encrypt: undefined,
        mac: undefined,
        compress: undefined
      },
      sc: {
        encrypt: undefined,
        mac: undefined,
        compress: undefined
      }
    },
    languages: {
      cs: undefined,
      sc: undefined
    }
  };
  var val;

  val = readList(payload, 17, self, callback);
  if (val === false)
    return false;
  init.algorithms.kex = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.algorithms.srvHostKey = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.algorithms.cs.encrypt = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.algorithms.sc.encrypt = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.algorithms.cs.mac = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.algorithms.sc.mac = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.algorithms.cs.compress = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.algorithms.sc.compress = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.languages.cs = val;
  val = readList(payload, payload._pos, self, callback);
  if (val === false)
    return false;
  init.languages.sc = val;

  var firstFollows = (payload._pos < payload.length
                      && payload[payload._pos] === 1);

  instate.kexinit = payload;

  self.emit('KEXINIT', init, firstFollows);
}

function parse_KEX(self, type, callback) {
  var state = self._state;
  var instate = state.incoming;
  var payload = instate.payload;

  if (state.outgoing.status === OUT_READY
      || getPacketType(self, type) !== instate.expectedPacket) {
    self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, expected: '
               + instate.expectedPacket
               + ' but got: '
               + getPacketType(self, type));
    self.disconnect(DISCONNECT_REASON.PROTOCOL_ERROR);
    var err = new Error('Received unexpected packet');
    err.level = 'protocol';
    self.emit('error', err);
    return false;
  }

  if (state.kex.type === 'groupex') {
    // Dynamic group exchange-related

    if (self.server) {
      // TODO: Support group exchange server-side
      self.disconnect(DISCONNECT_REASON.PROTOCOL_ERROR);
      var err = new Error('DH group exchange not supported by server');
      err.level = 'handshake';
      self.emit('error', err);
      return false;
    } else {
      if (type === MESSAGE.KEXDH_GEX_GROUP) {
        /*
          byte    SSH_MSG_KEX_DH_GEX_GROUP
          mpint   p, safe prime
          mpint   g, generator for subgroup in GF(p)
        */
        var prime = readString(payload, 1, self, callback);
        if (prime === false)
          return false;
        var gen = readString(payload, payload._pos, self, callback);
        if (gen === false)
          return false;
        self.emit('KEXDH_GEX_GROUP', prime, gen);
      } else if (type === MESSAGE.KEXDH_GEX_REPLY)
        return parse_KEXDH_REPLY(self, callback);
    }
  } else {
    // Static group or ECDH-related

    if (type === MESSAGE.KEXDH_INIT) {
      /*
        byte      SSH_MSG_KEXDH_INIT
        mpint     e
      */
      var e = readString(payload, 1, self, callback);
      if (e === false)
        return false;

      self.emit('KEXDH_INIT', e);
    } else if (type === MESSAGE.KEXDH_REPLY)
      return parse_KEXDH_REPLY(self, callback);
  }
}

function parse_KEXDH_REPLY(self, callback) {
  var payload = self._state.incoming.payload;
  /*
    byte      SSH_MSG_KEXDH_REPLY
                / SSH_MSG_KEX_DH_GEX_REPLY
                / SSH_MSG_KEX_ECDH_REPLY
    string    server public host key and certificates (K_S)
    mpint     f
    string    signature of H
  */
  var hostkey = readString(payload, 1, self, callback);
  if (hostkey === false)
    return false;
  var pubkey = readString(payload, payload._pos, self, callback);
  if (pubkey === false)
    return false;
  var sig = readString(payload, payload._pos, self, callback);
  if (sig === false)
    return false;
  var info = {
    hostkey: hostkey,
    hostkey_format: undefined,
    pubkey: pubkey,
    sig: sig,
    sig_format: undefined
  };
  var hostkey_format = readString(hostkey, 0, 'ascii', self, callback);
  if (hostkey_format === false)
    return false;
  info.hostkey_format = hostkey_format;
  var sig_format = readString(sig, 0, 'ascii', self, callback);
  if (sig_format === false)
    return false;
  info.sig_format = sig_format;
  self.emit('KEXDH_REPLY', info);
}

function parse_USERAUTH(self, type, callback) {
  var state = self._state;
  var authMethod = state.authsQueue[0];
  var payload = state.incoming.payload;
  var message;
  var lang;
  var text;

  if (authMethod === 'password') {
    if (type === MESSAGE.USERAUTH_PASSWD_CHANGEREQ) {
      /*
        byte      SSH_MSG_USERAUTH_PASSWD_CHANGEREQ
        string    prompt in ISO-10646 UTF-8 encoding
        string    language tag
      */
      message = readString(payload, 1, 'utf8', self, callback);
      if (message === false)
        return false;
      lang = readString(payload, payload._pos, 'utf8', self, callback);
      if (lang === false)
        return false;
      self.emit('USERAUTH_PASSWD_CHANGEREQ', message, lang);
    }
  } else if (authMethod === 'keyboard-interactive') {
    if (type === MESSAGE.USERAUTH_INFO_REQUEST) {
      /*
        byte      SSH_MSG_USERAUTH_INFO_REQUEST
        string    name (ISO-10646 UTF-8)
        string    instruction (ISO-10646 UTF-8)
        string    language tag -- MAY be empty
        int       num-prompts
        string    prompt[1] (ISO-10646 UTF-8)
        boolean   echo[1]
        ...
        string    prompt[num-prompts] (ISO-10646 UTF-8)
        boolean   echo[num-prompts]
      */
      var name;
      var instr;
      var nprompts;

      name = readString(payload, 1, 'utf8', self, callback);
      if (name === false)
        return false;
      instr = readString(payload, payload._pos, 'utf8', self, callback);
      if (instr === false)
        return false;
      lang = readString(payload, payload._pos, 'utf8', self, callback);
      if (lang === false)
        return false;
      nprompts = readInt(payload, payload._pos, self, callback);
      if (nprompts === false)
        return false;

      payload._pos += 4;

      var prompts = [];
      for (var prompt = 0; prompt < nprompts; ++prompt) {
        text = readString(payload, payload._pos, 'utf8', self, callback);
        if (text === false)
          return false;
        var echo = payload[payload._pos++];
        if (echo === undefined)
          return false;
        echo = (echo !== 0);
        prompts.push({
          prompt: text,
          echo: echo
        });
      }
      self.emit('USERAUTH_INFO_REQUEST', name, instr, lang, prompts);
    } else if (type === MESSAGE.USERAUTH_INFO_RESPONSE) {
      /*
        byte      SSH_MSG_USERAUTH_INFO_RESPONSE
        int       num-responses
        string    response[1] (ISO-10646 UTF-8)
        ...
        string    response[num-responses] (ISO-10646 UTF-8)
      */
      var nresponses = readInt(payload, 1, self, callback);
      if (nresponses === false)
        return false;

      payload._pos = 5;

      var responses = [];
      for (var response = 0; response < nresponses; ++response) {
        text = readString(payload, payload._pos, 'utf8', self, callback);
        if (text === false)
          return false;
        responses.push(text);
      }
      self.emit('USERAUTH_INFO_RESPONSE', responses);
    }
  } else if (authMethod === 'publickey') {
    if (type === MESSAGE.USERAUTH_PK_OK) {
      /*
        byte      SSH_MSG_USERAUTH_PK_OK
        string    public key algorithm name from the request
        string    public key blob from the request
      */
      var authsQueue = self._state.authsQueue;
      if (!authsQueue.length || authsQueue[0] !== 'publickey')
        return;
      authsQueue.shift();
      self.emit('USERAUTH_PK_OK');
      // XXX: Parse public key info? client currently can ignore it because
      // there is only one outstanding auth request at any given time, so it
      // knows which key was OK'd
    }
  } else if (authMethod !== undefined) {
    // Invalid packet for this auth type
    self.disconnect(DISCONNECT_REASON.PROTOCOL_ERROR);
    var err = new Error('Invalid authentication method: ' + authMethod);
    err.level = 'protocol';
    self.emit('error', err);
  }
}

function parse_CHANNEL_REQUEST(self, callback) {
  var payload = self._state.incoming.payload;
  var info;
  var cols;
  var rows;
  var width;
  var height;
  var wantReply;
  var signal;

  var recipient = readInt(payload, 1, self, callback);
  if (recipient === false)
    return false;
  var request = readString(payload, 5, 'ascii', self, callback);
  if (request === false)
    return false;

  if (request === 'exit-status') { // Server->Client
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "exit-status"
      boolean   FALSE
      uint32    exit_status
    */
    var code = readInt(payload, ++payload._pos, self, callback);
    if (code === false)
      return false;
    info = {
      recipient: recipient,
      request: request,
      wantReply: false,
      code: code
    };
  } else if (request === 'exit-signal') { // Server->Client
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "exit-signal"
      boolean   FALSE
      string    signal name (without the "SIG" prefix)
      boolean   core dumped
      string    error message in ISO-10646 UTF-8 encoding
      string    language tag
    */
    var coredump;
    if (!(self.remoteBugs & BUGS.OLD_EXIT)) {
      signal = readString(payload, ++payload._pos, 'ascii', self, callback);
      if (signal === false)
        return false;
      coredump = payload[payload._pos++];
      if (coredump === undefined)
        return false;
      coredump = (coredump !== 0);
    } else {
      /*
        Instead of `signal name` and `core dumped`, we have just:

        uint32  signal number
      */
      signal = readInt(payload, ++payload._pos, self, callback);
      if (signal === false)
        return false;
      switch (signal) {
        case 1:
          signal = 'HUP';
          break;
        case 2:
          signal = 'INT';
          break;
        case 3:
          signal = 'QUIT';
          break;
        case 6:
          signal = 'ABRT';
          break;
        case 9:
          signal = 'KILL';
          break;
        case 14:
          signal = 'ALRM';
          break;
        case 15:
          signal = 'TERM';
          break;
        default:
          // Unknown or OS-specific
          signal = 'UNKNOWN (' + signal + ')';
      }
      coredump = false;
    }
    var description = readString(payload, payload._pos, 'utf8', self,
                                 callback);
    if (description === false)
      return false;
    var lang = readString(payload, payload._pos, 'utf8', self, callback);
    if (lang === false)
      return false;
    info = {
      recipient: recipient,
      request: request,
      wantReply: false,
      signal: signal,
      coredump: coredump,
      description: description,
      lang: lang
    };
  } else if (request === 'pty-req') { // Client->Server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "pty-req"
      boolean   want_reply
      string    TERM environment variable value (e.g., vt100)
      uint32    terminal width, characters (e.g., 80)
      uint32    terminal height, rows (e.g., 24)
      uint32    terminal width, pixels (e.g., 640)
      uint32    terminal height, pixels (e.g., 480)
      string    encoded terminal modes
    */
    wantReply = payload[payload._pos++];
    if (wantReply === undefined)
      return false;
    wantReply = (wantReply !== 0);
    var term = readString(payload, payload._pos, 'ascii', self, callback);
    if (term === false)
      return false;
    cols = readInt(payload, payload._pos, self, callback);
    if (cols === false)
      return false;
    rows = readInt(payload, payload._pos += 4, self, callback);
    if (rows === false)
      return false;
    width = readInt(payload, payload._pos += 4, self, callback);
    if (width === false)
      return false;
    height = readInt(payload, payload._pos += 4, self, callback);
    if (height === false)
      return false;
    var modes = readString(payload, payload._pos += 4, self, callback);
    if (modes === false)
      return false;
    modes = bytesToModes(modes);
    info = {
      recipient: recipient,
      request: request,
      wantReply: wantReply,
      term: term,
      cols: cols,
      rows: rows,
      width: width,
      height: height,
      modes: modes
    };
  } else if (request === 'window-change') { // Client->Server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "window-change"
      boolean   FALSE
      uint32    terminal width, columns
      uint32    terminal height, rows
      uint32    terminal width, pixels
      uint32    terminal height, pixels
    */
    cols = readInt(payload, ++payload._pos, self, callback);
    if (cols === false)
      return false;
    rows = readInt(payload, payload._pos += 4, self, callback);
    if (rows === false)
      return false;
    width = readInt(payload, payload._pos += 4, self, callback);
    if (width === false)
      return false;
    height = readInt(payload, payload._pos += 4, self, callback);
    if (height === false)
      return false;
    info = {
      recipient: recipient,
      request: request,
      wantReply: false,
      cols: cols,
      rows: rows,
      width: width,
      height: height
    };
  } else if (request === 'x11-req') { // Client->Server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "x11-req"
      boolean   want reply
      boolean   single connection
      string    x11 authentication protocol
      string    x11 authentication cookie
      uint32    x11 screen number
    */
    wantReply = payload[payload._pos++];
    if (wantReply === undefined)
      return false;
    wantReply = (wantReply !== 0);
    var single = payload[payload._pos++];
    if (single === undefined)
      return false;
    single = (single !== 0);
    var protocol = readString(payload, payload._pos, 'ascii', self, callback);
    if (protocol === false)
      return false;
    var cookie = readString(payload, payload._pos, 'binary', self, callback);
    if (cookie === false)
      return false;
    var screen = readInt(payload, payload._pos, self, callback);
    if (screen === false)
      return false;
    info = {
      recipient: recipient,
      request: request,
      wantReply: wantReply,
      single: single,
      protocol: protocol,
      cookie: cookie,
      screen: screen
    };
  } else if (request === 'env') { // Client->Server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "env"
      boolean   want reply
      string    variable name
      string    variable value
    */
    wantReply = payload[payload._pos++];
    if (wantReply === undefined)
      return false;
    wantReply = (wantReply !== 0);
    var key = readString(payload, payload._pos, 'utf8', self, callback);
    if (key === false)
      return false;
    var val = readString(payload, payload._pos, 'utf8', self, callback);
    if (val === false)
      return false;
    info = {
      recipient: recipient,
      request: request,
      wantReply: wantReply,
      key: key,
      val: val
    };
  } else if (request === 'shell') { // Client->Server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "shell"
      boolean   want reply
    */
    wantReply = payload[payload._pos];
    if (wantReply === undefined)
      return false;
    wantReply = (wantReply !== 0);
    info = {
      recipient: recipient,
      request: request,
      wantReply: wantReply
    };
  } else if (request === 'exec') { // Client->Server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "exec"
      boolean   want reply
      string    command
    */
    wantReply = payload[payload._pos++];
    if (wantReply === undefined)
      return false;
    wantReply = (wantReply !== 0);
    var command = readString(payload, payload._pos, 'utf8', self, callback);
    if (command === false)
      return false;
    info = {
      recipient: recipient,
      request: request,
      wantReply: wantReply,
      command: command
    };
  } else if (request === 'subsystem') { // Client->Server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "subsystem"
      boolean   want reply
      string    subsystem name
    */
    wantReply = payload[payload._pos++];
    if (wantReply === undefined)
      return false;
    wantReply = (wantReply !== 0);
    var subsystem = readString(payload, payload._pos, 'utf8', self, callback);
    if (subsystem === false)
      return false;
    info = {
      recipient: recipient,
      request: request,
      wantReply: wantReply,
      subsystem: subsystem
    };
  } else if (request === 'signal') { // Client->Server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "signal"
      boolean   FALSE
      string    signal name (without the "SIG" prefix)
    */
    signal = readString(payload, ++payload._pos, 'ascii', self, callback);
    if (signal === false)
      return false;
    info = {
      recipient: recipient,
      request: request,
      wantReply: false,
      signal: 'SIG' + signal
    };
  } else if (request === 'xon-xoff') { // Client->Server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "xon-xoff"
      boolean   FALSE
      boolean   client can do
    */
    var clientControl = payload[++payload._pos];
    if (clientControl === undefined)
      return false;
    clientControl = (clientControl !== 0);
    info = {
      recipient: recipient,
      request: request,
      wantReply: false,
      clientControl: clientControl
    };
  } else if (request === 'auth-agent-req@openssh.com') { // Client->Server
    /*
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "auth-agent-req@openssh.com"
      boolean   want reply
    */
    wantReply = payload[payload._pos];
    if (wantReply === undefined)
      return false;
    wantReply = (wantReply !== 0);
    info = {
      recipient: recipient,
      request: request,
      wantReply: wantReply
    };
  } else {
    // Unknown request type
    wantReply = payload[payload._pos];
    if (wantReply === undefined)
      return false;
    wantReply = (wantReply !== 0);
    info = {
      recipient: recipient,
      request: request,
      wantReply: wantReply
    };
  }
  self.debug('DEBUG: Parser: IN_PACKETDATAAFTER, packet: CHANNEL_REQUEST ('
             + recipient
             + ', '
             + request
             + ')');
  self.emit('CHANNEL_REQUEST:' + recipient, info);
}

function hmacVerify(self, data) {
  var instate = self._state.incoming;
  var hmac = instate.hmac;

  self.debug('DEBUG: Parser: Verifying MAC');

  if (instate.decrypt.info.authLen > 0) {
    var decrypt = instate.decrypt;
    var instance = decrypt.instance;

    instance.setAuthTag(data);

    var payload = instance.update(instate.packet);
    instate.payload = payload.slice(1, instate.packet.length - payload[0]);
    iv_inc(decrypt.iv);

    decrypt.instance = crypto.createDecipheriv(
                         SSH_TO_OPENSSL[decrypt.type],
                         decrypt.key,
                         decrypt.iv
                       );
    decrypt.instance.setAutoPadding(false);
    return true;
  } else {
    var calcHmac = crypto.createHmac(SSH_TO_OPENSSL[hmac.type], hmac.key);

    writeUInt32BE(HMAC_COMPUTE, instate.seqno, 0);
    writeUInt32BE(HMAC_COMPUTE, instate.pktLen, 4);
    HMAC_COMPUTE[8] = instate.padLen;

    calcHmac.update(HMAC_COMPUTE);
    calcHmac.update(instate.packet);

    var mac = calcHmac.digest();
    if (mac.length > instate.hmac.info.actualLen)
      mac = mac.slice(0, instate.hmac.info.actualLen);
    return timingSafeEqual(mac, data);
  }
}

function decryptData(self, data) {
  var instance = self._state.incoming.decrypt.instance;
  self.debug('DEBUG: Parser: Decrypting');
  return instance.update(data);
}

function expectData(self, type, amount, buffer) {
  var expect = self._state.incoming.expect;
  expect.amount = amount;
  expect.type = type;
  expect.ptr = 0;
  if (buffer)
    expect.buf = buffer;
  else if (amount)
    expect.buf = Buffer.allocUnsafe(amount);
}

function readList(buffer, start, stream, callback) {
  var list = readString(buffer, start, 'ascii', stream, callback);
  return (list !== false ? (list.length ? list.split(',') : []) : false);
}

function bytesToModes(buffer) {
  var modes = {};

  for (var i = 0, len = buffer.length, opcode; i < len; i += 5) {
    opcode = buffer[i];
    if (opcode === TERMINAL_MODE.TTY_OP_END
        || TERMINAL_MODE[opcode] === undefined
        || i + 5 > len)
      break;
    modes[TERMINAL_MODE[opcode]] = readUInt32BE(buffer, i + 1);
  }

  return modes;
}

function modesToBytes(modes) {
  var RE_IS_NUM = /^\d+$/;
  var keys = Object.keys(modes);
  var b = 0;
  var bytes = [];

  for (var i = 0, len = keys.length, key, opcode, val; i < len; ++i) {
    key = keys[i];
    opcode = TERMINAL_MODE[key];
    if (opcode
        && !RE_IS_NUM.test(key)
        && typeof modes[key] === 'number'
        && key !== 'TTY_OP_END') {
      val = modes[key];
      bytes[b++] = opcode;
      bytes[b++] = (val >>> 24) & 0xFF;
      bytes[b++] = (val >>> 16) & 0xFF;
      bytes[b++] = (val >>> 8) & 0xFF;
      bytes[b++] = val & 0xFF;
    }
  }

  bytes[b] = TERMINAL_MODE.TTY_OP_END;

  return bytes;
}

// Shared outgoing functions
function KEXINIT(self, cb) { // Client/Server
  randBytes(16, function(myCookie) {
    /*
      byte         SSH_MSG_KEXINIT
      byte[16]     cookie (random bytes)
      name-list    kex_algorithms
      name-list    server_host_key_algorithms
      name-list    encryption_algorithms_client_to_server
      name-list    encryption_algorithms_server_to_client
      name-list    mac_algorithms_client_to_server
      name-list    mac_algorithms_server_to_client
      name-list    compression_algorithms_client_to_server
      name-list    compression_algorithms_server_to_client
      name-list    languages_client_to_server
      name-list    languages_server_to_client
      boolean      first_kex_packet_follows
      uint32       0 (reserved for future extension)
    */
    var algos = self.config.algorithms;

    var kexBuf = algos.kexBuf;
    if (self.remoteBugs & BUGS.BAD_DHGEX) {
      var copied = false;
      var kexList = algos.kex;
      for (var j = kexList.length - 1; j >= 0; --j) {
        if (kexList[j].indexOf('group-exchange') !== -1) {
          if (!copied) {
            kexList = kexList.slice();
            copied = true;
          }
          kexList.splice(j, 1);
        }
      }
      if (copied)
        kexBuf = Buffer.from(kexList.join(','));
    }

    var hostKeyBuf = algos.serverHostKeyBuf;

    var kexInitSize = 1 + 16
                      + 4 + kexBuf.length
                      + 4 + hostKeyBuf.length
                      + (2 * (4 + algos.cipherBuf.length))
                      + (2 * (4 + algos.hmacBuf.length))
                      + (2 * (4 + algos.compressBuf.length))
                      + (2 * (4 /* languages skipped */))
                      + 1 + 4;
    var buf = Buffer.allocUnsafe(kexInitSize);
    var p = 17;

    buf[0] = MESSAGE.KEXINIT;

    if (myCookie !== false)
      myCookie.copy(buf, 1);

    writeUInt32BE(buf, kexBuf.length, p);
    p += 4;
    kexBuf.copy(buf, p);
    p += kexBuf.length;

    writeUInt32BE(buf, hostKeyBuf.length, p);
    p += 4;
    hostKeyBuf.copy(buf, p);
    p += hostKeyBuf.length;

    writeUInt32BE(buf, algos.cipherBuf.length, p);
    p += 4;
    algos.cipherBuf.copy(buf, p);
    p += algos.cipherBuf.length;

    writeUInt32BE(buf, algos.cipherBuf.length, p);
    p += 4;
    algos.cipherBuf.copy(buf, p);
    p += algos.cipherBuf.length;

    writeUInt32BE(buf, algos.hmacBuf.length, p);
    p += 4;
    algos.hmacBuf.copy(buf, p);
    p += algos.hmacBuf.length;

    writeUInt32BE(buf, algos.hmacBuf.length, p);
    p += 4;
    algos.hmacBuf.copy(buf, p);
    p += algos.hmacBuf.length;

    writeUInt32BE(buf, algos.compressBuf.length, p);
    p += 4;
    algos.compressBuf.copy(buf, p);
    p += algos.compressBuf.length;

    writeUInt32BE(buf, algos.compressBuf.length, p);
    p += 4;
    algos.compressBuf.copy(buf, p);
    p += algos.compressBuf.length;

    // Skip language lists, first_kex_packet_follows, and reserved bytes
    buf.fill(0, buf.length - 13);

    self.debug('DEBUG: Outgoing: Writing KEXINIT');

    self._state.incoming.expectedPacket = 'KEXINIT';

    var outstate = self._state.outgoing;

    outstate.kexinit = buf;

    if (outstate.status === OUT_READY) {
      // We are the one starting the rekeying process ...
      outstate.status = OUT_REKEYING;
    }

    send(self, buf, cb, true);
  });
  return true;
}

function KEXDH_INIT(self) { // Client
  var state = self._state;
  var outstate = state.outgoing;
  var buf = Buffer.allocUnsafe(1 + 4 + outstate.pubkey.length);

  state.incoming.expectedPacket = state.kex.pktReply;
  if (state.kex.type === 'groupex') {
    buf[0] = MESSAGE.KEXDH_GEX_INIT;
    self.debug('DEBUG: Outgoing: Writing KEXDH_GEX_INIT');
  } else {
    buf[0] = MESSAGE.KEXDH_INIT;
    if (state.kex.type === 'group')
      self.debug('DEBUG: Outgoing: Writing KEXDH_INIT');
    else
      self.debug('DEBUG: Outgoing: Writing KEXECDH_INIT');
  }

  writeUInt32BE(buf, outstate.pubkey.length, 1);
  outstate.pubkey.copy(buf, 5);

  return send(self, buf, undefined, true);
}

function KEXDH_REPLY(self, e) { // Server
  var state = self._state;
  var outstate = state.outgoing;
  var instate = state.incoming;
  var curHostKey = self.config.hostKeys[state.hostkeyFormat];
  if (Array.isArray(curHostKey))
    curHostKey = curHostKey[0];
  var hostkey = curHostKey.getPublicSSH();
  var hostkeyAlgo = curHostKey.type;

  // e === client DH public key

  e = state.kex.convertPublicKey(e);

  var secret = state.kex.computeSecret(e);

  if (secret instanceof Error) {
    secret.message = 'Error while computing DH secret ('
                     + state.kex.type + '): '
                     + secret.message;
    secret.level = 'handshake';
    self.emit('error', secret);
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  var hash = crypto.createHash(state.kex.hash);

  var len_ident = Buffer.byteLength(instate.identRaw);
  var len_sident = Buffer.byteLength(self.config.ident);
  var len_init = instate.kexinit.length;
  var len_sinit = outstate.kexinit.length;
  var len_hostkey = hostkey.length;
  var len_pubkey = e.length;
  var len_spubkey = outstate.pubkey.length;
  var len_secret = secret.length;

  var exchangeBufLen = len_ident
                       + len_sident
                       + len_init
                       + len_sinit
                       + len_hostkey
                       + len_pubkey
                       + len_spubkey
                       + len_secret
                       + (4 * 8); // Length fields for above values

  // Group exchange-related
  var len_gex_prime;
  var len_gex_gen;
  var gex_prime;
  var gex_gen;
  var dhParams = state.kex.getDHParams();
  if (dhParams) {
    gex_prime = dhParams.prime;
    gex_gen = dhParams.generator;
    len_gex_prime = gex_prime.length;
    len_gex_gen = gex_gen.length;
    exchangeBufLen += (4 * 3); // min, n, max values
    exchangeBufLen += (4 * 2); // prime, generator length fields
    exchangeBufLen += len_gex_prime;
    exchangeBufLen += len_gex_gen;
  }

  var bp = 0;
  var exchangeBuf = Buffer.allocUnsafe(exchangeBufLen);

  writeUInt32BE(exchangeBuf, len_ident, bp);
  bp += 4;
  exchangeBuf.write(instate.identRaw, bp, 'utf8'); // V_C
  bp += len_ident;

  writeUInt32BE(exchangeBuf, len_sident, bp);
  bp += 4;
  exchangeBuf.write(self.config.ident, bp, 'utf8'); // V_S
  bp += len_sident;

  writeUInt32BE(exchangeBuf, len_init, bp);
  bp += 4;
  instate.kexinit.copy(exchangeBuf, bp); // I_C
  bp += len_init;
  instate.kexinit = undefined;

  writeUInt32BE(exchangeBuf, len_sinit, bp);
  bp += 4;
  outstate.kexinit.copy(exchangeBuf, bp); // I_S
  bp += len_sinit;
  outstate.kexinit = undefined;

  writeUInt32BE(exchangeBuf, len_hostkey, bp);
  bp += 4;
  hostkey.copy(exchangeBuf, bp); // K_S
  bp += len_hostkey;

  if (dhParams) {
    KEXDH_GEX_REQ_PACKET.slice(1).copy(exchangeBuf, bp); // min, n, max
    bp += (4 * 3); // Skip over bytes just copied

    writeUInt32BE(exchangeBuf, len_gex_prime, bp);
    bp += 4;
    gex_prime.copy(exchangeBuf, bp); // p
    bp += len_gex_prime;

    writeUInt32BE(exchangeBuf, len_gex_gen, bp);
    bp += 4;
    gex_gen.copy(exchangeBuf, bp); // g
    bp += len_gex_gen;
  }

  writeUInt32BE(exchangeBuf, len_pubkey, bp);
  bp += 4;
  e.copy(exchangeBuf, bp); // e
  bp += len_pubkey;

  writeUInt32BE(exchangeBuf, len_spubkey, bp);
  bp += 4;
  outstate.pubkey.copy(exchangeBuf, bp); // f
  bp += len_spubkey;

  writeUInt32BE(exchangeBuf, len_secret, bp);
  bp += 4;
  secret.copy(exchangeBuf, bp); // K

  outstate.exchangeHash = hash.update(exchangeBuf).digest(); // H

  if (outstate.sessionId === undefined)
    outstate.sessionId = outstate.exchangeHash;
  outstate.kexsecret = secret;

  var signature = curHostKey.sign(outstate.exchangeHash);
  if (signature instanceof Error) {
    signature.message = 'Error while signing data with host key ('
                        + hostkeyAlgo + '): '
                        + signature.message;
    signature.level = 'handshake';
    self.emit('error', signature);
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  signature = convertSignature(signature, hostkeyAlgo);
  if (signature === false) {
    signature.message = 'Error while converting handshake signature';
    signature.level = 'handshake';
    self.emit('error', signature);
    self.disconnect(DISCONNECT_REASON.KEY_EXCHANGE_FAILED);
    return false;
  }

  /*
    byte      SSH_MSG_KEXDH_REPLY
    string    server public host key and certificates (K_S)
    mpint     f
    string    signature of H
  */

  var siglen = 4 + hostkeyAlgo.length + 4 + signature.length;
  var buf = Buffer.allocUnsafe(1
                               + 4 + len_hostkey
                               + 4 + len_spubkey
                               + 4 + siglen);

  bp = 0;
  buf[bp] = MESSAGE[state.kex.pktReply];
  ++bp;

  writeUInt32BE(buf, len_hostkey, bp);
  bp += 4;
  hostkey.copy(buf, bp); // K_S
  bp += len_hostkey;

  writeUInt32BE(buf, len_spubkey, bp);
  bp += 4;
  outstate.pubkey.copy(buf, bp); // f
  bp += len_spubkey;

  writeUInt32BE(buf, siglen, bp);
  bp += 4;
  writeUInt32BE(buf, hostkeyAlgo.length, bp);
  bp += 4;
  buf.write(hostkeyAlgo, bp, hostkeyAlgo.length, 'ascii');
  bp += hostkeyAlgo.length;
  writeUInt32BE(buf, signature.length, bp);
  bp += 4;
  signature.copy(buf, bp);

  state.incoming.expectedPacket = 'NEWKEYS';

  self.debug('DEBUG: Outgoing: Writing ' + state.kex.pktReply);
  send(self, buf, undefined, true);

  outstate.sentNEWKEYS = true;
  self.debug('DEBUG: Outgoing: Writing NEWKEYS');
  return send(self, NEWKEYS_PACKET, undefined, true);
}

function KEXDH_GEX_REQ(self) { // Client
  self._state.incoming.expectedPacket = 'KEXDH_GEX_GROUP';

  self.debug('DEBUG: Outgoing: Writing KEXDH_GEX_REQUEST');
  return send(self, KEXDH_GEX_REQ_PACKET, undefined, true);
}

function compressPayload(self, payload, cb) {
  var compress = self._state.outgoing.compress.instance;
  compress.write(payload);
  compress.flush(Z_PARTIAL_FLUSH, compressFlushCb.bind(self, cb));
}

function compressFlushCb(cb) {
  if (this._readableState.ended || this._writableState.ended)
    return;
  send_(this, this._state.outgoing.compress.instance.read(), cb);

  var queue = this._state.outgoing.compress.queue;
  queue.shift();
  if (queue.length > 0)
    compressPayload(this, queue[0][0], queue[0][1]);
}

function send(self, payload, cb, bypass) {
  var state = self._state;

  if (!state)
    return false;

  var outstate = state.outgoing;
  if (outstate.status === OUT_REKEYING && !bypass) {
    if (typeof cb === 'function')
      outstate.rekeyQueue.push([payload, cb]);
    else
      outstate.rekeyQueue.push(payload);
    return false;
  } else if (self._readableState.ended || self._writableState.ended) {
    return false;
  }

  if (outstate.compress.instance) {
    // This queue nonsense only exists because of a change made in node v10.12.0
    // that changed flushing behavior, which now coalesces multiple writes to a
    // single flush, which does not work for us.
    var queue = outstate.compress.queue;
    queue.push([payload, cb]);
    if (queue.length === 1)
      compressPayload(self, queue[0][0], queue[0][1]);
    return true;
  } else {
    return send_(self, payload, cb);
  }
}

function send_(self, payload, cb) {
  // TODO: Implement length checks

  var state = self._state;
  var outstate = state.outgoing;
  var encrypt = outstate.encrypt;
  var hmac = outstate.hmac;
  var pktLen;
  var padLen;
  var buf;
  var mac;
  var ret;

  pktLen = payload.length + 9;

  if (encrypt.instance !== false) {
    if (encrypt.info.authLen > 0) {
      var ptlen = 1 + payload.length + 4/* Must have at least 4 bytes padding*/;
      while ((ptlen % encrypt.info.blockLen) !== 0)
        ++ptlen;
      padLen = ptlen - 1 - payload.length;
      pktLen = 4 + ptlen;
    } else {
      var blockLen = encrypt.info.blockLen;
      pktLen += ((blockLen - 1) * pktLen) % blockLen;
      padLen = pktLen - payload.length - 5;
    }
  } else {
    pktLen += (7 * pktLen) % 8;
    padLen = pktLen - payload.length - 5;
  }

  buf = Buffer.allocUnsafe(pktLen);

  writeUInt32BE(buf, pktLen - 4, 0);
  buf[4] = padLen;
  payload.copy(buf, 5);

  copyRandPadBytes(buf, 5 + payload.length, padLen);

  if (hmac.type !== false && hmac.key) {
    mac = crypto.createHmac(SSH_TO_OPENSSL[hmac.type], hmac.key);
    writeUInt32BE(outstate.bufSeqno, outstate.seqno, 0);
    mac.update(outstate.bufSeqno);
    mac.update(buf);
    mac = mac.digest();
    if (mac.length > hmac.info.actualLen)
      mac = mac.slice(0, hmac.info.actualLen);
  }

  var nb = 0;
  var encData;

  if (encrypt.instance !== false) {
    if (encrypt.info.authLen > 0) {
      var encrypter = crypto.createCipheriv(SSH_TO_OPENSSL[encrypt.type],
                                            encrypt.key,
                                            encrypt.iv);
      encrypter.setAutoPadding(false);

      var lenbuf = buf.slice(0, 4);

      encrypter.setAAD(lenbuf);
      self.push(lenbuf);
      nb += lenbuf;

      encData = encrypter.update(buf.slice(4));
      self.push(encData);
      nb += encData.length;

      var final = encrypter.final();
      if (final.length) {
        self.push(final);
        nb += final.length;
      }

      var authTag = encrypter.getAuthTag();
      ret = self.push(authTag);
      nb += authTag.length;

      iv_inc(encrypt.iv);
    } else {
      encData = encrypt.instance.update(buf);
      self.push(encData);
      nb += encData.length;

      ret = self.push(mac);
      nb += mac.length;
    }
  } else {
    ret = self.push(buf);
    nb = buf.length;
  }

  self.bytesSent += nb;

  if (++outstate.seqno > MAX_SEQNO)
    outstate.seqno = 0;

  cb && cb();

  return ret;
}

var copyRandPadBytes = (function() {
  if (typeof crypto.randomFillSync === 'function') {
    return crypto.randomFillSync;
  } else {
    return function copyRandPadBytes(buf, offset, count) {
      var padBytes = crypto.randomBytes(count);
      padBytes.copy(buf, offset);
    };
  }
})();

function randBytes(n, cb) {
  crypto.randomBytes(n, function retry(err, buf) {
    if (err)
      return crypto.randomBytes(n, retry);
    cb && cb(buf);
  });
}

function convertSignature(signature, keyType) {
  switch (keyType) {
    case 'ssh-dss':
      return DSASigBERToBare(signature);
    case 'ecdsa-sha2-nistp256':
    case 'ecdsa-sha2-nistp384':
    case 'ecdsa-sha2-nistp521':
      return ECDSASigASN1ToSSH(signature);
  }

  return signature;
}

var timingSafeEqual = (function() {
  if (typeof crypto.timingSafeEqual === 'function') {
    return function timingSafeEquals(a, b) {
      if (a.length !== b.length) {
        crypto.timingSafeEqual(a, a);
        return false;
      } else {
        return crypto.timingSafeEqual(a, b);
      }
    };
  } else {
    return function timingSafeEquals(a, b) {
      var val;
      if (a.length === b.length) {
        val = 0;
      } else {
        val = 1;
        b = a;
      }

      for (var i = 0, len = a.length; i < len; ++i)
        val |= (a[i] ^ b[i]);

      return (val === 0);
    }
  }
})();

function KeyExchange(algo, options) {
  switch (algo) {
    case 'curve25519-sha256':
    case 'curve25519-sha256@libssh.org':
      if (!CURVE25519_SUPPORTED)
        break;
      this.type = '25519';
      this.hash = 'sha256';
      this.pktInit = 'KEXECDH_INIT';
      this.pktReply = 'KEXECDH_REPLY';
      return;
    case 'ecdh-sha2-nistp256':
      this.type = 'ecdh';
      this.name = 'prime256v1';
      this.hash = 'sha256';
      this.pktInit = 'KEXECDH_INIT';
      this.pktReply = 'KEXECDH_REPLY';
      return;
    case 'ecdh-sha2-nistp384':
      this.type = 'ecdh';
      this.name = 'secp384r1';
      this.hash = 'sha384';
      this.pktInit = 'KEXECDH_INIT';
      this.pktReply = 'KEXECDH_REPLY';
      return;
    case 'ecdh-sha2-nistp521':
      this.type = 'ecdh';
      this.name = 'secp521r1';
      this.hash = 'sha512';
      this.pktInit = 'KEXECDH_INIT';
      this.pktReply = 'KEXECDH_REPLY';
      return;
    case 'diffie-hellman-group1-sha1':
      this.type = 'group';
      this.name = 'modp2';
      this.hash = 'sha1';
      this.pktInit = 'KEXDH_INIT';
      this.pktReply = 'KEXDH_REPLY';
      return;
    case 'diffie-hellman-group14-sha1':
      this.type = 'group';
      this.name = 'modp14';
      this.hash = 'sha1';
      this.pktInit = 'KEXDH_INIT';
      this.pktReply = 'KEXDH_REPLY';
      return;
    case 'diffie-hellman-group14-sha256':
      this.type = 'group';
      this.name = 'modp14';
      this.hash = 'sha256';
      this.pktInit = 'KEXDH_INIT';
      this.pktReply = 'KEXDH_REPLY';
      return;
    case 'diffie-hellman-group16-sha512':
      this.type = 'group';
      this.name = 'modp16';
      this.hash = 'sha512';
      this.pktInit = 'KEXDH_INIT';
      this.pktReply = 'KEXDH_REPLY';
      return;
    case 'diffie-hellman-group18-sha512':
      this.type = 'group';
      this.name = 'modp18';
      this.hash = 'sha512';
      this.pktInit = 'KEXDH_INIT';
      this.pktReply = 'KEXDH_REPLY';
      return;
    case 'diffie-hellman-group-exchange-sha1':
      this.type = 'groupex';
      this.hash = 'sha1';
      this.pktInit = 'KEXDH_GEX_REQ';
      this.pktReply = 'KEXDH_GEX_REPLY';
      this._prime = null;
      this._generator = null;
      return;
    case 'diffie-hellman-group-exchange-sha256':
      this.type = 'groupex';
      this.hash = 'sha256';
      this.pktInit = 'KEXDH_GEX_REQ';
      this.pktReply = 'KEXDH_GEX_REPLY';
      this._prime = null;
      this._generator = null;
      return;
  }
  throw new Error('Unsupported key exchange algorithm: ' + algo);
}
KeyExchange.prototype.setDHParams = function(prime, generator) {
  if (this.type === 'groupex') {
    if (!Buffer.isBuffer(prime))
      throw new Error('Invalid prime value');
    if (!Buffer.isBuffer(generator))
      throw new Error('Invalid generator value');
    this._prime = prime;
    this._generator = generator;
  }
};
KeyExchange.prototype.getDHParams = function() {
  if (this.type === 'groupex' && this._kex) {
    return {
      prime: convertToMpint(this._kex.getPrime()),
      generator: convertToMpint(this._kex.getGenerator()),
    };
  }
};
KeyExchange.prototype.generateKeys = function() {
  switch (this.type) {
    case '25519':
      if (!this._keys)
        this._keys = crypto.generateKeyPairSync('x25519');
      break;
    case 'ecdh':
      if (!this._kex) {
        this._kex = crypto.createECDH(this.name);
        this._public = this._kex.generateKeys();
      }
      break;
    case 'group':
    case 'groupex':
      if (!this._kex) {
        if (this.name)
          this._kex = crypto.createDiffieHellmanGroup(this.name);
        else if (this._prime && this._generator)
          this._kex = crypto.createDiffieHellman(this._prime, this._generator);
        if (this._kex)
          this._public = this._kex.generateKeys();
      }
      break;
  }
};
KeyExchange.prototype.getPublicKey = function() {
  this.generateKeys();

  var key;
  switch (this.type) {
    case '25519':
      key = this._keys.publicKey.export({ type: 'spki', format: 'der' });
      return key.slice(-32); // HACK: avoids parsing DER/BER header
    case 'ecdh':
    case 'group':
    case 'groupex':
      key = this._public;
      break;
  }
  if (key)
    return this.convertPublicKey(key);
};
KeyExchange.prototype.convertPublicKey = function(key) {
  var newKey;
  var idx = 0;
  var len = key.length;
  while (key[idx] === 0x00) {
    ++idx;
    --len;
  }
  switch (this.type) {
    case '25519':
      if (key.length === 32)
        return key;
      break;
    default:
      if (key[idx] & 0x80) {
        newKey = Buffer.allocUnsafe(1 + len);
        newKey[0] = 0;
        key.copy(newKey, 1, idx);
        return newKey;
      }
  }
  if (len !== key.length) {
    newKey = Buffer.allocUnsafe(len);
    key.copy(newKey, 0, idx);
    key = newKey;
  }
  return key;
};
KeyExchange.prototype.computeSecret = function(otherPublicKey) {
  this.generateKeys();

  switch (this.type) {
    case '25519':
      try {
        var asnWriter = new Ber.Writer();
        asnWriter.startSequence();
          // algorithm
          asnWriter.startSequence();
            asnWriter.writeOID('1.3.101.110'); // id-X25519
          asnWriter.endSequence();

          // PublicKey
          asnWriter.startSequence(Ber.BitString);
            asnWriter.writeByte(0x00);
            // XXX: hack to write a raw buffer without a tag -- yuck
            asnWriter._ensure(otherPublicKey.length);
            otherPublicKey.copy(asnWriter._buf,
                                asnWriter._offset,
                                0,
                                otherPublicKey.length);
            asnWriter._offset += otherPublicKey.length;
          asnWriter.endSequence();
        asnWriter.endSequence();

        return convertToMpint(crypto.diffieHellman({
          privateKey: this._keys.privateKey,
          publicKey: crypto.createPublicKey({
            key: asnWriter.buffer,
            type: 'spki',
            format: 'der',
          }),
        }));
      } catch (ex) {
        return ex;
      }
      break;
    case 'ecdh':
    case 'group':
    case 'groupex':
      try {
        return convertToMpint(this._kex.computeSecret(otherPublicKey));
      } catch (ex) {
        return ex;
      }
  }
};

function convertToMpint(buf) {
  var idx = 0;
  var length = buf.length;
  while (buf[idx] === 0x00) {
    ++idx;
    --length;
  }
  var newBuf;
  if (buf[idx] & 0x80) {
    newBuf = Buffer.allocUnsafe(1 + length);
    newBuf[0] = 0;
    buf.copy(newBuf, 1, idx);
    buf = newBuf;
  } else if (length !== buf.length) {
    newBuf = Buffer.allocUnsafe(length);
    buf.copy(newBuf, 0, idx);
    buf = newBuf;
  }
  return buf;
}

module.exports = SSH2Stream;
module.exports._send = send;


/***/ }),

/***/ 4928:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Ber = __nccwpck_require__(970).Ber;

var readUInt32BE = __nccwpck_require__(9419).readUInt32BE;
var writeUInt32BE = __nccwpck_require__(9419).writeUInt32BE;

// XXX the value of 2400 from dropbear is only for certain strings, not all
// strings. for example the list strings used during handshakes
var MAX_STRING_LEN = Infinity;//2400; // taken from dropbear

module.exports = {
  iv_inc: iv_inc,
  readInt: readInt,
  readString: readString,
  parseKey: __nccwpck_require__(8820).parseKey,
  sigSSHToASN1: sigSSHToASN1,
  DSASigBERToBare: DSASigBERToBare,
  ECDSASigASN1ToSSH: ECDSASigASN1ToSSH
};

function iv_inc(iv) {
  var n = 12;
  var c = 0;
  do {
    --n;
    c = iv[n];
    if (c === 255)
      iv[n] = 0;
    else {
      iv[n] = ++c;
      return;
    }
  } while (n > 4);
}

function readInt(buffer, start, stream, cb) {
  var bufferLen = buffer.length;
  if (start < 0 || start >= bufferLen || (bufferLen - start) < 4) {
    stream && stream._cleanup(cb);
    return false;
  }

  return readUInt32BE(buffer, start);
}

function DSASigBERToBare(signature) {
  if (signature.length <= 40)
    return signature;
  // This is a quick and dirty way to get from BER encoded r and s that
  // OpenSSL gives us, to just the bare values back to back (40 bytes
  // total) like OpenSSH (and possibly others) are expecting
  var asnReader = new Ber.Reader(signature);
  asnReader.readSequence();
  var r = asnReader.readString(Ber.Integer, true);
  var s = asnReader.readString(Ber.Integer, true);
  var rOffset = 0;
  var sOffset = 0;
  if (r.length < 20) {
    var rNew = Buffer.allocUnsafe(20);
    r.copy(rNew, 1);
    r = rNew;
    r[0] = 0;
  }
  if (s.length < 20) {
    var sNew = Buffer.allocUnsafe(20);
    s.copy(sNew, 1);
    s = sNew;
    s[0] = 0;
  }
  if (r.length > 20 && r[0] === 0x00)
    rOffset = 1;
  if (s.length > 20 && s[0] === 0x00)
    sOffset = 1;
  var newSig = Buffer.allocUnsafe((r.length - rOffset) + (s.length - sOffset));
  r.copy(newSig, 0, rOffset);
  s.copy(newSig, r.length - rOffset, sOffset);
  return newSig;
}

function ECDSASigASN1ToSSH(signature) {
  if (signature[0] === 0x00)
    return signature;
  // Convert SSH signature parameters to ASN.1 BER values for OpenSSL
  var asnReader = new Ber.Reader(signature);
  asnReader.readSequence();
  var r = asnReader.readString(Ber.Integer, true);
  var s = asnReader.readString(Ber.Integer, true);
  if (r === null || s === null)
    return false;
  var newSig = Buffer.allocUnsafe(4 + r.length + 4 + s.length);
  writeUInt32BE(newSig, r.length, 0);
  r.copy(newSig, 4);
  writeUInt32BE(newSig, s.length, 4 + r.length);
  s.copy(newSig, 4 + 4 + r.length);
  return newSig;
}

function sigSSHToASN1(sig, type, self, callback) {
  var asnWriter;
  switch (type) {
    case 'ssh-dss':
      if (sig.length > 40)
        return sig;
      // Change bare signature r and s values to ASN.1 BER values for OpenSSL
      asnWriter = new Ber.Writer();
      asnWriter.startSequence();
      var r = sig.slice(0, 20);
      var s = sig.slice(20);
      if (r[0] & 0x80) {
        var rNew = Buffer.allocUnsafe(21);
        rNew[0] = 0x00;
        r.copy(rNew, 1);
        r = rNew;
      } else if (r[0] === 0x00 && !(r[1] & 0x80)) {
        r = r.slice(1);
      }
      if (s[0] & 0x80) {
        var sNew = Buffer.allocUnsafe(21);
        sNew[0] = 0x00;
        s.copy(sNew, 1);
        s = sNew;
      } else if (s[0] === 0x00 && !(s[1] & 0x80)) {
        s = s.slice(1);
      }
      asnWriter.writeBuffer(r, Ber.Integer);
      asnWriter.writeBuffer(s, Ber.Integer);
      asnWriter.endSequence();
      return asnWriter.buffer;
    case 'ecdsa-sha2-nistp256':
    case 'ecdsa-sha2-nistp384':
    case 'ecdsa-sha2-nistp521':
      var r = readString(sig, 0, self, callback);
      if (r === false)
        return false;
      var s = readString(sig, sig._pos, self, callback);
      if (s === false)
        return false;

      asnWriter = new Ber.Writer();
      asnWriter.startSequence();
      asnWriter.writeBuffer(r, Ber.Integer);
      asnWriter.writeBuffer(s, Ber.Integer);
      asnWriter.endSequence();
      return asnWriter.buffer;
    default:
      return sig;
  }
}

function readString(buffer, start, encoding, stream, cb, maxLen) {
  if (encoding && !Buffer.isBuffer(encoding) && typeof encoding !== 'string') {
    if (typeof cb === 'number')
      maxLen = cb;
    cb = stream;
    stream = encoding;
    encoding = undefined;
  }

  start || (start = 0);
  var bufferLen = buffer.length;
  var left = (bufferLen - start);
  var len;
  var end;
  if (start < 0 || start >= bufferLen || left < 4) {
    stream && stream._cleanup(cb);
    return false;
  }

  len = readUInt32BE(buffer, start);
  if (len > (maxLen || MAX_STRING_LEN) || left < (4 + len)) {
    stream && stream._cleanup(cb);
    return false;
  }

  start += 4;
  end = start + len;
  buffer._pos = end;

  if (encoding) {
    if (Buffer.isBuffer(encoding)) {
      buffer.copy(encoding, 0, start, end);
      return encoding;
    } else {
      return buffer.toString(encoding, start, end);
    }
  } else {
    return buffer.slice(start, end);
  }
}



/***/ }),

/***/ 3204:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var inherits = __nccwpck_require__(1669).inherits;
var DuplexStream = __nccwpck_require__(2413).Duplex;
var ReadableStream = __nccwpck_require__(2413).Readable;
var WritableStream = __nccwpck_require__(2413).Writable;

var STDERR = __nccwpck_require__(792).constants.CHANNEL_EXTENDED_DATATYPE.STDERR;

var PACKET_SIZE = 32 * 1024;
var MAX_WINDOW = 2 * 1024 * 1024;
var WINDOW_THRESHOLD = MAX_WINDOW / 2;
var CUSTOM_EVENTS = [
  'CHANNEL_EOF',
  'CHANNEL_CLOSE',
  'CHANNEL_DATA',
  'CHANNEL_EXTENDED_DATA',
  'CHANNEL_WINDOW_ADJUST',
  'CHANNEL_SUCCESS',
  'CHANNEL_FAILURE',
  'CHANNEL_REQUEST'
];
var CUSTOM_EVENTS_LEN = CUSTOM_EVENTS.length;

function Channel(info, client, opts) {
  var streamOpts = {
    highWaterMark: MAX_WINDOW,
    allowHalfOpen: (!opts || (opts && opts.allowHalfOpen !== false))
  };

  this.allowHalfOpen = streamOpts.allowHalfOpen;

  DuplexStream.call(this, streamOpts);

  var self = this;
  var server = opts && opts.server;

  this.server = server;
  this.type = info.type;
  this.subtype = undefined;
  /*
    incoming and outgoing contain these properties:
    {
      id: undefined,
      window: undefined,
      packetSize: undefined,
      state: 'closed'
    }
  */
  var incoming = this.incoming = info.incoming;
  var incomingId = incoming.id;
  var outgoing = this.outgoing = info.outgoing;
  var callbacks = this._callbacks = [];
  var exitCode;
  var exitSignal;
  var exitDump;
  var exitDesc;
  var exitLang;

  this._client = client;
  this._hasX11 = false;

  var channels = client._channels;
  var sshstream = client._sshstream;

  function ondrain() {
    if (self._waitClientDrain) {
      self._waitClientDrain = false;
      if (!self._waitWindow) {
        if (self._chunk)
          self._write(self._chunk, null, self._chunkcb);
        else if (self._chunkcb)
          self._chunkcb();
        else if (self._chunkErr)
          self.stderr._write(self._chunkErr, null, self._chunkcbErr);
        else if (self._chunkcbErr)
          self._chunkcbErr();
      }
    }
  }
  client._sock.on('drain', ondrain);

  sshstream.once('CHANNEL_EOF:' + incomingId, function() {
    if (incoming.state !== 'open')
      return;
    incoming.state = 'eof';

    if (self.readable)
      self.push(null);
    if (!server && self.stderr.readable)
      self.stderr.push(null);
  }).once('CHANNEL_CLOSE:' + incomingId, function() {
    if (incoming.state === 'closed')
      return;
    incoming.state = 'closed';

    if (self.readable)
      self.push(null);
    if (server && self.stderr.writable)
      self.stderr.end();
    else if (!server && self.stderr.readable)
      self.stderr.push(null);

    if (outgoing.state === 'open' || outgoing.state === 'eof')
      self.close();
    if (outgoing.state === 'closing')
      outgoing.state = 'closed';

    delete channels[incomingId];

    var state = self._writableState;
    client._sock.removeListener('drain', ondrain);
    if (!state.ending && !state.finished)
      self.end();

    // Take care of any outstanding channel requests
    self._callbacks = [];
    for (var i = 0; i < callbacks.length; ++i)
      callbacks[i](true);
    callbacks = self._callbacks;

    if (!server) {
      // align more with node child processes, where the close event gets the
      // same arguments as the exit event
      if (!self.readable) {
        if (exitCode === null) {
          self.emit('close', exitCode, exitSignal, exitDump, exitDesc,
                    exitLang);
        } else
          self.emit('close', exitCode);
      } else {
        self.once('end', function() {
          if (exitCode === null) {
            self.emit('close', exitCode, exitSignal, exitDump, exitDesc,
                      exitLang);
          } else
            self.emit('close', exitCode);
        });
      }

      if (!self.stderr.readable)
        self.stderr.emit('close');
      else {
        self.stderr.once('end', function() {
          self.stderr.emit('close');
        });
      }
    } else { // Server mode
      if (!self.readable)
        self.emit('close');
      else {
        self.once('end', function() {
          self.emit('close');
        });
      }
    }

    for (var i = 0; i < CUSTOM_EVENTS_LEN; ++i)
      sshstream.removeAllListeners(CUSTOM_EVENTS[i] + ':' + incomingId);
  }).on('CHANNEL_DATA:' + incomingId, function(data) {
    // the remote party should not be sending us data if there is no window
    // space available ...
    // TODO: raise error on data with not enough window
    if (incoming.window === 0)
      return;

    incoming.window -= data.length;

    if (!self.push(data)) {
      self._waitChanDrain = true;
      return;
    }

    if (incoming.window <= WINDOW_THRESHOLD)
      windowAdjust(self);
  }).on('CHANNEL_WINDOW_ADJUST:' + incomingId, function(amt) {
    // the server is allowing us to send `amt` more bytes of data
    outgoing.window += amt;

    if (self._waitWindow) {
      self._waitWindow = false;
      if (!self._waitClientDrain) {
        if (self._chunk)
          self._write(self._chunk, null, self._chunkcb);
        else if (self._chunkcb)
          self._chunkcb();
        else if (self._chunkErr)
          self.stderr._write(self._chunkErr, null, self._chunkcbErr);
        else if (self._chunkcbErr)
          self._chunkcbErr();
      }
    }
  }).on('CHANNEL_SUCCESS:' + incomingId, function() {
    if (server) {
      sshstream._kalast = Date.now();
      sshstream._kacnt = 0;
    } else
      client._resetKA();
    if (callbacks.length)
      callbacks.shift()(false);
  }).on('CHANNEL_FAILURE:' + incomingId, function() {
    if (server) {
      sshstream._kalast = Date.now();
      sshstream._kacnt = 0;
    } else
      client._resetKA();
    if (callbacks.length)
      callbacks.shift()(true);
  }).on('CHANNEL_REQUEST:' + incomingId, function(info) {
    if (!server) {
      if (info.request === 'exit-status') {
        self.emit('exit', exitCode = info.code);
        return;
      } else if (info.request === 'exit-signal') {
        self.emit('exit',
                  exitCode = null,
                  exitSignal = 'SIG' + info.signal,
                  exitDump = info.coredump,
                  exitDesc = info.description,
                  exitLang = info.lang);
        return;
      }
    }

    // keepalive request? OpenSSH will send one as a channel request if there
    // is a channel open

    if (info.wantReply)
      sshstream.channelFailure(outgoing.id);
  });

  this.stdin = this.stdout = this;

  if (server)
    this.stderr = new ServerStderr(this);
  else {
    this.stderr = new ReadableStream(streamOpts);
    this.stderr._read = function(n) {
      if (self._waitChanDrain) {
        self._waitChanDrain = false;
        if (incoming.window <= WINDOW_THRESHOLD)
          windowAdjust(self);
      }
    };

    sshstream.on('CHANNEL_EXTENDED_DATA:' + incomingId,
      function(type, data) {
        // the remote party should not be sending us data if there is no window
        // space available ...
        // TODO: raise error on data with not enough window
        if (incoming.window === 0)
          return;

        incoming.window -= data.length;

        if (!self.stderr.push(data)) {
          self._waitChanDrain = true;
          return;
        }

        if (incoming.window <= WINDOW_THRESHOLD)
          windowAdjust(self);
      }
    );
  }

  // outgoing data
  this._waitClientDrain = false; // Client stream-level backpressure
  this._waitWindow = false; // SSH-level backpressure

  // incoming data
  this._waitChanDrain = false; // Channel Readable side backpressure

  this._chunk = undefined;
  this._chunkcb = undefined;
  this._chunkErr = undefined;
  this._chunkcbErr = undefined;

  function onFinish() {
    self.eof();
    if (server || (!server && !self.allowHalfOpen))
      self.close();
    self.writable = false;
  }
  this.on('finish', onFinish)
      .on('prefinish', onFinish); // for node v0.11+
  function onEnd() {
    self.readable = false;
  }
  this.on('end', onEnd)
      .on('close', onEnd);
}
inherits(Channel, DuplexStream);

Channel.prototype.eof = function() {
  var ret = true;
  var outgoing = this.outgoing;

  if (outgoing.state === 'open') {
    outgoing.state = 'eof';
    ret = this._client._sshstream.channelEOF(outgoing.id);
  }

  return ret;
};

Channel.prototype.close = function() {
  var ret = true;
  var outgoing = this.outgoing;

  if (outgoing.state === 'open' || outgoing.state === 'eof') {
    outgoing.state = 'closing';
    ret = this._client._sshstream.channelClose(outgoing.id);
  }

  return ret;
};

Channel.prototype._read = function(n) {
  if (this._waitChanDrain) {
    this._waitChanDrain = false;
    if (this.incoming.window <= WINDOW_THRESHOLD)
      windowAdjust(this);
  }
};

Channel.prototype._write = function(data, encoding, cb) {
  var sshstream = this._client._sshstream;
  var outgoing = this.outgoing;
  var packetSize = outgoing.packetSize;
  var id = outgoing.id;
  var window = outgoing.window;
  var len = data.length;
  var p = 0;
  var ret;
  var buf;
  var sliceLen;

  if (outgoing.state !== 'open')
    return;

  while (len - p > 0 && window > 0) {
    sliceLen = len - p;
    if (sliceLen > window)
      sliceLen = window;
    if (sliceLen > packetSize)
      sliceLen = packetSize;

    ret = sshstream.channelData(id, data.slice(p, p + sliceLen));

    p += sliceLen;
    window -= sliceLen;

    if (!ret) {
      this._waitClientDrain = true;
      this._chunk = undefined;
      this._chunkcb = cb;
      break;
    }
  }

  outgoing.window = window;

  if (len - p > 0) {
    if (window === 0)
      this._waitWindow = true;
    if (p > 0) {
      // partial
      buf = Buffer.allocUnsafe(len - p);
      data.copy(buf, 0, p);
      this._chunk = buf;
    } else
      this._chunk = data;
    this._chunkcb = cb;
    return;
  }

  if (!this._waitClientDrain)
    cb();
};

Channel.prototype.destroy = function() {
  this.end();
};

// session type-specific methods
Channel.prototype.setWindow = function(rows, cols, height, width) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  if (this.type === 'session'
      && (this.subtype === 'shell' || this.subtype === 'exec')
      && this.writable
      && this.outgoing.state === 'open') {
    return this._client._sshstream.windowChange(this.outgoing.id,
                                                rows,
                                                cols,
                                                height,
                                                width);
  }

  return true;
};
Channel.prototype.signal = function(signalName) {
  if (this.server)
    throw new Error('Client-only method called in server mode');

  if (this.type === 'session'
      && this.writable
      && this.outgoing.state === 'open')
    return this._client._sshstream.signal(this.outgoing.id, signalName);

  return true;
};
Channel.prototype.exit = function(name, coreDumped, msg) {
  if (!this.server)
    throw new Error('Server-only method called in client mode');

  if (this.type === 'session'
      && this.writable
      && this.outgoing.state === 'open') {
    if (typeof name === 'number')
      return this._client._sshstream.exitStatus(this.outgoing.id, name);
    else {
      return this._client._sshstream.exitSignal(this.outgoing.id,
                                                name,
                                                coreDumped,
                                                msg);
    }
  }

  return true;
};

Channel.MAX_WINDOW = MAX_WINDOW;
Channel.PACKET_SIZE = PACKET_SIZE;

function windowAdjust(self) {
  if (self.outgoing.state === 'closed')
    return true;
  var amt = MAX_WINDOW - self.incoming.window;
  if (amt <= 0)
    return true;
  self.incoming.window += amt;
  return self._client._sshstream.channelWindowAdjust(self.outgoing.id, amt);
}

function ServerStderr(channel) {
  WritableStream.call(this, { highWaterMark: MAX_WINDOW });
  this._channel = channel;
}
inherits(ServerStderr, WritableStream);

ServerStderr.prototype._write = function(data, encoding, cb) {
  var channel = this._channel;
  var sshstream = channel._client._sshstream;
  var outgoing = channel.outgoing;
  var packetSize = outgoing.packetSize;
  var id = outgoing.id;
  var window = outgoing.window;
  var len = data.length;
  var p = 0;
  var ret;
  var buf;
  var sliceLen;

  if (channel.outgoing.state !== 'open')
    return;

  while (len - p > 0 && window > 0) {
    sliceLen = len - p;
    if (sliceLen > window)
      sliceLen = window;
    if (sliceLen > packetSize)
      sliceLen = packetSize;

    ret = sshstream.channelExtData(id, data.slice(p, p + sliceLen), STDERR);

    p += sliceLen;
    window -= sliceLen;

    if (!ret) {
      channel._waitClientDrain = true;
      channel._chunkErr = undefined;
      channel._chunkcbErr = cb;
      break;
    }
  }

  outgoing.window = window;

  if (len - p > 0) {
    if (window === 0)
      channel._waitWindow = true;
    if (p > 0) {
      // partial
      buf = Buffer.allocUnsafe(len - p);
      data.copy(buf, 0, p);
      channel._chunkErr = buf;
    } else
      channel._chunkErr = data;
    channel._chunkcbErr = cb;
    return;
  }

  if (!channel._waitClientDrain)
    cb();
};

module.exports = Channel;


/***/ }),

/***/ 1130:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// This wrapper class is used to retain backwards compatibility with
// pre-v0.4 ssh2. If it weren't for `read()` and `write()` being used by the
// streams2/3 API, we could just pass the SFTPStream directly to the end user...

var inherits = __nccwpck_require__(1669).inherits;
var EventEmitter = __nccwpck_require__(8614).EventEmitter;

function SFTPWrapper(stream) {
  var self = this;

  EventEmitter.call(this);

  this._stream = stream;

  stream.on('error', function(err) {
    self.emit('error', err);
  }).on('end', function() {
    self.emit('end');
  }).on('close', function() {
    self.emit('close');
  }).on('continue', function() {
    self.emit('continue');
  });
}
inherits(SFTPWrapper, EventEmitter);

// stream-related methods to pass on
SFTPWrapper.prototype.end = function() {
  return this._stream.end();
};
// SFTPStream client methods
SFTPWrapper.prototype.createReadStream = function(path, options) {
  return this._stream.createReadStream(path, options);
};
SFTPWrapper.prototype.createWriteStream = function(path, options) {
  return this._stream.createWriteStream(path, options);
};
SFTPWrapper.prototype.open = function(path, flags, attrs, cb) {
  return this._stream.open(path, flags, attrs, cb);
};
SFTPWrapper.prototype.close = function(handle, cb) {
  return this._stream.close(handle, cb);
};
SFTPWrapper.prototype.read = function(handle, buf, off, len, position, cb) {
  return this._stream.readData(handle, buf, off, len, position, cb);
};
SFTPWrapper.prototype.write = function(handle, buf, off, len, position, cb) {
  return this._stream.writeData(handle, buf, off, len, position, cb);
};
SFTPWrapper.prototype.fastGet = function(remotePath, localPath, opts, cb) {
  return this._stream.fastGet(remotePath, localPath, opts, cb);
};
SFTPWrapper.prototype.fastPut = function(localPath, remotePath, opts, cb) {
  return this._stream.fastPut(localPath, remotePath, opts, cb);
};
SFTPWrapper.prototype.readFile = function(path, options, callback_) {
  return this._stream.readFile(path, options, callback_);
};
SFTPWrapper.prototype.writeFile = function(path, data, options, callback_) {
  return this._stream.writeFile(path, data, options, callback_);
};
SFTPWrapper.prototype.appendFile = function(path, data, options, callback_) {
  return this._stream.appendFile(path, data, options, callback_);
};
SFTPWrapper.prototype.exists = function(path, cb) {
  return this._stream.exists(path, cb);
};
SFTPWrapper.prototype.unlink = function(filename, cb) {
  return this._stream.unlink(filename, cb);
};
SFTPWrapper.prototype.rename = function(oldPath, newPath, cb) {
  return this._stream.rename(oldPath, newPath, cb);
};
SFTPWrapper.prototype.mkdir = function(path, attrs, cb) {
  return this._stream.mkdir(path, attrs, cb);
};
SFTPWrapper.prototype.rmdir = function(path, cb) {
  return this._stream.rmdir(path, cb);
};
SFTPWrapper.prototype.readdir = function(where, opts, cb) {
  return this._stream.readdir(where, opts, cb);
};
SFTPWrapper.prototype.fstat = function(handle, cb) {
  return this._stream.fstat(handle, cb);
};
SFTPWrapper.prototype.stat = function(path, cb) {
  return this._stream.stat(path, cb);
};
SFTPWrapper.prototype.lstat = function(path, cb) {
  return this._stream.lstat(path, cb);
};
SFTPWrapper.prototype.opendir = function(path, cb) {
  return this._stream.opendir(path, cb);
};
SFTPWrapper.prototype.setstat = function(path, attrs, cb) {
  return this._stream.setstat(path, attrs, cb);
};
SFTPWrapper.prototype.fsetstat = function(handle, attrs, cb) {
  return this._stream.fsetstat(handle, attrs, cb);
};
SFTPWrapper.prototype.futimes = function(handle, atime, mtime, cb) {
  return this._stream.futimes(handle, atime, mtime, cb);
};
SFTPWrapper.prototype.utimes = function(path, atime, mtime, cb) {
  return this._stream.utimes(path, atime, mtime, cb);
};
SFTPWrapper.prototype.fchown = function(handle, uid, gid, cb) {
  return this._stream.fchown(handle, uid, gid, cb);
};
SFTPWrapper.prototype.chown = function(path, uid, gid, cb) {
  return this._stream.chown(path, uid, gid, cb);
};
SFTPWrapper.prototype.fchmod = function(handle, mode, cb) {
  return this._stream.fchmod(handle, mode, cb);
};
SFTPWrapper.prototype.chmod = function(path, mode, cb) {
  return this._stream.chmod(path, mode, cb);
};
SFTPWrapper.prototype.readlink = function(path, cb) {
  return this._stream.readlink(path, cb);
};
SFTPWrapper.prototype.symlink = function(targetPath, linkPath, cb) {
  return this._stream.symlink(targetPath, linkPath, cb);
};
SFTPWrapper.prototype.realpath = function(path, cb) {
  return this._stream.realpath(path, cb);
};
// extended requests
SFTPWrapper.prototype.ext_openssh_rename = function(oldPath, newPath, cb) {
  return this._stream.ext_openssh_rename(oldPath, newPath, cb);
};
SFTPWrapper.prototype.ext_openssh_statvfs = function(path, cb) {
  return this._stream.ext_openssh_statvfs(path, cb);
};
SFTPWrapper.prototype.ext_openssh_fstatvfs = function(handle, cb) {
  return this._stream.ext_openssh_fstatvfs(handle, cb);
};
SFTPWrapper.prototype.ext_openssh_hardlink = function(oldPath, newPath, cb) {
  return this._stream.ext_openssh_hardlink(oldPath, newPath, cb);
};
SFTPWrapper.prototype.ext_openssh_fsync = function(handle, cb) {
  return this._stream.ext_openssh_fsync(handle, cb);
};

module.exports = SFTPWrapper;


/***/ }),

/***/ 9054:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Socket = __nccwpck_require__(1631).Socket;
var EventEmitter = __nccwpck_require__(8614).EventEmitter;
var inherits = __nccwpck_require__(1669).inherits;
var path = __nccwpck_require__(5622);
var fs = __nccwpck_require__(5747);
var cp = __nccwpck_require__(3129);

var readUInt32BE = __nccwpck_require__(1999).readUInt32BE;
var writeUInt32BE = __nccwpck_require__(1999).writeUInt32BE;
var writeUInt32LE = __nccwpck_require__(1999).writeUInt32LE;

var REQUEST_IDENTITIES = 11;
var IDENTITIES_ANSWER = 12;
var SIGN_REQUEST = 13;
var SIGN_RESPONSE = 14;
var FAILURE = 5;

var RE_CYGWIN_SOCK = /^\!<socket >(\d+) s ([A-Z0-9]{8}\-[A-Z0-9]{8}\-[A-Z0-9]{8}\-[A-Z0-9]{8})/;

// Format of `//./pipe/ANYTHING`, with forward slashes and backward slashes being interchangeable
var WINDOWS_PIPE_REGEX = /^[/\\][/\\]\.[/\\]pipe[/\\].+/;

module.exports = function(sockPath, key, keyType, data, cb) {
  var sock;
  var error;
  var sig;
  var datalen;
  var keylen = 0;
  var isSigning = Buffer.isBuffer(key);
  var type;
  var count = 0;
  var siglen = 0;
  var nkeys = 0;
  var keys;
  var comlen = 0;
  var comment = false;
  var accept;
  var reject;

  if (typeof key === 'function' && typeof keyType === 'function') {
    // agent forwarding
    accept = key;
    reject = keyType;
  } else if (isSigning) {
    keylen = key.length;
    datalen = data.length;
  } else {
    cb = key;
    key = undefined;
  }

  function onconnect() {
    var buf;
    if (isSigning) {
      /*
        byte        SSH2_AGENTC_SIGN_REQUEST
        string      key_blob
        string      data
        uint32      flags
      */
      var p = 9;
      buf = Buffer.allocUnsafe(4 + 1 + 4 + keylen + 4 + datalen + 4);
      writeUInt32BE(buf, buf.length - 4, 0);
      buf[4] = SIGN_REQUEST;
      writeUInt32BE(buf, keylen, 5);
      key.copy(buf, p);
      writeUInt32BE(buf, datalen, p += keylen);
      data.copy(buf, p += 4);
      writeUInt32BE(buf, 0, p += datalen);
      sock.write(buf);
    } else {
      /*
        byte        SSH2_AGENTC_REQUEST_IDENTITIES
      */
      sock.write(Buffer.from([0, 0, 0, 1, REQUEST_IDENTITIES]));
    }
  }
  function ondata(chunk) {
    for (var i = 0, len = chunk.length; i < len; ++i) {
      if (type === undefined) {
        // skip over packet length
        if (++count === 5) {
          type = chunk[i];
          count = 0;
        }
      } else if (type === SIGN_RESPONSE) {
        /*
          byte        SSH2_AGENT_SIGN_RESPONSE
          string      signature_blob
        */
        if (!sig) {
          siglen <<= 8;
          siglen += chunk[i];
          if (++count === 4) {
            sig = Buffer.allocUnsafe(siglen);
            count = 0;
          }
        } else {
          sig[count] = chunk[i];
          if (++count === siglen) {
            sock.removeAllListeners('data');
            return sock.destroy();
          }
        }
      } else if (type === IDENTITIES_ANSWER) {
        /*
          byte        SSH2_AGENT_IDENTITIES_ANSWER
          uint32      num_keys

        Followed by zero or more consecutive keys, encoded as:

          string      public key blob
          string      public key comment
        */
        if (keys === undefined) {
          nkeys <<= 8;
          nkeys += chunk[i];
          if (++count === 4) {
            keys = new Array(nkeys);
            count = 0;
            if (nkeys === 0) {
              sock.removeAllListeners('data');
              return sock.destroy();
            }
          }
        } else {
          if (!key) {
            keylen <<= 8;
            keylen += chunk[i];
            if (++count === 4) {
              key = Buffer.allocUnsafe(keylen);
              count = 0;
            }
          } else if (comment === false) {
            key[count] = chunk[i];
            if (++count === keylen) {
              keys[nkeys - 1] = key;
              keylen = 0;
              count = 0;
              comment = true;
              if (--nkeys === 0) {
                key = undefined;
                sock.removeAllListeners('data');
                return sock.destroy();
              }
            }
          } else if (comment === true) {
            comlen <<= 8;
            comlen += chunk[i];
            if (++count === 4) {
              count = 0;
              if (comlen > 0)
                comment = comlen;
              else {
                key = undefined;
                comment = false;
              }
              comlen = 0;
            }
          } else {
            // skip comments
            if (++count === comment) {
              comment = false;
              count = 0;
              key = undefined;
            }
          }
        }
      } else if (type === FAILURE) {
        if (isSigning)
          error = new Error('Agent unable to sign data');
        else
          error = new Error('Unable to retrieve list of keys from agent');
        sock.removeAllListeners('data');
        return sock.destroy();
      }
    }
  }
  function onerror(err) {
    error = err;
  }
  function onclose() {
    if (error)
      cb(error);
    else if ((isSigning && !sig) || (!isSigning && !keys))
      cb(new Error('Unexpected disconnection from agent'));
    else if (isSigning && sig)
      cb(undefined, sig);
    else if (!isSigning && keys)
      cb(undefined, keys);
  }

  if (process.platform === 'win32' && !WINDOWS_PIPE_REGEX.test(sockPath)) {
    if (sockPath === 'pageant') {
      // Pageant (PuTTY authentication agent)
      sock = new PageantSock();
    } else {
      // cygwin ssh-agent instance
      var triedCygpath = false;
      fs.readFile(sockPath, function readCygsocket(err, data) {
        if (err) {
          if (triedCygpath)
            return cb(new Error('Invalid cygwin unix socket path'));
          // try using `cygpath` to convert a possible *nix-style path to the
          // real Windows path before giving up ...
          cp.exec('cygpath -w "' + sockPath + '"',
                  function(err, stdout, stderr) {
            if (err || stdout.length === 0)
              return cb(new Error('Invalid cygwin unix socket path'));
            triedCygpath = true;
            sockPath = stdout.toString().replace(/[\r\n]/g, '');
            fs.readFile(sockPath, readCygsocket);
          });
          return;
        }

        var m;
        if (m = RE_CYGWIN_SOCK.exec(data.toString('ascii'))) {
          var port;
          var secret;
          var secretbuf;
          var state;
          var bc = 0;
          var isRetrying = false;
          var inbuf = [];
          var credsbuf = Buffer.allocUnsafe(12);
          var i;
          var j;

          // use 0 for pid, uid, and gid to ensure we get an error and also
          // a valid uid and gid from cygwin so that we don't have to figure it
          // out ourselves
          credsbuf.fill(0);

          // parse cygwin unix socket file contents
          port = parseInt(m[1], 10);
          secret = m[2].replace(/\-/g, '');
          secretbuf = Buffer.allocUnsafe(16);
          for (i = 0, j = 0; j < 32; ++i,j+=2)
            secretbuf[i] = parseInt(secret.substring(j, j + 2), 16);

          // convert to host order (always LE for Windows)
          for (i = 0; i < 16; i += 4)
            writeUInt32LE(secretbuf, readUInt32BE(secretbuf, i), i);

          function _onconnect() {
            bc = 0;
            state = 'secret';
            sock.write(secretbuf);
          }
          function _ondata(data) {
            bc += data.length;
            if (state === 'secret') {
              // the secret we sent is echoed back to us by cygwin, not sure of
              // the reason for that, but we ignore it nonetheless ...
              if (bc === 16) {
                bc = 0;
                state = 'creds';
                sock.write(credsbuf);
              }
            } else if (state === 'creds') {
              // if this is the first attempt, make sure to gather the valid
              // uid and gid for our next attempt
              if (!isRetrying)
                inbuf.push(data);

              if (bc === 12) {
                sock.removeListener('connect', _onconnect);
                sock.removeListener('data', _ondata);
                sock.removeListener('close', _onclose);
                if (isRetrying) {
                  addSockListeners();
                  sock.emit('connect');
                } else {
                  isRetrying = true;
                  credsbuf = Buffer.concat(inbuf);
                  writeUInt32LE(credsbuf, process.pid, 0);
                  sock.destroy();
                  tryConnect();
                }
              }
            }
          }
          function _onclose() {
            cb(new Error('Problem negotiating cygwin unix socket security'));
          }
          function tryConnect() {
            sock = new Socket();
            sock.once('connect', _onconnect);
            sock.on('data', _ondata);
            sock.once('close', _onclose);
            sock.connect(port);
          }
          tryConnect();
        } else
          cb(new Error('Malformed cygwin unix socket file'));
      });
      return;
    }
  } else
    sock = new Socket();

  function addSockListeners() {
    if (!accept && !reject) {
      sock.once('connect', onconnect);
      sock.on('data', ondata);
      sock.once('error', onerror);
      sock.once('close', onclose);
    } else {
      var chan;
      sock.once('connect', function() {
        chan = accept();
        var isDone = false;
        function onDone() {
          if (isDone)
            return;
          sock.destroy();
          isDone = true;
        }
        chan.once('end', onDone)
            .once('close', onDone)
            .on('data', function(data) {
          sock.write(data);
        });
        sock.on('data', function(data) {
          chan.write(data);
        });
      });
      sock.once('close', function() {
        if (!chan)
          reject();
      });
    }
  }
  addSockListeners();
  sock.connect(sockPath);
};


// win32 only ------------------------------------------------------------------
if (process.platform === 'win32') {
  var RET_ERR_BADARGS = 10;
  var RET_ERR_UNAVAILABLE = 11;
  var RET_ERR_NOMAP = 12;
  var RET_ERR_BINSTDIN = 13;
  var RET_ERR_BINSTDOUT = 14;
  var RET_ERR_BADLEN = 15;

  var ERROR = {};
  var EXEPATH = __nccwpck_require__.ab + "pagent.exe";
  ERROR[RET_ERR_BADARGS] = new Error('Invalid pagent.exe arguments');
  ERROR[RET_ERR_UNAVAILABLE] = new Error('Pageant is not running');
  ERROR[RET_ERR_NOMAP] = new Error('pagent.exe could not create an mmap');
  ERROR[RET_ERR_BINSTDIN] = new Error('pagent.exe could not set mode for stdin');
  ERROR[RET_ERR_BINSTDOUT] = new Error('pagent.exe could not set mode for stdout');
  ERROR[RET_ERR_BADLEN] = new Error('pagent.exe did not get expected input payload');

  function PageantSock() {
    this.proc = undefined;
    this.buffer = null;
  }
  inherits(PageantSock, EventEmitter);

  PageantSock.prototype.write = function(buf) {
    if (this.buffer === null)
      this.buffer = buf;
    else {
      this.buffer = Buffer.concat([this.buffer, buf],
                                  this.buffer.length + buf.length);
    }
    // Wait for at least all length bytes
    if (this.buffer.length < 4)
      return;

    var len = readUInt32BE(this.buffer, 0);
    // Make sure we have a full message before querying pageant
    if ((this.buffer.length - 4) < len)
      return;

    buf = this.buffer.slice(0, 4 + len);
    if (this.buffer.length > (4 + len))
      this.buffer = this.buffer.slice(4 + len);
    else
      this.buffer = null;

    var self = this;
    var proc;
    var hadError = false;
    proc = this.proc = cp.spawn(__nccwpck_require__.ab + "pagent.exe", [ buf.length ]);
    proc.stdout.on('data', function(data) {
      self.emit('data', data);
    });
    proc.once('error', function(err) {
      if (!hadError) {
        hadError = true;
        self.emit('error', err);
      }
    });
    proc.once('close', function(code) {
      self.proc = undefined;
      if (ERROR[code] && !hadError) {
        hadError = true;
        self.emit('error', ERROR[code]);
      }
      self.emit('close', hadError);
    });
    proc.stdin.end(buf);
  };
  PageantSock.prototype.end = PageantSock.prototype.destroy = function() {
    this.buffer = null;
    if (this.proc) {
      this.proc.kill();
      this.proc = undefined;
    }
  };
  PageantSock.prototype.connect = function() {
    this.emit('connect');
  };
}


/***/ }),

/***/ 1999:
/***/ ((module) => {

module.exports = {
  readUInt32BE: function readUInt32BE(buf, offset) {
    return buf[offset++] * 16777216
           + buf[offset++] * 65536
           + buf[offset++] * 256
           + buf[offset];
  },
  writeUInt32BE: function writeUInt32BE(buf, value, offset) {
    buf[offset++] = (value >>> 24);
    buf[offset++] = (value >>> 16);
    buf[offset++] = (value >>> 8);
    buf[offset++] = value;
    return offset;
  },
  writeUInt32LE: function writeUInt32LE(buf, value, offset) {
    buf[offset++] = value;
    buf[offset++] = (value >>> 8);
    buf[offset++] = (value >>> 16);
    buf[offset++] = (value >>> 24);
    return offset;
  }
};


/***/ }),

/***/ 6063:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var crypto = __nccwpck_require__(6417);
var Socket = __nccwpck_require__(1631).Socket;
var dnsLookup = __nccwpck_require__(881).lookup;
var EventEmitter = __nccwpck_require__(8614).EventEmitter;
var inherits = __nccwpck_require__(1669).inherits;
var HASHES = crypto.getHashes();

var ssh2_streams = __nccwpck_require__(792);
var SSH2Stream = ssh2_streams.SSH2Stream;
var SFTPStream = ssh2_streams.SFTPStream;
var consts = ssh2_streams.constants;
var BUGS = consts.BUGS;
var ALGORITHMS = consts.ALGORITHMS;
var EDDSA_SUPPORTED = consts.EDDSA_SUPPORTED;
var parseKey = ssh2_streams.utils.parseKey;

var HTTPAgents = __nccwpck_require__(2994);
var Channel = __nccwpck_require__(3204);
var agentQuery = __nccwpck_require__(9054);
var SFTPWrapper = __nccwpck_require__(1130);
var readUInt32BE = __nccwpck_require__(1999).readUInt32BE;

var MAX_CHANNEL = Math.pow(2, 32) - 1;
var RE_OPENSSH = /^OpenSSH_(?:(?![0-4])\d)|(?:\d{2,})/;
var DEBUG_NOOP = function(msg) {};

function Client() {
  if (!(this instanceof Client))
    return new Client();

  EventEmitter.call(this);

  this.config = {
    host: undefined,
    port: undefined,
    localAddress: undefined,
    localPort: undefined,
    forceIPv4: undefined,
    forceIPv6: undefined,
    keepaliveCountMax: undefined,
    keepaliveInterval: undefined,
    readyTimeout: undefined,

    username: undefined,
    password: undefined,
    privateKey: undefined,
    tryKeyboard: undefined,
    agent: undefined,
    allowAgentFwd: undefined,
    authHandler: undefined,

    hostHashAlgo: undefined,
    hostHashCb: undefined,
    strictVendor: undefined,
    debug: undefined
  };

  this._readyTimeout = undefined;
  this._channels = undefined;
  this._callbacks = undefined;
  this._forwarding = undefined;
  this._forwardingUnix = undefined;
  this._acceptX11 = undefined;
  this._agentFwdEnabled = undefined;
  this._curChan = undefined;
  this._remoteVer = undefined;

  this._sshstream = undefined;
  this._sock = undefined;
  this._resetKA = undefined;
}
inherits(Client, EventEmitter);

Client.prototype.connect = function(cfg) {
  var self = this;

  if (this._sock && this._sock.writable) {
    this.once('close', function() {
      self.connect(cfg);
    });
    this.end();
    return;
  }

  this.config.host = cfg.hostname || cfg.host || 'localhost';
  this.config.port = cfg.port || 22;
  this.config.localAddress = (typeof cfg.localAddress === 'string'
                              ? cfg.localAddress
                              : undefined);
  this.config.localPort = (typeof cfg.localPort === 'string'
                           || typeof cfg.localPort === 'number'
                           ? cfg.localPort
                           : undefined);
  this.config.forceIPv4 = cfg.forceIPv4 || false;
  this.config.forceIPv6 = cfg.forceIPv6 || false;
  this.config.keepaliveCountMax = (typeof cfg.keepaliveCountMax === 'number'
                                   && cfg.keepaliveCountMax >= 0
                                   ? cfg.keepaliveCountMax
                                   : 3);
  this.config.keepaliveInterval = (typeof cfg.keepaliveInterval === 'number'
                                   && cfg.keepaliveInterval > 0
                                   ? cfg.keepaliveInterval
                                   : 0);
  this.config.readyTimeout = (typeof cfg.readyTimeout === 'number'
                              && cfg.readyTimeout >= 0
                              ? cfg.readyTimeout
                              : 20000);

  var algorithms = {
    kex: undefined,
    kexBuf: undefined,
    cipher: undefined,
    cipherBuf: undefined,
    serverHostKey: undefined,
    serverHostKeyBuf: undefined,
    hmac: undefined,
    hmacBuf: undefined,
    compress: undefined,
    compressBuf: undefined
  };
  var i;
  if (typeof cfg.algorithms === 'object' && cfg.algorithms !== null) {
    var algosSupported;
    var algoList;

    algoList = cfg.algorithms.kex;
    if (Array.isArray(algoList) && algoList.length > 0) {
      algosSupported = ALGORITHMS.SUPPORTED_KEX;
      for (i = 0; i < algoList.length; ++i) {
        if (algosSupported.indexOf(algoList[i]) === -1)
          throw new Error('Unsupported key exchange algorithm: ' + algoList[i]);
      }
      algorithms.kex = algoList;
    }

    algoList = cfg.algorithms.cipher;
    if (Array.isArray(algoList) && algoList.length > 0) {
      algosSupported = ALGORITHMS.SUPPORTED_CIPHER;
      for (i = 0; i < algoList.length; ++i) {
        if (algosSupported.indexOf(algoList[i]) === -1)
          throw new Error('Unsupported cipher algorithm: ' + algoList[i]);
      }
      algorithms.cipher = algoList;
    }

    algoList = cfg.algorithms.serverHostKey;
    if (Array.isArray(algoList) && algoList.length > 0) {
      algosSupported = ALGORITHMS.SUPPORTED_SERVER_HOST_KEY;
      for (i = 0; i < algoList.length; ++i) {
        if (algosSupported.indexOf(algoList[i]) === -1) {
          throw new Error('Unsupported server host key algorithm: '
                           + algoList[i]);
        }
      }
      algorithms.serverHostKey = algoList;
    }

    algoList = cfg.algorithms.hmac;
    if (Array.isArray(algoList) && algoList.length > 0) {
      algosSupported = ALGORITHMS.SUPPORTED_HMAC;
      for (i = 0; i < algoList.length; ++i) {
        if (algosSupported.indexOf(algoList[i]) === -1)
          throw new Error('Unsupported HMAC algorithm: ' + algoList[i]);
      }
      algorithms.hmac = algoList;
    }

    algoList = cfg.algorithms.compress;
    if (Array.isArray(algoList) && algoList.length > 0) {
      algosSupported = ALGORITHMS.SUPPORTED_COMPRESS;
      for (i = 0; i < algoList.length; ++i) {
        if (algosSupported.indexOf(algoList[i]) === -1)
          throw new Error('Unsupported compression algorithm: ' + algoList[i]);
      }
      algorithms.compress = algoList;
    }
  }
  if (algorithms.compress === undefined) {
    if (cfg.compress) {
      algorithms.compress = ['zlib@openssh.com', 'zlib'];
      if (cfg.compress !== 'force')
        algorithms.compress.push('none');
    } else if (cfg.compress === false)
      algorithms.compress = ['none'];
  }

  if (typeof cfg.username === 'string')
    this.config.username = cfg.username;
  else if (typeof cfg.user === 'string')
    this.config.username = cfg.user;
  else
    throw new Error('Invalid username');

  this.config.password = (typeof cfg.password === 'string'
                          ? cfg.password
                          : undefined);
  this.config.privateKey = (typeof cfg.privateKey === 'string'
                            || Buffer.isBuffer(cfg.privateKey)
                            ? cfg.privateKey
                            : undefined);
  this.config.localHostname = (typeof cfg.localHostname === 'string'
                               && cfg.localHostname.length
                               ? cfg.localHostname
                               : undefined);
  this.config.localUsername = (typeof cfg.localUsername === 'string'
                               && cfg.localUsername.length
                               ? cfg.localUsername
                               : undefined);
  this.config.tryKeyboard = (cfg.tryKeyboard === true);
  this.config.agent = (typeof cfg.agent === 'string' && cfg.agent.length
                       ? cfg.agent
                       : undefined);
  this.config.allowAgentFwd = (cfg.agentForward === true
                               && this.config.agent !== undefined);
  var authHandler = this.config.authHandler = (
    typeof cfg.authHandler === 'function' ? cfg.authHandler : undefined
  );

  this.config.strictVendor = (typeof cfg.strictVendor === 'boolean'
                              ? cfg.strictVendor
                              : true);

  var debug = this.config.debug = (typeof cfg.debug === 'function'
                                   ? cfg.debug
                                   : DEBUG_NOOP);

  if (cfg.agentForward === true && !this.config.allowAgentFwd)
    throw new Error('You must set a valid agent path to allow agent forwarding');

  var callbacks = this._callbacks = [];
  this._channels = {};
  this._forwarding = {};
  this._forwardingUnix = {};
  this._acceptX11 = 0;
  this._agentFwdEnabled = false;
  this._curChan = -1;
  this._remoteVer = undefined;
  var privateKey;

  if (this.config.privateKey) {
    privateKey = parseKey(this.config.privateKey, cfg.passphrase);
    if (privateKey instanceof Error)
      throw new Error('Cannot parse privateKey: ' + privateKey.message);
    if (Array.isArray(privateKey))
      privateKey = privateKey[0]; // OpenSSH's newer format only stores 1 key for now
    if (privateKey.getPrivatePEM() === null)
      throw new Error('privateKey value does not contain a (valid) private key');
  }

  var stream = this._sshstream = new SSH2Stream({
    algorithms: algorithms,
    debug: (debug === DEBUG_NOOP ? undefined : debug)
  });
  var sock = this._sock = (cfg.sock || new Socket());

  // drain stderr if we are connection hopping using an exec stream
  if (this._sock.stderr && typeof this._sock.stderr.resume === 'function')
    this._sock.stderr.resume();

  // keepalive-related
  var kainterval = this.config.keepaliveInterval;
  var kacountmax = this.config.keepaliveCountMax;
  var kacount = 0;
  var katimer;
  function sendKA() {
    if (++kacount > kacountmax) {
      clearInterval(katimer);
      if (sock.readable) {
        var err = new Error('Keepalive timeout');
        err.level = 'client-timeout';
        self.emit('error', err);
        sock.destroy();
      }
      return;
    }
    if (sock.writable) {
      // append dummy callback to keep correct callback order
      callbacks.push(resetKA);
      stream.ping();
    } else
      clearInterval(katimer);
  }
  function resetKA() {
    if (kainterval > 0) {
      kacount = 0;
      clearInterval(katimer);
      if (sock.writable)
        katimer = setInterval(sendKA, kainterval);
    }
  }
  this._resetKA = resetKA;

  stream.on('USERAUTH_BANNER', function(msg) {
    self.emit('banner', msg);
  });

  sock.on('connect', function() {
    debug('DEBUG: Client: Connected');
    self.emit('connect');
    if (!cfg.sock)
      stream.pipe(sock).pipe(stream);
  }).on('timeout', function() {
    self.emit('timeout');
  }).on('error', function(err) {
    clearTimeout(self._readyTimeout);
    err.level = 'client-socket';
    self.emit('error', err);
  }).on('end', function() {
    stream.unpipe(sock);
    clearTimeout(self._readyTimeout);
    clearInterval(katimer);
    self.emit('end');
  }).on('close', function() {
    stream.unpipe(sock);
    clearTimeout(self._readyTimeout);
    clearInterval(katimer);
    self.emit('close');

    // notify outstanding channel requests of disconnection ...
    var callbacks_ = callbacks;
    var err = new Error('No response from server');
    callbacks = self._callbacks = [];
    for (i = 0; i < callbacks_.length; ++i)
      callbacks_[i](err);

    // simulate error for any channels waiting to be opened. this is safe
    // against successfully opened channels because the success and failure
    // event handlers are automatically removed when a success/failure response
    // is received
    var channels = self._channels;
    var chanNos = Object.keys(channels);
    self._channels = {};
    for (i = 0; i < chanNos.length; ++i) {
      var ev1 = stream.emit('CHANNEL_OPEN_FAILURE:' + chanNos[i], err);
      // emitting CHANNEL_CLOSE should be safe too and should help for any
      // special channels which might otherwise keep the process alive, such
      // as agent forwarding channels which have open unix sockets ...
      var ev2 = stream.emit('CHANNEL_CLOSE:' + chanNos[i]);
      var earlyCb;
      if (!ev1 && !ev2 && (earlyCb = channels[chanNos[i]])
          && typeof earlyCb === 'function') {
        earlyCb(err);
      }
    }
  });
  stream.on('drain', function() {
    self.emit('drain');
  }).once('header', function(header) {
    self._remoteVer = header.versions.software;
    if (header.greeting)
      self.emit('greeting', header.greeting);
  }).on('continue', function() {
    self.emit('continue');
  }).on('error', function(err) {
    if (err.level === undefined)
      err.level = 'protocol';
    else if (err.level === 'handshake')
      clearTimeout(self._readyTimeout);
    self.emit('error', err);
  }).on('end', function() {
    sock.resume();
  });

  if (typeof cfg.hostVerifier === 'function') {
    if (HASHES.indexOf(cfg.hostHash) === -1)
      throw new Error('Invalid host hash algorithm: ' + cfg.hostHash);
    var hashCb = cfg.hostVerifier;
    var hasher = crypto.createHash(cfg.hostHash);
    stream.once('fingerprint', function(key, verify) {
      hasher.update(key);
      var ret = hashCb(hasher.digest('hex'), verify);
      if (ret !== undefined)
        verify(ret);
    });
  }

  // begin authentication handling =============================================
  var curAuth;
  var curPartial = null;
  var curAuthsLeft = null;
  var agentKeys;
  var agentKeyPos = 0;
  var authsAllowed = ['none'];
  if (this.config.password !== undefined)
    authsAllowed.push('password');
  if (privateKey !== undefined)
    authsAllowed.push('publickey');
  if (this.config.agent !== undefined)
    authsAllowed.push('agent');
  if (this.config.tryKeyboard)
    authsAllowed.push('keyboard-interactive');
  if (privateKey !== undefined
      && this.config.localHostname !== undefined
      && this.config.localUsername !== undefined) {
    authsAllowed.push('hostbased');
  }

  if (authHandler === undefined) {
    var authPos = 0;
    authHandler = function authHandler(authsLeft, partial, cb) {
      if (authPos === authsAllowed.length)
        return false;
      return authsAllowed[authPos++];
    };
  }

  var hasSentAuth = false;
  function doNextAuth(authName) {
    hasSentAuth = true;
    if (authName === false) {
      stream.removeListener('USERAUTH_FAILURE', onUSERAUTH_FAILURE);
      stream.removeListener('USERAUTH_PK_OK', onUSERAUTH_PK_OK);
      var err = new Error('All configured authentication methods failed');
      err.level = 'client-authentication';
      self.emit('error', err);
      if (stream.writable)
        self.end();
      return;
    }
    if (authsAllowed.indexOf(authName) === -1)
      throw new Error('Authentication method not allowed: ' + authName);
    curAuth = authName;
    switch (curAuth) {
      case 'password':
        stream.authPassword(self.config.username, self.config.password);
      break;
      case 'publickey':
        stream.authPK(self.config.username, privateKey);
        stream.once('USERAUTH_PK_OK', onUSERAUTH_PK_OK);
      break;
      case 'hostbased':
        function hostbasedCb(buf, cb) {
          var signature = privateKey.sign(buf);
          if (signature instanceof Error) {
            signature.message = 'Error while signing data with privateKey: '
                                + signature.message;
            signature.level = 'client-authentication';
            self.emit('error', signature);
            return tryNextAuth();
          }

          cb(signature);
        }
        stream.authHostbased(self.config.username,
                             privateKey,
                             self.config.localHostname,
                             self.config.localUsername,
                             hostbasedCb);
      break;
      case 'agent':
        agentQuery(self.config.agent, function(err, keys) {
          if (err) {
            err.level = 'agent';
            self.emit('error', err);
            agentKeys = undefined;
            return tryNextAuth();
          } else if (keys.length === 0) {
            debug('DEBUG: Agent: No keys stored in agent');
            agentKeys = undefined;
            return tryNextAuth();
          }

          agentKeys = keys;
          agentKeyPos = 0;

          stream.authPK(self.config.username, keys[0]);
          stream.once('USERAUTH_PK_OK', onUSERAUTH_PK_OK);
        });
      break;
      case 'keyboard-interactive':
        stream.authKeyboard(self.config.username);
        stream.on('USERAUTH_INFO_REQUEST', onUSERAUTH_INFO_REQUEST);
      break;
      case 'none':
        stream.authNone(self.config.username);
      break;
    }
  }
  function tryNextAuth() {
    hasSentAuth = false;
    var auth = authHandler(curAuthsLeft, curPartial, doNextAuth);
    if (hasSentAuth || auth === undefined)
      return;
    doNextAuth(auth);
  }
  function tryNextAgentKey() {
    if (curAuth === 'agent') {
      if (agentKeyPos >= agentKeys.length)
        return;
      if (++agentKeyPos >= agentKeys.length) {
        debug('DEBUG: Agent: No more keys left to try');
        debug('DEBUG: Client: agent auth failed');
        agentKeys = undefined;
        tryNextAuth();
      } else {
        debug('DEBUG: Agent: Trying key #' + (agentKeyPos + 1));
        stream.authPK(self.config.username, agentKeys[agentKeyPos]);
        stream.once('USERAUTH_PK_OK', onUSERAUTH_PK_OK);
      }
    }
  }
  function onUSERAUTH_INFO_REQUEST(name, instructions, lang, prompts) {
    var nprompts = (Array.isArray(prompts) ? prompts.length : 0);
    if (nprompts === 0) {
      debug('DEBUG: Client: Sending automatic USERAUTH_INFO_RESPONSE');
      return stream.authInfoRes();
    }
    // we sent a keyboard-interactive user authentication request and now the
    // server is sending us the prompts we need to present to the user
    self.emit('keyboard-interactive',
              name,
              instructions,
              lang,
              prompts,
              function(answers) {
                stream.authInfoRes(answers);
              }
    );
  }
  function onUSERAUTH_PK_OK() {
    if (curAuth === 'agent') {
      var agentKey = agentKeys[agentKeyPos];
      var keyLen = readUInt32BE(agentKey, 0);
      var pubKeyFullType = agentKey.toString('ascii', 4, 4 + keyLen);
      var pubKeyType = pubKeyFullType.slice(4);
      // Check that we support the key type first
      // TODO: move key type checking logic to ssh2-streams
      switch (pubKeyFullType) {
        case 'ssh-rsa':
        case 'ssh-dss':
        case 'ecdsa-sha2-nistp256':
        case 'ecdsa-sha2-nistp384':
        case 'ecdsa-sha2-nistp521':
          break;
        default:
          if (EDDSA_SUPPORTED && pubKeyFullType === 'ssh-ed25519')
            break;
          debug('DEBUG: Agent: Skipping unsupported key type: '
                + pubKeyFullType);
          return tryNextAgentKey();
      }
      stream.authPK(self.config.username, 
                    agentKey,
                    function(buf, cb) {
        agentQuery(self.config.agent,
                   agentKey,
                   pubKeyType,
                   buf,
                   function(err, signed) {
          if (err) {
            err.level = 'agent';
            self.emit('error', err);
          } else {
            var sigFullTypeLen = readUInt32BE(signed, 0);
            if (4 + sigFullTypeLen + 4 < signed.length) {
              var sigFullType = signed.toString('ascii', 4, 4 + sigFullTypeLen);
              if (sigFullType !== pubKeyFullType) {
                err = new Error('Agent key/signature type mismatch');
                err.level = 'agent';
                self.emit('error', err);
              } else {
                // skip algoLen + algo + sigLen
                return cb(signed.slice(4 + sigFullTypeLen + 4));
              }
            }
          }

          tryNextAgentKey();
        });
      });
    } else if (curAuth === 'publickey') {
      stream.authPK(self.config.username, privateKey, function(buf, cb) {
        var signature = privateKey.sign(buf);
        if (signature instanceof Error) {
          signature.message = 'Error while signing data with privateKey: '
                              + signature.message;
          signature.level = 'client-authentication';
          self.emit('error', signature);
          return tryNextAuth();
        }
        cb(signature);
      });
    }
  }
  function onUSERAUTH_FAILURE(authsLeft, partial) {
    stream.removeListener('USERAUTH_PK_OK', onUSERAUTH_PK_OK);
    stream.removeListener('USERAUTH_INFO_REQUEST', onUSERAUTH_INFO_REQUEST);
    if (curAuth === 'agent') {
      debug('DEBUG: Client: Agent key #' + (agentKeyPos + 1) + ' failed');
      return tryNextAgentKey();
    } else {
      debug('DEBUG: Client: ' + curAuth + ' auth failed');
    }

    curPartial = partial;
    curAuthsLeft = authsLeft;
    tryNextAuth();
  }
  stream.once('USERAUTH_SUCCESS', function() {
    stream.removeListener('USERAUTH_FAILURE', onUSERAUTH_FAILURE);
    stream.removeListener('USERAUTH_INFO_REQUEST', onUSERAUTH_INFO_REQUEST);

    // start keepalive mechanism
    resetKA();

    clearTimeout(self._readyTimeout);

    self.emit('ready');
  }).on('USERAUTH_FAILURE', onUSERAUTH_FAILURE);
  // end authentication handling ===============================================

  // handle initial handshake completion
  stream.once('ready', function() {
    stream.service('ssh-userauth');
    stream.once('SERVICE_ACCEPT', function(svcName) {
      if (svcName === 'ssh-userauth')
        tryNextAuth();
    });
  });

  // handle incoming requests from server, typically a forwarded TCP or X11
  // connection
  stream.on('CHANNEL_OPEN', function(info) {
    onCHANNEL_OPEN(self, info);
  });

  // handle responses for tcpip-forward and other global requests
  stream.on('REQUEST_SUCCESS', function(data) {
    if (callbacks.length)
      callbacks.shift()(false, data);
  }).on('REQUEST_FAILURE', function() {
    if (callbacks.length)
      callbacks.shift()(true);
  });

  stream.on('GLOBAL_REQUEST', function(name, wantReply, data) {
    // auto-reject all global requests, this can be especially useful if the
    // server is sending us dummy keepalive global requests
    if (wantReply)
      stream.requestFailure();
  });

  if (!cfg.sock) {
    var host = this.config.host;
    var forceIPv4 = this.config.forceIPv4;
    var forceIPv6 = this.config.forceIPv6;

    debug('DEBUG: Client: Trying '
          + host
          + ' on port '
          + this.config.port
          + ' ...');

    function doConnect() {
      startTimeout();
      self._sock.connect({
        host: host,
        port: self.config.port,
        localAddress: self.config.localAddress,
        localPort: self.config.localPort
      });
      self._sock.setNoDelay(true);
      self._sock.setMaxListeners(0);
      self._sock.setTimeout(typeof cfg.timeout === 'number' ? cfg.timeout : 0);
    }

    if ((!forceIPv4 && !forceIPv6) || (forceIPv4 && forceIPv6))
      doConnect();
    else {
      dnsLookup(host, (forceIPv4 ? 4 : 6), function(err, address, family) {
        if (err) {
          var error = new Error('Error while looking up '
                                + (forceIPv4 ? 'IPv4' : 'IPv6')
                                + ' address for host '
                                + host
                                + ': ' + err);
          clearTimeout(self._readyTimeout);
          error.level = 'client-dns';
          self.emit('error', error);
          self.emit('close');
          return;
        }
        host = address;
        doConnect();
      });
    }
  } else {
    startTimeout();
    stream.pipe(sock).pipe(stream);
  }

  function startTimeout() {
    if (self.config.readyTimeout > 0) {
      self._readyTimeout = setTimeout(function() {
        var err = new Error('Timed out while waiting for handshake');
        err.level = 'client-timeout';
        self.emit('error', err);
        sock.destroy();
      }, self.config.readyTimeout);
    }
  }
};

Client.prototype.end = function() {
  if (this._sock
      && this._sock.writable
      && this._sshstream
      && this._sshstream.writable)
    return this._sshstream.disconnect();
  return false;
};

Client.prototype.destroy = function() {
  this._sock && this._sock.destroy();
};

Client.prototype.exec = function(cmd, opts, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  var self = this;
  var extraOpts = { allowHalfOpen: (opts.allowHalfOpen !== false) };

  return openChannel(this, 'session', extraOpts, function(err, chan) {
    if (err)
      return cb(err);

    var todo = [];

    function reqCb(err) {
      if (err) {
        chan.close();
        return cb(err);
      }
      if (todo.length)
        todo.shift()();
    }

    if (self.config.allowAgentFwd === true
        || (opts
            && opts.agentForward === true
            && self.config.agent !== undefined)) {
      todo.push(function() {
        reqAgentFwd(chan, reqCb);
      });
    }

    if (typeof opts === 'object' && opts !== null) {
      if (typeof opts.env === 'object' && opts.env !== null)
        reqEnv(chan, opts.env);
      if ((typeof opts.pty === 'object' && opts.pty !== null)
          || opts.pty === true) {
        todo.push(function() { reqPty(chan, opts.pty, reqCb); });
      }
      if ((typeof opts.x11 === 'object' && opts.x11 !== null)
          || opts.x11 === 'number'
          || opts.x11 === true) {
        todo.push(function() { reqX11(chan, opts.x11, reqCb); });
      }
    }

    todo.push(function() { reqExec(chan, cmd, opts, cb); });
    todo.shift()();
  });
};

Client.prototype.shell = function(wndopts, opts, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  // start an interactive terminal/shell session
  var self = this;

  if (typeof wndopts === 'function') {
    cb = wndopts;
    wndopts = opts = undefined;
  } else if (typeof opts === 'function') {
    cb = opts;
    opts = undefined;
  }
  if (wndopts && (wndopts.x11 !== undefined || wndopts.env !== undefined)) {
    opts = wndopts;
    wndopts = undefined;
  }

  return openChannel(this, 'session', function(err, chan) {
    if (err)
      return cb(err);

    var todo = [];

    function reqCb(err) {
      if (err) {
        chan.close();
        return cb(err);
      }
      if (todo.length)
        todo.shift()();
    }

    if (self.config.allowAgentFwd === true
        || (opts
            && opts.agentForward === true
            && self.config.agent !== undefined)) {
      todo.push(function() { reqAgentFwd(chan, reqCb); });
    }

    if (wndopts !== false)
      todo.push(function() { reqPty(chan, wndopts, reqCb); });

    if (typeof opts === 'object' && opts !== null) {
      if (typeof opts.env === 'object' && opts.env !== null)
        reqEnv(chan, opts.env);
      if ((typeof opts.x11 === 'object' && opts.x11 !== null)
          || opts.x11 === 'number'
          || opts.x11 === true) {
        todo.push(function() { reqX11(chan, opts.x11, reqCb); });
      }
    }

    todo.push(function() { reqShell(chan, cb); });
    todo.shift()();
  });
};

Client.prototype.subsys = function(name, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

	return openChannel(this, 'session', function(err, chan) {
		if (err)
			return cb(err);

		reqSubsystem(chan, name, function(err, stream) {
			if (err)
				return cb(err);

			cb(undefined, stream);
		});
	});
};

Client.prototype.sftp = function(cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  var self = this;

  // start an SFTP session
  return openChannel(this, 'session', function(err, chan) {
    if (err)
      return cb(err);

    reqSubsystem(chan, 'sftp', function(err, stream) {
      if (err)
        return cb(err);

      var serverIdentRaw = self._sshstream._state.incoming.identRaw;
      var cfg = { debug: self.config.debug };
      var sftp = new SFTPStream(cfg, serverIdentRaw);

      function onError(err) {
        sftp.removeListener('ready', onReady);
        stream.removeListener('exit', onExit);
        cb(err);
      }

      function onReady() {
        sftp.removeListener('error', onError);
        stream.removeListener('exit', onExit);
        cb(undefined, new SFTPWrapper(sftp));
      }

      function onExit(code, signal) {
        sftp.removeListener('ready', onReady);
        sftp.removeListener('error', onError);
        var msg;
        if (typeof code === 'number') {
          msg = 'Received exit code '
                + code
                + ' while establishing SFTP session';
        } else {
          msg = 'Received signal '
                + signal
                + ' while establishing SFTP session';
        }
        var err = new Error(msg);
        err.code = code;
        err.signal = signal;
        cb(err);
      }

      sftp.once('error', onError)
          .once('ready', onReady)
          .once('close', function() {
            stream.end();
          });

      // OpenSSH server sends an exit-status if there was a problem spinning up
      // an sftp server child process, so we listen for that here in order to
      // properly raise an error.
      stream.once('exit', onExit);

      sftp.pipe(stream).pipe(sftp);
    });
  });
};

Client.prototype.forwardIn = function(bindAddr, bindPort, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  // send a request for the server to start forwarding TCP connections to us
  // on a particular address and port

  var self = this;
  var wantReply = (typeof cb === 'function');

  if (wantReply) {
    this._callbacks.push(function(had_err, data) {
      if (had_err) {
        return cb(had_err !== true
                  ? had_err
                  : new Error('Unable to bind to ' + bindAddr + ':' + bindPort));
      }

      var realPort = bindPort;
      if (bindPort === 0 && data && data.length >= 4) {
        realPort = readUInt32BE(data, 0);
        if (!(self._sshstream.remoteBugs & BUGS.DYN_RPORT_BUG))
          bindPort = realPort;
      }

      self._forwarding[bindAddr + ':' + bindPort] = realPort;

      cb(undefined, realPort);
    });
  }

  return this._sshstream.tcpipForward(bindAddr, bindPort, wantReply);
};

Client.prototype.unforwardIn = function(bindAddr, bindPort, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  // send a request to stop forwarding us new connections for a particular
  // address and port

  var self = this;
  var wantReply = (typeof cb === 'function');

  if (wantReply) {
    this._callbacks.push(function(had_err) {
      if (had_err) {
        return cb(had_err !== true
                  ? had_err
                  : new Error('Unable to unbind from '
                              + bindAddr + ':' + bindPort));
      }

      delete self._forwarding[bindAddr + ':' + bindPort];

      cb();
    });
  }

  return this._sshstream.cancelTcpipForward(bindAddr, bindPort, wantReply);
};

Client.prototype.forwardOut = function(srcIP, srcPort, dstIP, dstPort, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  // send a request to forward a TCP connection to the server

  var cfg = {
    srcIP: srcIP,
    srcPort: srcPort,
    dstIP: dstIP,
    dstPort: dstPort
  };

  return openChannel(this, 'direct-tcpip', cfg, cb);
};

Client.prototype.openssh_noMoreSessions = function(cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  var wantReply = (typeof cb === 'function');

  if (!this.config.strictVendor
      || (this.config.strictVendor && RE_OPENSSH.test(this._remoteVer))) {
    if (wantReply) {
      this._callbacks.push(function(had_err) {
        if (had_err) {
          return cb(had_err !== true
                    ? had_err
                    : new Error('Unable to disable future sessions'));
        }

        cb();
      });
    }

    return this._sshstream.openssh_noMoreSessions(wantReply);
  } else if (wantReply) {
    process.nextTick(function() {
      cb(new Error('strictVendor enabled and server is not OpenSSH or compatible version'));
    });
  }

  return true;
};

Client.prototype.openssh_forwardInStreamLocal = function(socketPath, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  var wantReply = (typeof cb === 'function');
  var self = this;

  if (!this.config.strictVendor
      || (this.config.strictVendor && RE_OPENSSH.test(this._remoteVer))) {
    if (wantReply) {
      this._callbacks.push(function(had_err) {
        if (had_err) {
          return cb(had_err !== true
                    ? had_err
                    : new Error('Unable to bind to ' + socketPath));
        }
        self._forwardingUnix[socketPath] = true;
        cb();
      });
    }

    return this._sshstream.openssh_streamLocalForward(socketPath, wantReply);
  } else if (wantReply) {
    process.nextTick(function() {
      cb(new Error('strictVendor enabled and server is not OpenSSH or compatible version'));
    });
  }

  return true;
};

Client.prototype.openssh_unforwardInStreamLocal = function(socketPath, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  var wantReply = (typeof cb === 'function');
  var self = this;

  if (!this.config.strictVendor
      || (this.config.strictVendor && RE_OPENSSH.test(this._remoteVer))) {
    if (wantReply) {
      this._callbacks.push(function(had_err) {
        if (had_err) {
          return cb(had_err !== true
                    ? had_err
                    : new Error('Unable to unbind on ' + socketPath));
        }
        delete self._forwardingUnix[socketPath];
        cb();
      });
    }

    return this._sshstream.openssh_cancelStreamLocalForward(socketPath,
                                                            wantReply);
  } else if (wantReply) {
    process.nextTick(function() {
      cb(new Error('strictVendor enabled and server is not OpenSSH or compatible version'));
    });
  }

  return true;
};

Client.prototype.openssh_forwardOutStreamLocal = function(socketPath, cb) {
  if (!this._sock
      || !this._sock.writable
      || !this._sshstream
      || !this._sshstream.writable)
    throw new Error('Not connected');

  if (!this.config.strictVendor
      || (this.config.strictVendor && RE_OPENSSH.test(this._remoteVer))) {
    var cfg = { socketPath: socketPath };
    return openChannel(this, 'direct-streamlocal@openssh.com', cfg, cb);
  } else {
    process.nextTick(function() {
      cb(new Error('strictVendor enabled and server is not OpenSSH or compatible version'));
    });
  }

  return true;
};

function openChannel(self, type, opts, cb) {
  // ask the server to open a channel for some purpose
  // (e.g. session (sftp, exec, shell), or forwarding a TCP connection
  var localChan = nextChannel(self);
  var initWindow = Channel.MAX_WINDOW;
  var maxPacket = Channel.PACKET_SIZE;
  var ret = true;

  if (localChan === false)
    return cb(new Error('No free channels available'));

  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  self._channels[localChan] = cb;

  var sshstream = self._sshstream;
  sshstream.once('CHANNEL_OPEN_CONFIRMATION:' + localChan, onSuccess)
           .once('CHANNEL_OPEN_FAILURE:' + localChan, onFailure)
           .once('CHANNEL_CLOSE:' + localChan, onFailure);

  if (type === 'session')
    ret = sshstream.session(localChan, initWindow, maxPacket);
  else if (type === 'direct-tcpip')
    ret = sshstream.directTcpip(localChan, initWindow, maxPacket, opts);
  else if (type === 'direct-streamlocal@openssh.com') {
    ret = sshstream.openssh_directStreamLocal(localChan,
                                              initWindow,
                                              maxPacket,
                                              opts);
  }

  return ret;

  function onSuccess(info) {
    sshstream.removeListener('CHANNEL_OPEN_FAILURE:' + localChan, onFailure);
    sshstream.removeListener('CHANNEL_CLOSE:' + localChan, onFailure);

    var chaninfo = {
      type: type,
      incoming: {
        id: localChan,
        window: initWindow,
        packetSize: maxPacket,
        state: 'open'
      },
      outgoing: {
        id: info.sender,
        window: info.window,
        packetSize: info.packetSize,
        state: 'open'
      }
    };
    cb(undefined, new Channel(chaninfo, self));
  }

  function onFailure(info) {
    sshstream.removeListener('CHANNEL_OPEN_CONFIRMATION:' + localChan,
                             onSuccess);
    sshstream.removeListener('CHANNEL_OPEN_FAILURE:' + localChan, onFailure);
    sshstream.removeListener('CHANNEL_CLOSE:' + localChan, onFailure);

    delete self._channels[localChan];

    var err;
    if (info instanceof Error)
      err = info;
    else if (typeof info === 'object' && info !== null) {
      err = new Error('(SSH) Channel open failure: ' + info.description);
      err.reason = info.reason;
      err.lang = info.lang;
    } else {
      err = new Error('(SSH) Channel open failure: '
                      + 'server closed channel unexpectedly');
      err.reason = err.lang = '';
    }
    cb(err);
  }
}

function nextChannel(self) {
  // get the next available channel number

  // optimized path
  if (self._curChan < MAX_CHANNEL)
    return ++self._curChan;

  // slower lookup path
  for (var i = 0, channels = self._channels; i < MAX_CHANNEL; ++i)
    if (!channels[i])
      return i;

  return false;
}

function reqX11(chan, screen, cb) {
  // asks server to start sending us X11 connections
  var cfg = {
    single: false,
    protocol: 'MIT-MAGIC-COOKIE-1',
    cookie: undefined,
    screen: 0
  };

  if (typeof screen === 'function') {
    cb = screen;
  } else if (typeof screen === 'object' && screen !== null) {
    if (typeof screen.single === 'boolean')
      cfg.single = screen.single;
    if (typeof screen.screen === 'number')
      cfg.screen = screen.screen;
    if (typeof screen.protocol === 'string')
      cfg.protocol = screen.protocol;
    if (typeof screen.cookie === 'string')
      cfg.cookie = screen.cookie;
    else if (Buffer.isBuffer(screen.cookie))
      cfg.cookie = screen.cookie.toString('hex');
  }
  if (cfg.cookie === undefined)
    cfg.cookie = randomCookie();

  var wantReply = (typeof cb === 'function');

  if (chan.outgoing.state !== 'open') {
    wantReply && cb(new Error('Channel is not open'));
    return true;
  }

  if (wantReply) {
    chan._callbacks.push(function(had_err) {
      if (had_err) {
        return cb(had_err !== true
                  ? had_err
                  : new Error('Unable to request X11'));
      }

      chan._hasX11 = true;
      ++chan._client._acceptX11;
      chan.once('close', function() {
        if (chan._client._acceptX11)
          --chan._client._acceptX11;
      });

      cb();
    });
  }

  return chan._client._sshstream.x11Forward(chan.outgoing.id, cfg, wantReply);
}

function reqPty(chan, opts, cb) {
  var rows = 24;
  var cols = 80;
  var width = 640;
  var height = 480;
  var term = 'vt100';
  var modes = null;

  if (typeof opts === 'function')
    cb = opts;
  else if (typeof opts === 'object' && opts !== null) {
    if (typeof opts.rows === 'number')
      rows = opts.rows;
    if (typeof opts.cols === 'number')
      cols = opts.cols;
    if (typeof opts.width === 'number')
      width = opts.width;
    if (typeof opts.height === 'number')
      height = opts.height;
    if (typeof opts.term === 'string')
      term = opts.term;
    if (typeof opts.modes === 'object')
      modes = opts.modes;
  }

  var wantReply = (typeof cb === 'function');

  if (chan.outgoing.state !== 'open') {
    wantReply && cb(new Error('Channel is not open'));
    return true;
  }

  if (wantReply) {
    chan._callbacks.push(function(had_err) {
      if (had_err) {
        return cb(had_err !== true
                  ? had_err
                  : new Error('Unable to request a pseudo-terminal'));
      }
      cb();
    });
  }

  return chan._client._sshstream.pty(chan.outgoing.id,
                                     rows,
                                     cols,
                                     height,
                                     width,
                                     term,
                                     modes,
                                     wantReply);
}

function reqAgentFwd(chan, cb) {
  var wantReply = (typeof cb === 'function');

  if (chan.outgoing.state !== 'open') {
    wantReply && cb(new Error('Channel is not open'));
    return true;
  } else if (chan._client._agentFwdEnabled) {
    wantReply && cb(false);
    return true;
  }

  chan._client._agentFwdEnabled = true;

  chan._callbacks.push(function(had_err) {
    if (had_err) {
      chan._client._agentFwdEnabled = false;
      wantReply && cb(had_err !== true
                      ? had_err
                      : new Error('Unable to request agent forwarding'));
      return;
    }

    wantReply && cb();
  });

  return chan._client._sshstream.openssh_agentForward(chan.outgoing.id, true);
}

function reqShell(chan, cb) {
  if (chan.outgoing.state !== 'open') {
    cb(new Error('Channel is not open'));
    return true;
  }
  chan._callbacks.push(function(had_err) {
    if (had_err) {
      return cb(had_err !== true
                ? had_err
                : new Error('Unable to open shell'));
    }
    chan.subtype = 'shell';
    cb(undefined, chan);
  });

  return chan._client._sshstream.shell(chan.outgoing.id, true);
}

function reqExec(chan, cmd, opts, cb) {
  if (chan.outgoing.state !== 'open') {
    cb(new Error('Channel is not open'));
    return true;
  }
  chan._callbacks.push(function(had_err) {
    if (had_err) {
      return cb(had_err !== true
                ? had_err
                : new Error('Unable to exec'));
    }
    chan.subtype = 'exec';
    chan.allowHalfOpen = (opts.allowHalfOpen !== false);
    cb(undefined, chan);
  });

  return chan._client._sshstream.exec(chan.outgoing.id, cmd, true);
}

function reqEnv(chan, env) {
  if (chan.outgoing.state !== 'open')
    return true;
  var ret = true;
  var keys = Object.keys(env || {});
  var key;
  var val;

  for (var i = 0, len = keys.length; i < len; ++i) {
    key = keys[i];
    val = env[key];
    ret = chan._client._sshstream.env(chan.outgoing.id, key, val, false);
  }

  return ret;
}

function reqSubsystem(chan, name, cb) {
  if (chan.outgoing.state !== 'open') {
    cb(new Error('Channel is not open'));
    return true;
  }
  chan._callbacks.push(function(had_err) {
    if (had_err) {
      return cb(had_err !== true
                ? had_err
                : new Error('Unable to start subsystem: ' + name));
    }
    chan.subtype = 'subsystem';
    cb(undefined, chan);
  });

  return chan._client._sshstream.subsystem(chan.outgoing.id, name, true);
}

function onCHANNEL_OPEN(self, info) {
  // the server is trying to open a channel with us, this is usually when
  // we asked the server to forward us connections on some port and now they
  // are asking us to accept/deny an incoming connection on their side

  var localChan = false;
  var reason;

  function accept() {
    var chaninfo = {
      type: info.type,
      incoming: {
        id: localChan,
        window: Channel.MAX_WINDOW,
        packetSize: Channel.PACKET_SIZE,
        state: 'open'
      },
      outgoing: {
        id: info.sender,
        window: info.window,
        packetSize: info.packetSize,
        state: 'open'
      }
    };
    var stream = new Channel(chaninfo, self);

    self._sshstream.channelOpenConfirm(info.sender,
                                       localChan,
                                       Channel.MAX_WINDOW,
                                       Channel.PACKET_SIZE);
    return stream;
  }
  function reject() {
    if (reason === undefined) {
      if (localChan === false)
        reason = consts.CHANNEL_OPEN_FAILURE.RESOURCE_SHORTAGE;
      else
        reason = consts.CHANNEL_OPEN_FAILURE.CONNECT_FAILED;
    }

    self._sshstream.channelOpenFail(info.sender, reason, '', '');
  }

  if (info.type === 'forwarded-tcpip'
      || info.type === 'x11'
      || info.type === 'auth-agent@openssh.com'
      || info.type === 'forwarded-streamlocal@openssh.com') {

    // check for conditions for automatic rejection
    var rejectConn = (
     (info.type === 'forwarded-tcpip'
      && self._forwarding[info.data.destIP
                         + ':'
                         + info.data.destPort] === undefined)
     || (info.type === 'forwarded-streamlocal@openssh.com'
         && self._forwardingUnix[info.data.socketPath] === undefined)
     || (info.type === 'x11' && self._acceptX11 === 0)
     || (info.type === 'auth-agent@openssh.com'
         && !self._agentFwdEnabled)
    );

    if (!rejectConn) {
      localChan = nextChannel(self);

      if (localChan === false) {
        self.config.debug('DEBUG: Client: Automatic rejection of incoming channel open: no channels available');
        rejectConn = true;
      } else
        self._channels[localChan] = true;
    } else {
      reason = consts.CHANNEL_OPEN_FAILURE.ADMINISTRATIVELY_PROHIBITED;
      self.config.debug('DEBUG: Client: Automatic rejection of incoming channel open: unexpected channel open for: '
                        + info.type);
    }

    // TODO: automatic rejection after some timeout?

    if (rejectConn)
      reject();

    if (localChan !== false) {
      if (info.type === 'forwarded-tcpip') {
        if (info.data.destPort === 0) {
          info.data.destPort = self._forwarding[info.data.destIP
                                                + ':'
                                                + info.data.destPort];
        }
        self.emit('tcp connection', info.data, accept, reject);
      } else if (info.type === 'x11') {
        self.emit('x11', info.data, accept, reject);
      } else if (info.type === 'forwarded-streamlocal@openssh.com') {
        self.emit('unix connection', info.data, accept, reject);
      } else {
        agentQuery(self.config.agent, accept, reject);
      }
    }
  } else {
    // automatically reject any unsupported channel open requests
    self.config.debug('DEBUG: Client: Automatic rejection of incoming channel open: unsupported type: '
                      + info.type);
    reason = consts.CHANNEL_OPEN_FAILURE.UNKNOWN_CHANNEL_TYPE;
    reject();
  }
}

var randomCookie = (function() {
  if (typeof crypto.randomFillSync === 'function') {
    var buffer = Buffer.alloc(16);
    return function randomCookie() {
      crypto.randomFillSync(buffer, 0, 16);
      return buffer.toString('hex');
    };
  } else {
    return function randomCookie() {
      return crypto.randomBytes(16).toString('hex');
    };
  }
})();

Client.Client = Client;
Client.Server = __nccwpck_require__(2986);
// pass some useful utilities on to end user (e.g. parseKey())
Client.utils = ssh2_streams.utils;
// expose useful SFTPStream constants for sftp server usage
Client.SFTP_STATUS_CODE = SFTPStream.STATUS_CODE;
Client.SFTP_OPEN_MODE = SFTPStream.OPEN_MODE;
// expose http(s).Agent implementations to allow easy tunneling of HTTP(S)
// requests
Client.HTTPAgent = HTTPAgents.SSHTTPAgent;
Client.HTTPSAgent = HTTPAgents.SSHTTPSAgent;

module.exports = Client; // backwards compatibility


/***/ }),

/***/ 2994:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

var HttpAgent = __nccwpck_require__(8605).Agent;
var HttpsAgent = __nccwpck_require__(7211).Agent;
var inherits = __nccwpck_require__(1669).inherits;

var Client;

[HttpAgent, HttpsAgent].forEach((ctor) => {
  function SSHAgent(connectCfg, agentOptions) {
    if (!(this instanceof SSHAgent))
      return new SSHAgent(connectCfg, agentOptions);

    ctor.call(this, agentOptions);

    this._connectCfg = connectCfg;
    this._defaultSrcIP = (agentOptions && agentOptions.srcIP) || 'localhost';
  }
  inherits(SSHAgent, ctor);

  SSHAgent.prototype.createConnection = createConnection;

  exports[ctor === HttpAgent ? 'SSHTTPAgent' : 'SSHTTPSAgent'] = SSHAgent;
});

function createConnection(options, cb) {
  var srcIP = (options && options.localAddress) || this._defaultSrcIP;
  var srcPort = (options && options.localPort) || 0;
  var dstIP = options.host;
  var dstPort = options.port;

  if (Client === undefined)
    Client = __nccwpck_require__(6063).Client;

  var client = new Client();
  var triedForward = false;
  client.on('ready', () => {
    client.forwardOut(srcIP, srcPort, dstIP, dstPort, (err, stream) => {
      triedForward = true;
      if (err) {
        client.end();
        return cb(err);
      }
      stream.once('close', () => {
        client.end();
      });
      cb(null, decorateStream(stream));
    });
  }).on('error', cb).on('close', () => {
    if (!triedForward)
      cb(new Error('Unexpected connection loss'));
  }).connect(this._connectCfg);
}

function noop() {}

function decorateStream(stream) {
  stream.setKeepAlive = noop;
  stream.setNoDelay = noop;
  stream.setTimeout = noop;
  stream.ref = noop;
  stream.unref = noop;
  stream.destroySoon = stream.destroy;
  return stream;
}


/***/ }),

/***/ 4764:
/***/ ((module) => {

function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function Manager(interval, streamInterval, kaCountMax) {
  var streams = this._streams = [];
  this._timer = undefined;
  this._timerInterval = interval;
  this._timerfn = function() {
    var now = Date.now();
    for (var i = 0, len = streams.length, s, last; i < len; ++i) {
      s = streams[i];
      last = s._kalast;
      if (last && (now - last) >= streamInterval) {
        if (++s._kacnt > kaCountMax) {
          var err = new Error('Keepalive timeout');
          err.level = 'client-timeout';
          s.emit('error', err);
          s.disconnect();
          spliceOne(streams, i);
          --i;
          len = streams.length;
        } else {
          s._kalast = now;
          // XXX: if the server ever starts sending real global requests to the
          //      client, we will need to add a dummy callback here to keep the
          //      correct reply order
          s.ping();
        }
      }
    }
  };
}

Manager.prototype.start = function() {
  if (this._timer)
    this.stop();
  this._timer = setInterval(this._timerfn, this._timerInterval);
};

Manager.prototype.stop = function() {
  if (this._timer) {
    clearInterval(this._timer);
    this._timer = undefined;
  }
};

Manager.prototype.add = function(stream) {
  var streams = this._streams,
      self = this;

  stream.once('end', function() {
    self.remove(stream);
  }).on('packet', resetKA);

  streams[streams.length] = stream;

  resetKA();

  if (!this._timer)
    this.start();

  function resetKA() {
    stream._kalast = Date.now();
    stream._kacnt = 0;
  }
};

Manager.prototype.remove = function(stream) {
  var streams = this._streams,
      index = streams.indexOf(stream);
  if (index > -1)
    spliceOne(streams, index);
  if (!streams.length)
    this.stop();
};

module.exports = Manager;


/***/ }),

/***/ 2986:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var net = __nccwpck_require__(1631);
var EventEmitter = __nccwpck_require__(8614).EventEmitter;
var listenerCount = EventEmitter.listenerCount;
var inherits = __nccwpck_require__(1669).inherits;

var ssh2_streams = __nccwpck_require__(792);
var parseKey = ssh2_streams.utils.parseKey;
var SSH2Stream = ssh2_streams.SSH2Stream;
var SFTPStream = ssh2_streams.SFTPStream;
var consts = ssh2_streams.constants;
var DISCONNECT_REASON = consts.DISCONNECT_REASON;
var CHANNEL_OPEN_FAILURE = consts.CHANNEL_OPEN_FAILURE;
var ALGORITHMS = consts.ALGORITHMS;

var Channel = __nccwpck_require__(3204);
var KeepaliveManager = __nccwpck_require__(4764);
var writeUInt32BE = __nccwpck_require__(1999).writeUInt32BE;

var MAX_CHANNEL = Math.pow(2, 32) - 1;
var MAX_PENDING_AUTHS = 10;

var kaMgr;

function Server(cfg, listener) {
  if (!(this instanceof Server))
    return new Server(cfg, listener);

  var hostKeys = {
    'ssh-rsa': null,
    'ssh-dss': null,
    'ssh-ed25519': null,
    'ecdsa-sha2-nistp256': null,
    'ecdsa-sha2-nistp384': null,
    'ecdsa-sha2-nistp521': null
  };

  var hostKeys_ = cfg.hostKeys;
  if (!Array.isArray(hostKeys_))
    throw new Error('hostKeys must be an array');

  var i;
  for (i = 0; i < hostKeys_.length; ++i) {
    var privateKey;
    if (Buffer.isBuffer(hostKeys_[i]) || typeof hostKeys_[i] === 'string')
      privateKey = parseKey(hostKeys_[i]);
    else
      privateKey = parseKey(hostKeys_[i].key, hostKeys_[i].passphrase);
    if (privateKey instanceof Error)
      throw new Error('Cannot parse privateKey: ' + privateKey.message);
    if (Array.isArray(privateKey))
      privateKey = privateKey[0]; // OpenSSH's newer format only stores 1 key for now
    if (privateKey.getPrivatePEM() === null)
      throw new Error('privateKey value contains an invalid private key');
    if (hostKeys[privateKey.type])
      continue;
    hostKeys[privateKey.type] = privateKey;
  }

  var algorithms = {
    kex: undefined,
    kexBuf: undefined,
    cipher: undefined,
    cipherBuf: undefined,
    serverHostKey: undefined,
    serverHostKeyBuf: undefined,
    hmac: undefined,
    hmacBuf: undefined,
    compress: undefined,
    compressBuf: undefined
  };
  if (typeof cfg.algorithms === 'object' && cfg.algorithms !== null) {
    var algosSupported;
    var algoList;

    algoList = cfg.algorithms.kex;
    if (Array.isArray(algoList) && algoList.length > 0) {
      algosSupported = ALGORITHMS.SUPPORTED_KEX;
      for (i = 0; i < algoList.length; ++i) {
        if (algosSupported.indexOf(algoList[i]) === -1)
          throw new Error('Unsupported key exchange algorithm: ' + algoList[i]);
      }
      algorithms.kex = algoList;
    }

    algoList = cfg.algorithms.cipher;
    if (Array.isArray(algoList) && algoList.length > 0) {
      algosSupported = ALGORITHMS.SUPPORTED_CIPHER;
      for (i = 0; i < algoList.length; ++i) {
        if (algosSupported.indexOf(algoList[i]) === -1)
          throw new Error('Unsupported cipher algorithm: ' + algoList[i]);
      }
      algorithms.cipher = algoList;
    }

    algoList = cfg.algorithms.serverHostKey;
    var copied = false;
    if (Array.isArray(algoList) && algoList.length > 0) {
      algosSupported = ALGORITHMS.SUPPORTED_SERVER_HOST_KEY;
      for (i = algoList.length - 1; i >= 0; --i) {
        if (algosSupported.indexOf(algoList[i]) === -1) {
          throw new Error('Unsupported server host key algorithm: '
                           + algoList[i]);
        }
        if (!hostKeys[algoList[i]]) {
          // Silently discard for now
          if (!copied) {
            algoList = algoList.slice();
            copied = true;
          }
          algoList.splice(i, 1);
        }
      }
      if (algoList.length > 0)
        algorithms.serverHostKey = algoList;
    }

    algoList = cfg.algorithms.hmac;
    if (Array.isArray(algoList) && algoList.length > 0) {
      algosSupported = ALGORITHMS.SUPPORTED_HMAC;
      for (i = 0; i < algoList.length; ++i) {
        if (algosSupported.indexOf(algoList[i]) === -1)
          throw new Error('Unsupported HMAC algorithm: ' + algoList[i]);
      }
      algorithms.hmac = algoList;
    }

    algoList = cfg.algorithms.compress;
    if (Array.isArray(algoList) && algoList.length > 0) {
      algosSupported = ALGORITHMS.SUPPORTED_COMPRESS;
      for (i = 0; i < algoList.length; ++i) {
        if (algosSupported.indexOf(algoList[i]) === -1)
          throw new Error('Unsupported compression algorithm: ' + algoList[i]);
      }
      algorithms.compress = algoList;
    }
  }

  // Make sure we at least have some kind of valid list of support key
  // formats
  if (algorithms.serverHostKey === undefined) {
    var hostKeyAlgos = Object.keys(hostKeys);
    for (i = hostKeyAlgos.length - 1; i >= 0; --i) {
      if (!hostKeys[hostKeyAlgos[i]])
        hostKeyAlgos.splice(i, 1);
    }
    algorithms.serverHostKey = hostKeyAlgos;
  }

  if (!kaMgr
      && Server.KEEPALIVE_INTERVAL > 0
      && Server.KEEPALIVE_CLIENT_INTERVAL > 0
      && Server.KEEPALIVE_CLIENT_COUNT_MAX >= 0) {
    kaMgr = new KeepaliveManager(Server.KEEPALIVE_INTERVAL,
                                 Server.KEEPALIVE_CLIENT_INTERVAL,
                                 Server.KEEPALIVE_CLIENT_COUNT_MAX);
  }

  var self = this;

  EventEmitter.call(this);

  if (typeof listener === 'function')
    self.on('connection', listener);

  var streamcfg = {
    algorithms: algorithms,
    hostKeys: hostKeys,
    server: true
  };
  var keys;
  var len;
  for (i = 0, keys = Object.keys(cfg), len = keys.length; i < len; ++i) {
    var key = keys[i];
    if (key === 'privateKey'
        || key === 'publicKey'
        || key === 'passphrase'
        || key === 'algorithms'
        || key === 'hostKeys'
        || key === 'server') {
      continue;
    }
    streamcfg[key] = cfg[key];
  }

  if (typeof streamcfg.debug === 'function') {
    var oldDebug = streamcfg.debug;
    var cfgKeys = Object.keys(streamcfg);
  }

  this._srv = new net.Server(function(socket) {
    if (self._connections >= self.maxConnections) {
      socket.destroy();
      return;
    }
    ++self._connections;
    socket.once('close', function(had_err) {
      --self._connections;

      // since joyent/node#993bb93e0a, we have to "read past EOF" in order to
      // get an `end` event on streams. thankfully adding this does not
      // negatively affect node versions pre-joyent/node#993bb93e0a.
      sshstream.read();
    }).on('error', function(err) {
      sshstream.reset();
      sshstream.emit('error', err);
    });

    var conncfg = streamcfg;

    // prepend debug output with a unique identifier in case there are multiple
    // clients connected at the same time
    if (oldDebug) {
      conncfg = {};
      for (var i = 0, key; i < cfgKeys.length; ++i) {
        key = cfgKeys[i];
        conncfg[key] = streamcfg[key];
      }
      var debugPrefix = '[' + process.hrtime().join('.') + '] ';
      conncfg.debug = function(msg) {
        oldDebug(debugPrefix + msg);
      };
    }

    var sshstream = new SSH2Stream(conncfg);
    var client = new Client(sshstream, socket);

    socket.pipe(sshstream).pipe(socket);

    // silence pre-header errors
    function onClientPreHeaderError(err) {}
    client.on('error', onClientPreHeaderError);

    sshstream.once('header', function(header) {
      if (sshstream._readableState.ended) {
        // already disconnected internally in SSH2Stream due to incompatible
        // protocol version
        return;
      } else if (!listenerCount(self, 'connection')) {
        // auto reject
        return sshstream.disconnect(DISCONNECT_REASON.BY_APPLICATION);
      }

      client.removeListener('error', onClientPreHeaderError);

      self.emit('connection',
                client,
                { ip: socket.remoteAddress,
                  family: socket.remoteFamily,
                  port: socket.remotePort,
                  header: header });
    });
  }).on('error', function(err) {
    self.emit('error', err);
  }).on('listening', function() {
    self.emit('listening');
  }).on('close', function() {
    self.emit('close');
  });
  this._connections = 0;
  this.maxConnections = Infinity;
}
inherits(Server, EventEmitter);

Server.prototype.listen = function() {
  this._srv.listen.apply(this._srv, arguments);
  return this;
};

Server.prototype.address = function() {
  return this._srv.address();
};

Server.prototype.getConnections = function(cb) {
  this._srv.getConnections(cb);
};

Server.prototype.close = function(cb) {
  this._srv.close(cb);
  return this;
};

Server.prototype.ref = function() {
  this._srv.ref();
};

Server.prototype.unref = function() {
  this._srv.unref();
};


function Client(stream, socket) {
  EventEmitter.call(this);

  var self = this;

  this._sshstream = stream;
  var channels = this._channels = {};
  this._curChan = -1;
  this._sock = socket;
  this.noMoreSessions = false;
  this.authenticated = false;

  stream.on('end', function() {
    socket.resume();
    self.emit('end');
  }).on('close', function(hasErr) {
    self.emit('close', hasErr);
  }).on('error', function(err) {
    self.emit('error', err);
  }).on('drain', function() {
    self.emit('drain');
  }).on('continue', function() {
    self.emit('continue');
  });

  var exchanges = 0;
  var acceptedAuthSvc = false;
  var pendingAuths = [];
  var authCtx;

  // begin service/auth-related ================================================
  stream.on('SERVICE_REQUEST', function(service) {
    if (exchanges === 0
        || acceptedAuthSvc
        || self.authenticated
        || service !== 'ssh-userauth')
      return stream.disconnect(DISCONNECT_REASON.SERVICE_NOT_AVAILABLE);

    acceptedAuthSvc = true;
    stream.serviceAccept(service);
  }).on('USERAUTH_REQUEST', onUSERAUTH_REQUEST);
  function onUSERAUTH_REQUEST(username, service, method, methodData) {
    if (exchanges === 0
        || (authCtx
            && (authCtx.username !== username || authCtx.service !== service))
          // TODO: support hostbased auth
        || (method !== 'password'
            && method !== 'publickey'
            && method !== 'hostbased'
            && method !== 'keyboard-interactive'
            && method !== 'none')
        || pendingAuths.length === MAX_PENDING_AUTHS)
      return stream.disconnect(DISCONNECT_REASON.PROTOCOL_ERROR);
    else if (service !== 'ssh-connection')
      return stream.disconnect(DISCONNECT_REASON.SERVICE_NOT_AVAILABLE);

    // XXX: this really shouldn't be reaching into private state ...
    stream._state.authMethod = method;

    var ctx;
    if (method === 'keyboard-interactive') {
      ctx = new KeyboardAuthContext(stream, username, service, method,
                                    methodData, onAuthDecide);
    } else if (method === 'publickey') {
      ctx = new PKAuthContext(stream, username, service, method, methodData,
                              onAuthDecide);
    } else if (method === 'hostbased') {
      ctx = new HostbasedAuthContext(stream, username, service, method,
                                     methodData, onAuthDecide);
    } else if (method === 'password') {
      ctx = new PwdAuthContext(stream, username, service, method, methodData,
                               onAuthDecide);
    } else if (method === 'none')
      ctx = new AuthContext(stream, username, service, method, onAuthDecide);

    if (authCtx) {
      if (!authCtx._initialResponse)
        return pendingAuths.push(ctx);
      else if (authCtx._multistep && !this._finalResponse) {
        // RFC 4252 says to silently abort the current auth request if a new
        // auth request comes in before the final response from an auth method
        // that requires additional request/response exchanges -- this means
        // keyboard-interactive for now ...
        authCtx._cleanup && authCtx._cleanup();
        authCtx.emit('abort');
      }
    }

    authCtx = ctx;

    if (listenerCount(self, 'authentication'))
      self.emit('authentication', authCtx);
    else
      authCtx.reject();
  }
  function onAuthDecide(ctx, allowed, methodsLeft, isPartial) {
    if (authCtx === ctx && !self.authenticated) {
      if (allowed) {
        stream.removeListener('USERAUTH_REQUEST', onUSERAUTH_REQUEST);
        authCtx = undefined;
        self.authenticated = true;
        stream.authSuccess();
        pendingAuths = [];
        self.emit('ready');
      } else {
        stream.authFailure(methodsLeft, isPartial);
        if (pendingAuths.length) {
          authCtx = pendingAuths.pop();
          if (listenerCount(self, 'authentication'))
            self.emit('authentication', authCtx);
          else
            authCtx.reject();
        }
      }
    }
  }
  // end service/auth-related ==================================================

  var unsentGlobalRequestsReplies = [];

  function sendReplies() {
    var reply;
    while (unsentGlobalRequestsReplies.length > 0
           && unsentGlobalRequestsReplies[0].type) {
      reply = unsentGlobalRequestsReplies.shift();
      if (reply.type === 'SUCCESS')
        stream.requestSuccess(reply.buf);
      if (reply.type === 'FAILURE')
        stream.requestFailure();
    }
  }

  stream.on('GLOBAL_REQUEST', function(name, wantReply, data) {
    var reply = {
      type: null,
      buf: null
    };

    function setReply(type, buf) {
      reply.type = type;
      reply.buf = buf;
      sendReplies();
    }

    if (wantReply)
      unsentGlobalRequestsReplies.push(reply);

    if ((name === 'tcpip-forward'
         || name === 'cancel-tcpip-forward'
         || name === 'no-more-sessions@openssh.com'
         || name === 'streamlocal-forward@openssh.com'
         || name === 'cancel-streamlocal-forward@openssh.com')
        && listenerCount(self, 'request')
        && self.authenticated) {
      var accept;
      var reject;

      if (wantReply) {
        var replied = false;
        accept = function(chosenPort) {
          if (replied)
            return;
          replied = true;
          var bufPort;
          if (name === 'tcpip-forward'
              && data.bindPort === 0
              && typeof chosenPort === 'number') {
            bufPort = Buffer.allocUnsafe(4);
            writeUInt32BE(bufPort, chosenPort, 0);
          }
          setReply('SUCCESS', bufPort);
        };
        reject = function() {
          if (replied)
            return;
          replied = true;
          setReply('FAILURE');
        };
      }

      if (name === 'no-more-sessions@openssh.com') {
        self.noMoreSessions = true;
        accept && accept();
        return;
      }

      self.emit('request', accept, reject, name, data);
    } else if (wantReply)
      setReply('FAILURE');
  });

  stream.on('CHANNEL_OPEN', function(info) {
    // do early reject in some cases to prevent wasteful channel allocation
    if ((info.type === 'session' && self.noMoreSessions)
        || !self.authenticated) {
      var reasonCode = CHANNEL_OPEN_FAILURE.ADMINISTRATIVELY_PROHIBITED;
      return stream.channelOpenFail(info.sender, reasonCode);
    }

    var localChan = nextChannel(self);
    var accept;
    var reject;
    var replied = false;
    if (localChan === false) {
      // auto-reject due to no channels available
      return stream.channelOpenFail(info.sender,
                                    CHANNEL_OPEN_FAILURE.RESOURCE_SHORTAGE);
    }

    // be optimistic, reserve channel to prevent another request from trying to
    // take the same channel
    channels[localChan] = true;

    reject = function() {
      if (replied)
        return;

      replied = true;

      delete channels[localChan];

      var reasonCode = CHANNEL_OPEN_FAILURE.ADMINISTRATIVELY_PROHIBITED;
      return stream.channelOpenFail(info.sender, reasonCode);
    };

    switch (info.type) {
      case 'session':
        if (listenerCount(self, 'session')) {
          accept = function() {
            if (replied)
              return;

            replied = true;

            stream.channelOpenConfirm(info.sender,
                                      localChan,
                                      Channel.MAX_WINDOW,
                                      Channel.PACKET_SIZE);

            return new Session(self, info, localChan);
          };

          self.emit('session', accept, reject);
        } else
          reject();
      break;
      case 'direct-tcpip':
        if (listenerCount(self, 'tcpip')) {
          accept = function() {
            if (replied)
              return;

            replied = true;

            stream.channelOpenConfirm(info.sender,
                                      localChan,
                                      Channel.MAX_WINDOW,
                                      Channel.PACKET_SIZE);

            var chaninfo = {
              type: undefined,
              incoming: {
                id: localChan,
                window: Channel.MAX_WINDOW,
                packetSize: Channel.PACKET_SIZE,
                state: 'open'
              },
              outgoing: {
                id: info.sender,
                window: info.window,
                packetSize: info.packetSize,
                state: 'open'
              }
            };

            return new Channel(chaninfo, self);
          };

          self.emit('tcpip', accept, reject, info.data);
        } else
          reject();
      break;
      case 'direct-streamlocal@openssh.com':
        if (listenerCount(self, 'openssh.streamlocal')) {
          accept = function() {
            if (replied)
              return;

            replied = true;

            stream.channelOpenConfirm(info.sender,
                                      localChan,
                                      Channel.MAX_WINDOW,
                                      Channel.PACKET_SIZE);

            var chaninfo = {
              type: undefined,
              incoming: {
                id: localChan,
                window: Channel.MAX_WINDOW,
                packetSize: Channel.PACKET_SIZE,
                state: 'open'
              },
              outgoing: {
                id: info.sender,
                window: info.window,
                packetSize: info.packetSize,
                state: 'open'
              }
            };

            return new Channel(chaninfo, self);
          };

          self.emit('openssh.streamlocal', accept, reject, info.data);
        } else
          reject();
      break;
      default:
        // auto-reject unsupported channel types
        reject();
    }
  });

  stream.on('NEWKEYS', function() {
    if (++exchanges > 1)
      self.emit('rekey');
  });

  if (kaMgr) {
    this.once('ready', function() {
      kaMgr.add(stream);
    });
  }
}
inherits(Client, EventEmitter);

Client.prototype.end = function() {
  return this._sshstream.disconnect(DISCONNECT_REASON.BY_APPLICATION);
};

Client.prototype.x11 = function(originAddr, originPort, cb) {
  var opts = {
    originAddr: originAddr,
    originPort: originPort
  };
  return openChannel(this, 'x11', opts, cb);
};

Client.prototype.forwardOut = function(boundAddr, boundPort, remoteAddr,
                                       remotePort, cb) {
  var opts = {
    boundAddr: boundAddr,
    boundPort: boundPort,
    remoteAddr: remoteAddr,
    remotePort: remotePort
  };
  return openChannel(this, 'forwarded-tcpip', opts, cb);
};

Client.prototype.openssh_forwardOutStreamLocal = function(socketPath, cb) {
  var opts = {
    socketPath: socketPath
  };
  return openChannel(this, 'forwarded-streamlocal@openssh.com', opts, cb);
};

Client.prototype.rekey = function(cb) {
  var stream = this._sshstream;
  var ret = true;
  var error;

  try {
    ret = stream.rekey();
  } catch (ex) {
    error = ex;
  }

  // TODO: re-throw error if no callback?

  if (typeof cb === 'function') {
    if (error) {
      process.nextTick(function() {
        cb(error);
      });
    } else
      this.once('rekey', cb);
  }

  return ret;
};

function Session(client, info, localChan) {
  this.subtype = undefined;

  var ending = false;
  var self = this;
  var outgoingId = info.sender;
  var channel;

  var chaninfo = {
    type: 'session',
    incoming: {
      id: localChan,
      window: Channel.MAX_WINDOW,
      packetSize: Channel.PACKET_SIZE,
      state: 'open'
    },
    outgoing: {
      id: info.sender,
      window: info.window,
      packetSize: info.packetSize,
      state: 'open'
    }
  };

  function onREQUEST(info) {
    var replied = false;
    var accept;
    var reject;

    if (info.wantReply) {
      // "real session" requests will have custom accept behaviors
      if (info.request !== 'shell'
          && info.request !== 'exec'
          && info.request !== 'subsystem') {
        accept = function() {
          if (replied || ending || channel)
            return;

          replied = true;

          return client._sshstream.channelSuccess(outgoingId);
        };
      }

      reject = function() {
        if (replied || ending || channel)
          return;

        replied = true;

        return client._sshstream.channelFailure(outgoingId);
      };
    }

    if (ending) {
      reject && reject();
      return;
    }

    switch (info.request) {
      // "pre-real session start" requests
      case 'env':
        if (listenerCount(self, 'env')) {
          self.emit('env', accept, reject, {
            key: info.key,
            val: info.val
          });
        } else
          reject && reject();
      break;
      case 'pty-req':
        if (listenerCount(self, 'pty')) {
          self.emit('pty', accept, reject, {
            cols: info.cols,
            rows: info.rows,
            width: info.width,
            height: info.height,
            term: info.term,
            modes: info.modes,
          });
        } else
          reject && reject();
      break;
      case 'window-change':
        if (listenerCount(self, 'window-change')) {
          self.emit('window-change', accept, reject, {
            cols: info.cols,
            rows: info.rows,
            width: info.width,
            height: info.height
          });
        } else
          reject && reject();
      break;
      case 'x11-req':
        if (listenerCount(self, 'x11')) {
          self.emit('x11', accept, reject, {
            single: info.single,
            protocol: info.protocol,
            cookie: info.cookie,
            screen: info.screen
          });
        } else
          reject && reject();
      break;
      // "post-real session start" requests
      case 'signal':
        if (listenerCount(self, 'signal')) {
          self.emit('signal', accept, reject, {
            name: info.signal
          });
        } else
          reject && reject();
      break;
      // XXX: is `auth-agent-req@openssh.com` really "post-real session start"?
      case 'auth-agent-req@openssh.com':
        if (listenerCount(self, 'auth-agent'))
          self.emit('auth-agent', accept, reject);
        else
          reject && reject();
      break;
      // "real session start" requests
      case 'shell':
        if (listenerCount(self, 'shell')) {
          accept = function() {
            if (replied || ending || channel)
              return;

            replied = true;

            if (info.wantReply)
              client._sshstream.channelSuccess(outgoingId);

            channel = new Channel(chaninfo, client, { server: true });

            channel.subtype = self.subtype = info.request;

            return channel;
          };

          self.emit('shell', accept, reject);
        } else
          reject && reject();
      break;
      case 'exec':
        if (listenerCount(self, 'exec')) {
          accept = function() {
            if (replied || ending || channel)
              return;

            replied = true;

            if (info.wantReply)
              client._sshstream.channelSuccess(outgoingId);

            channel = new Channel(chaninfo, client, { server: true });

            channel.subtype = self.subtype = info.request;

            return channel;
          };

          self.emit('exec', accept, reject, {
            command: info.command
          });
        } else
          reject && reject();
      break;
      case 'subsystem':
        accept = function() {
          if (replied || ending || channel)
            return;

          replied = true;

          if (info.wantReply)
            client._sshstream.channelSuccess(outgoingId);

          channel = new Channel(chaninfo, client, { server: true });

          channel.subtype = self.subtype = (info.request + ':' + info.subsystem);

          if (info.subsystem === 'sftp') {
            var sftp = new SFTPStream({
              server: true,
              debug: client._sshstream.debug
            });
            channel.pipe(sftp).pipe(channel);

            return sftp;
          } else
            return channel;
        };

        if (info.subsystem === 'sftp' && listenerCount(self, 'sftp'))
          self.emit('sftp', accept, reject);
        else if (info.subsystem !== 'sftp' && listenerCount(self, 'subsystem')) {
          self.emit('subsystem', accept, reject, {
            name: info.subsystem
          });
        } else
          reject && reject();
      break;
      default:
        reject && reject();
    }
  }
  function onEOF() {
    ending = true;
    self.emit('eof');
    self.emit('end');
  }
  function onCLOSE() {
    ending = true;
    self.emit('close');
  }
  client._sshstream
        .on('CHANNEL_REQUEST:' + localChan, onREQUEST)
        .once('CHANNEL_EOF:' + localChan, onEOF)
        .once('CHANNEL_CLOSE:' + localChan, onCLOSE);
}
inherits(Session, EventEmitter);


function AuthContext(stream, username, service, method, cb) {
  EventEmitter.call(this);

  var self = this;

  this.username = this.user = username;
  this.service = service;
  this.method = method;
  this._initialResponse = false;
  this._finalResponse = false;
  this._multistep = false;
  this._cbfinal = function(allowed, methodsLeft, isPartial) {
    if (!self._finalResponse) {
      self._finalResponse = true;
      cb(self, allowed, methodsLeft, isPartial);
    }
  };
  this._stream = stream;
}
inherits(AuthContext, EventEmitter);
AuthContext.prototype.accept = function() {
  this._cleanup && this._cleanup();
  this._initialResponse = true;
  this._cbfinal(true);
};
AuthContext.prototype.reject = function(methodsLeft, isPartial) {
  this._cleanup && this._cleanup();
  this._initialResponse = true;
  this._cbfinal(false, methodsLeft, isPartial);
};

var RE_KBINT_SUBMETHODS = /[ \t\r\n]*,[ \t\r\n]*/g;
function KeyboardAuthContext(stream, username, service, method, submethods, cb) {
  AuthContext.call(this, stream, username, service, method, cb);
  this._multistep = true;

  var self = this;

  this._cb = undefined;
  this._onInfoResponse = function(responses) {
    if (self._cb) {
      var callback = self._cb;
      self._cb = undefined;
      callback(responses);
    }
  };
  this.submethods = submethods.split(RE_KBINT_SUBMETHODS);
  this.on('abort', function() {
    self._cb && self._cb(new Error('Authentication request aborted'));
  });
}
inherits(KeyboardAuthContext, AuthContext);
KeyboardAuthContext.prototype._cleanup = function() {
  this._stream.removeListener('USERAUTH_INFO_RESPONSE', this._onInfoResponse);
};
KeyboardAuthContext.prototype.prompt = function(prompts, title, instructions,
                                                cb) {
  if (!Array.isArray(prompts))
    prompts = [ prompts ];

  if (typeof title === 'function') {
    cb = title;
    title = instructions = undefined;
  } else if (typeof instructions === 'function') {
    cb = instructions;
    instructions = undefined;
  }

  for (var i = 0; i < prompts.length; ++i) {
    if (typeof prompts[i] === 'string') {
      prompts[i] = {
        prompt: prompts[i],
        echo: true
      };
    }
  }

  this._cb = cb;
  this._initialResponse = true;
  this._stream.once('USERAUTH_INFO_RESPONSE', this._onInfoResponse);

  return this._stream.authInfoReq(title, instructions, prompts);
};

function PKAuthContext(stream, username, service, method, pkInfo, cb) {
  AuthContext.call(this, stream, username, service, method, cb);

  this.key = { algo: pkInfo.keyAlgo, data: pkInfo.key };
  this.signature = pkInfo.signature;
  var sigAlgo;
  if (this.signature) {
    // TODO: move key type checking logic to ssh2-streams
    switch (pkInfo.keyAlgo) {
      case 'ssh-rsa':
      case 'ssh-dss':
        sigAlgo = 'sha1';
        break;
      case 'ssh-ed25519':
        sigAlgo = null;
        break;
      case 'ecdsa-sha2-nistp256':
        sigAlgo = 'sha256';
        break;
      case 'ecdsa-sha2-nistp384':
        sigAlgo = 'sha384';
        break;
      case 'ecdsa-sha2-nistp521':
        sigAlgo = 'sha512';
        break;
    }
  }
  this.sigAlgo = sigAlgo;
  this.blob = pkInfo.blob;
}
inherits(PKAuthContext, AuthContext);
PKAuthContext.prototype.accept = function() {
  if (!this.signature) {
    this._initialResponse = true;
    this._stream.authPKOK(this.key.algo, this.key.data);
  } else {
    AuthContext.prototype.accept.call(this);
  }
};

function HostbasedAuthContext(stream, username, service, method, pkInfo, cb) {
  AuthContext.call(this, stream, username, service, method, cb);

  this.key = { algo: pkInfo.keyAlgo, data: pkInfo.key };
  this.signature = pkInfo.signature;
  var sigAlgo;
  if (this.signature) {
    // TODO: move key type checking logic to ssh2-streams
    switch (pkInfo.keyAlgo) {
      case 'ssh-rsa':
      case 'ssh-dss':
        sigAlgo = 'sha1';
        break;
      case 'ssh-ed25519':
        sigAlgo = null;
        break;
      case 'ecdsa-sha2-nistp256':
        sigAlgo = 'sha256';
        break;
      case 'ecdsa-sha2-nistp384':
        sigAlgo = 'sha384';
        break;
      case 'ecdsa-sha2-nistp521':
        sigAlgo = 'sha512';
        break;
    }
  }
  this.sigAlgo = sigAlgo;
  this.blob = pkInfo.blob;
  this.localHostname = pkInfo.localHostname;
  this.localUsername = pkInfo.localUsername;
}
inherits(HostbasedAuthContext, AuthContext);

function PwdAuthContext(stream, username, service, method, password, cb) {
  AuthContext.call(this, stream, username, service, method, cb);

  this.password = password;
}
inherits(PwdAuthContext, AuthContext);


function openChannel(self, type, opts, cb) {
  // ask the client to open a channel for some purpose
  // (e.g. a forwarded TCP connection)
  var localChan = nextChannel(self);
  var initWindow = Channel.MAX_WINDOW;
  var maxPacket = Channel.PACKET_SIZE;
  var ret = true;

  if (localChan === false)
    return cb(new Error('No free channels available'));

  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  self._channels[localChan] = true;

  var sshstream = self._sshstream;
  sshstream.once('CHANNEL_OPEN_CONFIRMATION:' + localChan, function(info) {
    sshstream.removeAllListeners('CHANNEL_OPEN_FAILURE:' + localChan);

    var chaninfo = {
      type: type,
      incoming: {
        id: localChan,
        window: initWindow,
        packetSize: maxPacket,
        state: 'open'
      },
      outgoing: {
        id: info.sender,
        window: info.window,
        packetSize: info.packetSize,
        state: 'open'
      }
    };
    cb(undefined, new Channel(chaninfo, self, { server: true }));
  }).once('CHANNEL_OPEN_FAILURE:' + localChan, function(info) {
    sshstream.removeAllListeners('CHANNEL_OPEN_CONFIRMATION:' + localChan);

    delete self._channels[localChan];

    var err = new Error('(SSH) Channel open failure: ' + info.description);
    err.reason = info.reason;
    err.lang = info.lang;
    cb(err);
  });

  if (type === 'forwarded-tcpip')
    ret = sshstream.forwardedTcpip(localChan, initWindow, maxPacket, opts);
  else if (type === 'x11')
    ret = sshstream.x11(localChan, initWindow, maxPacket, opts);
  else if (type === 'forwarded-streamlocal@openssh.com') {
    ret = sshstream.openssh_forwardedStreamLocal(localChan,
                                                 initWindow,
                                                 maxPacket,
                                                 opts);
  }

  return ret;
}

function nextChannel(self) {
  // get the next available channel number

  // fast path
  if (self._curChan < MAX_CHANNEL)
    return ++self._curChan;

  // slower lookup path
  for (var i = 0, channels = self._channels; i < MAX_CHANNEL; ++i)
    if (!channels[i])
      return i;

  return false;
}


Server.createServer = function(cfg, listener) {
  return new Server(cfg, listener);
};
Server.KEEPALIVE_INTERVAL = 1000;
Server.KEEPALIVE_CLIENT_INTERVAL = 15000;
Server.KEEPALIVE_CLIENT_COUNT_MAX = 3;

module.exports = Server;
module.exports.IncomingClient = Client;


/***/ }),

/***/ 2405:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/*
  Based heavily on the Streaming Boyer-Moore-Horspool C++ implementation
  by Hongli Lai at: https://github.com/FooBarWidget/boyer-moore-horspool
*/
var EventEmitter = __nccwpck_require__(8614).EventEmitter,
    inherits = __nccwpck_require__(1669).inherits;

function jsmemcmp(buf1, pos1, buf2, pos2, num) {
  for (var i = 0; i < num; ++i, ++pos1, ++pos2)
    if (buf1[pos1] !== buf2[pos2])
      return false;
  return true;
}

function SBMH(needle) {
  if (typeof needle === 'string')
    needle = new Buffer(needle);
  var i, j, needle_len = needle.length;

  this.maxMatches = Infinity;
  this.matches = 0;

  this._occ = new Array(256);
  this._lookbehind_size = 0;
  this._needle = needle;
  this._bufpos = 0;

  this._lookbehind = new Buffer(needle_len);

  // Initialize occurrence table.
  for (j = 0; j < 256; ++j)
    this._occ[j] = needle_len;

  // Populate occurrence table with analysis of the needle,
  // ignoring last letter.
  if (needle_len >= 1) {
    for (i = 0; i < needle_len - 1; ++i)
      this._occ[needle[i]] = needle_len - 1 - i;
  }
}
inherits(SBMH, EventEmitter);

SBMH.prototype.reset = function() {
  this._lookbehind_size = 0;
  this.matches = 0;
  this._bufpos = 0;
};

SBMH.prototype.push = function(chunk, pos) {
  var r, chlen;
  if (!Buffer.isBuffer(chunk))
    chunk = new Buffer(chunk, 'binary');
  chlen = chunk.length;
  this._bufpos = pos || 0;
  while (r !== chlen && this.matches < this.maxMatches)
    r = this._sbmh_feed(chunk);
  return r;
};

SBMH.prototype._sbmh_feed = function(data) {
  var len = data.length, needle = this._needle, needle_len = needle.length;

  // Positive: points to a position in `data`
  //           pos == 3 points to data[3]
  // Negative: points to a position in the lookbehind buffer
  //           pos == -2 points to lookbehind[lookbehind_size - 2]
  var pos = -this._lookbehind_size,
      last_needle_char = needle[needle_len - 1],
      occ = this._occ,
      lookbehind = this._lookbehind;

  if (pos < 0) {
    // Lookbehind buffer is not empty. Perform Boyer-Moore-Horspool
    // search with character lookup code that considers both the
    // lookbehind buffer and the current round's haystack data.
    //
    // Loop until
    //   there is a match.
    // or until
    //   we've moved past the position that requires the
    //   lookbehind buffer. In this case we switch to the
    //   optimized loop.
    // or until
    //   the character to look at lies outside the haystack.
    while (pos < 0 && pos <= len - needle_len) {
       var ch = this._sbmh_lookup_char(data, pos + needle_len - 1);

      if (ch === last_needle_char
          && this._sbmh_memcmp(data, pos, needle_len - 1)) {
        this._lookbehind_size = 0;
        ++this.matches;
        if (pos > -this._lookbehind_size)
          this.emit('info', true, lookbehind, 0, this._lookbehind_size + pos);
        else
          this.emit('info', true);

        this._bufpos = pos + needle_len;
        return pos + needle_len;
      } else
        pos += occ[ch];
    }

    // No match.

    if (pos < 0) {
      // There's too few data for Boyer-Moore-Horspool to run,
      // so let's use a different algorithm to skip as much as
      // we can.
      // Forward pos until
      //   the trailing part of lookbehind + data
      //   looks like the beginning of the needle
      // or until
      //   pos == 0
      while (pos < 0 && !this._sbmh_memcmp(data, pos, len - pos))
        pos++;
    }

    if (pos >= 0) {
      // Discard lookbehind buffer.
      this.emit('info', false, lookbehind, 0, this._lookbehind_size);
      this._lookbehind_size = 0;
    } else {
      // Cut off part of the lookbehind buffer that has
      // been processed and append the entire haystack
      // into it.
      var bytesToCutOff = this._lookbehind_size + pos;

      if (bytesToCutOff > 0) {
        // The cut off data is guaranteed not to contain the needle.
        this.emit('info', false, lookbehind, 0, bytesToCutOff);
      }

      lookbehind.copy(lookbehind, 0, bytesToCutOff,
                      this._lookbehind_size - bytesToCutOff);
      this._lookbehind_size -= bytesToCutOff;

      data.copy(lookbehind, this._lookbehind_size);
      this._lookbehind_size += len;

      this._bufpos = len;
      return len;
    }
  }

  if (pos >= 0)
    pos += this._bufpos;

  // Lookbehind buffer is now empty. Perform Boyer-Moore-Horspool
  // search with optimized character lookup code that only considers
  // the current round's haystack data.
  while (pos <= len - needle_len) {
    var ch = data[pos + needle_len - 1];

    if (ch === last_needle_char
        && data[pos] === needle[0]
        && jsmemcmp(needle, 0, data, pos, needle_len - 1)) {
      ++this.matches;
      if (pos > 0)
        this.emit('info', true, data, this._bufpos, pos);
      else
        this.emit('info', true);

      this._bufpos = pos + needle_len;
      return pos + needle_len;
    } else
      pos += occ[ch];
  }

  // There was no match. If there's trailing haystack data that we cannot
  // match yet using the Boyer-Moore-Horspool algorithm (because the trailing
  // data is less than the needle size) then match using a modified
  // algorithm that starts matching from the beginning instead of the end.
  // Whatever trailing data is left after running this algorithm is added to
  // the lookbehind buffer.
  if (pos < len) {
    while (pos < len && (data[pos] !== needle[0]
                         || !jsmemcmp(data, pos, needle, 0, len - pos))) {
      ++pos;
    }
    if (pos < len) {
      data.copy(lookbehind, 0, pos, pos + (len - pos));
      this._lookbehind_size = len - pos;
    }
  }

  // Everything until pos is guaranteed not to contain needle data.
  if (pos > 0)
    this.emit('info', false, data, this._bufpos, pos < len ? pos : len);

  this._bufpos = len;
  return len;
};

SBMH.prototype._sbmh_lookup_char = function(data, pos) {
  if (pos < 0)
    return this._lookbehind[this._lookbehind_size + pos];
  else
    return data[pos];
}

SBMH.prototype._sbmh_memcmp = function(data, pos, len) {
  var i = 0;

  while (i < len) {
    if (this._sbmh_lookup_char(data, pos + i) === this._needle[i])
      ++i;
    else
      return false;
  }
  return true;
}

module.exports = SBMH;


/***/ }),

/***/ 8174:
/***/ ((module) => {

"use strict";


module.exports = input => {
	const LF = typeof input === 'string' ? '\n' : '\n'.charCodeAt();
	const CR = typeof input === 'string' ? '\r' : '\r'.charCodeAt();

	if (input[input.length - 1] === LF) {
		input = input.slice(0, input.length - 1);
	}

	if (input[input.length - 1] === CR) {
		input = input.slice(0, input.length - 1);
	}

	return input;
};


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1631);
var tls = __nccwpck_require__(4016);
var http = __nccwpck_require__(8605);
var https = __nccwpck_require__(7211);
var events = __nccwpck_require__(8614);
var assert = __nccwpck_require__(2357);
var util = __nccwpck_require__(1669);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 8729:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

(function(nacl) {
'use strict';

// Ported in 2014 by Dmitry Chestnykh and Devi Mandiri.
// Public domain.
//
// Implementation derived from TweetNaCl version 20140427.
// See for details: http://tweetnacl.cr.yp.to/

var gf = function(init) {
  var i, r = new Float64Array(16);
  if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
  return r;
};

//  Pluggable, initialized in high-level API below.
var randombytes = function(/* x, n */) { throw new Error('no PRNG'); };

var _0 = new Uint8Array(16);
var _9 = new Uint8Array(32); _9[0] = 9;

var gf0 = gf(),
    gf1 = gf([1]),
    _121665 = gf([0xdb41, 1]),
    D = gf([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]),
    D2 = gf([0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0, 0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406]),
    X = gf([0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169]),
    Y = gf([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]),
    I = gf([0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]);

function ts64(x, i, h, l) {
  x[i]   = (h >> 24) & 0xff;
  x[i+1] = (h >> 16) & 0xff;
  x[i+2] = (h >>  8) & 0xff;
  x[i+3] = h & 0xff;
  x[i+4] = (l >> 24)  & 0xff;
  x[i+5] = (l >> 16)  & 0xff;
  x[i+6] = (l >>  8)  & 0xff;
  x[i+7] = l & 0xff;
}

function vn(x, xi, y, yi, n) {
  var i,d = 0;
  for (i = 0; i < n; i++) d |= x[xi+i]^y[yi+i];
  return (1 & ((d - 1) >>> 8)) - 1;
}

function crypto_verify_16(x, xi, y, yi) {
  return vn(x,xi,y,yi,16);
}

function crypto_verify_32(x, xi, y, yi) {
  return vn(x,xi,y,yi,32);
}

function core_salsa20(o, p, k, c) {
  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u;

  for (var i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0;
    x4 ^= u<<7 | u>>>(32-7);
    u = x4 + x0 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x4 | 0;
    x12 ^= u<<13 | u>>>(32-13);
    u = x12 + x8 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x1 | 0;
    x9 ^= u<<7 | u>>>(32-7);
    u = x9 + x5 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x9 | 0;
    x1 ^= u<<13 | u>>>(32-13);
    u = x1 + x13 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x6 | 0;
    x14 ^= u<<7 | u>>>(32-7);
    u = x14 + x10 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x14 | 0;
    x6 ^= u<<13 | u>>>(32-13);
    u = x6 + x2 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x11 | 0;
    x3 ^= u<<7 | u>>>(32-7);
    u = x3 + x15 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x3 | 0;
    x11 ^= u<<13 | u>>>(32-13);
    u = x11 + x7 | 0;
    x15 ^= u<<18 | u>>>(32-18);

    u = x0 + x3 | 0;
    x1 ^= u<<7 | u>>>(32-7);
    u = x1 + x0 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x1 | 0;
    x3 ^= u<<13 | u>>>(32-13);
    u = x3 + x2 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x4 | 0;
    x6 ^= u<<7 | u>>>(32-7);
    u = x6 + x5 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x6 | 0;
    x4 ^= u<<13 | u>>>(32-13);
    u = x4 + x7 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x9 | 0;
    x11 ^= u<<7 | u>>>(32-7);
    u = x11 + x10 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x11 | 0;
    x9 ^= u<<13 | u>>>(32-13);
    u = x9 + x8 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x14 | 0;
    x12 ^= u<<7 | u>>>(32-7);
    u = x12 + x15 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x12 | 0;
    x14 ^= u<<13 | u>>>(32-13);
    u = x14 + x13 | 0;
    x15 ^= u<<18 | u>>>(32-18);
  }
   x0 =  x0 +  j0 | 0;
   x1 =  x1 +  j1 | 0;
   x2 =  x2 +  j2 | 0;
   x3 =  x3 +  j3 | 0;
   x4 =  x4 +  j4 | 0;
   x5 =  x5 +  j5 | 0;
   x6 =  x6 +  j6 | 0;
   x7 =  x7 +  j7 | 0;
   x8 =  x8 +  j8 | 0;
   x9 =  x9 +  j9 | 0;
  x10 = x10 + j10 | 0;
  x11 = x11 + j11 | 0;
  x12 = x12 + j12 | 0;
  x13 = x13 + j13 | 0;
  x14 = x14 + j14 | 0;
  x15 = x15 + j15 | 0;

  o[ 0] = x0 >>>  0 & 0xff;
  o[ 1] = x0 >>>  8 & 0xff;
  o[ 2] = x0 >>> 16 & 0xff;
  o[ 3] = x0 >>> 24 & 0xff;

  o[ 4] = x1 >>>  0 & 0xff;
  o[ 5] = x1 >>>  8 & 0xff;
  o[ 6] = x1 >>> 16 & 0xff;
  o[ 7] = x1 >>> 24 & 0xff;

  o[ 8] = x2 >>>  0 & 0xff;
  o[ 9] = x2 >>>  8 & 0xff;
  o[10] = x2 >>> 16 & 0xff;
  o[11] = x2 >>> 24 & 0xff;

  o[12] = x3 >>>  0 & 0xff;
  o[13] = x3 >>>  8 & 0xff;
  o[14] = x3 >>> 16 & 0xff;
  o[15] = x3 >>> 24 & 0xff;

  o[16] = x4 >>>  0 & 0xff;
  o[17] = x4 >>>  8 & 0xff;
  o[18] = x4 >>> 16 & 0xff;
  o[19] = x4 >>> 24 & 0xff;

  o[20] = x5 >>>  0 & 0xff;
  o[21] = x5 >>>  8 & 0xff;
  o[22] = x5 >>> 16 & 0xff;
  o[23] = x5 >>> 24 & 0xff;

  o[24] = x6 >>>  0 & 0xff;
  o[25] = x6 >>>  8 & 0xff;
  o[26] = x6 >>> 16 & 0xff;
  o[27] = x6 >>> 24 & 0xff;

  o[28] = x7 >>>  0 & 0xff;
  o[29] = x7 >>>  8 & 0xff;
  o[30] = x7 >>> 16 & 0xff;
  o[31] = x7 >>> 24 & 0xff;

  o[32] = x8 >>>  0 & 0xff;
  o[33] = x8 >>>  8 & 0xff;
  o[34] = x8 >>> 16 & 0xff;
  o[35] = x8 >>> 24 & 0xff;

  o[36] = x9 >>>  0 & 0xff;
  o[37] = x9 >>>  8 & 0xff;
  o[38] = x9 >>> 16 & 0xff;
  o[39] = x9 >>> 24 & 0xff;

  o[40] = x10 >>>  0 & 0xff;
  o[41] = x10 >>>  8 & 0xff;
  o[42] = x10 >>> 16 & 0xff;
  o[43] = x10 >>> 24 & 0xff;

  o[44] = x11 >>>  0 & 0xff;
  o[45] = x11 >>>  8 & 0xff;
  o[46] = x11 >>> 16 & 0xff;
  o[47] = x11 >>> 24 & 0xff;

  o[48] = x12 >>>  0 & 0xff;
  o[49] = x12 >>>  8 & 0xff;
  o[50] = x12 >>> 16 & 0xff;
  o[51] = x12 >>> 24 & 0xff;

  o[52] = x13 >>>  0 & 0xff;
  o[53] = x13 >>>  8 & 0xff;
  o[54] = x13 >>> 16 & 0xff;
  o[55] = x13 >>> 24 & 0xff;

  o[56] = x14 >>>  0 & 0xff;
  o[57] = x14 >>>  8 & 0xff;
  o[58] = x14 >>> 16 & 0xff;
  o[59] = x14 >>> 24 & 0xff;

  o[60] = x15 >>>  0 & 0xff;
  o[61] = x15 >>>  8 & 0xff;
  o[62] = x15 >>> 16 & 0xff;
  o[63] = x15 >>> 24 & 0xff;
}

function core_hsalsa20(o,p,k,c) {
  var j0  = c[ 0] & 0xff | (c[ 1] & 0xff)<<8 | (c[ 2] & 0xff)<<16 | (c[ 3] & 0xff)<<24,
      j1  = k[ 0] & 0xff | (k[ 1] & 0xff)<<8 | (k[ 2] & 0xff)<<16 | (k[ 3] & 0xff)<<24,
      j2  = k[ 4] & 0xff | (k[ 5] & 0xff)<<8 | (k[ 6] & 0xff)<<16 | (k[ 7] & 0xff)<<24,
      j3  = k[ 8] & 0xff | (k[ 9] & 0xff)<<8 | (k[10] & 0xff)<<16 | (k[11] & 0xff)<<24,
      j4  = k[12] & 0xff | (k[13] & 0xff)<<8 | (k[14] & 0xff)<<16 | (k[15] & 0xff)<<24,
      j5  = c[ 4] & 0xff | (c[ 5] & 0xff)<<8 | (c[ 6] & 0xff)<<16 | (c[ 7] & 0xff)<<24,
      j6  = p[ 0] & 0xff | (p[ 1] & 0xff)<<8 | (p[ 2] & 0xff)<<16 | (p[ 3] & 0xff)<<24,
      j7  = p[ 4] & 0xff | (p[ 5] & 0xff)<<8 | (p[ 6] & 0xff)<<16 | (p[ 7] & 0xff)<<24,
      j8  = p[ 8] & 0xff | (p[ 9] & 0xff)<<8 | (p[10] & 0xff)<<16 | (p[11] & 0xff)<<24,
      j9  = p[12] & 0xff | (p[13] & 0xff)<<8 | (p[14] & 0xff)<<16 | (p[15] & 0xff)<<24,
      j10 = c[ 8] & 0xff | (c[ 9] & 0xff)<<8 | (c[10] & 0xff)<<16 | (c[11] & 0xff)<<24,
      j11 = k[16] & 0xff | (k[17] & 0xff)<<8 | (k[18] & 0xff)<<16 | (k[19] & 0xff)<<24,
      j12 = k[20] & 0xff | (k[21] & 0xff)<<8 | (k[22] & 0xff)<<16 | (k[23] & 0xff)<<24,
      j13 = k[24] & 0xff | (k[25] & 0xff)<<8 | (k[26] & 0xff)<<16 | (k[27] & 0xff)<<24,
      j14 = k[28] & 0xff | (k[29] & 0xff)<<8 | (k[30] & 0xff)<<16 | (k[31] & 0xff)<<24,
      j15 = c[12] & 0xff | (c[13] & 0xff)<<8 | (c[14] & 0xff)<<16 | (c[15] & 0xff)<<24;

  var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7,
      x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14,
      x15 = j15, u;

  for (var i = 0; i < 20; i += 2) {
    u = x0 + x12 | 0;
    x4 ^= u<<7 | u>>>(32-7);
    u = x4 + x0 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x4 | 0;
    x12 ^= u<<13 | u>>>(32-13);
    u = x12 + x8 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x1 | 0;
    x9 ^= u<<7 | u>>>(32-7);
    u = x9 + x5 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x9 | 0;
    x1 ^= u<<13 | u>>>(32-13);
    u = x1 + x13 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x6 | 0;
    x14 ^= u<<7 | u>>>(32-7);
    u = x14 + x10 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x14 | 0;
    x6 ^= u<<13 | u>>>(32-13);
    u = x6 + x2 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x11 | 0;
    x3 ^= u<<7 | u>>>(32-7);
    u = x3 + x15 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x3 | 0;
    x11 ^= u<<13 | u>>>(32-13);
    u = x11 + x7 | 0;
    x15 ^= u<<18 | u>>>(32-18);

    u = x0 + x3 | 0;
    x1 ^= u<<7 | u>>>(32-7);
    u = x1 + x0 | 0;
    x2 ^= u<<9 | u>>>(32-9);
    u = x2 + x1 | 0;
    x3 ^= u<<13 | u>>>(32-13);
    u = x3 + x2 | 0;
    x0 ^= u<<18 | u>>>(32-18);

    u = x5 + x4 | 0;
    x6 ^= u<<7 | u>>>(32-7);
    u = x6 + x5 | 0;
    x7 ^= u<<9 | u>>>(32-9);
    u = x7 + x6 | 0;
    x4 ^= u<<13 | u>>>(32-13);
    u = x4 + x7 | 0;
    x5 ^= u<<18 | u>>>(32-18);

    u = x10 + x9 | 0;
    x11 ^= u<<7 | u>>>(32-7);
    u = x11 + x10 | 0;
    x8 ^= u<<9 | u>>>(32-9);
    u = x8 + x11 | 0;
    x9 ^= u<<13 | u>>>(32-13);
    u = x9 + x8 | 0;
    x10 ^= u<<18 | u>>>(32-18);

    u = x15 + x14 | 0;
    x12 ^= u<<7 | u>>>(32-7);
    u = x12 + x15 | 0;
    x13 ^= u<<9 | u>>>(32-9);
    u = x13 + x12 | 0;
    x14 ^= u<<13 | u>>>(32-13);
    u = x14 + x13 | 0;
    x15 ^= u<<18 | u>>>(32-18);
  }

  o[ 0] = x0 >>>  0 & 0xff;
  o[ 1] = x0 >>>  8 & 0xff;
  o[ 2] = x0 >>> 16 & 0xff;
  o[ 3] = x0 >>> 24 & 0xff;

  o[ 4] = x5 >>>  0 & 0xff;
  o[ 5] = x5 >>>  8 & 0xff;
  o[ 6] = x5 >>> 16 & 0xff;
  o[ 7] = x5 >>> 24 & 0xff;

  o[ 8] = x10 >>>  0 & 0xff;
  o[ 9] = x10 >>>  8 & 0xff;
  o[10] = x10 >>> 16 & 0xff;
  o[11] = x10 >>> 24 & 0xff;

  o[12] = x15 >>>  0 & 0xff;
  o[13] = x15 >>>  8 & 0xff;
  o[14] = x15 >>> 16 & 0xff;
  o[15] = x15 >>> 24 & 0xff;

  o[16] = x6 >>>  0 & 0xff;
  o[17] = x6 >>>  8 & 0xff;
  o[18] = x6 >>> 16 & 0xff;
  o[19] = x6 >>> 24 & 0xff;

  o[20] = x7 >>>  0 & 0xff;
  o[21] = x7 >>>  8 & 0xff;
  o[22] = x7 >>> 16 & 0xff;
  o[23] = x7 >>> 24 & 0xff;

  o[24] = x8 >>>  0 & 0xff;
  o[25] = x8 >>>  8 & 0xff;
  o[26] = x8 >>> 16 & 0xff;
  o[27] = x8 >>> 24 & 0xff;

  o[28] = x9 >>>  0 & 0xff;
  o[29] = x9 >>>  8 & 0xff;
  o[30] = x9 >>> 16 & 0xff;
  o[31] = x9 >>> 24 & 0xff;
}

function crypto_core_salsa20(out,inp,k,c) {
  core_salsa20(out,inp,k,c);
}

function crypto_core_hsalsa20(out,inp,k,c) {
  core_hsalsa20(out,inp,k,c);
}

var sigma = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);
            // "expand 32-byte k"

function crypto_stream_salsa20_xor(c,cpos,m,mpos,b,n,k) {
  var z = new Uint8Array(16), x = new Uint8Array(64);
  var u, i;
  for (i = 0; i < 16; i++) z[i] = 0;
  for (i = 0; i < 8; i++) z[i] = n[i];
  while (b >= 64) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < 64; i++) c[cpos+i] = m[mpos+i] ^ x[i];
    u = 1;
    for (i = 8; i < 16; i++) {
      u = u + (z[i] & 0xff) | 0;
      z[i] = u & 0xff;
      u >>>= 8;
    }
    b -= 64;
    cpos += 64;
    mpos += 64;
  }
  if (b > 0) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < b; i++) c[cpos+i] = m[mpos+i] ^ x[i];
  }
  return 0;
}

function crypto_stream_salsa20(c,cpos,b,n,k) {
  var z = new Uint8Array(16), x = new Uint8Array(64);
  var u, i;
  for (i = 0; i < 16; i++) z[i] = 0;
  for (i = 0; i < 8; i++) z[i] = n[i];
  while (b >= 64) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < 64; i++) c[cpos+i] = x[i];
    u = 1;
    for (i = 8; i < 16; i++) {
      u = u + (z[i] & 0xff) | 0;
      z[i] = u & 0xff;
      u >>>= 8;
    }
    b -= 64;
    cpos += 64;
  }
  if (b > 0) {
    crypto_core_salsa20(x,z,k,sigma);
    for (i = 0; i < b; i++) c[cpos+i] = x[i];
  }
  return 0;
}

function crypto_stream(c,cpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  var sn = new Uint8Array(8);
  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
  return crypto_stream_salsa20(c,cpos,d,sn,s);
}

function crypto_stream_xor(c,cpos,m,mpos,d,n,k) {
  var s = new Uint8Array(32);
  crypto_core_hsalsa20(s,n,k,sigma);
  var sn = new Uint8Array(8);
  for (var i = 0; i < 8; i++) sn[i] = n[i+16];
  return crypto_stream_salsa20_xor(c,cpos,m,mpos,d,sn,s);
}

/*
* Port of Andrew Moon's Poly1305-donna-16. Public domain.
* https://github.com/floodyberry/poly1305-donna
*/

var poly1305 = function(key) {
  this.buffer = new Uint8Array(16);
  this.r = new Uint16Array(10);
  this.h = new Uint16Array(10);
  this.pad = new Uint16Array(8);
  this.leftover = 0;
  this.fin = 0;

  var t0, t1, t2, t3, t4, t5, t6, t7;

  t0 = key[ 0] & 0xff | (key[ 1] & 0xff) << 8; this.r[0] = ( t0                     ) & 0x1fff;
  t1 = key[ 2] & 0xff | (key[ 3] & 0xff) << 8; this.r[1] = ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
  t2 = key[ 4] & 0xff | (key[ 5] & 0xff) << 8; this.r[2] = ((t1 >>> 10) | (t2 <<  6)) & 0x1f03;
  t3 = key[ 6] & 0xff | (key[ 7] & 0xff) << 8; this.r[3] = ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
  t4 = key[ 8] & 0xff | (key[ 9] & 0xff) << 8; this.r[4] = ((t3 >>>  4) | (t4 << 12)) & 0x00ff;
  this.r[5] = ((t4 >>>  1)) & 0x1ffe;
  t5 = key[10] & 0xff | (key[11] & 0xff) << 8; this.r[6] = ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
  t6 = key[12] & 0xff | (key[13] & 0xff) << 8; this.r[7] = ((t5 >>> 11) | (t6 <<  5)) & 0x1f81;
  t7 = key[14] & 0xff | (key[15] & 0xff) << 8; this.r[8] = ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
  this.r[9] = ((t7 >>>  5)) & 0x007f;

  this.pad[0] = key[16] & 0xff | (key[17] & 0xff) << 8;
  this.pad[1] = key[18] & 0xff | (key[19] & 0xff) << 8;
  this.pad[2] = key[20] & 0xff | (key[21] & 0xff) << 8;
  this.pad[3] = key[22] & 0xff | (key[23] & 0xff) << 8;
  this.pad[4] = key[24] & 0xff | (key[25] & 0xff) << 8;
  this.pad[5] = key[26] & 0xff | (key[27] & 0xff) << 8;
  this.pad[6] = key[28] & 0xff | (key[29] & 0xff) << 8;
  this.pad[7] = key[30] & 0xff | (key[31] & 0xff) << 8;
};

poly1305.prototype.blocks = function(m, mpos, bytes) {
  var hibit = this.fin ? 0 : (1 << 11);
  var t0, t1, t2, t3, t4, t5, t6, t7, c;
  var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;

  var h0 = this.h[0],
      h1 = this.h[1],
      h2 = this.h[2],
      h3 = this.h[3],
      h4 = this.h[4],
      h5 = this.h[5],
      h6 = this.h[6],
      h7 = this.h[7],
      h8 = this.h[8],
      h9 = this.h[9];

  var r0 = this.r[0],
      r1 = this.r[1],
      r2 = this.r[2],
      r3 = this.r[3],
      r4 = this.r[4],
      r5 = this.r[5],
      r6 = this.r[6],
      r7 = this.r[7],
      r8 = this.r[8],
      r9 = this.r[9];

  while (bytes >= 16) {
    t0 = m[mpos+ 0] & 0xff | (m[mpos+ 1] & 0xff) << 8; h0 += ( t0                     ) & 0x1fff;
    t1 = m[mpos+ 2] & 0xff | (m[mpos+ 3] & 0xff) << 8; h1 += ((t0 >>> 13) | (t1 <<  3)) & 0x1fff;
    t2 = m[mpos+ 4] & 0xff | (m[mpos+ 5] & 0xff) << 8; h2 += ((t1 >>> 10) | (t2 <<  6)) & 0x1fff;
    t3 = m[mpos+ 6] & 0xff | (m[mpos+ 7] & 0xff) << 8; h3 += ((t2 >>>  7) | (t3 <<  9)) & 0x1fff;
    t4 = m[mpos+ 8] & 0xff | (m[mpos+ 9] & 0xff) << 8; h4 += ((t3 >>>  4) | (t4 << 12)) & 0x1fff;
    h5 += ((t4 >>>  1)) & 0x1fff;
    t5 = m[mpos+10] & 0xff | (m[mpos+11] & 0xff) << 8; h6 += ((t4 >>> 14) | (t5 <<  2)) & 0x1fff;
    t6 = m[mpos+12] & 0xff | (m[mpos+13] & 0xff) << 8; h7 += ((t5 >>> 11) | (t6 <<  5)) & 0x1fff;
    t7 = m[mpos+14] & 0xff | (m[mpos+15] & 0xff) << 8; h8 += ((t6 >>>  8) | (t7 <<  8)) & 0x1fff;
    h9 += ((t7 >>> 5)) | hibit;

    c = 0;

    d0 = c;
    d0 += h0 * r0;
    d0 += h1 * (5 * r9);
    d0 += h2 * (5 * r8);
    d0 += h3 * (5 * r7);
    d0 += h4 * (5 * r6);
    c = (d0 >>> 13); d0 &= 0x1fff;
    d0 += h5 * (5 * r5);
    d0 += h6 * (5 * r4);
    d0 += h7 * (5 * r3);
    d0 += h8 * (5 * r2);
    d0 += h9 * (5 * r1);
    c += (d0 >>> 13); d0 &= 0x1fff;

    d1 = c;
    d1 += h0 * r1;
    d1 += h1 * r0;
    d1 += h2 * (5 * r9);
    d1 += h3 * (5 * r8);
    d1 += h4 * (5 * r7);
    c = (d1 >>> 13); d1 &= 0x1fff;
    d1 += h5 * (5 * r6);
    d1 += h6 * (5 * r5);
    d1 += h7 * (5 * r4);
    d1 += h8 * (5 * r3);
    d1 += h9 * (5 * r2);
    c += (d1 >>> 13); d1 &= 0x1fff;

    d2 = c;
    d2 += h0 * r2;
    d2 += h1 * r1;
    d2 += h2 * r0;
    d2 += h3 * (5 * r9);
    d2 += h4 * (5 * r8);
    c = (d2 >>> 13); d2 &= 0x1fff;
    d2 += h5 * (5 * r7);
    d2 += h6 * (5 * r6);
    d2 += h7 * (5 * r5);
    d2 += h8 * (5 * r4);
    d2 += h9 * (5 * r3);
    c += (d2 >>> 13); d2 &= 0x1fff;

    d3 = c;
    d3 += h0 * r3;
    d3 += h1 * r2;
    d3 += h2 * r1;
    d3 += h3 * r0;
    d3 += h4 * (5 * r9);
    c = (d3 >>> 13); d3 &= 0x1fff;
    d3 += h5 * (5 * r8);
    d3 += h6 * (5 * r7);
    d3 += h7 * (5 * r6);
    d3 += h8 * (5 * r5);
    d3 += h9 * (5 * r4);
    c += (d3 >>> 13); d3 &= 0x1fff;

    d4 = c;
    d4 += h0 * r4;
    d4 += h1 * r3;
    d4 += h2 * r2;
    d4 += h3 * r1;
    d4 += h4 * r0;
    c = (d4 >>> 13); d4 &= 0x1fff;
    d4 += h5 * (5 * r9);
    d4 += h6 * (5 * r8);
    d4 += h7 * (5 * r7);
    d4 += h8 * (5 * r6);
    d4 += h9 * (5 * r5);
    c += (d4 >>> 13); d4 &= 0x1fff;

    d5 = c;
    d5 += h0 * r5;
    d5 += h1 * r4;
    d5 += h2 * r3;
    d5 += h3 * r2;
    d5 += h4 * r1;
    c = (d5 >>> 13); d5 &= 0x1fff;
    d5 += h5 * r0;
    d5 += h6 * (5 * r9);
    d5 += h7 * (5 * r8);
    d5 += h8 * (5 * r7);
    d5 += h9 * (5 * r6);
    c += (d5 >>> 13); d5 &= 0x1fff;

    d6 = c;
    d6 += h0 * r6;
    d6 += h1 * r5;
    d6 += h2 * r4;
    d6 += h3 * r3;
    d6 += h4 * r2;
    c = (d6 >>> 13); d6 &= 0x1fff;
    d6 += h5 * r1;
    d6 += h6 * r0;
    d6 += h7 * (5 * r9);
    d6 += h8 * (5 * r8);
    d6 += h9 * (5 * r7);
    c += (d6 >>> 13); d6 &= 0x1fff;

    d7 = c;
    d7 += h0 * r7;
    d7 += h1 * r6;
    d7 += h2 * r5;
    d7 += h3 * r4;
    d7 += h4 * r3;
    c = (d7 >>> 13); d7 &= 0x1fff;
    d7 += h5 * r2;
    d7 += h6 * r1;
    d7 += h7 * r0;
    d7 += h8 * (5 * r9);
    d7 += h9 * (5 * r8);
    c += (d7 >>> 13); d7 &= 0x1fff;

    d8 = c;
    d8 += h0 * r8;
    d8 += h1 * r7;
    d8 += h2 * r6;
    d8 += h3 * r5;
    d8 += h4 * r4;
    c = (d8 >>> 13); d8 &= 0x1fff;
    d8 += h5 * r3;
    d8 += h6 * r2;
    d8 += h7 * r1;
    d8 += h8 * r0;
    d8 += h9 * (5 * r9);
    c += (d8 >>> 13); d8 &= 0x1fff;

    d9 = c;
    d9 += h0 * r9;
    d9 += h1 * r8;
    d9 += h2 * r7;
    d9 += h3 * r6;
    d9 += h4 * r5;
    c = (d9 >>> 13); d9 &= 0x1fff;
    d9 += h5 * r4;
    d9 += h6 * r3;
    d9 += h7 * r2;
    d9 += h8 * r1;
    d9 += h9 * r0;
    c += (d9 >>> 13); d9 &= 0x1fff;

    c = (((c << 2) + c)) | 0;
    c = (c + d0) | 0;
    d0 = c & 0x1fff;
    c = (c >>> 13);
    d1 += c;

    h0 = d0;
    h1 = d1;
    h2 = d2;
    h3 = d3;
    h4 = d4;
    h5 = d5;
    h6 = d6;
    h7 = d7;
    h8 = d8;
    h9 = d9;

    mpos += 16;
    bytes -= 16;
  }
  this.h[0] = h0;
  this.h[1] = h1;
  this.h[2] = h2;
  this.h[3] = h3;
  this.h[4] = h4;
  this.h[5] = h5;
  this.h[6] = h6;
  this.h[7] = h7;
  this.h[8] = h8;
  this.h[9] = h9;
};

poly1305.prototype.finish = function(mac, macpos) {
  var g = new Uint16Array(10);
  var c, mask, f, i;

  if (this.leftover) {
    i = this.leftover;
    this.buffer[i++] = 1;
    for (; i < 16; i++) this.buffer[i] = 0;
    this.fin = 1;
    this.blocks(this.buffer, 0, 16);
  }

  c = this.h[1] >>> 13;
  this.h[1] &= 0x1fff;
  for (i = 2; i < 10; i++) {
    this.h[i] += c;
    c = this.h[i] >>> 13;
    this.h[i] &= 0x1fff;
  }
  this.h[0] += (c * 5);
  c = this.h[0] >>> 13;
  this.h[0] &= 0x1fff;
  this.h[1] += c;
  c = this.h[1] >>> 13;
  this.h[1] &= 0x1fff;
  this.h[2] += c;

  g[0] = this.h[0] + 5;
  c = g[0] >>> 13;
  g[0] &= 0x1fff;
  for (i = 1; i < 10; i++) {
    g[i] = this.h[i] + c;
    c = g[i] >>> 13;
    g[i] &= 0x1fff;
  }
  g[9] -= (1 << 13);

  mask = (c ^ 1) - 1;
  for (i = 0; i < 10; i++) g[i] &= mask;
  mask = ~mask;
  for (i = 0; i < 10; i++) this.h[i] = (this.h[i] & mask) | g[i];

  this.h[0] = ((this.h[0]       ) | (this.h[1] << 13)                    ) & 0xffff;
  this.h[1] = ((this.h[1] >>>  3) | (this.h[2] << 10)                    ) & 0xffff;
  this.h[2] = ((this.h[2] >>>  6) | (this.h[3] <<  7)                    ) & 0xffff;
  this.h[3] = ((this.h[3] >>>  9) | (this.h[4] <<  4)                    ) & 0xffff;
  this.h[4] = ((this.h[4] >>> 12) | (this.h[5] <<  1) | (this.h[6] << 14)) & 0xffff;
  this.h[5] = ((this.h[6] >>>  2) | (this.h[7] << 11)                    ) & 0xffff;
  this.h[6] = ((this.h[7] >>>  5) | (this.h[8] <<  8)                    ) & 0xffff;
  this.h[7] = ((this.h[8] >>>  8) | (this.h[9] <<  5)                    ) & 0xffff;

  f = this.h[0] + this.pad[0];
  this.h[0] = f & 0xffff;
  for (i = 1; i < 8; i++) {
    f = (((this.h[i] + this.pad[i]) | 0) + (f >>> 16)) | 0;
    this.h[i] = f & 0xffff;
  }

  mac[macpos+ 0] = (this.h[0] >>> 0) & 0xff;
  mac[macpos+ 1] = (this.h[0] >>> 8) & 0xff;
  mac[macpos+ 2] = (this.h[1] >>> 0) & 0xff;
  mac[macpos+ 3] = (this.h[1] >>> 8) & 0xff;
  mac[macpos+ 4] = (this.h[2] >>> 0) & 0xff;
  mac[macpos+ 5] = (this.h[2] >>> 8) & 0xff;
  mac[macpos+ 6] = (this.h[3] >>> 0) & 0xff;
  mac[macpos+ 7] = (this.h[3] >>> 8) & 0xff;
  mac[macpos+ 8] = (this.h[4] >>> 0) & 0xff;
  mac[macpos+ 9] = (this.h[4] >>> 8) & 0xff;
  mac[macpos+10] = (this.h[5] >>> 0) & 0xff;
  mac[macpos+11] = (this.h[5] >>> 8) & 0xff;
  mac[macpos+12] = (this.h[6] >>> 0) & 0xff;
  mac[macpos+13] = (this.h[6] >>> 8) & 0xff;
  mac[macpos+14] = (this.h[7] >>> 0) & 0xff;
  mac[macpos+15] = (this.h[7] >>> 8) & 0xff;
};

poly1305.prototype.update = function(m, mpos, bytes) {
  var i, want;

  if (this.leftover) {
    want = (16 - this.leftover);
    if (want > bytes)
      want = bytes;
    for (i = 0; i < want; i++)
      this.buffer[this.leftover + i] = m[mpos+i];
    bytes -= want;
    mpos += want;
    this.leftover += want;
    if (this.leftover < 16)
      return;
    this.blocks(this.buffer, 0, 16);
    this.leftover = 0;
  }

  if (bytes >= 16) {
    want = bytes - (bytes % 16);
    this.blocks(m, mpos, want);
    mpos += want;
    bytes -= want;
  }

  if (bytes) {
    for (i = 0; i < bytes; i++)
      this.buffer[this.leftover + i] = m[mpos+i];
    this.leftover += bytes;
  }
};

function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
  var s = new poly1305(k);
  s.update(m, mpos, n);
  s.finish(out, outpos);
  return 0;
}

function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
  var x = new Uint8Array(16);
  crypto_onetimeauth(x,0,m,mpos,n,k);
  return crypto_verify_16(h,hpos,x,0);
}

function crypto_secretbox(c,m,d,n,k) {
  var i;
  if (d < 32) return -1;
  crypto_stream_xor(c,0,m,0,d,n,k);
  crypto_onetimeauth(c, 16, c, 32, d - 32, c);
  for (i = 0; i < 16; i++) c[i] = 0;
  return 0;
}

function crypto_secretbox_open(m,c,d,n,k) {
  var i;
  var x = new Uint8Array(32);
  if (d < 32) return -1;
  crypto_stream(x,0,32,n,k);
  if (crypto_onetimeauth_verify(c, 16,c, 32,d - 32,x) !== 0) return -1;
  crypto_stream_xor(m,0,c,0,d,n,k);
  for (i = 0; i < 32; i++) m[i] = 0;
  return 0;
}

function set25519(r, a) {
  var i;
  for (i = 0; i < 16; i++) r[i] = a[i]|0;
}

function car25519(o) {
  var i, v, c = 1;
  for (i = 0; i < 16; i++) {
    v = o[i] + c + 65535;
    c = Math.floor(v / 65536);
    o[i] = v - c * 65536;
  }
  o[0] += c-1 + 37 * (c-1);
}

function sel25519(p, q, b) {
  var t, c = ~(b-1);
  for (var i = 0; i < 16; i++) {
    t = c & (p[i] ^ q[i]);
    p[i] ^= t;
    q[i] ^= t;
  }
}

function pack25519(o, n) {
  var i, j, b;
  var m = gf(), t = gf();
  for (i = 0; i < 16; i++) t[i] = n[i];
  car25519(t);
  car25519(t);
  car25519(t);
  for (j = 0; j < 2; j++) {
    m[0] = t[0] - 0xffed;
    for (i = 1; i < 15; i++) {
      m[i] = t[i] - 0xffff - ((m[i-1]>>16) & 1);
      m[i-1] &= 0xffff;
    }
    m[15] = t[15] - 0x7fff - ((m[14]>>16) & 1);
    b = (m[15]>>16) & 1;
    m[14] &= 0xffff;
    sel25519(t, m, 1-b);
  }
  for (i = 0; i < 16; i++) {
    o[2*i] = t[i] & 0xff;
    o[2*i+1] = t[i]>>8;
  }
}

function neq25519(a, b) {
  var c = new Uint8Array(32), d = new Uint8Array(32);
  pack25519(c, a);
  pack25519(d, b);
  return crypto_verify_32(c, 0, d, 0);
}

function par25519(a) {
  var d = new Uint8Array(32);
  pack25519(d, a);
  return d[0] & 1;
}

function unpack25519(o, n) {
  var i;
  for (i = 0; i < 16; i++) o[i] = n[2*i] + (n[2*i+1] << 8);
  o[15] &= 0x7fff;
}

function A(o, a, b) {
  for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
}

function Z(o, a, b) {
  for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
}

function M(o, a, b) {
  var v, c,
     t0 = 0,  t1 = 0,  t2 = 0,  t3 = 0,  t4 = 0,  t5 = 0,  t6 = 0,  t7 = 0,
     t8 = 0,  t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0,
    t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0,
    t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0,
    b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3],
    b4 = b[4],
    b5 = b[5],
    b6 = b[6],
    b7 = b[7],
    b8 = b[8],
    b9 = b[9],
    b10 = b[10],
    b11 = b[11],
    b12 = b[12],
    b13 = b[13],
    b14 = b[14],
    b15 = b[15];

  v = a[0];
  t0 += v * b0;
  t1 += v * b1;
  t2 += v * b2;
  t3 += v * b3;
  t4 += v * b4;
  t5 += v * b5;
  t6 += v * b6;
  t7 += v * b7;
  t8 += v * b8;
  t9 += v * b9;
  t10 += v * b10;
  t11 += v * b11;
  t12 += v * b12;
  t13 += v * b13;
  t14 += v * b14;
  t15 += v * b15;
  v = a[1];
  t1 += v * b0;
  t2 += v * b1;
  t3 += v * b2;
  t4 += v * b3;
  t5 += v * b4;
  t6 += v * b5;
  t7 += v * b6;
  t8 += v * b7;
  t9 += v * b8;
  t10 += v * b9;
  t11 += v * b10;
  t12 += v * b11;
  t13 += v * b12;
  t14 += v * b13;
  t15 += v * b14;
  t16 += v * b15;
  v = a[2];
  t2 += v * b0;
  t3 += v * b1;
  t4 += v * b2;
  t5 += v * b3;
  t6 += v * b4;
  t7 += v * b5;
  t8 += v * b6;
  t9 += v * b7;
  t10 += v * b8;
  t11 += v * b9;
  t12 += v * b10;
  t13 += v * b11;
  t14 += v * b12;
  t15 += v * b13;
  t16 += v * b14;
  t17 += v * b15;
  v = a[3];
  t3 += v * b0;
  t4 += v * b1;
  t5 += v * b2;
  t6 += v * b3;
  t7 += v * b4;
  t8 += v * b5;
  t9 += v * b6;
  t10 += v * b7;
  t11 += v * b8;
  t12 += v * b9;
  t13 += v * b10;
  t14 += v * b11;
  t15 += v * b12;
  t16 += v * b13;
  t17 += v * b14;
  t18 += v * b15;
  v = a[4];
  t4 += v * b0;
  t5 += v * b1;
  t6 += v * b2;
  t7 += v * b3;
  t8 += v * b4;
  t9 += v * b5;
  t10 += v * b6;
  t11 += v * b7;
  t12 += v * b8;
  t13 += v * b9;
  t14 += v * b10;
  t15 += v * b11;
  t16 += v * b12;
  t17 += v * b13;
  t18 += v * b14;
  t19 += v * b15;
  v = a[5];
  t5 += v * b0;
  t6 += v * b1;
  t7 += v * b2;
  t8 += v * b3;
  t9 += v * b4;
  t10 += v * b5;
  t11 += v * b6;
  t12 += v * b7;
  t13 += v * b8;
  t14 += v * b9;
  t15 += v * b10;
  t16 += v * b11;
  t17 += v * b12;
  t18 += v * b13;
  t19 += v * b14;
  t20 += v * b15;
  v = a[6];
  t6 += v * b0;
  t7 += v * b1;
  t8 += v * b2;
  t9 += v * b3;
  t10 += v * b4;
  t11 += v * b5;
  t12 += v * b6;
  t13 += v * b7;
  t14 += v * b8;
  t15 += v * b9;
  t16 += v * b10;
  t17 += v * b11;
  t18 += v * b12;
  t19 += v * b13;
  t20 += v * b14;
  t21 += v * b15;
  v = a[7];
  t7 += v * b0;
  t8 += v * b1;
  t9 += v * b2;
  t10 += v * b3;
  t11 += v * b4;
  t12 += v * b5;
  t13 += v * b6;
  t14 += v * b7;
  t15 += v * b8;
  t16 += v * b9;
  t17 += v * b10;
  t18 += v * b11;
  t19 += v * b12;
  t20 += v * b13;
  t21 += v * b14;
  t22 += v * b15;
  v = a[8];
  t8 += v * b0;
  t9 += v * b1;
  t10 += v * b2;
  t11 += v * b3;
  t12 += v * b4;
  t13 += v * b5;
  t14 += v * b6;
  t15 += v * b7;
  t16 += v * b8;
  t17 += v * b9;
  t18 += v * b10;
  t19 += v * b11;
  t20 += v * b12;
  t21 += v * b13;
  t22 += v * b14;
  t23 += v * b15;
  v = a[9];
  t9 += v * b0;
  t10 += v * b1;
  t11 += v * b2;
  t12 += v * b3;
  t13 += v * b4;
  t14 += v * b5;
  t15 += v * b6;
  t16 += v * b7;
  t17 += v * b8;
  t18 += v * b9;
  t19 += v * b10;
  t20 += v * b11;
  t21 += v * b12;
  t22 += v * b13;
  t23 += v * b14;
  t24 += v * b15;
  v = a[10];
  t10 += v * b0;
  t11 += v * b1;
  t12 += v * b2;
  t13 += v * b3;
  t14 += v * b4;
  t15 += v * b5;
  t16 += v * b6;
  t17 += v * b7;
  t18 += v * b8;
  t19 += v * b9;
  t20 += v * b10;
  t21 += v * b11;
  t22 += v * b12;
  t23 += v * b13;
  t24 += v * b14;
  t25 += v * b15;
  v = a[11];
  t11 += v * b0;
  t12 += v * b1;
  t13 += v * b2;
  t14 += v * b3;
  t15 += v * b4;
  t16 += v * b5;
  t17 += v * b6;
  t18 += v * b7;
  t19 += v * b8;
  t20 += v * b9;
  t21 += v * b10;
  t22 += v * b11;
  t23 += v * b12;
  t24 += v * b13;
  t25 += v * b14;
  t26 += v * b15;
  v = a[12];
  t12 += v * b0;
  t13 += v * b1;
  t14 += v * b2;
  t15 += v * b3;
  t16 += v * b4;
  t17 += v * b5;
  t18 += v * b6;
  t19 += v * b7;
  t20 += v * b8;
  t21 += v * b9;
  t22 += v * b10;
  t23 += v * b11;
  t24 += v * b12;
  t25 += v * b13;
  t26 += v * b14;
  t27 += v * b15;
  v = a[13];
  t13 += v * b0;
  t14 += v * b1;
  t15 += v * b2;
  t16 += v * b3;
  t17 += v * b4;
  t18 += v * b5;
  t19 += v * b6;
  t20 += v * b7;
  t21 += v * b8;
  t22 += v * b9;
  t23 += v * b10;
  t24 += v * b11;
  t25 += v * b12;
  t26 += v * b13;
  t27 += v * b14;
  t28 += v * b15;
  v = a[14];
  t14 += v * b0;
  t15 += v * b1;
  t16 += v * b2;
  t17 += v * b3;
  t18 += v * b4;
  t19 += v * b5;
  t20 += v * b6;
  t21 += v * b7;
  t22 += v * b8;
  t23 += v * b9;
  t24 += v * b10;
  t25 += v * b11;
  t26 += v * b12;
  t27 += v * b13;
  t28 += v * b14;
  t29 += v * b15;
  v = a[15];
  t15 += v * b0;
  t16 += v * b1;
  t17 += v * b2;
  t18 += v * b3;
  t19 += v * b4;
  t20 += v * b5;
  t21 += v * b6;
  t22 += v * b7;
  t23 += v * b8;
  t24 += v * b9;
  t25 += v * b10;
  t26 += v * b11;
  t27 += v * b12;
  t28 += v * b13;
  t29 += v * b14;
  t30 += v * b15;

  t0  += 38 * t16;
  t1  += 38 * t17;
  t2  += 38 * t18;
  t3  += 38 * t19;
  t4  += 38 * t20;
  t5  += 38 * t21;
  t6  += 38 * t22;
  t7  += 38 * t23;
  t8  += 38 * t24;
  t9  += 38 * t25;
  t10 += 38 * t26;
  t11 += 38 * t27;
  t12 += 38 * t28;
  t13 += 38 * t29;
  t14 += 38 * t30;
  // t15 left as is

  // first car
  c = 1;
  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
  t0 += c-1 + 37 * (c-1);

  // second car
  c = 1;
  v =  t0 + c + 65535; c = Math.floor(v / 65536);  t0 = v - c * 65536;
  v =  t1 + c + 65535; c = Math.floor(v / 65536);  t1 = v - c * 65536;
  v =  t2 + c + 65535; c = Math.floor(v / 65536);  t2 = v - c * 65536;
  v =  t3 + c + 65535; c = Math.floor(v / 65536);  t3 = v - c * 65536;
  v =  t4 + c + 65535; c = Math.floor(v / 65536);  t4 = v - c * 65536;
  v =  t5 + c + 65535; c = Math.floor(v / 65536);  t5 = v - c * 65536;
  v =  t6 + c + 65535; c = Math.floor(v / 65536);  t6 = v - c * 65536;
  v =  t7 + c + 65535; c = Math.floor(v / 65536);  t7 = v - c * 65536;
  v =  t8 + c + 65535; c = Math.floor(v / 65536);  t8 = v - c * 65536;
  v =  t9 + c + 65535; c = Math.floor(v / 65536);  t9 = v - c * 65536;
  v = t10 + c + 65535; c = Math.floor(v / 65536); t10 = v - c * 65536;
  v = t11 + c + 65535; c = Math.floor(v / 65536); t11 = v - c * 65536;
  v = t12 + c + 65535; c = Math.floor(v / 65536); t12 = v - c * 65536;
  v = t13 + c + 65535; c = Math.floor(v / 65536); t13 = v - c * 65536;
  v = t14 + c + 65535; c = Math.floor(v / 65536); t14 = v - c * 65536;
  v = t15 + c + 65535; c = Math.floor(v / 65536); t15 = v - c * 65536;
  t0 += c-1 + 37 * (c-1);

  o[ 0] = t0;
  o[ 1] = t1;
  o[ 2] = t2;
  o[ 3] = t3;
  o[ 4] = t4;
  o[ 5] = t5;
  o[ 6] = t6;
  o[ 7] = t7;
  o[ 8] = t8;
  o[ 9] = t9;
  o[10] = t10;
  o[11] = t11;
  o[12] = t12;
  o[13] = t13;
  o[14] = t14;
  o[15] = t15;
}

function S(o, a) {
  M(o, a, a);
}

function inv25519(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 253; a >= 0; a--) {
    S(c, c);
    if(a !== 2 && a !== 4) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function pow2523(o, i) {
  var c = gf();
  var a;
  for (a = 0; a < 16; a++) c[a] = i[a];
  for (a = 250; a >= 0; a--) {
      S(c, c);
      if(a !== 1) M(c, c, i);
  }
  for (a = 0; a < 16; a++) o[a] = c[a];
}

function crypto_scalarmult(q, n, p) {
  var z = new Uint8Array(32);
  var x = new Float64Array(80), r, i;
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf();
  for (i = 0; i < 31; i++) z[i] = n[i];
  z[31]=(n[31]&127)|64;
  z[0]&=248;
  unpack25519(x,p);
  for (i = 0; i < 16; i++) {
    b[i]=x[i];
    d[i]=a[i]=c[i]=0;
  }
  a[0]=d[0]=1;
  for (i=254; i>=0; --i) {
    r=(z[i>>>3]>>>(i&7))&1;
    sel25519(a,b,r);
    sel25519(c,d,r);
    A(e,a,c);
    Z(a,a,c);
    A(c,b,d);
    Z(b,b,d);
    S(d,e);
    S(f,a);
    M(a,c,a);
    M(c,b,e);
    A(e,a,c);
    Z(a,a,c);
    S(b,a);
    Z(c,d,f);
    M(a,c,_121665);
    A(a,a,d);
    M(c,c,a);
    M(a,d,f);
    M(d,b,x);
    S(b,e);
    sel25519(a,b,r);
    sel25519(c,d,r);
  }
  for (i = 0; i < 16; i++) {
    x[i+16]=a[i];
    x[i+32]=c[i];
    x[i+48]=b[i];
    x[i+64]=d[i];
  }
  var x32 = x.subarray(32);
  var x16 = x.subarray(16);
  inv25519(x32,x32);
  M(x16,x16,x32);
  pack25519(q,x16);
  return 0;
}

function crypto_scalarmult_base(q, n) {
  return crypto_scalarmult(q, n, _9);
}

function crypto_box_keypair(y, x) {
  randombytes(x, 32);
  return crypto_scalarmult_base(y, x);
}

function crypto_box_beforenm(k, y, x) {
  var s = new Uint8Array(32);
  crypto_scalarmult(s, x, y);
  return crypto_core_hsalsa20(k, _0, s, sigma);
}

var crypto_box_afternm = crypto_secretbox;
var crypto_box_open_afternm = crypto_secretbox_open;

function crypto_box(c, m, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_afternm(c, m, d, n, k);
}

function crypto_box_open(m, c, d, n, y, x) {
  var k = new Uint8Array(32);
  crypto_box_beforenm(k, y, x);
  return crypto_box_open_afternm(m, c, d, n, k);
}

var K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

function crypto_hashblocks_hl(hh, hl, m, n) {
  var wh = new Int32Array(16), wl = new Int32Array(16),
      bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7,
      bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7,
      th, tl, i, j, h, l, a, b, c, d;

  var ah0 = hh[0],
      ah1 = hh[1],
      ah2 = hh[2],
      ah3 = hh[3],
      ah4 = hh[4],
      ah5 = hh[5],
      ah6 = hh[6],
      ah7 = hh[7],

      al0 = hl[0],
      al1 = hl[1],
      al2 = hl[2],
      al3 = hl[3],
      al4 = hl[4],
      al5 = hl[5],
      al6 = hl[6],
      al7 = hl[7];

  var pos = 0;
  while (n >= 128) {
    for (i = 0; i < 16; i++) {
      j = 8 * i + pos;
      wh[i] = (m[j+0] << 24) | (m[j+1] << 16) | (m[j+2] << 8) | m[j+3];
      wl[i] = (m[j+4] << 24) | (m[j+5] << 16) | (m[j+6] << 8) | m[j+7];
    }
    for (i = 0; i < 80; i++) {
      bh0 = ah0;
      bh1 = ah1;
      bh2 = ah2;
      bh3 = ah3;
      bh4 = ah4;
      bh5 = ah5;
      bh6 = ah6;
      bh7 = ah7;

      bl0 = al0;
      bl1 = al1;
      bl2 = al2;
      bl3 = al3;
      bl4 = al4;
      bl5 = al5;
      bl6 = al6;
      bl7 = al7;

      // add
      h = ah7;
      l = al7;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      // Sigma1
      h = ((ah4 >>> 14) | (al4 << (32-14))) ^ ((ah4 >>> 18) | (al4 << (32-18))) ^ ((al4 >>> (41-32)) | (ah4 << (32-(41-32))));
      l = ((al4 >>> 14) | (ah4 << (32-14))) ^ ((al4 >>> 18) | (ah4 << (32-18))) ^ ((ah4 >>> (41-32)) | (al4 << (32-(41-32))));

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // Ch
      h = (ah4 & ah5) ^ (~ah4 & ah6);
      l = (al4 & al5) ^ (~al4 & al6);

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // K
      h = K[i*2];
      l = K[i*2+1];

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // w
      h = wh[i%16];
      l = wl[i%16];

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      th = c & 0xffff | d << 16;
      tl = a & 0xffff | b << 16;

      // add
      h = th;
      l = tl;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      // Sigma0
      h = ((ah0 >>> 28) | (al0 << (32-28))) ^ ((al0 >>> (34-32)) | (ah0 << (32-(34-32)))) ^ ((al0 >>> (39-32)) | (ah0 << (32-(39-32))));
      l = ((al0 >>> 28) | (ah0 << (32-28))) ^ ((ah0 >>> (34-32)) | (al0 << (32-(34-32)))) ^ ((ah0 >>> (39-32)) | (al0 << (32-(39-32))));

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      // Maj
      h = (ah0 & ah1) ^ (ah0 & ah2) ^ (ah1 & ah2);
      l = (al0 & al1) ^ (al0 & al2) ^ (al1 & al2);

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      bh7 = (c & 0xffff) | (d << 16);
      bl7 = (a & 0xffff) | (b << 16);

      // add
      h = bh3;
      l = bl3;

      a = l & 0xffff; b = l >>> 16;
      c = h & 0xffff; d = h >>> 16;

      h = th;
      l = tl;

      a += l & 0xffff; b += l >>> 16;
      c += h & 0xffff; d += h >>> 16;

      b += a >>> 16;
      c += b >>> 16;
      d += c >>> 16;

      bh3 = (c & 0xffff) | (d << 16);
      bl3 = (a & 0xffff) | (b << 16);

      ah1 = bh0;
      ah2 = bh1;
      ah3 = bh2;
      ah4 = bh3;
      ah5 = bh4;
      ah6 = bh5;
      ah7 = bh6;
      ah0 = bh7;

      al1 = bl0;
      al2 = bl1;
      al3 = bl2;
      al4 = bl3;
      al5 = bl4;
      al6 = bl5;
      al7 = bl6;
      al0 = bl7;

      if (i%16 === 15) {
        for (j = 0; j < 16; j++) {
          // add
          h = wh[j];
          l = wl[j];

          a = l & 0xffff; b = l >>> 16;
          c = h & 0xffff; d = h >>> 16;

          h = wh[(j+9)%16];
          l = wl[(j+9)%16];

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          // sigma0
          th = wh[(j+1)%16];
          tl = wl[(j+1)%16];
          h = ((th >>> 1) | (tl << (32-1))) ^ ((th >>> 8) | (tl << (32-8))) ^ (th >>> 7);
          l = ((tl >>> 1) | (th << (32-1))) ^ ((tl >>> 8) | (th << (32-8))) ^ ((tl >>> 7) | (th << (32-7)));

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          // sigma1
          th = wh[(j+14)%16];
          tl = wl[(j+14)%16];
          h = ((th >>> 19) | (tl << (32-19))) ^ ((tl >>> (61-32)) | (th << (32-(61-32)))) ^ (th >>> 6);
          l = ((tl >>> 19) | (th << (32-19))) ^ ((th >>> (61-32)) | (tl << (32-(61-32)))) ^ ((tl >>> 6) | (th << (32-6)));

          a += l & 0xffff; b += l >>> 16;
          c += h & 0xffff; d += h >>> 16;

          b += a >>> 16;
          c += b >>> 16;
          d += c >>> 16;

          wh[j] = (c & 0xffff) | (d << 16);
          wl[j] = (a & 0xffff) | (b << 16);
        }
      }
    }

    // add
    h = ah0;
    l = al0;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[0];
    l = hl[0];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[0] = ah0 = (c & 0xffff) | (d << 16);
    hl[0] = al0 = (a & 0xffff) | (b << 16);

    h = ah1;
    l = al1;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[1];
    l = hl[1];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[1] = ah1 = (c & 0xffff) | (d << 16);
    hl[1] = al1 = (a & 0xffff) | (b << 16);

    h = ah2;
    l = al2;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[2];
    l = hl[2];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[2] = ah2 = (c & 0xffff) | (d << 16);
    hl[2] = al2 = (a & 0xffff) | (b << 16);

    h = ah3;
    l = al3;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[3];
    l = hl[3];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[3] = ah3 = (c & 0xffff) | (d << 16);
    hl[3] = al3 = (a & 0xffff) | (b << 16);

    h = ah4;
    l = al4;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[4];
    l = hl[4];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[4] = ah4 = (c & 0xffff) | (d << 16);
    hl[4] = al4 = (a & 0xffff) | (b << 16);

    h = ah5;
    l = al5;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[5];
    l = hl[5];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[5] = ah5 = (c & 0xffff) | (d << 16);
    hl[5] = al5 = (a & 0xffff) | (b << 16);

    h = ah6;
    l = al6;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[6];
    l = hl[6];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[6] = ah6 = (c & 0xffff) | (d << 16);
    hl[6] = al6 = (a & 0xffff) | (b << 16);

    h = ah7;
    l = al7;

    a = l & 0xffff; b = l >>> 16;
    c = h & 0xffff; d = h >>> 16;

    h = hh[7];
    l = hl[7];

    a += l & 0xffff; b += l >>> 16;
    c += h & 0xffff; d += h >>> 16;

    b += a >>> 16;
    c += b >>> 16;
    d += c >>> 16;

    hh[7] = ah7 = (c & 0xffff) | (d << 16);
    hl[7] = al7 = (a & 0xffff) | (b << 16);

    pos += 128;
    n -= 128;
  }

  return n;
}

function crypto_hash(out, m, n) {
  var hh = new Int32Array(8),
      hl = new Int32Array(8),
      x = new Uint8Array(256),
      i, b = n;

  hh[0] = 0x6a09e667;
  hh[1] = 0xbb67ae85;
  hh[2] = 0x3c6ef372;
  hh[3] = 0xa54ff53a;
  hh[4] = 0x510e527f;
  hh[5] = 0x9b05688c;
  hh[6] = 0x1f83d9ab;
  hh[7] = 0x5be0cd19;

  hl[0] = 0xf3bcc908;
  hl[1] = 0x84caa73b;
  hl[2] = 0xfe94f82b;
  hl[3] = 0x5f1d36f1;
  hl[4] = 0xade682d1;
  hl[5] = 0x2b3e6c1f;
  hl[6] = 0xfb41bd6b;
  hl[7] = 0x137e2179;

  crypto_hashblocks_hl(hh, hl, m, n);
  n %= 128;

  for (i = 0; i < n; i++) x[i] = m[b-n+i];
  x[n] = 128;

  n = 256-128*(n<112?1:0);
  x[n-9] = 0;
  ts64(x, n-8,  (b / 0x20000000) | 0, b << 3);
  crypto_hashblocks_hl(hh, hl, x, n);

  for (i = 0; i < 8; i++) ts64(out, 8*i, hh[i], hl[i]);

  return 0;
}

function add(p, q) {
  var a = gf(), b = gf(), c = gf(),
      d = gf(), e = gf(), f = gf(),
      g = gf(), h = gf(), t = gf();

  Z(a, p[1], p[0]);
  Z(t, q[1], q[0]);
  M(a, a, t);
  A(b, p[0], p[1]);
  A(t, q[0], q[1]);
  M(b, b, t);
  M(c, p[3], q[3]);
  M(c, c, D2);
  M(d, p[2], q[2]);
  A(d, d, d);
  Z(e, b, a);
  Z(f, d, c);
  A(g, d, c);
  A(h, b, a);

  M(p[0], e, f);
  M(p[1], h, g);
  M(p[2], g, f);
  M(p[3], e, h);
}

function cswap(p, q, b) {
  var i;
  for (i = 0; i < 4; i++) {
    sel25519(p[i], q[i], b);
  }
}

function pack(r, p) {
  var tx = gf(), ty = gf(), zi = gf();
  inv25519(zi, p[2]);
  M(tx, p[0], zi);
  M(ty, p[1], zi);
  pack25519(r, ty);
  r[31] ^= par25519(tx) << 7;
}

function scalarmult(p, q, s) {
  var b, i;
  set25519(p[0], gf0);
  set25519(p[1], gf1);
  set25519(p[2], gf1);
  set25519(p[3], gf0);
  for (i = 255; i >= 0; --i) {
    b = (s[(i/8)|0] >> (i&7)) & 1;
    cswap(p, q, b);
    add(q, p);
    add(p, p);
    cswap(p, q, b);
  }
}

function scalarbase(p, s) {
  var q = [gf(), gf(), gf(), gf()];
  set25519(q[0], X);
  set25519(q[1], Y);
  set25519(q[2], gf1);
  M(q[3], X, Y);
  scalarmult(p, q, s);
}

function crypto_sign_keypair(pk, sk, seeded) {
  var d = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()];
  var i;

  if (!seeded) randombytes(sk, 32);
  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  scalarbase(p, d);
  pack(pk, p);

  for (i = 0; i < 32; i++) sk[i+32] = pk[i];
  return 0;
}

var L = new Float64Array([0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10]);

function modL(r, x) {
  var carry, i, j, k;
  for (i = 63; i >= 32; --i) {
    carry = 0;
    for (j = i - 32, k = i - 12; j < k; ++j) {
      x[j] += carry - 16 * x[i] * L[j - (i - 32)];
      carry = (x[j] + 128) >> 8;
      x[j] -= carry * 256;
    }
    x[j] += carry;
    x[i] = 0;
  }
  carry = 0;
  for (j = 0; j < 32; j++) {
    x[j] += carry - (x[31] >> 4) * L[j];
    carry = x[j] >> 8;
    x[j] &= 255;
  }
  for (j = 0; j < 32; j++) x[j] -= carry * L[j];
  for (i = 0; i < 32; i++) {
    x[i+1] += x[i] >> 8;
    r[i] = x[i] & 255;
  }
}

function reduce(r) {
  var x = new Float64Array(64), i;
  for (i = 0; i < 64; i++) x[i] = r[i];
  for (i = 0; i < 64; i++) r[i] = 0;
  modL(r, x);
}

// Note: difference from C - smlen returned, not passed as argument.
function crypto_sign(sm, m, n, sk) {
  var d = new Uint8Array(64), h = new Uint8Array(64), r = new Uint8Array(64);
  var i, j, x = new Float64Array(64);
  var p = [gf(), gf(), gf(), gf()];

  crypto_hash(d, sk, 32);
  d[0] &= 248;
  d[31] &= 127;
  d[31] |= 64;

  var smlen = n + 64;
  for (i = 0; i < n; i++) sm[64 + i] = m[i];
  for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];

  crypto_hash(r, sm.subarray(32), n+32);
  reduce(r);
  scalarbase(p, r);
  pack(sm, p);

  for (i = 32; i < 64; i++) sm[i] = sk[i];
  crypto_hash(h, sm, n + 64);
  reduce(h);

  for (i = 0; i < 64; i++) x[i] = 0;
  for (i = 0; i < 32; i++) x[i] = r[i];
  for (i = 0; i < 32; i++) {
    for (j = 0; j < 32; j++) {
      x[i+j] += h[i] * d[j];
    }
  }

  modL(sm.subarray(32), x);
  return smlen;
}

function unpackneg(r, p) {
  var t = gf(), chk = gf(), num = gf(),
      den = gf(), den2 = gf(), den4 = gf(),
      den6 = gf();

  set25519(r[2], gf1);
  unpack25519(r[1], p);
  S(num, r[1]);
  M(den, num, D);
  Z(num, num, r[2]);
  A(den, r[2], den);

  S(den2, den);
  S(den4, den2);
  M(den6, den4, den2);
  M(t, den6, num);
  M(t, t, den);

  pow2523(t, t);
  M(t, t, num);
  M(t, t, den);
  M(t, t, den);
  M(r[0], t, den);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) M(r[0], r[0], I);

  S(chk, r[0]);
  M(chk, chk, den);
  if (neq25519(chk, num)) return -1;

  if (par25519(r[0]) === (p[31]>>7)) Z(r[0], gf0, r[0]);

  M(r[3], r[0], r[1]);
  return 0;
}

function crypto_sign_open(m, sm, n, pk) {
  var i, mlen;
  var t = new Uint8Array(32), h = new Uint8Array(64);
  var p = [gf(), gf(), gf(), gf()],
      q = [gf(), gf(), gf(), gf()];

  mlen = -1;
  if (n < 64) return -1;

  if (unpackneg(q, pk)) return -1;

  for (i = 0; i < n; i++) m[i] = sm[i];
  for (i = 0; i < 32; i++) m[i+32] = pk[i];
  crypto_hash(h, m, n);
  reduce(h);
  scalarmult(p, q, h);

  scalarbase(q, sm.subarray(32));
  add(p, q);
  pack(t, p);

  n -= 64;
  if (crypto_verify_32(sm, 0, t, 0)) {
    for (i = 0; i < n; i++) m[i] = 0;
    return -1;
  }

  for (i = 0; i < n; i++) m[i] = sm[i + 64];
  mlen = n;
  return mlen;
}

var crypto_secretbox_KEYBYTES = 32,
    crypto_secretbox_NONCEBYTES = 24,
    crypto_secretbox_ZEROBYTES = 32,
    crypto_secretbox_BOXZEROBYTES = 16,
    crypto_scalarmult_BYTES = 32,
    crypto_scalarmult_SCALARBYTES = 32,
    crypto_box_PUBLICKEYBYTES = 32,
    crypto_box_SECRETKEYBYTES = 32,
    crypto_box_BEFORENMBYTES = 32,
    crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES,
    crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES,
    crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES,
    crypto_sign_BYTES = 64,
    crypto_sign_PUBLICKEYBYTES = 32,
    crypto_sign_SECRETKEYBYTES = 64,
    crypto_sign_SEEDBYTES = 32,
    crypto_hash_BYTES = 64;

nacl.lowlevel = {
  crypto_core_hsalsa20: crypto_core_hsalsa20,
  crypto_stream_xor: crypto_stream_xor,
  crypto_stream: crypto_stream,
  crypto_stream_salsa20_xor: crypto_stream_salsa20_xor,
  crypto_stream_salsa20: crypto_stream_salsa20,
  crypto_onetimeauth: crypto_onetimeauth,
  crypto_onetimeauth_verify: crypto_onetimeauth_verify,
  crypto_verify_16: crypto_verify_16,
  crypto_verify_32: crypto_verify_32,
  crypto_secretbox: crypto_secretbox,
  crypto_secretbox_open: crypto_secretbox_open,
  crypto_scalarmult: crypto_scalarmult,
  crypto_scalarmult_base: crypto_scalarmult_base,
  crypto_box_beforenm: crypto_box_beforenm,
  crypto_box_afternm: crypto_box_afternm,
  crypto_box: crypto_box,
  crypto_box_open: crypto_box_open,
  crypto_box_keypair: crypto_box_keypair,
  crypto_hash: crypto_hash,
  crypto_sign: crypto_sign,
  crypto_sign_keypair: crypto_sign_keypair,
  crypto_sign_open: crypto_sign_open,

  crypto_secretbox_KEYBYTES: crypto_secretbox_KEYBYTES,
  crypto_secretbox_NONCEBYTES: crypto_secretbox_NONCEBYTES,
  crypto_secretbox_ZEROBYTES: crypto_secretbox_ZEROBYTES,
  crypto_secretbox_BOXZEROBYTES: crypto_secretbox_BOXZEROBYTES,
  crypto_scalarmult_BYTES: crypto_scalarmult_BYTES,
  crypto_scalarmult_SCALARBYTES: crypto_scalarmult_SCALARBYTES,
  crypto_box_PUBLICKEYBYTES: crypto_box_PUBLICKEYBYTES,
  crypto_box_SECRETKEYBYTES: crypto_box_SECRETKEYBYTES,
  crypto_box_BEFORENMBYTES: crypto_box_BEFORENMBYTES,
  crypto_box_NONCEBYTES: crypto_box_NONCEBYTES,
  crypto_box_ZEROBYTES: crypto_box_ZEROBYTES,
  crypto_box_BOXZEROBYTES: crypto_box_BOXZEROBYTES,
  crypto_sign_BYTES: crypto_sign_BYTES,
  crypto_sign_PUBLICKEYBYTES: crypto_sign_PUBLICKEYBYTES,
  crypto_sign_SECRETKEYBYTES: crypto_sign_SECRETKEYBYTES,
  crypto_sign_SEEDBYTES: crypto_sign_SEEDBYTES,
  crypto_hash_BYTES: crypto_hash_BYTES
};

/* High-level API */

function checkLengths(k, n) {
  if (k.length !== crypto_secretbox_KEYBYTES) throw new Error('bad key size');
  if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error('bad nonce size');
}

function checkBoxLengths(pk, sk) {
  if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error('bad public key size');
  if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error('bad secret key size');
}

function checkArrayTypes() {
  var t, i;
  for (i = 0; i < arguments.length; i++) {
     if ((t = Object.prototype.toString.call(arguments[i])) !== '[object Uint8Array]')
       throw new TypeError('unexpected type ' + t + ', use Uint8Array');
  }
}

function cleanup(arr) {
  for (var i = 0; i < arr.length; i++) arr[i] = 0;
}

// TODO: Completely remove this in v0.15.
if (!nacl.util) {
  nacl.util = {};
  nacl.util.decodeUTF8 = nacl.util.encodeUTF8 = nacl.util.encodeBase64 = nacl.util.decodeBase64 = function() {
    throw new Error('nacl.util moved into separate package: https://github.com/dchest/tweetnacl-util-js');
  };
}

nacl.randomBytes = function(n) {
  var b = new Uint8Array(n);
  randombytes(b, n);
  return b;
};

nacl.secretbox = function(msg, nonce, key) {
  checkArrayTypes(msg, nonce, key);
  checkLengths(key, nonce);
  var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
  var c = new Uint8Array(m.length);
  for (var i = 0; i < msg.length; i++) m[i+crypto_secretbox_ZEROBYTES] = msg[i];
  crypto_secretbox(c, m, m.length, nonce, key);
  return c.subarray(crypto_secretbox_BOXZEROBYTES);
};

nacl.secretbox.open = function(box, nonce, key) {
  checkArrayTypes(box, nonce, key);
  checkLengths(key, nonce);
  var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
  var m = new Uint8Array(c.length);
  for (var i = 0; i < box.length; i++) c[i+crypto_secretbox_BOXZEROBYTES] = box[i];
  if (c.length < 32) return false;
  if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return false;
  return m.subarray(crypto_secretbox_ZEROBYTES);
};

nacl.secretbox.keyLength = crypto_secretbox_KEYBYTES;
nacl.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
nacl.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;

nacl.scalarMult = function(n, p) {
  checkArrayTypes(n, p);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  if (p.length !== crypto_scalarmult_BYTES) throw new Error('bad p size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult(q, n, p);
  return q;
};

nacl.scalarMult.base = function(n) {
  checkArrayTypes(n);
  if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error('bad n size');
  var q = new Uint8Array(crypto_scalarmult_BYTES);
  crypto_scalarmult_base(q, n);
  return q;
};

nacl.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
nacl.scalarMult.groupElementLength = crypto_scalarmult_BYTES;

nacl.box = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox(msg, nonce, k);
};

nacl.box.before = function(publicKey, secretKey) {
  checkArrayTypes(publicKey, secretKey);
  checkBoxLengths(publicKey, secretKey);
  var k = new Uint8Array(crypto_box_BEFORENMBYTES);
  crypto_box_beforenm(k, publicKey, secretKey);
  return k;
};

nacl.box.after = nacl.secretbox;

nacl.box.open = function(msg, nonce, publicKey, secretKey) {
  var k = nacl.box.before(publicKey, secretKey);
  return nacl.secretbox.open(msg, nonce, k);
};

nacl.box.open.after = nacl.secretbox.open;

nacl.box.keyPair = function() {
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
  crypto_box_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.box.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_box_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
  crypto_scalarmult_base(pk, secretKey);
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
nacl.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
nacl.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
nacl.box.nonceLength = crypto_box_NONCEBYTES;
nacl.box.overheadLength = nacl.secretbox.overheadLength;

nacl.sign = function(msg, secretKey) {
  checkArrayTypes(msg, secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var signedMsg = new Uint8Array(crypto_sign_BYTES+msg.length);
  crypto_sign(signedMsg, msg, msg.length, secretKey);
  return signedMsg;
};

nacl.sign.open = function(signedMsg, publicKey) {
  if (arguments.length !== 2)
    throw new Error('nacl.sign.open accepts 2 arguments; did you mean to use nacl.sign.detached.verify?');
  checkArrayTypes(signedMsg, publicKey);
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var tmp = new Uint8Array(signedMsg.length);
  var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
  if (mlen < 0) return null;
  var m = new Uint8Array(mlen);
  for (var i = 0; i < m.length; i++) m[i] = tmp[i];
  return m;
};

nacl.sign.detached = function(msg, secretKey) {
  var signedMsg = nacl.sign(msg, secretKey);
  var sig = new Uint8Array(crypto_sign_BYTES);
  for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
  return sig;
};

nacl.sign.detached.verify = function(msg, sig, publicKey) {
  checkArrayTypes(msg, sig, publicKey);
  if (sig.length !== crypto_sign_BYTES)
    throw new Error('bad signature size');
  if (publicKey.length !== crypto_sign_PUBLICKEYBYTES)
    throw new Error('bad public key size');
  var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
  var m = new Uint8Array(crypto_sign_BYTES + msg.length);
  var i;
  for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
  for (i = 0; i < msg.length; i++) sm[i+crypto_sign_BYTES] = msg[i];
  return (crypto_sign_open(m, sm, sm.length, publicKey) >= 0);
};

nacl.sign.keyPair = function() {
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  crypto_sign_keypair(pk, sk);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.keyPair.fromSecretKey = function(secretKey) {
  checkArrayTypes(secretKey);
  if (secretKey.length !== crypto_sign_SECRETKEYBYTES)
    throw new Error('bad secret key size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32+i];
  return {publicKey: pk, secretKey: new Uint8Array(secretKey)};
};

nacl.sign.keyPair.fromSeed = function(seed) {
  checkArrayTypes(seed);
  if (seed.length !== crypto_sign_SEEDBYTES)
    throw new Error('bad seed size');
  var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
  var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
  for (var i = 0; i < 32; i++) sk[i] = seed[i];
  crypto_sign_keypair(pk, sk, true);
  return {publicKey: pk, secretKey: sk};
};

nacl.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
nacl.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
nacl.sign.seedLength = crypto_sign_SEEDBYTES;
nacl.sign.signatureLength = crypto_sign_BYTES;

nacl.hash = function(msg) {
  checkArrayTypes(msg);
  var h = new Uint8Array(crypto_hash_BYTES);
  crypto_hash(h, msg, msg.length);
  return h;
};

nacl.hash.hashLength = crypto_hash_BYTES;

nacl.verify = function(x, y) {
  checkArrayTypes(x, y);
  // Zero length arguments are considered not equal.
  if (x.length === 0 || y.length === 0) return false;
  if (x.length !== y.length) return false;
  return (vn(x, 0, y, 0, x.length) === 0) ? true : false;
};

nacl.setPRNG = function(fn) {
  randombytes = fn;
};

(function() {
  // Initialize PRNG if environment provides CSPRNG.
  // If not, methods calling randombytes will throw.
  var crypto = typeof self !== 'undefined' ? (self.crypto || self.msCrypto) : null;
  if (crypto && crypto.getRandomValues) {
    // Browsers.
    var QUOTA = 65536;
    nacl.setPRNG(function(x, n) {
      var i, v = new Uint8Array(n);
      for (i = 0; i < n; i += QUOTA) {
        crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
      }
      for (i = 0; i < n; i++) x[i] = v[i];
      cleanup(v);
    });
  } else if (true) {
    // Node.js.
    crypto = __nccwpck_require__(6417);
    if (crypto && crypto.randomBytes) {
      nacl.setPRNG(function(x, n) {
        var i, v = crypto.randomBytes(n);
        for (i = 0; i < n; i++) x[i] = v[i];
        cleanup(v);
      });
    }
  }
})();

})( true && module.exports ? module.exports : (self.nacl = self.nacl || {}));


/***/ }),

/***/ 5030:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }

  if (typeof process === "object" && "version" in process) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
  }

  return "<environment undetectable>";
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 4207:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

const path = __nccwpck_require__(5622)
const COLON = isWindows ? ';' : ':'
const isexe = __nccwpck_require__(7126)

const getNotFoundError = (cmd) =>
  Object.assign(new Error(`not found: ${cmd}`), { code: 'ENOENT' })

const getPathInfo = (cmd, opt) => {
  const colon = opt.colon || COLON

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? ['']
    : (
      [
        // windows always checks the cwd first
        ...(isWindows ? [process.cwd()] : []),
        ...(opt.path || process.env.PATH ||
          /* istanbul ignore next: very unusual */ '').split(colon),
      ]
    )
  const pathExtExe = isWindows
    ? opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM'
    : ''
  const pathExt = isWindows ? pathExtExe.split(colon) : ['']

  if (isWindows) {
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('')
  }

  return {
    pathEnv,
    pathExt,
    pathExtExe,
  }
}

const which = (cmd, opt, cb) => {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }
  if (!opt)
    opt = {}

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt)
  const found = []

  const step = i => new Promise((resolve, reject) => {
    if (i === pathEnv.length)
      return opt.all && found.length ? resolve(found)
        : reject(getNotFoundError(cmd))

    const ppRaw = pathEnv[i]
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw

    const pCmd = path.join(pathPart, cmd)
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd

    resolve(subStep(p, i, 0))
  })

  const subStep = (p, i, ii) => new Promise((resolve, reject) => {
    if (ii === pathExt.length)
      return resolve(step(i + 1))
    const ext = pathExt[ii]
    isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
      if (!er && is) {
        if (opt.all)
          found.push(p + ext)
        else
          return resolve(p + ext)
      }
      return resolve(subStep(p, i, ii + 1))
    })
  })

  return cb ? step(0).then(res => cb(null, res), cb) : step(0)
}

const whichSync = (cmd, opt) => {
  opt = opt || {}

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt)
  const found = []

  for (let i = 0; i < pathEnv.length; i ++) {
    const ppRaw = pathEnv[i]
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw

    const pCmd = path.join(pathPart, cmd)
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd

    for (let j = 0; j < pathExt.length; j ++) {
      const cur = p + pathExt[j]
      try {
        const is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}

module.exports = which
which.sync = whichSync


/***/ }),

/***/ 2940:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 2877:
/***/ ((module) => {

module.exports = eval("require")("encoding");


/***/ }),

/***/ 5129:
/***/ ((module) => {

"use strict";
module.exports = {"i8":"0.4.10"};

/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");;

/***/ }),

/***/ 4293:
/***/ ((module) => {

"use strict";
module.exports = require("buffer");;

/***/ }),

/***/ 3129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");;

/***/ }),

/***/ 6417:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");;

/***/ }),

/***/ 881:
/***/ ((module) => {

"use strict";
module.exports = require("dns");;

/***/ }),

/***/ 8614:
/***/ ((module) => {

"use strict";
module.exports = require("events");;

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 8605:
/***/ ((module) => {

"use strict";
module.exports = require("http");;

/***/ }),

/***/ 7211:
/***/ ((module) => {

"use strict";
module.exports = require("https");;

/***/ }),

/***/ 1631:
/***/ ((module) => {

"use strict";
module.exports = require("net");;

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");;

/***/ }),

/***/ 4016:
/***/ ((module) => {

"use strict";
module.exports = require("tls");;

/***/ }),

/***/ 8835:
/***/ ((module) => {

"use strict";
module.exports = require("url");;

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ }),

/***/ 8761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __nccwpck_require__(3109);
/******/ })()
;
//# sourceMappingURL=index.js.map