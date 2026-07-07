from pathlib import Path

import yaml


def test_build_codebase_knowledge_skill_exists():
    root = Path(__file__).resolve().parents[1]
    skill = root / ".claude" / "skills" / "lincoln-build-codebase-knowledge" / "SKILL.md"
    assert skill.exists()
    assert "build codebase knowledge" in skill.read_text(encoding="utf-8").lower()


def test_explore_opensource_skill_exists():
    root = Path(__file__).resolve().parents[1]
    skill = root / ".claude" / "skills" / "lincoln-explore-opensource" / "SKILL.md"
    assert skill.exists()
    prompt = root / ".claude" / "skills" / "lincoln-explore-opensource" / "prompts" / "explore-opensource.md"
    assert prompt.exists()


def test_new_stages_registered_in_skill_routing():
    root = Path(__file__).resolve().parents[1]
    manifest = yaml.safe_load(
        (root / ".claude" / "stages" / "stage-manifest.yaml").read_text(encoding="utf-8")
    )
    required_skills = set()
    for stage in manifest.get("stages", []):
        skill = stage.get("required_skills")
        if skill:
            if isinstance(skill, str):
                required_skills.add(skill)
            else:
                required_skills.update(skill)
    assert "workflow-router" in required_skills
    assert "build-codebase-knowledge" in required_skills
    assert "explore-opensource" in required_skills
