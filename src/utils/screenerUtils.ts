
import { Stock, ScreenerResult } from '@/types/stock';

export interface IndicatorConfig {
  name: string;
  description: string;
  buyCondition: (stock: Stock) => boolean;
  shortCondition: (stock: Stock) => boolean;
  score: (stock: Stock) => number;
}

export type ScreenerType = 'Trend' | 'Momentum' | 'Volatility' | 'Volume' | 'Custom';

// Trend Indicators
export const trendIndicators: IndicatorConfig[] = [
  {
    name: 'SMA/EMA',
    description: 'Moving averages help identify the direction of the trend',
    buyCondition: (stock) => 
      stock.price > stock.sma50 && stock.sma50 > stock.sma200 && stock.price > stock.ema20,
    shortCondition: (stock) => 
      stock.price < stock.sma50 && stock.sma50 < stock.sma200 && stock.price < stock.ema20,
    score: (stock) => {
      if (stock.price > stock.sma50 && stock.sma50 > stock.sma200) return 2;
      if (stock.price < stock.sma50 && stock.sma50 < stock.sma200) return -2;
      if (stock.price > stock.ema20) return 1;
      if (stock.price < stock.ema20) return -1;
      return 0;
    }
  },
  {
    name: 'MACD',
    description: 'MACD shows momentum and potential reversals',
    buyCondition: (stock) => stock.macdHistogram > 0 && stock.macd > stock.macdSignal,
    shortCondition: (stock) => stock.macdHistogram < 0 && stock.macd < stock.macdSignal,
    score: (stock) => {
      if (stock.macd > stock.macdSignal && stock.macdHistogram > 0) return 2;
      if (stock.macd < stock.macdSignal && stock.macdHistogram < 0) return -2;
      if (stock.macd > stock.macdSignal) return 1;
      if (stock.macd < stock.macdSignal) return -1;
      return 0;
    }
  },
  {
    name: 'Supertrend',
    description: 'Supertrend indicator provides clear buy and sell signals',
    buyCondition: (stock) => stock.supertrend === 'buy',
    shortCondition: (stock) => stock.supertrend === 'sell',
    score: (stock) => {
      if (stock.supertrend === 'buy') return 2;
      if (stock.supertrend === 'sell') return -2;
      return 0;
    }
  },
  {
    name: 'ADX',
    description: 'ADX measures trend strength',
    buyCondition: (stock) => stock.adx > 25 && stock.plusDI > stock.minusDI,
    shortCondition: (stock) => stock.adx > 25 && stock.minusDI > stock.plusDI,
    score: (stock) => {
      if (stock.adx > 25) {
        if (stock.plusDI > stock.minusDI) return 2;
        if (stock.minusDI > stock.plusDI) return -2;
      }
      return 0;
    }
  }
];

// Momentum Indicators
export const momentumIndicators: IndicatorConfig[] = [
  {
    name: 'RSI',
    description: 'RSI shows overbought and oversold conditions',
    buyCondition: (stock) => stock.rsi < 30,
    shortCondition: (stock) => stock.rsi > 70,
    score: (stock) => {
      if (stock.rsi < 30) return 2;
      if (stock.rsi < 40) return 1;
      if (stock.rsi > 70) return -2;
      if (stock.rsi > 60) return -1;
      return 0;
    }
  },
  {
    name: 'Stochastic',
    description: 'Stochastic oscillator identifies potential reversals',
    buyCondition: (stock) => stock.stochK < 20 && stock.stochK > stock.stochD,
    shortCondition: (stock) => stock.stochK > 80 && stock.stochK < stock.stochD,
    score: (stock) => {
      if (stock.stochK < 20 && stock.stochK > stock.stochD) return 2;
      if (stock.stochK > 80 && stock.stochK < stock.stochD) return -2;
      if (stock.stochK < 30) return 1;
      if (stock.stochK > 70) return -1;
      return 0;
    }
  },
  {
    name: 'CCI',
    description: 'CCI identifies cyclical turns in price',
    buyCondition: (stock) => stock.cci < -100,
    shortCondition: (stock) => stock.cci > 100,
    score: (stock) => {
      if (stock.cci < -100) return 2;
      if (stock.cci > 100) return -2;
      return 0;
    }
  },
  {
    name: 'Momentum',
    description: 'Momentum shows the rate of price change',
    buyCondition: (stock) => stock.momentumValue > 0 && stock.change > 0,
    shortCondition: (stock) => stock.momentumValue < 0 && stock.change < 0,
    score: (stock) => {
      if (stock.momentumValue > 0 && stock.change > 0) return 2;
      if (stock.momentumValue < 0 && stock.change < 0) return -2;
      if (stock.momentumValue > 0) return 1;
      if (stock.momentumValue < 0) return -1;
      return 0;
    }
  }
];

// Volatility Indicators
export const volatilityIndicators: IndicatorConfig[] = [
  {
    name: 'Bollinger Bands',
    description: 'Bollinger Bands show price volatility and potential reversal points',
    buyCondition: (stock) => stock.price <= stock.bbandsLower,
    shortCondition: (stock) => stock.price >= stock.bbandsUpper,
    score: (stock) => {
      if (stock.price <= stock.bbandsLower) return 2;
      if (stock.price >= stock.bbandsUpper) return -2;
      if (stock.price < stock.bbandsMid) return 1; // Below middle band
      if (stock.price > stock.bbandsMid) return -1; // Above middle band
      return 0;
    }
  },
  {
    name: 'ATR',
    description: 'ATR measures market volatility',
    buyCondition: (stock) => stock.atr > stock.price * 0.02 && stock.change > 0, // high volatility with upward price
    shortCondition: (stock) => stock.atr > stock.price * 0.02 && stock.change < 0, // high volatility with downward price
    score: (stock) => {
      // ATR by itself doesn't give buy/sell signals, needs to be paired with direction
      const highVolatility = stock.atr > stock.price * 0.02;
      if (highVolatility && stock.change > 0) return 1;
      if (highVolatility && stock.change < 0) return -1;
      return 0;
    }
  },
  {
    name: 'Donchian Channels',
    description: 'Donchian Channels identify breakouts',
    buyCondition: (stock) => stock.price >= stock.donchianUpper,
    shortCondition: (stock) => stock.price <= stock.donchianLower,
    score: (stock) => {
      if (stock.price >= stock.donchianUpper) return 2; // Breakout to upside
      if (stock.price <= stock.donchianLower) return -2; // Breakdown to downside
      return 0;
    }
  }
];

// Volume Indicators
export const volumeIndicators: IndicatorConfig[] = [
  {
    name: 'Volume Moving Average',
    description: 'Volume MA identifies unusual trading activity',
    buyCondition: (stock) => stock.volume > stock.volumeMA20 * 2 && stock.change > 0,
    shortCondition: (stock) => stock.volume > stock.volumeMA20 * 2 && stock.change < 0,
    score: (stock) => {
      const highVolume = stock.volume > stock.volumeMA20 * 2;
      if (highVolume && stock.change > 3) return 2; // Strong bullish volume
      if (highVolume && stock.change < -3) return -2; // Strong bearish volume
      if (highVolume && stock.change > 0) return 1; // Bullish volume
      if (highVolume && stock.change < 0) return -1; // Bearish volume
      return 0;
    }
  },
  {
    name: 'On-Balance Volume',
    description: 'OBV shows buying and selling pressure',
    buyCondition: (stock) => stock.obv > 0 && stock.change > 0,
    shortCondition: (stock) => stock.obv < 0 && stock.change < 0,
    score: (stock) => {
      if (stock.obv > 0 && stock.change > 0) return 2; // Strong buying pressure
      if (stock.obv < 0 && stock.change < 0) return -2; // Strong selling pressure
      if (stock.obv > 0) return 1;
      if (stock.obv < 0) return -1;
      return 0;
    }
  },
  {
    name: 'Volume Price Trend',
    description: 'VPT combines price and volume',
    buyCondition: (stock) => stock.vpt > 0,
    shortCondition: (stock) => stock.vpt < 0,
    score: (stock) => {
      if (stock.vpt > 0) return 1;
      if (stock.vpt < 0) return -1;
      return 0;
    }
  },
  {
    name: 'Chaikin Money Flow',
    description: 'CMF shows buying or selling pressure',
    buyCondition: (stock) => stock.cmf > 0.1,
    shortCondition: (stock) => stock.cmf < -0.1,
    score: (stock) => {
      if (stock.cmf > 0.1) return 2; // Strong buying pressure
      if (stock.cmf < -0.1) return -2; // Strong selling pressure
      if (stock.cmf > 0) return 1;
      if (stock.cmf < 0) return -1;
      return 0;
    }
  }
];

// Custom Indicators
export const customIndicators: IndicatorConfig[] = [
  {
    name: 'Golden/Death Cross',
    description: 'Golden Cross (50 EMA crosses above 200 EMA) and Death Cross (opposite)',
    buyCondition: (stock) => stock.isGoldenCross,
    shortCondition: (stock) => stock.isDeathCross,
    score: (stock) => {
      if (stock.isGoldenCross) return 3; // Strong long-term bullish signal
      if (stock.isDeathCross) return -3; // Strong long-term bearish signal
      return 0;
    }
  },
  {
    name: 'Price Action Patterns',
    description: 'Key price action patterns like engulfing, doji, etc.',
    buyCondition: (stock) => 
      ['bullish_engulfing', 'hammer', 'morning_star', 'piercing_line'].includes(stock.priceActionPattern),
    shortCondition: (stock) => 
      ['bearish_engulfing', 'shooting_star', 'evening_star', 'dark_cloud_cover'].includes(stock.priceActionPattern),
    score: (stock) => {
      const bullishPatterns = ['bullish_engulfing', 'hammer', 'morning_star', 'piercing_line'];
      const bearishPatterns = ['bearish_engulfing', 'shooting_star', 'evening_star', 'dark_cloud_cover'];
      
      if (bullishPatterns.includes(stock.priceActionPattern)) return 2;
      if (bearishPatterns.includes(stock.priceActionPattern)) return -2;
      return 0;
    }
  },
  {
    name: '52-Week High/Low',
    description: 'Proximity to 52-week high or low',
    buyCondition: (stock) => stock.is52WeekHigh,
    shortCondition: (stock) => stock.is52WeekLow,
    score: (stock) => {
      if (stock.is52WeekHigh) return 2; // New high is bullish
      if (stock.is52WeekLow) return -2; // New low is bearish
      return 0;
    }
  }
];

export const getIndicatorsByType = (type: ScreenerType): IndicatorConfig[] => {
  switch (type) {
    case 'Trend':
      return trendIndicators;
    case 'Momentum':
      return momentumIndicators;
    case 'Volatility':
      return volatilityIndicators;
    case 'Volume':
      return volumeIndicators;
    case 'Custom':
      return customIndicators;
    default:
      return trendIndicators;
  }
};

export function analyzeStock(stock: Stock, indicators: IndicatorConfig[]): ScreenerResult {
  let buySignals = 0;
  let shortSignals = 0;
  let totalScore = 0;
  const activeIndicators: string[] = [];
  
  indicators.forEach(indicator => {
    const score = indicator.score(stock);
    totalScore += score;
    
    if (indicator.buyCondition(stock)) {
      buySignals++;
      activeIndicators.push(`${indicator.name} (Buy)`);
    } else if (indicator.shortCondition(stock)) {
      shortSignals++;
      activeIndicators.push(`${indicator.name} (Short)`);
    }
  });
  
  let finalSignal: 'Buy' | 'Short' | 'Wait';
  if (totalScore > 3 && buySignals > shortSignals) {
    finalSignal = 'Buy';
  } else if (totalScore < -3 && shortSignals > buySignals) {
    finalSignal = 'Short';
  } else {
    finalSignal = 'Wait';
  }
  
  // Calculate strength on a scale of 1-10
  const strength = Math.min(10, Math.abs(totalScore) + Math.max(buySignals, shortSignals));
  
  return {
    id: stock.symbol,
    stock,
    indicators: activeIndicators,
    buySignals,
    shortSignals,
    totalScore,
    finalSignal,
    strength
  };
}

// Mock data generator to create random stocks with all indicators
export const generateMockStocks = (count: number = 20): Stock[] => {
  const stocks: Stock[] = [];
  const symbolsAndNames = [
    { symbol: 'RELIANCE', name: 'Reliance Industries' },
    { symbol: 'TCS', name: 'Tata Consultancy Services' },
    { symbol: 'INFY', name: 'Infosys' },
    { symbol: 'HDFCBANK', name: 'HDFC Bank' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank' },
    { symbol: 'SBIN', name: 'State Bank of India' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors' },
    { symbol: 'ASIANPAINT', name: 'Asian Paints' },
    { symbol: 'WIPRO', name: 'Wipro' },
    { symbol: 'ITC', name: 'ITC Limited' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank' },
    { symbol: 'LT', name: 'Larsen & Toubro' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever' },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India' },
    { symbol: 'AXISBANK', name: 'Axis Bank' },
    { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical' },
    { symbol: 'ONGC', name: 'Oil and Natural Gas Corporation' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance' },
    { symbol: 'NTPC', name: 'NTPC Limited' },
    { symbol: 'TITAN', name: 'Titan Company' },
    { symbol: 'POWERGRID', name: 'Power Grid Corporation' },
    { symbol: 'TECHM', name: 'Tech Mahindra' },
    { symbol: 'ULTRACEMCO', name: 'UltraTech Cement' },
    { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv' },
  ];

  // Random selection of indices without replacement for unique stocks
  const selectedIndices = Array.from({ length: Math.min(count, symbolsAndNames.length) }, (_, i) => i)
    .sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(count, symbolsAndNames.length); i++) {
    const idx = selectedIndices[i];
    const symbol = symbolsAndNames[idx].symbol;
    const name = symbolsAndNames[idx].name;
    const price = +(Math.random() * 5000 + 100).toFixed(2);
    const change = +(Math.random() * 10 - 5).toFixed(2);
    
    // Create a trend bias for this stock (-1 for bearish, 0 for neutral, 1 for bullish)
    const trendBias = Math.floor(Math.random() * 3) - 1;
    
    // Moving Averages
    const biasMultiplier = 1 + (trendBias * 0.1);
    const sma200 = +(price * (Math.random() * 0.3 + 0.85)).toFixed(2);
    const sma50 = +(sma200 * biasMultiplier).toFixed(2);
    const ema20 = +(sma50 * biasMultiplier).toFixed(2);
    
    // MACD
    const macdSignal = +(Math.random() * 10 - 5).toFixed(2);
    const macd = +(macdSignal + (trendBias * Math.random() * 3)).toFixed(2);
    const macdHistogram = +(macd - macdSignal).toFixed(2);
    
    // Supertrend
    const supertrendOptions = ['buy', 'sell', 'neutral'] as const;
    const supertrend = trendBias === 1 
      ? 'buy' 
      : trendBias === -1 
        ? 'sell' 
        : supertrendOptions[Math.floor(Math.random() * 3)];
    
    // ADX
    const adx = +(Math.random() * 40 + 5).toFixed(2);
    const plusDI = +(Math.random() * 30 + 10 + (trendBias * 5)).toFixed(2);
    const minusDI = +(Math.random() * 30 + 10 - (trendBias * 5)).toFixed(2);
    
    // RSI
    const rsi = trendBias === 1 
      ? +(Math.random() * 40 + 30).toFixed(2) // 30-70
      : trendBias === -1 
        ? +(Math.random() * 40 + 30).toFixed(2) // 30-70 with higher chance of extremes
        : +(Math.random() * 60 + 20).toFixed(2); // 20-80
    
    // Stochastic
    const stochBias = trendBias * 10;
    const stochK = +(Math.random() * 80 + 10 + stochBias).toFixed(2);
    const stochD = +(stochK + (Math.random() * 10 - 5)).toFixed(2);
    
    // CCI
    const cci = +(Math.random() * 300 - 150 + (trendBias * 50)).toFixed(2);
    
    // Momentum
    const momentumValue = +(Math.random() * 10 - 5 + (trendBias * 3)).toFixed(2);
    
    // Volatility
    const volumeBase = Math.random() * 1000000 + 50000;
    const volume = Math.floor(volumeBase);
    const volumeMA20 = Math.floor(volumeBase * (Math.random() * 0.5 + 0.75));
    
    // Bollinger Bands
    const bbandsMid = price;
    const bbandsWidth = price * (Math.random() * 0.1 + 0.02);
    const bbandsUpper = +(bbandsMid + bbandsWidth).toFixed(2);
    const bbandsLower = +(bbandsMid - bbandsWidth).toFixed(2);
    
    // ATR
    const atr = +(price * (Math.random() * 0.03 + 0.01)).toFixed(2);
    
    // Donchian Channels
    const donchianWidth = price * (Math.random() * 0.15 + 0.05);
    const donchianUpper = +(price + donchianWidth).toFixed(2);
    const donchianLower = +(price - donchianWidth).toFixed(2);
    
    // OBV, VPT, CMF
    const obv = +(Math.random() * 2000000 - 1000000 + (trendBias * 500000)).toFixed(0);
    const vpt = +(Math.random() * 200 - 100 + (trendBias * 50)).toFixed(2);
    const cmf = +((Math.random() * 0.4 - 0.2) + (trendBias * 0.1)).toFixed(2);
    
    // Custom indicators
    const isGoldenCross = trendBias === 1 ? Math.random() > 0.7 : false;
    const isDeathCross = trendBias === -1 ? Math.random() > 0.7 : false;
    
    const priceActionPatterns = [
      'bullish_engulfing', 'bearish_engulfing',
      'hammer', 'shooting_star',
      'morning_star', 'evening_star',
      'piercing_line', 'dark_cloud_cover',
      'doji', 'none'
    ];
    
    const patternIndex = Math.floor(Math.random() * priceActionPatterns.length);
    const priceActionPattern = priceActionPatterns[patternIndex];
    
    const is52WeekHigh = trendBias === 1 ? Math.random() > 0.8 : false;
    const is52WeekLow = trendBias === -1 ? Math.random() > 0.8 : false;
    
    stocks.push({
      symbol,
      name,
      price,
      change,
      volume,
      sma50,
      sma200,
      ema20,
      macd,
      macdSignal,
      macdHistogram,
      supertrend,
      adx,
      plusDI,
      minusDI,
      rsi,
      stochK,
      stochD,
      cci,
      momentumValue,
      bbandsUpper,
      bbandsMid,
      bbandsLower,
      atr,
      donchianUpper,
      donchianLower,
      volumeMA20,
      obv,
      vpt,
      cmf,
      isGoldenCross,
      isDeathCross,
      priceActionPattern,
      is52WeekHigh,
      is52WeekLow
    });
  }
  
  return stocks;
};
