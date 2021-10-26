export type ModalType = "Borrow" | "Supply";

export interface TokenActionsInput {
	type: ModalType;
	title: string;
	totalAmountTitle: string;
	totalAmount: number;
	asset: {
		token_id: string;
		amount: number;
		name: string;
		symbol: string;
		valueInUSD: number;
		icon?: string;
		apy: number;
	};
	buttonText: string;
	rates: any[];
	ratesTitle: string;
}

export enum Templates {
	TokenActions,
}

export enum Inputs {
	String,
	Switch,
}
