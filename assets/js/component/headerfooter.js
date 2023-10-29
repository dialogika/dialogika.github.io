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
        <i class="bi bi-envelope"></i> <a href="mailto:hello@dialogika.co">hello@dialogika.co</a>
        <i class="bi bi-phone"></i> <a href="https://link.dialogika.co/wasap-2597-dialogika-co">+62 851-6299-2597</a>
      </div>
      <div class="d-none d-lg-flex social-links align-items-center">
        <a href="https://link.dialogika.co/twitter" class="twitter"><i class="bi bi-twitter"></i></a>
        <a href="https://link.dialogika.co/facebook" class="facebook"><i class="bi bi-facebook"></i></a>
        <a href="https://link.dialogika.co/instagram" class="instagram"><i class="bi bi-instagram"></i></a>
        <a href="https://link.dialogika.co/linkedin" class="linkedin"><i class="bi bi-linkedin"></i></i></a>
      </div>
    </div>
  </div><!-- End Top Bar -->

  <!-- ======= Header ======= -->
  <header id="header" class="fixed-top">
    <div class="container d-flex align-items-center">
      <a href="https://dialogika.co/" class="logo me-auto"><img src="../assets/img/logo.png" alt="" class="img-fluid"></a>

      <nav id="navbar" class="navbar order-last order-lg-0">
        <ul id="navbar-navlist">
          <li><a class="nav-link scrollto active" data-scroll href="#hero">Home</a></li>
          <li class="dropdown"><a href="../program/index.html"><span>Program</span><i class='bx bx-chevron-down-circle'></i></a>
            <ul>
              <li class="dropdown"><a href="../program/online.html"><span>Online</span> <i class="bi bi-chevron-right"></i></a>
                <ul>
                  <li><a href="../program/basic-plus.html">Basic Plus</a></li>
                  <li><a href="../program/kids-plus.html">Kids Plus</a></li>
                  <li class="dropdown-divider"></li>
                  <li><a href="../program/basic-plus.html">Basic Private</a></li>
                  <li><a href="../program/kids-plus.html">Basic Private</a></li>
                  <li class="dropdown-divider"></li>
                  <li><a href="../program/action-play.html">Action Play</a></li>
                  <li><a href="../program/kids-play.html">Kids Play</a></li>
                  <li><a href="../program/teen-play.html">Teen Play</a></li>
                </ul>
              </li>
              <li class="dropdown"><a href="../program/offline.html"><span>Offline</span> <i class="bi bi-chevron-right"></i></a>
                <ul>
                  <li><a href="../program/first-class.html">First Class</a></li>
                  <li><a href="../program/first-class.html">First Private</a></li>
                  <li><a href="../program/first-kids.html">First Kids</a></li>
                </ul>
              </li>
              <li class="dropdown-divider"></li>
              <li class="dropdown"><a href="../program/offline.html"><span>Area</span> <i class="bi bi-chevron-right"></i></a>
                <ul>
                  <li><a href="../area/yogyakarta.html">Yogyakarta</a></li>
                  <li><a href="area/tangerang-selatan.html">Tangerang</a></li>
                  <li><a href="../area/surabaya.html"><span>Surabaya</span> <span class="badge rounded-grey">Coming Soon</span></a></li>
                </ul>
              </li>
            </ul>
          </li>
          <li><a class="nav-link" href="../corporate/index.html">Corporate</a></li>
          <li class="dropdown"><a href="../service/"><span>Service</span><i class='bx bx-chevron-down-circle'></i></a>
            <ul>
              <li class="dropdown">
                <a href="../service/counseling/"><span>Counseling</span> <i class="bi bi-chevron-right"></i></a>
                <ul>
                  <li><a href="../service/counseling/relationship.html">
                      <span>Relationship
                        <sup>&nbsp;</sup>
                      </span>
                    </a></li>
                  <li><a href="../service/counseling/parenting.html">
                      <span>Parenting
                        <sup>&nbsp;</sup>
                      </span>
                    </a></li>
                  <li><a href="../service/counseling/children.html">
                      <span>Children
                        <sup>&nbsp;</sup>
                      </span>
                    </a></li>
                  <li class="dropdown-divider"></li>
                  <li><a href="../service/counseling/request.html">
                      <span>Request</span>
                    </a></li>
                </ul>
              </li>
              <li class="dropdown">
                <a href="../service/mentoring/"><span>Mentoring</span> <i class="bi bi-chevron-right"></i></a>
                <ul>
                  <li><a href="../service/mentoring/teenager.html"><span>Teenager</span></a></li>
                  <li><a href="../service/mentoring/self-development.html"><span>Self Development</span></a></li>
                  <li class="dropdown-divider"></li>
                  <li><a href="../service/mentoring/request.html"><span>Request</span></a></li>
                </ul>
              </li>
              <li class="dropdown">
                <a href="../service/agency/"><span>Agency</span> <i class="bi bi-chevron-right"></i></a>
                <ul>
                  <li><a href="../service/agency/emcee.html"><span>Master of Ceremony</span></a></li>
                  <li><a href="../service/agency/host.html"><span>Host</span></a></li>
                  <li><a href="../service/agency/voice-over.html"><span>Voice Over</span></a></li>
                  <li class="dropdown-divider"></li>
                  <li><a href="../service/agency/request.html"><span>Request</span></a></li>
                </ul>
              </li>
            </ul>
          </li>
          <li class="dropdown"><a href="../shop/"><span>Shop</span><i class='bx bx-chevron-down-circle'></i></a>
            <ul>
              <li><a href="../shop/book.html">Book</a></li>
              <li><a href="../shop/module.html">Module</a></li>
              <li class="dropdown-divider"></li>
              <li><a href="../shop/">Discover</a></li>
            </ul>
          </li>
          <li><a class="nav-link" href="../event/index.html">Event</a></li>
          <li><a class="nav-link" href="../blog/index.html">Blog</a></li>
        </ul>
        <i class="bi bi-list mobile-nav-toggle"></i>
      </nav>
      <!-- .navbar -->

      <a href="../promo/" target="__blank" class="blue-btn position-relative"><span class="d-none d-md-inline">
          Claim</span> Promo
        <span class="position-absolute top-0 start-70 translate-middle badge rounded-pill bg-danger">
          <i class='bx bxs-alarm-exclamation bx-tada'></i>
          <em class="countdown" data-count="2025/12/2" data-template="&nbsp;%m:%s"
            style="font-family: 'Nunito',sans-serif;font-style: normal;"></em>
          <span class="visually-hidden">unread messages</span>
        </span>
      </a>
    </div>
  </header><!-- End Header -->

  <!-- ======= Sidebar Mobile ======= -->
  <div class="offcanvas offcanvas-start d-block d-sm-none" id="sidebar-mobile" data-bs-scroll="true">
    <div class="offcanvas-header">
      &nbsp;<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button></div>
    <div class="offcanvas-body">
      <div class="nav-menu">
        <ul>
          <li><a href="#hero" class="nav-link scrollto ">
              <i class="fa fa-home" style="margin-left: 10px;"></i>
              <span>Home</span>
            </a>
          </li>

          <li><a href="#online-collapse" data-bs-toggle="collapse" class="nav-link ">
              <i class="fa-solid fa-house-signal" style="margin-left: 10px;"></i>
              <span>Online</span>
            </a>
          </li>
          <div class="collapse" id="online-collapse" data-bs-parent="">
            <li><a href="../program/basic-plus.html" style="background-color: #f2f3f5;">
                <i class="fa-solid fa-shield-check" style="margin-left: 10px;"></i>
                <span>Basic Plus</span>
              </a>
            </li>
            <li><a href="../program/kids-plus.html" style="background-color: #f2f3f5;">
                <i class="fa-solid fa-shield-xmark" style="margin-left: 10px;"></i>
                <span>Kids Plus</span>
              </a>
            </li>
          </div>

          <li><a href="#offline-collapse" data-bs-toggle="collapse" class="nav-link ">
              <i class="fa-solid fa-hand-wave" style="margin-left: 10px;"></i>
              <span>Offline</span>
            </a>
          </li>
          <div class="collapse" id="offline-collapse" data-bs-parent="">
            <li><a href="../program/first-class.html" style="background-color: #f2f3f5;">
                <i class="fa-solid fa-shield-check" style="margin-left: 10px;"></i>
                <span>First Class</span>
              </a>
            </li>
            <li><a href="../program/first-kids.html" style="background-color: #f2f3f5;">
                <i class="fa-solid fa-shield-check" style="margin-left: 10px;"></i>
                <span>First Kids</span>
              </a>
            </li>
            
          </div>

          <li><a href="#area-collapse" data-bs-toggle="collapse" class="nav-link ">
              <i class="fa-solid fa-map-location-dot" style="margin-left: 10px;"></i>
              <span>Area</span>
            </a>
          </li>
          <div class="collapse" id="area-collapse" data-bs-parent="">
            <li><a href="../program/first-class.html#jogja" style="background-color: #f2f3f5;">
                <i class="fa-solid fa-shield-check" style="margin-left: 10px;"></i>
                <span>Yogyakarta</span>
              </a>
            </li>
            <li><a href="../program/first-class.html#tangsel" style="background-color: #f2f3f5;">
                <i class="fa-solid fa-shield-check" style="margin-left: 10px;"></i>
                <span>Tangerang</span>
              </a>
            </li>
            <li><a href="../program/first-class.html#surabaya" style="background-color: #f2f3f5;">
                <i class="fa-solid fa-shield-xmark" style="margin-left: 10px;"></i>
                <span>Surabaya</span>
              </a>
            </li>
          </div>

          
          <li><a href="../corporate/index.html" class="nav-link">
              <i class="fa-solid fa-building" style="margin-left: 10px;"></i>
              <span>Corporate</span>
            </a>
          </li>
          <li><a href="../event/index.html" class="nav-link">
              <i class="fa-solid fa-calendar-star" style="margin-left: 10px;"></i>
              <span>Event</span>
            </a>
          </li>
          <li><a href="../blog/index.html" class="nav-link">
              <i class="fa-brands fa-blogger-b" style="margin-left: 10px;"></i>
              <span>Blog</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div><!-- End Sidebar -->

    `;
  }
}

//Footer
class Footer extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
  <!-- ======= Counter-Area ======= -->
    <section class="tp-counter-area pt-90" style="background-color:#212121;">
      <div class="counter-b-border">
        <div class="container">
          <div class="row">
            <div class="col-xl-3 col-md-6">
              <div class="counter-item mb-70">
                <div class="counter-item__content counter-white-text">
                  <h4 class="counter-item__title counter-left-title"><span class="counter">1000</span>+</h4>
                  <p>Member Se Indonesia</p>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-md-6">
              <div class="counter-item mb-70">
                <div class="counter-item__content counter-white-text">
                  <h4 class="counter-item__title counter-left-title"><span class="counter">3</span>+</h4>
                  <p>Umur Usaha</p>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-md-6">
              <div class="counter-item mb-70">
                <div class="counter-item__content counter-white-text">
                  <h4 class="counter-item__title counter-left-title"><span class="counter">9</span>+</h4>
                  <p>Professional Mentor</p>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-md-6">
              <div class="counter-item mb-70">
                <div class="counter-item__content counter-white-text">
                  <h4 class="counter-item__title counter-left-title"><span class="counter">43</span>+</h4>
                  <p>Education Event</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  <!-- ======= Counter-Area-End ======= -->

  <!-- ======= Footer ======= -->
    <footer id="footer">

      <div class="footer-top">
        <div class="container">
          <div class="row justify-content-between">

            <div class="col-lg-3 col-md-6 footer-contact">
              <h3><img src="../assets/img/white-logo.png" class="footer-logo" alt="Kelas Public Speaking Jogja" /></h3>
              <p>
                Wadah pengembangan diri membangun aura positif sekaligus meningkatkan kualitas skill, karir hingga level
                kehidupan Anda.
              </p><br>
              <p>Kami memberikan pelatihan Kelas Public Speaking karena dengan menguasai Public Speaking, mental,
                perilaku, penampilan hingga sikap Anda terbentuk.</p><br>
              <h4 class="d-flex justify-content-between">Contact Us<i class='bx bx-chevron-down d-md-none'></i></h4>
              <div class="social-link d-flex mt-3">
                <a href="https://link.dialogika.co/wasap-2597-dialogika-co"
                  class="d-flex align-items-center justify-content-center"><i class="bx bxl-whatsapp"></i></a>
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
                <a href="https://link.dialogika.co/twitter" class="d-flex align-items-center justify-content-center"><i
                    class="bi bi-twitter"></i></a>
                <a href="https://link.dialogika.co/facebook" class="d-flex align-items-center justify-content-center"><i
                    class="bi bi-facebook"></i></a>
                <a href="https://link.dialogika.co/instagram" class="d-flex align-items-center justify-content-center"><i
                    class="bi bi-instagram"></i></a>
                <a href="https://link.dialogika.co/linkedin" class="d-flex align-items-center justify-content-center"><i
                    class="bi bi-linkedin"></i></a>
              </div>
            </div>

            <div class="col-lg-2 col-md-6 footer-links accordion">
              <div class="d-none d-md-block">
                <h4>Best Program</h4>
                <ul>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../program/basic-plus.html">Online Class</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../program/first-class.html">Offline Class</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../program/kids-plus.html">Kids Plus</a>
                  </li>
                </ul><br>
              </div>
              <div class="d-block d-md-none">
                <a href="#footer-best-program" class="d-flex justify-content-between " data-bs-toggle="collapse"
                  id="footer-accordion">
                  <h4>Best Program</h4><i class='bx bx-chevron-down d-md-none'></i>
                </a>
                <ul class="accordion-collapse collapse show" id="footer-best-program" data-bs-parent=".footer-links">
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../program/basic-plus.html">Online Class</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../program/first-class.html">Offline Class</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../program/kids-plus.html">Kids Plus</a>
                  </li>
                </ul>
              </div><br>

              <div class="d-none d-md-block">
                <h4>Corporate Program</h4>
                <ul>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../corporate/basic-training.html">Basic</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../corporate/advance-training.html">Advance</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../corporate/certified-training.html">Certified</a>
                  </li>
                </ul><br>
              </div>
              <div class="d-block d-md-none">
                <a href="#footer-corporate-program" class="d-flex justify-content-between" data-bs-toggle="collapse"
                  id="footer-accordion">
                  <h4>Corporate Program</h4><i class='bx bx-chevron-down d-md-none'></i>
                </a>
                <ul class="accordion-collapse collapse show" id="footer-corporate-program">
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../corporate/basic-training.html">Basic</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../corporate/advance-training.html">Advance</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../corporate/certified-training.html">Certified</a>
                  </li>
                </ul>
              </div><br>


              <div class="widget d-none d-md-block">
                <h4>Private Program</h4>
                <ul>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../program/basic-plus.html">Online Class</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../program/first-class.html">Offline Class</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../program/kids-plus.html">Kids Class</a>
                  </li>
                </ul><br>
              </div>
              <div class="d-block d-md-none">
                <a href="#footer-private-program" class="d-flex justify-content-between" data-bs-toggle="collapse"
                  id="footer-accordion">
                  <h4>Private Program</h4><i class='bx bx-chevron-down d-md-none'></i>
                </a>
                <ul class="accordion-collapse collapse show" id="footer-private-program" data-bs-parent=".footer-links">
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../program/basic-plus.html">Online Class</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../program/first-class.html">Offline Class</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../program/kids-plus.html">Kids Class</a>
                  </li>
                </ul>
              </div><br>


              <div class="widget d-none d-md-block">
                <h4>Career Info</h4>
                <ul>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../about/registration.html">Team</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../mentor/registration.html">Mentor</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../intern/index.html">Internship</a>
                  </li>
                </ul>
                <br>
              </div>
              <div class="d-block d-md-none">
                <a href="#footer-career-info" class="d-flex justify-content-between" data-bs-toggle="collapse"
                  id="footer-accordion">
                  <h4>Career Info</h4><i class='bx bx-chevron-down d-md-none'></i>
                </a>
                <ul class="accordion-collapse collapse show" id="footer-career-info" data-bs-parent=".footer-links">
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../about/registration.html">Team</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../mentor/registration.html">Mentor</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../intern/index.html">Internship</a>
                  </li>
                </ul>
                <br>
              </div>

              <div class="widget d-none d-md-block">
                <h4>Useful Link</h4>
                <ul>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="https://dialogika.co/blog">Blog Dialogika</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="https://dialogika.co/mentor">Mentor Dialogika</a>
                  </li>
                </ul>
              </div>
              <div class="d-block d-md-none">
                <a href="#footer-useful-link" class="d-flex justify-content-between" data-bs-toggle="collapse"
                  id="footer-accordion">
                  <h4>Useful Link</h4><i class='bx bx-chevron-down d-md-none'></i>
                </a>
                <ul class="accordion-collapse collapse show" id="footer-useful-link" data-bs-parent=".footer-links">
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../blog/index.html">Blog Dialogika</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../mentor/index.html">Mentor Dialogika</a>
                  </li>
                </ul>
              </div>
            </div>



            <div class="col-lg-3 col-md-6 footer-links">
              <div class="widget d-none d-md-block">
                <h4>Our Service</h4>
                <ul>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/counseling/">Counseling</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/mentoring/">Mentoring</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/agency/">Agency</a>
                  </li>
                </ul>
                <br>
              </div>
              <div class="d-block d-md-none">
                <a href="#footer-our-service" class="d-flex justify-content-between" data-bs-toggle="collapse"
                  id="footer-accordion">
                  <h4>Our Service</h4><i class='bx bx-chevron-down d-md-none'></i>
                </a>
                <ul class="accordion-collapse collapse show" id="footer-our-service" data-bs-parent=".footer-links">
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/counseling/">Counseling</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/mentoring/">Mentoring</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/agency/">Agency</a>
                  </li>
                </ul>
                <br>
              </div>


              <div class="widget d-none d-md-block">
                <h4>Event Agency</h4>
                <ul>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/agency/emcee.html">Master of Ceremony</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/agency/host.html">Host</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/agency/moderator.html">Moderator</a>
                  </li>
                </ul>
                <br>
              </div>
              <div class="d-block d-md-none">
                <a href="#footer-event-agency" class="d-flex justify-content-between" data-bs-toggle="collapse"
                  id="footer-accordion">
                  <h4>Event Agency</h4><i class='bx bx-chevron-down d-md-none'></i>
                </a>
                <ul class="accordion-collapse collapse show" id="footer-event-agency" data-bs-parent=".footer-links">
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/agency/emcee.html">Master of Ceremony</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/agency/host.html">Host</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/agency/moderator.html">Moderator</a>
                  </li>
                </ul>
                <br>
              </div>


              <div class="widget d-none d-md-block">
                <h4>Counseling</h4>
                <ul>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/counseling/relationship.html">Relationship</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/counseling/parenting.html">Parenting</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/counseling/kids.html">Children</a>
                  </li>
                </ul>
                <br>
              </div>
              <div class="d-block d-md-none">
                <a href="#footer-counseling-program" class="d-flex justify-content-between" data-bs-toggle="collapse"
                  id="footer-accordion">
                  <h4>Counseling</h4><i class='bx bx-chevron-down d-md-none'></i>
                </a>
                <ul class="accordion-collapse collapse show" id="footer-counseling-program"
                  data-bs-parent=".footer-links">
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/counseling/relationship.html">Relationship</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/counseling/parenting.html">Parenting</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../service/counseling/kids.html">Children</a>
                  </li>
                </ul>
                <br>
              </div>


              <div class="widget d-none d-md-block">
                <h4>About Dialogika</h4>
                <ul>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../about/">About Us</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../about/faq.html">FAQ</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../about/help.html">Help Center</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../about/privacy.html">Privacy Policy</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../about/terms.html">Terms & Agreements</a>
                  </li>
                </ul>
              </div>
              <div class="d-block d-md-none">
                <a href="#footer-about-dialogika" class="d-flex justify-content-between" data-bs-toggle="collapse"
                  id="footer-accordion">
                  <h4>About Dialogika</h4><i class='bx bx-chevron-down d-md-none'></i>
                </a>
                <ul class="accordion-collapse collapse show" id="footer-about-dialogika" data-bs-parent=".footer-links">
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../about/">About Us</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../about/faq.html">FAQ</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../about/help.html">Help Center</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../about/privacy.html">Privacy Policy</a>
                  </li>
                  <li><i class="bx bx-chevron-right"></i>
                    <a href="../about/terms.html">Terms & Agreements</a>
                  </li>
                </ul>
              </div>
            </div>

            <div class="col-lg-4 col-md-6 footer-newsletter">
              <h4 class="d-flex justify-content-between">Join Whatsapp Group Community<i
                  class='bx bx-chevron-down d-md-none'></i></h4>
              <p>Secara Berkala Kami Akan Bagi-Bagi Tips & Trik Gratis, Dan Info Promo Lainnya</p>
              <form action="javascript:void" role="form" id="subcriptions" method="post">
                <input type="tel" name="Surel" placeholder="Nomor Whatsapp"><input type="submit" value="Join Now"
                  onclick="Subcription()">
              </form>
              <br><br>
              <h4 class="d-flex justify-content-between">Payment Method<i class='bx bx-chevron-down d-md-none'></i></h4>
              <p><i class="bx bx-chevron-down"></i> Bank Transfer</p>
              <img src="../assets/img/bank.png" />
              <br><br>
              <p><i class="bx bx-chevron-down"></i> E-Wallet</p>
              <img src="../assets/img/wallet.png" />

              <div class="card">
                <div class="card-body">
                  <h6 class="card-subtitle mb-2 text-muted" style="color:#fff;">Telah Terdaftar Oleh</h6>
                  <img src="../assets/img/ham.png" class="" /><br>
                  <p>
                    <strong>Nomor:</strong> AHU-0118640.AH.01.11.TAHUN 2022<br>
                    <strong>Registrasi: </strong>4022062334106037<br />
                  </p>
                </div>
              </div>

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
          <a href="https://link.dialogika.co/twitter" class="twitter"><i class="bi bi-twitter"></i></a>
          <a href="https://link.dialogika.co/facebook" class="facebook"><i class="bi bi-facebook"></i></a>
          <a href="https://link.dialogika.co/instagram" class="instagram"><i class="bi bi-instagram"></i></a>
          <a href="https://link.dialogika.co/wasap-2597-dialogika-co" class="google-plus"><i
              class="bx bxl-whatsapp"></i></a>
          <a href="https://link.dialogika.co/linkedin" class="linkedin"><i class="bx bxl-linkedin"></i></i></a>
        </div>
      </div>
    </footer>
  <!-- End Footer -->
    `;
  }
}

customElements.define("main-header", Header);
customElements.define("main-footer", Footer);
