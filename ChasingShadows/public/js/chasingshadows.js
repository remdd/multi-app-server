$(function() {

	const IMGTIME = 300;
	const NAVTIME = 300;
	const THEMETIME = 300;
	var mainThemeFlag = true;
	var coverImgQueueHandler;
	var coverImgShowTime = 4000;

	//	Initial setup on page load
	$('#emailLinkIcon').tooltip();
	$('.bigText').bigtext({maxfontsize: 40});
	$('.bigTextSm').bigtext({maxfontsize: 30, minfontsize: 18});
	$('.showDiv').hide();

	//	Setup page on first load - render specific gallery / image if link contains query params, otherwise render '/' or '/music' landing page as appropriate
	function setInitialState() {
		var state = {
			firstLoad: true
		};
		if($('#allDiv').attr('data-mainTheme') === 'true') {
			state.mainTheme = true;
			state.showDiv = 'mainCover';
		} else {
			mainThemeFlag = false;
			state.mainTheme = false;
			state.showDiv = 'musicCover';
		}
		if($('#allDiv').attr('data-showDiv') != '') {
			state.showDiv = $('#allDiv').attr('data-showDiv');
			state.galName = $('#allDiv').attr('data-galName');
			state.galCount = parseInt($('#allDiv').attr('data-galCount'));
			state.thumbClass = $('#allDiv').attr('data-thumbClass');
			state.galCol = parseInt($('#allDiv').attr('data-galCol'));
			state.imgNo = parseInt($('#allDiv').attr('data-imgNo'));
		}
		if(state.mainTheme === true) {
			$('.mainMiniNav').removeClass('noDisplay');
			$('#mainMiniLogo').removeClass('invisible');
			$('#mainBigNav').removeClass('invisible').fadeIn(THEMETIME);
		} else {
			$('.musicMiniNav').removeClass('noDisplay');
			$('#musicMiniLogo').removeClass('invisible');
			$('#musicBigNav').removeClass('invisible').fadeIn(THEMETIME);
			flipTheme(state);
		}
		setupCoverImgs();
		renderShowPane(state);
	}

	function setupCoverImgs() {
		for(var i = 0; i < $('#mainCover .coverImg').length; i++) {
			var btn = '<div class="coverImgBtn" data-coverImg="' + i + '"></div>';
			console.log(btn);
			$('#mainCoverImgNav').append(btn);
		}
		for(var i = 0; i < $('#musicCover .coverImg').length; i++) {
			var btn = '<div class="coverImgBtn" data-coverImg="' + i + '"></div>';
			console.log(btn);
			$('#musicCoverImgNav').append(btn);
		}
		$('.coverImgBtn').click((e) => {
			unqueueNextCoverImg();
			setCoverImg(mainThemeFlag, parseInt($(e.target).attr('data-coverImg')));
			queueNextCoverImg();
		})
		setCoverImg(mainThemeFlag, 0);
	}

	function setCoverImg(mainTheme, num) {
		if(mainTheme) {
			$('#mainCover .coverImg').addClass('notShown');
			$('#mainCover .coverImgBtn').removeClass('selected');
			$($('#mainCover .coverImg').get(num)).removeClass('notShown');
			$($('#mainCover .coverImgBtn').get(num)).addClass('selected');
		} else {
			$('#musicCover .coverImg').addClass('notShown');
			$('#musicCover .coverImgBtn').removeClass('selected');
			$($('#musicCover .coverImg').get(num)).removeClass('notShown');
			$($('#musicCover .coverImgBtn').get(num)).addClass('selected');
		}
	}



	function renderShowPane(state) {
		if($('.dropdown').find('.dropdown-menu').is(':visible')) {
			$('.dropdown-toggle').dropdown('toggle');
		}
		if(state.firstLoad) {					//	On first load of page, just render page without hiding & removing previous elements
			showSwitch(state);
			return;
		}
		if(state.mainTheme != mainThemeFlag) {		//	If state to be rendered does not use current theme, flip the displayed theme
			mainThemeFlag = !mainThemeFlag;
			flipTheme(state);
		}
		if(state.showDiv != 'showZoomImg') {
			$('.picControl').css('pointer-events', 'none');
			$('.picControls').fadeOut(IMGTIME);
		}
		$('.showDiv').each(function() {
			if($(this).is(':visible')) {
				$(this).fadeOut(function() {
					$(this).addClass('invisible');
					removeThumbnails();
					showSwitch(state);
				});
			}
		});
	}

	function queueNextCoverImg() {
		coverImgQueueHandler = setTimeout(() => {
			if(mainThemeFlag) {
				nextNum = parseInt($('#mainCover .selected').attr('data-coverImg')) + 1 >= $('#mainCover .coverImg').length ? 0 : parseInt($('#mainCover .selected').attr('data-coverImg')) + 1;
				console.log(nextNum);
				setCoverImg(mainThemeFlag, nextNum);
				queueNextCoverImg();
			} else {
				nextNum = parseInt($('#musicCover .selected').attr('data-coverImg')) + 1 >= $('#musicCover .coverImg').length ? 0 : parseInt($('#musicCover .selected').attr('data-coverImg')) + 1;
				console.log(nextNum);
				setCoverImg(mainThemeFlag, nextNum);
				queueNextCoverImg();
			}
		}, coverImgShowTime)
	}

	function unqueueNextCoverImg() {
		clearTimeout(coverImgQueueHandler);
	}

	function showSwitch(state) {				//	Render appropriate 'showDiv' for the state being passed
		unqueueNextCoverImg();
		switch (state.showDiv) {
			case 'mainCover':
				$('#mainCover').removeClass('invisible').hide().fadeIn(THEMETIME, function() {
					saveState(state);
					setCoverImg(!mainThemeFlag, 0);
					setCoverImg(mainThemeFlag, 0);
					queueNextCoverImg();
				});
				break;
			case 'musicCover':
				$('#musicCover').removeClass('invisible').hide().fadeIn(THEMETIME, function() {
					saveState(state);
					setCoverImg(!mainThemeFlag, 0);
					setCoverImg(mainThemeFlag, 0);
					queueNextCoverImg();
				});
				break;
			case 'mainAbout':
				$('#mainAbout').removeClass('invisible').hide().fadeIn(IMGTIME, function() {
					saveState(state);
				});
				break;
			case 'musicAbout':
				$('#musicAbout').removeClass('invisible').hide().fadeIn(IMGTIME, function() {
					saveState(state);
				});
				break;
			case 'showThumbnails':
				addThumbnails(state);
				$('#showThumbnails').imagesLoaded(function() {
					$('#showThumbnails').removeClass('invisible').hide().fadeIn(IMGTIME);
					resizeThumbs();
					$grid.masonry();
					saveState(state);
				});
				break;
			case 'showZoomImg':
				console.log(state.subs);
				$('#zoomImg').attr('data-galName', state.galName);
				$('#zoomImg').attr('data-imgNo', state.imgNo);
				$('#zoomImg').attr('data-galCount', state.galCount);
				$('#zoomImg').attr('data-thumbClass', state.thumbClass);
				$('#zoomImg').attr('data-galCol', state.galCol);
				$('#zoomImg').attr('src', '/img/' + state.galName + '/' + state.galName + '_' + state.imgNo + '.jpg');
				$('#showZoomImg').imagesLoaded(function() {
					$('#showZoomImg').removeClass('invisible').hide().fadeIn(IMGTIME);
					if(!($('.picControls').is(':visible'))) {
						$('.picControls').fadeIn(IMGTIME, function() {
						});
					}
					$('.picControl').css('pointer-events', 'auto');
					if(state.subs) {
						console.log("Subs!");
						console.log(state.imgNo);
						var sub = subsArray[state.imgNo];
						console.log(sub);
						$('#subtitle').html(sub);
					} else {
						$('#subtitle').html('');
					}
					saveState(state);
				});
				break;
			default:
				break;
		}
	}

	//	Flip button
	$('.flipBtn').click(function() {
		mainThemeFlag = !mainThemeFlag;
		var state = {
			mainTheme: mainThemeFlag
		}
		if(mainThemeFlag) {
			state.showDiv = 'mainCover';
		} else {
			state.showDiv = 'musicCover';
		}
		flipTheme(state);
		renderShowPane(state);
	});

	flipTheme = function(state) {
		$('.flipBtn').css("pointer-events", "none");		// Disable further click events on click
		$('.flipBtn').toggleClass('flipped');
		$('body').toggleClass('blackTheme');
		$('.bigIcon').toggleClass('whiteIcons');
		$('.picControl').toggleClass('whiteIcons');
		if(!mainThemeFlag) {
			$('#mainBigNav').fadeOut(THEMETIME, function() {
				$('#mainBigNav, #mainMiniLogo').addClass('invisible');
				$('.mainMiniNav').addClass('noDisplay');
				$('.instagramLink').attr('href', 'https://www.instagram.com/london_reflected/');
				$('#musicBigNav, #musicMiniLogo').removeClass('invisible');
				$('.musicMiniNav').removeClass('noDisplay');
				$(".flipBtn").css("pointer-events", "auto");
			});
		} else {
			$('#musicBigNav').fadeOut(THEMETIME, function() {
				$('#musicBigNav, #musicMiniLogo').addClass('invisible');
				$('.musicMiniNav').addClass('noDisplay');
				$('.instagramLink').attr('href', 'https://www.instagram.com/chasing.light.and.shadows/');
				$('#mainBigNav, #mainMiniLogo').removeClass('invisible');
				$('.mainMiniNav').removeClass('noDisplay');
				$(".flipBtn").css("pointer-events", "auto");
			});
		}
	}

	function saveState(state) {			//	Save current state to browser history stack
		if(state && state.back) {		//	Prevent re-saving of the state if it is not 'new', ie is being accessed by browser 'back' command
			return;
		}
		var state = getState();
		var url = '/';
		if(!state.mainTheme) { 
			url += 'music/'
		}
		if(state.showDiv === 'showThumbnails') {
			url += '?' + 'showDiv=' + state.showDiv + '&';
			url += 'galName=' + state.galName + '&';
			url += 'galCount=' + state.galCount + '&';
			url += 'thumbClass=' + state.thumbClass + '&';
			url += 'galCol=' + state.galCol;
		} else if(state.showDiv === 'showZoomImg') {
			url += '?' + 'showDiv=' + state.showDiv + '&';
			url += 'galName=' + state.galName + '&';
			url += 'galCount=' + state.galCount + '&';
			url += 'thumbClass=' + state.thumbClass + '&';
			url += 'galCol=' + state.galCol + '&';
			url += 'imgNo=' + state.imgNo;
		} else if(state.showDiv === 'mainAbout' || state.showDiv === 'musicAbout') {
			url += '?' + 'showDiv=' + state.showDiv;
		}
		if(history.pushState) {
			history.pushState(state, '', url);	//	Push current state to browser history
		}
	}

	function getState() {				//	Get state of current browser window
		var state = {
			showDiv: $('.showDiv:visible').attr('id'),
			mainTheme: mainThemeFlag
		};
		if(state.showDiv === 'showThumbnails') {
			state.galName = $('.thumbImg').first().attr('data-galName');
			state.galCount = $('.thumbImg').first().attr('data-galCount');
			state.thumbClass = $('.thumbImg').first().attr('data-thumbClass');
			state.galCol = $('.thumbImg').first().attr('data-galCol');
		} else if(state.showDiv === 'showZoomImg') {
			state.imgNo = $('#zoomImg').attr('data-imgNo');
			state.galName = $('#zoomImg').attr('data-galName');
			state.galCount = $('#zoomImg').attr('data-galCount');
			state.thumbClass = $('#zoomImg').attr('data-thumbClass');
			state.galCol = $('#zoomImg').attr('data-galCol');
		}
		return state;
	}

	//	Handle browser 'back' commands
	window.onpopstate = function(e) {
		if(e && e.state) {
			var state = e.state;
			state.back = true;			//	Set flag to indicate that this state is being accessed by a browser 'back' command (used to prevent re-saving)
			renderShowPane(state);
		}
	}	

	//	Display landing page on site logo click
	$('.logoMain, .miniLogo').click(function() {
		if($('#mainCover').is(':visible') || $('#musicCover').is(':visible')) { return; }		//	Prevent re-rendering of landing page if already shown
		var state = {
			mainTheme: mainThemeFlag
		};
		if(mainThemeFlag) { state.showDiv = 'mainCover'; } else { state.showDiv = 'musicCover'; }
		renderShowPane(state);
	});

	//	Display 'about' page
	$('.aboutLink').click(function() {
		if(($('#mainAbout').is(':visible')) || $('#musicAbout').is(':visible')) { return; }		//	Prevent re-rendering of 'about' page if already shown
		var state = {
			mainTheme: mainThemeFlag
		};
		if(mainThemeFlag) { state.showDiv = 'mainAbout'; } else { state.showDiv = 'musicAbout'; }
		renderShowPane(state);
	})

	//	Display thumbnails when a gallery name is clicked
	$('.galLinkMain').click(function() {
		var state = {
			showDiv: 'showThumbnails',
			mainTheme: mainThemeFlag,
			galName: $(this).attr('data-gallery'),
			galCount: $(this).attr('data-pics'),
			thumbClass: $(this).attr('data-thumbClass'),
			galCol: $(this).attr('data-galCol')
		}
		if($(this).hasClass('publishedLink')) {
			state.subs = true;
		} else {
			state.subs = false;
		}
		console.log(state);
		renderShowPane(state);
	});
	//	Add & display thumbnails for a gallery
	addThumbnails = function(state) {
		for(var i = 1; i <= state.galCount; i ++) {
			var $imgDiv = $('#showThumbnails');
			if(parseInt(state.galCol) === 3) {				//	Display thumbnails in either 3 or 4 column layout per gallery class
				$imgDiv.append('<img class="thumbImg 3thumbImg" src="/img/' + state.galName + '/Thumbs/' + state.galName + '_' + i + '.jpg">');
			} else {
				$imgDiv.append('<img class="thumbImg 4thumbImg" src="/img/' + state.galName + '/Thumbs/' + state.galName + '_' + i + '.jpg">');
			}
			var $img = $imgDiv.children().last();			//	Add image & gallery attributes to each thumbnail
			$img.attr('data-galName', state.galName);
			$img.addClass(state.thumbClass);
			$img.attr('data-thumbClass', state.thumbClass);
			$img.attr('data-galCol', state.galCol);
			$img.attr('data-galCount', state.galCount);
			$img.attr('data-imgNo', i);
			$grid.masonry( 'addItems', $img );
		}
		$('.thumbImg, .3thumbImg').click(function() {		//	Add appropriate click listeners to each thumbnail for zooming individual images
			var state = {
				showDiv: 'showZoomImg',
				mainTheme: mainThemeFlag,
				galName: $(this).attr('data-galName'),
				galCount: $(this).attr('data-galCount'),
				thumbClass: $(this).attr('data-thumbClass'),
				imgNo: $(this).attr('data-imgNo'),
				galCol: $(this).attr('data-galCol')
			}
			renderShowPane(state);
		});
	};
	//	Clear gallery thumbnails
	removeThumbnails = function() {
		$('#showThumbnails').children().remove();
	}

	/*	Zoomed image controls 	*/
	$('#closePopUp').click(function() {
		var state = {
			showDiv: 'showThumbnails',
			mainTheme: mainThemeFlag,
			galName: $('#zoomImg').attr('data-galName'),
			galCount: $('#zoomImg').attr('data-galCount'),
			thumbClass: $('#zoomImg').attr('data-thumbClass'),
			galCol: $('#zoomImg').attr('data-galCol')
		}
		renderShowPane(state);
	});
	$('#prevBtn').click(function() {
		var state = getState();
		$('.picControl').css("pointer-events", "none");
		if(parseInt(state.imgNo) === 1) {
			state.imgNo = state.galCount;
		} else {
			state.imgNo--;
		}
		renderShowPane(state);
	});
	$('#nextBtn').click(function() {
		var state = getState();
		$('.picControl').css("pointer-events", "none");
		if(parseInt(state.imgNo) === parseInt(state.galCount)) {
			state.imgNo = 1;
		} else {
			state.imgNo++;
		}
		renderShowPane(state);
	});

	//	Initiate Masonry grid to display thumbnails
	var $grid = $('#showThumbnails').masonry({
		columnWidth: '.thumbImg',
		singleMode: true,
		itemSelector: '.thumbImg'
	});

	//	Check whether change to thumbnail layout is required if window is resized
	$(window).resize(function() {
		resizeThumbs();
	});

	//	Responsive resizing of thumbnails for smaller screens
	resizeThumbs = function() {
		if ($(window).width() > 767) {
	        $('.4thumbImg').removeClass('big4ThumbImg');
	        $('.4thumbImg').addClass('small4ThumbImg');
	        $('.3thumbImg').removeClass('big3ThumbImg');
	        $('.3thumbImg').addClass('small3ThumbImg');
	    } else {
	        $('.4thumbImg').removeClass('small4ThumbImg');
	        $('.4thumbImg').addClass('big4ThumbImg');
	        $('.3thumbImg').removeClass('small3ThumbImg');
	        $('.3thumbImg').addClass('big3ThumbImg');
	    }
		$grid.masonry();
	};

	//	Display contained galleries when a category title is clicked, hide contents of other categories
	$('.categoryLink').click(function(e) {
		if(e.target !== this) {return;}
		$('.galLink').not($(this).parent().parent().find('.galLink')).hide('fast');
		$(this).parent().parent().find('.galLink').toggle(NAVTIME);
	});

	//	Prevent context menu on right click images, at client's insistence!
	$("body").on("contextmenu", "img", function(e) {
		return false;
	});

	var subsArray = {
		'1': 'Stray Landings - Primal Scream Therapy: AJA - <a href="http://straylandings.co.uk/interviews/primal-scream-therapy-aja">link to article</a>'
	}





	setInitialState();

});