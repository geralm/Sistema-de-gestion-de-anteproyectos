const mail = require('../service/mail');
const TempCode = require('../models/tempcode');

const getRandomCode = () => {
    const min = 100000; // Mínimo valor de un número de 6 dígitos
    const max = 999999; // Máximo valor de un número de 6 dígitos  
    const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomCode.toString();
}

module.exports.sendCodeMail = async (to) => {
    const code = getRandomCode();
    await TempCode.deleteMany({email: to});
    // Crear un nuevo documento TempCode en la base de datos
    const tempCode = new TempCode({
        email: to,
        code: code,
    });
    await tempCode.save();
    const subject = "Restauración de contraseña";
    const text = `Hola, para restaurar tu contraseña ingresa el siguiente código: ${code}. No compartas este código con nadie.\nExpira en 5 minutos.`;
    try {
        await mail.sendMail(to, subject, text);
        console.log('Correo enviado con éxito a', to);
        return true;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw new Error('Ocurrió un error al enviar el correo');
        // Aquí puedes manejar el error según tus necesidades (p. ej., enviar una respuesta al cliente, lanzar una excepción, etc.)
    }
};
module.exports.isValidCode = async (email, code) => {
    const tempCode = await TempCode.findOne({ email: email, code: code });
    console.log(tempCode)
    return !!tempCode;
}
// passwordRestoration("estebanlm@estudiantec.cr");


