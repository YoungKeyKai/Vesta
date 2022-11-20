# Setup Virtual Environment

Run `python -m venv ./venv` in this directory.
Try with `python3` if `python` doesn't work.

# Activate the Virtual Environment

Run `./venv/Scripts/activate.bat` on Windows or `source ./venv/bin/activate` on Mac or Linux.

It should show in the terminal where the name of the venv shows in parentheses.
If it does not, be cautious that it might not be activated.

You might also be able to configure the python interpreter in your IDE to point to this venv to save yourself some work.

# Install PIP Dependencies

Use `./venv/Scripts/pip.exe install -r requirements.txt` to install dependencies.

Replace `Scripts` with `bin` if on Mac or Linux

# Deactivating the Venv

Use `deactivate` when the venv is activated to deactivate it.
