export interface Schema {
    /**
     * The path to create the component.
     */
    path?: string;
    /**
     * The name of the project.
     */
    project?: string;
    /**
     * Package name to register.
     */
    package: string;
    /**
     * The main NgModule for the package.
     */
    mainNgModule: string;
    /**
     * Allows specification of the declaring module.
     */
    module?: string;
    /**
     * Specifies if declaring module exports the component.
     */
    export?: boolean;
    /**
     * Skip installing Kendo dependency packages.
     */
    skipInstall?: boolean;
    /**
     * Import Hammer.js in the main module.
     */
    importHammerjs?: boolean;
    /**
     * Register Kendo theme.
     */
    theme?: ('default' | 'bootstrap' | 'material');
    /**
     * Additional dependencies for the package.
     */
    dependencies?: Dependency[];
}
export interface Dependency {
    import?: string;
    export?: boolean;
    from: string;
    condition?: boolean;
}
