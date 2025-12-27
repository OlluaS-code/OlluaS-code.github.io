import axios from "axios";
import { config } from "../settings/config";

type AbstractApiResponse = {
  email: string;
  deliverability: "DELIVERABLE" | "UNDELIVERABLE" | "RISKY" | "UNKNOWN";
  quality_score: number;
  is_valid_format: { value: boolean; text: string };
  is_free_email: { value: boolean; text: string };
  is_disposable_email: { value: boolean; text: string };
  is_role_email: { value: boolean; text: string };
  is_catchall_email: { value: boolean; text: string };
  is_mx_found: { value: boolean; text: string };
  is_smtp_valid: { value: boolean; text: string };
};

export const verifyEmailWithAbstract = async (
  email: string
): Promise<boolean> => {
  const apiKey = config.ABSTRACT_API_KEY;
  const url = config.ABSTRACT_API_URL;

  try {
    const response = await axios.get<AbstractApiResponse>(url, {
      params: {
        api_key: apiKey,
        email: email,
      },
      timeout: 5000,
    });

    const isUndeliverable = response.data.deliverability === "UNDELIVERABLE";

    return !isUndeliverable;
  } catch (error) {
    console.error("Erro ao consultar AbstractAPI (Falha Soft):", error);

    return true;
  }
};
