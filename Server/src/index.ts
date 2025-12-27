import { config } from "./settings/config";
import server from "./server";

try {
  server.listen(config.PORT, "0.0.0.0", () => {
    console.log(
      `⚡️[server]: Server is running at http://localhost:${config.PORT}`
    );
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
