import { ChevronDown, ExternalLink } from "lucide-react";
import { CINES_OFICIALES } from "@/lib/entradas-cine";

export function MenuEntradas() {
  return (
    <details className="min-w-0 flex-1">
      <summary
        aria-label="Consultar entradas en las webs oficiales de los cines"
        className="group flex min-h-11 w-full cursor-pointer list-none items-center justify-center gap-2 rounded-lg border border-principal/30 bg-principal-suave px-3 py-2 text-center text-sm font-semibold text-principal transition-colors hover:border-principal/50 hover:bg-superficie-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal [&::-webkit-details-marker]:hidden"
      >
        Consultar entradas
        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-1">
        {CINES_OFICIALES.map((cine) => (
          <li key={cine.nombre}>
            <a
              href={cine.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 min-w-0 items-center justify-between gap-2 rounded-lg border border-borde bg-fondo px-3 py-2 text-sm font-medium text-texto-secundario transition-colors hover:border-principal/40 hover:text-principal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-principal"
            >
              <span className="truncate">{cine.nombre}</span>
              <ExternalLink
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
