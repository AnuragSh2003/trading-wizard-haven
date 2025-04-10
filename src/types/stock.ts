
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  
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
  
  // Custom indicators
  isGoldenCross: boolean;
  isDeathCross: boolean;
  priceActionPattern: string;
  is52WeekHigh: boolean;
  is52WeekLow: boolean;
  
  // Additional flexible properties
  [key: string]: number | string | boolean;
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
