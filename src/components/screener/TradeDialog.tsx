
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScreenerResult } from "@/types/stock";
import { toast } from "@/hooks/use-toast";

interface TradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStocks: ScreenerResult[];
}

const TradeDialog = ({ isOpen, onClose, selectedStocks }: TradeDialogProps) => {
  const [tradeData, setTradeData] = useState<Array<{
    id: string;
    symbol: string;
    price: number;
    quantity: number;
    signal: 'Buy' | 'Short';
  }>>([]);

  useEffect(() => {
    // Initialize trade data when selected stocks change
    setTradeData(
      selectedStocks.map(result => ({
        id: result.id,
        symbol: result.stock.symbol,
        price: result.stock.price,
        quantity: 1,
        signal: result.finalSignal === 'Wait' ? 'Buy' : result.finalSignal,
      }))
    );
  }, [selectedStocks]);

  const handleQuantityChange = (id: string, value: string) => {
    const quantity = parseInt(value) || 0;
    setTradeData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    );
  };

  const handleSignalChange = (id: string, value: 'Buy' | 'Short') => {
    setTradeData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, signal: value } : item
      )
    );
  };

  const getTotalAmount = () => {
    return tradeData.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleConfirmTrade = () => {
    // Here you would typically send the trade to your backend
    toast({
      title: "Trade Confirmed",
      description: `Successfully placed orders for ${tradeData.length} stocks`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Confirm Trade</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[400px] overflow-y-auto py-4">
          {tradeData.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{item.symbol}</div>
                <div className="text-sm text-gray-500">₹{item.price.toFixed(2)}</div>
              </div>
              
              <div className="w-32">
                <Select
                  value={item.signal}
                  onValueChange={(value: 'Buy' | 'Short') => handleSignalChange(item.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Buy">Buy</SelectItem>
                    <SelectItem value="Short">Short</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-24">
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  className="text-right"
                />
              </div>
              
              <div className="w-28 text-right">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center py-4 border-t">
          <div className="text-lg font-medium">Total Amount</div>
          <div className="text-lg font-bold">₹{getTotalAmount().toFixed(2)}</div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirmTrade}>Confirm Trade</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TradeDialog;
