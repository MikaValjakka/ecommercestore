# Full-Stack MERN E-Commerce Store 🛒

Moderni täyden pinon(full stack) verkkokauppa MERN-stackillä (MongoDB, Express, React, Node.js).  
Sisältää käyttäjäautentikaation, admin dashboardin, Stripe-maksut (testitilassa), Redis-istunnonhallinnan ja Cloudinary-kuvienhallinnan.

**Perustuu**: Burak Orkmezin erinomaiseen tutoriaaliin (8h) – opin valtavasti modernista fullstack-kehityksestä.

## 📸 Screenshots

![Etusivu & Kategoriat](https://github.com/MikaValjakka/ecommercestore/blob/9764e854e747e8bb7ca3f9e7d939db162c18c5f2/Screenshots/categories.jpg)
![Ostoskori](https://github.com/MikaValjakka/ecommercestore/blob/9764e854e747e8bb7ca3f9e7d939db162c18c5f2/Screenshots/cart.jpg)
![Maksusivu (Stripe test mode)](https://github.com/MikaValjakka/ecommercestore/blob/9764e854e747e8bb7ca3f9e7d939db162c18c5f2/Screenshots/checkout.jpg)
![Onnistunut ostos + konfetti](https://github.com/MikaValjakka/ecommercestore/blob/9764e854e747e8bb7ca3f9e7d939db162c18c5f2/Screenshots/success.jpg)
![Kirjautumissivu](https://github.com/MikaValjakka/ecommercestore/blob/9764e854e747e8bb7ca3f9e7d939db162c18c5f2/Screenshots/login.jpg)
![Admin Dashboard - Analytics](https://github.com/MikaValjakka/ecommercestore/blob/9764e854e747e8bb7ca3f9e7d939db162c18c5f2/Screenshots/admin-analytics.jpg)
![Admin - Tuotelista](https://github.com/MikaValjakka/ecommercestore/blob/9764e854e747e8bb7ca3f9e7d939db162c18c5f2/Screenshots/admin-products.jpg)
![Admin - Luo uusi tuote](https://github.com/MikaValjakka/ecommercestore/blob/9764e854e747e8bb7ca3f9e7d939db162c18c5f2/Screenshots/admin-create-product.jpg)

## 🚀 Ominaisuudet

- Käyttäjärekisteröinti & kirjautuminen (JWT + secure cookies)
- Turvallinen istunnonhallinta Redisillä
- Tuotekuvat Cloudinaryssä
- Ostoskori, voucher-koodit & upsell ("People Also Bought")
- Stripe-maksut (testitila)
- Täydellinen admin dashboard: tuotteiden hallinta, analytiikka, myyntigraafit
- Responsiivinen ja moderni UI (tumma teema)

## 🛠️ Teknologiat

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

## 🧠 AI-valmius

Olen valmis ottamaan tekoälytyökalut osaksi arkeani – työstän parhaillaan pientä AI-ominaisuutta (esim. tuotesuosittelut OpenAI API:lla) tähän projektiin.

## 🙏 Kiitokset & Inspiraatio

Projekti perustuu Burak Orkmezin loistavaan tutoriaaliin:  
[Build a Full-Stack E-Commerce Store + Admin Dashboard - MERN, Stripe, Redis](https://www.youtube.com/watch?v=sX57TLIPNx8)

Seurasin ohjeita oppiakseni parhaat käytännöt, mutta koodi on kirjoitettu itse alusta loppuun.  
Olen ylpeä valmiista sovelluksesta ja siitä, miten paljon opin!

## ⚙️ Asennus

```bash
git clone https://github.com/MikaValjakka/ecommercestore.git
cd ecommercestore

# Backend
cd backend
npm install
cp .env.example .env  # täytä omat avaimet (MongoDB, Stripe, Cloudinary, Redis...)
npm run dev

# Frontend
cd ../frontend
npm install
npm start
```

## 👨‍💻 Tekijä

Mika Valjakka – intohimoinen fullstack-opiskelija Suomesta
Arch Linux + Hyprland -käyttäjä, tekoälyn ystävä 🚀

Made with ❤️, kahvia ja yötä vasten Suomessa.

# ..I use Arch, BTW...
