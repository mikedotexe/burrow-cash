import { useContext } from "react";
import { Footer, Header, Table } from "../../components";
import { BigButton, Total } from "../../shared";
import { colors } from "../../style";
import * as SC from "./style";
import { ColumnData } from "../../components/Table/types";
import { PERCENT_DIGITS, TOKEN_FORMAT, USD_FORMAT } from "../../store/constants";
import { IAsset } from "../../interfaces/account";
import { ContractContext } from "../../context/contracts";
import { IAssetDetailed } from "../../interfaces/asset";

const PortfolioTopButtons = () => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 1fr 1fr",
				justifyItems: "center",
				paddingLeft: "20em",
				paddingRight: "20em",
			}}
		>
			<BigButton text="Total Supplied" value={(0).toLocaleString(undefined, USD_FORMAT)} />
			<BigButton text="Net APR" value={0} />
			<BigButton text="Total Borrowed" value={(0).toLocaleString(undefined, USD_FORMAT)} />
		</div>
	);
};

const Portfolio = () => {
	const { assets, metadata, portfolio } = useContext(ContractContext);

	const suppliedColumns: ColumnData[] = [
		{
			width: 200,
			label: "Name",
			dataKey: "name",
		},
		{
			width: 120,
			label: "APY",
			dataKey: "apy",
			numeric: true,
			cellDataGetter: ({ rowData }: { rowData: IAsset }) => {
				return Number(rowData.apr).toFixed(PERCENT_DIGITS);
			},
		},
		{
			width: 120,
			label: "Collateral",
			dataKey: "collateralSum",
			numeric: true,
			cellDataGetter: ({ rowData }: { rowData: any }) => {
				return (
					rowData.collateral &&
					Number(rowData.collateral.balance).toLocaleString(undefined, TOKEN_FORMAT)
				);
			},
		},
		{
			width: 120,
			label: "Supplied",
			dataKey: "balance",
			cellDataGetter: ({ rowData }: { rowData: IAsset }) => {
				return Number(rowData.balance).toLocaleString(undefined, TOKEN_FORMAT);
			},
		},
		{
			width: 45,
			dataKey: "withdraw",
			cellDataGetter: ({ rowData }: { rowData: IAsset }) => {
				return rowData.token_id;
			},
		},
	];

	const borrowColumns: ColumnData[] = [
		{
			width: 200,
			label: "Name",
			dataKey: "name",
		},
		{
			width: 120,
			label: "APY",
			dataKey: "apy",
			numeric: true,
			cellDataGetter: ({ rowData }: { rowData: IAssetDetailed }) => {
				return Number(rowData.supply_apr).toFixed(PERCENT_DIGITS);
			},
		},
		{
			width: 120,
			label: "Borrow APY",
			dataKey: "borrowAPY",
			numeric: true,
			cellDataGetter: ({ rowData }: { rowData: IAssetDetailed }) => {
				return Number(rowData.borrow_apr).toFixed(PERCENT_DIGITS);
			},
		},
		{
			width: 120,
			label: "Borrowed",
			dataKey: "shares",
			cellDataGetter: ({ rowData }: { rowData: IAsset }) => {
				return Number(rowData.balance).toLocaleString(undefined, TOKEN_FORMAT);
			},
		},
		{
			width: 45,
			dataKey: "repay",
		},
	];

	return (
		<>
			<Header>
				<PortfolioTopButtons />
			</Header>

			<SC.TitleWrapper>
				<span style={{ color: colors.primary }}>Supplied</span> Assets
			</SC.TitleWrapper>

			{portfolio?.supplied.length ? (
				<Table
					height="240px"
					rows={portfolio?.supplied.map((supplied) => ({
						...supplied,
						...assets.find((m) => m.token_id === supplied.token_id),
						...metadata.find((m) => m.token_id === supplied.token_id),
						collateral: portfolio?.collateral.find(
							(collateral) => collateral.token_id === supplied.token_id,
						),
					}))}
					columns={suppliedColumns}
				/>
			) : (
				<div style={{ textAlign: "center" }}>No supplied assets yet</div>
			)}

			<SC.SecondTitleWrapper>
				<span style={{ color: colors.primary }}>Borrowed</span> Assets
			</SC.SecondTitleWrapper>

			{portfolio?.borrowed.length ? (
				<Table
					height="240px"
					rows={portfolio?.borrowed.map((borrowed) => ({
						...borrowed,
						...assets.find((m) => m.token_id === borrowed.token_id),
						...metadata.find((a) => a.token_id === borrowed.token_id),
					}))}
					columns={borrowColumns}
				/>
			) : (
				<div style={{ textAlign: "center" }}>No borrowed assets yet</div>
			)}

			<Total displayButton={false} type="Lorem ipsum" value={1} />
			<Footer />
		</>
	);
};

export default Portfolio;
