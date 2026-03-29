// Header
class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `

  <!-- ======= Top Bar ======= -->
  <div id="topbar" class="d-flex align-items-center fixed-top">
    <div class="container d-flex justify-content-between">
      <div class="contact-info d-flex align-items-center">
        <i class="bi bi-envelope"></i> <a href="mailto:admin@dialogika.co">admin@dialogika.co</a>
        <i class="bi bi-phone"></i> +62 851 6299 2597
      </div>
      <div class="d-none d-lg-flex social-links align-items-center">
        <a href="https://x.com/dialogika_co" class="twitter"><i class="bi bi-twitter"></i></a>
        <a href="https://www.facebook.com/dialogika.co" class="facebook"><i class="bi bi-facebook"></i></a>
        <a href="https://www.instagram.com/dialogika.co" class="instagram"><i class="bi bi-instagram"></i></a>
        <a href="https://www.linkedin.com/company/dialogika" class="linkedin"><i class="bi bi-linkedin"></i></i></a>
      </div>
    </div>
  </div>

    <!-- ======= Header ======= -->
    <header id="header" class="fixed-top">
      <div class="container d-flex align-items-center">

        <a href="../index.html" class="logo me-auto"><img src="../assets/img/logo.webp" alt="" class="img-fluid"></a>

        <nav id="navbar" class="navbar order-last order-lg-0">
          <ul class="navbar-desktop-list">
            <li><a class="nav-link scrollto active" href="../index.html">Home</a></li>
            <li class="dropdown"><a href="../program"><span>Program</span> <i class="bi bi-chevron-down"></i></a>
              <ul>
                <li class="dropdown"><a href="#"><span>Online</span> <i class="bi bi-chevron-right"></i></a>
                  <ul>
                    <li><a href="../program/basic-play.html">Basic Play </a></li>
                    <li><a href="../program/basic-class.html">Basic Class <span class="badge rounded-pill text-bg-success">Best Buy</span></a></li>
                    <!-- <li><a href="../program/basic-private.html">Basic Private</a></li> -->
                    <li><hr/></li>
                    <li><a href="../program/kids-play.html">Kids Play</a></li>
                    <li><a href="../program/kids-class.html">Kids Class<span class="badge rounded-pill text-bg-success">Best Buy</span></a></li>
                    <!-- <li><a href="../program/kids-private.html">Kids Private</a></li> -->
                  </ul>
                </li>
                <li class="dropdown"><a href="#"><span>Offline</span> <i class="bi bi-chevron-right"></i></a>
                  <ul>
                    <li><a href="../program/first-class.html">First Class <span class="badge rounded-pill text-bg-success">Best Buy</span></a></li>
                    <li><a href="../program/first-lite.html">First Lite</a></li>
                    <li><a href="../program/first-kids.html">First Kids</a></li>
                    <li><hr/></li>
                    <li><a href="../program/first-private.html">First Private</a></li>
                  </ul>
                </li>
                <li><hr/></li>
                <li class="dropdown"><a disabled><span>Area</span> <i class="bi bi-chevron-right"></i></a>
                  <ul>
                    <li><a href="../program/index-jogja.html">Yogyakarta</a></li>
                    <li><a href="../program/index-tangsel.html">Bintaro</a></li>
                    <li><a href="../program/index-solo.html">Solo</a></li>
                    <li><a href="../program/index-banjarbaru.html">Pontianak</a></li>
                    <li><a href="../program/index-surabaya.html">
                      <span>Surabaya</span></a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><a class="nav-link scrollto" href="https://www.dialogika.co/sertifikasi/">Sertifikasi</a></li>
            <li><a class="nav-link scrollto" href="../corporate/">Corporate</a></li>
            <li class="dropdown" style="color: #0b2b6a"><a disabled><span>More</span> <i class="bi bi-chevron-down"></i></a>
            <ul>
              <li><a href="../about">About Us</a></li>
              <li><a href="../event/">Event</a></li>
                <li><a href="../intern">Internship</a></li>
                <li><a href="../shop">Shop</a></li> 
                <li><a href="../blog">Blog</a></li>
                <li><a href="../service/">Service</a></li> 
              </ul>
            </li>
            
          </ul>
          <i class="bi bi-list d-block d-md-none" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"></i>
        </nav><!-- .navbar -->

        <a href="#contact" class="appointment-btn">Daftar <span class="d-md-inline">Sekarang</span></a>

      </div>
    </header><!-- End Header -->

  <!-- ======= Mobile Nav ======= -->
  <nav class="navbar-canvas fixed-top">
  <div class="container-fluid">
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
      <div class="offcanvas-header">
        <a href="../index.html">
          <img src="../assets/img/logo.webp" class="offcanvas-title" id="offcanvasNavbarLabel"/>
        </a>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div class="offcanvas-body">
        <a href="#hero"><div class="card"><div class="card-body">Home</div></div></a>
        <div class="card">
          <a href="#program-collapse" data-bs-toggle="collapse">
            <div class="card-body d-flex justify-content-between">
              <span>Program</span>
              <i class='bx bxs-chevron-down bx-tada'></i>
            </div>
          </a>
          <div class="collapse" id="program-collapse">
            <div class="card">
              <a href="#program-online" data-bs-toggle="collapse">
                <div class="card-body d-flex justify-content-between">
                  <span>Online</span>
                  <i class='bx bxs-chevron-down bx-tada'></i>
                </div>
              </a>
              <div class="collapse" id="program-online">
                <a href="../program/basic-play.html"><div class="card card-body">Basic Play</div></a>
                <a href="../program/basic-class.html">
                  <div class="card card-body">
                    <div class="justify-content-between d-flex">
                      <span>Basic Class</span>
                      <span class="badge bg-warning rounded-pill text-dark">Best Buy</span>
                    </div>
                  </div>
                </a>
                <!-- <a href="../program/basic-private.html"><div class="card card-body">Basic Private</div></a> -->
                <hr/>
                <a href="../program/kids-play.html"><div class="card card-body">Kids Play</div></a>
                <a href="../program/kids-class.html">
                  <div class="card card-body">
                    <div class="justify-content-between d-flex">
                      <span>Kids Class</span>
                      <span class="badge bg-info rounded-pill">Best Buy</span>
                    </div>
                  </div>
                </a>
                <!-- <a href="../program/kids-plus.html"><div class="card card-body">Kids Private</div></a> -->
              </div>
            </div>
            <div class="card">
              <a href="#program-offline" data-bs-toggle="collapse">
                <div class="card-body d-flex justify-content-between">
                  <span>Offline</span>
                  <i class='bx bxs-chevron-down bx-tada'></i>
                </div>
              </a>
              <div class="collapse" id="program-offline">
                <a href="../program/first-class.html">
                  <div class="card card-body">
                    <div class="justify-content-between d-flex">
                      <span>First Class</span>
                      <span class="badge bg-warning rounded-pill text-dark">Best Buy</span>
                    </div>
                  </div>
                </a>
                <a href="../program/first-kids.html">
                  <div class="card card-body">
                    <div class="justify-content-between d-flex">
                      <span>First Kids</span>
                      <span class="badge bg-info rounded-pill">New</span>
                    </div>
                  </div>
                </a>
                <hr/>
                <a href="../program/first-private.html"><div class="card card-body">First Private</div></a>
              </div>
            </div>
          </div>
        </div>
        <a href="https://www.dialogika.co/sertifikasi/"><div class="card card-body">Sertifikasi</div></a>
        <a href="../corporate/"><div class="card card-body">Corporate</div></a>

        <div class="card">
          <a href="#header-more" data-bs-toggle="collapse">
            <div class="card-body d-flex justify-content-between">
              <span>More</span>
              <i class='bx bxs-chevron-down bx-tada'></i>
            </div>
          </a>
          <div class="collapse" id="header-more">
            <a href="https://www.dialogika.co/about/"><div class="card card-body">About Us</div></a>
            <a href="../intern/"><div class="card card-body">Internship</div></a>
            <a href="../event/">
              <div class="card card-body">
                <div class="justify-content-between d-flex">
                  <span>Event</span>
                  <!-- <span class="badge bg-info rounded-pill">New</span> -->
                </div>
              </div>
            </a>
            <a href="../service/">
              <div class="card card-body">
                <div class="justify-content-between d-flex">
                  <span>Service</span>
                </div>
              </div>
            </a>
            <a href="../blog/"><div class="card card-body">Blog</div></a>
            <a href="https://www.dialogika.co/shop/" onclick="return false;">
              <div class="card card-body">
                <div class="justify-content-between d-flex">
                  <span>Shop</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
<!-- End Mobile Nav -->

    `;
  }
}

//Footer
class Footer extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    let footerElement = document.querySelector("footer");
    if (!footerElement) {
      footerElement = document.createElement("footer");
      footerElement.id = "footer";
      this.appendChild(footerElement);
    }
    footerElement.innerHTML = `
  
  <!-- ======= Footer ======= -->
  <div class="footer-top">
    <div class="container">
      <div class="row justify-content-between">

        <div class="col-lg-3 col-md-6 footer-contact">
          <h3><img src="../assets/img/white-logo.webp" class="footer-logo" alt="Kelas Public Speaking Jogja" /></h3>
          <p>
            Wadah pengembangan diri membangun aura positif sekaligus meningkatkan kualitas skill, karir hingga level
            kehidupan Anda.
          </p><br>
          <p>Kami memberikan pelatihan Kelas Public Speaking karena dengan menguasai Public Speaking, mental,
            perilaku, penampilan hingga sikap Anda terbentuk.</p><br>
          <h4 class="d-flex justify-content-between">Contact Us<i class='bx bx-chevron-down d-md-none'></i></h4>
          <div class="social-link d-flex mt-3">
            <a href="https://wa.me/6285162992597"
              class="text-light d-flex align-items-center justify-content-center"><i class="bx bxl-whatsapp"></i></a>
            <a href="mailto:hello@dialogika.co" class="d-flex align-items-center justify-content-center"><i
                class="bi bi-envelope-at-fill"></i></a>
          </div>
          <hr />
          <p>Punya pertanyaan mengenai Dialogika?</p>
          <br>
          <p>
            <strong>Phone:</strong> +62 851-6299-2597<br>
            <strong>Email:</strong> hello@dialogika.co<br>
          </p>
          <br><br>
          <h4 class="d-flex justify-content-between">Follow Us<i class='bx bx-chevron-down d-md-none'></i></h4>
          <div class="social-link d-flex mt-3">
            <a href="https://x.com/dialogika_co" class="d-flex align-items-center justify-content-center"><i
                class="bi bi-twitter"></i></a>
            <a href="https://www.facebook.com/dialogika.co" class="d-flex align-items-center justify-content-center"><i
                class="bi bi-facebook"></i></a>
            <a href="https://instagram.com/dialogika.co" class="d-flex align-items-center justify-content-center"><i
                class="bi bi-instagram"></i></a>
            <a href="https://www.linkedin.com/company/dialogika" class="d-flex align-items-center justify-content-center"><i
                class="bi bi-linkedin"></i></a>
          </div>
        </div>

        <div class="col-lg-2 col-md-6 footer-links accordion">

          <div>
            <a href="#footer-online-program" class="d-flex justify-content-between" data-bs-toggle="collapse" id="footer-accordion-online">
              <h4>Online Program</h4><i class='bx bx-chevron-down d-md-none'></i>
            </a>
            <ul class="accordion-collapse collapse show" id="footer-online-program" data-bs-parent=".footer-links">
              <li><i class="bx bx-chevron-right"></i>
                <a href="../program/basic-class.html">Basic Class</a>
              </li>
              <li><i class="bx bx-chevron-right"></i>
                <a href="../program/basic-plus.html">Basic Plus</a>
              </li>
              <li><i class="bx bx-chevron-right"></i>
                <a href="../program/kids-class.html">Kids Class</a>
              </li>
            </ul>
          </div><br>

          <div>
            <a href="#footer-offline-program" class="d-flex justify-content-between" data-bs-toggle="collapse" id="footer-accordion-offline">
              <h4>Offline Program</h4><i class='bx bx-chevron-down d-md-none'></i>
            </a>
            <ul class="accordion-collapse collapse show" id="footer-offline-program">
              <li><i class="bx bx-chevron-right"></i>
                <a href="../program/index-jogja.html">Jogja</a>
              </li>
              <li><i class="bx bx-chevron-right"></i>
                <a href="../program/index.html">Jakarta</a>
              </li>
              <li><i class="bx bx-chevron-right"></i>
                <a href="../program/index-tangsel.html">Bintaro</a>
              </li>
              <li><i class="bx bx-chevron-right"></i>
                <a href="https://www.dialogika.co/page/kelas-public-speaking-surabaya-new">Surabaya</a>
              </li>
            </ul>
          </div><br>

          <div>
            <a href="#footer-corporate-program" class="d-flex justify-content-between" data-bs-toggle="collapse" id="footer-accordion-corporate">
              <h4>Corporate Program</h4><i class='bx bx-chevron-down d-md-none'></i>
            </a>
            <ul class="accordion-collapse collapse show" id="footer-corporate-program" data-bs-parent=".footer-links">
              <li><i class="bx bx-chevron-right"></i>
                <a href="../corporate/">Effective Communication</a>
              </li>
              <li><i class="bx bx-chevron-right"></i>
                <a href="../corporate/">Service Excellence</a>
              </li>
              <li><i class="bx bx-chevron-right"></i>
                <a href="../corporate/">Sales Training</a>
              </li>
              <li><i class="bx bx-chevron-right"></i>
                <a href="../corporate/">Tour Guide Training</a>
              </li>
            </ul>
          </div><br>

          <div>
            <a href="#footer-useful-link" class="d-flex justify-content-between" data-bs-toggle="collapse" id="footer-accordion-useful">
              <h4>Useful Links</h4><i class='bx bx-chevron-down d-md-none'></i>
            </a>
            <ul class="accordion-collapse collapse show" id="footer-useful-link" data-bs-parent=".footer-links">
              <li><i class="bx bx-chevron-right"></i>
                <a href="../blog/index.html">Blog</a>
              </li>
              <li><i class="bx bx-chevron-right"></i>
                <a href="../mentor/index.html">Mentor</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="col-lg-3 col-md-6 footer-links">
          <div>
            <a href="#footer-about" class="d-flex justify-content-between" data-bs-toggle="collapse"
              id="footer-accordion-about">
              <h4>About</h4><i class='bx bx-chevron-down d-md-none'></i>
            </a>
            <ul class="accordion-collapse collapse show" id="footer-about" data-bs-parent=".footer-links">
              <li><i class="bx bx-chevron-right"></i>
                <a href="https://www.dialogika.co/help/payment">FAQ</a>
              </li>
              <li><i class="bx bx-chevron-right"></i>
                <a href="https://www.dialogika.co/help/">Help Center</a>
              </li>
              <li><i class="bx bx-chevron-right"></i>
                <a href="https://www.dialogika.co/policy/">Privacy Policy</a>
              </li>
              <li><i class="bx bx-chevron-right"></i>
                <a href="../about/terms.html">Terms & Agreement</a>
              </li>
            </ul><br/>
          </div>
          <div>
            <div class="footer-recent-post align-items-center">
              <h4>Instagram Post <i class='bx bx-chevron-down d-md-none'></i></h4>
              <ul>
                <li class="clearfix">
                  <img loading="lazy" src="../assets/img/ig/1.jpg" alt="" class="rounded ig-post float-left" style="margin-right: 10px;width: 70px;height: 70px; border-radius: 10px;">
                  <div class="post float-left">
                    <a target="__blank" href="https://www.instagram.com/p/Claa6CPISTB/">Gambaran kelas praktek public speaking secara offline</a>
                    <div class="date"><i class="bx bx-calendar" aria-hidden="true"></i> Nov 26, 2022</div>
                  </div>
                </li>
                <hr/>
                <li class="clearfix">
                  <img loading="lazy" src="../assets/img/ig/2.jpg" alt="" class="rounded ig-post float-left" style="margin-right: 10px;width: 70px;height: 70px; border-radius: 10px;">
                  <div class="post float-left">
                    <a target="__blank" href="https://www.instagram.com/p/CyXfjtkrJe7/">Tips-tips agar di notice dosen didalam kelas dan latihan membangun persona.</a>
                    <div class="date"><i class="bx bx-calendar" aria-hidden="true"></i> Oct 14, 2023</div>
                  </div>
                </li>
                <hr/>
                <li class="clearfix">
                  <img loading="lazy" src="../assets/img/ig/3.jpg" alt="" class="rounded ig-post float-left" style="margin-right: 10px;width: 70px;height: 70px; border-radius: 10px;">
                  <div class="post float-left">
                    <a target="__blank" href="https://www.instagram.com/p/CzAf73qr2mj/">5 tips jitu atasi otak yang ngeblank saat berbicara di depan umum</a>
                    <div class="date"><i class="bx bx-calendar" aria-hidden="true"></i> Oct 30, 2023</div>
                  </div>
                </li>
                <hr/>
                <li class="clearfix">
                  <img loading="lazy" src="../assets/img/ig/4.jpg" alt="" class="rounded ig-post float-left" style="margin-right: 10px;width: 70px;height: 70px; border-radius: 10px;">
                  <div class="post float-left">
                    <a target="__blank" href="blog-details.html">5 trik untuk para newbie agar viral di depan umum. (Cocok untuk konten creator)</a>
                    <div class="date"><i class="bx bx-calendar" aria-hidden="true"></i> Nov 2, 2023</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 footer-newsletter">
          <h4 class="d-flex justify-content-between">Subscribe<i
              class='bx bx-chevron-down d-md-none'></i></h4>
          <p>Dapatkan update program, tips public speaking, dan info promo terbaru dari Dialogika melalui email.</p>
          <form action="javascript:void(0)" role="form" id="subscriptionForm" method="post">
            <input
              type="email"
              id="footerEmail"
              name="email"
              class="custom-input-footer"
              placeholder="Masukkan email kamu"
            >
            <button
              type="button"
              class="blue-dialogika-btn"
              id="footerSubscribeButton"
            >
              Subscribe
            </button>
          </form>
          <div id="footerSubscribeMessage" class="mt-2 small"></div>
          <br><br>
          <h4 class="d-flex justify-content-between">Payment Method<i class='bx bx-chevron-down d-md-none'></i></h4>
          <p><i class="bx bx-chevron-down"></i> Bank Transfer</p>
          <img loading="lazy" src="../assets/img/bank.webp" style="width:100%;"/>
          <br><br>
          <p><i class="bx bx-chevron-down"></i> E-Wallet</p>
          <img loading="lazy" src="../assets/img/wallet.webp" style="width:100%;"/>

          <ul class="list-group border-warning" style="background: transparent;">
            <li class="list-group-item">
              <b>Telah Terdaftar Oleh</b><br>
              <img loading="lazy" src="../assets/img/ham.webp" class="" /><br>
              <strong>Nomor:</strong> AHU-0118640.AH.01.11.TAHUN 2022<br>
              <strong>Registrasi: </strong>4022062334106037<br />
            </li>
          </ul>
        </div>

      </div>
    </div>
  </div>

  <div class="container d-md-flex py-4">

    <div class="me-md-auto text-center text-md-start">
      <div class="copyright">
        &copy; Copyright <strong><span>Dialogika</span></strong> | PT. Dialogika Persona Indonesia
      </div>

    </div>
    <div class="social-links text-center text-md-right pt-3 pt-md-0">
      <a href="https://x.com/dialogika_co" class="twitter" target="_blank" rel="noopener noreferrer"><i class="bi bi-twitter"></i></a>
      <a href="https://www.facebook.com/dialogika.co" class="facebook" target="_blank" rel="noopener noreferrer"><i class="bi bi-facebook"></i></a>
      <a href="https://instagram.com/dialogika.co" class="instagram" target="_blank" rel="noopener noreferrer"><i class="bi bi-instagram"></i></a>
      <a href="https://wa.me/6285162992597" class="google-plus" target="_blank" rel="noopener noreferrer"><i class="bx bxl-whatsapp"></i></a>
      <a href="https://linkedin.com/company/dialogika" class="linkedin" target="_blank" rel="noopener noreferrer"><i class="bx bxl-linkedin"></i></i></a>
    </div>
  </div>
  <!-- End Footer -->

    `;

    const subscribeButton = document.getElementById("footerSubscribeButton");
    if (subscribeButton) {
      subscribeButton.addEventListener("click", function () {
        const emailInput = document.getElementById("footerEmail");
        const messageElement = document.getElementById("footerSubscribeMessage");
        const email = emailInput ? emailInput.value.trim() : "";

        if (!validateEmail(email)) {
          if (messageElement) {
            messageElement.textContent = "Email tidak valid";
            messageElement.classList.remove("text-success");
            messageElement.classList.add("text-danger");
          }
        } else {
          if (messageElement) {
            messageElement.textContent = "Menyimpan email...";
            messageElement.classList.remove("text-danger");
            messageElement.classList.remove("text-success");
          }
          saveSubscriptionEmail(email)
            .then(function () {
              if (messageElement) {
                messageElement.textContent = "Berhasil subscribe";
                messageElement.classList.remove("text-danger");
                messageElement.classList.add("text-success");
              }
              if (emailInput) {
                emailInput.value = "";
              }
            })
            .catch(function () {
              if (messageElement) {
                messageElement.textContent = "Terjadi kesalahan saat menyimpan email";
                messageElement.classList.remove("text-success");
                messageElement.classList.add("text-danger");
              }
            });
        }
      });
    }
  }
}

function validateEmail(email) {
  return email.includes("@") && email.includes(".");
}

function loadFirebaseScripts() {
  if (window.firebase) {
    return Promise.resolve();
  }
  if (window.dialogikaFirebaseLoading) {
    return window.dialogikaFirebaseLoading;
  }
  var appScript = document.createElement("script");
  appScript.src = "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js";
  var firestoreScript = document.createElement("script");
  firestoreScript.src = "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js";
  var promise = new Promise(function (resolve, reject) {
    appScript.onload = function () {
      firestoreScript.onload = function () {
        resolve();
      };
      firestoreScript.onerror = reject;
      document.head.appendChild(firestoreScript);
    };
    appScript.onerror = reject;
    document.head.appendChild(appScript);
  });
  window.dialogikaFirebaseLoading = promise;
  return promise;
}

function getFirestoreInstance() {
  if (window.dialogikaFirestore) {
    return Promise.resolve(window.dialogikaFirestore);
  }
  return loadFirebaseScripts().then(function () {
    if (!window.dialogikaFirebaseApp) {
      var firebaseConfig = {
        apiKey: "AIzaSyDyzzEYbJkkl-N8snrQf14qvj8De4YliV0",
        authDomain: "pre-dialogika.firebaseapp.com",
        projectId: "pre-dialogika",
        storageBucket: "pre-dialogika.firebasestorage.app",
        messagingSenderId: "343771410480",
        appId: "1:343771410480:web:32881c9868522090237df5",
        measurementId: "G-SXN811P3N0"
      };
      window.dialogikaFirebaseApp = firebase.initializeApp(firebaseConfig);
    }
    var db = firebase.firestore();
    window.dialogikaFirestore = db;
    return db;
  });
}

function saveSubscriptionEmail(email) {
  return getFirestoreInstance().then(function (db) {
    return db.collection("subscription_email").add({
      email: email,
      createdAt: new Date().toISOString(),
      source: "footer"
    });
  });
}

customElements.define("main-header", Header);
customElements.define("main-footer", Footer);

