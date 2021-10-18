import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn
} from '@angular/forms';

export const confirmaPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (control != null) {
    const password = control.get('password');
    const confirmaPassword = control.get('confirmaPassword');

    if (password?.value !== confirmaPassword?.value) {
      const error = { confirmaPasswordValidator: true };
      confirmaPassword?.setErrors(error);
      return error;
    } else {
      confirmaPassword?.setErrors(null);
    }
  }
  return null;
};

@Directive({
  selector: '[appConfirmaPasswordValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ConfirmaPasswordValidatorDirective,
      multi: true
    }
  ]
})
export class ConfirmaPasswordValidatorDirective implements Validator {
  constructor() {
    console.log("constructor");
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return confirmaPasswordValidator(control);
  }
}
