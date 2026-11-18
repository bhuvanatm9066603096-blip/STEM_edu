from flask import Flask, jsonify, request, send_from_directory
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent

FRONTEND = ROOT / "frontend"

DATA_DIR = Path(__file__).resolve().parent / "data"

EVENTS_FILE = DATA_DIR / "events.json"


app = Flask(
    __name__,
    static_folder=str(FRONTEND),
    static_url_path="/static"
)


def load_events():
    try:
        if EVENTS_FILE.exists():
            return json.loads(
                EVENTS_FILE.read_text(
                    encoding="utf-8"
                )
            )
    except (OSError, json.JSONDecodeError):
        pass

    return []


def save_events(events):

    DATA_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    EVENTS_FILE.write_text(
        json.dumps(
            events[-500:],
            indent=2
        ),
        encoding="utf-8"
    )


@app.get("/")
def index():

    return send_from_directory(
        FRONTEND,
        "index.html"
    )


@app.post("/api/event")
def add_event():

    data = request.get_json(
        silent=True
    ) or {}

    event = {
        "kind": str(
            data.get("kind", "")
        ),

        "key": str(
            data.get("key", "")
        ),

        "ok": int(
            bool(
                data.get(
                    "ok",
                    False
                )
            )
        )
    }

    events = load_events()

    events.append(event)

    save_events(events)

    return jsonify({
        "status": "ok",
        "event": event
    })


@app.get("/api/progress")
def progress():

    return jsonify(
        load_events()
    )


if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )