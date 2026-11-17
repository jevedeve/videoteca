
import Link from "next/link";

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

        <Link href="/buscar" className="hover:underline">
          Buscar películas
        </Link>
      </div>
    </nav>
  );
}
