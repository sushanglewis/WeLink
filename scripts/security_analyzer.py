#!/usr/bin/env python3
"""Risk analyzer for Lincoln pre-tool-use security gate.

Loads `.claude/security/risk-policy.yaml` and evaluates a tool call against the
configured policies. Designed to be invoked from `.claude/hooks/pre-tool-use.sh`
and from generated harness-specific hook scripts.
"""

from __future__ import annotations

import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import yaml

DEFAULT_POLICY_PATH = ".claude/security/risk-policy.yaml"


def load_policy(root: Path) -> dict[str, Any]:
    """Load the risk policy YAML, returning an empty policy if missing."""
    path = root / DEFAULT_POLICY_PATH
    if not path.exists():
        return {"policies": []}
    return yaml.safe_load(path.read_text(encoding="utf-8")) or {"policies": []}


def _normalize_command(command: str) -> str:
    """Strip leading whitespace and collapse internal spaces for matching."""
    return re.sub(r"\s+", " ", command.strip())


def _command_matches(condition: str, command: str) -> bool:
    """Evaluate a human-readable condition against a bash command.

    Supports a small set of explicitly declared patterns so the policy file
    remains readable. Unknown conditions are treated as non-matching.
    """
    cmd = _normalize_command(command)
    lowered = condition.lower()

    if "rm -rf" in lowered or 'command matches "rm -rf"' in lowered:
        if re.search(r"\brm\s+-rf\b", cmd):
            return True

    if 'command matches "rm -r" or "rm -rf"' in lowered:
        if re.search(r"\brm\s+-r(?:f)?\b", cmd):
            return True

    if 'command matches any of ["rm", "rmdir"]' in lowered:
        if re.match(r"(?:rm\b|rmdir\b)", cmd):
            return True

    if 'command matches "git push"' in lowered:
        if re.match(r"git\s+push\b", cmd):
            return True

    if "external http client" in lowered or "curl, wget" in lowered:
        if re.match(r"(?:curl|wget|httpie)\b", cmd):
            return True

    if 'command matches "rm"' in lowered and "rmdir" not in lowered:
        if re.match(r"rm\b", cmd):
            return True

    return False


def _target_matches(condition: str, target: str, process_slug: str) -> bool:
    """Evaluate a file-target condition."""
    lowered = condition.lower()
    normalized = target.lstrip("/")
    if "outside current process_slug" in lowered:
        return not normalized.startswith(f"{process_slug}/")
    if "inside current process_slug" in lowered:
        return normalized.startswith(f"{process_slug}/")
    return False


def _evaluate_policy(policy: dict[str, Any], tool_name: str, tool_args: dict[str, Any], process_slug: str) -> bool:
    """Return True if the policy applies to this tool call."""
    tools = [t.strip() for t in policy.get("tool", "").split("|")]
    if tool_name not in tools:
        return False

    condition = policy.get("condition", "")
    if tool_name == "Bash":
        command = tool_args.get("command", "")
        return _command_matches(condition, command)

    if tool_name in ("Write", "Edit"):
        target = tool_args.get("file_path") or tool_args.get("path") or ""
        return _target_matches(condition, target, process_slug)

    return False


def _log_security_event(
    log_dir: Path,
    tool_name: str,
    tool_args: dict[str, Any],
    result: dict[str, Any],
) -> None:
    """Append a JSON line to issue-<N>/logs/security.log."""
    log_dir.mkdir(parents=True, exist_ok=True)
    log_file = log_dir / "security.log"
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "tool": tool_name,
        "level": result["level"],
        "policy": result.get("policy", ""),
        "action": "blocked" if result["confirm_required"] else "allowed",
        "args": {k: v for k, v in tool_args.items() if k in ("command", "file_path", "path")},
    }
    with log_file.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def analyze(
    root: Path,
    tool_name: str,
    tool_args: dict[str, Any],
    process_slug: str = "",
    log_dir: str | None = None,
) -> dict[str, Any]:
    """Analyze a tool call and return risk assessment.

    Returns a dict with keys:
      level: low | medium | high | unknown
      policy: matched policy name or ""
      message: human-readable message or ""
      confirm_required: bool
      log: bool
    """
    if os.environ.get("LINCOLN_SECURITY_MODE") == "permissive":
        return {
            "level": "low",
            "policy": "",
            "message": "Security analyzer is in permissive mode.",
            "confirm_required": False,
            "log": False,
        }

    policy_data = load_policy(root)
    policies = policy_data.get("policies", [])

    # Evaluate in order; the first matching policy wins.
    for policy in policies:
        if not _evaluate_policy(policy, tool_name, tool_args, process_slug):
            continue

        result = {
            "level": policy.get("level", "unknown"),
            "policy": policy.get("name", ""),
            "message": policy.get("message", ""),
            "confirm_required": bool(policy.get("confirm", False)),
            "log": bool(policy.get("log", False)),
        }
        if log_dir:
            _log_security_event(Path(log_dir), tool_name, tool_args, result)
        return result

    # No policy matched: default to low risk.
    result = {
        "level": "low",
        "policy": "",
        "message": "",
        "confirm_required": False,
        "log": False,
    }
    return result


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Analyze tool call risk")
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument("--tool", required=True)
    parser.add_argument("--args", default="{}")
    parser.add_argument("--process-slug", default="")
    parser.add_argument("--log-dir", default=None)
    args = parser.parse_args()

    tool_args = json.loads(args.args)
    result = analyze(
        args.root,
        args.tool,
        tool_args,
        process_slug=args.process_slug,
        log_dir=args.log_dir,
    )
    print(json.dumps(result, ensure_ascii=False))
