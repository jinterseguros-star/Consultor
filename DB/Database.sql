create table Origen
(
	id_Origen int identity(1,1) primary key,
	descripcion varchar(250) unique
);

create table Compañia
(
	id_Comparñia int identity(1,1) primary key,
	descripcion varchar(150) unique
);

create table Cobertura
(
	id_Cobertura int identity(1,1) primary key,
	descripcion varchar(500) unique
);

create table Persona
(
	id_Persona int identity(1,1) primary key,
	nombre varchar(500),
	apellido varchar(500),
	dni Varchar(500) unique,
	telefono int,
	estado int
);

create table Usuario
(
	id_Usuario int identity(1,1) primary key,
	usuario varchar(25) unique,
	pass varchar(250),
	estado int,
	persona_id int,
	Foreign key (persona_id) References Persona (id_Persona)
);

create table Poliza
(
	id_Poliza bigint identity(1,1) primary key,
	codigo varchar(1000) not null,
	descripcion varchar(1000) not null,
	fechaRegistro datetime,
	fechaInicio datetime,
	fechaFin datetime,
	estado int,
	personaRegistra int,
	compañia_id int,
	origen_id int,
	cobertura_id int,
	Foreign Key (personaRegistra)	References Persona (id_Persona),
	Foreign Key (compañia_id)		References Compañia(id_Comparñia),
	Foreign Key (origen_id)			References Origen (id_Origen),
	Foreign Key (cobertura_id)		References Cobertura (id_Cobertura)
);

create table Asegurado
(
	asegurado_id int references Persona(id_Persona),
	poliza_id bigint references	Poliza(id_Poliza),
	Primary Key (asegurado_id,poliza_id)
);

create table ObjetoAsegurado
(
	id_Obejto bigint identity(1,1) primary key,
	descripcion Varchar(1200),
	poliza_id bigint,
	Foreign Key (poliza_id) references	Poliza(id_Poliza)
);

create table Estado
(
	id int primary key,
	descripcion varchar(25)
);

Insert Into Estado Values(0,'Deshabilitado');
Insert Into Estado Values(1,'Habilitado');
Insert Into Estado Values(2,'Admin');