const express = require('express');
const esquemaProyecto = require('../modelosDatos/proyecto');
const Usuario = require('../modelosDatos/Usuario');
const { ExplainVerbosity } = require('mongodb');
const moment = require('moment');
const router = express.Router(); 
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");


//crear proyecto
router.post('/proyectos',(req,res)=>{

    const proyecto = esquemaProyecto(req.body); // Create a new instance of the esquemaProyecto model

    proyecto.save()
    .then(()=> {res.json(proyecto)})
    .catch((error)=> res.json(error));
    


});

//obtener los proyectos
router.get('/proyectos', (req, res) => {
    esquemaProyecto.find()
    .then((proyectos) => res.json(proyectos))
    .catch((error) => res.json(error));
});

//obtener lista de los Id de los proyectos
router.get('/proyectosId', (req, res) => {
    let ids_proyec = [];
    
    esquemaProyecto.find()
        .select("id")
        .exec()
        .then((idsProyecto) => {
            for (let i=0; i<idsProyecto.length; i++){
                ids_proyec.push(idsProyecto[i].id);
            }
            res.json({Ids: ids_proyec});
        })
        .catch((error) => res.json(error));
});

//buscar proyecto por id
router.get('/proyectos/:id', (req, res) => {
    const { id } = req.params;

    esquemaProyecto.findById(id)
    .then((proyectos) => res.json(proyectos))
    .catch((error) => res.json(error));

});

//actualizar un proyecto
router.put('/proyectos/:id/:correo/:name', async (req, res) => {
    const { id } = req.params;
    const { correo } = req.params;
    const { name } = req.params;
    const { descripcion, objetivoF, categoriaP, mediaItems } = req.body;

    esquemaProyecto.updateOne({_id: id}, { $set: {descripcion, objetivoF, categoriaP, mediaItems}})
        .then(()=>{res.json({mensaje: 'Proyecto actualizado'})} )
        .catch((err)=> res.json(err));  
    
    /*const msg = {
        to: correo,
        from: 'gomezacunav@gmail.com',
        subject: 'Fund a Cause: Proyecto actualizado',
        text: `Su proyecto de Fund a Cause ha sido actualizado exitosamente`,
        html: `<strong>Su proyecto de Fund a Cause ha sido actualizado exitosamente</strong>`
        };
    
        try{
            
            await sgMail.send(msg);
            console.log('Correo enviado con éxito');
        }
        catch(error){
            console.log(error);
        }*/
});

//eliminar un proyecto
router.delete('/proyectos/:id', (req, res) => {
    const { id } = req.params;

    esquemaProyecto.remove({_id: id})
    .then(()=>{res.json({mensaje: 'Proyecto eliminado'})} )
    .catch((err)=> res.json(err));  
});

// crear tarea en un proyecto
router.post('/proyectos/:id/tareas', (req, res) => {
    const { id } = req.params;

    const { nombre, descripcion, correoEncargado, puntos, estado, recursosEc,  tiempoEstimado} = req.body;

    esquemaProyecto.findById(id)
        .then((proyecto) => {
            if (!proyecto) {
                return res.status(404).json({ error: "Proyecto no encontrado" });
            }

            const nuevaTarea = {
                nombre,
                descripcion,
                correoEncargado,
                puntos,
                estado,
                recusosEc,
                tiempoEstimado
            };

            proyecto.tareas = proyecto.tareas || []; 
            proyecto.tareas.push(nuevaTarea);

            const emails = proyecto.correoColaboradores || [];
            console.log(emails);

            proyecto.save();
            const correosAEnviar = emails.map(email => {
                const msg = {
                    to: email,
                    from: 'vision.reque.no.reply@gmail.com',
                    subject: 'Nueva tarea creada',
                    text: `Se ha creado una nueva tarea llamada ${nombre} en el proyecto ${proyecto.nombre}.`,
                    html: `Se ha creado una nueva tarea llamada ${nombre} en el proyecto ${proyecto.nombre}.`
                };
                return sgMail.send(msg);
            });
            return Promise.all(correosAEnviar)
                .then(() => {
                    //return proyecto.save();
                })
                .then((proyecto) => res.json(proyecto)) 
                .catch((error) => res.json(error));
        });
});


// obtener una tarea de un proyecto
router.get('/proyectos/:id/tareas/:idTarea', (req, res) => {
    const { id, idTarea } = req.params;

    esquemaProyecto.findById(id)
        .then((proyecto) => {
            if (!proyecto || !proyecto.tareas) {
                return res.status(404).json({ error: "Proyecto o tarea no encontrada" });
            }

            const tareaEncontrada = proyecto.tareas.find(tarea => tarea._id == idTarea);

            if (!tareaEncontrada) {
                return res.status(404).json({ error: "Tarea no encontrada" });
            }

            return res.json(tareaEncontrada);
        })
        .catch((error) => res.json(error));
});


// notificaciones de donacion a un proyecto
router.put('/proyectos/:id/tareasEstado/:idTarea', (req, res) => {
    let { estado } = req.body;
    const { id, idTarea } = req.params;

    
            esquemaProyecto.findById(id)
                .then((proyecto) => {
                    if (!proyecto) {
                        return res.status(404).json({ error: "Proyecto no encontrado" });
                    }

                    const tarea = proyecto.tareas.find(tarea => tarea._id == idTarea);

                    if (!tarea) {
                        return res.status(404).json({ error: "Tarea no encontrada" });
                    }
                    if (estado) { 
                        tarea.estado = estado; 
                        if (estado === 'Finalizada') {
                            const emails = proyecto.correoColaboradores || [];
                            console.log(emails);
                            
                            const correosAEnviar = emails.map(email => {
                            const msg = {
                                to: email,
                                from: 'vision.reque.no.reply@gmail.com',
                                subject: 'Tarea Finalizada',
                                text: `Se ha finalizado la tarea llamada ${tarea.nombre} en el proyecto ${proyecto.nombre}.`,
                                html: `Se ha finalizado la tarea llamada ${tarea.nombre} en el proyecto ${proyecto.nombre}.`
                        };
                        return sgMail.send(msg);
                    });
                    return Promise.all([...correosAEnviar, proyecto.save()]);
                } else {
                    return proyecto.save();
                }
            }
        })
        .then(() => res.json({ message: 'Operation successful' }))
        .catch((error) => res.json(error));
});


// actualizar encargado de una tarea en el proyecto
router.put('/proyectos/:id/tareasEncargado/:idTarea', (req, res) => {
    let { correoEncargado } = req.body;
    const { id, idTarea } = req.params;

    
            esquemaProyecto.findById(id)
                .then((proyecto) => {
                    if (!proyecto) {
                        return res.status(404).json({ error: "Proyecto no encontrado" });
                    }

                    const tarea = proyecto.tareas.find(tarea => tarea._id == idTarea);

                    if (!tarea) {
                        return res.status(404).json({ error: "Tarea no encontrada" });
                    }

                    if (correoEncargado) { tarea.correoEncargado = correoEncargado; }
                    

                    proyecto.save()
                        .then(() => res.json(proyecto))
                        .catch((error) => res.json(error));
                })
                .catch((error) => res.json(error));
        
});


// actualizar una tarea en el proyecto
router.put('/proyectos/:id/tareas/:idTarea', (req, res) => {
    let { nombre, descripcion, correoEncargado, puntos, estado } = req.body;
    const { id, idTarea } = req.params;

    
            esquemaProyecto.findById(id)
                .then((proyecto) => {
                    if (!proyecto) {
                        return res.status(404).json({ error: "Proyecto no encontrado" });
                    }

                    const tarea = proyecto.tareas.find(tarea => tarea._id == idTarea);

                    if (!tarea) {
                        return res.status(404).json({ error: "Tarea no encontrada" });
                    }

                    // Actualizamos los campos de la tarea que hemos recibido si están definidos
                    if (nombre) {   tarea.nombre = nombre; }
                    if (descripcion) { tarea.descripcion = descripcion; }
                    if (correoEncargado) { tarea.correoEncargado = correoEncargado; }
                    if (puntos !== undefined) { tarea.puntos = puntos; }
                    if (estado) { tarea.estado = estado; }

                    proyecto.save()
                        .then(() => res.json(proyecto))
                        .catch((error) => res.json(error));
                })
                .catch((error) => res.json(error));
    
});

// eliminar una tarea en el proyecto
router.get('/proyectos/:id/tareasD/:idTarea', (req, res) => {
    const { id, idTarea } = req.params;

    esquemaProyecto.findById(id)
        .then((proyecto) => {
            const i = proyecto.tareas.findIndex(tarea => tarea._id == idTarea);

            if (i === -1) {
                return res.status(404).json({ error: "Tarea no encontrada" });
            }

            proyecto.tareas.splice(i, 1);
            proyecto.save()
                .then(() => res.json(proyecto))
                .catch((error) => res.json(error));
        })
        .catch((error) => res.json(error));
});

// obtener todas las tareas de un proyecto
router.get("/proyectos/:id/tareas", (req, res) => {
    const { id } = req.params;

    esquemaProyecto.findById(id)
        .then((proyecto) => {
            if (!proyecto) {
                return res.status(404).json({ error: "Proyecto no encontrado" });
            }
            return res.json(proyecto.tareas);
        })
        .catch((error) => res.json(error));
}); 

// informacion para el burndown chart
router.get('/proyectos/:id/burndownC', (req, res) => {
    const { id } = req.params;

    esquemaProyecto.findById(id)
        .then((proyecto) => {
            if (!proyecto) {
                return res.status(404).json({ error: "Proyecto no encontrado" });
            }
            let listTareas = proyecto.tareas;

            let diasTrabajo = moment(proyecto.fechaFin).diff(moment(proyecto.fechaInicio),'days');
            if (diasTrabajo <= 1) {
                diasTrabajo=15
            }

            console.log(listTareas);
            console.log(diasTrabajo);
            // Ordenar por fecha de inicio y asignar el valor de días restantes a cada tarea
            listTareas.sort((a, b) => a.fechaInicio - b.fechaInicio);
            
            let puntos = 0; 
            for (const tarea of listTareas) {
                puntos+= tarea.puntos;
            };
            console.log(puntos);
            
            //definicion de listas de tareas por estado  y puntos completados
            let listTareasCompletadas = [];
            let listTareasEnCurso = [];
            let listTareasPendientes = [];
            let puntosCompletados = 0;
            let puntosPendientes = puntos;

            for (const tarea of listTareas) {
                if (tarea.estado === "Finalizada") {
                    listTareasCompletadas.push(tarea);
                    puntosCompletados += tarea.puntos;
                    puntosPendientes = puntos - puntosCompletados;
                }
                else if (tarea.estado === "En curso") {
                    listTareasEnCurso.push(tarea);
                }
                else{
                    listTareasPendientes.push(tarea);
                }
            };
            console.log(listTareasCompletadas);
            console.log(listTareasEnCurso);
            console.log(listTareasPendientes);

            const burndown = {
                ejeX: diasTrabajo,
                ejeY: puntos,
                tareasCompletadas: listTareasCompletadas,
                tareasEnCurso: listTareasEnCurso,
                tareasPendientes: listTareasPendientes,
                puntosCompletados: puntosCompletados,
                puntosPendientes: puntosPendientes
            };
    
            return res.json(burndown);
            





        })
        .catch((error) => res.json(error));

});

//informe general
router.get('/informeG', (req, res) => {
    //obtener todos los proyectos
    let contadorFinalizadas = 0;
    let contadorEnCurso = 0;
    let contadorPendientes = 0;
    let listTareas = [];
    esquemaProyecto.find()
        .then((proyectos) => {
            for (let i = 0; i < proyectos.length; i++) {
                
                
                listTareas = proyectos[i].tareas;
                
                
                for (const tarea of listTareas) {
                    //console.log(tarea)
                    if (tarea.estado === "Finalizada") {
                        contadorFinalizadas += 1
                    }
                    else if (tarea.estado === "En curso") {
                        contadorEnCurso += 1
                    }
                    else if (tarea.estado === "Pendiente") {
                        contadorPendientes += 1
                    }
                };
                
                
            }
            const informeGen = {
                tareasFinalizadas: contadorFinalizadas,
                tareasEnCurso: contadorEnCurso,
                tareasPendientes: contadorPendientes
            };
            return res.json(informeGen);
        })
        .catch((error) => res.json(error));
});


// agregar usuario al proyecto
router.post('/agregarusuarioP', (req, res) => {
    const { idProyecto, email } = req.body;
    console.log(idProyecto);
    esquemaProyecto.findById(idProyecto)
        .then((proyecto) => { //revisa que el usuario no este ya en el proyecto
            if (proyecto.correoColaboradores.length>0){
                for (let i = 0; i < proyecto.correoColaboradores.length; i++) {
                    if (proyecto.correoColaboradores == email) {
                        return res.status(400).json({ error: "El usuario ya está en el proyecto" });
                    }
                }
            }
            

            proyecto.correoColaboradores.push(email);
            proyecto.save()
            .then(() => res.json({ mensaje: "Usuario agregado al proyecto" }))
                .catch((error) => res.json(error));
        })
    });
    // eliminar miembro del proyecto
router.delete('/eliminarMiembroP', (req, res) => {
    const { idProyecto, idUsuario } = req.body;

    esquemaProyecto.findById(idProyecto)
        .then((proyecto) => {
            let indice = -1;
            for (let i = 0; i < proyecto.miembros.length; i++) {
                if (proyecto.miembros[i] == idUsuario) {
                    indice = i;
                }
            }

            if (indice == -1) {
                return res.status(400).json({ error: "El usuario no está en el proyecto" });
            } else {
                proyecto.miembros.splice(indice, 1);
                proyecto.save()
                .then(() => res.json({ mensaje: "Usuario eliminado del proyecto" }))
                .catch((error) => res.json(error));
            }
        });
});

// Informe general de todos los proyectos
router.get('/informe-general', (req, res) => {
    esquemaProyecto.find()
        .then(proyectos => {
            let totalToDo = 0;
            let totalInProgress = 0;
            let totalFinished = 0;

            proyectos.forEach(proyecto => {
                totalToDo += proyecto.tareas.filter(tarea => tarea.estado === 'Pendiente').length;
                totalInProgress += proyecto.tareas.filter(tarea => tarea.estado === 'En curso').length;
                totalFinished += proyecto.tareas.filter(tarea => tarea.estado === 'Finalizada').length;
            });

            const data = {
                totalPorHacer: totalToDo,
                totalEnProgreso: totalInProgress,
                totalFinalizadas: totalFinished
            };

            res.json(data);
        })
        .catch(error => res.json(error));
});
//revisar si tiene proyecto 


module.exports = router;