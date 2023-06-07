var config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 700,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var game = new Phaser.Game(config);
var audio = new Audio("../ShootingChisatoSimulator/assets/shotting.wav");
var reload = new Audio("../ShootingChisatoSimulator/assets/reload.wav");
var audio_on = false;
var delayShoot = true;
var Ammo = 30;
var MaxAmmo = 30;
var ammoText;

function preload() {
  this.load.image("background", "../ShootingChisatoSimulator/assets/bg.png");
  this.load.image("person", "../ShootingChisatoSimulator/assets/stop.png");
  this.load.image("personleft", "../ShootingChisatoSimulator/assets/left.png");
  this.load.image("personright", "../ShootingChisatoSimulator/assets/right.png");
  this.load.image("hole", "../ShootingChisatoSimulator/assets/hole.png");
  this.load.image("light", "../ShootingChisatoSimulator/assets/shot_flash.png");
}

function create() {
  var self = this;
  ammoText = this.add.text(10, 0, Ammo + "/" + MaxAmmo);
  ammoText.setDisplaySize(100, 100);
  ammoText.setDepth(3);
  document.body.style.cursor = "url('../ShootingChisatoSimulator/assets/aim.png'), auto";
  var isPointerDown = false;
  var background = this.add.image(config.width / 2, config.height / 2, "background");
  background.setDisplaySize(config.width, config.height);
  var person = this.add.image(400, 500, "person");
  person.setDisplaySize(person.width - 150, person.height);
  person.setDepth(1);
  var maxmove = 100;

  background.setInteractive();
  person.setInteractive();

  background.on("pointerdown", function (pointer) {
    isPointerDown = true;
    if (Ammo > 0) {
      LightEffect.call(self, pointer);
      bulletEffect.call(self, pointer);
    } else reload.play();
  });

  background.on("pointerup", function (pointer) {
    isPointerDown = false;
  });

  background.on("pointermove", function (pointer) {
    if (isPointerDown) {
      if (Ammo > 0) {
        LightEffect.call(self, pointer);
        bulletEffect.call(self, pointer);
      } else reload.play();
    }
  });

  person.on("pointerdown", function (pointer) {
    isPointerDown = true;
    if (Ammo > 0) {
      calculate(pointer);
      LightEffect.call(self, pointer);
      bulletEffect.call(self, pointer);
    } else reload.play();
  });

  person.on("pointerup", function (pointer) {
    isPointerDown = false;
  });

  person.on("pointermove", function (pointer) {
    if (isPointerDown) {
      if (Ammo > 0) {
        calculate(pointer);
        LightEffect.call(self, pointer);
        bulletEffect.call(self, pointer);
      } else reload.play();
    }
  });

  function calculate(pointer) {
    var extraDodge = 0;
    var trigger = pointer.x - person.x;
    if (pointer.x - person.x >= -100 && pointer.x - person.x <= 20) {
      extraDodge = 70;
    }
    if (!isHit(person.x - pointer.x, person.y - pointer.y)) {
      return;
    }
    if (pointer.x < person.x && trigger < -20) {
      // go right case
      if (pointer.x < person.x && person.x > config.width - maxmove) {
        dodge(1, extraDodge);
      } else {
        person.x = person.x + 20 + extraDodge;
        if (pointer.x < person.x && person.x > config.width - maxmove + 50) {
          dodge(1, extraDodge);
        } else {
          person.setTexture("personright");
        }
      }
      setTimeout(function () {
        person.setTexture("person");
      }, 1000);
    } else {
      // go left case
      if (pointer.x > person.x && person.x < maxmove + 100) {
        dodge(3, extraDodge);
      } else {
        person.x = person.x - 20 - extraDodge;
        if (pointer.x > person.x && person.x < maxmove + 50) {
          dodge(3, extraDodge);
        } else {
          person.setTexture("personleft");
        }
      }
      setTimeout(function () {
        person.setTexture("person");
      }, 1000);
    }
  }

  function dodge(Case, extraDodge) {
    if (Case == 1) {
      person.x = person.x - (175 + extraDodge);
      person.setTexture("personleft");
      console.log("case 1");
    }
    if (Case == 3) {
      person.x = person.x + (225 + extraDodge);
      person.setTexture("personright");
      console.log("case 3");
    }
  }

  function isHit(value, value2) {
    if ((value >= -50 && value <= 172) || value2 <= -70) return true;
    return false;
  }
}

function bulletEffect(pointer) {
  var x = pointer.x;
  var y = pointer.y;
  if (!delayShoot) return;
  delayShoot = false;
  setTimeout(function () {
    delayShoot = true;
    audio.play();
  }, 50);
  Ammo--;
  if (Ammo < 1) {
    setTimeout(function () {
      Ammo = MaxAmmo;
      ammoText.setText(Ammo + "/" + MaxAmmo);
    }, 2000);
  }
  if (!(Ammo >= 0)) {
    audio.pause();
    return;
  }
  ammoText.setText(Ammo + "/" + MaxAmmo);
  var image = this.add.image(x + 20, y + 20, "hole");
  image.setDisplaySize(50, 50);
  setTimeout(function () {
    image.destroy();
  }, 3000);
  setTimeout(function () {
    audio.pause();
    audio.currentTime = 0;
  }, 150);
}

function LightEffect(pointer) {
  var x = pointer.x;
  var y = pointer.y;
  if (!delayShoot) return;
  if (!(Ammo > 0)) {
    return;
  }
  var light = this.add.image(x + 20, y + 20, "light");
  light.setDisplaySize(300, 300);

  setTimeout(function () {
    light.destroy();
  }, 10);
}
function update() {}
