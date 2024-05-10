import { AbstractControl, ValidatorFn } from '@angular/forms';

export function sameValueValidator(previousValue: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const currentValue = control.value;
    if (currentValue === previousValue) {
      return { sameAsPrevious: true };
    }
    return null;
  };
}
