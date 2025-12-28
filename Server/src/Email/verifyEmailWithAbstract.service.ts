import axios from "axios";
import { config } from "../settings/config";

type AbstractApiResponse = {
  email_deliverability: {
    status: string;
  };
};

export const verifyEmailWithAbstract = async (
  email: string
): Promise<boolean> => {
  const url = config.ABSTRACT_API_URL.replace(/\/$/, "");

  try {
    const response = await axios.get<AbstractApiResponse>(url, {
      params: {
        api_key: config.ABSTRACT_API_KEY,
        email,
      },
      timeout: 10000,
    });

    const status = response.data.email_deliverability?.status;

    return status !== "undeliverable";
  } catch (error) {
    return true;
  }
};
