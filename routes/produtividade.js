const express = require('express'),
    router = express.Router(),
    axios = require('axios'),
    panel = require('./../helpers/paineis'),
    data = require('./../helpers/date'),
    logo = require('./../helpers/logo'),
    json = require('flatted')


const ip = "http://170.10.1.165:8081";
const dataTeste = "2020-01-21";

var contador = 0;
var biTemp = 0

function retornaMes(){

        if (data.getMonth(new Date()) < 10){

            return "0" + data.getMonth(new Date())
        } else{

            return data.getMonth(new Date())
        }

}

function insereTurnoNoBi(biTurnoAtual,turnoAtual){

    for (biTurno in biTemp.indicadoresTurno){

        if(biTurno.cdTurno == turnoAtual.data.cdTurno ){

            biTurno.indicadores.indOEE = biTurnoAtual.indicadores.indOEE;
            biTurno.indicadores.eficiencia = biTurnoAtual.indicadores.eficiencia;
            biTurno.indicadores.indUtilizacao = biTurnoAtual.indicadores.indUtilizacao;
            biTurno.indicadores.indRef = biTurnoAtual.indicadores.indRef;
        }
    }

} 
        router
        .get('/', (request, response, next) => {
            if(contador == 0) {
                axios
                .get(ip+`/idw/rest/injet/monitorizacao/turnoAtual`)
                .then(turnoAtual => {
                    console.log("Iniciando Chamada pela primeira vez");
                    console.log(retornaMes())
                    console.log(`${data.getYear(new Date())}-`+ retornaMes() +`-${data.day(new Date())}`)
                    console.log(`${data.getYear(new Date())}-${data.getMonth(new Date())}-${data.day(new Date())}`)
                    console.log(request.session.cfg.galpao)
                    console.log(turnoAtual.data.cdTurno)
                    axios
                    .all([
                        axios.post(ip+`/idw/rest/injet/bi/resumoBI`, {
                            cdGalpao: request.session.cfg.galpao,
                            agrupamentoBI: 2,
                            cdTurno: turnoAtual.data.cdTurno,
                            dtIni: dataTeste,
                            dtFim: dataTeste
                            // dtIni: data.getYear(new Date()) + "-" + retornaMes() +  "-" + data.day(new Date()),
                            // dtFim: data.getYear(new Date()) + "-" + retornaMes() +  "-" + data.day(new Date()),
                        }),
                        axios.post(ip+`/idw/rest/injet/bi/resumoBI`, {                
                            anoIni: data.getYear(new Date()),
                            mesIni: retornaMes(),
                            anoFim: data.getYear(new Date()),
                            mesFim: retornaMes(),
                            cdGalpao: request.session.cfg.galpao,
                            agrupamentoBI: 1,
                        }),
                        axios.get(ip+`/idw/rest/injet/monitorizacao/turnos`)
                    ])
                    .then(axios.spread((velocimetro, bi, turnos) => {
                        // console.log(velocimetro.data)
    
                        velocimetroTemp  = velocimetro;
                        
                        // console.log("Temporaria " + velocimetroTemp.data)
                        
                        response.status(200).render('produtividade', {
                            velocimetro: velocimetro.data,
                            bi: bi.data,
                            turnos: turnos.data.turnos,
                            secondsTransition: request.session.cfg.tempo_trans,
                            cor_fundo: request.session.cfg.cor_fundo,
                            nextPage: panel.switch(request.baseUrl, request.session.paineis),
                            logo: logo.hasLogo()
                        });
                        biTemp = bi
                        contador++;      
                        console.log("biTemp: " + biTemp.data)              
                        console.log(contador)
                    }))
                    .catch(errorBI => response.status(500).render('error', {error: json.stringify(errorBI)}));
                })
                .catch(errorTurnoAtual => response.status(500).render('error', {error: json.stringify(errorTurnoAtual)}));
    
            
            }else{

                axios
                .get(ip+`/idw/rest/injet/monitorizacao/turnoAtual`)
                .then(turnoAtual => {
                    console.log("Iniciando Chamada pela segunda vez");
                    console.log(retornaMes())
                    console.log(`${data.getYear(new Date())}-`+ retornaMes() +`-${data.day(new Date())}`)
                    console.log(`${data.getYear(new Date())}-${data.getMonth(new Date())}-${data.day(new Date())}`)
                    console.log(request.session.cfg.galpao)
                    console.log(turnoAtual.data.cdTurno)
                    axios
                    .all([
                        axios.post(ip+`/idw/rest/injet/bi/resumoBI`, {
                            cdGalpao: request.session.cfg.galpao,
                            agrupamentoBI: 2,
                            cdTurno: turnoAtual.data.cdTurno,
                            dtIni: dataTeste,
                            dtFim: dataTeste
                            // dtIni: data.getYear(new Date()) + "-" + retornaMes() +  "-" + data.day(new Date()),
                            // dtFim: data.getYear(new Date()) + "-" + retornaMes() +  "-" + data.day(new Date()),
                        }),
                        axios.post(ip+`/idw/rest/injet/bi/resumoBI`, {                
                            anoIni: data.getYear(new Date()),
                            mesIni: retornaMes(),
                            anoFim: data.getYear(new Date()),
                            mesFim: retornaMes(),
                            cdGalpao: request.session.cfg.galpao,
                            agrupamentoBI: 1,
                            cdTurno: turnoAtual.data.cdTurno
                        }),
                        axios.get(ip+`/idw/rest/injet/monitorizacao/turnos`)
                    ])
                    .then(axios.spread((velocimetro, bi, turnos) => {              
        
                        insereTurnoNoBi(bi,turnoAtual.data.cdTurno)
                        
                        response.status(200).render('produtividade', {
                            velocimetro: velocimetro.data,
                            bi: biTemp.data,
                            turnos: turnos.data.turnos,
                            secondsTransition: request.session.cfg.tempo_trans,
                            cor_fundo: request.session.cfg.cor_fundo,
                            nextPage: panel.switch(request.baseUrl, request.session.paineis),
                            logo: logo.hasLogo()
                        });
                        contador++;                       
                        console.log(contador)
                    }))
                    .catch(errorBI => response.status(500).render('error', {error: json.stringify(errorBI)}));
                })
                .catch(errorTurnoAtual => response.status(500).render('error', {error: json.stringify(errorTurnoAtual)}));

            }

           

        });



module.exports = router;

