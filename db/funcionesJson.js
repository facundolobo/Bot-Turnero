const fs = require('fs');
// Función para guardar turnos en un archivo  
function guardarJson (lista = []){
    fs.writeFileSync('db/turnos.json', JSON.stringify(lista, null, 2), (err) => {  
        if (err) {  
            console.error('Error al guardar turnos:', err);  
        } else {  
            console.log('Turnos guardados en turnos.json');  
        }  
    }); 
}

// Función para obtener datos de un archivo
function mostrarJson (){
    let data =  fs.readFileSync('db/turnos.json', 'utf8',);
    data = JSON.parse(data)
    return data
}

// Función para obtener los recordatorios de un archivo
function mostrarRecordatoriosJson (){
    let data =  fs.readFileSync('db/recordatorios.json', 'utf8',);
    data = JSON.parse(data)
    return data
}

// Función para guardar recordatorios en un archivo  
function guardarRecordatorisJson (lista = []){
    fs.writeFileSync('db/recordatorios.json', JSON.stringify(lista, null, 2), (err) => {  
        if (err) {  
            console.error('Error al guardar turnos:', err);  
        } else {  
            console.log('Turnos guardados en turnos.json');  
        }  
    }); 
}

module.exports = {
    guardarJson,
    mostrarJson,
    mostrarRecordatoriosJson,
    guardarRecordatorisJson
}