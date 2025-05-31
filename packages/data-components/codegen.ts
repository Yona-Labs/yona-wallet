import { CodegenConfig } from "@graphql-codegen/cli";

function generateSignature(timestamp: string): string {
  // Здесь должен быть твой алгоритм генерации подписи!
  // Например: return sha256(timestamp + SECRET);
  return "4a45e6b7cb6071b84c1f41c0f511bdcba946abbc33477ac6f5f8cec57c68da40"; // Заменить на реальную функцию!
}

const timestamp = Date.now().toString();

const config: CodegenConfig = {
  schema: [
    {
      "https://backpack-api.xnfts.dev/v2/graphql": {
        headers: {
          "apollographql-client-name": "backpack-extension",
          "apollographql-client-version": "0.10.134",
          "x-backpack-signature": generateSignature(timestamp),
          "x-backpack-timestamp": timestamp,
          // Добавь остальные нужные заголовки
        },
      },
    },
  ],
  documents: ["src/components/**/*.tsx", "src/hooks/**/*.ts"],
  ignoreNoDocuments: true,
  generates: {
    "./src/apollo/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
      },
      config: {
        scalars: {
          JSONObject: "{ data: string } | Record<string, any>",
        },
        useTypeImports: true,
      },
    },
  },
};

export default config;
