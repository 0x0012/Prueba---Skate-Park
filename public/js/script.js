/*
 * Prueba - Skate Park
 * @author Max Coronado Lorca
 * @description Script Cliente
 */

// Obtiene registros de skater al cargar la ruta /
$(document).ready( _ => {
  getSkaters()  // TODO: exec only on /
})

// Obtiene registro de skater y los muetra en la tabla
const getSkaters = async _ => {
  await axios.get('/api/skaters')
    .then( data => {
      const skaters = data.data
      skaters.forEach(s => {
        estado = s.estado
          ? '<span class="text-success">Aprobado</span>'
          : '<span class="text-warning">En revisión</span>'
        $('tbody').append(`
          <tr>
            <td>${s.id}</td>
            <td><img src="img/${s.foto}"></td>
            <td>${s.nombre}</td>
            <td>${s.anos_experiencia}</td>
            <td>${s.especialidad}</td>
            <td>${estado}</td>
          </tr>  
        `)
      })
    })
}

// Boton de registrar usuario en /register
$('#frm-register').click(async event => {
  event.preventDefault()
  if (validateForm()) {
    const imgFile = $('#frm-img')[0].files[0]
    const data = {
      email: $('#frm-email').val(),
      nombre: $('#frm-nombre').val(),
      password: $('#frm-password').val(),
      experiencia: $('#frm-experiencia').val(),
      especialidad: $('#frm-especialidad').val(),
      foto: imgFile.name,
      imgFile: imgFile
    }
    await axios.post('/api/skater', data, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }).then( _ => alert('oki'))
  }
})

// Boton de iniciar sesion en /login
$('#login-button').click(async event => {
  event.preventDefault()
  if (_isMail($('#login-email').val()) && $('#login-password').val() !== '') {
    await axios.post('/login', {
      email: $('#login-email').val(),
      password: $('#login-password').val()
    })
      .then( t => {
        const token = t.data
        if (token) {
          localStorage.setItem('token', JSON.stringify(token))
          window.location = '/edit'
        } else {
          alert('El email del skater no existe o el password es incorrecto')
        }
      })
  } else {
    alert('Ingrese correctamente todos los campos')
  }
})

// Valida el contenido del formulario
const validateForm = _ => {
  const isMail = _isMail($('#frm-email').val()) // Valida direccion de correo
  const areSamePassword = $('#frm-password').val() === $('#frm-repassword').val() // Verifica que los dos password ingresados sean los mismos
  // Valida que ninguno de los campos este vacio
  const notEmpty = _ => {
    if ($('#frm-nombre').val() === '') return false
    if ($('#frm-experiencia').val() === '') return false
    if ($('#frm-especialidad').val() === '') return false
    if ($('#frm-password').val() === '') return false
    if ($('#frm-img').val() === '') return false
    return true 
  }
  
  // Devuelve true si pasa validacion, sino false y muestra mensaje al cliente
  if (isMail && areSamePassword && notEmpty()) {
    return true
  } else {
    const msg = _ => {
      let msg = 'Por favor corrija los siguientes problemas: '
      if (!isMail) msg += '<< La dirección de email no es válida >> '
      if (!areSamePassword) msg += '<< El password no es el mismo >> ' 
      if (!notEmpty()) msg += '<< Se deben completar todos los campos >> '
      return msg
    }
    alert(msg())
    return false
  }
}

// Valida si una cadena de texto corresponde a una direccion de email valida
const _isMail = string => {
  const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return pattern.test(string)
}
