$(document).on("mobileinit", function(){
	$.mobile.allowCrossDomainPages = true;
	$.support.cors = true;
	$.mobile.page.prototype.options.backBtnText = ""; //enlever texte du bouton back
	$.mobile.defaultPageTransition = 'none'; //changer transition entre les pages
});
