const express = require('express');
const esquemaProyecto = require('../modelosDatos/proyecto');
const Usuario = require('../modelosDatos/Usuario');
const { ExplainVerbosity } = require('mongodb');
const moment = require('moment');
const router = express.Router(); 
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");
const CircularJSON = require('circular-json');

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


// actualizar monto recaudado
/*router.put('/proyectos/actualizarMonto/:id',  (req, res) => {
    const { id } = req.params; // ID del proyecto a actualizar
    const { montoRecaS } = req.body; // Monto recaudado nuevo

    console.log("ID del proyecto:", id);
    console.log("Monto a actualizar:", montoRecaS);
    console.log("en el maldito endpoint");
    
    try {
        const objectId = mongoose.Types.ObjectId(id);
        // Actualizar solo el campo montoReca
        const proyectoActualizado =  Proyecto.findOneAndUpdate(
            { _id: objectId },
            { $set: { montoReca: montoRecaS } },
            { new: true }
        );

        if (!proyectoActualizado) {
            return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        }

        res.json(proyectoActualizado);
    } catch (error) {
        console.error('Error al actualizar el proyecto:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el proyecto', error });
    }
});*/

// actualizar montoReca
router.put('/proyectos/actualizarMonto/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { montoRecaS } = req.body;

        // Asegurarse de esperar la resolución de la promesa
        const proyectoActualizado = await esquemaProyecto.findByIdAndUpdate(
            id,
            { $set: { montoReca: montoRecaS } },
            { new: true }
        );

        if (!proyectoActualizado) {
            return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        }

        // Enviar respuesta como JSON
        res.json(CircularJSON.stringify(proyectoActualizado));
    } catch (error) {
        console.error("Error al actualizar el proyecto:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


module.exports = router;