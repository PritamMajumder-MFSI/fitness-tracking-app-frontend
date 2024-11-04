import { FormatCamelCasePipe } from './format-camel-case.pipe';

describe('FormatCamelCasePipe', () => {
  let pipe: FormatCamelCasePipe;

  beforeEach(() => {
    pipe = new FormatCamelCasePipe();
  });
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('should format camel case string correctly', () => {
    const input = 'thisIsCamelCase';
    const expectedOutput = 'This is camel case';
    expect(pipe.transform(input)).toBe(expectedOutput);
  });
  it('should handle empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should handle single word input', () => {
    expect(pipe.transform('Word')).toBe('Word');
  });
});
