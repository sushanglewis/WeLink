# tools/record-interview/record_interview/recorder.py
from __future__ import annotations

import shutil
import subprocess
import time
from pathlib import Path


class RecordingError(Exception):
    pass


class FfmpegRecorder:
    def __init__(self, sample_rate: int = 44100) -> None:
        self.sample_rate = sample_rate
        self._process: subprocess.Popen | None = None
        self._output_path: Path | None = None
        self._started_at: float | None = None

    def _build_command(self, output_path: Path) -> list[str]:
        return [
            "ffmpeg",
            "-y",
            "-f", "avfoundation",
            "-i", ":default",
            "-ar", str(self.sample_rate),
            "-c:a", "aac",
            "-b:a", "128k",
            str(output_path),
        ]

    def start(self, output_path: Path) -> None:
        if not shutil.which("ffmpeg"):
            raise RecordingError("ffmpeg not found in PATH")
        if self._process is not None:
            raise RecordingError("already recording")

        self._output_path = output_path
        self._started_at = time.monotonic()
        cmd = self._build_command(output_path)
        self._process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        time.sleep(0.05)
        if self._process.poll() is not None:
            stderr = self._process.stderr.read() if self._process.stderr else ""
            self._process = None
            self._started_at = None
            raise RecordingError(f"ffmpeg failed to start: {stderr}")

    def stop(self) -> int:
        if self._process is None:
            raise RecordingError("not recording")
        self._process.terminate()
        try:
            self._process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            self._process.kill()
            self._process.wait(timeout=5)

        returncode = self._process.returncode
        stderr = self._process.stderr.read() if self._process.stderr else ""
        duration = int(time.monotonic() - self._started_at) if self._started_at else 0
        self._process = None
        self._started_at = None

        if returncode != 0:
            # ffmpeg often exits with 255 after receiving SIGTERM, even though
            # it has already flushed the output. Treat that as a successful stop.
            if "Exiting normally" in stderr:
                return duration
            raise RecordingError(f"ffmpeg exited with code {returncode}: {stderr}")
        return duration

    def is_recording(self) -> bool:
        return self._process is not None and self._process.poll() is None
