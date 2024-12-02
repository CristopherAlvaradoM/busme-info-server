const mongoose = require('mongoose');

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
  suscripcion: { // Datos de la suscripción
    endpoint: { type: String }, // Única a nivel global
    expirationTime: { type: Date },
    keys: {
      p256dh: { type: String },
      auth: { type: String }
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Usuarios', userSchema);