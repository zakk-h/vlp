function modalWindow() {
    var wnp = document.getElementById('vlp-modal');
	var wnt = document.getElementById('vlp-modal-title');
	var wnc = document.getElementById('vlp-modal-body');
	var wnx = document.getElementById('vlp-modal-close');
	var isOpen = false;
	var cbClose = false;

	function doClose() {
		if (isOpen) {
			wnp.style.display = 'none';
			isOpen = false;
			if (cbClose) cbClose();
		}
	}
	wnx.addEventListener("click",doClose);
	wnp.addEventListener("click",function(e) {
		if (e.target == wnp) {doClose();}
	});
	document.addEventListener('keydown', (e) => {
		if (e.keyCode == 27) { return doClose(); }
	});

	this.show = function(title,content,callbackOnClose) {
		wnt.innerHTML = title;
		wnc.innerHTML = (typeof content == 'string') ? content : content.outerHTML;
		wnp.style.display = 'block';
		isOpen = true;
		cbClose = callbackOnClose;
	}

	this.close = function() { doClose(); }
}

let modalwin = new modalWindow();

module.exports = {showModal: modalwin.show, closeModal: modalwin.close};
