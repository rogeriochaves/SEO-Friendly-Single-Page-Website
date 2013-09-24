var after_load = function(){
	console.log('All loaded!');

	$('#horizontal').change(function(){
		if($(this).is(':checked')){
			$('.singlepage').removeClass('vertical').addClass('horizontal');
			$('.singlepage').singlepage('resize');
		}
	});

	$('#vertical').change(function(){
		if($(this).is(':checked')){
			$('.singlepage').removeClass('horizontal').addClass('vertical');
			$('.singlepage').singlepage('resize');
		}
	});
}

$('.singlepage').singlepage({
	pages: ["index.html", "about.html", "download.html", "last_page.html"],
	menu: 'nav a',
	ajax_load: {
		url: 'ajax_load.html',
		callback: after_load
	}
});