import json
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
STAGE_LOADER = ROOT / "scripts" / "stage_loader.py"


def run_loader(*args):
    return subprocess.run(
        [sys.executable, str(STAGE_LOADER), *args],
        capture_output=True,
        text=True,
        cwd=ROOT,
    )


def test_load_workflow_router_stage_returns_context():
    result = run_loader("--stage", "workflow-router", "--action", "load")
    assert result.returncode == 0
    data = json.loads(result.stdout)
    assert data["stage_id"] == "workflow-router"
    assert "context" in data


def test_load_clarify_stage_returns_human_gate():
    result = run_loader("--stage", "clarify", "--action", "load")
    assert result.returncode == 0
    data = json.loads(result.stdout)
    assert data["stage_id"] == "clarify"
    assert data["human_gate"] is True


def test_recover_action_outputs_json():
    result = run_loader("--action", "recover")
    assert result.returncode == 0
    data = json.loads(result.stdout)
    assert "can_resume_from" in data
    assert "last_completed" in data


def test_validate_exit_fails_when_requirements_missing():
    # clarify exit check requires requirements.md, which is absent.
    result = run_loader("--stage", "clarify", "--action", "validate-exit")
    assert result.returncode == 1
    assert "FAIL" in result.stderr or "FAIL" in result.stdout
