function showModal(title,content,callbackOnClose) {
    var wnp = document.getElementById('vlp-modal');
	var wnt = document.getElementById('vlp-modal-title');
	var wnc = document.getElementById('vlp-modal-body');
    var wnx = document.getElementById('vlp-modal-close');
    
	wnt.innerHTML = title;

	wnc.innerHTML = content;
	wnp.style.display = 'block';

	function doClose(e) {
        wnp.style.display = 'none';
        callbackOnClose(e);
    }
	function keyPress (e) {
		if (keyCode == 27) {
			return doClose(e);
		}
	}
	wnx.addEventListener("click",doClose);
	wnp.addEventListener("click",function(e) {
		if (e.target == wnp) {doClose(e);}
	});
	document.addEventListener('keydown', (e) => {
		if (e.keyCode == 27) {
			return doClose(e);
		}
	});
}

module.exports = {showModal};
