# Trading Strategy and Backtesting Module

This module provides strategy development and backtesting capabilities for the Trading Wizard Haven platform.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Components

1. **Strategies**: Located in `strategies/` directory
   - `base_strategy.py`: Base class for all trading strategies
   - `moving_average_strategy.py`: Example implementation of Moving Average Crossover strategy

2. **Backtesting**: Located in `backtest/` directory
   - `backtest_engine.py`: Main backtesting engine that simulates trading

3. **API**: Located in `api/` directory
   - `main.py`: FastAPI endpoints to connect with Spring Boot backend

## Running the API

Start the FastAPI server:
```bash
cd python
uvicorn api.main:app --reload
```

The API will be available at `http://localhost:8000`

## Example API Usage

```python
import requests

backtest_request = {
    "symbol": "AAPL",
    "strategy_name": "MovingAverageCrossover",
    "strategy_params": {
        "short_window": 20,
        "long_window": 50
    },
    "start_date": "2023-01-01",
    "end_date": "2023-12-31",
    "initial_capital": 100000.0,
    "commission": 0.001
}

response = requests.post("http://localhost:8000/backtest", json=backtest_request)
results = response.json()
```
