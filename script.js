// 1. سرچ فنکشن
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search');
  if(searchInput){
    searchInput.addEventListener('keyup', function(){
      let f = this.value.toLowerCase();
      let c = document.getElementsByClassName('card');
      for(let i=0; i<c.length; i++){
        let txt = c[i].innerText.toLowerCase();
        c[i].style.display = txt.includes(f)? "" : "none";
      }
    });
  }
});

// 2. Service Worker Register - آف لائن کے لیے
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js') //./ لگا دیا
   .then(reg => console.log('Service Worker Registered:', reg.scope))
   .catch(err => console.log('Service Worker Error:', err));
  });
}

// 3. Install Button Logic - PWA Install Prompt
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

if(installBtn){ // Error سے بچاؤ کے لیے check
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block'; // بٹن شو کر دیں
  });

  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      deferredPrompt = null;
      installBtn.style.display = 'none';
    }
  });
}

// 4. App انسٹال ہو جائے تو بٹن چھپا دیں
window.addEventListener('appinstalled', () => {
  if(installBtn) installBtn.style.display = 'none';
  console.log('PWA was installed');
});
