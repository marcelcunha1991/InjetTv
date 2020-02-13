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
        axios.post(`${process.env.API_URL}/idw/rest/injet/monitorizacao`, {
            idTurno: turnoAtual.data.idTurno,
            filtroOp: 0,
            cdGt: request.session.cfg.galpao,
            turnoAtual: true,
            dtReferencia: `${data.day(new Date())}/${data.getMonth(new Date())}/${data.getYear(new Date())}`
        })
        .then(res => {
            let abaixoMeta = [], semConexao = [], naMeta = [], parada = [], pts = [], pts_ = [];
            res.data.pts.forEach(pt => {
                if(pt.dsProduto !== undefined) {
                    if(pt.dsProduto.indexOf('\n') !== -1)
                        pt.dsProduto = pt.dsProduto.substring(0, pt.dsProduto.indexOf('\n'));
                }

                if(pt.icone.caminhoIcone.includes('AbaixoMeta')) {
                    pt.icone.caminhoIcone = '#f1c40f';
                    abaixoMeta.push(pt);
                }
                if(pt.icone.caminhoIcone.includes('SemConexao')) {
                    pt.icone.caminhoIcone = '#7f8c8d';
                    semConexao.push(pt);
                }
                if(pt.icone.caminhoIcone.includes('NaMeta')) {
                    pt.icone.caminhoIcone = '#4cd137';
                    naMeta.push(pt);
                }
                if(pt.icone.caminhoIcone.includes('Parada')) {
                    pt.icone.caminhoIcone = '#c0392b';
                    parada.push(pt);
                }
            });
            pts = pts.concat(naMeta, abaixoMeta, parada, semConexao);
            
            if (request.session.cfg.maquinas) {
                request.session.cfg.maquinas.forEach((maquina) => {
                    pts_ = pts_.concat(pts.filter((pt) => {
                        if (pt.cdInjetora === maquina) 
                        return pt;
                    }));
                });
                pts = pts_;
            }
            response.status(200).render('maquinas', { pts: pts, secondsTransition: request.session.cfg.tempo_trans, cor_fundo: request.session.cfg.cor_fundo, nextPage: panel.switch(request.baseUrl, request.session.paineis), logo: logo.hasLogo()});
        })
        .catch(error => response.status(500).render('error', {error: error}));
    })
    .catch(errorTurnoAtual => response.status(500).send(json.stringify(errorTurnoAtual)));
})
.post('/search', (request, response, next) => {
    axios
    .get(`${process.env.API_URL}/idw/rest/injet/monitorizacao/turnoAtual`)
    .then(turnoAtual => {
        axios.post(`${process.env.API_URL}/idw/rest/injet/monitorizacao`, {
            idTurno: turnoAtual.data.idTurno,
            filtroOp: 0,
            cdGt: request.body.galpao,
            turnoAtual: true,
            dtReferencia: `${data.day(new Date())}/${data.getMonth(new Date())}/${data.getYear(new Date())}`
        })
        .then(maquinas => response.status(200).send(maquinas.data.pts))
        .catch(maquinasError => response.status(500).render('error', {error: json.stringify(maquinasError)}));
    })
    .catch(error => response.status(500).render('error', {error:json.stringify(error)}));
});

module.exports = router;