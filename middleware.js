const registrarRuta = async (req, res, next) => {
    const ruta = req.url
    console.log(`Se registró una consulta de la ruta: ${ruta}`)
    next()
}

module.exports = {registrarRuta}