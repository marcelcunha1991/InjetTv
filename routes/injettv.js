const express = require('express'),
    router = express.Router(),
    axios = require('axios'),
    version = require('../package.json').version,
    time = require('../helpers/time');

router.get('/', (req, res, next) => {
    const ipClient = req.ip.replace(/::f+:/i, ''),
        cdMaquina = req.query.cdpt || '';
    console.log(ipClient)
    axios({
        method: 'post',
        url: `${process.env.APP_URL}/idw/rest/injet/monitorizacao/injetsmarttvweb`,
        data: {
            idIHM: ipClient,
            cdPt: cdMaquina
        }
    })
    .then(response => {
        res.render('index', {
            op: response.data['nrOPExibicao'],
            producaoLiquida: response.data['qtdProducaoLiquida'],
            producaoPlanejada: response.data['qtdProducaoPlanejada'],
            mtbf: response.data['mtbf'],
            mttr: response.data['mttr'],
            oee: response.data['oee'],
            refugos: response.data['indRef'],
            tipoRodape: (response.data['tipoRodape'] ? response.data['tipoRodape'] + ':' : ''),
            descricaoRodape: response.data['dsRodape'],
            dataRodape: response.data['dtHrRodape'],
            maquina: response.data['cdMaquina'],
            corOEE: response.data['corOEE'],
            corRefugo: response.data['corIndRef'],
            version: version,
            tempo: time.getTime(req.query.ir),
            usuario: 'Usuario',
            cdOperador: response.data['cdOperador'],
            nmOperador: response.data['nmOperador'],
            dtHrLoginOperador: response.data['dtHrLoginOperador'],
            producaoRefugada: response.data['qtdProducaoRefugada']
        });
    })
    .catch(error => res.render('error', { message: `ERROR ON IP: ${ipClient}`, error: error }));
});

module.exports = router;