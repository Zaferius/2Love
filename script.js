// Firebase Yapılandırması
const firebaseConfig = {
    apiKey: "AIzaSyBpiH9vmfIcU_Q0XRUqhxCc_rXxBTBEe4Y",
    authDomain: "love-e756c.firebaseapp.com",
    projectId: "love-e756c",
    storageBucket: "love-e756c.firebasestorage.app",
    messagingSenderId: "332071065436",
    appId: "1:332071065436:web:c3dcb402eaad4cc5979399"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const notlarDiv = document.getElementById("notlar");
const notAlani = document.getElementById("notAlani");
const kaydetBtn = document.getElementById("kaydet");
const notListesi = document.getElementById("notListesi");
const userProfile = document.getElementById("userProfile");

// Kullanıcı Girişi
loginBtn.onclick = async () => {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
        console.log("Giriş Başarılı!");
    } catch (error) {
        console.error("Giriş hatası:", error.message);
        alert("Google ile giriş başarısız oldu: " + error.message);
    }
};

logoutBtn.onclick = async () => {
    try {
        await auth.signOut();
        console.log("Çıkış Başarılı!");
        userProfile.innerHTML = "";
    } catch (error) {
        console.error("Çıkış hatası:", error.message);
    }
};

auth.onAuthStateChanged(user => {
    if (user) {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";
        notlarDiv.style.display = "block";
        userProfile.innerHTML = `<img src="${user.photoURL}" alt="Profil Resmi" class="profile-pic">`;
        notlariGetir(user);
    } else {
        loginBtn.style.display = "block";
        logoutBtn.style.display = "none";
        notlarDiv.style.display = "none";
        userProfile.innerHTML = "";
    }
});

// Notları Kaydetme
kaydetBtn.onclick = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (notAlani.value.trim() === "") {
        alert("Lütfen bir not girin!");
        return;
    }

    try {
        await db.collection("notlar").add({
            userId: user.uid,
            icerik: notAlani.value,
            tarih: firebase.firestore.FieldValue.serverTimestamp()
        });
        notAlani.value = "";
        console.log("Not başarıyla kaydedildi!");
    } catch (error) {
        console.error("Not kaydetme hatası:", error);
    }
};

// Notları Getir ve Sayfada Göster
function notlariGetir(user) {
    db.collection("notlar")
        .where("userId", "==", user.uid)
        .orderBy("tarih", "desc")
        .onSnapshot(snapshot => {
            notListesi.innerHTML = "";
            snapshot.forEach(doc => {
                const data = doc.data();
                const notDiv = document.createElement("div");
                notDiv.classList.add("not-kutu");
                notDiv.innerHTML = `<p>${data.icerik}</p>`;
                notListesi.appendChild(notDiv);
            });
        });
}