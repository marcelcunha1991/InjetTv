const produtividade = require('./produtividade'),
    maquinas = require('./maquinas'),
    painel = require('./painel'),
    injettv = require('./injettv'),
    paradas = require('./paradas'),
    performanceMaquinas = require('./performanceMaquinas'),
    redirect = require('./redirect');

module.exports = (app) => {
    app
    .use('/produtividade', produtividade)
    .use('/maquinas', maquinas)
    .use('/painel', painel)
    .use('/injettv', injettv)
    .use('/paradas', paradas)
    .use('/performanceMaquinas', performanceMaquinas)
    .use('/', redirect);
};