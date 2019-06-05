
const maquinas = $('.flex');
const itemsPerView = 6;
let index = 0;

for (let i = 0; i < maquinas.length; i++) {
    $(maquinas[i]).css('display', 'none');
}
for (let i = index; i < (index + itemsPerView); i++) {
    $(maquinas[i]).css('display', 'flex');
}
index += itemsPerView;

setInterval(function() {
    if (index < maquinas.length) {
        for (let i = 0; i < maquinas.length; i++) {
            $(maquinas[i]).css('display', 'none');
        }
        for (let i = index; i < (index + itemsPerView); i++) {
            $(maquinas[i]).css('display', 'flex');
        }
        index += itemsPerView;
    } else {
        index = 0;
        window.location.replace(`/${nextPage}`);
    }
}, secondsTransition);