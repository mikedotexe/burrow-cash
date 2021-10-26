import Decimal from "decimal.js";
import { DEFAULT_PRECISION, NANOS_PER_YEAR } from "./constants";
import { getBurrow } from "../utils";
import { ViewMethodsOracle } from "../interfaces/contract-methods";
import { IAssetPrice, IPrices } from "../interfaces/oracle";

Decimal.set({ precision: DEFAULT_PRECISION });

export const aprToRate = (apr: string): string => {
	console.log("Input APR", apr);
	const exp = new Decimal(1).dividedBy(new Decimal(NANOS_PER_YEAR));
	const base = new Decimal(apr).dividedBy(new Decimal(100));
	const result: Decimal = base.plus(new Decimal(1)).pow(exp);
	console.log("R", result.toPrecision(DEFAULT_PRECISION));
	console.log("R ** n", result.pow(new Decimal(NANOS_PER_YEAR)).toPrecision(DEFAULT_PRECISION));

	const roundRes: Decimal = result.mul(new Decimal(10).pow(new Decimal(27)));
	console.log("rate", roundRes.toPrecision(12));
	return roundRes.toPrecision(12);
};

export const rateToApr = (rate: string): string => {
	console.log("Input rate", rate);

	const apr = new Decimal(100)
		.mul(new Decimal(rate).div(new Decimal(10).pow(new Decimal(27))).pow(NANOS_PER_YEAR))
		.sub(100);

	return apr.toFixed(2);
};

export const getPrices = async (tokenIds: string[]): Promise<IPrices | undefined> => {
	const burrow = await getBurrow();

	try {
		const priceResponse: IPrices = (await burrow?.view(
			burrow?.oracleContract,
			ViewMethodsOracle[ViewMethodsOracle.get_price_data],
			{
				asset_ids: tokenIds,
			},
		)) as IPrices;

		console.log("prices", priceResponse);

		if (priceResponse) {
			priceResponse.prices = priceResponse?.prices.map((assetPrice: IAssetPrice) => ({
				...assetPrice,
				price: assetPrice.price
					? {
							...assetPrice.price,
							usd: new Decimal(assetPrice.price?.multiplier || 0).div(10000).toNumber(),
					  }
					: null,
			}))!;
		}

		console.log("prices", priceResponse);

		return priceResponse;
	} catch (err: any) {
		console.log("Getting prices failed: ", err.message);
	}
};
