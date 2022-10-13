'use strict';

var mysql = require('mysql');
const axios = require('axios');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  port: '3306',
  database: 'prueba'

});

module.exports.traduccion = async (event) => {

  try {
    const response = await axios.get('https://swapi.py4e.com/api/people/');
    const mapeo = response.data.results.map(
      item => {
        return {
          nombre: item.name,
          altura: item.height,
          colorOjos: item.eye_color,
          cumpleanio: item.birth_Year,
          genero: item.gender,
          peliculas: item.films
        }
      }
    )
    return {
      statusCode: 200,
      body: JSON.stringify(

        {
          response: mapeo,
        },
      )
    };

  } catch (error) {
    console.error(`errorcito`, error);
  }
}

module.exports.crearUsuario = async (event) => {

  connection.connect();
  const payload = JSON.parse(event.body);
  var post = { nombre: payload.nombre, fechadenacimiento: payload.fechadenacimiento, telefono: payload.telefono };
  connection.query('INSERT INTO usuario SET ?', post, function (error, results, fields) {
    if (error) throw error;

  });
  connection.end();
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Usuario Creado Correctamente",
      },
    ),
  };

}

module.exports.muestraUsuario = async (event) => {

  let resultados;

  connection.connect();
  connection.query('SELECT * from usuario', function (error, results, fields) {
    if (error) throw error;
    resultados = results;
  });
  connection.end();
  return resultados;

}

