"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const config = {
    "peerDependencies": {
        "@progress/kendo-dependency": "^1.0.0",
        "hammerjs": "^2.0.0"
    }
};
function createPackageJson(tree, path) {
    tree.create(path || 'node_modules/@progress/kendo-angular-grid/package.json', __1.stringify(config));
    return tree;
}
exports.createPackageJson = createPackageJson;
