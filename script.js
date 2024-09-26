let video = document.querySelector("#video");
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let selectedDocument = '';

function selectDocument(documentType) {
    selectedDocument = documentType;
    document.querySelector("#instructions").classList.remove("hidden");

    let instructionText = document.querySelector("#instructionText");
    if (documentType === 'CNH') {
        instructionText.innerText = "Tire a foto da CNH aberta, mostrando a frente e o verso.";
    } else if (documentType === 'RG') {
        instructionText.innerText = "Tire a foto do RG aberto, mostrando a frente e o verso.";
    }

    document.querySelector("#camera").classList.remove("hidden");
    startCamera();
}

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (err) {
            console.error("Erro ao acessar a câmera: ", err);
        });
}

function capturePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Mostra o aviso para verificar a qualidade e habilita o botão de enviar
    document.querySelector("#resultText").innerText = "Verifique se os dados estão legíveis antes de enviar.";
    enableWhatsAppButton();
    document.querySelector("#result").classList.remove("hidden");
}

function enableWhatsAppButton() {
    let sendButton = document.querySelector("#sendWhatsApp");
    sendButton.classList.remove("hidden");
    let imageURL = canvas.toDataURL(); // Captura a imagem do canvas em Base64

    const whatsappNumber = "5511943471217"; 
    const message = `Olá, estou enviando a foto do meu documento (${selectedDocument}) conforme solicitado.`;

    sendButton.href = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
}

function retryCapture() {
    document.querySelector("#result").classList.add("hidden");
    document.querySelector("#retry").classList.add("hidden");
    document.querySelector("#sendWhatsApp").classList.add("hidden");
}
