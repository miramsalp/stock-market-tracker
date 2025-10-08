const FMP_API_KEY = process.env.FMP_API_KEY;
const FMP_BASE_URL = "https://financialmodelingprep.com/stable";

if (!FMP_API_KEY) {
  throw new Error("FMP_API_KEY is not defined");
}

export { FMP_API_KEY, FMP_BASE_URL };

