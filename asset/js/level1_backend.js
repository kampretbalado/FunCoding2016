// require jquery
// require funcoding

// init
$(function() {
    var root = $('#game-root');
    var status = $('#game-status');

    function addStatus(what) {
        status.append('<div><p>' + what + '</p></div>');
        status.scrollTop(status.prop('scrollHeight'));
    }
	
	// sr: starting row | sc: starting column | er : ending row | ec : ending column
    var endpoint = { sr: 0, sc: 3, sd: FunCoding.DirectionalObject.RIGHT, er: 7, ec: 7 };

	// use 1 for table, 0 for nothing, 9 for mother object
    var obstacle = [
        [1,1,1,0,0,1,1,0],
        [1,1,1,0,0,1,1,0],
        [0,0,0,0,0,1,1,0],
        [0,0,0,0,0,1,1,0],
        [0,0,0,0,0,0,0,0],
        [1,1,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [9,0,0,0,0,1,1,0],
    ];

    function checkPosition(r, c) {
        return (0 <= r && r < 8 && 0 <= c && c < 8 && obstacle[r][c] == 0);
    }

    // static image
    (function() {
        new FunCoding.GameObject(
            $('<image style="width:800px;height:400px" src="asset/img/Lantai_Rumah 8x8.png"/>'),
            -187.5, 187.5
        ).addTo(root);

        for(r in obstacle) for(c in obstacle[r]) {
            // meja-meja object
			if(obstacle[r][c] == 1) {
                new FunCoding.GameObject(
                    $('<image style="top:-15px;width:50px;left:0px;" src="asset/img/table.png"/>'),
                    (c * 50), (r * 50)
                ).addTo(root);
            } // mother object
            else if(obstacle[r][c] == 9) {
                new FunCoding.GameObject(
                    $('<image src="asset/img/Mother.png" style="height:50px;left:12px;top:-20px;"/>'),
                    (c * 50), (r * 50)
                ).addTo(root);
            }
        }

        new FunCoding.GameObject(
            $('<img src="asset/img/Mat.png" style="top:10px;width:60px;left:-5px;"/>'),
            (endpoint.ec * 50), (endpoint.er * 50)
        ).addTo(root)
    })();


    var items = {};

    var mamaPoint = (function(r, c) {
        return items[[r,c].join()] =
            new FunCoding.ExclamationMark(r, c, root,
                function(finish) {
                    addStatus('Berbicara dengan mama');
                    alert('Mama menyuruh anda untuk berbelanja ke supermarket, gunakan kunci rumah dengan gantungan kunci untuk keluar rumah');
                    finish();
                }
            );
    })(7, 1); // exclamation point Mama

    var key = (function(r, c) {
        var tag = FunCoding.uniqueTag(items);
        return items[[r,c].join()] = items[tag] =
            new FunCoding.KunciRumah(r, c, root, tag,
                function(finish) {
                    addStatus('Kunci rumah diambil');
                    alert('Kunci rumah berhasil diambil');
                    finish();
                },
                function(retVal) {
                    if(player.r == endpoint.er && player.c == endpoint.ec) {
                        if(mamaPoint.taken) {
                            player.freeze = true;
                            if(retVal) retVal[0] = true;
                            return FunCoding.sequence([
                                player.majuAnim(),
                                function(finish) {
                                    finish();
                                    addStatus([
                                        'Menggunakan kunci untuk keluar <br>',
                                        '<strong>Game Selesai, silahakan ke level selanjutnya</strong>'
                                    ].join(''));
                                    window.location = "level2.html";
                                    // alert('Game Selesai, silahkan lanjut ke level selanjutnya');
                                },
                            ]);
                        } else {
                            return FunCoding.sequence([
                                FunCoding.delay(FunCoding.STEP_SPEED),
                                function(finish) {
                                    addStatus('Tidak bisa keluar');
                                    alert('Tidak bisa keluar, silahkan tanya Mama dulu');
                                    finish();
                                }
                            ]);
                        }
                    }
                }
            );
    })(0, 7); // kunci betulan

    (function(r, c) {
        var tag = FunCoding.uniqueTag(items);
        return items[[r,c].join()] =
            new FunCoding.KunciKamar(r, c, root, tag,
                function(finish) {
                    addStatus('Kunci kamar diambil');
                    alert('Kunci kamar berhasil diambil');
                    finish();
                }
            );
    })(3, 0); // kunci dummy

    var player = new FunCoding.Player(
        new FunCoding.DirectionalObject(FunCoding.Player.getNormalFace()).addTo(root),
        endpoint.sr, endpoint.sc, endpoint.sd
    );

    addStatus([
        '<strong>Game Mulai. Silahkan buka folder <i>solusi</i> dan <i>edit</i> file <i>level1_solusi.js</i></strong><br>',
        'Berada di baris ', player.r + 1, ', kolom ', player.c + 1 ,
        ', menghadap ', ["utara", "barat", "selatan", "timur"][player.d]
    ].join(''));

    var controller = new FunCoding.Controller(player, items);
    var queue = new FunCoding.AnimationQueue().start()

    FunCoding.registerAPI(
        window,
        controller,
        queue,
        function() {
            return checkPosition(player.r, player.c);
        },
        function() {
            var dd = FunCoding.DirectionalObject.dd;
            return !player.freeze && checkPosition(player.r + dd[player.d].y, player.c + dd[player.d].x);
        },
        addStatus,
        alert
    );

    window.ambil = function() {
        if(player.freeze) return;
        var tmp = [];
        queue.add(FunCoding.sequence([
            controller.ambil(tmp),
            function(finish) {
                if(!tmp[0]) addStatus('Ooops, Tidak bisa');
                finish();
            }
        ]));
        return tmp[1];
    }

    window.gunakan = function(tag) {
        if(player.freeze) return;
        var tmp = [];
        queue.add(FunCoding.sequence([
            controller.gunakan(tag, tmp),
            function(finish) {
                if(!tmp[0]) addStatus('Ooops, Tidak bisa');
                finish();
            }
        ]));
        return tmp[0];
    }

    window.bicara = function() {
        window.ambil();
    }

    FunCoding.includeScript('solusi/level1_solusi.js');
});
