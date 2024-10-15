const fs = require('fs');
const qrcode = require('qrcode-terminal')
const { Client, LocalAuth } = require('whatsapp-web.js');
const { agregarObjeto, agregarRecordatorio } = require('./helpers/agregarTurno');
const { mostrarObjetos, ObtenerListaObjetos, mostrarRecordatorios } = require('./helpers/obtenerTurnos');
const { eliminarObjeto, eliminarUnRecordatorio } = require('./helpers/eliminarTurno');
const { obtenerFechaHoy, obtenerFechaManiana } = require('./helpers/obtenerFechas');
const schedule = require('node-schedule'); 
const { mostrarRecordatoriosJson } = require('./db/funcionesJson');


// Almacenar los recordatorios programados para evitar duplicados  

function scheduleMessages(recordatorios) {  
    // Cancelar todos los trabajos programados solo si existen  
    if (Object.keys(schedule.scheduledJobs).length > 0) {  
        for (let jobName in schedule.scheduledJobs) {  
            schedule.scheduledJobs[jobName].cancel();  
        }  
    }  

    recordatorios.forEach(recordatorio => {  
        if (!recordatorio.enviado) { // Verificar si no se ha enviado  
            const { day, month, year, hour, minute, nombreCliente, trabajo, numeroTel } = recordatorio;  
            const fechaEnvio = new Date(year, month - 1, day, hour, minute);  

            console.log(`Programando mensaje para ${nombreCliente} el ${fechaEnvio}`);  

            // Programar el mensaje  
            schedule.scheduleJob(fechaEnvio, () => {  
                const chatId = `${numeroTel}@c.us`;  
                const message = `Hola ${nombreCliente}, recorda que tienes un turno para ${trabajo} `;  

                client.sendMessage(chatId, message).then(response => {  
                    console.log(`Mensaje enviado a ${nombreCliente}:`, response);  
                    recordatorio.enviado = true; // Marcar como enviado  
                }).catch(err => {  
                    console.error('Error al enviar el mensaje:', err);  
                });  
            });  
        }  
    });  
} 


/*Iniciar app - Inicio  */
const client = new Client({
    authStrategy: new LocalAuth()
});
client.on('qr', (qr) => {
    qrcode.generate(qr,{small:true})
});

client.on('ready', () => {
    console.log('Client is ready!');


    // Cargar y programar mensajes por primera vez  
    let recordatorios = mostrarRecordatoriosJson();  
    scheduleMessages(recordatorios);  

    // Monitorear el archivo JSON por cambios  
    fs.watchFile('db/recordatorios.json', (curr, prev) => {  
        console.log('Archivo de recordatorios cambiado. Actualizando...');  
        recordatorios = mostrarRecordatoriosJson();  
        scheduleMessages(recordatorios);  
    });  


    // const recordatorios = mostrarRecordatoriosJson();  

    // recordatorios.forEach(recordatorio => {  
    //     // Crear una fecha a partir de los datos del recordatorio  
    //     const { day, month, year, hour, minute, nombreCliente, trabajo, numeroTel } = recordatorio;  
    //     const fechaEnvio = new Date(year, month - 1, day, hour, minute); // Mes - 1 porque en JavaScript enero es 0  

    //     console.log(`Programando mensaje para ${nombreCliente} el ${fechaEnvio}`);  

    //     // Programar el mensaje  
    //     schedule.scheduleJob(fechaEnvio, () => {  
    //         const chatId = `${numeroTel}@c.us`; // Formato correcto para WhatsApp  
    //         const message = `Hola ${nombreCliente}, recordar que tienes un recordatorio para ${trabajo}.`;  

    //         client.sendMessage(chatId, message).then(response => {  
    //             console.log(`Mensaje enviado a ${nombreCliente}:`);  
    //         }).catch(err => {  
    //             console.error('Error al enviar el mensaje:', err);  
    //         });  
    //     });  
    // }); 

});
/*Iniciar app - Fin  */


// Evento para guardar un turno o un recordatorio  
client.on('message_create', async (msg) => {  
    if (msg.fromMe) { // Solo procesamos mensajes que envie yo mismo   
        // Guardar el número y el mensaje en un archivo
        let agendar = ".te agendo ";
        let recuerdo = ".te escribo 1 dia antes a las "
        if ( msg.body.includes(agendar) ){

            let fecha
            if (msg.body.includes('hoy')){
                fecha =  obtenerFechaHoy()
            }else if ( msg.body.includes('mañana')){
                fecha =  obtenerFechaManiana()
            }
            

            // Expresión regular para encontrar la hora en formato HH:MM  
            const regex = /(\d{1,2}):(\d{2})/;   
            // Ejecutar la expresión regular en el texto  
            const resultado = regex.exec(msg.body);  
            
            // Si se encuentra un resultado  
            const hora =  parseInt(resultado[1]); // La hora  
            const minutos = parseInt(resultado[2]); // Los minutos  
            
            //obtener el nombre del contacto
            let chat = await msg.getChat();  
            let contact = await chat.getContact();  

            // Usar el nombre del contacto, o el número si no se encuentra un nombre  
            const contactName = chat.name || contact.number; 

            // Encontrar la posición de la palabra "para"
            const posicionPara = msg.body.indexOf("para");
            let trabajo = ''
            if (posicionPara !== -1) {
                // Extraer el texto después de "para"
                trabajo = msg.body.substring(posicionPara + "para".length).trim();

            }
            let turno = {                        
                nombreCliente: contactName,
                numeroTel: contact.number,
                day: fecha.dia,
                month: fecha.mes,
                year: fecha.anio,
                hour: hora,
                minute: minutos,
                trabajo: trabajo
            }  
            
            /*
            1.1.2 - lo agregamos a la lista turnos 
            */
            agregarObjeto(turno);
            
        }
        if (msg.body.includes(recuerdo)){
            // 1 - Obtenemos la fecha del turno de la persona con el numero al que le enviamos 
                // 1.1 Ver los turnos que tiene ese numero y obtener la fecha
                //obtener el nombre del contacto
                let chat = await msg.getChat();  
                let contact = await chat.getContact(); 
                // Usar el nombre del contacto, o el número si no se encuentra un nombre  // Usar el nombre del contacto, o el número si no se encuentra un nombre  
                const contactName = chat.name || contact.number; 
                const contactnumber = contact.number;  

                //Obtenemos todos los turnos
                let turnos = ObtenerListaObjetos()
                console.log(turnos)
                //filtramos los turnos de solo ese numero
                turnos = turnos.filter(objeto => objeto.numeroTel == contactnumber)

                 // Expresión regular para encontrar la hora en formato HH:MM  
                const regex = /(\d{1,2}):(\d{2})/;   
                // Ejecutar la expresión regular en el texto  
                const resultado = regex.exec(msg.body);  
                
                // Si se encuentra un resultado  
                const hora =  parseInt(resultado[1]); // La hora  
                const minutos = parseInt(resultado[2]); // Los minutos  

                //Obtenido el turno solo debemos cambiar a 1 dia atras y guarar con avisado = false 
                // Crear un objeto Date
                let fecha = new Date(turnos[0].year, turnos[0].month - 1 , turnos[0].day);
                console.log(fecha)
                
                 // Restar un día
                fecha.setDate(fecha.getDate() - 1);
                console.log(fecha)
                // const dia = fechaHoy.getDate(); // Día del mes (1-31)
                // const mes = fechaHoy.getMonth() + 1; // Mes (0-11, por eso se suma 1)
                // const anio = fechaHoy.getFullYear(); // Año completo
                let recordatorio = {                        
                    nombreCliente: contactName,
                    numeroTel: contact.number,
                    day: fecha.getDate(),
                    month: fecha.getMonth() + 1,
                    year: fecha.getFullYear(),
                    hour: hora,
                    minute: minutos,
                    trabajo: turnos[0].trabajo,
                    enviado: false
                }  
                console.log("recordatorio", recordatorio)

            // 3 - guardamos el recordatorio
            agregarRecordatorio(recordatorio);
            // 4 - Creamos la funcion de enviar un wsp a esa paersona en el dia y horario guardado
        }
    }  
}); 

//Evento para mostrar mis turnos o recordatorios 
client.on('message_create', async (msg) => { 
    
    if (msg.from == msg.to ) { // Solo procesamos mensajes que envíes a mi mismo 
        //Evento para mostrar mis turnos 
        if (  msg.body == ".ver mis turnos"){
            // Obtener la lista de turnos.json
            let result = await mostrarObjetos()
           // Uso de la función  
            await client.sendMessage(msg.to, result)
                
        }
        //Evento para mostrar mis turnos 
        if (  msg.body == ".ver mis recordatorios"){
            // Obtener la lista de turnos.json
            let result = await mostrarRecordatorios()
           // Uso de la función  
            await client.sendMessage(msg.to, result)
                
        }
    }

 })

 //Eliminar un turno o recordatorio
client.on('message_create', async (msg) => { 
    let eliminarTurno = ".eliminar turno ";
    let eliminarRecordatorio = ".eliminar recordatorio ";
    if ( msg.body.includes(eliminarTurno) ){

            // Encontrar la posición de la palabra "turno"
            const posicionTurno = msg.body.indexOf("turno");
            let id
            if (posicionTurno !== -1) {
                // Extraer el texto después de "para"
                id = msg.body.substring(posicionTurno + "turno".length).trim();
                id = parseInt(id) //Convertirlo a numerico 

            }
            // Uso de la función  
            eliminarObjeto(id)


            // Obtener la lista de turnos.json
            let result = await mostrarObjetos()

            // Uso de la función  
            console.log("turnos", result)
            await client.sendMessage(msg.to, result)
        }
    if ( msg.body.includes(eliminarRecordatorio) ){

        // Encontrar la posición de la palabra "recordatorio"
        const posicionRecordatorio = msg.body.indexOf("recordatorio");
        let id
        if (posicionRecordatorio !== -1) {
            // Extraer el texto después de "para"
            id = msg.body.substring(posicionRecordatorio + "recordatorio".length).trim();

            id = parseInt(id) //Convertirlo a numerico 

        }
        // Uso de la función  
        eliminarUnRecordatorio(id)


        // Obtener la lista de turnos.json
        let result = await mostrarRecordatorios()

        // Uso de la función  
        await client.sendMessage(msg.to, result)
    }
    }
    

 )

 //Enviar recordatorio 
 // Programar el envío del mensaje


client.initialize();