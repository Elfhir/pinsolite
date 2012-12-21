$(document).on("mobileinit", function(){
	$.mobile.page.prototype.options.backBtnText = ""; //enlever texte du bouton back
	$.mobile.defaultPageTransition = 'slide'; //changer transition entre les pages
});