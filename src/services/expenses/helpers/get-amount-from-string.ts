import Dinero from 'dinero.js';

export const makeGetAmountFromString = () => {
  return async function getAmountFromString(
      amountString: string,
  ) {
    // eslint-disable-next-line new-cap
    return Dinero({
      amount: parseFloat(amountString.slice(1, amountString.length)) * 100,
      precision: 2,
      currency: 'EUR',
    });
  };
};
