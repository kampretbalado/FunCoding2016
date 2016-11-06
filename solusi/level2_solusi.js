/*
perintah yang tersedia:
    diam();
    maju();
    belokKanan();
    belokKiri();
    var x = ambil();
    gunakan(x);

status yang tersedia:
    bisaMaju ?
*/
var cobaMaju = function() {
	var tryMaju = bisaMaju
	while (tryMaju) {
		maju();
		if (!bisaMaju){
			tryMaju = false;
		}
	}
}

var majuByNumber = function(number) {
	for (var i = 0; i < number; i++) {
		maju();
	}
}

belokKanan();
majuByNumber(3);
gunakan();