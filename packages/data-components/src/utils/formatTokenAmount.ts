/**
 * Безопасно конвертирует количество токенов из наименьших единиц (например, лампортов) в основную единицу (например, SOL)
 * @param amount - количество в наименьших единицах
 * @param decimals - количество десятичных знаков
 * @returns строковое представление числа с фиксированным количеством знаков после запятой
 */
export function formatTokenAmount(
  amount: number | bigint,
  decimals: number
): string {
  try {
    // Преобразуем в BigInt для безопасной работы с большими числами
    const bigAmount = BigInt(amount);
    const divisor = BigInt(10) ** BigInt(decimals);

    // Получаем целую и дробную части
    const whole = bigAmount / divisor;
    const fraction = bigAmount % divisor;

    // Форматируем дробную часть, добавляя ведущие нули
    const fractionStr = fraction.toString().padStart(decimals, "0");

    // Если дробная часть равна 0, возвращаем только целую часть
    if (fraction === BigInt(0)) {
      return whole.toString();
    }

    // Убираем незначащие нули в конце
    const trimmedFraction = fractionStr.replace(/0+$/, "");

    return `${whole}.${trimmedFraction}`;
  } catch (error) {
    console.error("Ошибка при форматировании суммы токена:", error);
    return "0";
  }
}
