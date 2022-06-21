let columns: { [key: number]: number } = {};
let points = 0;
let x: number = 0;
let y: number = 0;
let multithreading = parseInt(control.hardwareVersion()) == 2;
const BRIGHTNESS = 50;
let current_difficulty = getDifficulty(points);

function buttonA() {
    if ((5 - y) < columns[x - 1]) { // If our current y position is lower than the target column
        return;
    }
    x = Math.max(x - 1, 0);
}

function getDifficulty(count:number):number{
    const DIFFICULTYOFFSET = 300000;
    const difficulty = (1.03 ** -count) * DIFFICULTYOFFSET;

    return difficulty;
}

function buttonB() {
    if ((5 - y) < columns[x + 1]) { // If our current y position is lower than the target column
        return;
    }
    x = Math.min(x + 1, 4);
}

if (multithreading) {
    input.onButtonPressed(Button.A, buttonA);
    input.onButtonPressed(Button.B, buttonB);
}

function block(start: number) {
    x = start;
    y = 0;
    if (columns[x] > 4) {
        return;
    }
    let pixels: number[][] = [];

    while (y < (5 - (columns[x] || 0))) {
        for (let i = 0; i < pixels.length; i++) {
            led.unplot(pixels[i][0], pixels[i][1]);
        }
        led.plotBrightness(x, y, BRIGHTNESS);
        pixels.push([x, y]);
        y++;
        control.waitMicros(current_difficulty);

        render();

        if(!multithreading){
            if (input.buttonIsPressed(Button.A)) {
                buttonA();
                continue;
            }
            if (input.buttonIsPressed(Button.B)) {
                buttonB();
                continue;
            }
        }
        
    }
    columns[x] = columns[x] + 1 || 1;
    render();
}

function render() {
    basic.clearScreen();
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < columns[x]; y++) {
            led.plotBrightness(x, 4 - y, BRIGHTNESS);
        }
    }
}

function checkLine() {
    return columns[0] > 0 &&
        columns[1] > 0 &&
        columns[2] > 0 &&
        columns[3] > 0 &&
        columns[4] > 0;
}

function clearLine() {
    for (let i = 0; i < Object.keys(columns).length; i++) {
        columns[i]--;
    }
    points++;
    render();
}

function checkDead() {
    for (let i = 0; i < Object.keys(columns).length; i++) {
        if (columns[i] > 4) {
            return true;
        }
    }
    return false;
}

while (true) {
    block(Math.randomRange(0, 4));
    if (checkLine()) {
        current_difficulty = getDifficulty(points);
        console.log(current_difficulty);
        clearLine();
    }
    if (checkDead()) {
        basic.clearScreen();
        while (true) {
            basic.showIcon(IconNames.Sad);
            control.waitMicros(300000);
            basic.showNumber(points);
            control.waitMicros(300000);
            if (input.buttonIsPressed(Button.A)) {
                columns = {};
                basic.clearScreen();
                break;
            }
        }
    }
}