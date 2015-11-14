
/*
<!-- scroll functions -->
// true if the content gets longer than the viewport and scrolling is necessary
function checkIfScroll() {
	return ($(document).height() > $(window).height());
}

function changeWrapperHeight() {
	if(checkIfScroll()) {
		$('#wrapper').css('height', 'auto');
	} else {
		$('#wrapper').css('height', '100vh');
	}
}
*/

<!-- navigation stuff -->
var contentDivs = [
	[$("#developer-link"), $("#developer-content"), "developer-background-color", "/developer", "developer", "developer-background-image", "developer-background-image-mobile"],
	[$("#artist-link"), $("#artist-content"), "artist-background-color", "/artist", "artist", "artist-background-image", "artist-background-image-mobile"],
	[$("#trotter-link"), $("#trotter-content"), "trotter-background-color", "/globetrotter", "globe trotter", "trotter-background-image", "trotter-background-image-mobile"],
	[$("#human-link"), $("#human-content"), "human-background-color", "/contact", "contact me", "human-background-image", "human-background-image-mobile"],
];

// art gallery
var imageSrcs = [
	"art/spider.png",
	"art/amsterdam.png",
	"art/birdmask.png",
	"art/mask.png",
    "art/underwater.png",
    "art/girl-watercolor4.png",
    
];

var currentlyShowing = null;
var toShow;
var artLoaded = false;

// returns true if nothing is showing, false if something is
function isNothingShowing() {
	return (typeof(currentlyShowing) === "undefined" || currentlyShowing === null);
}

function showContent(contentToShow, contentToHide) {
	$("#content").fadeIn(100, function() {
		contentToShow.show("blind", 600);
	});

	if(contentToShow.is($("#artist-content")) && !artLoaded) {
		var displayWidth = 0;

		$.each(imageSrcs, function(i, src) {
			$("<img/>")
				.attr('src', src)
				.load(function() {
					displayWidth += (this.width + 40); //margin-left here
					$("#art-display-inner").css("width", displayWidth);
			});
			$('<li><img src="' + src + '" /></li>').hide().appendTo("#images-list").fadeIn(2000);
		});

		artLoaded = true;
	}
}

function navClick(contentToShow, contentToHide) {
	// nothing is being displayed so far
	if(typeof(contentToHide) === "undefined" || contentToHide === null) {
		showContent(contentToShow[1]);
	}
	// don't do anything if person clicked same link currently showing
	else if(contentToShow[1].is(contentToHide)) {
		return;
	}

	// swap old content out, bring new content in
	else {
		contentToHide[1].hide("blind", 400, function() {
			// hide other content divs
			$.each(contentDivs, function(ind, item) {
				if(!contentToShow[1].is(item[1])) {
					item[1].hide();
				}
			});

			showContent(contentToShow[1]);
		});
	}
}

// returns string of all categories that are not this category with a space between
function createToRemoveString(currentCategory, removeImage, mobile) {
	var removeImage = (typeof removeImage !== 'undefined') ? removeImage : false;
	var mobile = (typeof removeImage !== 'undefined') ? mobile : false;
  	var toRemove = "";
	$.each(contentDivs, function(ind, item) {
		if(!currentCategory[1].is(item[1])) {
			toRemove += item[2] + " ";
			toRemove += (removeImage) ? (item[5] + " ") : "";
			toRemove += (mobile) ? item[6] + " " : "";
		}
	});
	return toRemove;
}

function createHoverFunction(category) {
	return function(){
		if(isNothingShowing()) {
			var toRemove = createToRemoveString(category);
			$('body').switchClass(toRemove, category[2]); // change entire body to respective background color
		} else { // something is already showing
			var toRemove = createToRemoveString(category);
			$('#big-title').switchClass(toRemove, category[2], 300, "linear");
		}
	}
}

function createHoverOffFunction(category) {
	return function() {
		if(isNothingShowing()) {
			// category = thing hovering over
			var toRemove = createToRemoveString(currentlyShowing); // should remove category bg
			$('#big-title').switchClass(toRemove, currentlyShowing[2], 300, "linear");
		}
	}
}

function createClickFunction(category) {
	return function() {
		toShow = category;

		if(isNothingShowing()) { // if nothing is currently showing
			// change positioning
			$('#wrapper').css('height', 'auto');
			$('#big-title').addClass('big-title-padding');
			$('body').switchClass(category[2], '');
		}

		// change background
		var toRemove = createToRemoveString(category, true);
		var toRemoveMobile = createToRemoveString(category, true, true);
		var toAdd = category[2] + " " + category[5];

		$('#big-title').switchClass(toRemove, toAdd, 300, "linear"); // changes background color to color of link
		$('body').switchClass(toRemoveMobile, category[6], 300, "linear", function() {
			navClick(toShow, currentlyShowing);
			currentlyShowing = toShow;
		});
	}
}

function createHistoryBinding(category) {
	return function() {
		category[0].trigger("click");
		document.title = category[4] + " | Katherine Chao"
	}
}


$(document).ready(function(){

	$("#content").hide();

	$.each(contentDivs, function(ind, item) {
		var linkDiv = item[0];
		var contentDiv = item[1];

		linkDiv.hover( createHoverFunction(item), createHoverOffFunction(item) );
		linkDiv.click( createClickFunction(item) );
		$.History.bind(item[3], createHistoryBinding(item) );
		contentDiv.hide();
	});
	
});

