import React from 'react';
import { PriceVariant } from '../types';
import { Eye, EyeOff, Edit3 } from 'lucide-react';

interface VariantPanelProps {
  variants: PriceVariant[];
  currencySymbol?: string;
  onToggleVisibility?: (id: string) => void;
  onEdit?: () => void;
}

const VariantPanel: React.FC<VariantPanelProps> = ({ 
  variants, 
  currencySymbol = '₹', 
  onToggleVisibility, 
  onEdit 
}) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <div className="glass-card rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
      <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
        <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Inventory Variants</h3>
        <button 
          onClick={onEdit}
          className="px-6 py-1.5 rounded-xl border border-cyan-500/50 text-cyan-400 font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500/10 transition-all"
        >
          Modify
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">
            <tr>
              <th className="px-6 py-4">Configuration</th>
              <th className="px-6 py-4">Delta (+/-)</th>
              <th className="px-6 py-4">Gross Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {variants.map((v) => (
              <tr key={v.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 text-xs font-bold text-slate-200">
                  {v.name}
                </td>
                <td className="px-6 py-4 text-xs font-mono text-slate-400">
                  {v.priceDifference === 0 ? '—' : `${currencySymbol}${formatCurrency(v.priceDifference)}`}
                </td>
                <td className="px-6 py-4 text-sm font-black text-cyan-400 italic">
                  {currencySymbol}{formatCurrency(v.variantPrice)}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${v.status === 'In stock' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {v.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onToggleVisibility?.(v.id)}
                    className="p-1.5 text-slate-500 hover:text-cyan-400 rounded-lg transition-all"
                  >
                    {v.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </td>
              </tr>
            ))}
            {variants.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-600 italic text-xs font-bold uppercase tracking-widest">
                  No variants archived in database
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VariantPanel;