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

// Kullanıcı Girişi
loginBtn.onclick = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
};

logoutBtn.onclick = () => {
    auth.signOut();
};

auth.onAuthStateChanged(user => {
    if (user) {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";
        notlarDiv.style.display = "block";
        notlariGetir(user);
    } else {
        loginBtn.style.display = "block";
        logoutBtn.style.display = "none";
        notlarDiv.style.display = "none";
    }
});

// Notları Kaydetme
kaydetBtn.onclick = () => {
    const user = auth.currentUser;
    if (!user) return;

    db.collection("notlar").add({
        userId: user.uid,
        icerik: notAlani.value,
        tarih: firebase.firestore.FieldValue.serverTimestamp()
    });
    notAlani.value = "";
};

// Notları Getirw
function notlariGetir(user) {
    db.collection("notlar").where("userId", "==", user.uid)
        .orderBy("tarih", "desc")
        .onSnapshot(snapshot => {
            notListesi.innerHTML = "";
            snapshot.forEach(doc => {
                const li = document.createElement("li");
                li.textContent = doc.data().icerik;
                notListesi.appendChild(li);
            });
        });
}
