import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SYMBOL_GROUPS, ALL_SYMBOLS } from '@/hooks/usePasswordGenerator';

interface SymbolSelectorProps {
  customSymbols: string;
  onCustomSymbolsChange: (symbols: string) => void;
  t: any; // 翻译对象
}

export const SymbolSelector = ({ customSymbols, onCustomSymbolsChange, t }: SymbolSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // 检查某个符号是否被选中
  const isSymbolSelected = (symbol: string) => customSymbols.includes(symbol);

  // 切换单个符号的选中状态
  const toggleSymbol = (symbol: string) => {
    if (isSymbolSelected(symbol)) {
      onCustomSymbolsChange(customSymbols.replace(symbol, ''));
    } else {
      onCustomSymbolsChange(customSymbols + symbol);
    }
  };

  // 全选
  const selectAll = () => {
    onCustomSymbolsChange(ALL_SYMBOLS);
  };

  // 清除全部
  const clearAll = () => {
    onCustomSymbolsChange('');
  };

  // 渲染符号组
  const renderSymbolGroup = (groupKey: keyof typeof SYMBOL_GROUPS, label: string) => {
    const symbols = SYMBOL_GROUPS[groupKey];
    return (
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className="flex flex-wrap gap-2">
          {symbols.split('').map((symbol) => (
            <button
              key={symbol}
              onClick={() => toggleSymbol(symbol)}
              className={`
                w-10 h-10 flex items-center justify-center rounded-md border-2 
                transition-all font-mono text-lg font-semibold
                ${isSymbolSelected(symbol)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border hover:border-primary/50 bg-background'
                }
              `}
              title={symbol}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const selectedCount = customSymbols.length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
        >
          <span>
            {t.customizeSymbols} 
            <span className="ml-2 text-xs">
              ({t.selectedCount.replace('{{count}}', selectedCount.toString())})
            </span>
          </span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-4 pt-3">
        {/* 快捷操作按钮 */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={selectAll}
            className="flex-1 text-xs"
          >
            {t.selectAll}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAll}
            className="flex-1 text-xs"
          >
            {t.clearAll}
          </Button>
        </div>

        {/* 符号分组 */}
        <div className="space-y-4 p-3 bg-muted/30 rounded-lg">
          {renderSymbolGroup('common', t.commonSymbols)}
          {renderSymbolGroup('brackets', t.brackets)}
          {renderSymbolGroup('operators', t.operators)}
          {renderSymbolGroup('others', t.otherSymbols)}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
