$(() => $('select').formSelect());
// if (localStorage.getItem('cliente')) {
    
//     if(JSON.parse(localStorage.getItem('cliente')).maquinas == true){
//         $("#painelMaquinas").prop('checked', true);
//     }else{
//         $("#painelMaquinas").prop('checked',false)
//     }
//     if(JSON.parse(localStorage.getItem('cliente')).produtividade == true){
//         $("#painelProdutividade").prop('checked', true);
//     }else{
//         $("#painelProdutividade").prop('checked',false)
//     }
//     if(JSON.parse(localStorage.getItem('cliente')).paradas == true){
//         $("#painelParadas").prop('checked', true);
//     }else{
//         $("#painelParadas").prop('checked',false)
//     }
    
//     $('#galpao').val(JSON.parse(localStorage.getItem('cliente')).galpao)
//     $('#preloader').fadeIn().toggleClass('hide');
//     $('form').unbind('submit').submit();

// } else {
//     // $('form').ready(function (event) {
//     //     if (localStorage.getItem('cliente')) {
//     //         if (!$('#painelProdutividade').is(':checked') && !$('#painelMaquinas').is(':checked') && !$('#painelParadas').is(':checked'))
//     //             M.toast({ html: 'Por favor, selecione alguma das opções para exibir o painel!', displayLength: 2000 });
//     //         else {
//     //             // $('#preloader').fadeIn().toggleClass('hide');
//     //             // $('form').unbind('submit').submit();
//     //         };
//     //     } else
//     //         M.toast({ html: 'Por favor, um grupo de trabalho para continuar!', displayLength: 2000 });
//     // });
// }

// var ip = "http://idw.tutiplast.com.br:8080";
var ip = "http://170.10.0.203:8090";

$('form').submit(function (event) {
    event.preventDefault();
    if ($('#galpao').val() !== null) {
        // if (!$('#painelProdutividade').is(':checked') && !$('#painelMaquinas').is(':checked') && !$('#painelParadas').is(':checked') && !$('#painelPerformanceMaquinas').is(':checked'))
        //     M.toast({ html: 'Por favor, selecione ao menos um painel para exibir!', displayLength: 2000 });
        // else {
        //     $('#preloader').fadeIn().toggleClass('hide');
        //     $(this).unbind('submit').submit();
        // };
        if ($('#painelPerformanceMaquinas').is(':checked')) {
            $(this).unbind('submit').submit();
        }

    } else
        M.toast({ html: 'Por favor, um grupo de trabalho para continuar!', displayLength: 2000 });

    // if ($('#galpao').val() === null)
    //     M.toast({ html: 'Por favor, um grupo de trabalho para continuar!', displayLength: 2000 });
});


$('#galpao').change(e => {

    var galpaoTemp;
    var produtividadeTemp;
    var maquinasTemp;
    var paradasTemp;
    var painelPerformanceMaquinas;

    galpaoTemp = $('#galpao').val();
    produtividadeTemp = $('#painelProdutividade').val();
    maquinasTemp = $('#painelMaquinas').val();
    paradasTemp = $('#painelParadas').val();
    painelPerformanceMaquinas = $('#painelPerformanceMaquinas').val();

    $('#preloader').fadeIn().toggleClass('hide');
    axios.get(ip+`/idw/rest/injet/pts/ativoByGalpao`, {
        params: {
            gt:galpaoTemp
        }
    })
    .then(response => {
        console.log("gt " + galpaoTemp)

        $('#preloader').fadeOut().toggleClass('hide');
        
        $('#maquinas').find('option').remove().end();      
        
        console.log("Galpao "  +$("#galpao option:selected").html())

        $('#dsGt').val($("#galpao option:selected").html());
 
        console.log("Valor do campo dsGt " + $("#dsGt").val())

        response.data.pts.forEach(pt => $('#maquinas').append(`<option value='${pt.cdPt}'>${pt.cdPt}</option>`));
        $('select').formSelect();
    })
    .catch(err => {
        M.toast({ html: 'Falha ao carregar máquinas, tente novamente mais tarde. ' + error, displayLength: 2000 })
    })

    var cliente = {
        galpao: $("#galpao").val(),
        produtividade: $('#painelProdutividade').is(':checked'),
        maquinas: $('#painelMaquinas').is(':checked'),
        paradas: $("#painelParadas").is(':checked'),
        painelPerformanceMaquinas: $("#painelPerformanceMaquinas").is(':checked'),
        cor_fundo: '#ffffff',
        path_logo: ''
    };
   
    // localStorage.setItem("galpao", $("#galpao").val());
    // console.log(cliente);
    return true;


});

$('#btn-cor').click(() => $('body').css('background-color', $('#cor_fundo').val()));

$('input:file').change(e => {
    let imagem = document.getElementById('imagem').files[0],
        fileReader = new FileReader();

    fileReader.onload = (fileLoadedEvent) => $('img').attr('src', fileLoadedEvent.target.result);
    fileReader.readAsDataURL(imagem);
});