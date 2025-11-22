# ⚡ QUICK: Railway + Vercel Deployment

## STEP 1: Backend → Railway (5 menit)

1. [ ] Login [railway.app](https://railway.app) dengan GitHub
2. [ ] New Project → Deploy from GitHub repo
3. [ ] Pilih repository "cardiocare"
4. [ ] Di Settings → Set Root Directory: `backend`
5. [ ] Di Settings → Networking → Generate Domain
6. [ ] Catat URL: `https://cardiocare-production.up.railway.app`

---

## STEP 2: Frontend → Vercel (5 menit)

1. [ ] Edit `frontend/.env.production`:
   ```
   VITE_API_URL=https://cardiocare-production.up.railway.app
   ```
2. [ ] Push ke GitHub:
   ```powershell
   git add .
   git commit -m "Deploy to Railway"
   git push origin main
   ```
3. [ ] Login [vercel.com](https://vercel.com) dengan GitHub
4. [ ] Import project "cardiocare"
5. [ ] Root Directory: `frontend`
6. [ ] Add env variable: `VITE_API_URL` = URL Railway
7. [ ] Deploy!

---

## ✅ Done!

- Frontend: `https://cardiocare-xxx.vercel.app`
- Backend: `https://cardiocare-production.up.railway.app`

**Baca DEPLOY_RAILWAY.md untuk detail lengkap!**
