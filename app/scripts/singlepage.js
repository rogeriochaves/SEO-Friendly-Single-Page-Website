/*
	Created by rogeriochaves (github.com/rogeriochaves)
*/

window.getIOSWindowHeight = function() {
    // Get zoom level of mobile Safari
    // Note, that such zoom detection might not work correctly in other browsers
    // We use width, instead of height, because there are no vertical toolbars :)
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;

    // window.innerHeight returns height of the visible area. 
    // We multiply it by zoom and get out real height.
    return window.innerHeight * zoomLevel;
};

// You can also get height of the toolbars that are currently displayed
window.getHeightOfIOSToolbars = function() {
    var tH = (window.orientation === 0 ? screen.height : screen.width) -  getIOSWindowHeight();
    return tH > 1 ? tH : 0;
};

(function($){

	var w = $(window).width();
	var h = $(window).height();
	var top = $(window).scrollTop();
	var current_index = 0;
	var pages = [];
	var singlepage = null;
	var scrolling = false;

	var init = function(elem, options){
		singlepage = $(elem);
		pages = options.pages;
		var order = options.order || options.pages;
		var menu = $(options.menu);
		//$('.frame, .contents').css('height' , 'auto');
		
		$(window).resize(onResize(singlepage));

		if(typeof window.orientation !== 'undefined'){
			var viewport = 0;
			setInterval(function(){
				var temp = getIOSWindowHeight();
				if(temp != cheight){
					viewport = temp;
					onResize(singlepage)();
				}
			}, 250);
		}

		$(window).scroll(onScroll(singlepage, options));
		onResize(singlepage)();
		onScroll(singlepage, options)();

		if(menu){
			menu.click(function(){
				gotoPage($(this), true);

				return false;
			});
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
			move_to(current_index, false);

			if(menu){
				var selected = menu.parent().find('[href="'+pages[current_index]+'"]');
				if(selected.length > 0){
					$('.menu-selected').removeClass('menu-selected');
					selected.addClass('menu-selected');
				}
			}

			$.get(options.ajax_load.url, {pages: pgs.join(',')}, function(data){
				data = $(data);
				data.each(function(){
					if(singlepage.find('#' + $(this).attr('id')).length === 0){
						singlepage.append(this);
					}
				});
				for(var i = order.length; i--;){
					var id = order[i].split('.')[0];
					singlepage.find("#" + id).prependTo(singlepage);
				}
				move_to(current_index, false);
				onResize(singlepage)();
				onScroll(singlepage, options)();
				move_to(current_index, false);
				if(options.ajax_load.callback) options.ajax_load.callback();
			});
			
		}


		$(window).bind("popstate", function(e) {
			scrolling = true;

			/*setTimeout(function(){
				scrolling = false;
			}, 200);*/
			//console.log(window.location.pathname);

			
			var a = $(options.menu + '[href="'+window.location.pathname+'"]');
			if(a.length === 0){
				a = $(options.menu + '[href="'+window.location.pathname.replace('/', '')+'"]');
			}
			var href = a.attr('href').replace('/', '');
			if(href === '') href = pages[0];
			var index = 0;
			for(var i = pages.length; i--;){
				if(pages[i] === href){
					index = i;
					break;
				}
			}
			current_index = index;
			move_to(index, true, function(){
				onResize(singlepage)();
				onScroll(singlepage, options)();
			});
			return false;
		});
	}

	var onResize = function(singlepage){
		return function(){
			w = $(window).width();
			h = $(window).height();

			if(typeof window.orientation !== 'undefined'){
				h = getIOSWindowHeight();
			}

			var frames_count = singlepage.find('.frame').length;
			var vertical = singlepage.hasClass('vertical');
			if(vertical){
				var h_total = 0;
				singlepage.find('.frame').css({width: w}).each(function(){
					var h_temp = $(this).find('.contents').height();
					$(this).css({top: h_total, left: 0});
					if(h_temp < h){
						h_total += h;
						$(this).css({height: h});
					}else{
						h_total += h_temp;
						$(this).css('height', h_temp);
					}
				});
				singlepage.css({height: h_total + 'px', width: w + 'px'});
			}else{
				var w_total = 0;
				singlepage.find('.frame').css({width: w}).each(function(){
					var w_temp = $(this).find('.contents').width();
					$(this).css({left: w_total, top: 0});
					if(w_temp < w){
						w_total += w;
						$(this).css({width: w});
					}else{
						w_total += w_temp;
						$(this).css('width', w_temp);
					}
				});
				singlepage.css({width: w_total + 'px', height: h + 'px'});
			}
		}
	}

	var onScroll = function(singlepage, options){
		var menu = $(options.menu);

		return function(){
			top = $(window).scrollTop();

			if(scrolling) return false;
			//console.log('lulz');
			var last_index = current_index;
			for(index in pages){
				var page = pages[index];
				var elem = $("#" + pages[index]);
				if(elem.length > 0 && top >= $("#" + pages[index]).offset().top){
					current_index = index;
				}
			}
			if(last_index != current_index){
				var href = pages[current_index];
				if(href === "index") href = "/";
				var menu = $(options.menu + "[href='"+href+"']");
				if(menu.length > 0) gotoPage(menu, false);
			}
		}
	}

	var move_to = function(index, animated, fn){
		var vertical = singlepage.hasClass('vertical');

		scrolling = true;
		var time = 0;
		if (vertical) {
			var margin = $('#' + pages[index].split('.')[0]).offset().top;
			if (animated) {
				$('html, body').stop().animate({scrollTop: margin}, 500);
				time = 500;
			}else{
				$('html, body').stop().animate({scrollTop: margin}, 0);
			}
		}else{
			var margin = $('#' + pages[index].split('.')[0]).offset().left;
			if (animated) {
				$('html, body').stop().animate({scrollLeft: margin}, 500);
				time = 500
			}else{
				$('html, body').stop().animate({scrollLeft: margin}, 0);
			}
		}

		setTimeout(function(){
			scrolling = false;
			if(fn) fn();
		}, time * 1.1);
	}

	var last_history = null;
	var gotoPage = function(menu, move){
		var href = $(menu).attr('href').replace('/', '');
		if(href === '') href = pages[0];
		var index = 0;
		for(var i = pages.length; i--;){
			if(pages[i] === href){
				index = i;
				break;
			}
		}
		current_index = index;
		
		$('.menu-selected').removeClass('menu-selected');
		$(menu).addClass('menu-selected');

		var href = $(menu).attr('href');
		if (history && history.pushState && last_history !== href){
			history.pushState(null, document.title, href);
			last_history = href;
		}else{
			//window.location.hash = href;
		}
		document.title = $(menu).attr('title');

		if(move) move_to(index, true);
	}

	$.fn.singlepage = function (options) {
		if(options === 'resize'){
			onResize($(this.selector))();
		}else{
			var defaults = {
				pages: [],
				order: null,
				menu: null,
				ajax_load: false
			}
			init(this.selector, options);
		}
	}

})(jQuery);