import { Row } from './row';

export const REASON_MISSING_VALUE = "Missing Value";
export const REASON_INVALID_VALUE = "Invalid Value";

export class ColumnError {
    colNum: number;
    heading: string;
    reason: string;

    constructor(colNum: number, heading: string, reason: string){
        this.colNum = colNum;
        this.heading = heading;
        this.reason = reason;
    }
}

export class RowError {
    rowNum: number;
    row: Row;
    invalidColumns: ColumnError[];
    
    constructor(rowNum: number, row: Row, invalidColumns: ColumnError[]){
        this.rowNum = rowNum;
        this.row = row;
        this.invalidColumns = invalidColumns;
    }
}