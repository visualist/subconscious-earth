
/* set things into motion */

var c = new Corpus({id: 'Frankenstein-Shelley.txt' }); // use only sections 3..57 
var eqData = new EqData({corpus: c});
eqData.miso_fetch();

