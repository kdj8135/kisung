"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const utils_1 = require("../utils");
const rules_1 = require("../rules");
const prepareTemplates = (_context) => utils_1.asObservable({
    templateContent: ''
});
function testComponent(options) {
    return rules_1.withBase(prepareTemplates, schematics_1.noop())(options);
}
exports.testComponent = testComponent;
