# BitBot

A lightweight, embeddable GenAI chatbot microservice that powers natural-language Q\&A across multiple projects (e.g., ML Playground, Credit Risk App).

## Purpose

BitBot centralizes conversational AI logic in a standalone service. Frontends embed a simple widget or iframe to let users ask questions and receive dynamic answers, code snippets, and visualizations.

## Features

* **Standalone FastAPI service** with `/query` endpoint
* **LangChain-based** retrieval and execution pipelines
* **Vector store** for indexing notebooks and project docs
* **Embeddable widget** (JS snippet or iframe) for any static site
* **Context-aware**: route queries to project-specific corpora

## License

MIT © Vansh Deshwal
