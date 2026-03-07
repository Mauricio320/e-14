export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      alertas_acta: {
        Row: {
          id: string;
          acta_id: string;
          codigo: string;
          descripcion: string;
          creado_en: string;
        };
        Insert: {
          id?: string;
          acta_id: string;
          codigo: string;
          descripcion: string;
          creado_en?: string;
        };
        Update: {
          id?: string;
          acta_id?: string;
          codigo?: string;
          descripcion?: string;
          creado_en?: string;
        };
      };
      consolidados_municipio: {
        Row: {
          id: string;
          municipio_id: string;
          total_puestos: number;
          total_mesas: number;
          mesas_reportadas: number;
          porcentaje_reportado: number;
          total_sufragantes: number;
          total_votos_urna: number;
          total_votos_incinerados: number;
          votos_en_blanco: number;
          votos_nulos: number;
          tarjetas_no_marcadas: number;
          total_votos_validos: number;
          total_votos_mesa: number;
          total_votos_lista: number;
          actas_borrador: number;
          actas_enviadas: number;
          actas_verificadas: number;
          actas_corregidas: number;
          ultima_actualizacion: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          municipio_id: string;
          total_puestos?: number;
          total_mesas?: number;
          mesas_reportadas?: number;
          porcentaje_reportado?: number;
          total_sufragantes?: number;
          total_votos_urna?: number;
          total_votos_incinerados?: number;
          votos_en_blanco?: number;
          votos_nulos?: number;
          tarjetas_no_marcadas?: number;
          total_votos_validos?: number;
          total_votos_mesa?: number;
          total_votos_lista?: number;
          actas_borrador?: number;
          actas_enviadas?: number;
          actas_verificadas?: number;
          actas_corregidas?: number;
          ultima_actualizacion?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          municipio_id?: string;
          total_puestos?: number;
          total_mesas?: number;
          mesas_reportadas?: number;
          porcentaje_reportado?: number;
          total_sufragantes?: number;
          total_votos_urna?: number;
          total_votos_incinerados?: number;
          votos_en_blanco?: number;
          votos_nulos?: number;
          tarjetas_no_marcadas?: number;
          total_votos_validos?: number;
          total_votos_mesa?: number;
          total_votos_lista?: number;
          actas_borrador?: number;
          actas_enviadas?: number;
          actas_verificadas?: number;
          actas_corregidas?: number;
          ultima_actualizacion?: string;
          created_at?: string;
        };
      };
      actas_e14: {
        Row: {
          id: string;
          mesa_id: string;
          registrado_por: string;
          version: number;
          estado: "borrador" | "enviado" | "verificado" | "corregido";
          total_volantes_e11: number;
          total_votos_urna: number;
          total_votos_incinerados: number;
          votos_en_blanco: number;
          votos_nulos: number;
          tarjetas_no_marcadas: number;
          total_votos_validos: number;
          total_votos_mesa: number;
          total_votos_lista: number | null;
          total_sufragantes: number;
          observaciones: string | null;
          observaciones_revisor: string | null;
          tiene_tachaduras: boolean | null;
          hubo_reconteo: boolean | null;
          hubo_reclamacion: boolean | null;
          tipo_reclamacion: string | null;
          creado_en: string;
          actualizado_en: string;
          enviado_en: string | null;
          verificado_por: string | null;
          verificado_en: string | null;
        };
        Insert: {
          id?: string;
          mesa_id: string;
          registrado_por: string;
          version?: number;
          estado?: "borrador" | "enviado" | "verificado" | "corregido";
          total_votos_urna?: number;
          total_votos_incinerados?: number;
          votos_en_blanco?: number;
          votos_nulos?: number;
          tarjetas_no_marcadas?: number;
          total_votos_validos?: number;
          total_votos_mesa?: number;
          total_sufragantes?: number;
          observaciones?: string | null;
          observaciones_revisor?: string | null;
          tiene_tachaduras?: boolean | null;
          hubo_reconteo?: boolean | null;
          hubo_reclamacion?: boolean | null;
          tipo_reclamacion?: string | null;
          creado_en?: string;
          actualizado_en?: string;
          enviado_en?: string | null;
          verificado_por?: string | null;
          verificado_en?: string | null;
        };
        Update: {
          id?: string;
          mesa_id?: string;
          registrado_por?: string;
          version?: number;
          estado?: "borrador" | "enviado" | "verificado" | "corregido";
          total_volantes_e11?: number;
          total_votos_urna?: number;
          total_votos_incinerados?: number;
          votos_en_blanco?: number;
          votos_nulos?: number;
          tarjetas_no_marcadas?: number;
          total_votos_validos?: number;
          total_votos_mesa?: number;
          total_votos_lista?: number | null;
          total_sufragantes?: number;
          observaciones?: string | null;
          observaciones_revisor?: string | null;
          tiene_tachaduras?: boolean | null;
          hubo_reconteo?: boolean | null;
          hubo_reclamacion?: boolean | null;
          tipo_reclamacion?: string | null;
          creado_en?: string;
          actualizado_en?: string;
          enviado_en?: string | null;
          verificado_por?: string | null;
          verificado_en?: string | null;
        };
      };
      auditoria_cambios: {
        Row: {
          id: string;
          tabla_afectada: string;
          registro_id: string;
          accion: string;
          datos_anteriores: Json | null;
          datos_nuevos: Json | null;
          ejecutado_por: string;
          ejecutado_en: string;
          ip_address: string | null;
        };
        Insert: {
          id?: string;
          tabla_afectada: string;
          registro_id: string;
          accion: string;
          datos_anteriores?: Json | null;
          datos_nuevos?: Json | null;
          ejecutado_por: string;
          ejecutado_en?: string;
          ip_address?: string | null;
        };
        Update: {
          id?: string;
          tabla_afectada?: string;
          registro_id?: string;
          accion?: string;
          datos_anteriores?: Json | null;
          datos_nuevos?: Json | null;
          ejecutado_por?: string;
          ejecutado_en?: string;
          ip_address?: string | null;
        };
      };
      candidatos: {
        Row: {
          id: string;
          partido_id: string;
          nombre: string;
          numero_lista: number | null;
          es_partido: boolean;
          activo: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          partido_id: string;
          nombre: string;
          numero_lista?: number | null;
          es_partido?: boolean;
          activo?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          partido_id?: string;
          nombre?: string;
          numero_lista?: number | null;
          es_partido?: boolean;
          activo?: boolean;
          created_at?: string;
        };
      };
      fotos_acta: {
        Row: {
          id: string;
          acta_id: string;
          storage_path: string;
          nombre_archivo: string;
          tamanio_bytes: number | null;
          subido_por: string;
          subido_en: string;
          url_publica?: string | null;
        };
        Insert: {
          id?: string;
          acta_id: string;
          storage_path: string;
          nombre_archivo: string;
          tamanio_bytes?: number | null;
          subido_por: string;
          subido_en?: string;
          url_publica?: string | null;
        };
        Update: {
          id?: string;
          acta_id?: string;
          storage_path?: string;
          nombre_archivo?: string;
          tamanio_bytes?: number | null;
          subido_por?: string;
          subido_en?: string;
          url_publica?: string | null;
        };
      };
      mesas: {
        Row: {
          id: string;
          puesto_id: string;
          numero_mesa: number;
          potencial_electoral: number;
          created_at: string;
          testigo_confirmado: boolean;
          testigo_confirmado_por: string | null;
          testigo_confirmado_en: string | null;
          actas_e14?: { estado: string }[];
        };
        Insert: {
          id?: string;
          puesto_id: string;
          numero_mesa: number;
          potencial_electoral?: number;
          created_at?: string;
          testigo_confirmado?: boolean;
          testigo_confirmado_por?: string | null;
          testigo_confirmado_en?: string | null;
        };
        Update: {
          id?: string;
          puesto_id?: string;
          numero_mesa?: number;
          potencial_electoral?: number;
          created_at?: string;
          testigo_confirmado?: boolean;
          testigo_confirmado_por?: string | null;
          testigo_confirmado_en?: string | null;
        };
      };
      municipios: {
        Row: {
          id: string;
          nombre: string;
          codigo_dane: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          codigo_dane: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          codigo_dane?: string;
          created_at?: string;
        };
      };
      partidos: {
        Row: {
          id: string;
          nombre: string;
          codigo: string;
          color_hex: string;
          img?: string;
          activo: boolean;
          created_at: string;
          order: number;
        };
        Insert: {
          id?: string;
          nombre: string;
          codigo: string;
          color_hex?: string;
          img?: string;
          activo?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          codigo?: string;
          color_hex?: string;
          img?: string;
          activo?: boolean;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role:
            | "maestro"
            | "revisor"
            | "coordinador_municipal"
            | "coordinador_puesto"
            | "testigo";
          municipio_id: string | null;
          puesto_id: string | null;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?:
            | "maestro"
            | "revisor"
            | "coordinador_municipal"
            | "coordinador_puesto"
            | "testigo";
          municipio_id?: string | null;
          puesto_id?: string | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?:
            | "maestro"
            | "revisor"
            | "coordinador_municipal"
            | "coordinador_puesto"
            | "testigo";
          municipio_id?: string | null;
          puesto_id?: string | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      puestos_votacion: {
        Row: {
          id: string;
          municipio_id: string;
          nombre: string;
          direccion: string | null;
          zona: "urbana" | "rural";
          created_at: string;
        };
        Insert: {
          id?: string;
          municipio_id: string;
          nombre: string;
          direccion?: string | null;
          zona?: "urbana" | "rural";
          created_at?: string;
        };
        Update: {
          id?: string;
          municipio_id?: string;
          nombre?: string;
          direccion?: string | null;
          zona?: "urbana" | "rural";
          created_at?: string;
        };
      };
      revisor_asignaciones: {
        Row: {
          id: string;
          revisor_id: string;
          municipio_id: string | null;
          puesto_id: string | null;
          asignado_por: string | null;
          asignado_en: string;
          activo: boolean;
        };
        Insert: {
          id?: string;
          revisor_id: string;
          municipio_id?: string | null;
          puesto_id?: string | null;
          asignado_por?: string | null;
          asignado_en?: string;
          activo?: boolean;
        };
        Update: {
          id?: string;
          revisor_id?: string;
          municipio_id?: string | null;
          puesto_id?: string | null;
          asignado_por?: string | null;
          asignado_en?: string;
          activo?: boolean;
        };
      };
      testigo_mesas: {
        Row: {
          id: string;
          testigo_id: string;
          mesa_id: string;
          asignado_por: string | null;
          asignado_en: string;
        };
        Insert: {
          id?: string;
          testigo_id: string;
          mesa_id: string;
          asignado_por?: string | null;
          asignado_en?: string;
        };
        Update: {
          id?: string;
          testigo_id?: string;
          mesa_id?: string;
          asignado_por?: string | null;
          asignado_en?: string;
        };
      };
      votos_candidato: {
        Row: {
          id: string;
          acta_id: string;
          candidato_id: string;
          votos: number;
        };
        Insert: {
          id?: string;
          acta_id: string;
          candidato_id: string;
          votos?: number;
        };
        Update: {
          id?: string;
          acta_id?: string;
          candidato_id?: string;
          votos?: number;
        };
      };
      votos_lista: {
        Row: {
          id: string;
          acta_id: string;
          partido_id: string;
          votos: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          acta_id: string;
          partido_id: string;
          votos?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          acta_id?: string;
          partido_id?: string;
          votos?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      consolidado_votos_candidato_municipio: {
        Row: {
          id: string;
          municipio_id: string;
          candidato_id: string;
          votos: number;
          ultima_actualizacion: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          municipio_id: string;
          candidato_id: string;
          votos?: number;
          ultima_actualizacion?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          municipio_id?: string;
          candidato_id?: string;
          votos?: number;
          ultima_actualizacion?: string;
          created_at?: string;
        };
      };
      consolidado_votos_lista_municipio: {
        Row: {
          id: string;
          municipio_id: string;
          partido_id: string;
          votos_lista: number;
          ultima_actualizacion: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          municipio_id: string;
          partido_id: string;
          votos_lista?: number;
          ultima_actualizacion?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          municipio_id?: string;
          partido_id?: string;
          votos_lista?: number;
          ultima_actualizacion?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      estado_enum: "borrador" | "enviado" | "verificado" | "corregido";
      role_enum:
        | "maestro"
        | "revisor"
        | "coordinador_municipal"
        | "coordinador_puesto"
        | "testigo";
      zona_enum: "urbana" | "rural";
    };
  };
}
