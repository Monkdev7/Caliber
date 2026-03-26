from __future__ import annotations

from pathlib import Path

import pdfplumber

try:
    import fitz
except ImportError:  # pragma: no cover - optional dependency
    fitz = None


class ResumeTextExtractor:
    """Extract text from PDF resumes with a primary and fallback parser."""

    def extract(self, file_path: str | Path) -> str:
        path = Path(file_path)
        if fitz is not None:
            text = self._extract_with_pymupdf(path)
            if text.strip():
                return text
        return self._extract_with_pdfplumber(path)

    def _extract_with_pymupdf(self, path: Path) -> str:
        if fitz is None:
            return ""
        chunks: list[str] = []
        with fitz.open(path) as doc:
            for page in doc:
                chunks.append(page.get_text("text"))
        return "\n".join(chunks).strip()

    def _extract_with_pdfplumber(self, path: Path) -> str:
        chunks: list[str] = []
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                chunks.append(page.extract_text() or "")
        return "\n".join(chunks).strip()
