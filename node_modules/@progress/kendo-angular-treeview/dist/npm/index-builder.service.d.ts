/**
 * @hidden
 */
export declare class IndexBuilderService {
    private INDEX_SEPARATOR;
    nodeIndex(index?: string, parentIndex?: string): string;
    indexForLevel(index: string, level: number): string;
    lastLevelIndex(index?: string): number;
    level(index: string): number;
}
