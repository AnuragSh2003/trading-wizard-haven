from technical_screener import TechnicalScreener
from advanced_screener import AdvancedScreener
import pandas as pd
from typing import Dict, Any
import json
from datetime import datetime

def run_all_screeners(db_params: Dict[str, Any]):
    """Run all available screeners and save results"""
    
    # Initialize screeners
    tech_screener = TechnicalScreener(db_params)
    adv_screener = AdvancedScreener(db_params)
    
    # Dictionary to store all screening results
    all_results = {}
    
    # Run Technical Screeners
    print("Running Technical Screeners...")
    all_results['momentum'] = tech_screener.momentum_screener(min_rsi=55, min_volume=150000)
    all_results['breakout'] = tech_screener.breakout_screener(volume_ratio=2.0)
    all_results['trend_following'] = tech_screener.trend_following_screener(trend_period=50)
    
    # Run Advanced Screeners
    print("Running Advanced Screeners...")
    all_results['volume_breakout'] = adv_screener.volume_breakout_screener(
        volume_multiplier=2.0,
        price_change_min=2.0
    )
    all_results['rsi_divergence'] = adv_screener.rsi_divergence_screener(lookback_period=14)
    all_results['multi_timeframe_trend'] = adv_screener.multi_timeframe_trend_screener()
    all_results['volatility_breakout'] = adv_screener.volatility_breakout_screener(atr_multiplier=2.0)
    all_results['momentum_reversal'] = adv_screener.momentum_reversal_screener(
        oversold_rsi=30,
        overbought_rsi=70
    )
    
    # Process and save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Convert results to DataFrame for better viewing
    for screener_name, results in all_results.items():
        if results:
            df = pd.DataFrame(results)
            print(f"\nResults for {screener_name} screener:")
            print(df)
            
            # Save to CSV
            output_file = f"screener_results_{screener_name}_{timestamp}.csv"
            df.to_csv(output_file, index=False)
            print(f"Results saved to {output_file}")
        else:
            print(f"\nNo results found for {screener_name} screener")
    
    return all_results

if __name__ == "__main__":
    # Configure your PostgreSQL connection
    db_params = {
        'dbname': 'stock_data',
        'user': 'postgres',
        'password': 'root',
        'host': 'localhost',
        'port': '5432'
    }
    
    # Run all screeners
    results = run_all_screeners(db_params)
