import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { Observable } from 'rxjs';
export declare function applyChanges(host: Tree, path: string, changes: any[]): void;
export declare function addDeclarationToNgModule(options: any): Rule;
export declare function addToPackageJson(options: any): Rule;
export declare type ComponentTemplate = (context: SchematicContext) => Observable<{}>;
export declare function withBase(componentTemplate: ComponentTemplate, rules: Rule): Function;
