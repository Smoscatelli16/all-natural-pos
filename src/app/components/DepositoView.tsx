"use client";
import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";

export default function DepositoView({ catalogoConPrecios, currentBranch, granel, setGranel, setFraccionado }: any) {
  const [fraccionarQty, setFraccionarQty] = useState(10);
  const [selectedFraccion, setSelectedFraccion] = useState("f1");

  const procesarFraccionamiento = () => {
    const fracItem = catalogoConPrecios.find((i: any) => i.id === selectedFraccion);
    const parentGranel = granel.find((i: any) => i.id === fracItem?.parentId);
    if (!fracItem || !parentGranel) return;

    const kgNecesarios = fracItem.conversionKg * fraccionarQty;
    const currentGranelStock = parentGranel.stock[currentBranch];

    if (currentGranelStock < kgNecesarios) {
      alert(`❌ Stock insuficiente en ${currentBranch}. Necesitas ${kgNecesarios}kg de granel y tienes ${currentGranelStock}kg.`);
      return;
    }

    setGranel((prev: any) => prev.map((item: any) => item.id === parentGranel.id ? { ...item, stock: { ...item.stock, [currentBranch]: item.stock[currentBranch] - kgNecesarios } } : item));
    setFraccionado((prev: any) => prev.map((item: any) => item.id === fracItem.id ? { ...item, stock: { ...item.stock, [currentBranch]: item.stock[currentBranch] + fraccionarQty } } : item));
    alert(`✅ Trazabilidad: -${kgNecesarios}kg de Granel y +${fraccionarQty} unidades en ${currentBranch}.`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-800">Trazabilidad de Producción</h2>
        <p className="text-slate-500 mt-2">Convierte el stock a granel en productos listos para la venta en <strong className="text-emerald-600">{currentBranch}</strong>.</p>
      </div>
      <div className="bg-white border-2 border-emerald-100 rounded-2xl p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
        <div className="grid grid-cols-[1fr_auto_100px] gap-6 items-end mb-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Seleccione el SKU a producir</label>
            <select className="w-full p-3 rounded-lg border-2 border-slate-200 bg-slate-50 font-medium focus:border-emerald-500 outline-none cursor-pointer" value={selectedFraccion} onChange={e => setSelectedFraccion(e.target.value)}>
              {catalogoConPrecios.map((p: any) => <option key={p.id} value={p.id}>{p.name} (Gasta {p.conversionKg}kg por unidad)</option>)}
            </select>
          </div>
          <div className="pb-3 text-slate-300"><Plus size={24} /></div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Unidades</label>
            <input type="number" min="1" value={fraccionarQty} onChange={e => setFraccionarQty(Number(e.target.value))} className="w-full p-3 rounded-lg border-2 border-slate-200 bg-slate-50 text-center font-bold text-lg outline-none focus:border-emerald-500" />
          </div>
        </div>
        <div className="bg-slate-900 rounded-xl p-6 text-white flex items-center justify-between shadow-inner">
          <div className="w-1/3">
            <span className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Impacto Granel</span>
            <span className="text-red-400 font-black text-xl flex items-center gap-2">- {(catalogoConPrecios.find((i: any) => i.id === selectedFraccion)?.conversionKg || 0) * fraccionarQty} kg</span>
            <span className="text-xs text-slate-500 mt-1 block truncate">{catalogoConPrecios.find((i: any) => i.id === selectedFraccion)?.parentName}</span>
          </div>
          <div className="flex-1 flex justify-center"><div className="bg-slate-800 p-2 rounded-full"><ArrowRight className="text-emerald-500" size={24} /></div></div>
          <div className="w-1/3 text-right">
            <span className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Nuevo Stock Disponible</span>
            <span className="text-emerald-400 font-black text-xl flex items-center justify-end gap-2">+ {fraccionarQty} unidades</span>
            <span className="text-xs text-slate-500 mt-1 block">Listo para vender</span>
          </div>
        </div>
        <button onClick={procesarFraccionamiento} className="w-full mt-8 bg-emerald-600 text-white py-4 rounded-xl font-black text-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer">
          Confirmar Envasado y Actualizar Stock
        </button>
      </div>
    </div>
  );
}