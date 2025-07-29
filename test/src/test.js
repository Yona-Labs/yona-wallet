// const { Buffer } = require("buffer");

const SOLANA_RPC_URL = "https://mainnet.rpc.solaxy.io";

/**
 * Проверяет баланс токена через Solana RPC
 */
async function checkTokenBalance(mintAddress, ownerAddress) {
  try {
    console.log("=== Проверка баланса через RPC ===");
    console.log("Mint:", mintAddress);
    console.log("Owner:", ownerAddress);
    console.log("");

    // 1. Получаем информацию о токене (mint)
    const mintInfo = await getTokenMintInfo(mintAddress);
    if (mintInfo) {
      console.log("📊 Информация о токене:");
      console.log("  Decimals:", mintInfo.decimals);
      console.log("  Supply:", mintInfo.supply);
      console.log("  Freeze Authority:", mintInfo.freezeAuthority || "Нет");
      console.log("  Mint Authority:", mintInfo.mintAuthority || "Нет");
      console.log("");
    }

    // 2. Получаем токен аккаунты владельца
    const tokenAccounts = await getTokenAccountsByOwner(
      ownerAddress,
      mintAddress
    );

    if (tokenAccounts && tokenAccounts.length > 0) {
      console.log("💰 Найдено токен аккаунтов:", tokenAccounts.length);

      let totalRawAmount = BigInt(0);
      tokenAccounts.forEach((account, index) => {
        console.log(`\n--- Аккаунт ${index + 1} ---`);
        console.log(`Адрес аккаунта: ${account.pubkey}`);
        console.log(`Lamports: ${account.account.lamports}`);
        console.log(`Owner: ${account.account.owner}`);

        // Декодируем base64 данные
        if (
          account.account.data &&
          Array.isArray(account.account.data) &&
          account.account.data[1] === "base64"
        ) {
          const base64Data = account.account.data[0];
          console.log(`\n🔍 Декодируем данные аккаунта:`);

          const accountData = analyzeSplTokenAccount(
            Buffer.from(base64Data, "base64")
          );
          if (accountData) {
            const rawAmount = BigInt(accountData.amount);
            totalRawAmount += rawAmount;

            console.log(`Raw Amount: ${rawAmount.toString()}`);

            if (mintInfo && mintInfo.decimals) {
              const decimals = mintInfo.decimals;
              const divisor = BigInt(10) ** BigInt(decimals);
              const uiAmount = Number(rawAmount) / Number(divisor);

              console.log(`UI Amount: ${uiAmount} токенов`);
              console.log(`Decimals: ${decimals}`);
            }

            console.log(`State: ${getTokenAccountState(accountData.state)}`);
          }
        } else {
          console.log("⚠️ Неожиданный формат данных аккаунта");
        }
      });

      // Итоговый баланс
      console.log("\n" + "=".repeat(40));
      console.log("📊 ИТОГОВЫЙ БАЛАНС:");
      console.log(`Raw Amount: ${totalRawAmount.toString()}`);

      if (mintInfo && mintInfo.decimals) {
        const decimals = mintInfo.decimals;
        const divisor = BigInt(10) ** BigInt(decimals);
        const totalUiAmount = Number(totalRawAmount) / Number(divisor);

        console.log(`UI Amount: ${totalUiAmount} токенов`);
        console.log(`Decimals: ${decimals}`);
      }

      return {
        mintInfo,
        tokenAccounts,
        totalRawAmount: totalRawAmount.toString(),
      };
    } else {
      console.log("❌ Токен аккаунты не найдены");
      return null;
    }
  } catch (error) {
    console.error("Ошибка при проверке баланса:", error.message);
    console.error("Полная ошибка:", error);
    return null;
  }
}

/**
 * Получает информацию о токене (mint)
 */
async function getTokenMintInfo(mintAddress) {
  try {
    const response = await fetch(SOLANA_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getAccountInfo",
        params: [mintAddress, { encoding: "jsonParsed" }],
      }),
    });

    const data = await response.json();

    if (data.result && data.result.value) {
      return data.result.value.data.parsed.info;
    }

    return null;
  } catch (error) {
    console.error("Ошибка получения информации о токене:", error);
    return null;
  }
}

/**
 * Получает токен аккаунты владельца
 */
async function getTokenAccountsByOwner(ownerAddress, mintAddress) {
  try {
    const response = await fetch(SOLANA_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTokenAccountsByOwner",
        params: [
          ownerAddress,
          { mint: mintAddress },
          { encoding: "jsonParsed" },
        ],
      }),
    });

    const data = await response.json();

    console.log("Сырой ответ RPC:", JSON.stringify(data, null, 2));

    if (data.result && data.result.value) {
      return data.result.value;
    }

    return [];
  } catch (error) {
    console.error("Ошибка получения токен аккаунтов:", error);
    return [];
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

    let splTokenData = null;

    // Анализируем как SPL Token Account (165 байт = стандартный размер)
    if (buffer.length === 165) {
      console.log("=== Анализ как SPL Token Account ===");
      splTokenData = analyzeSplTokenAccount(buffer);
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
      splTokenData,
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

    const mintAddress = encodeBase58(mint);
    const ownerAddress = encodeBase58(owner);

    console.log("Mint (адрес токена):", mintAddress);
    console.log("Owner (владелец):", ownerAddress);
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

    return {
      mintAddress,
      ownerAddress,
      amount: amount.toString(),
      state,
      delegateOption,
      isNativeOption,
    };
  } catch (error) {
    console.error("Ошибка при анализе SPL Token Account:", error);
    return null;
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
export async function testDecoding() {
  const testData =
    "A0OaeoL6TsrNWijcF2zlp8nU51d9kg3XZuFjIKqJbImEJyCrgDVCekBwQWTLXYLi4ixznL3mdox51T6bC1hqzjJW0N9RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

  console.log("Тестируем декодирование ваших данных:");
  const result = decodeSolanaAccountData(testData);

  // Если это SPL Token Account, проверяем баланс через RPC
  if (result && result.splTokenData) {
    console.log("\n" + "=".repeat(50));
    await checkTokenBalance(
      result.splTokenData.mintAddress,
      result.splTokenData.ownerAddress
    );
  }

  return result;
}

testDecoding();
