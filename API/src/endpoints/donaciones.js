const express = require('express');
const esquemaDonacion = require('../modelosDatos/donacion');
const Usuario = require('../modelosDatos/Usuario');
const Proyecto = require('../modelosDatos/proyecto');
const router = express.Router();

// Trae todos los Donaciones
router.get('/donaciones', (req, res) => {
    Donaciones.find()
        .then((donaciones) => res.json(donaciones))
        .catch((error) => res.status(500).json({ error: error.message }));
});

// Trae los Donaciones por correo
router.get('/donaciones/:correo', (req, res) => {
    Donaciones.find({ correoDonante: req.params.correo })
        .then((donaciones) => res.json(donaciones))
        .catch((error) => res.status(500).json({ error: error.message }));
});

// Guarda una donacion
router.post('/donaciones', (req, res) => {
    const donacion = new esquemaDonacion(req.body);

    donacion.save()
    .then( async(donaciones) => {

        
        res.json(donaciones)
        /*const msg = {
        to: usuario.email,
        from: 'gomezacunav@gmail.com',
        subject: 'Fund a Cause: Usuario creado',
        text: `Su usuario de Fund a Cause ha sido creado exitosamente`,
        html: `<strong>Su usuario de Fund a Cause ha sido creado exitosamente</strong>`
        };
    
        try{
            
            await sgMail.send(msg);
            console.log('Correo enviado con éxito');
        }
        catch(error){
            console.log(error);
        }*/
    })
    
    
    .catch((error) => res.json(error));
            

    
});

// Update a donation with media link
router.put('/donaciones/:id', (req, res) => {
    const { id } = req.params;
    const { link } = req.body;
    Donaciones.updateOne({ _id: id }, { $set: { mediaLink: link } })
        .then(() => res.status(204).send())
        .catch((error) => res.status(500).json({ error: error.message }));
});

// Delete a donation
router.delete('/donaciones/:id', (req, res) => {
    const { id } = req.params;
    Donaciones.deleteOne({ _id: id })
        .then(() => res.status(204).send())
        .catch((error) => res.status(500).json({ error: error.message }));
});

module.exports = router;
/*
// Trae los Donaciones por correo
router.get('/donaciones/:correo', async (req, res) => {
    try {
        const donaciones = await Donaciones.find({ correoDonante: req.params.correo });
        res.json(donaciones);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Guarda una donacion
router.post('/donaciones', async (req, res) => {
    try {
        const donacion = req.body;

        // Validate the user
        const usuarioEx = await Usuario.find({ correo: donacion.correoDonante });
        if (usuarioEx.length === 0) {
            return res.status(409).json({ error: 'este usuario no existe' });
        }

        // Validate the project
        const proyecto = await Proyecto.find({ _id: donacion.proyectoId });
        if (proyecto.length === 0) {
            return res.status(409).json({ error: 'este proyecto no existe' });
        }

        // Validate the user's funds
        if (Math.abs(usuarioEx[0].dineroInicial) < donacion.monto) {
            return res.status(409).json({ error: 'este usuario no cuenta con los fondos suficientes' });
        }

        // Save the donation
        await Donaciones.create(donacion);

        // Update the user's funds
        const updatedDinero = usuarioEx[0].dineroInicial - donacion.monto;
        await Usuario.updateOne({ correo: donacion.correoDonante }, { dineroInicial: updatedDinero });

        // Add donation to user's list
        await Usuario.updateOne({ correo: donacion.correoDonante }, { $push: { donaciones: donacion._id } });

        // Update the project's collected amount
        const updatedMontoReca = Math.abs(proyecto[0].montoReca) + donacion.monto;
        await Proyecto.updateOne({ _id: donacion.proyectoId }, { montoReca: updatedMontoReca });

        // Add donation to project's list
        await Proyecto.updateOne({ _id: donacion.proyectoId }, { $push: { donaciones: donacion._id } });

        res.status(201).json(donacion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a donation with media link
router.put('/donaciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { link } = req.body;
        await Donaciones.updateOne({ _id: id }, { $set: { mediaLink: link } });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a donation
router.delete('/donaciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Donaciones.deleteOne({ _id: id });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; */
