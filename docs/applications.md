
# Applications

## Desktop (Tauri)

The desktop client is the **main coding environment** used by participants.

Responsibilities:

* Monaco code editor
* Blind coding blur mechanics
* Reveal system
* Fullscreen/kiosk enforcement
* Clipboard restrictions
* Focus loss detection
* Secure communication with backend API

Technology stack:

* React
* Vite
* Monaco Editor
* Tauri (Rust)

---

## API (Backend)

The backend service manages competition logic and communication.

Responsibilities:

* authentication and session management
* problem distribution
* submission handling
* scoring and penalties
* monitoring events (focus loss, reveals, etc.)
* communication with the code execution service

Technology stack:

* Node.js
* Express

---

## Admin Dashboard

A web dashboard used by organizers and volunteers to monitor competitions.

Responsibilities:

* participant monitoring
* reveal count tracking
* compile/run statistics
* focus loss incidents
* suspicion scoring
* competition control

Technology stack:

* React
* Vite