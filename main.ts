let columns: {[key:number]: number} = {};
let points = 0;
let modifier = 0.3;

function block(x:number){
    if(columns[x] > 4){
        return;
    }
    let y:number = 0;
    let pixels:number[][] = [];
    input.onButtonPressed(Button.A, () => { 
        if((4-y) < columns[x-1]){ // If our current y position is lower than the target column
            return;
        }
        x = Math.max(x-1, 0); 
    });
    input.onButtonPressed(Button.B, ()=> { 
        if ((4 - y) < columns[x + 1]) { // If our current y position is lower than the target column
            return;
        }
        x = Math.min(x+1, 4); 
    });
    while(y < (5-(columns[x] || 0))){
        for(let i = 0; i < pixels.length; i++){
            led.unplot(pixels[i][0], pixels[i][1]);
        }
        led.plot(x, y);
        pixels.push([x,y]);
        y++;
        control.waitMicros(300000/
        Math.max(((points+1) * modifier), 1));
    }
    columns[x] = columns[x]+1 || 1;
    render();
}

function render(){
    basic.clearScreen();
    for(let x = 0; x < 5; x++){
        for(let y = 0; y < columns[x]; y++){
            led.plot(x, 4-y);
        }
    }
}

function checkLine(){
    return columns[0] > 0 &&
        columns[1] > 0 &&
        columns[2] > 0 &&
        columns[3] > 0 &&
        columns[4] > 0;
}

function clearLine(){
    for (let i = 0; i < Object.keys(columns).length; i++){
        columns[i]--;
    }
    points++;
    render();
}

function checkDead(){
    for (let i = 0; i < Object.keys(columns).length; i++){
        if(columns[i] > 4){
            return true;
        }
    }
    return false;
}

basic.forever(() => {
    block(Math.randomRange(0, 4));
    if (checkLine()){
        clearLine();
    }
    if(checkDead()){
        basic.clearScreen();
        while(true){
            basic.showIcon(IconNames.Sad);
            control.waitMicros(300000);
            basic.showNumber(points);
            control.waitMicros(300000);
            if(input.buttonIsPressed(Button.A)){
                columns = {};
                basic.clearScreen();
                break;
            }
        }
    }
});