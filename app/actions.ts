"use server";
import { PortfolioResponse } from "@/components/instructionsComponent/interfaces";

export async function getPortfolio(address: string) {
  try {
    const response = await fetch(
      // this sorts by dollar Value instead of by chain
      // `https://api.zerion.io/v1/wallets/${address}/positions/?currency=usd&filter[trash]=only_non_trash&sort=value`,
      `https://api.zerion.io/v1/wallets/${address}/positions/?currency=usd&filter[trash]=only_non_trash`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          authorization: `Basic ${process.env.ZERION_API_DEV_KEY}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    // response.headers.set("Access-Control-Allow-Origin", "*");
    // response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    // response.headers.set(
    //   "Access-Control-Allow-Headers",
    //   "Content-Type, Authorization"
    // );
    const data: PortfolioResponse = await response.json();
    // console.log("portfolio", data);
    return data;
  } catch (err) {
    console.error("PortfolioResponseError", err);
  }
}
