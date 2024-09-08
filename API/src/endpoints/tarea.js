const express = require('express');
const esquemaTarea = require('../modelosDatos/tarea');
const router = express.Router(); 

//crear tarea
router.post('/tareas', (req, res) => {
    
    const tarea = esquemaTarea(req.body);
    
    tarea.save()
    .then(() => res.json(tarea))
    .catch((error) => res.json(error));
});

//obtener tareas
router.get('/tareas', (req, res) => {
    esquemaTarea.find()
    .then((tareas) => res.json(tareas))
    .catch((error) => res.json(error));
});

//buscar tarea por id
router.get('/tareas/:id', (req, res) => {
    const { id } = req.params;

    esquemaTarea.findById(id)
    .then((tareas) => res.json(tareas))
    .catch((error) => res.json(error));

});

//actualizar estado de una tarea
router.put('/tareas/estado/:id', (req, res) => {
    const { id } = req.params;

    const { estado } = req.body;

    esquemaTarea.updateOne({_id: id}, { $set: {estado}})
        .then(()=>{res.json({mensaje: 'Estado actualizado'})} )
        .catch((err)=> res.json(err));  
});

//actualizar descripción de una tarea
router.put('/tareas/desc/:id', (req, res) => {
    const { id } = req.params;

    const { descripcion } = req.body;

    esquemaTarea.updateOne({_id: id}, { $set: {descripcion}})
        .then(()=>{res.json({mensaje: 'Descripcion actualizada'})} )
        .catch((err)=> res.json(err));  
});

//eliminar un tarea
router.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;

    esquemaTarea.findByIdAndDelete(id)
    .then(()=>{res.json({mensaje: 'Tarea eliminada'})} )
    .catch((err)=> res.json(err));  
});




module.exports = router;
