"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
exports.addDeclarationToModule = (options) => addToModule('declarations', options);
exports.addImportToModule = (options) => addToModule('imports', options);
exports.addExportToModule = (options) => addToModule('exports', options);
const addToModule = (metadataField, options) => {
    const result = exports.addSymbolToMetadata(options.source, metadataField, options.symbolName);
    if (options.modulePath) {
        return result.concat(exports.insertImport(options.source, options.symbolName, options.modulePath));
    }
    return result;
};
exports.ngModuleMetadata = (source) => {
    const decorator = decoratorMetadata(source, 'NgModule')
        .filter(node => ofKind(node.arguments[0], ts.SyntaxKind.ObjectLiteralExpression))[0];
    if (!decorator) {
        return null;
    }
    return decorator.arguments[0];
};
exports.addSymbolToMetadata = (source, metadataField, symbolName) => {
    if (!symbolName)
        return [];
    const node = exports.ngModuleMetadata(source);
    if (!node) {
        return [];
    }
    const property = findProperty(node.properties, metadataField);
    if (!property) {
        return [
            addMetaField(node, `${metadataField}: [${symbolName}]`)
        ];
    }
    if (!ofKind(property.initializer, ts.SyntaxKind.ArrayLiteralExpression)) {
        //We cannot handle it if is not a array literal
        return [];
    }
    const elements = property.initializer.elements;
    if (elements.length === 0) {
        return [{
                position: property.initializer.getEnd() - 1,
                toAdd: symbolName
            }];
    }
    const exists = elements.map(e => e.getText()).find(t => t === symbolName);
    //already there
    if (exists) {
        return [];
    }
    return [
        format(elements, symbolName)
    ];
};
const addMetaField = (node, text) => {
    if (node.properties.length === 0) {
        return {
            position: node.getEnd() - 1,
            toAdd: text
        };
    }
    return format(node.properties, text);
};
const format = (nodes, text) => {
    let toAdd = `, ${text}`;
    const lastNode = nodes[nodes.length - 1];
    const matches = lastNode.getFullText().match(/^\r?\n\s*/);
    if (matches && matches.length > 0) {
        toAdd = `,${matches[0]}${text}`;
    }
    return {
        position: lastNode.getEnd(),
        toAdd
    };
};
const formatNode = (node, text) => {
    let toAdd = `${text}`;
    return {
        position: node.getStart(),
        toAdd
    };
};
const anyOf = (kind, possible) => possible.reduce((result, current) => result || current === kind, false);
const ofKind = (node, ...kinds) => node && anyOf(node.kind, kinds);
const isNgModelIdentifier = (node, name) => ofKind(node, ts.SyntaxKind.Identifier) && node.getText() === name;
function findNode(node, kind, text) {
    if (node.kind === kind && node.getText() === text) {
        return node;
    }
    let foundNode = null;
    ts.forEachChild(node, childNode => {
        foundNode = foundNode || findNode(childNode, kind, text);
    });
    return foundNode;
}
exports.findNode = findNode;
exports.nodesByKind = (source, kind) => {
    const nodes = [source];
    const result = [];
    let node;
    while (node = nodes.shift()) {
        if (ofKind(node, kind)) {
            result.push(node);
        }
        if (node.getChildCount()) {
            nodes.unshift(...node.getChildren());
        }
    }
    return result;
};
const findProperty = (props, metadataField) => props
    .filter(prop => ofKind(prop, ts.SyntaxKind.PropertyAssignment))
    .filter(prop => {
    const name = prop.name;
    if (ofKind(name, ts.SyntaxKind.Identifier)) {
        return name.text === metadataField;
    }
    if (ofKind(name, ts.SyntaxKind.StringLiteral)) {
        return name.text === metadataField;
    }
    return false;
})[0];
const decoratorMetadata = (source, name) => exports.nodesByKind(source, ts.SyntaxKind.Decorator)
    .map(decorator => decorator.expression)
    .filter(expression => expression.kind === ts.SyntaxKind.CallExpression)
    .map(expression => expression)
    .filter(node => {
    //@NgModule({ ... })
    let expr = node.expression;
    //@foo.NgModule({ ... })
    if (expr.kind === ts.SyntaxKind.PropertyAccessExpression) {
        expr = expr.name;
    }
    return isNgModelIdentifier(expr, name);
});
exports.insertImport = (source, symbolName, importFrom) => {
    const isSideEffectsImport = !symbolName;
    const allImports = exports.nodesByKind(source, ts.SyntaxKind.ImportDeclaration);
    const imports = allImports
        .filter(node => node.getChildren()
        .filter(child => ofKind(child, ts.SyntaxKind.StringLiteral))
        .map(child => child.text)
        .indexOf(importFrom) !== -1);
    if (imports.length) {
        return exitExisting(imports, symbolName);
    }
    let position = 0;
    let prefix = '';
    if (allImports.length) {
        position = allImports[allImports.length - 1].getEnd();
        prefix = '\n';
    }
    else {
        const useStrict = useStrictNode(source);
        if (useStrict.length) {
            position = useStrict[0].getEnd();
            prefix = '\n';
        }
    }
    // missing module declaration
    const toAdd = isSideEffectsImport ?
        `${prefix}import '${importFrom}';\n` :
        `${prefix}import { ${symbolName} } from '${importFrom}';\n`;
    return [{
            position,
            toAdd
        }];
};
const useStrictNode = (source) => exports.nodesByKind(source, ts.SyntaxKind.StringLiteral)
    .filter(node => node.text === 'use strict');
const exitExisting = (imports, symbolName) => {
    const importAsterisk = imports.reduce((acc, cur) => acc || exports.nodesByKind(cur, ts.SyntaxKind.AsteriskToken).length > 0, false);
    // symbol is imported with * from the module
    // e.g import * from '...';
    if (importAsterisk) {
        return [];
    }
    const importsText = imports.reduce((acc, cur) => [...acc, ...exports.nodesByKind(cur, ts.SyntaxKind.Identifier)], [])
        .filter(node => node.text === symbolName);
    // module declaration
    // symbol is not imported
    if (importsText.length === 0) {
        const namedImport = exports.nodesByKind(imports[0], ts.SyntaxKind.NamedImports)[0];
        if (!namedImport) {
            // it should be import 'some-package';
            return [];
        }
        if (!namedImport.elements.length) {
            return [
                formatNode(namedImport.getLastToken(), symbolName)
            ];
        }
        return [
            format(namedImport.elements, symbolName)
        ];
    }
    // symbol already imported from the module
    return [];
};
