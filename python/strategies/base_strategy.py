from abc import ABC, abstractmethod
import pandas as pd
from typing import Dict, Any

class BaseStrategy(ABC):
    def __init__(self, parameters: Dict[str, Any] = None):
        self.parameters = parameters or {}
        
    @abstractmethod
    def generate_signals(self, data: pd.DataFrame) -> pd.DataFrame:
        """
        Generate trading signals based on the strategy logic
        
        Args:
            data (pd.DataFrame): Historical price data with OHLCV columns
            
        Returns:
            pd.DataFrame: DataFrame with signals (1 for buy, -1 for sell, 0 for hold)
        """
        pass
    
    def set_parameters(self, parameters: Dict[str, Any]):
        """Update strategy parameters"""
        self.parameters.update(parameters)
