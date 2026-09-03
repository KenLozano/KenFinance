import {
  fromMinorUnits,
  subtractMoney,
  sumMoney,
  toMinorUnits,
} from './money';

import {
  describe,
  expect,
  it,
} from 'vitest';


describe('money utilities', () => {
  describe('toMinorUnits', () => {
    it('should convert decimal amounts to minor units', () => {
      expect(
        toMinorUnits(10.25),
      ).toBe(1025);
    });

    it('should handle floating point precision safely', () => {
      expect(
        toMinorUnits(0.1 + 0.2),
      ).toBe(30);
    });

    it('should round to two decimal places', () => {
      expect(
        toMinorUnits(10.999),
      ).toBe(1100);
    });

    it('should preserve negative amounts', () => {
      expect(
        toMinorUnits(-5.25),
      ).toBe(-525);
    });

    it('should reject NaN', () => {
      expect(() =>
        toMinorUnits(NaN),
      ).toThrowError(
        'Invalid monetary amount',
      );
    });

    it('should reject Infinity', () => {
      expect(() =>
        toMinorUnits(Infinity),
      ).toThrowError(
        'Invalid monetary amount',
      );
    });
  });

  describe('fromMinorUnits', () => {
    it('should convert minor units to decimal amounts', () => {
      expect(
        fromMinorUnits(1025),
      ).toBe(10.25);
    });

    it('should support negative values', () => {
      expect(
        fromMinorUnits(-525),
      ).toBe(-5.25);
    });
  });

  describe('sumMoney', () => {
    it('should sum monetary values without floating point errors', () => {
      expect(
        sumMoney([
          0.1,
          0.2,
        ]),
      ).toBe(0.3);
    });

    it('should sum multiple decimal values correctly', () => {
      expect(
        sumMoney([
          10.25,
          5.5,
          1.25,
        ]),
      ).toBe(17);
    });

    it('should return zero for an empty array', () => {
      expect(
        sumMoney([]),
      ).toBe(0);
    });
  });

  describe('subtractMoney', () => {
    it('should subtract monetary values safely', () => {
      expect(
        subtractMoney(
          0.3,
          0.1,
        ),
      ).toBe(0.2);
    });

    it('should support negative results', () => {
      expect(
        subtractMoney(
          5,
          10,
        ),
      ).toBe(-5);
    });
  });
});