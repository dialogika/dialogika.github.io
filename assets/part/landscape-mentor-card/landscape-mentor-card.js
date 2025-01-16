// (Lihat di https://app.clickup.com/2307700/v/li/20433983, untuk detailnya)
// Untuk role contohnya teacher, voice over, Master of Ceremony, dll

// Untuk location, bila mentornya tersedia online dan offline maka masukkan lokasi offlinenya dan "Online" kedalam array
// Contoh mentornya mixed dan lokasinya di yogyakarta, jadinya arrayClassType: ["Online", "Offline"] maka lokasinya = location: ["Online", "Yogyakarta"]

const mentorData = [
  {
    id: 1,
    mentorName: "Fanny Carolina",
    arrayClassType: ["Offline"], // Options: "Online", "Offline". Bila Mixing di clickupnya maka masukkan Online & Offline
    teaching: ["Adult"], // Options: "Kids", "Adult", "Master of Ceremony", dll. Pastikan ada Kids atau Adult didalam arraynya !!
    gender: "Female",
    location: ["Yogyakarta"],
    role: "Master of Ceremony",
    imgPath: "../assets/img/mentor/fanny.jpg",
    description: "Master of ceremony senior di Yogyakarta yang telah diatas panggung lebih dari 17 tahun",
    profileLink: "https://www.dialogika.co/mentor/fanny.html",
  },
  {
    id: 2,
    mentorName: "Diah Nadiatul",
    arrayClassType: ["Online", "Offline"],
    teaching: ["Kids", "Adult"],
    gender: "Female",
    location: ["Online", "Yogyakarta"],
    role: "Teacher",
    imgPath: "../assets/img/mentor/diah.jpg",
    description: "Berpengalaman mengajar lebih dari ratusan anak dan di dunia Host/Moderator/Presenter",
    profileLink: "https://www.dialogika.co/mentor/diah.html",
  },
  {
    id: 3,
    mentorName: "Rismalla Ma'im Olam",
    arrayClassType: ["Online"],
    teaching: ["Kids"],
    gender: "Female",
    location: ["Online"],
    role: "Teacher",
    imgPath: "../assets/img/mentor/RismallaMa'imOlamNew.webp",
    description:
      "Professional mentor dengan pengalaman lebih dari 5 tahun yang senang berbagi ilmu dan melatih orang dalam public speaking",
    profileLink: "https://www.dialogika.co/mentor/rismalla.html",
  },
  {
    id: 4,
    mentorName: "Giomelando Eurichi Elaman",
    arrayClassType: ["Online"],
    teaching: ["Adult", "Kids"],
    gender: "Male",
    location: ["Online"],
    role: "Counselor",
    imgPath: "../assets/img/mentor/giomelando.jpg",
    description: "Mentor anak, dewasa, dan Master of Ceremony dengan pengalaman lebih dari 6 tahun.",
    profileLink: "https://www.dialogika.co/mentor/giomelando-eurichi-elaman.html",
  },
  {
    id: 5,
    mentorName: "Muhammad Rio Fariza",
    arrayClassType: ["Online", "Offline"],
    teaching: ["Adult", "Kids"],
    gender: "Male",
    location: ["Online", "Yogyakarta"],
    role: "Host",
    imgPath: "../assets/img/mentor/rio.jpg",
    description:
      "Mentor Master of Ceremony dengan pengalaman lebih dari 3 tahun, gemar berbagi pengalaman dan melatih orang.",
    profileLink: "https://www.dialogika.co/mentor/rio.html",
  },
  {
    id: 6,
    mentorName: "Muhamad Naufal Dzaky",
    arrayClassType: ["Online", "Offline"],
    teaching: ["Adult", "Kids", "College Student", "Presentation"],
    gender: "Male",
    location: ["Online", "Yogyakarta"],
    role: "Voice Over & Presentation",
    imgPath: "../assets/img/mentor/muhammad-naufal-dzaky.webp",
    description: "Mentor Voice Over, Presentation, MC dengan pengalaman lebih dari 5 tahun.",
    profileLink: "https://www.dialogika.co/mentor/Muhammad-naufal-dzaky.html",
  },
  {
    id: 7,
    mentorName: "Salsabiila Astari Putri",
    arrayClassType: ["Online"],
    teaching: ["Adult", "Kids", "Presentation"],
    gender: "Female",
    location: ["Online"],
    role: "Public Speaker",
    imgPath: "../assets/img/mentor/SalsabilaAstariaNew2.webp",
    description: "Mentor Presentation dan Master Of Ceremony dengan pengalaman lebih dari 10 tahun.",
    profileLink: "https://www.dialogika.co/mentor/salsabilla.html",
  },
  {
    id: 8,
    mentorName: "Husnul Fatiya",
    arrayClassType: ["Online"],
    teaching: ["Adult", "Kids"],
    gender: "Female",
    location: ["Online"],
    role: "Public Speaker",
    imgPath: "../assets/img/mentor/tiya.jpg",
    description: "Mentor Master Of Ceremony dengan pengalaman lebih dari 5 tahun.",
    profileLink: "https://www.dialogika.co/mentor/tiya.html",
  },
  {
    id: 9,
    mentorName: "Pauline Tricia",
    arrayClassType: ["Online"],
    teaching: ["Kids"],
    gender: "Female",
    location: ["Online"],
    role: "Public Speaker",
    imgPath: "../assets/img/mentor/cia.jpg",
    description: "Guru mengajar anak-anak dengan pengalaman lebih dari 4 tahun.",
    profileLink: "https://www.dialogika.co/mentor/cia.html",
  },
  {
    id: 9,
    mentorName: "Pauline Tricia",
    arrayClassType: ["Online"],
    teaching: ["Kids"],
    gender: "Female",
    location: ["Online"],
    role: "Public Speaker",
    imgPath: "../assets/img/mentor/cia.jpg",
    description: "Guru mengajar anak-anak dengan pengalaman lebih dari 4 tahun.",
    profileLink: "https://www.dialogika.co/mentor/cia.html",
  },
];

class MentorCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Ambil parameter dari attribute
    const classType = this.getAttribute("class-type") || "all";
    const teaching = this.getAttribute("teaching") || "all";

    this.renderMentors(classType, teaching);
  }

  renderMentors(classType, teaching) {
    const container = document.createElement("div");
    container.className = "mentor-container row";

    // Filter mentorData
    const filteredMentors = mentorData.filter((mentor) => {
      // cek apakah arrayClassType adalah array kemudian apakah isi arrayClassType ada yang sesuai dengan isi dari attribute "class-type"
      const matchesClassType =
        classType === "all" ||
        (Array.isArray(mentor.arrayClassType)
          ? mentor.arrayClassType.includes(classType)
          : mentor.arrayClassType === classType);
      const matchesTeaching = teaching === "all" || mentor.teaching.includes(teaching);
      return matchesClassType && matchesTeaching;
    });

    // Cek mentorData apakah ada yang sama dengan kriteria class-type dan teaching
    if (filteredMentors.length === 0) {
      container.innerHTML = `
        <div class="col-12">
          <p class="text-center">No mentors available for the selected criteria.</p>
        </div>
      `;
    } else {
      // Mentor Cards
      filteredMentors.forEach((mentor) => {
        const mentorCard = `
          <div class="col-lg-4 swiper-slide">
            <div class="member d-flex align-items-start">
              <div class="pic">
                <img src="${mentor.imgPath}" class="img-fluid" alt="${mentor.mentorName}">
              </div>
              <div class="member-info">
                <h4>${mentor.mentorName}</h4>
                <span>${mentor.role}</span>
                <p>${mentor.description}</p>
                <div class="more-btn" style="margin-top:20px;">
                  <a href="${mentor.profileLink}">More About ${
          mentor.gender.toLowerCase() === "female" ? "Her" : "Him"
        }</a>
                </div>
              </div>
            </div>
          </div>`;
        container.innerHTML += mentorCard;
      });
    }

    // Swiper container untuk mentor cards
    this.innerHTML = `
      <div class="align-items-center mentor-doctor swiper">
        <div class="mentor-swiper swiper-wrapper">
          ${container.innerHTML}
        </div>
        <div class="swiper-pagination"></div>
      </div>
    `;
  }
}

// Define the custom element
customElements.define("mentor-card", MentorCard);
