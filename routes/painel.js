const express = require('express'),
    router = express.Router(),
    panel = require('./../helpers/paineis'),
    logo = require('./../helpers/logo'),
    time = require('./../helpers/time'),
    axios = require('axios'),
    data = require('./../helpers/date');

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;

    function retornaMes(){

        if (data.getMonth(new Date()) < 10){

            return "0" + data.getMonth(new Date())
        } else{

            return data.getMonth(new Date())
        }
}

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
                            
                        velocimetroTemp  = velocimetro;                        
                       
                        request.session.velocimetro = velocimetro.data;
                        request.session.bi = bi.data;
                        request.session.turnos = turnos;     
                      
                        console.log("passou pelo metodo task");
                        produtividadeTask(request);                        
                        
                    }))
                    .catch(errorBI => console.log(errorBI));
                })
                .catch(errorTurnoAtual => console.log(errorTurnoAtual));
        
    }    

     

    

if(process.env.TRIAL == "true"){

    if(process.env.DATA_FINAL < today ){
        console.log("fora de trial")
    }else{
    router.get('/', (request, response, next) => {
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

    produtividadeTask(request);

    if(request.session.paineis.produtividade == true)
        response.redirect('/produtividade');
    else if (request.session.paineis.maquinas == true)
        response.redirect('/maquinas');
    else
        response.redirect('/paradas');
   
      
})


}
module.exports = router;
}else{
    console.log("Não Trial")
    router.get('/', (request, response, next) => {
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

    produtividadeTask(request);

    if(request.session.paineis.produtividade == true)
        response.redirect('/produtividade');
    else if (request.session.paineis.maquinas == true)
        response.redirect('/maquinas');
    else
        response.redirect('/paradas');
   

})

module.exports = router;
}
