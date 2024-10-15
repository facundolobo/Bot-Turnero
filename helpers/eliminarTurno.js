const fs = require('fs');
const { ObtenerListaObjetos, ObtenerListaRecordatoriosObjetos } = require('./obtenerTurnos');
const { guardarJson, guardarRecordatorisJson } = require('../db/funcionesJson');

//Funcion para eliminar objetos de la lista
function eliminarObjeto(idAEliminar){

    //obtener lista actual de objetos 
    let lista = ObtenerListaObjetos()

    lista = lista.filter(objeto => objeto.id !== idAEliminar)
    console.log("lista con un eleminado", lista)

    // Función para guardar turnos en un archivo  
    guardarJson(lista)

    return lista
}

//Funcion para eliminar un recordatorio 
function eliminarUnRecordatorio(idAEliminar){

    //obtener lista actual de objetos 
    let lista = ObtenerListaRecordatoriosObjetos()

    lista = lista.filter(objeto => objeto.id !== idAEliminar)
    console.log("recordatorios despeus de eliminar uno", lista)

    // Función para guardar turnos en un archivo  
    guardarRecordatorisJson(lista)

    return lista
}
module.exports = {
    eliminarObjeto,
    eliminarUnRecordatorio
}