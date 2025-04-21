
"""
NSE Stock Screener Package

This package provides various screeners for analyzing NSE (National Stock Exchange) stocks
using different technical indicators and strategies.

The package includes the following key modules:
- base_screener: Base class with common functionality for all screeners
- technical_screener: Implementations of common technical analysis screeners
- advanced_screener: Advanced screening algorithms with multiple indicator combinations
- run_screeners: Utility to run multiple screeners and consolidate results

Features:
- Multiple pre-built screeners (momentum, trend following, breakout, etc.)
- Customizable parameters for each screener
- Integration with database for historical data retrieval
- Signal strength scoring

Requirements:
- pandas, numpy, ta (Technical Analysis library)
- psycopg2 for database connectivity
- Access to historical NSE stock data
"""

from .base_screener import BaseScreener
from .technical_screener import TechnicalScreener
from .advanced_screener import AdvancedScreener
from .run_screeners import run_all_screeners

__all__ = ['BaseScreener', 'TechnicalScreener', 'AdvancedScreener', 'run_all_screeners']
