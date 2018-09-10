"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
function getWorkspace(host) {
    const path = getWorkspacePath(host);
    const configBuffer = host.read(path);
    if (configBuffer === null) {
        throw new schematics_1.SchematicsException(`Could not find (${path})`);
    }
    const config = configBuffer.toString();
    return JSON.parse(config);
}
exports.getWorkspace = getWorkspace;
function getWorkspacePath(host) {
    const possibleFiles = ['/angular.json', '/.angular.json'];
    const path = possibleFiles.filter(path => host.exists(path))[0];
    return path;
}
exports.getWorkspacePath = getWorkspacePath;
/**
 * Gets a project from the Angular CLI workspace. If no project name is given, the first project
 * will be retrieved.
 */
function getProjectFromWorkspace(config, projectName) {
    if (!config.projects)
        throw new schematics_1.SchematicsException('No projects are defined');
    if (projectName) {
        const project = config.projects[projectName];
        if (!project) {
            throw new schematics_1.SchematicsException(`No project named "${projectName}" exists.`);
        }
        Object.defineProperty(project, 'name', { enumerable: false, value: projectName });
        return project;
    }
    // If there is exactly one non-e2e, non-library project, use that. 
    // Otherwise, project must be specified.
    const allProjectNames = Object.entries(config.projects)
        .filter(([name, value]) => value.projectType !== 'library')
        .filter(([name, _]) => !name.includes('e2e'));
    if (allProjectNames.length !== 1)
        throw new schematics_1.SchematicsException('Multiple projects are defined; please specify a project name');
    const [name, _] = allProjectNames[0];
    const project = config.projects[name];
    Object.defineProperty(project, 'name', { enumerable: false, value: projectName });
    return project;
}
exports.getProjectFromWorkspace = getProjectFromWorkspace;
function resolveProject(host, projectName) {
    const workspace = getWorkspace(host);
    return getProjectFromWorkspace(workspace, projectName);
}
exports.resolveProject = resolveProject;
