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
          <li class="nav-categories"><a href="../program/index.html"><span>Program</span><i
                class='bx bx-chevron-down-circle'></i></a>
            <ul>
              <li>
                <span class="badge rounded-blue">Online</span>&nbsp;
                <span class="badge rounded-blue">Subscribe</span>&nbsp;
              </li>
              <li>
                <span class="badge rounded-blue">Online</span>&nbsp;
                <span class="badge rounded-blue">Package</span>
              </li>
              <li>
                <span class="badge rounded-red">Private</span>&nbsp;
                <span class="badge rounded-blue">Package</span>&nbsp;
              </li>
              <li>
                <span class="badge rounded-blue">Online</span>&nbsp;
                <span class="badge rounded-orange">Advance</span>&nbsp;
              </li>
              <li>
                <a href="../corporate/">
                  <span class="badge rounded-green">Corporate</span>&nbsp;
                  <span class="badge rounded-blue">Training</span>&nbsp;
                </a>
              </li>
              <li><a href="../subscribe/action-play.html"><i class='bx bxs-chevron-right'></i>&nbsp;Action Play</a></li>
              <li>
                <a href="../program/kids-class.html"><i class='bx bxs-chevron-right'></i>&nbsp;Kids Class</a>
                <span class="badge rounded-blue-turtle">Kids</span>
              </li>
              <li>
                <a href="../private/basic-private.html"><i class='bx bxs-chevron-right'></i>&nbsp;Basic Private</a>
                <span class="badge rounded-blue">Online</span>
              </li>
              <li><a href="../program/presentation-class.html"><i class='bx bxs-chevron-right'></i>&nbsp;Presentation
                  Class</a>
              </li>
              <li><a href="../corporate/basic-training.html"><i class='bx bxs-chevron-right'></i>&nbsp;Basic Training</a>
              </li>
              <li>
                <a href="../subscribe/kids-play.html"><i class='bx bxs-chevron-right'></i>&nbsp;Kids Play</a>
                <span class="badge rounded-blue-turtle">Kids</span>
              </li>
              <li>
                <a href="../program/basic-plus.html"><i class='bx bxs-chevron-right'></i>&nbsp;Basic Plus</a>
              </li>
              <li>
                <a href="../private/first-private.html"><i class='bx bxs-chevron-right'></i>&nbsp;First Private</a>
                <span class="badge rounded-green">Jogja</span>
              </li>
              <li>
                <a href="../program/voice-over.html"><i class='bx bxs-chevron-right'></i>&nbsp;Voice Over</a>
              </li>
              <li>
                <a href="../corporate/advance-training.html"><i class='bx bxs-chevron-right'></i>&nbsp;Advance Training</a>
              </li>
              <li>
                <span class="badge rounded-green">Offline</span>&nbsp;
                <span class="badge rounded-blue">Subscribe</span>&nbsp;
              </li>
              <li>
                <span class="badge rounded-green">Offline</span>&nbsp;
                <span class="badge rounded-blue">Package</span>&nbsp;
              </li>
              <li>
                <a href="../private/kids-private.html"><i class='bx bxs-chevron-right'></i>&nbsp;Kids Private</a>
                <span class="badge rounded-blue-turtle">Kids</span>&nbsp;
                <span class="badge rounded-blue">Online</span>&nbsp;
              </li>
              <li>
                <span class="badge rounded-green">Offline</span>&nbsp;
                <span class="badge rounded-blue">Subscribe</span>&nbsp;
              </li>
              <li>
                <a href="../corporate/certified-training.html"><i class='bx bxs-chevron-right'></i>&nbsp;Certified
                  Training</a>
                <span class="badge rounded-grey">Coming Soon</span>
              </li>
              <li>
                <a href="../subscribe/jogja-play.html"><i class='bx bxs-chevron-right'></i>&nbsp;Jogja Play</a>
              </li>
              <li>
                <a href="../program/first-class.html"><i class='bx bxs-chevron-right'></i>&nbsp;First Class</a>
                <span class="badge rounded-green">Jogja</span>
              </li>
              <li>
                &nbsp;
              </li>
              <li>
                <a href="../program/emcee-class.html"><i class='bx bxs-chevron-right'></i>&nbsp;Master of Ceremony</a>
              </li>
              <li></li>
              <li>&nbsp;</li>
              <li>
                <a href="../program/royal-class-jakarta.html"><i class='bx bxs-chevron-right'></i>&nbsp;Royal
                  Class</a><span class="badge rounded-green">Jakarta</span>
              </li>
              <li>&nbsp;</li>
              <li></li>
              <li></li>
            </ul>
          </li>
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
            <li><a href="../subscribe/action-play.html" style="background-color: #f2f3f5;">
                <i class="fa-solid fa-shield-xmark" style="margin-left: 10px;"></i>
                <span>Action Play</span>
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
            <li><a href="../program/royal-class-jakarta.html" style="background-color: #f2f3f5;">
                <i class="fa-solid fa-shield-check" style="margin-left: 10px;"></i>
                <span>Royal Class</span>
              </a>
            </li>
            <li><a href="../subscribe/jogja-play.html" style="background-color: #f2f3f5;">
                <i class="fa-solid fa-shield-xmark" style="margin-left: 10px;"></i>
                <span>Jogja Play</span>
              </a>
            </li>
          </div>
          <li><a href="#kids-collapse" data-bs-toggle="collapse" class="nav-link ">
              <i class="fa-solid fa-family-pants" style="margin-left: 10px;"></i>
              <span>Kids</span>
            </a>
          </li>
          <div class="collapse" id="kids-collapse" data-bs-parent="">
            <li><a href="../program/kids-class.html" style="background-color: #f2f3f5;">
                <i class="fa-solid fa-shield-check" style="margin-left: 10px;"></i>
                <span>Kids Class</span>
              </a>
            </li>
            <li><a href="../subscribe/kids-play.html" style="background-color: #f2f3f5;">
                <i class="fa-solid fa-shield-xmark" style="margin-left: 10px;"></i>
                <span>Kids Play</span>
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
    
    `;
  }
}

customElements.define("main-header", Header);
customElements.define("main-footer", Footer);
