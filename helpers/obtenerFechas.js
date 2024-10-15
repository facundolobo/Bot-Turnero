 function obtenerFechaHoy(){
   //Obtener la fecha de hoy
   
    const fechaHoy = new Date();
    
    // Obtener el día, mes y año
    const dia = fechaHoy.getDate(); // Día del mes (1-31)
    const mes = fechaHoy.getMonth() + 1; // Mes (0-11, por eso se suma 1)
    const anio = fechaHoy.getFullYear(); // Año completo
    return {
        dia,
        mes,
        anio
    }
}
 function obtenerFechaManiana(){
    //Obtener la fecha de hoy
    
     const fechaHoy = new Date();
     
     // Agregar un día
     fechaHoy.setDate(fechaHoy.getDate() + 1);
     
     // Obtener el día, mes y año
     const dia = fechaHoy.getDate(); // Día del mes (1-31)
     const mes = fechaHoy.getMonth() + 1; // Mes (0-11, por eso se suma 1)
     const anio = fechaHoy.getFullYear(); // Año completo
     return {
         dia,
         mes,
         anio
     }
 }
 

module.exports={
    obtenerFechaHoy,
    obtenerFechaManiana
}