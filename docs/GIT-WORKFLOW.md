# Git Branching Strategy - CRM System

## Branch Structure Overview

This CRM project uses a **Three-Branch Strategy** optimized for continuous development with quality control stages:

```
main (default) ────┐
                   ├── desarrollo (development)
                   ├── produccion (production)  
                   └── pruebas (testing)
```

## Branch Definitions

### 1. `main` (Main/Master Branch)
- **Purpose**: Stable codebase ready for integration
- **Source of Truth**: All other branches branch from here
- **Protection**: Should be protected from direct pushes
- **Updates**: Only receives merged code from other branches

### 2. `desarrollo` (Development Branch)
- **Purpose**: Active development and feature integration
- **Usage**: Daily development work, feature branches merge here first
- **Stability**: May contain unstable code, bugs expected
- **Deployment**: Can be deployed to development environment
- **Testing**: Basic functionality testing

### 3. `pruebas` (Testing Branch)
- **Purpose**: Quality assurance and comprehensive testing
- **Usage**: Stable features from `desarrollo` are merged here
- **Stability**: More stable than desarrollo, ready for testing
- **Deployment**: Deployed to staging/testing environment
- **Testing**: Full QA testing, user acceptance testing

### 4. `produccion` (Production Branch)
- **Purpose**: Production-ready code
- **Usage**: Only tested and approved code from `pruebas`
- **Stability**: Highest stability, production quality
- **Deployment**: Deployed to production environment
- **Protection**: Highest protection level, requires approvals

## Workflow Process

### Daily Development Flow

1. **Start Development**
   ```bash
   git checkout desarrollo
   git pull origin desarrollo
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Complete Feature**
   ```bash
   git add .
   git commit -m "feat: add new functionality for user management"
   git checkout desarrollo
   git merge feature/nueva-funcionalidad
   git push origin desarrollo
   ```

### Quality Assurance Flow

3. **Promote to Testing**
   ```bash
   git checkout pruebas
   git pull origin pruebas
   git merge desarrollo
   git push origin pruebas
   ```

4. **After Testing Approval**
   ```bash
   git checkout produccion
   git pull origin produccion
   git merge pruebas
   git push origin produccion
   ```

### Production Deployment Flow

5. **Deploy to Production**
   ```bash
   git checkout main
   git pull origin main
   git merge produccion
   git push origin main
   git tag -a v1.2.0 -m "Release version 1.2.0"
   git push origin v1.2.0
   ```

## Branch-Specific Commands

### Push New Branches to Remote
```bash
# When you have proper permissions, run these commands:
git push -u origin desarrollo
git push -u origin pruebas  
git push -u origin produccion
```

### Set Up Branch Tracking
```bash
git branch --set-upstream-to=origin/desarrollo desarrollo
git branch --set-upstream-to=origin/pruebas pruebas
git branch --set-upstream-to=origin/produccion produccion
```

## Merge Strategies

### Development to Testing (`desarrollo` → `pruebas`)
```bash
git checkout pruebas
git merge --no-ff desarrollo -m "merge: integrate development changes for testing"
```

### Testing to Production (`pruebas` → `produccion`)
```bash
git checkout produccion
git merge --no-ff pruebas -m "merge: promote tested features to production"
```

### Production to Main (`produccion` → `main`)
```bash
git checkout main
git merge --no-ff produccion -m "merge: deploy production-ready release"
```

## Branch Protection Rules (Recommended)

### For `main` branch:
- Require pull request reviews (2 reviewers minimum)
- Require status checks to pass
- Require branches to be up to date before merging
- Restrict pushes to administrators only
- Require signed commits

### For `produccion` branch:
- Require pull request reviews (1-2 reviewers)
- Require status checks to pass
- Allow only tested code from `pruebas`

### For `pruebas` branch:
- Require basic checks to pass
- Allow merges from `desarrollo` after basic validation

### For `desarrollo` branch:
- Allow direct pushes for development team
- Optional: Require basic linting/build checks

## Environment Deployment Strategy

| Branch | Environment | URL Example | Purpose |
|--------|------------|-------------|---------|
| `desarrollo` | Development | `dev-crm.company.com` | Feature development & integration |
| `pruebas` | Staging/Testing | `staging-crm.company.com` | QA testing & user acceptance |
| `produccion` | Pre-Production | `preprod-crm.company.com` | Final validation before release |
| `main` | Production | `crm.company.com` | Live application |

## Emergency Hotfix Process

For critical production issues:

1. **Create Hotfix Branch**
   ```bash
   git checkout produccion
   git checkout -b hotfix/critical-bug-fix
   ```

2. **Fix and Test**
   ```bash
   # Make necessary changes
   git add .
   git commit -m "hotfix: resolve critical login issue"
   ```

3. **Deploy Hotfix**
   ```bash
   # Merge to production
   git checkout produccion
   git merge hotfix/critical-bug-fix
   
   # Merge to main
   git checkout main
   git merge produccion
   
   # Back-merge to other branches
   git checkout pruebas
   git merge produccion
   
   git checkout desarrollo
   git merge produccion
   ```

## Commit Message Conventions

Follow conventional commits for better tracking:

```
feat: add new course management functionality
fix: resolve authentication timeout issue
docs: update API documentation
style: format code according to ESLint rules
refactor: optimize database queries
test: add unit tests for user service
chore: update dependencies to latest versions
```

## Best Practices

### For Development Team:
1. **Always pull before pushing**
   ```bash
   git pull origin desarrollo
   ```

2. **Use meaningful branch names**
   ```bash
   feature/user-authentication
   bugfix/course-enrollment-error
   improvement/performance-optimization
   ```

3. **Test locally before pushing**
   ```bash
   npm run lint
   npm run build
   npm run test
   ```

4. **Keep commits atomic and descriptive**
   ```bash
   git add specific-files
   git commit -m "specific change description"
   ```

### For QA Team:
1. **Always test from `pruebas` branch**
2. **Report issues with branch and commit references**
3. **Validate all functionality before approving promotion**

### For DevOps/Release Team:
1. **Automate deployment pipelines per branch**
2. **Implement automated testing in CI/CD**
3. **Monitor deployment status across environments**
4. **Maintain deployment logs and rollback procedures**

## Troubleshooting Common Issues

### Merge Conflicts
```bash
git status
git diff
# Resolve conflicts in files
git add resolved-file.js
git commit -m "resolve: merge conflict in user service"
```

### Branch Diverged
```bash
git fetch origin
git rebase origin/branch-name
# Or merge if rebase is not suitable
git merge origin/branch-name
```

### Accidentally Committed to Wrong Branch
```bash
git reset HEAD~1
git stash
git checkout correct-branch
git stash pop
git add .
git commit -m "correct commit message"
```

## Monitoring and Metrics

Track these metrics for workflow effectiveness:
- Lead time from development to production
- Deployment frequency per branch
- Mean time to recovery from issues
- Number of rollbacks per environment
- Code review completion time

---

**Remember**: This branching strategy supports the Next.js 14 CRM architecture with Firebase backend. Adjust deployment environments and CI/CD integrations according to your infrastructure setup.