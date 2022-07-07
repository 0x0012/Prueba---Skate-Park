/*
 * Prueba - Skate Park
 * @author Max Coronado Lorca
 * @description Servidor HTTP & APIRESTful
 */

import express from 'express'
import { engine } from 'express-handlebars'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Lanza servidor
app.listen(3000, console.log('(⌐■_■) SERVER ONLINE >>', {port: 3000, url: 'http://localhost:3000'}))

// Disponibiza rutas para carpeta publica y bootstrap
app.use(express.static('public'))
app.use('/bscss', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css/bootstrap.min.css')))
app.use('/bsjs', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js/bootstrap.min.js')))

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