
	
	function startSlide(frequency){
		
		var frequency = (!_.is(frequency))? 12000 : frequency;
		var has_progress_bar = ($(".progress_bar .bar").size()==1);
		
		var $sliding_icons = $(".slidingIcon");
		var $slides = $(".canvas");
		var $indicators_on = $(".iconBadge_bg.little.on");
		var $indicators = $(".iconBadge_bg.little");
		var $texts = $(".slide_txt");
		var interval;
		var animation_in_progress = false;
		
		startInterval();
		
		function startInterval(){
			interval = setInterval(function(){
				goAhead();
			},frequency);
			if(has_progress_bar)
				goAheadProgressBar();
		}
		
		function restartInterval(){
			clearInterval(interval);
			startInterval();
			
		}
		
		
		
		
		
	
		
		function goAhead(index){
				if(animation_in_progress)
					return false;
				animation_in_progress = true;
				
				if(has_progress_bar)
					resetProgressBar();
				
				/* SLIDING ICON */
				var $current_sliding_icon,$next_sliding_icon;
				$sliding_icons.each(function(){
					if($(this).css("left") == "129px"){
						$current_sliding_icon = $(this);
						$next_sliding_icon = (index != undefined) ? $sliding_icons.eq(index): ($(this).next().size() != 0) ? $(this).next() : $sliding_icons.eq(0);
					}
				});
				
				$current_sliding_icon.animate({left: "24px"}, 300,function(){
					$next_sliding_icon.animate({left: "129px"}, 1000, "easeOutElastic");
				});
				
				
				/* SLIDE */
				var $current_slide,$next_slide;
				$slides.each(function(){
					if($(this).css("left") == "100px"){
						$current_slide = $(this);
						$next_slide = (index != undefined) ? $slides.eq(index) : ($(this).next().size() != 0) ? $(this).next() : $slides.eq(0);
					}
				});
				$current_slide.animate({left: "430px"}, 300,function(){
					$next_slide.animate({left: "100px"}, 1000, "easeOutElastic",function(){
						animation_in_progress = false;
					});
				});
				
				
				/* TEXT */
				var $current_text,$next_text;
				$texts.each(function(){
					if($(this).is(":visible")){
						$current_text = $(this);
						$next_text = (index != undefined) ? $texts.eq(index) : ($(this).next().size() != 0) ? $(this).next() : $texts.eq(0);
					}
				});
				$current_text.hide("fade",300,function(){
					$next_text.show("fade",300);
				});
				
				
				/* INDICATORI */
				
				$indicators.removeClass("on");
				$indicators_on = (index != undefined)? $(".iconBadge_bg.little").eq(index) : ($indicators_on.parent().next().size() != 0 ) ?
											$indicators_on.parent().next().find(".iconBadge_bg.little") :
											$(".iconBadge_bg.little").eq(0);
					
				$indicators_on.addClass("on");
				
			
		}
		
		
		$(".iconBadge_bg.little").click(function(){
			if(!$(this).is(".on")){
				goAhead($(this).parent().index());
			}
		});
		
		
		
		/* PROGRESS BAR */
		if(has_progress_bar){
			var progress_bar_refresh_frequency = 500;
			var percentage_step = 100/(frequency/500);
			var pregress_interval;
			
			
			function goAheadProgressBar(){
				var step = 1;
				pregress_interval = setInterval(function(){
					step++;
					var $bar = $(".progress_bar .bar");
					
					$bar.animate({
						"width":100-(percentage_step*step)+"%"
					});
					
					
				},500);
			}
			
			
			
			function resetProgressBar(){
				$(".progress_bar .bar").width("100%");
				clearInterval(pregress_interval);
				console.log("resetto");
				goAheadProgressBar();
			}
		}
		
		
		
	}
	
	
	
