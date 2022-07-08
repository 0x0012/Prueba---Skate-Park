/*
 * Prueba - Skate Park
 * @author Max Coronado Lorca
 * @description Script Cliente
 */

// Obtiene registro de skater al cargar
$(document).ready( _ => {
  const header = $('h2').text()
  if (header == 'Lista de Participantes') getSkaters()
  if (header == 'Datos del perfil') getSkaterData(skaterEmail)
})

// Obtiene los datos de un usuario especificando su email
const getSkaterData = async email => {
  await axios.get('api/skater/' + email)
    .then( data => {
      const skater = data.data[0]
      $('#frm-email').val(skater.email)
      $('#frm-email').attr('disabled', 'disabled')
      $('#frm-nombre').val(skater.nombre)
      $('#frm-experiencia').val(skater.anos_experiencia)
      $('#frm-especialidad').val(skater.especialidad)
    })
}

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
  if (validateRegisterForm()) {
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
    }).then(d => {
        alert(d.data)
        window.location = '/'
      })
  }
})

// Boton de actualizar usuario en /edit
$('#frm-update').click(async event => {
  event.preventDefault()
  if (validateUpdateForm()) {
    const token = JSON.parse(localStorage.getItem('token'))
    const data = {
      email: $('#frm-email').val(),
      nombre: $('#frm-nombre').val(),
      password: $('#frm-password').val(),
      experiencia: $('#frm-experiencia').val(),
      especialidad: $('#frm-especialidad').val()
    }
    await axios.put(`/api/skater?token=${token}`, data)
      .then(d => {
        alert(d.data)
        window.location = '/'
      })
  }
})

// Boton para borrar usuario en /edit
$('#frm-delete').click(async event => {
  event.preventDefault()
  const token = JSON.parse(localStorage.getItem('token'))
  const email = $('#frm-email').val()
  await axios.delete(`/api/skater/${email}?token=${token}`)
    .then(d => {
      alert(d.data)
      window.location = '/'
    })
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
          window.location = `/edit?token=${token}`
        } else {
          alert('El email del skater no existe o el password es incorrecto')
        }
      })
  } else {
    alert('Ingrese correctamente todos los campos')
  }
})

// Valida el contenido del formulario de registro
const validateRegisterForm = _ => {
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
  
  // Devuelve true si pasa validacion, sino muestra mensaje al cliente y devuelve false
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

// Valida el contenido del formulario de actualizacion
const validateUpdateForm = _ => {
  const areSamePassword = $('#frm-password').val() === $('#frm-repassword').val() // Verifica que los dos password ingresados sean los mismos
  
  // Valida que ninguno de los campos este vacio
  const notEmpty = _ => {
    if ($('#frm-nombre').val() === '') return false
    if ($('#frm-experiencia').val() === '') return false
    if ($('#frm-especialidad').val() === '') return false
    if ($('#frm-password').val() === '') return false
    return true 
  }
  
  // Devuelve true si pasa validacion, sino muestra mensaje al cliente y devuelve false
  if (areSamePassword && notEmpty()) {
    return true
  } else {
    const msg = _ => {
      let msg = 'Por favor corrija los siguientes problemas: '
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
