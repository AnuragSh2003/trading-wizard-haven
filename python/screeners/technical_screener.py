from typing import List, Dict, Any
import pandas as pd
from .base_screener import BaseScreener

class TechnicalScreener(BaseScreener):
    def __init__(self, db_params: Dict[str, Any]):
        super().__init__(db_params)
    
    def momentum_screener(self, min_rsi: float = 50, min_volume: int = 100000) -> List[Dict[str, Any]]:
        """
        Screen stocks based on momentum indicators
        
        Args:
            min_rsi (float): Minimum RSI value
            min_volume (int): Minimum trading volume
            
        Returns:
            List[Dict[str, Any]]: List of stocks meeting the criteria
        """
        results = []
        symbols = self.get_all_symbols()
        
        for symbol in symbols:
            # Get last 50 days of data
            df = self.get_historical_data(
                symbol,
                pd.Timestamp.now() - pd.Timedelta(days=50),
                pd.Timestamp.now()
            )
            
            if len(df) < 50:
                continue
                
            df = self.calculate_technical_indicators(df)
            latest = df.iloc[-1]
            
            # Check momentum criteria
            if (latest['rsi'] >= min_rsi and
                latest['volume'] >= min_volume and
                latest['close'] > latest['sma_20'] > latest['sma_50']):
                
                results.append({
                    'symbol': symbol,
                    'close': latest['close'],
                    'rsi': latest['rsi'],
                    'volume': latest['volume'],
                    'macd': latest['macd'],
                })
                
        return results
    
    def breakout_screener(self, volume_ratio: float = 2.0) -> List[Dict[str, Any]]:
        """
        Screen for stocks showing breakout patterns
        
        Args:
            volume_ratio (float): Minimum ratio of current volume to average volume
            
        Returns:
            List[Dict[str, Any]]: List of stocks meeting breakout criteria
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
            
            # Calculate volume conditions
            avg_volume = df['volume'].mean()
            volume_increased = latest['volume'] > (avg_volume * volume_ratio)
            
            # Check for price breakout above Bollinger Bands
            price_breakout = latest['close'] > latest['bb_high']
            
            if volume_increased and price_breakout:
                results.append({
                    'symbol': symbol,
                    'close': latest['close'],
                    'volume': latest['volume'],
                    'volume_ratio': latest['volume'] / avg_volume,
                    'bb_high': latest['bb_high']
                })
                
        return results
    
    def trend_following_screener(self, trend_period: int = 50) -> List[Dict[str, Any]]:
        """
        Screen for stocks in strong uptrend
        
        Args:
            trend_period (int): Number of days to consider for trend
            
        Returns:
            List[Dict[str, Any]]: List of stocks in strong uptrend
        """
        results = []
        symbols = self.get_all_symbols()
        
        for symbol in symbols:
            df = self.get_historical_data(
                symbol,
                pd.Timestamp.now() - pd.Timedelta(days=trend_period),
                pd.Timestamp.now()
            )
            
            if len(df) < trend_period:
                continue
                
            df = self.calculate_technical_indicators(df)
            latest = df.iloc[-1]
            
            # Check for strong uptrend conditions
            uptrend = (latest['close'] > latest['sma_20'] > 
                      latest['sma_50'] > latest['sma_200'])
            
            if uptrend:
                results.append({
                    'symbol': symbol,
                    'close': latest['close'],
                    'sma_20': latest['sma_20'],
                    'sma_50': latest['sma_50'],
                    'sma_200': latest['sma_200']
                })
                
        return results
