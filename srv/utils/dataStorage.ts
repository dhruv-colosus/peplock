import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const saveDataToFile = (functionName: string, data: any) => {
  const filePath = path.join(DATA_DIR, `${functionName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const readDataFromFile = (functionName: string) => {
  const filePath = path.join(DATA_DIR, `${functionName}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

export const shouldUseLocalData = () => {
  return process.env.USE_LOCAL_DATA === "true";
};
