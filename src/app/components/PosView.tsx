"use client";
import { useState } from "react";
import { ShoppingCart, WifiOff, Tag } from "lucide-react";

export default function PosView({ catalogoConPrecios, currentBranch, isOnline, setFraccionado, setSyncQueue }: any) {
  const [cart, setCart] = useState<{id: string, name: string, qty: number, price: number}[]>([]);
  const [isWholesale, setIsWholesale] = useState(false);

  const addToCart = (product: any) => {
    const activePrice = isWholesale ? product.wholesalePrice : product.finalPrice;
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id && item.price === activePrice);
      if (exists) return prev.map(item => (item.id === product.id && item.price === activePrice) ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { id: product.id, name: `${product.name} ${isWholesale ? '(Mayorista)' : ''}`, qty: 1, price: activePrice }];
    });
  };

  const totalCart = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const procesarVenta = () => {
    if (cart.length === 0) return;
    setFraccionado((prev: any) => prev.map((item: any) => {
      const cartItem = cart.find((c: any) => c.id === item.id);
      if (cartItem) return { ...item, stock: { ...item.stock, [currentBranch]: item.stock[currentBranch] - cartItem.qty } };
      return item;
    }));
    if (isOnline) alert(`✅ Venta ${isWholesale ? 'Mayorista' : 'Minorista'} procesada y sincronizada en la nube ($${totalCart}).`);
    else {
      setSyncQueue((prev: any) => [...prev, { branch: currentBranch, total: totalCart, items: cart.length, type: isWholesale ? 'WHOLESALE' : 'RETAIL' }]);
      alert(`⚠️ Sin conexión. Venta ${isWholesale ? 'Mayorista' : 'Minorista'} guardada localmente en la caja de ${currentBranch}.`);
    }
    setCart([]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* SECCIÓN DEL CATÁLOGO */}
      <div className="flex-1 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Terminal: {currentBranch}</h2>
            <button 
              onClick={() => setIsWholesale(!isWholesale)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border ${isWholesale ? 'bg-purple-600 text-white border-purple-700 shadow-sm' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}`}
            >
              <Tag size={14}/> {isWholesale ? 'Modo Mayorista Activo' : 'Cambiar a Mayorista'}
            </button>
          </div>
          {!isOnline && <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-bold flex items-center gap-2"><WifiOff size={14}/> Red Local</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalogoConPrecios.map((product: any) => {
            const localStock = product.stock[currentBranch];
            const displayPrice = isWholesale ? product.wholesalePrice : product.finalPrice;
            return (
              <div key={product.id} onClick={() => localStock > 0 && addToCart(product)} className={`border rounded-xl p-4 transition-all relative overflow-hidden select-none ${localStock > 0 ? 'cursor-pointer hover:border-blue-500 hover:shadow-md bg-white' : 'opacity-50 cursor-not-allowed bg-gray-50'}`}>
                {localStock === 0 && <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">SIN STOCK</div>}
                <h3 className="font-bold text-slate-800 leading-tight">{product.name}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className={`${isWholesale ? 'text-purple-600' : 'text-blue-600'} font-black text-xl`}>${displayPrice}</p>
                  <span className="text-[10px] text-slate-400 font-semibold">{isWholesale ? 'Mayorista' : 'Minorista'}</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 font-medium">Stock: {localStock} un.</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* SECCIÓN DEL TICKET DE VENTA */}
      <div className="w-full lg:w-96 bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-inner flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><ShoppingCart size={20}/> Ticket de Venta</h2>
        <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[300px] lg:max-h-none">
          {cart.length === 0 ? (
            <div className="h-full py-10 flex flex-col items-center justify-center text-gray-400 gap-2">
              <ShoppingCart size={32} className="opacity-20" />
              <p className="text-sm font-medium">Escanee un producto</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex justify-between py-3 border-b border-gray-200 text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">{item.qty}</span>
                  <span className="font-medium text-slate-700">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">${item.price * item.qty}</span>
              </div>
            ))
          )}
        </div>
        <div className="mt-6 pt-4 border-t-2 border-slate-200">
          <div className="flex justify-between items-end mb-6">
            <span className="text-slate-500 font-bold uppercase text-sm">Total a cobrar</span>
            <span className="text-3xl font-black text-slate-900">${totalCart}</span>
          </div>
          <button onClick={procesarVenta} disabled={cart.length === 0} className="w-full bg-blue-600 disabled:bg-slate-300 text-white py-4 rounded-xl font-black text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 cursor-pointer">
            Procesar Pago
          </button>
        </div>
      </div>
    </div>
  );
}