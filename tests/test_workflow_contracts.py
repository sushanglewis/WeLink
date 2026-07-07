import re
from pathlib import Path

import pytest
import yaml


WORKFLOW_FILES = [
    ".claude/workflows/interview-to-knowledge.yaml",
    ".claude/workflows/templates/bug-fix.yaml",
    ".claude/workflows/templates/design-spike.yaml",
    ".claude/workflows/templates/existing-project-iteration.yaml",
    ".claude/workflows/templates/oss-first-design.yaml",
]


@pytest.fixture
def validator_source():
    root = Path(__file__).resolve().parents[1]
    validator_path = root / "scripts" / "validate_stage.py"
    return validator_path.read_text(encoding="utf-8")


def _extract_registry_names(source, registry_name):
    pattern = rf"{registry_name}\s*=\s*\{{([^}}]+)\}}"
    match = re.search(pattern, source, re.DOTALL)
    if not match:
        raise ValueError(f"Could not find {registry_name} in validator source")
    return set(re.findall(r'"(\w+)"', match.group(1)))


@pytest.mark.parametrize("workflow_file", WORKFLOW_FILES)
def test_workflow_checks_exist_in_validator_registry(workflow_file, validator_source):
    root = Path(__file__).resolve().parents[1]
    workflow_path = root / workflow_file
    workflow = yaml.safe_load(workflow_path.read_text(encoding="utf-8"))

    entry_names = _extract_registry_names(validator_source, "ENTRY_CHECKS")
    exit_names = _extract_registry_names(validator_source, "EXIT_CHECKS")

    used_entry = set()
    used_exit = set()
    for step in workflow["workflow"]["steps"]:
        for check in step.get("entry_checks", []):
            used_entry.add(check["check"])
        for check in step.get("exit_checks", []):
            used_exit.add(check["check"])

    assert used_entry <= entry_names, f"Missing entry checks: {used_entry - entry_names}"
    assert used_exit <= exit_names, f"Missing exit checks: {used_exit - exit_names}"


@pytest.fixture
def interview_to_knowledge_workflow():
    root = Path(__file__).resolve().parents[1]
    workflow_path = root / ".claude" / "workflows" / "interview-to-knowledge.yaml"
    return yaml.safe_load(workflow_path.read_text(encoding="utf-8"))


def test_propose_step_requires_tdd_plan_ready(interview_to_knowledge_workflow):
    propose = next(s for s in interview_to_knowledge_workflow["workflow"]["steps"] if s["id"] == "propose")
    entry_checks = [c["check"] for c in propose.get("entry_checks", [])]
    assert "tdd_plan_ready" in entry_checks


def test_propose_step_uses_tdd_plan_as_input_file(interview_to_knowledge_workflow):
    propose = next(s for s in interview_to_knowledge_workflow["workflow"]["steps"] if s["id"] == "propose")
    assert propose.get("input_file") == "designs/{design_id}/tdd-plan.md"
