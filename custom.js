let dom = document

function  $1(id) {
    return document.getElementById(id);
}

function $2(cname){
    return document.getElementsByClassName(cname);
}


let u = {
    tr : 'transform',
    ts : 'transition',
    bg : 'background-color',
    bc : 'border-color',
    bb : 'border-bottom',
    btc: 'border-bottom-color',
    br : 'border',
    o  : 'opacity',
    b  : 'bottom',
    t  : 'top',
    l  : 'left',
    r  : 'right',
    dw : 'down',
    ml : 'margin-left',
    mt : 'margin-top',
    mr : 'margin-right',
    md : 'margin-down',
    d  : 'display',
    w  : 'width',
    h  : 'height'
}

let st = (o, d)=>{

    if (typeof d === "object")
        InitObj()
    else InitStr()

    function InitObj(){
        let keys = Object.keys(d)

        keys.forEach(key => {
            o.style[u[key]] = d[key]
        })
    }

    function InitStr(){
        if (typeof d !== "string")
        {
            alert("data is not of type string")
            return
        }

        if (o == null) return

        let s = d.split(';')
        s.forEach(c => {
            c = c.split(':')
            o.style[u[c[0]]] = c[1]
        })

    }
}

let tout = (fn,t) => {
    setTimeout(fn,t)
}



function min(a,b){
    return Math.min(a,b)
}

function max(a,b){
    return Math.max(a,b)
}

function sin(a){
    return Math.sin(a)
}

function cos(a){
    return Math.cos(a)
}

function sqrt(a) {
    return Math.sqrt(a)
}

function abs(a){
    return Math.abs(a)
}

function floor(a) {
    return Math.floor(a)
}

function rand(n){
    return Math.floor(Math.random()*n)
}

function random(n){
    return Math.random()*n
}
