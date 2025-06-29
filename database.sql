-- CREA UNA BASE DE DATOS LLAMADA EVALUATEC
CREATE DATABASE IF NOT EXISTS evaluatec;

CREATE USER 'backdb'@'localhost' IDENTIFIED BY 'Javier117';

GRANT ALL PRIVILEGES ON evaluatec.* TO 'backdb'@'localhost';

FLUSH PRIVILEGES;

USE evaluatec;

-- CREA LA TABLA DE MATERIAS
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- CREA LA TABLA DE DEPARTAMENTOS
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- crea la tabla de profesores
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    apellido_paterno VARCHAR(255) NOT NULL,
    apellido_materno VARCHAR(255) NOT NULL,
    sexo VARCHAR(255) NOT NULL,
    department_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

--crea la tabla de calificacions_to_teacher, el id incremental, el id del profesor, la opinion, palabras clave y fecha de creacion y la puntuacion
CREATE TABLE IF NOT EXISTS califications_to_teacher (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT,
    opinion TEXT NOT NULL,
    keywords TEXT NOT NULL,
    score INT NOT NULL,
    materia_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

--insert para departamentos
INSERT INTO departments (name) VALUES ('Ciencias básicas');
INSERT INTO departments (name) VALUES ('Ciencias económico-administrativas');
INSERT INTO departments (name) VALUES ('Industrial y logística');
INSERT INTO departments (name) VALUES ('Metal mecánica');
INSERT INTO departments (name) VALUES ('Sistemas y computación');
INSERT INTO departments (name) VALUES ('Posgrado e investigación');

-- INSERT PARA los teachers de ciencias basicas
INSERT INTO teachers (name, apellido_paterno, apellido_materno, sexo, department_id)
VALUES
('Roberto', 'Barrón', 'Ríos', 'Masculino', 1),
('Yuliana', 'Calderón', 'Hermosillo', 'Femenino', 1),
('María del Carmen Virginia', 'Cervantes', 'Salgado', 'Femenino', 1),
('Ramón', 'Díaz', 'Hernández', 'Masculino', 1),
('Luis', 'García', 'Márquez', 'Masculino', 1),
('José Alfredo', 'Gasca', 'González', 'Masculino', 1),
('Héctor Federico', 'Godínez', 'Cabrera', 'Masculino', 1),
('Francisco Alfredo', 'Granados', 'Ramírez', 'Masculino', 1),
('Brenda Rosario', 'Hernández', 'Palafox', 'Femenino', 1),
('José Fernando', 'Hernández', 'Rodríguez', 'Masculino', 1),
('Ivett Adriana', 'Hidalgo', 'Montenegro', 'Femenino', 1),
('Myriam Aidee', 'Huizar', 'Kolldell', 'Femenino', 1),
('Rogelio', 'Infante', 'Medina', 'Masculino', 1),
('Flor Karina', 'Juárez', 'Cárdenas', 'Femenino', 1),
('Antonio', 'Lona', 'Gámez', 'Masculino', 1),
('J. Félix', 'López', 'Rocha', 'Masculino', 1),
('Denisse', 'Medina', 'López', 'Femenino', 1),
('Omar Felipe', 'Ortega', 'Martínez', 'Masculino', 1),
('Luis Carlos', 'Padierna', 'García', 'Masculino', 1),
('Juan de Dios', 'Paz', 'Salinas', 'Masculino', 1),
('Luz María Trinidad', 'Pérez', 'Alvarado', 'Femenino', 1),
('Graciano', 'Ramírez', 'Bravo', 'Masculino', 1),
('Joel', 'Rico', 'Pérez', 'Masculino', 1),
('Eduardo', 'Rodríguez', 'Argüello', 'Masculino', 1),
('Mónica De Los Dolores', 'Rodríguez', 'Chávez', 'Femenino', 1),
('Rodolfo', 'Rodríguez', 'Padilla', 'Masculino', 1),
('Saúl', 'Ruiz', 'Berbena', 'Masculino', 1),
('Manuel', 'Sambrano', 'Sánchez', 'Masculino', 1);
INSERT INTO teachers (name, apellido_paterno, apellido_materno, sexo, department_id)
VALUES
('José Ramón', 'Tapia', 'Torres', 'Masculino', 1),
('Rubén', 'Trujillo', 'Corona', 'Masculino', 1),
('Iván', 'Vigueras', 'Montaño', 'Masculino', 1),
('Leonel Alejandro', 'Villanueva', 'Ríos', 'Masculino', 1),
('José Luis', 'Villanueva', 'Rodríguez', 'Masculino', 1),
('Rafael', 'Rodríguez', 'Gallegos', 'Masculino', 1);


-- economico administrativas
INSERT INTO teachers (name, apellido_paterno, apellido_materno, sexo, department_id)
VALUES
('Analía', 'Zamudio', 'Carrera', 'Femenino', 2),
('Annel Asminy', 'Ramos', 'Gándara', 'Femenino', 2),
('César Agustín', 'Arroyo', 'Rico', 'Masculino', 2),
('Humberto', 'León', 'López', 'Masculino', 2),
('Ma. Isabel Cristina', 'Cárdenas', 'Salazar', 'Femenino', 2),
('Ismael', 'Bustos', 'Razo', 'Masculino', 2),
('Jorge', 'Alfaro', 'Gómez', 'Masculino', 2),
('José Antonio', 'Donato', 'Montiel', 'Masculino', 2),
('Julio César', 'González', 'Sánchez', 'Masculino', 2),
('Mariana Guadalupe', 'García', 'Vargas', 'Femenino', 2),
('Mario', 'Rocha', 'Hernández', 'Masculino', 2),
('Adriana Edurne', 'Macías', 'García', 'Femenino', 2),
('Ma. de los Ángeles', 'Gómez', 'Castro', 'Femenino', 2),
('Martha Beatriz', 'López', 'Mena', 'Femenino', 2),
('Carla Patricia', 'Ordaz', 'Picón', 'Femenino', 2),
('Celia', 'Ibarra', 'Díaz', 'Femenino', 2),
('Claudia Araceli', 'Caudillo', 'Peñaflor', 'Femenino', 2),
('Claudia Leticia', 'Díaz', 'González', 'Femenino', 2),
('Daniel Arturo', 'Olivares', 'Vera', 'Masculino', 2),
('Ma. Eugenia', 'Pérez', 'Parra', 'Femenino', 2),
('Fabiola Hilda Esther', 'Mares', 'Rodríguez', 'Femenino', 2),
('Gustavo Adolfo', 'Rodríguez', 'Muñoz', 'Masculino', 2),
('Jesús Ernesto', 'De La Rosa', 'García', 'Masculino', 2),
('José', 'Hurtado', 'Martínez', 'Masculino', 2),
('José Luis', 'Pérez', 'Torres', 'Masculino', 2),
('Karina', 'Estrada', 'Tolentino', 'Femenino', 2),
('Laura', 'López', 'Vela', 'Femenino', 2),
('Silvia', 'Villalpando', 'Contreras', 'Femenino', 2),
('Liliana', 'Sánchez', 'Vázquez', 'Femenino', 2),
('Ma. De Lourdes Esther', 'Rodríguez', 'Bueno Cervantes', 'Femenino', 2),
('María Guadalupe', 'Barrón', 'Guadalupe', 'Femenino', 2),
('Ma. Guadalupe', 'Nila', 'Reyes', 'Femenino', 2),
('Ma. Del Carmen', 'Villalpando', 'Valadez', 'Femenino', 2),
('Martha Beatriz', 'González', 'Nava', 'Femenino', 2),
('Martín', 'Martínez', 'Espinoza', 'Masculino', 2),
('Miguel Ángel', 'Rodríguez', 'Anguiano', 'Masculino', 2),
('Libia Nidia Nayeli', 'Martínez', 'Aguilar', 'Femenino', 2),
('Nelly Guadalupe', 'Ramírez', 'Gómez', 'Femenino', 2),
('María Noemí', 'Albarrán', 'Granados', 'Femenino', 2),
('Patricia', 'Quintero', 'Márquez', 'Femenino', 2),
('Pedro', 'Galindo', 'Peña', 'Masculino', 2),
('Petra', 'Sandoval', 'Flores', 'Femenino', 2),
('Raquel', 'Alatorre', 'Herrera', 'Femenino', 2),
('Rene', 'Álvarez', 'Aguirre', 'Masculino', 2),
('Rolando', 'Álvarez', 'Aguirre', 'Masculino', 2),
('Rosa Ma.', 'Álvarez', 'Aguirre', 'Femenino', 2),
('Silvia Guadalupe', 'Ruiz', 'Palacio', 'Femenino', 2),
('Silvia Yasmín', 'Macías', 'García', 'Femenino', 2),
('Silvina Lucia', 'López', 'Villagómez', 'Femenino', 2),
('Virginia', 'Rodríguez', 'Moreno', 'Femenino', 2),
('Mariana Guadalupe', 'García', 'Vargas', 'Femenino', 2),
('José', 'Hurtado', 'Martínez', 'Masculino', 2),
('Miguel Ángel', 'Ortiz', 'Gaucín', 'Masculino', 2);


-- industrial y logistica
INSERT INTO teachers (name, apellido_paterno, apellido_materno, sexo, department_id)
VALUES
('José Fernando', 'Aguiñaga', 'Rodríguez', 'Masculino', 3),
('Jesús Eduardo', 'Aldape', '', 'Masculino', 3),
('Yaret Viridiana', 'Alonso', 'Rangel', 'Femenino', 3),
('José Luis', 'Araiza', 'Guzmán', 'Masculino', 3),
('Oscar Armando', 'Calcanas', 'Lerma', 'Masculino', 3),
('María Lorena', 'Cázares', 'Coss Y León', 'Femenino', 3),
('Primitivo', 'Del Ángel', 'Soto', 'Masculino', 3),
('Israel', 'Esteban', 'López', 'Masculino', 3),
('Ángel Ignacio', 'Estrada', 'Lujano', 'Masculino', 3),
('Eduardo', 'Estrada', 'Palomino', 'Masculino', 3),
('Noé Cesar', 'Estrada', 'Quiroz', 'Masculino', 3),
('Karla Angélica', 'García', 'Barrón', 'Femenino', 3),
('Abigail', 'García', 'Rangel', 'Femenino', 3),
('Guillermo', 'García', 'Rodríguez', 'Masculino', 3),
('María Elena', 'García', 'Sotelo', 'Femenino', 3),
('Gustavo Adolfo', 'Garnica', 'Arista', 'Masculino', 3),
('Irma Yareni', 'Gómez', 'Fuentes', 'Femenino', 3),
('Fernando', 'Gómez', 'Guerra', 'Masculino', 3),
('Mónica', 'Gutiérrez', 'Del Real', 'Femenino', 3),
('Guillermina', 'Hernández', 'Hernández', 'Femenino', 3),
('María Raquel', 'Hernández', 'Segura', 'Femenino', 3),
('José', 'Hurtado', 'Martínez', 'Masculino', 3),
('Martha Patricia', 'Hurtado', 'Martínez', 'Femenino', 3),
('Juan Manuel', 'Luna', 'Valle', 'Masculino', 3),
('Juan Manuel Edmundo', 'Martínez', 'Camacho', 'Masculino', 3),
('Juan Manuel', 'Meza', 'Muñoz', 'Masculino', 3),
('Francisco', 'Meza', 'Navarro', 'Masculino', 3),
('Adolfo', 'Montesinos', '', 'Masculino', 3),
('Víctor Ulises', 'Muñoz', 'Brizuela', 'Masculino', 3),
('Hugo Alberto', 'Muñoz', 'Rodríguez', 'Masculino', 3),
('Felipe', 'Ortega', 'Moreno', 'Masculino', 3),
('Pablo Gregorio', 'Pérez', 'Campos', 'Masculino', 3),
('Juan Antonio', 'Pérez', 'López', 'Masculino', 3),
('Cesar Mauricio', 'Reyes', 'Mendoza', 'Masculino', 3),
('Roberto', 'Robledo', 'Pérez', 'Masculino', 3),
('Ana Cecilia', 'Ruiz', 'Segoviano', 'Femenino', 3),
('Mónica', 'Salgado', 'Solís', 'Femenino', 3),
('Francisco Héctor', 'Santos', 'Ruiz', 'Masculino', 3),
('Margarita', 'Sarabia', 'Saldaña', 'Femenino', 3),
('José Luis', 'Servín', 'Lara', 'Masculino', 3),
('Leopoldo David', 'Tapia', 'Torres', 'Masculino', 3),
('Lilia Angélica', 'Vázquez', 'Gutiérrez', 'Femenino', 3);


-- metal mecanica
INSERT INTO teachers (name, apellido_paterno, apellido_materno, sexo, department_id)
VALUES
('Bulmaro', 'Aranda', 'Cervantes', 'Masculino', 4),
('Juan Carlos', 'Ayala', 'Martínez', 'Masculino', 4),
('José Antonio', 'Calderón', 'Guzmán', 'Masculino', 4),
('Miguel Ángel', 'Casillas', 'Araiza', 'Masculino', 4),
('Josué', 'Del Valle', 'Hernández', 'Masculino', 4),
('Luis Miguel', 'González', 'Ortiz', 'Masculino', 4),
('Araceli', 'Guerrero', 'Cabrera', 'Femenino', 4),
('Jesús', 'Hernández', 'Ibarra', 'Masculino', 4),
('Gerardo De Jesús', 'Loza', 'Angulo', 'Masculino', 4),
('Antonio', 'Martínez', 'Báez', 'Masculino', 4),
('José De Jesús', 'Mayagoitia', 'Barragán', 'Masculino', 4),
('Rogelio', 'Navarro', 'Rizo', 'Masculino', 4),
('Adrián', 'Pérez', 'Benavidez', 'Masculino', 4),
('Francisco Alejandro', 'Ramírez', 'Díaz', 'Masculino', 4),
('Juan José', 'Ramírez', 'Zermeño', 'Masculino', 4),
('Luis Omar', 'Rojas', 'Juárez', 'Masculino', 4),
('Miguel', 'Rosales', 'Ciceña', 'Masculino', 4),
('José Luis', 'Torres', 'Gutiérrez', 'Masculino', 4),
('Rubén Eugenio', 'Valdivia', 'Hernández', 'Masculino', 4),
('Juan Mauricio', 'Valtierra', 'Domínguez', 'Masculino', 4),
('Ricardo', 'Vázquez', 'González', 'Masculino', 4),
('José Luis', 'Villaseñor', 'Ortega', 'Masculino', 4),
('Antonio', 'Zamarrón', 'Ramírez', 'Masculino', 4),
('Gerardo', 'Gutiérrez', 'Torres', 'Masculino', 4),
('Francisco', 'Chávez', 'Gutiérrez', 'Masculino', 4),
('Sorangel', 'Fischer', 'Hernández', 'Femenino', 4),
('Enrique', 'Hernández', 'Parra', 'Masculino', 4),
('Sandra Jaqueline', 'López', 'Cervera', 'Femenino', 4),
('Alan', 'López', 'Martínez', 'Masculino', 4),
('Francisco Carlos', 'Mejía', 'Alanís', 'Masculino', 4),
('Guillermo Eduardo', 'Méndez', 'Zamora', 'Masculino', 4),
('Dante José', 'Migoni', 'León', 'Masculino', 4),
('Jorge Daniel', 'Moreno', 'Gómez', 'Masculino', 4),
('Hul', 'Padilla', 'Gómez', 'Masculino', 4),
('Leonardo', 'Pérez', 'Mayen', 'Masculino', 4),
('Marco Antonio', 'Pérez', 'Tovar', 'Masculino', 4),
('HugoMarcel', 'Saavedra', 'Hernández', 'Masculino', 4),
('Omar', 'Sistos', 'Iñiguez', 'Masculino', 4),
('Osccar Salvador', 'Torres', 'Muñoz', 'Masculino', 4),
('Alejandro', 'Torres', 'Pérez', 'Masculino', 4),
('Carlos', 'Zamarripa', 'Ramírez', 'Masculino', 4),
('Esteban', 'Orozco', '', 'Masculino', 4),
('Leonardo', 'Meza', 'Muñoz', 'Masculino', 4);


-- sistemas y computacion
INSERT INTO teachers (name, apellido_paterno, apellido_materno, sexo, department_id)
VALUES
('Gerardo David', 'Aguayo', 'Ríos', 'Masculino', 5),
('Antonio', 'Águila', 'Reyes', 'Masculino', 5),
('Juan Carlos', 'Aguilera', 'Cruz', 'Masculino', 5),
('Efraín Guadalupe', 'Bermúdez', '', 'Masculino', 5),
('José De Jesús', 'Cardona', 'Delgado', 'Masculino', 5),
('José Gerardo', 'Carpio', 'Flores', 'Masculino', 5),
('Elizabeth', 'Castellanos', 'Nolasco', 'Femenino', 5),
('Patricia María', 'Castillo', 'Martínez', 'Femenino', 5),
('Elsa', 'Cuevas', 'Carrillo', 'Femenino', 5),
('Juan Pablo', 'Cordero', 'Hernández', 'Masculino', 5),
('Edgar Manuel', 'Delgado', 'Tolentino', 'Masculino', 5),
('Luis Roberto', 'Gallegos', 'Muñoz', 'Masculino', 5),
('Paola Virginia', 'Galván', 'Jaramillo', 'Femenino', 5),
('Adolfo', 'Gamiño', 'Guerrero', 'Masculino', 5),
('Domingo', 'García', 'Ornelas', 'Masculino', 5),
('Alejandro', 'García', 'Trujillo', 'Masculino', 5),
('Laura Patricia', 'Guevara', 'Rangel', 'Femenino', 5),
('Luis Eduardo', 'Gutiérrez', 'Ayala', 'Masculino', 5),
('Laura', 'Juárez', 'Guerra', 'Femenino', 5),
('Luis Gabino', 'Landeros', 'Aranda', 'Masculino', 5),
('Carlos Rafael', 'Levy', 'Rojas', 'Masculino', 5),
('David Everardo', 'Lugo', 'Pedroza', 'Masculino', 5),
('Eugenio Conrado', 'Marín', 'González', 'Masculino', 5),
('Deny', 'Martínez', 'Trejo', 'Masculino', 5),
('Ana Columba Zurita', 'Martínez', 'Aguilar', 'Femenino', 5),
('José Elías', 'Martínez', 'Arias', 'Masculino', 5),
('Edna Militza', 'Martínez', 'Prado', 'Femenino', 5),
('Jorge', 'Mendoza', 'Zapata', 'Masculino', 5),
('Roxana Noemí', 'Moreno', 'Real', 'Femenino', 5),
('Juan Pablo', 'Murillo', 'Ruiz', 'Masculino', 5),
('Angélica María', 'Ortiz', 'Gaucín', 'Femenino', 5),
('Eduardo José', 'Pérez', 'Pintor', 'Masculino', 5),
('Irma De Jesús', 'Ramírez', 'Álvarez', 'Femenino', 5),
('Jesús Enrique', 'Ramírez', 'Méndez', 'Masculino', 5),
('María Alicia', 'Ríos', 'Constantino', 'Femenino', 5),
('Martha Alicia', 'Rocha', 'Sánchez', 'Femenino', 5),
('José Alejandro', 'Rodríguez', 'Rentería', 'Masculino', 5),
('Luz Del Carmen', 'Ruiz', 'Gaytán', 'Femenino', 5),
('Ruth', 'Sáez De Nanclares', '', 'Femenino', 5),
('José De Jesús', 'Sandoval', 'Palomares', 'Masculino', 5),
('María Concepción', 'Sandoval', 'Solís', 'Femenino', 5),
('María Minerva', 'Saucedo', 'Torres', 'Femenino', 5),
('Cirino', 'Silva', 'Tovar', 'Masculino', 5),
('José Luis Fernando', 'Suarez Y Gómez', '', 'Masculino', 5),
('Verónica', 'Tapia', 'Ibarra', 'Femenino', 5),
('Carlos Alberto', 'Trujillo', 'Castellanos', 'Masculino', 5),
('María Magdalena', 'Valdivia', 'Murillo', 'Femenino', 5),
('José Juan', 'Vallejo', 'Núñez', 'Masculino', 5),
('Miguel Ángel', 'Vázquez', 'Rivas', 'Masculino', 5),
('Miguel Ángel', 'Peña', 'López', 'Masculino', 5);


-- posgrado e investigacion
INSERT INTO teachers (name, apellido_paterno, apellido_materno, sexo, department_id)
VALUES
('David Asael', 'Gutiérrez', 'Hernández', 'Masculino', 6),
('Alfonso', 'Rojas', 'Domínguez', 'Masculino', 6),
('Carlos', 'Lino', 'Ramírez', 'Masculino', 6),
('Raúl', 'Santiago', 'Montero', 'Masculino', 6),
('Héctor José', 'Puga', 'Soberanes', 'Masculino', 6),
('Josué', 'Del Valle', 'Hernández', 'Masculino', 6),
('Ignacio', 'Hernández', 'Bautista', 'Masculino', 6),
('María Del Rosario', 'Baltazar', 'Flores', 'Femenino', 6),
('Juan Francisco', 'Mosiño', '', 'Masculino', 6),
('Manuel', 'Ornelas', 'Rodríguez', 'Masculino', 6),
('Víctor Manuel', 'Zamudio', 'Rodríguez', 'Masculino', 6);


INSERT INTO subjects (name) VALUES 
('Programación Estructurada'),
('Programación Orientada a Objetos'),
('Estructuras de Datos'),
('Bases de Datos'),
('Desarrollo Web'),
('Desarrollo de Aplicaciones Móviles'),
('Sistemas Operativos'),
('Redes y Comunicaciones'),
('Ingeniería de Software'),
('Inteligencia Artificial'),
('Aprendizaje Automático'),
('Seguridad Informática'),
('Criptografía'),
('Blockchain y Smart Contracts'),
('Desarrollo de Videojuegos'),
('Computación en la Nube'),
('Programación en Python'),
('Programación en JavaScript'),
('Desarrollo con React'),
('Desarrollo con Node.js');
