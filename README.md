# BlindCode Arena

BlindCode Arena is a **controlled blind coding competition platform** designed for lab-based environments.
It introduces a **blurred code editor mechanic** that limits visual clarity while coding, encouraging participants to rely on structured thinking, memory discipline, and intentional code design rather than constant visual scanning and trial-and-error debugging.

The platform combines a **desktop coding client (Tauri)**, a **backend API**, and an **admin monitoring dashboard** to create a complete competition environment suitable for college contests, lab assessments, and interview simulations.

---

# Table of Contents

- [Prerequisites](#prerequisites)
- [Repository Setup](#repository-setup)
- [Project Structure](#project-structure)
- [Running the Project](#running-the-project)
- [Contributing](#contributing)
- [License](#license)

---

# Prerequisites

Make sure the following tools are installed before setting up the project.

### Node.js

Install Node.js (recommended: LTS).

### pnpm

Package manager used in this monorepo.

```bash
npm install -g pnpm
```

### Rust (required for Tauri)

Install Rust using `winget`:

```bash
winget install Rustlang.Rustup
```

After installation verify:

```bash
rustc --version
cargo --version
```

### Microsoft Visual Studio Build Tools

Required for compiling the Tauri Rust backend.

Install via:

```bash
winget install Microsoft.VisualStudio.2022.BuildTools
```

During installation select:

```
Desktop development with C++
```

### Git

```bash
git --version
```

---

# Repository Setup

Clone the repository:

```bash
git clone https://github.com/Apoorv012/BlindCode.git
cd BlindCode
```

Install dependencies for the entire monorepo:

```bash
pnpm install
```

---

# Project Structure

The project is organized as a **Turborepo monorepo**.

```
BlindCode
│
├─ apps
│  ├─ desktop    # Tauri desktop coding client
│  ├─ api        # Express backend API
│  └─ admin      # Admin monitoring dashboard
│
├─ packages
│  ├─ ui                 # Shared UI components
│  ├─ eslint-config      # Shared ESLint configuration
│  └─ typescript-config  # Shared TypeScript configuration
│
├─ turbo.json
└─ pnpm-workspace.yaml
```

Details about the system components are available here:

➡️ - [docs/applications.md](docs/applications.md)

---

# Running the Project

Start backend and admin services:

```bash
pnpm dev
```

This launches:

* API server
* Admin dashboard

To run the desktop application:

```bash
pnpm tauri
```

This launches the **BlindCode desktop client** using Tauri.

---

# Contributing

Contributions are welcome.

If you would like to contribute:

1. Fork the repository
2. Create a new feature branch

```
git checkout -b feature/your-feature
```

3. Make your changes
4. Commit clearly

```
git commit -m "Add: meaningful feature description"
```

5. Push to your fork and open a pull request

Before submitting a PR, please ensure:

* the project builds successfully
* linting passes
* code follows the repository style conventions

For major changes or architectural decisions, it is recommended to **open an issue first to discuss the proposal**.

---

# License

License information will be added soon.
