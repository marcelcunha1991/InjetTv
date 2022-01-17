const express = require('express'),
    router = express.Router(),
    axios = require('axios'),
    panel = require('./../helpers/paineis'),
    data = require('./../helpers/date'),
    logo = require('./../helpers/logo'),
    json = require('flatted')

var turnoAtualVar;
const ip = "http://idw.tutiplast.com.br:8080";
const dataTeste = "2020-01-21";

var contador = 0;
var velocimetroGlobal;
var biGlobal;
var turnoGlobal;
var ultimaAtualizacao;
var globalRequest;

function retornaMes(){

        if (data.getMonth(new Date()) < 10){

            return "0" + data.getMonth(new Date())
        } else{

            return data.getMonth(new Date())
        }
}

function getToday(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy + "  " + today.getHours()+":"+today.getMinutes()+":"+today.getSeconds()
    
    return today;
}

        router
        .get('/', (request, response, next) => {
            // if(contador == 0) { 
            
            //     // globalRequest = request;

            //     setInterval(function(){  
            //         produtividadeTask(request);
            //     }, 150000);

            var today = new Date();
            var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);
            console.log("ultimo dia do mes " + lastDayOfMonth)
                axios
                .get(ip+`/idw/rest/injet/monitorizacao/turnoAtual`)
                .then(turnoAtual => {
                    console.log(data.getYear(new Date()) + "-" + retornaMes() +  "-" + lastDayOfMonth.getDate())
                    turnoAtualVar = turnoAtual.data.cdTurno
                    axios
                    .all([
                        axios.post(ip+`/idw/rest/injet/bi/resumoBI`, {
                            cdGalpao: request.session.cfg.galpao,
                            agrupamentoBI: 2,
                            cdTurno: turnoAtual.data.cdTurno,             
                            dtIni: data.getYear(new Date()) + "-" + retornaMes() +  "-" + data.day(new Date()),
                            dtFim: data.getYear(new Date()) + "-" + retornaMes() +  "-" + data.day(new Date())
                        }),
                        axios.post(ip+`/idw/rest/injet/bi/resumoBI`, {                
                            dtIni: data.getYear(new Date()) + "-" + retornaMes() +  "-" + "01",
                            dtFim: data.getYear(new Date()) + "-" + retornaMes() +  "-" + lastDayOfMonth.getDate(),
                            cdGalpao: request.session.cfg.galpao,
                            agrupamentoBI: 2
                        }),
                        axios.get(ip+`/idw/rest/injet/monitorizacao/turnos`)
                    ])
                    .then(axios.spread((velocimetro, bi, turnos) => {       
                        
                        contador++;      
                        velocimetroGlobal = velocimetro;
                        biGlobal = bi;
                        turnoGlobal = turnos;
                        ultimaAtualizacao = getToday();
                       
                        console.log("Chamada original "  + velocimetro.data);

                        // VERIFICANDO QUAL EMPRESA, SE EMPRESA DE ID 307, NO CASO DECATEC, MOSTRA VIEW DIFERENTE
                        axios.get(`${process.env.API_URL}/idw/rest/injet/monitorizacao/idempresa`)
                        .then(idEmpresa => {
                            console.log('idEmpresa');
                            console.log(idEmpresa.data);
                            if (idEmpresa.data === 307) {
                                response.status(200).render('decatecCustomizacao/produtividadeDecatec', {
                                    velocimetro: velocimetro.data,
                                    bi: bi.data,
                                    turnos: turnos.data.turnos,
                                    galpao : request.session.cfg.dsGt,
                                    secondsTransition: request.session.cfg.tempo_trans,
                                    cor_fundo: request.session.cfg.cor_fundo,
                                    nextPage: panel.switch(request.baseUrl, request.session.paineis),
                                    logo: logo.hasLogo(),
                                    ultimaAtualizacao : getToday()
                                });
                            } else {
                                response.status(200).render('produtividade', {
                                    velocimetro: velocimetro.data,
                                    bi: bi.data,
                                    turnos: turnos.data.turnos,
                                    galpao : request.session.cfg.dsGt,
                                    secondsTransition: request.session.cfg.tempo_trans,
                                    cor_fundo: request.session.cfg.cor_fundo,
                                    nextPage: panel.switch(request.baseUrl, request.session.paineis),
                                    logo: logo.hasLogo(),
                                    ultimaAtualizacao : getToday()
                                });
                            }
                        })
                        .catch(error => response.status(500).send('Erro ao identificar a empresa. Tente novamente mais tarde. ' + error));
                    }))
                    .catch(errorBI => response.status(500).render('error', {error: json.stringify(errorBI)}));
                })
                .catch(errorTurnoAtual => response.status(500).render('error', {error: json.stringify(errorTurnoAtual)}));
    
            
            // }else{

            //     globalRequest = request;
              
            //     response.status(200).render('produtividade', {
            //         velocimetro: velocimetroGlobal.data,
            //         bi: biGlobal.data,
            //         turnos: turnoGlobal.data.turnos,
            //         galpao : request.session.cfg.galpao,
            //         secondsTransition: request.session.cfg.tempo_trans,
            //         cor_fundo: request.session.cfg.cor_fundo,
            //         nextPage: panel.switch(request.baseUrl, request.session.paineis),
            //         logo: logo.hasLogo(),
            //         ultimaAtualizacao : ultimaAtualizacao
            //     });

            // }           

        });


async function produtividadeTask(request){   
    console.log("Fez chamada de produtividade na thread as " + getToday());
    await axios
    .get(`${process.env.API_URL}/idw/rest/injet/monitorizacao/turnoAtual`)
    .then(turnoAtual => {   
                console.log("entrou no metodo task");
                axios
                .all([
                    axios.post(`${process.env.API_URL}/idw/rest/injet/bi/resumoBI`, {
                        cdGalpao: request.session.cfg.galpao,
                        agrupamentoBI: 2,
                        cdTurno: turnoAtual.data.cdTurno,                            
                        dtIni: data.getYear(new Date()) + "-" + retornaMes() +  "-" + data.day(new Date()),
                        dtFim: data.getYear(new Date()) + "-" + retornaMes() +  "-" + data.day(new Date())
                    }),
                    axios.post(`${process.env.API_URL}/idw/rest/injet/bi/resumoBI`, {                
                        anoIni: data.getYear(new Date()),
                        mesIni: retornaMes(),
                        anoFim: data.getYear(new Date()),
                        mesFim: retornaMes(),
                        cdGalpao: request.session.cfg.galpao,
                        agrupamentoBI: 1,
                    }),
                    axios.get(`${process.env.API_URL}/idw/rest/injet/monitorizacao/turnos`)
                ])
                .then(axios.spread((velocimetro, bi, turnos) => {
                                         
                        velocimetroGlobal = velocimetro;
                        biGlobal = bi;
                        galpao = request.session.cfg.dsGt,
                        turnoGlobal = turnos;  
                        ultimaAtualizacao = getToday();
                  
                    console.log("passou pelo metodo task");

                }))
                .catch(errorBI => console.log(errorBI));
            })
            .catch(errorTurnoAtual => console.log(errorTurnoAtual));
    
}    



module.exports = router;

