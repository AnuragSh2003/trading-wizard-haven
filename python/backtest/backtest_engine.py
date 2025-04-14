import pandas as pd
import numpy as np
from typing import Dict, Any
from ..strategies.base_strategy import BaseStrategy

class BacktestEngine:
    def __init__(self, 
                 initial_capital: float = 100000.0,
                 commission: float = 0.0):
        self.initial_capital = initial_capital
        self.commission = commission
        self.portfolio_value = []
        self.trades = []
    
    def run(self, data: pd.DataFrame, strategy: BaseStrategy) -> Dict[str, Any]:
        """
        Run backtest for a given strategy
        
        Args:
            data (pd.DataFrame): Historical price data
            strategy (BaseStrategy): Trading strategy instance
            
        Returns:
            Dict[str, Any]: Backtest results including returns, sharpe ratio, etc.
        """
        # Generate signals
        df = strategy.generate_signals(data)
        
        # Initialize portfolio metrics
        position = 0
        capital = self.initial_capital
        self.portfolio_value = [capital]
        
        # Simulate trading
        for i in range(1, len(df)):
            signal = df['signal'].iloc[i]
            price = df['close'].iloc[i]
            
            # Execute trades based on signals
            if signal == 1 and position <= 0:  # Buy signal
                position = capital / price
                trade_cost = position * price * self.commission
                capital -= trade_cost
                self.trades.append({
                    'date': df.index[i],
                    'type': 'buy',
                    'price': price,
                    'size': position
                })
            
            elif signal == -1 and position > 0:  # Sell signal
                trade_cost = position * price * self.commission
                capital = position * price - trade_cost
                position = 0
                self.trades.append({
                    'date': df.index[i],
                    'type': 'sell',
                    'price': price,
                    'size': position
                })
            
            # Update portfolio value
            current_value = capital if position == 0 else position * price
            self.portfolio_value.append(current_value)
        
        # Calculate metrics
        returns = pd.Series(self.portfolio_value).pct_change().dropna()
        
        results = {
            'total_return': (self.portfolio_value[-1] - self.initial_capital) / self.initial_capital,
            'sharpe_ratio': self._calculate_sharpe_ratio(returns),
            'max_drawdown': self._calculate_max_drawdown(),
            'trades': self.trades,
            'equity_curve': self.portfolio_value
        }
        
        return results
    
    def _calculate_sharpe_ratio(self, returns: pd.Series) -> float:
        """Calculate annualized Sharpe ratio"""
        if len(returns) == 0:
            return 0.0
        return np.sqrt(252) * returns.mean() / returns.std()
    
    def _calculate_max_drawdown(self) -> float:
        """Calculate maximum drawdown"""
        portfolio_series = pd.Series(self.portfolio_value)
        rolling_max = portfolio_series.expanding().max()
        drawdowns = portfolio_series / rolling_max - 1.0
        return drawdowns.min()
