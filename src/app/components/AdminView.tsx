"use client";
import { useState } from "react";
import { LayoutDashboard, DollarSign, PackagePlus, Trash2 } from "lucide-react";

export default function AdminView({ granel, setGranel, catalogoConPrecios }: any) {
  const [selectedGranelId, setSelectedGranelId] = useState(granel[0]?.id || "");
  const [targetBranch, setTargetBranch] = useState("Central");
  const [kilosASumar, setKilosASumar] = useState(20);

  const reabastecerGranel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGranelId) return;

    setGranel((prev: any) => prev.map((item: any) => {
      if (item.id === selectedGranelId) {
        const stockActualSucursal = item.stock[targetBranch] || 0;
        return {
          ...item,
          stock: {
            ...item.stock,
            [targetBranch]: stockActualSucursal + Number(kilosASumar)
          }
        };
      }
      return item;
    }));

    alert(`✅ Stock reabastecido con éxito: +${kilosASumar} kg agregados en ${targetBranch === 'Central' ? 'Depósito Central' : 'Sucursal Posadas 1'}.`);
  };

  const eliminarGranel = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar "${name}" del inventario de granel?`)) {
      setGranel((prev: any) => prev.filter((item: any) => item.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* REABASTECIMIENTO DE MATERIA PRIMA (GRANEL) */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2"><PackagePlus size={20} className="text-emerald-600"/> Reabastecimiento de Materia Prima (Granel)</h2>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded uppercase tracking-wider">Gestión de Stock</span>
        </div>
        <form onSubmit={reabastecerGranel} className="p-6">
          <p className="text-sm text-slate-500 mb-6">Selecciona una bolsa de granel existente y suma stock físico a la ubicación correspondiente para reflejar la llegada de nuevos lotes.</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Insumo a Reabastecer</label>
              <select 
                value={selectedGranelId} 
                onChange={(e) => setSelectedGranelId(e.target.value)}
                className="w-full p-2.5 border-2 border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 bg-slate-50 cursor-pointer"
              >
                {granel.map((g: any) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Sucursal / Depósito</label>
              <select 
                value={targetBranch} 
                onChange={(e) => setTargetBranch(e.target.value)}
                className="w-full p-2.5 border-2 border-slate-200 rounded-lg text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 bg-slate-50 cursor-pointer"
              >
                <option value="Central">Depósito Central</option>
                <option value="Posadas">Sucursal Posadas 1</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Kilos a Sumar (kg)</label>
              <input 
                type="number" 
                min="1" 
                value={kilosASumar} 
                onChange={(e) => setKilosASumar(Number(e.target.value))}
                required
                className="w-full p-2.5 border-2 border-slate-200 rounded-lg text-sm font-bold text-slate-800 outline-none focus:border-emerald-500 bg-slate-50"
              />
            </div>
            <div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition-colors shadow-sm cursor-pointer">
                Sumar Stock
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* MOTOR DE PRICING Y ELIMINACIÓN DE INSUMOS */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2"><DollarSign size={20} className="text-purple-600"/> Motor de Pricing Dinámico & Catálogo</h2>
          <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded uppercase tracking-wider">Edición de Costos Habilitada</span>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-6">Si modificas el costo de compra de la materia prima, los precios de venta de todas sus fracciones derivadas se actualizarán automáticamente manteniendo tu margen de ganancia. También puedes eliminar ítems erróneos.</p>
          <div className="grid gap-6">
            {granel.map((g: any) => (
              <div key={g.id} className="border-2 border-slate-100 rounded-lg p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-800">{g.name}</h3>
                    <button 
                      onClick={() => eliminarGranel(g.id, g.name)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                      title="Eliminar insumo"
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-slate-600">Costo de compra:</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input type="number" value={g.cost} onChange={(e) => setGranel((prev: any) => prev.map((item: any) => item.id === g.id ? {...item, cost: Number(e.target.value)} : item))} className="pl-7 pr-3 py-1.5 w-32 border-2 border-slate-300 rounded-md font-bold text-slate-800 outline-none focus:border-purple-500" />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded p-4 grid grid-cols-3 gap-4">
                  {catalogoConPrecios.filter((f: any) => f.parentId === g.id).map((f: any) => (
                    <div key={f.id} className="bg-white p-3 border border-slate-200 rounded shadow-sm">
                      <p className="text-xs font-bold text-slate-500 mb-1">{f.name}</p>
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] text-slate-400 font-semibold">Costo Base: ${Math.round(f.baseCost)}</span>
                        <span className="text-sm font-black text-purple-600">Venta: ${f.finalPrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MATRIZ DE INVENTARIO */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2"><LayoutDashboard size={20} className="text-blue-600"/> Matriz de Inventario Multilocal</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4 font-bold uppercase text-xs tracking-wider">SKU</th>
              <th className="p-4 font-bold uppercase text-xs tracking-wider text-center border-l border-slate-200">Depósito Central</th>
              <th className="p-4 font-bold uppercase text-xs tracking-wider text-center border-l border-slate-200">Sucursal Posadas 1</th>
              <th className="p-4 font-bold uppercase text-xs tracking-wider text-right">Total Consolidado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {granel.map((g: any) => (
              <tr key={g.id} className="bg-orange-50/30">
                <td className="p-4 font-semibold text-slate-800 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500"></span> {g.name}</td>
                <td className="p-4 text-center font-bold border-l border-slate-100 text-slate-700">{g.stock?.["Central"] || 0} kg</td>
                <td className="p-4 text-center font-bold border-l border-slate-100 text-slate-700">{g.stock?.["Posadas"] || 0} kg</td>
                <td className="p-4 text-right font-black text-orange-600">{(g.stock?.["Central"] || 0) + (g.stock?.["Posadas"] || 0)} kg</td>
              </tr>
            ))}
            {catalogoConPrecios.map((f: any) => (
              <tr key={f.id} className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-700 flex items-center gap-2 pl-8"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> {f.name}</td>
                <td className="p-4 text-center font-semibold border-l border-slate-100">{f.stock?.["Central"] || 0} un.</td>
                <td className="p-4 text-center font-semibold border-l border-slate-100">{f.stock?.["Posadas"] || 0} un.</td>
                <td className="p-4 text-right font-bold text-blue-600">{(f.stock?.["Central"] || 0) + (f.stock?.["Posadas"] || 0)} un.</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}