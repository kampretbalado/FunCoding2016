/*
perintah yang tersedia:
    diam();
    maju();
    belokKanan();
    belokKiri();
    var x = ambil();
    gunakan(x);
    bicara();

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
belokKanan();

cobaMaju();

belokKanan();
for (var i = 0; i < 2; i++) {
	maju();
}

bicara();

belokKanan();
maju();
belokKanan();
cobaMaju();
belokKiri();
cobaMaju();

var kunci = ambil();

belokKiri();belokKiri();
cobaMaju();

gunakan(kunci);