class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    sprite4x4 = false,
    animate = false,
    rotation = 0,
    scale = 1,
  }) {
    this.position = position
    this.image = new Image()
    this.sprite4x4 = sprite4x4
    this.frames = { ...frames, val: 0, elapsed: 0 }
    this.scale = scale
    this.image.onload = () => {
      this.width = (this.image.width / this.frames.max) * this.scale
      this.height = this.sprite4x4 ? (this.image.height / this.frames.max) * this.scale : this.image.height * this.scale
    }
    this.image.src = image.src
    this.animate = animate
    this.sprites = sprites
    this.opacity = 1
    this.rotation = rotation

  }

  draw() {
    c.imageSmoothingEnabled = false;
    c.save()
    c.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    )
    c.rotate(this.rotation)
    c.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    )
    c.globalAlpha = this.opacity
  
    const crop = {
      position: {
        x: this.sprite4x4 ? 0 : this.frames.val * (this.width / this.scale),
        y: this.sprite4x4 ? this.frames.val * (this.height / this.scale) + 0 : 0
      },
      width: this.image.width / this.frames.max,
      height: this.sprite4x4 ? this.image.height / this.frames.max  : this.image.height
    }

    const image = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      width: this.image.width / this.frames.max,
      height: this.sprite4x4 ? this.image.height / this.frames.max : this.image.height
    }

    c.drawImage(
      this.image,
      crop.position.x,
      crop.position.y,
      crop.width,
      crop.height,
      image.position.x,
      image.position.y,
      image.width * this.scale,
      image.height * this.scale
    )
      console.log(this.scale)
    c.restore()

    if (!this.animate) return

    if (this.frames.max > 1) {
      this.frames.elapsed++
    }

    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
    }
  }
}

class Monster extends Sprite {
  constructor({
    position,
    image,
    sprite4x4 = false,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    isEnemy = false,
    name,
    attacks,
    exp,
    enemyName,
    scale
  }) {
    super({
      sprite4x4,
      position,
      image,
      frames,
      sprites,
      animate,
      rotation,
      scale,
    })
    this.health = 100
    this.isEnemy = isEnemy
    this.name = name
    this.attacks = attacks
    this.exp = exp
    this.enemyName = enemyName
  }

  
  faint() {
    document.querySelector('#dialogueBox').innerHTML = this.name + ' fainted!'
    gsap.to(this.position, {
      y: this.position.y + 20
    })
    gsap.to(this, {
      opacity: 0
    })
    audio.battle.stop()
  }

  win() {
    audio.victory.play()
    console.log(this.name + " gained 51 exp ")
    // document.querySelector('#dialogueBox').innerHTML = this.enemyName + ' fainted!'
    document.querySelector('#dialogueBox').style.display = 'block'
    document.querySelector('#dialogueBox').innerHTML =
      this.name + ' gained 50 exp '
    gainExperiencePoints(50)
    audio.victory.stop()
  }

  attack({ attack, recipient, renderedSprites }) {
    document.querySelector('#dialogueBox').style.display = 'block'
    document.querySelector('#dialogueBox').innerHTML =
      this.name + ' used ' + attack.name

    let healthBar = '#enemyHealthBar'
    if (recipient==p1) healthBar = '#playerHealthBar'
    console.log(recipient==p1)
    let rotation = 1
    if (recipient==p1) rotation = -2.2

    recipient.health -= attack.damage
    if (recipient==p1) pokemonStats.health -= attack.damage
    console.log(pokemonStats.health)

    switch (attack.name) {
      case 'Fireball':
        audio.initFireball.play()
        const fireballImage = new Image()
        fireballImage.src = './img/fireball.png'
        const fireball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y
          },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 10
          },
          animate: true,
          rotation
        })
        renderedSprites.splice(1, 0, fireball)

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            // Enemy actually gets hit
            audio.fireballHit.play()
            gsap.to(healthBar, {
              width: recipient.health + '%'
            })

            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08
            })

            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08
            })
            renderedSprites.splice(1, 1)
          }
        })

        break
      case 'Tackle':
        const tl = gsap.timeline()

        let movementDistance = 20
        if (this.isEnemy) movementDistance = -20

        tl.to(this.position, {
          x: this.position.x - movementDistance
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              // Enemy actually gets hit
              audio.tackleHit.play()
              gsap.to(healthBar, {
                width: recipient.health + '%'
              })

              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08
              })

              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08
              })
            }
          })
          .to(this.position, {
            x: this.position.x
          })
        break
    }
  }
}

class Boundary {
  static width = 48
  static height = 48
  constructor({ position }) {
    this.position = position
    this.width = 48
    this.height = 48
  }

  draw() {
    c.fillStyle = 'rgba(255, 0, 0, 0)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

class Character extends Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprite4x4 = false,
    sprites,
    animate = false,
    rotation = 0,
    scale = 1,
    dialogue = ['']
  }) {
    super({
      sprite4x4,
      position,
      image,
      frames,
      sprites,
      animate,
      rotation,
      scale
    })

    this.dialogue = dialogue
    this.dialogueIndex = 0
  }
}
