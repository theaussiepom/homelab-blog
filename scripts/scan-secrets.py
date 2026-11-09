"""Fail on scanner errors, current-tree secrets, history secrets or a broken detector."""
import secrets
import string
from pathlib import Path
import subprocess
import sys
import tempfile

scanner = str(Path(sys.argv[1]).resolve())
subprocess.run([scanner, 'dir', '.', '--redact', '--no-banner'], check=True)
subprocess.run([scanner, 'git', '.', '--log-opts=--all', '--redact', '--no-banner'], check=True)
with tempfile.TemporaryDirectory(prefix='homelab-secret-test-') as directory:
    # Deliberately synthetic, generated only in an isolated temporary directory.
    Path(directory, 'fixture.txt').write_text('github_token = "' + 'ghp_' + ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(36)) + '"\n')
    result = subprocess.run([scanner, 'dir', directory, '--redact', '--no-banner'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if result.returncode != 1:
        raise SystemExit('Secret detector negative case failed or scanner errored.')
print('Current tree, complete reachable Git history and synthetic secret negative case verified.')
