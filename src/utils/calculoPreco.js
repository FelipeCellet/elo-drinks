export const calcularValorTotal = (pessoas, precoBase = 1200) => {
  const adicional = pessoas > 50 ? (pessoas - 50) * 25 : 0;
  return precoBase + adicional;
};
