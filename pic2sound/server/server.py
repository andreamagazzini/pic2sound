from flask import Flask, render_template, request, url_for, jsonify
from werkzeug import secure_filename
from keras import backend as K
from train_network import train_network
from test_network import test_network

# import the necessary packages
import os
import shutil

UPLOAD_FOLDER = 'uploads'
TEST_FOLDER = 'test'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
MODEL = 'model.model'

app = Flask(__name__, static_folder='../static/dist', template_folder='../static')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    # this has changed from the original example because the original did not work for me
    return filename[-3:].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/count-files', methods=['GET'])
def count_files():
    folders = {}

    if os.path.exists(UPLOAD_FOLDER):
        for dirname in os.listdir(UPLOAD_FOLDER):
            path, dirs, files = next(os.walk(UPLOAD_FOLDER + '/' + dirname))
            file_count = len(files)

            folders[dirname] = file_count

    return jsonify(folders)


@app.route('/upload-files', methods=['POST'])  # take note of this decorator syntax, it's a common pattern
def upload_files():
    if request.form['path'] == 'test':
        directory = request.form['path']
    else:
        directory = app.config['UPLOAD_FOLDER'] + '/' + request.form['path']

    if not os.path.exists(directory):
        os.makedirs(directory)

    for key, file in request.files.iteritems():
        name = request.files[key].filename
        if file and allowed_file(name):
            print '**uploading file', name
            filename = secure_filename(name)
            filepath = os.path.join(directory, filename)
            file.save(filepath)
        if request.form['path'] == 'test':
            if os.path.exists(MODEL):
                return jsonify(test_network(filepath, MODEL, UPLOAD_FOLDER))

    return count_files()


@app.route('/train-network', methods=['GET'])
def train():
    if os.path.exists(MODEL):
        os.remove(MODEL)
    return jsonify(train_network(UPLOAD_FOLDER))


@app.route('/reset-data', methods=['GET'])
def reset_data():
    if os.path.exists(UPLOAD_FOLDER):
        shutil.rmtree(UPLOAD_FOLDER, ignore_errors=True)
    if os.path.exists(TEST_FOLDER):
        shutil.rmtree(TEST_FOLDER, ignore_errors=True)

    return count_files()


@app.route('/reset-model', methods=['GET'])
def reset_model():
    K.clear_session()
    if os.path.exists(MODEL):
        os.remove(MODEL)

    return jsonify('OK')


if __name__ == '__main__':
    app.run()
