

	var css_rules = '.screenshot{width: '+ json_conf.init_width +'}'


	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css_rules;
	document.getElementsByTagName('head')[0].appendChild(style);
	