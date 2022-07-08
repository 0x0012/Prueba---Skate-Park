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
const { getSkaters, newSkater } = require('./queries')

const app = express()

// Body parsing middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Lanza servidor
app.listen(3000, console.log('(⌐■_■) SERVER ONLINE >>', {port: 3000, url: 'http://localhost:3000'}))

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

// Disponibiliza rutas por defecto
app.get('/', (_, res) => res.render('index', { layout: 'index' }))
app.get('/login', (_, res) => res.render('login', { layout: 'login' }))
app.get('/register', (_, res) => res.render('register', { layout: 'register' }))

// Disponibiliza rutas APIRESTful
app.get('/api/skaters', async (_, res) => {
  const respond = await getSkaters()
  res.send(respond)
})

app.post('/api/skater', async (req, res) => {
  try {
    const { imgFile } = req.files
    const skater = req.body
    imgFile.mv(path.join(__dirname,'public/img/', imgFile.name))
    respond = await newSkater(skater)
    res.send(respond)
  } catch (err) {
    res.send(err)
  }
})