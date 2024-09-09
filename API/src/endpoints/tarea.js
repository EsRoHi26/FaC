const express = require('express');
const Donaciones = require('../modelosDatos/Donacion');
const Usuario = require('../modelosDatos/Usuario');
const Proyecto = require('../modelosDatos/Proyecto');
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
    const donacion = req.body;

    // Validate the user
    Usuario.find({ correo: donacion.correoDonante })
        .then((usuarioEx) => {
            if (usuarioEx.length === 0) {
                return res.status(409).json({ error: 'este usuario no existe' });
            }

            // Validate the project
            Proyecto.find({ _id: donacion.proyectoId })
                .then((proyecto) => {
                    if (proyecto.length === 0) {
                        return res.status(409).json({ error: 'este proyecto no existe' });
                    }

                    // Validate the user's funds
                    if (Math.abs(usuarioEx[0].dineroInicial) < donacion.monto) {
                        return res.status(409).json({ error: 'este usuario no cuenta con los fondos suficientes' });
                    }

                    // Save the donation
                    Donaciones.create(donacion)
                        .then(() => {
                            // Update the user's funds
                            const updatedDinero = usuarioEx[0].dineroInicial - donacion.monto;
                            Usuario.updateOne({ correo: donacion.correoDonante }, { dineroInicial: updatedDinero })
                                .then(() => {
                                    // Add donation to user's list
                                    Usuario.updateOne({ correo: donacion.correoDonante }, { $push: { donaciones: donacion._id } })
                                        .then(() => {
                                            // Update the project's collected amount
                                            const updatedMontoReca = Math.abs(proyecto[0].montoReca) + donacion.monto;
                                            Proyecto.updateOne({ _id: donacion.proyectoId }, { montoReca: updatedMontoReca })
                                                .then(() => {
                                                    // Add donation to project's list
                                                    Proyecto.updateOne({ _id: donacion.proyectoId }, { $push: { donaciones: donacion._id } })
                                                        .then(() => res.status(201).json(donacion))
                                                        .catch((error) => res.status(500).json({ error: error.message }));
                                                })
                                                .catch((error) => res.status(500).json({ error: error.message }));
                                        })
                                        .catch((error) => res.status(500).json({ error: error.message }));
                                })
                                .catch((error) => res.status(500).json({ error: error.message }));
                        })
                        .catch((error) => res.status(500).json({ error: error.message }));
                })
                .catch((error) => res.status(500).json({ error: error.message }));
        })
        .catch((error) => res.status(500).json({ error: error.message }));
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
