import * as THREE from 'three'


// ============================================================
// SCENE
// ============================================================

const scene = new THREE.Scene()

scene.background = new THREE.Color('#87a7c4')



// ============================================================
// CAMERA
// ============================================================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

camera.position.set(
    0,
    7,
    9
)



// ============================================================
// RENDERER
// ============================================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
})

renderer.setSize(
    window.innerWidth,
    window.innerHeight
)

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
)

renderer.shadowMap.enabled = true

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap

document.body.appendChild(
    renderer.domElement
)



// ============================================================
// LIGHTING
// ============================================================

// General world lighting

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        1.5
    )

scene.add(ambientLight)


// Sun

const sunLight =
    new THREE.DirectionalLight(
        0xffffff,
        2
    )

sunLight.position.set(
    5,
    10,
    5
)

sunLight.castShadow = true

sunLight.shadow.mapSize.width = 1024
sunLight.shadow.mapSize.height = 1024

sunLight.shadow.camera.left = -15
sunLight.shadow.camera.right = 15
sunLight.shadow.camera.top = 15
sunLight.shadow.camera.bottom = -15

scene.add(sunLight)



// ============================================================
// CHARACTER CREATOR
// ============================================================

function createCharacter(
    shirtColor,
    skinColor = '#d6a77a',
    zombie = false
){

    const character =
        new THREE.Group()


    // =========================
    // BODY
    // =========================

    const bodyGeometry =
        new THREE.BoxGeometry(
            0.7,
            0.9,
            0.4
        )

    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: shirtColor
        })

    const body =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        )

    body.position.y = 1.15

    body.castShadow = true

    character.add(body)



    // =========================
    // HEAD
    // =========================

    const headGeometry =
        new THREE.SphereGeometry(
            0.28,
            16,
            16
        )

    const headMaterial =
        new THREE.MeshStandardMaterial({
            color: zombie
                ? '#7c9a6d'
                : skinColor
        })

    const head =
        new THREE.Mesh(
            headGeometry,
            headMaterial
        )

    head.position.y = 1.9

    head.castShadow = true

    character.add(head)



    // =========================
    // LEGS
    // =========================

    const legGeometry =
        new THREE.BoxGeometry(
            0.22,
            0.7,
            0.25
        )

    const legMaterial =
        new THREE.MeshStandardMaterial({
            color: zombie
                ? '#3f3f46'
                : '#27272a'
        })


    const leftLeg =
        new THREE.Mesh(
            legGeometry,
            legMaterial
        )

    leftLeg.position.set(
        -0.2,
        0.35,
        0
    )

    leftLeg.castShadow = true


    const rightLeg =
        new THREE.Mesh(
            legGeometry,
            legMaterial
        )

    rightLeg.position.set(
        0.2,
        0.35,
        0
    )

    rightLeg.castShadow = true


    character.add(leftLeg)
    character.add(rightLeg)



    // =========================
    // ARMS
    // =========================

    const armGeometry =
        new THREE.BoxGeometry(
            0.18,
            0.75,
            0.18
        )

    const armMaterial =
        new THREE.MeshStandardMaterial({
            color: zombie
                ? '#7c9a6d'
                : skinColor
        })


    const leftArm =
        new THREE.Mesh(
            armGeometry,
            armMaterial
        )

    const rightArm =
        new THREE.Mesh(
            armGeometry,
            armMaterial
        )


    leftArm.position.set(
        -0.48,
        1.15,
        0
    )

    rightArm.position.set(
        0.48,
        1.15,
        0
    )


    // Zombies hold arms forward

    if(zombie){

        leftArm.rotation.x =
            Math.PI / 2

        rightArm.rotation.x =
            Math.PI / 2


        leftArm.position.z =
            -0.25

        rightArm.position.z =
            -0.25
    }


    leftArm.castShadow = true
    rightArm.castShadow = true


    character.add(leftArm)
    character.add(rightArm)



    // Save body parts so we can animate them later

    character.userData.leftLeg =
        leftLeg

    character.userData.rightLeg =
        rightLeg

    character.userData.leftArm =
        leftArm

    character.userData.rightArm =
        rightArm


    return character

}



// ============================================================
// PLAYER
// ============================================================

const player =
    createCharacter(
        '#f97316'
    )

scene.add(player)



// ============================================================
// PLAYER STATE
// ============================================================

const playerSpeed = 0.08

let health = 100

let score = 0

let gameOver = false

let lastDamageTime = 0

let playerWalkingTime = 0



// ============================================================
// GROUND
// ============================================================

const groundGeometry =
    new THREE.PlaneGeometry(
        20,
        20
    )

const groundMaterial =
    new THREE.MeshStandardMaterial({
        color: '#31572c'
    })

const ground =
    new THREE.Mesh(
        groundGeometry,
        groundMaterial
    )

ground.rotation.x =
    -Math.PI / 2

ground.position.y = 0

ground.receiveShadow = true

scene.add(ground)



// ============================================================
// GRASS
// ============================================================

const grassGeometry =
    new THREE.ConeGeometry(
        0.08,
        0.35,
        4
    )

const grassMaterial =
    new THREE.MeshStandardMaterial({
        color: '#588157'
    })


for(let i = 0; i < 180; i++){

    const grass =
        new THREE.Mesh(
            grassGeometry,
            grassMaterial
        )

    grass.position.set(
        Math.random() * 19 - 9.5,
        0.17,
        Math.random() * 19 - 9.5
    )

    grass.rotation.y =
        Math.random() * Math.PI

    scene.add(grass)

}



// ============================================================
// TREE CREATOR
// ============================================================

function createTree(
    x,
    z
){

    const tree =
        new THREE.Group()


    // TRUNK

    const trunk =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.2,
                0.3,
                1.8,
                8
            ),

            new THREE.MeshStandardMaterial({
                color: '#6b4423'
            })
        )

    trunk.position.y =
        0.9

    trunk.castShadow = true

    tree.add(trunk)



    // LEAVES

    const leaves =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                1,
                2.2,
                8
            ),

            new THREE.MeshStandardMaterial({
                color: '#386641'
            })
        )

    leaves.position.y =
        2.4

    leaves.castShadow = true

    tree.add(leaves)


    tree.position.set(
        x,
        0,
        z
    )


    scene.add(tree)

}



// ============================================================
// TREES
// ============================================================

// Keep most trees around edges

createTree(-8, -8)

createTree(8, -8)

createTree(-8, 8)

createTree(8, 8)

createTree(-9, 0)

createTree(9, 2)

createTree(-5, 9)

createTree(5, -9)



// ============================================================
// ROCK CREATOR
// ============================================================

function createRock(
    x,
    z,
    size
){

    const rock =
        new THREE.Mesh(
            new THREE.DodecahedronGeometry(
                size,
                0
            ),

            new THREE.MeshStandardMaterial({
                color: '#71717a'
            })
        )


    rock.position.set(
        x,
        size * 0.6,
        z
    )


    rock.scale.y = 0.6

    rock.rotation.set(
        Math.random(),
        Math.random(),
        Math.random()
    )


    rock.castShadow = true

    rock.receiveShadow = true


    scene.add(rock)

}



// ============================================================
// ROCKS
// ============================================================

createRock(-6, -3, 0.5)

createRock(6, 4, 0.7)

createRock(-4, 6, 0.4)

createRock(5, -5, 0.5)



// ============================================================
// MOVEMENT STATE
// ============================================================

let upPressed = false
let downPressed = false
let leftPressed = false
let rightPressed = false



// ============================================================
// KEY DOWN
// ============================================================

document.addEventListener(
    'keydown',
    function(event){

        if(event.key === 'w'){
            upPressed = true
        }

        if(event.key === 's'){
            downPressed = true
        }

        if(event.key === 'a'){
            leftPressed = true
        }

        if(event.key === 'd'){
            rightPressed = true
        }


        if(
            event.key === 'r' &&
            gameOver
        ){

            resetGame()

        }

    }
)



// ============================================================
// KEY UP
// ============================================================

document.addEventListener(
    'keyup',
    function(event){

        if(event.key === 'w'){
            upPressed = false
        }

        if(event.key === 's'){
            downPressed = false
        }

        if(event.key === 'a'){
            leftPressed = false
        }

        if(event.key === 'd'){
            rightPressed = false
        }

    }
)



// ============================================================
// UPDATE PLAYER
// ============================================================

function updatePlayer(){

    if(gameOver){
        return
    }


    let moving = false


    if(upPressed){

        player.position.z -=
            playerSpeed

        moving = true

    }


    if(downPressed){

        player.position.z +=
            playerSpeed

        moving = true

    }


    if(leftPressed){

        player.position.x -=
            playerSpeed

        moving = true

    }


    if(rightPressed){

        player.position.x +=
            playerSpeed

        moving = true

    }



    // =========================
    // ARENA BOUNDARIES
    // =========================

    player.position.x =
        Math.max(
            -9.5,
            Math.min(
                9.5,
                player.position.x
            )
        )


    player.position.z =
        Math.max(
            -9.5,
            Math.min(
                9.5,
                player.position.z
            )
        )



    // =========================
    // WALK ANIMATION
    // =========================

    if(moving){

        playerWalkingTime +=
            0.15


        const swing =
            Math.sin(
                playerWalkingTime
            ) * 0.6


        player.userData.leftLeg.rotation.x =
            swing

        player.userData.rightLeg.rotation.x =
            -swing

    }
    else{

        player.userData.leftLeg.rotation.x =
            0

        player.userData.rightLeg.rotation.x =
            0

    }

}



// ============================================================
// CAMERA
// ============================================================

function updateCamera(){

    camera.position.x =
        player.position.x

    camera.position.y =
        7

    camera.position.z =
        player.position.z + 9


    camera.lookAt(
        player.position.x,
        0.8,
        player.position.z
    )

}



// ============================================================
// MOUSE / AIMING
// ============================================================

const mouse =
    new THREE.Vector2()

const raycaster =
    new THREE.Raycaster()

const aimPoint =
    new THREE.Vector3()



renderer.domElement.addEventListener(
    'mousemove',
    function(event){

        mouse.x =
            (event.clientX /
                window.innerWidth)
            * 2 - 1


        mouse.y =
            -(event.clientY /
                window.innerHeight)
            * 2 + 1

    }
)



// ============================================================
// UPDATE AIM
// ============================================================

function updateAim(){

    raycaster.setFromCamera(
        mouse,
        camera
    )


    const groundPlane =
        new THREE.Plane(
            new THREE.Vector3(
                0,
                1,
                0
            ),
            0
        )


    raycaster.ray.intersectPlane(
        groundPlane,
        aimPoint
    )


    const differenceX =
        aimPoint.x -
        player.position.x

    const differenceZ =
        aimPoint.z -
        player.position.z


    player.rotation.y =
        Math.atan2(
            -differenceX,
            -differenceZ
        )

}



// ============================================================
// BULLETS
// ============================================================

const bullets = []

const bulletGeometry =
    new THREE.SphereGeometry(
        0.12,
        8,
        8
    )

const bulletMaterial =
    new THREE.MeshStandardMaterial({
        color: 'white',
        emissive: 'white',
        emissiveIntensity: 0.5
    })



// ============================================================
// SHOOT
// ============================================================

renderer.domElement.addEventListener(
    'click',
    function(){

        if(gameOver){
            return
        }


        const bullet =
            new THREE.Mesh(
                bulletGeometry,
                bulletMaterial
            )


        bullet.position.copy(
            player.position
        )


        bullet.position.y =
            1.2


        const direction =
            new THREE.Vector3(
                aimPoint.x -
                    player.position.x,

                0,

                aimPoint.z -
                    player.position.z
            )


        direction.normalize()


        bullet.userData.velocity =
            direction.multiplyScalar(
                0.2
            )


        bullet.castShadow = true


        scene.add(bullet)

        bullets.push(bullet)

    }
)



// ============================================================
// UPDATE BULLETS
// ============================================================

function updateBullets(){

    for(
        let i =
            bullets.length - 1;

        i >= 0;

        i--
    ){

        const bullet =
            bullets[i]


        bullet.position.add(
            bullet.userData.velocity
        )


        if(
            Math.abs(
                bullet.position.x
            ) > 12 ||

            Math.abs(
                bullet.position.z
            ) > 12
        ){

            scene.remove(
                bullet
            )

            bullets.splice(
                i,
                1
            )

        }

    }

}



// ============================================================
// ENEMIES
// ============================================================

const enemies = []



// ============================================================
// CREATE ENEMY
// ============================================================

function createEnemy(){

    if(gameOver){
        return
    }


    const enemy =
        createCharacter(
            '#4b5563',
            '#7c9a6d',
            true
        )


    const side =
        Math.floor(
            Math.random() * 4
        )


    if(side === 0){

        enemy.position.set(
            -9,
            0,
            Math.random() * 18 - 9
        )

    }


    if(side === 1){

        enemy.position.set(
            9,
            0,
            Math.random() * 18 - 9
        )

    }


    if(side === 2){

        enemy.position.set(
            Math.random() * 18 - 9,
            0,
            -9
        )

    }


    if(side === 3){

        enemy.position.set(
            Math.random() * 18 - 9,
            0,
            9
        )

    }


    enemy.userData.speed =
        0.015 +
        Math.random() * 0.01


    enemy.userData.walkTime =
        Math.random() * 10


    scene.add(enemy)

    enemies.push(enemy)

}



// ============================================================
// UPDATE ENEMIES
// ============================================================

function updateEnemies(){

    if(gameOver){
        return
    }


    enemies.forEach(
        function(enemy){

            const differenceX =
                player.position.x -
                enemy.position.x

            const differenceZ =
                player.position.z -
                enemy.position.z


            const distance =
                Math.hypot(
                    differenceX,
                    differenceZ
                )


            if(distance > 0){

                const directionX =
                    differenceX /
                    distance

                const directionZ =
                    differenceZ /
                    distance


                enemy.position.x +=
                    directionX *
                    enemy.userData.speed

                enemy.position.z +=
                    directionZ *
                    enemy.userData.speed


                // FACE PLAYER

                enemy.rotation.y =
                    Math.atan2(
                        -differenceX,
                        -differenceZ
                    )

            }



            // =========================
            // ZOMBIE WALK
            // =========================

            enemy.userData.walkTime +=
                0.1


            const swing =
                Math.sin(
                    enemy.userData.walkTime
                ) * 0.45


            enemy.userData.leftLeg.rotation.x =
                swing

            enemy.userData.rightLeg.rotation.x =
                -swing

        }
    )

}



// ============================================================
// BULLET / ENEMY COLLISION
// ============================================================

function checkBulletEnemyCollision(){

    for(
        let bulletIndex =
            bullets.length - 1;

        bulletIndex >= 0;

        bulletIndex--
    ){

        const bullet =
            bullets[bulletIndex]


        for(
            let enemyIndex =
                enemies.length - 1;

            enemyIndex >= 0;

            enemyIndex--
        ){

            const enemy =
                enemies[enemyIndex]


            const differenceX =
                bullet.position.x -
                enemy.position.x

            const differenceZ =
                bullet.position.z -
                enemy.position.z


            const distance =
                Math.hypot(
                    differenceX,
                    differenceZ
                )


            if(distance < 0.7){

                scene.remove(
                    bullet
                )

                bullets.splice(
                    bulletIndex,
                    1
                )


                scene.remove(
                    enemy
                )

                enemies.splice(
                    enemyIndex,
                    1
                )


                score += 10


                updateHUD()


                break

            }

        }

    }

}



// ============================================================
// PLAYER / ENEMY COLLISION
// ============================================================

function checkPlayerEnemyCollision(
    timestamp
){

    if(gameOver){
        return
    }


    enemies.forEach(
        function(enemy){

            const differenceX =
                player.position.x -
                enemy.position.x

            const differenceZ =
                player.position.z -
                enemy.position.z


            const distance =
                Math.hypot(
                    differenceX,
                    differenceZ
                )


            if(
                distance < 0.8 &&
                timestamp -
                lastDamageTime > 500
            ){

                health -= 10

                lastDamageTime =
                    timestamp


                if(health <= 0){

                    health = 0

                    endGame()

                }


                updateHUD()

            }

        }
    )

}



// ============================================================
// ENEMY SPAWNING
// ============================================================

let lastSpawnTime = 0

let spawnDelay = 1500



// ============================================================
// UPDATE ENEMY SPAWNING
// ============================================================

function updateEnemySpawning(
    timestamp
){

    if(gameOver){
        return
    }


    if(
        timestamp -
        lastSpawnTime >
        spawnDelay
    ){

        createEnemy()

        lastSpawnTime =
            timestamp

    }

}



// ============================================================
// DIFFICULTY
// ============================================================

function updateDifficulty(){

    spawnDelay =
        Math.max(
            400,

            1500 -
            Math.floor(
                score / 50
            ) * 100
        )

}



// ============================================================
// HUD
// ============================================================

const hud =
    document.createElement(
        'div'
    )

hud.style.position =
    'absolute'

hud.style.top =
    '20px'

hud.style.left =
    '20px'

hud.style.color =
    'white'

hud.style.fontFamily =
    'Arial'

hud.style.fontSize =
    '20px'

hud.style.fontWeight =
    'bold'

hud.style.lineHeight =
    '1.6'

hud.style.userSelect =
    'none'

hud.style.textShadow =
    '0 2px 5px black'

document.body.appendChild(
    hud
)



// ============================================================
// UPDATE HUD
// ============================================================

function updateHUD(){

    const wave =
        Math.floor(
            score / 100
        ) + 1


    hud.innerHTML = `
        HEALTH: ${health}<br>
        SCORE: ${score}<br>
        WAVE: ${wave}
    `

}


updateHUD()



// ============================================================
// GAME OVER MESSAGE
// ============================================================

const gameOverText =
    document.createElement(
        'div'
    )

gameOverText.style.position =
    'absolute'

gameOverText.style.left =
    '50%'

gameOverText.style.top =
    '50%'

gameOverText.style.transform =
    'translate(-50%, -50%)'

gameOverText.style.color =
    'white'

gameOverText.style.fontFamily =
    'Arial'

gameOverText.style.fontWeight =
    'bold'

gameOverText.style.textAlign =
    'center'

gameOverText.style.fontSize =
    '48px'

gameOverText.style.textShadow =
    '0 3px 8px black'

gameOverText.style.display =
    'none'

document.body.appendChild(
    gameOverText
)



// ============================================================
// END GAME
// ============================================================

function endGame(){

    gameOver = true


    gameOverText.innerHTML = `
        GAME OVER
        <br>

        <span style="
            font-size:20px;
            font-weight:normal;
        ">

            Score: ${score}

            <br>

            Press R to Restart

        </span>
    `


    gameOverText.style.display =
        'block'

}



// ============================================================
// RESET GAME
// ============================================================

function resetGame(){

    health = 100

    score = 0

    gameOver = false

    spawnDelay = 1500

    lastSpawnTime = 0

    lastDamageTime = 0


    player.position.set(
        0,
        0,
        0
    )


    // REMOVE ENEMIES

    enemies.forEach(
        function(enemy){

            scene.remove(
                enemy
            )

        }
    )

    enemies.length = 0


    // REMOVE BULLETS

    bullets.forEach(
        function(bullet){

            scene.remove(
                bullet
            )

        }
    )

    bullets.length = 0


    gameOverText.style.display =
        'none'


    updateHUD()

}



// ============================================================
// WINDOW RESIZE
// ============================================================

window.addEventListener(
    'resize',
    function(){

        camera.aspect =
            window.innerWidth /
            window.innerHeight


        camera.updateProjectionMatrix()


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        )

    }
)



// ============================================================
// GAME LOOP
// ============================================================

function gameLoop(
    timestamp = 0
){

    // =========================
    // UPDATE
    // =========================

    updatePlayer()

    updateAim()

    updateBullets()

    updateEnemies()

    updateEnemySpawning(
        timestamp
    )

    checkBulletEnemyCollision()

    checkPlayerEnemyCollision(
        timestamp
    )

    updateDifficulty()

    updateCamera()


    // =========================
    // DRAW
    // =========================

    renderer.render(
        scene,
        camera
    )


    requestAnimationFrame(
        gameLoop
    )

}


requestAnimationFrame(
    gameLoop
)