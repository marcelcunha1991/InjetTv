fs = require('fs');

module.exports = {
    hasLogo: () => {
        try {
            fs.accessSync('public/images/logo/logo.jpg',  fs.constants.R_OK);
            return '/images/logo/logo.jpg';
        } catch (error) {
            return 'https://doity.com.br/media/doity/parceiros/7641_parceiro.png';
        }
    }
};