-- Se Crea una nueva base de datos llamada 'taskManager'
create database taskManager;

-- Selecciona la base de datos recién creada para realizar operaciones dentro de ella
use taskManager;

-- Crea una tabla llamada 'tasks' para almacenar información de tareas
create table tasks (
    email             varchar(64), -- Campo para almacenar el correo electrónico del usuario
    containername     varchar(64), -- Campo para almacenar el nombre del contenedor
    taskName          varchar(64), -- Campo para almacenar el nombre de la tarea
    taskDDL           varchar(64), -- Campo para almacenar la fecha límite de la tarea
    taskTime          varchar(64), -- Campo para almacenar la hora de la tarea
    taskDescription   varchar(1024), -- Campo para almacenar la descripción de la tarea
    primary key(email, containername, taskName, taskDDL) -- Define una clave primaria compuesta por varios campos
);

-- Crea una tabla llamada 'users' para almacenar información de usuarios
create table users (
    username  varchar(64), -- Campo para almacenar el nombre de usuario
    password  varchar(64), -- Campo para almacenar la contraseña del usuario
    email     varchar(64), -- Campo para almacenar el correo electrónico (clave primaria)
    PRIMARY KEY (email) -- Define la clave primaria en el campo 'email'
);

-- Crea una tabla llamada 'containers' para almacenar información de contenedores
create table containers (
    email          varchar(64), -- Campo para almacenar el correo electrónico del usuario (parte de la clave primaria)
    time           varchar(64), -- Campo para almacenar la hora del contenedor
    containername  varchar(64), -- Campo para almacenar el nombre del contenedor (parte de la clave primaria)
    PRIMARY KEY (email, containername) -- Define una clave primaria compuesta por 'email' y 'containername'
);
