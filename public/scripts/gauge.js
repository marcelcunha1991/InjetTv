$('#galpao').text(localStorage.getItem('galpao'));

$.fn.gauge = function (opts) {
    this.each(function () {
        var $this = $(this),
            data = $this.data();

        if (data.gauge) {
            data.gauge.stop();
            delete data.gauge;
        }
        if (opts !== false) {
            data.gauge = new Gauge(this).setOptions(opts);
        }
    });
    return this;
};

var speeds = [
    {
        id: 'eficiencia',
        value: $('#eficienciaValue').text()
    },
    {
        id: 'oee',
        value: $('#oeeValue').text()
    },
    {
        id: 'utilizacao',
        value: $('#utilizacaoValue').text()
    }
];

speeds.forEach(speed => {
    var opts = {
        angle: -0.10, // The span of the gauge arc
        lineWidth: 0.25, // The line thickness
        radiusScale: 0.9, // Relative radius
        pointer: {
            iconPath: 'images/ponteiro.png',
            iconScale: 1,
            iconAngle: 0,
            length: 0.0, // // Relative to gauge radius
            strokeWidth: 0.00, // The thickness
            // color: '#000000' // Fill color
        },
        limitMax: false,     // If false, max value increases automatically if value > maxValue
        limitMin: false,     // If true, the min value of the gauge will be fixed
        generateGradient: true,
        highDpiSupport: true,     // High resolution support
        percentColors: [[0.0, "#FD3939" ], [0.50, "#9FFF2E"], [1.0, "#5CFFD3"]],
        staticLabels: {
            font: '20px sans-serif',
            labels: [50, 100],
            color: '#fff'
        }
    };
    
    var target = document.getElementById(speed.id); // your canvas element
    var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
    gauge.maxValue = 100; // set max gauge value
    gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
    gauge.animationSpeed = 33; // set animation speed (32 is default value)
    gauge.set(speed.value); // set actual value
});

setTimeout(() => window.location.replace(`/${nextPage}`), secondsTransition);