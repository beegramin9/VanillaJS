/* 캔버스 위에서 마우스가 움직이면 감지하도록  */
const canvas = document.querySelector("#jsCanvas")
const ctx = canvas.getContext('2d')
/* 캔버스의 픽셀을 가지고 노는 것이기 때문에 자동적으로 이미지 저장과 같은
이미지 메소드가 제공됨 */



/* css로 만든 햐얀 네모는 그냥 디자인일 뿐이고
실제 HTML 요소를 위한 크기도 정해줘야 한다.(= 픽셀을 잡는 과정) */
canvas.width = 700
canvas.height = 700

// canvas 기본색 하얀색으로
ctx.fillStyle = 'white'
ctx.fillRect(0,0,canvas.width,canvas.height)

const DEFAULT_COLOR = "#2c2c2c"

ctx.strokeStyle = DEFAULT_COLOR
ctx.fillStyle = DEFAULT_COLOR

ctx.lineWidth = 2.5

/* 색을 받아오는 건 HTML 요소의 색을 받아오면 좋겠지? */
const colors = document.getElementsByClassName('jsColor')
/* colors의 type은 HTMLcollection. Array로 만들고 싶다 */
function handleColorClick(event) {
    const color = event.target.style.backgroundColor;
    /* strokeStyle을 오버라이딩하기만 하면 됨 */
    ctx.fillStyle = color
    ctx.strokeStyle = color
}

Array.from(colors).forEach(color =>{
    color.addEventListener('click', handleColorClick)
})
/* mousedown이 됐을 때 painting은 true가 된다. 
클릭을 멈추면 다시 false로 돌아가야 함 */
let painting = false;

/* 선 굵기 바꾸기 */
const range = document.querySelector('#jsRange')

function handleRangeChange(event) {
    ctx.lineWidth = event.target.value
}

if (range) {
    range.addEventListener('input',handleRangeChange)
}
/* Filling, Drawing 모드 바꾸기 */
const mode = document.getElementById('jsMode')
let filling = false
function handleModeClick() {
    if (filling) {
        mode.innerText = "Filling"
        filling = false
    } else {
        mode.innerText = "Draw"
        filling = true
    }
}
if (mode) {
    mode.addEventListener('click',handleModeClick)
}


/* Filling 모드에서 canvas를 클릭하면 채워주기를 바람 */
function handleCanvasClick() {
    /* filling일때만 실행하게. 아니면 그대로 drawing할 수 있도록 */
    if (filling) {
        ctx.fillRect(0,0,canvas.width,canvas.height)
    }
}


function onMouseMove(event) {
    /* client는 1920x1080 화면 전체의 좌표
    canvas의 좌표만 얻고 싶다면 offsetX, offsetY */
    const x = event.offsetX;
    const y = event.offsetY;
    
    /* 캔버스 위를 클릭하는 순간을 인지하게 하고
    클릭했을 때 페인팅을 시작해야 함 */

    /* context의 메소드들 */
    /* path는 선을 만들어주는데, path를 시작하고 움직이며 채워넣을 수 있다.
    우리는 path를 마우스가 클릭 없이 그냥 떠다닐 때만 시작되기를 원한다.
    (좌표만 저장한다는 느낌)
    여기서 path는 만들어지긴 하지만 채워지지 않은 빈 선이다.
    클릭이 되면 실제로 painting을 시작한다. */
    if (!painting) {
        /* 클릭 안하고 움직일 때 */
        ctx.beginPath()
        /* 마우스가 가는대로 path가 만들어지는 중 */
        ctx.moveTo(x,y)
    } else {
        /* 클릭하고 움직일 때 
        클릭 시작점에서 현재 마우스 x,y까지 선을 그린다.
        => 클릭하고 있을 때 내내 발생하겠지. 시작과 끝선이 아니란 말씀
        */
        ctx.lineTo(x,y)
        /* 실제로 칠함 */
        ctx.stroke()
    }
}

/* 저장 */
const saveBtn = document.querySelector('#jsSave')

function handleCM(event) {
    /* 원래 실행되는 마우스 오른쪽 클릭 없앰 */
    event.preventDefault()
}
function handleSaveClick(event) {
    const image = canvas.toDataURL();
    const link = document.createElement('a')
    link.href = image
    link.download = 'PaintJS'
    /* 다운로드 링크를 누르는 효과 */
    link.click()
}

if (saveBtn) {
    saveBtn.addEventListener('click', handleSaveClick)
}

/* 같은 기능이 반복되지? => 하나의 함수로 통함
function onMouseUp(event) {
    stopPainting()
}

function onMouseLeave(event) {
    painting = false
}
*/

function startPainting() {
    painting = true
}
function stopPainting() {
    painting = false
}

if (canvas) {
    canvas.addEventListener('mousemove',onMouseMove)
    /* 클릭했을 때 이벤트: mousedown */
    canvas.addEventListener('mousedown',startPainting)
    /* 클릭 멈추고 ;손 뗐을 때 이벤트: mouseup */
    canvas.addEventListener('mouseup',stopPainting)
    /* 캔버스를 벗어났을 때도 painting은 false가 되어야 함 */
    canvas.addEventListener('mouseleave',stopPainting)
    /* 캔버스 클릭됐을 때 */
    canvas.addEventListener('click',handleCanvasClick)
    /* 마우스 오른쪽 클릭해서 나오는 게 contextmenu */
    canvas.addEventListener('contextmenu',handleCM)
}