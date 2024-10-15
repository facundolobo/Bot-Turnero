const { mostrarJson, mostrarRecordatoriosJson } = require('../db/funcionesJson');
//Funcion para mostrar objetos de la lista como string
function mostrarObjetos(){

    let data = mostrarJson()

    let result = data.map(obj => {  
        return `  
        /****************/  
        "Id": ${obj.id},  
        "nombreCliente": "${obj.nombreCliente}",  
        "numeroTel": "${obj.numeroTel}",  
        "fecha": ${obj.day}/${obj.month}/${obj.year} - ${obj.hour}:${obj.minute},  
        "trabajo": "${obj.trabajo}"  
        /****************/`;  
            }).join("\n");  
   
   return result 
  
}

//Funcion para mostrar objetos de la lista recordatorios como string
function mostrarRecordatorios(){

    let data = mostrarRecordatoriosJson()

    let result = data.map(obj => {  
        return `  
        /****************/  
        "Id": ${obj.id},  
        "nombreCliente": "${obj.nombreCliente}",  
        "numeroTel": "${obj.numeroTel}",  
        "fecha": ${obj.day}/${obj.month}/${obj.year} - ${obj.hour}:${obj.minute},  
        "trabajo": "${obj.trabajo}"  
        /****************/`;  
            }).join("\n");  
   
   return result 
  
}

function ObtenerListaObjetos(){

    let data = mostrarJson()

    return data
  
}

function ObtenerListaRecordatoriosObjetos(){

    let data = mostrarRecordatoriosJson()

    return data
  
}

module.exports = {
    ObtenerListaObjetos,
    mostrarObjetos,
    ObtenerListaRecordatoriosObjetos,
    mostrarRecordatorios
}