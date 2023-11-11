const mail = require('../service/mail');
const tempCode = require('../models/TempCode');
const getRandomCode = () => {
    const min = 100000; // Mínimo valor de un número de 6 dígitos
    const max = 999999; // Máximo valor de un número de 6 dígitos  
    const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomCode.toString();
}
const passwordRestoration = async (to) => {
    const code = getRandomCode();
    // Crear un nuevo documento TempCode en la base de datos
    const tempCode = new Tempcode({
        email: to,
        code: code,
    });
    await tempCode.save();
    const subject = "Restauración de contraseña";
    const text = `Hola, para restaurar tu contraseña ingresa el siguiente código: ${code}. No compartas este código con nadie.`;
    try {
        await mail.sendMail(to, subject, text);
        console.log('Correo enviado con éxito');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        // Aquí puedes manejar el error según tus necesidades (p. ej., enviar una respuesta al cliente, lanzar una excepción, etc.)
    }
};
passwordRestoration("estebanlm@estudiantec.cr");


