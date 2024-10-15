
const { ObtenerListaRecordatoriosObjetos } = require('./obtenerTurnos');
const { guardarRecordatorisJson } = require('../db/funcionesJson');

function agregarObjeto(objeto){
    //obtener lista actual de objetos 
    let lista = ObtenerListaRecordatoriosObjetos()
    // let lista = []
    objeto.id = lista.push(objeto) //Agregamos un id al objeto
    // console.log(lista)
    //guardar en un json 

    // Función para guardar turnos en un archivo  
    guardarRecordatorisJson(lista)

}
module.exports = {
    agregarObjeto
}