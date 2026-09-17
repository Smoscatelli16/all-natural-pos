"use client";

import { useState, useMemo } from "react";
import { ShoppingCart, Package, LayoutDashboard, Wifi, WifiOff, RefreshCw, Store } from "lucide-react";
import PosView from "./components/PosView";
import DepositoView from "./components/DepositoView";
import AdminView from "./components/AdminView";

// --- MOCK DATA ESCALADA ---
const initialGranel = [
  { id: "g1", name: "Bolsa Almendras (20kg)", cost: 120000, stock: { "Central": 20, "Posadas": 5 } },
  { id: "g2", name: "Bolsa Castañas (10kg)", cost: 80000, stock: { "Central": 10, "Posadas": 2 } },
];

const initialFraccionado = [
  { id: "f1", parentId: "g1", name: "Almendras x 250g", conversionKg: 0.25, marginMultiplier: 1.6, wholesaleMultiplier: 1.3, stock: { "Central": 15, "Posadas": 40 } },
  { id: "f2", parentId: "g1", name: "Almendras x 500g", conversionKg: 0.50, marginMultiplier: 1.5, wholesaleMultiplier: 1.25, stock: { "Central": 10, "Posadas": 25 } },
  { id: "f3", parentId: "g2", name: "Castañas x 250g", conversionKg: 0.25, marginMultiplier: 1.7, wholesaleMultiplier: 1.35, stock: { "Central": 20, "Posadas": 15 } },
];

export default function DemoDietetica() {
  const [activeTab, setActiveTab] = useState("pos");
  const [isOnline, setIsOnline] = useState(true);
  const [currentBranch, setCurrentBranch] = useState("Posadas");
  const [syncQueue, setSyncQueue] = useState<any[]>([]);
  
  const [granel, setGranel] = useState(initialGranel);
  const [fraccionado, setFraccionado] = useState(initialFraccionado);

  const catalogoConPrecios = useMemo(() => {
    return fraccionado.map(frac => {
      const parent = granel.find(g => g.id === frac.parentId);
      const costoPorKg = parent ? (parent.cost / parseInt(parent.name.match(/\d+/)?.[0] || "1")) : 0;
      const costoFraccion = costoPorKg * frac.conversionKg;
      const precioFinal = Math.round(costoFraccion * frac.marginMultiplier);
      const precioMayorista = Math.round(costoFraccion * (frac.wholesaleMultiplier || 1.3));
      return { 
        ...frac, 
        baseCost: costoFraccion, 
        finalPrice: precioFinal, 
        wholesalePrice: precioMayorista,
        parentName: parent?.name 
      };
    });
  }, [granel, fraccionado]);

  const sincronizarPendientes = () => {
    if (!isOnline) {
      alert("Debes recuperar la conexión para sincronizar.");
      return;
    }
    alert(`🔄 Sincronizando ${syncQueue.length} ventas locales con el servidor central...`);
    setSyncQueue([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-10">
      {/* HEADER GLOBAL - ALL NATURAL */}
      <div className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <div className="font-bold text-xl tracking-wide flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center font-black">AN</div>
            All Natural
          </div>
          <div className="h-6 w-px bg-slate-700 mx-2"></div>
          <div className="flex items-center gap-2 text-sm bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700">
            <Store size={16} className="text-slate-400" />
            <select 
              value={currentBranch} 
              onChange={(e) => setCurrentBranch(e.target.value)}
              className="bg-transparent border-none outline-none font-semibold cursor-pointer text-white"
            >
              <option value="Central" className="text-black">Depósito Central</option>
              <option value="Posadas" className="text-black">Sucursal Posadas 1</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {syncQueue.length > 0 && (
            <button onClick={sincronizarPendientes} className="animate-pulse bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
              <RefreshCw size={14} /> Sincronizar {syncQueue.length} ventas
            </button>
          )}
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${isOnline ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}
          >
            {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
            {isOnline ? 'Sistema en Línea' : 'Modo Offline (Caja Activa)'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* NAVEGACIÓN */}
        <div className="flex border-b border-gray-200 bg-white" role="tablist">
          <div 
            onClick={() => setActiveTab('pos')} 
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab('pos'); }}
            role="tab"
            tabIndex={0}
            aria-selected={activeTab === 'pos'}
            className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-bold cursor-pointer transition-colors border-b-2 select-none outline-none focus-visible:bg-slate-50 ${activeTab === 'pos' ? 'bg-slate-50 text-blue-600 border-blue-600' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
          >
            <ShoppingCart size={18} className="pointer-events-none" /> Caja Registradora
          </div>
          <div 
            onClick={() => setActiveTab('deposito')} 
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab('deposito'); }}
            role="tab"
            tabIndex={0}
            aria-selected={activeTab === 'deposito'}
            className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-bold cursor-pointer transition-colors border-b-2 select-none outline-none focus-visible:bg-slate-50 ${activeTab === 'deposito' ? 'bg-slate-50 text-emerald-600 border-emerald-600' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
          >
            <Package size={18} className="pointer-events-none" /> Trazabilidad & Envasado
          </div>
          <div 
            onClick={() => setActiveTab('admin')} 
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab('admin'); }}
            role="tab"
            tabIndex={0}
            aria-selected={activeTab === 'admin'}
            className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-bold cursor-pointer transition-colors border-b-2 select-none outline-none focus-visible:bg-slate-50 ${activeTab === 'admin' ? 'bg-slate-50 text-purple-600 border-purple-600' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
          >
            <LayoutDashboard size={18} className="pointer-events-none" /> Dashboard Gerencial
          </div>
        </div>

        {/* VISTAS MODULARES */}
        <div className="p-8">
          {activeTab === "pos" && (
            <PosView 
              catalogoConPrecios={catalogoConPrecios} 
              currentBranch={currentBranch} 
              isOnline={isOnline} 
              setFraccionado={setFraccionado}
              setSyncQueue={setSyncQueue}
            />
          )}
          {activeTab === "deposito" && (
            <DepositoView 
              catalogoConPrecios={catalogoConPrecios} 
              currentBranch={currentBranch} 
              granel={granel}
              setGranel={setGranel}
              setFraccionado={setFraccionado}
            />
          )}
          {activeTab === "admin" && (
            <AdminView 
              granel={granel} 
              setGranel={setGranel} 
              catalogoConPrecios={catalogoConPrecios} 
            />
          )}
        </div>
      </div>
    </div>
  );
}