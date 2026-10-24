import assert from 'assert';
import validator from '../../src/index';

describe('QA: isFQDN edge-cases for issue #3', () => {
  it('should reject a domain at 254 chars with trailing dot without allow_trailing_dot', () => {
    const label63 = 'a'.repeat(63);
    const domain = `${label63}.${label63}.${label63}.${'a'.repeat(61)}.`;
    assert.strictEqual(domain.length, 254);
    // Trailing dot not allowed by default
    assert.strictEqual(validator.isFQDN(domain), false);
  });

  it('should reject wildcard domains exceeding length limit when allow_wildcard is false', () => {
    const label63 = 'a'.repeat(63);
    const domain = `*.${label63}.${label63}.${label63}.${'a'.repeat(61)}`;
    // Wildcard not allowed by default
    assert.strictEqual(validator.isFQDN(domain), false);
  });

  it('should handle boundary 253 chars with both wildcard and trailing dot', () => {
    const label63 = 'a'.repeat(63);
    // 2 chars (*.) + 63 + 1 + 63 + 1 + 63 + 1 + 61 + 1 (.) = 255 chars total.
    // Excluding '*.' (2) and trailing dot (1), length is 252 chars <= 253.
    const domain252 = `*.${label63}.${label63}.${label63}.${'a'.repeat(60)}.`;
    assert.strictEqual(
      validator.isFQDN(domain252, { allow_wildcard: true, allow_trailing_dot: true }),
      true
    );

    // 253 chars payload:
    const domain253 = `*.${label63}.${label63}.${label63}.${'a'.repeat(61)}.`;
    assert.strictEqual(
      validator.isFQDN(domain253, { allow_wildcard: true, allow_trailing_dot: true }),
      true
    );

    // 254 chars payload:
    const domain254 = `*.${label63}.${label63}.${label63}.${'a'.repeat(62)}.`;
    assert.strictEqual(
      validator.isFQDN(domain254, { allow_wildcard: true, allow_trailing_dot: true }),
      false
    );
  });

  it('should ignore max length when ignore_max_length is true on trailing dot boundary', () => {
    const label63 = 'a'.repeat(63);
    const domain = `${label63}.${label63}.${label63}.${'a'.repeat(62)}.`;
    assert.strictEqual(
      validator.isFQDN(domain, { allow_trailing_dot: true, ignore_max_length: true }),
      true
    );
  });
});
