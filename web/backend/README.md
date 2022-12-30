# Setup Virtual Environment

* Ensure you have `pipenv` installed.
* Ensure you have `python 3.8.5` installed.

## First Time Setup
1. Run `pipenv install` to install from `Pipfile`.
2. Run `where python` (Mac) or `get-command python` (Windows) to see the current Python install location.
3. Run `pipenv shell` to spin up the virtual environment.
4. To confirm the virtual env is running, run `where python` (Mac) or `get-command python` (Windows) again, and ensure the location now differs.

## Subsequent Use
Only run `pipenv shell` to spin up the virtual environment.

# Leaving the virtual environment

Run `exit` to leave the virtual environment.