const express = require('express'),
    router = express.Router(),
    axios = require('axios'),
    panel = require('./../helpers/paineis'),
    data = require('./../helpers/date'),
    logo = require('./../helpers/logo'),
    json = require('flatted')

var turnoAtualVar
const ip = "http://170.10.0.206:8080";
const dataTeste = "2020-01-21";

var contador = 0;
var biTemp;

function retornaMes(){

        if (data.getMonth(new Date()) < 10){

            return "0" + data.getMonth(new Date())
        } else{

            return data.getMonth(new Date())
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
                    turnoAtualVar = turnoAtual.data.cdTurno
                    axios
                    .all([
                        axios.post(ip+`/idw/rest/injet/bi/resumoBI`, {
                            cdGalpao: request.session.cfg.galpao,
                            agrupamentoBI: 2,
                            cdTurno: turnoAtual.data.cdTurno,
                            // dtIni: dataTeste,
                            // dtFim: dataTeste
                            dtIni: data.getYear(new Date()) + "-" + retornaMes() +  "-" + data.day(new Date()),
                            dtFim: data.getYear(new Date()) + "-" + retornaMes() +  "-" + data.day(new Date())
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
                        //console.log(bi.data)
    
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
                    turnoAtualVar = turnoAtual.data.cdTurno
                    axios
                    .all([
                        axios.post(ip+`/idw/rest/injet/bi/resumoBI`, {
                            cdGalpao: request.session.cfg.galpao,
                            agrupamentoBI: 2,
                            cdTurno: turnoAtual.data.cdTurno,
                            // dtIni: dataTeste,
                            // dtFim: dataTeste
                            dtIni: data.getYear(new Date()) + "-" + retornaMes() +  "-" + data.day(new Date()),
                            dtFim: data.getYear(new Date()) + "-" + retornaMes() +  "-" + data.day(new Date())
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
                        console.log("Entrando no Then")
                        console.log("Turno Atual: " + turnoAtual.data.cdTurno)

                        //insereTurnoNoBi(bi)       

                        console.log("TEMP: " + biTemp.data.indicadores)
                        for (index in biTemp.data.indicadoresTurno){
                            console.log("Entrou no for")
                            console.log("Turno do biTemp: " + turnoAtualVar)
                            console.log("Turno do cdTurno: " + biTemp.data.indicadoresTurno[index].cdTurno)


                            if(biTemp.data.indicadoresTurno[index].cdTurno == bi.data.filtroBI.cdTurno ){                                
                             
                                console.log("Entrou no Atualiza Turno BITemp  " + biTemp.data.indicadoresTurno[index].cdTurno)
                                biTemp.data.indicadoresTurno[index].indicadores.indOEE = bi.data.indicadores.indOEE;
                                biTemp.data.indicadoresTurno[index].indicadores.eficiencia = bi.data.indicadores.eficiencia;
                                biTemp.data.indicadoresTurno[index].indicadores.indUtilizacao = bi.data.indicadores.indUtilizacao;
                                biTemp.data.indicadoresTurno[index].indicadores.indRef = bi.data.indicadores.indRef;
                           
                            }
                        }

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

