// import { HDNodeWallet, Wallet } from "ethers6";

export function deriveEthereumWallet(
  seed: Buffer,
  derivationPath: string
): any {
  // Wallet
  // const privateKey = deriveEthereumPrivateKey(seed, derivationPath);
  // return new Wallet(privateKey);
  return null as any;
}

export function deriveEthereumPrivateKey(
  seed: Buffer,
  derivationPath: string
): string {
  // const hdNode = HDNodeWallet.fromSeed(seed);
  // const child = hdNode.derivePath(derivationPath);
  // return child.privateKey;
  return null as any;
}

/**
 * Validate an Ethereum private key
 */
export function getEthereumWallet(privateKey: string): any {
  // Wallet
  let wallet: any;
  try {
    // wallet = new Wallet(privateKey);
    wallet = null as any;
  } catch {
    throw new Error("Invalid Ethereum private key");
  }
  return wallet;
}
