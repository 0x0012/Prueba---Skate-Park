/*
 * Prueba - Skate Park
 * @author Max Coronado Lorca
 * @description Servidor HTTP & APIRESTful
 */

const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const expressFileUpload = require('express-fileupload')
const path = require('path')
const jwt = require('jsonwebtoken')
const { isValidLogin, getSkater, getSkaters, newSkater, updateSkater, deleteSkater } = require('./queries')

const app = express()

// Body parsing middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Lanza servidor
app.listen(3000, console.log('(⌐■_■) SERVER ONLINE >>', { port: 3000, url: 'http://localhost:3000' }))

// Disponibiza rutas para carpeta publica, bootstrap, jquery y axios
app.use(express.static('public'))
app.use('/bscss', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')))
app.use('/bsjs', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js/bootstrap.min.js')))
app.use('/jq', express.static(path.join(__dirname, '/node_modules/jquery/dist/jquery.min.js')))
app.use('/axios', express.static(path.join(__dirname, '/node_modules/axios/dist/axios.min.js')))

// Confugura expressFileUpload
app.use(expressFileUpload({
  limits: { filesize: 5 * 1024 * 1024 },
  abortOnLimit: true,
  responseOnLimit: 'El tamaño de la imagen supera el maximo permitido de 5MB'
}))

// Configura y establece el motor Handlebars
app.engine(
  'hbs',
  engine({
    layoutsDir: path.join(__dirname, '/views'),
    partialsDir: path.join(__dirname, '/views/components'),
    extname: 'hbs',
  })
)

app.set('view engine', 'hbs')

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Disponibiliza rutas por defecto
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// Ruta raiz 
app.get('/', (_, res) => res.render('index', { layout: 'index' }))

// Rutas para el inicio de sesion
app.get('/login', (_, res) => res.render('login', { layout: 'login' }))
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    if (await isValidLogin(email, password)) {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 300,
          data: { email, password }
        },
        'ALFAOMEGAROJO'
      )
      res.send(token)
    } else {
      res.send(false)
    }
  } catch (err) {
    res.send(false)
  }
})

// Ruta para el registro de un nuevo skater
app.get('/register', (_, res) => res.render('register', { layout: 'register' }))

// Ruta para la edicion de un skater logeado
app.get('/edit', (req, res) => {
  const { token } = req.query
  jwt.verify(token, 'ALFAOMEGAROJO', (err, decoded) => {
    err
      ? res.status(401).send({
          error: '401 Unauthorized',
          message: err.message
        })
      : res.render('edit', { layout: 'edit', email: decoded.data.email })
  })
})

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Disponibiliza rutas APIRESTful
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

//Ruta para obtener listado de todos los registros
app.get('/api/skaters', async (_, res) => {
  const respond = await getSkaters()
  res.send(respond)
})

// Ruta para crear un nuevo registro
app.post('/api/skater', async (req, res) => {
  try {
    const { imgFile } = req.files
    const skater = req.body
    imgFile.mv(path.join(__dirname,'public/img/', imgFile.name))
    await newSkater(skater)
    res.send('Registro creado con exito')
  } catch {
    res.send('No se pudo realizar el registro')
  }
})

// Ruta para obtener datos de un registro dato su email
app.get('/api/skater/:email', async (req, res) => {
  const { email } = req.params
  const respond = await getSkater(email)
  res.send(respond)
})

// Ruta para la edicion de un skater
app.put('/api/skater', (req, res) => {
  const { token } = req.query
  const skater = req.body
  
  jwt.verify(token, 'ALFAOMEGAROJO', async (err, decoded) => {
    if (err) {
      res.send('No se pudo actualizar el registro: Sin permiso o permiso expirado')
    } else {
      try {
        await updateSkater(skater)
        res.send('Registro actualizado con exito')
      } catch {
        res.send('No se pudo actualizar el registro')
      }
    }
  })
})

// Ruta para eliminar un skater
app.delete('/api/skater/:email', (req, res) => {
  const { token } = req.query
  const { email } = req.params
  
  jwt.verify(token, 'ALFAOMEGAROJO', async (err, decoded) => {
    if (err) {
      res.send('No se pudo eliminar el registro: Sin permiso o permiso expirado')
    } else {
      try {
        await deleteSkater(email)
        res.send('Registro eliminado con exito')
      } catch {
        res.send('No se pudo eliminar el registro')
      }
    }
  })
})
