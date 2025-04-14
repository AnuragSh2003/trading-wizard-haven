from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import yfinance as yf
from typing import Dict, Any, List
from ..strategies.moving_average_strategy import MovingAverageCrossoverStrategy
from ..backtest.backtest_engine import BacktestEngine

app = FastAPI()

class BacktestRequest(BaseModel):
    symbol: str
    strategy_name: str
    strategy_params: Dict[str, Any]
    start_date: str
    end_date: str
    initial_capital: float = 100000.0
    commission: float = 0.0

@app.post("/backtest")
async def run_backtest(request: BacktestRequest):
    try:
        # Fetch data from Yahoo Finance
        data = yf.download(
            request.symbol,
            start=request.start_date,
            end=request.end_date,
            interval="1d"
        )
        
        if data.empty:
            raise HTTPException(status_code=404, detail="No data found for the symbol")
        
        # Initialize strategy
        if request.strategy_name == "MovingAverageCrossover":
            strategy = MovingAverageCrossoverStrategy(request.strategy_params)
        else:
            raise HTTPException(status_code=400, detail="Invalid strategy name")
        
        # Run backtest
        engine = BacktestEngine(
            initial_capital=request.initial_capital,
            commission=request.commission
        )
        results = engine.run(data, strategy)
        
        # Convert numpy types to Python native types for JSON serialization
        results['total_return'] = float(results['total_return'])
        results['sharpe_ratio'] = float(results['sharpe_ratio'])
        results['max_drawdown'] = float(results['max_drawdown'])
        results['equity_curve'] = [float(x) for x in results['equity_curve']]
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
