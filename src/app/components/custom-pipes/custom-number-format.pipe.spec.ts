import { CustomNumberFormatPipe } from './custom-number-format.pipe';

describe('CustomNumberFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new CustomNumberFormatPipe();
    expect(pipe).toBeTruthy();
  });
});
