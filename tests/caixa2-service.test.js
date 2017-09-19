const Caixa2 = require('../bot/services/caixa2-service.js');
const assert = require('assert');

describe('Caixa2', () => {
  describe('_formatDat$$Boyy', () => {
    it('Must format currency values properly', () => {
      const caixa = new Caixa2();

      assert.equal(caixa._formatDat$$Boyy(1), 'R$ 1,00');
      assert.equal(caixa._formatDat$$Boyy(10.99), 'R$ 10,99');
      assert.equal(caixa._formatDat$$Boyy(10.9999), 'R$ 11,00'); // TODO: This rounds, should it?
      assert.equal(caixa._formatDat$$Boyy(1000.99), 'R$ 1.000,99');
      assert.equal(caixa._formatDat$$Boyy(1000000), 'R$ 1.000.000,00');
    });
  });
  describe('_calculateTotal', () => {
    it('Must properly calculate total ammounts in each object', () => {
      const caixa = new Caixa2();

      const debts = [
        {
          'ammount': 10
        },
        {
          'ammount': 20
        },
        {
          'ammount': 5
        }
      ];

      assert.equal(caixa._calculateTotal(debts), 35);
      assert.equal(caixa._calculateTotal([]), 0);
    });
  });
  describe('_getTotalSumOfDebts', () => {
    it('Must properly calculate difference of ammounts from the ingoing/outgoing debts', () => {
      const caixa = new Caixa2();

      const debtsIn = [
        {
          'ammount': 10
        },
        {
          'ammount': 13
        }
      ];
      const debtsOut = [
        {
          'ammount': 10
        },
        {
          'ammount': 20
        },
        {
          'ammount': 5
        }
      ];

      assert.equal(caixa._getTotalSumOfDebts(debtsIn, debtsOut), -12);
      assert.equal(caixa._getTotalSumOfDebts([], []), 0);
    });
  });
});
