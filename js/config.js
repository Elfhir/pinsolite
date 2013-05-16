$(document).on("mobileinit", function(){
	$.mobile.allowCrossDomainPages = true;
	$.support.cors = true;
	$.mobile.page.prototype.options.backBtnText = ""; //enlever texte du bouton back
	$.mobile.defaultPageTransition = 'none'; //changer transition entre les pages
	$.mobile.popup.prototype.options.history = false;
});

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}