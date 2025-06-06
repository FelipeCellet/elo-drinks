import { calcularValorTotal } from '../utils/calculoPreco';

test('calcula valor base para até 50 pessoas', () => {
  expect(calcularValorTotal(50)).toBe(1200);
});

test('calcula valor com adicional para 60 pessoas', () => {
  expect(calcularValorTotal(60)).toBe(1200 + 10 * 25);
});
