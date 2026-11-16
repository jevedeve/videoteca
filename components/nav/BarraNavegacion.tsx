
import Link from "next/link";

// Navegación principal de Videoteca.
// Aparece en todas las páginas porque se incluye en app/layout.tsx.
export function BarraNavegacion() {
  return (
    <nav className="border-b border-borde">
      <div className="mx-auto flex max-w-4xl gap-6 px-4 py-4 text-sm font-medium">
        <Link href="/" className="hover:underline">
          Todas las películas
        </Link>

        <Link href="/vistas" className="hover:underline">
          Vistas
        </Link>
      </div>
    </nav>
  );
}
