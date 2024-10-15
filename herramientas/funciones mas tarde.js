//Funciones para mas tarde
// Programar el envío del mensaje  
schedule.scheduleJob(date, async () => {  
    const number = '5493834904523@c.us'; // Reemplaza con el número de destino  
    const message = 'Hola, este es un mensaje programado.';  

    await client.sendMessage(number, message);  
    console.log(`Mensaje enviado a ${number}: ${message}`);  
});

// Evento para manejar mensajes enviados a mi mismo 
client.on('message_create', async (msg) => {  
    console.log("envíes a mi mismo 1 ")
    console.log(msg.from)
    console.log(msg.to)
    if (msg.from == msg.to ) { // Solo procesamos mensajes que envíes a mi mismo 
        console.log("envíes a mi mismo 2  ")
        // Guardar el número y el mensaje en un archivo  
        if (msg.body == '.ver mis turnos'){
            client.sendMessage(msg.to, 'Lista de turno Bla Bla.')
        }
    }  
}); 


// Especifica la fecha y la hora para el envío del mensaje  

const date = new Date(2024, 9, 9, 21, 26); // Año, Mes (0-11), Día, Hora (24h), Minutos

//Probando
client.on('message', msg => {
    if (msg.body == 'Hola mundo') {
        client.sendMessage(msg.from, 'Hola Soy un bot')
    }
});
    
    // Programar el mensaje  
    schedule.scheduleJob(dateToSend, () => {  
        const chatId = '5493834904523@c.us'; // Reemplaza con el número de destino  
        const message = 'Este es un mensaje programado!';  

        client.sendMessage(chatId, message).then(response => {  
            // console.log('Mensaje enviado:', response);  
        }).catch(err => {  
            console.error('Error al enviar el mensaje:', err);  
        });  
    });  