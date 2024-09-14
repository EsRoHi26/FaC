const express = require('express');
const esquemaUsuario = require('../modelosDatos/Usuario');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");


// Trae todos los usuarios
router.get('/usuarios', (req, res) => {
    esquemaUsuario.find()
        .then((usuarios) => res.json(usuarios))
        .catch((error) => res.json(error));
});

// Trae los usuarios por correo
router.get('/usuarios/correo/:correo', (req, res) => {
    const { correo } = req.params;
    esquemaUsuario.find({ email: correo })
        .then((usuarios) => res.json(usuarios))
        .catch((error) => res.json(error));
});

// Actualizar dinero inicial de usuario
router.put('/usuarios/dinero/:correo', (req, res) => {
    const { correo } = req.params;
    const { dinero } = req.body;
    const filter = { email: correo };
    const plata = parseInt(dinero);

    esquemaUsuario.updateOne(filter, { $set: { dineroInicial: plata } })
        .then(() => res.status(200).json({ mensaje: 'Dinero inicial actualizado' }))
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
router.post('/usuarios/', async (req, res) => {
    const usuario = new esquemaUsuario(req.body);
    
    usuario.save()
    .then( async(usuarios) => {

        
        res.json(usuarios)
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

    esquemaUsuario.updateOne({ email: id }, { $push: { proyectoPropios: proyectoId } })
        .then(() => res.status(204).send())
        .catch((error) => res.json(error));
});

// Eliminar un usuario
router.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    esquemaUsuario.findByIdAndDelete(id)
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
