import os
from flask import Flask
from flask import render_template

project_root = os.path.dirname(__file__)
template_path = os.path.join(project_root, './')
app = Flask(__name__, template_folder=template_path)


@app.route('/')
def index():
    return render_template('index.html')
