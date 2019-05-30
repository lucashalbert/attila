jQuery(function($) {

	var body = $('body');
	var html = $('html');
	var viewport = $(window);

	/* ==========================================================================
	   Menu
	   ========================================================================== */

	function menu() {
		html.toggleClass('menu-active');
	};

	$('#menu').on({
		'click': function() {
			menu();
		}
	});

	$('.menu-button').on({
		'click': function() {
			menu();
		}
	});

	$('.hidden-close').on({
		'click': function() {
			menu();
		}
	});

	/* ==========================================================================
	   Parallax cover
	   ========================================================================== */

	var cover = $('.cover');
	var coverPosition = 0;

	function prlx() {
		if(cover.length >= 1) {
			var windowPosition = viewport.scrollTop();
			(windowPosition > 0) ? coverPosition = Math.floor(windowPosition * 0.25) : coverPosition = 0;
			cover.css({
				'-webkit-transform' : 'translate3d(0, ' + coverPosition + 'px, 0)',
				'transform' : 'translate3d(0, ' + coverPosition + 'px, 0)'
			});
			(viewport.scrollTop() < cover.height()) ? html.addClass('cover-active') : html.removeClass('cover-active');
		}
	}
	prlx();

	viewport.on({
		'scroll': function() {
			prlx();
		},
		'resize': function() {
			prlx();
		},
		'orientationchange': function() {
			prlx();
		}
	});

	/* ==========================================================================
	   Reading Progress
	   ========================================================================== */

	var post = $('.post-content');

	function readingProgress() {
		if(post.length >= 1) {
			var postBottom = post.offset().top + post.height();
			var windowBottom = viewport.scrollTop() + viewport.height();
			var progress = 100 - (((postBottom - windowBottom) / (postBottom - viewport.height())) * 100);
			$('.progress-bar').css('width', progress + '%');
			(progress > 100) ? $('.progress-container').addClass('ready') : $('.progress-container').removeClass('ready');
		}
	}
	readingProgress();

	viewport.on({
		'scroll': function() {
			readingProgress();
		},
		'resize': function() {
			readingProgress();
		},
		'orientationchange': function() {
			readingProgress();
		}
	});

	/* ==========================================================================
	   Gallery
	   ========================================================================== */

	function gallery() {
		var images = document.querySelectorAll('.kg-gallery-image img');
		images.forEach(function (image) {
			var container = image.closest('.kg-gallery-image');
			var width = image.attributes.width.value;
			var height = image.attributes.height.value;
			var ratio = width / height;
			container.style.flex = ratio + ' 1 0%';
		});
	}
	gallery();

	/* ==========================================================================
	   Style code blocks with highlight and numbered lines
	   ========================================================================== */

	function codestyling() {
		$('pre code').each(function(i, e) {
			hljs.highlightBlock(e);

			if(!$(this).hasClass('language-text')) {
				var code = $(this);
				var lines = code.html().split(/\n/).length;
				var numbers = [];
				for (i = 1; i < lines; i++) {
					numbers += '<span class="line">' + i + '</span>';
				}
				code.parent().append('<div class="lines">' + numbers + '</div>');
			}
		});
	}
	codestyling();

	/* ==========================================================================
	   Responsive Videos with Fitvids
	   ========================================================================== */

	function video() {
		$('#wrapper').fitVids();
	}
	video();

	/* ==========================================================================
	   Initialize and load Disqus
	   ========================================================================== */

	if (typeof disqus === 'undefined') {
		$('.post-comments').css({
			'display' : 'none'
		});
	} else {
		$('#show-disqus').on('click', function() {
			$.ajax({
				type: "GET",
				url: "//" + disqus + ".disqus.com/embed.js",
				dataType: "script",
				cache: true
			});
			$(this).parent().addClass('activated');
		});
	}

	/* ==========================================================================
	   Dark/Light Mode
	   ========================================================================== */

	function darkMode() {
		$('#wrapper').addClass('dark-mode');
		$('.post-title').addClass('dark-mode');
		$('.post-excerpt').addClass('dark-mode');
		$('.post-info').addClass('dark-mode');
		$('.pagination-info').addClass('dark-mode');
		$('.credits').addClass('dark-mode');
		$('#lightswitch').prop('value', 'Day Mode');
		localStorage.setItem('lightDarkMode', JSON.stringify({'mode': 'dark' }));
	};

	function lightMode() {
		$('#wrapper').removeClass('dark-mode');
		$('.post-title').removeClass('dark-mode');
		$('.post-excerpt').removeClass('dark-mode');
		$('.post-info').removeClass('dark-mode');
		$('.pagination-info').removeClass('dark-mode');
		$('.credits').removeClass('dark-mode');
		$('#lightswitch').prop('value', 'Night Mode');
		localStorage.setItem('lightDarkMode', JSON.stringify({'mode': 'light' }));
	};

	function checkLightDarkMode() {
		storedLightDarkMode = JSON.parse(localStorage.getItem('lightDarkMode'));
		if (storedLightDarkMode.mode == 'light') {
			lightMode();
			return 'light';
		} else if (storedLightDarkMode.mode == 'dark') {
			darkMode();
			return 'dark';
		} else {
			console.log('current light/dark mode could not be determined... Setting to light mode');
			lightMode();
			return 'light';
		}

	};

	if (localStorage.getItem('lightDarkMode') === null) {
		lightMode();
	} else {
		storedLightDarkMode = JSON.parse(localStorage.getItem('lightDarkMode'));
		if (storedLightDarkMode.mode == 'light') {
			lightMode();
		} else {
			darkMode();
		}
		delete storedLightDarkMode;
	}

	$('input#lightswitch').on('click', function(){
		mode=checkLightDarkMode();
		if(mode == 'light') {
			darkMode();
		} else if(mode == 'dark') {
			lightMode();
		} else {
			console.log ('light dark mode switching errors...');
		}
	});
});
