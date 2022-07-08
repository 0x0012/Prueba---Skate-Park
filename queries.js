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
    return err
  }
}

module.exports = { getSkaters, newSkater }