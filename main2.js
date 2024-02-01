//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let gameOver=false // true이면 게임오버, false이면 게임오버아님.
let score = 0

// 이미지 지정
let backgroundImage,starshipImage,bulletImage,alianImage,gameOverImage,explosionImage,pauseImage;


function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src = "images/background.jpg"
    
    starshipImage = new Image();
    starshipImage.src = "images/starship.png"
 
    bulletImage = new Image();
    bulletImage.src = "images/bullet.png"

    alianImage = new Image();
    alianImage.src = "images/alien.png"

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.png"

    explosionImage = new Image();
    explosionImage.src = "images/explosion.png"

    pauseImage = new Image();
    pauseImage.src = "images/paused.png";
}


// 우주선 좌표
let starshipX = canvas.width/2-32
let starshipY = canvas.height-64

//총알들을 저장하는 리스트
let bulletList = [] 

const bulletSpeed = 300; // 예: 초당 300픽셀

function bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.x = starshipX + 27;
        this.y = starshipY - 20;
        this.alive = true;
        bulletList.push(this);
    };
    this.update = function(deltaTime) {
        this.y -= bulletSpeed * deltaTime;
    
        if (this.y < 0) {
            this.alive = false;
        }
    };

    this.checkHit=function(){
        for(let i = 0; i < alianList.length; i++){
            if(this.y <= alianList[i].y+20 && 
                this.x >=alianList[i].x && 
                this.x <=alianList[i].x+40)
            {
                score += 10;
                this.alive = false;
                alianList[i].alive = false;
                alianList.splice(i, 1);

                // 새로운 폭발 객체 생성
                let explosion = new Explosion(this.x, this.y);
                explosionList.push(explosion);
            }
        }

    }
    }
    
    let explosionList = [];
    function Explosion(x, y) {
        this.x = x-20;
        this.y = y;
        this.frameIndex = 0;
        this.frames = 1;  // 폭발 이미지 프레임 수
        this.frameWidth = 64;  // 프레임 너비
        this.frameHeight = 64;  // 프레임 높이
        this.alive = true;
        this.frameDuration = 1;

        this.update = function () {
            if (this.frameIndex < this.frames) {
                this.frameIndex++;
            } else {
                this.alive = false;
            }
        }
    
        this.render = function () {
            if (this.alive) {
                ctx.drawImage(explosionImage,
                    this.frameIndex * this.frameWidth, 0,
                    this.frameWidth, this.frameHeight,
                    this.x, this.y, this.frameWidth, this.frameHeight);
            }
        }
    }

    
    function updateExplosions() {
        for (let i = 0; i < explosionList.length; i++) {
            explosionList[i].update();
            if (!explosionList[i].alive) {
                explosionList.splice(i, 1);
                i--;
            }
        }
    }
    
    function renderExplosions() {
        for (let i = 0; i < explosionList.length; i++) {
            explosionList[i].render();
        }
    }

//에일리언 리스트
let alianList = []

function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum
}

// function alian(){
//     this.x = 0;
//     this.y = 0;
//     this.init=function(){
//         this.x = generateRandomValue(0,canvas.width-40)
//         this.y = 0
//         this.alive = true;

//         alianList.push(this)
//     }
//     this.update = function(){
//         this.y +=1   //적군 속도조절
       
//         if(this.y >=canvas.height-20){
//             gameOver = true;
//         }
//     }


const alianSpeed = 100; // 예: 초당 50픽셀

function alian() {
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.x = generateRandomValue(0, canvas.width - 40);
        this.y = 0;
        this.alive = true;
        alianList.push(this);
    };
    this.update = function(deltaTime) {
        this.y += alianSpeed * deltaTime;
       
        if (this.y >= canvas.height - 20) {
            gameOver = true;
        }
    };
}

//움직임
let keysdown = {};
let isPaused = false; // 게임이 일시정지되었는지 확인하는 변수

function setupKeyboardListener() {
    document.addEventListener("keydown", function(event) {
        if (event.key != "p") {
            keysdown[event.key] = true;
        }
    });

    document.addEventListener("keyup", function(event) {
        if (event.key != "p") {
            delete keysdown[event.key];
        }

        if (event.key == " ") {
            createBullet(); // 총알 생성
        }

        if (event.keyCode == 80) { // 'P' 키의 키 코드
            isPaused = !isPaused; // 일시정지 상태 토글
        }
    });
}


function createBullet(){
    let b = new bullet() //총알 하나 생성
    b.init();
    
    // if (b.alive) {
    //     bulletList.push(b);}

}
 

function createAlian() {
    if (!isPaused){
    let a = new alian();
    a.init();}

    // 다음 적 생성까지의 랜덤 대기 시간 설정
    let nextAlianTime = generateRandomValue(500, 3000); // 1초에서 3초 사이
    setTimeout(createAlian, nextAlianTime);
}


const starshipSpeed = 150; // 여기서 200은 초당 200픽셀을 의미

function update(deltaTime) {
    if ("ArrowRight" in keysdown) { starshipX += starshipSpeed * deltaTime; }
    if ("ArrowLeft" in keysdown) { starshipX -= starshipSpeed * deltaTime; }
    if ("ArrowUp" in keysdown) { starshipY -= starshipSpeed * deltaTime; }
    if ("ArrowDown" in keysdown) { starshipY += starshipSpeed * deltaTime; }


    if (starshipX <=-32) {starshipX = -32}
    if (starshipX >=canvas.width-32) {starshipX = canvas.width -32}
    if (starshipY >=636) {starshipY = 636}
    if (starshipY <=0) {starshipY = 0}


    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].alive)
        {
        bulletList[i].update(deltaTime)
        bulletList[i].checkHit()
        }
    }
     
    
    let starshipCenterX = starshipX + 32; // 플레이어 중심 x 좌표 (플레이어 이미지 크기에 따라 조정)
    let starshipCenterY = starshipY + 32; // 플레이어 중심 y 좌표 (플레이어 이미지 크기에 따라 조정)

    for (let i = 0; i < alianList.length; i++) {
        if (alianList[i].alive) {
            alianList[i].update(deltaTime);

            let alianCenterX = alianList[i].x + 20; // 적 중심 x 좌표 (적 이미지 크기에 따라 조정)
            let alianCenterY = alianList[i].y + 20; // 적 중심 y 좌표 (적 이미지 크기에 따라 조정)

            // 중심점 기준으로 각각 25 픽셀(플레이어)과 15 픽셀(적) 내에 있는지 확인
            if (Math.abs(starshipCenterX - alianCenterX) < 30 && 
                Math.abs(starshipCenterY - alianCenterY) < 30) 
                {
                gameOver = true;
                }
        }
    }
}

function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(starshipImage, starshipX, starshipY);

    ctx.fillStyle = "white";
    ctx.font = "15px Arial";
    ctx.fillText(`SCORE ${score}`, 10, 25);
    

    for(let i=0;i<bulletList.length;i++){
        if(bulletList[i].alive){
        ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y);
        }
    }
    
    for(let i=0; i<alianList.length; i++){
        if(alianList[i].alive)
        ctx.drawImage(alianImage, alianList[i].x, alianList[i].y);
    }

    if (isPaused){
        ctx.drawImage(pauseImage, 0, 0, canvas.width, canvas.height)
    }

    renderExplosions();
}

let lastTime = 0;

function main(currentTime){
    requestAnimationFrame(main);

    let deltaTime = (currentTime - lastTime) / 1000; // 초 단위로 변경
    lastTime = currentTime;

    if (!gameOver) {
        if (!isPaused) {
            update(deltaTime);
            render();
        } else {
            // 일시정지 이미지 렌더링
            ctx.drawImage(pauseImage, 0, 0, canvas.width, canvas.height);
        }

        updateExplosions(deltaTime);
    } else {
        ctx.drawImage(gameOverImage, 0, 100);
    }
}


loadImage();
setupKeyboardListener();
main();
createAlian();