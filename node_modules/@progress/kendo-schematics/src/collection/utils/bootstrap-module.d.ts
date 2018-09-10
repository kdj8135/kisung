import * as ts from 'typescript';
import { Tree } from '@angular-devkit/schematics';
export declare function getAppModulePath(host: Tree, mainPath: string): string;
export declare function findBootstrapModuleCall(host: Tree, mainPath: string): ts.CallExpression | null;
export declare function findBootstrapModulePath(host: Tree, mainPath: string): string;
