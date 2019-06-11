import pickle
import numpy as np
import librosa
import sys
import matplotlib.pyplot as plt
import librosa.display
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
stderr = sys.stderr
sys.stderr = open(os.devnull, 'w')
from keras.models import load_model
sys.stderr = stderr
import tensorflow as tf
tf.logging.set_verbosity(tf.logging.ERROR)

label_data = ['air_conditioner',
'car_horn',
'children_playing',
'dog_bark',
'drilling',
'engine_idling',
'gun_shot',
'jackhammer',
'siren',
'street_music']

filename = sys.argv[1]
name = os.path.splitext(filename)[0]
path_spectrum = "data/spectrum/" + name + ".png"
path_abs = os.path.join(os.path.dirname(sys.argv[0]), f'uploads/{filename}')

def feature_sound(filename):
    data, sampling_rate = librosa.load(filename, sr = None)
    ig = plt.figure(figsize=(15, 5))
    librosa.display.waveplot(data, sampling_rate)
    ig.savefig(path_spectrum)

def feature_test(filename):
    data, sample_rate = librosa.load(filename, res_type='kaiser_fast')
    mfccs = np.mean(librosa.feature.mfcc(y=data, sr=sample_rate, n_mfcc=40).T,axis=0)
    feature = np.array(mfccs)
    return feature

test_X = feature_test(path_abs)
test_X = test_X.reshape(1, 40)
filename_ = os.path.join(os.path.dirname(sys.argv[0]), 'train_model.sav')
loaded_model = pickle.load(open(filename_, 'rb'))
result = loaded_model.predict(test_X)
index = np.argmax(result)
sys.stdout.flush()
if np.max(result) < 0.25:
  print('undefine')
else:
  print(label_data[index])