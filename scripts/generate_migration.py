import pandas as pd
import uuid
import re
import sys

# Leer el archivo Excel
df = pd.read_excel('C:/Users/MauricioTriana/Desktop/proyectos-personales/e-14/Libro2.xlsx')

# Función para normalizar nombres de municipios
def normalize_municipio(m):
    if pd.isna(m):
        return ''
    m = str(m).replace('\n', ' ').replace('\r', ' ')
    m = re.sub(r'\s+', ' ', m).strip().upper()
    return m

# Normalizar nombres de municipios
df['MUNICIPIO_CLEAN'] = df['MUNICIPIO'].apply(normalize_municipio)

# Municipios existentes con sus IDs
municipios_existentes = {
    'YOPAL': '902d85d8-d24a-4a92-a45b-b257e1adb668',
    'AGUAZUL': '0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee',
    'LA SALINA': '749eea2e-f057-44ed-a7f6-ced947859bb5',
    'MANI': '6fa32375-6048-4912-80ba-ee17e0ba097c',
    'NUNCHIA': '3fa912ab-43d0-4a58-a789-f85e5c3d704c',
    'OROCUE': '6c3e3f04-0a0f-4c14-bb02-f3c635fa5a0d',
    'RECETOR': '10e85b40-1c5c-4bc0-930e-865df20f6360',
    'SABANALARGA': '209a61bc-5f6d-478c-a141-0dadaa736d62',
    'SAN LUIS DE PALENQUE': '22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090',
    'TAURAMENA': '8e869127-1f6a-41c8-b3f9-b4562bbdf891',
    'VILLANUEVA': '4cfb3134-a50d-4479-9d93-abc799e6124e',
}

# Códigos DANE para municipios
municipios_dane = {
    'YOPAL': '85001',
    'AGUAZUL': '85010',
    'LA SALINA': '85136',
    'MANI': '85139',
    'NUNCHIA': '85225',
    'OROCUE': '85230',
    'RECETOR': '85279',
    'SABANALARGA': '85300',
    'SAN LUIS DE PALENQUE': '85325',
    'TAURAMENA': '85410',
    'VILLANUEVA': '85440',
    'CHAMEZA': '85015',
    'HATO COROZAL': '85125',
    'MONTERREY': '85147',
    'PAZ DE ARIPORO (MORENO)': '85250',
    'PORE': '85263',
    'SACAMA': '85315',
    'TAMARA': '85400',
    'TRINIDAD': '85430',
}

# Generar IDs para municipios nuevos
municipios_nuevos = {}
municipios_en_excel = df['MUNICIPIO_CLEAN'].unique()

for m in municipios_en_excel:
    if m and m not in municipios_existentes and m not in municipios_nuevos:
        nuevo_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, m))
        municipios_nuevos[m] = nuevo_id

# Combinar todos los municipios
todos_municipios = {**municipios_existentes, **municipios_nuevos}

print('-- Migración: Insertar puestos de votación y mesas')
print('-- Fecha: 2026-03-04')
print(f'-- Total puestos: {len(df)}')
print(f'-- Total mesas: {int(df["MESAS"].sum())}')
print()

# Sección 1: Insertar municipios faltantes
print('-- ============================================')
print('-- PASO 1: Insertar municipios faltantes')
print('-- ============================================')
print()

if municipios_nuevos:
    print('INSERT INTO municipios (id, nombre, codigo_dane) VALUES')
    municipios_insert = []
    for m, id_val in municipios_nuevos.items():
        dane = municipios_dane.get(m, '00000')
        nombre_propio = m.title()
        municipios_insert.append(f"    ('{id_val}', '{nombre_propio}', '{dane}')")
    print(',\n'.join(municipios_insert) + ';')
    print()

# Sección 2: Insertar puestos de votación
print('-- ============================================')
print('-- PASO 2: Insertar puestos de votación')
print('-- ============================================')
print()

# Generar IDs para puestos (determinísticos)
df['puesto_uuid'] = df.apply(lambda row: str(uuid.uuid5(uuid.NAMESPACE_DNS,
    f"{row['MUNICIPIO_CLEAN']}-{row['PUESTO']}")), axis=1)

# Determinar zona basada en el nombre del puesto
def get_zona(puesto):
    p = str(puesto).upper()
    if 'VEREDA' in p or 'CORREGIMIENTO' in p or 'SEDE RURAL' in p:
        return 'rural'
    return 'urbana'

df['zona'] = df['PUESTO'].apply(get_zona)

# Agrupar por municipio para organizar el SQL
for municipio in sorted(todos_municipios.keys()):
    municipio_id = todos_municipios[municipio]
    df_m = df[df['MUNICIPIO_CLEAN'] == municipio]

    if len(df_m) == 0:
        continue

    print(f"-- {municipio.title()} ({len(df_m)} puestos)")
    print('INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES')

    puestos_insert = []
    for idx, row in df_m.iterrows():
        puesto_id = row['puesto_uuid']
        nombre = str(row['PUESTO']).replace("'", "''")
        direccion = str(row['DIRECCIÓN']).replace("'", "''") if pd.notna(row['DIRECCIÓN']) else ''
        zona = row['zona']

        puestos_insert.append(f"    ('{puesto_id}', '{municipio_id}', '{nombre}', '{direccion}', '{zona}')")

    print(',\n'.join(puestos_insert) + ';')
    print()

print()
print('-- ============================================')
print('-- PASO 3: Insertar mesas')
print('-- ============================================')
print()

# Generar INSERTs para mesas
mesa_counter = 0
for idx, row in df.iterrows():
    puesto_id = row['puesto_uuid']
    num_mesas = int(row['MESAS'])

    if num_mesas > 0:
        print(f"-- Mesas para: {row['PUESTO']}")
        print('INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES')

        mesas_values = []
        for m in range(1, num_mesas + 1):
            mesa_counter += 1
            mesas_values.append(f"    ('{puesto_id}', {m}, 0)")

        print(',\n'.join(mesas_values) + ';')
        print()

print(f'-- Total de mesas insertadas: {mesa_counter}')
