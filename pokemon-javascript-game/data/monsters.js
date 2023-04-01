const monsters = {
  Emby: {
    position: {
      x: 280,
      y: 325
    },
    image: {
      src: './img/embySprite.png'
    },
    frames: {
      max: 4,
      hold: 30
    },
    scale: 1,
    sprite4x4: false,
    animate: true,
    name: 'Emby',
    attacks: [attacks.Tackle, attacks.Fireball]
  },
  Jelly: {
    position: {
      // x: 280,
      // y: 325
      x: 800,
      y: 100
    },
    image: {
      src: './img/jellySprite.png',
    },
    frames: {
      max: 4,
      hold: 30
    },
    scale: 5,
    sprite4x4: true,
    animate: true,
    name: 'Jelly',
    attacks: [attacks.Tackle, attacks.Fireball]
  },
  Blooper: {
    position: {
      // x: 280,
      // y: 325
      x: 800,
      y: 100
    },
    image: {
      src: './img/blooperSprite.png',
    },
    frames: {
      max: 4,
      hold: 30
    },
    scale: 5,
    sprite4x4: true,
    animate: true,
    name: 'Blooper',
    attacks: [attacks.Tackle, attacks.Fireball]
  },
  Pignon: {
    position: {
      // x: 280,
      // y: 325
      x: 800,
      y: 100
    },
    image: {
      src: './img/pignonSprite.png',
    },
    frames: {
      max: 4,
      hold: 30
    },
    scale: 1.6,
    sprite4x4: true,
    animate: true,
    name: 'Pignon',
    attacks: [attacks.Tackle, attacks.Fireball]
  },
  Draggle: {
    position: {
      x: 800,
      y: 100
    },
    image: {
      src: './img/draggleSprite.png'
    },
    frames: {
      max: 4,
      hold: 30
    },
    sprite4x4: false,
    animate: true,
    isEnemy: true,
    name: 'Draggle',
    attacks: [attacks.Tackle, attacks.Fireball]
  }
}
