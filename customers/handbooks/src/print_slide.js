function printSlides(result,opts){
		var handbook_title = opts.title +"<button class='BUTTON little blue' style='float:right; opacity:0.01' onclick='window.open(\""+ opts.sheetUrl+"\")'>vai al docs</button>";
		$(".handbookTitle").html(handbook_title);
		var ie = (navigator.userAgent.indexOf("MSIE") == -1) ? false : true;
	
		if(ie)
			$("#notIE").remove()
		else
			$("#IE").remove();

		
		
		/* slide description */
		var ret = "";
		_.each(result.trs,function(tr){
			ret +='<div class="slide-description-content">'+
					'<div class="slide-txt"><font class="slide-title">'+$("<p>"+tr.title+"</p>").text()+': </font>'+tr.text+'</div>'+
				'</div>';
		});
		$(opts.target).append(ret);
		
		
		/* screenshot */
		var ret = "";
		if(!ie){
			_.each(result.trs,function(tr){
				ret +='<div class="slide" style="background-image:url('+tr.screenshot_url+')"></div>';
			});
		}
		else{
			_.each(result.trs,function(tr,index){
				var IE_rule = "filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+tr.screenshot_url+"',sizingMethod='scale');"+
							"-ms-filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+tr.screenshot_url+"',sizingMethod='scale');";

				ret +='<div class="slide" style="background-image:url('+tr.screenshot_url+');width:850px;height:476px;'+ IE_rule +'"></div>';
			});
		}
		
		$("#slides").append(ret);
		
		
		var $slides = $(".slide");
		var $arrows = $(".arrow");
		var $navigator = $(".navigator");
		var $header = $(".header");
		var $slide_info = $(".slide-description-content");
		var start_slide = 0;
		
		var tot_slides_number = $slides.size();
		var current_slide;
		var is_in_fullscreen = false;
		
		
		
		
		/* navigator */
		var ret = "";
		var index = 1;
		_.each(result.trs,function(tr){
			var current = (start_slide == index-1)? "current" : "";
			ret +='<div class="nav_item '+current+'">'+
						'<div class="nav_item_number">'+index+'</div>'+
						'<div class="nav_item_txt_container">'+
							'<div class="nav_item_txt">'+tr.title+'</div>'+
						'</div>'+
					'</div>';
					
			index++;
		});
		$navigator.append(ret);
		
		
		$navigator.find(".nav_item").click(function(){
			if(!$(this).is(".current")){
				var index = $(this).index();
				goTo(index);
			}
		})
		
	
		init(0);
		
		function init(start_slide){
			current_slide = start_slide;
			$slides.hide();
			$slide_info.hide();
			$slide_info.eq(start_slide).show();
			$slides.eq(start_slide).show();
			
		}
		
	
		$(".forward").click(function(){
			goForward();
		});
		
		$(".back").click(function(){
			goBack();
		});
		
		$(".slide").click(function(){
			goToFullScreen();
		})
	
		$(document).keydown(function(event) {
            switch (event.keyCode) {
                case 37: goBack(); break;
                case 38: goBack(); break;
                case 39: goForward(); break;
                case 40: goForward(); break;
                case 70: goToFullScreen(); break;
            }
        });
	
		function goForward(){
			var $current_slide = getCurrentSlide();
			var $current_slide_info = getCurrentSlideInfo();
			if(current_slide != tot_slides_number-1){
				(is_in_fullscreen)? goToFullScreen() : null;
				$current_slide.hide();
				$current_slide.next().show();
				$current_slide_info.hide();
				$current_slide_info.next().show();
				current_slide++;
				refreshNavigator(current_slide);
			}
		}
	
		function goBack(){
			if(current_slide != 0){
				(is_in_fullscreen)? goToFullScreen() : null;
				var $current_slide = getCurrentSlide();
				var $current_slide_info = getCurrentSlideInfo();
				$current_slide.hide();
				$current_slide.prev().show();
				$current_slide_info.hide();
				$current_slide_info.prev().show();
				current_slide--;
				refreshNavigator(current_slide);
			}
		}
	
		function goTo(index){
			var $current_slide = getCurrentSlide();
			var $current_slide_info = getCurrentSlideInfo();
			$current_slide.hide();
			$slides.eq(index).show();
			$current_slide_info.hide();
			$slide_info.eq(index).show();
			current_slide = index;
			refreshNavigator(current_slide);
		}
	
	
		function getCurrentSlide(){
			return $slides.eq(current_slide);
		}
		
		function getCurrentSlideInfo(){
			return $slide_info.eq(current_slide);
		}
		
		function getCurrentScreenshot(){
			return $(getCurrentSlide()).find(".screenshot");
		}
	
		function goToFullScreen(){
			var $screenshot = getCurrentScreenshot();
			var initial_padding = json_conf.init_padding;
			var full_padding = json_conf.full_padding;
			
			if(!is_in_fullscreen){
				$("#navigator_container").hide();
				$("#slide_info_container").hide();
				$("#header_container").hide();
				is_in_fullscreen = true;
			}
			else{
					$("#navigator_container").show();
					$("#slide_info_container").show();
					$("#header_container").show();
					is_in_fullscreen = false;
			}
			
		}
	
		function refreshNavigator(index){
			$navigator.find(".nav_item.current").removeClass("current");
			$navigator.find(".nav_item").eq(index).addClass("current");
		}
	}