const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    timestamps: true
  });

  usuarioSchema.methods.encrypPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };

  //encriptamiento booleano
  usuarioSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
  };

  module.exports = model('usuario', usuarioSchema);