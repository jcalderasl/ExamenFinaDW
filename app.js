// Importa las dependencias necesarias.
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors'); // Importa CORS.

// Habilita CORS.
app.use(cors());

// URL de conexión a la base de datos MongoDB.
const url = 'mongodb://127.0.0.1:27017/ClinicaDB';

// Conecta a la base de datos MongoDB.
mongoose.connect(url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a la base de datos')) // Imprime un mensaje si la conexión es exitosa.
.catch((e) => console.log('Error de conexión:' + e)); // Maneja errores de conexión.

// Define el esquema de la película utilizando Mongoose.
const pacienteSchema = mongoose.Schema({
    nombre: String,      
    direccion: String,  
    fechaNacimiento: Date,  
    sexo: String,     
    DPI: Number,   
    telefono: Number,   
    fechaVisita: Date,
    email: String,
    diagnosticos: String,
    tratamientos: String,
    alergias: String,
    enfermedades: String
}, { versionKey: false }); // Evita la generación de un campo "__v" en los documentos.

// Crea un modelo a partir del esquema, que se utilizará para interactuar con la base de datos.
const PacienteModel = mongoose.model('pacientes', pacienteSchema);


// Configura el servidor Express.
app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta 'public'.
app.use(express.json()); // Permite recibir datos JSON en las solicitudes POST.



// Define una ruta para obtener la lista de pacientes.
app.get('/pacientes', async (req, res) => {
    const pacientes = await PacienteModel.find(); // Busca todos los pacientes en la base de datos.
    res.json(pacientes); // Devuelve la lista de pacientes en formato JSON.
});





// Define una ruta para consultar pacientes por nombre, insensible a mayúsculas y minúsculas.
app.get('/pacientes/consultar', async (req, res) => {
    const nombreConsulta = req.query.nombre; // Obtiene el nombre del paciente a consultar desde los parámetros de la URL.
    const regex = new RegExp(nombreConsulta, 'i'); // Crea una expresión regular insensible a mayúsculas y minúsculas.
    
    // Realiza la búsqueda con la expresión regular.
    const pacientes = await PacienteModel.find({ nombre: regex });

    res.json(pacientes); // Devuelve la lista de pacientes en formato JSON.
});




// Define una ruta para agregar un paciente.
app.post('/pacientes', async (req, res) => {
    const paciente = new PacienteModel(req.body); // Crea una nueva instancia de PacienteModel con los datos recibidos.
    const result = await paciente.save(); // Guarda paciente en la base de datos.
    res.json(result); // Devuelve paciente creada en formato JSON.
});

// Define una ruta para actualizar un paciente existente.
app.put('/pacientes/:id', async (req, res) => {
    try {
        const paciente = await PacienteModel.findOneAndUpdate(
            { _id: req.params.id }, // Encuentra paciente por su ID.
            req.body, // Actualiza paciente con los datos recibidos.
            { new: true } // Devuelve paciente actualizada.
        );
        if (!paciente) {
            return res.status(404).json({ error: 'Paciente no encontrada' });
        }
        res.json(paciente); // Devuelve paciente actualizada en formato JSON.
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el paciente' });
    }
});

// Define una ruta para eliminar paciente existente.
app.delete('/pacientes/:id', async (req, res) => {
    try {
        const paciente = await PacienteModel.findByIdAndDelete(req.params.id); // Encuentra paciente por su ID y la elimina.
        if (!paciente) {
            return res.status(404).json({ error: 'Paciente no encontrada' });
        }
        res.json({ message: 'Paciente eliminada exitosamente' }); // Devuelve un mensaje de éxito.
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el paciente' });
    }
});





const path = require('path');
const bodyParser = require('body-parser');


const bcrypt = require('bcrypt');

const User = require('./public/user');
const jwt = require('jsonwebtoken'); // Importa la librería JWT

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const mongo_uri = 'mongodb://127.0.0.1:27017/usuairos';



// Para registrar el usuario
app.post('/register', (req, res) => {
  const { username, password, nombre, rol, apellido, fechaNacimiento, direccion } = req.body;
  const user = new User({ username, password, nombre, rol, apellido, fechaNacimiento, direccion });

  user.save()
    .then(() => {
      res.status(200).send('Usuario registrado');
    })
    .catch((err) => {
      res.status(500).send('Error al registrar al usuario');
    });
});

// Para autenticar y generar el token JWT
app.post('/authenticate', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }) // Utilizamos findOne en lugar de find para obtener un solo usuario
    .then((user) => {
      if (!user) {
        res.status(500).send('El usuario no existe');
      } else {
        user.isCorrectPassword(password, (err, result) => {
          if (err) {
            res.status(500).send('Error al autenticar');
          } else if (result) {
            const token = generateJWT(user);
            res.status(200).json({ token }); // Enviamos el token en formato JSON
          } else {
            res.status(500).send('Usuario y/o contraseña incorrectas');
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).send('Error al autenticar al usuario');
    });
});


// Middleware para verificar el token JWT
const verifyJWT = (req, res, next) => {
  const token = req.query.token; // Recibimos el token como parámetro de consulta en la URL
  if (!token) {
    return res.status(401).send('Token no proporcionado en la URL');
  }

  jwt.verify(token, 'Jesus21', (err, decoded) => { // Reemplaza 'Jesus21' con tu clave secreta real
    if (err) {
      return res.status(401).send('Token no válido');
    }
    req.user = decoded;
    next();
  });
};


// Ruta protegida que redirige al usuario a la página gestion.html si está autenticado
app.get('/protected-route', verifyJWT, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gestion.html'));
});





// Función para generar tokens JWT
function generateJWT(user) {
  const token = jwt.sign({ username: user.username }, 'Jesus21', { expiresIn: '1h' }); // Reemplaza 'clave_secreta' con tu clave secreta real
  return token;
}

app.listen(3000, () => {
  console.log('El servidor se inició en el puerto 3000');
});

//http://localhost:3000/protected-route?token=



