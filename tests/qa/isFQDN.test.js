import assert from 'assert';
import validator from '../../src/index';

describe('QA: isFQDN max length check', () => {
  it('should reject domains exceeding 253 characters', () => {
    const label63 = 'a'.repeat(63);
    // 63 + 1 + 63 + 1 + 63 + 1 + 61 = 253 characters
    const domain253 = `${label63}.${label63}.${label63}.${'a'.repeat(61)}`;
    assert.strictEqual(domain253.length, 253);
    assert.strictEqual(validator.isFQDN(domain253), true);

    // 63 + 1 + 63 + 1 + 63 + 1 + 62 = 254 characters
    const domain254 = `${label63}.${label63}.${label63}.${'a'.repeat(62)}`;
    assert.strictEqual(domain254.length, 254);
    assert.strictEqual(validator.isFQDN(domain254), false);
  });

  it('should allow domains exceeding 253 characters when ignore_max_length is true', () => {
    const label63 = 'a'.repeat(63);
    const domain260 = [label63, label63, label63, label63, 'comm'].join('.');
    assert.strictEqual(validator.isFQDN(domain260, { ignore_max_length: true }), true);
  });

  it('should handle boundary lengths with trailing dot', () => {
    const label63 = 'a'.repeat(63);
    // 253 chars + trailing dot = 254 chars total, 253 excluding trailing dot
    const domain253Dot = `${label63}.${label63}.${label63}.${'a'.repeat(61)}.`;
    assert.strictEqual(domain253Dot.length, 254);
    assert.strictEqual(validator.isFQDN(domain253Dot, { allow_trailing_dot: true }), true);

    // 254 chars + trailing dot = 255 chars total, 254 excluding trailing dot
    const domain254Dot = `${label63}.${label63}.${label63}.${'a'.repeat(62)}.`;
    assert.strictEqual(domain254Dot.length, 255);
    assert.strictEqual(validator.isFQDN(domain254Dot, { allow_trailing_dot: true }), false);
  });

  it('should handle boundary lengths with wildcard', () => {
    const label63 = 'a'.repeat(63);
    // 253 chars excluding '*.' wildcard
    const domain253Wildcard = `*.${label63}.${label63}.${label63}.${'a'.repeat(61)}`;
    assert.strictEqual(validator.isFQDN(domain253Wildcard, { allow_wildcard: true }), true);

    // 254 chars excluding '*.' wildcard
    const domain254Wildcard = `*.${label63}.${label63}.${label63}.${'a'.repeat(62)}`;
    assert.strictEqual(validator.isFQDN(domain254Wildcard, { allow_wildcard: true }), false);
  });
});
