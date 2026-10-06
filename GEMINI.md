# Agent & IDE Operational Rules

## 1. Direct Disk Writes Only (Avoid Diff-Review Reverts)
> [!CAUTION]
> **STRICT BAN**: NEVER use IDE diff-staging tools (`write_to_file` / `replace_file_content`) on any project file in this workspace. The IDE's review buffer causes automatic rollbacks at the end of turns.

- **Mandatory Tool**: Always use `run_command` to write or patch project files directly to disk.
- **Execution Recipes**:
  - **PowerShell (Creating / Overwriting)**:
    ```powershell
    [System.IO.File]::WriteAllText("$PWD/path/to/file.ext", @"
    <file_content>
    "@, [System.Text.Encoding]::UTF8)
    ```
  - **Python (Direct Script / Patch)**:
    ```powershell
    python -c "import sys, pathlib; sys.stdout.reconfigure(encoding='utf-8'); pathlib.Path('path/to/file.ext').write_text('''<content>''', encoding='utf-8')"
    ```
- **Exemption**: Artifacts in the agent brain directory (`brain/<conversation-id>/...`) are exempt and follow standard artifact creation tools.

## 2. Windows PowerShell Constraints
- **Directory Changes**: Never issue `cd` commands in `run_command`; always set the execution folder using the `Cwd` parameter.
- **Maven Wrapper**: Use `.\mvnw.cmd` instead of `./mvnw` or `mvnw`.
- **UTF-8 Encoding**: Configure UTF-8 output (`sys.stdout.reconfigure(encoding="utf-8")`) in all inline Python scripts executed via PowerShell.