/*
 * Prueba - Skate Park
 * @author Max Coronado Lorca
 * @description Script Cliente
 */

$(document).ready( _ => {
  getSkaters()  // TODO: exec only on /
})

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

const validateForm = _ => {
  const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const isMail = pattern.test($('#frm-email').val())
  const areSamePassword = $('#frm-password').val() === $('#frm-repassword').val()
  const notEmpty = _ => {  
    if ($('#frm-nombre').val() === '') return false
    if ($('#frm-experiencia').val() === '') return false
    if ($('#frm-especialidad').val() === '') return false
    if ($('#frm-password').val() === '') return false
    if ($('#frm-img').val() === '') return false
    return true 
  }
  
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
