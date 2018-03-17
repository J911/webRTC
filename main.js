const caller = new RTCPeerConnection();
const callee = new RTCPeerConnection();

const callBtn = document.getElementById('call');
const hangUpBtn = document.getElementById('hangUp');

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

callBtn.addEventListener('click', handlerClickCall);
hangUpBtn.addEventListener('click', handlerClickHangUp);

caller.onicecandidate = handlerCallerOnicecandidate;
callee.onicecandidate = handlerCalleeOnicecandidate;
callee.onaddstream = handlerCalleeAddStream;

function handlerCallerOnicecandidate(e){
    if(e.candidate) callee.addIceCandidate(e.candidate);
}

function handlerCalleeOnicecandidate(e){  
    if(e.candidate) caller.addIceCandidate(e.candidate);
}

function handlerCalleeAddStream(e){
    remoteVideo.srcObject = e.stream;
}

function handlerClickCall(){
    navigator.getUserMedia({
        video: true,
        audio: false
    }, getUserMediaSuccess, getUserMediaError);
}

function getUserMediaSuccess(mediaStream){
    localVideo.srcObject = mediaStream;
    caller.addStream(mediaStream);
    caller.createOffer()
    .then(sdp=>createOfferSuccess(sdp))
    .catch(e=>createOfferError(e));
}

function createOfferSuccess(sdp){
    caller.setLocalDescription(sdp);
    sendOffer(sdp);
}

function sendOffer(sdp){
    callee.setRemoteDescription(sdp);
    callee.createAnswer()
    .then(sdp=>createAnswerSuccess(sdp))
    .catch(e=>createAnswerError(e));
}

function createAnswerSuccess(sdp){
    callee.setLocalDescription(sdp);
    sendAnswer(sdp);
}

function sendAnswer(sdp){
    caller.setRemoteDescription(sdp);
}

function handlerClickHangUp(){

}

function createAnswerError(e){
    console.log(e);
}

function createOfferError(e){
    console.log(e);
}
function getUserMediaError(e){
    console.log(e);
}