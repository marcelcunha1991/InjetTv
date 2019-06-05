const axios = require('axios'),
    data = require('./date');

module.exports = {
    getAlertas: (listaFiltroPosto) => {
        console.log(process.env.API_URL);
        axios.post(`${process.env.API_URL}/idw/rest/injet/monitorizacao/detalheLista`, {
            listaFiltroPosto
        })
        .then(detalheLista => {
            console.log(detalheLista);
            // detalheLista.data.forEach(detalhe => {
            //     if(detalhe.alertas != '') {
            //         if(detalhe.alertas[detalhe.alertas.length - 1].dtHrFim == '') {
            //             detalhe.tempo = data.formated(detalhe.alertas[detalhe.alertas.length - 1].dtHrInicio);
            //             detalhe.descricao = detalhe.alertas[detalhe.alertas.length - 1].dsAlerta;
            //             detalhe.corPrincipal = '#ff8b16';
            //             detalhe.corSecundaria = '#ff8b16';
            //             console.log(detalhe);
            //         }
            //     }
            // });
        })
        .catch(error => console.log('Erro alertas: ' + error));
    }
};