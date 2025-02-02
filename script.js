function scrambleText(target, newText, duration) {
  let originalText = target.innerHTML;
  let length = newText.length;
  let scrambleInterval;

  function randomChar() {
    return String.fromCharCode(33 + Math.random() * 94);
  }

  function scramble() {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += randomChar();
    }
    target.innerHTML = result;
  }

  function revealText() {
    let i = 0;
    clearInterval(scrambleInterval);
    let revealInterval = setInterval(function () {
      if (i < newText.length) {
        target.innerHTML =
          newText.substring(0, i + 1) + randomChar().repeat(length - i - 1);
        i++;
      } else {
        clearInterval(revealInterval);
        target.innerHTML = newText; // Finalize text
      }
    }, duration / length);
  }

  scrambleInterval = setInterval(scramble, 50); // Scrambling speed
  setTimeout(revealText, duration);
}

const textElement = document.getElementById("scramble");
scrambleText(textElement, "Welcome to LUDO game", 3000);

/******************************************
 * PART 1: Dice-Rolling Animation
 ******************************************/

const dice = document.getElementById("dice");
const speedSelect = document.getElementById("speedSelect");
const numPlayersSelect = document.getElementById("numPlayers");

// Set a random initial face on page load.
function setRandomInitialFace() {
  const randomFace = Math.floor(Math.random() * 6) + 1;
  dice.src = `images/${randomFace}.png`;
}
setRandomInitialFace();

function roll() {
  // Make sure players are selected.
  if (game.turnOrder.length === 0) {
    alert("Please select 2, 3, or 4 players!");
    return;
  }
  // If the roll phase is already complete (i.e. a non‑6 has been rolled)
  // then do not allow rolling until a pawn has been moved.
  if (game.rollPhaseComplete) {
    alert("You already finished rolling. Now choose a pawn to move!");
    return;
  }

  // Decide the animation speed.
  let interval;
  switch (speedSelect.value) {
    case "slow":
      interval = 200;
      break;
    case "fast":
      interval = 50;
      break;
    default:
      interval = 90;
  }

  let framesUp = 8;
  const diceNum = Math.floor(Math.random() * 6) + 1; // final dice result
  let rotationAngle = 45;
  let marginLeft = 1;

  const animation = setInterval(animate, interval);
  function animate() {
    if (framesUp > 0) {
      const randomFrame = Math.floor(Math.random() * 6) + 1;
      dice.src = `images/${randomFrame}.png`;
      dice.style.marginLeft = `${marginLeft}%`;
      dice.style.transform = `rotate(${rotationAngle}deg)`;

      framesUp--;
      rotationAngle *= 2;
      marginLeft *= 1.8;
    } else {
      dice.src = `images/${diceNum}.png`;
      clearInterval(animation);
      document.getElementById("p2").textContent = "You rolled: " + diceNum;
      // Process the roll.
      game.processRoll(diceNum);
    }
  }
}

dice.addEventListener("click", roll);

/******************************************
 * PART 2: Pawn Classes
 ******************************************/

class Red_g {
  j = 0;
  move = 0;
  home = true;
  return = false;
  constructor(G_NO) {
    this.G_NO = G_NO;
  }
}

class Green_g {
  j = 0;
  move = 0;
  home = true;
  constructor(G_NO) {
    this.G_NO = G_NO;
  }
}

class Yellow_g {
  j = 0;
  move = 0;
  home = true;
  constructor(G_NO) {
    this.G_NO = G_NO;
  }
}

class Blue_g {
  j = 0;
  move = 0;
  home = true;
  constructor(G_NO) {
    this.G_NO = G_NO;
  }
}

// Instantiate pawn objects.
var R1 = new Red_g(document.getElementById("r1"));
var R2 = new Red_g(document.getElementById("r2"));
var R3 = new Red_g(document.getElementById("r3"));
var R4 = new Red_g(document.getElementById("r4"));

var G1 = new Green_g(document.getElementById("g1"));
var G2 = new Green_g(document.getElementById("g2"));
var G3 = new Green_g(document.getElementById("g3"));
var G4 = new Green_g(document.getElementById("g4"));

var Y1 = new Yellow_g(document.getElementById("y1"));
var Y2 = new Yellow_g(document.getElementById("y2"));
var Y3 = new Yellow_g(document.getElementById("y3"));
var Y4 = new Yellow_g(document.getElementById("y4"));

var B1 = new Blue_g(document.getElementById("b1"));
var B2 = new Blue_g(document.getElementById("b2"));
var B3 = new Blue_g(document.getElementById("b3"));
var B4 = new Blue_g(document.getElementById("b4"));

/******************************************
 * PART 3: Color Classes – Movement, Pawn Selection,
 *         and Capturing (Kill) Logic.
 ******************************************/

class Red {
  cnt = 0;
  a = 0;
  x = null;
  mover(RN, count) {
    const pawn = RN.G_NO;
    this.y = pawn; // Ensure the pawn to move is set.
    console.log("Red mover – (move + count): " + (RN.move + count));
    if (RN.move + count < 57) {
      if (RN.j !== 0 && RN.home === false) {
        count = count + RN.j;
        for (let i = RN.j; i <= count; i++) {
          this.a++;
          setTimeout(this.movefunc.bind(this, i, RN.move), 1000 * this.a);
          RN.move++;
        }
        RN.move--;
        RN.j = count;
        this.killcheck(count);
        this.a = 0;
        return true;
      } else {
        // Pawn is at home; only allow exit on a 6.
        if (count === 6) {
          this.x = document.getElementById("1"); // Red’s start tile.
          this.x.appendChild(pawn);
          RN.j = 1;
          RN.home = false;
          return true;
        }
      }
    }
    return false;
  }
  movefunc(i, move) {
    if (move >= 51) {
      if (i === 57) {
        this.x = document.getElementById("out");
      } else {
        let jn = "rf" + i;
        this.x = document.getElementById(jn);
      }
    } else {
      this.x = document.getElementById(i);
    }
    this.x.appendChild(this.y);
  }
  choose(i) {
    let ck;
    if (game.rctns.length !== 0) {
      if (i === 1) {
        ck = this.mover(R1, game.rctns[this.cnt]);
      } else if (i === 2) {
        ck = this.mover(R2, game.rctns[this.cnt]);
      } else if (i === 3) {
        ck = this.mover(R3, game.rctns[this.cnt]);
      } else if (i === 4) {
        ck = this.mover(R4, game.rctns[this.cnt]);
      }
      console.log("Red choose – moved: " + ck);
      if (ck) {
        if (this.cnt === game.rctns.length - 1) {
          dice.disabled = false;
          game.rctns = [];
          this.cnt = 0;
        } else {
          this.cnt++;
        }
      }
    }
  }
  checker() {
    if (
      R1.home &&
      R2.home &&
      R3.home &&
      R4.home &&
      game.count !== 6 &&
      game.rctns[game.rctns.length - 1] !== 6
    ) {
      return false;
    } else {
      return game.count === 6 ? false : true;
    }
  }
  killcheck(j) {
    // Do not check safe zones – adjust these numbers as needed.
    if (
      j !== 22 &&
      j !== 27 &&
      j !== 14 &&
      j !== 9 &&
      j !== 40 &&
      j !== 35 &&
      j !== 48 &&
      j !== 1
    ) {
      // Collision with Green pawns.
      if (j === G1.j) {
        G1.j = 0;
        G1.home = true;
        G1.move = 0;
        document.getElementById("g_g1").appendChild(G1.G_NO);
        game.type--;
      }
      if (j === G2.j) {
        G2.j = 0;
        G2.home = true;
        G2.move = 0;
        document.getElementById("g_g2").appendChild(G2.G_NO);
        game.type--;
      }
      if (j === G3.j) {
        G3.j = 0;
        G3.home = true;
        G3.move = 0;
        document.getElementById("g_g3").appendChild(G3.G_NO);
        game.type--;
      }
      if (j === G4.j) {
        G4.j = 0;
        G4.home = true;
        G4.move = 0;
        document.getElementById("g_g4").appendChild(G4.G_NO);
        game.type--;
      }
      // Collision with Yellow pawns.
      if (j === Y1.j) {
        Y1.j = 0;
        Y1.home = true;
        Y1.move = 0;
        document.getElementById("g_y1").appendChild(Y1.G_NO);
        game.type--;
      }
      if (j === Y2.j) {
        Y2.j = 0;
        Y2.home = true;
        Y2.move = 0;
        document.getElementById("g_y2").appendChild(Y2.G_NO);
        game.type--;
      }
      if (j === Y3.j) {
        Y3.j = 0;
        Y3.home = true;
        Y3.move = 0;
        document.getElementById("g_y3").appendChild(Y3.G_NO);
        game.type--;
      }
      if (j === Y4.j) {
        Y4.j = 0;
        Y4.home = true;
        Y4.move = 0;
        document.getElementById("g_y4").appendChild(Y4.G_NO);
        game.type--;
      }
      // Collision with Blue pawns.
      if (j === B1.j) {
        B1.j = 0;
        B1.home = true;
        B1.move = 0;
        document.getElementById("g_b1").appendChild(B1.G_NO);
        game.type--;
      }
      if (j === B2.j) {
        B2.j = 0;
        B2.home = true;
        B2.move = 0;
        document.getElementById("g_b2").appendChild(B2.G_NO);
        game.type--;
      }
      if (j === B3.j) {
        B3.j = 0;
        B3.home = true;
        B3.move = 0;
        document.getElementById("g_b3").appendChild(B3.G_NO);
        game.type--;
      }
      if (j === B4.j) {
        B4.j = 0;
        B4.home = true;
        B4.move = 0;
        document.getElementById("g_b4").appendChild(B4.G_NO);
        game.type--;
      }
    }
  }
}

class Green {
  cnt = 0;
  a = 0;
  x = null;
  mover(RN, count) {
    const pawn = RN.G_NO;
    this.y = pawn;
    console.log("Green mover – (move + count): " + (RN.move + count));
    if (RN.move + count < 57) {
      if (RN.j !== 0 && RN.home === false) {
        count = count + RN.j;
        for (let i = RN.j; i <= count; i++) {
          if (i === 53) {
            count = count - i + 1;
            RN.j = 1;
            i = 1;
          }
          this.a++;
          setTimeout(this.movefunc.bind(this, i, RN.move), 1000 * this.a);
          RN.move++;
        }
        RN.move--;
        RN.j = count;
        this.killcheck(count);
        this.a = 0;
        return true;
      } else {
        if (count === 6) {
          this.x = document.getElementById("14"); // Green’s start tile.
          this.x.appendChild(pawn);
          RN.j = 14;
          RN.home = false;
          return true;
        }
      }
    }
    return false;
  }
  movefunc(i, move) {
    if (move >= 51) {
      if (i === 18) {
        this.x = document.getElementById("out");
      } else {
        let jn = "gf" + i;
        this.x = document.getElementById(jn);
      }
    } else {
      this.x = document.getElementById(i);
    }
    this.x.appendChild(this.y);
  }
  choose(i) {
    let ck;
    if (game.gctns.length !== 0) {
      if (i === 1) {
        ck = this.mover(G1, game.gctns[this.cnt]);
      } else if (i === 2) {
        ck = this.mover(G2, game.gctns[this.cnt]);
      } else if (i === 3) {
        ck = this.mover(G3, game.gctns[this.cnt]);
      } else if (i === 4) {
        ck = this.mover(G4, game.gctns[this.cnt]);
      }
      console.log("Green choose – moved: " + ck);
      if (ck) {
        if (this.cnt === game.gctns.length - 1) {
          dice.disabled = false;
          game.gctns = [];
          this.cnt = 0;
        } else {
          this.cnt++;
        }
      }
    }
  }
  checker() {
    if (
      G1.home &&
      G2.home &&
      G3.home &&
      G4.home &&
      game.count !== 6 &&
      game.gctns[game.gctns.length - 1] !== 6
    ) {
      return false;
    } else {
      return game.count === 6 ? false : true;
    }
  }
  killcheck(j) {
    if (
      j !== 22 &&
      j !== 27 &&
      j !== 14 &&
      j !== 9 &&
      j !== 40 &&
      j !== 35 &&
      j !== 48 &&
      j !== 1
    ) {
      if (j === R1.j) {
        R1.j = 0;
        R1.home = true;
        R1.move = 0;
        document.getElementById("g_r1").appendChild(R1.G_NO);
        game.type--;
      }
      if (j === R2.j) {
        R2.j = 0;
        R2.home = true;
        R2.move = 0;
        document.getElementById("g_r2").appendChild(R2.G_NO);
        game.type--;
      }
      if (j === R3.j) {
        R3.j = 0;
        R3.home = true;
        R3.move = 0;
        document.getElementById("g_r3").appendChild(R3.G_NO);
        game.type--;
      }
      if (j === R4.j) {
        R4.j = 0;
        R4.home = true;
        R4.move = 0;
        document.getElementById("g_r4").appendChild(R4.G_NO);
        game.type--;
      }
    }
  }
}

class Blue {
  cnt = 0;
  a = 0;
  x = null;
  mover(RN, count) {
    const pawn = RN.G_NO;
    this.y = pawn;
    console.log("Blue mover – (move + count): " + (RN.move + count));
    if (RN.move + count < 57) {
      if (RN.j !== 0 && RN.home === false) {
        count = count + RN.j;
        for (let i = RN.j; i <= count; i++) {
          if (i === 53) {
            count = count - i + 1;
            RN.j = 1;
            i = 1;
          }
          this.a++;
          setTimeout(this.movefunc.bind(this, i, RN.move), 1000 * this.a);
          RN.move++;
        }
        RN.move--;
        RN.j = count;
        this.killcheck(count);
        this.a = 0;
        return true;
      } else {
        if (count === 6) {
          this.x = document.getElementById("40"); // Blue’s start tile.
          this.x.appendChild(pawn);
          RN.j = 40;
          RN.home = false;
          return true;
        }
      }
    }
    return false;
  }
  movefunc(i, move) {
    if (move >= 51) {
      if (i === 44) {
        this.x = document.getElementById("out");
      } else {
        let jn = "bf" + i;
        this.x = document.getElementById(jn);
      }
    } else {
      this.x = document.getElementById(i);
    }
    this.x.appendChild(this.y);
  }
  choose(i) {
    let ck;
    if (game.bctns.length !== 0) {
      if (i === 1) {
        ck = this.mover(B1, game.bctns[this.cnt]);
      } else if (i === 2) {
        ck = this.mover(B2, game.bctns[this.cnt]);
      } else if (i === 3) {
        ck = this.mover(B3, game.bctns[this.cnt]);
      } else if (i === 4) {
        ck = this.mover(B4, game.bctns[this.cnt]);
      }
      console.log("Blue choose – moved: " + ck);
      if (ck) {
        if (this.cnt === game.bctns.length - 1) {
          dice.disabled = false;
          game.bctns = [];
          this.cnt = 0;
        } else {
          this.cnt++;
        }
      }
    }
  }
  checker() {
    if (
      B1.home &&
      B2.home &&
      B3.home &&
      B4.home &&
      game.count !== 6 &&
      game.bctns[game.bctns.length - 1] !== 6
    ) {
      return false;
    } else {
      return game.count === 6 ? false : true;
    }
  }
  killcheck(j) {
    if (
      j !== 22 &&
      j !== 27 &&
      j !== 14 &&
      j !== 9 &&
      j !== 40 &&
      j !== 35 &&
      j !== 48 &&
      j !== 1
    ) {
      if (j === G1.j) {
        G1.j = 0;
        G1.home = true;
        G1.move = 0;
        document.getElementById("g_g1").appendChild(G1.G_NO);
        game.type = 4;
      }
      if (j === G2.j) {
        G2.j = 0;
        G2.home = true;
        G2.move = 0;
        document.getElementById("g_g2").appendChild(G2.G_NO);
        game.type = 4;
      }
      if (j === G3.j) {
        G3.j = 0;
        G3.home = true;
        G3.move = 0;
        document.getElementById("g_g3").appendChild(G3.G_NO);
        game.type = 4;
      }
      if (j === G4.j) {
        G4.j = 0;
        G4.home = true;
        G4.move = 0;
        document.getElementById("g_g4").appendChild(G4.G_NO);
        game.type = 4;
      }
    }
  }
}

class Yellow {
  cnt = 0;
  a = 0;
  x = null;
  mover(RN, count) {
    const pawn = RN.G_NO;
    this.y = pawn;
    console.log("Yellow mover – (move + count): " + (RN.move + count));
    if (RN.move + count < 57) {
      if (RN.j !== 0 && RN.home === false) {
        count = count + RN.j;
        for (let i = RN.j; i <= count; i++) {
          if (i === 53) {
            count = count - i + 1;
            RN.j = 1;
            i = 1;
          }
          this.a++;
          setTimeout(this.movefunc.bind(this, i, RN.move), 1000 * this.a);
          RN.move++;
        }
        RN.move--;
        RN.j = count;
        this.killcheck(count);
        this.a = 0;
        return true;
      } else {
        if (count === 6) {
          this.x = document.getElementById("27"); // Yellow’s start tile.
          this.x.appendChild(pawn);
          RN.j = 27;
          RN.home = false;
          return true;
        }
      }
    }
    return false;
  }
  movefunc(i, move) {
    if (move >= 51) {
      if (i === 31) {
        this.x = document.getElementById("out");
      } else {
        let jn = "yf" + i;
        this.x = document.getElementById(jn);
      }
    } else {
      this.x = document.getElementById(i);
    }
    this.x.appendChild(this.y);
  }
  choose(i) {
    let ck;
    if (game.yctns.length !== 0) {
      if (i === 1) {
        ck = this.mover(Y1, game.yctns[this.cnt]);
      } else if (i === 2) {
        ck = this.mover(Y2, game.yctns[this.cnt]);
      } else if (i === 3) {
        ck = this.mover(Y3, game.yctns[this.cnt]);
      } else if (i === 4) {
        ck = this.mover(Y4, game.yctns[this.cnt]);
      }
      console.log("Yellow choose – moved: " + ck);
      if (ck) {
        if (this.cnt === game.yctns.length - 1) {
          dice.disabled = false;
          game.yctns = [];
          this.cnt = 0;
        } else {
          this.cnt++;
        }
      }
    }
  }
  checker() {
    if (
      Y1.home &&
      Y2.home &&
      Y3.home &&
      Y4.home &&
      game.count !== 6 &&
      game.yctns[game.yctns.length - 1] !== 6
    ) {
      return false;
    } else {
      return game.count === 6 ? false : true;
    }
  }
  killcheck(j) {
    if (
      j !== 22 &&
      j !== 27 &&
      j !== 14 &&
      j !== 9 &&
      j !== 40 &&
      j !== 35 &&
      j !== 48 &&
      j !== 1
    ) {
      if (j === G1.j) {
        G1.j = 0;
        G1.home = true;
        G1.move = 0;
        document.getElementById("g_g1").appendChild(G1.G_NO);
        game.type--;
      }
      if (j === G2.j) {
        G2.j = 0;
        G2.home = true;
        G2.move = 0;
        document.getElementById("g_g2").appendChild(G2.G_NO);
        game.type--;
      }
      if (j === G3.j) {
        G3.j = 0;
        G3.home = true;
        G3.move = 0;
        document.getElementById("g_g3").appendChild(G3.G_NO);
        game.type--;
      }
      if (j === G4.j) {
        G4.j = 0;
        G4.home = true;
        G4.move = 0;
        document.getElementById("g_g4").appendChild(G4.G_NO);
        game.type--;
      }
      if (j === R1.j) {
        R1.j = 0;
        R1.home = true;
        R1.move = 0;
        document.getElementById("g_r1").appendChild(R1.G_NO);
        game.type--;
      }
      if (j === R2.j) {
        R2.j = 0;
        R2.home = true;
        R2.move = 0;
        document.getElementById("g_r2").appendChild(R2.G_NO);
        game.type--;
      }
      if (j === R3.j) {
        R3.j = 0;
        R3.home = true;
        R3.move = 0;
        document.getElementById("g_r3").appendChild(R3.G_NO);
        game.type--;
      }
      if (j === R4.j) {
        R4.j = 0;
        R4.home = true;
        R4.move = 0;
        document.getElementById("g_r4").appendChild(R4.G_NO);
        game.type--;
      }
      if (j === B1.j) {
        B1.j = 0;
        B1.home = true;
        B1.move = 0;
        document.getElementById("g_b1").appendChild(B1.G_NO);
        game.type--;
      }
      if (j === B2.j) {
        B2.j = 0;
        B2.home = true;
        B2.move = 0;
        document.getElementById("g_b2").appendChild(B2.G_NO);
        game.type--;
      }
      if (j === B3.j) {
        B3.j = 0;
        B3.home = true;
        B3.move = 0;
        document.getElementById("g_b3").appendChild(B3.G_NO);
        game.type--;
      }
      if (j === B4.j) {
        B4.j = 0;
        B4.home = true;
        B4.move = 0;
        document.getElementById("g_b4").appendChild(B4.G_NO);
        game.type--;
      }
    }
  }
}

/******************************************
 * PART 4: GameLogic Class
 * Manages turn order, pending moves, and dice roll results.
 ******************************************/
class GameLogic {
  type = 1; // current turn: 1=Red, 2=Green, 3=Yellow, 4=Blue.
  count = 0;
  rctns = [];
  gctns = [];
  yctns = [];
  bctns = [];
  r = new Red();
  g = new Green();
  y = new Yellow();
  b = new Blue();
  rollPhaseComplete = false;
  turnOrder = [1, 2, 3, 4]; // default all players.

  processRoll(diceResult) {
    this.count = diceResult;
    if (this.type === 1) {
      document.getElementById("message").innerHTML = "Red";
      document.getElementById("message").style.color = "red";
      if (this.r.checker()) {
        dice.disabled = true;
      }
      this.rctns.push(this.count);
      this.gctns = [];
      this.yctns = [];
      this.bctns = [];
      console.log("Red rolled: " + this.count);
    } else if (this.type === 2) {
      document.getElementById("message").innerHTML = "Green";
      document.getElementById("message").style.color = "green";
      if (this.g.checker()) {
        dice.disabled = true;
      }
      this.gctns.push(this.count);
      this.rctns = [];
      this.yctns = [];
      this.bctns = [];
      console.log("Green rolled: " + this.count);
    } else if (this.type === 3) {
      document.getElementById("message").innerHTML = "Yellow";
      document.getElementById("message").style.color = "gold";
      if (this.y.checker()) {
        dice.disabled = true;
      }
      this.yctns.push(this.count);
      this.rctns = [];
      this.gctns = [];
      this.bctns = [];
      console.log("Yellow rolled: " + this.count);
    } else if (this.type === 4) {
      document.getElementById("message").innerHTML = "Blue";
      document.getElementById("message").style.color = "blue";
      if (this.b.checker()) {
        dice.disabled = true;
      }
      this.bctns.push(this.count);
      this.rctns = [];
      this.gctns = [];
      this.yctns = [];
      console.log("Blue rolled: " + this.count);
    }
    if (this.count !== 6) {
      let idx = this.turnOrder.indexOf(this.type);
      idx = (idx + 1) % this.turnOrder.length;
      this.type = this.turnOrder[idx];
    }
  }

  updatePlayerCount() {
    let n = parseInt(numPlayersSelect.value);
    this.turnOrder = [1, 2, 3, 4].slice(0, n);
    this.type = this.turnOrder[0];
    // Set all home areas to their colors.
    document.getElementById("red").style.backgroundColor = "red";
    document.getElementById("green").style.backgroundColor = "green";
    document.getElementById("yellow").style.backgroundColor = "yellow";
    document.getElementById("blue").style.backgroundColor = "blue";
    // Gray out unused colors.
    if (n === 2) {
      document.getElementById("yellow").style.backgroundColor = "grey";
      document.getElementById("blue").style.backgroundColor = "grey";
    } else if (n === 3) {
      document.getElementById("blue").style.backgroundColor = "grey";
    }
  }
}

/******************************************
 * PART 5: Global Object Setup
 ******************************************/
var game = new GameLogic();
game.updatePlayerCount();
numPlayersSelect.addEventListener("change", function () {
  game.updatePlayerCount();
});

document.getElementById("startGame").addEventListener("click", function () {
  const numPlayers = document.getElementById("numPlayers").value;

  if (!numPlayers) {
      alert("Please select the number of players before starting the game.");
      return;
  }

  // Hide the initial welcome page
  document.getElementById("initial-welcome-page").style.display = "none";

  // Show the game page
  document.getElementById("game-page").style.display = "block";

  // Show the main game section
  document.getElementById("main").style.display = "flex";

  // Allow scrolling when game starts
  document.body.style.overflow = "auto";

  // Update the game logic with selected players
  game.updatePlayerCount();
});
