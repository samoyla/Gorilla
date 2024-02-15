let state = {};

const canvas = document.getElementById('game'); // Get the canvas element
canvas.width = window.innerWidth; // Set canvas width to window width
canvas.height = window.innerHeight; // Set canvas height to window height
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#4A3CC68"
newGame();

function newGame() {
    state = {
        phase: 'celebrating',//in flight or celebrating
        CurrentPlayer: 1,
        // bomb: {
        //     x: undefined,
        //     y: undefined,
        //     rotation: 0,
        //     velocity: {x: 0, y: 0},    
        // },
        //Buildings
        backgroundBuildings: [],
        buildings: [],
        blastHoles: [],
    };

    for (let i = 0; i < 11; i++) {
        generateBackgroundBuilding(i);
    }
        
    for (let i = 0; i < 8; i++) {
        generateBuilding(i);
    }

    //initializeBombPosition();

    draw();
}

function draw() {
    ctx.save();
    //flip coordinate system upside down
    ctx.translate(0, window.innerHeight);
    ctx.scale(1, -1);
    //draw scene
    drawBackground();
    drawBackgroundBuildings();
    drawBuildings();
    drawGorilla(1);
    drawGorilla(2);
   // drawBomb();
    //restore coordinate system
    ctx.restore();
}

// function throwBombs() {

// }

// function animate(timestamp) {

// }

function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
    gradient.addColorStop(1, '#F8B885');
    gradient.addColorStop(0, '#FFC28E');
    //draw sky
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    //draw moon
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();
    ctx.arc(300, 350, 60, 0, Math.PI * 2);
    ctx.fill();
}

function generateBackgroundBuilding(index){
    const previousBuilding = state.backgroundBuildings[index - 1];
    
    const x = previousBuilding ? previousBuilding.x + previousBuilding.width + 4 : -30;
    
    const minWidth =  80;
    const maxWidth = 110;
    const width = minWidth + Math.random() * (maxWidth - minWidth);
    
    const minHeight =  80;
    const maxHeight = 350;
    const height = minHeight + Math.random() * (maxHeight - minHeight);

    state.backgroundBuildings.push({x, width, height});
};

function generateBuilding(index){
    const previousBuilding = state.buildings[index - 1];

    const x = previousBuilding ? previousBuilding.x + previousBuilding.width + 4 : 0;
    
    const minWidth =  80;
    const maxWidth = 130;
    const width = minWidth + Math.random() * (maxWidth - minWidth);

    const platformWithGotilla = index === 1 || index === 6;
    const minHeight = 40;
    const maxHeight = 300;
    const minHeightGorilla = 30;
    const maxHeightGorilla = 150;

    const height = platformWithGotilla ? minHeightGorilla + Math.random() * (maxHeightGorilla - minHeightGorilla) : minHeight + Math.random() * (maxHeight - minHeight);
    
    //generate an array of booleans to show if the light is on or off in a room
    const lightsOn = [];
    for (let i = 0; i < 50; i++) {
        const light = Math.random() <= 0.33 ? true : false;
        lightsOn.push(light);
    }

    state.buildings.push({x, width, height, lightsOn});
};

//function initializeBombPosition(){};

function drawBackgroundBuildings(){
    state.backgroundBuildings.forEach(building => {
        ctx.fillStyle = "#947285";
        ctx.fillRect(building.x, 0, building.width, building.height);
    });
};

function drawBuildings(){
    state.buildings.forEach((building) => {
        
    //draw building
    ctx.fillStyle = "#4A3C68";
    ctx.fillRect(building.x, 0, building.width, building.height);
    
    //draw windows
    const windowWidth = 10;
    const windowHeight = 12;
    const gap =  15;

    const numberOfFloors = Math.ceil((building.height - gap) / (windowHeight + gap));
    const numberOfRoomsPerFloor = Math.floor((building.width - gap) / (windowWidth + gap));

    for (let floor = 0; floor < numberOfFloors; floor++) {
        for (let room = 0; room < numberOfRoomsPerFloor; room++) {
            if(building.lightsOn[floor * numberOfRoomsPerFloor + room]){
                ctx.save();

                ctx.translate(building.x + gap, building.height - gap);
                ctx.scale(1, -1);
                
                const x = room * (windowWidth + gap);
                const y = floor * (windowHeight + gap);

                ctx.fillStyle = "#EBB6A2";
                ctx.fillRect(x, y, windowWidth, windowHeight);

                ctx.restore();  
            }            
        }
    }
});
}

function drawGorilla(player){
    ctx.save();

    const building = 
        player === 1
        ? state.buildings.at(1) //second building
        : state.buildings.at(-2); //second last building

    ctx.translate(building.x + building.width/2, building.height);

    drawGorillaBody();
    drawGorillaLeftArm();
    drawGorillaRightArm();
    drawGorillaFace();

    ctx.restore();
}

function drawGorillaBody() {
    ctx.fillStyle = "black";
    
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(-7, 0);
    ctx.lineTo(-20, 0);
    ctx.lineTo(-17, 18);
    ctx.lineTo(-20, 44);

    ctx.lineTo(-11, 77);
    ctx.lineTo(0, 84);
    ctx.lineTo(11, 77);

    ctx.lineTo(20, 44);
    ctx.lineTo(17, 18);
    ctx.lineTo(20, 0);
    ctx.lineTo(7, 0);
    ctx.fill();
}

function drawGorillaLeftArm(player) {

    ctx.strokeStyle = "black";
    ctx.lineWidth = 18;

    ctx.beginPath();
    ctx.moveTo(-14, 50);

    if(state.phase === "aiming" && state.currentPlayer === 1 && player === 1){
        ctx.quadraticCurveTo(-44, 63, -28, 107);
    }else if(state.phase === "celebrating" && state.currentPlayer === player){
        ctx.quadraticCurveTo(-44, 63, -28, 107);
    }else{
        ctx.quadraticCurveTo(-44, 45, -28, 12);
    }

    ctx.stroke();
}

function drawGorillaRightArm(player) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 18;

    ctx.beginPath();
    ctx.moveTo(+14, 50);

    if(state.phase === "aiming" && state.currentPlayer === 2 && player === 2){
        ctx.quadraticCurveTo(+44, 63, +28, 107);
    }else if(state.phase === "celebrating" && state.currentPlayer === player){
        ctx.quadraticCurveTo(+44, 63, +28, 107);
    }else{
        ctx.quadraticCurveTo(+44, 45, +28, 12);
    }

    ctx.stroke();
}

function drawGorillaFace(player) {
    //face
    ctx.fillStyle = "lightgrey";
    ctx.beginPath();
    ctx.arc(0, 63, 9, 0, Math.PI * 2);
    ctx.moveTo(-3.5, 70);
    ctx.arc(-3.5, 70, 4, 0, Math.PI * 2);
    ctx.moveTo(3.5, 70);
    ctx.arc(3.5, 70, 4, 0, Math.PI * 2);
    ctx.fill();

    //eyes
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(-3.5, 70, 1.4, 0, Math.PI * 2);
    ctx.moveTo(3.5, 70);
    ctx.arc(3.5, 70, 1.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.4;

    //nose
    ctx.beginPath();
    ctx.moveTo(-3.5, 66.5);
    ctx.lineTo(-1.5, 65);
    ctx.moveTo(3.5, 66.5);
    ctx.lineTo(1.5, 65);
    ctx.stroke();

    //mouth
    ctx.beginPath();
    if(state.phase === "celebrating" && state.currentPlayer === player){
        ctx.moveTo(-5, 60);
        ctx.quadraticCurveTo(0, 56, 5, 60);
    }else{
        ctx.moveTo(-5, 56);
        ctx.quadraticCurveTo(0, 60, 5, 56);
    }
    ctx.stroke();
}

// function drawBomb(){};