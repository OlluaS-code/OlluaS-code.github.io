import { promises, MxRecord } from "node:dns";

export const resolveMXRecords = async (domain: string): Promise<MxRecord[]> => {
  try {
    return await promises.resolveMx(domain);
  } catch (err) {
    console.log(err);
    return [];
  }
};
