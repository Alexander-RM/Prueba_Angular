export interface Usuario {
    idUsuario?: number;
    correo?: string;
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    compania?: string;
    habilitado?: string;
    idCognito?: string;
}

let usuario: Usuario;
