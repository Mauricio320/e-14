-- Migración: Insertar puestos de votación y mesas
-- Fecha: 2026-03-04
-- Total puestos: 171
-- Total mesas: 1077

-- ============================================
-- PASO 1: Insertar municipios faltantes
-- ============================================

INSERT INTO municipios (id, nombre, codigo_dane) VALUES
    ('153aee71-0497-5f7c-9425-ed4e70c3697c', 'Chameza', '85015'),
    ('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'Hato Corozal', '85125'),
    ('324c3b69-7ce7-5f9d-94aa-31cfd21681a8', 'Monterrey', '85147'),
    ('2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'Paz De Ariporo (Moreno)', '85250'),
    ('98087542-7bf4-5bf2-9824-2b7348278faa', 'Pore', '85263'),
    ('43ceae81-47cf-5454-93fe-48ed8ac1d69f', 'Sacama', '85315'),
    ('2a47b0e5-f49d-532f-8139-3fb82c8901a8', 'Tamara', '85400'),
    ('4c3232c3-807c-5e07-928c-c933dcbc98f1', 'Trinidad', '85430');

-- ============================================
-- PASO 2: Insertar puestos de votación
-- ============================================

-- Aguazul (13 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', '0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'INST. EDUC. CAMILO TORRES REST', 'CLL 15 CR. 18 ESQ.', 'urbana'),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', '0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'INST. EDUC. JORGE ELIECER GAIT', 'AV CIRCUNVALAR K1 VIA
VALLEVERDE', 'urbana'),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', '0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'INST. EDUC. ANTONIO NARIÑO', 'CR. 16 CLL.10 ESQ.', 'urbana'),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', '0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'INST. EDUC. SAN AGUSTIN(NUEVA', 'CLL. 14 NO.6 45', 'urbana'),
    ('b94beefa-0b13-54ca-a7c6-32344ca3a5e6', '0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'BELLAVISTA', 'ESC. BELLAVISTA', 'urbana'),
    ('de145dbe-9f16-5444-b332-c935391c6852', '0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'PLAN BRISAS', 'ESCUELA PLAN BRISAS', 'urbana'),
    ('befa7716-bd16-5189-a6a5-909b85967cdf', '0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'CUPIAGUA', 'POLIDEPORTIVO CUPIAGUA', 'urbana'),
    ('a324134f-f23a-5d90-9e54-c93b71feb4c0', '0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'GUADALCANAL', 'ESC. SAN BENITO', 'urbana'),
    ('7ab647df-1e79-5911-9009-c830f5410e8c', '0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'LA TURUA', 'SALON COMUNAL', 'urbana'),
    ('a09b6fe5-098a-59d6-ba1d-54f5205d68bc', '0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'MONTERRALO', 'RESTAURANTE ESCOLAR', 'urbana'),
    ('81fa7acc-4567-5a2b-bd55-d15621214062', '0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'SAN JOSE DEL BUBUY', 'ESC. SAN JOSE', 'urbana'),
    ('e4f85f92-3011-579a-8fe2-690293216555', '0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'SAN MIGUEL DE FARALLONES', 'ESC. SAN MIGUEL DE
FARALLONES', 'urbana'),
    ('442ee096-7a83-529e-a094-862f2a06afed', '0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'UNETE', 'ESC. UNETE', 'urbana');

-- Chameza (1 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('8fbd5a19-c9fc-5090-a982-78a288b92d10', '153aee71-0497-5f7c-9425-ed4e70c3697c', 'PUESTO CABECERA MUNICIPAL', 'CRA 4 No 7 - 17', 'urbana');

-- Hato Corozal (17 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', '57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'PUESTO CABECERA MUNICIPAL', 'CLL 10 # 9 - 83 COL LUIS
HERNANDEZ VARGAS', 'urbana'),
    ('a30c5581-b089-5796-bfe9-885e73dd7289', '57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'BERLIN', 'ESC NUESTRA SEÑORA DEL
CARMEN VDA BERLIN', 'urbana'),
    ('e23bce88-7dfc-5fe1-9d14-d1defc1ee0d6', '57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'CHIRE', 'IE SIMON BOLIVAR', 'urbana'),
    ('bbee4968-256e-5e31-8656-f91deb91af83', '57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'CORRALITO', 'ESC JOSE MARIA CORDOVA VDA CORRALITO', 'urbana'),
    ('53b5b66f-dd56-5c2b-a9c0-5f0513e32daf', '57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'EL GUAFAL', 'ESC RUR VDA EL GUAFAL', 'urbana'),
    ('0d6e6ebd-38b9-53ec-b7df-34030e6c010e', '57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'LA FRONTERA (LA CHAPA)', 'IE BONIFACIO GUTIERREZ', 'urbana'),
    ('a1b8a3d9-0594-5c55-8378-6c2f12f20efb', '57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'LAS CAMELIAS', 'ESC LUZ DE ORIENTE VDA
LAS CAMELIAS', 'urbana'),
    ('9a3d4bff-bf0e-54b9-8710-ce36784ec0ef', '57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'LAS TAPIAS', 'ESC DIVINO NIÑO VDA LAS
TAPIAS', 'urbana'),
    ('0b114572-fb73-5374-a82a-7e53283c040e', '57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'MANARE', 'ESC POLICARPA SALAVARRIETA VDA MANARE', 'urbana'),
    ('a9d1be18-ab0c-51af-a4b2-fe18b1eb5ebf', '57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'PASO REAL DE ARIPORO', 'ESC RUR VDA LA RESERVA', 'urbana'),
    ('e889c328-652d-58b0-8bec-aa571053c38a', '57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'PUERTO COLOMBIA', 'IE PUERTO COLOMBIA', 'urbana'),
    ('d4c17087-1e60-5e35-a369-45e23b264d49', '57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'RESGUARDO CAÑO MOCHUELO', 'IE INDIG LISA MANENI', 'urbana'),
    ('d619294f-8736-5eb5-8d7a-ff1a019b931a', '57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'SAN JOSE DE ARIPORO', 'IE HORACIO PERDOMO', 'urbana'),
    ('2884731d-55e6-5ae8-813b-6654629b4057', '57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'SAN NICOLAS', 'ESC RUR VDA SAN NICOLAS', 'urbana'),
    ('30999c0f-c328-5387-96ec-3e42db793920', '57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'SAN SALVADOR', 'ESC RUR VDA ALTAMIRA', 'urbana'),
    ('a3ca8210-2af6-54b5-bdfa-6a47558cb7b6', '57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'SANTA BARBARA', 'I E CARLOS LLERAS
RESTREPO', 'urbana'),
    ('1125e221-8ea3-5006-be95-fde7299d3b1b', '57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'SANTA RITA', 'ESC DIVINO NIÑO VDA SANTA
RITA', 'urbana');

-- La Salina (1 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('9661c9a3-4b28-5c5b-89c5-25779bdf96b7', '749eea2e-f057-44ed-a7f6-ced947859bb5', 'PUESTO CABECERA MUNICIPAL', 'CRA 3A No 1B - 12', 'urbana');

-- Mani (11 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('295a6d2e-7094-5dde-a523-276185a5a489', '6fa32375-6048-4912-80ba-ee17e0ba097c', 'JESUS BERNAL PINZON', 'CLL 17 No 5-133', 'urbana'),
    ('614db249-7c6d-5235-b5c3-77b4ac4c21b6', '6fa32375-6048-4912-80ba-ee17e0ba097c', 'LUIS ENRIQUE BARON LEAL', 'CRA 4 No 22-156', 'urbana'),
    ('2c2a2681-75f7-59ad-8cbd-b8c0713e7bab', '6fa32375-6048-4912-80ba-ee17e0ba097c', 'CHAVINABE', 'SALON COMUNAL', 'urbana'),
    ('31272ce7-84f3-5ae9-b3d3-df53aa718e12', '6fa32375-6048-4912-80ba-ee17e0ba097c', 'SANTA MARIA DE PALMARITO', 'CASETA COMUNAL ESC. VDA SANTA MARIA DE PALMARITO', 'urbana'),
    ('27fe7ff5-980b-5e44-985a-c4b6edf7966e', '6fa32375-6048-4912-80ba-ee17e0ba097c', 'GUAFALPINTADO', 'CASETA COMUNAL', 'urbana'),
    ('5f08fc16-4885-5698-903d-6dd8a3696d55', '6fa32375-6048-4912-80ba-ee17e0ba097c', 'LA POYATA', 'ESC. RURAL LA POYATA', 'urbana'),
    ('c743deb3-2e4b-5cdf-946d-7769cb1b4be9', '6fa32375-6048-4912-80ba-ee17e0ba097c', 'LA ARMENIA', 'VDA LA ARMENIA', 'urbana'),
    ('05c425fd-450e-581c-9d56-19d774fbcda7', '6fa32375-6048-4912-80ba-ee17e0ba097c', 'LAS GAVIOTAS', 'ESC. RURAL VDA LAS
GAVIOTAS', 'urbana'),
    ('34f43e89-e70d-5ae6-b6fc-cd5d4fa776b8', '6fa32375-6048-4912-80ba-ee17e0ba097c', 'PASO REAL DE GUARIAMENA', 'SALON COMUNAL', 'urbana'),
    ('07cbb3d7-d6bf-596d-8f18-48407cdc2893', '6fa32375-6048-4912-80ba-ee17e0ba097c', 'SAN JOAQUIN DE GARIBAY', 'SALON COMUNAL', 'urbana'),
    ('aff838ad-6de2-577f-a7ec-148fe35e8852', '6fa32375-6048-4912-80ba-ee17e0ba097c', 'STA ELENA DE CUSIVA', 'SALON COMUNAL', 'urbana');

-- Monterrey (6 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('f0075782-a276-5d8a-a232-45e675958467', '324c3b69-7ce7-5f9d-94aa-31cfd21681a8', 'PUESTO CABECERA MUNICIPAL', 'KRA.11-CL.16,COL.LA SABIDURIA ALFONSO LOPEZ', 'urbana'),
    ('e3393055-37a4-5274-8ad9-e7cdf52e7e98', '324c3b69-7ce7-5f9d-94aa-31cfd21681a8', 'BRISAS DEL LLANO', 'RESTAURANTE ESCOLAR', 'urbana'),
    ('c017c241-7055-5eca-9e2b-c12412e6c46a', '324c3b69-7ce7-5f9d-94aa-31cfd21681a8', 'EL PORVENIR', 'ESC. RURAL EL PROVENIR', 'urbana'),
    ('622c13e5-6706-525e-ad9b-8b8d168365de', '324c3b69-7ce7-5f9d-94aa-31cfd21681a8', 'LA ORQUETA', 'SALON COMUNAL', 'urbana'),
    ('27de95c6-6b37-5e20-a3fa-5737443d3c49', '324c3b69-7ce7-5f9d-94aa-31cfd21681a8', 'PALO NEGRO', 'ESC. RURAL PALO NEGRO', 'urbana'),
    ('553674e4-7ce3-5e16-92a8-136155aa5b3f', '324c3b69-7ce7-5f9d-94aa-31cfd21681a8', 'VILLA CAROLA', 'ESC. RURAL VILLA CAROLA', 'urbana');

-- Nunchia (14 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('b490c5f4-8bb7-50df-848f-e9de4a633272', '3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'PUESTO CABECERA MUNICIPAL', 'CR 4 ENTRE CL 6 Y 7 IE
SALVADOR CAMACHO R. SEC BTO', 'urbana'),
    ('a86e8090-b34e-56c8-a042-6aad479926f0', '3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'BARBACOAS', 'IE SALVADOR CAMACHO
ROLDAN SD RURAL DIVINO NIÑO', 'urbana'),
    ('196fe161-4935-50f6-98f7-83b5681bdb36', '3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'BARRANQUILLA', 'IE ANTONIO NARIÑO SD
RURAL BARRANQUILLA', 'urbana'),
    ('b6bcf42c-9171-51ca-b2ca-2bc287f85331', '3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'COREA', 'IE EL PRETEXTO SD RURAL
COREA', 'urbana'),
    ('7315a99f-31a4-5e8b-af26-1acfc056969e', '3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'EL CAUCHO', 'I.E. EL PRETEXTO SEDE
RURAL EL CAUCHO', 'urbana'),
    ('1b1f4f23-c6bb-5f60-82bd-752713987b62', '3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'EL CONCHAL', 'IE ANTONIO NARIÑO SD
RURAL EL CONCHAL', 'urbana'),
    ('a491fd33-729d-5e64-a465-6e710b8c2e3b', '3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'EL CAZADERO', 'I.E. EL PRETEXTO SEDE
RURAL EL CAZADERO', 'urbana'),
    ('95931a7c-86ca-5734-ac99-f73203a5d672', '3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'EL PRETEXTO', 'IE EL PRETEXTO SD CENTRAL', 'urbana'),
    ('d3466846-1ad1-5b56-93c3-89a4f6961268', '3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'GUANAPALO', 'IE FRANCISCO LUCEA SD
RURAL PALMAR DE GUANAPALO', 'urbana'),
    ('b9a5b135-a1f1-5efc-b750-a6abc7608966', '3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'PALMIRA', 'IE ANTONIO NARIÑO SD
RURAL SAN JOSE', 'urbana'),
    ('d5b9eb21-43a1-5c07-94b1-40b52688a1e0', '3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'PEDREGAL', 'IE SALVADOR CAMACHO
ROLDAN SD RURAL PEDREGAL', 'urbana'),
    ('51bbf669-1191-5623-aae8-312b10d5f9cf', '3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'PUERTO TOCARIA', 'IE ANTONIO NARIÑO SD
CENTRAL', 'urbana'),
    ('449c247f-3a3c-5a6c-90ed-b777fdbbe4ff', '3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'SIRIVANA', 'IE EL PRETEXTO SD RURAL
SAN NICOLAS', 'urbana'),
    ('c0370a68-97db-5627-b0cc-08c39e5a9240', '3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'VIZERTA', 'IE ANTONIO NARIÑO SD
RURAL MACUCO', 'urbana');

-- Orocue (7 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('47814f5c-f846-5def-8621-cc370b330b17', '6c3e3f04-0a0f-4c14-bb02-f3c635fa5a0d', 'CABECERA MUNICIPAL', 'I.E. LUIS CARLOS GALAN CLL
5 NO 10 D 27', 'urbana'),
    ('2245f336-5544-54fa-81ff-4a7d1c895527', '6c3e3f04-0a0f-4c14-bb02-f3c635fa5a0d', 'BANCO LARGO', 'ESC CUMACO', 'urbana'),
    ('a2555d65-7d3c-5287-bb7f-7a3d8ba0a968', '6c3e3f04-0a0f-4c14-bb02-f3c635fa5a0d', 'BOCAS DEL CRAVO', 'ESC PALMARITO', 'urbana'),
    ('9174e37a-0375-5eed-84d0-2e829d141e82', '6c3e3f04-0a0f-4c14-bb02-f3c635fa5a0d', 'CHURRUBAY', 'ESC. EL SUSPIRO', 'urbana'),
    ('f60f14ff-d70f-54a9-bb85-e1aeaf921240', '6c3e3f04-0a0f-4c14-bb02-f3c635fa5a0d', 'EL ALGARROBO (CRAVOSUR)', 'IE ALGARROBO', 'urbana'),
    ('fb8348f4-5905-505b-95e4-3a67ad01a548', '6c3e3f04-0a0f-4c14-bb02-f3c635fa5a0d', 'EL DUYA', 'ESC MIRALINDO', 'urbana'),
    ('ef1b0da4-1c2a-562a-bf75-893c7e376e5b', '6c3e3f04-0a0f-4c14-bb02-f3c635fa5a0d', 'TUJUA', 'ESC LA LIBERTAD TUJUA', 'urbana');

-- Paz De Ariporo (Moreno) (11 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', '2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'IE JUAN JOSE RONDON', 'CALLE 7 No 5-51', 'urbana'),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', '2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'IE SAGRADO CORAZON', 'CRA 10 ESTE No 7-69 BARRIO GRANJA MERECURE', 'urbana'),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', '2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'INST TEC IND EL PALMAR ITEIPA', 'CLL 13 No 12-20', 'urbana'),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', '2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'IE FRANCISCO JOSE DE CALDAS', 'CALLE 5 No 13-40', 'urbana'),
    ('e37e343f-5dfa-58d3-8e61-f9ef0a57aad1', '2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'CARCEL', 'CLL 10 # 6-69', 'urbana'),
    ('d6399dd8-20c2-5651-bcfb-34eb8f1dcdaa', '2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'BOCAS DE LA HERMOSA', 'SEDE IE PABLO SEXTO', 'urbana'),
    ('f9029b13-87bb-51b3-8638-5ec4f4e49dbc', '2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'CAÑO CHIQUITO', 'SEDE IE CAÑO CHIQUITO', 'urbana'),
    ('ac5dbff8-8ffa-53a7-b011-961ff6de47e6', '2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'LAS GUAMAS', 'I.E. SAN JUAN DE LOS
LLANOS', 'urbana'),
    ('ce871898-9e82-5c50-852c-a6c0e942a6e5', '2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'LA BARRANCA', 'INST TEC EMP ITENCA', 'urbana'),
    ('e2a92046-810c-5bb2-80ef-d3221b6f50d8', '2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'MONTAÑAS DEL TOTUMO', 'IE SIMÓN BOLIVAR', 'urbana'),
    ('d53f4fe4-ef06-5696-a9aa-ce491a30f3c3', '2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'RESGUARDO CAÑO MOCHUELO COM. SAN
JOSE', 'INSTITUCION EDUCATIVA
YAMOTSINEMU', 'urbana');

-- Pore (3 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', '98087542-7bf4-5bf2-9824-2b7348278faa', 'PUESTO CABECERA MUNICIPAL', 'I.E. RAFAEL URIBE URIBE CLL
4 # 17 - 40', 'urbana'),
    ('a079de9b-e4fb-5657-971b-d011a489db57', '98087542-7bf4-5bf2-9824-2b7348278faa', 'EL BANCO', 'VEREDA EL BANCO', 'urbana'),
    ('5ebd8dec-034c-5b86-84d4-3301dfef10f9', '98087542-7bf4-5bf2-9824-2b7348278faa', 'LA PLATA', 'VEREDA LA PLATA', 'urbana');

-- Recetor (3 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('45084759-3275-5cfb-9f88-564cf24fb0c9', '10e85b40-1c5c-4bc0-930e-865df20f6360', 'PUESTO CABECERA MUNICIPAL', 'I E FERNANDO RODRIGUEZ KM 0 MAS 200 VIA CHAMEZA', 'urbana'),
    ('1e8291d2-6d66-55a4-8a8b-e6a828fead7a', '10e85b40-1c5c-4bc0-930e-865df20f6360', 'LOS ALPES', 'IE SEDE LOS ALPES', 'urbana'),
    ('17bea667-9d45-5c6f-99c7-ec0be1887c2f', '10e85b40-1c5c-4bc0-930e-865df20f6360', 'PUEBLO NUEVO', 'IE SEDE PUEBLO NUEVO', 'urbana');

-- Sabanalarga (3 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('99e16cf2-012a-59bc-8621-c2ce12a889c8', '209a61bc-5f6d-478c-a141-0dadaa736d62', 'PUESTO CABECERA MUNICIPAL', 'CR 5#5-20 I.E. JORGE
ELIECER GAITAN', 'urbana'),
    ('c2999665-f763-5ba9-b44e-613fb4fcb852', '209a61bc-5f6d-478c-a141-0dadaa736d62', 'AGUACLARA', 'I.E MANUEL ELKIN
PATARROYO', 'urbana'),
    ('0bba9e7a-d812-51dd-8bf6-09700e624e21', '209a61bc-5f6d-478c-a141-0dadaa736d62', 'EL SECRETO', 'I E JORGE ELIECER GAITAN
SEDE EL SECRETO', 'urbana');

-- Sacama (2 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('bed24448-afda-5f2d-aff6-c25524fea8f7', '43ceae81-47cf-5454-93fe-48ed8ac1d69f', 'PUESTO CABECERA MUNICIPAL', 'CLL 3 No 13 - 43', 'urbana'),
    ('bd9ad7b8-a4e6-582b-b91f-5ae144293879', '43ceae81-47cf-5454-93fe-48ed8ac1d69f', 'CHAPARRAL Y BARRO NEGRO', 'VEREDA CAMPO HERMOSO', 'urbana');

-- San Luis De Palenque (9 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('0fcc65b7-3be4-5712-b3f9-ed9b04c1cf65', '22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'PUESTO CABECERA MUNICIPAL', 'I E FRANCISCO LUCEA CRA 7
No 3 - 17', 'urbana'),
    ('5ec6740a-f2b6-5292-991c-f33c086547bf', '22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'MIRAMAR DE GUANAPALO (BOCAS D', 'I E COL FRANCISCO LUCEA', 'urbana'),
    ('ae922184-500e-5cac-ad17-d7348c0952a0', '22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'GAVIOTAS QUITEVE', 'I E FRANCISCO LUCEA SEDE
GAVIOTAS', 'urbana'),
    ('f4a586db-bfcc-5e5c-b84f-7914c685103d', '22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'JAGUEYES', 'I E FRANCISCO LUCEA SEDE
JAGUEYES', 'urbana'),
    ('29615a80-85f7-576d-94b5-b5fdf9e43674', '22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'LA VENTUROSA', 'I E COL FRANCISCO LUCEA SEDE LA VENTUROSA', 'urbana'),
    ('ba4f7a7a-0e64-5ac5-840b-7e1300688b0b', '22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'RIVERITA', 'I E FRANCISCO LUCEA SEDE
RIVERITA', 'urbana'),
    ('0622c1f1-1815-5a49-a5c6-1ead1bdd422a', '22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'SAN FRANCISCO', 'I E FRANCISCO LUCEA SEDE
SAN FRANCISO', 'urbana'),
    ('4b7d3acc-8c5c-5668-9d02-84b1a0da3059', '22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'SAN RAFAEL DE GUANAPALO', 'I E COL FRANCISCO LUCEA
SEDE GUANAPALO', 'urbana'),
    ('b27d48ae-7d4b-527a-af20-19d68a4092c1', '22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'SIRIVANA ALGODONALE', 'I E FRANCISCO LUCEA SEDE SIRIVANA ALGODONALES', 'urbana');

-- Tamara (8 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('eb7d846c-fbe6-5060-aa36-f9a1c60ea93b', '2a47b0e5-f49d-532f-8139-3fb82c8901a8', 'PUESTO CABECERA MUNICIPAL', 'CLL 5 No 5-15', 'urbana'),
    ('11075752-490b-5f08-b2b4-8e8d59ee1181', '2a47b0e5-f49d-532f-8139-3fb82c8901a8', 'EL ARIPORO', 'ESC. RURAL EL ARIPORO', 'urbana'),
    ('ba49d2fc-f324-5a2b-b981-e5e44108e246', '2a47b0e5-f49d-532f-8139-3fb82c8901a8', 'TABLON DE TAMARA', 'COL. TABLON DE TAMARA', 'urbana'),
    ('c4e74539-adeb-575a-a2bd-a41538b60c23', '2a47b0e5-f49d-532f-8139-3fb82c8901a8', 'TABLONCITO', 'ESC. RURAL TABLONCITO', 'urbana'),
    ('cf0f474c-0ed7-5713-be31-96ac133f3ef8', '2a47b0e5-f49d-532f-8139-3fb82c8901a8', 'TEN (TEISLANDIA)', 'ESC. RURAL TEN
(TEISLANDIA)', 'urbana'),
    ('f3bd8cb7-45ed-5c87-9268-6d6e9920e877', '2a47b0e5-f49d-532f-8139-3fb82c8901a8', 'ECCE HOMO', 'IE ARTURO SALAZAR MEJÍA
SD LA ESPER.VDA ECCE HOMO', 'urbana'),
    ('87df2a22-97a6-5070-8353-ffa2c4204897', '2a47b0e5-f49d-532f-8139-3fb82c8901a8', 'GUARAQUE', 'ESCUELA GUARAQUE', 'urbana'),
    ('aaf6ed94-31df-5ccd-8cf7-fca6d53368e9', '2a47b0e5-f49d-532f-8139-3fb82c8901a8', 'SANTO DOMINGO', 'ESCUELA VEREDA SANTO
DOMINGO', 'urbana');

-- Tauramena (7 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', '8e869127-1f6a-41c8-b3f9-b4562bbdf891', 'INSTITUCION EDUCATIVA JOSE MARIA
CORDOBA', 'CLL 8 # 10-78.COL.JOSE
MARIA CORDOBA', 'urbana'),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', '8e869127-1f6a-41c8-b3f9-b4562bbdf891', 'IE TECNICA EMPRESARIAL DEL LLANO', 'DIAGONAL 8 No 12-96', 'urbana'),
    ('c0f08892-08e4-5117-8298-13bd20facf17', '8e869127-1f6a-41c8-b3f9-b4562bbdf891', 'CARUPANA', 'ESC. RURAL CARUPANA', 'urbana'),
    ('ccf2df36-74a5-539d-8f04-8cbe9e7a27e6', '8e869127-1f6a-41c8-b3f9-b4562bbdf891', 'COROCITO', 'ESC. RURAL COROCITO', 'urbana'),
    ('519e4015-7f9b-528a-bea0-a891449679ed', '8e869127-1f6a-41c8-b3f9-b4562bbdf891', 'PASO CUSIANA', 'IE.EL CUSIANA', 'urbana'),
    ('f1ca89d0-b660-5f98-b69c-d0bd287d8b2a', '8e869127-1f6a-41c8-b3f9-b4562bbdf891', 'EL RAIZAL', 'IE.EL RAIZAL', 'urbana'),
    ('7882748c-2a92-5938-b8b7-37c574bd97d1', '8e869127-1f6a-41c8-b3f9-b4562bbdf891', 'ESC. RURAL LA URAMA', 'ESC.RUR.LA URAMA', 'urbana');

-- Trinidad (12 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('cfd891b1-12f6-537b-8570-40fd0e4099cc', '4c3232c3-807c-5e07-928c-c933dcbc98f1', 'INS.TEC.INTREGRADO B', 'CLL 7 No 4-49', 'urbana'),
    ('c29db998-e7d7-5406-be61-02dbf5d26511', '4c3232c3-807c-5e07-928c-c933dcbc98f1', 'INS. TEC. INTEGRADO A', 'CRA 4 No 1-71', 'urbana'),
    ('de9dc758-7047-56e2-8bd9-d32cafe39aab', '4c3232c3-807c-5e07-928c-c933dcbc98f1', 'BELGICA', 'ESC. RURAL BELGICA', 'urbana'),
    ('6db7aed1-6842-5c62-b618-91b3ab861844', '4c3232c3-807c-5e07-928c-c933dcbc98f1', 'BOCAS DEL PAUTO', 'INS.E.RURAL RAFAEL GARCIA
HERREROS', 'urbana'),
    ('215865d4-ba79-56d3-9fb2-7aab4d7d56de', '4c3232c3-807c-5e07-928c-c933dcbc98f1', 'CAIMAN', 'INS.E. RURAL EL POZO
PETROLERO', 'urbana'),
    ('25150910-154d-57e6-9adf-e3f93659c748', '4c3232c3-807c-5e07-928c-c933dcbc98f1', 'SANTA MARTA', 'ESCUELA RURAL SANTA
MARTA', 'urbana'),
    ('583be31c-dcd5-549e-a708-668e001f7595', '4c3232c3-807c-5e07-928c-c933dcbc98f1', 'GUAMAL', 'SALON COMUNAL VEREDA
GUAMAL', 'urbana'),
    ('77fefddf-9b5e-5d7d-9688-8745145f7c2b', '4c3232c3-807c-5e07-928c-c933dcbc98f1', 'PASO REAL DE LA SOLEDAD', 'ESC. RURAL PASO REAL DE
LA SOLEDAD', 'urbana'),
    ('15e61d70-099a-5e1c-94d1-3004100e3b06', '4c3232c3-807c-5e07-928c-c933dcbc98f1', 'EL CONVENTO', 'INST. EDU. RURAL
CAMPESTRE BRISAS DEL PAUTO', 'urbana'),
    ('3ea25e03-0f92-5025-a297-e2da0ae523b3', '4c3232c3-807c-5e07-928c-c933dcbc98f1', 'LOS CHOCHOS', 'ESC. RURAL LOS CHOCHOS', 'urbana'),
    ('af452bf1-9ce7-5585-9e65-ac0f1007d3fb', '4c3232c3-807c-5e07-928c-c933dcbc98f1', 'SANTA IRENE', 'INS. E. SANTA IRENE', 'urbana'),
    ('ca52716a-c08e-5ba3-bf88-6238b3ed309f', '4c3232c3-807c-5e07-928c-c933dcbc98f1', 'SAN VICENTE', 'ESC. RURAL LA MORITA', 'urbana');

-- Villanueva (7 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', '4cfb3134-a50d-4479-9d93-abc799e6124e', 'I.E. FABIO RIVEROS', 'CL 11 No. 14 -115 CENTRO', 'urbana'),
    ('91f461c5-0fff-500f-b876-f66e0928c52e', '4cfb3134-a50d-4479-9d93-abc799e6124e', 'I.E. EZEQUIEL MORENO Y DIAZ SD MORICHAL', 'CRA. 14 No. 20 - 21
MORICHAL', 'urbana'),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', '4cfb3134-a50d-4479-9d93-abc799e6124e', 'IE NUESTRA SEÑORA DE LOS DOLORES DE
MANA', 'CRA. 3 No. 3 -118 PARAISO
ALTO', 'urbana'),
    ('10e48038-015f-50a6-9814-0c69875bfba3', '4cfb3134-a50d-4479-9d93-abc799e6124e', 'IE EZEQUIEL MORENO Y DIAZ SD BELLO
HORIZ', 'CRA. 7 No. 14 - 54 BELLO
HORIZONTE', 'urbana'),
    ('a79b7147-dfe3-5d71-a1fd-78a1dc6377f0', '4cfb3134-a50d-4479-9d93-abc799e6124e', 'CARIBAYONA', 'CONC. ESCOLAR', 'urbana'),
    ('248377d7-18b6-5ec8-b857-3decb19d4700', '4cfb3134-a50d-4479-9d93-abc799e6124e', 'SAN AGUSTIN', 'COL .SAN AGUSTIN', 'urbana'),
    ('799cee8b-8eb2-5414-8d7d-00411c412dc5', '4cfb3134-a50d-4479-9d93-abc799e6124e', 'SANTA HELENA DE UPIA', 'SALON COMUNAL CENT.', 'urbana');

-- Yopal (36 puestos)
INSERT INTO puestos_votacion (id, municipio_id, nombre, direccion, zona) VALUES
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'I.E. LUIS HERNANDEZ VARGAS', 'TRV. 18 # 10-126', 'urbana'),
    ('953d77ec-7201-5bbc-947e-056efef3b488', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'C.E. MARCO FIDEL SUAREZ', 'CALLE 13 TRASVERSAL 18 -
65', 'urbana'),
    ('16e401a5-0221-50e2-aaac-26287c502686', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE CENTRO SOCIAL', 'CARRERA 23 No. 11 - 45', 'urbana'),
    ('9dbde013-4389-56e9-a69e-78dd816f5829', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'COLEGIO DE LA PRESENTACION YOPAL', 'CLL 10 No 23- 62', 'urbana'),
    ('7aa2f336-2b37-5a07-9582-7230e00d653f', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE SALVADOR CAMACHO ROLDAN', 'CRA 20 No 5-160 BARRIO
SAN MARTIN', 'urbana'),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE CARLOS LLERAS RESTREPO', 'CRA 31 No 26B-18', 'urbana'),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE BRAULIO GONZALEZ SD SIMON BOLIVAR', 'CLL 21 No 25-40', 'urbana'),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE BRAULIO GONZALEZ SD CENTRO', 'CLL 13 No 23-60', 'urbana'),
    ('8fef557b-67ac-5235-bd97-a3dd953aa61e', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE GABRIEL GARCIA MARQUEZ', 'CLL 35 CRA 30 ESQUINA', 'urbana'),
    ('8b7ad42c-aba0-50e6-87a8-edacb1a367fa', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'I.E MANUELA BELTRAN SEDE GAVAN', 'CLL19 No 21A - 76', 'urbana'),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'I TEC EMPRESARIAL YOPAL ITEY', 'CRA 21 No 39-05', 'urbana'),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE MANUELA BELTRAN', 'CLL 25 No 19-29', 'urbana'),
    ('c0c1bb5a-2646-503e-861a-03eb5082d5e8', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'LA CAMPIÑA', 'CRA 9 No 23-77', 'urbana'),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE EL PARAISO', 'CRA 7 No 30-01', 'urbana'),
    ('ede7251f-e22e-5973-b441-d530b0549564', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE JORGE ELIECER GAITAN', 'CLL19 No 15-39', 'urbana'),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'I TEC AMBIENTAL SAN MATEO', 'CC 37 No 12-86', 'urbana'),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'MEGACOLEGIO EL PROGRESO COMUNA CINCO', 'CLL 44 No 8-40', 'urbana'),
    ('ce3f0a8f-bafc-5ce5-a8bd-55c65d8f110a', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE EMP LLANO LINDO SD A', 'CLL 60 No 5A OESTE', 'urbana'),
    ('895f7049-8f2f-58bd-8c1a-c4bd09c4b20d', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE EMP LLANO LINDO SD B', 'CRA 4 OESTE No 64B -03', 'urbana'),
    ('10ca1d5c-0f2c-5710-878a-3880f0c685e2', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE TERESA DE CALCUTA', 'CRA 31 No 49 - 03', 'urbana'),
    ('4728411f-f6ec-55ab-b167-a7507703a783', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'I E BRAULIO GONZALEZ SD CAMPESTRE', 'KM 2 VIA PEDREGAL', 'urbana'),
    ('eaff9eaa-37cf-5bfc-bda5-d8f9ab8b252a', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'CARCEL MUNICIPAL', 'KM 12 VIA YOPAL AGUAZUL', 'urbana'),
    ('3fde068b-b020-5943-8678-00fe158f3da6', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'ALCARAVAN LA NIATA', 'ESC. LA NIATA', 'urbana'),
    ('e9fa65e7-4d91-5393-98d5-37570de21cae', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'PUNTO NUEVO', 'COLEGIO SANTA TERESA', 'urbana'),
    ('23fc76e0-7f0f-54e1-9b88-93d8e5d8ecee', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'PALO BAJITO', 'IE.TEC AGROP DIVINO
SALVADOR SD CENTRAL', 'urbana'),
    ('c721a8d3-db80-5dbe-b2a9-81e2d5a864f9', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'MATA DE LIMON', 'CASETA COMUNAL MATA DE
LIMON', 'urbana'),
    ('14934155-b3cf-54db-8345-8c375683c23a', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'CHARTE', 'COLEGIO GABRIELA MISTRAL', 'urbana'),
    ('e91845d2-9acb-5b19-9361-c34768995f43', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'GUAFILLA', 'I.E: CAMILO TORRES
RESTREPO SEDE GUAFILLA', 'urbana'),
    ('444ac5df-4dd4-5cb7-96bf-4f2c3e905032', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'EL MORRO', 'COLEGIO ANTONIO NARIÑO', 'urbana'),
    ('210f8e53-8822-5448-8391-d34fd03a0939', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'EL TALADRO', 'IE TEC AGROP EL TALADRO', 'urbana'),
    ('32b2c169-357f-5138-98ad-7f6360d8e047', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'LA CHAPARRERA', 'IE. LUIS CARLOS GALAN
SARMIENTO', 'urbana'),
    ('af2139fa-f672-546b-bcdf-ef2df8832618', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'MORICHAL', 'COLEGIO POLICARPA
SALAVARRIERTA', 'urbana'),
    ('a3c5fbfc-99bb-5158-a1ed-3ab5d37a3312', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'SAN RAFAEL', 'INST. EDU. POLICARPA
SALAVARRIETA SEDE SAN RAFAEL', 'urbana'),
    ('02d2dff1-844f-5430-93d0-20069890ab2c', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'TACARIMENA', 'IE. EL TRIUNFO', 'urbana'),
    ('333423c6-dfd2-5c73-afa6-6b1c0b552ee7', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'TILODIRAN', 'ESCUELA LA INMACULADA', 'urbana'),
    ('76c2888c-86dc-5183-8aa0-22648d50e4f6', '902d85d8-d24a-4a92-a45b-b257e1adb668', 'QUEBRADASECA', 'COLEGIO MARIA
AUXILIADORA', 'urbana');


-- ============================================
-- PASO 3: Insertar mesas
-- ============================================

-- Mesas para: I.E. LUIS HERNANDEZ VARGAS
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 1, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 2, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 3, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 4, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 5, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 6, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 7, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 8, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 9, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 10, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 11, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 12, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 13, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 14, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 15, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 16, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 17, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 18, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 19, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 20, 0),
    ('3adac0c8-d8f6-5b0b-81bc-a93f3d9b0b24', 21, 0);

-- Mesas para: C.E. MARCO FIDEL SUAREZ
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('953d77ec-7201-5bbc-947e-056efef3b488', 1, 0),
    ('953d77ec-7201-5bbc-947e-056efef3b488', 2, 0),
    ('953d77ec-7201-5bbc-947e-056efef3b488', 3, 0),
    ('953d77ec-7201-5bbc-947e-056efef3b488', 4, 0),
    ('953d77ec-7201-5bbc-947e-056efef3b488', 5, 0),
    ('953d77ec-7201-5bbc-947e-056efef3b488', 6, 0),
    ('953d77ec-7201-5bbc-947e-056efef3b488', 7, 0),
    ('953d77ec-7201-5bbc-947e-056efef3b488', 8, 0),
    ('953d77ec-7201-5bbc-947e-056efef3b488', 9, 0),
    ('953d77ec-7201-5bbc-947e-056efef3b488', 10, 0),
    ('953d77ec-7201-5bbc-947e-056efef3b488', 11, 0),
    ('953d77ec-7201-5bbc-947e-056efef3b488', 12, 0),
    ('953d77ec-7201-5bbc-947e-056efef3b488', 13, 0);

-- Mesas para: IE CENTRO SOCIAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('16e401a5-0221-50e2-aaac-26287c502686', 1, 0),
    ('16e401a5-0221-50e2-aaac-26287c502686', 2, 0),
    ('16e401a5-0221-50e2-aaac-26287c502686', 3, 0),
    ('16e401a5-0221-50e2-aaac-26287c502686', 4, 0),
    ('16e401a5-0221-50e2-aaac-26287c502686', 5, 0),
    ('16e401a5-0221-50e2-aaac-26287c502686', 6, 0),
    ('16e401a5-0221-50e2-aaac-26287c502686', 7, 0),
    ('16e401a5-0221-50e2-aaac-26287c502686', 8, 0),
    ('16e401a5-0221-50e2-aaac-26287c502686', 9, 0),
    ('16e401a5-0221-50e2-aaac-26287c502686', 10, 0),
    ('16e401a5-0221-50e2-aaac-26287c502686', 11, 0),
    ('16e401a5-0221-50e2-aaac-26287c502686', 12, 0),
    ('16e401a5-0221-50e2-aaac-26287c502686', 13, 0),
    ('16e401a5-0221-50e2-aaac-26287c502686', 14, 0);

-- Mesas para: COLEGIO DE LA PRESENTACION YOPAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('9dbde013-4389-56e9-a69e-78dd816f5829', 1, 0),
    ('9dbde013-4389-56e9-a69e-78dd816f5829', 2, 0),
    ('9dbde013-4389-56e9-a69e-78dd816f5829', 3, 0),
    ('9dbde013-4389-56e9-a69e-78dd816f5829', 4, 0),
    ('9dbde013-4389-56e9-a69e-78dd816f5829', 5, 0),
    ('9dbde013-4389-56e9-a69e-78dd816f5829', 6, 0),
    ('9dbde013-4389-56e9-a69e-78dd816f5829', 7, 0),
    ('9dbde013-4389-56e9-a69e-78dd816f5829', 8, 0),
    ('9dbde013-4389-56e9-a69e-78dd816f5829', 9, 0),
    ('9dbde013-4389-56e9-a69e-78dd816f5829', 10, 0),
    ('9dbde013-4389-56e9-a69e-78dd816f5829', 11, 0),
    ('9dbde013-4389-56e9-a69e-78dd816f5829', 12, 0),
    ('9dbde013-4389-56e9-a69e-78dd816f5829', 13, 0);

-- Mesas para: IE SALVADOR CAMACHO ROLDAN
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('7aa2f336-2b37-5a07-9582-7230e00d653f', 1, 0),
    ('7aa2f336-2b37-5a07-9582-7230e00d653f', 2, 0),
    ('7aa2f336-2b37-5a07-9582-7230e00d653f', 3, 0),
    ('7aa2f336-2b37-5a07-9582-7230e00d653f', 4, 0);

-- Mesas para: IE CARLOS LLERAS RESTREPO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 1, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 2, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 3, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 4, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 5, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 6, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 7, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 8, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 9, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 10, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 11, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 12, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 13, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 14, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 15, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 16, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 17, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 18, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 19, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 20, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 21, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 22, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 23, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 24, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 25, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 26, 0),
    ('3d6eb086-a46e-5a57-989d-85bc936a9b41', 27, 0);

-- Mesas para: IE BRAULIO GONZALEZ SD SIMON BOLIVAR
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 1, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 2, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 3, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 4, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 5, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 6, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 7, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 8, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 9, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 10, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 11, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 12, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 13, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 14, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 15, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 16, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 17, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 18, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 19, 0),
    ('b793ec2f-3272-5029-8086-d3195ce5ee61', 20, 0);

-- Mesas para: IE BRAULIO GONZALEZ SD CENTRO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 1, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 2, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 3, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 4, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 5, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 6, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 7, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 8, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 9, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 10, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 11, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 12, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 13, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 14, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 15, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 16, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 17, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 18, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 19, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 20, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 21, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 22, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 23, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 24, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 25, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 26, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 27, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 28, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 29, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 30, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 31, 0),
    ('1f1bfc50-22c5-5982-8791-9d41505b7523', 32, 0);

-- Mesas para: IE GABRIEL GARCIA MARQUEZ
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('8fef557b-67ac-5235-bd97-a3dd953aa61e', 1, 0),
    ('8fef557b-67ac-5235-bd97-a3dd953aa61e', 2, 0),
    ('8fef557b-67ac-5235-bd97-a3dd953aa61e', 3, 0),
    ('8fef557b-67ac-5235-bd97-a3dd953aa61e', 4, 0),
    ('8fef557b-67ac-5235-bd97-a3dd953aa61e', 5, 0),
    ('8fef557b-67ac-5235-bd97-a3dd953aa61e', 6, 0),
    ('8fef557b-67ac-5235-bd97-a3dd953aa61e', 7, 0);

-- Mesas para: I.E MANUELA BELTRAN SEDE GAVAN
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('8b7ad42c-aba0-50e6-87a8-edacb1a367fa', 1, 0),
    ('8b7ad42c-aba0-50e6-87a8-edacb1a367fa', 2, 0);

-- Mesas para: I TEC EMPRESARIAL YOPAL ITEY
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 1, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 2, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 3, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 4, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 5, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 6, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 7, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 8, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 9, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 10, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 11, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 12, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 13, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 14, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 15, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 16, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 17, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 18, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 19, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 20, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 21, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 22, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 23, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 24, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 25, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 26, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 27, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 28, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 29, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 30, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 31, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 32, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 33, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 34, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 35, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 36, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 37, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 38, 0),
    ('eeb4a55e-5bb4-5b99-a6b5-e8190441edc1', 39, 0);

-- Mesas para: IE MANUELA BELTRAN
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 1, 0),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 2, 0),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 3, 0),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 4, 0),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 5, 0),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 6, 0),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 7, 0),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 8, 0),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 9, 0),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 10, 0),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 11, 0),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 12, 0),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 13, 0),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 14, 0),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 15, 0),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 16, 0),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 17, 0),
    ('b0afd650-1948-54e1-ab79-7337a1e1be73', 18, 0);

-- Mesas para: LA CAMPIÑA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('c0c1bb5a-2646-503e-861a-03eb5082d5e8', 1, 0),
    ('c0c1bb5a-2646-503e-861a-03eb5082d5e8', 2, 0),
    ('c0c1bb5a-2646-503e-861a-03eb5082d5e8', 3, 0),
    ('c0c1bb5a-2646-503e-861a-03eb5082d5e8', 4, 0),
    ('c0c1bb5a-2646-503e-861a-03eb5082d5e8', 5, 0),
    ('c0c1bb5a-2646-503e-861a-03eb5082d5e8', 6, 0),
    ('c0c1bb5a-2646-503e-861a-03eb5082d5e8', 7, 0),
    ('c0c1bb5a-2646-503e-861a-03eb5082d5e8', 8, 0),
    ('c0c1bb5a-2646-503e-861a-03eb5082d5e8', 9, 0),
    ('c0c1bb5a-2646-503e-861a-03eb5082d5e8', 10, 0),
    ('c0c1bb5a-2646-503e-861a-03eb5082d5e8', 11, 0),
    ('c0c1bb5a-2646-503e-861a-03eb5082d5e8', 12, 0),
    ('c0c1bb5a-2646-503e-861a-03eb5082d5e8', 13, 0),
    ('c0c1bb5a-2646-503e-861a-03eb5082d5e8', 14, 0),
    ('c0c1bb5a-2646-503e-861a-03eb5082d5e8', 15, 0);

-- Mesas para: IE EL PARAISO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 1, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 2, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 3, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 4, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 5, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 6, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 7, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 8, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 9, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 10, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 11, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 12, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 13, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 14, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 15, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 16, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 17, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 18, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 19, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 20, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 21, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 22, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 23, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 24, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 25, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 26, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 27, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 28, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 29, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 30, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 31, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 32, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 33, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 34, 0),
    ('a7394b6c-2921-5e5b-871f-2720bfdfed6a', 35, 0);

-- Mesas para: IE JORGE ELIECER GAITAN
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('ede7251f-e22e-5973-b441-d530b0549564', 1, 0),
    ('ede7251f-e22e-5973-b441-d530b0549564', 2, 0),
    ('ede7251f-e22e-5973-b441-d530b0549564', 3, 0),
    ('ede7251f-e22e-5973-b441-d530b0549564', 4, 0),
    ('ede7251f-e22e-5973-b441-d530b0549564', 5, 0),
    ('ede7251f-e22e-5973-b441-d530b0549564', 6, 0),
    ('ede7251f-e22e-5973-b441-d530b0549564', 7, 0),
    ('ede7251f-e22e-5973-b441-d530b0549564', 8, 0),
    ('ede7251f-e22e-5973-b441-d530b0549564', 9, 0),
    ('ede7251f-e22e-5973-b441-d530b0549564', 10, 0),
    ('ede7251f-e22e-5973-b441-d530b0549564', 11, 0),
    ('ede7251f-e22e-5973-b441-d530b0549564', 12, 0),
    ('ede7251f-e22e-5973-b441-d530b0549564', 13, 0),
    ('ede7251f-e22e-5973-b441-d530b0549564', 14, 0);

-- Mesas para: I TEC AMBIENTAL SAN MATEO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 1, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 2, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 3, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 4, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 5, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 6, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 7, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 8, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 9, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 10, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 11, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 12, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 13, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 14, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 15, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 16, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 17, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 18, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 19, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 20, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 21, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 22, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 23, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 24, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 25, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 26, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 27, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 28, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 29, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 30, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 31, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 32, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 33, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 34, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 35, 0),
    ('cf4e7fc0-a0a0-571d-85e8-b46bc73159c9', 36, 0);

-- Mesas para: MEGACOLEGIO EL PROGRESO COMUNA CINCO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 1, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 2, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 3, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 4, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 5, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 6, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 7, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 8, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 9, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 10, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 11, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 12, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 13, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 14, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 15, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 16, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 17, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 18, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 19, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 20, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 21, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 22, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 23, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 24, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 25, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 26, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 27, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 28, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 29, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 30, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 31, 0),
    ('3b025251-3dac-5873-8b2f-8d68720612cd', 32, 0);

-- Mesas para: IE EMP LLANO LINDO SD A
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('ce3f0a8f-bafc-5ce5-a8bd-55c65d8f110a', 1, 0),
    ('ce3f0a8f-bafc-5ce5-a8bd-55c65d8f110a', 2, 0),
    ('ce3f0a8f-bafc-5ce5-a8bd-55c65d8f110a', 3, 0),
    ('ce3f0a8f-bafc-5ce5-a8bd-55c65d8f110a', 4, 0),
    ('ce3f0a8f-bafc-5ce5-a8bd-55c65d8f110a', 5, 0),
    ('ce3f0a8f-bafc-5ce5-a8bd-55c65d8f110a', 6, 0),
    ('ce3f0a8f-bafc-5ce5-a8bd-55c65d8f110a', 7, 0),
    ('ce3f0a8f-bafc-5ce5-a8bd-55c65d8f110a', 8, 0),
    ('ce3f0a8f-bafc-5ce5-a8bd-55c65d8f110a', 9, 0),
    ('ce3f0a8f-bafc-5ce5-a8bd-55c65d8f110a', 10, 0),
    ('ce3f0a8f-bafc-5ce5-a8bd-55c65d8f110a', 11, 0),
    ('ce3f0a8f-bafc-5ce5-a8bd-55c65d8f110a', 12, 0);

-- Mesas para: IE EMP LLANO LINDO SD B
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('895f7049-8f2f-58bd-8c1a-c4bd09c4b20d', 1, 0),
    ('895f7049-8f2f-58bd-8c1a-c4bd09c4b20d', 2, 0),
    ('895f7049-8f2f-58bd-8c1a-c4bd09c4b20d', 3, 0),
    ('895f7049-8f2f-58bd-8c1a-c4bd09c4b20d', 4, 0),
    ('895f7049-8f2f-58bd-8c1a-c4bd09c4b20d', 5, 0),
    ('895f7049-8f2f-58bd-8c1a-c4bd09c4b20d', 6, 0);

-- Mesas para: IE TERESA DE CALCUTA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('10ca1d5c-0f2c-5710-878a-3880f0c685e2', 1, 0),
    ('10ca1d5c-0f2c-5710-878a-3880f0c685e2', 2, 0),
    ('10ca1d5c-0f2c-5710-878a-3880f0c685e2', 3, 0);

-- Mesas para: I E BRAULIO GONZALEZ SD CAMPESTRE
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('4728411f-f6ec-55ab-b167-a7507703a783', 1, 0),
    ('4728411f-f6ec-55ab-b167-a7507703a783', 2, 0),
    ('4728411f-f6ec-55ab-b167-a7507703a783', 3, 0),
    ('4728411f-f6ec-55ab-b167-a7507703a783', 4, 0),
    ('4728411f-f6ec-55ab-b167-a7507703a783', 5, 0),
    ('4728411f-f6ec-55ab-b167-a7507703a783', 6, 0),
    ('4728411f-f6ec-55ab-b167-a7507703a783', 7, 0),
    ('4728411f-f6ec-55ab-b167-a7507703a783', 8, 0),
    ('4728411f-f6ec-55ab-b167-a7507703a783', 9, 0),
    ('4728411f-f6ec-55ab-b167-a7507703a783', 10, 0);

-- Mesas para: CARCEL MUNICIPAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('eaff9eaa-37cf-5bfc-bda5-d8f9ab8b252a', 1, 0);

-- Mesas para: ALCARAVAN LA NIATA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('3fde068b-b020-5943-8678-00fe158f3da6', 1, 0),
    ('3fde068b-b020-5943-8678-00fe158f3da6', 2, 0),
    ('3fde068b-b020-5943-8678-00fe158f3da6', 3, 0);

-- Mesas para: PUNTO NUEVO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('e9fa65e7-4d91-5393-98d5-37570de21cae', 1, 0),
    ('e9fa65e7-4d91-5393-98d5-37570de21cae', 2, 0),
    ('e9fa65e7-4d91-5393-98d5-37570de21cae', 3, 0);

-- Mesas para: PALO BAJITO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('23fc76e0-7f0f-54e1-9b88-93d8e5d8ecee', 1, 0),
    ('23fc76e0-7f0f-54e1-9b88-93d8e5d8ecee', 2, 0);

-- Mesas para: MATA DE LIMON
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('c721a8d3-db80-5dbe-b2a9-81e2d5a864f9', 1, 0);

-- Mesas para: CHARTE
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('14934155-b3cf-54db-8345-8c375683c23a', 1, 0),
    ('14934155-b3cf-54db-8345-8c375683c23a', 2, 0),
    ('14934155-b3cf-54db-8345-8c375683c23a', 3, 0),
    ('14934155-b3cf-54db-8345-8c375683c23a', 4, 0);

-- Mesas para: GUAFILLA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('e91845d2-9acb-5b19-9361-c34768995f43', 1, 0);

-- Mesas para: EL MORRO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('444ac5df-4dd4-5cb7-96bf-4f2c3e905032', 1, 0),
    ('444ac5df-4dd4-5cb7-96bf-4f2c3e905032', 2, 0),
    ('444ac5df-4dd4-5cb7-96bf-4f2c3e905032', 3, 0),
    ('444ac5df-4dd4-5cb7-96bf-4f2c3e905032', 4, 0),
    ('444ac5df-4dd4-5cb7-96bf-4f2c3e905032', 5, 0),
    ('444ac5df-4dd4-5cb7-96bf-4f2c3e905032', 6, 0),
    ('444ac5df-4dd4-5cb7-96bf-4f2c3e905032', 7, 0),
    ('444ac5df-4dd4-5cb7-96bf-4f2c3e905032', 8, 0),
    ('444ac5df-4dd4-5cb7-96bf-4f2c3e905032', 9, 0),
    ('444ac5df-4dd4-5cb7-96bf-4f2c3e905032', 10, 0);

-- Mesas para: EL TALADRO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('210f8e53-8822-5448-8391-d34fd03a0939', 1, 0),
    ('210f8e53-8822-5448-8391-d34fd03a0939', 2, 0);

-- Mesas para: LA CHAPARRERA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('32b2c169-357f-5138-98ad-7f6360d8e047', 1, 0),
    ('32b2c169-357f-5138-98ad-7f6360d8e047', 2, 0),
    ('32b2c169-357f-5138-98ad-7f6360d8e047', 3, 0),
    ('32b2c169-357f-5138-98ad-7f6360d8e047', 4, 0),
    ('32b2c169-357f-5138-98ad-7f6360d8e047', 5, 0),
    ('32b2c169-357f-5138-98ad-7f6360d8e047', 6, 0),
    ('32b2c169-357f-5138-98ad-7f6360d8e047', 7, 0);

-- Mesas para: MORICHAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('af2139fa-f672-546b-bcdf-ef2df8832618', 1, 0),
    ('af2139fa-f672-546b-bcdf-ef2df8832618', 2, 0),
    ('af2139fa-f672-546b-bcdf-ef2df8832618', 3, 0),
    ('af2139fa-f672-546b-bcdf-ef2df8832618', 4, 0),
    ('af2139fa-f672-546b-bcdf-ef2df8832618', 5, 0),
    ('af2139fa-f672-546b-bcdf-ef2df8832618', 6, 0),
    ('af2139fa-f672-546b-bcdf-ef2df8832618', 7, 0),
    ('af2139fa-f672-546b-bcdf-ef2df8832618', 8, 0);

-- Mesas para: SAN RAFAEL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('a3c5fbfc-99bb-5158-a1ed-3ab5d37a3312', 1, 0);

-- Mesas para: TACARIMENA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('02d2dff1-844f-5430-93d0-20069890ab2c', 1, 0),
    ('02d2dff1-844f-5430-93d0-20069890ab2c', 2, 0),
    ('02d2dff1-844f-5430-93d0-20069890ab2c', 3, 0);

-- Mesas para: TILODIRAN
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('333423c6-dfd2-5c73-afa6-6b1c0b552ee7', 1, 0),
    ('333423c6-dfd2-5c73-afa6-6b1c0b552ee7', 2, 0),
    ('333423c6-dfd2-5c73-afa6-6b1c0b552ee7', 3, 0),
    ('333423c6-dfd2-5c73-afa6-6b1c0b552ee7', 4, 0),
    ('333423c6-dfd2-5c73-afa6-6b1c0b552ee7', 5, 0);

-- Mesas para: QUEBRADASECA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('76c2888c-86dc-5183-8aa0-22648d50e4f6', 1, 0),
    ('76c2888c-86dc-5183-8aa0-22648d50e4f6', 2, 0);

-- Mesas para: INST. EDUC. CAMILO TORRES REST
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 1, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 2, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 3, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 4, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 5, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 6, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 7, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 8, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 9, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 10, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 11, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 12, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 13, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 14, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 15, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 16, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 17, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 18, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 19, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 20, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 21, 0),
    ('9a507f81-96ab-5914-9e6e-85018dc66a77', 22, 0);

-- Mesas para: INST. EDUC. JORGE ELIECER GAIT
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 1, 0),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 2, 0),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 3, 0),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 4, 0),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 5, 0),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 6, 0),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 7, 0),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 8, 0),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 9, 0),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 10, 0),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 11, 0),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 12, 0),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 13, 0),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 14, 0),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 15, 0),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 16, 0),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 17, 0),
    ('1580c2e3-84b2-554d-9158-67cf5b1f31f3', 18, 0);

-- Mesas para: INST. EDUC. ANTONIO NARIÑO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 1, 0),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 2, 0),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 3, 0),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 4, 0),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 5, 0),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 6, 0),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 7, 0),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 8, 0),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 9, 0),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 10, 0),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 11, 0),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 12, 0),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 13, 0),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 14, 0),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 15, 0),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 16, 0),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 17, 0),
    ('4b875f50-e1ab-588f-bee6-1c75e37e89e2', 18, 0);

-- Mesas para: INST. EDUC. SAN AGUSTIN(NUEVA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 1, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 2, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 3, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 4, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 5, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 6, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 7, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 8, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 9, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 10, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 11, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 12, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 13, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 14, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 15, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 16, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 17, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 18, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 19, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 20, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 21, 0),
    ('78b07afe-fd08-5d2b-864c-99f3ff01c57b', 22, 0);

-- Mesas para: BELLAVISTA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('b94beefa-0b13-54ca-a7c6-32344ca3a5e6', 1, 0);

-- Mesas para: PLAN BRISAS
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('de145dbe-9f16-5444-b332-c935391c6852', 1, 0);

-- Mesas para: CUPIAGUA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('befa7716-bd16-5189-a6a5-909b85967cdf', 1, 0),
    ('befa7716-bd16-5189-a6a5-909b85967cdf', 2, 0),
    ('befa7716-bd16-5189-a6a5-909b85967cdf', 3, 0);

-- Mesas para: GUADALCANAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('a324134f-f23a-5d90-9e54-c93b71feb4c0', 1, 0);

-- Mesas para: LA TURUA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('7ab647df-1e79-5911-9009-c830f5410e8c', 1, 0),
    ('7ab647df-1e79-5911-9009-c830f5410e8c', 2, 0);

-- Mesas para: MONTERRALO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('a09b6fe5-098a-59d6-ba1d-54f5205d68bc', 1, 0),
    ('a09b6fe5-098a-59d6-ba1d-54f5205d68bc', 2, 0);

-- Mesas para: SAN JOSE DEL BUBUY
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('81fa7acc-4567-5a2b-bd55-d15621214062', 1, 0),
    ('81fa7acc-4567-5a2b-bd55-d15621214062', 2, 0),
    ('81fa7acc-4567-5a2b-bd55-d15621214062', 3, 0),
    ('81fa7acc-4567-5a2b-bd55-d15621214062', 4, 0);

-- Mesas para: SAN MIGUEL DE FARALLONES
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('e4f85f92-3011-579a-8fe2-690293216555', 1, 0);

-- Mesas para: UNETE
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('442ee096-7a83-529e-a094-862f2a06afed', 1, 0);

-- Mesas para: PUESTO CABECERA MUNICIPAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('8fbd5a19-c9fc-5090-a982-78a288b92d10', 1, 0),
    ('8fbd5a19-c9fc-5090-a982-78a288b92d10', 2, 0),
    ('8fbd5a19-c9fc-5090-a982-78a288b92d10', 3, 0),
    ('8fbd5a19-c9fc-5090-a982-78a288b92d10', 4, 0),
    ('8fbd5a19-c9fc-5090-a982-78a288b92d10', 5, 0),
    ('8fbd5a19-c9fc-5090-a982-78a288b92d10', 6, 0);

-- Mesas para: PUESTO CABECERA MUNICIPAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', 1, 0),
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', 2, 0),
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', 3, 0),
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', 4, 0),
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', 5, 0),
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', 6, 0),
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', 7, 0),
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', 8, 0),
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', 9, 0),
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', 10, 0),
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', 11, 0),
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', 12, 0),
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', 13, 0),
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', 14, 0),
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', 15, 0),
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', 16, 0),
    ('35f921dc-3daa-57e0-90b3-7e08e2eac4b3', 17, 0);

-- Mesas para: BERLIN
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('a30c5581-b089-5796-bfe9-885e73dd7289', 1, 0);

-- Mesas para: CHIRE
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('e23bce88-7dfc-5fe1-9d14-d1defc1ee0d6', 1, 0);

-- Mesas para: CORRALITO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('bbee4968-256e-5e31-8656-f91deb91af83', 1, 0);

-- Mesas para: EL GUAFAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('53b5b66f-dd56-5c2b-a9c0-5f0513e32daf', 1, 0);

-- Mesas para: LA FRONTERA (LA CHAPA)
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('0d6e6ebd-38b9-53ec-b7df-34030e6c010e', 1, 0);

-- Mesas para: LAS CAMELIAS
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('a1b8a3d9-0594-5c55-8378-6c2f12f20efb', 1, 0);

-- Mesas para: LAS TAPIAS
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('9a3d4bff-bf0e-54b9-8710-ce36784ec0ef', 1, 0);

-- Mesas para: MANARE
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('0b114572-fb73-5374-a82a-7e53283c040e', 1, 0);

-- Mesas para: PASO REAL DE ARIPORO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('a9d1be18-ab0c-51af-a4b2-fe18b1eb5ebf', 1, 0);

-- Mesas para: PUERTO COLOMBIA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('e889c328-652d-58b0-8bec-aa571053c38a', 1, 0);

-- Mesas para: RESGUARDO CAÑO MOCHUELO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('d4c17087-1e60-5e35-a369-45e23b264d49', 1, 0),
    ('d4c17087-1e60-5e35-a369-45e23b264d49', 2, 0);

-- Mesas para: SAN JOSE DE ARIPORO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('d619294f-8736-5eb5-8d7a-ff1a019b931a', 1, 0);

-- Mesas para: SAN NICOLAS
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('2884731d-55e6-5ae8-813b-6654629b4057', 1, 0);

-- Mesas para: SAN SALVADOR
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('30999c0f-c328-5387-96ec-3e42db793920', 1, 0);

-- Mesas para: SANTA BARBARA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('a3ca8210-2af6-54b5-bdfa-6a47558cb7b6', 1, 0);

-- Mesas para: SANTA RITA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('1125e221-8ea3-5006-be95-fde7299d3b1b', 1, 0);

-- Mesas para: PUESTO CABECERA MUNICIPAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('9661c9a3-4b28-5c5b-89c5-25779bdf96b7', 1, 0),
    ('9661c9a3-4b28-5c5b-89c5-25779bdf96b7', 2, 0),
    ('9661c9a3-4b28-5c5b-89c5-25779bdf96b7', 3, 0),
    ('9661c9a3-4b28-5c5b-89c5-25779bdf96b7', 4, 0);

-- Mesas para: JESUS BERNAL PINZON
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('295a6d2e-7094-5dde-a523-276185a5a489', 1, 0),
    ('295a6d2e-7094-5dde-a523-276185a5a489', 2, 0),
    ('295a6d2e-7094-5dde-a523-276185a5a489', 3, 0),
    ('295a6d2e-7094-5dde-a523-276185a5a489', 4, 0),
    ('295a6d2e-7094-5dde-a523-276185a5a489', 5, 0),
    ('295a6d2e-7094-5dde-a523-276185a5a489', 6, 0),
    ('295a6d2e-7094-5dde-a523-276185a5a489', 7, 0),
    ('295a6d2e-7094-5dde-a523-276185a5a489', 8, 0),
    ('295a6d2e-7094-5dde-a523-276185a5a489', 9, 0),
    ('295a6d2e-7094-5dde-a523-276185a5a489', 10, 0),
    ('295a6d2e-7094-5dde-a523-276185a5a489', 11, 0),
    ('295a6d2e-7094-5dde-a523-276185a5a489', 12, 0),
    ('295a6d2e-7094-5dde-a523-276185a5a489', 13, 0),
    ('295a6d2e-7094-5dde-a523-276185a5a489', 14, 0),
    ('295a6d2e-7094-5dde-a523-276185a5a489', 15, 0),
    ('295a6d2e-7094-5dde-a523-276185a5a489', 16, 0),
    ('295a6d2e-7094-5dde-a523-276185a5a489', 17, 0);

-- Mesas para: LUIS ENRIQUE BARON LEAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('614db249-7c6d-5235-b5c3-77b4ac4c21b6', 1, 0),
    ('614db249-7c6d-5235-b5c3-77b4ac4c21b6', 2, 0),
    ('614db249-7c6d-5235-b5c3-77b4ac4c21b6', 3, 0),
    ('614db249-7c6d-5235-b5c3-77b4ac4c21b6', 4, 0),
    ('614db249-7c6d-5235-b5c3-77b4ac4c21b6', 5, 0),
    ('614db249-7c6d-5235-b5c3-77b4ac4c21b6', 6, 0),
    ('614db249-7c6d-5235-b5c3-77b4ac4c21b6', 7, 0),
    ('614db249-7c6d-5235-b5c3-77b4ac4c21b6', 8, 0),
    ('614db249-7c6d-5235-b5c3-77b4ac4c21b6', 9, 0),
    ('614db249-7c6d-5235-b5c3-77b4ac4c21b6', 10, 0),
    ('614db249-7c6d-5235-b5c3-77b4ac4c21b6', 11, 0),
    ('614db249-7c6d-5235-b5c3-77b4ac4c21b6', 12, 0),
    ('614db249-7c6d-5235-b5c3-77b4ac4c21b6', 13, 0),
    ('614db249-7c6d-5235-b5c3-77b4ac4c21b6', 14, 0),
    ('614db249-7c6d-5235-b5c3-77b4ac4c21b6', 15, 0);

-- Mesas para: CHAVINABE
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('2c2a2681-75f7-59ad-8cbd-b8c0713e7bab', 1, 0);

-- Mesas para: SANTA MARIA DE PALMARITO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('31272ce7-84f3-5ae9-b3d3-df53aa718e12', 1, 0);

-- Mesas para: GUAFALPINTADO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('27fe7ff5-980b-5e44-985a-c4b6edf7966e', 1, 0);

-- Mesas para: LA POYATA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('5f08fc16-4885-5698-903d-6dd8a3696d55', 1, 0);

-- Mesas para: LA ARMENIA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('c743deb3-2e4b-5cdf-946d-7769cb1b4be9', 1, 0);

-- Mesas para: LAS GAVIOTAS
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('05c425fd-450e-581c-9d56-19d774fbcda7', 1, 0);

-- Mesas para: PASO REAL DE GUARIAMENA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('34f43e89-e70d-5ae6-b6fc-cd5d4fa776b8', 1, 0);

-- Mesas para: SAN JOAQUIN DE GARIBAY
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('07cbb3d7-d6bf-596d-8f18-48407cdc2893', 1, 0);

-- Mesas para: STA ELENA DE CUSIVA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('aff838ad-6de2-577f-a7ec-148fe35e8852', 1, 0),
    ('aff838ad-6de2-577f-a7ec-148fe35e8852', 2, 0);

-- Mesas para: PUESTO CABECERA MUNICIPAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('f0075782-a276-5d8a-a232-45e675958467', 1, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 2, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 3, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 4, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 5, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 6, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 7, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 8, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 9, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 10, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 11, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 12, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 13, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 14, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 15, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 16, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 17, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 18, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 19, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 20, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 21, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 22, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 23, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 24, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 25, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 26, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 27, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 28, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 29, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 30, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 31, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 32, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 33, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 34, 0),
    ('f0075782-a276-5d8a-a232-45e675958467', 35, 0);

-- Mesas para: BRISAS DEL LLANO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('e3393055-37a4-5274-8ad9-e7cdf52e7e98', 1, 0);

-- Mesas para: EL PORVENIR
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('c017c241-7055-5eca-9e2b-c12412e6c46a', 1, 0);

-- Mesas para: LA ORQUETA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('622c13e5-6706-525e-ad9b-8b8d168365de', 1, 0);

-- Mesas para: PALO NEGRO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('27de95c6-6b37-5e20-a3fa-5737443d3c49', 1, 0);

-- Mesas para: VILLA CAROLA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('553674e4-7ce3-5e16-92a8-136155aa5b3f', 1, 0),
    ('553674e4-7ce3-5e16-92a8-136155aa5b3f', 2, 0);

-- Mesas para: PUESTO CABECERA MUNICIPAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('b490c5f4-8bb7-50df-848f-e9de4a633272', 1, 0),
    ('b490c5f4-8bb7-50df-848f-e9de4a633272', 2, 0),
    ('b490c5f4-8bb7-50df-848f-e9de4a633272', 3, 0),
    ('b490c5f4-8bb7-50df-848f-e9de4a633272', 4, 0),
    ('b490c5f4-8bb7-50df-848f-e9de4a633272', 5, 0),
    ('b490c5f4-8bb7-50df-848f-e9de4a633272', 6, 0),
    ('b490c5f4-8bb7-50df-848f-e9de4a633272', 7, 0),
    ('b490c5f4-8bb7-50df-848f-e9de4a633272', 8, 0),
    ('b490c5f4-8bb7-50df-848f-e9de4a633272', 9, 0),
    ('b490c5f4-8bb7-50df-848f-e9de4a633272', 10, 0);

-- Mesas para: BARBACOAS
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('a86e8090-b34e-56c8-a042-6aad479926f0', 1, 0);

-- Mesas para: BARRANQUILLA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('196fe161-4935-50f6-98f7-83b5681bdb36', 1, 0);

-- Mesas para: COREA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('b6bcf42c-9171-51ca-b2ca-2bc287f85331', 1, 0);

-- Mesas para: EL CAUCHO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('7315a99f-31a4-5e8b-af26-1acfc056969e', 1, 0);

-- Mesas para: EL CONCHAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('1b1f4f23-c6bb-5f60-82bd-752713987b62', 1, 0);

-- Mesas para: EL CAZADERO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('a491fd33-729d-5e64-a465-6e710b8c2e3b', 1, 0);

-- Mesas para: EL PRETEXTO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('95931a7c-86ca-5734-ac99-f73203a5d672', 1, 0);

-- Mesas para: GUANAPALO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('d3466846-1ad1-5b56-93c3-89a4f6961268', 1, 0);

-- Mesas para: PALMIRA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('b9a5b135-a1f1-5efc-b750-a6abc7608966', 1, 0);

-- Mesas para: PEDREGAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('d5b9eb21-43a1-5c07-94b1-40b52688a1e0', 1, 0),
    ('d5b9eb21-43a1-5c07-94b1-40b52688a1e0', 2, 0);

-- Mesas para: PUERTO TOCARIA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('51bbf669-1191-5623-aae8-312b10d5f9cf', 1, 0),
    ('51bbf669-1191-5623-aae8-312b10d5f9cf', 2, 0),
    ('51bbf669-1191-5623-aae8-312b10d5f9cf', 3, 0),
    ('51bbf669-1191-5623-aae8-312b10d5f9cf', 4, 0);

-- Mesas para: SIRIVANA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('449c247f-3a3c-5a6c-90ed-b777fdbbe4ff', 1, 0);

-- Mesas para: VIZERTA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('c0370a68-97db-5627-b0cc-08c39e5a9240', 1, 0);

-- Mesas para: CABECERA MUNICIPAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('47814f5c-f846-5def-8621-cc370b330b17', 1, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 2, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 3, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 4, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 5, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 6, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 7, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 8, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 9, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 10, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 11, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 12, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 13, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 14, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 15, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 16, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 17, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 18, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 19, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 20, 0),
    ('47814f5c-f846-5def-8621-cc370b330b17', 21, 0);

-- Mesas para: BANCO LARGO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('2245f336-5544-54fa-81ff-4a7d1c895527', 1, 0);

-- Mesas para: BOCAS DEL CRAVO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('a2555d65-7d3c-5287-bb7f-7a3d8ba0a968', 1, 0);

-- Mesas para: CHURRUBAY
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('9174e37a-0375-5eed-84d0-2e829d141e82', 1, 0);

-- Mesas para: EL ALGARROBO (CRAVOSUR)
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('f60f14ff-d70f-54a9-bb85-e1aeaf921240', 1, 0),
    ('f60f14ff-d70f-54a9-bb85-e1aeaf921240', 2, 0),
    ('f60f14ff-d70f-54a9-bb85-e1aeaf921240', 3, 0),
    ('f60f14ff-d70f-54a9-bb85-e1aeaf921240', 4, 0);

-- Mesas para: EL DUYA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('fb8348f4-5905-505b-95e4-3a67ad01a548', 1, 0);

-- Mesas para: TUJUA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('ef1b0da4-1c2a-562a-bf75-893c7e376e5b', 1, 0);

-- Mesas para: IE JUAN JOSE RONDON
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 1, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 2, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 3, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 4, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 5, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 6, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 7, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 8, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 9, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 10, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 11, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 12, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 13, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 14, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 15, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 16, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 17, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 18, 0),
    ('59fd8d5d-ed9c-5ab2-88c1-2e1a54866d44', 19, 0);

-- Mesas para: IE SAGRADO CORAZON
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 1, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 2, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 3, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 4, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 5, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 6, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 7, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 8, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 9, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 10, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 11, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 12, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 13, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 14, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 15, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 16, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 17, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 18, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 19, 0),
    ('7b310cdf-6531-5075-9f24-f4a8282ad89e', 20, 0);

-- Mesas para: INST TEC IND EL PALMAR ITEIPA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 1, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 2, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 3, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 4, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 5, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 6, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 7, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 8, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 9, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 10, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 11, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 12, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 13, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 14, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 15, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 16, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 17, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 18, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 19, 0),
    ('d6dc34c8-5f2b-5d71-a76d-5b1ae10aabb8', 20, 0);

-- Mesas para: IE FRANCISCO JOSE DE CALDAS
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 1, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 2, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 3, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 4, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 5, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 6, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 7, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 8, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 9, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 10, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 11, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 12, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 13, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 14, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 15, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 16, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 17, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 18, 0),
    ('1704ac6c-15cf-5fd5-a764-1df272fd4443', 19, 0);

-- Mesas para: CARCEL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('e37e343f-5dfa-58d3-8e61-f9ef0a57aad1', 1, 0);

-- Mesas para: BOCAS DE LA HERMOSA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('d6399dd8-20c2-5651-bcfb-34eb8f1dcdaa', 1, 0);

-- Mesas para: CAÑO CHIQUITO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('f9029b13-87bb-51b3-8638-5ec4f4e49dbc', 1, 0),
    ('f9029b13-87bb-51b3-8638-5ec4f4e49dbc', 2, 0);

-- Mesas para: LAS GUAMAS
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('ac5dbff8-8ffa-53a7-b011-961ff6de47e6', 1, 0),
    ('ac5dbff8-8ffa-53a7-b011-961ff6de47e6', 2, 0);

-- Mesas para: LA BARRANCA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('ce871898-9e82-5c50-852c-a6c0e942a6e5', 1, 0),
    ('ce871898-9e82-5c50-852c-a6c0e942a6e5', 2, 0);

-- Mesas para: MONTAÑAS DEL TOTUMO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('e2a92046-810c-5bb2-80ef-d3221b6f50d8', 1, 0),
    ('e2a92046-810c-5bb2-80ef-d3221b6f50d8', 2, 0),
    ('e2a92046-810c-5bb2-80ef-d3221b6f50d8', 3, 0);

-- Mesas para: RESGUARDO CAÑO MOCHUELO COM. SAN
JOSE
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('d53f4fe4-ef06-5696-a9aa-ce491a30f3c3', 1, 0),
    ('d53f4fe4-ef06-5696-a9aa-ce491a30f3c3', 2, 0);

-- Mesas para: PUESTO CABECERA MUNICIPAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 1, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 2, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 3, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 4, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 5, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 6, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 7, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 8, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 9, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 10, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 11, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 12, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 13, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 14, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 15, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 16, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 17, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 18, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 19, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 20, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 21, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 22, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 23, 0),
    ('ac439484-7fe3-50d7-91c5-4986e49aab8f', 24, 0);

-- Mesas para: EL BANCO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('a079de9b-e4fb-5657-971b-d011a489db57', 1, 0),
    ('a079de9b-e4fb-5657-971b-d011a489db57', 2, 0);

-- Mesas para: LA PLATA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('5ebd8dec-034c-5b86-84d4-3301dfef10f9', 1, 0),
    ('5ebd8dec-034c-5b86-84d4-3301dfef10f9', 2, 0);

-- Mesas para: PUESTO CABECERA MUNICIPAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('45084759-3275-5cfb-9f88-564cf24fb0c9', 1, 0),
    ('45084759-3275-5cfb-9f88-564cf24fb0c9', 2, 0),
    ('45084759-3275-5cfb-9f88-564cf24fb0c9', 3, 0);

-- Mesas para: LOS ALPES
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('1e8291d2-6d66-55a4-8a8b-e6a828fead7a', 1, 0);

-- Mesas para: PUEBLO NUEVO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('17bea667-9d45-5c6f-99c7-ec0be1887c2f', 1, 0);

-- Mesas para: PUESTO CABECERA MUNICIPAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('99e16cf2-012a-59bc-8621-c2ce12a889c8', 1, 0),
    ('99e16cf2-012a-59bc-8621-c2ce12a889c8', 2, 0),
    ('99e16cf2-012a-59bc-8621-c2ce12a889c8', 3, 0),
    ('99e16cf2-012a-59bc-8621-c2ce12a889c8', 4, 0),
    ('99e16cf2-012a-59bc-8621-c2ce12a889c8', 5, 0),
    ('99e16cf2-012a-59bc-8621-c2ce12a889c8', 6, 0),
    ('99e16cf2-012a-59bc-8621-c2ce12a889c8', 7, 0);

-- Mesas para: AGUACLARA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('c2999665-f763-5ba9-b44e-613fb4fcb852', 1, 0),
    ('c2999665-f763-5ba9-b44e-613fb4fcb852', 2, 0);

-- Mesas para: EL SECRETO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('0bba9e7a-d812-51dd-8bf6-09700e624e21', 1, 0);

-- Mesas para: PUESTO CABECERA MUNICIPAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('bed24448-afda-5f2d-aff6-c25524fea8f7', 1, 0),
    ('bed24448-afda-5f2d-aff6-c25524fea8f7', 2, 0),
    ('bed24448-afda-5f2d-aff6-c25524fea8f7', 3, 0),
    ('bed24448-afda-5f2d-aff6-c25524fea8f7', 4, 0),
    ('bed24448-afda-5f2d-aff6-c25524fea8f7', 5, 0);

-- Mesas para: CHAPARRAL Y BARRO NEGRO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('bd9ad7b8-a4e6-582b-b91f-5ae144293879', 1, 0);

-- Mesas para: PUESTO CABECERA MUNICIPAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('0fcc65b7-3be4-5712-b3f9-ed9b04c1cf65', 1, 0),
    ('0fcc65b7-3be4-5712-b3f9-ed9b04c1cf65', 2, 0),
    ('0fcc65b7-3be4-5712-b3f9-ed9b04c1cf65', 3, 0),
    ('0fcc65b7-3be4-5712-b3f9-ed9b04c1cf65', 4, 0),
    ('0fcc65b7-3be4-5712-b3f9-ed9b04c1cf65', 5, 0),
    ('0fcc65b7-3be4-5712-b3f9-ed9b04c1cf65', 6, 0),
    ('0fcc65b7-3be4-5712-b3f9-ed9b04c1cf65', 7, 0),
    ('0fcc65b7-3be4-5712-b3f9-ed9b04c1cf65', 8, 0),
    ('0fcc65b7-3be4-5712-b3f9-ed9b04c1cf65', 9, 0),
    ('0fcc65b7-3be4-5712-b3f9-ed9b04c1cf65', 10, 0),
    ('0fcc65b7-3be4-5712-b3f9-ed9b04c1cf65', 11, 0),
    ('0fcc65b7-3be4-5712-b3f9-ed9b04c1cf65', 12, 0),
    ('0fcc65b7-3be4-5712-b3f9-ed9b04c1cf65', 13, 0),
    ('0fcc65b7-3be4-5712-b3f9-ed9b04c1cf65', 14, 0),
    ('0fcc65b7-3be4-5712-b3f9-ed9b04c1cf65', 15, 0),
    ('0fcc65b7-3be4-5712-b3f9-ed9b04c1cf65', 16, 0);

-- Mesas para: MIRAMAR DE GUANAPALO (BOCAS D
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('5ec6740a-f2b6-5292-991c-f33c086547bf', 1, 0);

-- Mesas para: GAVIOTAS QUITEVE
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('ae922184-500e-5cac-ad17-d7348c0952a0', 1, 0);

-- Mesas para: JAGUEYES
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('f4a586db-bfcc-5e5c-b84f-7914c685103d', 1, 0);

-- Mesas para: LA VENTUROSA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('29615a80-85f7-576d-94b5-b5fdf9e43674', 1, 0),
    ('29615a80-85f7-576d-94b5-b5fdf9e43674', 2, 0);

-- Mesas para: RIVERITA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('ba4f7a7a-0e64-5ac5-840b-7e1300688b0b', 1, 0);

-- Mesas para: SAN FRANCISCO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('0622c1f1-1815-5a49-a5c6-1ead1bdd422a', 1, 0);

-- Mesas para: SAN RAFAEL DE GUANAPALO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('4b7d3acc-8c5c-5668-9d02-84b1a0da3059', 1, 0);

-- Mesas para: SIRIVANA ALGODONALE
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('b27d48ae-7d4b-527a-af20-19d68a4092c1', 1, 0);

-- Mesas para: PUESTO CABECERA MUNICIPAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('eb7d846c-fbe6-5060-aa36-f9a1c60ea93b', 1, 0),
    ('eb7d846c-fbe6-5060-aa36-f9a1c60ea93b', 2, 0),
    ('eb7d846c-fbe6-5060-aa36-f9a1c60ea93b', 3, 0),
    ('eb7d846c-fbe6-5060-aa36-f9a1c60ea93b', 4, 0),
    ('eb7d846c-fbe6-5060-aa36-f9a1c60ea93b', 5, 0),
    ('eb7d846c-fbe6-5060-aa36-f9a1c60ea93b', 6, 0),
    ('eb7d846c-fbe6-5060-aa36-f9a1c60ea93b', 7, 0),
    ('eb7d846c-fbe6-5060-aa36-f9a1c60ea93b', 8, 0),
    ('eb7d846c-fbe6-5060-aa36-f9a1c60ea93b', 9, 0),
    ('eb7d846c-fbe6-5060-aa36-f9a1c60ea93b', 10, 0),
    ('eb7d846c-fbe6-5060-aa36-f9a1c60ea93b', 11, 0),
    ('eb7d846c-fbe6-5060-aa36-f9a1c60ea93b', 12, 0);

-- Mesas para: EL ARIPORO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('11075752-490b-5f08-b2b4-8e8d59ee1181', 1, 0);

-- Mesas para: TABLON DE TAMARA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('ba49d2fc-f324-5a2b-b981-e5e44108e246', 1, 0);

-- Mesas para: TABLONCITO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('c4e74539-adeb-575a-a2bd-a41538b60c23', 1, 0);

-- Mesas para: TEN (TEISLANDIA)
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('cf0f474c-0ed7-5713-be31-96ac133f3ef8', 1, 0);

-- Mesas para: ECCE HOMO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('f3bd8cb7-45ed-5c87-9268-6d6e9920e877', 1, 0);

-- Mesas para: GUARAQUE
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('87df2a22-97a6-5070-8353-ffa2c4204897', 1, 0);

-- Mesas para: SANTO DOMINGO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('aaf6ed94-31df-5ccd-8cf7-fca6d53368e9', 1, 0);

-- Mesas para: INSTITUCION EDUCATIVA JOSE MARIA
CORDOBA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 1, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 2, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 3, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 4, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 5, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 6, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 7, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 8, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 9, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 10, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 11, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 12, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 13, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 14, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 15, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 16, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 17, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 18, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 19, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 20, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 21, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 22, 0),
    ('9913ec28-70b8-5931-b4fd-9ee671f3755a', 23, 0);

-- Mesas para: IE TECNICA EMPRESARIAL DEL LLANO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 1, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 2, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 3, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 4, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 5, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 6, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 7, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 8, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 9, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 10, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 11, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 12, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 13, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 14, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 15, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 16, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 17, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 18, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 19, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 20, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 21, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 22, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 23, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 24, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 25, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 26, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 27, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 28, 0),
    ('07ec6c2e-6c3a-5505-8d8f-2a6b50658964', 29, 0);

-- Mesas para: CARUPANA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('c0f08892-08e4-5117-8298-13bd20facf17', 1, 0);

-- Mesas para: COROCITO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('ccf2df36-74a5-539d-8f04-8cbe9e7a27e6', 1, 0),
    ('ccf2df36-74a5-539d-8f04-8cbe9e7a27e6', 2, 0);

-- Mesas para: PASO CUSIANA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('519e4015-7f9b-528a-bea0-a891449679ed', 1, 0),
    ('519e4015-7f9b-528a-bea0-a891449679ed', 2, 0),
    ('519e4015-7f9b-528a-bea0-a891449679ed', 3, 0),
    ('519e4015-7f9b-528a-bea0-a891449679ed', 4, 0);

-- Mesas para: EL RAIZAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('f1ca89d0-b660-5f98-b69c-d0bd287d8b2a', 1, 0),
    ('f1ca89d0-b660-5f98-b69c-d0bd287d8b2a', 2, 0);

-- Mesas para: ESC. RURAL LA URAMA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('7882748c-2a92-5938-b8b7-37c574bd97d1', 1, 0),
    ('7882748c-2a92-5938-b8b7-37c574bd97d1', 2, 0);

-- Mesas para: INS.TEC.INTREGRADO B
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('cfd891b1-12f6-537b-8570-40fd0e4099cc', 1, 0),
    ('cfd891b1-12f6-537b-8570-40fd0e4099cc', 2, 0),
    ('cfd891b1-12f6-537b-8570-40fd0e4099cc', 3, 0),
    ('cfd891b1-12f6-537b-8570-40fd0e4099cc', 4, 0),
    ('cfd891b1-12f6-537b-8570-40fd0e4099cc', 5, 0),
    ('cfd891b1-12f6-537b-8570-40fd0e4099cc', 6, 0),
    ('cfd891b1-12f6-537b-8570-40fd0e4099cc', 7, 0),
    ('cfd891b1-12f6-537b-8570-40fd0e4099cc', 8, 0),
    ('cfd891b1-12f6-537b-8570-40fd0e4099cc', 9, 0),
    ('cfd891b1-12f6-537b-8570-40fd0e4099cc', 10, 0),
    ('cfd891b1-12f6-537b-8570-40fd0e4099cc', 11, 0),
    ('cfd891b1-12f6-537b-8570-40fd0e4099cc', 12, 0);

-- Mesas para: INS. TEC. INTEGRADO A
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('c29db998-e7d7-5406-be61-02dbf5d26511', 1, 0),
    ('c29db998-e7d7-5406-be61-02dbf5d26511', 2, 0),
    ('c29db998-e7d7-5406-be61-02dbf5d26511', 3, 0),
    ('c29db998-e7d7-5406-be61-02dbf5d26511', 4, 0),
    ('c29db998-e7d7-5406-be61-02dbf5d26511', 5, 0),
    ('c29db998-e7d7-5406-be61-02dbf5d26511', 6, 0),
    ('c29db998-e7d7-5406-be61-02dbf5d26511', 7, 0),
    ('c29db998-e7d7-5406-be61-02dbf5d26511', 8, 0),
    ('c29db998-e7d7-5406-be61-02dbf5d26511', 9, 0),
    ('c29db998-e7d7-5406-be61-02dbf5d26511', 10, 0),
    ('c29db998-e7d7-5406-be61-02dbf5d26511', 11, 0),
    ('c29db998-e7d7-5406-be61-02dbf5d26511', 12, 0);

-- Mesas para: BELGICA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('de9dc758-7047-56e2-8bd9-d32cafe39aab', 1, 0);

-- Mesas para: BOCAS DEL PAUTO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('6db7aed1-6842-5c62-b618-91b3ab861844', 1, 0),
    ('6db7aed1-6842-5c62-b618-91b3ab861844', 2, 0);

-- Mesas para: CAIMAN
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('215865d4-ba79-56d3-9fb2-7aab4d7d56de', 1, 0);

-- Mesas para: SANTA MARTA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('25150910-154d-57e6-9adf-e3f93659c748', 1, 0);

-- Mesas para: GUAMAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('583be31c-dcd5-549e-a708-668e001f7595', 1, 0);

-- Mesas para: PASO REAL DE LA SOLEDAD
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('77fefddf-9b5e-5d7d-9688-8745145f7c2b', 1, 0);

-- Mesas para: EL CONVENTO
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('15e61d70-099a-5e1c-94d1-3004100e3b06', 1, 0),
    ('15e61d70-099a-5e1c-94d1-3004100e3b06', 2, 0);

-- Mesas para: LOS CHOCHOS
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('3ea25e03-0f92-5025-a297-e2da0ae523b3', 1, 0);

-- Mesas para: SANTA IRENE
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('af452bf1-9ce7-5585-9e65-ac0f1007d3fb', 1, 0);

-- Mesas para: SAN VICENTE
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('ca52716a-c08e-5ba3-bf88-6238b3ed309f', 1, 0);

-- Mesas para: I.E. FABIO RIVEROS
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 1, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 2, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 3, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 4, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 5, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 6, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 7, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 8, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 9, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 10, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 11, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 12, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 13, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 14, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 15, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 16, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 17, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 18, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 19, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 20, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 21, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 22, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 23, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 24, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 25, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 26, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 27, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 28, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 29, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 30, 0),
    ('3fed4a6b-015b-5254-a67c-3f736a493ffe', 31, 0);

-- Mesas para: I.E. EZEQUIEL MORENO Y DIAZ SD MORICHAL
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('91f461c5-0fff-500f-b876-f66e0928c52e', 1, 0),
    ('91f461c5-0fff-500f-b876-f66e0928c52e', 2, 0),
    ('91f461c5-0fff-500f-b876-f66e0928c52e', 3, 0),
    ('91f461c5-0fff-500f-b876-f66e0928c52e', 4, 0),
    ('91f461c5-0fff-500f-b876-f66e0928c52e', 5, 0),
    ('91f461c5-0fff-500f-b876-f66e0928c52e', 6, 0),
    ('91f461c5-0fff-500f-b876-f66e0928c52e', 7, 0),
    ('91f461c5-0fff-500f-b876-f66e0928c52e', 8, 0),
    ('91f461c5-0fff-500f-b876-f66e0928c52e', 9, 0),
    ('91f461c5-0fff-500f-b876-f66e0928c52e', 10, 0),
    ('91f461c5-0fff-500f-b876-f66e0928c52e', 11, 0),
    ('91f461c5-0fff-500f-b876-f66e0928c52e', 12, 0),
    ('91f461c5-0fff-500f-b876-f66e0928c52e', 13, 0),
    ('91f461c5-0fff-500f-b876-f66e0928c52e', 14, 0),
    ('91f461c5-0fff-500f-b876-f66e0928c52e', 15, 0),
    ('91f461c5-0fff-500f-b876-f66e0928c52e', 16, 0),
    ('91f461c5-0fff-500f-b876-f66e0928c52e', 17, 0);

-- Mesas para: IE NUESTRA SEÑORA DE LOS DOLORES DE
MANA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 1, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 2, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 3, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 4, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 5, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 6, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 7, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 8, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 9, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 10, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 11, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 12, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 13, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 14, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 15, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 16, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 17, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 18, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 19, 0),
    ('05f52c77-ee1d-5cb4-9d30-4187c974964e', 20, 0);

-- Mesas para: IE EZEQUIEL MORENO Y DIAZ SD BELLO
HORIZ
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('10e48038-015f-50a6-9814-0c69875bfba3', 1, 0),
    ('10e48038-015f-50a6-9814-0c69875bfba3', 2, 0),
    ('10e48038-015f-50a6-9814-0c69875bfba3', 3, 0),
    ('10e48038-015f-50a6-9814-0c69875bfba3', 4, 0),
    ('10e48038-015f-50a6-9814-0c69875bfba3', 5, 0),
    ('10e48038-015f-50a6-9814-0c69875bfba3', 6, 0),
    ('10e48038-015f-50a6-9814-0c69875bfba3', 7, 0),
    ('10e48038-015f-50a6-9814-0c69875bfba3', 8, 0),
    ('10e48038-015f-50a6-9814-0c69875bfba3', 9, 0),
    ('10e48038-015f-50a6-9814-0c69875bfba3', 10, 0),
    ('10e48038-015f-50a6-9814-0c69875bfba3', 11, 0),
    ('10e48038-015f-50a6-9814-0c69875bfba3', 12, 0),
    ('10e48038-015f-50a6-9814-0c69875bfba3', 13, 0);

-- Mesas para: CARIBAYONA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('a79b7147-dfe3-5d71-a1fd-78a1dc6377f0', 1, 0),
    ('a79b7147-dfe3-5d71-a1fd-78a1dc6377f0', 2, 0),
    ('a79b7147-dfe3-5d71-a1fd-78a1dc6377f0', 3, 0);

-- Mesas para: SAN AGUSTIN
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('248377d7-18b6-5ec8-b857-3decb19d4700', 1, 0),
    ('248377d7-18b6-5ec8-b857-3decb19d4700', 2, 0);

-- Mesas para: SANTA HELENA DE UPIA
INSERT INTO mesas (puesto_id, numero_mesa, potencial_electoral) VALUES
    ('799cee8b-8eb2-5414-8d7d-00411c412dc5', 1, 0),
    ('799cee8b-8eb2-5414-8d7d-00411c412dc5', 2, 0);

-- Total de mesas insertadas: 1077
