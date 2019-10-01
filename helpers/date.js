const moment = require('moment');

module.exports = {
    getYear: data => new Date(data).getFullYear(),
    getMonth: data => (data.getMonth() >= 0 && data.getMonth() <= 9) ? `${data.getMonth() + 1}` : data.getMonth() + 1,
    day: date => (date.getDate() >= 1 && date.getDate() <= 9) ? `0${date.getDate()}` : date.getDate(),
    formated: date => {
        let dataAtual = new Date().toLocaleString(),
            dataMaquina = [
                date.split(' ')[0].split('/')[2],
                date.split(' ')[0].split('/')[1],
                date.split(' ')[0].split('/')[0]
            ].concat(date.split(' ')[1].split(':'));

        dataAtual = dataAtual.split(' ')[0].split('-').concat(dataAtual.split(' ')[1].split(':'));

        return moment(dataAtual).diff(moment(dataMaquina), 'hours') >= 24 ? (moment(dataAtual).diff(moment(dataMaquina), 'days') > 1 ? `${moment(dataAtual).diff(moment(dataMaquina), 'days')} dias` : `${moment(dataAtual).diff(moment(dataMaquina), 'days')} dia`) : (moment(dataAtual).diff(moment(dataMaquina), 'hours') > 1 ? `${moment(dataAtual).diff(moment(dataMaquina), 'hours')} horas` : `${moment(dataAtual).diff(moment(dataMaquina), 'hours')} hora`);
    },
    dhms: date => {
        let data = date.split(' ')[0].split('/'),
            hora = date.split(' ')[1];

        data = `${data[2]}-${data[1]}-${data[0]}`;

        let delta = Math.abs(new Date(`${data} ${hora}`).getTime() - new Date().getTime()) / 1000;

        let horas = Math.floor(delta / 3600) ;
        let days = Math.floor(delta / 86400);
        delta -= days * 86400;

        let hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        let minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        let seconds = delta % 60;
        seconds = Math.floor(seconds);

        let response = `${horas}:${minutes}:${seconds}`;

        if(response.split(':')[0].length == 1)
            response = `0${response.split(':')[0]}:${response.split(':')[1]}:${response.split(':')[2]}`;
            
        if(response.split(':')[1].length == 1)
            response = `${response.split(':')[0]}:0${response.split(':')[1]}:${response.split(':')[2]}`;
            
        if(response.split(':')[2].length == 1)
            response = `${response.split(':')[0]}:${response.split(':')[1]}:0${response.split(':')[2]}`;
        
        return response;
    }
};