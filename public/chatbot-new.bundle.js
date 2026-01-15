/**
 * Fujiyama Chat Widget v3.0.0 - Fujiyama Solar Edition
 * Connects to /api/v1/chat/message endpoint
 * Usage: <script src="path/to/chatbot-new.bundle.js"></script>
 */

(function () {
    'use strict';

    // Prevent multiple initializations
    if (window.FujiyamaWidgetNew) {
        return;
    }

    // Countries data for phone number dropdowns
    const COUNTRIES_DATA = [
        { "cca2": "IN", "idd": { "root": "+91", "suffixes": [""] }, "name": { "common": "IN" } },
        { "cca2": "US", "idd": { "root": "+1", "suffixes": [""] }, "name": { "common": "US" } },
        { "cca2": "GB", "idd": { "root": "+44", "suffixes": [""] }, "name": { "common": "GB" } }
    ];

    // Configuration options
    const DEFAULT_CONFIG = {
        position: 'bottom-right',
        theme: 'default',
        userName: 'Fujiyama AI Agent',
        userStatus: 'Online',
        autoOpen: false,
        minimizable: true,
        title: 'Fujiyama Assistant',
        subtitle: 'Solar Energy Support',
        welcomeMessage: 'Welcome to Fujiyama Solar! How can we help you power your home with AI-driven energy today?',
        apiEndpoints: {
            baseUrl: (function () {
                if (window.FUJIYAMA_CONFIG && window.FUJIYAMA_CONFIG.API_BASE_URL) {
                    return window.FUJIYAMA_CONFIG.API_BASE_URL;
                }
                var metaTag = document.querySelector('meta[name="api-base-url"]');
                if (metaTag && metaTag.content) {
                    return metaTag.content;
                }
                if (window.NEXT_PUBLIC_API_URL) {
                    return window.NEXT_PUBLIC_API_URL;
                }
                // Fallback for demo
                return 'http://127.0.0.1:8000'; // Default to local backend if not specified
            })(),
            chatEndpoint: '/agent/chat',
        },
        useAiAgent: true,
        defaultDomain: 'customer' // Domain for the RAG agent
    };

    // Helper: Generate UUID for session
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Helper: Get or Create Session ID
    function getSessionId() {
        let sessionId = localStorage.getItem('fujiyama_chat_session_id');
        if (!sessionId) {
            sessionId = generateUUID();
            localStorage.setItem('fujiyama_chat_session_id', sessionId);
        }
        return sessionId;
    }

    // Generate CSS
    function generateCSS() {
        return `
        /* CSS Reset for Widget Isolation */
        .fujiyama-new-widget * {
            box-sizing: border-box !important;
            margin: 0;
            padding: 0;
            outline: none;
        }
        .fujiyama-new-widget button, 
        .fujiyama-new-widget input {
            font-family: inherit;
        }

        /* CSS Variables - Fujiyama Solar Theme */
        :root {
            --primary-gradient: linear-gradient(135deg, #1d4ed8 0%, #059669 100%); /* Blue to Green */
            --primary-color: #059669;
            --primary-dark: #1e3a8a;
            --primary-light: #34d399;
            --shadow-xl: 0 16px 48px rgba(5, 150, 105, 0.20);
            --shadow-2xl: 0 24px 64px rgba(5, 150, 105, 0.24);
            --radius-full: 9999px;
            --radius-2xl: 24px;
            --space-2xl: 24px;
            --space-3xl: 32px;
            --transition-spring: 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .fujiyama-new-widget {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            width: 400px;
            height: 650px;
            max-width: 95vw;
            max-height: 90vh;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 28px;
            overflow: hidden;
            box-shadow: var(--shadow-2xl);
            display: flex;
            flex-direction: column;
            position: fixed;
            bottom: var(--space-3xl);
            right: var(--space-2xl);
            z-index: 999999;
            transition: all var(--transition-spring);
        }

        .fujiyama-new-widget.minimized {
            width: 72px !important;
            height: 72px !important;
            border-radius: var(--radius-full) !important;
            overflow: hidden;
            cursor: pointer;
            background: var(--primary-gradient);
            box-shadow: var(--shadow-xl);
            bottom: 24px;
            right: 24px;
        }

        .fujiyama-new-widget.minimized .fujiyama-new-header {
            width: 100%;
            height: 100%;
            padding: 0;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
        }
        
        .fujiyama-new-widget.minimized .fujiyama-new-header::after {
            display: none;
        }

        .fujiyama-new-widget.minimized .fujiyama-new-chat-area,
        .fujiyama-new-widget.minimized .fujiyama-new-input-area,
        .fujiyama-new-widget.minimized .fujiyama-new-user-details,
        .fujiyama-new-widget.minimized .fujiyama-new-header-icons,
        .fujiyama-new-widget.minimized .fujiyama-new-user-info {
            display: none !important;
        }

        /* Launcher Icon in Minimized State */
        .fujiyama-new-widget.minimized::before {
             content: "💬"; /* Simple chat icon fallback */
             font-size: 32px;
             color: white;
             position: absolute;
             top: 50%;
             left: 50%;
             transform: translate(-50%, -50%);
             z-index: 10;
        }
        
        .fujiyama-new-header {
            background: var(--primary-gradient);
            padding: 20px 24px 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 28px 28px 0 0;
            position: relative;
        }

        .fujiyama-new-header::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 20px;
            background-color: #ffffff;
            border-top-left-radius: 50% 100%;
            border-top-right-radius: 50% 100%;
        }

        .fujiyama-new-user-info {
            display: flex;
            align-items: center;
            gap: 16px;
            flex: 1;
        }

        .fujiyama-new-avatar {
            width: 48px;
            height: 48px;
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: var(--radius-full);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 20px;
            font-weight: 700;
        }

        .fujiyama-new-user-details h3 {
            margin: 0;
            color: #ffffff;
            font-size: 18px;
            font-weight: 700;
        }

        .fujiyama-new-user-details p {
            margin: 0;
            color: rgba(255, 255, 255, 0.9);
            font-size: 12px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .fujiyama-new-status-dot {
            width: 8px;
            height: 8px;
            background: #22c55e;
            border-radius: 50%;
            display: inline-block;
        }

        .fujiyama-new-header-icons {
             display: flex;
             gap: 10px;
        }
        
        .fujiyama-new-icon {
            color: white;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-size: 20px;
        }
        .fujiyama-new-icon:hover { opacity: 1; }

        .fujiyama-new-chat-area {
            flex: 1;
            background: #ffffff;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .fujiyama-new-message {
            display: flex;
            gap: 12px;
            align-items: flex-end;
            width: 100%;
        }

        .fujiyama-new-message.user {
            flex-direction: row-reverse;
        }

        .fujiyama-new-message-bubble {
            background: #f1f5f9;
            color: #0f172a;
            padding: 12px 16px;
            border-radius: 18px 18px 18px 0;
            font-size: 14px;
            line-height: 1.5;
            max-width: 80%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .fujiyama-new-message.user .fujiyama-new-message-bubble {
            background: var(--primary-gradient);
            color: #ffffff;
            border-radius: 18px 18px 0 18px;
        }
        
        .fujiyama-new-message-avatar {
             width: 28px;
             height: 28px;
             border-radius: 50%;
             background: #e2e8f0;
             display: flex;
             align-items: center;
             justify-content: center;
             font-size: 12px;
        }

        .fujiyama-new-input-area {
            padding: 16px;
            background: #ffffff;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .fujiyama-new-input-wrapper {
            flex: 1;
            background: #f8fafc;
            border: 1px solid #e1e7ef;
            border-radius: 24px;
            padding: 8px 16px;
            display: flex;
            align-items: center;
        }

        .fujiyama-new-input {
            width: 100%;
            border: none;
            background: transparent;
            outline: none;
            font-size: 14px;
        }

        .fujiyama-new-send-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--primary-gradient);
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
        }

        .fujiyama-new-send-btn:hover {
            transform: scale(1.05);
        }
        
        /* Mobile Responsive */
        @media (max-width: 480px) {
            .fujiyama-new-widget {
                width: 100%;
                height: 100%;
                max-width: 100%;
                max-height: 100%;
                bottom: 0;
                right: 0;
                border-radius: 0;
            }
        }

        /* Link Styling */
        .fujiyama-new-message-bubble a {
            color: #059669;
            text-decoration: underline;
        }
        .fujiyama-new-message-bubble strong {
            font-weight: 700;
        }
        .fujiyama-new-message-bubble ul {
            margin-left: 16px;
            margin-top: 4px;
            margin-bottom: 4px;
        }
        .fujiyama-new-message-bubble li {
            list-style-type: disc;
            margin-bottom: 2px;
        }
        `;
    }

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = generateCSS();
    document.head.appendChild(style);

    // Create Widget Elements
    const widget = document.createElement('div');
    widget.className = 'fujiyama-new-widget minimized'; // Start minimized

    widget.innerHTML = `
        <div class="fujiyama-new-header">
            <div class="fujiyama-new-user-info">
                <div class="fujiyama-new-avatar">⚡</div>
                <div class="fujiyama-new-user-details">
                    <h3>${DEFAULT_CONFIG.title}</h3>
                    <p><span class="fujiyama-new-status-dot"></span> ${DEFAULT_CONFIG.userStatus}</p>
                </div>
            </div>
            <div class="fujiyama-new-header-icons">
               <div class="fujiyama-new-icon minimize-btn">_</div>
               <div class="fujiyama-new-icon close-btn">✕</div>
            </div>
        </div>
        
        <div class="fujiyama-new-chat-area" id="chat-messages">
            <div class="fujiyama-new-message">
                <div class="fujiyama-new-message-avatar">🤖</div>
                <div class="fujiyama-new-message-bubble">
                    ${DEFAULT_CONFIG.welcomeMessage}
                </div>
            </div>
        </div>
        
        <div class="fujiyama-new-input-area">
            <div class="fujiyama-new-input-wrapper">
                <input type="text" class="fujiyama-new-input" placeholder="Type your message..." />
            </div>
            <button class="fujiyama-new-send-btn">➤</button>
        </div>
    `;

    document.body.appendChild(widget);

    // UI Logic
    const minimizeBtn = widget.querySelector('.minimize-btn');
    const closeBtn = widget.querySelector('.close-btn');
    const input = widget.querySelector('.fujiyama-new-input');
    const sendBtn = widget.querySelector('.fujiyama-new-send-btn');
    const chatArea = widget.querySelector('#chat-messages');

    // Toggle Minimize
    function toggleMinimize(e) {
        if (e) e.stopPropagation();
        widget.classList.toggle('minimized');
    }

    widget.addEventListener('click', function (e) {
        if (widget.classList.contains('minimized')) {
            toggleMinimize(e);
        }
    });

    minimizeBtn.addEventListener('click', toggleMinimize);
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMinimize(); // Changed from hiding to minimizing so icon remains available
    });

    // Helper: Simple Markdown Formatter
    function formatResponse(text) {
        if (!text) return '';
        let html = text;

        // 1. Escape HTML (Security)
        html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // 2. Bold: **text** or __text__
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

        // 3. Italic: *text* or _text_
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.*?)_/g, '<em>$1</em>');

        // 4. Links: [text](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

        // 5. Lists: starts with - or * at start of line
        // Wrap items in <li>, then we'll wrap groups (naive implementation)
        // A simpler visual approach for chat: replace bullet with dot and handle newlines
        // html = html.replace(/^\s*[-*]\s+(.*)$/gm, '• $1');

        // Improved List Handling:
        // Replace line starting with "- " with "<li>...</li>"
        html = html.replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>');

        // Wrap consecutive <li>...</li> in <ul>
        // Since JS regex doesn't support state easily, we will do a rough wrap:
        // Identify blocks of <li>...</li>.
        // Actually, for chat bubbles, <br>•  is safer if not using a full parser.
        // Let's stick to <br>• for reliability unless we want full HTML structure.
        // Let's try full <ul> wrap if possible, but keep it simple.

        // Revert <li> approach for stability in simple regex:
        // Just Use <br>• for now to ensure lines break correctly
        // html = html.replace(/^\s*[-*]\s+(.*)$/gm, '<br>• $1');

        // Let's try <ul> wrapping via replace:
        // Note: Newlines are still \n here.

        // 6. Newlines
        // If we made <li>, we shouldn't convert their \n to <br> blindly inside the list?
        // Let's convert \n to <br> first, but that breaks list detection.
        // Order matters. 

        // Let's use the robust visual style:
        html = html.replace(/^\s*[-*]\s+(.*)$/gm, '• $1'); // Bullets
        html = html.replace(/\n/g, '<br>');                 // Newlines

        return html;
    }

    // Send Message Logic (Real API Integration)
    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        // User Message UI
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'fujiyama-new-message user';
        userMsgDiv.innerHTML = `
            <div class="fujiyama-new-message-bubble">${text}</div>
            <div class="fujiyama-new-message-avatar">👤</div>
        `;
        chatArea.appendChild(userMsgDiv);
        input.value = '';
        chatArea.scrollTop = chatArea.scrollHeight;

        // Loading Indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'fujiyama-new-message';
        loadingDiv.setAttribute('id', 'loading-indicator');
        loadingDiv.innerHTML = `
            <div class="fujiyama-new-message-avatar">🤖</div>
            <div class="fujiyama-new-message-bubble">Thinking...</div>
        `;
        chatArea.appendChild(loadingDiv);
        chatArea.scrollTop = chatArea.scrollHeight;

        try {
            const sessionId = getSessionId();
            const response = await fetch(`${DEFAULT_CONFIG.apiEndpoints.baseUrl}${DEFAULT_CONFIG.apiEndpoints.chatEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_id: sessionId,
                    message: text,
                    domain: DEFAULT_CONFIG.defaultDomain
                })
            });

            const data = await response.json();

            // Remove loading indicator
            if (loadingDiv) loadingDiv.remove();

            const botMsgDiv = document.createElement('div');
            botMsgDiv.className = 'fujiyama-new-message';

            if (response.ok && data.success) {
                // Apply formatting
                const formattedResponse = formatResponse(data.response);
                botMsgDiv.innerHTML = `
                    <div class="fujiyama-new-message-avatar">🤖</div>
                    <div class="fujiyama-new-message-bubble">${formattedResponse}</div>
                `;
            } else {
                // If it's a 500 or internal error, clear the session so the user can retry with a fresh state
                if (response.status === 500 || (data.response && data.response.includes("internal error"))) {
                    console.warn("Session seems corrupted. Clearing session ID.");
                    localStorage.removeItem('fujiyama_chat_session_id');
                }

                botMsgDiv.innerHTML = `
                    <div class="fujiyama-new-message-avatar">🤖</div>
                    <div class="fujiyama-new-message-bubble">I encountered an error. I have reset my memory. Please try your request again.</div>
                `;
            }
            chatArea.appendChild(botMsgDiv);

        } catch (error) {
            console.error('Chat Error:', error);
            if (loadingDiv) loadingDiv.remove();

            const errorDiv = document.createElement('div');
            errorDiv.className = 'fujiyama-new-message';
            errorDiv.innerHTML = `
                <div class="fujiyama-new-message-avatar">🤖</div>
                <div class="fujiyama-new-message-bubble">Unable to reach the server. Please check your connection.</div>
            `;
            chatArea.appendChild(errorDiv);
        }

        chatArea.scrollTop = chatArea.scrollHeight;
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Attach to window
    window.FujiyamaWidgetNew = {
        open: () => widget.classList.remove('minimized'),
        close: () => widget.classList.add('minimized'),
        toggle: () => widget.classList.toggle('minimized')
    };

})();
