import { Directive, forwardRef, Attribute } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

/** Validador de IBAN */
export function IbanValidator(control: AbstractControl) {

    const value = control.value;
    if (!value) {
        return null;
    }

    let parsedValue = String(value);
    const invalid = false;

    // iban should be at least 15 characters long
    if (parsedValue.length < 15) {
        return { invalidIban: true };
    }

    // test for illegal characters
    const regexp = new RegExp('^[a-zA-Z0-9]+$');
    if (regexp.test(parsedValue) == false) {
        return { invalidIban: true };
    }

    // move the first four characters to the back and make sure everything is uppercase
    parsedValue = (parsedValue.substr(4) + parsedValue.substr(0, 4)).toUpperCase();
    let valueWithConvertedNumbers: any = '';
    for (let i = 0; i < parsedValue.length; i++) {
        const character: number = parsedValue.charCodeAt(i);

        // If the character is A-Z, we need to convert it to a number from 10-35
        if (character > 64 && character < 91) {
            valueWithConvertedNumbers += String(character - 55);
        }
        else {
            valueWithConvertedNumbers += String.fromCharCode(character);
        }
    }


    const partLength = 10;

    while (valueWithConvertedNumbers.length > partLength) {
        const part: any = valueWithConvertedNumbers.substring(0, partLength);
        valueWithConvertedNumbers = (part % 97) + valueWithConvertedNumbers.substring(partLength);
    }

    const modulo = valueWithConvertedNumbers % 97;


    if (modulo !== 1) {
        return { invalidIban: true };
    }

    return null;
}

  // Modulo of large numbers
  // See https://stackoverflow.com/questions/929910/modulo-in-javascript-large-number


