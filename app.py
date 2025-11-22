from flask import Flask, request, jsonify
from flask_cors import CORS
import xgboost as xgb
import numpy as np
import os

app = Flask(__name__)
# Mengizinkan Frontend (port 5173) untuk mengakses Backend (port 5000)
CORS(app, resources={
    r"/*": {
        "origins": "*",  # Allow all origins for now
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": False
    }
}) 

# --- 1. LOAD MODEL ---
model = None
model_filename = 'hypertension_model.json'

try:
    if os.path.exists(model_filename):
        # Memuat model yang sudah dilatih menggunakan Booster
        model = xgb.Booster()
        model.load_model(model_filename)
        print(f"Model {model_filename} berhasil dimuat!")
    else:
        # Jika model tidak ada, berikan peringatan keras.
        print(f"!!! PERINGATAN KRITIS: File {model_filename} tidak ditemukan. API akan gagal memprediksi. !!!")
        print("Pastikan file model XGBoost (misalnya .json) ada di folder backend.")
except Exception as e:
    print(f"Error memuat model: {e}")
    model = None

# --- 2. LOGIKA MAPPING (Kategori string dari React ke nilai float/int yang dibutuhkan model) ---
def preprocess_input(data):
    # Mapping Kategori ke Nilai Representatif (sesuai spesifikasi user)
    bmi_map = {'underweight': 17.0, 'normal': 22.0, 'overweight': 27.5, 'obese': 32.0}
    gluc_map = {'normal': 85.0, 'prediabetes': 112.0, 'diabetes': 150.0}
    chol_map = {'normal': 180.0, 'borderline': 220.0, 'high': 260.0}
    sys_map = {'normal': 110.0, 'elevated': 125.0, 'stage1': 135.0, 'stage2': 160.0, 'crisis': 190.0}
    dia_map = {'normal': 70.0, 'stage1': 85.0, 'stage2': 100.0, 'crisis': 125.0}

    # Logika CigsPerDay: Jika bukan perokok, 0.
    is_smoker = int(data.get('currentSmoker', 0))
    cigs = float(data.get('cigsPerDay', 0)) if is_smoker == 1 else 0.0

    # Logika HeartRate (Default 75 jika kosong)
    hr_val = float(data.get('heartRate')) if data.get('heartRate') and data.get('heartRate') != '' else 75.0

    # Susun Array sesuai urutan Training Model XGBoost
    # Urutan: ['male', 'age', 'currentSmoker', 'cigsPerDay', 'BPMeds', 'diabetes', 'totChol', 'sysBP', 'diaBP', 'BMI', 'heartRate', 'glucose']
    input_vector = [
        int(data.get('male', 1)),
        int(data.get('age', 40)),
        is_smoker,
        cigs,
        int(data.get('BPMeds', 0)),
        int(data.get('diabetes', 0)),
        chol_map.get(data.get('totChol_choice'), 180.0),
        sys_map.get(data.get('sysBP_choice'), 110.0),
        dia_map.get(data.get('diaBP_choice'), 70.0),
        bmi_map.get(data.get('bmi_choice'), 22.0),
        hr_val,
        gluc_map.get(data.get('glucose_choice'), 85.0)
    ]
    
    return np.array([input_vector])

# --- 3. HEALTH CHECK ENDPOINT ---
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'CardioCare AI Backend is running',
        'model_loaded': model is not None,
        'endpoints': {
            'health': '/',
            'predict': '/predict (POST only)'
        }
    })

# --- 4. ENDPOINT API PREDIKSI ---
@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response, 200
    
    if not model:
        return jsonify({'status': 'error', 'message': 'Model belum dimuat. Cek file hypertension_model.json.'}), 503

    try:
        data = request.json
        
        # 1. Preprocessing data yang diterima dari web
        processed_data = preprocess_input(data)
        
        # 2. Prediksi menggunakan model XGBoost Booster
        # Konversi ke DMatrix dengan nama fitur yang sesuai
        feature_names = ['male', 'age', 'currentSmoker', 'cigsPerDay', 'BPMeds', 
                        'diabetes', 'totChol', 'sysBP', 'diaBP', 'BMI', 'heartRate', 'glucose']
        dmatrix = xgb.DMatrix(processed_data, feature_names=feature_names)
        
        # Prediksi probabilitas (output raw probability)
        probability = model.predict(dmatrix)[0]
        
        # Konversi ke prediksi binary (0 atau 1) dengan threshold 0.5
        prediction = 1 if probability > 0.5 else 0
        
        response = jsonify({
            'status': 'success',
            'prediction': int(prediction),
            'risk_probability': float(probability) * 100 # Dalam persen
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    except Exception as e:
        print("Error saat prediksi:", e)
        error_response = jsonify({'status': 'error', 'message': f'Gagal memproses prediksi: {str(e)}'})
        error_response.headers.add('Access-Control-Allow-Origin', '*')
        return error_response, 500

if __name__ == '__main__':
    # Pastikan server berjalan di port 5000
    app.run(debug=True, port=5000)