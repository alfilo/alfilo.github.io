function addPage(page, book) {
    // let id, pages = book.turn('pages');
    let element = $('<div />', {})
    if (book.turn('addPage', element, page)) {
        element.html('<div class="gradient"></div><div class="loader"></div>')
        loadPage(page, element)
	}
}

function loadPage(page, pageElement) {
    let img = $('<img />')
    img.mousedown(function(e) {
		e.preventDefault()
	});
    img.load(function() {
		$(this).css({width: '100%', height: '100%'})
        $(this).appendTo(pageElement)
        pageElement.find('.loader').remove()
	})
    img.attr('src', 'pages/' +  page + '.jpg')
}

function loadLargePage(page, pageElement) {
	let img = $('<img />')
    img.load(function() {
        let prevImg = pageElement.find('img')
		$(this).css({width: '100%', height: '100%'})
		$(this).appendTo(pageElement)
		prevImg.remove()
	})
    img.attr('src', 'pages/' +  page + '-large.jpg')
}


function loadSmallPage(page, pageElement) {
	let img = pageElement.find('img')
	img.css({width: '100%', height: '100%'})
	img.unbind('load')
	img.attr('src', 'pages/' +  page + '.jpg')
}



// http://code.google.com/p/chromium/issues/detail?id=128488
function isChrome() {
    return navigator.userAgent.indexOf('Chrome')!=-1;
}

window.onload = function() {
    let num, div
    let obj = {2025: 30, 2026: 0}
    let count = obj[window.location.href.slice(window.location.href.length-9, window.location.href.length-5)]
    // $("body").append($("<div class='flipbook'>").wrap($("<div class='container'>")).wrap($("<div class='flipbook-viewport'>")))
    for (let i = 0; i < count-1; i++) {
        if (i < 9) num = "0" + `${i+1}`
        else num = (i+1).toString()
        div = $("<div>").css(`background-image`,`url("pages/the-abstract-${year}/The\ Abstract\ ${year}_page-00${num}.jpg")`)
        $(".flipbook").append(div)
    }
    function loadApp() {
        $('.flipbook').turn({
            width:922,
            height:600,
            elevation: 50,
            gradients: true,
            autoCenter: true
        });
    }
    loadApp()
}