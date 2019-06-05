$(() => $('select').formSelect());

$('form').submit(function(event) {
    event.preventDefault();
    if($('#galpao').val() !== null) {
        if(!$('#painelProdutividade').is(':checked') && !$('#painelMaquinas').is(':checked') && !$('#painelParadas').is(':checked'))
            M.toast({html: 'Por favor, selecione ao menos um painel para exibir!', displayLength: 2000});
        else {
            $('#preloader').fadeIn().toggleClass('hide');
            $(this).unbind('submit').submit();
        };
    } else
        M.toast({html: 'Por favor, um grupo de trabalho para continuar!', displayLength: 2000});
});


$('#galpao').change(e => {
    localStorage.setItem('galpao', $('#galpao option:selected').text());
    $('#preloader').fadeIn().toggleClass('hide');
    axios.post('/maquinas/search', {
        galpao: $('#galpao').val(),
    })
    .then(response => {
        $('#preloader').fadeOut().toggleClass('hide');
        response.data.forEach(pt => $('#maquinas').append(`<option value='${pt.cdPt}'>${pt.cdPt}</option>`));
        $('select').formSelect();
    })
    .catch(error => M.toast({html: 'Falha ao carregar máquinas, tente novamente mais tarde. ' + error, displayLength: 2000}));
});

$('#btn-cor').click(() => $('body').css('background-color', $('#cor_fundo').val()));

$('input:file').change(e => {
    let imagem = document.getElementById('imagem').files[0],
        fileReader = new FileReader();

    fileReader.onload = (fileLoadedEvent) => $('img').attr('src', fileLoadedEvent.target.result);
    fileReader.readAsDataURL(imagem);
});