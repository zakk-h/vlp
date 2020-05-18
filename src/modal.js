function showModal(title,content,callbackOnClose) {
    var wnp = document.getElementById('vlp-modal');
	var wnt = document.getElementById('vlp-modal-title');
	var wnc = document.getElementById('vlp-modal-body');
    var wnx = document.getElementById('vlp-modal-close');
    
    wnc.innerHTML = content;
	wnt.innerHTML = title;
    wnp.style.display = 'block';
    function doClose(e) {
        wnp.style.display = 'none';
        callbackOnClose(e);
    }
    wnx.addEventListener("click",doClose);
	wnp.addEventListener("click",function(e) {
		if (e.target == wnp) {doClose(e);}
	});
}

module.exports = {showModal};
