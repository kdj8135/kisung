"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const ts = require("typescript");
const operators_1 = require("rxjs/operators");
const utils_1 = require("../utils");
function applyChanges(host, path, changes) {
    const recorder = host.beginUpdate(path);
    for (const change of changes) {
        recorder.insertLeft(change.position, change.toAdd);
    }
    host.commitUpdate(recorder);
}
exports.applyChanges = applyChanges;
function addDeclarationToNgModule(options) {
    return (host) => {
        const modulePath = options.module;
        if (!modulePath) {
            return host;
        }
        const sourceText = host.read(modulePath).toString('utf-8');
        const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
        const changes = utils_1.addDeclarationToModule({
            source,
            symbolName: options.symbolName,
            modulePath: options.symbolImport
        });
        applyChanges(host, modulePath, changes);
        return host;
    };
}
exports.addDeclarationToNgModule = addDeclarationToNgModule;
function addToPackageJson(options) {
    return (host) => {
        if (!host.exists('package.json'))
            return host;
        const dependencies = options.dependencies;
        const text = host.read('package.json').toString('utf-8');
        const json = JSON.parse(text);
        json['dependencies'] = Object.assign({}, json['dependencies'], dependencies);
        host.overwrite('package.json', utils_1.stringify(json));
        return host;
    };
}
exports.addToPackageJson = addToPackageJson;
const inlineTemplate = ({ inlineTemplate }) => inlineTemplate ? schematics_1.filter((path) => !path.endsWith('html')) : schematics_1.noop();
const inlineStyle = ({ inlineStyle }) => inlineStyle ? schematics_1.filter((path) => !path.endsWith('__styleext__')) : schematics_1.noop();
function withBase(componentTemplate, rules) {
    return (options) => (host, context) => {
        const extendTemplateContext = (additional = {}) => schematics_1.template(Object.assign({}, core_1.strings, options, { 'folder-name': utils_1.folderName(options), 'full-path': `${options.sourceDir}/${options.path}`, selector: utils_1.buildSelector(options) }, additional));
        const baseComponent = (templateContext) => {
            const templateSource = schematics_1.apply(schematics_1.url('../component/files'), [
                inlineTemplate(options),
                inlineStyle(options),
                extendTemplateContext(templateContext)
            ]);
            const allRules = schematics_1.chain([
                schematics_1.branchAndMerge(schematics_1.mergeWith(templateSource)),
                rules
            ]);
            return utils_1.asObservable(allRules(host, context));
        };
        return componentTemplate(context).pipe(operators_1.switchMap(baseComponent));
    };
}
exports.withBase = withBase;
