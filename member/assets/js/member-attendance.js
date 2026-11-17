// assets/js/member-attendance.js
// =====================================================================
// MEMBER ATTENDANCE ORCHESTRATOR
// Coordinates lifecycle, user events, repository queries, and UI rendering.
// Follows Pilot architecture guidelines: No direct Firestore, no raw DOM HTML.
// =====================================================================

import * as repo from "./member-attendance.repository.js?v=105.0";
import * as ui from "./member-attendance.ui.js?v=105.0";

/* ── State ── */
let currentMember = null;
let activeClasses = [];
let selectedClass = null;
let currentStatusInfo = null;
let existingAttendanceToday = null;
let isPhoneChecking = false;

/* ── DOM Element References ── */
let navModeTabs;
let alertContainer;
let sectionInputPhone;
let sectionSelectProfileMount;
let sectionDetectedMount;
let sectionSuccessMount;
let sectionDashboardMount;
let formCheckPhone;
let inputPhoneNumber;
let btnCheckPhone;
let btnCheckPhoneText;
let btnCheckPhoneSpinner;

let tabCheckin;
let tabRecap;
let tabRepeat;
let viewCheckin;
let viewRecap;
let viewRepeat;
let recapTableBody;
let recapDateSubtitle;
let btnRefreshRecap;
let repeatTableBody;
let repeatStatsMount;
let repeatDateSubtitle;
let btnRefreshRepeat;
let inputRepeatDate;
let btnResetRepeatDate;
let currentRepeatDate = "";

let inputRecapDate;
let recapTitle;
let currentRecapDate = "";
let currentRecapRecords = [];
let currentRepeatRecords = [];

/**
 * Normalizes URL path in address bar to clean public route (/presensi-member)
 * and strips any legacy cache-buster timestamp ('t') query parameters.
 */
function normalizeUrlPath() {
  try {
    const url = new URL(window.location.href);
    let changed = false;

    if (
      url.pathname.includes("/pages/product/member-attendance") ||
      url.pathname.includes("/presensi-member") ||
      url.pathname.includes("/member-attendance")
    ) {
      url.pathname = "/member";
      changed = true;
    }

    if (url.searchParams.has("t")) {
      url.searchParams.delete("t");
      changed = true;
    }

    // Strip trailing '?' or empty query string (e.g. /member/? -> /member)
    const hasEmptyQuery = window.location.search === "?" || (url.search && !url.searchParams.toString());
    const cleanSearch = url.searchParams.toString() ? `?${url.searchParams.toString()}` : "";

    if (changed || hasEmptyQuery || window.location.href.includes("?")) {
      const cleanPath = url.pathname.endsWith("/member/") ? "/member" : url.pathname;
      window.history.replaceState(null, "", cleanPath + cleanSearch + (url.hash || ""));
    }
  } catch (_e) {
    if (window.location.pathname.includes("/pages/product/member-attendance")) {
      window.history.replaceState(null, "", "/member");
    }
  }
}

/**
 * Checks whether user requested internal admin / recap mode via URL
 * e.g. /member?admin=true or /member?mode=admin or /member?recap=true
 */
function isInternalAdminMode() {
  try {
    const params = new URLSearchParams(window.location.search);
    return (
      params.get("admin") === "true" ||
      params.get("mode") === "admin" ||
      params.get("recap") === "true" ||
      params.get("repeat") === "true"
    );
  } catch (_e) {
    return false;
  }
}

function applyAdminModeVisibility() {
  const isAdmin = isInternalAdminMode();
  if (navModeTabs) {
    navModeTabs.classList.toggle("hidden", !isAdmin);
  }
  const linkToggleAdmin = document.getElementById("linkToggleAdminMode");
  if (linkToggleAdmin) {
    if (isAdmin) {
      linkToggleAdmin.classList.remove("hidden");
      linkToggleAdmin.innerHTML = `<i class="bi bi-box-arrow-left"></i> Kembali ke Portal Siswa`;
      linkToggleAdmin.href = "/member";
    } else {
      linkToggleAdmin.classList.add("hidden");
    }
  }

  if (isAdmin) {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("recap") === "true" || params.get("view") === "recap") {
        switchView("recap");
        loadRecapData();
      } else if (params.get("repeat") === "true" || params.get("view") === "repeat") {
        switchView("repeat");
        loadRepeatData();
      }
    } catch (_e) {}
  }
}

/**
 * Initializes DOM elements and binds event listeners
 */
function init() {
  normalizeUrlPath();
  cacheDom();
  applyAdminModeVisibility();
  bindEvents();
  loadInitialData();
}

function ensureToolbarControls() {
  // 1. Ensure Brand Logo is Dialogika official colorful logo on clean white navbar
  const brandWrap = document.querySelector(".brand-badge-wrap");
  if (brandWrap && (!brandWrap.querySelector("img") || brandWrap.querySelector("img[src*='white-logo']"))) {
    brandWrap.innerHTML = `
      <a href="./" class="flex items-center gap-3 no-underline">
        <img src="./assets/img/logo.webp" alt="Dialogika" class="h-8 md:h-9 w-auto object-contain" />
        <div class="border-l border-slate-200 pl-3 hidden sm:block">
          <p class="text-xs font-bold text-slate-800 leading-tight">Portal Presensi</p>
          <p class="text-[11px] text-slate-400 font-medium leading-tight">Siswa &amp; Member</p>
        </div>
      </a>
    `;
  }

  // 2. Ensure Recap Toolbar has Date Picker
  const refreshRecap = document.getElementById("btnRefreshRecap");
  if (refreshRecap && !document.getElementById("inputRecapDate")) {
    const parent = refreshRecap.parentElement;
    if (parent) {
      const dateWrapper = document.createElement("div");
      dateWrapper.className = "flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 transition-colors";
      dateWrapper.innerHTML = `
        <i class="bi bi-calendar3 text-blue-600"></i>
        <input
          type="date"
          id="inputRecapDate"
          class="bg-transparent border-none text-xs font-medium text-slate-700 outline-none cursor-pointer"
          title="Pilih tanggal presensi"
        />
      `;
      parent.insertBefore(dateWrapper, refreshRecap);

      inputRecapDate = document.getElementById("inputRecapDate");

      if (inputRecapDate) {
        inputRecapDate.value = currentRecapDate || ui.getTodayDateString();
        inputRecapDate.addEventListener("change", (e) => {
          currentRecapDate = e.target.value || ui.getTodayDateString();
          loadRecapData(currentRecapDate);
        });
      }
    }
  }

  // 3. Ensure Repeat Toolbar has Calendar
  const refreshRepeat = document.getElementById("btnRefreshRepeat");
  if (refreshRepeat) {
    const parent = refreshRepeat.parentElement;
    if (parent) {
      if (!document.getElementById("inputRepeatDate")) {
        const dateWrapper = document.createElement("div");
        dateWrapper.className = "flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 transition-colors";
        dateWrapper.innerHTML = `
          <i class="bi bi-calendar3 text-amber-500"></i>
          <input
            type="date"
            id="inputRepeatDate"
            class="bg-transparent border-none text-xs font-medium text-slate-700 outline-none cursor-pointer"
            title="Pilih tanggal data mengulang"
          />
        `;
        parent.insertBefore(dateWrapper, refreshRepeat);

        const resetBtn = document.createElement("button");
        resetBtn.type = "button";
        resetBtn.id = "btnResetRepeatDate";
        resetBtn.className = "dlg-btn-secondary py-1.5 px-2.5 text-xs flex items-center gap-1 text-slate-500 hover:text-slate-800";
        resetBtn.title = "Tampilkan semua data mengulang";
        resetBtn.innerHTML = `<i class="bi bi-globe"></i> Semua`;
        parent.insertBefore(resetBtn, refreshRepeat);

        inputRepeatDate = document.getElementById("inputRepeatDate");
        btnResetRepeatDate = document.getElementById("btnResetRepeatDate");

        if (inputRepeatDate) {
          inputRepeatDate.value = currentRepeatDate;
          inputRepeatDate.addEventListener("change", (e) => {
            currentRepeatDate = e.target.value || "";
            loadRepeatData(currentRepeatDate);
          });
        }

        if (btnResetRepeatDate) {
          btnResetRepeatDate.addEventListener("click", () => {
            if (inputRepeatDate) inputRepeatDate.value = "";
            currentRepeatDate = "";
            loadRepeatData("");
          });
        }
      }
    }
  }
}

function cacheDom() {
  ensureToolbarControls();
  alertContainer = document.getElementById("alertContainer");
  sectionInputPhone = document.getElementById("sectionInputPhone");
  sectionSelectProfileMount = document.getElementById("sectionSelectProfileMount");
  sectionDetectedMount = document.getElementById("sectionDetectedMount");
  sectionSuccessMount = document.getElementById("sectionSuccessMount");
  sectionDashboardMount = document.getElementById("sectionDashboardMount");
  formCheckPhone = document.getElementById("formCheckPhone");
  inputPhoneNumber = document.getElementById("inputPhoneNumber");
  btnCheckPhone = document.getElementById("btnCheckPhone");
  btnCheckPhoneText = document.getElementById("btnCheckPhoneText");
  btnCheckPhoneSpinner = document.getElementById("btnCheckPhoneSpinner");

  navModeTabs = document.getElementById("navModeTabs");
  tabCheckin = document.getElementById("tabCheckin");
  tabRecap = document.getElementById("tabRecap");
  tabRepeat = document.getElementById("tabRepeat");
  viewCheckin = document.getElementById("viewCheckin");
  viewRecap = document.getElementById("viewRecap");
  viewRepeat = document.getElementById("viewRepeat");
  recapTableBody = document.getElementById("recapTableBody");
  recapDateSubtitle = document.getElementById("recapDateSubtitle");
  btnRefreshRecap = document.getElementById("btnRefreshRecap");

  repeatTableBody = document.getElementById("repeatTableBody");
  repeatStatsMount = document.getElementById("repeatStatsMount");
  repeatDateSubtitle = document.getElementById("repeatDateSubtitle");
  btnRefreshRepeat = document.getElementById("btnRefreshRepeat");
  inputRepeatDate = document.getElementById("inputRepeatDate");
  btnResetRepeatDate = document.getElementById("btnResetRepeatDate");

  inputRecapDate = document.getElementById("inputRecapDate");
  recapTitle = document.getElementById("recapTitle");

  currentRecapDate = ui.getTodayDateString();
  if (inputRecapDate) {
    inputRecapDate.value = currentRecapDate;
  }

  if (recapDateSubtitle) {
    recapDateSubtitle.textContent = `Hari ini • ${ui.formatIndoDate(new Date())}`;
  }
}

function bindEvents() {
  if (formCheckPhone) {
    formCheckPhone.addEventListener("submit", (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      handleCheckPhone(e);
    });
  }

  if (btnCheckPhone) {
    btnCheckPhone.addEventListener("click", (e) => {
      if (formCheckPhone && typeof formCheckPhone.requestSubmit === "function") {
        e.preventDefault();
        formCheckPhone.requestSubmit();
      } else {
        handleCheckPhone(e);
      }
    });
  }

  if (inputPhoneNumber) {
    inputPhoneNumber.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        if (formCheckPhone && typeof formCheckPhone.requestSubmit === "function") {
          formCheckPhone.requestSubmit();
        } else {
          handleCheckPhone(e);
        }
      }
    });
  }

  if (tabCheckin) {
    tabCheckin.addEventListener("click", () => switchView("checkin"));
  }
  if (tabRecap) {
    tabRecap.addEventListener("click", () => {
      switchView("recap");
      loadRecapData();
    });
  }
  if (tabRepeat) {
    tabRepeat.addEventListener("click", () => {
      switchView("repeat");
      loadRepeatData(currentRepeatDate);
    });
  }

  if (btnRefreshRecap) {
    btnRefreshRecap.addEventListener("click", () => loadRecapData(currentRecapDate));
  }
  if (btnRefreshRepeat) {
    btnRefreshRepeat.addEventListener("click", () => loadRepeatData(currentRepeatDate));
  }

  if (inputRecapDate) {
    inputRecapDate.addEventListener("change", (e) => {
      currentRecapDate = e.target.value || ui.getTodayDateString();
      loadRecapData(currentRecapDate);
    });
  }

  if (inputRepeatDate) {
    inputRepeatDate.addEventListener("change", (e) => {
      currentRepeatDate = e.target.value || "";
      loadRepeatData(currentRepeatDate);
    });
  }

  if (btnResetRepeatDate) {
    btnResetRepeatDate.addEventListener("click", () => {
      if (inputRepeatDate) inputRepeatDate.value = "";
      currentRepeatDate = "";
      loadRepeatData("");
    });
  }

  // Auto clean phone formatting on typing
  if (inputPhoneNumber) {
    inputPhoneNumber.addEventListener("input", (e) => {
      const clean = e.target.value.replace(/[^0-9\-\s]/g, "");
      e.target.value = clean;
    });
  }
}

/**
 * Pre-fetches active classes for quick lookup
 */
async function loadInitialData() {
  try {
    activeClasses = await repo.fetchActiveClasses();
    const todayStr = ui.getTodayDateString();
    const records = await repo.fetchDailyAttendances(todayStr);
    if (recapTableBody) {
      ui.renderRecapTable(recapTableBody, records, activeClasses);
    }
    // Check if member already logged in via localStorage
    const saved = localStorage.getItem("dlg_member_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.nama || parsed.whatsapp)) {
          // Re-fetch fresh member doc from Firestore so updates (class_id, class_name, mentor)
          // made by admin are immediately reflected without stale local session
          try {
            const freshList = await repo.findMembersByPhone(parsed.whatsapp);
            if (freshList && freshList.length > 0) {
              const matched = freshList.find((m) => m.id === parsed.id) || freshList[0];
              // Attach all related sibling records for multi-class support
              matched.all_members = freshList.filter((m) => checkIfSamePerson(m, matched));
              currentMember = matched;
              localStorage.setItem("dlg_member_session", JSON.stringify(matched));
            } else {
              currentMember = parsed;
            }
          } catch (_errSync) {
            currentMember = parsed;
          }
          await showDashboardView(currentMember);
        }
      } catch (_e) {
        localStorage.removeItem("dlg_member_session");
      }
    }
    // Also preload repeat table in background
    loadRepeatData();
  } catch (err) {
    console.warn("[member-attendance] Could not pre-fetch classes:", err);
  }
}

/**
 * Switches between check-in view, daily recap view, and repeat view
 * @param {'checkin'|'recap'|'repeat'} view
 */
function switchView(view) {
  ensureToolbarControls();
  if (tabCheckin) tabCheckin.classList.toggle("active", view === "checkin");
  if (tabRecap) tabRecap.classList.toggle("active", view === "recap");
  if (tabRepeat) tabRepeat.classList.toggle("active", view === "repeat");

  if (viewCheckin) viewCheckin.classList.toggle("hidden", view !== "checkin");
  if (viewRecap) viewRecap.classList.toggle("hidden", view !== "recap");
  if (viewRepeat) viewRepeat.classList.toggle("hidden", view !== "repeat");
}

/**
 * Determines whether two member documents belong to the exact same person.
 * Intelligently separates family members / children sharing one phone number
 * (e.g. "Uli Artha (Audrey)" vs "Uli Artha (Arthur)", or "Budi" vs "Budi Jr"),
 * while grouping true duplicates / multi-class enrollments (e.g. "Rivka Hertzela" & "Rivka Hertzela Rapunzel").
 * @param {Object} memberA
 * @param {Object} memberB
 * @returns {boolean}
 */
export function checkIfSamePerson(memberA, memberB) {
  if (!memberA || !memberB) return false;
  const nameA = String(memberA.nama || "").toLowerCase().trim();
  const nameB = String(memberB.nama || "").toLowerCase().trim();

  if (!nameA || !nameB) return false;
  if (nameA === nameB) return true;

  // 1. Check for distinct names in parentheses (e.g. "(Audrey)" vs "(Arthur)")
  const parenA = nameA.match(/\(([^)]+)\)/);
  const parenB = nameB.match(/\(([^)]+)\)/);
  if (parenA && parenB) {
    const subA = parenA[1].trim();
    const subB = parenB[1].trim();
    if (subA !== subB) {
      return false; // Distinct individuals specified in parentheses!
    }
  } else if ((parenA && !parenB) || (!parenA && parenB)) {
    // One record explicitly designates a child or role in parentheses
    return false;
  }

  // 2. Check for suffixes like Jr, Junior, Anak
  const isJrA = /\b(jr|junior|anak)\b/i.test(nameA);
  const isJrB = /\b(jr|junior|anak)\b/i.test(nameB);
  if (isJrA !== isJrB) return false;

  // 3. Clean names from punctuation for robust token matching
  const cleanA = nameA.replace(/[^\w\s]/g, "").trim();
  const cleanB = nameB.replace(/[^\w\s]/g, "").trim();

  // If one name is a full prefix/extension (e.g. "Achmad Cholid" & "Achmad Cholid Yulianto")
  if (cleanA === cleanB || cleanA.startsWith(cleanB) || cleanB.startsWith(cleanA)) {
    return true;
  }

  // 4. Match multiple words in identical order (e.g. "Rivka Hertzela" & "Rivka Hertzela Rapunzel")
  const wordsA = cleanA.split(/\s+/).filter(Boolean);
  const wordsB = cleanB.split(/\s+/).filter(Boolean);

  if (wordsA.length >= 2 && wordsB.length >= 2) {
    if (wordsA[0] === wordsB[0] && wordsA[1] === wordsB[1]) {
      return true;
    }
  }

  return false;
}

/**
 * Handles Phone Number Lookup
 */
async function handleCheckPhone(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (isPhoneChecking) return;

  ui.clearAlert(alertContainer);

  const rawPhone = inputPhoneNumber ? inputPhoneNumber.value.trim() : "";
  const cleaned = repo.cleanPhoneNumber(rawPhone);

  if (!cleaned || cleaned.length < 9) {
    ui.showAlert(alertContainer, "Silakan masukkan nomor telepon/WhatsApp yang valid (minimal 9 digit).", "warning");
    return;
  }

  isPhoneChecking = true;
  setPhoneCheckingState(true);

  try {
    const members = await repo.findMembersByPhone(cleaned);
    if (!members || members.length === 0) {
      ui.showAlert(
        alertContainer,
        `Nomor WhatsApp (${cleaned}) tidak ditemukan di data siswa Dialogika. Pastikan nomor sesuai saat pendaftaran atau hubungi admin.`,
        "error"
      );
      return;
    }

    // 1. Cek apakah seluruh dokumen member adalah orang yang sama (misal DP & Pelunasan, atau 1 siswa beli >1 kelas)
    const isSamePerson =
      members.length > 1 &&
      members.every((m) => checkIfSamePerson(m, members[0]));

    if (isSamePerson) {
      // Pilih dokumen dengan nama paling lengkap dan tanggal join terbaru
      const sorted = [...members].sort((a, b) => {
        const lenDiff = (b.nama || "").length - (a.nama || "").length;
        if (lenDiff !== 0) return lenDiff;
        const d1 = new Date(a.current_join || a.created_at || 0).getTime();
        const d2 = new Date(b.current_join || b.created_at || 0).getTime();
        return d2 - d1;
      });
      const primaryMember = sorted[0];

      // Lengkapi info kota jika kosong di salah satu record
      if (!primaryMember.kota) {
        const withCity = members.find((m) => m.kota);
        if (withCity) primaryMember.kota = withCity.kota;
      }

      // Simpan referensi ke seluruh dokumen pendaftaran untuk agregasi multi-kelas
      primaryMember.all_members = members;

      currentMember = primaryMember;
      try {
        localStorage.setItem("dlg_member_session", JSON.stringify(currentMember));
      } catch (_e) {}

      await showDashboardView(currentMember);
      return;
    }

    // 2. Jika nomor dipakai oleh beberapa orang berbeda (misal keluarga/anak: Audrey & Arthur)
    if (members.length > 1) {
      showSelectProfileView(members, cleaned);
      return;
    }

    // 3. Single Member Match
    currentMember = members[0];
    currentMember.all_members = members;
    try {
      localStorage.setItem("dlg_member_session", JSON.stringify(currentMember));
    } catch (_e) {}

    await showDashboardView(currentMember);
    return;
  } catch (err) {
    console.error("[member-attendance] Lookup error:", err);
    if (sectionInputPhone) sectionInputPhone.classList.remove("hidden");
    if (sectionSelectProfileMount) sectionSelectProfileMount.classList.add("hidden");
    if (sectionDashboardMount) sectionDashboardMount.classList.add("hidden");
    ui.showAlert(alertContainer, "Terjadi kesalahan saat memeriksa data (" + (err.message || "Gagal memproses") + "). Silakan coba lagi.", "error");
  } finally {
    setPhoneCheckingState(false);
    isPhoneChecking = false;
  }
}

/**
 * Shows Multi-Profile Selector Screen (1 Nomor, Banyak Member)
 * @param {Array<Object>} members
 * @param {string} phone
 */
function showSelectProfileView(members, phone) {
  if (sectionInputPhone) sectionInputPhone.classList.add("hidden");
  if (sectionDashboardMount) sectionDashboardMount.classList.add("hidden");
  if (sectionDetectedMount) sectionDetectedMount.classList.add("hidden");
  if (sectionSuccessMount) sectionSuccessMount.classList.add("hidden");

  if (sectionSelectProfileMount) {
    sectionSelectProfileMount.classList.remove("hidden");
    ui.renderSelectProfileScreen(sectionSelectProfileMount, members, phone);

    const cards = sectionSelectProfileMount.querySelectorAll(".profile-choice-card");
    cards.forEach((card) => {
      card.addEventListener("click", async (e) => {
        if (e) e.preventDefault();
        const idx = Number(card.getAttribute("data-member-index") || 0);
        const selected = members[idx] || members[0];
        // Kaitkan seluruh dokumen dengan orang yang sama ke akun profil yang dipilih
        selected.all_members = members.filter((m) => checkIfSamePerson(m, selected));
        currentMember = selected;
        try {
          localStorage.setItem("dlg_member_session", JSON.stringify(currentMember));
        } catch (_e) {}
        sectionSelectProfileMount.classList.add("hidden");
        await showDashboardView(currentMember);
      });
    });

    const btnBack = sectionSelectProfileMount.querySelector("#btnBackToPhoneInput");
    if (btnBack) {
      btnBack.addEventListener("click", () => {
        sectionSelectProfileMount.classList.add("hidden");
        sectionInputPhone.classList.remove("hidden");
        if (inputPhoneNumber) inputPhoneNumber.focus();
      });
    }
  }
}

async function showDashboardView(member) {
  ui.clearAlert(alertContainer);
  try {
    // Pastikan member.all_members selalu terisi lengkap dari seluruh dokumen di database
    if (!member.all_members || member.all_members.length <= 1) {
      try {
        const freshList = await repo.findMembersByPhone(member.whatsapp);
        if (freshList && freshList.length > 0) {
          member.all_members = freshList.filter((m) => checkIfSamePerson(m, member));
          // Update cached session with complete member records
          try {
            localStorage.setItem("dlg_member_session", JSON.stringify(member));
          } catch (_e) {}
        }
      } catch (_eSync) {}
    }
    if (!activeClasses || activeClasses.length === 0) {
      try {
        activeClasses = await repo.fetchActiveClasses();
      } catch (errClasses) {
        console.warn("[member-attendance] Could not fetch active classes:", errClasses);
        activeClasses = [];
      }
    }

    let history = [];
    try {
      history = await repo.fetchMemberAttendanceHistory(member.whatsapp, member.id);
    } catch (errHistory) {
      console.warn("[member-attendance] Could not fetch member history:", errHistory);
      history = [];
    }

    let memberClasses = [];
    try {
      memberClasses = await repo.fetchMemberClasses(member, activeClasses, history);
    } catch (errCls) {
      console.warn("[member-attendance] Could not fetch member classes:", errCls);
      memberClasses = [];
    }

    if (sectionInputPhone) sectionInputPhone.classList.add("hidden");
    if (sectionSelectProfileMount) sectionSelectProfileMount.classList.add("hidden");
    if (sectionDetectedMount) sectionDetectedMount.classList.add("hidden");
    if (sectionSuccessMount) sectionSuccessMount.classList.add("hidden");

    if (sectionDashboardMount) {
      document.body.classList.add("dlg-dashboard-mode");
      const mainWrapper = document.getElementById("viewCheckin");
      if (mainWrapper) mainWrapper.classList.add("dashboard-active");
      sectionDashboardMount.classList.remove("hidden");
      ui.renderMemberDashboard(sectionDashboardMount, member, history, memberClasses);
      try {
        bindDashboardEvents(member, memberClasses, history);
      } catch (errEvents) {
        console.warn("[member-attendance] bindDashboardEvents warning:", errEvents);
      }
    }
  } catch (err) {
    document.body.classList.remove("dlg-dashboard-mode");
    console.error("[member-attendance] Dashboard render error:", err);
    if (sectionInputPhone) sectionInputPhone.classList.remove("hidden");
    if (sectionSelectProfileMount) sectionSelectProfileMount.classList.add("hidden");
    if (sectionDashboardMount) sectionDashboardMount.classList.add("hidden");
    ui.showAlert(alertContainer, "Gagal memuat dashboard siswa: " + (err.message || "Silakan coba lagi"), "error");
  }
}

function logoutMember() {
  document.body.classList.remove("dlg-dashboard-mode");
  const mainWrapper = document.getElementById("viewCheckin");
  if (mainWrapper) mainWrapper.classList.remove("dashboard-active");
  try {
    localStorage.removeItem("dlg_member_session");
  } catch (_e) {}
  currentMember = null;
  if (sectionDashboardMount) {
    sectionDashboardMount.innerHTML = "";
    sectionDashboardMount.classList.add("hidden");
  }
  if (sectionSelectProfileMount) sectionSelectProfileMount.classList.add("hidden");
  if (sectionDetectedMount) sectionDetectedMount.classList.add("hidden");
  if (sectionSuccessMount) sectionSuccessMount.classList.add("hidden");
  if (sectionInputPhone) {
    sectionInputPhone.classList.remove("hidden");
    if (inputPhoneNumber) {
      inputPhoneNumber.value = "";
      inputPhoneNumber.focus();
    }
  }
  ui.clearAlert(alertContainer);
}

function bindDashboardEvents(member, memberClasses = [], history = []) {
  const btnLogout = document.getElementById("btnLogoutMember");
  const btnOpenRegular = document.getElementById("btnOpenRegularForm");
  const btnOpenRepeat = document.getElementById("btnOpenRepeatForm");
  const formMount = document.getElementById("memberFormMount");

  // 1. Tab Navigation Controls
  const tabPresensi = document.getElementById("tabNavPresensi");
  const tabClasses = document.getElementById("tabNavClasses");
  const tabRepeat = document.getElementById("tabNavRepeat");
  const tabCert = document.getElementById("tabNavCertificate");

  const panelPresensi = document.getElementById("panelPresensi");
  const panelClasses = document.getElementById("panelClasses");
  const panelRepeat = document.getElementById("panelRepeat");
  const panelCert = document.getElementById("panelCertificate");

  function switchDashboardTab(tabName) {
    if (tabPresensi) tabPresensi.classList.toggle("active", tabName === "presensi");
    if (tabClasses) tabClasses.classList.toggle("active", tabName === "classes");
    if (tabRepeat) tabRepeat.classList.toggle("active", tabName === "repeat");
    if (tabCert) tabCert.classList.toggle("active", tabName === "certificate");

    const allMobileBtns = document.querySelectorAll(".mobile-nav-btn");
    allMobileBtns.forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-tab") === tabName);
    });

    if (panelPresensi) panelPresensi.classList.toggle("hidden", tabName !== "presensi");
    if (panelClasses) panelClasses.classList.toggle("hidden", tabName !== "classes");
    if (panelRepeat) panelRepeat.classList.toggle("hidden", tabName !== "repeat");
    if (panelCert) panelCert.classList.toggle("hidden", tabName !== "certificate");

    if (tabName === "certificate") {
      loadCertificateTab();
    } else if (tabName === "repeat") {
      loadRepeatTab();
    }
  }

  if (tabPresensi) tabPresensi.addEventListener("click", () => switchDashboardTab("presensi"));
  if (tabClasses) tabClasses.addEventListener("click", () => switchDashboardTab("classes"));
  if (tabRepeat) tabRepeat.addEventListener("click", () => switchDashboardTab("repeat"));
  if (tabCert) tabCert.addEventListener("click", () => switchDashboardTab("certificate"));

  // Mobile Bottom Navigation Bar Events
  const mobileNavBtns = document.querySelectorAll(".mobile-nav-btn");
  mobileNavBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabName = btn.getAttribute("data-tab");
      switchDashboardTab(tabName);
    });
  });

  const btnMobileLogout = document.getElementById("btnMobileLogout");
  if (btnMobileLogout) {
    btnMobileLogout.addEventListener("click", () => logoutMember());
  }

  const btnSeeAllHistory = document.getElementById("btnSeeAllHistory");
  if (btnSeeAllHistory && tabClasses) {
    btnSeeAllHistory.addEventListener("click", () => switchDashboardTab("classes"));
  }

  async function loadCertificateTab(targetClassName = "") {
    const certMount = document.getElementById("memberCertMount");
    if (!certMount) return;

    if (certMount.dataset.loaded && !targetClassName) return;

    certMount.innerHTML = `
      <div class="active-form-card card-border-certificate animate-fade-in p-8 text-center">
        <div class="spinner-border text-primary mb-3" role="status" style="width:2.5rem;height:2.5rem;"></div>
        <h4 class="text-sm font-bold text-slate-800 m-0">Memeriksa Data Sertifikat Kelulusan...</h4>
        <p class="text-xs text-slate-400 mt-1">Menghubungkan ke arsip sertifikat resmi Dialogika</p>
      </div>
    `;

    try {
      const certificates = await repo.findCertificatesByMember(member);
      const filteredCerts = certificates.filter(
        (c) =>
          !targetClassName ||
          (c.className && c.className.toLowerCase().includes(targetClassName.toLowerCase())) ||
          (targetClassName && targetClassName.toLowerCase().includes(String(c.className).toLowerCase()))
      );
      const certsToRender = filteredCerts.length > 0 ? filteredCerts : certificates;
      ui.renderCertificateSection(certMount, member, certsToRender);
      if (certsToRender && certsToRender.length > 0) {
        certMount.dataset.loaded = "true";
      } else {
        certMount.removeAttribute("data-loaded");
      }

      const btnClose = document.getElementById("btnCloseCertForm");
      const btnCloseNotice = document.getElementById("btnCloseCertNotice");
      const btnDownloadPng = document.getElementById("btnDownloadCertPng");
      const btnDownloadSvg = document.getElementById("btnDownloadCertSvg");
      const selectCert = document.getElementById("selectMemberCertificate");
      const btnRefreshCert = document.getElementById("btnRefreshCertStatus");

      if (btnRefreshCert) {
        btnRefreshCert.addEventListener("click", () => {
          certMount.removeAttribute("data-loaded");
          loadCertificateTab(targetClassName);
        });
      }

      if (btnClose) btnClose.addEventListener("click", () => switchDashboardTab("presensi"));
      if (btnCloseNotice) btnCloseNotice.addEventListener("click", () => switchDashboardTab("presensi"));

      let currentActiveCert = certsToRender && certsToRender.length > 0 ? certsToRender[0] : null;

      if (selectCert) {
        selectCert.addEventListener("change", (e) => {
          const idx = Number(e.target.value || 0);
          currentActiveCert = certsToRender[idx] || certsToRender[0];
          const metaName = document.getElementById("certMetaName");
          const metaInvoice = document.getElementById("certMetaInvoice");
          const metaClass = document.getElementById("certMetaClass");
          const metaDate = document.getElementById("certMetaDate");
          const previewCard = document.getElementById("certPreviewCardContainer");

          if (metaName) metaName.textContent = currentActiveCert.recipientName || member.nama;
          if (metaInvoice) metaInvoice.textContent = ui.buildCertFullInvoice(currentActiveCert.invoice, currentActiveCert.certificateDate);
          if (metaClass) metaClass.textContent = currentActiveCert.className || targetClassName || "Public Speaking";
          if (metaDate) metaDate.textContent = ui.formatCertDate(currentActiveCert.certificateDate);
          if (previewCard) previewCard.innerHTML = ui.buildCertificateSvg(currentActiveCert);
        });
      }

      if (btnDownloadSvg && currentActiveCert) {
        btnDownloadSvg.addEventListener("click", () => {
          ui.downloadSvgAsFile(currentActiveCert);
        });
      }

      if (btnDownloadPng && currentActiveCert) {
        btnDownloadPng.addEventListener("click", async () => {
          await ui.downloadSvgAsPng(currentActiveCert);
        });
      }
    } catch (err) {
      console.error("[member-attendance] Certificate load error:", err);
      ui.showAlert(alertContainer, "Gagal memuat sertifikat: " + err.message, "error");
    }
  }

  // Handle Certificate Click inside Completed Class Cards in Tab 2
  const btnCerts = document.querySelectorAll(".btnDownloadClassCert");
  btnCerts.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetClassName = btn.getAttribute("data-class-name") || "";
      switchDashboardTab("certificate");
      loadCertificateTab(targetClassName);
    });
  });

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      logoutMember();
    });
  }

  // Helper function to trigger Regular Attendance Form
  async function triggerRegularForm(preselectedClassId = null) {
    if (!formMount) return;
    formMount.classList.remove("hidden");

    let defaultClass = null;
    if (preselectedClassId) {
      defaultClass =
        memberClasses.find((c) => c.id === preselectedClassId) ||
        activeClasses.find((c) => c.id === preselectedClassId);
    }
    if (!defaultClass) {
      defaultClass =
        memberClasses.find((c) => c.status !== "Selesai") ||
        memberClasses[0] ||
        activeClasses.find(
          (c) => member.produk_dibeli && c.name.toLowerCase().includes(member.produk_dibeli.toLowerCase())
        ) ||
        (activeClasses.length > 0 ? activeClasses[0] : null);
    }

    const todayStr = ui.getTodayDateString();
    const existing = defaultClass
      ? await repo.checkExistingAttendanceToday(member.id, defaultClass.id, todayStr)
      : null;

    if (existing) {
      const banner = document.querySelector(".lms-welcome-banner");
      if (banner) {
        banner.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    ui.renderRegularAttendanceForm(
      formMount,
      member,
      activeClasses,
      defaultClass,
      existing,
      memberClasses
    );
    formMount.scrollIntoView({ behavior: "smooth", block: "nearest" });

    const btnClose = document.getElementById("btnCloseActiveForm");
    const btnCancel = document.getElementById("btnCancelRegular");
    const btnSubmit = document.getElementById("btnSubmitRegular");
    const selectClass = document.getElementById("selectRegularClass");

    if (selectClass && selectClass.tagName === "SELECT") {
      selectClass.addEventListener("change", async (e) => {
        const cId = e.target.value;
        const targetClass = memberClasses.find((c) => c.id === cId) || activeClasses.find((c) => c.id === cId) || defaultClass;
        const isExist = await repo.checkExistingAttendanceToday(member.id, cId, todayStr);
        ui.renderRegularAttendanceForm(formMount, member, activeClasses, targetClass, isExist, memberClasses);
        bindDashboardEvents(member, memberClasses, history);
      });
    }

    if (btnClose) btnClose.addEventListener("click", () => formMount.classList.add("hidden"));
    if (btnCancel) btnCancel.addEventListener("click", () => formMount.classList.add("hidden"));

    const btnSwitchRepeat = document.getElementById("btnSwitchToRepeatForm");
    if (btnSwitchRepeat) {
      btnSwitchRepeat.addEventListener("click", () => {
        formMount.classList.add("hidden");
        switchDashboardTab("repeat");
        triggerRepeatForm(defaultClass ? defaultClass.id : null);
      });
    }

    if (btnSubmit) {
      btnSubmit.addEventListener("click", async () => {
        const selectedCId = selectClass ? selectClass.value : defaultClass ? defaultClass.id : "class_general";
        const targetClass =
          memberClasses.find((c) => c.id === selectedCId) ||
          activeClasses.find((c) => c.id === selectedCId) ||
          defaultClass || {
            id: selectedCId,
            name: member.produk_dibeli || "Kelas Dialogika",
            productName: member.produk_dibeli || "Public Speaking",
            mentorName: "Coach Bani Firdaus",
            type: "Offline",
          };

        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<i class="bi bi-arrow-repeat animate-spin"></i> Menyimpan presensi...`;

        try {
          const todayStr = ui.getTodayDateString();
          const regularAttendedCount = history.filter(
            (h) => !h.is_repeat && (h.class_id === targetClass.id || h.class_name === targetClass.name)
          ).length;
          const nextSessionNo = regularAttendedCount + 1;
          const payload = {
            member_id: member.id || "mbr_" + Date.now(),
            member_name: member.nama || "Siswa Dialogika",
            member_phone: member.whatsapp || "",
            member_city: member.kota || "",
            class_id: targetClass.id,
            class_name: targetClass.name,
            product_name: targetClass.productName || member.produk_dibeli || "Public Speaking",
            mentor_name: targetClass.mentorName || "Coach Dialogika",
            is_repeat: false,
            repeat_count: 0,
            session_number: nextSessionNo,
            session_label: `Pertemuan ${nextSessionNo}`,
            attendance_label: `Kehadiran Reguler (Pertemuan ${nextSessionNo})`,
            attendance_date: todayStr,
            status: "Hadir",
            type: targetClass.type || "Offline",
            class_type: targetClass.type || "Offline",
          };

          await repo.saveAttendance(payload);

          formMount.classList.add("hidden");
          if (sectionDashboardMount) sectionDashboardMount.classList.add("hidden");
          if (sectionSuccessMount) {
            sectionSuccessMount.classList.remove("hidden");
            ui.renderSuccessScreen(sectionSuccessMount, payload, true);
            const btnBack = sectionSuccessMount.querySelector("#btnBackToHome");
            if (btnBack) {
              btnBack.addEventListener("click", () => {
                sectionSuccessMount.classList.add("hidden");
                showDashboardView(member);
              });
            }
          }
        } catch (err) {
          console.error("[member-attendance] Submit regular error:", err);
          ui.showAlert(alertContainer, "Gagal menyimpan presensi. Silakan coba lagi.", "error");
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = `<i class="bi bi-send-check-fill"></i> Konfirmasi Hadir Hari Ini`;
        }
      });
    }
  }

  // Helper function to load and render Repeat Attendance Form inside dedicated panelRepeat
  async function loadRepeatTab(preselectedClassId = null) {
    const repeatMount = document.getElementById("repeatTabFormMount");
    if (!repeatMount) return;

    if (!repeatMount.innerHTML.trim() || preselectedClassId) {
      repeatMount.innerHTML = `
        <div class="active-form-card card-border-repeat animate-fade-in p-6 text-center">
          <div class="spinner-border text-orange-500 mb-2" role="status" style="width:2rem;height:2rem;"></div>
          <p class="text-xs font-semibold text-slate-600 m-0">Menyiapkan Formulir Presensi Remedial...</p>
        </div>
      `;
    }

    let defaultClass = null;
    if (preselectedClassId) {
      defaultClass =
        memberClasses.find((c) => c.id === preselectedClassId) ||
        activeClasses.find((c) => c.id === preselectedClassId);
    }
    if (!defaultClass) {
      defaultClass =
        memberClasses.find((c) => c.status !== "Selesai") ||
        memberClasses[0] ||
        activeClasses.find(
          (c) => member.produk_dibeli && c.name.toLowerCase().includes(member.produk_dibeli.toLowerCase())
        ) ||
        (activeClasses.length > 0 ? activeClasses[0] : null);
    }

    const prodName = defaultClass?.name || defaultClass?.productName || member.produk_dibeli || "";
    const prodId = defaultClass?.productId || "";
    const memberLvl = member.level || member.raw?.member_level || "";
    let sessions = await repo.fetchProductCurriculum(prodName, prodId, memberLvl);

    ui.renderRepeatAttendanceForm(
      repeatMount,
      member,
      activeClasses,
      defaultClass,
      history,
      memberClasses,
      sessions
    );

    const btnClose = repeatMount.querySelector("#btnCloseActiveForm");
    const btnCancel = repeatMount.querySelector("#btnCancelRepeat");
    const btnSubmit = repeatMount.querySelector("#btnSubmitRepeat");
    const selectClass = repeatMount.querySelector("#selectRepeatClass");
    const selectSession = repeatMount.querySelector("#selectRepeatSession");
    const inputNotes = repeatMount.querySelector("#inputRepeatNotes");

    // Bind interactive session card click selection
    const sessionCards = repeatMount.querySelectorAll(".session-pick-card");
    sessionCards.forEach((card) => {
      const handleCardSelect = () => {
        const sNo = card.getAttribute("data-session-no");
        if (selectSession) selectSession.value = sNo;

        sessionCards.forEach((c) => {
          const isTarget = c === card;
          c.classList.toggle("selected", isTarget);
          const icon = c.querySelector(".session-radio-icon i");
          if (icon) {
            icon.className = isTarget ? "bi bi-check-circle-fill" : "bi bi-circle";
          }
        });
      };

      card.addEventListener("click", handleCardSelect);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardSelect();
        }
      });
    });

    if (selectClass && selectClass.tagName === "SELECT") {
      selectClass.addEventListener("change", async (e) => {
        const cId = e.target.value;
        loadRepeatTab(cId);
      });
    }

    // Cancel / Close in dedicated repeat panel returns to regular dashboard
    if (btnClose) btnClose.addEventListener("click", () => switchDashboardTab("presensi"));
    if (btnCancel) btnCancel.addEventListener("click", () => switchDashboardTab("presensi"));

    if (btnSubmit) {
      btnSubmit.addEventListener("click", async () => {
        const selectedCId = selectClass ? selectClass.value : defaultClass ? defaultClass.id : "repeat_class";
        const targetClass =
          memberClasses.find((c) => c.id === selectedCId) ||
          activeClasses.find((c) => c.id === selectedCId) ||
          defaultClass || {
            id: selectedCId,
            name: member.produk_dibeli || "Kelas Dialogika",
            productName: member.produk_dibeli || "Public Speaking",
            mentorName: "Belum Ditentukan",
            type: "Offline",
          };

        const meetingNo = selectSession ? Number(selectSession.value || 1) : 1;
        const sessionObj = sessions.find((s) => s.no === meetingNo) ||
          ui.STANDARD_SESSIONS.find((s) => s.no === meetingNo) || {
            title: `Pertemuan ${meetingNo}`,
          };
        const notes = inputNotes ? inputNotes.value.trim() : "";

        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<i class="bi bi-arrow-repeat animate-spin"></i> Menyimpan presensi remedial...`;

        try {
          const todayStr = ui.getTodayDateString();
          const prevRepeats = history.filter(
            (h) => h.is_repeat && (Number(h.session_number) === meetingNo || Number(h.meeting_no) === meetingNo)
          ).length;
          const repeatCount = prevRepeats + 1;
          const repeatLabel = repeatCount > 1 ? `Remedial ke-${repeatCount} (${sessionObj.title})` : `Remedial (${sessionObj.title})`;
          const payload = {
            member_id: member.id || "mbr_" + Date.now(),
            member_name: member.nama || "Siswa Dialogika",
            member_phone: member.whatsapp || "",
            member_city: member.kota || "",
            class_id: targetClass.id,
            class_name: targetClass.name,
            product_name: targetClass.productName || member.produk_dibeli || "Public Speaking",
            mentor_name: targetClass.mentorName || "Belum Ditentukan",
            is_repeat: true,
            repeat_count: repeatCount,
            meeting_no: meetingNo,
            session_number: meetingNo,
            session_label: sessionObj.title,
            attendance_label: repeatLabel,
            notes: notes,
            attendance_date: todayStr,
            status: "Hadir",
            type: targetClass.type || "Offline",
            class_type: targetClass.type || "Offline",
          };

          await repo.saveAttendance(payload);

          if (sectionDashboardMount) sectionDashboardMount.classList.add("hidden");
          if (sectionSuccessMount) {
            sectionSuccessMount.classList.remove("hidden");
            ui.renderSuccessScreen(sectionSuccessMount, payload, true);
            const btnBack = sectionSuccessMount.querySelector("#btnBackToHome");
            if (btnBack) {
              btnBack.addEventListener("click", () => {
                sectionSuccessMount.classList.add("hidden");
                showDashboardView(member);
              });
            }
          }
        } catch (err) {
          console.error("[member-attendance] Submit repeat error:", err);
          ui.showAlert(alertContainer, "Gagal menyimpan presensi remedial. Silakan coba lagi.", "error");
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = `<i class="bi bi-check2-circle"></i> Konfirmasi Hadir Remedial`;
        }
      });
    }
  }

  // Alias triggerRepeatForm to forward to loadRepeatTab
  function triggerRepeatForm(preselectedClassId = null) {
    switchDashboardTab("repeat");
    loadRepeatTab(preselectedClassId);
  }

  // Wire Banner buttons
  if (btnOpenRegular) btnOpenRegular.addEventListener("click", () => triggerRegularForm());
  if (btnOpenRepeat) btnOpenRepeat.addEventListener("click", () => switchDashboardTab("repeat"));

  // Wire Modern Program Cards buttons in Tab 1
  const cardPresensiButtons = document.querySelectorAll(".btn-card-presensi");
  cardPresensiButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled || btn.classList.contains("btn-attended-pill")) return;
      const classId = btn.getAttribute("data-class-id");
      switchDashboardTab("presensi");
      triggerRegularForm(classId);
    });
  });

  const cardRemedialButtons = document.querySelectorAll(".btn-card-remedial");
  cardRemedialButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      const classId = btn.getAttribute("data-class-id");
      switchDashboardTab("repeat");
      loadRepeatTab(classId);
    });
  });
}

function setPhoneCheckingState(isChecking) {
  if (btnCheckPhone) btnCheckPhone.disabled = isChecking;
  if (btnCheckPhoneText) btnCheckPhoneText.classList.toggle("hidden", isChecking);
  if (btnCheckPhoneSpinner) btnCheckPhoneSpinner.classList.toggle("hidden", !isChecking);
}

/**
 * Binds events inside the dynamic detected card
 */
function bindDetectedCardEvents() {
  const btnCancel = document.getElementById("btnCancelDetection");
  const btnSubmit = document.getElementById("btnSubmitAttendance");
  const selectClass = document.getElementById("selectAttendanceClass");

  if (btnCancel) {
    btnCancel.addEventListener("click", () => {
      sectionDetectedMount.classList.add("hidden");
      sectionInputPhone.classList.remove("hidden");
      ui.clearAlert(alertContainer);
    });
  }

  if (selectClass) {
    selectClass.addEventListener("change", async (e) => {
      const newClassId = e.target.value;
      const found = activeClasses.find((c) => c.id === newClassId);
      if (found) {
        selectedClass = found;
        const stats = await repo.getMemberAttendanceStats(currentMember.id, selectedClass.id);
        const todayStr = ui.getTodayDateString();
        existingAttendanceToday = await repo.checkExistingAttendanceToday(
          currentMember.id,
          selectedClass.id,
          todayStr
        );

        currentStatusInfo = ui.calculateAttendanceStatus(
          stats.classAttendanceCount,
          selectedClass.isRemedial,
          selectedClass.remedialLevel
        );

        const badgeEl = document.getElementById("badgeAttendanceStatus");
        if (badgeEl) {
          badgeEl.className = `dlg-status-badge ${currentStatusInfo.badgeClass}`;
          badgeEl.innerHTML = `<i class="bi ${currentStatusInfo.isRepeat ? "bi-arrow-repeat" : "bi-stars"}"></i> ${currentStatusInfo.label}`;
        }

        // Update Mentor, Type, and Meeting Progress preview
        const detailMentor = document.getElementById("detailMentorName");
        const detailType = document.getElementById("detailClassType");
        const detailProgress = document.getElementById("detailMeetingProgress");

        if (detailMentor) {
          detailMentor.textContent = selectedClass.mentorName || "Coach Bani Firdaus";
        }
        if (detailType) {
          const isOnline = String(selectedClass.type || "").toLowerCase().includes("online");
          detailType.className = `meta-badge ${isOnline ? "type-badge-online" : "type-badge-offline"}`;
          detailType.innerHTML = `<i class="bi ${isOnline ? "bi-camera-video-fill" : "bi-geo-alt-fill"}"></i> ${selectedClass.type || "Offline"}`;
        }
        if (detailProgress) {
          const sessNum = stats.classAttendanceCount + 1;
          const totalMeet = selectedClass.meetingTotal || 8;
          detailProgress.textContent = `Pertemuan ${sessNum} dari ${totalMeet} Sesi`;
        }

        if (btnSubmit) {
          btnSubmit.disabled = !!existingAttendanceToday;
          btnSubmit.innerHTML = `<i class="bi bi-check2-circle"></i> ${existingAttendanceToday ? "Sudah Presensi" : "Konfirmasi & Hadir"}`;
        }
      }
    });
  }

  const chkRepeat = document.getElementById("chkMarkRepeat");
  const repeatExtra = document.getElementById("repeatExtraOptions");

  if (chkRepeat) {
    chkRepeat.addEventListener("change", async (e) => {
      const isChecked = e.target.checked;
      if (repeatExtra) {
        repeatExtra.classList.toggle("hidden", !isChecked);
      }
      const stats = await repo.getMemberAttendanceStats(currentMember.id, selectedClass.id);
      if (isChecked) {
        const count = Math.max(1, stats.classAttendanceCount || 1);
        currentStatusInfo = {
          badgeClass: "badge-repeat",
          label: `Mengulang ke-${count} (Ditandai Mengulang)`,
          isRepeat: true,
          repeatCount: count,
        };
      } else {
        currentStatusInfo = ui.calculateAttendanceStatus(
          0,
          selectedClass.isRemedial,
          selectedClass.remedialLevel
        );
      }

      const badgeEl = document.getElementById("badgeAttendanceStatus");
      if (badgeEl) {
        badgeEl.className = `dlg-status-badge ${currentStatusInfo.badgeClass}`;
        badgeEl.innerHTML = `<i class="bi ${currentStatusInfo.isRepeat ? "bi-arrow-repeat" : "bi-stars"}"></i> ${currentStatusInfo.label}`;
      }
    });
  }

  if (btnSubmit) {
    btnSubmit.addEventListener("click", handleSubmitAttendance);
  }
}

/**
 * Submits Attendance Record to Firestore
 */
async function handleSubmitAttendance() {
  if (!currentMember || !selectedClass) return;

  const btnSubmit = document.getElementById("btnSubmitAttendance");
  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<i class="bi bi-arrow-repeat animate-spin"></i> Menyimpan presensi...`;
  }

  try {
    const todayStr = ui.getTodayDateString();
    const stats = await repo.getMemberAttendanceStats(currentMember.id, selectedClass.id);
    const sessionNumber = stats.classAttendanceCount + 1;
    const meetingTotal = selectedClass.meetingTotal || 8;

    const chkRepeat = document.getElementById("chkMarkRepeat");
    const selectRepeatSession = document.getElementById("selectRepeatSession");
    const selectRepeatReason = document.getElementById("selectRepeatReason");

    const isExplicitRepeat = chkRepeat ? chkRepeat.checked : currentStatusInfo.isRepeat;
    const finalSessionNumber =
      isExplicitRepeat && selectRepeatSession
        ? Number(selectRepeatSession.value)
        : sessionNumber;
    const repeatReason =
      isExplicitRepeat && selectRepeatReason ? selectRepeatReason.value : "";
    const finalRepeatCount = isExplicitRepeat
      ? Math.max(1, currentStatusInfo.repeatCount || 1)
      : 0;

    const payload = {
      member_id: currentMember.id,
      member_name: currentMember.nama,
      member_phone: currentMember.whatsapp,
      member_city: currentMember.kota || "",
      class_id: selectedClass.id || "general",
      class_name: selectedClass.name || currentMember.produk_dibeli || "Kelas Dialogika",
      product_name: selectedClass.productName || currentMember.produk_dibeli || "",
      class_type: selectedClass.type || "Offline",
      mentor_name: selectedClass.mentorName || "Coach Bani Firdaus",
      location: selectedClass.location || "",
      session_number: finalSessionNumber,
      meeting_total: meetingTotal,
      is_repeat: isExplicitRepeat,
      repeat_count: finalRepeatCount,
      repeat_reason: repeatReason,
      attendance_label: isExplicitRepeat
        ? `Mengulang ke-${finalRepeatCount}${repeatReason ? ` (${repeatReason})` : ""}`
        : currentStatusInfo.label,
      attendance_date: todayStr,
      status: "Hadir",
    };

    await repo.saveAttendance(payload);

    // Refresh both background data tabs
    loadRecapData();
    loadRepeatData();

    // Transition to Success Ticket Screen
    sectionDetectedMount.classList.add("hidden");
    sectionSuccessMount.classList.remove("hidden");

    ui.renderSuccessScreen(sectionSuccessMount, payload);

    const btnBack = document.getElementById("btnBackToHome");
    if (btnBack) {
      btnBack.addEventListener("click", resetToStart);
    }
  } catch (err) {
    console.error("[member-attendance] Submit error:", err);
    ui.showAlert(alertContainer, "Gagal mencatat presensi ke sistem. Silakan coba kembali.", "error");
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = `<i class="bi bi-check2-circle"></i> Konfirmasi & Hadir`;
    }
  }
}

/**
 * Resets view back to initial phone input
 */
function resetToStart() {
  currentMember = null;
  selectedClass = null;
  currentStatusInfo = null;
  existingAttendanceToday = null;

  if (inputPhoneNumber) inputPhoneNumber.value = "";
  ui.clearAlert(alertContainer);

  sectionSuccessMount.classList.add("hidden");
  sectionDetectedMount.classList.add("hidden");
  sectionInputPhone.classList.remove("hidden");
}

/**
 * Loads attendance recap records for specified or current date
 * @param {string} [targetDate]
 */
async function loadRecapData(targetDate) {
  if (!recapTableBody) return;
  const dateToFetch = targetDate || currentRecapDate || ui.getTodayDateString();
  currentRecapDate = dateToFetch;

  if (inputRecapDate && inputRecapDate.value !== dateToFetch) {
    inputRecapDate.value = dateToFetch;
  }

  const todayStr = ui.getTodayDateString();
  const isToday = dateToFetch === todayStr;

  if (recapTitle) {
    recapTitle.textContent = isToday
      ? "Daftar Kehadiran Member Hari Ini"
      : "Daftar Kehadiran Member";
  }

  if (recapDateSubtitle) {
    const formatted = ui.formatIndoDate(new Date(dateToFetch + "T00:00:00"));
    recapDateSubtitle.textContent = isToday ? `Hari ini • ${formatted}` : formatted;
  }

  recapTableBody.innerHTML = `
    <tr>
      <td colspan="9" class="text-center py-4 text-slate-400">
        <i class="bi bi-arrow-repeat animate-spin text-lg inline-block mr-2"></i> Memuat rekap presensi...
      </td>
    </tr>
  `;

  try {
    if (activeClasses.length === 0) {
      activeClasses = await repo.fetchActiveClasses();
    }
    const records = await repo.fetchDailyAttendances(dateToFetch);
    currentRecapRecords = records;
    ui.renderRecapTable(recapTableBody, records, activeClasses);
  } catch (err) {
    console.error("[member-attendance] loadRecapData error:", err);
    currentRecapRecords = [];
    recapTableBody.innerHTML = `
      <tr>
        <td colspan="9" class="text-center py-4 text-rose-500">
          Gagal memuat rekap presensi. Silakan tekan Segarkan Data.
        </td>
      </tr>
    `;
  }
}

/**
 * Loads repeat / remedial attendance records, optionally filtered by date
 * @param {string} [filterDate] YYYY-MM-DD
 */
async function loadRepeatData(filterDate = "") {
  if (!repeatTableBody) return;
  currentRepeatDate = filterDate || "";

  if (inputRepeatDate && inputRepeatDate.value !== currentRepeatDate) {
    inputRepeatDate.value = currentRepeatDate;
  }

  if (repeatDateSubtitle) {
    if (currentRepeatDate) {
      const formatted = ui.formatIndoDate(new Date(currentRepeatDate + "T00:00:00"));
      repeatDateSubtitle.textContent = `Filter Tanggal • ${formatted}`;
    } else {
      repeatDateSubtitle.textContent = "Menampilkan seluruh riwayat catatan siswa yang sedang mengulang materi atau sesi perbaikan kelas.";
    }
  }

  repeatTableBody.innerHTML = `
    <tr>
      <td colspan="9" class="text-center py-6 text-slate-400">
        <i class="bi bi-arrow-repeat animate-spin text-lg inline-block mr-2"></i> Memuat data siswa mengulang...
      </td>
    </tr>
  `;

  try {
    if (activeClasses.length === 0) {
      activeClasses = await repo.fetchActiveClasses();
    }
    const repeatRecords = await repo.fetchRepeatAttendances(currentRepeatDate);
    currentRepeatRecords = repeatRecords;
    if (repeatStatsMount) {
      ui.renderRepeatStats(repeatStatsMount, repeatRecords);
    }
    ui.renderRepeatTable(repeatTableBody, repeatRecords, activeClasses);
  } catch (err) {
    console.error("[member-attendance] loadRepeatData error:", err);
    currentRepeatRecords = [];
    repeatTableBody.innerHTML = `
      <tr>
        <td colspan="9" class="text-center py-4 text-rose-500">
          Gagal memuat data siswa mengulang. Silakan tekan Segarkan Data.
        </td>
      </tr>
    `;
  }
}

// Auto-run on script load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
