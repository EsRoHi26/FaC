export interface Usuario{
    Cedula: string;
    Name: string;
    Correo: string;
    AreaTrabajo: string;
    DineroInicial: number;
    Telefono: string;
    Rol: string;
    Contrasenna: string;
    proyectosIds: string[],
    donaciones: string[],    
}