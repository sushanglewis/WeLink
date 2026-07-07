#!/usr/bin/env python3
"""
Lincoln path helpers.

This is a flat-path variant for WeLink. It preserves the upstream API surface
( resolve_state_path, get_process_slug, interpolate_process_path, etc.) but
returns project-root paths and never requires a process-package layout.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml


ROOT_STATE_PATH = Path(".claude/workflow-state.yaml")
LEGACY_STATE_PATH = Path(".claude/workflow-state.yaml")

# Reserved directory names used by the upstream process-package layout.
# WeLink uses a flat-path layout, so this set is empty.
RESERVED_PROCESS_DIRS: set[str] = set()


def load_yaml(path: Path) -> Any:
    if not path.exists():
        raise FileNotFoundError(path)
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def resolve_state_path(path: Path | None, project_root: Path) -> Path:
    """Return the canonical branch-scoped workflow state file path."""
    if path is not None:
        return project_root / path if not path.is_absolute() else path
    return project_root / ROOT_STATE_PATH


def default_process_slug(project_root: Path) -> str:
    """WeLink does not use process packages; return an empty slug."""
    return ""


def get_process_slug(state: dict[str, Any], state_file: Path | None = None) -> str:
    """Return the process slug from state, or empty string for flat-path projects."""
    variables = state.get("current_run", {}).get("variables", state.get("variables", {}))
    return variables.get("process_slug", "")


def process_package_root(project_root: Path, process_slug: str | None = None) -> Path:
    """Flat-path projects operate directly from the project root."""
    return project_root


def interpolate_process_path(value: str, state: dict[str, Any], state_file: Path | None = None) -> str:
    """Strip any literal `{process_slug}` placeholder; flat paths need no prefix."""
    return value.replace("{process_slug}/", "").replace("{process_slug}", "")
