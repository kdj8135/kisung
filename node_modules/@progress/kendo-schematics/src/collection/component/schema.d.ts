export interface Schema {
    /**
     * The name of the component.
     */
    name: string;
    /**
     * The path of the source directory.
     */
    sourceDir?: string;
    /**
     * The path to create the component.
     */
    path?: string;
    /**
     * The root of the application.
     */
    appRoot?: string;
    /**
     * Flag to indicate if a dir is created.
     */
    flat?: boolean;
    /**
     * The selector to use for the component.
     */
    selector?: string;
    /**
     * The prefix to apply to generated selectors.
     */
    prefix?: string;
    /**
     * Specifies if the template will be in the ts file.
     */
    inlineTemplate?: boolean;
    /**
     * Specifies if the style will be in the ts file.
     */
    inlineStyle?: boolean;
    /**
     * The file extension to be used for style files.
     */
    styleext?: string;
    /**
     * Specifies the view encapsulation strategy.
     */
    viewEncapsulation?: ('Emulated' | 'Native' | 'None');
    /**
     * Specifies the change detection strategy.
     */
    changeDetection?: ('Default' | 'OnPush');
    /**
     * Allows specification of the declaring module.
     */
    module?: string;
    /**
     * Flag to skip the module import.
     */
    skipImport?: boolean;
    /**
     * Specifies if declaring module exports the component.
     */
    export?: boolean;
}
