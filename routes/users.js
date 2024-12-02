const express = require('express');
const router = express.Router();
const Usuario = require('../models/user');

router.post('/login', async (req, res) => {
    try {
        const { userId, suscripcion } = req.body;

        if (!suscripcion || !suscripcion.endpoint || !suscripcion.keys || !suscripcion.keys.p256dh || !suscripcion.keys.auth) {
            return res.status(400).json({ error: 'Faltan campos necesarios en la suscripción' });
        }
        if(!userId){
            const user = await Usuario.findOne({ suscripcion });
            console.log(user)
            if (!user) {
             const newUser = await Usuario.create({ suscripcion });
             return res.status(201).json({ userId: newUser._id });
            }
            return res.status(200).json( {userId: user._id} );
        }
        const user = await Usuario.findById(userId);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        user.suscripcion = suscripcion;
        await user.save();
        return res.status(200).json({ userId: user._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/create-user', async (req, res) => {
    console.log('Datos recibidos:', req.body); // Verifica los datos enviados desde el cliente

    try {
        const { name, lastname, email } = req.body;

        if (!name || !lastname || !email ) {
            console.log('Error: Campos requeridos faltantes');
            return res.status(400).json({ error: 'Todos los campos son necesarios' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Error: Formato de correo no válido');
            return res.status(400).json({ error: 'Formato de correo no válido' });
        }
        let usuario = await Usuario.find({ email });
        if (usuario.length > 0) {
            console.log('Error: El correo ya está registrado');
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }
        usuario = new Usuario({ name, lastname, email });
        await usuario.save();
        console.log('Usuario creado exitosamente');

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: usuario,
        });
    } catch (err) {
        console.error('Error al crear usuario:', err);

        if (err.code === 11000) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;