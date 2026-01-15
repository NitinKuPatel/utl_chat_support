with open('public/chatbot-new.bundle.js', 'rb') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if 105 <= i+1 <= 115:
            print(f"{i+1}: {line}")
