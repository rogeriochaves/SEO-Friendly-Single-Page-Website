/*
	Created by rogeriochaves (github.com/rogeriochaves)
*/

(function($){

	var w = $(window).width();
	var h = $(window).height();
	var onResize = function(singlepage){
		return function(){
			w = $(window).width();
			h = $(window).height();

			var frames_count = singlepage.find('.frame').length;
			var vertical = singlepage.hasClass('vertical');
			singlepage.find('.frame').css({height: h, width: w});
			if(vertical){
				singlepage.css({height: h * frames_count + 'px', width: w + 'px'});
				singlepage.find('.frame').css({top: h * i, left: 0});
			}else{
				var i = 0;
				singlepage.css({width: w * frames_count + 'px', height: h + 'px'});
				singlepage.find('.frame').each(function(){
					$(this).css({top: 0, left: w * i});
					i++;
				});
			}
		}
	}

	var init = function(elem, options){
		var singlepage = $(elem);
		var pages = options.pages;
		var menu = $(options.menu);
		var current_index = 0;

		$(window).resize(onResize(singlepage));
		onResize(singlepage)();

		if(menu){
			menu.click(function(){
				var href = $(this).attr('href').replace('/', '');
				if(href === '') href = pages[0];
				var index = 0;
				for(var i = pages.length; i--;){
					if(pages[i] === href){
						index = i;
						break;
					}
				}
				current_index = index;
				move_to(index, true);

				$('.menu-selected').removeClass('menu-selected');
				$(this).addClass('menu-selected');

				document.title = $(this).attr('title');
				if (history && history.pushState){
					history.pushState(null, document.title, $(this).attr('href'));
				}else{
					//window.location.hash = href;
				}

				return false;
			});
		}

		var move_to = function(index, animated, fn){
			var vertical = singlepage.hasClass('vertical');

			if (vertical) {
				var margin = index * h;
				if (animated) {
					$('html, body').stop().animate({scrollTop: margin});
				}else{
					$('html, body').stop().animate({scrollTop: margin}, 0);
				}
			}else{
				var margin = index * w;
				if (animated) {
					$('html, body').stop().animate({scrollLeft: margin});
				}else{
					$('html, body').stop().animate({scrollLeft: margin}, 0);
				}
			}
		}

		// ajax_load

		if(options.ajax_load){
			var pgs = [];
			var current_page = window.location.pathname;
			var index = 0;
			if(current_page === "/" || current_page === "") current_page = pages[0];
			for(var i = 0; i < pages.length; i++){
				if(pages[i] !== current_page && '/' + pages[i] !== current_page){
					pgs.push(pages[i])
				}else{
					index = i;
				}
			}
			current_index = index;
			move_to(index, false);

			if(menu){
				$('.menu-selected').removeClass('menu-selected');
				menu.parent().find('[href="'+pages[current_index]+'"]').addClass('menu-selected');
			}

			$.get(options.ajax_load.url, {pages: pgs.join(',')}, function(data){
				data = $(data);
				data.each(function(){
					if(singlepage.find('#' + $(this).attr('id')).length === 0){
						singlepage.append(this);
					}
				});
				for(var i = pages.length; i--;){
					var id = pages[i].split('.')[0];
					singlepage.find("#" + id).prependTo(singlepage);
				}
				onResize(singlepage)();
				move_to(index, false);
				if(options.ajax_load.callback) options.ajax_load.callback();
			});
			
		}
	}

	$.fn.singlepage = function (options) {
		if(options === 'resize'){
			onResize($(this.selector))();
		}else{
			var defaults = {
				pages: [],
				menu: null,
				ajax_load: false
			}
			init(this.selector, options);
		}
	}

})(jQuery);