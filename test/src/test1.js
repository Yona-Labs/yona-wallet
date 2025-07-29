// const { Buffer } = require("buffer");

/**
 * Парсит base64 данные SPL Token Account и возвращает структурированный объект
 * @param {string} base64Data - base64 строка с данными аккаунта
 * @returns {Object|null} - спаршенный объект с данными или null при ошибке
 */
export function parseSplTokenAccount(base64Data) {
  try {
    const buffer = Buffer.from(base64Data, "base64");

    // Проверяем размер (должен быть 165 байт для SPL Token Account)
    if (buffer.length !== 165) {
      throw new Error(
        `Неверный размер данных: ${buffer.length} байт, ожидается 165`
      );
    }

    // Парсим структуру SPL Token Account:
    // 0-32: mint (публичный ключ токена)
    // 32-64: owner (владелец аккаунта)
    // 64-72: amount (количество токенов, u64)
    // 72: delegate_option (1 байт)
    // 73-105: delegate (32 байта, если delegate_option == 1)
    // 105: state (1 байт: 0=неинициализирован, 1=инициализирован, 2=заморожен)
    // 106: is_native_option (1 байт)
    // 107-115: native_amount (8 байт, если is_native_option == 1)
    // 115-123: delegated_amount (u64)
    // 123: close_authority_option (1 байт)
    // 124-156: close_authority (32 байта, если close_authority_option == 1)

    const mint = buffer.slice(0, 32);
    const owner = buffer.slice(32, 64);
    const amount = buffer.readBigUInt64LE(64);
    const delegateOption = buffer[72];
    const state = buffer[105]; // Исправленный индекс
    const isNativeOption = buffer[106]; // Исправленный индекс
    const delegatedAmount = buffer.readBigUInt64LE(115);
    const closeAuthorityOption = buffer[123];

    // Формируем результирующий объект
    const result = {
      mint: {
        address: encodeBase58(mint),
        hex: mint.toString("hex"),
      },
      owner: {
        address: encodeBase58(owner),
        hex: owner.toString("hex"),
      },
      amount: {
        raw: amount.toString(),
      },
      state: {
        code: state,
        name: getTokenAccountStateName(state),
      },
      delegate: null,
      isNative: {
        enabled: isNativeOption === 1,
        amount: null,
      },
      delegatedAmount: {
        raw: delegatedAmount.toString(),
      },
      closeAuthority: null,
      metadata: {
        size: buffer.length,
        hex: buffer.toString("hex"),
      },
    };

    // Парсим delegate если есть
    if (delegateOption === 1) {
      const delegate = buffer.slice(73, 105);
      result.delegate = {
        address: encodeBase58(delegate),
        hex: delegate.toString("hex"),
      };
    }

    // Парсим native amount если есть
    if (isNativeOption === 1) {
      const nativeAmount = buffer.readBigUInt64LE(107);
      result.isNative.amount = {
        raw: nativeAmount.toString(),
      };
    }

    // Парсим close authority если есть
    if (closeAuthorityOption === 1) {
      const closeAuthority = buffer.slice(124, 156);
      result.closeAuthority = {
        address: encodeBase58(closeAuthority),
        hex: closeAuthority.toString("hex"),
      };
    }

    return result;
  } catch (error) {
    console.error("Ошибка при парсинге SPL Token Account:", error.message);
    return null;
  }
}

/**
 * Возвращает название состояния токен аккаунта
 */
function getTokenAccountStateName(state) {
  switch (state) {
    case 0:
      return "Неинициализирован";
    case 1:
      return "Инициализирован";
    case 2:
      return "Заморожен";
    default:
      return `Неизвестное состояние (${state})`;
  }
}

/**
 * Декодирует base64 данные аккаунта Solana и показывает их в различных форматах
 */
export function decodeSolanaAccountData(base64Data) {
  try {
    // Декодируем base64 в Buffer
    const buffer = Buffer.from(base64Data, "base64");

    console.log("=== Декодирование данных Solana ===");
    console.log("Оригинальная base64 строка:", base64Data);
    console.log("Размер данных (байт):", buffer.length);
    console.log("");

    // Показываем данные в разных форматах
    console.log("Hex представление:", buffer.toString("hex"));
    console.log("");

    // Анализируем как SPL Token Account (165 байт = стандартный размер)
    if (buffer.length === 165) {
      console.log("=== Анализ как SPL Token Account ===");
      analyzeSplTokenAccount(buffer);
    }

    // Показываем первые 32 байта как возможные публичные ключи
    if (buffer.length >= 32) {
      const firstKey = buffer.slice(0, 32);
      console.log("Первые 32 байта (возможный публичный ключ):");
      console.log("  Hex:", firstKey.toString("hex"));
      console.log("  Base58:", encodeBase58(firstKey));
    }

    if (buffer.length >= 64) {
      const secondKey = buffer.slice(32, 64);
      console.log("Следующие 32 байта (второй возможный ключ):");
      console.log("  Hex:", secondKey.toString("hex"));
      console.log("  Base58:", encodeBase58(secondKey));
    }

    // Анализируем структуру данных
    analyzeDataStructure(buffer);

    return {
      buffer,
      hex: buffer.toString("hex"),
      size: buffer.length,
      isSplTokenAccount: buffer.length === 165,
    };
  } catch (error) {
    console.error("Ошибка при декодировании:", error);
    return null;
  }
}

/**
 * Анализирует данные как SPL Token Account
 */
function analyzeSplTokenAccount(buffer) {
  try {
    // Структура SPL Token Account:
    // 0-32: mint (публичный ключ токена)
    // 32-64: owner (владелец аккаунта)
    // 64-72: amount (количество токенов, u64)
    // 72-76: delegate_option (1 байт + 32 байта если есть)
    // 76-77: state (1 байт: 0=неинициализирован, 1=инициализирован, 2=заморожен)
    // 77-81: is_native_option (1 байт + 8 байт если есть)
    // 81-89: delegated_amount (u64)
    // 89-93: close_authority_option (1 байт + 32 байта если есть)

    const mint = buffer.slice(0, 32);
    const owner = buffer.slice(32, 64);
    const amount = buffer.readBigUInt64LE(64);
    const delegateOption = buffer[72];
    const state = buffer[76];
    const isNativeOption = buffer[77];

    console.log("Mint (адрес токена):", encodeBase58(mint));
    console.log("Owner (владелец):", encodeBase58(owner));
    console.log("Amount (количество):", amount.toString());
    console.log("Delegate Option:", delegateOption === 0 ? "Нет" : "Есть");
    console.log("State:", getTokenAccountState(state));
    console.log("Is Native Option:", isNativeOption === 0 ? "Нет" : "Есть");

    if (delegateOption === 1) {
      const delegate = buffer.slice(73, 105);
      console.log("Delegate:", encodeBase58(delegate));
    }

    if (isNativeOption === 1) {
      const nativeAmount = buffer.readBigUInt64LE(78);
      console.log("Native Amount:", nativeAmount.toString());
    }

    // Проверяем close authority
    const closeAuthorityOption = buffer[121];
    if (closeAuthorityOption === 1) {
      const closeAuthority = buffer.slice(122, 154);
      console.log("Close Authority:", encodeBase58(closeAuthority));
    }

    console.log("");
  } catch (error) {
    console.error("Ошибка при анализе SPL Token Account:", error);
  }
}

/**
 * Возвращает читаемое описание состояния токен аккаунта
 */
function getTokenAccountState(state) {
  switch (state) {
    case 0:
      return "Неинициализирован";
    case 1:
      return "Инициализирован";
    case 2:
      return "Заморожен";
    default:
      return `Неизвестное состояние (${state})`;
  }
}

/**
 * Простая функция для кодирования в base58 (базовая реализация)
 */
function encodeBase58(buffer) {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

  // Конвертируем buffer в большое число
  let num = BigInt("0x" + buffer.toString("hex"));

  if (num === 0n) {
    return "1";
  }

  let result = "";
  while (num > 0n) {
    const remainder = num % 58n;
    result = alphabet[Number(remainder)] + result;
    num = num / 58n;
  }

  // Добавляем ведущие единицы для ведущих нулей
  for (let i = 0; i < buffer.length && buffer[i] === 0; i++) {
    result = "1" + result;
  }

  return result;
}

/**
 * Анализирует структуру данных и пытается определить их тип
 */
function analyzeDataStructure(buffer) {
  console.log("=== Анализ структуры данных ===");

  // Проверяем на паттерны нулей
  const zeroBytes = buffer.filter((byte) => byte === 0).length;
  console.log(
    `Нулевых байтов: ${zeroBytes} из ${buffer.length} (${((zeroBytes / buffer.length) * 100).toFixed(1)}%)`
  );

  // Показываем несколько первых байтов как разные типы данных
  if (buffer.length >= 4) {
    const uint32 = buffer.readUInt32LE(0);
    console.log("Первые 4 байта как uint32 (little-endian):", uint32);
  }

  if (buffer.length >= 8) {
    const uint64 = buffer.readBigUInt64LE(0);
    console.log(
      "Первые 8 байтов как uint64 (little-endian):",
      uint64.toString()
    );
  }

  // Ищем повторяющиеся паттерны
  const chunks32 = [];
  for (let i = 0; i < buffer.length; i += 32) {
    chunks32.push(buffer.slice(i, i + 32));
  }

  console.log("\nСтруктура по 32-байтовым блокам:");
  chunks32.forEach((chunk, index) => {
    const isZero = chunk.every((byte) => byte === 0);
    const hasData = chunk.some((byte) => byte !== 0);
    console.log(
      `  Блок ${index}: ${isZero ? "все нули" : hasData ? "содержит данные" : "пустой"} (${chunk.length} байт)`
    );
  });
}

/**
 * Основная функция для тестирования с вашими данными
 */
export function testDecoding() {
  const testData =
    "A0OaeoL6TsrNWijcF2zlp8nU51d9kg3XZuFjIKqJbImEJyCrgDVCekBwQWTLXYLi4ixznL3mdox51T6bC1hqzjJW0N9RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

  console.log("Тестируем декодирование ваших данных:");
  const result = decodeSolanaAccountData(testData);

  console.log("\n" + "=".repeat(50));
  console.log("=== ПАРСИНГ В ОБЪЕКТ ===");
  const parsedAccount = parseSplTokenAccount(testData);
  console.log("Спаршенный объект:", JSON.stringify(parsedAccount, null, 2));

  return { decodingResult: result, parsedAccount };
}

testDecoding();
