const { Schema, model } = require('mongoose');
const Event = require('./Event');

const participantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String 
    },
    votesForEvents: [{
        eventId: {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        },
        votes: {
            type: Number,
            default: 0
        }
    }],
}, {
    timestamps: true
});

module.exports = model('Participant', participantSchema);