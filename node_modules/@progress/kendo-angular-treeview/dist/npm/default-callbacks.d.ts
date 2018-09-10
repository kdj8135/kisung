import { CheckedState } from './checkbox/checked-state';
/**
 * @hidden
 */
export declare const hasChildren: <T>(item: T) => boolean;
/**
 * @hidden
 */
export declare const isChecked: <T>(item: T, index: string) => CheckedState;
/**
 * @hidden
 */
export declare const isDisabled: <T>(item: T, index: string) => boolean;
/**
 * @hidden
 */
export declare const isExpanded: <T>(item: T, index: string) => boolean;
/**
 * @hidden
 */
export declare const isSelected: <T>(item: T, index: string) => boolean;
