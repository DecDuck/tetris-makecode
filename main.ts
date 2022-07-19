function flashLine(y: number) {
    wait = 70000
    for (let j = 0; j <= 4; j++) {
        led.plotBrightness(j, y, BRIGHTNESS)
    }
    control.waitMicros(wait)
    for (let k = 0; k <= 4; k++) {
        led.unplot(k, y)
    }
    control.waitMicros(wait)
}
function checkLine() {
    return columns[0] > 0 && columns[1] > 0 && columns[2] > 0 && columns[3] > 0 && columns[4] > 0
}
function clearLine() {
    for (let index = 0; index < 2; index++) {
        flashLine(4)
    }
    for (let m = 0; m <= Object.keys(columns).length - 1; m++) {
        columns[m]--;
    }
    points += 1
    render()
}
function buttonB() {
    if (5 - y < columns[x + 1]) {
        // If our current y position is lower than the target column
        return
    }
    x = Math.min(x + 1, 4)
}
function wait_with_input(length: number) {
    stepSize = 5000
    while (waited < length) {
        control.waitMicros(stepSize)
        waited += stepSize
        if (!(locked)) {
            if (input.buttonIsPressed(Button.A)) {
                buttonA()
                locked = true
            }
            if (input.buttonIsPressed(Button.B)) {
                buttonB()
                locked = true
            }
        } else {
            if (!(input.buttonIsPressed(Button.A)) && !(input.buttonIsPressed(Button.B))) {
                locked = false
            }
        }
    }
}
function getDifficulty(count: number) {
    DIFFICULTYOFFSET = 300000
    difficulty = 1.03 ** (0 - count) * DIFFICULTYOFFSET
    return difficulty
}
function block() {
    if (columns[x] > 4) {
        return
    }
    if (y < 5 - 0) {
        let pixels: number[][] = []
        for (let i = 0; i <= pixels.length - 1; i++) {
            led.unplot(pixels[i][0], pixels[i][1])
        }
        led.plotBrightness(x, y, BRIGHTNESS)
        pixels.push([x, y])
        y += 1
        if (true) {
            // !multithreading) {
            wait_with_input(current_difficulty)
        } else {
            control.waitMicros(current_difficulty)
        }
        render()
    } else {
        columns[x] = columns[x] + 1 || 1
        render()
        x = Math.randomRange(0, 4)
        y = 0
    }
}
function buttonA() {
    if (5 - y < columns[x - 1]) {
        // If our current y position is lower than the target column
        return
    }
    x = Math.max(x - 1, 0)
}
function checkDead() {
    for (let n = 0; n <= Object.keys(columns).length - 1; n++) {
        if (columns[n] > 4) {
            return true
        }
    }
    return false
}
function render() {
    basic.clearScreen()
    for (let x2 = 0; x2 <= 4; x2++) {
        for (let y2 = 0; y2 <= columns[x2] - 1; y2++) {
            led.plotBrightness(x2, 4 - y2, BRIGHTNESS)
        }
    }
}
let difficulty = 0
let DIFFICULTYOFFSET = 0
let locked = false
let waited = 0
let stepSize = 0
let y = 0
let wait = 0
let points = 0
let current_difficulty = 0
let BRIGHTNESS = 0
let x = 0
let columns: { [key: number]: number } = {};
x = Math.randomRange(0, 4)
let multithreading = parseInt(control.hardwareVersion()) == 2
BRIGHTNESS = 50
current_difficulty = getDifficulty(points)
let MAX_DIFFICULTY = getDifficulty(0)
let speed = 0.85
if (false) {
    input.onButtonPressed(Button.A, buttonA);
    input.onButtonPressed(Button.B, buttonB);
}
basic.forever(function () {
    block()
    if (checkLine()) {
        current_difficulty = getDifficulty(points)
        clearLine()
    }
    if (checkDead()) {
        basic.clearScreen()
        while (true) {
            basic.showIcon(IconNames.Sad)
            control.waitMicros(300000)
            basic.showNumber(points)
            control.waitMicros(300000)
            if (input.buttonIsPressed(Button.A)) {
                columns = {};
                points = 0
                basic.clearScreen()
                break;
            }
        }
    }
})
