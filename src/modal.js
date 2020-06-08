function showModal(title,content,callbackOnClose) {
    var wnp = document.getElementById('vlp-modal');
	var wnt = document.getElementById('vlp-modal-title');
	var wnc = document.getElementById('vlp-modal-body');
    var wnx = document.getElementById('vlp-modal-close');
    
	wnt.innerHTML = title;

	//if (typeof(content) == 'string') {
		wnc.innerHTML = content;
	//} else {
	//	wnc.innerHTML = '';
	//	content(wnc);
	//}

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
