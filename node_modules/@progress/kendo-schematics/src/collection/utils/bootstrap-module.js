"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const path_1 = require("path");
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const _1 = require(".");
const ast_utils_1 = require("./ast-utils");
function getAppModulePath(host, mainPath) {
    const moduleRelativePath = findBootstrapModulePath(host, mainPath);
    const mainDir = path_1.dirname(mainPath);
    const modulePath = core_1.normalize(`/${mainDir}/${moduleRelativePath}.ts`);
    return modulePath;
}
exports.getAppModulePath = getAppModulePath;
function findBootstrapModuleCall(host, mainPath) {
    const sourceText = _1.fileContent(host, mainPath);
    const source = ts.createSourceFile(mainPath, sourceText, ts.ScriptTarget.Latest, true);
    const calls = ast_utils_1.nodesByKind(source, ts.SyntaxKind.CallExpression)
        .filter(call => ast_utils_1.findNode(call, ts.SyntaxKind.Identifier, 'bootstrapModule'));
    return calls[calls.length - 1];
}
exports.findBootstrapModuleCall = findBootstrapModuleCall;
function findBootstrapModulePath(host, mainPath) {
    const bootstrapCall = findBootstrapModuleCall(host, mainPath);
    if (!bootstrapCall) {
        throw new schematics_1.SchematicsException('Bootstrap call not found');
    }
    const bootstrapModule = bootstrapCall.arguments[0];
    const mainBuffer = host.read(mainPath);
    if (!mainBuffer) {
        throw new schematics_1.SchematicsException(`Client app main file (${mainPath}) not found`);
    }
    const mainText = mainBuffer.toString('utf-8');
    const source = ts.createSourceFile(mainPath, mainText, ts.ScriptTarget.Latest, true);
    const allImports = ast_utils_1.nodesByKind(source, ts.SyntaxKind.ImportDeclaration);
    const bootstrapModuleRelativePath = allImports
        .filter(node => node.kind === ts.SyntaxKind.ImportDeclaration)
        .filter(imp => {
        return ast_utils_1.findNode(imp, ts.SyntaxKind.Identifier, bootstrapModule.getText());
    })
        .map((imp) => {
        const modulePathStringLiteral = imp.moduleSpecifier;
        return modulePathStringLiteral.text;
    })[0];
    return bootstrapModuleRelativePath;
}
exports.findBootstrapModulePath = findBootstrapModulePath;
