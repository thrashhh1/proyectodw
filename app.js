const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Para el hash de contraseñas

const app = express();
const port = process.env.PORT || 3000;

// Conexión a MongoDB (reemplaza 'mongodb://localhost/tu-base-de-datos' con tu URL de MongoDB)
mongoose.connect('mongodb://localhost/tu-base-de-datos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión a MongoDB establecida');
});

// Modelo de usuario
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Configuración para procesar datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para mostrar el formulario de registro
app.get('/registrar', (req, res) => {
  res.render('registro'); // 'registro' es el nombre del archivo de vista Handlebars
});

// Ruta para manejar el envío del formulario de registro
app.post('/registrar', (req, res) => {
  const { email, password } = req.body;

  // Crea un nuevo usuario utilizando el modelo
  const newUser = new User({ email, password });

  // Guarda el usuario en la base de datos
  newUser.save((err) => {
    if (err) {
      console.error('Error al guardar el usuario:', err);
      // Maneja el error adecuadamente, por ejemplo, muestra un mensaje de error al usuario.
    } else {
      // Usuario registrado con éxito, redirige a una página de inicio de sesión o confirmación.
      res.redirect('/login');
    }
  });
});

// Ruta para mostrar el formulario de inicio de sesión
app.get('/login', (req, res) => {
  res.render('login'); // 'login' es el nombre del archivo de vista Handlebars
});

// Ruta para manejar el envío del formulario de inicio de sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Aquí debes agregar la lógica de autenticación. Puedes consultar la base de datos para verificar las credenciales.

  // Ejemplo de verificación básica con bcrypt (debes adaptar esta lógica según tus necesidades)
  User.findOne({ email }, (err, user) => {
    if (err) {
      console.error('Error al buscar el usuario:', err);
      // Maneja el error adecuadamente, por ejemplo, muestra un mensaje de error al usuario.
    } else if (user) {
      // Compara la contraseña proporcionada con el hash almacenado en la base de datos
      bcrypt.compare(password, user.password, (compareErr, match) => {
        if (compareErr) {
          console.error('Error al comparar contraseñas:', compareErr);
          // Maneja el error adecuadamente, por ejemplo, muestra un mensaje de error al usuario.
        } else if (match) {
          // Las contraseñas coinciden, el inicio de sesión es exitoso
          res.redirect('/adminindex'); // Redirige a la página de inicio de administrador
        } else {
          // Contraseña incorrecta, muestra un mensaje de error
          res.render('login', { error: 'Credenciales incorrectas' });
        }
      });
    } else {
      // El usuario no existe, muestra un mensaje de error
      res.render('login', { error: 'Usuario no encontrado' });
    }
  });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});



