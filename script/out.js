const form = document.getElementById('msgbox');
const messageInput = document.getElementById('msginp');
const messageContainer = document.querySelector('#chatarea');

const append = (message, position) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('msg');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, 'mr');
  socket.emit('send', message);
  messageInput.value = '';
});

const name = prompt('Enter your name to join');

socket.emit('new-user-joined', name);

socket.on('user-joined', (name) => {
  append(`${name} joined the chat`, 'mr');
});

socket.on('receive', (data) => {
  append(`${data.name}: ${data.message}`, 'ml');
});

socket.on('left', (data) => {
    append(`${data.name} left the chat`, 'ml');
});
