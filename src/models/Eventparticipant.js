//Eventparticipant.js
const { Schema, model } = require('mongoose');

const eventparticipantSchema = new Schema({
    id_event: {
        type: String,
        required: true
    },
    id_participant: {
        type: String, // Tipo ObjectId para el ID del participante
        required: true
    },
    votes: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = model('Eventparticipant', eventparticipantSchema);