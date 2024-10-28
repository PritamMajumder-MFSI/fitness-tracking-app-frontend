import { FormGroup } from '@angular/forms';

export default function getErrorMessage(
  controlName: string,
  form: FormGroup
): string | null {
  const control = form?.get(controlName);

  if (controlName === 'confirmPassword') {
    if (control?.hasError('required')) {
      return 'Confirming password is required';
    }

    if (control?.hasError('passwordsMismatch')) {
      return 'Passwords do not match';
    }
  }
  if (control?.hasError('required')) {
    return `${
      controlName.charAt(0).toUpperCase() + controlName.slice(1)
    } is required`;
  }
  if (control?.hasError('minlength')) {
    return `${
      controlName.charAt(0).toUpperCase() + controlName.slice(1)
    } must be at least ${
      control.getError('minlength').requiredLength
    } characters`;
  }
  if (control?.hasError('maxlength')) {
    return `${
      controlName.charAt(0).toUpperCase() + controlName.slice(1)
    } cannot exceed ${control.getError('maxlength').requiredLength} characters`;
  }
  if (control?.hasError('pattern')) {
    if (controlName === 'username') {
      return 'Username must be alphanumeric';
    }
    if (controlName === 'password') {
      return 'Password must contain at least one alphabet and one number';
    }
  }

  return null;
}
