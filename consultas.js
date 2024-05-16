const { pool } = require("./database.js")

const getData = async (limit, page, order_by) => {

    let consultas = "";
    if (order_by) {
        const [columna, orden] = order_by.split("_");
        consultas += ` ORDER BY ${columna} ${orden}`;
    }
    if (limit) {
        consultas += ` LIMIT ${limit}`
    }

    if (page && limit) {
        const offset = (page * limit) - limit
        consultas += `OFFSET ${offset}`
    }

    const query = `SELECT * FROM inventario ${consultas};`
    const { rows } = await pool.query(query)
    const resumenData = rows.map(element => {
        return {
            nombre: element.nombre,
            ruta: `joyas/joya/:${element.id}`
        }
    })
    return resumenData
}
const getDetalle = async (id) => {
    const query = "SELECT * FROM inventario WHERE id= $1;"
    const values = [id]
    const { rows } = await pool.query(query, values)
    return rows
};

const ejecutarConsulta = async (query, values) => {
    const { rows } = await pool.query(query, values)
    return rows;
};




module.exports = { ejecutarConsulta, getData, getDetalle }