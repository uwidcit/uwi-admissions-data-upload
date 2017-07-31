import { Row } from './row'
import { ColumnError, RowError, REASON_MISSING_VALUE, REASON_INVALID_VALUE} from './errors'

interface ValidateFunction{
  (fieldNumber: number, fieldName: string, value: string): ColumnError;
}

export class RowValidator {

  private static validateStringField(fieldNumber: number, fieldName: string, value: string) : ColumnError{
    if(value.length === 0) return new ColumnError(fieldNumber, fieldName, REASON_MISSING_VALUE);
    return null;
  }

  private static validateBooleanField(fieldNumber: number, fieldName: string, value: string) : ColumnError{
    if(value.length == 0) return new ColumnError(fieldNumber, fieldName, REASON_MISSING_VALUE);
    else if(value !== "0" && value !== "1") return new ColumnError(fieldNumber, fieldName, REASON_INVALID_VALUE);
    return null;
  }

  private static validateNumberField(fieldNumber: number, fieldName: string, value: string) : ColumnError{
    if(value.length == 0) return new ColumnError(fieldNumber, fieldName, REASON_MISSING_VALUE);
    if(Number.parseInt(value) === NaN) return new ColumnError(fieldNumber, fieldName, REASON_INVALID_VALUE);
    return null;
  }

  private static validateMutuallyExclusiveFields(validationFunction: ValidateFunction, row: Row, 
                                                    indicies: number[], fieldNames: string[]) : ColumnError[] {
    if(indicies.length !== fieldNames.length) throw Error();
    let errors: ColumnError[] = Array(indicies.length);

    for(let i = 0; i < indicies.length; i++){
      let index = indicies[i], filedName = fieldNames[i];
      errors[i] = validationFunction(index + 1, filedName, row[index]);
    }

    let errorCount = errors
      .map((error => error === null ? 0 : 1))
      .reduce(((acc, value) => acc + value), 0);
    
    // A single valid column exists; the other fields can be ignored
    if(errorCount === (indicies.length - 1)) return null;
    
    // None of the fields are valid
    return errors;
  }

  private static handleDependantFieldsErrors(requiredError: ColumnError, dependantErrors: ColumnError[]) : ColumnError {
    // Missing value for required field but the dependant field have values
    let fieldsWithNoErrors = dependantErrors.filter(dependantError => dependantError !== null);
    if(fieldsWithNoErrors.length >= 1) return requiredError; // There a valid field whose required field has an error
    return null; //All fields have errors (assuming missing value error) so the required doesn't matter
  }

  public static validateRow(rowNum: number, row: Row): RowError {
    let columnErrors: ColumnError[] = [];

    columnErrors.push(this.validateStringField(1, "Degree 1", row[0]));
    columnErrors.push(this.validateStringField(2, "Degree 2", row[1]));
    columnErrors.push(this.validateStringField(3, "Programme", row[2]));
    columnErrors.push(this.validateStringField(4, "Faculty", row[3]));

    columnErrors.push(this.validateBooleanField(5, "Full Time", row[4]));
    columnErrors.push(this.validateBooleanField(6, "Part Time", row[5]));
    columnErrors.push(this.validateBooleanField(7, "Evening", row[6]));

    let csecPassesError = this.validateNumberField(8, "CXC Passes", row[7]);
    let csecPassesDependantsErrors = [this.validateStringField(9, "CXC Mandatory", row[8])];
    let csecAnyOfErrors = this.validateMutuallyExclusiveFields(this.validateStringField, row, 
            [9, 10, 11, 12, 13], ["CXC Any 1 of", "CXC Any 2 of", "CXC Any 3 of", "CXC Any 4 of", "CXC Any 5 of"])
    if(csecAnyOfErrors !== null && !csecAnyOfErrors.every(error => error !== null && error.reason === REASON_MISSING_VALUE))
        csecPassesDependantsErrors = csecPassesDependantsErrors.concat(csecAnyOfErrors);
    csecPassesError = this.handleDependantFieldsErrors(csecPassesError, csecPassesDependantsErrors);
    
    let capePassesError = this.validateNumberField(15, "CAPE Passes", row[14]);
    let capePassesDependantsErrors = [this.validateStringField(16, "CAPE Mandatory", row[15])];
    let capeAnyOfErrors = this.validateMutuallyExclusiveFields(this.validateStringField, row, 
            [16, 17, 18, 19, 20], ["CAPE Any 1 of", "CAPE Any 2 of", "CAPE Any 3 of", "CAPE Any 4 of", "CAPE Any 5 of"]);
    if(capeAnyOfErrors != null && !capeAnyOfErrors.every(error => error !== null && error.reason === REASON_MISSING_VALUE))
        capePassesDependantsErrors = capePassesDependantsErrors.concat(capeAnyOfErrors);
    capePassesError = this.handleDependantFieldsErrors(capePassesError, capePassesDependantsErrors);

    columnErrors = columnErrors.filter((value) => value !== null);
    return columnErrors.length === 0 ? null : new RowError(rowNum, row, columnErrors);
  }

}