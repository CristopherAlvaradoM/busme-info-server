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

module.exports = router;