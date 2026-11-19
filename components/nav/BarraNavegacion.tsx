
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const menus = [
  { titulo: "Por ver", ruta: "/" },
  { titulo: "Vistas", ruta: "/vistas" },
];

export function BarraNavegacion() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function cerrarFuera(evento: MouseEvent) {
      if (!navRef.current?.contains(evento.target as Node)) {
        setAbierto(null);
      }
    }

    document.addEventListener("mousedown", cerrarFuera);
    return () => document.removeEventListener("mousedown", cerrarFuera);
  }, []);

  return (
    <nav ref={navRef} className="border-b border-borde">
      <div className="mx-auto flex max-w-4xl gap-4 px-4 py-4 text-sm font-medium">
        <Link
  href="/"
  onClick={() => setAbierto(null)}
  className="rounded-lg px-3 py-2 font-semibold text-principal hover:bg-superficie"
>
  🏠 Inicio
</Link>
        {menus.map((menu) => (
          <div key={menu.ruta} className="relative">
            <button
              type="button"
              aria-expanded={abierto === menu.ruta}
              onClick={() =>
                setAbierto(abierto === menu.ruta ? null : menu.ruta)
              }
              className={`rounded-lg px-3 py-2 hover:bg-superficie ${
                pathname === menu.ruta
                  ? "font-bold text-principal"
                  : "text-texto"
              }`}
            >
              {menu.titulo} ▾
            </button>

            {abierto === menu.ruta && (
              <div className="absolute left-0 top-full z-50 mt-2 min-w-36 rounded-xl border border-borde bg-superficie p-2 shadow-lg">
                {[
                  { texto: "Todo", query: "" },
                  { texto: "Películas", query: "?tipo=pelicula" },
                  { texto: "Series", query: "?tipo=serie" },
                ].map((opcion) => (
                  <Link
                    key={opcion.texto}
                    href={`${menu.ruta}${opcion.query}`}
                    onClick={() => setAbierto(null)}
                    className="block rounded-lg px-3 py-2 hover:bg-fondo"
                  >
                    {opcion.texto}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
