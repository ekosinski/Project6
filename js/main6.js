var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('swagnemite', 'assets/swagnemite.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.spritesheet('shrek', 'assets/shrek.jpg');
    game.load.audio('music','assets/libera.mp3');

}

var swagnemite;
var bullets;
var shrek;
var cursors;
var score;

var bulletTime = 0;
var bullet;

var music;

function create() {

    game.stage.backgroundColor = '#2d2d2d';
    music = game.add.audio('music');
    music.loop = true;
    music.play();
    //  This will check Group vs. Group collision (bullets vs. veggies!)

    shrek = game.add.group();
    shrek.enableBody = true;
    shrek.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 50; i++)
    {
        var s = shrek.create(game.world.randomX, Math.random() * 500, 'shrek', game.rnd.integerInRange(0, 36));
        s.scale.x = 0.05;
        s.scale.y = 0.05;
        s.name = 'shrek' + i;
        s.body.immovable = true;
    }

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 20; i++)
    {
        var b = bullets.create(0, 0, 'bullet');
        b.name = 'bullet' + i;
        b.exists = false;
        b.visible = false;
        b.checkWorldBounds = true;
        b.events.onOutOfBounds.add(resetBullet, this);
    }

    swagnemite = game.add.sprite(400, 550, 'swagnemite');
    swagnemite.scale.x = 0.08;
    swagnemite.scale.y = 0.08;
    game.physics.enable(swagnemite, Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

}

function update() {

    //  As we don't need to exchange any velocities or motion we can the 'overlap' check instead of 'collide'
    game.physics.arcade.overlap(bullets, shrek, collisionHandler, null, this);

    swagnemite.body.velocity.x = 0;
    swagnemite.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        swagnemite.body.velocity.x = -300;
    }
    else if (cursors.right.isDown)
    {
        swagnemite.body.velocity.x = 300;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        fireBullet();
    }

    game.debug.text("Shoot the shreks!!!!!!",32,62);
    game.debug.text("Your score is " + score,32,72);

}

function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            bullet.reset(swagnemite.x + 6, swagnemite.y - 8);
            bullet.body.velocity.y = -300;
            bulletTime = game.time.now + 150;
        }
    }

}

//  Called if the bullet goes out of the screen
function resetBullet (bullet) {

    bullet.kill();

}

//  Called if the bullet hits one of the veg sprites
function collisionHandler (bullet, shrek) {

    bullet.kill();
    shrek.kill();
    score = score + 10;

}

