import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../mock-api/openapi/petstore.yaml",
  output: "./src/generated",
  plugins: ["@hey-api/typescript", "@hey-api/sdk", "@hey-api/client-fetch"],
});
