import assert from 'assert';
import validator from '../../src/index';

describe('QA: Issue #1 - isCreditCard Mastercard anchoring edge cases', () => {
  it('should reject short 4-digit strings starting with 51-55 like 5108', () => {
    assert.strictEqual(validator.isCreditCard('5108'), false);
    assert.strictEqual(validator.isCreditCard('5108', { provider: 'mastercard' }), false);
  });

  it('should reject 4-digit strings starting with 51-55 that pass Luhn', () => {
    // 5100: Luhn check: double every second from right -> 5 (-> 1), 1, 0 (-> 0), 0 => 1+1+0+0 = 2 != 0 mod 10
    // 5104: 5 (-> 1), 1, 0 (-> 0), 4 => 1+1+0+4 = 6
    // 5108: 5 (-> 1), 1, 0 (-> 0), 8 => 1+1+0+8 = 10 % 10 == 0! "5108" is Luhn-valid!
    assert.strictEqual(validator.isCreditCard('5108'), false);
    assert.strictEqual(validator.isCreditCard('5500'), false);
  });

  it('should reject partial mastercard strings with invalid suffixes', () => {
    assert.strictEqual(validator.isCreditCard('5108foo'), false);
    assert.strictEqual(validator.isCreditCard('51081234'), false);
  });

  it('should reject 2-series 4-digit partials even if Luhn-valid', () => {
    // 2221, 2720 prefixes
    assert.strictEqual(validator.isCreditCard('2221'), false);
    assert.strictEqual(validator.isCreditCard('2720'), false);
  });

  it('should reject short Mastercard inputs with provider option mastercard', () => {
    assert.strictEqual(validator.isCreditCard('5108', { provider: 'mastercard' }), false);
    assert.strictEqual(validator.isCreditCard('5108foo', { provider: 'mastercard' }), false);
    assert.strictEqual(validator.isCreditCard('2221', { provider: 'mastercard' }), false);
  });

  it('should reject 15-digit or 17-digit Mastercard numbers', () => {
    // Mastercard must be exactly 16 digits
    assert.strictEqual(validator.isCreditCard('510800000000000'), false); // 15 digits
    assert.strictEqual(validator.isCreditCard('51080000000000000'), false); // 17 digits
  });
});
