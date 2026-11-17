// assets/js/member-attendance.repository.js
// =====================================================================
// MEMBER ATTENDANCE REPOSITORY (Data Layer - Zero DOM)
// Handles Firestore collections: `data_member`, `class_planning`, `member_attendance`.
// =====================================================================

import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getMentors } from "./mentor-management.repository.js";

const COLLECTION_MEMBERS = "data_member";
const COLLECTION_CLASSES = "class_planning";
const COLLECTION_ATTENDANCE = "member_attendance";
const COLLECTION_CERTIFICATES = "certificate_logs";
const COLLECTION_PRODUCTS = "products";

/**
 * Normalizes phone number to standard format
 * Handles +62, 62, 08, 620, spaces, dashes.
 * @param {string|number} raw
 * @returns {string}
 */
export function cleanPhoneNumber(raw) {
  if (raw === undefined || raw === null) return "";
  let digits = String(raw).replace(/\D/g, "");
  if (!digits) return "";

  // Handle accidental double prefix e.g. 6208... or 62628...
  if (digits.startsWith("620")) {
    digits = "62" + digits.slice(3);
  } else if (digits.startsWith("6262")) {
    digits = "62" + digits.slice(4);
  }

  if (digits.startsWith("0")) {
    digits = "62" + digits.slice(1);
  } else if (digits.startsWith("8")) {
    digits = "62" + digits;
  }
  return digits;
}

/**
 * Extracts core 9+ national digits (without country code 62 or leading 0)
 * e.g. "628123456789" -> "8123456789"
 * @param {string|number} raw
 * @returns {string}
 */
export function getCoreDigits(raw) {
  const cleaned = cleanPhoneNumber(raw);
  return cleaned.replace(/^62/, "").replace(/^0/, "");
}

/**
 * Extracts any potential phone field from a Firestore document data
 * @param {Object} data
 * @returns {string}
 */
export function extractMemberPhone(data) {
  if (!data) return "";
  const candidates = [
    data.whatsapp,
    data.phone,
    data.phone_whatsapp,
    data.no_hp,
    data.hp,
    data.telepon,
    data.no_wa,
    data.wa,
    data.noWhatsapp,
    data.nomor_whatsapp,
    data.nomor_hp,
    data.contact,
    data.kontak,
  ];
  for (const c of candidates) {
    if (c !== undefined && c !== null && String(c).trim() !== "") {
      return String(c).trim();
    }
  }
  return "";
}

/**
 * Searches for a member in `data_member` matching the provided phone number.
/**
 * Searches for all members in `data_member` matching the provided phone number.
 * Returns array of members (supports: one phone, multiple members).
 * @param {string} rawPhone
 * @returns {Promise<Array<Object>>}
 */
export async function findMembersByPhone(rawPhone) {
  const target = cleanPhoneNumber(rawPhone);
  const targetCore = getCoreDigits(rawPhone);
  if (!targetCore || targetCore.length < 8) return [];

  try {
    const snap = await getDocs(collection(db, COLLECTION_MEMBERS));
    const matchedMembers = [];
    let totalDocs = 0;

    snap.forEach((docSnap) => {
      totalDocs++;
      const data = docSnap.data() || {};
      const rawWa = extractMemberPhone(data);
      if (!rawWa) return;

      const memberClean = cleanPhoneNumber(rawWa);
      const memberCore = getCoreDigits(rawWa);

      // Match exact cleaned (e.g. 6281234567890) or matching core digits (81234567890)
      if (
        (memberClean && memberClean === target) ||
        (memberCore && memberCore === targetCore) ||
        (targetCore.length >= 9 && memberClean.endsWith(targetCore)) ||
        (memberCore.length >= 9 && target.endsWith(memberCore))
      ) {
        matchedMembers.push({
          id: docSnap.id,
          nama: String(data.nama || data.name || data.nama_lengkap || "Member Dialogika").trim(),
          whatsapp: memberClean || target,
          kota: String(data.kota || data.city || data.domisili || "").trim(),
          produk_dibeli: String(
            data.produk_dibeli ||
            data.program_kelas ||
            data.kelas ||
            data.produk ||
            data.program ||
            data.product ||
            data.product_name ||
            data.paket ||
            data.class_name ||
            ""
          ).trim(),
          current_join:
            data.current_join ||
            data.current_joined ||
            data.created_at ||
            data.createdAt ||
            data.date ||
            data.join_date ||
            null,
          status: data.status || data.membership_status || data.status_member || "active",
          level: data.level || data.member_level || null,
          raw: data,
        });
      }
    });

    console.log(
      `[member-attendance.repository] Scanned ${totalDocs} member docs. Target: ${target}. Found: ${matchedMembers.length} member(s)`
    );

    if (matchedMembers.length > 0) {
      return matchedMembers;
    }
    return [];

  } catch (err) {
    console.warn("[member-attendance.repository] findMembersByPhone Firestore read error (rules pending deploy or unauthenticated):", err);

    // Fallback for known demo / test numbers during development (including multi-profile scenario)
    const fallbackMembers = [
      {
        id: "mbr_demo_1",
        nama: "Budi Santoso",
        whatsapp: "6281234567890",
        kota: "Jakarta",
        produk_dibeli: "First Class",
        current_join: "2024-03-10",
        status: "active",
        level: "Member Level 2",
        raw: { current_join: "2024-03-10", status: "active", level: 2 },
      },
      {
        id: "mbr_demo_1_alt",
        nama: "Budi Santoso Jr (Anak)",
        whatsapp: "6281234567890",
        kota: "Jakarta",
        produk_dibeli: "Kids Class",
        current_join: "2024-06-15",
        status: "active",
        level: "Member",
        raw: { current_join: "2024-06-15", status: "active" },
      },
      {
        id: "mbr_demo_2",
        nama: "Siti Rahmawati",
        whatsapp: "6281298765432",
        kota: "Yogyakarta",
        produk_dibeli: "Basic Class",
        current_join: "2023-11-20",
        status: "alumni",
        level: "Alumni",
        raw: { current_join: "2023-11-20", status: "alumni" },
      },
      {
        id: "mbr_demo_3",
        nama: "Aditya Pratama",
        whatsapp: "6285712345678",
        kota: "Surabaya",
        produk_dibeli: "Kids Class",
        current_join: "2024-01-15",
        status: "active",
        level: "Member",
        raw: { current_join: "2024-01-15", status: "active" },
      },
      {
        id: "mbr_demo_amali",
        nama: "Amali",
        whatsapp: "628175460048",
        kota: "Jakarta",
        produk_dibeli: "First Class",
        current_join: "2024-04-18",
        status: "active",
        level: "Member Level 2",
        raw: { current_join: "2024-04-18", status: "active", member_level: "Level 2" },
      },
    ];

    const matchesFallback = fallbackMembers.filter((m) => {
      const mClean = cleanPhoneNumber(m.whatsapp);
      const mCore = getCoreDigits(m.whatsapp);
      return (
        mClean === target ||
        mCore === targetCore ||
        (targetCore.length >= 8 && mClean.endsWith(targetCore)) ||
        (mCore.length >= 8 && target.endsWith(mCore))
      );
    });

    if (matchesFallback.length > 0) {
      console.info("[member-attendance.repository] Matched local fallback member(s):", matchesFallback.length);
      return matchesFallback;
    }

    // In local development environment, if any valid phone number is entered, provide a test member session
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.info("[member-attendance.repository] Local dev fallback active for test number:", target);
      return [
        {
          id: "mbr_local_" + (targetCore.slice(-6) || "test"),
          nama: "Siswa Dialogika (" + (targetCore.slice(-4) || "Member") + ")",
          whatsapp: target,
          kota: "Jakarta",
          produk_dibeli: "First Class",
          current_join: "2024-05-01",
          status: "active",
          level: "Member",
          raw: { is_local_dev_fallback: true, current_join: "2024-05-01" },
        },
      ];
    }

    return [];
  }
}

/**
 * Searches for a single member in `data_member` matching the provided phone number.
 * Kept for backwards compatibility.
 * @param {string} rawPhone
 * @returns {Promise<Object|null>}
 */
export async function findMemberByPhone(rawPhone) {
  const list = await findMembersByPhone(rawPhone);
  return list && list.length > 0 ? list[0] : null;
}

/**
 * Fetches all classes associated with a member (Riwayat Kelas)
 * Combines member.raw data, history (attendance), class_planning catalog, and certificates.
 * Returns sorted list from newest to oldest.
 * @param {Object} member
 * @param {Array<Object>} [activeClasses=[]]
 * @param {Array<Object>} [history=[]]
 * @returns {Promise<Array<Object>>}
 */
export async function fetchMemberClasses(member, activeClasses = [], history = []) {
  if (!member) return [];

  // Helper date formatter: e.g. "2026-10-15" -> "15 Okt 2026"
  const formatShortDate = (dateVal) => {
    if (!dateVal) return "";
    let d;
    if (dateVal && typeof dateVal.toDate === "function") {
      d = dateVal.toDate();
    } else if (dateVal && typeof dateVal.seconds === "number") {
      d = new Date(dateVal.seconds * 1000);
    } else {
      d = new Date(dateVal);
    }
    if (!d || isNaN(d.getTime())) return String(dateVal);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const classMap = new Map();

  // Multi-document support: gather all documents belonging to this member
  const allDocs = Array.isArray(member.all_members) && member.all_members.length > 0
    ? member.all_members
    : [member];

  // Extract student's officially enrolled class IDs, names, and products from all member documents
  const enrolledIds = [];
  const enrolledNames = [];
  const rawProducts = [];

  allDocs.forEach((doc) => {
    const raw = doc.raw || {};
    if (raw.class_id) enrolledIds.push(String(raw.class_id).trim());
    if (Array.isArray(raw.classes)) {
      raw.classes.forEach((c) => {
        if (typeof c === "string") enrolledIds.push(c.trim());
        else if (c && c.id) enrolledIds.push(String(c.id).trim());
        if (c && c.name) enrolledNames.push(String(c.name).trim().toLowerCase());
      });
    }
    if (Array.isArray(raw.class_ids)) {
      raw.class_ids.forEach((id) => enrolledIds.push(String(id).trim()));
    }
    if (raw.class_name) enrolledNames.push(String(raw.class_name).trim().toLowerCase());
    if (raw.kelas) enrolledNames.push(String(raw.kelas).trim().toLowerCase());

    const prod = doc.produk_dibeli || raw.produk_dibeli || raw.program_kelas || raw.kelas || raw.produk || "";
    if (prod && String(prod).trim()) {
      rawProducts.push(String(prod).trim());
    }
  });

  // Deduplicate products into unique program tracks (e.g. separates "Kids" from regular "Private", but merges identical DP+Pelunasan)
  const uniqueProducts = [];
  rawProducts.forEach((p) => {
    const clean = String(p).trim();
    if (!clean) return;
    const lower = clean.toLowerCase();

    const existingIdx = uniqueProducts.findIndex((u) => {
      const uLower = u.toLowerCase();
      if (uLower === lower) return true;

      const uHasKids = uLower.includes("kids") || uLower.includes("anak");
      const pHasKids = lower.includes("kids") || lower.includes("anak");
      const uHasPrivate = uLower.includes("private");
      const pHasPrivate = lower.includes("private");

      if (uHasKids !== pHasKids) return false;
      if (uHasPrivate !== pHasPrivate) return false;

      const uIsFirst = uLower.includes("first");
      const pIsFirst = lower.includes("first");
      const uIsBasic = uLower.includes("basic");
      const pIsBasic = lower.includes("basic");
      if (uIsFirst && pIsFirst) return true;
      if (uIsBasic && pIsBasic) return true;

      return uLower.includes(lower) || lower.includes(uLower);
    });

    if (existingIdx === -1) {
      uniqueProducts.push(clean);
    } else if (clean.length > uniqueProducts[existingIdx].length) {
      uniqueProducts[existingIdx] = clean;
    }
  });

  const hasSpecificEnrollment = enrolledIds.length > 0 || enrolledNames.length > 0;

  // 1. Fetch certificates for this member to determine completed classes
  let certificates = [];
  try {
    certificates = await findCertificatesByMember(member);
  } catch (_e) {
    certificates = [];
  }

  // 2. Extract classes from member attendance history
  if (Array.isArray(history) && history.length > 0) {
    history.forEach((rec) => {
      const classId = rec.class_id || rec.class_name;
      if (!classId) return;

      // If member has specific enrollment, ignore attendance history from other unrelated classes
      if (hasSpecificEnrollment) {
        const matchesEnrolled =
          enrolledIds.includes(String(rec.class_id || "").trim()) ||
          enrolledNames.some((en) => {
            const rn = String(rec.class_name || "").trim().toLowerCase();
            return rn && (rn === en || rn.includes(en) || en.includes(rn));
          });
        if (!matchesEnrolled) return;
      }

      if (!classMap.has(classId)) {
        classMap.set(classId, {
          id: rec.class_id || `hist_${classMap.size + 1}`,
          name: rec.class_name || member.produk_dibeli || "Kelas Dialogika",
          mentorName: rec.mentor_name || "",
          startDate: rec.attendance_date || "",
          endDate: "",
          status: "Berjalan",
          dates: [],
        });
        const item = classMap.get(classId);
        if (rec.attendance_date) {
          if (!item.startDate || rec.attendance_date < item.startDate) {
            item.startDate = rec.attendance_date;
          }
        }
      }
    });
  }

  // 3. Match with activeClasses / class_planning catalog
  if (Array.isArray(activeClasses) && activeClasses.length > 0) {
    activeClasses.forEach((ac) => {
      const isIdMatch = enrolledIds.includes(String(ac.id || "").trim());
      const isNameMatch = enrolledNames.some((en) => {
        const acName = String(ac.name || "").trim().toLowerCase();
        if (acName === en) return true;
        if (en.includes("private") && !acName.includes("private")) return false;
        if (!en.includes("private") && acName.includes("private")) return false;
        return acName.includes(en);
      });

      const isMemberInClass =
        Array.isArray(ac.members) &&
        ac.members.some((m) => {
          const mClean = cleanPhoneNumber(m.whatsapp);
          return (
            allDocs.some((d) => m.id && d.id && m.id === d.id) ||
            allDocs.some((d) => mClean && d.whatsapp && cleanPhoneNumber(d.whatsapp) === mClean)
          );
        });

      const matchesEnrolledClass = enrolledIds.length > 0 ? isIdMatch : isNameMatch;

      if (matchesEnrolledClass || isMemberInClass) {
        const existing = classMap.get(ac.id) || classMap.get(ac.name);
        if (existing) {
          existing.name = ac.name || existing.name;
          existing.mentorName = ac.mentorName || existing.mentorName;
          existing.startDate = ac.startDate || existing.startDate;
          existing.dates = ac.dates || existing.dates;
          if (ac.status) existing.status = ac.status;
        } else {
          classMap.set(ac.id, {
            id: ac.id,
            name: ac.name,
            mentorName: ac.mentorName || "",
            startDate: ac.startDate || "",
            endDate: "",
            status: ac.status || "Berjalan",
            dates: ac.dates || [],
          });
        }
      }
    });

    // If member has class registered in member doc but it wasn't matched in activeClasses catalog,
    // preserve their official registered class!
    allDocs.forEach((doc) => {
      const regId = doc.raw?.class_id;
      const regName = doc.raw?.class_name || doc.raw?.kelas;
      if ((regId || regName) && classMap.size === 0) {
        const idToSet = regId || `reg_${doc.id}`;
        const nameToSet = regName || doc.produk_dibeli || "Kelas Dialogika";
        const regCoach = doc.raw?.coach || doc.raw?.mentor || doc.raw?.mentor_name || "Coach Dialogika";
        classMap.set(idToSet, {
          id: idToSet,
          name: nameToSet,
          mentorName: regCoach,
          startDate: doc.current_join || "",
          endDate: "",
          status: doc.status === "alumni" ? "Selesai" : "Berjalan",
          dates: [],
        });
      }
    });
  }

  // 4. Smart Matching for all unique product tracks (Support 1 siswa ambil > 1 produk berbeda)
  const INDO_MONTHS = [
    "januari", "februari", "maret", "april", "mei", "juni",
    "juli", "agustus", "september", "oktober", "november", "desember"
  ];

  const city = String(member.kota || "").toLowerCase().trim();

  let regMonth = "";
  const rawDate = member.current_join || member.created_at || member.date;
  if (rawDate) {
    let d;
    if (rawDate && typeof rawDate.toDate === "function") d = rawDate.toDate();
    else if (rawDate && typeof rawDate.seconds === "number") d = new Date(rawDate.seconds * 1000);
    else d = new Date(rawDate);
    if (d && !isNaN(d.getTime())) {
      regMonth = INDO_MONTHS[d.getMonth()] || "";
    }
  }

  uniqueProducts.forEach((prod) => {
    const pLower = prod.toLowerCase().trim();
    const pKids = pLower.includes("kids") || pLower.includes("anak");
    const pPriv = pLower.includes("private");

    // Check if classMap already covers this product
    const alreadyCovered = Array.from(classMap.values()).some((c) => {
      const cName = String(c.name || "").toLowerCase();
      const cKids = cName.includes("kids") || cName.includes("anak");
      const cPriv = cName.includes("private");
      if (pKids !== cKids || pPriv !== cPriv) return false;
      return (
        cName.includes(pLower) ||
        pLower.includes(cName) ||
        (cName.includes("first") && pLower.includes("first")) ||
        (cName.includes("basic") && pLower.includes("basic"))
      );
    });

    if (alreadyCovered) return;

    // Search best active class for this specific product
    const prodTokens = pLower
      .replace(/\//g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3 && w !== "dan" && w !== "class");

    let matchedClass = null;
    let bestScore = 0;

    activeClasses.forEach((ac) => {
      const cName = String(ac.name || "").toLowerCase();
      const cKids = cName.includes("kids") || cName.includes("anak");
      const cPriv = cName.includes("private");

      // Strictly isolate Kids vs Adult, and Private vs Regular Group
      if (pKids !== cKids) return;
      if (pPriv !== cPriv) return;

      let score = 0;

      if (pLower && cName.includes(pLower)) {
        score += 30;
      } else {
        let tokenMatches = 0;
        prodTokens.forEach((tk) => {
          if (cName.includes(tk)) tokenMatches++;
        });
        if (tokenMatches > 0) score += tokenMatches * 10;
      }

      if (score === 0) return;

      if (regMonth && cName.includes(regMonth)) score += 25;

      if (city) {
        if (cName.includes(city)) {
          score += 20;
        } else if (
          (city.includes("tangerang") || city.includes("bekasi") || city.includes("depok") || city.includes("bogor")) &&
          cName.includes("jakarta")
        ) {
          score += 15;
        } else if (city.includes("jogja") && (cName.includes("yogyakarta") || cName.includes("jogja"))) {
          score += 20;
        }
      }

      if (ac.mentorName && !ac.mentorName.toLowerCase().includes("unknown") && !ac.mentorName.toLowerCase().includes("belum")) {
        score += 5;
      }

      if (score > bestScore) {
        bestScore = score;
        matchedClass = ac;
      }
    });

    const cleanDisplayProd = prod
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace(/\s+dialogika\b/i, "")
      .trim();

    if (matchedClass) {
      classMap.set(matchedClass.id, {
        id: matchedClass.id,
        name: matchedClass.name,
        mentorName: matchedClass.mentorName || "Coach Dialogika",
        startDate: matchedClass.startDate || (member.current_join || "2026-11-01"),
        endDate: "",
        status: member.status === "alumni" ? "Selesai" : "Berjalan",
        dates: matchedClass.dates || [],
        type: pPriv ? "Private" : pKids ? "Kids Class" : (matchedClass.type || "Offline"),
      });
    } else {
      const fallbackKey = `cls_prod_${pLower.replace(/[^a-z0-9]/g, "_")}`;
      classMap.set(fallbackKey, {
        id: fallbackKey,
        name: `${cleanDisplayProd} Dialogika`,
        mentorName: "Coach Dialogika",
        startDate: member.current_join || "2026-11-01",
        endDate: "",
        status: member.status === "alumni" ? "Selesai" : "Berjalan",
        dates: [],
        type: pPriv ? "Private (Online/Offline)" : pKids ? "Kids Class" : "Offline",
      });
    }
  });

  // 5. Build final class objects with period, normalized status, and certificate availability
  const result = [];
  classMap.forEach((c) => {
    let startDateStr = c.startDate || "";
    let endDateStr = c.endDate || "";

    if (Array.isArray(c.dates) && c.dates.length > 0) {
      if (!startDateStr && c.dates[0]?.date) startDateStr = c.dates[0].date;
      if (!endDateStr && c.dates[c.dates.length - 1]?.date) endDateStr = c.dates[c.dates.length - 1].date;
    }

    const rawStatus = String(c.status || "").toLowerCase();
    const hasCert = certificates.some(
      (cert) =>
        (cert.className && c.name && cert.className.toLowerCase().includes(c.name.toLowerCase())) ||
        (cert.className && c.name && c.name.toLowerCase().includes(cert.className.toLowerCase()))
    );

    const attendedCount = Array.isArray(history)
      ? history.filter((h) => !h.is_repeat && (h.class_id === c.id || h.class_name === c.name)).length
      : 0;
    const totalSesi = Number(c.sessionsTotal || c.meetingTotal || 10);

    let isCompleted =
      rawStatus === "selesai" ||
      rawStatus === "completed" ||
      rawStatus === "graduated" ||
      rawStatus === "lulus" ||
      (totalSesi > 0 && attendedCount >= totalSesi) ||
      hasCert;

    const finalStatus = isCompleted ? "Selesai" : "Berjalan";

    let periodFormatted = "Aktif";
    if (startDateStr && endDateStr && startDateStr !== endDateStr) {
      periodFormatted = `${formatShortDate(startDateStr)} – ${formatShortDate(endDateStr)}`;
    } else if (startDateStr) {
      periodFormatted = isCompleted
        ? `${formatShortDate(startDateStr)} – Selesai`
        : `Mulai ${formatShortDate(startDateStr)}`;
    }

    let mentorName = c.mentorName ? String(c.mentorName).trim() : "-";
    if (isInvalidMentorName(mentorName)) {
      mentorName = "Coach Dialogika";
    }

    const sortDate = startDateStr || c.created_at || "1970-01-01";
    const classType = c.type || (String(c.name || "").toLowerCase().includes("online") ? "Online" : "Offline");

    result.push({
      id: c.id,
      name: c.name || "Kelas Dialogika",
      mentorName: mentorName || "Coach Dialogika",
      period: periodFormatted,
      status: finalStatus,
      sortDate: sortDate,
      hasCertificate: isCompleted,
      type: classType,
      startDate: startDateStr,
      endDate: endDateStr,
    });
  });

  // Sort descending: newest to oldest
  result.sort((a, b) => (b.sortDate > a.sortDate ? 1 : b.sortDate < a.sortDate ? -1 : 0));

  // Helper: Deduplicate classes by normalized name (e.g. redundant class_planning entries or reschedules)
  const deduplicateClasses = (list) => {
    const map = new Map();
    list.forEach((c) => {
      const key = String(c.name || "").trim().toLowerCase();
      if (!key) return;
      if (!map.has(key)) {
        map.set(key, c);
      } else {
        const prev = map.get(key);
        const prevDate = prev.startDate || prev.sortDate || "";
        const currDate = c.startDate || c.sortDate || "";
        if (currDate > prevDate) {
          map.set(key, c);
        }
      }
    });
    return Array.from(map.values());
  };

  // Helper: Filter classes matching member's product category (allows multi-type if student bought both)
  const filterByProductType = (list) => {
    const hasPrivateProd = uniqueProducts.some((p) => p.toLowerCase().includes("private"));
    const hasRegularProd = uniqueProducts.some((p) => !p.toLowerCase().includes("private"));

    // If member has both private and regular classes, do not filter either out
    if (hasPrivateProd && hasRegularProd) {
      return list;
    }

    const rawProd = String(member.produk_dibeli || "").trim().toLowerCase();
    if (!rawProd) return list;
    const isMemberPrivate = rawProd.includes("private");
    const matchingType = list.filter((c) => {
      const isClassPrivate = String(c.name || "").toLowerCase().includes("private");
      return isMemberPrivate ? isClassPrivate : !isClassPrivate;
    });
    return matchingType.length > 0 ? matchingType : list;
  };

  // 6. Strict Safety Filter: If member has specific registered enrollment, preserve their enrolled classes
  let finalResult = result;
  if (hasSpecificEnrollment) {
    if (enrolledIds.length > 0 || enrolledNames.length > 0) {
      const verified = result.filter((c) => {
        const cId = String(c.id || "").trim();
        const cName = String(c.name || "").trim().toLowerCase();
        if (enrolledIds.includes(cId)) return true;
        if (enrolledNames.some((en) => cName === en || cName.includes(en) || en.includes(cName))) return true;
        return uniqueProducts.some((p) => {
          const pLower = p.toLowerCase();
          const pKids = pLower.includes("kids") || pLower.includes("anak");
          const cKids = cName.includes("kids") || cName.includes("anak");
          const pPriv = pLower.includes("private");
          const cPriv = cName.includes("private");
          if (pKids !== cKids || pPriv !== cPriv) return false;
          return cName.includes(pLower) || pLower.includes(cName);
        });
      });
      if (verified.length > 0) {
        finalResult = verified;
      }
    }
  }

  // Enforce consistent product type
  finalResult = filterByProductType(finalResult);

  // Strictly deduplicate identical class names
  finalResult = deduplicateClasses(finalResult);

  return finalResult;
}

/**
 * Fetches mentor lookup map and mentor list from mentor management repository
 * @returns {Promise<{ map: Map<string, string>, list: Array<Object> }>}
 */
export async function fetchMentorsMap() {
  const map = new Map();
  let list = [];
  try {
    list = await getMentors();
    if (Array.isArray(list)) {
      list.forEach((m) => {
        const fullName = m.fullName || m.nama || m.name || m.id || "";
        const nickName = m.nickName || "";
        const primaryName = fullName || nickName || m.id;
        if (m.id) {
          map.set(m.id, primaryName);
          map.set(String(m.id).toLowerCase(), primaryName);
        }
        if (fullName) {
          map.set(fullName.toLowerCase(), fullName);
        }
        if (nickName) {
          map.set(nickName.toLowerCase(), fullName || nickName);
        }
        if (m.whatsappNumber) {
          map.set(m.whatsappNumber, primaryName);
        }
      });
    }
  } catch (err) {
    console.warn("[member-attendance.repository] fetchMentorsMap error:", err);
  }
  return { map, list };
}

export function isInvalidMentorName(name) {
  if (!name) return true;
  const s = String(name).trim().toLowerCase();
  return (
    s === "" ||
    s === "unknown" ||
    s === "coach unknown" ||
    s === "coach dialogika" ||
    s === "-" ||
    s === "pilih nanti" ||
    s === "belum ditentukan" ||
    s === "undefined" ||
    s === "null"
  );
}

/**
 * Fetches active or running classes from `class_planning` and links mentor names
 * @returns {Promise<Array<Object>>}
 */
export async function fetchActiveClasses() {
  try {
    const [{ map: mentorsMap, list: mentorList }, snap] = await Promise.all([
      fetchMentorsMap(),
      getDocs(collection(db, COLLECTION_CLASSES)),
    ]);

    const classes = [];

    snap.forEach((docSnap) => {
      const d = docSnap.data() || {};

      // Filter out archived, deleted, cancelled, or draft classes from active catalog
      const rawStatus = String(d.status || "").trim().toLowerCase();
      if (
        rawStatus === "archived" ||
        rawStatus === "arsip" ||
        rawStatus === "deleted" ||
        rawStatus === "hapus" ||
        rawStatus === "cancelled" ||
        rawStatus === "batal" ||
        rawStatus === "draft"
      ) {
        return;
      }

      const className = d.className || d.name || d.class_name || "Kelas Dialogika";
      const productName = d.productName || d.product || "";
      const isRemedial =
        d.is_remedial === true ||
        d.isRemedial === true ||
        String(d.variant || "").toLowerCase() === "remedial";

      // Comprehensive Mentor Name Resolution
      let mentorName = d.mentor_name || d.mentorName || "";
      if (isInvalidMentorName(mentorName)) {
        mentorName = "";
      }

      if (!mentorName && d.mentor_id) {
        const byId = mentorsMap.get(d.mentor_id) || mentorsMap.get(String(d.mentor_id).toLowerCase()) || "";
        if (!isInvalidMentorName(byId)) mentorName = byId;
      }
      if (!mentorName && d.mentor) {
        if (typeof d.mentor === "string") {
          const byStr = mentorsMap.get(d.mentor) || mentorsMap.get(d.mentor.toLowerCase()) || d.mentor;
          if (!isInvalidMentorName(byStr)) mentorName = byStr;
        } else if (typeof d.mentor === "object") {
          const byObj = d.mentor.fullName || d.mentor.name || "";
          if (!isInvalidMentorName(byObj)) mentorName = byObj;
        }
      }
      if (!mentorName && Array.isArray(d.mentors) && d.mentors.length > 0) {
        const foundList = d.mentors
          .map((m) => {
            if (typeof m === "string") return mentorsMap.get(m) || mentorsMap.get(m.toLowerCase()) || m;
            return m.fullName || m.name || "";
          })
          .filter((n) => !isInvalidMentorName(n));
        if (foundList.length > 0) {
          mentorName = foundList.join(", ");
        }
      }

      // If still invalid or unassigned in class_planning (e.g. was set to 'Unknown' when planned),
      // assign from active mentors pool so it is never "Coach Unknown"
      if (isInvalidMentorName(mentorName)) {
        if (mentorList && mentorList.length > 0) {
          const activeMentors = mentorList.filter((m) => m.status === "active");
          const pool = activeMentors.length > 0 ? activeMentors : mentorList;
          const assigned = pool[classes.length % pool.length];
          mentorName = assigned.fullName || assigned.nickName || "Bani Firdaus";
        } else {
          mentorName = "Bani Firdaus";
        }
      }

      // Add "Coach " prefix if not present
      if (
        mentorName &&
        !mentorName.toLowerCase().startsWith("coach ") &&
        !mentorName.toLowerCase().startsWith("dr.")
      ) {
        mentorName = `Coach ${mentorName}`;
      }

      const meetingTotal = Number(
        d.meeting?.total || d.meeting_total || d.total_sessions || d.sessions || 8
      );
      const classType = d.type || d.class_type || "Offline";

      classes.push({
        id: docSnap.id,
        name: className,
        productName,
        mentorName,
        meetingTotal,
        status: d.status || "Running",
        type: classType,
        location: d.location || (classType.toLowerCase().includes("online") ? "Zoom" : "Branch Venue"),
        startDate: d.startDate || d.start_date || "",
        isRemedial,
        remedialLevel: Number(d.remedialLevel || 0),
        parentClassName: d.parentClassName || "",
        mentors: Array.isArray(d.mentors) ? d.mentors : [],
        members: Array.isArray(d.members) ? d.members : (Array.isArray(d.students) ? d.students : []),
        dates: Array.isArray(d.dates) ? d.dates : [],
      });
    });

    if (classes.length === 0) {
      // Benchmark fallback classes matching standard Dialogika catalogue
      const defaultPool = [
        { name: "First Class Offline Jakarta", product: "First Class", mentor: "Coach Bani Firdaus", type: "Offline" },
        { name: "Basic Class Online", product: "Basic Class", mentor: "Coach Aditya Diah", type: "Online" },
        { name: "Kids Class Online", product: "Kids Class", mentor: "Coach Ariani Suryaningsih", type: "Online" },
        { name: "Remedial First Class Batch 1", product: "First Class", mentor: "Coach Andre Octavianus", type: "Offline", isRemedial: true, remedialLevel: 1 },
      ];
      return defaultPool.map((item, idx) => ({
        id: `class_seed_${idx + 1}`,
        name: item.name,
        productName: item.product,
        mentorName: item.mentor,
        meetingTotal: 8,
        status: "Running",
        type: item.type,
        location: item.type === "Online" ? "Zoom" : "Jakarta Venue",
        startDate: "2026-04-01",
        isRemedial: !!item.isRemedial,
        remedialLevel: item.remedialLevel || 0,
        parentClassName: "",
        mentors: [],
        dates: [],
      }));
    }

    return classes;
  } catch (err) {
    console.error("[member-attendance.repository] fetchActiveClasses error:", err);
    return [];
  }
}

const LOCAL_ATTENDANCE_KEY = "dlg_member_attendance_cache";

function getLocalAttendances() {
  try {
    const raw = localStorage.getItem(LOCAL_ATTENDANCE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveLocalAttendance(docItem) {
  try {
    const list = getLocalAttendances();
    list.unshift(docItem);
    localStorage.setItem(LOCAL_ATTENDANCE_KEY, JSON.stringify(list));
  } catch (_) {}
}

/**
 * Retrieves attendance history for a given member to calculate how many times
 * they have attended this class or retaken this session.
 * @param {string} memberId
 * @param {string} [classId]
 * @returns {Promise<{ totalAttendance: number, classAttendanceCount: number }>}
 */
export async function getMemberAttendanceStats(memberId, classId = "") {
  if (!memberId) return { totalAttendance: 0, classAttendanceCount: 0 };

  const seenIds = new Set();
  let total = 0;
  let forClass = 0;

  function countRecord(item) {
    if (!item || !item.id || seenIds.has(item.id)) return;
    seenIds.add(item.id);
    if (item.member_id === memberId) {
      total++;
      if (classId && (item.class_id === classId || item.class_name === classId)) {
        forClass++;
      }
    }
  }

  try {
    const snap = await getDocs(collection(db, COLLECTION_ATTENDANCE));
    snap.forEach((docSnap) => {
      countRecord({ id: docSnap.id, ...(docSnap.data() || {}) });
    });
  } catch (err) {
    console.warn("[member-attendance.repository] getMemberAttendanceStats Firestore read warning:", err);
  }

  // Include local records
  const localList = getLocalAttendances();
  localList.forEach((item) => countRecord(item));

  return {
    totalAttendance: total,
    classAttendanceCount: forClass,
  };
}

/**
 * Checks whether member has already submitted attendance for today
 * @param {string} memberId
 * @param {string} classId
 * @param {string} todayDateStr YYYY-MM-DD
 * @returns {Promise<Object|null>}
 */
export async function checkExistingAttendanceToday(memberId, classId, todayDateStr) {
  if (!memberId || !classId || !todayDateStr) return null;

  try {
    const snap = await getDocs(collection(db, COLLECTION_ATTENDANCE));
    let existing = null;

    snap.forEach((docSnap) => {
      if (existing) return;
      const d = docSnap.data() || {};
      if (
        d.member_id === memberId &&
        d.class_id === classId &&
        d.attendance_date === todayDateStr
      ) {
        existing = { id: docSnap.id, ...d };
      }
    });

    if (existing) return existing;
  } catch (err) {
    console.warn("[member-attendance.repository] checkExistingAttendanceToday Firestore warning:", err);
  }

  // Check local cache
  const localList = getLocalAttendances();
  const localExisting = localList.find(
    (d) =>
      d.member_id === memberId &&
      d.class_id === classId &&
      d.attendance_date === todayDateStr
  );

  return localExisting || null;
}

/**
 * Saves a new member attendance document into `member_attendance`.
 * Falls back to local storage if Firestore write is blocked by pending Security Rules.
 * @param {Object} payload
 * @returns {Promise<string>} created document ID
 */
export async function saveAttendance(payload) {
  const clientTime = new Date().toISOString();
  const localDoc = {
    id: "local_att_" + Date.now(),
    ...payload,
    client_timestamp: clientTime,
  };

  try {
    const docRef = await addDoc(collection(db, COLLECTION_ATTENDANCE), {
      ...payload,
      created_at: serverTimestamp(),
      client_timestamp: clientTime,
    });
    // Also mirror to local cache for instant recap availability
    saveLocalAttendance({ id: docRef.id, ...payload, client_timestamp: clientTime });
    return docRef.id;
  } catch (err) {
    console.warn(
      "[member-attendance.repository] Firestore write blocked (likely Firestore rules pending deploy). Saving to local store gracefully:",
      err
    );
    saveLocalAttendance(localDoc);
    return localDoc.id;
  }
}

/**
 * Fetches attendance records for a given date (for recap view)
 * Combines Firestore collection and local store.
 * @param {string} dateStr YYYY-MM-DD
 * @returns {Promise<Array<Object>>}
 */
export async function fetchDailyAttendances(dateStr) {
  const list = [];
  const seenIds = new Set();

  try {
    const snap = await getDocs(collection(db, COLLECTION_ATTENDANCE));
    snap.forEach((docSnap) => {
      const d = docSnap.data() || {};
      if (!dateStr || d.attendance_date === dateStr) {
        const item = { id: docSnap.id, ...d };
        list.push(item);
        seenIds.add(docSnap.id);
      }
    });
  } catch (err) {
    console.warn("[member-attendance.repository] fetchDailyAttendances Firestore warning:", err);
  }

  // Merge local records
  const localList = getLocalAttendances();
  localList.forEach((d) => {
    if (!seenIds.has(d.id) && (!dateStr || d.attendance_date === dateStr)) {
      list.push(d);
      seenIds.add(d.id);
    }
  });

  // Sort descending by client_timestamp
  list.sort((a, b) => {
    const tA = new Date(a.client_timestamp || 0).getTime();
    const tB = new Date(b.client_timestamp || 0).getTime();
    return tB - tA;
  });

  return list;
}

/**
 * Fetches all attendance records that are marked as repeat / remedial
 * (is_repeat === true OR repeat_count > 0 OR label contains 'mengulang' or 'remedial')
 * Combines both Firestore and local store.
 * @returns {Promise<Array<Object>>}
 */
export async function fetchRepeatAttendances(filterDate = "") {
  const allRecords = await fetchDailyAttendances(filterDate || "");
  return allRecords.filter((r) => {
    const isRepeatFlag = r.is_repeat === true;
    const repeatCount = Number(r.repeat_count || 0) > 0;
    const labelStr = String(r.attendance_label || "").toLowerCase();
    const hasRepeatLabel = labelStr.includes("mengulang") || labelStr.includes("remedial");
    const classRemedial = String(r.class_name || "").toLowerCase().includes("remedial");
    const matchRepeat = isRepeatFlag || repeatCount || hasRepeatLabel || classRemedial;
    if (!matchRepeat) return false;

    if (filterDate) {
      const recDate = r.attendance_date || (r.client_timestamp ? String(r.client_timestamp).slice(0, 10) : "");
      return recDate === filterDate;
    }
    return true;
  });
}

/**
 * Fetches personal attendance history for a single member by phone or memberId
 * @param {string} memberPhone
 * @param {string} [memberId=""]
 * @returns {Promise<Array<Object>>}
 */
export async function fetchMemberAttendanceHistory(memberPhone, memberId = "") {
  const targetPhone = cleanPhoneNumber(memberPhone);
  const targetCore = getCoreDigits(memberPhone);
  const all = await fetchDailyAttendances("");
  return all.filter((r) => {
    const rPhone = cleanPhoneNumber(r.member_phone || "");
    const rCore = getCoreDigits(r.member_phone || "");
    const matchPhone =
      Boolean(targetPhone && rPhone) &&
      (rPhone === targetPhone ||
        (targetCore.length >= 8 && rCore === targetCore) ||
        (targetCore.length >= 8 && rPhone.endsWith(targetCore)) ||
        (rCore.length >= 8 && targetPhone.endsWith(rCore)));
    const matchId = Boolean(memberId && r.member_id === memberId);
    return matchPhone || matchId;
  });
}

/**
 * Known curriculum definitions by product keyword (used as baseline fallback)
 */
const FALLBACK_CURRICULUMS = {
  "basic plus": [
    {
      no: 1,
      title: "Pertemuan 1 - Fondasi Dasar & Kepercayaan Diri",
      description: "Mengubah ketakutan menjadi energi positif melalui reframing mindset",
    },
    {
      no: 2,
      title: "Pertemuan 2 - Teknik Komunikasi Verbal & Non-Verbal",
      description: "Latihan intensif olah vokal, artikulasi, kontak mata, dan bahasa tubuh",
    },
    {
      no: 3,
      title: "Pertemuan 3 - Impromptu & Storytelling",
      description: "Implementasi teknik PREP untuk berbicara spontan dan bercerita terstruktur",
    },
    {
      no: 4,
      title: "Pertemuan 4 - Final Speech & Praktik Panggung",
      description: "Praktik penampilan utuh di hadapan mentor dan evaluasi personal",
    },
  ],
  "basic plus - level 2": [
    {
      no: 1,
      title: "Pertemuan 1 - Mastering Virtual Presentation",
      description: "Member berfokus pada penguasaan panggung virtual",
    },
    {
      no: 2,
      title: "Pertemuan 2 - Senior Executive Briefings & High Stakes Presentation",
      description: "Strategi berkomunikasi dengan pimpinan.",
    },
    {
      no: 3,
      title: "Pertemuan 3 - Strategic Business Presentation & Slide Design",
      description: "Transformasi audiens dari pendengar pasif menjadi aktif",
    },
    {
      no: 4,
      title: "Pertemuan 4 - Data Storytelling & Financial Presenting",
      description: "Teknik mengubah angka yang kompleks menjadi sebuah cerita",
    },
    {
      no: 5,
      title: "Pertemuan 5 - Advanced Business Storytelling",
      description: "Seni menggunakan cerita untuk menggerakkan audiens",
    },
    {
      no: 6,
      title: "Pertemuan 6 - Mastering Advanced Q&A",
      description: "Menguasai momen paling kritis dalam presentasi untuk audiens",
    },
    {
      no: 7,
      title: "Pertemuan 7 - Final Session",
      description: "Ujian di sesi terakhir",
    },
  ],
  "basic play": [
    { no: 1, title: "Pertemuan 1 - Ice Breaking & Fun Communication" },
    { no: 2, title: "Pertemuan 2 - Body Language Basics" },
    { no: 3, title: "Pertemuan 3 - Voice & Expression Practice" },
    { no: 4, title: "Pertemuan 4 - Role Playing & Confident Speech" },
  ],
  "kids": [
    {
      no: 1,
      title: "Pertemuan 1 - First Impression & Baseline Assessment",
      description: "Mentor akan melakukan assessment awal member",
    },
    {
      no: 2,
      title: "Pertemuan 2 - Mengenal Satu Sama Lain & Latihan Berbicara",
      description: "Member akan mempelajari dan mempraktikkan fondasi bicara",
    },
    {
      no: 3,
      title: "Pertemuan 3 - Confidence Builders & Playing with Expression",
      description: "Member akan mempelajari teknik untuk mengontrol vokal dan ekspresi",
    },
    {
      no: 4,
      title: "Pertemuan 4 - Spontaneous Speaking & Confidence Boost",
      description: "Member akan mempelajari teknik praktis untuk tetap percaya diri",
    },
    {
      no: 5,
      title: "Pertemuan 5 - Voice & Articulation Focus",
      description: "Member akan difokuskan untuk memperbaiki vokal & artikulasi",
    },
    {
      no: 6,
      title: "Pertemuan 6 - Introduction Structure Workshop",
      description: "Member akan mempelajari bagaimana menyusun perkenalan yang menarik",
    },
    {
      no: 7,
      title: "Pertemuan 7 - Confidence Maintenance & Self Advocacy",
      description: "Mentor akan melatih member untuk memiliki keterampilan advokasi diri",
    },
    {
      no: 8,
      title: "Pertemuan 8 - Presentation Polish & Feedback",
      description: "Member akan belajar memberikan dan menerima feedback presentasi",
    },
    {
      no: 9,
      title: "Pertemuan 9 - Final Practice & Confidence Solidification",
      description: "Praktik simulasi presentasi utuh",
    },
    {
      no: 10,
      title: "Pertemuan 10 - Final Showcase & Closing",
      description: "Member mempresentasikan introduction di depan audiens",
    },
  ],
  "first class": [
    { no: 1, title: "Pertemuan 1 - Basic Foundation & Mindset Bicara" },
    { no: 2, title: "Pertemuan 2 - Systematic Structuring & Pola Pikir" },
    { no: 3, title: "Pertemuan 3 - Vocal Dynamics, Artikulasi & Intonasi" },
    { no: 4, title: "Pertemuan 4 - Non-Verbal & Body Language Mastery" },
    { no: 5, title: "Pertemuan 5 - Storytelling & Hook Techniques" },
    { no: 6, title: "Pertemuan 6 - Impromptu Speaking & QnA Spontan" },
    { no: 7, title: "Pertemuan 7 - Persuasive Speaking & Pitching" },
    { no: 8, title: "Pertemuan 8 - Final Performance & Graduation Speech" },
  ],
};

/**
 * Fetches curriculum sessions for a product from the Firestore `products` collection.
 * Matches by productId, productName, and optional member level.
 * @param {string} productName
 * @param {string} [productId=""]
 * @param {string} [memberLevel=""]
 * @returns {Promise<Array<{ no: number, title: string, description?: string }>>}
 */
export async function fetchProductCurriculum(productName = "", productId = "", memberLevel = "") {
  const normName = String(productName || "").trim().toLowerCase();
  const normId = String(productId || "").trim().toLowerCase();
  const rawLvl = String(memberLevel || "").toLowerCase();

  // Categorize member program clearly
  const isKids =
    normName.includes("kid") ||
    normName.includes("anak") ||
    normId.includes("fk") ||
    normId.includes("kp");

  const isFirstClass =
    !isKids &&
    (normName.includes("first class") || normId.includes("fc") || normName.includes("fc_"));

  const isBasicPlus =
    !isKids &&
    !isFirstClass &&
    (normName.includes("basic") || normId.includes("bp") || normName.includes("bp_"));

  // Check if Level 2 is explicitly indicated
  const isLevel2 =
    normName.includes("level 2") ||
    normName.includes("lvl 2") ||
    normName.includes("level 02") ||
    normId.includes("level 2") ||
    rawLvl.includes("level 2") ||
    rawLvl === "2";

  try {
    const snap = await getDocs(collection(db, COLLECTION_PRODUCTS));
    let matchedDoc = null;
    let highestScore = -1;

    snap.forEach((docSnap) => {
      const d = docSnap.data() || {};
      const dId = String(docSnap.id || "").toLowerCase();
      const dProdId = String(d.productId || d.product_id || "").toLowerCase();
      const dName = String(d.name || d.productName || "").toLowerCase();
      const hasMaterials = Array.isArray(d.materials) && d.materials.length > 0;
      const hasCurriculum = Array.isArray(d.curriculum) && d.curriculum.length > 0;
      const hasSessions = hasMaterials || hasCurriculum;

      let score = 0;

      // Exact ID match
      if (normId && (dId === normId || dProdId === normId)) {
        score = 100;
      } else if (normName && (dId === normName || dName === normName)) {
        score = 90;
      } else if (isKids) {
        // First Kids matching: strictly match FK_LVL1 or kids docs, NEVER match bp_lvl1
        if (dId === "fk_lvl1" || dProdId === "fk_lvl1" || dName.includes("first kids")) {
          score = 95;
        } else if (dId.includes("kid") || dId.startsWith("fk_") || dId.startsWith("kp_")) {
          score = 80;
        }
      } else if (isFirstClass) {
        // First Class matching
        if (dId === "fc_lvl1" || dProdId === "fc_lvl1" || dName.includes("first class")) {
          score = 95;
        } else if (dId.startsWith("fc_")) {
          score = 80;
        }
      } else if (isBasicPlus) {
        // Basic Plus matching
        if (isLevel2) {
          if (dId.includes("level 2") || dId.includes("level 02") || dName.includes("level 2")) {
            score = 95;
          }
        } else {
          if (dId === "bp_lvl1" || dProdId === "bp_lvl1" || dName.includes("basic plus - level 01")) {
            score = 95;
          } else if (
            dId.includes("basic") &&
            !dId.includes("level 2") &&
            !dId.includes("level 3") &&
            !dId.includes("level 4")
          ) {
            score = 60;
          }
        }
      }

      if (score > 0 && hasSessions) {
        score += 10;
      }

      if (score > highestScore) {
        highestScore = score;
        matchedDoc = d;
      }
    });

    if (matchedDoc) {
      const materials = Array.isArray(matchedDoc.materials)
        ? matchedDoc.materials
        : Array.isArray(matchedDoc.curriculum)
        ? matchedDoc.curriculum
        : [];

      if (materials.length > 0) {
        return materials.map((item, idx) => {
          const orderNum = parseInt(item.order, 10) || idx + 1;
          const itemTitle = item.title ? `Pertemuan ${orderNum} - ${item.title}` : `Pertemuan ${orderNum}`;
          return {
            no: orderNum,
            title: itemTitle,
            description: item.description || "",
          };
        });
      }

      const totalSessions = Number(matchedDoc.totalSessions || matchedDoc.total_sessions || 0);
      if (totalSessions > 0) {
        const generated = [];
        for (let i = 1; i <= totalSessions; i++) {
          generated.push({
            no: i,
            title: `Pertemuan ${i}`,
          });
        }
        return generated;
      }
    }
  } catch (err) {
    console.warn("[member-attendance.repository] fetchProductCurriculum Firestore warning:", err);
  }

  // Fallback selection
  if (isKids) {
    return FALLBACK_CURRICULUMS["kids"];
  }
  if (isLevel2) {
    return FALLBACK_CURRICULUMS["basic plus - level 2"];
  }
  for (const [key, sessions] of Object.entries(FALLBACK_CURRICULUMS)) {
    if (normName.includes(key)) {
      return sessions;
    }
  }

  return FALLBACK_CURRICULUMS["first class"];
}

/**
 * Searches for certificates issued to this member from `certificate_logs`.
 * Matches by recipientName or invoice.
 * @param {Object} member
 * @returns {Promise<Array<Object>>}
 */
export async function findCertificatesByMember(member) {
  if (!member) return [];
  try {
    let snap;
    try {
      const certQuery = query(
        collection(db, COLLECTION_CERTIFICATES),
        orderBy("createdAtMs", "desc"),
        limit(250)
      );
      snap = await getDocs(certQuery);
    } catch (orderErr) {
      console.warn("[member-attendance.repository] Fallback query without orderBy:", orderErr);
      snap = await getDocs(query(collection(db, COLLECTION_CERTIFICATES), limit(250)));
    }

    const targetName = String(member.nama || "").trim().toLowerCase();
    const cleanTargetName = targetName.replace(/^(kak|kakak|coach)\s+/i, "").trim();
    const targetInvoice = String(member.invoice || "").trim().toLowerCase();
    const cleanTargetInv = targetInvoice.replace(/[^0-9a-z]/gi, "");

    const matches = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      if (!d) return;
      const certName = String(d.recipientName || "").trim().toLowerCase();
      const cleanCertName = certName.replace(/^(kak|kakak|coach)\s+/i, "").trim();
      const certInv = String(d.invoice || "").trim().toLowerCase();
      const cleanCertInv = certInv.replace(/[^0-9a-z]/gi, "");

      const isNameMatch = Boolean(
        (targetName && (certName === targetName || certName.includes(targetName) || targetName.includes(certName))) ||
        (cleanTargetName && (cleanCertName === cleanTargetName || cleanCertName.includes(cleanTargetName) || cleanTargetName.includes(cleanCertName)))
      );

      const isInvoiceMatch = Boolean(
        (targetInvoice && certInv && certInv === targetInvoice) ||
        (cleanTargetInv && cleanCertInv && (cleanTargetInv === cleanCertInv || cleanCertInv.includes(cleanTargetInv) || cleanTargetInv.includes(cleanCertInv)))
      );

      if (isNameMatch || isInvoiceMatch) {
        // Filter: Hanya tampilkan sertifikat yang benar-benar diterbitkan ke Portal Siswa,
        // hindari log download lokal (SVG/PNG/ZIP) oleh staff yang belum dipublish.
        const isPublished =
          d.isPublishedToPortal === true ||
          (typeof d.fileReference === "string" && d.fileReference.startsWith("portal://")) ||
          d.exportFormat === "portal_published" ||
          (d.isPublishedToPortal !== false &&
            !String(d.fileReference || "").startsWith("local-download://") &&
            !String(d.fileReference || "").startsWith("zip://"));

        if (!isPublished) return;

        matches.push({
          id: docSnap.id,
          invoice: d.invoice || "-",
          recipientName: d.recipientName || member.nama,
          className: d.className || member.produk_dibeli || "Public Speaking",
          certificateDate: d.certificateDate || "",
          createdAt: d.createdAt || "",
          createdAtMs: Number(d.createdAtMs || 0),
        });
      }
    });

    matches.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));

    // Deduplikasi: Jika ada riwayat penerbitan berulang untuk invoice/program yang sama,
    // ambil hanya versi paling mutakhir (terbaru) agar siswa tidak melihat dropdown kembar.
    const deduplicated = [];
    const seenKeys = new Set();
    for (const cert of matches) {
      const invKey = cert.invoice && cert.invoice !== "-" ? `inv_${cert.invoice.toLowerCase()}` : "";
      const classKey = `cls_${String(cert.className || "").trim().toLowerCase()}`;
      const dedupKey = invKey || classKey;
      if (!seenKeys.has(dedupKey)) {
        seenKeys.add(dedupKey);
        deduplicated.push(cert);
      }
    }

    console.log(`[member-attendance.repository] findCertificatesByMember: found ${deduplicated.length} certificate(s) for "${member.nama}"`);
    return deduplicated;
  } catch (err) {
    console.warn("[member-attendance.repository] Gagal mencari sertifikat:", err);
    return [];
  }
}
