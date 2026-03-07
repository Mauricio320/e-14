-- Migración para insertar nuevos puestos de votación y generar sus mesas automáticamente
-- Basado en la información completa proporcionada por el usuario

DO $$ 
DECLARE
    v_puesto_id UUID;
BEGIN
    -- Función auxiliar local para insertar puesto y mesas
    CREATE OR REPLACE FUNCTION tmp_insert_puesto_con_mesas(
        p_municipio_id UUID, 
        p_nombre TEXT, 
        p_direccion TEXT, 
        p_cantidad_mesas INTEGER,
        p_zona TEXT
    ) RETURNS VOID AS $inner$
    DECLARE
        v_p_id UUID;
    BEGIN
        v_p_id := gen_random_uuid();
        INSERT INTO public.puestos_votacion (id, municipio_id, nombre, direccion, zona) 
        VALUES (v_p_id, p_municipio_id, p_nombre, p_direccion, p_zona::zona_enum);
        
        FOR i IN 1..p_cantidad_mesas LOOP
            INSERT INTO public.mesas (id, puesto_id, numero_mesa) 
            VALUES (gen_random_uuid(), v_p_id, i);
        END LOOP;
    END;
    $inner$ LANGUAGE plpgsql;

    -- YOPAL (902d85d8-d24a-4a92-a45b-b257e1adb668)
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'I.E. LUIS HERNANDEZ VARGAS', 'TRV. 18 # 10-126', 20, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'C.E. MARCO FIDEL SUAREZ', 'CALLE 13 TRASVERSAL 18 - 65', 12, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE CENTRO SOCIAL', 'CARRERA 23 No. 11 - 45', 14, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'COLEGIO DE LA PRESENTACION YOPAL', 'CLL 10 No 23- 62', 13, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE SALVADOR CAMACHO ROLDAN', 'CRA 20 No 5-160 BARRIO SAN MARTIN', 4, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE CARLOS LLERAS RESTREPO', 'CRA 31 No 26B-18', 26, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE BRAULIO GONZALEZ SD SIMON BOLIVAR', 'CLL 21 No 25-40', 20, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE BRAULIO GONZALEZ SD CENTRO', 'CLL 13 No 23-60', 33, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE GABRIEL GARCIA MARQUEZ', 'CLL 35 CRA 30 ESQUINA', 7, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'I.E MANUELA BELTRAN SEDE GAVAN', 'CLL19 No 21A - 76', 3, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'I TEC EMPRESARIAL YOPAL ITEY', 'CRA 21 No 39-05', 39, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE MANUELA BELTRAN', 'CLL 25 No 19-29', 17, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'LA CAMPIÑA', 'CRA 9 No 23-77', 14, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE EL PARAISO', 'CRA 7 No 30-01', 33, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE JORGE ELIECER GAITAN', 'CLL19 No 15-39', 15, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'I TEC AMBIENTAL SAN MATEO', 'CC 37 No 12-86', 35, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'MEGACOLEGIO EL PROGRESO COMUNA CINCO', 'CLL 44 No 8-40', 32, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE EMP LLANO LINDO SD A', 'CLL 60 No 5A OESTE', 14, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE EMP LLANO LINDO SD B', 'CRA 4 OESTE No 64B -03', 7, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'IE TERESA DE CALCUTA', 'CRA 31 No 49 - 03', 3, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'I E BRAULIO GONZALEZ SD CAMPESTRE', 'KM 2 VIA PEDREGAL', 11, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'CARCEL MUNICIPAL', 'KM 12 VIA YOPAL AGUAZUL', 1, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'ALCARAVAN LA NIATA', 'ESC. LA NIATA', 3, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'PUNTO NUEVO', 'COLEGIO SANTA TERESA', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'PALO BAJITO', 'IE.TEC AGROP DIVINO SALVADOR SD CENTRAL', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'MATA DE LIMON', 'CASETA COMUNAL MATA DE LIMON', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'CHARTE', 'COLEGIO GABRIELA MISTRAL', 3, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'GUAFILLA', 'I.E: CAMILO TORRES RESTREPO SEDE GUAFILLA', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'EL MORRO', 'COLEGIO ANTONIO NARIÑO', 9, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'EL TALADRO', 'IE TEC AGROP EL TALADRO', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'LA CHAPARRERA', 'IE. LUIS CARLOS GALAN SARMIENTO', 7, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'MORICHAL', 'COLEGIO POLICARPA SALAVARRIERTA', 8, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'SAN RAFAEL', 'INST. EDU. POLICARPA SALAVARRIETA SEDE SAN RAFAEL', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'TACARIMENA', 'IE. EL TRIUNFO', 3, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'TILODIRAN', 'ESCUELA LA INMACULADA', 5, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('902d85d8-d24a-4a92-a45b-b257e1adb668', 'QUEBRADASECA', 'COLEGIO MARIA AUXILIADORA', 2, 'rural');

    -- AGUAZUL (0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee)
    PERFORM tmp_insert_puesto_con_mesas('0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'INST. EDUC. CAMILO TORRES REST', 'CLL 15 CR. 18 ESQ.', 22, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'INST. EDUC. JORGE ELIECER GAIT', 'AV CIRCUNVALAR K1 VIA VALLEVERDE', 18, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'INST. EDUC. ANTONIO NARIÑO', 'CR. 16 CLL.10 ESQ.', 17, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'INST. EDUC. SAN AGUSTIN(NUEVA', 'CLL. 14 NO.6 45', 22, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'BELLAVISTA', 'ESC. BELLAVISTA', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'PLAN BRISAS', 'ESCUELA PLAN BRISAS', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'CUPIAGUA', 'POLIDEPORTIVO CUPIAGUA', 3, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'GUADALCANAL', 'ESC. SAN BENITO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'LA TURUA', 'SALON COMUNAL', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'MONTERRALO', 'RESTAURANTE ESCOLAR', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'SAN JOSE DEL BUBUY', 'ESC. SAN JOSE', 3, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'SAN MIGUEL DE FARALLONES', 'ESC. SAN MIGUEL DE FARALLONES', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('0ffcb8cc-a170-462f-9a6d-ba82c8ffc6ee', 'UNETE', 'ESC. UNETE', 1, 'rural');

    -- CHAMEZA (153aee71-0497-5f7c-9425-ed4e70c3697c)
    PERFORM tmp_insert_puesto_con_mesas('153aee71-0497-5f7c-9425-ed4e70c3697c', 'PUESTO CABECERA MUNICIPAL', 'CRA 4  No 7 - 17', 6, 'urbana');

    -- PAZ DE ARIPORO (57c7bd84-4b4c-540d-8998-6f6ca83c1881)
    PERFORM tmp_insert_puesto_con_mesas('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'PUESTO CABECERA MUNICIPAL', 'CLL 10 # 9 - 83 COL LUIS HERNANDEZ VARGAS', 17, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'BERLIN', 'ESC NUESTRA SEÑORA DEL CARMEN VDA BERLIN', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'CHIRE', 'IE SIMON BOLIVAR', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'CORRALITO', 'ESC JOSE MARIA CORDOVA VDA CORRALITO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'EL GUAFAL', 'ESC RUR VDA EL GUAFAL', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'LA FRONTERA (LA CHAPA)', 'IE BONIFACIO GUTIERREZ', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'LAS CAMELIAS', 'ESC LUZ DE ORIENTE VDA LAS CAMELIAS', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'LAS TAPIAS', 'ESC DIVINO NIÑO VDA LAS TAPIAS', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'MANARE', 'ESC POLICARPA SALAVARRIETA VDA MANARE', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'PASO REAL DE ARIPORO', 'ESC RUR VDA LA RESERVA', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'PUERTO COLOMBIA', 'IE PUERTO COLOMBIA', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'RESGUARDO CAÑO MOCHUELO', 'IE INDIG LISA MANENI', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'SAN JOSE DE ARIPORO', 'IE HORACIO PERDOMO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'SAN NICOLAS', 'ESC RUR VDA SAN NICOLAS', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'SAN SALVADOR', 'ESC RUR VDA ALTAMIRA', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'SANTA BARBARA', 'I E CARLOS LLERAS RESTREPO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('57c7bd84-4b4c-540d-8998-6f6ca83c1881', 'SANTA RITA', 'ESC DIVINO NIÑO VDA SANTA RITA', 1, 'rural');

    -- RECETOR (749eea2e-f057-44ed-a7f6-ced947859bb5)
    PERFORM tmp_insert_puesto_con_mesas('749eea2e-f057-44ed-a7f6-ced947859bb5', 'PUESTO CABECERA MUNICIPAL', 'CRA 3A No 1B - 12', 4, 'urbana');

    -- MANI (6fa32375-6048-4912-80ba-ee17e0ba097c)
    PERFORM tmp_insert_puesto_con_mesas('6fa32375-6048-4912-80ba-ee17e0ba097c', 'JESUS BERNAL PINZON', 'CLL 17 No 5-133', 17, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('6fa32375-6048-4912-80ba-ee17e0ba097c', 'LUIS ENRIQUE BARON LEAL', 'CRA 4 No 22-156', 15, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('6fa32375-6048-4912-80ba-ee17e0ba097c', 'CHAVINABE', 'SALON COMUNAL', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('6fa32375-6048-4912-80ba-ee17e0ba097c', 'SANTA MARIA DE PALMARITO', 'CASETA COMUNAL ESC. VDA SANTA MARIA DE PALMARITO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('6fa32375-6048-4912-80ba-ee17e0ba097c', 'GUAFALPINTADO', 'CASETA COMUNAL', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('6fa32375-6048-4912-80ba-ee17e0ba097c', 'LA POYATA', 'ESC. RURAL LA POYATA', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('6fa32375-6048-4912-80ba-ee17e0ba097c', 'LA ARMENIA', 'VDA LA ARMENIA', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('6fa32375-6048-4912-80ba-ee17e0ba097c', 'LAS GAVIOTAS', 'ESC. RURAL VDA LAS GAVIOTAS', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('6fa32375-6048-4912-80ba-ee17e0ba097c', 'PASO REAL DE GUARIAMENA', 'SALON COMUNAL', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('6fa32375-6048-4912-80ba-ee17e0ba097c', 'SAN JOAQUIN DE GARIBAY', 'SALON COMUNAL', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('6fa32375-6048-4912-80ba-ee17e0ba097c', 'STA ELENA DE CUSIVA', 'SALON COMUNAL', 2, 'rural');

    -- MONTERREY (324c3b69-7ce7-5f9d-94aa-31cfd21681a8)
    PERFORM tmp_insert_puesto_con_mesas('324c3b69-7ce7-5f9d-94aa-31cfd21681a8', 'PUESTO CABECERA MUNICIPAL', 'KRA.11-CL.16,COL.LA SABIDURIA ALFONSO LOPEZ', 35, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('324c3b69-7ce7-5f9d-94aa-31cfd21681a8', 'BRISAS DEL LLANO', 'RESTAURANTE ESCOLAR', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('324c3b69-7ce7-5f9d-94aa-31cfd21681a8', 'EL PORVENIR', 'ESC. RURAL EL PROVENIR', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('324c3b69-7ce7-5f9d-94aa-31cfd21681a8', 'LA ORQUETA', 'SALON COMUNAL', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('324c3b69-7ce7-5f9d-94aa-31cfd21681a8', 'PALO NEGRO', 'ESC. RURAL PALO NEGRO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('324c3b69-7ce7-5f9d-94aa-31cfd21681a8', 'VILLA CAROLA', 'ESC. RURAL VILLA CAROLA', 2, 'rural');

    -- NUNCHIA (3fa912ab-43d0-4a58-a789-f85e5c3d704c)
    PERFORM tmp_insert_puesto_con_mesas('3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'PUESTO CABECERA MUNICIPAL', 'CR 4 ENTRE CL 6 Y 7 IE SALVADOR CAMACHO R. SEC BTO', 10, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'BARBACOAS', 'IE SALVADOR CAMACHO ROLDAN SD RURAL DIVINO NIÑO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'BARRANQUILLA', 'IE ANTONIO NARIÑO SD RURAL BARRANQUILLA', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'COREA', 'IE EL PRETEXTO SD RURAL COREA', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'EL CAUCHO', 'I.E. EL PRETEXTO SEDE RURAL EL CAUCHO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'EL CONCHAL', 'IE ANTONIO NARIÑO SD RURAL EL CONCHAL', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'EL CAZADERO', 'I.E. EL PRETEXTO SEDE RURAL EL CAZADERO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'EL PRETEXTO', 'IE EL PRETEXTO SD CENTRAL', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'GUANAPALO', 'IE FRANCISCO LUCEA SD RURAL PALMAR DE GUANAPALO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'PALMIRA', 'IE ANTONIO NARIÑO SD RURAL SAN JOSE', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'PEDREGAL', 'IE SALVADOR CAMACHO ROLDAN SD RURAL PEDREGAL', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'PUERTO TOCARIA', 'IE ANTONIO NARIÑO SD CENTRAL', 4, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'SIRIVANA', 'IE EL PRETEXTO SD RURAL SAN NICOLAS', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('3fa912ab-43d0-4a58-a789-f85e5c3d704c', 'VIZERTA', 'IE ANTONIO NARIÑO SD RURAL MACUCO', 1, 'rural');

    -- OROCUE (6c3e3f04-0a0f-4c14-bb02-f3c635fa5a0d)
    PERFORM tmp_insert_puesto_con_mesas('6c3e3f04-0a0f-4c14-bb02-f3c635fa5a0d', 'CABECERA MUNICIPAL', 'I.E. LUIS CARLOS GALAN CLL 5 NO 10 D 27', 21, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('6c3e3f04-0a0f-4c14-bb02-f3c635fa5a0d', 'BANCO LARGO', 'ESC CUMACO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('6c3e3f04-0a0f-4c14-bb02-f3c635fa5a0d', 'BOCAS DEL CRAVO', 'ESC PALMARITO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('6c3e3f04-0a0f-4c14-bb02-f3c635fa5a0d', 'CHURRUBAY', 'ESC. EL SUSPIRO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('6c3e3f04-0a0f-4c14-bb02-f3c635fa5a0d', 'EL ALGARROBO (CRAVOSUR)', 'IE ALGARROBO', 5, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('6c3e3f04-0a0f-4c14-bb02-f3c635fa5a0d', 'EL DUYA', 'ESC MIRALINDO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('6c3e3f04-0a0f-4c14-bb02-f3c635fa5a0d', 'TUJUA', 'ESC LA LIBERTAD TUJUA', 1, 'rural');

    -- PARE (2bff7b3f-1d23-5e57-94e8-87f5704595f9)
    PERFORM tmp_insert_puesto_con_mesas('2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'IE JUAN JOSE RONDON', 'CALLE 7 No 5-51', 19, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'IE SAGRADO CORAZON', 'CRA 10 ESTE No 7-69 BARRIO GRANJA MERECURE', 19, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'INST TEC IND EL PALMAR ITEIPA', 'CLL 13 No 12-20', 20, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'IE FRANCISCO JOSE DE CALDAS', 'CALLE 5 No 13-40', 19, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'CARCEL', 'CLL 10 # 6-69', 1, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'BOCAS DE LA HERMOSA', 'SEDE IE PABLO SEXTO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'CAÑO CHIQUITO', 'SEDE IE CAÑO CHIQUITO', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'LAS GUAMAS', 'I.E. SAN JUAN DE LOS LLANOS', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'LA BARRANCA', 'INST TEC EMP ITENCA', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'MONTAÑAS DEL TOTUMO', 'IE SIMÓN BOLIVAR', 3, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('2bff7b3f-1d23-5e57-94e8-87f5704595f9', 'RESGUARDO CAÑO MOCHUELO COM. SAN JOSE', 'INSTITUCION EDUCATIVA YAMOTSINEMU', 2, 'rural');

    -- PORE (98087542-7bf4-5bf2-9824-2b7348278faa)
    PERFORM tmp_insert_puesto_con_mesas('98087542-7bf4-5bf2-9824-2b7348278faa', 'PUESTO CABECERA MUNICIPAL', 'I.E. RAFAEL URIBE URIBE CLL 4 # 17 - 40', 23, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('98087542-7bf4-5bf2-9824-2b7348278faa', 'EL BANCO', 'VEREDA EL BANCO', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('98087542-7bf4-5bf2-9824-2b7348278faa', 'LA PLATA', 'VEREDA LA PLATA', 2, 'rural');

    -- LA SALINA (10e85b40-1c5c-4bc0-930e-865df20f6360)
    PERFORM tmp_insert_puesto_con_mesas('10e85b40-1c5c-4bc0-930e-865df20f6360', 'PUESTO CABECERA MUNICIPAL', 'I E FERNANDO RODRIGUEZ KM 0 MAS 200 VIA CHAMEZA', 3, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('10e85b40-1c5c-4bc0-930e-865df20f6360', 'LOS ALPES', 'IE SEDE LOS ALPES', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('10e85b40-1c5c-4bc0-930e-865df20f6360', 'PUEBLO NUEVO', 'IE SEDE PUEBLO NUEVO', 1, 'rural');

    -- SAN LUIS DE PALENQUE (209a61bc-5f6d-478c-a141-0dadaa736d62)
    PERFORM tmp_insert_puesto_con_mesas('209a61bc-5f6d-478c-a141-0dadaa736d62', 'PUESTO CABECERA MUNICIPAL', 'CR 5#5-20 I.E. JORGE ELIECER GAITAN', 7, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('209a61bc-5f6d-478c-a141-0dadaa736d62', 'AGUACLARA', 'I.E MANUEL ELKIN PATARROYO', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('209a61bc-5f6d-478c-a141-0dadaa736d62', 'EL SECRETO', 'I E JORGE ELIECER GAITAN SEDE EL SECRETO', 1, 'rural');

    -- SABANALARGA (43ceae81-47cf-5454-93fe-48ed8ac1d69f)
    PERFORM tmp_insert_puesto_con_mesas('43ceae81-47cf-5454-93fe-48ed8ac1d69f', 'PUESTO CABECERA MUNICIPAL', 'CLL 3 No 13 - 43', 5, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('43ceae81-47cf-5454-93fe-48ed8ac1d69f', 'CHAPARRAL Y BARRO NEGRO', 'VEREDA CAMPO HERMOSO', 1, 'rural');

    -- SACAMA (22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090)
    PERFORM tmp_insert_puesto_con_mesas('22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'PUESTO CABECERA MUNICIPAL', 'I E FRANCISCO LUCEA CRA 7 No 3 - 17', 15, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'MIRAMAR DE GUANAPALO (BOCAS D', 'I E COL FRANCISCO LUCEA', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'GAVIOTAS QUITEVE', 'I E FRANCISCO LUCEA SEDE  GAVIOTAS', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'JAGUEYES', 'I E FRANCISCO LUCEA SEDE JAGUEYES', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'LA VENTUROSA', 'I E COL FRANCISCO LUCEA SEDE LA VENTUROSA', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'RIVERITA', 'I E FRANCISCO LUCEA SEDE RIVERITA', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'SAN FRANCISCO', 'I E FRANCISCO LUCEA SEDE SAN FRANCISO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'SAN RAFAEL DE GUANAPALO', 'I E COL FRANCISCO LUCEA SEDE GUANAPALO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('22de3ecb-6b3e-4d06-97f4-0eaf7f0e4090', 'SIRIVANA ALGODONALE', 'I E FRANCISCO LUCEA SEDE SIRIVANA ALGODONALES', 1, 'rural');

    -- TAMARA (2a47b0e5-f49d-532f-8139-3fb82c8901a8)
    PERFORM tmp_insert_puesto_con_mesas('2a47b0e5-f49d-532f-8139-3fb82c8901a8', 'PUESTO CABECERA MUNICIPAL', 'CLL 5 No 5-15', 11, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('2a47b0e5-f49d-532f-8139-3fb82c8901a8', 'EL ARIPORO', 'ESC. RURAL EL ARIPORO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('2a47b0e5-f49d-532f-8139-3fb82c8901a8', 'TABLON DE TAMARA', 'COL. TABLON DE TAMARA', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('2a47b0e5-f49d-532f-8139-3fb82c8901a8', 'TABLONCITO', 'ESC. RURAL TABLONCITO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('2a47b0e5-f49d-532f-8139-3fb82c8901a8', 'TEN (TEISLANDIA)', 'ESC. RURAL TEN (TEISLANDIA)', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('2a47b0e5-f49d-532f-8139-3fb82c8901a8', 'ECCE HOMO', 'IE ARTURO SALAZAR MEJÍA SD LA ESPER.VDA ECCE HOMO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('2a47b0e5-f49d-532f-8139-3fb82c8901a8', 'GUARAQUE', 'ESCUELA GUARAQUE', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('2a47b0e5-f49d-532f-8139-3fb82c8901a8', 'SANTO DOMINGO', 'ESCUELA VEREDA SANTO DOMINGO', 1, 'rural');

    -- TAURAMENA (8e869127-1f6a-41c8-b3f9-b4562bbdf891)
    PERFORM tmp_insert_puesto_con_mesas('8e869127-1f6a-41c8-b3f9-b4562bbdf891', 'INSTITUCION EDUCATIVA JOSE MARIA CORDOBA', 'CLL 8 # 10-78.COL.JOSE MARIA CORDOBA', 23, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('8e869127-1f6a-41c8-b3f9-b4562bbdf891', 'IE TECNICA EMPRESARIAL DEL LLANO', 'DIAGONAL 8 No 12-96', 29, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('8e869127-1f6a-41c8-b3f9-b4562bbdf891', 'CARUPANA', 'ESC. RURAL CARUPANA', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('8e869127-1f6a-41c8-b3f9-b4562bbdf891', 'COROCITO', 'ESC. RURAL COROCITO', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('8e869127-1f6a-41c8-b3f9-b4562bbdf891', 'PASO CUSIANA', 'IE.EL CUSIANA', 4, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('8e869127-1f6a-41c8-b3f9-b4562bbdf891', 'EL RAIZAL', 'IE.EL RAIZAL', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('8e869127-1f6a-41c8-b3f9-b4562bbdf891', 'ESC. RURAL LA URAMA', 'ESC.RUR.LA URAMA', 2, 'rural');

    -- TRINIDAD (4c3232c3-807c-5e07-928c-c933dcbc98f1)
    PERFORM tmp_insert_puesto_con_mesas('4c3232c3-807c-5e07-928c-c933dcbc98f1', 'INS.TEC.INTREGRADO B', 'CLL 7 No 4-49', 12, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('4c3232c3-807c-5e07-928c-c933dcbc98f1', 'INS. TEC. INTEGRADO A', 'CRA 4 No 1-71', 12, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('4c3232c3-807c-5e07-928c-c933dcbc98f1', 'BELGICA', 'ESC. RURAL BELGICA', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('4c3232c3-807c-5e07-928c-c933dcbc98f1', 'BOCAS DEL PAUTO', 'INS.E.RURAL RAFAEL GARCIA HERREROS', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('4c3232c3-807c-5e07-928c-c933dcbc98f1', 'CAIMAN', 'INS.E. RURAL EL POZO PETROLERO', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('4c3232c3-807c-5e07-928c-c933dcbc98f1', 'SANTA MARTA', 'ESCUELA RURAL SANTA MARTA', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('4c3232c3-807c-5e07-928c-c933dcbc98f1', 'GUAMAL', 'SALON COMUNAL VEREDA GUAMAL', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('4c3232c3-807c-5e07-928c-c933dcbc98f1', 'PASO REAL DE LA SOLEDAD', 'ESC. RURAL PASO REAL DE LA SOLEDAD', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('4c3232c3-807c-5e07-928c-c933dcbc98f1', 'EL CONVENTO', 'INST. EDU. RURAL CAMPESTRE BRISAS DEL PAUTO', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('4c3232c3-807c-5e07-928c-c933dcbc98f1', 'LOS CHOCHOS', 'ESC. RURAL LOS CHOCHOS', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('4c3232c3-807c-5e07-928c-c933dcbc98f1', 'SANTA IRENE', 'INS. E. SANTA IRENE', 1, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('4c3232c3-807c-5e07-928c-c933dcbc98f1', 'SAN VICENTE', 'ESC. RURAL LA MORITA', 1, 'rural');

    -- VILLANUEVA (4cfb3134-a50d-4479-9d93-abc799e6124e)
    PERFORM tmp_insert_puesto_con_mesas('4cfb3134-a50d-4479-9d93-abc799e6124e', 'I.E. FABIO RIVEROS', 'CL 11 No. 14 -115 CENTRO', 31, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('4cfb3134-a50d-4479-9d93-abc799e6124e', 'I.E. EZEQUIEL MORENO Y DIAZ SD MORICHAL', 'CRA. 14 No. 20 - 21 MORICHAL', 17, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('4cfb3134-a50d-4479-9d93-abc799e6124e', 'IE NUESTRA SEÑORA DE LOS DOLORES DE MANA', 'CRA. 3 No. 3 -118 PARAISO ALTO', 20, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('4cfb3134-a50d-4479-9d93-abc799e6124e', 'IE EZEQUIEL MORENO Y DIAZ SD BELLO HORIZ', 'CRA. 7 No. 14 - 54 BELLO HORIZONTE', 13, 'urbana');
    PERFORM tmp_insert_puesto_con_mesas('4cfb3134-a50d-4479-9d93-abc799e6124e', 'CARIBAYONA', 'CONC. ESCOLAR', 3, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('4cfb3134-a50d-4479-9d93-abc799e6124e', 'SAN AGUSTIN', 'COL .SAN AGUSTIN', 2, 'rural');
    PERFORM tmp_insert_puesto_con_mesas('4cfb3134-a50d-4479-9d93-abc799e6124e', 'SANTA HELENA DE UPIA', 'SALON COMUNAL CENT.', 2, 'rural');

    -- Eliminar función temporal
    DROP FUNCTION tmp_insert_puesto_con_mesas(UUID, TEXT, TEXT, INTEGER, TEXT);
END $$;

-- Definición de la función temporal (se puede borrar después si se desea, o dejarla como helper)
-- En este caso la defino fuera si el PERFORM falla dentro del bloque anónimo, 
-- pero Postgres requiere que esté definida antes.
-- Re-estructurando para ser un script SQL plano sin funciones si es más seguro:

/* 
Lógica de inserción manual para cada uno para evitar problemas con funciones locales
*/
