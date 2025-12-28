import dotenv from "dotenv";

dotenv.config();

export class ServerConfig {
  private constructor(
    public readonly PORT: number,
    public readonly EMAIL_USER: string,
    public readonly EMAIL_PASS: string,
    public readonly EMAIL_HOST: string,
    public readonly EMAIL_PORT: number,
    public readonly EMAIL_SECURE: boolean,
    public readonly ABSTRACT_API_KEY: string,
    public readonly ABSTRACT_API_URL: string
  ) {}

  public static parseSecure(secureEnv: string | undefined): boolean {
    const secureEmail = secureEnv ? Boolean(secureEnv) : Boolean;

    if (secureEmail || !secureEnv) {
      return true;
    }

    return secureEmail;
  }

  public static parsePort(portEnv: string | undefined): number {
    const portNumber = portEnv ? Number(portEnv) : NaN;

    if (isNaN(portNumber) || !portEnv) {
      return 3000;
    }

    return portNumber;
  }

  public static parseEmailPort(portEnv: string | undefined): number {
    const portEmail = portEnv ? Number(portEnv) : NaN;

    if (isNaN(portEmail) || !portEnv) {
      return 587;
    }

    return portEmail;
  }

  public static createConfig(): ServerConfig {
    dotenv.config();

    const {
      PORT,
      EMAIL_USER,
      EMAIL_PASS,
      EMAIL_HOST,
      EMAIL_PORT,
      EMAIL_SECURE,
      ABSTRACT_API_KEY,
      ABSTRACT_API_URL,
    } = process.env;

    const portNumber = ServerConfig.parsePort(PORT);
    const UserEmail = EMAIL_USER ?? "";
    const PassEmail = EMAIL_PASS ?? "";
    const HostEmail = EMAIL_HOST ?? "smtp.gmail.com";
    const portEmail = ServerConfig.parseEmailPort(EMAIL_PORT);
    const SecureEmail = ServerConfig.parseSecure(EMAIL_SECURE);
    const ApiKey = ABSTRACT_API_KEY ?? "";
    const ApiUrl = ABSTRACT_API_URL ?? "";

    return new ServerConfig(
      portNumber,
      UserEmail,
      PassEmail,
      HostEmail,
      portEmail,
      SecureEmail,
      ApiKey,
      ApiUrl
    );
  }
}

export const config = ServerConfig.createConfig();
