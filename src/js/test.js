function initQRCode() {
    $.ajax({
        url: '/qr?qrcode=rand',
        method: 'GET',
        success: function (data) {
            $('#gcDiv').qrcode({
                render   : "table",
                width : 300,
                height : 300,
                text   : "" + data,
            }); 
        },
    });
}

function deleteText() {
    const element = document.getElementById('gcDiv');
    
    element.innerText = '';
} 

function startCountDown(duration, element) {

    let secondsRemaining = duration;
    let sec = 0;

    let countInterval = setInterval(function () {

        sec = parseInt(secondsRemaining % 60);
        if(sec == 0){
            element.textContent = '갱신까지 : 15';
        }
        else{
            element.textContent = '갱신까지 : '+`${sec}`;
        }
        console.log(sec)
        
        if (sec == 0) {
            deleteText();
            secondsRemaining = 15;
            initQRCode();
        }

        secondsRemaining = secondsRemaining - 1;
        if (secondsRemaining < 0) { clearInterval(countInterval) };

    }, 1000);
}

window.onload = function () {
    let time_seconds = 15; // Value in seconds

    let duration = time_seconds;

    element = document.querySelector('#count-down-timer');
    element.textContent = '갱신까지 : '+`${time_seconds}`;
    startCountDown(--duration, element);
};

initQRCode();