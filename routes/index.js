const produtividade = require('./produtividade'),
    maquinas = require('./maquinas'),
    painel = require('./painel'),
    injettv = require('./injettv'),
    paradas = require('./paradas'),
    redirect = require('./redirect');

module.exports = (app) => {
    app
    .use('/produtividade', produtividade)
    .use('/maquinas', maquinas)
    .use('/painel', painel)
    .use('/injettv', injettv)
    .use('/paradas', paradas)
    .use('/', redirect);
};