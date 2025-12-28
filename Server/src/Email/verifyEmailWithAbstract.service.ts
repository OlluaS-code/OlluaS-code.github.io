import axios from "axios";
import { config } from "../settings/config";

type AbstractApiResponse = {
  deliverability: "DELIVERABLE" | "UNDELIVERABLE" | "RISKY" | "UNKNOWN";
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

    return response.data.deliverability !== "UNDELIVERABLE";
  } catch (error) {
    return true;
  }
};
