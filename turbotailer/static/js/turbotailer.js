var clientId;
var chatWindow;
var userInput;

// Initialize the chatbot
function initializeChatbot(id) {
    clientId = id;
    // Create the chat interface
    createChatInterface();
}

// Create the chat interface
function createChatInterface() {

    // Create the wrapper
    chatWrapper = document.createElement('div')
    chatWrapper.style.position = 'fixed';
    chatWrapper.style.bottom = '25px';
    chatWrapper.style.right = '25px';
    chatWrapper.style.width = '300px';
    chatWrapper.style.height = 'auto';

    // Create the chat window
    chatWindow = document.createElement('div');
    chatWindow.style.border = '1px solid #ddd';
    chatWindow.style.padding = '10px';
    chatWindow.style.overflow = 'auto';
    // chatWindow.style.display = 'none'; 
    chatWindow.style.height = '400px';
    chatWindow.style.backgroundColor = '#f9f9f9';
    chatWindow.style.borderRadius = '8px';
    chatWindow.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.1)';


    // Create the chat widget
    chatWidget = document.createElement('button');
    chatWidget.textContent = 'Chat';
    chatWidget.style.backgroundColor = '#4caf50';
    chatWindow.style.border = '1px solid #ddd';
    chatWidget.style.color = 'white';
    chatWidget.style.padding = '15px 32px';
    chatWidget.style.textAlign = 'center';
    chatWidget.style.textDecoration = 'none';
    chatWidget.style.display = 'inline-block';
    chatWidget.style.fontSize = '16px';
    chatWidget.style.position = 'fixed';
    chatWidget.style.bottom = '10px';
    chatWidget.style.right = '10px';
    chatWidget.onclick = openChat;

    // Wrapper for input and button
    var inputWrapper = document.createElement('div');
    inputWrapper.style.display = 'flex';
    inputWrapper.style.justifyContent = 'space-between';
    inputWrapper.style.alignItems = 'stretch';
    inputWrapper.style.marginTop = '10px';

    // Create the user input field
    userInput = document.createElement('input');
    userInput.type = 'text';
    userInput.placeholder = 'Chat with the store'
    userInput.style.flexGrow = '1';
    userInput.style.padding = '10px';
    userInput.style.borderRadius = '4px';
    userInput.style.border = '1px solid #ddd';

    // Create the send button
    var sendButton = document.createElement('button');
    sendButton.textContent = 'Send';
    sendButton.style.backgroundColor = '#4caf50';
    sendButton.style.border = 'none';
    sendButton.style.color = 'white';
    sendButton.style.padding = '10px 20px';
    sendButton.style.textAlign = 'center';
    sendButton.style.textDecoration = 'none';
    sendButton.style.display = 'inline-block';
    sendButton.style.fontSize = '14px';
    sendButton.style.marginLeft = '10px';
    sendButton.style.borderRadius = '4px';
    sendButton.style.flexShrink = '0';
    sendButton.onclick = sendUserMessage;

    // Create the close button
    closeButton = document.createElement('button');
    var svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>`;
    closeButton.innerHTML = svgContent
    closeButton.style.backgroundColor = '#fff';
    closeButton.style.color = '#000';
    closeButton.style.border = '1px solid #000';
    //closeButton.style.padding = '15px 15px';
    closeButton.style.width = '45px'
    closeButton.style.height = '45px'
    closeButton.style.textAlign = 'center';
    closeButton.style.textDecoration = 'none';
    closeButton.style.display = 'inline-block';
    // closeButton.style.fontSize = '19px';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '-60px';
    closeButton.style.right = '0px';
    closeButton.style.borderRadius = '50%';
    closeButton.onclick = closeChat;

    // Add the main wrapper
    document.body.appendChild(chatWrapper);

    // Add the dialog
    chatWrapper.appendChild(chatWindow)

    // Add dialog close button
    chatWrapper.appendChild(closeButton);
    
    // Add the input wrapper
    chatWrapper.appendChild(inputWrapper)

    // Add input and send button
    inputWrapper.appendChild(userInput)
    inputWrapper.appendChild(sendButton);
}


// Open the chat
function openChat() {
    chatWindow.style.display = 'block'; // show the chat window
}

// Close the chat
function closeChat() {
    chatWindow.style.display = 'none'; // hide the chat window
}


// Fetch data from the server
function fetchDataFromServer(query) {
    // Create the URL for the API endpoint on your server
    var url = 'http://127.0.0.1:8000/api/prompts/prompt/';

    // Create an object with the client ID and user message
    var bodyData = {
        namespace: clientId,
        query: query
    };

    // Fetch data from the server
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    })
    .then(response => response.json())
    .then(data => {
        // The data parameter now contains the data returned by your server.
        // You can use this data to update the chatbot's UI.
        updateChatbotUI(data);
    });
}

// Update the chatbot's UI
function updateChatbotUI(data) {
    // Append the server's response to the chat window
    var serverMessage = document.createElement('p');
    serverMessage.textContent = "Server: " + data.message;
    chatWindow.appendChild(serverMessage);

    // Auto scroll to the bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Send a user message
function sendUserMessage() {
    // Append the user's message to the chat window
    var userMessage = document.createElement('p');
    userMessage.textContent = "User: " + userInput.value;
    chatWindow.appendChild(userMessage);

    // Send the user's message to the server
    fetchDataFromServer(userInput.value);

    // Clear the input field
    userInput.value = '';
}
