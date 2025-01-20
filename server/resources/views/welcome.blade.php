<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Chat Test</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/laravel-echo/1.11.0/echo.min.js"></script> 
<script src="https://cdnjs.cloudflare.com/ajax/libs/pusher/7.0.3/pusher.min.js"></script>

    </head>
    <body class="bg-gray-100">
        <div id="app" class="container mx-auto px-4 py-8">
            <!-- Login Form -->
            <div id="loginForm" class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 class="text-2xl font-bold mb-4">Đăng nhập</h2>
                <input type="text" id="op_id" placeholder="Operator ID" class="w-full p-2 border rounded mb-3">
                <input type="password" id="pwd" placeholder="Password" class="w-full p-2 border rounded mb-3">
                <button onclick="login()" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Đăng nhập
                </button>
            </div>

            <!-- Chat Interface -->
            <div id="chatInterface" class="hidden max-w-4xl mx-auto bg-white rounded-lg shadow-md">
                <div class="p-4 border-b">
                    <h2 class="text-xl font-bold">Chat Test</h2>
                    <p id="userInfo" class="text-sm text-gray-600"></p>
                </div>

                <!-- Messages -->
                <div id="messages" class="h-96 overflow-y-auto p-4 space-y-4">
                    <!-- Messages will be inserted here -->
                </div>

                <!-- Message Input -->
                <div class="p-4 border-t">
                    <div class="flex space-x-2">
                        <input type="text" id="messageInput" placeholder="Nhập tin nhắn..." 
                               class="flex-1 p-2 border rounded">
                        <button onclick="sendMessage()" 
                                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Gửi
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <script>
            window.Echo = new Echo({
                broadcaster: 'pusher',
                key: '{{ env('fgoqbapwox9c0gvpcqdy') }}',
                wsHost: '{{ env('127.0.0.1') }}',
                wsPort: 8080,
                enabledTransports: ['ws', 'wss'],
            });
        </script>

        <script>
            let token = '';
            let currentUser = null;
            let ws = null;

            // Login function
            async function login() {
                const op_id = document.getElementById('op_id').value;
                const pwd = document.getElementById('pwd').value;

                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ op_id, pwd })
                    });

                    const data = await response.json();
                    if (data.success) {
                        token = data.data.access_token;
                        currentUser = data.data.operator;
                        showChat();
                        connectWebSocket();
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    alert('Đăng nhập thất bại');
                }
            }

            // Show chat interface
            function showChat() {
                document.getElementById('loginForm').classList.add('hidden');
                document.getElementById('chatInterface').classList.remove('hidden');
                document.getElementById('userInfo').textContent = `Đăng nhập với: ${currentUser.op_name}`;
            }

            // Connect WebSocket
            function connectWebSocket() {
                data = window.Echo
                window.Echo.channel('group-chat')
                .listen('group.message.sent', (e) => {
                    console.log(e);
                    appendMessage(e.message);
                });
            }

            // Send message
            function sendMessage() {
                const content = document.getElementById('messageInput').value;
                if (!content.trim()) return;

                const messageData = {
                    content: content,
                };

                axios.post('/api/messages', messageData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                document.getElementById('messageInput').value = '';
            }

            // Append message to chat
            function appendMessage(message) {
                const messagesDiv = document.getElementById('messages');
                const messageElement = document.createElement('div');
                messageElement.className = `p-3 rounded ${
                    message.sender_id === currentUser.op_id 
                        ? 'bg-blue-100 ml-auto' 
                        : 'bg-gray-100'
                } max-w-[70%]`;
                
                messageElement.innerHTML = `
                    <p class="text-sm font-bold">${message.sender.op_name}</p>
                    <p>${message.content}</p>
                    <p class="text-xs text-gray-500">${new Date(message.created_at).toLocaleString()}</p>
                `;
                
                messagesDiv.appendChild(messageElement);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }

            // Handle Enter key in message input
            document.getElementById('messageInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        </script>
    </body>
</html>
