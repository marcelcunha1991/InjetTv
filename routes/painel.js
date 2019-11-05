const express = require('express'),
    router = express.Router(),
    panel = require('./../helpers/paineis'),
    logo = require('./../helpers/logo'),
    time = require('./../helpers/time'),
    axios = require('axios');

router
.get('/', (request, response, next) => {
    axios.get(`${process.env.API_URL}/idw/rest/injet/gts/monitorizacao`)
    .then(gts => response.status(200).render('painel', {gts: gts.data.gts, configPath: `${process.env.APP_URL}:${process.env.PORT}`, logo: logo.hasLogo()}))
    .catch(error => response.status(500).send('Erro ao pegar máquinas. Tente novamente mais tarde. ' + error));
})
.post('/config', (request, response, next) => {
    let imagem = request.files.imagem;
    if(imagem !== undefined && imagem.size != 0) {
        imagem.mv(`public/images/logo/logo.jpg`, (err) => {
            if (err) return response.send('Erro ao enviar imagem. ' + err);
            console.log('File uploaded!');
        });
    }
        
    request.session.paineis = panel.selected(request.body);
    request.session.cfg = request.body;
    request.session.cfg.logo = logo.hasLogo();
    request.session.cfg.tempo_trans = time.getTime(request.body.tempo_trans);


    if(request.session.paineis.produtividade == true)
        response.redirect('/produtividade');
    else if (request.session.paineis.maquinas == true)
        response.redirect('/maquinas');
    else
        response.redirect('/paradas');
    axios.get(request.session.paineis)
    .then(paineis => 
        response.status(200).render('painel', 
        {
        }))
        console.log(paineis)
})

module.exports = router;