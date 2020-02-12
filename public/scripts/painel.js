$(() => $('select').formSelect());
if (localStorage.getItem('cliente')) {
    
    if(JSON.parse(localStorage.getItem('cliente')).maquinas == true){
        $("#painelMaquinas").prop('checked', true);
    }else{
        $("#painelMaquinas").prop('checked',false)
    }
    if(JSON.parse(localStorage.getItem('cliente')).produtividade == true){
        $("#painelProdutividade").prop('checked', true);
    }else{
        $("#painelProdutividade").prop('checked',false)
    }
    if(JSON.parse(localStorage.getItem('cliente')).paradas == true){
        $("#painelParadas").prop('checked', true);
    }else{
        $("#painelParadas").prop('checked',false)
    }
    
    $('#galpao').val(JSON.parse(localStorage.getItem('cliente')).galpao)
    $('#preloader').fadeIn().toggleClass('hide');
    $('form').unbind('submit').submit();

} else {
    // $('form').ready(function (event) {
    //     if (localStorage.getItem('cliente')) {
    //         if (!$('#painelProdutividade').is(':checked') && !$('#painelMaquinas').is(':checked') && !$('#painelParadas').is(':checked'))
    //             M.toast({ html: 'Por favor, selecione alguma das opções para exibir o painel!', displayLength: 2000 });
    //         else {
    //             // $('#preloader').fadeIn().toggleClass('hide');
    //             // $('form').unbind('submit').submit();
    //         };
    //     } else
    //         M.toast({ html: 'Por favor, um grupo de trabalho para continuar!', displayLength: 2000 });
    // });
}

var ip = "http://170.10.0.216:8080";
var dataTeste = "21-01-2020";

$('form').submit(function (event) {
    event.preventDefault();
    if ($('#galpao').val() !== null) {
        if (!$('#painelProdutividade').is(':checked') && !$('#painelMaquinas').is(':checked') && !$('#painelParadas').is(':checked'))
            M.toast({ html: 'Por favor, selecione ao menos um painel para exibir!', displayLength: 2000 });
        else {
            $('#preloader').fadeIn().toggleClass('hide');
            $(this).unbind('submit').submit();
        };
    } else
        M.toast({ html: 'Por favor, um grupo de trabalho para continuar!', displayLength: 2000 });
});


$('#galpao').change(e => {

    var galpaoTemp;
    var produtividadeTemp;
    var maquinasTemp;
    var paradasTemp;

    galpaoTemp = $('#galpao').val();
    produtividadeTemp = $('#painelProdutividade').val();
    maquinasTemp = $('#painelMaquinas').val();
    paradasTemp = $('#painelParadas').val();

    $('#preloader').fadeIn().toggleClass('hide');
    axios.get(ip+`/idw/rest/injet/pts/ativoByGalpao`, {
        params: {
            gt:galpaoTemp
        }
    })
    .then(response => {
        console.log("gt " + galpaoTemp)
        $('#preloader').fadeOut().toggleClass('hide');
        response.data.pts.forEach(pt => $('#maquinas').append(`<option value='${pt.cdPt}'>${pt.cdPt}</option>`));
        $('select').formSelect();
    })
    .catch(err => {
        M.toast({ html: 'Falha ao carregar máquinas, tente novamente mais tarde. ' + error, displayLength: 2000 })
    })
    // axios.post('/maquinas/search', {
    //     galpao: galpaoTemp,
    //     produtividade: produtividadeTemp,
    //     maquinas: maquinasTemp,
    //     paradas: paradasTemp,

    // })
    //     .then(response => {
    //         $('#preloader').fadeOut().toggleClass('hide');
    //         response.data.forEach(pt => $('#maquinas').append(`<option value='${pt.cdPt}'>${pt.cdPt}</option>`));
    //         $('select').formSelect();
    //     })
    //     .catch(error => M.toast({ html: 'Falha ao carregar máquinas, tente novamente mais tarde. ' + error, displayLength: 2000 }));
        
    var cliente = {
        galpao: $("#galpao").val(),
        produtividade: $('#painelProdutividade').is(':checked'),
        maquinas: $('#painelMaquinas').is(':checked'),
        paradas: $("#painelParadas").is(':checked'),
        cor_fundo: '#ffffff',
        path_logo: ''
    };
   
    localStorage.setItem("cliente", JSON.stringify(cliente));
    console.log(cliente);
    return true;


});

$('#btn-cor').click(() => $('body').css('background-color', $('#cor_fundo').val()));

$('input:file').change(e => {
    let imagem = document.getElementById('imagem').files[0],
        fileReader = new FileReader();

    fileReader.onload = (fileLoadedEvent) => $('img').attr('src', fileLoadedEvent.target.result);
    fileReader.readAsDataURL(imagem);
});