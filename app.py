import os
import sys

from flask import Flask, jsonify, render_template, request, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

try:
    from BACKEND.chatbot import get_biology_response
except ModuleNotFoundError:
    from backend.chatbot import get_biology_response

app = Flask(__name__, template_folder=os.path.join(BASE_DIR, "mathverse"), static_folder=BASE_DIR, static_url_path="")

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/visgen")
def visgen():
    return render_template("index.html")


@app.route("/biology")
def biology():
    return send_from_directory(
        os.path.join(BASE_DIR, "mathverse"),
        "indexbio.html"
    )


@app.route("/maths")
def maths():
    return render_template("indexmaths.html")


@app.route("/physics")
def physics():
    return render_template("physics.html")


@app.route("/chemistry")
def chemistry():
    return render_template("indexchem.html")


@app.route("/api/biology-chat", methods=["POST"])
def biology_chat():

    try:
        data = request.get_json(silent=True) or {}

        message = data.get("message", "").strip()

        if not message:
            return jsonify({
                "success": False,
                "error": "Please enter a question."
            }), 400

        answer = get_biology_response(message)

        return jsonify({
            "success": True,
            "response": answer
        })

    except Exception as error:
        app.logger.exception("Biology chatbot error")

        return jsonify({
            "success": False,
            "error": "Something went wrong. Please try again."
        }), 500


if __name__ == "__main__":
    app.run(debug=True)