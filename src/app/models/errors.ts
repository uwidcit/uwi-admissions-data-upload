import { Row } from './row';

export const REASON_MISSING_VALUE = "Missing Value";
export const REASON_INVALID_VALUE = "Invalid Value";

export interface ColumnError {
    colNum: number;
    heading: string;
    reason: string;
}

export interface RowError {
    rowNum: number;
    row: Row;
    invalidColumns: ColumnError[];
}