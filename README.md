# Vesta
Webservice for Landlords, Tenants, and Subtenants.

The fourth year design project of group 23 of the 2023 cohort in the department of Computer Engineering at the University of Waterloo.

## Group Members
1. Hong Bin Jiang
2. Yanqi Cai
3. Qin Qin
4. Faizaan Rehman
5. Hamza Alam

# Repo Structure
The monorepo is divided into a backend portion and a frontend portion. They sit in separate folders in the `web` folder.

The folder structure here is vital as the CI pipeline builds the project expecting the folders being structured in this format.

# Setup
Some notes for setup after cloning:
1. Need to create a new virtual python environment in the project web directory and install python packages using pip (pip install -r requirements.txt).
2. Install Node.js v16.15.1 from their [Previous Releases](https://nodejs.org/en/download/releases/) or using NVM (node version manager).
3. Go to web/frontend and install the node packages using `npm install`.

# PRs
***ALWAYS*** commit to `develop` branch as `master` is tied to the CI pipeline. We do not want code changes to go into the pipeline constantly without any prior review and testing.

## Best Practices
1. Create new branches for each issue you are tackling.
2. Use descriptive branch names.
3. Copy the Trello issue's URL into the PR description so the reviewer knows what the PR is about.
4. Only merge when there is at least 1 reviewer. Be sure to copy the PR URL into the Discord server as well with an @everyone.
