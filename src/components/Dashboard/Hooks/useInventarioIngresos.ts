import { useMemo } from "react";

type Periodo = "dia" | "mes" | "anio";

interface InventarioItem {
  aF_FINGRESO?: string;
}

function parseFechaCL(value?: string): Date | null {
  if (!value) return null;
  const s = value.trim();

  // Try native Date (ISO and other recognized formats)
  const iso = new Date(s);
  if (!isNaN(iso.getTime())) return iso;

  // Try DD[-/\.]MM[-/\.]YYYY
  const dmy = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (dmy) {
    const day = Number(dmy[1]);
    const month = Number(dmy[2]) - 1;
    const year = Number(dmy[3]);
    const d = new Date(year, month, day);
    if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) return d;
  }

  // Try YYYY[-/\.]MM[-/\.]DD
  const ymd = s.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/);
  if (ymd) {
    const year = Number(ymd[1]);
    const month = Number(ymd[2]) - 1;
    const day = Number(ymd[3]);
    const d = new Date(year, month, day);
    if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) return d;
  }

  return null;
}

export const useInventarioIngresos = (
  data: InventarioItem[],
  periodo: Periodo = "dia"
) => {
  return useMemo(() => {
    const contador: Record<string, number> = {};

    data.forEach(item => {
      if (!item.aF_FINGRESO) return;

      const fecha = parseFechaCL(item.aF_FINGRESO);
      if (!fecha) return;

      let key = "";

      if (periodo === "dia") {
        key = fecha.toISOString().substring(0, 10); // YYYY-MM-DD
      }

      if (periodo === "mes") {
        key = `${fecha.getFullYear()}-${String(
          fecha.getMonth() + 1
        ).padStart(2, "0")}`;
      }

      if (periodo === "anio") {
        key = String(fecha.getFullYear());
      }

      contador[key] = (contador[key] || 0) + 1;
    });

    return Object.keys(contador)
      .sort()
      .map(key => ({
        periodo: key,
        total: contador[key],
      }));
  }, [data, periodo]);
};
