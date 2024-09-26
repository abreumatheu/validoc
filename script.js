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
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(function (stream) {
            video.srcObject = stream;
        })
        .catch(function (err) {
            console.error("Erro ao acessar a câmera: ", err);
        });
}

function capturePhoto() {
    // Captura a imagem do vídeo e a coloca no canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Exibe a mensagem de verificação de legibilidade
    document.querySelector("#resultText").innerText = "Verifique se os dados estão legíveis antes de enviar.";
    
    // Habilita o botão de envio via WhatsApp
    enableWhatsAppButton();
    document.querySelector("#result").classList.remove("hidden");
}

function enableWhatsAppButton() {
    let sendButton = document.querySelector("#sendWhatsApp");
    sendButton.classList.remove("hidden");

    // Converte a imagem capturada em uma URL Base64
    let imageDataUrl = canvas.toDataURL("image/jpeg");
    
    // Número de WhatsApp para envio
    const whatsappNumber = "5511943471217";
    
    // Mensagem a ser enviada
    const message = `Olá, estou enviando a foto do meu documento (${selectedDocument}) conforme solicitado.`;

    // Configura o link do WhatsApp com a mensagem e o número
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

    // Atribui o link ao botão
    sendButton.href = whatsappUrl;

    // Mensagem informativa (o WhatsApp não permite anexar imagens diretamente via link de API)
    document.querySelector("#resultText").innerText += "\nA imagem não pode ser enviada diretamente, por favor, anexe a imagem manualmente no WhatsApp.";
}

function retryCapture() {
    document.querySelector("#result").classList.add("hidden");
    document.querySelector("#retry").classList.add("hidden");
    document.querySelector("#sendWhatsApp").classList.add("hidden");
}
