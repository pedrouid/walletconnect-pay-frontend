interface IAssetPrices {
  [currencySymbol: string]: {
    [assetSymbol: string]: number;
  };
}

const ASSET_PRICES: IAssetPrices = {
  USD: {
    DAI: 1.0,
    ETH: 250
  },
  EUR: {
    DAI: 0.9,
    ETH: 225
  },
  GBP: {
    DAI: 0.8,
    ETH: 200
  }
};

export default ASSET_PRICES;
