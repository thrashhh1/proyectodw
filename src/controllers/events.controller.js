//events.controller.js

const eventsCtrl = {};
const multer = require('multer');
const Event = require('../models/Event');
const Participant = require('../models/Participant');
const Eventparticipant = require('../models/Eventparticipant');
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // Límite de 5 MB (ajusta según tus necesidades)
    },
    fileFilter: (req, file, cb) => {
        // Asegúrate de que el archivo sea una imagen
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('El archivo no es una imagen.'));
        }
    },
});





// Funciones para eventos
eventsCtrl.renderEventsForm = async (req, res) => {
    const participants = await Participant.find().lean();
    res.render('events/administration/new-event', {
        title: 'Eventos',
        style: 'add.css',
        participants
    });
};

eventsCtrl.createNewEvent = async (req, res) => {
    //Crear evento nuevo
    const { title, date, datef, participants }  = req.body;
    try {
        const newEvent = await Event.create({ title, date, datef });
        const eventId = newEvent._id;

        const participantsToUpdate = await Participant.find({ _id: { $in: participants } });

        for (const participant of participantsToUpdate) {
            const participantId = participant._id;
            const newEventParticipant = await Eventparticipant.create({
                id_event: eventId,
                id_participant: participantId,
                votes: 0
            });
            console.log(newEventParticipant);
        }

        console.log(newEvent);
        res.redirect('/events/administration');
    } catch (error) {
        console.error('Error al crear el evento:', error);
        req.flash('error_msg', 'Error al crear el evento.');
        res.redirect('/events/administration');
    }
};

eventsCtrl.renderEvents = async (req, res) => {
    const events = await Event.find().lean();
    const style = 'all-events.css';
    res.render('events/all-events', { events, style });
    console.log(events);
};

eventsCtrl.renderAdminevents = async (req, res) => {
    const events = await Event.find().lean();
    const style = 'all-events.css';
    res.render('events/administration/adminevent', { events, style });
};

eventsCtrl.renderEditForm = (req, res) => {
    res.send('Render EditForm');
};

eventsCtrl.renderEventid = async (req, res) => {
    try {
        const eventId = req.params.id;

        const eventParticipants = await Eventparticipant.find({ id_event: eventId }).lean();

        const participantIds = eventParticipants.map(participant => participant.id_participant);

        const participants = await Participant.find({ _id: { $in: participantIds } }).lean();

        const indexedParticipants = participants.map((participant, index) => ({
            ...participant,
            index: index + 1 // Incrementar el índice en 1 para comenzar desde 1
        }));

        const sortedParticipants = indexedParticipants.sort((a, b) => b.votes - a.votes);
        console.log(sortedParticipants)

        const event = await Event.findById(eventId).lean();

        if (!event) {
            return res.status(404).send('Evento no encontrado');
        }

        res.render('events/event', {
            event,
            participants: sortedParticipants,
            eventParticipants,
            style: 'signin.css'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los detalles del evento');
    }
};

eventsCtrl.updateEvent = (req, res) => {
    res.send('update event');
};

eventsCtrl.deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        await Event.findByIdAndDelete(eventId);
        await Eventparticipant.deleteMany({ id_event: eventId });

        res.redirect('/events/administration');
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        req.flash('error_msg', 'Error al eliminar el evento.');
        res.redirect('/events/administration');
    }
};

// Funciones para participantes
eventsCtrl.renderAdminParticipant = async (req, res) => {
    const participants = await Participant.find().lean();
    res.render('events/administration/admin-participant', {
        style: 'admin-participant.css', participants
    });
};

eventsCtrl.AddParticipant = async (req, res) => {
    //Añadir participante a la base de datos
    //Utiliza el middleware 'upload' para procesar la imagen
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('Error al subir la imagen:', err.message);
            req.flash('error_msg', 'Error al subir la imagen.');
            res.redirect('/events/admin-participant');
            return;
        }

        try {
            const { name, imageUrl } = req.body;
            const newParticipant = new Participant({ name, imageUrl });
            await newParticipant.save();
            console.log(newParticipant);
            req.flash('success_msg', 'Participante añadido correctamente');
            res.redirect('/events/admin-participant');
        } catch (error) {
            console.error('Error al guardar el participante:', error);
            req.flash('error_msg', 'Error al guardar el participante.');
            res.redirect('/events/admin-participant');
        }
    });
};

eventsCtrl.deleteParticipant = async (req, res) => {
    try {
        const participantId = req.params.id;
        await Participant.findByIdAndDelete(participantId);

        //Eliminar referencias en Eventparticipant asociadas al participante eliminado
        await Eventparticipant.deleteMany({ id_participant: participantId });

        res.redirect('/events/admin-participant');
    } catch (error) {
        console.error('Error al eliminar el participante:', error);
        req.flash('error_msg', 'Error al eliminar el participante.');
        res.redirect('/events/admin-participant');
    }
};

eventsCtrl.addVotetoParticipant = async (req, res) => {
    try {
        const { participantId, eventId } = req.body;

        if (!participantId || !eventId) {
            return res.status(400).json({ error: 'IDs de participante o evento inválidos' });
        }

        const eventParticipant = await Eventparticipant.findOneAndUpdate(
            {
                id_event: eventId,
                id_participant: participantId
            },
            { $inc: { votes: 1 } }, // Incrementar el campo 'votes' en 1 s
            { new: true } // Devolver el documento actualizado
        );

        if (!eventParticipant) {
            return res.status(404).json({ error: 'Participante o evento no encontrado' });
        }

        // Aquí podrías agregar validaciones adicionales si fuera necesario
        // Por ejemplo, comprobar si el evento está activo, etc.

        req.flash('success_msg', 'Has enviado tus votos correctamente!');
        res.redirect(`/eventos/${eventId}`); 

    } catch (error) {
        req.flash('error_msg', 'Error al ejecutar el voto.');
        res.redirect('/eventos/${eventId}');
    }
};

eventsCtrl.updateEventStatus = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);

        event.isActive = !event.isActive;

        await event.save();

        req.flash("success_msg", "El evento se actualizo correctamente de estado!");
        res.redirect('/events/administration');

    } catch (error) {
        console.error('Error al actualizar el estado del evento:', error);
        req.flash("error_msg", "Hubo un error al actualizar el evento");
        res.redirect('/events/administration');
    }
};


module.exports = eventsCtrl;
