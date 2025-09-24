from flask import Flask, request, jsonify
from llama_cpp import Llama
import json
import os
import qrcode

app = Flask(__name__)

# Load Mistral (GGUF) model with llama-cpp
mistral = Llama(
    model_path="D:/Personal_Codes/dypatil_hack/model/mistral-7b-instruct-v0.1.Q4_K_M.gguf",
    n_ctx=4096,       # context length
    n_threads=8,      # adjust to your CPU
    n_gpu_layers=20   # if you have GPU, else set 0
)

USAGE_FILE = "usage.json"

def update_usage():
    if not os.path.exists(USAGE_FILE):
        with open(USAGE_FILE, "w") as f:
            json.dump({"visits": 0}, f)

    with open(USAGE_FILE, "r") as f:
        data = json.load(f)

    data["visits"] += 1

    with open(USAGE_FILE, "w") as f:
        json.dump(data, f)

    return data["visits"]

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    prompt = data.get("prompt", "")

    # Query local Mistral model
    output = mistral(prompt, max_tokens=500)
    content = output["choices"][0]["text"]

    # Update usage
    visits = update_usage()

    # Generate QR for website
    qr_filename = "website_qr.png"
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data("http://127.0.0.1:5000")  # local link
    qr.make(fit=True)
    img = qr.make_image(fill="black", back_color="white")
    img.save(qr_filename)

    return jsonify({
        "content": content,
        "visits": visits,
        "qr_code": qr_filename
    })

if __name__ == "__main__":
    app.run(debug=True)
