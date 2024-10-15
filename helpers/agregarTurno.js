
const { ObtenerListaObjetos, ObtenerListaRecordatoriosObjetos } = require('./obtenerTurnos');
const { guardarJson, guardarRecordatorisJson } = require('../db/funcionesJson');

function agregarObjeto(objeto){
    //obtener lista actual de objetos 
    let lista = ObtenerListaObjetos()
    // let lista = []
    objeto.id = lista.push(objeto) //Agregamos un id al objeto
    // console.log(lista)
    //guardar en un json 

    // Función para guardar turnos en un archivo  
    guardarJson(lista)

}

function agregarRecordatorio(objeto){
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
    agregarObjeto,
    agregarRecordatorio
}