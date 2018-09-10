"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const operators_1 = require("rxjs/operators");
const utils_1 = require("../utils");
const rules_1 = require("../rules");
const packageDeps = {
    "@progress/kendo-angular-grid": "latest"
};
const templateSource = schematics_1.url('files');
const templateContent = (t) => ({
    templateContent: t.read('content.tmpl').toString()
});
const prepareTemplates = (context) => utils_1.asObservable(templateSource(context)).pipe(operators_1.map(templateContent));
function grid(options) {
    const moduleOptions = {
        module: options.module,
        symbolName: 'BarComponent',
        symbolImport: '@progress/kendo-bar'
    }; //resolve declr, imports, exports, etc.
    const dependencies = {}; //resolve package deps.
    const rules = schematics_1.chain([
        rules_1.addDeclarationToNgModule(moduleOptions),
        rules_1.addToPackageJson({ dependencies })
    ]);
    return rules_1.withBase(prepareTemplates, rules)(options);
}
exports.grid = grid;
