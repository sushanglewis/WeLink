import sys
from pathlib import Path
from unittest.mock import patch

import pytest

PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(PROJECT_ROOT))

from scripts import validate_stage


def run_validator(root: Path, check_name: str, *args):
    """Run a validator exit check with PROJECT_ROOT temporarily patched to root."""
    check_fn = validate_stage.EXIT_CHECKS[check_name]
    with patch.object(validate_stage, "PROJECT_ROOT", root):
        with pytest.raises(SystemExit) as exc_info:
            check_fn(*args)
    return exc_info.value.code
