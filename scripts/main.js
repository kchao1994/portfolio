
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
			[$("#developer-link"), $("#developer-content"), "developer-background"],
			[$("#artist-link"), $("#artist-content"), "artist-background"],
			[$("#trotter-link"), $("#trotter-content"), "trotter-background"],
			[$("#human-link"), $("#human-content"), "human-background"],
		];

		function showContent(contentToShow, contentToHide) {
			
			$("#content").fadeIn(100, function() {
				contentToShow.show("blind", 600);
			});
		}

		function navClick(contentToShow, contentToHide) {
			// don't do anything if person clicked same link currently showing
			if(contentToShow.is(contentToHide)) {
				return;
			}

			// nothing is being displayed so far
			else if(typeof(contentToHide) === "undefined" || contentToHide === null) {
				showContent(contentToShow);
			}

			// swap old content out, bring new content in
			else {
				contentToHide.hide("blind", 400, function() {
					// hide other content divs
					$.each(contentDivs, function(ind, item) {
						if(!contentToShow.is(item[1])) {
							item[1].hide();
						}
					});

					showContent(contentToShow);
				});
			}
		}

		// returns string of all categories that are not this category with a space between
		function createToRemoveString(currentCategory) {
		  	var toRemove = "";
			$.each(contentDivs, function(ind, item) {
				if(!currentCategory[1].is(item[1])) {
					toRemove += item[2] + " ";
				}
			});
			return toRemove;
		}

		function createHoverFunction(category) {
  			return function(){
  				if(typeof(currentlyShowing) === "undefined" || currentlyShowing === null) {
	  				var toRemove = createToRemoveString(category);
	    			$('body').switchClass(toRemove, category[2]);
    			}
  			}
		}

		function createClickFunction(category) {
			return function() {
				toShow = category[1];

				// change positioning
				//$('#wrapper').addClass('height-auto');
				$('#wrapper').css('height', 'auto');
				$('#big-title').addClass('big-title-padding');
				
				// change background
				var toRemove = createToRemoveString(category);

				$('#big-title').switchClass(toRemove, category[2], 300, "linear"); // changes background color to color of link
	    		$('body').switchClass(category[2], '', 300, "linear", function() { // changes color to white
	    			navClick(toShow, currentlyShowing);
	    			currentlyShowing = toShow;
	    		});
			}
		}

		var currentlyShowing = null;
		var toShow;



		$(document).ready(function(){
			$.History.bind('/developer',function(state){
				$("#developer-link").trigger("click");
				document.title = "developer | Katherine Chao"
			});

			$.History.bind('/artist',function(state){
				$("#artist-link").trigger("click");
				document.title = "artist | Katherine Chao"
			});
			
			$.History.bind('/globetrotter',function(state){
				console.log("asdf");
				$("#trotter-link").trigger("click");
				document.title = "globetrotter | Katherine Chao"
			});

			$("#content").hide();
			$.each(contentDivs, function(ind, item) {
				var linkDiv = item[0];
				var contentDiv = item[1];

				linkDiv.hover( createHoverFunction(item) );
				linkDiv.click( createClickFunction(item) );
				contentDiv.hide();
			});

		});