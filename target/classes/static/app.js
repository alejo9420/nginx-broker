var stompClient = null;
var puntos = [];
var x = 0;
var y = 0;
var con = false;

function connect() {
    var socket = new SockJS('/stompendpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        
        stompClient.subscribe('/topic/newpoint', function (data) {
            var objetoJson = JSON.parse(data.body);
            var canvas = document.getElementById('myCanvas');
            writePoint(canvas,objetoJson.x,objetoJson.y);
    
        });
        stompClient.subscribe('/topic/newpolygon', function (data) {
            var puntos = JSON.parse(data.body);
            var canvas = document.getElementById('myCanvas');
            writePolygon(canvas, puntos);   
        });
        
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function establecerConexion(){
    var boton = document.getElementById("conexion");
    
    if (boton.value === "Conectar") {
        $("#conexion").html('Desconectar');
        boton.value = "Desconectar";
        connect();
        console.info('connecting to websockets');
        con = true;
    }
    
    else {
        $("#conexion").html('Conectar');
        boton.value = "Conectar";
        disconnect();
        con = false;
    }
    

}





function sendPoint(){
    if(con === true){
        stompClient.send("/app/newpoint", {}, JSON.stringify({x:x,y:y}));
    }
    
    else{
        alert("El cliente esta desconectado.");
    }
}

function writePoint(canvas, x, y) {
    var context = canvas.getContext('2d');
    //context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(x,y,1,0,2*Math.PI);
    context.closePath();
    context.stroke();

}

function writePolygon(canvas, puntos){
    var context = canvas.getContext('2d');
    context.fillStyle = '#f00';
    context.beginPath();
    context.moveTo(puntos[0].x, puntos[0].y);
    context.lineTo(puntos[1].x, puntos[1].y);
    context.lineTo(puntos[2].x, puntos[2].y);
    context.lineTo(puntos[3].x, puntos[3].y);
    context.closePath();
    context.fill();
    context.stroke();
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

$(document).ready(
        function () {
            //connect();
            //console.info('connecting to websockets');
            
            var canvas = document.getElementById('myCanvas');
            var context = canvas.getContext('2d');
            
            canvas.addEventListener('mousedown', function(evt) {
                var mousePos = getMousePos(canvas, evt);
                x = mousePos.x;
                y = mousePos.y;
                var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
                //writePoint(canvas, mousePos.x, mousePos.y);
            }, false);

        }
);
