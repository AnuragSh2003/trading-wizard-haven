import pandas as pd
from transformers import pipeline
import yfinance as yf
from newsapi import NewsApiClient
from ..base_strategy import BaseStrategy

class SentimentStrategy(BaseStrategy):
    def __init__(self, parameters: dict = None):
        default_params = {
            'news_api_key': None,  # Required
            'sentiment_threshold': 0.6,
            'lookback_days': 3
        }
        super().__init__(parameters or default_params)
        self.sentiment_analyzer = pipeline("sentiment-analysis")
        self.news_api = NewsApiClient(api_key=self.parameters['news_api_key'])
    
    def _get_news_sentiment(self, symbol: str, date: pd.Timestamp) -> float:
        """Calculate average sentiment score from news articles"""
        try:
            # Get news articles
            articles = self.news_api.get_everything(
                q=symbol,
                from_param=date - pd.Timedelta(days=self.parameters['lookback_days']),
                to=date,
                language='en',
                sort_by='relevancy'
            )
            
            if not articles['articles']:
                return 0
            
            # Analyze sentiment
            sentiments = []
            for article in articles['articles'][:5]:  # Analyze top 5 articles
                title = article['title']
                result = self.sentiment_analyzer(title)[0]
                sentiment_score = result['score'] if result['label'] == 'POSITIVE' else -result['score']
                sentiments.append(sentiment_score)
            
            return sum(sentiments) / len(sentiments)
        
        except Exception as e:
            print(f"Error getting news sentiment: {e}")
            return 0
    
    def generate_signals(self, data: pd.DataFrame) -> pd.DataFrame:
        """Generate trading signals based on news sentiment"""
        df = data.copy()
        df['signal'] = 0
        
        # Get symbol from data
        symbol = df.get('symbol', 'UNKNOWN')
        
        # Calculate sentiment for each day
        for i in range(len(df)):
            date = df.index[i]
            sentiment = self._get_news_sentiment(symbol, date)
            
            # Generate signals based on sentiment
            if sentiment > self.parameters['sentiment_threshold']:
                df.iloc[i, df.columns.get_loc('signal')] = 1
            elif sentiment < -self.parameters['sentiment_threshold']:
                df.iloc[i, df.columns.get_loc('signal')] = -1
        
        return df
