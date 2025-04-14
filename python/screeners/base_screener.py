import pandas as pd
import numpy as np
from typing import List, Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
import ta

class BaseScreener:
    def __init__(self, db_params: Dict[str, Any]):
        """
        Initialize the base screener with database connection parameters
        
        Args:
            db_params (Dict[str, Any]): PostgreSQL connection parameters
                {
                    'dbname': str,
                    'user': str,
                    'password': str,
                    'host': str,
                    'port': str
                }
        """
        self.db_params = db_params
        
    def get_connection(self):
        """Create and return a database connection"""
        return psycopg2.connect(**self.db_params, cursor_factory=RealDictCursor)
    
    def get_historical_data(self, symbol: str, start_date: str, end_date: str) -> pd.DataFrame:
        """
        Fetch historical data for a given symbol from PostgreSQL
        
        Args:
            symbol (str): Stock symbol
            start_date (str): Start date in YYYY-MM-DD format
            end_date (str): End date in YYYY-MM-DD format
            
        Returns:
            pd.DataFrame: Historical data with OHLCV columns
        """
        with self.get_connection() as conn:
            query = """
                SELECT date, open, high, low, close, volume
                FROM historical_data
                WHERE symbol = %s
                AND date BETWEEN %s AND %s
                ORDER BY date
            """
            df = pd.read_sql_query(query, conn, params=(symbol, start_date, end_date))
            return df
    
    def calculate_technical_indicators(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculate comprehensive technical indicators
        
        Args:
            df (pd.DataFrame): DataFrame with OHLCV data
            
        Returns:
            pd.DataFrame: DataFrame with additional technical indicators
        """
        # Momentum Indicators
        df['rsi'] = ta.momentum.RSIIndicator(df['close']).rsi()
        df['stoch_k'] = ta.momentum.StochasticOscillator(df['high'], df['low'], df['close']).stoch()
        df['stoch_d'] = ta.momentum.StochasticOscillator(df['high'], df['low'], df['close']).stoch_signal()
        df['cci'] = ta.trend.CCIIndicator(df['high'], df['low'], df['close']).cci()
        df['adx'] = ta.trend.ADXIndicator(df['high'], df['low'], df['close']).adx()
        df['mfi'] = ta.volume.MFIIndicator(df['high'], df['low'], df['close'], df['volume']).money_flow_index()
        
        # Trend Indicators
        macd = ta.trend.MACD(df['close'])
        df['macd'] = macd.macd()
        df['macd_signal'] = macd.macd_signal()
        df['macd_diff'] = macd.macd_diff()
        
        # Moving Averages
        df['sma_5'] = ta.trend.SMAIndicator(df['close'], window=5).sma_indicator()
        df['sma_10'] = ta.trend.SMAIndicator(df['close'], window=10).sma_indicator()
        df['sma_20'] = ta.trend.SMAIndicator(df['close'], window=20).sma_indicator()
        df['sma_50'] = ta.trend.SMAIndicator(df['close'], window=50).sma_indicator()
        df['sma_200'] = ta.trend.SMAIndicator(df['close'], window=200).sma_indicator()
        
        df['ema_5'] = ta.trend.EMAIndicator(df['close'], window=5).ema_indicator()
        df['ema_10'] = ta.trend.EMAIndicator(df['close'], window=10).ema_indicator()
        df['ema_20'] = ta.trend.EMAIndicator(df['close'], window=20).ema_indicator()
        df['ema_50'] = ta.trend.EMAIndicator(df['close'], window=50).ema_indicator()
        df['ema_200'] = ta.trend.EMAIndicator(df['close'], window=200).ema_indicator()
        
        # Volatility Indicators
        bollinger = ta.volatility.BollingerBands(df['close'])
        df['bb_high'] = bollinger.bollinger_hband()
        df['bb_low'] = bollinger.bollinger_lband()
        df['bb_mid'] = bollinger.bollinger_mavg()
        df['bb_width'] = (df['bb_high'] - df['bb_low']) / df['bb_mid']
        
        atr = ta.volatility.AverageTrueRange(df['high'], df['low'], df['close'])
        df['atr'] = atr.average_true_range()
        
        # Volume Indicators
        df['obv'] = ta.volume.OnBalanceVolumeIndicator(df['close'], df['volume']).on_balance_volume()
        df['adl'] = ta.volume.AccDistIndexIndicator(df['high'], df['low'], df['close'], df['volume']).acc_dist_index()
        df['cmf'] = ta.volume.ChaikinMoneyFlowIndicator(df['high'], df['low'], df['close'], df['volume']).chaikin_money_flow()
        
        # Price Action
        df['prev_close'] = df['close'].shift(1)
        df['price_change'] = ((df['close'] - df['prev_close']) / df['prev_close']) * 100
        df['volume_sma_20'] = ta.trend.SMAIndicator(df['volume'], window=20).sma_indicator()
        df['volume_ratio'] = df['volume'] / df['volume_sma_20']
        
        return df
    
    def get_all_symbols(self) -> List[str]:
        """Get all available stock symbols from the database"""
        with self.get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT DISTINCT symbol FROM historical_data")
                symbols = [row['symbol'] for row in cur.fetchall()]
                return symbols
