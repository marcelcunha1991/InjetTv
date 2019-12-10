const express = require('express'),
    router = express.Router(),
    axios = require('axios'),
    panel = require('./../helpers/paineis'),
    data = require('./../helpers/date'),
    logo = require('./../helpers/logo'),
    maquinas = require('./../helpers/maquinas'),
    json = require('flatted');

router.get('/', (request, response, next) => {
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
            let alerta = [], parada = [], pts = [], pts_ = [], listaFiltroPosto = [];
            res.data.pts.forEach(pt => {
                if (pt.icone.caminhoIcone.includes('Parada') || pt.icone.corTriangulo == '#ffc800') {
                    listaFiltroPosto.push({
                        filtroOp: 0,
                        cdCp: '',
                        dtReferencia: `${data.day(new Date())}/${data.getMonth(new Date())}/${data.getYear(new Date())}`,
                        idTurno: turnoAtual.data.idTurno,
                        cdPosto: pt.cdPt,
                        tpId: 1
                    });
                }
            });

            axios.post(`${process.env.API_URL}/idw/rest/injet/monitorizacao/detalheLista`, {
                listaFiltroPosto
            })
            .then(detalheLista => {
                console.log(detalheLista)
                for (let i = 0; i < detalheLista.data.length; i++) {
                    if(detalheLista == null){
                        console.log('Fui')
                    }
                    else{ if(detalheLista.data[i].paradaResumo.dataInicio !== '') {
                        parada.push({
                            cdPt: detalheLista.data[i].cdPt,
                            tempo: data.dhms(`${detalheLista.data[i].paradaResumo.dataInicio} ${detalheLista.data[i].paradaResumo.horaInicio}`),
                            descricao: detalheLista.data[i].paradaResumo.ultimaParada,
                            cor: '#ff0000'
                        });
                    }}

                    if (detalheLista.data[i].alertas != '' && detalheLista.data[i].alertas[detalheLista.data[i].alertas.length - 1].dtHrFim == '') {
                        alerta.push({
                            cdPt: detalheLista.data[i].cdPt,
                            tempo: data.dhms(detalheLista.data[i].alertas[detalheLista.data[i].alertas.length - 1].dtHrInicio),
                            descricao: detalheLista.data[i].alertas[detalheLista.data[i].alertas.length - 1].dsAlerta,
                            cor: '#ff8b16'
                        });
                    }

                }

                pts = pts.concat(parada, alerta);

                if (request.session.cfg.maquinas) {
                    request.session.cfg.maquinas.forEach((maquina) => {
                        pts_ = pts_.concat(pts.filter((pt) => {
                            if (pt.cdPt === maquina) return pt;
                        }));
                    });
                    pts = pts_;
                }

                response.status(200).render('paradas', { pts: pts, secondsTransition: request.session.cfg.tempo_trans, cor_fundo: request.session.cfg.cor_fundo, nextPage: panel.switch(request.baseUrl, request.session.paineis), logo: logo.hasLogo()});
            })
            .catch(errorDetalheLista => response.status(500).render('error', {error: errorDetalheLista}));
        })
        .catch(error => response.status(500).render('error', {error: error}));
    })
    .catch(errorTurnoAtual => response.status(500).render('error', {error: errorTurnoAtual}));
});

module.exports = router;