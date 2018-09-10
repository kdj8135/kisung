"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
function default_1(options) {
    const finalOptions = Object.assign({}, options, { mainNgModule: 'SortableModule', package: 'sortable' //package name, e.g grid
     });
    return schematics_1.externalSchematic('@progress/kendo-schematics', 'ng-add', finalOptions);
}
exports.default = default_1;
//# sourceMappingURL=index.js.map