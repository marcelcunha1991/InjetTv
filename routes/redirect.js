const express = require('express'),
    router = express.Router();
    
router.get('/', (request, response, next) => response.redirect('/painel'));

module.exports = router;