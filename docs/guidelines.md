# Guidlines

- Use the git-hooks!
- `/scripts` folder: Helper script for local development tasks
- Unit tests have to run on every machine after running npm install

## Coding Guidelines

### Naming Conventions
- **Folder:** camelcase, first letter lowercase
- **Files:** camelcase, first letter: if class uppercase otherwise lowercase

#### Exceptions

- `.gitlab-ci.yml`: because this is defined by gitlab CI
  - Because of this, the folder `gitlab-ci` is the same as the yml file
- package-lock.json

### Import Order
1. External libraries
2. libraries from shared project
3. libraries with absolut paths (e.g. @frontend, @backend)
4. libraries relative imports

Add empty lines between these blocks.
