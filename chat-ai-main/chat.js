const chatBox = document.querySelector('.chat-box');
const userInput = document.getElementById('userQuestion');

const chatResponses = [
    {
        keywords: ["حرق","اتحرقت","حروق","سخنة","ميه"],
        reply: "ج: لو حصل حرق بمية سخنة، حطي المكان تحت مية ساقعة لمدة 10 دقائق، وما تحطيش تلج مباشرة. بعد كده ممكن تحطي كريم مهدئ."
    },
    {
        keywords: ["جرح","اتعورت","نزيف","دم"],
        reply: "ج: لو في جرح، اغسلي المكان بماء وصابون، واضغطي عليه بقطعة شاش نظيفة لوقف النزيف ثم غطيه بضمادة."
    },
    {
        keywords: ["لسعة","نحلة","ناموس","لدغة"],
        reply: "ج: اغسلي مكان اللسعة بالماء، وحطي كمادة ساقعة لتقليل التورم، ولو في ألم ممكن تحطي كريم مهدئ."
    }
];

userInput.addEventListener('input', () => {
    const aiDisplay = document.querySelector('.ai-response-display');
    if (aiDisplay && aiDisplay.value.includes("مرحباً!")) {
        aiDisplay.style.display = "none";
    }
});

function addMessage(sender, message) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = message;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
    const question = userInput.value.trim().toLowerCase();
    if (!question) return;

    addMessage('user', question);

    let reply = "ج: معذرة، مش فاهم قصدك. ممكن توضحي أكتر؟";

    for (const item of chatResponses) {
        if (item.keywords.some(word => question.includes(word))) {
            reply = item.reply;
            break;
        }
    }

    addMessage('ai', reply);
    userInput.value = "";
}
userInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
    }
});