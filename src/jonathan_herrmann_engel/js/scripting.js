"use strict";

/******************************************
*             helper functions            *
******************************************/

function extendedMeasureViewspace() {
    client.isSmall = measureViewspace(1).isSmallDevice;
    client.devicePixelRatio = window.devicePixelRatio;
    client.width = window.innerWidth;
    client.height = window.innerHeight;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    canvas.width = window.innerWidth * client.devicePixelRatio;
    canvas.height = window.innerHeight * client.devicePixelRatio;
}

function drawImage(pic,x,y,width,height){
    context.drawImage(pic,Math.floor(x)+0.5,Math.floor(y)+0.5,Math.floor(width)+0.5,Math.floor(height)+0.5);
}

function measureFontSize(t,f,a,b,c, d, r){
    context.save();
    var font = (a) + "px " + f;
    context.font = font;
    var twidth = context.measureText(t).width;
    context.restore();
    if(twidth != b && (Math.abs(twidth-b) > d && r < 100)){
        a *= (twidth > b) ? (1-c/100) : (1+c/100);
        return measureFontSize(t,f,a,b,c,d, ++r);
    } else {
        return font;
    }
}

function getFontSize(f, a){
    return parseInt(f.substr(0,f.length-(f.length-f.indexOf(a))), 10);
}                               

/******************************************
*        mouse touch key functions        *
******************************************/

function onMouseMove(event) {
    hardware.mouse.moveX = event.pageX*client.devicePixelRatio;
    hardware.mouse.moveY = event.pageY*client.devicePixelRatio;
    hardware.mouse.cursor = "default";   
    hardware.mouse.isMoving = true;
    if(typeof movingTimeOut !== "undefined"){
        clearTimeout(movingTimeOut);
    }
    movingTimeOut = setTimeout(function(){hardware.mouse.isMoving = false;}, 5000);
}
function onMouseDown(event) {
    hardware.lastInputMouse = hardware.mouse.downTime = Date.now(); 
    hardware.mouse.moveX =  hardware.mouse.downX = event.pageX*client.devicePixelRatio;
    hardware.mouse.moveY = hardware.mouse.downY = event.pageY*client.devicePixelRatio; 
    hardware.mouse.isHold = true;    
}
function onMouseUp(event) {
    hardware.mouse.upX = event.pageX*client.devicePixelRatio;
    hardware.mouse.upY = event.pageY*client.devicePixelRatio;
    hardware.mouse.upTime = Date.now(); 
    hardware.mouse.isHold = false;    
}
function onMouseOut(event) {
    hardware.mouse.isHold = false; 
    hardware.mouse.cursor = "none";
}
function onMouseWheel(event) {
    hardware.mouse.wheelScrolls = true; 
    hardware.mouse.isHold = false; 
    hardware.mouse.wheelX = event.pageX*client.devicePixelRatio;
    hardware.mouse.wheelY = event.pageY*client.devicePixelRatio;
    hardware.mouse.wheelScrollX = event.deltaX;
    hardware.mouse.wheelScrollY = event.deltaY;
    hardware.mouse.wheelScrollZ = event.deltaZ;
}

function getTouchMove(event) {
    hardware.mouse.moveX = event.changedTouches[0].clientX*client.devicePixelRatio;
    hardware.mouse.moveY = event.changedTouches[0].clientY*client.devicePixelRatio;
    hardware.mouse.isMoving = true;
    if(typeof movingTimeOut !== "undefined"){
        clearTimeout(movingTimeOut);
    }
    movingTimeOut = setTimeout(function(){hardware.mouse.isMoving = false;}, 5000);
}
function getTouchStart(event) {
    hardware.lastInputTouch = hardware.mouse.downTime = Date.now(); 
    hardware.mouse.moveX = hardware.mouse.downX = event.changedTouches[0].clientX*client.devicePixelRatio;
    hardware.mouse.moveY = hardware.mouse.downY = event.changedTouches[0].clientY*client.devicePixelRatio; 
    hardware.mouse.isHold = true;
}
function getTouchEnd(event) {   
    hardware.mouse.upX = event.changedTouches[0].clientX*client.devicePixelRatio;
    hardware.mouse.upY = event.changedTouches[0].clientY*client.devicePixelRatio;
    hardware.mouse.upTime = Date.now(); 
    hardware.mouse.isHold = false; 
}
function getTouchLeave(event) {
    hardware.mouse.isHold = false; 
}

function onKeyDown(event) {
    if ((event.key == "ArrowUp" && (konamistate === 0 || konamistate == 1)) || (event.key == "ArrowDown" && (konamistate == 2 || konamistate == 3)) || (event.key == "ArrowLeft" && (konamistate == 4 || konamistate == 6)) || (event.key == "ArrowRight" && (konamistate == 5 || konamistate == 7)) || (event.key == "b" && konamistate == 8)){ 
        if(typeof konamiTimeOut !== "undefined"){
            clearTimeout(konamiTimeOut);
        }
        konamistate +=1;
        konamiTimeOut = setTimeout(function(){konamistate = 0;}, 1000);
    } else if (event.key == "a" && konamistate == 9){
        if(typeof konamiTimeOut !== "undefined"){
            clearTimeout(konamiTimeOut);
        }
        konamistate = -1;
    } else {
        if(typeof konamiTimeOut !== "undefined"){
            clearTimeout(konamiTimeOut);
        }
        konamistate = (konamistate < 0 && konamistate > -2) ? --konamistate : 0;
    }
}

/******************************************
* Animation functions for load and resize *
******************************************/
    
function placeBackground() {
    if (canvas.width / canvas.height < pics[background.src].width / pics[background.src].height) {
        background.width = canvas.width;
        background.height = pics[background.src].height * (canvas.width / pics[background.src].width);
        background.x = 0;
        background.y = canvas.height / 2 - background.height / 2;
    } else {
        background.width = pics[background.src].width * (canvas.height / pics[background.src].height);
        background.height = canvas.height;
        background.x = canvas.width / 2 - background.width / 2;
        background.y = 0;
    }
    client.x = background.x / client.devicePixelRatio;
    client.y = background.y / client.devicePixelRatio;
}
    
function defineTrainParams(){
    
    function getBezierLength(bezierPoints,repNo){
        var x = [];
        var y = [];
        var dis = 0;
        for(var i = 0; i <= repNo; i++){
            x[i] = getBezierPoints(i/repNo,bezierPoints.x[0],bezierPoints.x[1],bezierPoints.x[2],bezierPoints.x[3]);
            y[i] = getBezierPoints(i/repNo,bezierPoints.y[0],bezierPoints.y[1],bezierPoints.y[2],bezierPoints.y[3]);
            if(i > 0) {
                dis += Math.sqrt(Math.pow(Math.abs(x[i-1]-x[i]),2)+Math.pow(Math.abs(Math.abs(y[i-1]-y[i]),2),2));
            }
        }
        return dis;
    }
   
    function getBezierPoints(fac, a,b,c,d) {
          return Math.pow((1-fac),3)*a+3*fac*Math.pow((1-fac),2)*b+3*Math.pow((fac),2)*(1-fac)*c+Math.pow(fac,3)*d;
    }
    
    /////Rotation Points/////
    var circles = [];
    var bezierPoints;   
    
    //INNER/NARROW
    rotationPoints.inner.narrow.x[0] = 0.17 * background.width; 
    rotationPoints.inner.narrow.x[1] = 0.75 * background.width;
    rotationPoints.inner.narrow.x[2] = 0.78 * background.width;
    rotationPoints.inner.narrow.x[3] = 0.16 * background.width;
    rotationPoints.inner.narrow.x[4] = 0.952 * background.width;
    rotationPoints.inner.narrow.x[5] = 0.962 * background.width;
    rotationPoints.inner.narrow.x[6] = 0.0024 * background.width;
    rotationPoints.inner.narrow.x[7] = -0.025 * background.width;
    rotationPoints.inner.narrow.y[0] = 0.126 * background.height;
    rotationPoints.inner.narrow.y[1] = 0.145 * background.height;
    rotationPoints.inner.narrow.y[2] = 0.823 * background.height;
    rotationPoints.inner.narrow.y[3] = 0.817 * background.height;
    rotationPoints.inner.narrow.y[4] = 0.124 * background.height;
    rotationPoints.inner.narrow.y[5] = 0.856 * background.height;
    rotationPoints.inner.narrow.y[6] = 0.82 * background.height;
    rotationPoints.inner.narrow.y[7] = 0.16 * background.height;
    circles[0] = rotationPoints.inner.narrow;

    //INNER/WIDE
    rotationPoints.inner.wide.x[0] = 0.17 * background.width; 
    rotationPoints.inner.wide.x[1] = 0.749 * background.width;
    rotationPoints.inner.wide.x[2] = rotationPoints.inner.narrow.x[2];
    rotationPoints.inner.wide.x[3] = rotationPoints.inner.narrow.x[3];
    rotationPoints.inner.wide.x[4] = 0.94 * background.width;
    rotationPoints.inner.wide.x[5] = 0.97 * background.width;
    rotationPoints.inner.wide.x[6] = 0.0013 * background.width;
    rotationPoints.inner.wide.x[7] = -0.024 * background.width;
    rotationPoints.inner.wide.y[0] = 0.0826 * background.height;
    rotationPoints.inner.wide.y[1] = 0.1 * background.height;
    rotationPoints.inner.wide.y[2] = rotationPoints.inner.narrow.y[2];
    rotationPoints.inner.wide.y[3] = rotationPoints.inner.narrow.y[3];
    rotationPoints.inner.wide.y[4] = 0.082 * background.height;
    rotationPoints.inner.wide.y[5] = 0.847 * background.height;
    rotationPoints.inner.wide.y[6] = 0.822 * background.height;
    rotationPoints.inner.wide.y[7] = 0.13 * background.height;
    circles[1] = rotationPoints.inner.wide;
    switches.innerWide.left.x = 0.044 * background.width;
    switches.innerWide.left.y =  0.34 * background.height;
    switches.innerWide.right.x = 0.9 * background.width;
    switches.innerWide.right.y =  0.356 * background.height;    
    
    //OUTER/NARROW
    rotationPoints.outer.narrow.x[0] = rotationPoints.outer.narrow.x[3] = 0.17 * background.width;
    rotationPoints.outer.narrow.x[1] = 0.77 * background.width;
    rotationPoints.outer.narrow.x[2] = 0.795 * background.width;
    rotationPoints.outer.narrow.x[4] = 0.98 * background.width;
    rotationPoints.outer.narrow.x[5] = 0.985 * background.width;
    rotationPoints.outer.narrow.y[0] = 0.013 * background.height;
    rotationPoints.outer.narrow.y[1] = 0.017 * background.height;
    rotationPoints.outer.narrow.y[2] = 0.893 * background.height;
    rotationPoints.outer.narrow.y[3] = 0.882 * background.height;
    rotationPoints.outer.narrow.y[4] = 0.001 * background.height;
    rotationPoints.outer.narrow.y[5] = 0.908 * background.height;
    circles[2] = rotationPoints.outer.narrow;
    
    var repNo = 1000;
    for (var i = 0; i < circles.length; i++) {
        circles[i].bezierLength = {};
        if(circles[i].x[4] !== undefined && circles[i].x[5] !== undefined) {
            bezierPoints = {x:[circles[i].x[1],circles[i].x[4],circles[i].x[5],circles[i].x[2]], y:[circles[i].y[1],circles[i].y[4],circles[i].y[5],circles[i].y[2]]};
            circles[i].bezierLength.right = getBezierLength(bezierPoints,repNo);
        }
        if(circles[i].x[6] !== undefined && circles[i].x[7] !== undefined) {
            bezierPoints = {x:[circles[i].x[3],circles[i].x[6],circles[i].x[7],circles[i].x[0]], y:[circles[i].y[3],circles[i].y[6],circles[i].y[7],circles[i].y[0]]};
            circles[i].bezierLength.left = getBezierLength(bezierPoints,repNo);
        }
    }
    
  /*------------------------------------------------------------------------------------------------------------------*
   *  0---------------------------------------------------------1                                                     *
   *  -      ___       ___                                      -                                                     *
   *  -     |   \      |   \   ________  _____   _______        -        0-3: required                                *
   *  7    |    \     |    \   | __   |  ||__|  | __   |        4        4-7: optional                                *
   *  -   |  / \ \   |  / \ \  | |__| |  ||\    | |__| |        -                                                     *
   *  6  |  /   \ \ |  /   \ \ |______|  ||\\   |______|        5        Ohne optionale Punkte gilt:                  *
   *  -  ______________________________________________         -                   x0 = x3 bzw. x1 = x2              *
   *  -  _______________________________________________        -                                                     *
   *  3---------------------------------------------------------2                                                     *
   *------------------------------------------------------------------------------------------------------------------*/ 
   
   
    //INNER2OUTER/LEFT

    rotationPoints.inner2outer.left.x[1] = -0.039 * background.width;
    rotationPoints.inner2outer.left.x[2] = -0.038 * background.width;
    rotationPoints.inner2outer.left.y[1] = 0.83 * background.height;
    rotationPoints.inner2outer.left.y[2] = 0.03 * background.height;
    bezierPoints = {x:[rotationPoints.inner.narrow.x[3],rotationPoints.inner2outer.left.x[1],rotationPoints.inner2outer.left.x[2],rotationPoints.outer.narrow.x[0]], y:[rotationPoints.inner.narrow.y[3],rotationPoints.inner2outer.left.y[1],rotationPoints.inner2outer.left.y[2],rotationPoints.outer.narrow.y[0]]};
    rotationPoints.inner2outer.left.bezierLength = getBezierLength(bezierPoints,repNo);
    switches.inner2outer.left.x = 0.087 * background.width;
    switches.inner2outer.left.y = 0.77 * background.height;
    switches.outer2inner.left.x = 0.011 * background.width;
    switches.outer2inner.left.y = 0.465 * background.height;
    
    //INNER2OUTER/RIGHT
    rotationPoints.inner2outer.right.x[1] = 0.98 * background.width;
    rotationPoints.inner2outer.right.x[2] = 0.986 * background.width;
    rotationPoints.inner2outer.right.y[1] = 0.015 * background.height;
    rotationPoints.inner2outer.right.y[2] = 0.858 * background.height;
    bezierPoints = {x:[rotationPoints.outer.narrow.x[1],rotationPoints.inner2outer.right.x[1],rotationPoints.inner2outer.right.x[2],rotationPoints.inner.narrow.x[2]], y:[rotationPoints.outer.narrow.y[1],rotationPoints.inner2outer.right.y[1],rotationPoints.inner2outer.right.y[2],rotationPoints.inner.narrow.y[2]]};
    rotationPoints.inner2outer.right.bezierLength = getBezierLength(bezierPoints,repNo);
    switches.inner2outer.right.x = 0.85 * background.width;
    switches.inner2outer.right.y = 0.786 * background.height;    
    switches.outer2inner.right.x = 0.934 * background.width;
    switches.outer2inner.right.y = 0.505 * background.height; 
    
  /*------------------------------------------------------------------------------------------------------------------*
   *  left--------------------------------------------------right                                                     *
   *  -      ___       ___                                      -                                                     *
   *  -     |   \      |   \   ________  _____   _______        -                                                     *
   *  2    |    \     |    \   | __   |  ||__|  | __   |        1        1-2: required                                *
   *  -   |  / \ \   |  / \ \  | |__| |  ||\    | |__| |        -                                                     *
   *  1  |  /   \ \ |  /   \ \ |______|  ||\\   |______|        2                                                     *
   *  -  ______________________________________________         -                                                     *
   *  -  _______________________________________________        -                                                     *
   *  -----------------------------------------------------------                                                     *
   *------------------------------------------------------------------------------------------------------------------*/
   
   
    //OUTER/ALTSTATE3
    switches.outerAltState3.left.x = 0.194 * background.width;
    switches.outerAltState3.left.y =  0.886 * background.height;
    switches.outerAltState3.right.x =  0.77 * background.width;
    switches.outerAltState3.right.y =  0.89 * background.height;
    
    rotationPoints.outer.altState3.right = {x: [], y: []};
    rotationPoints.outer.altState3.right.x[0] = rotationPoints.outer.narrow.x[2];
    rotationPoints.outer.altState3.right.x[1] = 0.64 * background.width;
    rotationPoints.outer.altState3.right.x[2] = rotationPoints.outer.altState3.right.x[0] - ( rotationPoints.outer.altState3.right.x[0] - rotationPoints.outer.altState3.right.x[1])/2;
    rotationPoints.outer.altState3.right.x[3] = rotationPoints.outer.altState3.right.x[0] - ( rotationPoints.outer.altState3.right.x[0] - rotationPoints.outer.altState3.right.x[1])/4;
    rotationPoints.outer.altState3.right.x[4] = rotationPoints.outer.altState3.right.x[1] + ( rotationPoints.outer.altState3.right.x[0] - rotationPoints.outer.altState3.right.x[1])/4;
    rotationPoints.outer.altState3.right.y[0] = rotationPoints.outer.narrow.y[2];
    rotationPoints.outer.altState3.right.y[1] = 0.957 * background.height;
    rotationPoints.outer.altState3.right.y[2] = rotationPoints.outer.altState3.right.y[0] + ( rotationPoints.outer.altState3.right.y[1] - rotationPoints.outer.altState3.right.y[0])/2;    
    rotationPoints.outer.altState3.right.y[3] = rotationPoints.outer.altState3.right.y[0] + ( rotationPoints.outer.altState3.right.y[1] - rotationPoints.outer.altState3.right.y[0])/8;
    rotationPoints.outer.altState3.right.y[4] = rotationPoints.outer.altState3.right.y[1] - ( rotationPoints.outer.altState3.right.y[1] - rotationPoints.outer.altState3.right.y[0])/8;
        
    rotationPoints.outer.altState3.left = {x: [], y: []};
    rotationPoints.outer.altState3.left.x[0] = rotationPoints.outer.narrow.x[3];
    rotationPoints.outer.altState3.left.x[1] = 0.289 * background.width;
    rotationPoints.outer.altState3.left.x[2] = rotationPoints.outer.altState3.left.x[0] + (  rotationPoints.outer.altState3.left.x[1] - rotationPoints.outer.altState3.left.x[0] )/2;
    rotationPoints.outer.altState3.left.x[3] = rotationPoints.outer.altState3.left.x[0] + ( rotationPoints.outer.altState3.left.x[1] -  rotationPoints.outer.altState3.left.x[0] )/4;
    rotationPoints.outer.altState3.left.x[4] = rotationPoints.outer.altState3.left.x[1] - ( rotationPoints.outer.altState3.left.x[1] -  rotationPoints.outer.altState3.left.x[0] )/4;
    rotationPoints.outer.altState3.left.y[0] = rotationPoints.outer.narrow.y[3];
    rotationPoints.outer.altState3.left.y[1] = 0.95 * background.height;
    rotationPoints.outer.altState3.left.y[2] = rotationPoints.outer.altState3.left.y[0] + ( rotationPoints.outer.altState3.left.y[1] - rotationPoints.outer.altState3.left.y[0] )/2;
    rotationPoints.outer.altState3.left.y[3] = rotationPoints.outer.altState3.left.y[0] + ( rotationPoints.outer.altState3.left.y[1] - rotationPoints.outer.altState3.left.y[0] )/8;
    rotationPoints.outer.altState3.left.y[4] = rotationPoints.outer.altState3.left.y[1] - ( rotationPoints.outer.altState3.left.y[1] - rotationPoints.outer.altState3.left.y[0] )/8;

    bezierPoints = {x:[rotationPoints.outer.altState3.right.x[0],rotationPoints.outer.altState3.right.x[3],rotationPoints.outer.altState3.right.x[3],rotationPoints.outer.altState3.right.x[2]], y:[rotationPoints.outer.altState3.right.y[0],rotationPoints.outer.altState3.right.y[3],rotationPoints.outer.altState3.right.y[3],rotationPoints.outer.altState3.right.y[2]]};
    var templenright = getBezierLength(bezierPoints,100);
    bezierPoints = {x:[rotationPoints.outer.altState3.right.x[2],rotationPoints.outer.altState3.right.x[4],rotationPoints.outer.altState3.right.x[4],rotationPoints.outer.altState3.right.x[1]], y:[rotationPoints.outer.altState3.right.y[2],rotationPoints.outer.altState3.right.y[4],rotationPoints.outer.altState3.right.y[4],rotationPoints.outer.altState3.right.y[1]]};
    rotationPoints.outer.altState3.right.bezierLength = templenright + getBezierLength(bezierPoints,100);    
    
    bezierPoints = {x:[rotationPoints.outer.altState3.left.x[0],rotationPoints.outer.altState3.left.x[3],rotationPoints.outer.altState3.left.x[3],rotationPoints.outer.altState3.left.x[2]], y:[rotationPoints.outer.altState3.left.y[0],rotationPoints.outer.altState3.left.y[3],rotationPoints.outer.altState3.left.y[3],rotationPoints.outer.altState3.left.y[2]]};
    var templenleft = getBezierLength(bezierPoints,100);
    bezierPoints = {x:[rotationPoints.outer.altState3.left.x[2],rotationPoints.outer.altState3.left.x[4],rotationPoints.outer.altState3.left.x[4],rotationPoints.outer.altState3.left.x[1]], y:[rotationPoints.outer.altState3.left.y[2],rotationPoints.outer.altState3.left.y[4],rotationPoints.outer.altState3.left.y[4],rotationPoints.outer.altState3.left.y[1]]};
    rotationPoints.outer.altState3.left.bezierLength = templenleft + getBezierLength(bezierPoints,100);

    
  /*------------------------------------------------------------------------------------------------------------------*
   *  -----------------------------------------------------------                                                     *
   *  -      ___       ___                                      -                                                     *
   *  -     |   \      |   \   ________  _____   _______        -                                                     *
   *  -    |    \     |    \   | __   |  ||__|  | __   |        -        0-1: required                                *
   *  -   |  / \ \   |  / \ \  | |__| |  ||\    | |__| |        -                                                     *
   *  -  |  /   \ \ |  /   \ \ |______|  ||\\   |______|        -                                                     *
   *  -  ______________________________________________         -                                                     *
   *  - 3_3__4_4________________________________________4 4 3 3 -                                                     *
   *  0----2----1-------------------------------------1----2----0                                                     *
   *------------------------------------------------------------------------------------------------------------------*/
   
      
 
    /////SPEED/////
    trains.forEach(function(train){
        train.speed = train.speedFac*background.width;
    });
    
}

function placeClassicUIElements(){
    var fac = 0.04;
    classicUI.trainSwitch.width = fac * (background.width);
    classicUI.trainSwitch.height = fac * (pics[classicUI.trainSwitch.src].height * (background.width / pics[classicUI.trainSwitch.src].width));
    fac = 0.07;
    classicUI.transformer.width = fac * (background.width);
    classicUI.transformer.height = fac * (pics[classicUI.transformer.src].height * (background.width / pics[classicUI.transformer.src].width));
    fac = 0.7;
    classicUI.transformer.input.width = classicUI.transformer.input.height = fac * classicUI.transformer.width;
    fac = 0.17;
    classicUI.transformer.directionInput.width = fac * classicUI.transformer.width;
    classicUI.transformer.directionInput.height = fac * (pics[classicUI.transformer.directionInput.src].height * ( classicUI.transformer.width/ pics[classicUI.transformer.directionInput.src].width));
    
    classicUI.trainSwitch.x = background.x + background.width / 30;
    classicUI.trainSwitch.y = background.y + background.height/1.2;
    classicUI.transformer.x = background.x + background.width / 1.1;
    classicUI.transformer.y = background.y + background.height/1.4;
    classicUI.transformer.input.diffY = classicUI.transformer.height/6;
    classicUI.transformer.directionInput.diffX = classicUI.transformer.width*0.46-classicUI.transformer.directionInput.width;
    classicUI.transformer.directionInput.diffY = classicUI.transformer.height*0.46-classicUI.transformer.directionInput.height;
    
    var cwidth =  background.width*0.07;
     context.textBaseline = "middle";
    var longestName = 0;
    for (var i = 1; i < trains.length; i++){
        if (getString(["appScreenTrainNames",i]).length > getString(["appScreenTrainNames",i-1]).length){
            longestName = i;
        }
    }
    classicUI.trainSwitch.selectedTrainDisplay.font = measureFontSize(getString(["appScreenTrainNames",longestName]),"sans-serif",background.height*cwidth/background.width,cwidth, 5, background.height/100,0);
    context.font = classicUI.trainSwitch.selectedTrainDisplay.font;
    classicUI.trainSwitch.selectedTrainDisplay.width = 1.2*context.measureText(getString(["appScreenTrainNames",longestName])).width;
    classicUI.trainSwitch.selectedTrainDisplay.height = 1.6*getFontSize(classicUI.trainSwitch.selectedTrainDisplay.font, "px");
    classicUI.switches.radius = 0.02*background.width;
}

/******************************************
             animate  functions
******************************************/

function animateObjects() {
    
    function animateTrains(input1){
      
        function animateTrain(i) {
            function changeCOSection(cO,isFront){
                if(trains[input1].standardDirection){ // Switch sections
                    if (cO.state == 1 && Math.round(cO.x - background.x) >= Math.round(trains[input1].circle.x[1])) {
                        if(classicUI.switches.display && isFront && i == -1 && trains[input1].circleFamily == rotationPoints.outer && switches.outer2inner.right.turned){
                            trains[input1].switchCircles = true;
                        }  
                        if(trains[input1].switchCircles){
                            cO.x = background.x + Math.round(rotationPoints.outer.narrow.x[1]);
                            cO.y = background.y + Math.round(rotationPoints.outer.narrow.y[1]);
                            cO.state = -2; 
                            cO.angle = 0;
                            cO.currentCurveFac = 0;
                            if(isFront && i == -1) {
                                trains[input1].circle = copyJSObject(trains[input1].circle);
                                trains[input1].circle.x[2] = rotationPoints.inner.narrow.x[2];
                                trains[input1].circle.y[2] = rotationPoints.inner.narrow.y[2];
                                trains[input1].circle.x[3] = rotationPoints.inner.narrow.x[3];
                                trains[input1].circle.y[3] = rotationPoints.inner.narrow.y[3];
                                trains[input1].circle.x[4] = rotationPoints.inner2outer.right.x[1];
                                trains[input1].circle.y[4] = rotationPoints.inner2outer.right.y[1];
                                trains[input1].circle.x[5] = rotationPoints.inner2outer.right.x[2];
                                trains[input1].circle.y[5] = rotationPoints.inner2outer.right.y[2];
                                trains[input1].circleFamily = null;
                            }
                          } else {
                                cO.x = background.x + Math.round(trains[input1].circle.x[1]);
                                cO.y = background.y + Math.round(trains[input1].circle.y[1]);
                                cO.state++;
                                cO.angle = 0; 
                                cO.currentCurveFac = 0;
                          }
                    } else if (Math.abs(cO.state) == 2 && Math.round(cO.x - background.x) <= Math.round(trains[input1].circle.x[2]) && cO.y - background.y > trains[input1].circle.y[1]+(trains[input1].circle.y[2]-trains[input1].circle.y[1])/2) {
                        if(cO.state == -2 && !isFront && i == trains[input1].cars.length-1) {
                            trains[input1].circle = rotationPoints.inner.narrow;
                            trains[input1].circleFamily = rotationPoints.inner;
                            trains[input1].switchCircles = false;
                        }
                        cO.x = background.x + Math.round(trains[input1].circle.x[2]);
                        cO.y = background.y + Math.round(trains[input1].circle.y[2]);
                        cO.currentCurveFac=0;
                        cO.state = ((trains[input1].circleFamily == rotationPoints.outer && switches.outerAltState3.right.turned && isFront && i == -1) || trains[input1].front.state == -3) ? -3 : 3;
                    } else if (Math.abs(cO.state) == 3 && Math.round(cO.x - background.x) <= Math.round(trains[input1].circle.x[3])) {
                        if(classicUI.switches.display && isFront && i == -1 && trains[input1].circleFamily == rotationPoints.inner && switches.inner2outer.left.turned){
                            trains[input1].switchCircles = true;
                        } else if (classicUI.switches.display && isFront && i == -1 && trains[input1].circleFamily == rotationPoints.inner && switches.innerWide.left.turned) {
                          trains[input1].circle = rotationPoints.inner.wide;
                        } else if (classicUI.switches.display && isFront && i == -1 && trains[input1].circleFamily == rotationPoints.inner) {
                          trains[input1].circle = rotationPoints.inner.narrow;  
                        }
                        if(trains[input1].switchCircles){
                            cO.x = background.x + Math.round(rotationPoints.inner.narrow.x[3]);
                            cO.y = background.y + Math.round(rotationPoints.inner.narrow.y[3]);
                            cO.state = -4; 
                            cO.angle = Math.PI;
                            cO.currentCurveFac = 0;
                            if(isFront && i == -1) {
                                trains[input1].circle = copyJSObject(trains[input1].circle);
                                trains[input1].circle.x[0] = rotationPoints.outer.narrow.x[0];
                                trains[input1].circle.y[0] = rotationPoints.outer.narrow.y[0];
                                trains[input1].circle.x[1] = rotationPoints.outer.narrow.x[1];
                                trains[input1].circle.y[1] = rotationPoints.outer.narrow.y[1];
                                trains[input1].circle.x[6] = rotationPoints.inner2outer.left.x[1];
                                trains[input1].circle.y[6] = rotationPoints.inner2outer.left.y[1];
                                trains[input1].circle.x[7] = rotationPoints.inner2outer.left.x[2];
                                trains[input1].circle.y[7] = rotationPoints.inner2outer.left.y[2];
                                trains[input1].circleFamily = null;
                            }
                        } else {
                            cO.x = background.x + Math.round(trains[input1].circle.x[3]);
                            cO.y = background.y + Math.round(trains[input1].circle.y[3]);
                            cO.state=4;
                            cO.angle = Math.PI;
                            cO.currentCurveFac = 0;
                        }
                    } else if (Math.abs(cO.state) == 4 && Math.round(cO.x - background.x) >= Math.round(trains[input1].circle.x[0]) && cO.y - background.y < trains[input1].circle.y[0]+(trains[input1].circle.y[3]-trains[input1].circle.y[0])/2) {
                        if(cO.state == -4 && !isFront && i == trains[input1].cars.length-1) {
                            trains[input1].circle = rotationPoints.outer.narrow;
                            trains[input1].circleFamily = rotationPoints.outer;
                            trains[input1].switchCircles = false;
                        }
                        cO.x = background.x + Math.round(trains[input1].circle.x[0]);
                        cO.y = background.y + Math.round(trains[input1].circle.y[0]);
                        cO.state = 1;            
                    }
                } else {
                    if (cO.state == 1 && Math.round(cO.x - background.x) <= Math.round(trains[input1].circle.x[0])) {
                        if(classicUI.switches.display && !isFront && i == trains[input1].cars.length-1 && trains[input1].circleFamily == rotationPoints.outer && switches.outer2inner.left.turned){
                            trains[input1].switchCircles = true;
                        }
                        if(trains[input1].switchCircles){
                            cO.x = background.x + Math.round(rotationPoints.outer.narrow.x[0]);
                            cO.y = background.y + Math.round(rotationPoints.outer.narrow.y[0]);
                            cO.state = -4; 
                            cO.angle = 2*Math.PI;
                            cO.currentCurveFac = 1;
                            if(!isFront && i == trains[input1].cars.length-1) {
                                trains[input1].circle = copyJSObject(trains[input1].circle);
                                trains[input1].circle.x[3] = rotationPoints.inner.narrow.x[3];
                                trains[input1].circle.y[3] = rotationPoints.inner.narrow.y[3];
                                trains[input1].circle.x[2] = rotationPoints.inner.narrow.x[2];
                                trains[input1].circle.y[2] = rotationPoints.inner.narrow.y[2];
                                trains[input1].circle.x[6] = rotationPoints.inner2outer.left.x[1];
                                trains[input1].circle.y[6] = rotationPoints.inner2outer.left.y[1];
                                trains[input1].circle.x[7] = rotationPoints.inner2outer.left.x[2];
                                trains[input1].circle.y[7] = rotationPoints.inner2outer.left.y[2];
                                trains[input1].circleFamily = null;
                            }
                        } else {
                                cO.x = background.x + Math.round(trains[input1].circle.x[0]);
                                cO.y = background.y + Math.round(trains[input1].circle.y[0]);
                                cO.state = 4;
                                cO.angle = 2*Math.PI; 
                                cO.currentCurveFac = 1;
                        }
                    } else if (Math.abs(cO.state) == 2 && Math.round(cO.x - background.x) <= Math.round(trains[input1].circle.x[1]) && cO.y - background.y < trains[input1].circle.y[1]+(trains[input1].circle.y[2]-trains[input1].circle.y[1])/2) {
                        if(cO.state == -2 && isFront && i == -1) {
                            trains[input1].circle = rotationPoints.outer.narrow;
                            trains[input1].circleFamily = rotationPoints.outer;
                            trains[input1].switchCircles = false;
                        }
                        cO.x = background.x + Math.round(trains[input1].circle.x[1]);
                        cO.y = background.y + Math.round(trains[input1].circle.y[1]);
                        cO.state=1;
                    } else if (Math.abs(cO.state) == 3 && Math.round(cO.x - background.x) >= Math.round(trains[input1].circle.x[2]) && Math.round(cO.y - background.y) >= background.height/2) {
                        if(classicUI.switches.display && !isFront && i == trains[input1].cars.length-1 && trains[input1].circleFamily == rotationPoints.inner && switches.inner2outer.right.turned){
                            trains[input1].switchCircles = true;
                        } else if(classicUI.switches.display && !isFront && i == trains[input1].cars.length-1 && trains[input1].circleFamily == rotationPoints.inner && switches.innerWide.right.turned){
                            trains[input1].circle = rotationPoints.inner.wide;
                        } else if(classicUI.switches.display && !isFront && i == trains[input1].cars.length-1 && trains[input1].circleFamily == rotationPoints.inner){
                            trains[input1].circle = rotationPoints.inner.narrow;
                        }
                        if(trains[input1].switchCircles){
                            cO.x = background.x + Math.round(rotationPoints.inner.narrow.x[2]);
                            cO.y = background.y + Math.round(rotationPoints.inner.narrow.y[2]);
                            cO.state = -2; 
                            cO.angle = Math.PI;
                            cO.currentCurveFac = 1;
                            if(!isFront && i == trains[input1].cars.length-1) {
                                trains[input1].circle = copyJSObject(trains[input1].circle);
                                trains[input1].circle.x[1] = rotationPoints.outer.narrow.x[1];
                                trains[input1].circle.y[1] = rotationPoints.outer.narrow.y[1];
                                trains[input1].circle.x[0] = rotationPoints.outer.narrow.x[0];
                                trains[input1].circle.y[0] = rotationPoints.outer.narrow.y[0];
                                trains[input1].circle.x[4] = rotationPoints.inner2outer.right.x[1];
                                trains[input1].circle.y[4] = rotationPoints.inner2outer.right.y[1];
                                trains[input1].circle.x[5] = rotationPoints.inner2outer.right.x[2];
                                trains[input1].circle.y[5] = rotationPoints.inner2outer.right.y[2];
                                trains[input1].circleFamily = null;
                            }
                        } else {
                            cO.x = background.x + Math.round(trains[input1].circle.x[2]);
                            cO.y = background.y + Math.round(trains[input1].circle.y[2]);
                            cO.state = 2;
                            cO.angle = Math.PI;
                            cO.currentCurveFac = 1;
                        }
                    } else if (Math.abs(cO.state) == 4 && Math.round(cO.x - background.x) >= Math.round(trains[input1].circle.x[3]) && cO.y - background.y > trains[input1].circle.y[0]+(trains[input1].circle.y[3]-trains[input1].circle.y[0])/2) {
                        if(cO.state == -4 && isFront && i == -1) {
                            trains[input1].circle = rotationPoints.inner.narrow;
                            trains[input1].circleFamily = rotationPoints.inner;
                            trains[input1].switchCircles = false;
                        }
                        cO.x = background.x + Math.round(trains[input1].circle.x[3]);
                        cO.y = background.y + Math.round(trains[input1].circle.y[3]);
                        cO.currentCurveFac=0;
                        cO.state = ((trains[input1].circleFamily == rotationPoints.outer && switches.outerAltState3.left.turned && ((trains[input1].cars.length === 0 && trains[input1].back.state == -3) || (trains[input1].cars.length === 0 && !isFront) || (trains[input1].cars.length > 0 && !isFront && i == trains[input1].cars.length-1))) || (trains[input1].cars.length > 0 && trains[input1].cars[trains[input1].cars.length-1].back.state == -3)) ? -3 : 3;

                    }
                }
            }
            
            function setCOPos(cO, isFront) {

                function setCOPosLinear(linearPoints, isBackwards, isRotated){
                    var angleCorr = isRotated? Math.PI:0;
                    var calcCorr = 1;
                    if((isRotated && !isBackwards) || (!isRotated && isBackwards)){
                      calcCorr = -1;
                    }
                    var x = cO.x;
                    var y = cO.y;
                    var angle = Math.asin((linearPoints.y[1]-linearPoints.y[0])/(linearPoints.x[1]-linearPoints.x[0]));
                    var hypotenuse = Math.sqrt(Math.pow((x) - linearPoints.x[0],2)+Math.pow((y) - linearPoints.y[0],2),2);
                    hypotenuse += speed*customSpeed;
                    x = linearPoints.x[0]+calcCorr * (Math.cos(angle)*hypotenuse);
                    y = linearPoints.y[0]+calcCorr * (Math.sin(angle)*hypotenuse);
                    angle += angleCorr;
                    cO.x = x;
                    cO.y = y;
                    cO.angle = angle;
                }
                
                function setCOPosCircle(circlePoints, isBackwards){ 
                    var backwardsCorr = isBackwards ? -1:1;
                    var radius = Math.abs(circlePoints.y[0]-circlePoints.y[1])/2;    
                    var arc = Math.abs(cO.angle)*radius;
                    arc += backwardsCorr*speed*customSpeed; 
                    cO.angle = (arc / radius);
                    var chord = 2* radius * Math.sin((cO.angle)/2);
                    var gamma = Math.PI/2-(Math.PI-(cO.angle))/2;
                    var x = Math.cos(gamma)*chord;
                    var y = Math.sin(gamma)*chord;
                    cO.x = x + circlePoints.x[0];
                    cO.y = y + circlePoints.y[0];
                }
      
                function setCOPosBezier(bezierPoints, isBackwards, length){    
                    function getBezierFac(fac, approxNO, maxDuration) {
                        var x = getBezierPoints((fac),bezierPoints.x[0],bezierPoints.x[1],bezierPoints.x[2],bezierPoints.x[3]);
                        var y = getBezierPoints((fac),bezierPoints.y[0],bezierPoints.y[1],bezierPoints.y[2],bezierPoints.y[3]);
                        var distance = (Math.sqrt(Math.pow((cO.x-x),2)+Math.pow((cO.y-y),2)));
                        var fac1 = fac * (1+1/approxNO);
                        var fac2 = fac * (1-1/approxNO);
                        var x1 = getBezierPoints((fac1),bezierPoints.x[0],bezierPoints.x[1],bezierPoints.x[2],bezierPoints.x[3]);
                        var x2 = getBezierPoints((fac2),bezierPoints.x[0],bezierPoints.x[1],bezierPoints.x[2],bezierPoints.x[3]);
                        var y1 = getBezierPoints((fac1),bezierPoints.y[0],bezierPoints.y[1],bezierPoints.y[2],bezierPoints.y[3]);
                        var y2 = getBezierPoints((fac2),bezierPoints.y[0],bezierPoints.y[1],bezierPoints.y[2],bezierPoints.y[3]);
                        var distance1 = (Math.sqrt(Math.pow((cO.x-x1),2)+Math.pow((cO.y-y1),2)));
                        var distance2 = (Math.sqrt(Math.pow((cO.x-x2),2)+Math.pow((cO.y-y2),2)));
                        var newFac = Math.abs(distance1) < Math.abs(distance2) ? fac1 : fac2;
                        var newDistance = Math.abs(distance1) < Math.abs(distance2) ? distance1 : distance2;
                        return Math.abs(distance) < Math.abs(newDistance) ? fac : (Math.abs(newDistance) < 0.1*Math.abs(bezierPoints.x[0]-bezierPoints.x[3]) || --maxDuration < 1) ? (newFac < 0 ? 0 : newFac > 1 ? 1 : newFac) : getBezierFac(newFac, approxNO, maxDuration);
                    }
                    function getBezierPoints(fac, a,b,c,d) {
                        return Math.pow((1-fac),3)*a+3*fac*Math.pow((1-fac),2)*b+3*Math.pow((fac),2)*(1-fac)*c+Math.pow(fac,3)*d;
                    }
                    function getBezierPointsDifferential(fac, a,b,c,d) {
                        return 3*Math.pow((1-fac),2)*(b-a)+6*fac*(1-fac)*(c-b)+3*Math.pow(fac,2)*(d-c);
                    }
                    function getBezierAngle(fac,a,b) { 
                        var dxdt = getBezierPointsDifferential(fac, a[0],a[1],a[2],a[3]);
                        var dydt = getBezierPointsDifferential(fac, b[0],b[1],b[2],b[3]);
                        return Math.atan2(dydt ,dxdt);
                    }
                    var backwardsCorr = isBackwards? -1 :1;
                    var fac = i < 0 && isFront ? cO.currentCurveFac : getBezierFac(cO.currentCurveFac, 100, 100); 
                    cO.currentCurveFac = fac + backwardsCorr*((speed*customSpeed)/length);                    
                    cO.x = getBezierPoints((cO.currentCurveFac),bezierPoints.x[0],bezierPoints.x[1],bezierPoints.x[2],bezierPoints.x[3]);
                    cO.y = getBezierPoints((cO.currentCurveFac),bezierPoints.y[0],bezierPoints.y[1],bezierPoints.y[2],bezierPoints.y[3]);        
                    cO.angle = getBezierAngle((cO.currentCurveFac),bezierPoints.x,bezierPoints.y);
                    if(debug) {
                        context.save(); 
                        context.strokeStyle="floralWhite";
                        context.beginPath();
                        context.moveTo(bezierPoints.x[0], bezierPoints.y[0] );
                        context.bezierCurveTo(bezierPoints.x[1], bezierPoints.y[1],bezierPoints.x[2], bezierPoints.y[2],bezierPoints.x[3], bezierPoints.y[3]);
                        context.stroke();
                        context.closePath();
                        context.restore();
                    }
                }
                var points;    
                if(cO.state == 1){ // Calc bogie position
                    points = {x:[trains[input1].circle.x[0] + background.x,trains[input1].circle.x[1] + background.x],y:[trains[input1].circle.y[0] + background.y,trains[input1].circle.y[1] + background.y]};
                    if(!trains[input1].standardDirection){points.x.reverse();points.y.reverse();}
                    setCOPosLinear(points, !trains[input1].standardDirection, false) ;
                } else if(Math.abs(cO.state) == 2)  { 
                    if(typeof trains[input1].circle.x[4] == "undefined" || typeof trains[input1].circle.x[5] == "undefined" || typeof trains[input1].circle.y[4] == "undefined" || typeof trains[input1].circle.y[5] == "undefined"){
                        points ={x:[trains[input1].circle.x[1]+background.x],y:[trains[input1].circle.y[1]+background.y,trains[input1].circle.y[2]+background.y]};
                        setCOPosCircle(points, !trains[input1].standardDirection);
                    } else { 
                        points ={x:[trains[input1].circle.x[1] + background.x,trains[input1].circle.x[4] + background.x,trains[input1].circle.x[5] + background.x,trains[input1].circle.x[2] + background.x],y:[trains[input1].circle.y[1] + background.y,trains[input1].circle.y[4] + background.y,trains[input1].circle.y[5] + background.y,trains[input1].circle.y[2] + background.y]};
                        setCOPosBezier(points, !trains[input1].standardDirection, cO.state == -2 ? rotationPoints.inner2outer.right.bezierLength : trains[input1].circle.bezierLength.right);
                    }
                } else if (cO.state == 3) {
                    points =  {x:[trains[input1].circle.x[2] + background.x,trains[input1].circle.x[3] + background.x],y:[trains[input1].circle.y[2] + background.y,trains[input1].circle.y[3] + background.y]};
                    if(!trains[input1].standardDirection){points.x.reverse();points.y.reverse();}
                    setCOPosLinear(points,!trains[input1].standardDirection, true, false);
                } else if (cO.state == -3) {
                    if(trains[input1].circleFamily == rotationPoints.outer) {
                        if(cO.x > rotationPoints.outer.altState3.right.x[1]+background.x) {
                            if(cO.x-background.x > rotationPoints.outer.altState3.right.x[2]){
                                points ={x:[background.x+rotationPoints.outer.altState3.right.x[0],background.x+rotationPoints.outer.altState3.right.x[3],background.x+rotationPoints.outer.altState3.right.x[3],background.x+rotationPoints.outer.altState3.right.x[2]],y:[background.y+rotationPoints.outer.altState3.right.y[0],background.y+rotationPoints.outer.altState3.right.y[3],background.y+rotationPoints.outer.altState3.right.y[3],background.y+rotationPoints.outer.altState3.right.y[2]]};
                                setCOPosBezier(points, !trains[input1].standardDirection, 0.5*rotationPoints.outer.altState3.right.bezierLength);
                            } else {
                                points ={x:[background.x+rotationPoints.outer.altState3.right.x[2],background.x+rotationPoints.outer.altState3.right.x[4],background.x+rotationPoints.outer.altState3.right.x[4],background.x+rotationPoints.outer.altState3.right.x[1]],y:[background.y+rotationPoints.outer.altState3.right.y[2],background.y+rotationPoints.outer.altState3.right.y[4],background.y+rotationPoints.outer.altState3.right.y[4],background.y+rotationPoints.outer.altState3.right.y[1]]};
                                points.x.reverse();
                                points.y.reverse();
                                setCOPosBezier(points, trains[input1].standardDirection, 0.5*rotationPoints.outer.altState3.right.bezierLength);
                                cO.angle += Math.PI;
                            }
                        } else if(cO.x > rotationPoints.outer.altState3.left.x[1]+background.x) {
                            points =  {x:[rotationPoints.outer.altState3.right.x[1] + background.x, rotationPoints.outer.altState3.left.x[1] + background.x],y:[rotationPoints.outer.altState3.right.y[1] + background.y,rotationPoints.outer.altState3.left.y[1] + background.y]};
                            if(!trains[input1].standardDirection){points.x.reverse();points.y.reverse();}
                            setCOPosLinear(points,!trains[input1].standardDirection, true);
                            cO.currentCurveFac = 0;
                        } else {
                            if(cO.x-background.x > rotationPoints.outer.altState3.left.x[2]){
                                var x1 = rotationPoints.outer.altState3.left.x[1] + background.x;
                                var x2 = rotationPoints.outer.altState3.left.x[2] + background.x;
                                var x3 = rotationPoints.outer.altState3.left.x[4] + background.x;
                                var y1 = rotationPoints.outer.altState3.left.y[1] + background.y;
                                var y2 = rotationPoints.outer.altState3.left.y[2] + background.y;
                                var y3 = rotationPoints.outer.altState3.left.y[4] + background.y;
                                points ={x:[x1,x3,x3,x2],y:[y1,y3,y3,y2]};
                                setCOPosBezier(points, !trains[input1].standardDirection,0.5*rotationPoints.outer.altState3.left.bezierLength);                    
                            } else {
                                var x1 = rotationPoints.outer.altState3.left.x[2] + background.x;
                                var x2 = rotationPoints.outer.altState3.left.x[0] + background.x;
                                var x3 = rotationPoints.outer.altState3.left.x[3] + background.x;
                                var y1 = rotationPoints.outer.altState3.left.y[2] + background.y;
                                var y2 = rotationPoints.outer.altState3.left.y[0] + background.y;
                                var y3 = rotationPoints.outer.altState3.left.y[3] + background.y;
                                points ={x:[x1,x3,x3,x2],y:[y1,y3,y3,y2]};
                                points.x.reverse();
                                points.y.reverse();
                                setCOPosBezier(points, trains[input1].standardDirection,0.5*rotationPoints.outer.altState3.left.bezierLength);
                                cO.angle += Math.PI;        

                            }
                        }
                    }
                } else if(Math.abs(cO.state) == 4 ){
                    if(typeof trains[input1].circle.x[6] == "undefined" || typeof trains[input1].circle.x[7] == "undefined" || typeof trains[input1].circle.y[6] == "undefined" || typeof trains[input1].circle.y[7] == "undefined"){
                        points = {x:[trains[input1].circle.x[0]+background.x],y:[trains[input1].circle.y[0]+background.y,trains[input1].circle.y[3]+background.y]};
                        setCOPosCircle(points, !trains[input1].standardDirection);
                    } else {
                        points ={x:[trains[input1].circle.x[3] + background.x,trains[input1].circle.x[6] + background.x,trains[input1].circle.x[7] + background.x,trains[input1].circle.x[0] + background.x],y:[trains[input1].circle.y[3] + background.y,trains[input1].circle.y[6] + background.y,trains[input1].circle.y[7] + background.y,trains[input1].circle.y[0] + background.y]};
                        setCOPosBezier(points, !trains[input1].standardDirection, cO.state == -4 ? rotationPoints.inner2outer.left.bezierLength : trains[input1].circle.bezierLength.left);       
                    }
                }
            }
      
            function setCOPosCorr(cO,isFront) { // Fix car position and angle relative to locomotive
                function getPointsForPosCorr(x,y,angle,height) {
                    var xa = [];
                    var ya = [];
                    xa[0] = x;
                    xa[1] = x+Math.cos(-Math.PI/2-angle)*height/2;
                    xa[2] = x-Math.cos(-Math.PI/2-angle)*height/2;
                    ya[0] = y;
                    ya[1] = y-Math.sin(-Math.PI/2-angle)*height/2;
                    ya[2] = y+Math.sin(-Math.PI/2-angle)*height/2;
                    if(debug) {
                        context.fillRect(xa[0]-3,ya[0]-3,6,6);
                        context.fillRect(xa[1]-3,ya[1]-3,6,6);
                        context.fillRect(xa[2]-3,ya[2]-3,6,6);
                    }
                    return {x:xa,y:ya};
                }
                var prevCurrentObject = isFront ? (i > 0 ? trains[input1].cars[i-1] : trains[input1]) : (currentObject);
                var prevCO = isFront ? (i > 0 ? trains[input1].cars[i-1].back : trains[input1].back) : (currentObject.front);
                var prevPoints = getPointsForPosCorr(prevCO.x, prevCO.y, prevCO.angle, prevCurrentObject.height);    
                var supposedDistance = isFront ? prevCurrentObject.width*prevCurrentObject.bogieDistance+trains[input1].width/trainParams.margin+currentObject.width*currentObject.bogieDistance : currentObject.width-2*currentObject.width*currentObject.bogieDistance;
                var maxRepeatNo = 100;
                var distance;
                do { 
                    var points = getPointsForPosCorr(cO.x, cO.y, cO.angle, currentObject.height);    
                    distance = Math.min(Math.abs(Math.sqrt(Math.pow(points.x[0] - prevPoints.x[0],2)+Math.pow(points.y[0] - prevPoints.y[0],2),2)), Math.abs(Math.sqrt(Math.pow(points.x[1] - prevPoints.x[1],2)+Math.pow(points.y[1] - prevPoints.y[1],2),2)),Math.abs(Math.sqrt(Math.pow(points.x[2] - prevPoints.x[2],2)+Math.pow(points.y[2] - prevPoints.y[2],2),2)));
                    cO.x -= (supposedDistance-distance)*Math.cos(cO.angle);
                    cO.y -= (supposedDistance-distance)*Math.sin(cO.angle);
                } while (Math.abs(supposedDistance-distance) > 0.001 && --maxRepeatNo > 0);
            } 

            function setCurrentObjectDisplayAngle(){
                if((currentObject.front.state) == 1) {
                    currentObject.displayAngle = Math.atan((currentObject.front.y-currentObject.back.y)/(currentObject.front.x-currentObject.back.x));
                } else if(Math.abs(currentObject.front.state) == 2)  { 
                    currentObject.displayAngle = Math.atan((currentObject.front.y-currentObject.back.y)/(currentObject.front.x-currentObject.back.x));
                    if(currentObject.y > background.y+trains[input1].circle.y[1]+(trains[input1].circle.y[2]-trains[input1].circle.y[1])/2 && currentObject.displayAngle < 0) {
                        currentObject.displayAngle = Math.PI+currentObject.displayAngle;
                    }
                    if(currentObject.displayAngle < 0 || currentObject.displayAngle > Math.PI  || (currentObject.y > background.y+trains[input1].circle.y[1]+(trains[input1].circle.y[2]-trains[input1].circle.y[1])*0.75 && currentObject.displayAngle < Math.PI/2) || (currentObject.y < background.y+trains[input1].circle.y[1]+(trains[input1].circle.y[2]-trains[input1].circle.y[1])*0.25 && currentObject.displayAngle > Math.PI/2)){
                      if(currentObject.y > background.y+trains[input1].circle.y[1]+(trains[input1].circle.y[2]-trains[input1].circle.y[1])*0.75){
                        currentObject.displayAngle = Math.PI;
                      } else if (currentObject.y < background.y+trains[input1].circle.y[1]+(trains[input1].circle.y[2]-trains[input1].circle.y[1])*0.25) {
                        currentObject.displayAngle = 0;
                      } else {
                        currentObject.displayAngle -= Math.PI;
                      }
                    }
                } else if (Math.abs(currentObject.front.state) == 3) {
                    currentObject.displayAngle = Math.PI+Math.atan((currentObject.front.y-currentObject.back.y)/(currentObject.front.x-currentObject.back.x));
                } else if(Math.abs(currentObject.front.state) == 4 ){
                    currentObject.displayAngle = Math.PI+Math.atan((currentObject.front.y-currentObject.back.y)/(currentObject.front.x-currentObject.back.x));
                    if(currentObject.y < background.y+trains[input1].circle.y[0]+(trains[input1].circle.y[3]-trains[input1].circle.y[0])/2 && currentObject.displayAngle < Math.PI) {
                        currentObject.displayAngle = 2*Math.PI-(Math.PI-currentObject.displayAngle);
                    }
                    if( currentObject.displayAngle < Math.PI || currentObject.displayAngle > 2*Math.PI || (currentObject.y > background.y+trains[input1].circle.y[0]+(trains[input1].circle.y[3]-trains[input1].circle.y[0])*0.75 && currentObject.displayAngle > 1.5*Math.PI) || (currentObject.y < background.y+trains[input1].circle.y[0]+(trains[input1].circle.y[3]-trains[input1].circle.y[0])*0.25 && currentObject.displayAngle < 1.5*Math.PI)){
                        if(currentObject.y < background.y+trains[input1].circle.y[0]+(trains[input1].circle.y[3]-trains[input1].circle.y[0])*0.25){
                            currentObject.displayAngle = 2*Math.PI;
                        } else if (currentObject.y > background.y+trains[input1].circle.y[0]+(trains[input1].circle.y[3]-trains[input1].circle.y[0])*0.75){
                            currentObject.displayAngle = Math.PI;
                        } else {
                            currentObject.displayAngle += Math.PI;
                        }
                    }
                }
                while(currentObject.displayAngle  < 0) {
                    currentObject.displayAngle  += Math.PI*2;
                }
                while (currentObject.displayAngle  > Math.PI*2){
                    currentObject.displayAngle -= Math.PI*2;
                }
            }
            
            var currentObject = (i < 0)?trains[input1]:trains[input1].cars[i];
            
            if (trains[input1].move) { //Calc train position
            
                if( i == -1 ) { //Calc acceleration
                    if(trains[input1].accelerationSpeed === 0) {
                        trains[input1].accelerationSpeed = trains[input1].accelerationSpeedStartFac;
                    }
                    if(trains[input1].accelerationSpeed > 0 && trains[input1].accelerationSpeed < 1) {
                        trains[input1].accelerationSpeed *= trains[input1].accelerationSpeedFac;
                        if(trains[input1].accelerationSpeed >= 1) {
                            trains[input1].accelerationSpeed = 1;
                        }
                    } else if (trains[input1].accelerationSpeed < 0 && trains[input1].accelerationSpeed >= -1) {
                        trains[input1].accelerationSpeed /= trains[input1].accelerationSpeedFac;
                        if(trains[input1].accelerationSpeed >= -trains[input1].accelerationSpeedStartFac) {
                            trains[input1].accelerationSpeed = 0;
                            trains[input1].move = false;
                        }
                    }
                    if(trains[input1].accelerationSpeedCustom < 1) {
                        trains[input1].accelerationSpeedCustom *= trains[input1].accelerationSpeedFac;
                        if(trains[input1].accelerationSpeedCustom >= 1) {
                            trains[input1].accelerationSpeedCustom = 1;
                        }
                    } else {
                        trains[input1].accelerationSpeedCustom /= trains[input1].accelerationSpeedFac;
                        if(trains[input1].accelerationSpeedCustom <= 1) {
                            trains[input1].accelerationSpeedCustom = 1;
                        }
                    }
                    trains[input1].currentSpeedInPercent = trains[input1].accelerationSpeedCustom*trains[input1].speedInPercent;
                }    
                var speed = Math.abs(trains[input1].speed*trains[input1].accelerationSpeed);
                var customSpeed = trains[input1].currentSpeedInPercent/100;
                    
                changeCOSection(currentObject.front, true);
                changeCOSection(currentObject.back, false);
                setCOPos(currentObject.front, true);
                setCOPos(currentObject.back, false);
                
                if(debug) {
                    currentObject.x = (currentObject.front.x+currentObject.back.x)/2;
                    currentObject.y = (currentObject.front.y+currentObject.back.y)/2;        
                    setCurrentObjectDisplayAngle();
                    context.save();        
                    context.translate(currentObject.x, currentObject.y);
                    context.rotate(currentObject.displayAngle);
                    context.fillRect(-currentObject.width/2,-currentObject.height/2, currentObject.width, currentObject.height);
                    context.restore();
                }
            
                if(i == -1) {
                    setCOPosCorr(currentObject.back, false);
                } else {
                    setCOPosCorr(currentObject.front, true);
                    setCOPosCorr(currentObject.back, false);
                }
            
                currentObject.x = (currentObject.front.x+currentObject.back.x)/2;
                currentObject.y = (currentObject.front.y+currentObject.back.y)/2;        
                setCurrentObjectDisplayAngle();
                
            } else {
                trains[input1].accelerationSpeed = 0;
                trains[input1].accelerationSpeedCustom = 1;
            }
        
            if(debug) {
                context.fillRect(background.x+trains[input1].circle.x[0], background.y+trains[input1].circle.y[0], 5, 5);
                context.fillRect(background.x+trains[input1].circle.x[1], background.y+trains[input1].circle.y[1], 5, 5);
                context.fillRect(background.x+trains[input1].circle.x[2], background.y+trains[input1].circle.y[2], 5, 5);
                context.fillRect(background.x+trains[input1].circle.x[3], background.y+trains[input1].circle.y[3], 5, 5);
            }
            
            context.save();        
            context.translate(currentObject.x, currentObject.y);
            context.rotate(currentObject.displayAngle);
            
            var flickerDuration = 3;    
            if (konamistate < 0) {
                context.scale(-1,1);
                context.textAlign = "center";
                var icon = i == -1 ? getString(["appScreenTrainIcons",input1]) : getString("appScreenTrainCarIcon");
                context.font = measureFontSize(icon, "sans-serif",100,currentObject.width, 5, currentObject.width/100, 0);
                context.fillStyle = "white";
                context.scale(1,currentObject.height/getFontSize(context.font,"px"));
                context.fillText(icon,0,0); 
            } else if(frameNo <= trains[input1].lastDirectionChange+flickerDuration*3 && (frameNo <= trains[input1].lastDirectionChange+flickerDuration || frameNo > trains[input1].lastDirectionChange+flickerDuration*2)) {
                drawImage(pics[currentObject.src], -currentObject.width*1.01/2,-currentObject.height*1.01/2, currentObject.width*1.01, currentObject.height*1.01);
            } else {
                drawImage(pics[currentObject.src], -currentObject.width/2,-currentObject.height/2, currentObject.width, currentObject.height);
            }

            collisionCourse(input1, true);
            context.beginPath();
            context.rect(-currentObject.width/2, -currentObject.height/2, currentObject.width, currentObject.height);
            if ((hardware.lastInputTouch < hardware.lastInputMouse && context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && hardware.mouse.isHold) || (hardware.lastInputTouch > hardware.lastInputMouse && context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && hardware.mouse.isHold)) {
                inPath = true;
                if(hardware.lastInputTouch < hardware.lastInputMouse) {
                    hardware.mouse.isHold = false;
                }
                if((hardware.lastInputTouch < hardware.lastInputMouse && hardware.mouse.downTime - hardware.mouse.upTime > 0 && context.isPointInPath(hardware.mouse.upX, hardware.mouse.upY) && context.isPointInPath(hardware.mouse.downX, hardware.mouse.downY) && hardware.mouse.downTime - hardware.mouse.upTime < doubleClickTime) || (hardware.lastInputTouch > hardware.lastInputMouse && context.isPointInPath(hardware.mouse.downX, hardware.mouse.downY) && Date.now()-hardware.mouse.downTime > longTouchTime)) {
                    if(typeof clickTimeOut !== "undefined"){
                        clearTimeout(clickTimeOut);
                         clickTimeOut = null;
                   }
                    if(hardware.lastInputTouch > hardware.lastInputMouse) {
                        hardware.mouse.isHold = false;
                    }
                    if(trains[input1].accelerationSpeed <= 0 && Math.abs(trains[input1].accelerationSpeed) < 0.2){ 
                        if(trains[input1].accelerationSpeed < 0) {
                            trains[input1].accelerationSpeed = 0;     
                            trains[input1].move = false;     
                        }
                        trains[input1].lastDirectionChange = frameNo;
                        trains[input1].standardDirection = !trains[input1].standardDirection;
                        notify(formatJSString(getString("appScreenObjectChangesDirection","."), getString(["appScreenTrainNames",input1])), false, 750,null,null, client.y);
                    }
                } else {
                    if(typeof clickTimeOut !== "undefined"){
                        clearTimeout(clickTimeOut);
                         clickTimeOut = null;
                   }
                    clickTimeOut = setTimeout(function(){
                         clickTimeOut = null;
                        if(hardware.lastInputTouch > hardware.lastInputMouse) {
                            hardware.mouse.isHold = false;
                        }
                        if(!collisionCourse(input1, false)) {
                            if(trains[input1].move && trains[input1].accelerationSpeed > 0){ 
                                trains[input1].accelerationSpeed *= -1;     
                                notify(formatJSString(getString("appScreenObjectStops", "."), getString(["appScreenTrainNames",input1])),  false, 500 ,null,  null, client.y);
                            } else {
                                if(trains[input1].move){
                                    trains[input1].accelerationSpeed *= -1;
                                    trains[trainParams.selected].speedInPercent = 50;                                    
                                } else {
                                    trains[input1].move = true;
                                    trains[input1].speedInPercent = 50;
                                }
                                notify(formatJSString(getString("appScreenObjectStarts", "."), getString(["appScreenTrainNames",input1])),  false, 500,null, null, client.y);
                            }
                        }                           
                    }, (hardware.lastInputTouch > hardware.lastInputMouse) ? longTouchWaitTime : doubleClickWaitTime);                             
                }
            }
            if(debug){context.stroke();}

            context.restore();

        }
         
        for(var i = -1; i < trains[input1].cars.length; i++){
            animateTrain(i);
        }
        
    }       

    function collisionCourse(input1, input2){
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        var collision = false;
        var currentObject;
        var fac;
        if(trains[input1].standardDirection){
            fac = 1;
            currentObject = trains[input1];
        } else {
            fac = -1;
            if(trains[input1].cars.length > 0) {
                currentObject = trains[input1].cars[trains[input1].cars.length-1];
            } else {
                currentObject = trains[input1];
            }
        }                                    
        var x1 = currentObject.x+fac*Math.sin(Math.PI/2-currentObject.displayAngle)*currentObject.width/2+Math.cos(-Math.PI/2-currentObject.displayAngle)*currentObject.height/2;
        var x2 = currentObject.x+fac*Math.sin(Math.PI/2-currentObject.displayAngle)*currentObject.width/2-Math.cos(-Math.PI/2-currentObject.displayAngle)*currentObject.height/2;
        var x3 = currentObject.x+fac*Math.sin(Math.PI/2-currentObject.displayAngle)*currentObject.width/2;
        var y1 = currentObject.y+fac*Math.cos(Math.PI/2-currentObject.displayAngle)*currentObject.width/2-Math.sin(-Math.PI/2-currentObject.displayAngle)*currentObject.height/2;
        var y2 = currentObject.y+fac*Math.cos(Math.PI/2-currentObject.displayAngle)*currentObject.width/2+Math.sin(-Math.PI/2-currentObject.displayAngle)*currentObject.height/2;
        var y3 = currentObject.y+fac*Math.cos(Math.PI/2-currentObject.displayAngle)*currentObject.width/2;
        if(debug) {
            context.fillRect(x1-3,y1-3,6,6);
            context.fillRect(x2-3,y2-3,6,6);
            context.fillRect(x3-3,y3-3,6,6);
        }
        for(var i = 0; i < trains.length; i++){
            if(input1 != i && (trains[input1].circleFamily === null || trains[i].circleFamily === null || trains[input1].circleFamily == trains[i].circleFamily)){
                for(var j = -1; j < trains[i].cars.length; j++){
                    currentObject = j >= 0 ? trains[i].cars[j] : trains[i];
                    context.save();
                    context.translate(currentObject.x, currentObject.y); 
                    context.rotate(currentObject.displayAngle);
                    context.beginPath();
                    context.rect(-currentObject.width/2, -currentObject.height/2, currentObject.width, currentObject.height);
                    if (context.isPointInPath(x1, y1) || context.isPointInPath(x2, y2) || context.isPointInPath(x3, y3)){
                        if(input2 && trains[input1].move){
                            notify(formatJSString(getString("appScreenObjectHasCrashed", "."), getString(["appScreenTrainNames",input1]), getString(["appScreenTrainNames",i])), true, 2000,null,null, client.y);
                        }
                        collision = true;
                        trains[input1].move = false;
                        trains[input1].accelerationSpeed = 0;
                        trains[input1].accelerationSpeedCustom = 1;
                    }
                    if(debug) {
                        context.fillStyle = "blue";
                        context.fill();
                    }
                    context.restore();
              }
            }
        }
        context.restore();
        return(collision);
    } 
  
    function animateCars(input1){
        var currentObject = cars[input1];
        carCollisionCourse(input1,true);
        context.save();        
        context.translate(background.x, background.y);
        context.translate(currentObject.x, currentObject.y);
        context.rotate(currentObject.displayAngle);
        var flickerDuration = 4;
        if (konamistate < 0) {
            context.scale(-1,1);
            context.textAlign = "center";
            var icon = getString(["appScreenCarIcons",input1]);
            context.font = measureFontSize(icon,"sans-serif",100,currentObject.width, 5, currentObject.width/100, 0);
            context.fillStyle = "white";
            context.scale(1,currentObject.height/getFontSize(context.font,"px"));
            context.fillText(icon,0,0); 
        } else if ( frameNo <= currentObject.lastDirectionChange+flickerDuration*3 && (frameNo <= currentObject.lastDirectionChange+flickerDuration || frameNo > currentObject.lastDirectionChange+flickerDuration*2)) {
            drawImage(pics[currentObject.src], -currentObject.width*1.03/2,-currentObject.height*1.03/2, currentObject.width*1.03, currentObject.height*1.03);
        } else {
            drawImage(pics[currentObject.src], -currentObject.width/2,-currentObject.height/2, currentObject.width, currentObject.height);
        }
        context.beginPath();
        context.rect(-currentObject.width/2, -currentObject.height/2, currentObject.width, currentObject.height);
        if ((hardware.lastInputTouch < hardware.lastInputMouse && context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && hardware.mouse.isHold) || (hardware.lastInputTouch > hardware.lastInputMouse && context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && hardware.mouse.isHold)) {
            inPath = true;
            if(hardware.lastInputTouch < hardware.lastInputMouse) {
                hardware.mouse.isHold = false;
            }
            if ((hardware.lastInputTouch < hardware.lastInputMouse && hardware.mouse.downTime - hardware.mouse.upTime > 0 && context.isPointInPath(hardware.mouse.upX, hardware.mouse.upY) && context.isPointInPath(hardware.mouse.downX, hardware.mouse.downY) && hardware.mouse.downTime - hardware.mouse.upTime < doubleClickTime) || (hardware.lastInputTouch > hardware.lastInputMouse && context.isPointInPath(hardware.mouse.downX, hardware.mouse.downY) && Date.now()-hardware.mouse.downTime > longTouchTime)) {
                if(typeof clickTimeOut !== "undefined"){
                    clearTimeout(clickTimeOut);
                    clickTimeOut = null;
                }
                if(hardware.lastInputTouch > hardware.lastInputMouse) {
                    hardware.mouse.isHold = false;
                }
                if(carParams.init) {
                    carParams.init = false;
                    carParams.autoModeRuns = true;
                    carParams.autoModeInit = true;
                    notify(formatJSString(getString("appScreenCarAutoModeChange", "."), getString("appScreenCarAutoModeInit")),  false, 500,null, null, client.y);
                } else if(carParams.autoModeOff && !currentObject.move && currentObject.backwardsState === 0) {
                    currentObject.lastDirectionChange = frameNo;
                    currentObject.backwardsState = 1;
                    currentObject.move = !carCollisionCourse(input1,false);
                    notify(formatJSString(getString("appScreenCarStepsBack","."), getString(["appScreenCarNames",input1])), false, 750,null,null, client.y);
                }
            } else {
                if(typeof clickTimeOut !== "undefined"){
                    clearTimeout(clickTimeOut);
                    clickTimeOut = null;
                }
                clickTimeOut = setTimeout(function(){
                    clickTimeOut = null;
                    if(hardware.lastInputTouch > hardware.lastInputMouse) {
                        hardware.mouse.isHold = false;
                    }
                    if(!carCollisionCourse(input1,false)) {
                        if(carParams.autoModeRuns) {
                            notify(formatJSString(getString("appScreenCarAutoModeChange", "."), getString("appScreenCarAutoModePause")),  false, 500,null, null, client.y);
                            carParams.autoModeRuns = false;
                        } else if(carParams.init || carParams.autoModeOff) {
                            if (currentObject.move){ 
                                currentObject.move = false;
                                notify(formatJSString(getString("appScreenObjectStops", "."), getString(["appScreenCarNames",input1])),  false, 500 ,null,  null, client.y);
                            } else {
                                currentObject.move = !carCollisionCourse(input1,false);
                                notify(formatJSString(getString("appScreenObjectStarts", "."), getString(["appScreenCarNames",input1])),  false, 500,null, null, client.y);
                            }
                            currentObject.backwardsState = 0;
                            carParams.init = false;
                            carParams.autoModeOff = true;
                        } else {
                            notify(formatJSString(getString("appScreenCarAutoModeChange", "."), getString("appScreenCarAutoModeInit")),  false, 500,null, null, client.y);
                            carParams.autoModeRuns = true;
                            carParams.autoModeInit = true;                            
                        }                        
                    }                           
                }, (hardware.lastInputTouch > hardware.lastInputMouse) ? longTouchWaitTime : doubleClickWaitTime);
                              
            }
        }
        context.closePath();
        context.restore();
        if(debug && !carParams.autoModeRuns) {
            context.save();
            context.beginPath();
            context.strokeStyle = "rgb(" + Math.floor(input1/carWays.length*255) + ",0,0)";
            context.lineWidth="1";
            context.moveTo(background.x+carWays[input1][currentObject.cType][0].x,background.y+carWays[input1][currentObject.cType][0].y);
            for(var i = 1; i < carWays[input1][currentObject.cType].length;i+=10){
                context.lineTo(background.x+carWays[input1][currentObject.cType][i].x,background.y+carWays[input1][currentObject.cType][i].y);
            }
            if(currentObject.cType == "normal") {
                context.lineTo(background.x+carWays[input1][currentObject.cType][0].x,background.y+carWays[input1][currentObject.cType][0].y);
            }
            context.stroke();
            context.restore();
        }
        if(carParams.autoModeRuns) {
            var counter = currentObject.counter+1 > carWays[input1][currentObject.cType].length-1 ? 0 : currentObject.counter+1;
            if(counter === 0 && currentObject.cType == "start") {
                currentObject.cType = "normal";
            }
            currentObject.counter = currentObject.collStop ? currentObject.counter : counter;
            currentObject.x = carWays[input1][currentObject.cType][currentObject.counter].x;
            currentObject.y = carWays[input1][currentObject.cType][currentObject.counter].y;
            currentObject.displayAngle = carWays[input1][currentObject.cType][currentObject.counter].angle;
        } else if (currentObject.move) {
            if(currentObject.cType == "start") {
                currentObject.counter = currentObject.backwardsState > 0 ? --currentObject.counter < cars[input1].startFrame ? cars[input1].startFrame : currentObject.counter : ++currentObject.counter > carWays[input1].start.length-1 ? 0 : currentObject.counter;
                if(currentObject.counter === 0) {
                    currentObject.cType = "normal";
                } else if (currentObject.counter == currentObject.startFrame) {
                    currentObject.backwardsState = 0;                
                    currentObject.move = false;
                }
            } else if (currentObject.cType == "normal") {
                currentObject.counter = currentObject.backwardsState > 0 ? --currentObject.counter < 0 ? carWays[input1].normal.length-1 : currentObject.counter : ++currentObject.counter > carWays[input1].normal.length-1 ? 0 : currentObject.counter;
            }
            currentObject.backwardsState *= (1-currentObject.speed/background.width*100);
            if (currentObject.backwardsState <=  0.1 && currentObject.backwardsState > 0) {
                currentObject.backwardsState = 0;
                currentObject.move = false;
            }
            currentObject.x = carWays[input1][currentObject.cType][currentObject.counter].x;
            currentObject.y = carWays[input1][currentObject.cType][currentObject.counter].y;
            currentObject.displayAngle = carWays[input1][currentObject.cType][currentObject.counter].angle;
        }
    
    }
    
    function carCollisionCourse(input1, input2){
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        var collision = false;
        var currentObject;
        var fac;
        if(cars[input1].backwardsState > 0){
            fac = -1;
        } else {
            fac = 1;
        }                                    
        currentObject = cars[input1];
        var x1 = currentObject.x+fac*Math.sin(Math.PI/2-currentObject.displayAngle)*currentObject.width/2+Math.cos(-Math.PI/2-currentObject.displayAngle)*currentObject.height/2;
        var x2 = currentObject.x+fac*Math.sin(Math.PI/2-currentObject.displayAngle)*currentObject.width/2-Math.cos(-Math.PI/2-currentObject.displayAngle)*currentObject.height/2;
        var x3 = currentObject.x+fac*Math.sin(Math.PI/2-currentObject.displayAngle)*currentObject.width/2;
        var y1 = currentObject.y+fac*Math.cos(Math.PI/2-currentObject.displayAngle)*currentObject.width/2-Math.sin(-Math.PI/2-currentObject.displayAngle)*currentObject.height/2;
        var y2 = currentObject.y+fac*Math.cos(Math.PI/2-currentObject.displayAngle)*currentObject.width/2+Math.sin(-Math.PI/2-currentObject.displayAngle)*currentObject.height/2;
        var y3 = currentObject.y+fac*Math.cos(Math.PI/2-currentObject.displayAngle)*currentObject.width/2;
        if(debug) {
            context.fillRect(background.x+x1-3,background.y+y1-3,6,6);
            context.fillRect(background.x+x2-3,background.y+y2-3,6,6);
            context.fillRect(background.x+x3-3,background.y+y3-3,6,6);
        }
        for(var i = 0; i < cars.length; i++){
            if(input1 != i){
                currentObject = cars[i];
                context.save();
                context.translate(currentObject.x, currentObject.y); 
                context.rotate(currentObject.displayAngle);
                context.beginPath();
                context.rect(-currentObject.width/2, -currentObject.height/2, currentObject.width, currentObject.height);
                if (context.isPointInPath(x1, y1) || context.isPointInPath(x2, y2) || context.isPointInPath(x3, y3)){
                    if(input2 && cars[input1].move){
                        notify(formatJSString(getString("appScreenObjectHasCrashed", "."), getString(["appScreenCarNames",input1]), getString(["appScreenCarNames",i])), true, 2000,null,null, client.y);
                    }
                    collision = true;
                    cars[input1].move = false;
                    cars[input1].backwardsState = 0;
                }
                context.restore();
            }
        }
        context.restore();
        return(collision);
    }
    
    function carAutoModeIsFutureCollision(i,k,j) {
        if(typeof j == "undefined"){
            j = 0;
        }
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        var coll = false;
        var jmax = false;            
        var m = j;
        var n = j;
        if(m >= points.angle[i].length-1 || n >= points.angle[k].length-1) {
            m = n = j = points.angle[i].length-1;
            jmax = true;
        }
        m = cCars[i].collStop ? 0: m;
        n = cCars[k].collStop ? 0: n;
        var sizeNo = cCars[k].collStop ? 1.01 : 1.05;
        var x1 = points.x[i][m]+Math.sin(Math.PI/2-points.angle[i][m])*cCars[i].width/2+Math.cos(-Math.PI/2-points.angle[i][m])*cCars[i].height/2;
        var x2 = points.x[i][m]+Math.sin(Math.PI/2-points.angle[i][m])*cCars[i].width/2-Math.cos(-Math.PI/2-points.angle[i][m])*cCars[i].height/2;
        var x3 = points.x[i][m]+Math.sin(Math.PI/2-points.angle[i][m])*cCars[i].width/2;
        var y1 = points.y[i][m]+Math.cos(Math.PI/2-points.angle[i][m])*cCars[i].width/2-Math.sin(-Math.PI/2-points.angle[i][m])*cCars[i].height/2;
        var y2 = points.y[i][m]+Math.cos(Math.PI/2-points.angle[i][m])*cCars[i].width/2+Math.sin(-Math.PI/2-points.angle[i][m])*cCars[i].height/2;
        var y3 = points.y[i][m]+Math.cos(Math.PI/2-points.angle[i][m])*cCars[i].width/2;
        context.translate(points.x[k][n], points.y[k][n]); 
        context.rotate(points.angle[k][n]);
        context.beginPath();
        context.rect(-sizeNo*cCars[k].width/2, -sizeNo*cCars[k].height/2, sizeNo*cCars[k].width, sizeNo*cCars[k].height);
        if (context.isPointInPath(x1, y1) || context.isPointInPath(x2, y2) || context.isPointInPath(x3, y3)){
            coll = true;
        }
        context.restore();
        return (coll) ? j : (jmax) ? -1 : carAutoModeIsFutureCollision(i,k,++j);
    }
    
    function classicUISwicthesLocate(angle, radius, style){
        context.save();
        context.rotate(angle);
        context.beginPath();
        context.moveTo(0,0);
        context.lineTo(radius + (konamistate < 0 ? Math.random()*0.3*radius : 0), radius + (konamistate < 0 ? Math.random()*0.3*radius : 0));
        context.closePath();
        context.strokeStyle = style;
        context.stroke();
        context.restore();
    }
    
    /////RESIZE/////
    if(resized) {
        
        var oldbackground = copyJSObject(background);
        
        extendedMeasureViewspace();
        
        context = canvas.getContext("2d");

    
        placeBackground();
        
        for(var i = 0; i < trains.length; i++){
          for(var j = 0; j < trains[i].circle.x.length; j++) {
            trains[i].circle.x[j] *= background.width/oldbackground.width;
            trains[i].circle.y[j] *= background.height/oldbackground.height;
          }
        }      
        defineTrainParams();
        for(var i = 0; i < trains.length; i++){  
            trains[i].front.x = background.x+((trains[i].front.x-oldbackground.x) * background.width/oldbackground.width);
            trains[i].back.x = background.x+((trains[i].back.x-oldbackground.x) * background.width/oldbackground.width);
            trains[i].x = background.x+((trains[i].x-oldbackground.x) * background.width/oldbackground.width);
            trains[i].front.y = background.y+((trains[i].front.y-oldbackground.y) * background.height/oldbackground.height);
            trains[i].back.y = background.y+((trains[i].back.y-oldbackground.y) * background.height/oldbackground.height);
            trains[i].y = background.y+((trains[i].y-oldbackground.y) * background.height/oldbackground.height);
            trains[i].width = trains[i].width * background.width/oldbackground.width;
            trains[i].height = trains[i].height * background.height/oldbackground.height;
            for(var j = 0; j < trains[i].cars.length; j++){
                trains[i].cars[j].front.x = background.x+((trains[i].cars[j].front.x-oldbackground.x) * background.width/oldbackground.width);
                trains[i].cars[j].back.x = background.x+((trains[i].cars[j].back.x-oldbackground.x) * background.width/oldbackground.width);
                trains[i].cars[j].x = background.x+((trains[i].cars[j].x-oldbackground.x) * background.width/oldbackground.width);
                trains[i].cars[j].front.y = background.y+((trains[i].cars[j].front.y-oldbackground.y) * background.height/oldbackground.height);
                trains[i].cars[j].back.y = background.y+((trains[i].cars[j].back.y-oldbackground.y) * background.height/oldbackground.height);
                trains[i].cars[j].y = background.y+((trains[i].cars[j].y-oldbackground.y) * background.height/oldbackground.height);
                trains[i].cars[j].width = trains[i].cars[j].width * background.width/oldbackground.width;
                trains[i].cars[j].height = trains[i].cars[j].height * background.height/oldbackground.height;
            }
        }     
        
        carWays.forEach(function(way){
            Object.keys(way).forEach(function(cType) {
                way[cType].forEach(function(point){
                    point.x*=background.width/oldbackground.width;
                    point.y*=background.height/oldbackground.height;
                });
            });
        });
        cars.forEach(function(car){
            car.speed *= background.width/oldbackground.width;
            car.x *= background.width/oldbackground.width;
            car.y *= background.height/oldbackground.height;
            car.width *= background.width / oldbackground.width;
            car.height *= background.height / oldbackground.height;
        });
        
        taxOffice.params.fire.x *= background.width/oldbackground.width;
        taxOffice.params.fire.y *= background.height/oldbackground.height;
        taxOffice.params.fire.size *= background.width/oldbackground.width;
        taxOffice.params.smoke.x *= background.width/oldbackground.width;
        taxOffice.params.smoke.y *= background.height/oldbackground.height;
        taxOffice.params.smoke.size *= background.width/oldbackground.width;
        for (var i = 0; i <  taxOffice.params.number; i++) {            
            taxOffice.fire[i].x *= background.width/oldbackground.width;
            taxOffice.fire[i].y *= background.height/oldbackground.height;
            taxOffice.fire[i].size *= background.width/oldbackground.width;
            taxOffice.smoke[i].x *= background.width/oldbackground.width;
            taxOffice.smoke[i].y *= background.height/oldbackground.height;
            taxOffice.smoke[i].size *= background.width/oldbackground.width;
        }
        taxOffice.params.bluelights.cars.forEach(function(car){
            car.x[0] *= background.width/oldbackground.width;
            car.x[1] *= background.width/oldbackground.width;
            car.y[0] *= background.height/oldbackground.height;
            car.y[1] *= background.height/oldbackground.height;
            car.size *= background.width/oldbackground.width;
        });
        
        placeClassicUIElements();
        
        if(typeof placeOptions == "function") {
            placeOptions("resize");
        }
        resized = false;
        
    }
    
    /////GENERAL/////  
    context.clearRect(0, 0, canvas.width, canvas.height);
    frameNo++;
    if(frameNo % 1000000 === 0){
        notify(formatJSString(getString("appScreenAMillionFrames","."),frameNo/1000000), false, 500, null, null, client.y);
    }    
    var inPath = false;
    /////CURSOR/1/////
    if(!settings.cursorascircle || client.chosenInputMethod == "touch") {
        canvas.style.cursor = "default";
    } else {
        canvas.style.cursor = "none";
    }
    
    /////BACKGROUND/Margins-1/////    
    var pic = pics[background.src];
    var width = pic.height/pic.width - canvas.height/canvas.width < 0 ? canvas.height*(pic.width/pic.height) : canvas.width;
    var height = pic.height/pic.width - canvas.height/canvas.width < 0 ? canvas.height : canvas.width*(pic.height/pic.width);
    drawImage(pic, -(width-canvas.width)/2,-(height-canvas.height)/2, width,height);        
    /////BACKGROUND/Layer-1/////
    drawImage(pic, background.x, background.y, background.width, background.height);
    
    /////TRAINS/////
    for(var i = 0; i < trains.length; i++) {
        animateTrains(i);
    }
    
    /////CARS/////
    //Auto Mode
    if((carParams.autoModeRuns && frameNo % carParams.wayNo === 0) || carParams.autoModeInit) {
        carParams.autoModeInit = false;
        var points = {x:[], y:[], angle:[]};
        var arrLen =  carParams.wayNo*10;
        var abstrNo = Math.ceil(arrLen*0.1);
        var cCars = copyJSObject(cars);
        for(var i = 0; i < cCars.length; i++) {
            cCars[i].move = false;
            cCars[i].backwardsState = 0;
            cCars[i].collStop = false;
            points.x[i] = [];
            points.y[i] = [];
            points.angle[i] = [];
            var counter = cCars[i].counter;
            var cAbstrNo = Math.round((cCars[i].speed/cCars[carParams.lowestSpeedNo].speed)*abstrNo);
            var countJ = 0;
            points.x[i] = [];
            points.y[i] = [];
            points.angle[i] = [];
            if(debug) {
                context.save();
                context.beginPath();
                context.strokeStyle = "rgb(" + Math.floor(i/carWays.length*255) + ",0,0)";
                context.lineWidth="1";
                context.moveTo(background.x+carWays[i][cCars[i].cType][counter].x,background.y+carWays[i][cCars[i].cType][counter].y);
            }
            for(var j = 0; j < arrLen; j+=cAbstrNo) {
                points.x[i][countJ] = carWays[i][cCars[i].cType][counter].x;
                points.y[i][countJ] = carWays[i][cCars[i].cType][counter].y;
                points.angle[i][countJ] = carWays[i][cCars[i].cType][counter].angle;
                if(debug) {
                    context.lineTo(background.x+points.x[i][countJ],background.y+points.y[i][countJ]);
                }
                countJ++;
                if(cCars[i].cType == "start" && counter+cAbstrNo > carWays[i][cCars[i].cType].length-1) {
                    cCars[i].cType = "normal";
                    counter = 0;
                }
                counter = counter+cAbstrNo > carWays[i][cCars[i].cType].length-1 ? counter+cAbstrNo-(carWays[i][cCars[i].cType].length-1) : counter+cAbstrNo;
            }
            if(debug) {
                context.stroke();
                context.restore();
            }
            cCars[i].cType = cars[i].cType;
        }
        var state = 0;
        var change;
        do {
            change = false;
            for(var i = 0; i < cCars.length; i++) {
                cCars[i].collStopNo = [];
                for(var k = 0; k < cCars.length; k++) {
                    if(k!=i) {
                        cCars[i].collStopNo[k] = carAutoModeIsFutureCollision(i,k);
                    }
                }
            }
            if(state <= 2) {
                for(var i = 0; i < cCars.length; i++) {
                    for(var k = 0; k < cCars.length; k++) {
                        if(i!=k && cCars[i].collStopNo[k] > -1 && !cCars[i].collStop) {
                            var angleDiff = Math.abs(points.angle[i][cCars[i].collStopNo[k]]-points.angle[k][cCars[i].collStopNo[k]]);
                            var a = cCars[i].collStopNo[k]/cCars[i].speed;
                            var b = cCars[i].collStopNo[k]/cCars[k].speed;
                            if(state === 0 && (angleDiff < 0.5*Math.PI || angleDiff > 1.5*Math.PI)){
                                change = true;
                                cCars[i].collStop = true;
                                k = cCars.length;
                                i = cCars.length;
                            } else if (state == 1 && (angleDiff >= 0.5*Math.PI && angleDiff <= 1.5*Math.PI)){
                                if (a < b || a === 0 || (a == b && !cCars[k].collStop)) {
                                    change = true;
                                    cCars[i].collStop = true;
                                    k = cCars.length;
                                    i = cCars.length;
                                }
                            } else if (state == 2 && (a  === 0 || (a < carParams.wayNo && !cCars[k].collStop))) {
                                change = true;
                                cCars[i].collStop = true;
                                k = cCars.length;
                                i = cCars.length;
                            }
                        }
                    }
                }
                if(!change) {
                    ++state;
                    change = true;
                }
            }
        } while (change);
        cars = cCars;
    }
    //General
    for(var i = 0; i < cars.length; i++) {
        animateCars(i);
    }

    /////KONAMI/Animals/////    
    if(konamistate < 0) {
        var animalPos = [{x: background.x+background.width*0.88, y: background.y+background.height*0.58},{x: background.x+background.width*0.055, y: background.y+background.height*0.07}];
        var animals = [];
        var animal = 0;
        while (getString(["appScreenKonamiAnimals",animal]) != "undefined" && animal < animalPos.length) {
            animals[animal] = getString(["appScreenKonamiAnimals",animal]);
            animal++;
        }
        animals.forEach(function(animal,i){
            context.save();
            context.translate(animalPos[i].x, animalPos[i].y);    
            context.font = measureFontSize(animal, "sans-serif",100,background.width*0.001, 5,background.width*0.012, 0);
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText(animal, 0, 0);
            context.restore();
        });
    }

    
    /////BACKGROUND/Layer-2/////
    drawImage(pics[background.secondLayer], background.x, background.y, background.width, background.height);
    
    /////TAX OFFICE/////
    if(settings.burnTheTaxOffice){
        //General (BEGIN)
        context.save();
        context.translate(background.x,background.y);
        context.translate(background.width/7.4-background.width*0.07, background.height/3.1-background.height*0.06);
        //Smoke and Fire
        for (var i = 0; i <  taxOffice.params.number; i++) {
            if(frameNo % taxOffice.params.frameNo === 0) {
                if ( Math.random() > taxOffice.params.frameProbability ) {
                    if ( Math.random() >= taxOffice.params.fire.color.probability ) {
                        taxOffice.fire[i].color = "rgba(" + taxOffice.params.fire.color.yellow.red + "," + taxOffice.params.fire.color.yellow.green + "," + taxOffice.params.fire.color.yellow.blue + "," + (taxOffice.params.fire.color.yellow.alpha * Math.random()) + ")";            
                    } else {
                        taxOffice.fire[i].color = "rgba(" + taxOffice.params.fire.color.red.red + "," + taxOffice.params.fire.color.red.green + "," + taxOffice.params.fire.color.red.blue + "," + (taxOffice.params.fire.color.red.alpha * Math.random()) + ")";            
                    }
                    taxOffice.fire[i].x = Math.random() * taxOffice.params.fire.x;
                    taxOffice.fire[i].y = Math.random() * taxOffice.params.fire.y;
                    taxOffice.fire[i].size = Math.random() * taxOffice.params.fire.size;
                    taxOffice.smoke[i].color = "rgba(" + taxOffice.params.smoke.color.red + "," + taxOffice.params.smoke.color.green + "," + taxOffice.params.smoke.color.blue + "," + (taxOffice.params.smoke.color.alpha * Math.random()) + ")";
                    taxOffice.smoke[i].x = Math.random() * taxOffice.params.smoke.x;
                    taxOffice.smoke[i].y = Math.random() * taxOffice.params.smoke.y;
                    taxOffice.smoke[i].size = Math.random() * taxOffice.params.smoke.size;
                }
            }
            context.fillStyle = taxOffice.fire[i].color;
            context.save();
            context.translate(taxOffice.fire[i].x, taxOffice.fire[i].y);
            context.beginPath();
            context.arc(0,0, taxOffice.fire[i].size, 0, 2*Math.PI);
            context.closePath();
            context.fill();
            context.restore();
            context.save();
            context.fillStyle = taxOffice.smoke[i].color;
            context.translate(taxOffice.smoke[i].x, taxOffice.smoke[i].y);
            context.beginPath();
            context.arc(0,0, taxOffice.smoke[i].size, 0, 2*Math.PI);
            context.closePath();
            context.fill();
            context.restore();
        }
        //Blue lights
        for(var i = 0; i <  taxOffice.params.bluelights.cars.length; i++) {
            if((frameNo +  taxOffice.params.bluelights.cars[i].frameNo) %  taxOffice.params.bluelights.frameNo < 4) {
                context.fillStyle = "rgba(0, 0,255,1)";
            } else if ((frameNo +  taxOffice.params.bluelights.cars[i].frameNo) %  taxOffice.params.bluelights.frameNo < 6 || (frameNo +  taxOffice.params.bluelights.cars[i].frameNo) %  taxOffice.params.bluelights.frameNo > (taxOffice.params.bluelights.frameNo  - 3)) {
                context.fillStyle = "rgba(0, 0,255,0.5)";          
            } else {
                context.fillStyle = "rgba(0, 0,255,0.2)";          
            }
            context.save();
            context.translate(taxOffice.params.bluelights.cars[i].x[0],taxOffice.params.bluelights.cars[i].y[0]);
            context.beginPath();
            context.arc(0,0, taxOffice.params.bluelights.cars[i].size, 0, 2*Math.PI);
            context.closePath();
            context.fill();
            context.translate(taxOffice.params.bluelights.cars[i].x[1],taxOffice.params.bluelights.cars[i].y[1]);
            context.beginPath();
            context.arc(0,0, taxOffice.params.bluelights.cars[i].size, 0, 2*Math.PI);
            context.closePath();
            context.fill();
            context.restore();
        }
        //General (END)
        context.restore();
    }
    
    /////CLASSIC UI/////
    if(settings.classicUI) {
        var step = Math.PI/30;
        if(trains[trainParams.selected].accelerationSpeed > 0){
            if(classicUI.transformer.input.angle < trains[trainParams.selected].speedInPercent/100 * classicUI.transformer.input.maxAngle){
                classicUI.transformer.input.angle += step;
                if(classicUI.transformer.input.angle >= trains[trainParams.selected].speedInPercent/100 * classicUI.transformer.input.maxAngle){
                    classicUI.transformer.input.angle = trains[trainParams.selected].speedInPercent/100 * classicUI.transformer.input.maxAngle;
                }
            } else {
                classicUI.transformer.input.angle -= step;
                if(classicUI.transformer.input.angle <= trains[trainParams.selected].speedInPercent/100 * classicUI.transformer.input.maxAngle){
                  classicUI.transformer.input.angle = trains[trainParams.selected].speedInPercent/100 * classicUI.transformer.input.maxAngle;
                }
            }
        } else {
                if(classicUI.transformer.input.angle > 0){
                    classicUI.transformer.input.angle -= step;
                    if(classicUI.transformer.input.angle < 0){
                        classicUI.transformer.input.angle = 0;
                    }
                }
        }    
        context.save();
        drawImage(pics[classicUI.trainSwitch.src], classicUI.trainSwitch.x, classicUI.trainSwitch.y, classicUI.trainSwitch.width, classicUI.trainSwitch.height);
        context.beginPath();
        context.rect(classicUI.trainSwitch.x, classicUI.trainSwitch.y, classicUI.trainSwitch.width, classicUI.trainSwitch.height);
        if ((context.isPointInPath(hardware.mouse.wheelX, hardware.mouse.wheelY) && hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls) || context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY)) {
            hardware.mouse.cursor = "pointer";
            if(typeof movingTimeOut !== "undefined"){
                clearTimeout(movingTimeOut);
            }
            if((hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls) || hardware.mouse.isHold) {
                if(hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls) {
                    trainParams.selected += hardware.mouse.wheelScrollY < 0 ? 1 : -1;
                } else {
                    trainParams.selected++;
                    hardware.mouse.isHold = false;
                }
                if(trainParams.selected >= trains.length) {
                    trainParams.selected=0;
                } else if (trainParams.selected < 0) {
                    trainParams.selected = trains.length-1;
                }
                if (!settings.alwaysShowSelectedTrain) {
                    notify (formatJSString(getString("appScreenTrainSelected", "."), getString(["appScreenTrainNames",trainParams.selected])), true, 1250,null, null, client.y);
                }
            }
        }
        if(settings.alwaysShowSelectedTrain){
            context.font = classicUI.trainSwitch.selectedTrainDisplay.font;
            context.fillStyle="#000";        
            context.strokeStyle="#eee";        
            context.fillRect(classicUI.trainSwitch.x+classicUI.trainSwitch.width,classicUI.trainSwitch.y+classicUI.trainSwitch.height/2, classicUI.trainSwitch.selectedTrainDisplay.width, classicUI.trainSwitch.selectedTrainDisplay.height);
            context.strokeRect(classicUI.trainSwitch.x+classicUI.trainSwitch.width,classicUI.trainSwitch.y+classicUI.trainSwitch.height/2, classicUI.trainSwitch.selectedTrainDisplay.width, classicUI.trainSwitch.selectedTrainDisplay.height);
            context.fillStyle="#eee";    
            context.translate(classicUI.trainSwitch.x+classicUI.trainSwitch.width+classicUI.trainSwitch.selectedTrainDisplay.width/2,0);    
            context.fillText(getString(["appScreenTrainNames",trainParams.selected]), -context.measureText(getString(["appScreenTrainNames",trainParams.selected])).width/2,classicUI.trainSwitch.y+1.3*classicUI.trainSwitch.height/2);
        }
        context.restore();
        context.save();
        context.translate(classicUI.transformer.x+classicUI.transformer.width/2, classicUI.transformer.y+classicUI.transformer.height/2);
        context.rotate(classicUI.transformer.angle);
        if(trains[trainParams.selected].accelerationSpeed > 0){
            drawImage(pics[classicUI.transformer.src], -classicUI.transformer.width/2, -classicUI.transformer.height/2 , classicUI.transformer.width, classicUI.transformer.height);
        } else {
            drawImage(pics[classicUI.transformer.asrc], -classicUI.transformer.width/2, -classicUI.transformer.height/2 , classicUI.transformer.width, classicUI.transformer.height);
        }
        if(!client.isSmall){
            context.save();
            context.translate( classicUI.transformer.directionInput.diffX, classicUI.transformer.directionInput.diffY);
            drawImage(pics[classicUI.transformer.directionInput.src], -classicUI.transformer.directionInput.width/2, -classicUI.transformer.directionInput.height/2, classicUI.transformer.directionInput.width, classicUI.transformer.directionInput.height);
            context.beginPath();
            context.rect(-classicUI.transformer.directionInput.width/2, -classicUI.transformer.directionInput.height/2, classicUI.transformer.directionInput.width, classicUI.transformer.directionInput.height);
            if (context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && !trains[trainParams.selected].move) {
                if(typeof movingTimeOut !== "undefined"){
                    clearTimeout(movingTimeOut);
                }
                hardware.mouse.cursor = "pointer";
                if(hardware.mouse.isHold){
                    hardware.mouse.isHold = false;
                    trains[trainParams.selected].standardDirection = !trains[trainParams.selected].standardDirection;
                    notify(formatJSString(getString("appScreenObjectChangesDirection","."), getString(["appScreenTrainNames",trainParams.selected])), false, 750,null,null, client.y);
                }  
            }
            context.restore();  
        }
        context.save();
        context.translate(0, -classicUI.transformer.input.diffY);
        context.rotate(classicUI.transformer.input.angle);
        drawImage(pics[classicUI.transformer.input.src], -classicUI.transformer.input.width/2, -classicUI.transformer.input.height/2, classicUI.transformer.input.width, classicUI.transformer.input.height);
        if(debug){
            context.fillRect(-classicUI.transformer.input.width/2, classicUI.transformer.input.height/2,6,6);
            context.fillRect(-3,-3,6,6);
        }
        context.beginPath();
        context.rect(-classicUI.transformer.input.width/2, -classicUI.transformer.input.height/2, classicUI.transformer.input.width, classicUI.transformer.input.height);
        if (context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) || (context.isPointInPath(hardware.mouse.wheelX, hardware.mouse.wheelY) && hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls)) {
            context.restore();
            context.restore();
            if(typeof movingTimeOut !== "undefined"){
                clearTimeout(movingTimeOut);
            }
            hardware.mouse.cursor = "pointer";
            var x=classicUI.transformer.x+classicUI.transformer.width/2+ classicUI.transformer.input.diffY*Math.sin(classicUI.transformer.angle);
            var y=classicUI.transformer.y+classicUI.transformer.height/2- classicUI.transformer.input.diffY*Math.cos(classicUI.transformer.angle);
            if(!collisionCourse(trainParams.selected, false)){
                if(client.isSmall){  
                    if(hardware.mouse.isHold){
                        trains[trainParams.selected].speedInPercent = 50;
                        hardware.mouse.isHold = false;
                        if(trains[trainParams.selected].move && trains[trainParams.selected].accelerationSpeed > 0){ 
                            trains[trainParams.selected].accelerationSpeed *= -1;     
                            notify (formatJSString(getString("appScreenObjectStops", "."), getString(["appScreenTrainNames",trainParams.selected])),false, 500,null, null, client.y);
                        } else {
                            if(trains[trainParams.selected].move){
                                trains[trainParams.selected].accelerationSpeed *= -1;                                     
                            } else {
                                trains[trainParams.selected].move = true;
                            }
                            notify(formatJSString(getString("appScreenObjectStarts", "."), getString(["appScreenTrainNames",trainParams.selected])),false, 500,null, null, client.y);
                        }
                    }
                } else if((hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls && !(hardware.mouse.wheelY > y && hardware.mouse.wheelX < x )) || (!(hardware.mouse.moveY > y && hardware.mouse.moveX < x ))) {
                    var minAngle = 10;
                    var cAngle;
                    if(hardware.mouse.wheelScrollY !== 0 && hardware.mouse.wheelScrolls && !(hardware.mouse.wheelY > y && hardware.mouse.wheelX < x)) {
                        var angle = classicUI.transformer.input.angle * (hardware.mouse.wheelScrollY < 0 ? 1.1 : 0.9);
                        classicUI.transformer.input.angle = angle >= 0 ? angle <= classicUI.transformer.input.maxAngle ? angle : classicUI.transformer.input.maxAngle : 0;
                    } else {
                        var angle;
                        if (hardware.mouse.moveY>y){
                            angle = Math.PI + Math.abs(Math.atan(((hardware.mouse.moveY-y)/(hardware.mouse.moveX-x))));
                        } else if (hardware.mouse.moveY<y && hardware.mouse.moveX > x){
                            angle = Math.PI - Math.abs(Math.atan(((hardware.mouse.moveY-y)/(hardware.mouse.moveX-x))));  
                        } else {
                            angle = Math.abs(Math.atan(((hardware.mouse.moveY-y)/(hardware.mouse.moveX-x))));
                        }  
                        if(hardware.mouse.isHold){
                            classicUI.transformer.input.angle = angle >= 0 ? angle <= classicUI.transformer.input.maxAngle ? angle : classicUI.transformer.input.maxAngle : 0;
                        }
                    }
                    cAngle = classicUI.transformer.input.angle/classicUI.transformer.input.maxAngle*100;
                    cAngle = cAngle < minAngle ? 0 : cAngle;
                    if (hardware.mouse.wheelScrollY < 0 && hardware.mouse.wheelScrolls && !(hardware.mouse.wheelY > y && hardware.mouse.wheelX < x) && cAngle === 0) {
                        cAngle = minAngle;
                        classicUI.transformer.input.angle = cAngle/100*classicUI.transformer.input.maxAngle;
                    }
                    if(cAngle >= minAngle && trains[trainParams.selected].accelerationSpeed > 0 && trains[trainParams.selected].speedInPercent != cAngle) {
                        trains[trainParams.selected].accelerationSpeedCustom = (trains[trainParams.selected].currentSpeedInPercent)/cAngle;
                    }
                    if(cAngle >= minAngle) {
                        trains[trainParams.selected].speedInPercent = cAngle;
                    } else {
                        hardware.mouse.isHold = false;
                    }
                    if(cAngle < minAngle && trains[trainParams.selected].accelerationSpeed > 0){ 
                        trains[trainParams.selected].accelerationSpeed *= -1;    
                        notify (formatJSString(getString("appScreenObjectStops", "."), getString(["appScreenTrainNames",trainParams.selected])),false, 500,null, null, client.y);
                    } else if(cAngle >= minAngle && !trains[trainParams.selected].move) {
                        trains[trainParams.selected].move = true;
                        notify (formatJSString(getString("appScreenObjectStarts", "."), getString(["appScreenTrainNames",trainParams.selected])),false, 500,null, null, client.y);
                    } else if (cAngle >= minAngle && trains[trainParams.selected].accelerationSpeed < 0) {
                        trains[trainParams.selected].accelerationSpeed *=-1;
                    }
                } else {
                    hardware.mouse.isHold = false;
                }
            } else {
                classicUI.transformer.input.angle = 0;
                trains[trainParams.selected].speedInPercent = 0;
                trains[trainParams.selected].move =  false;
                hardware.mouse.isHold = false;
            }
 
        } else {
            context.restore();
            context.restore();
        }
        if(debug){
            context.save();
            var x = classicUI.transformer.x+classicUI.transformer.width/2+ classicUI.transformer.input.diffY*Math.sin(classicUI.transformer.angle);
            var y = classicUI.transformer.y+classicUI.transformer.height/2- classicUI.transformer.input.diffY*Math.cos( classicUI.transformer.angle);
            context.fillStyle = "red";
            context.fillRect(x-2,y-2,4,4);
            var a = -(classicUI.transformer.input.diffY-classicUI.transformer.input.height/2); var b = classicUI.transformer.width/2-(classicUI.transformer.width/2-classicUI.transformer.input.width/2);
            var c = classicUI.transformer.input.diffY+classicUI.transformer.input.height/2; var d = b;
            var x1 = classicUI.transformer.x+classicUI.transformer.width/2; var y1 =classicUI.transformer.y+classicUI.transformer.height/2;
            var x =[x1+c*Math.sin(classicUI.transformer.angle)-d*Math.cos(classicUI.transformer.angle),x1+c*Math.sin(classicUI.transformer.angle), x1+c*Math.sin(classicUI.transformer.angle)+d*Math.cos(classicUI.transformer.angle), x1 -(a+b)*Math.cos(classicUI.transformer.angle),x1-a*Math.cos(classicUI.transformer.angle),x1 -(a-b)*Math.cos(classicUI.transformer.angle)];
            var y =[y1-c*Math.cos(classicUI.transformer.angle)-d*Math.sin(classicUI.transformer.angle),y1-c*Math.cos(classicUI.transformer.angle),y1-c*Math.cos(classicUI.transformer.angle)+d*Math.sin(classicUI.transformer.angle), y1+(a-b)*Math.sin(classicUI.transformer.angle),y1+a*Math.sin(classicUI.transformer.angle),y1+(a+b)*Math.sin(classicUI.transformer.angle)];
            context.fillRect(x[0],y[0],4,4);
            context.fillRect(x[1],y[1],4,4);
            context.fillRect(x[2],y[2],4,4);
            context.fillRect(x[3],y[3],4,4);
            context.fillRect(x[4],y[4],4,4);
            context.fillRect(x[5],y[5],4,4);
            context.fillStyle = "black";
            var x=x1+ classicUI.transformer.input.diffY*Math.sin(classicUI.transformer.angle);
            var y=y1- classicUI.transformer.input.diffY*Math.cos(classicUI.transformer.angle);
            context.beginPath();
            context.arc(x,y,classicUI.transformer.input.width/2,Math.PI,Math.PI+classicUI.transformer.input.maxAngle,false);
            context.stroke();
            context.restore();
        }  
    }
    
    /////SWITCHES/////
    classicUI.switches.display = (settings.showSwitches) ? true: false;
    var showDuration = 11;
    if(((hardware.mouse.isHold && !inPath && (clickTimeOut === null || clickTimeOut === undefined)) || frameNo-classicUI.switches.lastStateChange < 3*showDuration) && classicUI.switches.display){
        Object.keys(switches).forEach(function(key) {
            Object.keys(switches[key]).forEach(function(side) {
                context.save();
                context.beginPath();
                context.arc(background.x+switches[key][side].x, background.y+switches[key][side].y, classicUI.switches.radius, 0, 2*Math.PI);
                if ((context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && hardware.mouse.isHold) || (frameNo-classicUI.switches.lastStateChange < 3*showDuration && key == classicUI.switches.lastStateChangeKey && side == classicUI.switches.lastStateChangeSide)) {
                    if(context.isPointInPath(hardware.mouse.moveX, hardware.mouse.moveY) && hardware.mouse.isHold) {
                        switches[key][side].turned = !switches[key][side].turned;
                        hardware.mouse.isHold = false;
                        notify (getString("appScreenSwitchTurns", "."),false, 500,null, null, client.y);
                        classicUI.switches.lastStateChangeKey = key;
                        classicUI.switches.lastStateChangeSide = side;
                        classicUI.switches.lastStateChange = frameNo;
                        context.fillStyle = switches[key][side].turned ? "rgba(144, 255, 144,1)" : "rgba(255,0,0,1)";
                        context.closePath();
                        context.fill();
                        context.restore();
                    } else if (!hardware.mouse.isHold && frameNo-classicUI.switches.lastStateChange < showDuration) {
                        context.fillStyle = switches[key][side].turned ? "rgba(144, 255, 144,1)" : "rgba(255,0,0,1)";
                        context.closePath();
                        context.fill();
                        context.restore();
                    } else if (!hardware.mouse.isHold) {
                        context.closePath();
                        context.restore();
                        context.save();
                        context.beginPath();
                        var fac = (1-((frameNo-showDuration-classicUI.switches.lastStateChange))/(2*showDuration));
                        context.fillStyle = switches[key][side].turned ? "rgba(144, 255, 144," + fac + ")" : "rgba(255,0,0," + fac + ")";
                        context.arc(background.x+switches[key][side].x, background.y+switches[key][side].y, fac*classicUI.switches.radius, 0, 2*Math.PI);
                        context.closePath();
                        context.fill();
                        context.restore();
                    }
                } else {
                    context.closePath();
                    context.restore(); 
                }
            });
        });
    }
    if(hardware.mouse.isHold && !inPath && (clickTimeOut === null || clickTimeOut === undefined) && classicUI.switches.display){
        Object.keys(switches).forEach(function(key) {
            Object.keys(switches[key]).forEach(function(side) {
                context.save();
                context.lineWidth = 5;
                context.translate(background.x+switches[key][side].x, background.y+switches[key][side].y);
                if( switches[key][side].turned ){
                    classicUISwicthesLocate(switches[key][side].angles.normal, 0.9 * classicUI.switches.radius, "rgba(255, 235, 235, 1)");
                    classicUISwicthesLocate(switches[key][side].angles.turned, 1.25 * classicUI.switches.radius, "rgba(170, 255, 170,1)");
                } else {
                    classicUISwicthesLocate(switches[key][side].angles.turned, 0.9 * classicUI.switches.radius , "rgba(235, 255, 235, 1)");
                    classicUISwicthesLocate(switches[key][side].angles.normal, 1.25 * classicUI.switches.radius , "rgba(255,40,40,1)");
                }
                context.save();
                context.beginPath();
                context.lineWidth = 5;
                context.arc(0, 0, 0.2*classicUI.switches.radius + (konamistate < 0 ? Math.random()*0.3*classicUI.switches.radius : 0), 0, 2*Math.PI);
                context.closePath();
                context.fillStyle = switches[key][side].turned ? "rgba(144, 238, 144,1)" : "rgba(255,0,0,1)";
                context.fill();
                context.restore();
                context.restore();
                if(debug) {
                    context.save();
                    context.beginPath();
                    context.lineWidth = 1;
                    context.arc(background.x+switches[key][side].x, background.y+switches[key][side].y, classicUI.switches.radius, 0, 2*Math.PI);
                    context.closePath();
                    context.strokeStyle = switches[key][side].turned ? "rgba(144, 238, 144,1)" : "rgba(255,0,0,1)";
                    context.stroke();
                    context.restore();
                }                
            });
        });
    }
    
    /////BACKGROUND/Margins-2/////    
    if(konamistate < 0) {
        context.save();
        var bgGradient = context.createRadialGradient(0,canvas.height/2,canvas.height/2,canvas.width+canvas.height/2,canvas.height/2,canvas.height/2);
        bgGradient.addColorStop(0, "red");
        bgGradient.addColorStop(0.2,"orange");
        bgGradient.addColorStop(0.4,"yellow");
        bgGradient.addColorStop(0.6,"lightgreen");
        bgGradient.addColorStop(0.8,"blue");
        bgGradient.addColorStop(1,"violet");
        context.fillStyle = bgGradient;
        context.fillRect(0,0,background.x,canvas.height);
        context.fillRect(0,0,canvas.width,background.y);
        context.fillRect(canvas.width-background.x,0,background.x,canvas.height);
        context.fillRect(0,canvas.height-background.y,canvas.width,background.y);
        if(konamistate == -1) {
            context.fillStyle = "black";
            context.fillRect(background.x,background.y,background.width,background.height);
            context.textAlign = "center";
            context.fillStyle = bgGradient;
            var konamiText = getString("appScreenKonami", "!");
            context.font = measureFontSize(konamiText,"monospace",100,background.width/1.1,5, background.width/300, 0);
            context.fillText(konamiText,background.x+background.width/2,background.y+background.height/2); 
            context.fillText(getString("appScreenKonamiIconRow"),background.x+background.width/2,background.y+background.height/4); 
            context.fillText(getString("appScreenKonamiIconRow"),background.x+background.width/2,background.y+background.height/2+background.height/4); 
        }
        context.restore();
        context.save();
        var imgData = context.getImageData(background.x, background.y, background.width, background.height);
        var data = imgData.data;
        for (var i = 0; i < data.length; i += 8) {
            data[i] = data[i+4] = Math.min(255,data[i] < 120 ? data[i]/1.3 : data[i]*1.1);
            data[i+1] = data[i+5] = Math.min(255,data[i+1] < 120 ? data[i+1]/1.3 : data[i+1]*1.1);
            data[i+2] = data[i+6] = Math.min(255,data[i+2] < 120 ? data[i+2]/1.3 : data[i+2]*1.1);
        }
        context.putImageData(imgData, background.x, background.y);
        context.restore();
    } else {
        context.save();
        var bgGradient = context.createLinearGradient(0,0,canvas.width,canvas.height/2);
        bgGradient.addColorStop(0, "rgba(0,0,0,1)");
        bgGradient.addColorStop(0.2, "rgba(0,0,0,0.95)");
        bgGradient.addColorStop(0.4, "rgba(0,0,0,0.85)");
        bgGradient.addColorStop(0.6, "rgba(0,0,0,0.85)");
        bgGradient.addColorStop(0.8, "rgba(0,0,0,0.95)");
        bgGradient.addColorStop(1, "rgba(0,0,0,0.9)");
        context.fillStyle = bgGradient;
        context.fillRect(0,0,background.x,canvas.height);
        context.fillRect(0,0,canvas.width,background.y);
        context.fillRect(canvas.width-background.x,0,background.x,canvas.height);
        context.fillRect(0,canvas.height-background.y,canvas.width,background.y);
        context.restore();
    }
    
    /////CURSOR/2/////
    if(settings.cursorascircle && client.chosenInputMethod == "mouse" && (hardware.mouse.isMoving || hardware.mouse.isHold) && hardware.mouse.cursor != "none") {
        context.save();
        context.translate(hardware.mouse.moveX, hardware.mouse.moveY);
        context.fillStyle = hardware.mouse.isHold && hardware.mouse.cursor == "pointer" ? "rgba(65,56,65," + (Math.random() * (0.3) + 0.6) + ")" : hardware.mouse.isHold ? "rgba(144,64,64," + (Math.random() * (0.3) + 0.6) + ")" : hardware.mouse.cursor == "pointer" ? "rgba(127,111,127," + (Math.random() * (0.3) + 0.6) + ")" : "rgba(255,250,240,0.5)";
        var rectsize = canvas.width / 75;
        context.beginPath();
        context.arc(0,0,rectsize/2,0,2*Math.PI);
        context.fill();
        context.fillStyle = hardware.mouse.isHold && hardware.mouse.cursor == "pointer" ? "rgba(50,45,50,1)" : hardware.mouse.isHold ? "rgba(200,64,64,1)" : hardware.mouse.cursor == "pointer" ? "rgba(100,90,100,1)" : "rgba((255,250,240,0.5)";
        context.beginPath();
        context.arc(0,0,rectsize/4,0,2*Math.PI);
        context.fill();
        context.restore();
    }
    hardware.mouse.wheelScrolls = false;
    
    /////REPAINT/////
    window.requestAnimationFrame(animateObjects);

}

/**************
Variablen-Namen
**************/

var settings = {};

var frameNo = 0;
var canvas;
var context;
var resized = false;

var movingTimeOut;
var clickTimeOut;
var longTouchTime = 500;
var longTouchWaitTime = Math.floor(longTouchTime*0.8);
var doubleClickTime = 100;
var doubleClickWaitTime = doubleClickTime*2;

var konamistate = 0;
var konamiTimeOut;

var pics = [{id: 0, extension: "png"},{id: 1, extension: "png"},{id: 2, extension: "png"},{id: 3, extension: "png"},{id: 4, extension: "png"},{id: 5, extension: "png"},{id: 6, extension: "png"},{id: 7, extension: "png"},{id: 8, extension: "png"},{id: 9, extension: "jpg"},{id: 10, extension: "png"},{id: 11, extension: "png"},{id: 12, extension: "png"},{id: 13, extension: "png"},{id: 14, extension: "png"},{id: 15, extension: "png"},{id: 16, extension: "png"},{id: 17, extension: "png"}];

var background = {src: 9, secondLayer: 10};

var rotationPoints = {inner:{narrow:{x:[0,0,0,0],y:[0,0,0,0]}, wide:{x:[0,0,0,0],y:[0,0,0,0]}},outer:{narrow:{x:[0,0,0,0],y:[0,0,0,0]}, altState3:{x:[0,0],y:[0,0]} },inner2outer:{left:{x:[0,0],y:[0,0]}, right:{x:[0,0],y:[0,0]}}};
var trains =  [{src: 1, fac: 0.051, speedFac: (1/500), accelerationSpeedStartFac: 0.02, accelerationSpeedFac: 1.008, circle: rotationPoints.inner.wide, circleFamily: rotationPoints.inner, standardDirectionStartValue: {switches: true, noSwicthes: true}, bogieDistance: 0.15, state: 1, cars:[{src: 2, fac: 0.060, bogieDistance: 0.15},{src: 2, fac: 0.060, bogieDistance: 0.15},{src: 2, fac: 0.060, bogieDistance: 0.15},{src: 3, fac: 0.044, bogieDistance: 0.15}]},{src: 4,fac: 0.093, speedFac: (1/250), accelerationSpeedStartFac: 0.035, accelerationSpeedFac: 1.013, circle: rotationPoints.outer.narrow, circleFamily: rotationPoints.outer, standardDirectionStartValue: {switches: true, noSwicthes: false}, bogieDistance: 0.15, state: 3, cars:[{src: 5, fac: 0.11, bogieDistance: 0.15},{src: 6, fac: 0.11, bogieDistance: 0.15}, {src: 7, fac: 0.093, bogieDistance: 0.15}]},{src: 8, fac: 0.068, speedFac: (1/375), accelerationSpeedStartFac: 0.04, accelerationSpeedFac: 1.01, circle: rotationPoints.inner.narrow, circleFamily: rotationPoints.inner, standardDirectionStartValue: {switches: false, noSwicthes: true}, bogieDistance: 0.15, state: 1, cars:[]}];
var switches = {inner2outer: {left: {turned: false, angles: {normal: 1.01*Math.PI, turned: 0.941*Math.PI}}, right: {turned: false, angles: {normal: 1.5*Math.PI, turned: 1.56*Math.PI}}}, outer2inner: {left: {turned: false, angles: {normal: 0.25*Math.PI, turned: 2.2*Math.PI}}, right: {turned: false, angles: {normal: 0.27*Math.PI, turned: 0.35*Math.PI}}}, innerWide: {left: {turned: true, angles: {normal: 1.44*Math.PI, turned: 1.37*Math.PI}}, right: {turned: false, angles: {normal: 1.02*Math.PI, turned: 1.1*Math.PI}}}, outerAltState3: {left: {turned: false, angles: {normal: 1.75*Math.PI, turned: 1.85*Math.PI}}, right: {turned: false, angles: {normal: 0.75*Math.PI, turned: 0.65*Math.PI}}}};
var trainParams = {selected: Math.floor(Math.random()*trains.length), margin: 25};
              
var cars = [{src: 16, fac: 0.02, speed: 0.0008, startFrameFac: 0.65, angles: {start: Math.PI,normal: 0}},{src: 17, fac: 0.02, speed: 0.001, startFrameFac: 0.335, angles: {start: 0, normal: Math.PI}},{src: 0, fac: 0.0202, speed: 0.00082, startFrameFac: 0.65, angles: {start: Math.PI, normal: 0}}];
var carPaths = [{start: [{type: "curve_right", x:[0.29,0.29],y:[0.38,0.227]}], normal: [{type: "curve_hright", x:[0.29,0.29],y:[0.227,0.347]},{type: "linear_vertical", x:[0,0], y: [0,0]},{type: "curve_hright2", x:[0,0], y: [0.282,0.402]},{type: "curve_l2r", x:[0,0.25], y: [0.402,0.412]},{type: "linear", x: [0.25,0.225], y: [0.412,0.412]},{type: "curve_right", x: [0.225,0.225], y: [0.412,0.227]},{type: "linear", x:[0.225,0.29], y:[0.227,0.227]}]},{start: [{type: "curve_left", x:[0.26,0.26], y: [0.3,0.198]},{type: "curve_r2l", x:[0.26,0.216], y: [0.198,0.197]}], normal: [{type: "curve_left", x:[0.216,0.216], y: [0.197,0.419]},{type: "linear", x:[0.216,0.246], y:[0.419,419]},{type: "curve_r2l", x:[0.246,0.286], y:[0.419,0.43]},{type: "linear", x:[0.286,0.31], y:[0.43,0.43]},{type: "curve_hleft", x:[0.31,0.31], y: [0.43,0.33]},{type: "linear_vertical", x:[0,0], y: [0,0]},{type: "curve_hleft2", x:[0,0], y: [0.347,0.197]},{type: "linear", x:[0,0.216], y:[0.197,0.197]},{type: "curve_left", x:[0.216,0.216], y: [0.197,0.419]},{type: "linear", x:[0.216,0.246], y:[0.419,419]},{type: "curve_r2l", x:[0.246,0.276], y:[0.419,0.434]},{type: "linear", x:[0.276,0.38], y:[0.434,434]},{type: "curve_l2r", x:[0.38,0.46], y:[0.434,0.419]},{type: "linear", x:[0.46,0.631], y:[0.419,0.419]},{type: "curve_r2l", x:[0.631,0.665], y:[0.419,0.43]},{type: "curve_left", x:[0.665,0.665], y: [0.43,0.322]},{type: "curve_l2r", x:[0.665,0.59], y: [0.322,0.39]},{type: "linear", x:[0.59,0.339], y:[0.39,0.39]},{type: "curve_hright", x:[0.339,0.339], y: [0.39,0.32]},{type: "linear_vertical", x:[0,0], y: [0,0]},{type: "curve_hleft2", x:[0,0], y: [0.347,0.197]},{type: "linear", x:[0,0.216], y:[0.197,0.197]}]},{start: [{type: "curve_right", x:[0.2773,0.2773],y:[0.38,0.227]},{type: "linear", x:[0.2773,0.29],y:[0.227,0.227]}], normal: [{type: "curve_hright", x:[0.29,0.29],y:[0.227,0.347]},{type: "linear_vertical", x:[0,0], y: [0,0]},{type: "curve_hleft2", x:[0,0], y: [0.299,0.419]},{type: "linear", x:[0,0.631], y:[0.419,0.419]},{type: "curve_r2l", x:[0.631,0.665], y:[0.419,0.43]},{type: "curve_left", x:[0.665,0.665], y: [0.43,0.322]},{type: "curve_l2r", x:[0.665,0.59], y: [0.322,0.39]},{type: "linear", x:[0.59,0.339], y:[0.39,0.39]},{type: "curve_l2r", x:[0.339,0.25], y: [0.39,0.412]},{type: "linear", x: [0.25,0.225], y: [0.412,0.412]},{type: "curve_right", x: [0.225,0.225], y: [0.412,0.227]},{type: "linear", x:[0.225,0.29], y:[0.227,0.227]}]}]; 
var carWays = [];
var carParams = {init: true, wayNo: 10};

var taxOffice = {params: {number: 45, frameNo: 6, frameProbability: 0.6, fire: {x: 0.07, y: 0.06, size: 0.000833, color:{red: {red: 200, green: 0, blue: 0, alpha: 0.4}, yellow: {red: 255, green: 160, blue: 0, alpha: 1}, probability: 0.8}}, smoke: {x: 0.07, y: 0.06, size: 0.02, color: {red: 130, green: 120, blue: 130, alpha: 0.3}}, bluelights: {frameNo: 16, cars: [{frameNo: 0, x: [-0.0105, -0.0026], y: [0.177, 0.0047], size: 0.001},{frameNo: 3, x: [0.0275, -0.00275], y: [0.1472, 0.0092], size: 0.001},{frameNo: 5, x: [0.056, 0.0008], y: [0.18, 0.015], size: 0.001}]}}};

var classicUI = {trainSwitch: {src: 11, selectedTrainDisplay: {}}, transformer: {src:13, asrc: 12, angle:(Math.PI/5),input:{src:14,angle:0,maxAngle:1.5*Math.PI},directionInput:{src:15,}}, switches: {}};

var hardware = {mouse: {moveX:0, moveY:0,downX:0, downY:0, downTime: 0,upX:0, upY:0, upTime: 0, isMoving: false, isHold: false, cursor: "default"}};
var client = {devicePixelRatio: 1};

var debug = false;

/******************************************
*         Window Event Listeners          *
******************************************/

window.onresize = function() {
     
    resized = true;

};

window.onload = function() {
     
    function styleTheProcentCounter() {
        context.textAlign = "center";
        context.fillStyle = "white";
        context.font = "300% Arial";
    }

    function chooseInputMethod(event){
        var type = event.type;           
        canvas.removeEventListener("touchstart",chooseInputMethod);
        canvas.removeEventListener("mousemove",chooseInputMethod);
        canvas.addEventListener("touchmove", getTouchMove, false);
        canvas.addEventListener("touchstart", getTouchStart, false);
        canvas.addEventListener("touchleave", getTouchLeave, false);
        canvas.addEventListener("touchend", getTouchEnd, false); 
        canvas.addEventListener("mousemove", onMouseMove, false);
        canvas.addEventListener("mousedown", onMouseDown, false);
        canvas.addEventListener("mouseup", onMouseUp, false); 
        canvas.addEventListener("mouseout", onMouseOut, false);
        canvas.addEventListener("wheel", onMouseWheel, false); 
        if(type == "touchstart"){
            client.chosenInputMethod = "touch";
            getTouchStart(event);
        } else {
            client.chosenInputMethod = "mouse";
            onMouseMove(event);
        }
    }    

    function initialDisplay() {
        
        function defineCarParams(){ 
            cars.forEach(function(car, i){
                car.speed *= background.width;
                car.collStop = true;
                if(i === 0){
                    carParams.lowestSpeedNo = i;
                } else if (car.speed < cars[carParams.lowestSpeedNo].speed) {
                    carParams.lowestSpeedNo = i;
                }
            });
            cars.forEach(function(car,i){  
                Object.keys(carPaths[i]).forEach(function(cType) {            
                    carPaths[i][cType].forEach(function(cPoint){
                        for(var k = 0; k < cPoint.x.length && k < cPoint.y.length; k++){
                            cPoint.x[k]*=background.width;
                            cPoint.y[k]*=background.height;
                        }
                    });
                    for(var j = 0; j < carPaths[i][cType].length; j++){
                        for(var k = 0; k < carPaths[i][cType][j].type.length; k++){
                            switch(carPaths[i][cType][j].type){
                                case "linear_vertical":
                                    carPaths[i][cType][j].x[0] = carPaths[i][cType][j].x[1] = carPaths[i][cType][j-1].x[1]+Math.abs((carPaths[i][cType][j-1].y[1]-carPaths[i][cType][j-1].y[0])/2)*((carPaths[i][cType][j-1].type == "curve_hright") ? 1 : -1)*((carPaths[i][cType][j-1].y[1] > carPaths[i][cType][j-1].y[0]) ? 1 : -1);
                                    carPaths[i][cType][j].y[0] = carPaths[i][cType][j-1].y[0]+(carPaths[i][cType][j-1].y[1]-carPaths[i][cType][j-1].y[0])/2;
                                    carPaths[i][cType][j].y[1] = carPaths[i][cType][j+1].y[1]+(carPaths[i][cType][j+1].y[0]-carPaths[i][cType][j+1].y[1])/2;
                                break;    
                                case "curve_hright2":
                                    var x0 = carPaths[i][cType][j-1].x[0]-(carPaths[i][cType][j].y[1]-carPaths[i][cType][j].y[0])/2;
                                    carPaths[i][cType][j].x =[x0,x0];
                                    carPaths[i][cType][j+1 >= carPaths[i][cType].length ? 0 : j+1].x[0]=x0;
                                break;
                                case "curve_hleft2":
                                    var x0 = carPaths[i][cType][j-1].x[0]-(carPaths[i][cType][j].y[0]-carPaths[i][cType][j].y[1])/2;
                                    carPaths[i][cType][j].x =[x0,x0];
                                    carPaths[i][cType][j+1 >= carPaths[i][cType].length ? 0 : j+1].x[0]=x0;
                                break;
                            }
                        }
                    }
                    if(typeof carWays[i] == "undefined"){
                        carWays[i] = {};
                    }
                    carWays[i][cType] = defineCarWays(cType, ((typeof carPaths[i].start == "undefined" && cType == "normal") || (cType == "start")), i);
                });
            });
        }

        function placeTrainsAtInitialPositions() {
  
            trains.forEach(function(train){
                train.standardDirection = settings.showSwitches ? train.standardDirectionStartValue.switches : train.standardDirectionStartValue.noSwicthes;
                delete train.standardDirectionStartValue;
            
                train.width = train.fac * background.width;
                train.height = train.fac *(pics[train.src].height * (background.width / pics[train.src].width)); 
                train.move = train.switchCircles = false;
                train.front = {};
                train.back = {};
                train.front.state = train.back.state = train.state;
           
                var currentTrainMargin = train.width/trainParams.margin;
                var currentTrainWidth = train.width;
            
                train.cars.forEach(function(car){
                    car.width = car.fac * background.width;
                    car.height = car.fac *(pics[car.src].height * (background.width / pics[car.src].width));
                    currentTrainWidth += car.width + currentTrainMargin;
                    car.front = {};
                    car.back = {};
                    car.front.state = car.back.state = train.state;
                });
                if(train.state == 1){
                    train.front.angle = train.back.angle = train.displayAngle = Math.asin((train.circle.y[1]-train.circle.y[0])/(train.circle.x[1]-train.circle.x[0]));
                    var hypotenuse = Math.sqrt(Math.pow(train.circle.x[1] - train.circle.x[0],2)+Math.pow((train.circle.y[1]) - train.circle.y[0],2),2);
                    train.front.x = background.x + train.circle.x[0] + (hypotenuse/2)*Math.cos(train.displayAngle) + (currentTrainWidth/2-train.width*train.bogieDistance)*Math.cos(train.displayAngle);
                    train.front.y = background.y + train.circle.y[0] + (hypotenuse/2)*Math.sin(train.displayAngle) + (currentTrainWidth/2-train.width*train.bogieDistance)*Math.sin(train.displayAngle);
                    train.back.x = background.x + train.circle.x[0] + (hypotenuse/2)*Math.cos(train.displayAngle) + (currentTrainWidth/2-train.width+train.width*train.bogieDistance)*Math.cos(train.displayAngle);
                    train.back.y = background.y + train.circle.y[0] + (hypotenuse/2)*Math.sin(train.displayAngle) + (currentTrainWidth/2-train.width+train.width*train.bogieDistance)*Math.sin(train.displayAngle);
                    train.x = background.x + train.circle.x[0] + (hypotenuse/2)*Math.cos(train.displayAngle) + (currentTrainWidth/2-train.width/2)*Math.cos(train.displayAngle);
                    train.y = background.y + train.circle.y[0] + (hypotenuse/2)*Math.sin(train.displayAngle) + (currentTrainWidth/2-train.width/2)*Math.sin(train.displayAngle);
                    for(var j = 0; j < train.cars.length; j++){
                        train.cars[j].displayAngle = train.displayAngle;
                        train.cars[j].front.angle = train.front.angle;
                        train.cars[j].back.angle = train.back.angle; 
                        if(j >= 1){
                            train.cars[j].front.x = train.cars[j-1].x - Math.cos(train.cars[j].displayAngle)*(train.cars[j].width*train.bogieDistance +currentTrainMargin+train.cars[j-1].width/2);
                            train.cars[j].front.y = train.cars[j-1].y - Math.sin(train.cars[j].displayAngle)*(train.cars[j].width*train.bogieDistance +currentTrainMargin+train.cars[j-1].width/2);
                            train.cars[j].back.x = train.cars[j-1].x - Math.cos(train.cars[j].displayAngle)*(train.cars[j].width*(1-train.bogieDistance)+currentTrainMargin+train.cars[j-1].width/2);
                            train.cars[j].back.y = train.cars[j-1].y - Math.sin(train.cars[j].displayAngle)*(train.cars[j].width*(1-train.bogieDistance)+currentTrainMargin+train.cars[j-1].width/2);
                            train.cars[j].x = train.cars[j-1].x - Math.cos(train.cars[j].displayAngle)*(train.cars[j].width/2+currentTrainMargin+train.cars[j-1].width/2);
                            train.cars[j].y = train.cars[j-1].y - Math.sin(train.cars[j].displayAngle)*(train.cars[j].width/2+currentTrainMargin+train.cars[j-1].width/2);
                        } else {
                            train.cars[j].front.x = train.x - Math.cos(train.cars[j].displayAngle)*(train.cars[j].width*train.bogieDistance +currentTrainMargin+train.width/2);
                            train.cars[j].front.y = train.y - Math.sin(train.cars[j].displayAngle)*(train.cars[j].width*train.bogieDistance +currentTrainMargin+train.width/2);
                            train.cars[j].back.x = train.x - Math.cos(train.cars[j].displayAngle)*(train.cars[j].width*(1-train.bogieDistance)+currentTrainMargin+train.width/2);
                            train.cars[j].back.y = train.y - Math.sin(train.cars[j].displayAngle)*(train.cars[j].width*(1-train.bogieDistance)+currentTrainMargin+train.width/2);
                            train.cars[j].x = train.x - Math.cos(train.cars[j].displayAngle)*(train.cars[j].width/2+currentTrainMargin+train.width/2);
                            train.cars[j].y = train.y - Math.sin(train.cars[j].displayAngle)*(train.cars[j].width/2+currentTrainMargin+train.width/2);
                        }
                    }
                } else if(train.state == 3){
                    train.front.angle = train.back.angle = train.displayAngle = Math.PI+Math.asin((train.circle.y[2]-train.circle.y[3])/(train.circle.x[2]-train.circle.x[3]));
                    var hypotenuse = Math.sqrt((Math.pow(((train.circle.x[2]) - train.circle.x[3]),2)+(Math.pow(((train.circle.y[2]) - train.circle.y[3]),2))),2);
                    train.front.x = background.x + train.circle.x[2] - (hypotenuse/2)*Math.cos(train.displayAngle-Math.PI) - (currentTrainWidth/2-train.width*train.bogieDistance)*Math.cos(train.displayAngle-Math.PI);
                    train.front.y = background.y + train.circle.y[2] - (hypotenuse/2)*Math.sin(train.displayAngle-Math.PI) - (currentTrainWidth/2-train.width*train.bogieDistance)*Math.sin(train.displayAngle-Math.PI);
                    train.back.x = background.x + train.circle.x[2] - (hypotenuse/2)*Math.cos(train.displayAngle-Math.PI) - (currentTrainWidth/2-train.width*(1-train.bogieDistance))*Math.cos(train.displayAngle-Math.PI);
                    train.back.y = background.y + train.circle.y[2] - (hypotenuse/2)*Math.sin(train.displayAngle-Math.PI) - (currentTrainWidth/2-train.width*(1-train.bogieDistance))*Math.sin(train.displayAngle-Math.PI);
                    train.x = background.x + train.circle.x[2] - (hypotenuse/2)*Math.cos(train.displayAngle-Math.PI) - (currentTrainWidth/2-train.width/2)*Math.cos(train.displayAngle-Math.PI);
                    train.y = background.y + train.circle.y[2] - (hypotenuse/2)*Math.sin(train.displayAngle-Math.PI) - (currentTrainWidth/2-train.width/2)*Math.sin(train.displayAngle-Math.PI);
                    for(var j = 0; j < train.cars.length; j++){
                        train.cars[j].displayAngle = train.displayAngle;
                        train.cars[j].front.angle = train.front.angle;
                        train.cars[j].back.angle = train.back.angle; 
                        if(j >= 1){
                            train.cars[j].front.x = train.cars[j-1].x + Math.cos(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width*train.bogieDistance+currentTrainMargin+train.cars[j-1].width/2);
                            train.cars[j].front.y = train.cars[j-1].y + Math.sin(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width*train.bogieDistance+currentTrainMargin+train.cars[j-1].width/2);
                            train.cars[j].back.x = train.cars[j-1].x + Math.cos(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width*(1-train.bogieDistance)+currentTrainMargin+train.cars[j-1].width/2);
                            train.cars[j].back.y = train.cars[j-1].y + Math.sin(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width*(1-train.bogieDistance)+currentTrainMargin+train.cars[j-1].width/2);
                            train.cars[j].x = train.cars[j-1].x + Math.cos(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width/2+currentTrainMargin+train.cars[j-1].width/2);
                            train.cars[j].y = train.cars[j-1].y + Math.sin(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width/2+currentTrainMargin+train.cars[j-1].width/2);
                        } else {
                            train.cars[j].front.x = train.x + Math.cos(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width*train.bogieDistance+currentTrainMargin+train.width/2);
                            train.cars[j].front.y = train.y + Math.sin(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width*train.bogieDistance+currentTrainMargin+train.width/2);
                            train.cars[j].back.x = train.x + Math.cos(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width*(1-train.bogieDistance)+currentTrainMargin+train.width/2);
                            train.cars[j].back.y = train.y + Math.sin(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width*(1-train.bogieDistance)+currentTrainMargin+train.width/2);
                            train.cars[j].x = train.x + Math.cos(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width/2+currentTrainMargin+train.width/2);
                            train.cars[j].y = train.y + Math.sin(train.cars[j].displayAngle-Math.PI)*(train.cars[j].width/2+currentTrainMargin+train.width/2);
                        }
                    }
                }
                delete train.state;
            });
        }

        function placeCarsAtInitialPositions() {
            for (var i = 0; i < cars.length; i++){
                cars[i].width = cars[i].fac * background.width;
                cars[i].height = cars[i].fac * (pics[cars[i].src].height * (background.width / pics[cars[i].src].width)); 
                cars[i].cType =  typeof carWays[i].start == "undefined" ?  "normal" : "start";
                cars[i].displayAngle = carWays[i][cars[i].cType][cars[i].counter].angle;
                cars[i].x = carWays[i][cars[i].cType][cars[i].counter].x;
                cars[i].y = carWays[i][cars[i].cType][cars[i].counter].y; 
            }  
        }
    
        function defineCarWays(cType, isFirst, i, j, obj, currentObject, stateNullAgain) {

            function curve_right(p){
                if(p.x[0]!=p.x[1]){
                    p.x[1]=p.x[0];
                }
                var radius = Math.abs(p.y[0]-p.y[1])/2;
                var arc = Math.abs(currentObject.angle)*radius;
                arc += currentObject.speed; 
                currentObject.angle = (arc / radius);
                 var chord = 2* radius * Math.sin((currentObject.angle)/2);
                 var gamma = Math.PI/2-(Math.PI-(currentObject.angle))/2;
                 var x = Math.cos(gamma)*chord;
                 var y = Math.sin(gamma)*chord;
                 currentObject.x = ( p.y[1] < p.y[0] ) ? x + p.x[1] : x + p.x[0];
                 currentObject.y = ( p.y[1] < p.y[0] ) ? y + p.y[1] : y + p.y[0];
                if(p.y[1] > p.y[0]) {
                  if(arc >= Math.PI*radius || currentObject.angle >= Math.PI){
                    currentObject.x = p.x[1];
                    currentObject.y = p.y[1]; 
                    currentObject.angle = Math.PI; 
                    currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                  }  
                 } else {  
                  if(arc >= 2*Math.PI*radius || currentObject.angle >= 2*Math.PI){
                    currentObject.x = p.x[1];
                    currentObject.y = p.y[1];
                    currentObject.angle = 0;             
                    currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                  }
                 }
                 currentObject.displayAngle = currentObject.angle;
            }
            
            function curve_left(p){
                if(p.x[0]!=p.x[1]){
                    p.x[1]=p.x[0];
                }
                var radius = Math.abs(p.y[0]-p.y[1])/2;    
                var arc = Math.abs(currentObject.angle)*radius;
                arc += currentObject.speed; 
                currentObject.angle = (arc / radius);
                 var chord = 2* radius * Math.sin((currentObject.angle)/2);
                 var gamma = Math.PI/2-(Math.PI-(currentObject.angle))/2;
                 var x = Math.cos(gamma)*chord;
                 var y = Math.sin(gamma)*chord;
                 currentObject.x = ( p.y[1] < p.y[0] ) ? p.x[0] + x : p.x[1] + x;
                 currentObject.y = ( p.y[1] < p.y[0] ) ? p.y[0] - y : p.y[1] - y;        
                 if(p.y[1] > p.y[0]) {  
                  if(arc >= 2*Math.PI*radius || currentObject.angle >= 2*Math.PI){
                    currentObject.x = p.x[1];
                    currentObject.y = p.y[1]; 
                    currentObject.angle = 0; 
                    currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                  }  
                 } else {  
                  if(arc >= Math.PI*radius || currentObject.angle >= Math.PI){
                    currentObject.x = p.x[1];
                    currentObject.y = p.y[1];
                    currentObject.angle = Math.PI;
                    currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                  }
                 }
                 currentObject.displayAngle = -currentObject.angle;
            }
            
            if(typeof j == "undefined") {
                j = 0;
            }
            if(typeof obj == "undefined") {
                obj = [];
            }
            if(typeof currentObject == "undefined"){
                currentObject = copyJSObject(cars[i]);
                currentObject.state = 0;
                currentObject.angle = currentObject.displayAngle = cars[i].angles[cType];
                currentObject.x = carPaths[i][cType][0].x[0];
                currentObject.y = carPaths[i][cType][0].y[0];
            }
            if(typeof stateNullAgain == "undefined"){
                stateNullAgain = false;
            }
            obj[j] = {};
            obj[j].x = currentObject.x;
            obj[j].y = currentObject.y;
            while(currentObject.displayAngle  < 0) {
                currentObject.displayAngle  += Math.PI*2;
            }

            while (currentObject.displayAngle  >= Math.PI*2){
                currentObject.displayAngle -= Math.PI*2;
            }
            obj[j].angle = currentObject.displayAngle;
            switch(carPaths[i][cType][currentObject.state].type){

                case "linear": 
                    currentObject.angle = currentObject.angle < Math.PI/2 ? 0 : Math.PI;
                    currentObject.x += currentObject.speed*(currentObject.angle < Math.PI/2 ? 1 : -1); 
                    if(currentObject.angle < Math.PI/2) {  
                        if(currentObject.x >= carPaths[i][cType][currentObject.state].x[1]){
                            currentObject.x = carPaths[i][cType][currentObject.state].x[1];
                            currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                        }
                    } else {           
                        if(currentObject.x <= carPaths[i][cType][currentObject.state].x[1]){
                            currentObject.x = carPaths[i][cType][currentObject.state].x[1];
                            currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                        }
                    }
                    currentObject.displayAngle = currentObject.angle;
                break;

                case "linear_vertical":
                    currentObject.angle = currentObject.angle < Math.PI ? 0.5*Math.PI : 1.5*Math.PI;
                    currentObject.y += currentObject.speed*(currentObject.angle < Math.PI ? 1 : -1); 
                    if(currentObject.angle < Math.PI) {  
                        if(currentObject.y >= carPaths[i][cType][currentObject.state].y[1]){
                            currentObject.y = carPaths[i][cType][currentObject.state].y[1];
                            currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                        }
                    } else {
                        if(currentObject.y <= carPaths[i][cType][currentObject.state].y[1]){
                            currentObject.y = carPaths[i][cType][currentObject.state].y[1];
                            currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                        }
                    }
                    currentObject.displayAngle = currentObject.angle;
                break;

                case "curve_right":
                    curve_right(carPaths[i][cType][currentObject.state]);
                break;

                case "curve_left":
                    curve_left(carPaths[i][cType][currentObject.state]);
                break;

                case "curve_r2l":
                   var p = copyJSObject(carPaths[i][cType][currentObject.state]);
                   if(carPaths[i][cType][currentObject.state].y[0] < carPaths[i][cType][currentObject.state].y[1]) {
                        var dx = (carPaths[i][cType][currentObject.state].x[1]-carPaths[i][cType][currentObject.state].x[0])/2;
                        var dy = (carPaths[i][cType][currentObject.state].y[1]-carPaths[i][cType][currentObject.state].y[0])/2;
                        if(currentObject.angle <= Math.PI){
                            p.y[1] = carPaths[i][cType][currentObject.state].y[0]+2*((Math.pow(dy,2)+Math.pow(dx,2))/(2*dy));
                            curve_right(p);
                            if(currentObject.y >= carPaths[i][cType][currentObject.state].y[0]+(carPaths[i][cType][currentObject.state].y[1]-carPaths[i][cType][currentObject.state].y[0])/2) {
                                var diff = currentObject.angle-Math.PI*45/180;
                                currentObject.angle = Math.PI*315/180-diff;
                                currentObject.x = carPaths[i][cType][currentObject.state].x[0]-(carPaths[i][cType][currentObject.state].x[0]-carPaths[i][cType][currentObject.state].x[1])/2;
                                currentObject.y = carPaths[i][cType][currentObject.state].y[0]+(carPaths[i][cType][currentObject.state].y[1]-carPaths[i][cType][currentObject.state].y[0])/2;
                            }
                        } else {
                            p.x[0] = carPaths[i][cType][currentObject.state].x[1];
                            p.y[0] = carPaths[i][cType][currentObject.state].y[1]-2*((Math.pow(dy,2)+Math.pow(dx,2))/(2*dy));
                            curve_left(p);
                        }
                    } else {
                        var dx = (carPaths[i][cType][currentObject.state].x[0]-carPaths[i][cType][currentObject.state].x[1])/2;
                        var dy = (carPaths[i][cType][currentObject.state].y[0]-carPaths[i][cType][currentObject.state].y[1])/2;
                        if(currentObject.angle >= Math.PI){
                            p.y[1] = carPaths[i][cType][currentObject.state].y[0]-2*((Math.pow(dy,2)+Math.pow(dx,2))/(2*dy));
                            curve_right(p);
                            if(currentObject.y <= carPaths[i][cType][currentObject.state].y[0]-(carPaths[i][cType][currentObject.state].y[0]-carPaths[i][cType][currentObject.state].y[1])/2) {
                                var diff = currentObject.angle-Math.PI*225/180;
                                currentObject.angle = Math.PI*135/180-diff;
                                currentObject.x = carPaths[i][cType][currentObject.state].x[0]+(carPaths[i][cType][currentObject.state].x[1]-carPaths[i][cType][currentObject.state].x[0])/2;
                                currentObject.y = carPaths[i][cType][currentObject.state].y[0]-(carPaths[i][cType][currentObject.state].y[0]-carPaths[i][cType][currentObject.state].y[1])/2;
                            }
                        } else {
                            p.x[0] = carPaths[i][cType][currentObject.state].x[1];
                            p.y[0] = carPaths[i][cType][currentObject.state].y[1]+2*((Math.pow(dy,2)+Math.pow(dx,2))/(2*dy));
                            curve_left(p);
                        }
                    }
                break;

                case "curve_l2r":
                    if(carPaths[i][cType][currentObject.state].y[0] < carPaths[i][cType][currentObject.state].y[1]) {
                        var dx = (carPaths[i][cType][currentObject.state].x[0]-carPaths[i][cType][currentObject.state].x[1])/2;
                        var dy = (carPaths[i][cType][currentObject.state].y[1]-carPaths[i][cType][currentObject.state].y[0])/2;
                        var p = copyJSObject(carPaths[i][cType][currentObject.state]);
                        if(currentObject.angle >= Math.PI){
                            p.y[1] = carPaths[i][cType][currentObject.state].y[0]+2*((Math.pow(dy,2)+Math.pow(dx,2))/(2*dy));
                            curve_left(p);
                            if(currentObject.y >= carPaths[i][cType][currentObject.state].y[0]+(carPaths[i][cType][currentObject.state].y[1]-carPaths[i][cType][currentObject.state].y[0])/2) {
                                var diff = currentObject.angle-Math.PI*225/180;
                                currentObject.angle = Math.PI*135/180-diff;    
                                currentObject.x = carPaths[i][cType][currentObject.state].x[0]-(carPaths[i][cType][currentObject.state].x[0]-carPaths[i][cType][currentObject.state].x[1])/2;
                                currentObject.y = carPaths[i][cType][currentObject.state].y[0]+(carPaths[i][cType][currentObject.state].y[1]-carPaths[i][cType][currentObject.state].y[0])/2;
                            }
                        } else {
                            p.x[0] = carPaths[i][cType][currentObject.state].x[1];
                            p.y[0] = carPaths[i][cType][currentObject.state].y[1]-2*((Math.pow(dy,2)+Math.pow(dx,2))/(2*dy));
                            curve_right(p);

                        }
                    } else {
                        var dx = (carPaths[i][cType][currentObject.state].x[1]-carPaths[i][cType][currentObject.state].x[0])/2;
                        var dy = (carPaths[i][cType][currentObject.state].y[0]-carPaths[i][cType][currentObject.state].y[1])/2;
                        var p = copyJSObject(carPaths[i][cType][currentObject.state]);
                        if(currentObject.angle <= Math.PI){
                            p.y[1] = carPaths[i][cType][currentObject.state].y[0]-2*((Math.pow(dy,2)+Math.pow(dx,2))/(2*dy));
                            curve_left(p);
                            if(currentObject.y <= carPaths[i][cType][currentObject.state].y[0]-(carPaths[i][cType][currentObject.state].y[0]-carPaths[i][cType][currentObject.state].y[1])/2) {
                                var diff = currentObject.angle-Math.PI*45/180;
                                currentObject.angle = Math.PI*315/180-diff;
                                currentObject.x = carPaths[i][cType][currentObject.state].x[0]+(carPaths[i][cType][currentObject.state].x[1]-carPaths[i][cType][currentObject.state].x[0])/2;
                                currentObject.y = carPaths[i][cType][currentObject.state].y[0]-(carPaths[i][cType][currentObject.state].y[0]-carPaths[i][cType][currentObject.state].y[1])/2;
                            }
                        } else {
                            p.x[0] = carPaths[i][cType][currentObject.state].x[1];
                            p.y[0] = carPaths[i][cType][currentObject.state].y[1]+2*((Math.pow(dy,2)+Math.pow(dx,2))/(2*dy));
                            curve_right(p);
                        }
                    }
                break;

                case "curve_hright":
                    var p = copyJSObject(carPaths[i][cType][currentObject.state]);
                    curve_right(p);
                    if(p.y[1] > p.y[0]) {  
                        if(currentObject.angle >= 0.5*Math.PI){
                            currentObject.x = p.x[1]+(p.y[1]-p.y[0])/2;
                            currentObject.y = p.y[1]-(p.y[1]-p.y[0])/2; 
                            currentObject.angle = currentObject.displayAngle = 0.5*Math.PI; 
                            currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                        }  
                    } else {  
                        if(currentObject.angle >= 1.5*Math.PI){
                            currentObject.x = p.x[1]-(p.y[0]-p.y[1])/2;
                            currentObject.y = p.y[1]+(p.y[0]-p.y[1])/2;
                            currentObject.angle = currentObject.displayAngle = 1.5*Math.PI;   
                            currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                        }
                     }
                break;

                case "curve_hleft":
                     var p = copyJSObject(carPaths[i][cType][currentObject.state]);
                     curve_left(p);
                     if (p.y[1] > p.y[0]) {  
                        //TODO
                     } else {
                      if(currentObject.angle >= 0.5*Math.PI){
                        currentObject.x = p.x[1]+(p.y[0]-p.y[1])/2;
                        currentObject.y = p.y[1]+(p.y[0]-p.y[1])/2;
                        currentObject.angle = currentObject.displayAngle = 1.5*Math.PI;   
                        currentObject.state = ++currentObject.state >= carPaths[i][cType].length ? (carPaths[i][cType].length == 1 ? -1 : 0) : currentObject.state;
                      }
                     }
                break;
                 
                case "curve_hright2":
                     curve_right(carPaths[i][cType][currentObject.state]);
                break;
                  
                case "curve_hleft2":
                     if((currentObject.angle == 0.5*Math.PI || currentObject.angle == 1.5*Math.PI)){
                        currentObject.angle = (2 * Math.PI - (currentObject.angle));
                     }
                     curve_left(carPaths[i][cType][currentObject.state]);
                break;

            }
            if(!stateNullAgain && (currentObject.state > 0 || currentObject.state == -1)) {
                stateNullAgain = true;
                if(isFirst){
                    cars[i].startFrame = cars[i].counter = Math.floor(cars[i].startFrameFac*j);
                }
            }
            return ((currentObject.state === 0 || currentObject.state == -1)  && stateNullAgain) ? obj : defineCarWays(cType,isFirst,i,++j,obj, currentObject, stateNullAgain);
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        placeBackground();

        defineTrainParams();
        placeTrainsAtInitialPositions();
        
        defineCarParams();
        placeCarsAtInitialPositions();
        
        //TAX OFFICE
        taxOffice.fire = [];
        taxOffice.smoke = [];
        taxOffice.params.fire.x *= background.width;
        taxOffice.params.fire.y *= background.height;
        taxOffice.params.fire.size *= background.width;
        taxOffice.params.smoke.x *= background.width;
        taxOffice.params.smoke.y *= background.height;
        taxOffice.params.smoke.size *= background.width;
        for (var i = 0; i <  taxOffice.params.number; i++) {
            taxOffice.fire[i] = {};
            taxOffice.smoke[i] = {};
            if ( Math.random() >= taxOffice.params.fire.color.probability) {
                taxOffice.fire[i].color = "rgba(" + taxOffice.params.fire.color.yellow.red + "," + taxOffice.params.fire.color.yellow.green + "," + taxOffice.params.fire.color.yellow.blue + "," + (taxOffice.params.fire.color.yellow.alpha * Math.random()) + ")";            
            } else {
                taxOffice.fire[i].color = "rgba(" + taxOffice.params.fire.color.red.red + "," + taxOffice.params.fire.color.red.green + "," + taxOffice.params.fire.color.red.blue + "," + (taxOffice.params.fire.color.red.alpha * Math.random()) + ")";            
            }
            taxOffice.fire[i].x = Math.random()*taxOffice.params.fire.x;
            taxOffice.fire[i].y = Math.random()*taxOffice.params.fire.y;
            taxOffice.fire[i].size = Math.random() * taxOffice.params.fire.size;
            taxOffice.smoke[i].color = "rgba(" + taxOffice.params.smoke.color.red + "," + taxOffice.params.smoke.color.green + "," + taxOffice.params.smoke.color.blue + "," + (taxOffice.params.smoke.color.alpha * Math.random()) + ")";
            taxOffice.smoke[i].x = Math.random() * taxOffice.params.smoke.x;
            taxOffice.smoke[i].y = Math.random() * taxOffice.params.smoke.y;
            taxOffice.smoke[i].size = Math.random() * taxOffice.params.smoke.size;
        }
        for(var i = 0; i <  taxOffice.params.bluelights.cars.length; i++) {
            taxOffice.params.bluelights.cars[i].x[0] *= background.width;
            taxOffice.params.bluelights.cars[i].x[1] *= background.width;
            taxOffice.params.bluelights.cars[i].y[0] *= background.height;
            taxOffice.params.bluelights.cars[i].y[1] *= background.height;
            taxOffice.params.bluelights.cars[i].size *= background.width;
        }
        
        placeClassicUIElements();
        
        if(typeof placeOptions == "function") {        
            placeOptions("load");
        }
     
        animateObjects();
        
    }

    settings = getSettings();
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");
    
    document.addEventListener("keydown", onKeyDown);
    hardware.lastInputMouse = hardware.lastInputTouch = 0;
    canvas.addEventListener("touchstart",chooseInputMethod);
    canvas.addEventListener("mousemove",chooseInputMethod);
    
    Pace.on("hide", function(){
            var timeWait = 0.5;
            var timeLoad = 0.5;
            var toDestroy = document.querySelectorAll(".pace");
            for (var i = 0; i < toDestroy.length; i++) {
                    toDestroy[i].style.transition = "opacity "+ timeWait + "s";
                    toDestroy[i].style.opacity = "0";
            }
            setTimeout(function(){
                    var toHide = document.querySelectorAll("#branding");
                    for (var i = 0; i < toHide.length; i++) {
                        toHide[i].style.transition = "opacity "+ timeLoad + "s";
                        toHide[i].style.opacity = "0";
                    }
                    setTimeout(function(){
                        var localAppData = getLocalAppDataCopy();
                        if(settings.classicUI && !settings.alwaysShowSelectedTrain){ 
                            notify(formatJSString(getString("appScreenTrainSelected", "."), getString(["appScreenTrainNames",trainParams.selected]), getString("appScreenTrainSelectedAuto", " ")), true,3000,null,null, client.y);
                        } else if(localAppData !== null && (localAppData.version.major < APP_DATA.version.major || localAppData.version.minor < APP_DATA.version.minor) && typeof appUpdateNotification == "function") { 
                            appUpdateNotification();
                        } else if (typeof appReadyNotification == "function") {
                            appReadyNotification();
                        }
                        setLocalAppDataCopy(); 
                        for (var i = 0; i < toHide.length; i++) {
                            toHide[i].style.display = "none";
                        }
                        canvas.style.transition = "opacity " + timeLoad + "s";
                        canvas.style.opacity = "1";
                    }, timeLoad*1000);
            }, timeWait*1000);
    });

    extendedMeasureViewspace();
      
    var defaultPics = copyJSObject(pics);
    var finalPicNo = defaultPics.length;
    pics = [];
    var loadNo = 0;
    defaultPics.forEach(function(pic) {
        pics[pic.id] = new Image();
        pics[pic.id].src = "assets/asset" +  pic.id + "." + pic.extension;
        pics[pic.id].onload = function() {
            loadNo++;
            if (loadNo == finalPicNo) {
                Pace.stop();
                initialDisplay();            
            } else {
                context.clearRect(0, 0, canvas.width, canvas.height);
                var currentText = Math.round(100 * (loadNo / finalPicNo)) + "%";
                context.save();
                styleTheProcentCounter();
                context.fillText(currentText, canvas.width / 2, canvas.height / 2);
                context.restore();
            }
        };
        pics[pic.id].onerror = function() {
                 notify(getString("appScreenIsFail", "!", "upper"), true, 60000, function(){followLink("error", "_blank", LINK_STATE_INTERNAL_HTML);}, getString("appScreenFurtherInformation"), client.y);
        };
    }); 
};