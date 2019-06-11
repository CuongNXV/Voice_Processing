navigator.mediaDevices.getUserMedia({audio:true})
    .then(stream => {handlerFunction(stream)});


function handlerFunction(stream) {
    rec = new MediaRecorder(stream);
    rec.ondataavailable = e => {
        audioChunks.push(e.data);
        if (rec.state == "inactive"){
            let blob = new Blob(audioChunks,{type:'audio/mpeg-3'});
            sendData(blob)
        }
    }
}
function sendData(data) {
    let fd = new FormData();
    fd.append('data', data);
    $.ajax({
        type: 'POST',
        url: '/loadRecord',
        data: fd,
        processData: false,
        contentType: false,
        cache: false,
        success: function (response) {
            if(response.success == false) {
                alert(response.error);
            }
            else {
                console.log(response);
                let item  = '<div class="alert alert-success mt-lg-5 col-md-4 offset-4 text-center" role="alert" id="notify">' + response.file + '</div>';
                $('.container').append(item);
                setTimeout(function () {
                    $('#notify').hide();
                },3000);
            }
        }
    }).done(function(data) {
        console.log(data);
        // alert(data.file);
    });
}

record.onclick = e => {
    console.log('record');
    record.disabled = true;
    stopRecord.disabled=false;
    audioChunks = [];
    rec.start();
};
stopRecord.onclick = e => {
    console.log("stop");
    record.disabled = false;
    stop.disabled=true;
    rec.stop();
};