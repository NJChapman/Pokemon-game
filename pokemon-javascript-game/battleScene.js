const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  image: battleBackgroundImage
})


let p1, p2
let renderedSprites
let battleAnimationId
let queue

function initBattle(P1,P2) {
  document.querySelector('#userInterface').style.display = 'block'
  document.querySelector('#PlayerBox').innerHTML = P1
  document.querySelector('#EnemyBox').innerHTML = P2
  document.querySelector('#dialogueBox').style.display = 'none'
  document.querySelector('#enemyHealthBar').style.width = '100%'
  document.querySelector('#playerHealthBar').style.width = '100%'
  document.querySelector('#attacksBox').replaceChildren()
  // P1 = P1
  // P2 = P2

  p2 = new Monster(monsters[P2])
  p1 = new Monster(monsters[P1])
  renderedSprites = [p2, p1]
  queue = []

  p1.attacks.forEach((attack) => {
    const button = document.createElement('button')
    button.innerHTML = attack.name
    document.querySelector('#attacksBox').append(button)
  })

  // our event listeners for our buttons (attack)
  document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML]
      p1.attack({
        attack: selectedAttack,
        recipient: p2,
        renderedSprites
      })

      if (p2.health <= 0) {
        queue.push(() => {
        
          console.log(p1.name + "won")
          p2.faint()
          p1.win()
        })
        queue.push(() => {
          // fade back to black
          gsap.to('#overlappingDiv', {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId)
              animate()
              document.querySelector('#userInterface').style.display = 'none'

              gsap.to('#overlappingDiv', {
                opacity: 0
              })

              battle.initiated = false
              audio.Map.play()
            }
          })
        })
      }

      // enemy attacks right here
      const randomAttack =
        p2.attacks[Math.floor(Math.random() * p2.attacks.length)]

      queue.push(() => {
        p2.attack({
          attack: randomAttack,
          recipient: p1,
          renderedSprites
        })

        if (p1.health <= 0) {
          queue.push(() => {
            p1.faint()
          })

          queue.push(() => {
            // fade back to black
            gsap.to('#overlappingDiv', {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId)
                animate()
                document.querySelector('#userInterface').style.display = 'none'

                gsap.to('#overlappingDiv', {
                  opacity: 0
                })

                battle.initiated = false
                audio.Map.play()
              }
            })
          })
        }
      })
    })

    button.addEventListener('mouseenter', (e) => {
      const selectedAttack = attacks[e.currentTarget.innerHTML]
      e.currentTarget.overlay.style.display = "block";
      // document.querySelector('#attackType').innerHTML = selectedAttack.type
      // document.querySelector('#attackType').style.color = selectedAttack.color
    })
  })
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle)
  battleBackground.draw()
  // renderedSprites.forEach((sprite) => {
  //   sprite.draw()
  // })
  p1.draw()
  p2.draw()

}

animate()
// initBattle()
// animateBattle()

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
  if (queue.length > 0) {
    queue[0]()
    queue.shift()
  } else e.currentTarget.style.display = 'none'
})
