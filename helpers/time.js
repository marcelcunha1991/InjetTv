module.exports = {
    getTime:(time) => {
        if (time < 15)
            return 15000;
        
        if (time > 300)
            return 300000;

        if(isNaN(time))
            return 15000;

        return time * 1000;
    }
};