"use client";
import { LayoutDashboard, DollarSign } from "lucide-react";

export default function AdminView({ granel, setGranel, catalogoConPrecios }: any) {
  return (
    <div className="space-y-8">
      {/* MOTOR DE PRICING */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2"><DollarSign size={20} className="text-purple-600"/> Motor de Pricing Dinámico</h2>
          <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded uppercase tracking-wider">Edición de Costos Habilitada</span>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-6">Si modificas el costo de compra de la materia prima, los precios de venta de todas sus fracciones derivadas se actualizarán automáticamente manteniendo tu margen de ganancia.</p>
          <div className="grid gap-6">
            {granel.map((g: any) => (
              <div key={g.id} className="border-2 border-slate-100 rounded-lg p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800">{g.name}</h3>
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
                <td className="p-4 text-center font-bold border-l border-slate-100 text-slate-700">{g.stock["Central"]} kg</td>
                <td className="p-4 text-center font-bold border-l border-slate-100 text-slate-700">{g.stock["Posadas"]} kg</td>
                <td className="p-4 text-right font-black text-orange-600">{g.stock["Central"] + g.stock["Posadas"]} kg</td>
              </tr>
            ))}
            {catalogoConPrecios.map((f: any) => (
              <tr key={f.id} className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-700 flex items-center gap-2 pl-8"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> {f.name}</td>
                <td className="p-4 text-center font-semibold border-l border-slate-100">{f.stock["Central"]} un.</td>
                <td className="p-4 text-center font-semibold border-l border-slate-100">{f.stock["Posadas"]} un.</td>
                <td className="p-4 text-right font-bold text-blue-600">{f.stock["Central"] + f.stock["Posadas"]} un.</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}