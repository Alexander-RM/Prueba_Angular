export interface Aplicaciones {
    idAplicaciones: number;
    nombre: string;
    descripcion: string;
    clientid: string;
    clientSecret: string;
    idUsuario: string;
    habilitado: boolean;
    url: string;
}

let aplicaciones: Aplicaciones;
