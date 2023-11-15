const eventsCtrl = {};
const multer = require('multer');
const Event = require('../models/Event');
const Participant = require('../models/Participant');
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
        style: 'add.css', participants
    });
};

eventsCtrl.createNewEvent = async (req, res) => {
    const { title, date, datef, participants } = req.body;
    const newEvent = new Event({ title, date, datef, participants });
    await newEvent.save();
    console.log(newEvent);
    res.redirect('/events/administration');
};

eventsCtrl.renderEvents = async (req, res) => {
    const events = await Event.find().lean();
    const style = 'all-events.css';
    res.render('events/all-events', { events, style });
};

eventsCtrl.renderAdminevents = async (req, res) => {
    const events = await Event.find().lean();
    const style = 'all-events.css';
    res.render('events/administration/adminevent', { events, style });
};

eventsCtrl.renderEditForm = (req, res) => {
    res.send('Render EditForm');
};

eventsCtrl.updateEvent = (req, res) => {
    res.send('update event');
};

eventsCtrl.deleteEvent = async (req, res) => {
    await Event.findByIdAndDelete(req.params.id);
    res.redirect('/events/administration');
};

// Funciones para participantes

eventsCtrl.renderAdminParticipant = async (req, res) => {
    const participants = await Participant.find().lean();
    res.render('events/administration/admin-participant', {
        style: 'admin-participant.css', participants
    });
};

eventsCtrl.AddParticipant = async (req, res) => {
    // Utiliza el middleware 'upload' para procesar la imagen
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('Error al subir la imagen:', err.message);
            req.flash('error_msg', 'Error al subir la imagen.');
            res.redirect('/events/admin-participant');
            return;
        }

        try {
            const { name, votes, imageUrl } = req.body;
            const newParticipant = new Participant({ name, votes, imageUrl });
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
    await Participant.findByIdAndDelete(req.params.id);
    res.redirect('/events/admin-participant');
};

// Vista de evento
eventsCtrl.renderEventid = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId).populate('participants').lean();

        if (!event) {
            return res.status(404).send('Evento no encontrado');
        }

        const participants = event.participants;
        const participantsChunks = [];

        const chunkSize = 3; // Cambia según la cantidad de participantes que desees en cada carrusel

        for (let i = 0; i < participants.length; i += chunkSize) {
            participantsChunks.push(participants.slice(i, i + chunkSize));
        }

        res.render('events/event', { event, style: 'signin.css', participantsChunks });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los detalles del evento');
    }

};

//Funcion para los votos
eventsCtrl.addVotetoParticipant = async (req, res) => {
    try {
        const { participantId, eventId } = req.body;

        // Supongamos que recibes el número de votos desde la solicitud
        const votesToAdd = 1;

        // Busca el participante y el evento
        const participant = await Participant.findById(participantId);
        const event = await Event.findById(eventId);

        // Verifica si el participante y el evento existen
        if (!participant || !event) {
            return res.status(404).json({ error: 'Participante o evento no encontrado' });
        }

        // Verifica si el participante ya está asociado al evento
        const existingEvent = participant.events.find((ev) => ev.event.equals(eventId));
        if (!existingEvent) {
            return res.status(400).json({ error: 'El participante no está asociado a este evento' });
        }

        // Actualiza los votos en el contexto del evento
        existingEvent.votes += votesToAdd;

        // Guarda los cambios en el participante
        await participant.save();

        res.status(200).json({ message: 'Voto agregado exitosamente' });
    } catch (error) {
        console.error('Error al agregar voto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



module.exports = eventsCtrl;
