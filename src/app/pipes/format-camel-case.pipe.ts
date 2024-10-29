import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCamelCase',
  standalone: true,
})
export class FormatCamelCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const formattedValue = value
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .replace(/^./, (str) => str.toUpperCase());

    return formattedValue;
  }
}
