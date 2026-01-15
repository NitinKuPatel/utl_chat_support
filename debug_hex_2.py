with open('public/chatbot-new.bundle.js', 'rb') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if 35 <= i+1 <= 55:
            print(f"{i+1}: {line}")
