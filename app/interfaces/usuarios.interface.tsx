export interface Usuario{
    _id:             string;
    cedula:          string;
    name:            string;
    email:           string;
    areaTrabajo:     string;
    dineroInicial:   number;
    telefono:        string;
    rol:             string;
    contrasenna:     string;
    proyectoPropios: string[];
    donaciones:      string[];
    __v:             number;
}
