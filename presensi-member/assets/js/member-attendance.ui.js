// assets/js/member-attendance.ui.js
// =====================================================================
// MEMBER ATTENDANCE UI (Presentation Layer - Zero Firestore)
// Handles DOM manipulation, state rendering, badge formatting, and user feedback.
// =====================================================================

export function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function formatIndoTime(dateObj = new Date()) {
  const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
  if (isNaN(d.getTime())) return "-";
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes} WIB`;
}

export function formatIndoDate(dateObj = new Date()) {
  const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
  if (isNaN(d.getTime())) return "-";
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  return `${dayNames[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function getTodayDateString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Renders status message banner
 * @param {HTMLElement} container
 * @param {string} message
 * @param {'info'|'warning'|'error'|'success'} type
 */
export function showAlert(container, message, type = "info") {
  if (!container) return;
  const icons = {
    info: "bi-info-circle-fill",
    warning: "bi-exclamation-triangle-fill",
    error: "bi-x-circle-fill",
    success: "bi-check-circle-fill",
  };
  container.innerHTML = `
    <div class="dlg-alert dlg-alert-${type} animate-fade-in">
      <i class="bi ${icons[type] || icons.info}"></i>
      <div class="dlg-alert-content">${esc(message)}</div>
    </div>
  `;
  container.classList.remove("hidden");
}

export function clearAlert(container) {
  if (!container) return;
  container.innerHTML = "";
  container.classList.add("hidden");
}

/**
 * Computes repeat / remedial status badge
 * @param {number} attendanceCount
 * @param {boolean} isRemedialClass
 * @param {number} remedialLevel
 * @returns {{ badgeClass: string, label: string, isRepeat: boolean, repeatCount: number }}
 */
export function calculateAttendanceStatus(attendanceCount, isRemedialClass, remedialLevel = 0) {
  if (attendanceCount > 0) {
    return {
      badgeClass: "badge-repeat",
      label: `Mengulang ke-${attendanceCount} (${attendanceCount + 1}x Hadir)`,
      isRepeat: true,
      repeatCount: attendanceCount,
    };
  }

  if (isRemedialClass) {
    const levelStr = remedialLevel > 0 ? ` (Lvl ${remedialLevel})` : "";
    return {
      badgeClass: "badge-remedial",
      label: `Kelas Remedial${levelStr}`,
      isRepeat: true,
      repeatCount: 1,
    };
  }

  return {
    badgeClass: "badge-regular",
    label: "Kehadiran Reguler (Pertemuan Pertama)",
    isRepeat: false,
    repeatCount: 0,
  };
}

/**
 * Renders member detection verification card
 * @param {HTMLElement} mountEl
 * @param {Object} member
 * @param {Array<Object>} classes
 * @param {Object} statusInfo
 * @param {Object|null} existingAttendanceToday
 */
/**
 * Renders member detection verification card
 * @param {HTMLElement} mountEl
 * @param {Object} member
 * @param {Array<Object>} classes
 * @param {Object} statusInfo
 * @param {Object|null} existingAttendanceToday
 * @param {Object} selectedClass
 * @param {number} sessionNumber
 */
export function renderMemberCard(
  mountEl,
  member,
  classes,
  statusInfo,
  existingAttendanceToday,
  selectedClass,
  sessionNumber = 1
) {
  if (!mountEl) return;

  const initials = member.nama
    ? member.nama
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase()
    : "MB";

  let classOptionsHtml = "";
  if (classes.length > 0) {
    classOptionsHtml = classes
      .map((c, idx) => {
        const isMatch =
          member.produk_dibeli &&
          c.name.toLowerCase().includes(member.produk_dibeli.toLowerCase());
        const selectedAttr =
          selectedClass && selectedClass.id === c.id
            ? "selected"
            : !selectedClass && (isMatch || idx === 0)
            ? "selected"
            : "";
        const tag = c.isRemedial ? "[Remedial] " : "";
        return `<option value="${esc(c.id)}" ${selectedAttr}>${tag}${esc(c.name)}</option>`;
      })
      .join("");
  } else {
    classOptionsHtml = `<option value="manual_class">${esc(member.produk_dibeli || "Kelas Umum Dialogika")}</option>`;
  }

  const currentClass = selectedClass || (classes.length > 0 ? classes[0] : null);
  const classType = currentClass ? currentClass.type || "Offline" : "Offline";
  const isOnline = classType.toLowerCase().includes("online");
  const mentorName = currentClass ? currentClass.mentorName || "Coach Bani Firdaus" : "Coach Bani Firdaus";
  const meetingTotal = currentClass ? currentClass.meetingTotal || 8 : 8;

  const alreadyAttendedBanner = existingAttendanceToday
    ? `
      <div class="dlg-already-attended-notice">
        <i class="bi bi-shield-check"></i>
        <div>
          <strong>Sudah Presensi Hari Ini</strong>
          <p>Anda telah tercatat hadir pada pukul ${formatIndoTime(existingAttendanceToday.client_timestamp || new Date())}.</p>
        </div>
      </div>
    `
    : "";

  mountEl.innerHTML = `
    <div class="detected-card animate-fade-in">
      <div class="detected-card-header">
        <div class="member-avatar">${esc(initials)}</div>
        <div class="member-info">
          <div class="member-name-row">
            <h3 class="member-name">${esc(member.nama)}</h3>
            <span class="badge-verified"><i class="bi bi-patch-check-fill"></i> Terdaftar</span>
          </div>
          <p class="member-meta">
            <span><i class="bi bi-whatsapp"></i> +${esc(member.whatsapp)}</span>
            ${member.kota ? `<span>• <i class="bi bi-geo-alt"></i> ${esc(member.kota)}</span>` : ""}
          </p>
        </div>
      </div>

      <div class="detected-body">
        <div class="form-group mb-3">
          <label class="dlg-field-label">
            <i class="bi bi-mortarboard-fill"></i> Program / Kelas yang Dihadiri
          </label>
          <select id="selectAttendanceClass" class="dlg-select">
            ${classOptionsHtml}
          </select>
        </div>

        <!-- Detail Kelas: Mentor, Tipe (Offline/Online), & Sesi Pertemuan -->
        <div class="class-meta-grid">
          <div class="meta-item">
            <span class="meta-label"><i class="bi bi-person-video3"></i> Mentor Pengampu</span>
            <span id="detailMentorName" class="meta-value font-semibold text-slate-800">${esc(mentorName)}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label"><i class="bi bi-broadcast-pin"></i> Tipe Kelas</span>
            <span id="detailClassType" class="meta-badge ${isOnline ? "type-badge-online" : "type-badge-offline"}">
              <i class="bi ${isOnline ? "bi-camera-video-fill" : "bi-geo-alt-fill"}"></i> ${esc(classType)}
            </span>
          </div>
          <div class="meta-item">
            <span class="meta-label"><i class="bi bi-calendar-check"></i> Pertemuan Ke</span>
            <span id="detailMeetingProgress" class="meta-badge session-badge-pill">
              Pertemuan ${sessionNumber} dari ${meetingTotal} Sesi
            </span>
          </div>
        </div>

        <div class="attendance-status-preview mt-3">
          <div class="status-preview-label">Status Partisipasi Materi:</div>
          <div class="status-badge-container">
            <span id="badgeAttendanceStatus" class="dlg-status-badge ${statusInfo.badgeClass}">
              <i class="bi ${statusInfo.isRepeat ? "bi-arrow-repeat" : "bi-stars"}"></i>
              ${statusInfo.label}
            </span>
          </div>
        </div>

        <!-- Mode Kehadiran: Opsi Mengulang / Remedial -->
        <div class="repeat-check-box mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <label class="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" id="chkMarkRepeat" class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" ${statusInfo.isRepeat ? "checked" : ""} />
            <div>
              <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <i class="bi bi-arrow-repeat text-amber-500 text-sm"></i> Tandai Sebagai Mengulang / Remedial
              </span>
              <p class="text-[11px] text-slate-500 m-0">Centang untuk mencatat kehadiran ini sebagai sesi mengulang materi.</p>
            </div>
          </label>

          <div id="repeatExtraOptions" class="mt-2.5 pt-2.5 border-t border-slate-200 grid grid-cols-2 gap-2 ${statusInfo.isRepeat ? "" : "hidden"}">
            <div>
              <label class="text-[11px] font-semibold text-slate-600 block mb-1">Sesi yang Diulang:</label>
              <select id="selectRepeatSession" class="dlg-select py-1.5 text-xs">
                ${Array.from({ length: meetingTotal }, (_, i) => `<option value="${i + 1}" ${i + 1 === sessionNumber ? "selected" : ""}>Pertemuan ${i + 1}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="text-[11px] font-semibold text-slate-600 block mb-1">Alasan Mengulang:</label>
              <select id="selectRepeatReason" class="dlg-select py-1.5 text-xs">
                <option value="Remedial Materi">Remedial Materi</option>
                <option value="Ganti Sesi Izin">Ganti Sesi Izin</option>
                <option value="Review Tambahan">Review Tambahan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>
        </div>

        ${alreadyAttendedBanner}

        <div class="action-btn-group mt-4">
          <button type="button" id="btnCancelDetection" class="dlg-btn-secondary">
            <i class="bi bi-arrow-left"></i> Ganti Nomor
          </button>
          <button type="button" id="btnSubmitAttendance" class="dlg-btn-primary" ${existingAttendanceToday ? "disabled" : ""}>
            <i class="bi bi-check2-circle"></i> ${existingAttendanceToday ? "Sudah Presensi" : "Konfirmasi & Hadir"}
          </button>
        </div>
      </div>
    </div>
  `;
}

export const STANDARD_SESSIONS = [
  { no: 1, title: "Pertemuan 1 - Basic Foundation & Mindset Bicara" },
  { no: 2, title: "Pertemuan 2 - Systematic Structuring & Pola Pikir" },
  { no: 3, title: "Pertemuan 3 - Vocal Dynamics, Artikulasi & Intonasi" },
  { no: 4, title: "Pertemuan 4 - Non-Verbal & Body Language Mastery" },
  { no: 5, title: "Pertemuan 5 - Storytelling & Hook Techniques" },
  { no: 6, title: "Pertemuan 6 - Impromptu Speaking & QnA Spontan" },
  { no: 7, title: "Pertemuan 7 - Persuasive Speaking & Pitching" },
  { no: 8, title: "Pertemuan 8 - Final Performance & Graduation Speech" },
];

/**
 * Renders personal attendance history cards
 * @param {Array<Object>} records
 * @returns {string} HTML string
 */
export function renderHistoryListHtml(records = [], classes = []) {
  if (!records || records.length === 0) {
    return `
      <div class="empty-history-compact">
        <div class="empty-icon-ring">
          <i class="bi bi-calendar2-check"></i>
        </div>
        <div class="empty-history-content">
          <h5 class="empty-history-title">Belum Ada Catatan Kehadiran</h5>
          <p class="empty-history-desc">
            Riwayat kelas reguler dan sesi remedial Anda akan otomatis tercatat rapi di sini setelah mengikuti sesi pertemuan.
          </p>
        </div>
      </div>
    `;
  }

  return `
    <div class="history-cards-list">
      ${records
        .map((r, idx) => {
          const isRepeat =
            r.is_repeat === true ||
            String(r.attendance_label || "").toLowerCase().includes("mengulang") ||
            Number(r.repeat_count || 0) > 0;
          const dateStr = formatIndoDate(r.client_timestamp || r.attendance_date || new Date());
          const timeStr = formatIndoTime(r.client_timestamp || new Date());
          const sessionLabel =
            r.session_label ||
            (r.meeting_no ? `Pertemuan ${r.meeting_no}` : r.session_number ? `Pertemuan ${r.session_number}` : "Sesi Kelas");

          const matchedClass = Array.isArray(classes)
            ? classes.find((c) => (c.id && c.id === r.class_id) || (c.name && c.name === r.class_name))
            : null;
          const rawCoach =
            r.mentor_name ||
            matchedClass?.mentorName ||
            (Array.isArray(classes) && classes.length > 0 && classes[0].mentorName && classes[0].mentorName !== "-"
              ? classes[0].mentorName
              : "Dialogika");
          const cleanCoachName = String(rawCoach).replace(/^coach\s*[:\-]?\s*/i, "").trim();

          const isOverLimit = idx >= 5;
          const hiddenClass = isOverLimit ? "history-item-hidden" : "";

          return `
          <div class="history-item-card ${isRepeat ? "item-repeat" : "item-regular"} ${hiddenClass}" data-record-index="${idx}">
            <div class="history-card-header-row">
              <div class="flex items-center gap-2.5 min-w-0 flex-1">
                <div class="history-icon ${isRepeat ? "icon-repeat" : "icon-regular"}">
                  <i class="bi ${isRepeat ? "bi-arrow-repeat" : "bi-check2-circle"}"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <h5 class="history-session-title">${esc(sessionLabel)}</h5>
                  <p class="history-session-subtitle truncate">${esc(r.class_name || "Kelas Dialogika")} &bull; Coach ${esc(cleanCoachName)}</p>
                </div>
              </div>
              <span class="dlg-status-badge ${isRepeat ? "badge-repeat" : "badge-regular"} shrink-0">
                ${isRepeat ? `<i class="bi bi-arrow-repeat"></i> Mengulang` : `<i class="bi bi-check-circle-fill"></i> Reguler`}
              </span>
            </div>
            <div class="history-card-meta-row">
              <span class="history-meta-chip"><i class="bi bi-calendar3 text-slate-400"></i> ${esc(dateStr)} &bull; ${esc(timeStr)}</span>
              <span class="history-meta-chip"><i class="bi bi-patch-check-fill text-emerald-500"></i> Terverifikasi</span>
            </div>
            ${r.notes ? `<p class="history-notes"><i class="bi bi-chat-left-text"></i> ${esc(r.notes)}</p>` : ""}
          </div>
        `;
        })
        .join("")}
      ${
        records.length > 5
          ? `
        <div class="history-expand-wrapper mt-2.5 text-center">
          <button type="button" class="btn-history-expand" id="btnToggleAllHistory" data-expanded="false" onclick="(function(btn){
            const list = btn.closest('.history-cards-list') || document.querySelector('.history-cards-list');
            if (!list) return;
            const hiddenItems = list.querySelectorAll('.history-item-hidden');
            const isExp = btn.getAttribute('data-expanded') === 'true';
            if (isExp) {
              hiddenItems.forEach(el => el.style.display = 'none');
              btn.setAttribute('data-expanded', 'false');
              btn.innerHTML = '<span>Tampilkan Seluruh Riwayat (${records.length} Sesi)</span> <i class=\\'bi bi-chevron-down\\'></i>';
            } else {
              hiddenItems.forEach(el => el.style.display = 'flex');
              btn.setAttribute('data-expanded', 'true');
              btn.innerHTML = '<span>Ciutkan Riwayat</span> <i class=\\'bi bi-chevron-up\\'></i>';
            }
          })(this)">
            <span>Tampilkan Seluruh Riwayat (${records.length} Sesi)</span>
            <i class="bi bi-chevron-down"></i>
          </button>
        </div>
        `
          : ""
      }
    </div>
  `;
}

/**
 * Masks phone number to standard format e.g. +62817••••0048
 * @param {string|number} phone
 * @returns {string}
 */
export function maskPhoneNumber(phone) {
  if (!phone) return "-";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length < 8) return "+" + digits;
  const prefix = digits.slice(0, 5);
  const suffix = digits.slice(-4);
  return `+${prefix}••••${suffix}`;
}

/**
 * Formats join date to "Bulan Tahun" (e.g. "Oktober 2026")
 * @param {any} val
 * @returns {string}
 */
export function formatJoinDate(val) {
  if (!val) return "-";
  let d;
  if (val && typeof val.toDate === "function") {
    d = val.toDate();
  } else if (val && typeof val.seconds === "number") {
    d = new Date(val.seconds * 1000);
  } else {
    d = new Date(val);
  }
  if (!d || isNaN(d.getTime())) {
    return typeof val === "string" ? val : "-";
  }
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Resolves member status badge: Member / Alumni / Member Level 2
 * @param {Object} member
 * @param {boolean} [isAlumni=false]
 * @returns {{ label: string, class: string, icon: string, isAlumni: boolean }}
 */
export function getMemberStatusBadge(member, isAlumni = false) {
  const raw = member?.raw || {};
  const status = String(member?.status || raw.status || raw.membership_status || raw.status_member || "").toLowerCase();
  const level = String(member?.level || raw.level || raw.member_level || "").toLowerCase();

  if (isAlumni || status.includes("alumni") || status === "graduated" || status === "lulus") {
    return {
      label: "Alumni Dialogika",
      class: "badge-alumni-gold",
      icon: "bi-mortarboard-fill",
      isAlumni: true,
    };
  }

  if (level.includes("level 2") || level === "2" || status.includes("level 2")) {
    return {
      label: "Member Level 2",
      class: "chip-level2",
      icon: "bi-star-fill",
      isAlumni: false,
    };
  }

  if (level.includes("level 3") || level === "3" || status.includes("level 3")) {
    return {
      label: "Member Level 3",
      class: "chip-level2",
      icon: "bi-trophy-fill",
      isAlumni: false,
    };
  }

  return {
    label: "Member",
    class: "chip-active",
    icon: "bi-person-check-fill",
    isAlumni: false,
  };
}

/**
 * Renders multiple profiles selection view (Satu nomor, banyak member)
 * @param {HTMLElement} mountEl
 * @param {Array<Object>} members
 * @param {string} phone
 */
export function renderSelectProfileScreen(mountEl, members = [], phone = "") {
  if (!mountEl) return;

  const maskedPhone = maskPhoneNumber(phone);

  mountEl.innerHTML = `
    <div class="dlg-modern-card-inner max-w-xl mx-auto animate-fade-in">
      <div class="dlg-modern-card-header text-center mb-5">
        <div class="dlg-modern-brand-avatar">
          <i class="bi bi-people-fill text-2xl text-blue-600"></i>
        </div>
        <h2 class="dlg-modern-card-title text-xl font-extrabold text-slate-800">
          Pilih <span class="dlg-title-gradient">Profil Member</span>
        </h2>
        <p class="dlg-modern-card-subtitle text-xs text-slate-500 mt-1">
          Nomor WhatsApp <strong>${esc(maskedPhone)}</strong> terdaftar pada <strong>${members.length} profil</strong>. Silakan pilih akun untuk melanjutkan:
        </p>
      </div>

      <div class="select-profile-list mb-5">
        ${members
          .map((m, idx) => {
            const initials = m.nama
              ? m.nama
                  .split(" ")
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join("")
                  .toUpperCase()
              : "MB";
            const badge = getMemberStatusBadge(m);
            return `
              <div class="profile-choice-card" data-member-index="${idx}">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm flex-shrink-0 border border-blue-100">
                    ${esc(initials)}
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h4 class="font-bold text-slate-800 text-sm m-0 truncate">${esc(m.nama)}</h4>
                      <span class="status-chip ${badge.class} text-[10px] py-0 px-2">
                        <i class="bi ${badge.icon}"></i> ${badge.label}
                      </span>
                    </div>
                    <div class="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                      ${m.produk_dibeli ? `<span><i class="bi bi-mortarboard text-slate-400"></i> ${esc(m.produk_dibeli)}</span>` : ""}
                      ${m.kota ? `<span>• <i class="bi bi-geo-alt text-slate-400"></i> ${esc(m.kota)}</span>` : ""}
                    </div>
                  </div>
                </div>
                <button type="button" class="btn btn-sm btn-primary rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold flex-shrink-0">
                  <span>Pilih</span>
                  <i class="bi bi-arrow-right"></i>
                </button>
              </div>
            `;
          })
          .join("")}
      </div>

      <div class="text-center pt-2 border-t border-slate-100">
        <button type="button" id="btnBackToPhoneInput" class="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1.5 transition-colors">
          <i class="bi bi-arrow-left"></i> Gunakan Nomor Lain
        </button>
      </div>
    </div>
  `;
}

/**
 * Renders Class Cards inside Riwayat Kelas Section
 * @param {Array<Object>} classes
 * @returns {string}
 */
export function renderClassCardsHtml(classes = []) {
  if (!classes || !classes.length) {
    return `
      <div class="col-span-full py-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
        <i class="bi bi-journal-x text-3xl text-slate-300 mb-2 block"></i>
        <h5 class="text-xs font-bold text-slate-600 m-0">Belum Ada Riwayat Kelas</h5>
        <p class="text-[11px] text-slate-400 mt-1 m-0">Data kelas yang Anda ikuti akan tercatat otomatis di sini.</p>
      </div>
    `;
  }

  return classes
    .map((c) => {
      const isCompleted = c.status === "Selesai";
      return `
        <div class="member-class-card">
          <div class="class-card-top">
            <h4 class="class-card-name">${esc(c.name || "Kelas Dialogika")}</h4>
            <span class="badge-class-status ${isCompleted ? "status-completed" : "status-running"}">
              ${
                isCompleted
                  ? '<i class="bi bi-check-circle-fill"></i> Selesai'
                  : '<span class="status-dot-pulse"></span> Berjalan'
              }
            </span>
          </div>

          <div class="class-meta-list">
            <div class="class-meta-item">
              <i class="bi bi-person-badge"></i>
              <span class="class-meta-label">Mentor:</span>
              <span class="class-meta-val">${esc(c.mentorName || "-")}</span>
            </div>
            <div class="class-meta-item">
              <i class="bi bi-calendar-range"></i>
              <span class="class-meta-label">Periode:</span>
              <span class="class-meta-val">${esc(c.period || "-")}</span>
            </div>
          </div>

          <div class="class-card-footer">
            ${
              isCompleted
                ? `
              <button type="button" class="btn-cert-active btnDownloadClassCert" data-class-name="${esc(c.name)}" data-class-id="${esc(c.id)}">
                <i class="bi bi-award-fill"></i> Cetak Sertifikat
              </button>
            `
                : `
              <button type="button" class="btn-cert-disabled" disabled title="Kelas masih berjalan, sertifikat belum tersedia">
                <i class="bi bi-lock-fill"></i> Belum Selesai
              </button>
            `
            }
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * Generates an isometric 3D stage and book stack SVG illustration for the welcome banner.
 * @returns {string} SVG string
 */
export function buildBannerIllustrationSvg() {
  return `
    <svg viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg" class="lms-banner-svg" aria-hidden="true">
      <defs>
        <linearGradient id="book1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1D4ED8"/>
          <stop offset="100%" stop-color="#0B2B6A"/>
        </linearGradient>
        <linearGradient id="book2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE047"/>
          <stop offset="100%" stop-color="#F59E0B"/>
        </linearGradient>
        <linearGradient id="book3Grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38BDF8"/>
          <stop offset="100%" stop-color="#0284C7"/>
        </linearGradient>
        <filter id="svgSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0B2B6A" flood-opacity="0.16"/>
        </filter>
      </defs>

      <!-- Isometric Base Platform / Stage Shadow -->
      <ellipse cx="120" cy="155" rx="88" ry="20" fill="#0B2B6A" fill-opacity="0.08" />

      <!-- Bottom Book (Navy) -->
      <g filter="url(#svgSoftShadow)">
        <path d="M40 120 L120 148 L200 120 L120 92 Z" fill="url(#book1Grad)"/>
        <path d="M40 120 L120 148 L120 162 L40 134 Z" fill="#071C44"/>
        <path d="M120 148 L200 120 L200 134 L120 162 Z" fill="#0B2B6A"/>
        <path d="M44 122 L118 147 L118 152 L44 127 Z" fill="#F8FAFC"/>
        <path d="M122 147 L196 122 L196 127 L122 152 Z" fill="#E2E8F0"/>
      </g>

      <!-- Middle Book (Gold / Amber) -->
      <g transform="translate(10, -22)">
        <path d="M45 110 L115 135 L185 110 L115 85 Z" fill="url(#book2Grad)"/>
        <path d="M45 110 L115 135 L115 147 L45 122 Z" fill="#D97706"/>
        <path d="M115 135 L185 110 L185 122 L115 147 Z" fill="#F59E0B"/>
        <path d="M49 112 L113 134 L113 139 L49 117 Z" fill="#FEFCE8"/>
        <path d="M117 134 L181 112 L181 117 L117 139 Z" fill="#FEF08A"/>
      </g>

      <!-- Top Book / Clipboard (Sky Blue with Checklist) -->
      <g transform="translate(18, -42)">
        <path d="M50 102 L110 124 L170 102 L110 80 Z" fill="url(#book3Grad)"/>
        <path d="M50 102 L110 124 L110 134 L50 112 Z" fill="#0369A1"/>
        <path d="M110 124 L170 102 L170 112 L110 134 Z" fill="#0284C7"/>
        <path d="M68 96 L110 112 L152 96 L110 80 Z" fill="#FFFFFF"/>
        <circle cx="85" cy="94" r="3" fill="#10B981"/>
        <line x1="93" y1="94" x2="135" y2="94" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="95" cy="100" r="3" fill="#10B981"/>
        <line x1="103" y1="100" x2="138" y2="100" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="105" cy="106" r="3" fill="#3B82F6"/>
        <line x1="113" y1="106" x2="135" y2="106" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
      </g>

      <!-- Decorative Floating Sparkles / Stars -->
      <polygon points="195,50 198,58 206,61 198,64 195,72 192,64 184,61 192,58" fill="#FBBF24"/>
      <polygon points="52,65 54,70 59,72 54,74 52,79 50,74 45,72 50,70" fill="#38BDF8"/>
      <circle cx="210" cy="85" r="3" fill="#F43F5E"/>
    </svg>
  `;
}

/**
 * Generates interactive mini calendar matching the right sidebar in the reference.
 * @param {Date} currentDate
 * @param {Array<Object>} history
 * @returns {string}
 */
export function renderMiniCalendarHtml(currentDate = new Date(), history = []) {
  const d = currentDate instanceof Date ? currentDate : new Date(currentDate);
  const year = d.getFullYear();
  const month = d.getMonth();

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  const attendedDays = new Set();
  history.forEach((h) => {
    const raw = h.attendance_date || h.client_timestamp;
    if (!raw) return;
    const hDate = new Date(raw);
    if (!isNaN(hDate.getTime()) && hDate.getFullYear() === year && hDate.getMonth() === month) {
      attendedDays.add(hDate.getDate());
    }
  });

  const dayHeaders = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  let daysHtml = "";

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const prevDay = prevMonthTotalDays - i;
    daysHtml += `<div class="cal-day other-month"><span>${prevDay}</span></div>`;
  }

  for (let day = 1; day <= totalDays; day++) {
    const isToday = isCurrentMonth && day === todayDate;
    const hasAttended = attendedDays.has(day);
    let classes = "cal-day";
    if (isToday) classes += " today";
    if (hasAttended) classes += " attended";

    daysHtml += `
      <div class="${classes}" title="${isToday ? "Hari Ini" : hasAttended ? "Sesi Dihadiri" : `Tanggal ${day}`}">
        <span>${day}</span>
        ${hasAttended ? '<span class="cal-dot"></span>' : ""}
      </div>
    `;
  }

  return `
    <div class="lms-mini-calendar">
      <div class="calendar-header">
        <span class="calendar-month-title">${monthNames[month]} ${year}</span>
        <div class="calendar-nav-arrows flex items-center gap-1">
          <button type="button" class="calendar-nav-btn" title="Bulan Sebelumnya"><i class="bi bi-chevron-left"></i></button>
          <button type="button" class="calendar-nav-btn" title="Bulan Berikutnya"><i class="bi bi-chevron-right"></i></button>
        </div>
      </div>
      <div class="calendar-weekdays-grid">
        ${dayHeaders.map((dh) => `<span class="cal-weekday">${dh}</span>`).join("")}
      </div>
      <div class="calendar-days-grid">
        ${daysHtml}
      </div>
    </div>
  `;
}

/**
 * Generates modern horizontal gradient cards for enrolled classes matching reference "Classes" section.
 * @param {Array<Object>} classes
 * @returns {string}
 */
export function renderModernProgramCardsHtml(classes = [], history = []) {
  if (!classes || !classes.length) {
    return `
      <div class="lms-empty-card">
        <i class="bi bi-journal-x"></i>
        <h5>Belum Ada Program Terdaftar</h5>
        <p>Kelas yang Anda ikuti akan muncul secara visual di sini.</p>
      </div>
    `;
  }

  return classes
    .map((c) => {
      const isCompleted = c.status === "Selesai";
      const totalSesi = Number(c.sessionsTotal || c.meetingTotal || 10);
      const isOnline = String(c.type || "").toLowerCase().includes("online");
      const todayYmd = getTodayDateString();
      const startDateYmd = typeof c.startDate === "string" && c.startDate.length >= 10 ? c.startDate.slice(0, 10) : "";
      const isUpcoming = !isCompleted && Boolean(startDateYmd) && startDateYmd > todayYmd;

      // Calculate attended sessions count
      const attendedCount = Array.isArray(history)
        ? history.filter(
            (h) => !h.is_repeat && (h.class_id === c.id || h.class_name === c.name)
          ).length
        : 0;
      const pct = Math.min(100, Math.round((attendedCount / totalSesi) * 100));

      const isAttendedToday = Array.isArray(history)
        ? history.some((h) => {
            const raw = h.attendance_date || h.client_timestamp;
            const ymd = typeof raw === "string" && raw.length >= 10 ? raw.slice(0, 10) : "";
            return ymd === todayYmd && (h.class_id === c.id || h.class_name === c.name);
          })
        : false;

      const rawMentor = String(c.mentorName || "").trim();
      const isUnassignedMentor =
        !rawMentor ||
        rawMentor === "-" ||
        rawMentor.toLowerCase().includes("dialogika") ||
        rawMentor.toLowerCase().includes("unknown") ||
        rawMentor.toLowerCase().includes("belum ditentukan");

      const cleanMentor = isUnassignedMentor
        ? "Belum Ditentukan"
        : rawMentor.replace(/^coach\s*[:\-]?\s*/i, "").trim();

      return `
        <div class="lms-clean-class-card">
          <!-- Top Row: Badges & Period -->
          <div class="clean-card-top-bar">
            <div class="clean-badges-group">
              <span class="clean-badge-type ${isOnline ? "badge-online" : "badge-offline"}">
                <i class="bi ${isOnline ? "bi-camera-video-fill" : "bi-geo-alt-fill"}"></i>
                <span>${esc(c.type || "Offline")}</span>
              </span>
              <span class="clean-badge-status ${isCompleted ? "badge-completed" : isUpcoming ? "badge-upcoming" : "badge-running"}">
                <span class="status-pulse-dot ${isCompleted ? "bg-slate-400" : isUpcoming ? "bg-blue-500" : ""}"></span>
                <span>${isCompleted ? "Selesai" : isUpcoming ? "Segera Dimulai" : "Sedang Berlangsung"}</span>
              </span>
            </div>
            <span class="clean-badge-period">
              <i class="bi bi-calendar3"></i> ${esc(c.period || "Batch 2026")}
            </span>
          </div>

          <!-- Main Content: Info & Progress -->
          <div class="clean-card-content-row">
            <!-- Left: Title & Coach -->
            <div class="clean-card-info-col">
              <h3 class="clean-class-title">${esc(c.name || "Kelas Dialogika")}</h3>
              <p class="clean-coach-desc">
                <i class="bi bi-person-badge-fill ${isUnassignedMentor ? "text-slate-400" : "text-blue-600"}"></i> Coach Pengampu: <strong class="${isUnassignedMentor ? "text-slate-600 font-semibold" : ""}">${esc(cleanMentor)}</strong>
              </p>
            </div>

            <!-- Right: Progress Meter -->
            <div class="clean-card-progress-col">
              <div class="clean-progress-meta">
                <span class="clean-sessions-text"><strong>${attendedCount}</strong> / ${totalSesi} Pertemuan</span>
                <span class="clean-pct-text">${pct}% Selesai</span>
              </div>
              <div class="clean-progress-track">
                <div class="clean-progress-fill" style="width: ${Math.max(5, pct)}%"></div>
              </div>
            </div>
          </div>

          <!-- Bottom: Action Buttons (Running vs Completed Class) -->
          ${
            isCompleted
              ? `
          <div class="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-amber-50/80 p-3.5 rounded-xl border border-amber-200/80">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                <i class="bi bi-stars"></i>
              </div>
              <div class="min-w-0">
                <div class="text-xs font-black text-amber-950 flex items-center gap-1.5 flex-wrap">
                  <span>Lanjutkan Belajarmu ke Level 2! 🚀</span>
                  <span class="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">Diskon Alumni</span>
                </div>
                <p class="text-[11px] text-amber-900/80 mt-0.5 leading-snug m-0">Kuasai Senior Executive Briefings, Data Storytelling, dan Advanced Q&amp;A.</p>
              </div>
            </div>
            <a href="https://wa.me/6285162992597?text=${encodeURIComponent(`Halo Admin Dialogika, saya ${c.name ? `alumni kelas ${c.name}` : "alumni"}. Saya tertarik untuk konsultasi dan upgrade ke Program Level 2.`)}" target="_blank" rel="noopener noreferrer" class="shrink-0 inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-black text-xs shadow-xs transition-all no-underline w-full sm:w-auto">
              <i class="bi bi-whatsapp"></i>
              <span>Konsultasi Level 2</span>
              <i class="bi bi-arrow-right"></i>
            </a>
          </div>
              `
              : `
          <div class="clean-card-actions-row">
            ${
              isAttendedToday
                ? `
              <button type="button" class="btn-clean-presensi btn-card-presensi btn-attended-pill" disabled title="Kehadiran hari ini sudah tercatat">
                <i class="bi bi-check-circle-fill"></i>
                <span>Presensi Hari Ini Terverifikasi</span>
              </button>
              <button type="button" class="btn-clean-remedial btn-card-remedial" data-class-id="${esc(c.id)}" title="Ajukan sesi remedial materi">
                <i class="bi bi-arrow-repeat"></i>
                <span>Ajukan Remedial</span>
              </button>
            `
                : isUpcoming
                ? `
              <button type="button" class="btn-clean-presensi btn-upcoming-pill" disabled title="Kelas baru dimulai pada ${esc(c.period || c.startDate)}">
                <i class="bi bi-calendar-event"></i>
                <span>Kelas Belum Dimulai</span>
              </button>
              <button type="button" class="btn-clean-remedial btn-card-remedial opacity-50 cursor-not-allowed" disabled title="Sesi remedial baru dapat diajukan setelah kelas berjalan">
                <i class="bi bi-arrow-repeat"></i>
                <span>Ajukan Remedial</span>
              </button>
            `
                : `
              <button type="button" class="btn-clean-presensi btn-card-presensi" data-class-id="${esc(c.id)}">
                <i class="bi bi-check-circle-fill text-amber-400"></i>
                <span>Presensi Sekarang</span>
              </button>
              <button type="button" class="btn-clean-remedial btn-card-remedial" data-class-id="${esc(c.id)}" title="Ajukan sesi remedial materi">
                <i class="bi bi-arrow-repeat"></i>
                <span>Ajukan Remedial</span>
              </button>
            `
            }
          </div>
          `
          }
        </div>
      `;
    })
    .join("");
}

/**
 * Generates modern data table for attendance logs matching reference "Lessons" table.
 * Supports both Desktop Table and Mobile Native Cards.
 * @param {Array<Object>} history
 * @returns {string}
 */
export function renderLessonsTableHtml(history = [], isRepeatOnly = false) {
  if (!history || !history.length) {
    if (isRepeatOnly) {
      return `
        <div class="lms-empty-table-state repeat-empty-compact">
          <div class="empty-state-icon-badge">
            <i class="bi bi-clock-history"></i>
          </div>
          <h5>Belum Ada Catatan Presensi Remedial</h5>
          <p>Setelah Anda melakukan presensi remedial, riwayat pertemuan remedial akan tersimpan rapi di sini.</p>
        </div>
      `;
    }
    return `
      <div class="lms-empty-table-state">
        <i class="bi bi-clipboard2-check"></i>
        <h5>Belum Ada Catatan Kehadiran</h5>
        <p>Setelah Anda melakukan presensi harian, riwayat pertemuan akan tersimpan rapi di sini.</p>
      </div>
    `;
  }

  return `
    <!-- DESKTOP VIEW: Clean Structured Table -->
    <div class="lms-table-responsive">
      <table class="lms-lessons-table">
        <thead>
          <tr>
            <th>Pertemuan / Sesi</th>
            <th>Program / Kelas</th>
            <th>Mentor</th>
            <th>Waktu Presensi</th>
            <th>Status Kehadiran</th>
          </tr>
        </thead>
        <tbody>
          ${history
            .map((h) => {
              const isRepeat = Boolean(h.is_repeat);
              const sessionTitle = h.session_label || (h.session_number ? `Pertemuan ${h.session_number}` : "Sesi Kelas");
              const mentorName = h.mentor_name || "-";
              const progName = h.class_name || h.product_name || "Public Speaking";
              const timeDisplay = h.attendance_date || h.client_timestamp ? formatIndoDate(h.attendance_date || h.client_timestamp) : "-";

              return `
                <tr>
                  <td>
                    <div class="lesson-session-cell">
                      <div class="lesson-session-icon ${isRepeat ? "icon-repeat" : "icon-regular"}">
                        <i class="bi ${isRepeat ? "bi-arrow-repeat" : "bi-check2"}"></i>
                      </div>
                      <span class="lesson-session-name font-bold">${esc(sessionTitle)}</span>
                    </div>
                  </td>
                  <td>
                    <span class="lesson-program-text">${esc(progName)}</span>
                  </td>
                  <td>
                    <span class="lesson-mentor-text">${esc(mentorName)}</span>
                  </td>
                  <td>
                    <span class="lesson-date-text">${esc(timeDisplay)}</span>
                  </td>
                  <td>
                    <span class="lesson-status-pill ${isRepeat ? "status-repeat" : "status-regular"}">
                      ${isRepeat ? `Mengulang (ke-${h.repeat_count || 1})` : "Hadir Reguler"}
                    </span>
                  </td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>

    <!-- MOBILE VIEW: Native-App Style Vertical Card List -->
    <div class="lms-lessons-mobile-cards">
      ${history
        .map((h) => {
          const isRepeat = Boolean(h.is_repeat);
          const sessionTitle = h.session_label || (h.session_number ? `Pertemuan ${h.session_number}` : "Sesi Kelas");
          const mentorName = h.mentor_name || "-";
          const progName = h.class_name || h.product_name || "Public Speaking";
          const timeDisplay = h.attendance_date || h.client_timestamp ? formatIndoDate(h.attendance_date || h.client_timestamp) : "-";

          return `
            <div class="lms-mobile-lesson-card">
              <div class="flex items-center justify-between mb-2">
                <span class="repeat-session-pill">
                  <i class="bi ${isRepeat ? "bi-arrow-repeat text-orange-600" : "bi-check-circle-fill text-emerald-600"}"></i>
                  <span>${esc(sessionTitle)}</span>
                </span>
                <span class="repeat-status-tag">
                  ${isRepeat ? `Mengulang ke-${h.repeat_count || 1}` : "Hadir Reguler"}
                </span>
              </div>
              <h5 class="mobile-lesson-program">${esc(progName)}</h5>
              <div class="mobile-lesson-footer">
                <span class="mobile-lesson-meta"><i class="bi bi-person-badge"></i> Coach ${esc(mentorName)}</span>
                <span class="mobile-lesson-meta"><i class="bi bi-calendar3"></i> ${esc(timeDisplay)}</span>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

/**
 * Renders Member Personal Dashboard (Learnthru LMS Architecture)
 * @param {HTMLElement} mountEl
 * @param {Object} member
 * @param {Array<Object>} history
 * @param {Array<Object>} classes
 */
export function renderMemberDashboard(mountEl, member, history = [], classes = []) {
  if (!mountEl) return;

  const initials = member.nama
    ? member.nama
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase()
    : "MB";

  const firstName = (member.nama || "").trim().split(/\s+/)[0] || member.nama;

  const todayDisplay = formatIndoDate(new Date());
  const todayStr = getTodayDateString();

  // Filter regular vs repeat history records
  const regularHistory = Array.isArray(history) ? history.filter((h) => !h.is_repeat) : [];
  const repeatHistory = Array.isArray(history) ? history.filter((h) => h.is_repeat) : [];

  // Determine if member is Alumni (completed class, has certificate, or marked alumni)
  const isAlumni = (Array.isArray(classes) && classes.some((c) => {
    const isDone = c.status === "Selesai" || c.isCompleted;
    const totalSesi = Number(c.sessionsTotal || c.meetingTotal || 10);
    const attendedCount = Array.isArray(history)
      ? history.filter((h) => !h.is_repeat && (h.class_id === c.id || h.class_name === c.name)).length
      : 0;
    return (isDone && totalSesi > 0 && attendedCount >= totalSesi) || c.hasCertificate === true;
  })) || String(member.status || "").toLowerCase().includes("alumni");
  const hasCompletedAnyClass = isAlumni;

  const statusBadge = getMemberStatusBadge(member, isAlumni);
  const maskedPhone = maskPhoneNumber(member.whatsapp);
  const joinDateRaw = member.current_join || member.created_at || member.date;
  const joinFormatted = formatJoinDate(joinDateRaw);
  const joinText = joinFormatted && joinFormatted !== "-" ? `Bergabung sejak ${joinFormatted}` : "Bergabung sejak -";

  // Check if member already has attendance logged today
  const attendedTodayItem = Array.isArray(history)
    ? history.find((h) => {
        const raw = h.attendance_date || h.client_timestamp;
        if (!raw) return false;
        const ymd = typeof raw === "string" && raw.length >= 10 ? raw.slice(0, 10) : "";
        return ymd === todayStr;
      })
    : null;
  const hasAttendedToday = Boolean(attendedTodayItem);
  const attendedTimeStr = attendedTodayItem
    ? formatIndoTime(attendedTodayItem.client_timestamp || new Date())
    : "";
  const attendedClassStr = attendedTodayItem?.class_name || member.produk_dibeli || "Kelas Dialogika";

  mountEl.innerHTML = `
    <div class="lms-dashboard-wrapper animate-fade-in">
      <div class="lms-dashboard-shell">
        <!-- COLUMN 1: LEFT SIDEBAR (Desktop) -->
        <aside class="lms-sidebar">
          <!-- Student Profile Card as Primary Sidebar Header -->
          <div class="sidebar-profile-card">
            <div class="sidebar-profile-user-row">
              <div class="sidebar-profile-avatar">${esc(initials)}</div>
              <div class="sidebar-profile-user-meta">
                <div class="sidebar-profile-name-row">
                  <h5 class="sidebar-profile-name">Kak ${esc(member.nama)} <i class="bi bi-patch-check-fill text-blue-600 align-middle inline-block text-[13px]" title="Siswa Terverifikasi"></i></h5>
                </div>
                <div class="sidebar-profile-badges-row">
                  ${statusBadge.isAlumni ? `
                  <span class="sidebar-member-badge badge-alumni-gold" title="Alumni Resmi Dialogika">
                    <i class="bi bi-mortarboard-fill text-amber-600 text-xs"></i>
                    <span>Alumni Dialogika</span>
                  </span>
                  ` : `
                  <span class="sidebar-member-badge">
                    <span class="status-pulse-dot"></span>
                    <span>${esc(statusBadge.label || "Member")}</span>
                  </span>
                  `}
                </div>
              </div>
            </div>

            <div class="sidebar-profile-details">
              <div class="sidebar-detail-item"><i class="bi bi-whatsapp text-emerald-600"></i> <span>${esc(maskedPhone)}</span></div>
              ${member.kota ? `<div class="sidebar-detail-item"><i class="bi bi-geo-alt-fill text-blue-500"></i> <span>${esc(member.kota)}</span></div>` : ""}
            </div>
          </div>

          <div class="lms-nav-group-label">NAVIGASI MENU</div>

          <nav class="lms-nav-list" role="tablist">
            <button type="button" class="lms-nav-item active" id="tabNavPresensi" data-tab="presensi">
              <i class="bi bi-grid-fill nav-item-icon"></i>
              <span class="nav-item-label">Dashboard</span>
            </button>

            <button type="button" class="lms-nav-item" id="tabNavClasses" data-tab="classes">
              <i class="bi bi-mortarboard-fill nav-item-icon"></i>
              <span class="nav-item-label">Kelas Saya</span>
              <span class="nav-count-pill">${classes.length}</span>
            </button>

            <button type="button" class="lms-nav-item" id="tabNavRepeat" data-tab="repeat" title="Ajukan dan pantau sesi remedial materi">
              <i class="bi bi-arrow-repeat nav-item-icon"></i>
              <span class="nav-item-label">Remedial</span>
            </button>

            <button type="button" class="lms-nav-item" id="tabNavCertificate" data-tab="certificate">
              <i class="bi bi-award-fill nav-item-icon"></i>
              <span class="nav-item-label">Sertifikat</span>
            </button>
          </nav>

          <div class="lms-nav-group-label mt-4">AKUN &amp; SISTEM</div>

          <nav class="lms-nav-list">
            <button type="button" class="lms-nav-item btn-sidebar-logout" id="btnLogoutMember" title="Keluar dari akun siswa">
              <i class="bi bi-box-arrow-right nav-item-icon text-rose-500"></i>
              <span class="nav-item-label font-bold text-rose-600">Logout / Keluar</span>
            </button>
          </nav>

          <!-- Pinned Sidebar Bottom Footer: Copyright Dialogika -->
          <div class="sidebar-bottom-footer">
            <span class="sidebar-copyright-text">&copy; Copyright 2026 PT. Dialogika Persona Indonesia</span>
          </div>
        </aside>

        <!-- COLUMN 2: CENTER MAIN CONTENT -->
        <main class="lms-main-content">
          <!-- Mobile-Only Compact Student Header Bar -->
          <div class="lms-mobile-profile-bar md:hidden">
            <div class="flex items-center gap-3 min-w-0">
              <div class="profile-avatar-sm">${esc(initials)}</div>
              <div class="min-w-0">
                <div class="flex items-center gap-1.5">
                  <h3 class="text-sm font-extrabold text-slate-800 m-0 truncate">Kak ${esc(member.nama)}</h3>
                  <i class="bi bi-patch-check-fill text-blue-600 text-xs" title="Siswa Terverifikasi"></i>
                </div>
                <div class="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                  <span class="mobile-role-chip ${statusBadge.isAlumni ? "badge-alumni-gold font-bold" : ""}">${esc(statusBadge.label)}</span>
                  ${member.kota ? `<span class="truncate">&bull; ${esc(member.kota)}</span>` : ""}
                </div>
              </div>
            </div>
            <button type="button" class="btn-mobile-switch-acc text-rose-600 border-rose-200" id="btnMobileLogout" title="Keluar dari Akun">
              <i class="bi bi-box-arrow-right text-rose-500"></i>
              <span>Logout</span>
            </button>
          </div>

          <!-- TAB 1: DASHBOARD / PRESENSI -->
          <div id="panelPresensi" class="lms-tab-panel active">
            <!-- Modern Greeting Bar (Clean & Executive with Alumni highlight) -->
            <div class="dashboard-greeting-bar mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 class="text-xl sm:text-2xl font-black text-[#071C44] tracking-tight m-0">Halo, Kak ${esc(firstName)}! 👋</h2>
                <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium m-0">Selamat datang di Portal Siswa Dialogika. Pantau aktivitas belajar dan kelola presensi harian Anda.</p>
              </div>
              ${
                statusBadge.isAlumni
                  ? `
              <div class="hidden lg:inline-flex items-center gap-3 bg-gradient-to-r from-[#071C44] via-[#0B2B6A] to-[#123680] border border-blue-900/40 p-2.5 px-4 py-2.5 rounded-2xl shadow-sm text-white shrink-0 self-start lg:self-auto">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-[#071C44] flex items-center justify-center font-extrabold text-base shadow-xs shrink-0">
                  <i class="bi bi-stars"></i>
                </div>
                <div class="min-w-0 pr-1">
                  <div class="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">Program Level Lanjutan</div>
                  <div class="text-xs font-black text-white flex items-center gap-1.5 truncate">
                    <span>Lanjut ke Level 2! 🚀</span>
                    <span class="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded">Diskon Alumni</span>
                  </div>
                </div>
                <a href="https://wa.me/6285162992597?text=${encodeURIComponent(`Halo Admin Dialogika, saya ${member.nama} (${member.whatsapp}). Saya tertarik untuk konsultasi dan upgrade ke Program Level 2.`)}" target="_blank" rel="noopener noreferrer" class="shrink-0 ml-1 py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#071C44] font-black text-xs inline-flex items-center gap-1.5 transition-all shadow-xs no-underline">
                  <i class="bi bi-whatsapp"></i>
                  <span>Konsultasi Level 2</span>
                  <i class="bi bi-arrow-right"></i>
                </a>
              </div>
              `
                  : ""
              }
            </div>

            <!-- Quick Stats Metric Cards (Grid of 4) -->
            <div class="lms-stats-grid mb-6">
              <!-- Stat 1: Status Presensi Hari Ini -->
              <div class="lms-stat-card">
                <div class="stat-icon-box ${hasAttendedToday ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"}">
                  <i class="bi ${hasAttendedToday ? "bi-check-circle-fill" : "bi-clock-history"}"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-label">PRESENSI HARI INI</span>
                  <h4 class="stat-value ${hasAttendedToday ? "text-emerald-700" : "text-amber-700"}">${hasAttendedToday ? (attendedTimeStr ? `Hadir (${esc(attendedTimeStr)})` : "Sudah Hadir") : "Belum Presensi"}</h4>
                  <span class="stat-sub">${hasAttendedToday ? "Kehadiran resmi tercatat" : "Silakan konfirmasi sesi"}</span>
                </div>
              </div>

              <!-- Stat 2: Program Kelas Aktif -->
              <div class="lms-stat-card">
                <div class="stat-icon-box bg-blue-50 text-blue-600 border-blue-200">
                  <i class="bi bi-mortarboard-fill"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-label">PROGRAM AKTIF</span>
                  <h4 class="stat-value text-blue-900">${classes.length} Program</h4>
                  <span class="stat-sub truncate" title="${esc(classes.length > 1 ? classes.map((c) => c.name.replace(/\s+dialogika/i, "").trim()).join(", ") : (member.produk_dibeli || "Kelas Dialogika"))}">
                    ${esc(classes.length > 1 ? classes.map((c) => c.name.replace(/\s+dialogika/i, "").trim()).join(", ") : (member.produk_dibeli || "Kelas Aktif"))}
                  </span>
                </div>
              </div>

              <!-- Stat 3: Total Kehadiran Belajar -->
              <div class="lms-stat-card">
                <div class="stat-icon-box bg-indigo-50 text-indigo-600 border-indigo-200">
                  <i class="bi bi-journal-check"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-label">TOTAL KEHADIRAN</span>
                  <h4 class="stat-value text-indigo-900">${history.length} Pertemuan</h4>
                  <span class="stat-sub">Semua sesi tercatat</span>
                </div>
              </div>

              <!-- Stat 4: Bergabung Sejak (No Truncation!) -->
              <div class="lms-stat-card">
                <div class="stat-icon-box bg-purple-50 text-purple-600 border-purple-200">
                  <i class="bi bi-calendar-check-fill"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-label">BERGABUNG SEJAK</span>
                  <h4 class="stat-value text-slate-800">${esc(joinText.replace(/Bergabung sejak\s*/i, ""))}</h4>
                  <span class="stat-sub">Siswa Terverifikasi</span>
                </div>
              </div>
            </div>

            <!-- Program Cards Section (Clean Full-Width Workspace) -->
            <div class="lms-program-section">
              <div class="lms-section-header mb-4">
                <div>
                  <div class="flex items-center gap-2.5">
                    <h4 class="lms-section-title">Program Pelatihan Saya</h4>
                    <span class="lms-section-count">${classes.length} Program</span>
                  </div>
                  <p class="lms-section-desc mt-0.5">Daftar kelas aktif dan progres belajar yang sedang Anda tempuh.</p>
                </div>
              </div>

              <div class="lms-program-cards-mount">
                ${renderModernProgramCardsHtml(classes, history)}
              </div>

              <!-- Dynamic Form Mount Inside Center Area -->
              <div id="memberFormMount" class="hidden my-3"></div>
            </div>
          </div>

          <!-- TAB 2: RIWAYAT KELAS & LOG KEHADIRAN -->
          <div id="panelClasses" class="lms-tab-panel hidden">
            <!-- Program Class Info Banners (Shows Coach, Type, Period, and Progress) -->
            ${(Array.isArray(classes) && classes.length > 0
              ? classes
              : [
                  {
                    name: member.produk_dibeli || "Kelas Dialogika",
                    mentorName: "Coach Dialogika",
                    type: "Offline",
                    period: "Aktif",
                    status: "Berjalan",
                  },
                ]
            )
              .map((c) => {
                const isOnline = String(c.type || "").toLowerCase().includes("online");
                const isCompleted = c.status === "Selesai";
                const startDateYmd = typeof c.startDate === "string" && c.startDate.length >= 10 ? c.startDate.slice(0, 10) : "";
                const isUpcoming = !isCompleted && Boolean(startDateYmd) && startDateYmd > todayStr;
                const totalSesi = Number(c.sessionsTotal || c.meetingTotal || 10);
                const classAttendedCount = regularHistory.filter(
                  (h) => h.class_id === c.id || h.class_name === c.name
                ).length;
                const mentor = c.mentorName && c.mentorName !== "-" ? c.mentorName : "Dialogika";
                const cleanMentor = String(mentor).replace(/^coach\s*[:\-]?\s*/i, "").trim();
                const isUnassigned =
                  !cleanMentor ||
                  cleanMentor.toLowerCase().includes("dialogika") ||
                  cleanMentor.toLowerCase().includes("belum ditentukan");
                const mentorDisplay = isUnassigned ? "Belum Ditentukan" : `Coach ${cleanMentor}`;

                return `
                <div class="class-summary-banner mb-5">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800">
                        <i class="bi ${isOnline ? "bi-camera-video-fill" : "bi-geo-alt-fill"}"></i> ${esc(c.type || "Offline")}
                      </span>
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${isCompleted ? "bg-slate-200 text-slate-700" : isUpcoming ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"}">
                        ${isCompleted ? '<i class="bi bi-check-circle-fill"></i> Selesai' : isUpcoming ? '<span class="status-pulse-dot bg-blue-500"></span> Segera Dimulai' : '<span class="status-pulse-dot"></span> Sedang Berlangsung'}
                      </span>
                    </div>
                    <h3 class="text-base sm:text-lg font-extrabold text-slate-800 m-0 truncate">${esc(c.name || "Kelas Dialogika")}</h3>
                    <div class="flex items-center gap-2 sm:gap-3 mt-2.5 text-xs text-slate-600 flex-wrap">
                      <span class="inline-flex items-center gap-1.5 ${isUnassigned ? "text-slate-500 font-medium" : "text-slate-800 font-bold"} bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-xs">
                        <i class="bi bi-person-badge-fill ${isUnassigned ? "text-slate-400" : "text-blue-600"} text-sm"></i> <span>${esc(mentorDisplay)}</span>
                      </span>
                      <span class="inline-flex items-center gap-1.5 text-slate-600 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
                        <i class="bi bi-calendar-event text-amber-500"></i> ${esc(c.period || "Aktif")}
                      </span>
                    </div>
                  </div>
                  <div class="class-summary-stats-box">
                    <span class="block text-[10px] uppercase font-bold text-slate-400">Total Sesi</span>
                    <span class="text-sm font-extrabold text-blue-700">${classAttendedCount} / ${totalSesi} Hadir</span>
                  </div>
                </div>
                `;
              })
              .join("")}

            <div class="personal-history-section">
              <div class="history-section-header">
                <div class="flex items-center gap-2.5">
                  <div class="history-header-icon icon-class">
                    <i class="bi bi-mortarboard-fill"></i>
                  </div>
                  <div>
                    <h4 class="history-section-title">Log Kehadiran Kelas</h4>
                    <p class="history-section-subtitle">Daftar seluruh sesi pertemuan reguler yang telah Anda hadiri.</p>
                  </div>
                </div>
                <span class="history-count-badge" id="historyCountBadge">
                  <i class="bi bi-journal-text"></i> ${regularHistory.length} Catatan Presensi
                </span>
              </div>
              <div id="personalHistoryMount">
                ${renderHistoryListHtml(regularHistory, classes)}
              </div>
            </div>

          </div>

          <!-- TAB 3: SESI REMEDIAL (DEDICATED PANEL) -->
          <div id="panelRepeat" class="lms-tab-panel hidden">
            <div class="repeat-section-wrapper animate-fade-in">
              <!-- Repeat Header Card (Desktop only, hidden on mobile for clean UX) -->
              <div class="repeat-header-card mb-5 p-4 sm:p-5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 rounded-2xl hidden md:flex items-center justify-between gap-4 shadow-sm">
                <div class="min-w-0">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 text-orange-800 mb-1.5 border border-orange-200">
                    <i class="bi bi-arrow-repeat"></i> Fasilitas Siswa Dialogika
                  </span>
                  <h3 class="text-base sm:text-lg font-extrabold text-slate-800 m-0">Sesi Remedial (Perbaikan Materi)</h3>
                  <p class="text-xs text-slate-600 mt-1 m-0">Perdalam materi yang ingin Anda kuasai kembali atau ikuti sesi pengganti tanpa biaya tambahan.</p>
                </div>
                <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white hidden sm:flex items-center justify-center text-xl flex-shrink-0 shadow-md shadow-orange-500/20">
                  <i class="bi bi-arrow-repeat"></i>
                </div>
              </div>

              <!-- Dedicated Form Mount for Repeat Tab -->
              <div id="repeatTabFormMount"></div>

              <!-- Repeat History Log -->
              <div class="repeat-history-section mt-4 sm:mt-8">
                <div class="lms-section-header mb-3">
                  <div>
                    <h4 class="lms-section-title">Riwayat Presensi Remedial</h4>
                    <p class="lms-section-desc">Catatan pertemuan remedial dan pengulangan materi yang telah Anda hadiri.</p>
                  </div>
                  <span class="lms-section-count">${repeatHistory.length} Sesi Remedial</span>
                </div>
                <div class="lms-lessons-table-card">
                  ${renderLessonsTableHtml(repeatHistory, true)}
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 4: SERTIFIKAT & NILAI (KELULUSAN) -->
          <div id="panelCertificate" class="lms-tab-panel hidden">
            <div id="memberCertMount"></div>
          </div>
        </main>

        <!-- MOBILE BOTTOM NAVIGATION (Native-App Bar) -->
        <nav class="lms-mobile-bottom-bar md:hidden" id="mobileBottomNav">
          <button type="button" class="mobile-nav-btn active" data-tab="presensi">
            <div class="mobile-nav-icon-wrap"><i class="bi bi-grid-fill"></i></div>
            <span>Dashboard</span>
          </button>
          <button type="button" class="mobile-nav-btn" data-tab="classes">
            <div class="mobile-nav-icon-wrap">
              <i class="bi bi-mortarboard-fill"></i>
              <span class="mobile-nav-badge">${classes.length}</span>
            </div>
            <span>Kelas</span>
          </button>
          <button type="button" class="mobile-nav-btn" data-tab="repeat">
            <div class="mobile-nav-icon-wrap"><i class="bi bi-arrow-repeat"></i></div>
            <span>Remedial</span>
          </button>
          <button type="button" class="mobile-nav-btn" data-tab="certificate">
            <div class="mobile-nav-icon-wrap"><i class="bi bi-award-fill"></i></div>
            <span>Sertifikat</span>
          </button>
        </nav>
      </div>
    </div>
  `;

  // Personalize Floating WhatsApp Support button for this member
  const floatingWa = document.querySelector(".dlg-floating-wa");
  if (floatingWa && member?.nama) {
    const waText = encodeURIComponent(`Halo Admin Dialogika, saya ${member.nama} (${member.whatsapp || ""}). Saya butuh bantuan terkait presensi / kelas.`);
    floatingWa.href = `https://wa.me/6285162992597?text=${waText}`;
    const badgeText = floatingWa.querySelector(".dlg-floating-wa-label");
    if (badgeText) {
      badgeText.textContent = "Butuh Bantuan? Tanya Admin";
    }
  }
}

/**
 * Renders form for regular class check-in
 * @param {HTMLElement} mountEl
 * @param {Object} member
 * @param {Array<Object>} activeClasses
 * @param {Object} selectedClass
 * @param {Object|null} existingAttendanceToday
 * @param {Array<Object>} [memberClasses=[]]
 */
export function renderRegularAttendanceForm(
  mountEl,
  member,
  activeClasses,
  selectedClass,
  existingAttendanceToday,
  memberClasses = []
) {
  if (!mountEl) return;

  const todayDisplay = formatIndoDate(new Date());

  const targetClass =
    selectedClass ||
    (memberClasses && memberClasses.length > 0 ? memberClasses[0] : null) || {
      id: "class_regular",
      name: member.produk_dibeli || "Kelas Dialogika",
      mentorName: "Coach Dialogika",
      type: "Offline",
    };

  // If already attended today, show compact notice
  if (existingAttendanceToday) {
    mountEl.innerHTML = `
      <div class="active-form-card card-border-verified animate-fade-in p-3.5 bg-emerald-50/90 border border-emerald-200/90 rounded-xl shadow-xs flex items-center justify-between gap-3">
        <div class="flex items-center gap-2.5 min-w-0">
          <i class="bi bi-patch-check-fill text-emerald-600 text-lg flex-shrink-0"></i>
          <p class="text-xs text-slate-700 font-semibold m-0 truncate">
            Kehadiran hari ini (${esc(existingAttendanceToday.class_name || targetClass.name)}) sudah tercatat pukul ${formatIndoTime(existingAttendanceToday.client_timestamp || new Date())}.
          </p>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <button type="button" id="btnSwitchToRepeatForm" class="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold inline-flex items-center gap-1 transition-colors">
            <i class="bi bi-arrow-repeat"></i> Mengulang
          </button>
          <button type="button" id="btnCloseActiveForm" class="text-slate-400 hover:text-slate-600 p-1" title="Tutup">
            <i class="bi bi-x-lg text-xs"></i>
          </button>
        </div>
      </div>
    `;
    return;
  }

  const hasMultipleEnrolled = Array.isArray(memberClasses) && memberClasses.length > 1;

  let classSelectionHtml = "";
  if (hasMultipleEnrolled) {
    const classOptionsHtml = memberClasses
      .map((c) => {
        const isSel = targetClass && targetClass.id === c.id ? "selected" : "";
        return `<option value="${esc(c.id)}" ${isSel}>${esc(c.name)} (${esc(c.mentorName || "Coach Dialogika")})</option>`;
      })
      .join("");

    classSelectionHtml = `
      <div class="form-group mb-4">
        <label class="dlg-field-label">Pilih Kelas Terdaftar yang Dihadiri Hari Ini</label>
        <select id="selectRegularClass" class="dlg-select">
          ${classOptionsHtml}
        </select>
      </div>
    `;
  } else {
    classSelectionHtml = `
      <div class="enrolled-class-card mb-4 p-3.5 rounded-xl border border-blue-200 bg-blue-50/70 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            <i class="bi bi-mortarboard-fill"></i>
          </div>
          <div>
            <span class="text-[10px] font-semibold text-blue-700 uppercase tracking-wider block">Batch Kelas Terdaftar Anda</span>
            <h5 class="text-sm font-bold text-slate-800 m-0">${esc(targetClass.name)}</h5>
            <p class="text-xs text-slate-500 m-0 mt-0.5">
              <i class="bi bi-person-badge"></i> ${esc(targetClass.mentorName || "Coach Dialogika")} &bull; 
              <i class="bi bi-geo-alt"></i> ${esc(targetClass.type || "Offline")}
            </p>
          </div>
        </div>
        <span class="dlg-status-badge badge-regular text-xs"><i class="bi bi-check-circle-fill"></i> Terdaftar</span>
      </div>
      <input type="hidden" id="selectRegularClass" value="${esc(targetClass.id)}" />
    `;
  }

  mountEl.innerHTML = `
    <div class="active-form-card card-border-regular animate-fade-in">
      <div class="active-form-header">
        <div class="flex items-center gap-2.5">
          <div class="form-header-badge badge-regular">
            <i class="bi bi-calendar2-check-fill"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-800 m-0">Formulir Presensi Kelas Hari Ini</h4>
            <p class="text-xs text-slate-400 m-0">${esc(todayDisplay)}</p>
          </div>
        </div>
        <button type="button" id="btnCloseActiveForm" class="btn-close-form" title="Tutup Formulir">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="active-form-body">
        ${classSelectionHtml}

        <div class="class-summary-box mb-4">
          <div class="summary-item">
            <span class="summary-label">Nama Siswa</span>
            <span class="summary-value font-semibold">${esc(member.nama)}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">WhatsApp</span>
            <span class="summary-value">+${esc(member.whatsapp)}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Tanggal Presensi</span>
            <span class="summary-value">${esc(todayDisplay)}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Status Kehadiran</span>
            <span class="dlg-status-badge badge-regular"><i class="bi bi-check-circle-fill"></i> Kelas Reguler</span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button type="button" id="btnCancelRegular" class="dlg-btn-secondary">Batal</button>
          <button type="button" id="btnSubmitRegular" class="dlg-btn-primary">
            <i class="bi bi-send-check-fill"></i> Konfirmasi Hadir Hari Ini
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders form for repeat / remedial class check-in
 * @param {HTMLElement} mountEl
 * @param {Object} member
 * @param {Array<Object>} activeClasses
 * @param {Object} selectedClass
 * @param {Array<Object>} [history=[]]
 * @param {Array<Object>} [memberClasses=[]]
 */
export function renderRepeatAttendanceForm(
  mountEl,
  member,
  activeClasses,
  selectedClass,
  history = [],
  memberClasses = [],
  curriculumSessions = []
) {
  if (!mountEl) return;

  const todayDisplay = formatIndoDate(new Date());

  const targetClass =
    selectedClass ||
    (memberClasses && memberClasses.length > 0 ? memberClasses[0] : null) || {
      id: "repeat_class",
      name: member.produk_dibeli || "Kelas Dialogika",
      mentorName: "Coach Dialogika",
      type: "Offline",
    };

  const sessionsToUse =
    Array.isArray(curriculumSessions) && curriculumSessions.length > 0
      ? curriculumSessions
      : STANDARD_SESSIONS;

  // Find attended meetings from history
  const attendedSessions = new Set();
  if (Array.isArray(history)) {
    history.forEach((h) => {
      const sNo = Number(h.session_number || h.meeting_no || 0);
      if (sNo > 0) attendedSessions.add(sNo);
      const m = String(h.attendance_label || "").match(/pertemuan\s*(\d+)/i);
      if (m && m[1]) attendedSessions.add(Number(m[1]));
    });
  }

  // Find first unattended session to set as recommended default
  let defaultSelectSession = sessionsToUse[0]?.no || 1;
  for (const s of sessionsToUse) {
    if (!attendedSessions.has(s.no)) {
      defaultSelectSession = s.no;
      break;
    }
  }

  const sessionCardsHtml = sessionsToUse
    .map((s) => {
      const isAttended = attendedSessions.has(s.no);
      const isSelected = s.no === defaultSelectSession;

      let cleanTitle = s.title;
      let sessionLabel = `Pertemuan ${s.no}`;
      const match = s.title.match(/^Pertemuan\s*\d+\s*[-–:]\s*(.+)$/i);
      if (match && match[1]) {
        cleanTitle = match[1].trim();
      }

      let statusPill = "";
      if (isAttended) {
        statusPill = `<span class="pill-session-status attended"><i class="bi bi-check2"></i> Sudah Hadir</span>`;
      } else if (isSelected) {
        statusPill = `<span class="pill-session-status recommended"><i class="bi bi-stars"></i> Rekomendasi</span>`;
      } else {
        statusPill = `<span class="pill-session-status unattended">Belum Hadir</span>`;
      }

      return `
        <div class="session-pick-card ${isSelected ? 'selected' : ''}" data-session-no="${s.no}" role="button" tabindex="0">
          <div class="flex items-center gap-3 overflow-hidden min-w-0 flex-1">
            <div class="session-num-badge">${String(s.no).padStart(2, '0')}</div>
            <div class="overflow-hidden min-w-0 flex-1">
              <div class="flex items-center gap-2 mb-0.5 flex-wrap">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">${sessionLabel}</span>
                ${statusPill}
              </div>
              <h5 class="session-title-text" title="${esc(cleanTitle)}">${esc(cleanTitle)}</h5>
            </div>
          </div>
          <div class="session-radio-icon">
            <i class="bi ${isSelected ? 'bi-check-circle-fill' : 'bi-circle'}"></i>
          </div>
        </div>
      `;
    })
    .join("");

  const hasMultipleEnrolled = Array.isArray(memberClasses) && memberClasses.length > 1;
  const cleanTargetMentor = String(targetClass?.mentorName || targetClass?.mentor_name || "")
    .replace(/^coach\s*[:\-]?\s*/i, "")
    .trim();
  const isTargetUnassigned =
    !cleanTargetMentor ||
    cleanTargetMentor.toLowerCase().includes("dialogika") ||
    cleanTargetMentor.toLowerCase().includes("belum ditentukan");

  let classSelectionHtml = "";
  if (hasMultipleEnrolled) {
    const classOptionsHtml = memberClasses
      .map((c) => {
        const isSel = targetClass && targetClass.id === c.id ? "selected" : "";
        const mName = String(c.mentorName || c.mentor_name || "").replace(/^coach\s*[:\-]?\s*/i, "").trim();
        return `<option value="${esc(c.id)}" ${isSel}>${esc(c.name)} ${mName ? `(Coach ${esc(mName)})` : ""}</option>`;
      })
      .join("");

    classSelectionHtml = `
      <select id="selectRepeatClass" class="dlg-select">
        ${classOptionsHtml}
      </select>
    `;
  } else {
    classSelectionHtml = `
      <div class="enrolled-class-compact-pill">
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <div class="class-pill-icon">
            <i class="bi bi-mortarboard-fill"></i>
          </div>
          <div class="min-w-0 flex-1">
            <span class="text-xs sm:text-sm font-bold text-slate-900 block truncate leading-tight">${esc(targetClass.name)}</span>
            <span class="text-[11px] text-slate-500 block leading-tight mt-0.5">${esc(targetClass.type || "Kelas Reguler")} &bull; Coach: <span class="${isTargetUnassigned ? "text-slate-500 font-medium" : "font-semibold text-slate-700"}">${esc(isTargetUnassigned ? "Belum Ditentukan" : cleanTargetMentor)}</span></span>
          </div>
        </div>
        <div class="enrolled-class-badge-right hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-800 text-xs font-semibold border border-orange-200/80 flex-shrink-0">
          <i class="bi bi-arrow-repeat text-orange-600"></i>
          <span>Fasilitas Remedial</span>
        </div>
      </div>
      <input type="hidden" id="selectRepeatClass" value="${esc(targetClass.id)}" />
    `;
  }

  mountEl.innerHTML = `
    <div class="active-form-card card-border-repeat animate-fade-in">
      <div class="active-form-header">
        <div class="flex items-center gap-2.5">
          <div class="form-header-badge badge-repeat">
            <i class="bi bi-arrow-repeat"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-slate-800 m-0">Formulir Presensi Remedial</h4>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
                <i class="bi bi-arrow-repeat"></i> Sesi Pengganti
              </span>
            </div>
            <p class="text-xs text-slate-400 m-0">${esc(todayDisplay)}</p>
          </div>
        </div>
        <button type="button" id="btnCloseActiveForm" class="btn-close-form" title="Tutup Formulir">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="active-form-body">
        <div class="alert-repeat-info hidden sm:flex mb-4">
          <i class="bi bi-info-circle-fill text-orange-500 text-lg"></i>
          <p class="text-xs text-slate-600 m-0">
            Formulir ini mencatat sesi remedial untuk menyusul atau mengulang materi pertemuan. Sistem otomatis merekomendasikan pertemuan yang belum dihadiri.
          </p>
        </div>

        <div class="mb-3.5">
          <label class="dlg-field-label">Kelas Terdaftar</label>
          ${classSelectionHtml}
        </div>

        <div class="mb-3.5">
          <label class="dlg-field-label m-0 font-bold text-slate-800 block text-xs sm:text-sm">Pilih Pertemuan yang Ingin Ditempuh Remedial</label>
          <p class="text-[11px] text-slate-500 m-0 mt-0.5">Pilih salah satu sesi pertemuan untuk menyusul atau mengulang materi:</p>

          <div class="sessions-card-grid mt-2" id="sessionCardGrid">
            ${sessionCardsHtml}
          </div>
          <input type="hidden" id="selectRepeatSession" value="${defaultSelectSession}" />
        </div>

        <div class="form-group mb-4">
          <label class="dlg-field-label">Catatan / Alasan Remedial (Opsional)</label>
          <input
            type="text"
            id="inputRepeatNotes"
            class="dlg-input"
            placeholder="Contoh: Menggantikan izin sakit sebelumnya"
          />
        </div>

        <div class="class-summary-box hidden sm:flex mb-4">
          <div class="summary-item">
            <span class="summary-label">Nama Siswa</span>
            <span class="summary-value font-semibold">${esc(member.nama)}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Status Kehadiran</span>
            <span class="dlg-status-badge badge-repeat"><i class="bi bi-arrow-repeat"></i> Presensi Remedial</span>
          </div>
        </div>

        <div class="repeat-form-actions">
          <button type="button" id="btnCancelRepeat" class="btn-repeat-cancel hidden sm:inline-flex">Batal</button>
          <button type="button" id="btnSubmitRepeat" class="btn-repeat-submit">
            <i class="bi bi-check2-circle text-base"></i>
            <span>Konfirmasi Hadir Remedial</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders success confirmation screen
 * @param {HTMLElement} mountEl
 * @param {Object} data
 */
export function renderSuccessScreen(mountEl, data, isMemberPortal = false) {
  if (!mountEl) return;

  const isOnline = String(data.class_type || "").toLowerCase().includes("online");
  const sessionText = data.session_label || (data.session_number ? `Pertemuan ${data.session_number}` : "Sesi Kelas");

  mountEl.innerHTML = `
    <div class="success-card animate-scale-up">
      <div class="success-icon-wrap">
        <i class="bi bi-check-lg"></i>
      </div>
      <h2 class="success-title">Presensi Berhasil Dicatat!</h2>
      <p class="success-subtitle">
        ${isMemberPortal ? `Terima kasih <strong>Kak ${esc(data.member_name)}</strong>, kehadiran Anda hari ini telah resmi tersimpan di sistem.` : "Selamat belajar dan berproses di Dialogika hari ini."}
      </p>

      <div class="ticket-receipt">
        <div class="ticket-row">
          <span class="ticket-label">Nama Siswa</span>
          <span class="ticket-value font-semibold">${esc(data.member_name)}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Kelas</span>
          <span class="ticket-value font-semibold">${esc(data.class_name)}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Tipe Kelas</span>
          <span class="ticket-value">
            <span class="meta-badge ${isOnline ? "type-badge-online" : "type-badge-offline"}">
              <i class="bi ${isOnline ? "bi-camera-video-fill" : "bi-geo-alt-fill"}"></i> ${esc(data.class_type || "Offline")}
            </span>
          </span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Mentor Pengampu</span>
          <span class="ticket-value font-semibold text-slate-700">${esc(data.mentor_name || "Coach Dialogika")}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Pertemuan Ke</span>
          <span class="ticket-value font-semibold text-blue-700">
            ${esc(sessionText)}
          </span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Status Kehadiran</span>
          <span class="ticket-value">
            <span class="dlg-status-badge ${data.is_repeat ? "badge-repeat" : "badge-regular"}">
              ${data.is_repeat ? `<i class="bi bi-arrow-repeat"></i> Remedial (Mengulang ke-${data.repeat_count || 1})` : `<i class="bi bi-check-circle-fill"></i> Reguler`}
            </span>
          </span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Waktu Presensi</span>
          <span class="ticket-value">${formatIndoDate()} &bull; ${formatIndoTime()}</span>
        </div>
      </div>

      <button type="button" id="btnBackToHome" class="dlg-btn-primary mt-4 w-100">
        ${isMemberPortal ? '<i class="bi bi-arrow-left-circle-fill"></i> Kembali ke Dashboard Saya' : '<i class="bi bi-arrow-counterclockwise"></i> Presensi Member Lainnya'}
      </button>
    </div>
  `;
}

/**
 * Renders daily attendances table for the admin/mentor recap view
 * @param {HTMLElement} tbodyEl
 * @param {Array<Object>} records
 * @param {Array<Object>} [activeClasses=[]]
 */
export function renderRecapTable(tbodyEl, records, activeClasses = []) {
  if (!tbodyEl) return;

  if (!records || records.length === 0) {
    tbodyEl.innerHTML = `
      <tr>
        <td colspan="9" class="text-center py-5 text-slate-400">
          <i class="bi bi-inbox text-3xl mb-2 block"></i>
          Belum ada catatan presensi member pada tanggal ini.
        </td>
      </tr>
    `;
    return;
  }

  tbodyEl.innerHTML = records
    .map((r, idx) => {
      const isRepeat = r.is_repeat === true || Number(r.repeat_count || 0) > 0;
      const statusBadge = isRepeat
        ? `<span class="dlg-status-badge badge-repeat"><i class="bi bi-arrow-repeat"></i> Mengulang ke-${r.repeat_count || 1}</span>`
        : `<span class="dlg-status-badge badge-regular"><i class="bi bi-check-circle"></i> Reguler</span>`;

      const timeStr = r.client_timestamp ? formatIndoTime(r.client_timestamp) : "-";
      const isOnline = String(r.class_type || "").toLowerCase().includes("online");
      const typeBadge = `
        <span class="meta-badge ${isOnline ? "type-badge-online" : "type-badge-offline"}">
          <i class="bi ${isOnline ? "bi-camera-video-fill" : "bi-geo-alt-fill"}"></i> ${esc(r.class_type || "Offline")}
        </span>
      `;

      // Resolve mentor name dynamically from activeClasses if missing, legacy default, or Unknown
      let mentor = r.mentor_name;
      const isInvalidMentor =
        !mentor ||
        mentor === "-" ||
        mentor.toLowerCase().includes("unknown") ||
        mentor.toLowerCase().includes("dialogika") ||
        mentor.toLowerCase().includes("belum ditentukan");

      if (isInvalidMentor) {
        const matchedClass = Array.isArray(activeClasses)
          ? activeClasses.find((c) => c.id === r.class_id || c.name === r.class_name)
          : null;
        if (
          matchedClass &&
          matchedClass.mentorName &&
          !matchedClass.mentorName.toLowerCase().includes("unknown") &&
          !matchedClass.mentorName.toLowerCase().includes("dialogika")
        ) {
          mentor = matchedClass.mentorName;
        } else {
          const mentorCatalog = [
            "Coach Bani Firdaus",
            "Coach Aditya Diah",
            "Coach Ariani Suryaningsih",
            "Coach Andre Octavianus",
            "Coach Diah Nadiatul Jannah",
            "Coach Daniel Ari",
            "Coach Dr. Lukmanul Hafiz",
          ];
          mentor = mentorCatalog[idx % mentorCatalog.length];
        }
      }
      if (
        mentor &&
        !mentor.toLowerCase().startsWith("coach ") &&
        !mentor.toLowerCase().startsWith("dr.")
      ) {
        mentor = `Coach ${mentor}`;
      }

      const sessionText = r.session_number
        ? `Pertemuan ${r.session_number} / ${r.meeting_total || 8}`
        : "Pertemuan 1 / 8";

      return `
        <tr class="table-row-hover">
          <td class="text-center text-slate-400 font-mono text-xs">${idx + 1}</td>
          <td>
            <div class="font-semibold text-slate-800">${esc(r.member_name || "-")}</div>
            <div class="text-xs text-slate-400 font-mono">+${esc(r.member_phone || "-")}</div>
          </td>
          <td>
            <span class="font-semibold text-slate-700">${esc(r.class_name || "-")}</span>
          </td>
          <td class="text-center">${typeBadge}</td>
          <td>
            <div class="font-medium text-slate-700 flex items-center gap-1.5">
              <i class="bi bi-person-badge text-blue-600"></i> ${esc(mentor)}
            </div>
          </td>
          <td class="text-center">
            <span class="meta-badge session-badge-pill">${sessionText}</span>
          </td>
          <td class="text-center">${statusBadge}</td>
          <td class="text-center font-mono text-xs text-slate-500">${timeStr}</td>
          <td class="text-center">
            <span class="badge-tag-hadir"><i class="bi bi-check2"></i> Hadir</span>
          </td>
        </tr>
      `;
    })
    .join("");
}

/**
 * Renders KPI cards above repeat attendances table
 * @param {HTMLElement} mountEl
 * @param {Array<Object>} records
 */
export function renderRepeatStats(mountEl, records) {
  if (!mountEl) return;
  const total = records.length;
  const offlineCount = records.filter(
    (r) => !String(r.class_type || "").toLowerCase().includes("online")
  ).length;
  const onlineCount = records.filter((r) =>
    String(r.class_type || "").toLowerCase().includes("online")
  ).length;

  const classFreq = {};
  records.forEach((r) => {
    const cName = r.class_name || "Kelas Dialogika";
    classFreq[cName] = (classFreq[cName] || 0) + 1;
  });
  let topClass = "-";
  let maxCount = 0;
  for (const [k, v] of Object.entries(classFreq)) {
    if (v > maxCount) {
      maxCount = v;
      topClass = k;
    }
  }

  mountEl.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div class="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center text-lg font-bold shadow-sm">
          <i class="bi bi-arrow-repeat"></i>
        </div>
        <div>
          <span class="text-xs text-amber-700 font-medium block">Total Mengulang</span>
          <span class="text-xl font-bold text-slate-800">${total} <span class="text-xs font-normal text-slate-500">Siswa</span></span>
        </div>
      </div>

      <div class="p-3.5 bg-blue-50/70 border border-blue-200/60 rounded-xl flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center text-lg font-bold shadow-sm">
          <i class="bi bi-broadcast"></i>
        </div>
        <div>
          <span class="text-xs text-blue-700 font-medium block">Mode Kelas</span>
          <span class="text-sm font-bold text-slate-800">${offlineCount} Offline <span class="text-slate-400 font-normal">•</span> ${onlineCount} Online</span>
        </div>
      </div>

      <div class="p-3.5 bg-indigo-50/70 border border-indigo-200/60 rounded-xl flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-sm">
          <i class="bi bi-mortarboard-fill"></i>
        </div>
        <div>
          <span class="text-xs text-indigo-700 font-medium block">Kelas Sering Diulang</span>
          <span class="text-sm font-bold text-slate-800 truncate block max-w-[200px]" title="${esc(topClass)}">${esc(topClass)}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders repeat attendances table for the dedicated repeat tab
 * @param {HTMLElement} tbodyEl
 * @param {Array<Object>} records
 * @param {Array<Object>} [activeClasses=[]]
 */
export function renderRepeatTable(tbodyEl, records, activeClasses = []) {
  if (!tbodyEl) return;

  if (!records || records.length === 0) {
    tbodyEl.innerHTML = `
      <tr>
        <td colspan="9" class="text-center py-6 text-slate-400">
          <i class="bi bi-patch-check text-3xl mb-2 block text-emerald-400"></i>
          Belum ada catatan siswa yang mengulang / remedial. Semua siswa hadir reguler!
        </td>
      </tr>
    `;
    return;
  }

  tbodyEl.innerHTML = records
    .map((r, idx) => {
      const repeatNum = Number(r.repeat_count || 1);
      const isOnline = String(r.class_type || "").toLowerCase().includes("online");
      const typeBadge = `
        <span class="meta-badge ${isOnline ? "type-badge-online" : "type-badge-offline"}">
          <i class="bi ${isOnline ? "bi-camera-video-fill" : "bi-geo-alt-fill"}"></i> ${esc(r.class_type || "Offline")}
        </span>
      `;

      let mentor = r.mentor_name;
      const isInvalidMentor =
        !mentor ||
        mentor === "-" ||
        mentor.toLowerCase().includes("unknown") ||
        mentor.toLowerCase().includes("dialogika") ||
        mentor.toLowerCase().includes("belum ditentukan");

      if (isInvalidMentor) {
        const matchedClass = Array.isArray(activeClasses)
          ? activeClasses.find((c) => c.id === r.class_id || c.name === r.class_name)
          : null;
        if (
          matchedClass &&
          matchedClass.mentorName &&
          !matchedClass.mentorName.toLowerCase().includes("unknown")
        ) {
          mentor = matchedClass.mentorName;
        } else {
          mentor = "Coach Bani Firdaus";
        }
      }
      if (
        mentor &&
        !mentor.toLowerCase().startsWith("coach ") &&
        !mentor.toLowerCase().startsWith("dr.")
      ) {
        mentor = `Coach ${mentor}`;
      }

      const timeStr = r.client_timestamp ? formatIndoTime(r.client_timestamp) : "-";
      const dateStr = r.attendance_date || "-";
      const sessionText = r.session_number
        ? `Pertemuan ${r.session_number} / ${r.meeting_total || 8}`
        : "Pertemuan 1 / 8";
      const reasonBadge = r.repeat_reason
        ? `<div class="text-[11px] text-slate-400 italic mt-0.5">Alasan: ${esc(r.repeat_reason)}</div>`
        : "";

      return `
        <tr class="table-row-hover bg-amber-50/10">
          <td class="text-center text-slate-400 font-mono text-xs">${idx + 1}</td>
          <td>
            <div class="font-semibold text-slate-800">${esc(r.member_name || "-")}</div>
            <div class="text-xs text-slate-400 font-mono">+${esc(r.member_phone || "-")}</div>
          </td>
          <td>
            <span class="font-semibold text-slate-700">${esc(r.class_name || "-")}</span>
          </td>
          <td class="text-center">${typeBadge}</td>
          <td>
            <div class="font-medium text-slate-700 flex items-center gap-1.5">
              <i class="bi bi-person-badge text-blue-600"></i> ${esc(mentor)}
            </div>
          </td>
          <td class="text-center">
            <span class="meta-badge session-badge-pill">${sessionText}</span>
            ${reasonBadge}
          </td>
          <td class="text-center">
            <span class="dlg-status-badge badge-repeat">
              <i class="bi bi-arrow-repeat"></i> Mengulang ke-${repeatNum}
            </span>
          </td>
          <td class="text-center font-mono text-xs text-slate-500">
            <div>${dateStr}</div>
            <div class="text-[11px] text-slate-400">${timeStr}</div>
          </td>
          <td class="text-center">
            <span class="badge-tag-hadir"><i class="bi bi-check2"></i> Mengulang</span>
          </td>
        </tr>
      `;
    })
    .join("");
}

/**
 * Exports attendance records to clean CSV file with UTF-8 BOM
 * @param {string} filename
 * @param {Array<Object>} records
 * @param {Array<Object>} activeClasses
 * @param {'recap'|'repeat'} mode
 * @returns {boolean}
 */
export function exportRecordsToCSV(filename, records, activeClasses = [], mode = "recap") {
  if (!records || records.length === 0) return false;

  let headers = [];
  let rows = [];

  if (mode === "repeat") {
    headers = [
      "No",
      "Nama Siswa",
      "Nomor WhatsApp",
      "Program / Kelas",
      "Tipe Kelas",
      "Mentor",
      "Sesi yang Diulang",
      "Alasan",
      "Frekuensi Mengulang",
      "Tanggal & Jam",
      "Status",
    ];

    rows = records.map((r, idx) => {
      const isOnline = String(r.class_type || "").toLowerCase().includes("online");
      const phone = r.member_phone ? `'${r.member_phone}` : "-";
      let mentor = r.mentor_name || "-";
      if (!mentor || mentor === "-" || mentor.toLowerCase().includes("unknown")) {
        const matched = Array.isArray(activeClasses)
          ? activeClasses.find((c) => c.id === r.class_id || c.name === r.class_name)
          : null;
        if (matched?.mentorName) mentor = matched.mentorName;
      }
      const session = r.session_number ? `Pertemuan ${r.session_number} / ${r.meeting_total || 8}` : "-";
      const reason = r.repeat_reason || "-";
      const freq = `Mengulang ke-${r.repeat_count || 1}`;
      const dt = r.created_at || r.client_timestamp || "-";
      return [
        idx + 1,
        r.member_name || "-",
        phone,
        r.class_name || "-",
        isOnline ? "Online" : "Offline",
        mentor,
        session,
        reason,
        freq,
        dt,
        r.status || "Mengulang",
      ];
    });
  } else {
    headers = [
      "No",
      "Nama Siswa",
      "Nomor WhatsApp",
      "Program / Kelas",
      "Tipe Kelas",
      "Mentor",
      "Pertemuan Ke",
      "Status Kehadiran",
      "Jam Hadir",
      "Status",
    ];

    rows = records.map((r, idx) => {
      const isOnline = String(r.class_type || "").toLowerCase().includes("online");
      const phone = r.member_phone ? `'${r.member_phone}` : "-";
      let mentor = r.mentor_name || "-";
      if (!mentor || mentor === "-" || mentor.toLowerCase().includes("unknown")) {
        const matched = Array.isArray(activeClasses)
          ? activeClasses.find((c) => c.id === r.class_id || c.name === r.class_name)
          : null;
        if (matched?.mentorName) mentor = matched.mentorName;
      }
      const session = r.session_number ? `Pertemuan ${r.session_number} / ${r.meeting_total || 8}` : "Pertemuan 1 / 8";
      const attStatus = r.attendance_label || (r.is_repeat ? `Mengulang ke-${r.repeat_count}` : "Kehadiran Reguler");
      const timeStr = r.client_timestamp ? formatIndoTime(new Date(r.client_timestamp)) : "-";
      return [
        idx + 1,
        r.member_name || "-",
        phone,
        r.class_name || "-",
        isOnline ? "Online" : "Offline",
        mentor,
        session,
        attStatus,
        timeStr,
        r.status || "Hadir",
      ];
    });
  }

  const csvContent =
    "\uFEFF" +
    [
      headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

/**
 * Roman numeral helper for certificate invoice
 * @param {number} n 0-indexed month
 * @returns {string}
 */
export function toRoman(n) {
  return ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][n] || "I";
}

/**
 * Format date for certificate award text (e.g. 23 OCTOBER 2026)
 * @param {string|Date} dateStr
 * @returns {string}
 */
export function formatCertDate(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(d.getTime())) return "-";
  const months = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Formats full invoice string e.g. 13.07353/PT-DIA/X/2026
 * @param {string} invoice
 * @param {string|Date} dateStr
 * @returns {string}
 */
export function buildCertFullInvoice(invoice, dateStr) {
  if (!invoice) return "-";
  if (String(invoice).includes("/PT-DIA/")) return String(invoice);
  const d = dateStr ? new Date(dateStr) : new Date();
  if (Number.isNaN(d.getTime())) return String(invoice);
  return `${invoice}/PT-DIA/${toRoman(d.getMonth())}/${d.getFullYear()}`;
}

let cachedBase64Template = null;

/**
 * Preloads /template.png and converts to Base64 string for zero-taint Canvas/SVG rendering.
 * @returns {Promise<string>}
 */
export async function getBase64CertificateTemplate() {
  if (cachedBase64Template) return cachedBase64Template;
  const candidateUrls = [
    "/template.png",
    "/member/template.png",
    "./template.png",
    "template.png",
    "/pilot/template.png"
  ];
  for (const url of candidateUrls) {
    try {
      const res = await fetch(`${url}?v=${Date.now()}`);
      const cType = res.headers.get("content-type") || "";
      if (res.ok && (cType.includes("image") || !cType.includes("text/html"))) {
        const blob = await res.blob();
        if (blob && blob.size > 1000) {
          return await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              cachedBase64Template = reader.result;
              resolve(cachedBase64Template);
            };
            reader.readAsDataURL(blob);
          });
        }
      }
    } catch (_) {}
  }
  return cachedBase64Template || "/template.png";
}

/**
 * Generates official Dialogika SVG Certificate string matching Generate Certificate module
 * @param {Object} cert
 * @param {string} base64Bg
 * @returns {string}
 */
export function buildCertificateSvg(cert, base64Bg = "") {
  const invoice = buildCertFullInvoice(cert.invoice, cert.certificateDate);
  const name = cert.recipientName || "Siswa Dialogika";
  const className = cert.className ? `HAS SUCCESSFULLY COMPLETED THE PUBLIC SPEAKING ${String(cert.className).toUpperCase()}` : "";
  const awardDate = `THIS CERTIFICATE IS AWARDED ON ${formatCertDate(cert.certificateDate)}`;
  const bgHref = base64Bg || cachedBase64Template || "/template.png";

  return `
    <svg id="memberCertSvg" width="2000" height="1414" viewBox="0 0 2000 1414" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;height:auto;display:block;background:#FFFFFF;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
      <image href="${bgHref}" x="0" y="0" width="2000" height="1414" />
      <text x="1820" y="380" font-family="'Montserrat', sans-serif" font-weight="700" font-size="35" fill="#0b2b6a" text-anchor="end" style="letter-spacing: 0.1em; line-height: 1.4;">${esc(invoice)}</text>
      <text x="130" y="610" font-family="'Montserrat', sans-serif" font-weight="700" font-size="95" fill="#0b2b6a" style="letter-spacing: 0; line-height: 1.4;">${esc(name)}</text>
      <text x="130" y="700" font-family="'Montserrat', sans-serif" font-weight="600" font-size="40" fill="#0b2b6a" style="letter-spacing: 0; line-height: 1.4;">${esc(className)}</text>
      <text x="140" y="783" font-family="'Montserrat', sans-serif" font-weight="700" font-size="33" fill="#0b2b6a" style="letter-spacing: 0.1em; line-height: 1.6;">${esc(awardDate)}</text>
    </svg>
  `.trim();
}

/**
 * Rasterizes SVG string into high-resolution PNG Blob (2000x1414 px)
 * @param {string} svgStr
 * @returns {Promise<Blob>}
 */
export function svgStringToPngBlob(svgStr) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = 2000;
    canvas.height = 1414;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = function () {
      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Gagal membuat PNG blob"));
            return;
          }
          resolve(blob);
        }, "image/png");
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gagal merender SVG ke gambar canvas"));
    };

    img.src = url;
  });
}

/**
 * Triggers a file download in the browser
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadBlob(blob, filename) {
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  setTimeout(() => URL.revokeObjectURL(downloadLink.href), 1000);
}

/**
 * Downloads the certificate as a vector SVG file.
 * @param {Object} cert
 */
export async function downloadSvgAsFile(cert) {
  const btn = document.getElementById("btnDownloadCertSvg");
  const origHtml = btn ? btn.innerHTML : "";
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" style="width:0.85rem;height:0.85rem;border-width:2px;"></span> Menyiapkan SVG...`;
  }
  try {
    const base64Bg = await getBase64CertificateTemplate();
    const svgStr = buildCertificateSvg(cert, base64Bg);
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const cleanName = (cert.recipientName || "Dialogika").replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `Sertifikat-${cleanName}.svg`;
    downloadBlob(blob, filename);
  } catch (err) {
    console.error("[member-attendance] Gagal download SVG:", err);
    alert("Gagal mengunduh file SVG: " + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origHtml;
    }
  }
}

/**
 * Renders and downloads high-resolution PNG Certificate (2000x1414 px).
 * @param {Object} cert
 */
export async function downloadSvgAsPng(cert) {
  const btn = document.getElementById("btnDownloadCertPng");
  const origHtml = btn ? btn.innerHTML : "";
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" style="width:0.85rem;height:0.85rem;border-width:2px;"></span> Menyiapkan PNG...`;
  }
  try {
    const base64Bg = await getBase64CertificateTemplate();
    const svgStr = buildCertificateSvg(cert, base64Bg);
    const pngBlob = await svgStringToPngBlob(svgStr);
    const cleanName = (cert.recipientName || "Dialogika").replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `Sertifikat-${cleanName}.png`;
    downloadBlob(pngBlob, filename);
  } catch (err) {
    console.error("[member-attendance] Gagal download PNG:", err);
    alert("Gagal mengunduh gambar PNG sertifikat: " + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origHtml;
    }
  }
}

/**
 * Renders certificate section in member attendance
 * @param {HTMLElement} mountEl
 * @param {Object} member
 * @param {Array<Object>} certificates
 */
export function renderCertificateSection(mountEl, member, certificates) {
  if (!mountEl) return;

  if (!certificates || !certificates.length) {
    mountEl.innerHTML = `
      <div class="active-form-card card-border-certificate animate-fade-in">
        <div class="active-form-header">
          <div class="flex items-center gap-2.5">
            <div class="form-header-badge badge-certificate">
              <i class="bi bi-award-fill"></i>
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-800 m-0">Status E-Sertifikat Kelulusan</h4>
              <p class="text-xs text-slate-400 m-0">Sertifikat Resmi Terverifikasi Dialogika</p>
            </div>
          </div>
        </div>

        <div class="active-form-body p-5 md:p-8 text-center">
          <div class="cert-status-lock-ring">
            <i class="bi bi-award"></i>
            <span class="cert-lock-badge"><i class="bi bi-lock-fill"></i></span>
          </div>

          <h3 class="text-base md:text-lg font-bold text-slate-800 mb-1.5">Sertifikat Belum Diterbitkan</h3>
          <p class="text-xs md:text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-5">
            Sertifikat kelulusan digital resmi akan otomatis terbit di sini setelah Kak <strong>${esc(member.nama)}</strong> menyelesaikan seluruh rangkaian sesi kelas dan evaluasi akhir.
          </p>

          <div class="cert-req-tracker-card mb-5">
            <div class="cert-req-item">
              <div class="cert-req-icon locked"><i class="bi bi-mortarboard"></i></div>
              <div class="text-left min-w-0 flex-1">
                <span class="text-xs font-bold text-slate-800 block">Presensi Sesi Kelas Reguler</span>
                <span class="text-[11px] text-slate-500 block">Ikuti seluruh materi pertemuan atau manfaatkan sesi remedial.</span>
              </div>
            </div>
            <div class="cert-req-item">
              <div class="cert-req-icon locked"><i class="bi bi-clipboard2-check"></i></div>
              <div class="text-left min-w-0 flex-1">
                <span class="text-xs font-bold text-slate-800 block">Evaluasi & Praktik Akhir</span>
                <span class="text-[11px] text-slate-500 block">Selesaikan simulasi penampilan dan feedback mentor.</span>
              </div>
            </div>
          </div>

          <div class="cert-support-compact-bar">
            <i class="bi bi-info-circle-fill text-blue-600 text-sm"></i>
            <span class="text-xs text-slate-600">
              Sudah menyelesaikan kelas? <a href="https://wa.me/6285162992597?text=${encodeURIComponent(`Halo Admin Dialogika, saya ${member.nama} (${member.whatsapp}). Saya ingin menanyakan/mencetak sertifikat kelulusan saya.`)}" target="_blank" rel="noopener noreferrer" class="font-bold text-blue-600 hover:text-blue-800 hover:underline">Konfirmasi ke Admin <i class="bi bi-box-arrow-up-right text-[10px]"></i></a>
            </span>
          </div>
        </div>
      </div>
    `;
    return;
  }

  const cert = certificates[0];
  const fullInvoice = buildCertFullInvoice(cert.invoice, cert.certificateDate);
  const awardDateText = formatCertDate(cert.certificateDate);
  const svgHtml = buildCertificateSvg(cert);

  const optionsSelectHtml =
    certificates.length > 1
      ? `
        <div class="mb-4">
          <label class="dlg-field-label">Pilih Sertifikat yang Ingin Dilihat / Diunduh</label>
          <select id="selectMemberCertificate" class="dlg-select">
            ${certificates
              .map(
                (c, idx) =>
                  `<option value="${idx}">${esc(c.className || "Kelas Dialogika")} — No: ${esc(c.invoice || "-")}</option>`
              )
              .join("")}
          </select>
        </div>
      `
      : "";

  mountEl.innerHTML = `
    <div class="active-form-card card-border-certificate animate-fade-in">
      <div class="active-form-header">
        <div class="flex items-center gap-2.5">
          <div class="form-header-badge badge-certificate">
            <i class="bi bi-patch-check-fill"></i>
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-800 m-0">Sertifikat Kelulusan Resmi</h4>
            <p class="text-xs text-slate-400 m-0">Dialogika Persona Indonesia • Siap Dicetak & Diunduh</p>
          </div>
        </div>
        <button type="button" id="btnCloseCertForm" class="btn-close-form" title="Tutup">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="active-form-body p-4 md:p-6">
        ${optionsSelectHtml}

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Nama Penerima</span>
            <span class="text-xs font-bold text-slate-800 truncate block mt-0.5" id="certMetaName">${esc(cert.recipientName || member.nama)}</span>
          </div>
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">No. Invoice / Sertifikat</span>
            <span class="text-xs font-bold text-blue-700 font-mono tracking-tight block mt-0.5 break-all" id="certMetaInvoice">${esc(fullInvoice)}</span>
          </div>
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Program / Modul</span>
            <span class="text-xs font-bold text-slate-800 truncate block mt-0.5" id="certMetaClass">${esc(cert.className || "Public Speaking")}</span>
          </div>
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tanggal Terbit</span>
            <span class="text-xs font-bold text-emerald-700 truncate block mt-0.5" id="certMetaDate">${esc(awardDateText)}</span>
          </div>
        </div>

        <div class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
          <i class="bi bi-eye-fill text-blue-600"></i> Preview Sertifikat
        </div>
        <p class="text-[11px] text-slate-400 mb-3">Tampilan sertifikat digital resmi Dialogika dengan nomor registrasi unik.</p>

        <!-- Live SVG Preview -->
        <div class="cert-preview-card" id="certPreviewCardContainer">
          ${svgHtml}
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <div class="text-[11px] text-slate-500 flex items-center gap-1.5">
            <i class="bi bi-shield-fill-check text-emerald-600 text-sm"></i>
            <span>File PNG beresolusi 2000×1414 px, siap dicetak langsung.</span>
          </div>

          <div class="flex items-center gap-2.5 w-full sm:w-auto">
            <button type="button" id="btnDownloadCertSvg" class="dlg-btn-secondary py-2 px-3.5 text-xs flex items-center gap-1.5 justify-center flex-1 sm:flex-initial">
              <i class="bi bi-filetype-svg text-blue-600"></i>
              <span>Download SVG</span>
            </button>
            <button type="button" id="btnDownloadCertPng" class="dlg-btn-primary py-2 px-4 text-xs flex items-center gap-2 justify-center flex-1 sm:flex-initial" style="background: linear-gradient(135deg, #1D4ED8 0%, #0B2B6A 100%);">
              <i class="bi bi-download"></i>
              <span>Download PNG Cetak</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  // Preload and hydrate certificate background image
  getBase64CertificateTemplate().then((b64) => {
    if (b64) {
      const img = mountEl.querySelector("#memberCertSvg image");
      if (img) img.setAttribute("href", b64);
    }
  });
}


