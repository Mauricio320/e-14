import { z } from 'zod'

// Esquema para votos por candidato
export const votoCandidatoSchema = z.object({
  candidatoId: z.string().uuid('ID de candidato inválido'),
  votos: z.number()
    .int('Los votos deben ser un número entero')
    .min(0, 'Los votos no pueden ser negativos')
    .max(1000, 'Número de votos excede el límite razonable'),
})

// Esquema para el acta E-14 completa
export const actaE14Schema = z.object({
  mesaId: z.string().uuid('Seleccione una mesa válida'),
  votos: z.array(votoCandidatoSchema)
    .min(1, 'Debe ingresar al menos un voto'),
  totalVolantesE11: z.number()
    .int('Debe ser un número entero')
    .min(0, 'No puede ser negativo'),
  totalVotosUrna: z.number()
    .int('Debe ser un número entero')
    .min(0, 'No puede ser negativo'),
  totalVotosIncinerados: z.number()
    .int('Debe ser un número entero')
    .min(0, 'No puede ser negativo'),
  votosEnBlanco: z.number()
    .int('Debe ser un número entero')
    .min(0, 'No puede ser negativo'),
  votosNulos: z.number()
    .int('Debe ser un número entero')
    .min(0, 'No puede ser negativo'),
  tarjetasNoMarcadas: z.number()
    .int('Debe ser un número entero')
    .min(0, 'No puede ser negativo'),
  totalVotosValidos: z.number()
    .int('Debe ser un número entero')
    .min(0, 'No puede ser negativo'),
  totalVotosMesa: z.number()
    .int('Debe ser un número entero')
    .min(0, 'No puede ser negativo'),
  totalSufragantes: z.number()
    .int('Debe ser un número entero')
    .min(0, 'No puede ser negativo'),
  observaciones: z.string()
    .max(1000, 'Máximo 1000 caracteres')
    .optional(),
})

// Esquema para subida de fotos
export const fotoActaSchema = z.object({
  files: z.array(z.instanceof(File))
    .min(1, 'Debe subir al menos una foto')
    .max(10, 'Máximo 10 fotos por acta'),
})

export const fileSchema = z.instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: 'El archivo no debe exceder 5MB',
  })
  .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), {
    message: 'Solo se permiten imágenes JPG, PNG o WebP',
  })

// Esquema para login con email y contraseña
export const loginSchema = z.object({
  email: z.string()
    .email('Ingrese un correo electrónico válido')
    .min(1, 'El correo es obligatorio'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

// Esquema para cambiar contraseña (futura funcionalidad)
export const cambiarPasswordSchema = z.object({
  passwordActual: z.string()
    .min(6, 'La contraseña actual es requerida'),
  passwordNueva: z.string()
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
  confirmarPassword: z.string()
    .min(6, 'Confirme la nueva contraseña'),
}).refine((data) => data.passwordNueva === data.confirmarPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmarPassword'],
})

// Esquema para crear usuario con contraseña (admin)
export const crearUsuarioSchema = z.object({
  email: z.string()
    .email('Correo inválido')
    .min(1, 'El correo es obligatorio'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  fullName: z.string()
    .min(3, 'Nombre mínimo 3 caracteres')
    .max(200, 'Nombre máximo 200 caracteres'),
  role: z.enum(['maestro', 'revisor', 'coordinador_municipal', 'coordinador_puesto', 'testigo']),
})

// Esquema para crear/editar usuario (admin)
export const usuarioSchema = z.object({
  email: z.string()
    .email('Correo inválido')
    .min(1, 'El correo es obligatorio'),
  fullName: z.string()
    .min(3, 'Nombre mínimo 3 caracteres')
    .max(200, 'Nombre máximo 200 caracteres'),
  role: z.enum(['maestro', 'revisor', 'coordinador_municipal', 'coordinador_puesto', 'testigo']),
  municipioId: z.string().uuid().optional().nullable(),
  puestoId: z.string().uuid().optional().nullable(),
  activo: z.boolean().default(true),
})

// Esquema para asignar testigo a mesa
export const testigoMesaSchema = z.object({
  testigoId: z.string().uuid('Seleccione un testigo'),
  mesaId: z.string().uuid('Seleccione una mesa'),
})

// Esquema para crear puesto de votación
export const puestoVotacionSchema = z.object({
  municipioId: z.string().uuid('Seleccione un municipio'),
  nombre: z.string()
    .min(3, 'Nombre mínimo 3 caracteres')
    .max(200, 'Nombre máximo 200 caracteres'),
  direccion: z.string()
    .max(500, 'Dirección máximo 500 caracteres')
    .optional(),
  zona: z.enum(['urbana', 'rural']),
})

// Esquema para crear mesa
export const mesaSchema = z.object({
  puestoId: z.string().uuid('Seleccione un puesto'),
  numeroMesa: z.number()
    .int('Debe ser un número entero')
    .min(1, 'Número de mesa mínimo 1'),
  potencialElectoral: z.number()
    .int('Debe ser un número entero')
    .min(0, 'No puede ser negativo'),
})

// Tipos inferidos
export type VotoCandidatoInput = z.infer<typeof votoCandidatoSchema>
export type ActaE14Input = z.infer<typeof actaE14Schema>
export type FotoActaInput = z.infer<typeof fotoActaSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UsuarioInput = z.infer<typeof usuarioSchema>
export type TestigoMesaInput = z.infer<typeof testigoMesaSchema>
export type PuestoVotacionInput = z.infer<typeof puestoVotacionSchema>
export type MesaInput = z.infer<typeof mesaSchema>
export type CambiarPasswordInput = z.infer<typeof cambiarPasswordSchema>
export type CrearUsuarioInput = z.infer<typeof crearUsuarioSchema>
