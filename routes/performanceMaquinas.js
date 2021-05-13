const express = require('express'),
   router = express.Router(),
   axios = require('axios'),
   panel = require('../helpers/paineis'),
   data = require('../helpers/date'),
   logo = require('../helpers/logo'),
   json = require('flatted');

    
var contador = 0;
var ptsGlobal;
var ultimaAtualizacao;

var turnoAtualVar;
// const ip = "http://idw.tutiplast.com.br:8080";
const ip = "http://170.10.0.210:8080";

var count = 0;
var atualGlobal;
var biGlobal;
var turnoGlobal;
var ultimaAtualizacao;

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

   axios
   .get(`${process.env.API_URL}/idw/rest/injet/monitorizacao/turnoAtual`)
   .then(turnoAtual => {
      axios.post(`${process.env.API_URL}/idw/rest/v2/injet/monitorizacao/postosativos`, {
         idTurno: turnoAtual.data.idTurno,
         filtroOp: 0,
         cdGt: request.session.cfg.galpao,
         turnoAtual: true,
         dtReferencia: `${data.day(new Date())}/${data.getMonth(new Date())}/${data.getYear(new Date())}`
      })
      .then(res => {   
         ptsGlobal = res;
         ultimaAtualizacao = getToday()
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

         if(typeof request.session.cfg.maquinas === 'string'  ){            
            if (request.session.cfg.maquinas) {
               pts_ = pts_.concat(pts.filter((pt) => {
                  if (pt.cdPt === request.session.cfg.maquinas) 
                  return pt;
               }));
               pts = pts_;
            }
         }
         if(typeof request.session.cfg.maquinas === 'undefined' || typeof request.session.cfg.maquinas === 'object'  ){            
            if (request.session.cfg.maquinas) {
               request.session.cfg.maquinas.forEach((maquina) => {
                  pts_ = pts_.concat(pts.filter((pt) => {
                     if (pt.cdPt === maquina) 
                     return pt;
                  }));
               });
               pts = pts_;
            }
         }
         pts = pts.sort(function(a, b) {
            return (a.cdPt.toLowerCase() < b.cdPt.toLowerCase()) ? -1 : (a.cdPt.toLowerCase() > b.cdPt.toLowerCase()) ? 1 : 0;
         });
         
         // console.log(pts)
         // *PRODUTIVIDADE
         
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
                     // cdTurno: turnoAtual.data.cdTurno,             
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
               .then(axios.spread((atual, bi, turnos) => {
                  count++;      
                  atualGlobal = atual;
                  biGlobal = bi;
                  turnoGlobal = turnos;
                  ultimaAtualizacao = getToday();
               
                  console.log("Chamada original "  + atual.data);

                  contador++;
                  response.status(200).render('performanceMaquinas', { 
                     pts: pts, 
                     secondsTransition: request.session.cfg.tempo_trans, 
                     cor_fundo: request.session.cfg.cor_fundo, 
                     nextPage: panel.switch(request.baseUrl, request.session.paineis), 
                     logo: logo.hasLogo(),
                     ultimaAtualizacao: getToday(),
                     atual: atual.data,
                     bi: bi.data,
                     turnos: turnos.data.turnos,
                     galpao : request.session.cfg.dsGt,
                     cor_fundo: request.session.cfg.cor_fundo,
                     logo: logo.hasLogo(),
                     ultimaAtualizacao : getToday()
                  });
               }))
               .catch(errorBI => response.status(500).render('error', {error: json.stringify(errorBI)}));
         })
         .catch(errorTurnoAtual => response.status(500).render('error', {error: json.stringify(errorTurnoAtual)}));

      })
      .catch(error => response.status(500).render('error', {error: error}));
   })
   .catch(errorTurnoAtual => response.status(500).send(json.stringify(errorTurnoAtual)));
    
})
.post('/search', (request, response, next) => {
   axios
   .get(`${process.env.API_URL}/idw/rest/injet/monitorizacao/turnoAtual`)
   .then(turnoAtual => {
      axios.post(`${process.env.API_URL}/idw/rest/v2/injet/monitorizacao/postosativos`, {
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

