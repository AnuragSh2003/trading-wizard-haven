
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  
  // NSE specific data
  isin?: string;
  series?: string; // EQ, BE, etc.
  exchange?: 'NSE' | 'BSE';
  sector?: string;
  industry?: string;
  listingDate?: string;
  faceValue?: number;
  marketLot?: number;
  
  // Trend indicators
  sma50: number;
  sma200: number;
  ema20: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  supertrend: 'buy' | 'sell' | 'neutral';
  adx: number;
  plusDI: number;
  minusDI: number;
  
  // Momentum indicators
  rsi: number;
  stochK: number;
  stochD: number;
  cci: number;
  momentumValue: number;
  
  // Volatility indicators
  bbandsUpper: number;
  bbandsMid: number;
  bbandsLower: number;
  atr: number;
  donchianUpper: number;
  donchianLower: number;
  
  // Volume indicators
  volumeMA20: number;
  obv: number;
  vpt: number;
  cmf: number;
  
  // Indian market specific indicators
  deliveryPercentage?: number; // Delivery % to traded quantity
  fiiDiiActivity?: {
    fiiNetBuy?: number;
    diiNetBuy?: number;
  };
  
  // Custom indicators
  isGoldenCross: boolean;
  isDeathCross: boolean;
  priceActionPattern: string;
  is52WeekHigh: boolean;
  is52WeekLow: boolean;
  
  // Valuation metrics for Indian stocks
  pe?: number; // Price to Earnings
  pb?: number; // Price to Book
  eps?: number; // Earnings Per Share
  dividendYield?: number;
  marketCap?: number;
  
  // Additional flexible properties
  [key: string]: number | string | boolean | object | undefined;
}

export interface ScreenerResult {
  id: string;
  stock: Stock;
  indicators: string[];
  buySignals: number;
  shortSignals: number;
  totalScore: number;
  finalSignal: 'Buy' | 'Short' | 'Wait';
  strength: number;
}

export interface NseIndexData {
  name: string;
  value: number;
  change: number;
  percentChange: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  lastUpdated: string;
}

export interface BacktestResult {
  strategy: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  annualizedReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: BacktestTrade[];
  equityCurve: EquityPoint[];
  statistics: {
    winRate: number;
    profitFactor: number;
    averageWin: number;
    averageLoss: number;
    largestWin: number;
    largestLoss: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
  };
}

export interface BacktestTrade {
  id: number;
  symbol: string;
  entryDate: string;
  entryPrice: number;
  exitDate: string;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  type: 'BUY' | 'SELL';
  exitReason: string;
}

export interface EquityPoint {
  date: string;
  equity: number;
  drawdown: number;
}
