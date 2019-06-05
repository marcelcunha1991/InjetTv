const express = require('express'),
    router = express.Router(),
    axios = require('axios'),
    panel = require('./../helpers/paineis'),
    data = require('./../helpers/date'),
    logo = require('./../helpers/logo'),
    json = require('flatted');

router
.get('/', (request, response, next) => {
    axios
    .get(`${process.env.API_URL}/idw/rest/injet/monitorizacao/turnoAtual`)
    .then(turnoAtual => {
        axios
        .all([
            axios.post(`${process.env.API_URL}/idw/rest/injet/bi/resumoBI`, {
                dtIni: `${data.getYear(new Date())}-${data.getMonth(new Date())}-${data.day(new Date())}`,
                dtFim: `${data.getYear(new Date())}-${data.getMonth(new Date())}-${data.day(new Date())}`,
                cdGalpao: request.session.cfg.galpao,
                agrupamentoBI: 2,
                cdTurno: turnoAtual.data.cdTurno
            }),
            axios.post(`${process.env.API_URL}/idw/rest/injet/bi/resumoBI`, {
                anoIni: data.getYear(new Date()),
                mesIni: data.getMonth(new Date()),
                anoFim: data.getYear(new Date()),
                mesFim: data.getMonth(new Date()),
                cdGalpao: request.session.cfg.galpao,
                agrupamentoBI: 1
            }),
            axios.get(`${process.env.API_URL}/idw/rest/injet/monitorizacao/turnos`)
        ])
        .then(axios.spread((velocimetro, bi, turnos) => {
            response.status(200).render('produtividade', {
                velocimetro: velocimetro.data,
                bi: bi.data,
                turnos: turnos.data.turnos,
                secondsTransition: request.session.cfg.tempo_trans,
                cor_fundo: request.session.cfg.cor_fundo,
                nextPage: panel.switch(request.baseUrl, request.session.paineis),
                logo: logo.hasLogo()
            });
        }))
        .catch(errorBI => response.status(500).render('error', {error: json.stringify(errorBI)}));
    })
    .catch(errorTurnoAtual => response.status(500).render('error', {error: json.stringify(errorTurnoAtual)}));
});

module.exports = router;