from flask import Flask, render_template, request, jsonify
from datetime import datetime
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route("/save_score", methods=["POST"])
def save_score():
    data = request.get_json()

    required_fields = ["username", "score", "causeOfDeath", "durationInSec"]

    for fields in required_fields:
        if fields not in data:
            return jsonify({
                'status': 'error',
                'message': f"Missing data: {fields}"
            }), 400

    name = str(data["username"])
    score = int(data["score"])
    cause = str(data["causeOfDeath"])
    duration = int(data["durationInSec"])

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    gameData = f"[{timestamp}] {name} | {score} | {cause} | {duration}\n"

    with open("history.txt", "a") as f:
        f.write(gameData)

    return jsonify({
        'status': 'success',
        'message': "Data successfully stores in history.txt"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
