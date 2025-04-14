import pandas as pd
import numpy as np
from .base_strategy import BaseStrategy

class MovingAverageCrossoverStrategy(BaseStrategy):
    def __init__(self, parameters: dict = None):
        default_params = {
            'short_window': 20,
            'long_window': 50
        }
        super().__init__(parameters or default_params)
    
    def generate_signals(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Generate trading signals based on Moving Average Crossover
        
        Args:
            data (pd.DataFrame): Historical price data with 'close' column
            
        Returns:
            pd.DataFrame: DataFrame with signals
        """
        df = data.copy()
        
        # Calculate moving averages
        df['SMA_short'] = df['close'].rolling(
            window=self.parameters['short_window']
        ).mean()
        df['SMA_long'] = df['close'].rolling(
            window=self.parameters['long_window']
        ).mean()
        
        # Generate signals
        df['signal'] = 0
        df.loc[df['SMA_short'] > df['SMA_long'], 'signal'] = 1
        df.loc[df['SMA_short'] < df['SMA_long'], 'signal'] = -1
        
        return df
