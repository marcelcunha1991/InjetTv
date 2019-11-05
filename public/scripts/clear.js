$("#clear").click(function() {
    localStorage.clear();
    window.location.href = '/painel';
    alert('dados limpos')
});