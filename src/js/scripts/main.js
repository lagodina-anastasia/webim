$(document).ready(function () {
    var exampleFontData = {
        'Ubuntu': [
            {weight: 400},
            {weight: 700}
        ]
    };
    var observers = [];
    Object.keys(exampleFontData).forEach(function (family) {
        var data = exampleFontData[family];
        var obs = new FontFaceObserver(family, data);
        observers.push(obs.load());
    });
    Promise.all(observers)
        .then(function () {
            document.documentElement.classList.add('webfont-loaded');
            document.cookie = "webfont-loaded=true";
        })
        .catch(function (err) {
            console.warn('Some critical font are not available:', err);
        });
    svg4everybody();
    var wow = new WOW({
        offset: 50,
        resetAnimation: false
    });
    wow.init();
    $('.js-burger').click(function (e) {
        $(this).toggleClass('active');
        $('.header-nav').slideToggle(200);
    });
});