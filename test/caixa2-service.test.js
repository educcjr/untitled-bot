process.env.NODE_ENV = 'test';

const Caixa2 = require('../bot/services/caixa2-service.js');
const assert = require('assert');

describe('Caixa2', () => {
  const caixa = new Caixa2();

  describe('formatDat$$Boyy', () => {
    it('Must format currency values properly', () => {
      assert.equal(caixa.formatDat$$Boyy(1), 'R$ 1,00');
      assert.equal(caixa.formatDat$$Boyy(10.99), 'R$ 10,99');
      assert.equal(caixa.formatDat$$Boyy(10.9999), 'R$ 11,00'); // TODO: This rounds, should it?
      assert.equal(caixa.formatDat$$Boyy(1000.99), 'R$ 1.000,99');
      assert.equal(caixa.formatDat$$Boyy(1000000), 'R$ 1.000.000,00');
    });
  });

  describe('calculateTotal', () => {
    it('Must properly calculate total ammounts in each object', () => {
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

      assert.equal(caixa.calculateTotal(debts), 35);
      assert.equal(caixa.calculateTotal([]), 0);
    });
  });

  describe('getTotalSumOfDebts', () => {
    it('Must properly calculate difference of ammounts from the ingoing/outgoing debts', () => {
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

      assert.equal(caixa.getTotalSumOfDebts(debtsIn, debtsOut), -12);
      assert.equal(caixa.getTotalSumOfDebts([], []), 0);
    });
  });

  describe('returnUnpaidDebts', () => {
    it('Must return empty arrays, if both inputs are empty', () => {
      assert.deepEqual(caixa.returnUnpaidDebts([], []), [[], []]);
    });

    it('Must return all from input 1, if input 2 is empty', () => {
      assert.deepEqual(caixa.returnUnpaidDebts([{ ammount: 10 }], []), [[{ ammount: 10 }], []]);
    });

    it('Must return all from input 2, if input 1 is empty', () => {
      assert.deepEqual(caixa.returnUnpaidDebts([], [{ ammount: 10 }]), [[], [{ ammount: 10 }]]);
    });

    it('Must return empty if both users are even', () => {
      const debtsIn = [
        {
          'ammount': 15
        }
      ];
      const debtsOut = [
        {
          'ammount': 10
        },
        {
          'ammount': 5
        }
      ];

      const debtsExpected = [
        [],
        []
      ];

      assert.deepEqual(caixa.returnUnpaidDebts(debtsIn, debtsOut), debtsExpected);
    });

    it('Must return all from the input that has the largest total ammount that count up to the smallest\'s ammount', () => {
      const debtsIn = [
        {
          'ammount': 10
        }
      ];
      const debtsOut = [
        {
          'ammount': 10
        },
        {
          'ammount': 10
        }
      ];

      const debtsExpected = [
        [],
        [
          {
            'ammount': 10
          }
        ]
      ];

      assert.deepEqual(caixa.returnUnpaidDebts(debtsIn, debtsOut), debtsExpected);
    });

    it('Must handle complex ammount cases', () => {
      const debtsIn = [
        {
          'ammount': 15
        }
      ];
      const debtsOut = [
        {
          'ammount': 10
        },
        {
          'ammount': 10
        }
      ];

      const debtsExpected = [
        [],
        [
          {
            'ammount': 10
          }
        ]
      ];

      assert.deepEqual(caixa.returnUnpaidDebts(debtsIn, debtsOut), debtsExpected);
    });
  });
});
