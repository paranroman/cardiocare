import React, { useState } from 'react';
import { 
  Heart, Activity, User, Cigarette, Pill, CheckCircle2, 
  AlertTriangle, Stethoscope, ArrowRight, Info, Loader2
} from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [riskProb, setRiskProb] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationError, setValidationError] = useState('');

  // API URL dari environment variable atau default localhost
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [formData, setFormData] = useState({
    age: '',
    male: '1', 
    currentSmoker: '0',
    cigsPerDay: '',
    BPMeds: '0',
    diabetes: '0',
    bmi_choice: 'normal',
    glucose_choice: 'normal',
    totChol_choice: 'normal',
    sysBP_choice: 'normal',
    diaBP_choice: 'normal',
    heartRate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- INTEGRASI KE FLASK ---
  const handlePredict = async () => {
    if (!formData.age) {
      setErrorMsg("Mohon isi usia Anda.");
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Mengirim data mentah (kategori) ke Python
      // Python yang akan melakukan konversi ke angka
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setResult(data.prediction); // 0 atau 1
        setRiskProb(data.risk_probability);
      } else {
        setErrorMsg('Terjadi kesalahan pada server.');
      }

    } catch (error) {
      console.error("Gagal koneksi ke backend:", error);
      setErrorMsg('Tidak dapat terhubung ke server. Pastikan backend Flask berjalan di port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setStep(1);
    setErrorMsg('');
    setValidationError('');
    setFormData({
      age: '', male: '1', currentSmoker: '0', cigsPerDay: '',
      BPMeds: '0', diabetes: '0', bmi_choice: 'normal',
      glucose_choice: 'normal', totChol_choice: 'normal',
      sysBP_choice: 'normal', diaBP_choice: 'normal', heartRate: ''
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Heart size={24} fill="white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Cardio<span className="text-blue-600">Care</span>
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">Prediksi Risiko Hipertensi</div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {!result && result !== 0 && (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Cek Kesehatan Jantung</h2>
              <p className="text-slate-500">Analisis risiko hipertensi.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="w-full bg-slate-100 h-2">
                <div className="bg-blue-600 h-2 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
              </div>

              <div className="p-6 sm:p-8">
                {/* --- STEP 1 --- */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 border-b pb-4">
                      <User className="text-blue-600" />
                      <h3 className="text-lg font-semibold">Profil Dasar</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Jenis Kelamin</label>
                        <div className="flex gap-4">
                          {['1', '0'].map((val) => (
                            <label key={val} className={`flex-1 p-3 border rounded-xl cursor-pointer transition-all ${formData.male === val ? (val === '1' ? 'bg-blue-50 border-blue-500' : 'bg-pink-50 border-pink-500') : 'hover:bg-slate-50'}`}>
                              <input type="radio" name="male" value={val} checked={formData.male === val} onChange={handleChange} className="hidden" />
                              <div className="text-center font-medium">{val === '1' ? 'Pria' : 'Wanita'}</div>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Usia <span className="text-red-500">*</span></label>
                        <input type="number" name="age" placeholder="Contoh: 45" value={formData.age} onChange={handleChange} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border space-y-4">
                      <div className="flex items-center gap-2 font-medium"><Cigarette size={18}/> Perokok Aktif?</div>
                      <div className="flex gap-4">
                        <label className="flex gap-2 cursor-pointer"><input type="radio" name="currentSmoker" value="0" checked={formData.currentSmoker === '0'} onChange={handleChange} /> Tidak</label>
                        <label className="flex gap-2 cursor-pointer"><input type="radio" name="currentSmoker" value="1" checked={formData.currentSmoker === '1'} onChange={handleChange} /> Ya</label>
                      </div>
                      {formData.currentSmoker === '1' && (
                        <div>
                          <input type="number" name="cigsPerDay" placeholder="Batang per hari *" value={formData.cigsPerDay} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                        </div>
                      )}
                    </div>
                    
                    {validationError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2">
                        <AlertTriangle size={20} className="mt-0.5 flex-shrink-0" />
                        <span>{validationError}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* --- STEP 2 --- */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 border-b pb-4">
                      <Activity className="text-blue-600" />
                      <h3 className="text-lg font-semibold">Fisik & Riwayat</h3>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">BMI (Indeks Massa Tubuh)</label>
                      <select name="bmi_choice" value={formData.bmi_choice} onChange={handleChange} className="w-full p-3 border rounded-xl bg-white">
                        <option value="underweight">Kurus (&lt; 18.5)</option>
                        <option value="normal">Normal (18.5 - 24.9)</option>
                        <option value="overweight">Gemuk (25.0 - 29.9)</option>
                        <option value="obese">Obesitas (≥ 30.0)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Detak Jantung (Opsional)</label>
                      <input type="number" name="heartRate" placeholder="Default: 75" value={formData.heartRate} onChange={handleChange} className="w-full p-3 border rounded-xl" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-xl hover:bg-slate-50">
                        <div className="flex gap-2 font-medium mb-2"><Pill size={18} className="text-purple-500"/> Pakai Obat Tensi</div>
                        <div className="flex gap-4 text-sm">
                           <label className="flex gap-2"><input type="radio" name="BPMeds" value="0" checked={formData.BPMeds === '0'} onChange={handleChange}/> Tidak</label>
                           <label className="flex gap-2"><input type="radio" name="BPMeds" value="1" checked={formData.BPMeds === '1'} onChange={handleChange}/> Ya</label>
                        </div>
                      </div>
                      <div className="p-4 border rounded-xl hover:bg-slate-50">
                        <div className="flex gap-2 font-medium mb-2"><AlertTriangle size={18} className="text-orange-500"/> Ada Riwayat Diabetes</div>
                        <div className="flex gap-4 text-sm">
                           <label className="flex gap-2"><input type="radio" name="diabetes" value="0" checked={formData.diabetes === '0'} onChange={handleChange}/> Tidak</label>
                           <label className="flex gap-2"><input type="radio" name="diabetes" value="1" checked={formData.diabetes === '1'} onChange={handleChange}/> Ya</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- STEP 3 --- */}
                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 border-b pb-4">
                      <Stethoscope className="text-blue-600" />
                      <h3 className="text-lg font-semibold">Hasil Lab</h3>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg flex gap-2 text-sm text-blue-800 mb-2">
                       <Info size={16} className="mt-1"/> Pilih kategori hasil pemeriksaan terakhir.
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Sistolik (Atas)</label>
                        <select name="sysBP_choice" value={formData.sysBP_choice} onChange={handleChange} className="w-full p-3 border rounded-xl bg-white">
                          <option value="normal">Normal (&lt; 120)</option>
                          <option value="elevated">Peningkatan (120 - 129)</option>
                          <option value="stage1">Hipertensi 1 (130 - 139)</option>
                          <option value="stage2">Hipertensi 2 (140 - 179)</option>
                          <option value="crisis">Krisis (&gt; 180)</option>
                        </select>
                      </div>
                       <div className="space-y-2">
                        <label className="text-sm font-medium">Diastolik (Bawah)</label>
                        <select name="diaBP_choice" value={formData.diaBP_choice} onChange={handleChange} className="w-full p-3 border rounded-xl bg-white">
                          <option value="normal">Normal (&lt; 80)</option>
                          <option value="stage1">Hipertensi 1 (80 - 89)</option>
                          <option value="stage2">Hipertensi 2 (90 - 119)</option>
                          <option value="crisis">Krisis (&gt; 120)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Gula Darah</label>
                        <select name="glucose_choice" value={formData.glucose_choice} onChange={handleChange} className="w-full p-3 border rounded-xl bg-white">
                          <option value="normal">Normal (&lt; 100)</option>
                          <option value="prediabetes">Pre-Diabetes (100-125)</option>
                          <option value="diabetes">Diabetes (≥ 126)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Kolesterol Total</label>
                        <select name="totChol_choice" value={formData.totChol_choice} onChange={handleChange} className="w-full p-3 border rounded-xl bg-white">
                          <option value="normal">Normal (&lt; 200)</option>
                          <option value="borderline">Ambang Batas (200-239)</option>
                          <option value="high">Tinggi (≥ 240)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between pt-6 border-t">
                  {step > 1 ? (
                    <button onClick={() => setStep(step - 1)} className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition">Kembali</button>
                  ) : <div></div>}
                  
                  {step < 3 ? (
                    <button onClick={() => {
                      setValidationError('');
                      if (step === 1 && !formData.age) {
                        setValidationError("Mohon isi usia Anda terlebih dahulu.");
                        return;
                      }
                      if (step === 1 && formData.currentSmoker === '1' && !formData.cigsPerDay) {
                        setValidationError("Mohon isi jumlah batang rokok per hari.");
                        return;
                      }
                      setStep(step + 1);
                    }} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
                      Selanjutnya <ArrowRight size={18} />
                    </button>
                  ) : (
                    <button onClick={handlePredict} disabled={loading} className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 shadow-lg shadow-green-200 transition disabled:opacity-70 disabled:cursor-not-allowed">
                      {loading ? <><Loader2 className="animate-spin" size={20}/> Menganalisis...</> : "Lihat Hasil Prediksi"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* --- RESULT MODAL --- */}
        {(result !== null) && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className={`h-32 flex items-center justify-center ${result === 1 ? 'bg-red-500' : 'bg-green-500'}`}>
                 <div className="bg-white/25 p-4 rounded-full backdrop-blur-sm">
                    {result === 1 ? <AlertTriangle size={48} className="text-white" /> : <CheckCircle2 size={48} className="text-white" />}
                 </div>
              </div>
              <div className="p-8">
                <div className="text-center mb-6">
                  <h2 className={`text-2xl font-bold mb-2 ${result === 1 ? 'text-red-600' : 'text-green-600'}`}>
                    {result === 1 ? "BERISIKO HIPERTENSI" : "RISIKO RENDAH"}
                  </h2>
                  {result === 1 && <p className="text-sm font-medium text-slate-500 mb-1">Probabilitas Risiko: {riskProb.toFixed(1)}%</p>}
                  
                  <p className="text-slate-600 mb-4 mt-2">
                    {result === 1 
                      ? "Indikator mengarah pada risiko hipertensi. Segera konsultasikan dengan dokter untuk diagnosa medis yang akurat."
                      : "Profil kesehatan Anda baik. Tetap jaga pola hidup sehat untuk mencegah hipertensi di masa depan."
                    }
                  </p>
                </div>

                {errorMsg && (
                  <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg text-sm mb-4">
                    {errorMsg}
                  </div>
                )}

                {/* SARAN-SARAN */}
                <div className="bg-slate-50 rounded-xl p-6 mb-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Heart size={20} className={result === 1 ? 'text-red-500' : 'text-green-500'} />
                    {result === 1 ? "Langkah Penanganan" : "Tips Pencegahan"}
                  </h3>
                  
                  {result === 1 ? (
                    // SARAN UNTUK RISIKO TINGGI
                    <div className="space-y-4 text-sm">
                      <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
                        <h4 className="font-semibold mb-2">🏥 Konsultasi Medis Segera</h4>
                        <p className="text-slate-600">Kunjungi dokter untuk pemeriksaan lengkap dan diagnosis akurat. Dokter dapat meresepkan obat antihipertensi jika diperlukan.</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">🍎 Pola Makan DASH Diet</h4>
                        <ul className="text-slate-600 space-y-1 ml-4">
                          <li>• Konsumsi sayur & buah minimal 5 porsi/hari</li>
                          <li>• Batasi garam hingga &lt;1.500 mg/hari (½ sendok teh)</li>
                          <li>• Hindari makanan olahan & fast food</li>
                          <li>• Pilih susu & produk rendah lemak</li>
                          <li>• Tingkatkan asupan kalium (pisang, kentang, bayam)</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">🏃 Aktivitas Fisik Rutin</h4>
                        <ul className="text-slate-600 space-y-1 ml-4">
                          <li>• Olahraga aerobik 30 menit, 5x seminggu (jalan cepat, berenang)</li>
                          <li>• Latihan kekuatan 2x seminggu</li>
                          <li>• Hindari aktivitas berat mendadak tanpa konsultasi</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">⚖️ Kelola Berat Badan</h4>
                        <p className="text-slate-600">Turunkan 5-10% berat badan dapat menurunkan tekanan darah 5-20 mmHg. Target BMI 18.5-24.9.</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">🚭 Hentikan Kebiasaan Buruk</h4>
                        <ul className="text-slate-600 space-y-1 ml-4">
                          <li>• <strong>Berhenti merokok</strong> - Efek langsung pada pembuluh darah</li>
                          <li>• <strong>Batasi alkohol</strong> - Maksimal 1 gelas/hari (wanita) atau 2 gelas/hari (pria)</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">😴 Tidur Berkualitas</h4>
                        <p className="text-slate-600">Tidur 7-9 jam per malam. Sleep apnea dapat memperburuk hipertensi - konsultasikan jika sering mendengkur.</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">🧘 Kelola Stres</h4>
                        <ul className="text-slate-600 space-y-1 ml-4">
                          <li>• Meditasi atau pernapasan dalam 10-15 menit/hari</li>
                          <li>• Yoga atau tai chi</li>
                          <li>• Hindari overthinking & belajar mengatakan "tidak"</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">📊 Monitor Rutin</h4>
                        <p className="text-slate-600">Cek tekanan darah di rumah setiap hari. Catat hasilnya dan laporkan ke dokter saat kontrol.</p>
                      </div>
                    </div>
                  ) : (
                    // SARAN UNTUK RISIKO RENDAH
                    <div className="space-y-4 text-sm">
                      <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-semibold mb-2">✅ Pertahankan Pola Hidup Sehat</h4>
                        <p className="text-slate-600">Anda berada di jalur yang baik! Lanjutkan kebiasaan sehat untuk mencegah hipertensi di masa depan.</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">🥗 Nutrisi Seimbang</h4>
                        <ul className="text-slate-600 space-y-1 ml-4">
                          <li>• Konsumsi sayur & buah beragam warna setiap hari</li>
                          <li>• Pilih biji-bijian utuh (oatmeal, roti gandum)</li>
                          <li>• Batasi garam &lt;2.300 mg/hari (1 sendok teh)</li>
                          <li>• Hindari makanan tinggi lemak jenuh & trans fat</li>
                          <li>• Minum air putih 8 gelas/hari</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">🏋️ Tetap Aktif Bergerak</h4>
                        <ul className="text-slate-600 space-y-1 ml-4">
                          <li>• Olahraga aerobik 150 menit/minggu (jalan cepat, jogging, bersepeda)</li>
                          <li>• Latihan kekuatan 2x seminggu</li>
                          <li>• Kurangi waktu duduk - berdiri setiap 30 menit</li>
                          <li>• Gunakan tangga daripada lift</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">⚖️ Jaga Berat Badan Ideal</h4>
                        <p className="text-slate-600">Pertahankan BMI 18.5-24.9 dan lingkar pinggang &lt;90 cm (pria) atau &lt;80 cm (wanita).</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">🚭 Hindari Faktor Risiko</h4>
                        <ul className="text-slate-600 space-y-1 ml-4">
                          <li>• Jangan mulai merokok atau hentikan jika sudah</li>
                          <li>• Batasi konsumsi alkohol</li>
                          <li>• Kelola stres dengan baik</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">😴 Tidur Cukup</h4>
                        <p className="text-slate-600">Tidur 7-9 jam berkualitas setiap malam. Jadwal tidur konsisten membantu menjaga tekanan darah stabil.</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">🩺 Cek Kesehatan Berkala</h4>
                        <ul className="text-slate-600 space-y-1 ml-4">
                          <li>• Periksa tekanan darah minimal 1x/tahun</li>
                          <li>• Cek kolesterol & gula darah rutin</li>
                          <li>• Konsultasi dokter jika ada riwayat keluarga hipertensi</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">🧘 Praktik Mindfulness</h4>
                        <p className="text-slate-600">Meditasi, yoga, atau hobi yang menenangkan membantu menjaga kesehatan mental dan jantung.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4">
                  <strong>⚠️ Disclaimer:</strong> Hasil prediksi ini bukan diagnosis medis. Selalu konsultasikan dengan tenaga kesehatan profesional untuk evaluasi dan penanganan yang tepat.
                </div>

                <button onClick={resetForm} className="w-full bg-slate-800 text-white py-3 rounded-xl font-medium hover:bg-slate-900 transition">
                  Cek Ulang
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}