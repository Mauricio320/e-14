import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

const supabase = createClient();

type Partido = Database["public"]["Tables"]["partidos"]["Row"];
type Candidato = Database["public"]["Tables"]["candidatos"]["Row"];

export interface CandidatoResultado {
  id: string;
  nombre: string;
  numero_lista: number | null;
  es_partido: boolean;
  votos: number;
  porcentaje: number;
}

export interface PartidoResultado {
  partido: Partido;
  votosLista: number;
  votosCandidatos: number;
  totalVotos: number;
  porcentaje: number;
  curules: number;
  candidatos: CandidatoResultado[];
}

export interface ResultadosElectorales {
  partidos: PartidoResultado[];
  totalVotos: number;
  totalCurules: number;
}

export async function obtenerResultadosElectorales(
  municipioId?: string,
  totalCurulesDisponibles: number = 7,
): Promise<ResultadosElectorales> {
  let query = supabase
    .from("partidos")
    .select(
      `
      *,
      candidatos (
        *,
        consolidado_votos_candidato_municipio (
          votos,
          municipio_id
        )
      ),
      consolidado_votos_lista_municipio (
        votos_lista,
        municipio_id
      )
    `,
    )
    .eq("activo", true);

  const { data, error } = await query;

  if (error) throw error;
  if (!data) return { partidos: [], totalVotos: 0, totalCurules: 0 };

  // Procesar y agrupar datos
  const partidosResultado: PartidoResultado[] = data.map((partido: any) => {
    // Filtrar votos de lista por municipio si aplica
    const votosListaArr = (
      partido.consolidado_votos_lista_municipio || []
    ).filter((v: any) => !municipioId || v.municipio_id === municipioId);
    const votosLista = votosListaArr.reduce(
      (sum: number, v: any) => sum + (v.votos_lista || 0),
      0,
    );

    // Procesar candidatos
    const candidatosResultado: CandidatoResultado[] = (
      partido.candidatos || []
    ).map((c: any) => {
      const votosCand = (c.consolidado_votos_candidato_municipio || [])
        .filter((v: any) => !municipioId || v.municipio_id === municipioId)
        .reduce((sum: number, v: any) => sum + (v.votos || 0), 0);

      return {
        id: c.id,
        nombre: c.nombre,
        numero_lista: c.numero_lista,
        es_partido: c.es_partido,
        votos: votosCand,
        porcentaje: 0, // se calcula después
      };
    });

    const votosCandidatos = candidatosResultado
      .filter((c) => !c.es_partido)
      .reduce((sum, c) => sum + c.votos, 0);

    const totalVotos = votosLista + votosCandidatos;

    return {
      partido: {
        id: partido.id,
        nombre: partido.nombre,
        codigo: partido.codigo,
        color_hex: partido.color_hex,
        activo: partido.activo,
        created_at: partido.created_at,
      },
      votosLista,
      votosCandidatos,
      totalVotos,
      porcentaje: 0,
      curules: 0,
      candidatos: candidatosResultado,
    };
  });

  // Calcular total de votos
  const totalVotos = partidosResultado.reduce(
    (sum, p) => sum + p.totalVotos,
    0,
  );

  // Calcular porcentajes
  partidosResultado.forEach((p) => {
    p.porcentaje = totalVotos > 0 ? (p.totalVotos / totalVotos) * 100 : 0;
    p.candidatos.forEach((c) => {
      c.porcentaje = totalVotos > 0 ? (c.votos / totalVotos) * 100 : 0;
    });
    // Ordenar candidatos por votos desc
    p.candidatos.sort((a, b) => b.votos - a.votos);
  });

  // Calcular curules por cifra repartidora (D'Hondt)
  const curules = calcularCurulesDHondt(
    partidosResultado,
    totalCurulesDisponibles,
  );
  curules.forEach(({ partidoId, curules: c }) => {
    const p = partidosResultado.find((pr) => pr.partido.id === partidoId);
    if (p) p.curules = c;
  });

  // Ordenar por total de votos desc
  partidosResultado.sort((a, b) => b.totalVotos - a.totalVotos);

  const totalCurules = partidosResultado.reduce((sum, p) => sum + p.curules, 0);

  return { partidos: partidosResultado, totalVotos, totalCurules };
}

function calcularCurulesDHondt(
  partidos: PartidoResultado[],
  totalCurules: number,
): { partidoId: string; curules: number }[] {
  const resultado = partidos
    .filter((p) => p.totalVotos > 0)
    .map((p) => ({ partidoId: p.partido.id, curules: 0 }));

  for (let i = 0; i < totalCurules; i++) {
    let maxCociente = -1;
    let ganadorIdx = -1;

    resultado.forEach((r, idx) => {
      const partido = partidos.find((p) => p.partido.id === r.partidoId);
      if (!partido) return;
      const cociente = partido.totalVotos / (r.curules + 1);
      if (cociente > maxCociente) {
        maxCociente = cociente;
        ganadorIdx = idx;
      }
    });

    if (ganadorIdx >= 0) {
      resultado[ganadorIdx].curules++;
    }
  }

  return resultado;
}
