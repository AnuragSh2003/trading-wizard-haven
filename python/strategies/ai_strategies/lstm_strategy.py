import numpy as np
import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.optimizers import Adam
from sklearn.preprocessing import MinMaxScaler
from ..base_strategy import BaseStrategy

class LSTMStrategy(BaseStrategy):
    def __init__(self, parameters: dict = None):
        default_params = {
            'sequence_length': 60,
            'lstm_units': 50,
            'epochs': 50,
            'batch_size': 32,
            'prediction_threshold': 0.55
        }
        super().__init__(parameters or default_params)
        self.model = None
        self.scaler = MinMaxScaler()
        
    def _prepare_data(self, data: pd.DataFrame) -> tuple:
        """Prepare data for LSTM model"""
        # Create features
        df = data.copy()
        df['returns'] = df['close'].pct_change()
        df['volatility'] = df['returns'].rolling(20).std()
        df['rsi'] = self._calculate_rsi(df['close'])
        
        # Scale features
        features = ['close', 'volume', 'returns', 'volatility', 'rsi']
        scaled_data = self.scaler.fit_transform(df[features])
        
        # Create sequences
        X, y = [], []
        for i in range(len(scaled_data) - self.parameters['sequence_length']):
            X.append(scaled_data[i:i + self.parameters['sequence_length']])
            y.append(1 if df['close'].iloc[i + self.parameters['sequence_length']] > 
                    df['close'].iloc[i + self.parameters['sequence_length'] - 1] else 0)
        
        return np.array(X), np.array(y)
    
    def _build_model(self, input_shape):
        """Build LSTM model"""
        model = Sequential([
            LSTM(self.parameters['lstm_units'], return_sequences=True, 
                 input_shape=input_shape),
            Dropout(0.2),
            LSTM(self.parameters['lstm_units']//2),
            Dropout(0.2),
            Dense(1, activation='sigmoid')
        ])
        model.compile(optimizer=Adam(), loss='binary_crossentropy', 
                     metrics=['accuracy'])
        return model
    
    def _calculate_rsi(self, prices, period=14):
        """Calculate RSI indicator"""
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        return 100 - (100 / (1 + rs))
    
    def generate_signals(self, data: pd.DataFrame) -> pd.DataFrame:
        """Generate trading signals using LSTM predictions"""
        df = data.copy()
        
        # Prepare training data
        X, y = self._prepare_data(df)
        
        # Build and train model if not exists
        if self.model is None:
            self.model = self._build_model(X.shape[1:])
            self.model.fit(X, y, epochs=self.parameters['epochs'], 
                         batch_size=self.parameters['batch_size'], verbose=0)
        
        # Generate predictions
        df['signal'] = 0
        for i in range(self.parameters['sequence_length'], len(df)):
            sequence = df.iloc[i-self.parameters['sequence_length']:i]
            features = ['close', 'volume', 'returns', 'volatility', 'rsi']
            scaled_sequence = self.scaler.transform(sequence[features])
            prediction = self.model.predict(
                scaled_sequence.reshape(1, self.parameters['sequence_length'], -1),
                verbose=0
            )[0][0]
            
            # Generate signals based on prediction probability
            if prediction > self.parameters['prediction_threshold']:
                df.iloc[i, df.columns.get_loc('signal')] = 1
            elif prediction < (1 - self.parameters['prediction_threshold']):
                df.iloc[i, df.columns.get_loc('signal')] = -1
        
        return df
