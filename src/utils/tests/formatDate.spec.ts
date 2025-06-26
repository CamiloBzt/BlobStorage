import { formatDate } from '@/utils/formatDate';

describe('formatDate', () => {
  it('✔️ Should format a valid date string correctly', () => {
    const inputDate = '2025-03-01T10:15:30Z';
    const expectedOutput = '2025-03-01 05:15:30';
    expect(formatDate(inputDate)).toBe(expectedOutput);
  });

  it('❌ Should return an empty string for null input', () => {
    expect(formatDate(null)).toBe('-');
  });

  it('❌ Should return an empty string for undefined input', () => {
    expect(formatDate(undefined)).toBe('-');
  });

  it('❌ Should return an empty string for an invalid date string', () => {
    expect(formatDate('invalid-date')).toBe('-');
  });

  it('🔄 Should correctly format a date at the beginning of the year', () => {
    const inputDate = '2025-01-01T00:00:00Z';
    const expectedOutput = '2024-12-31 19:00:00';
    expect(formatDate(inputDate)).toBe(expectedOutput);
  });

  it('🔄 Should correctly format a date at the end of the year', () => {
    const inputDate = '2025-12-31T23:59:59Z';
    const expectedOutput = '2025-12-31 18:59:59';
    expect(formatDate(inputDate)).toBe(expectedOutput);
  });

  it('🚨 Should correctly handle a leap year date', () => {
    const inputDate = '2024-02-29T12:30:45Z';
    const expectedOutput = '2024-02-29 07:30:45';
    expect(formatDate(inputDate)).toBe(expectedOutput);
  });

  it('✔️ Should correctly format a date with single-digit month and day', () => {
    const inputDate = '2025-04-09T07:05:03Z';
    const expectedOutput = '2025-04-09 02:05:03';
    expect(formatDate(inputDate)).toBe(expectedOutput);
  });

  it('✔️ Should correctly handle a time zone difference', () => {
    const inputDate = '2025-06-15T15:45:20+02:00';
    const expectedOutput = '2025-06-15 08:45:20';
    expect(formatDate(inputDate)).toBe(expectedOutput);
  });
});
