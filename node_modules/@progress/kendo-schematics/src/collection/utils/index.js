"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const rxjs_1 = require("rxjs");
var ast_utils_1 = require("./ast-utils");
exports.addSymbolToMetadata = ast_utils_1.addSymbolToMetadata;
exports.addDeclarationToModule = ast_utils_1.addDeclarationToModule;
exports.addExportToModule = ast_utils_1.addExportToModule;
exports.addImportToModule = ast_utils_1.addImportToModule;
var find_module_1 = require("./find-module");
exports.findModule = find_module_1.findModule;
__export(require("./workspace"));
var bootstrap_module_1 = require("./bootstrap-module");
exports.getAppModulePath = bootstrap_module_1.getAppModulePath;
exports.folderName = (options) => (name) => options.flat ? '' : core_1.strings.dasherize(name);
const prefix = (pre, name) => (pre ? `${pre}-` : '') + name;
exports.buildSelector = (options) => {
    const name = options.selector || core_1.strings.dasherize(options.name);
    return prefix(options.prefix, name);
};
function stringify(json) {
    return `${JSON.stringify(json, null, 2)}\n`;
}
exports.stringify = stringify;
function isObservable(thunk) {
    if (!thunk || typeof thunk !== 'object') {
        return false;
    }
    if (Symbol.observable && Symbol.observable in thunk) {
        return true;
    }
    return typeof thunk.subscribe === 'function';
}
function asObservable(thunk) {
    if (isObservable(thunk)) {
        return thunk;
    }
    return rxjs_1.of(thunk);
}
exports.asObservable = asObservable;
function fileContent(tree, path) {
    const content = tree.read(path);
    if (content === null) {
        throw new schematics_1.SchematicsException(`File ${path} does not exist.`);
    }
    return content.toString('utf-8');
}
exports.fileContent = fileContent;
