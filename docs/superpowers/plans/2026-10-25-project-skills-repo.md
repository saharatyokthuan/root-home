# Project Skills Repository Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a public GitHub repository `project-skills` under account `saharatyokthuan` to store SKILL.md files organized by project (12 projects from `/root/projects/`), with README.md, GitHub Actions workflow for markdown validation, and template files.

**Architecture:** Use GitHub CLI to create the repository, clone locally, create folder structure matching the 12 projects in `/root/projects/`, add a SKILL.md template and individual SKILL.md files per project, add README.md with project table and links, add a GitHub Actions workflow for markdown linting and link checking, then push to GitHub.

**Tech Stack:** GitHub CLI (`gh`), Git, Markdown, GitHub Actions (markdownlint, markdown-link-check)

**Spec:** This plan serves as its own spec — the requirements are captured in the Global Constraints and task definitions below.

## Global Constraints

- Repository name: `project-skills`
- Repository visibility: Public
- GitHub owner: `saharatyokthuan`
- Folder structure: One folder per project (12 folders matching `/root/projects/`)
- Each project folder contains: `SKILL.md` (from template)
- Root files: `README.md`, `.github/workflows/validate.yml`, `templates/SKILL.md.template`
- No license file (to be added later)
- Default branch: `main`
- Commit messages: Conventional Commits format (feat:, docs:, ci:, etc.)

## Review Focus

1. **Missing project folders** — All 12 projects from `/root/projects/` must have a folder with SKILL.md; verify none are omitted.
2. **Broken links in README.md** — All internal links to project folders must resolve; verify each `./Project-Name/SKILL.md` path exists.
3. **GitHub Actions workflow runs on push** — The validate workflow must trigger on push to main and PRs; verify YAML syntax and job steps.
4. **Template file usability** — The SKILL.md.template must contain all required sections (header, purpose, usage, examples) so new skills can be created easily.
5. **Markdown linting passes** — All .md files must pass markdownlint (no trailing whitespace, proper heading hierarchy, etc.); verify CI passes.

---

### Task 1: Create GitHub Repository

**Files:**
- Create: (remote repo only, no local files yet)

**Interfaces:**
- Consumes: None
- Produces: Remote repository `saharatyokthuan/project-skills` (public, main branch)

- [ ] **Step 1: Create repository via GitHub CLI**

Run: `gh repo create saharatyokthuan/project-skills --public --description "Skills repository organized by project" --clone=false`
Expected: Repository created at https://github.com/saharatyokthuan/project-skills

- [ ] **Step 2: Verify repository exists**

Run: `gh repo view saharatyokthuan/project-skills --json name,visibility,owner,defaultBranchRef`
Expected: JSON with name="project-skills", visibility="PUBLIC", owner.login="saharatyokthuan", defaultBranchRef.name="main"

- [ ] **Step 3: Clone repository locally**

Run: `cd /tmp && gh repo clone saharatyokthuan/project-skills project-skills`
Expected: Local clone at `/tmp/project-skills` with main branch checked out

- [ ] **Step 4: Commit initial state**

Run: `cd /tmp/project-skills && git commit --allow-empty -m "chore: initial empty commit"`
Expected: Empty commit on main branch

---

### Task 2: Create Project Folder Structure

**Files:**
- Create: 12 directories in `/tmp/project-skills/`

**Interfaces:**
- Consumes: Cloned repo from Task 1
- Produces: 12 project folders ready for SKILL.md files

- [ ] **Step 1: Create 12 project directories**

Run: `cd /tmp/project-skills && mkdir -p Cash-Flow Olympus budgetctrl finance-app j-bunrod pos-mobile pos-mobile-labs python-lessons saharatyokthuan shiftmate vender`
Expected: 12 directories created (verify with `ls -1`)

- [ ] **Step 2: Verify folder count matches source**

Run: `cd /tmp/project-skills && ls -1 | wc -l`
Expected: Output "12"

- [ ] **Step 3: Commit folder structure**

Run: `cd /tmp/project-skills && git add . && git commit -m "feat: add project folder structure (12 projects)"`
Expected: Commit with 12 new directories

---

### Task 3: Create SKILL.md Template

**Files:**
- Create: `/tmp/project-skills/templates/SKILL.md.template`

**Interfaces:**
- Consumes: Project folders from Task 2
- Produces: Template file used to generate individual SKILL.md files

- [ ] **Step 1: Write failing test - verify template doesn't exist yet**

Run: `test ! -f /tmp/project-skills/templates/SKILL.md.template && echo "FAIL: template missing" || echo "PASS: template exists"`
Expected: FAIL with "template missing"

- [ ] **Step 2: Create template file with standard skill structure**

Run: `cat > /tmp/project-skills/templates/SKILL.md.template << 'EOF'
# [Skill Name] Skill

> **For agentic workers:** REQUIRED SUB-SKILL: [sub-skill name if any]

**Purpose:** [One sentence describing what this skill does and when to use it]

**When to Use:** [Conditions that trigger use of this skill]

## Overview

[Detailed description of the skill, its scope, and key concepts]

## Interface

### Inputs
- [Input 1]: [Description and type]
- [Input 2]: [Description and type]

### Outputs
- [Output 1]: [Description and type]

## Usage

```bash
# Example command or code snippet showing how to invoke/use this skill
```

## Examples

### Example 1: [Scenario]
```bash
# Command or code
```

### Example 2: [Scenario]
```bash
# Command or code
```

## Constraints & Rules

- [Rule 1]
- [Rule 2]

## Related Skills

- [Related skill 1]
- [Related skill 2]

## References

- [Link to documentation or source]
EOF
`
Expected: Template file created at `/tmp/project-skills/templates/SKILL.md.template`

- [ ] **Step 3: Verify template exists and has content**

Run: `test -f /tmp/project-skills/templates/SKILL.md.template && wc -l /tmp/project-skills/templates/SKILL.md.template`
Expected: File exists with ~35+ lines

- [ ] **Step 4: Commit template**

Run: `cd /tmp/project-skills && git add templates/SKILL.md.template && git commit -m "feat: add SKILL.md template"`
Expected: Commit with template file

---

### Task 4: Create Individual SKILL.md Files Per Project

**Files:**
- Create: 12 files at `/tmp/project-skills/<Project-Name>/SKILL.md`

**Interfaces:**
- Consumes: Template from Task 3, project folders from Task 2
- Produces: 12 populated SKILL.md files (one per project)

- [ ] **Step 1: Write failing test - verify no SKILL.md files exist yet**

Run: `find /tmp/project-skills -name "SKILL.md" -not -path "*/templates/*" | wc -l`
Expected: Output "0"

- [ ] **Step 2: Generate SKILL.md for each project from template**

Run: `cd /tmp/project-skills && for dir in Cash-Flow Olympus budgetctrl finance-app j-bunrod pos-mobile pos-mobile-labs python-lessons saharatyokthuan shiftmate vender; do cp templates/SKILL.md.template "$dir/SKILL.md"; sed -i "1s/.*/# $dir Skill/" "$dir/SKILL.md"; sed -i "s/\[Skill Name\]/$dir Skill/" "$dir/SKILL.md"; sed -i "s/\[sub-skill name if any\]/N\\/A/" "$dir/SKILL.md"; sed -i "s/\[One sentence describing what this skill does and when to use it\]/Skill for $dir project/" "$dir/SKILL.md"; done`
Expected: 12 SKILL.md files created with project-specific names

- [ ] **Step 3: Verify all 12 SKILL.md files exist**

Run: `find /tmp/project-skills -name "SKILL.md" -not -path "*/templates/*" | wc -l`
Expected: Output "12"

- [ ] **Step 4: Verify content customization**

Run: `head -5 /tmp/project-skills/Cash-Flow/SKILL.md`
Expected: First line "# Cash-Flow Skill", second line references "Cash-Flow Skill"

- [ ] **Step 5: Commit all SKILL.md files**

Run: `cd /tmp/project-skills && git add */SKILL.md && git commit -m "feat: add SKILL.md for all 12 projects"`
Expected: Commit with 12 new SKILL.md files

---

### Task 5: Create README.md

**Files:**
- Create: `/tmp/project-skills/README.md`

**Interfaces:**
- Consumes: Project folders and SKILL.md files from Tasks 2-4
- Produces: Main documentation with project table and links

- [ ] **Step 1: Write failing test - verify README.md doesn't exist**

Run: `test ! -f /tmp/project-skills/README.md && echo "FAIL: README missing" || echo "PASS: README exists"`
Expected: FAIL with "README missing"

- [ ] **Step 2: Create README.md with project table**

Run: `cat > /tmp/project-skills/README.md << 'EOF'
# Project Skills Repository

This repository contains skill definitions (SKILL.md) for each project in the workspace, organized by project folder.

## Projects

| Project | Description | Skill File |
|---------|-------------|------------|
| [Cash-Flow](./Cash-Flow/SKILL.md) | Static Thai finance SPA (HTML/JS/CSS, localStorage) | `Cash-Flow/SKILL.md` |
| [Olympus](./Olympus/SKILL.md) | Empty project | `Olympus/SKILL.md` |
| [budgetctrl](./budgetctrl/SKILL.md) | Static HTML/JS budget tracker | `budgetctrl/SKILL.md` |
| [finance-app](./finance-app/SKILL.md) | Finance application | `finance-app/SKILL.md` |
| [j-bunrod](./j-bunrod/SKILL.md) | GitHub profile README | `j-bunrod/SKILL.md` |
| [pos-mobile](./pos-mobile/SKILL.md) | Static Thai POS SPA | `pos-mobile/SKILL.md` |
| [pos-mobile-labs](./pos-mobile-labs/SKILL.md) | POS mobile experiments | `pos-mobile-labs/SKILL.md` |
| [python-lessons](./python-lessons/SKILL.md) | Python data-analysis course | `python-lessons/SKILL.md` |
| [saharatyokthuan](./saharatyokthuan/SKILL.md) | GitHub profile README | `saharatyokthuan/SKILL.md` |
| [shiftmate](./shiftmate/SKILL.md) | Shift-scheduling SPA with optional Flask backend | `shiftmate/SKILL.md` |
| [vender](./vender/SKILL.md) | Vendor management | `vender/SKILL.md` |

## Structure

```
project-skills/
├── Cash-Flow/
│   └── SKILL.md
├── Olympus/
│   └── SKILL.md
├── budgetctrl/
│   └── SKILL.md
├── finance-app/
│   └── SKILL.md
├── j-bunrod/
│   └── SKILL.md
├── pos-mobile/
│   └── SKILL.md
├── pos-mobile-labs/
│   └── SKILL.md
├── python-lessons/
│   └── SKILL.md
├── saharatyokthuan/
│   └── SKILL.md
├── shiftmate/
│   └── SKILL.md
├── vender/
│   └── SKILL.md
├── templates/
│   └── SKILL.md.template
├── .github/
│   └── workflows/
│       └── validate.yml
└── README.md
```

## Usage

Each project folder contains a `SKILL.md` file that defines skills specific to that project. Use the template at `templates/SKILL.md.template` to create new skills.

## Contributing

1. Fork the repository
2. Create a new skill file in the appropriate project folder (or create a new project folder)
3. Follow the template structure
4. Submit a pull request

## License

TBD
EOF
`
Expected: README.md created at `/tmp/project-skills/README.md`

- [ ] **Step 3: Verify README.md exists and has links**

Run: `test -f /tmp/project-skills/README.md && grep -c "\.md" /tmp/project-skills/README.md`
Expected: File exists with 12+ markdown links

- [ ] **Step 4: Commit README.md**

Run: `cd /tmp/project-skills && git add README.md && git commit -m "docs: add README.md with project table and links"`
Expected: Commit with README.md

---

### Task 6: Create GitHub Actions Workflow for Markdown Validation

**Files:**
- Create: `/tmp/project-skills/.github/workflows/validate.yml`

**Interfaces:**
- Consumes: All markdown files in repo (README.md, 12 SKILL.md, template)
- Produces: CI workflow that runs markdownlint and markdown-link-check

- [ ] **Step 1: Write failing test - verify workflow doesn't exist**

Run: `test ! -f /tmp/project-skills/.github/workflows/validate.yml && echo "FAIL: workflow missing" || echo "PASS: workflow exists"`
Expected: FAIL with "workflow missing"

- [ ] **Step 2: Create workflow directory**

Run: `mkdir -p /tmp/project-skills/.github/workflows`
Expected: Directory created

- [ ] **Step 3: Create validate.yml workflow**

Run: `cat > /tmp/project-skills/.github/workflows/validate.yml << 'EOF'
name: Validate Markdown

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  markdown-lint:
    name: Markdown Lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install markdownlint-cli
        run: npm install -g markdownlint-cli
      - name: Run markdownlint
        run: markdownlint "**/*.md" --ignore "node_modules" --config .markdownlintrc.json

  link-check:
    name: Markdown Link Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Run markdown-link-check
        uses: gaurav-nelson/github-action-markdown-link-check@v1
        with:
          config-file: .markdown-link-check.json
          use-quiet-mode: 'yes'
EOF
`
Expected: Workflow file created at `/tmp/project-skills/.github/workflows/validate.yml`

- [ ] **Step 4: Create markdownlint config**

Run: `cat > /tmp/project-skills/.markdownlintrc.json << 'EOF'
{
  "default": true,
  "MD013": false,
  "MD024": false,
  "MD033": false,
  "MD041": false
}
EOF
`
Expected: Config file created

- [ ] **Step 5: Create markdown-link-check config**

Run: `cat > /tmp/project-skills/.markdown-link-check.json << 'EOF'
{
  "retryOn429": true,
  "retryCount": 3,
  "fallbackRetryDelay": 1000,
  "aliveStatusCodes": [200, 206],
  "ignorePatterns": [
    { "pattern": ".*github.com.*/edit/.*" }
  ]
}
EOF
`
Expected: Config file created

- [ ] **Step 6: Verify workflow and configs exist**

Run: `ls -la /tmp/project-skills/.github/workflows/ /tmp/project-skills/.markdownlintrc.json /tmp/project-skills/.markdown-link-check.json`
Expected: All 3 files exist

- [ ] **Step 7: Commit workflow and configs**

Run: `cd /tmp/project-skills && git add .github/workflows/validate.yml .markdownlintrc.json .markdown-link-check.json && git commit -m "ci: add GitHub Actions workflow for markdown validation"`
Expected: Commit with workflow and config files

---

### Task 7: Push to GitHub and Verify

**Files:**
- Modify: Remote repository state

**Interfaces:**
- Consumes: All local commits from Tasks 1-6
- Produces: Pushed repository with all files on GitHub

- [ ] **Step 1: Push to GitHub**

Run: `cd /tmp/project-skills && git push origin main`
Expected: Push successful, all commits on remote main branch

- [ ] **Step 2: Verify remote files**

Run: `gh api repos/saharatyokthuan/project-skills/contents --jq '.[].name' | sort`
Expected: Lists all 12 project folders, templates, .github, README.md

- [ ] **Step 3: Trigger and verify GitHub Actions workflow**

Run: `gh workflow run validate.yml -R saharatyokthuan/project-skills && sleep 10 && gh run list -R saharatyokthuan/project-skills --workflow=validate.yml --limit=1 --json conclusion,status`
Expected: Workflow runs and passes (conclusion: "success")

- [ ] **Step 4: Final verification - browse repo**

Run: `gh repo view saharatyokthuan/project-skills --web`
Expected: Opens repository in browser showing all files

---

## Self-Review Checklist

- [x] Spec coverage: All requirements (12 project folders, SKILL.md each, README, template, GitHub Actions) mapped to tasks
- [x] Step scan: Each step has single unambiguous action with checkable result
- [x] Type consistency: File paths consistent across tasks (all under /tmp/project-skills/)
- [x] Review Focus: 5 failure modes identified with tests pinned to owning tasks
- [x] Proportion: Plan is concise, no implementation transcripts, only signatures and assertions