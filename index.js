const express = require('express');
const { getData, getDetalle, ejecutarConsulta } = require("./consultas.js");
const { registrarRuta } = require("./middleware.js")

const app = express();
app.use(registrarRuta) // nuestro middleware

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});

app.get("/joyas", async (req, res) => {

    try {
        const { limit, page, order_by } = req.query
        const data = await getData(limit, page, order_by)
        const totalJoyas = data.length;
        const stockTotal = data.reduce((acumulador, valorActual) => acumulador + valorActual.stock, 0)
        const estructuraHateoas = { totalJoyas, stockTotal, data }
        res.send(estructuraHateoas);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/joyas/joya/:id", async (req, res) => {
    try {
        const { id } = req.params
        const detalleData = await getDetalle(id)
        console.log(detalleData)
        res.send(detalleData)
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/joyas/filtros", async (req, res) => {
    try {
        const { precio_max, precio_min, categoria, metal } = req.query;
        let filtros = [];
        const values = [];
        const agregarFiltro = (campo, comparador, valor) => {
            values.push(valor);
            const posicion = filtros.length + 1;
            filtros.push(`${campo} ${comparador} $${posicion}`);
        };
        if (precio_max) {
            agregarFiltro("precio", "<=", precio_max);
        }

        if (precio_min) {
            agregarFiltro("precio", ">=", precio_min);
        }

        if (categoria) {
            agregarFiltro("categoria", "=", categoria);
        }

        if (metal) {
            agregarFiltro("metal", "=", metal);
        }

        const unionDeFiltros = filtros.join(" AND ");
        const query = `SELECT * FROM inventario WHERE ${unionDeFiltros};`;
        const rows = await ejecutarConsulta(query, values);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
