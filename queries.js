/*
 * Prueba - Skate Park
 * @author Max Coronado Lorca
 * @description Consultas PostgreSQL
 */

const { Pool } = require('pg')

// Configuracion de base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  password: 'sirio',
  database: 'skatepark',
  port: 5432
})

// Valida un password para un email espeficado
const isValidLogin = async (email, password) => {
  try {
    const { rows: result } = await pool.query(`
      SELECT password FROM skaters WHERE email = '${email}' 
    `)
    return password === result[0].password
  } catch (err) {
    console.error('ERROR ->', { CODE: err.code, MESSAGE: err.message })
    throw err
  }
}

// Devuelve un registro dado un email especifico
const getSkater = async email => {
  try {
    const { rows: result } = await pool.query(`
      SELECT email, nombre, anos_experiencia, especialidad 
      FROM skaters 
      WHERE email = '${email}'
    `)
    return result
  } catch (err) {
    console.error('ERROR ->', { CODE: err.code, MESSAGE: err.message })
    return err
  }
}

// Devuelve todos los registros de skaters
const getSkaters = async _ => {
  try {
    const { rows: result } = await pool.query(`
      SELECT id, foto, nombre, anos_experiencia, especialidad, estado 
      FROM skaters 
      ORDER BY id ASC
    `)
    return result
  } catch (err) {
    console.error('ERROR ->', { CODE: err.code, MESSAGE: err.message })
    return err
  }
}

// Crea un nuevo registro
const newSkater = async skater => {
  try {
    const { rows: result } = await pool.query(`
      INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) 
      VALUES ('${skater.email}', '${skater.nombre}', '${skater.password}', ${skater.experiencia}, '${skater.especialidad}', '${skater.foto}', FALSE) 
      RETURNING *
    `)
    return result
  } catch (err) {
    console.error('ERROR ->', { CODE: err.code, MESSAGE: err.message })
    throw err
  }
}

// Actualiza un registro
const updateSkater = async skater => {
  try {
    const { rows: result } = await pool.query(`
      UPDATE skaters SET 
        nombre = '${skater.nombre}',
        password = '${skater.password}',
        anos_experiencia = ${skater.experiencia},
        especialidad = '${skater.especialidad}' 
      WHERE email = '${skater.email}' 
      RETURNING *
    `)
    return result
  } catch (err) {
    console.error('ERROR ->', { CODE: err.code, MESSAGE: err.message })
    throw err
  }
}

// Elimina un registro dado su email
const deleteSkater = async email => {
  try {
    const { rows: result } = await pool.query(`
      DELETE FROM skaters WHERE email = '${email}'
    `)
    return result
  } catch (err) {
    console.error('ERROR ->', { CODE: err.code, MESSAGE: err.message })
    throw err
  }
}

module.exports = { isValidLogin, getSkater, getSkaters, newSkater, updateSkater, deleteSkater }