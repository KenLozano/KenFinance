const MINOR_UNIT_FACTOR = 100;

export function toMinorUnits(amount: number): number {
  if (!Number.isFinite(amount)) {
    throw new Error('Invalid monetary amount');
  }

  return Math.round(
    (amount + Number.EPSILON) * MINOR_UNIT_FACTOR,
  );
}

export function fromMinorUnits(
  amount: number,
): number {
  return amount / MINOR_UNIT_FACTOR;
}

export function sumMoney(
  amounts: number[],
): number {
  const totalMinorUnits = amounts.reduce(
    (total, amount) =>
      total + toMinorUnits(amount),
    0,
  );

  return fromMinorUnits(totalMinorUnits);
}

export function subtractMoney(
  first: number,
  second: number,
): number {
  return fromMinorUnits(
    toMinorUnits(first) -
      toMinorUnits(second),
  );
}