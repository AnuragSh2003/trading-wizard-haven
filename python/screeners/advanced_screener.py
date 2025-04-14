from typing import List, Dict, Any
import pandas as pd
from .base_screener import BaseScreener

class AdvancedScreener(BaseScreener):
    def __init__(self, db_params: Dict[str, Any]):
        super().__init__(db_params)
    
    def volume_breakout_screener(self, volume_multiplier: float = 2.0, price_change_min: float = 2.0) -> List[Dict[str, Any]]:
        """
        Screen for stocks with unusual volume and significant price movement
        
        Args:
            volume_multiplier: Minimum ratio of current volume to average volume
            price_change_min: Minimum price change percentage
        """
        results = []
        symbols = self.get_all_symbols()
        
        for symbol in symbols:
            df = self.get_historical_data(
                symbol,
                pd.Timestamp.now() - pd.Timedelta(days=30),
                pd.Timestamp.now()
            )
            
            if len(df) < 30:
                continue
                
            df = self.calculate_technical_indicators(df)
            latest = df.iloc[-1]
            
            if (latest['volume_ratio'] > volume_multiplier and 
                abs(latest['price_change']) > price_change_min):
                results.append({
                    'symbol': symbol,
                    'close': latest['close'],
                    'volume_ratio': latest['volume_ratio'],
                    'price_change': latest['price_change'],
                    'volume': latest['volume']
                })
        
        return results
    
    def rsi_divergence_screener(self, lookback_period: int = 14) -> List[Dict[str, Any]]:
        """
        Screen for RSI divergence patterns
        """
        results = []
        symbols = self.get_all_symbols()
        
        for symbol in symbols:
            df = self.get_historical_data(
                symbol,
                pd.Timestamp.now() - pd.Timedelta(days=lookback_period * 2),
                pd.Timestamp.now()
            )
            
            if len(df) < lookback_period * 2:
                continue
                
            df = self.calculate_technical_indicators(df)
            
            # Check for bullish divergence
            price_low = df['close'].rolling(window=lookback_period).min()
            rsi_low = df['rsi'].rolling(window=lookback_period).min()
            
            if (df['close'].iloc[-1] > price_low.iloc[-1] and 
                df['rsi'].iloc[-1] < rsi_low.iloc[-1]):
                results.append({
                    'symbol': symbol,
                    'close': df['close'].iloc[-1],
                    'rsi': df['rsi'].iloc[-1],
                    'divergence_type': 'bullish'
                })
        
        return results
    
    def multi_timeframe_trend_screener(self) -> List[Dict[str, Any]]:
        """
        Screen for stocks showing strong trends across multiple timeframes
        """
        results = []
        symbols = self.get_all_symbols()
        
        for symbol in symbols:
            df = self.get_historical_data(
                symbol,
                pd.Timestamp.now() - pd.Timedelta(days=200),
                pd.Timestamp.now()
            )
            
            if len(df) < 200:
                continue
                
            df = self.calculate_technical_indicators(df)
            latest = df.iloc[-1]
            
            # Check trends across multiple timeframes
            short_term = (latest['ema_10'] > latest['ema_20'])
            medium_term = (latest['ema_20'] > latest['ema_50'])
            long_term = (latest['ema_50'] > latest['ema_200'])
            
            if short_term and medium_term and long_term:
                results.append({
                    'symbol': symbol,
                    'close': latest['close'],
                    'ema_10': latest['ema_10'],
                    'ema_20': latest['ema_20'],
                    'ema_50': latest['ema_50'],
                    'ema_200': latest['ema_200']
                })
        
        return results
    
    def volatility_breakout_screener(self, atr_multiplier: float = 2.0) -> List[Dict[str, Any]]:
        """
        Screen for stocks breaking out of their normal volatility range
        """
        results = []
        symbols = self.get_all_symbols()
        
        for symbol in symbols:
            df = self.get_historical_data(
                symbol,
                pd.Timestamp.now() - pd.Timedelta(days=20),
                pd.Timestamp.now()
            )
            
            if len(df) < 20:
                continue
                
            df = self.calculate_technical_indicators(df)
            latest = df.iloc[-1]
            
            # Check for volatility breakout
            if (latest['bb_width'] > df['bb_width'].mean() * atr_multiplier and
                latest['volume_ratio'] > 1.5):
                results.append({
                    'symbol': symbol,
                    'close': latest['close'],
                    'bb_width': latest['bb_width'],
                    'atr': latest['atr'],
                    'volume_ratio': latest['volume_ratio']
                })
        
        return results
    
    def momentum_reversal_screener(self, oversold_rsi: float = 30, overbought_rsi: float = 70) -> List[Dict[str, Any]]:
        """
        Screen for potential reversal candidates using multiple momentum indicators
        """
        results = []
        symbols = self.get_all_symbols()
        
        for symbol in symbols:
            df = self.get_historical_data(
                symbol,
                pd.Timestamp.now() - pd.Timedelta(days=20),
                pd.Timestamp.now()
            )
            
            if len(df) < 20:
                continue
                
            df = self.calculate_technical_indicators(df)
            latest = df.iloc[-1]
            prev = df.iloc[-2]
            
            # Check for oversold reversal
            oversold_reversal = (
                prev['rsi'] < oversold_rsi and
                latest['rsi'] > prev['rsi'] and
                latest['stoch_k'] > latest['stoch_d'] and
                latest['macd_diff'] > prev['macd_diff']
            )
            
            # Check for overbought reversal
            overbought_reversal = (
                prev['rsi'] > overbought_rsi and
                latest['rsi'] < prev['rsi'] and
                latest['stoch_k'] < latest['stoch_d'] and
                latest['macd_diff'] < prev['macd_diff']
            )
            
            if oversold_reversal or overbought_reversal:
                results.append({
                    'symbol': symbol,
                    'close': latest['close'],
                    'rsi': latest['rsi'],
                    'stoch_k': latest['stoch_k'],
                    'stoch_d': latest['stoch_d'],
                    'macd_diff': latest['macd_diff'],
                    'reversal_type': 'oversold' if oversold_reversal else 'overbought'
                })
        
        return results
