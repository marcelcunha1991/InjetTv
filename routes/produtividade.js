const express = require('express'),
    router = express.Router(),
    axios = require('axios'),
    panel = require('./../helpers/paineis'),
    data = require('./../helpers/date'),
    logo = require('./../helpers/logo'),
    json = require('flatted')

var turnoAtualVar
const ip = "http://10.4.100.2:8080";
const dataTeste = "2020-01-21";

var contador = 0;
var velocimetroGlobal;
var biGlobal;
var turnoGlobal;

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
                    produtividadeTask(request);
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
                        
                        contador++;      
                        velocimetroGlobal = velocimetro;
                        biGlobal = bi;
                        turnoGlobal = turnos;
                       
                        console.log("Chamada original "  + velocimetro.data);

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
    
            
            }else{
              
                response.status(200).render('produtividade', {
                    velocimetro: velocimetroGlobal.data,
                    bi: biGlobal.data,
                    turnos: turnoGlobal.data.turnos,
                    secondsTransition: request.session.cfg.tempo_trans,
                    cor_fundo: request.session.cfg.cor_fundo,
                    nextPage: panel.switch(request.baseUrl, request.session.paineis),
                    logo: logo.hasLogo()
                });

            }           

        });


async function produtividadeTask(request){   

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
                        turnoGlobal = turnos;  
                  
                    console.log("passou pelo metodo task");
                    
                    produtividadeTask(request);                        
                    
                }))
                .catch(errorBI => console.log(errorBI));
            })
            .catch(errorTurnoAtual => console.log(errorTurnoAtual));
    
}    



module.exports = router;

