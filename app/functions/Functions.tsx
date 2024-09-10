import React from 'react'


export async function actualizar(id: { id: string, estado: string, prjID: string }): Promise<void> {
    const s: string = id.id;
    const p: string = id.prjID;
    console.log(s);
    const e: string = id.estado;
    const url: string = 'https://pm-app-tmfg.onrender.com/api/proyectos/' + p + '/tareasEstado/' + s;
    console.log(url);
    console.log(e);
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            estado: e
        })
    }).then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

export async function eliminar(id: { id: string, estado: string, prjID: string }): Promise<void> {
    const s: string = id.id;
    const p: string = id.prjID;
    const url: string = 'https://pm-app-tmfg.onrender.com/api/proyectos/' + p + '/tareasD/' + s;
    fetch(url, {
        method: 'GET',
    }).then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

export async function Crear(valores: any) {
    //const valoresJSON = JSON.stringify(valores);
    //console.log(valoresJSON);

    fetch("http://10.0.2.2:9000/api/proyectos", {
        method: 'POST',
        body: JSON.stringify(valores),
        headers: {
            'Content-Type': 'application/json'
        }

    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            alert("Proyecto creado con exito")
            window.location.reload()
        })
        .catch(error => console.error('Error:', error))


}

export async function Autenticar(valores: any) {
    const temp = await fetch("https://pm-app-tmfg.onrender.com/api/autenticacion", {
        method: 'POST',
        body: JSON.stringify(valores),
        headers: {
            'Content-Type': 'application/json'
        }

    })
        .then(res => {
            console.log(res)
            if (res.status === 500) {

                alert("Correo o contraseña incorrectos")
            }
            if (res.status === 200) {

                window.location.href = "/principal";
            }
            return res.json();
        })
        .catch(error => { console.error('Error:', error) })

    return temp;

};

