const express = require('express');
const esquemaUsuario = require('../modelosDatos/Usuario');
const router = express.Router();

// Trae todos los usuarios
router.get('/usuarios', (req, res) => {
    esquemaUsuario.find()
        .then((usuarios) => res.json(usuarios))
        .catch((error) => res.json(error));
});

// Trae los usuarios por correo
router.get('/usuarios/correo/:correo', (req, res) => {
    const { correo } = req.params;
    esquemaUsuario.find({ correo })
        .then((usuarios) => res.json(usuarios))
        .catch((error) => res.json(error));
});

//obtener correos de usuarios
router.get('/usuarios/correo', (req, res) => {
    let correos = []
    esquemaUsuario.find()
        .then((usuarios) => {
            usuarios.forEach(usuario => {
                correos.push(usuario.email)
            });
            res.json(correos)
        })
        .catch((error) => res.json(error));

});

// Guarda un usuario
router.post('/usuarios/', (req, res) => {
    const usuario = new esquemaUsuario(req.body);
    
    usuario.save()
        .then(() => res.status(201).json(usuario))
        .catch((error) => res.json(error));
});

//buscar usuario por id
router.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    esquemaUsuario.findById(id)
        .then((usuarios) => res.json(usuarios))
        .catch((error) => res.json(error));

});

// Agregar proyecto a un usuario
router.put('/usuariosP/:id', (req, res) => {
    const { id } = req.params;
    const { proyectoId } = req.body;

    esquemaUsuario.updateOne({ _id: id }, { $addToSet: { proyectos: proyectoId } })
        .then(() => res.status(204).send())
        .catch((error) => res.json(error));
});

// Eliminar un usuario
router.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    esquemaUsuario.remove({ _id: id })
        .then(() => { res.json({ mensaje: 'Usuario eliminado' }) })
        .catch((err) => res.json(err));
});

//obtener correos de usuarios
router.get('/usuarios/correo', (req, res) => {
    let correos = []
    esquemaUsuario.find()
        .then((usuarios) => {
            usuarios.forEach(usuario => {
                correos.push(usuario.email)
            });
            res.json(correos)
        })
        .catch((error) => res.json(error));

});

//Autenticación de usuario
router.post('/autenticacion', (req, res) => {
    const { email, contrasenna } = req.body;

    esquemaUsuario.findOne({ email }).then(usuario => {
        if (!usuario) {
            return res.status(500).send('El usuario no se ha encontrado');
        }
        if (usuario.contrasenna === contrasenna) {
            return res.status(200).send('Usuario autenticado');
        } else {
            return res.status(500).send('Contraseña incorrecta');
        }
    })

});

router.put('/usuariosM', (req, res) => {


    const { emailM, email, departamento, telefono, proyecto } = req.body;

    esquemaUsuario.updateOne({ email: emailM }, { $set: { email, departamento, telefono, proyecto } })
        .then(() => { res.json({ mensaje: 'Usuario actualizado' }) })
        .catch((err) => res.json(err));
});

module.exports = router;
