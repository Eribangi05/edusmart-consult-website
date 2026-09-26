/* ============================================================
   Amategeko y'Umuhanda - Desktop (renderer)
   Offline driving-theory prep. All state persisted via main store.
   ============================================================ */

// ---------- i18n (UI wording) ----------
const I18N = {
  rw: {
    home:"Ahabanza", practice:"Imyitozo", exam:"Ikizamini", signs:"Ibyapa by'umuhanda",
    markings:"Imirongo n'ibimenyetso", practical:"Ikizamini cy'imikorere", flash:"Amakarita yo kwiga", glossary:"Amagambo",
    progress:"Aho ugeze", history:"Amateka y'ibizamini", cert:"Icyemezo cy'imyitozo", settings:"Igenamiterere",
    welcome:"Murakaza neza", tagline:"Iga amategeko y'umuhanda, witegure ikizamini.",
    start_exam:"Tangira ikizamini", start_practice:"Tangira imyitozo",
    questions:"ibibazo", signsN:"ibyapa", terms:"amagambo", readiness:"Uko witeguye",
    passmark:"Amanota atsinda: 12/20", check:"Reba igisubizo", next:"Komeza", finish:"Soza",
    correct:"Ni byo", wrong:"Si byo", your_score:"Amanota yawe", passed:"Watsinze!",
    failed:"Ntiwatsinze", retry:"Ongera ugerageze", back:"Subira inyuma",
    search_sign:"Shakisha icyapa...", search_term:"Shakisha ijambo...",
    all:"Byose", listen:"Umva", candidate:"Umukandida", name:"Amazina yawe yuzuye",
    save:"Bika", reset:"Siba aho wageze", language:"Ururimi", theme:"Uko bigaragara",
    no_history:"Ntabwo urakora ikizamini.", attempts:"ibizamini", avg:"Impuzandengo",
    best:"Amanota meza", get_cert:"Bona icyemezo", cert_locked:"Kora ikizamini utsinde (12/20) kugira ngo ubone icyemezo.",
    print:"Sohora / Chapisha", flip:"Kanda uhindure", weak:"Aho ukunda kwibeshya",
    time_left:"Igihe gisigaye", question:"Ikibazo", of:"muri",
    school_setup:"Kwiyandikisha kw'ishuri", school_name:"Izina ry'ishuri",
    location:"Aho riherereye", contact:"Telefoni / Imeyili", save_continue:"Bika ukomeze",
    login:"Injira", choose_candidate:"Hitamo umukandida", create_account:"Fungura konti",
    no_account:"Nta konti ufite? Fungura konti", enter_pin:"Andika PIN", pin:"PIN (imibare 4-8)",
    confirm_pin:"Emeza PIN", phone10:"Nimero ya telefoni (imibare 10)", wrong_pin:"PIN si yo",
    pin_mismatch:"PIN ntizihuye", phone_exists:"Iyi telefoni isanzwe yanditse - injiramo",
    invalid_phone:"Telefoni igomba kugira imibare 10", invalid_pin:"PIN igomba kuba imibare 4-8",
    logout:"Sohoka", change_pin:"Hindura PIN", old_pin:"PIN ya kera", new_pin:"PIN nshya",
    school_info:"Amakuru y'ishuri", register:"Fungura konti", welcome_school:"Murakaza neza",
    lessons:"Amasomo", lessons_hint:"Iga, hanyuma wisuzumishe",
    lessons_intro:"Hitamo isomo, usome amabwiriza y'ingenzi, hanyuma utangire imyitozo y'iryo somo.",
    trans_review:"",
    key_points:"Ingingo z'ingenzi", start_quiz:"Tangira imyitozo",
    study:"Iga ibibazo", study_hint:"Reba ibibazo n'ibisubizo byose",
    revision:"Impapuro zo kwiga", revision_hint:"Sohora impapuro wsome cyangwa wige nta mudasobwa",
    study_intro:"Iga ibibazo byose n'ibisubizo byabyo mbere yo gukora ikizamini. Igisubizo cy'ukuri kigaragara mu icyatsi.",
    correct_answer:"Igisubizo nyacyo",
    legal:"Itegeko ry'Amategeko", legal_hint:"Soma amategeko nyayo (Igazeti ya Leta)",
    legal_intro:"Aya ni amategeko nyayo y'umuhanda nk'uko yasohotse mu Igazeti ya Leta. Yakoreshwa mu kwiga no kugenzura.",
    search_law:"Shakisha mu mategeko...", open_law:"Fungura", page:"Urupapuro",
    cu_title:"Kuvugurura ibikubiyemo", cu_none:"Ukoresha ibibazo n'ibyapa byaje muri porogaramu.",
    cu_import:"Injiza ivugurura", cu_remove:"Kuraho", cu_removed:"Ivugurura ryakuweho",
    school_logo:"Ikirango (logo)", school_stamp:"Kashe y'ishuri", upload:"Hitamo ishusho",
    my_details:"Amakuru yanjye", edit:"Hindura", phone:"Telefoni",
    owner_login:"Injira nk'umwarimu / nyir'ishuri", owner_account:"Konti y'umwarimu / nyir'ishuri",
    owner_intro:"Iyi konti ni yo yonyine ihindura amakuru y'ishuri. Shyiraho PIN y'ibanga.",
    owner_name:"Amazina y'umwarimu / nyiri", owner_pin:"PIN y'umwarimu (imibare 4-8)", owner_badge:"Umwarimu",
    act_title:"Emeza porogaramu", act_intro:"Iyi mudasobwa isaba code yo kuyikoresha. Ohereza iyi 'Machine ID' ku wagenewe gutanga code, wandike code wahawe.",
    act_machine:"Machine ID (iyi mudasobwa)", act_code:"Code (INGA-XXXX-XXXX-DESK-ROAD)", act_activate:"Emeza",
    act_ok:"Byemejwe!", act_bad:"Code ntiyemewe kuri iyi mudasobwa.",
    report_q:"Menyesha ikibazo", report_note:"Andika icyo ubona (si ngombwa)", report_send:"Ohereza", report_thanks:"Murakoze, twabyakiriye.",
    dashboard:"Ubuyobozi bw'ishuri", candidates:"Abakandida", reports_title:"Ibibazo byamenyeshejwe", no_reports:"Nta kibazo cyamenyeshejwe.", resolve:"Byakemuwe", export_csv:"Kohereza CSV",
    exams_taken:"Ibizamini", best_score:"Amanota meza", avg_score:"Impuzandengo", last_active:"Igihe cya nyuma", exam_ready:"Yiteguye", not_ready:"Ntiyiteguye", no_candidates:"Nta bakandida barahari.",
    backup:"Bika amakuru (backup)", restore:"Garura amakuru", backup_done:"Byabitswe", restore_done:"Byagaruwe", restore_bad:"Dosiye ntiyemewe",
    flag:"Shyira akamenyetso", flagged:"Bifite akamenyetso", five_min:"Hasigaye iminota itanu.",
    font_size:"Ingano y'inyuguti", locked_wait:"Wagerageje PIN nabi kenshi. Tegereza", cert_serial:"Nimero y'icyemezo",
    ob_skip:"Simbuka", ob_next:"Komeza", ob_start:"Tangira",
    g_learn:"KWIGA", g_exam:"IKIZAMINI", g_ref:"IBYITABWAHO", g_me:"KONTI YANJYE", g_manage:"UBUYOBOZI",
  },
  en: {
    home:"Home", practice:"Practice", exam:"Mock exam", signs:"Road signs",
    markings:"Markings & signals", practical:"Practical test", flash:"Flashcards", glossary:"Glossary",
    progress:"Progress", history:"Exam history", cert:"Practice certificate", settings:"Settings",
    welcome:"Welcome", tagline:"Prepare for the provisional driving-licence theory test. It works fully offline.",
    start_exam:"Start exam", start_practice:"Start practice",
    questions:"questions", signsN:"signs", terms:"terms", readiness:"Readiness",
    passmark:"Pass mark: 12/20", check:"Check", next:"Next", finish:"Finish",
    correct:"Correct!", wrong:"Incorrect", your_score:"Your score", passed:"Passed",
    failed:"Not passed", retry:"Retry", back:"Back",
    search_sign:"Search a sign...", search_term:"Search a term...",
    all:"All", listen:"Listen", candidate:"Candidate", name:"Full name",
    save:"Save", reset:"Reset all", language:"Language", theme:"Theme",
    no_history:"No exams taken yet.", attempts:"attempts", avg:"Average",
    best:"Best", get_cert:"Get certificate", cert_locked:"Pass an exam (12/20) to unlock the certificate.",
    print:"Print / Save PDF", flip:"Flip", weak:"Areas to improve",
    time_left:"Time left", question:"Question", of:"of",
    school_setup:"Driving-school setup", school_name:"Driving-school name",
    location:"Location", contact:"Phone / Email", save_continue:"Save and continue",
    login:"Sign in", choose_candidate:"Choose a candidate", create_account:"Create a new account",
    no_account:"No account? Create one", enter_pin:"Enter PIN", pin:"PIN (4-8 digits)",
    confirm_pin:"Confirm PIN", phone10:"Phone (10 digits)", wrong_pin:"Wrong PIN",
    pin_mismatch:"PINs don't match", phone_exists:"This phone already has an account",
    invalid_phone:"Phone must be 10 digits", invalid_pin:"PIN must be 4-8 digits",
    logout:"Log out", change_pin:"Change PIN", old_pin:"Old PIN", new_pin:"New PIN",
    school_info:"School info", register:"Register", welcome_school:"Welcome",
    lessons:"Lessons", lessons_hint:"Learn, then quiz yourself",
    lessons_intro:"Pick a lesson, read the key rules, then start a quiz on that topic.",
    trans_review:"English translations of the exam questions are still being reviewed. If any wording is unclear, switch to Kinyarwanda (the language of the official test).",
    key_points:"Key points", start_quiz:"Start the quiz",
    study:"Study questions", study_hint:"Browse all questions & answers",
    revision:"Revision sheets", revision_hint:"Print sheets to study or revise away from the computer",
    study_intro:"Study every question with its answer before the test. The correct answer is shown in green.",
    correct_answer:"The correct answer",
    legal:"The Road Code Law", legal_hint:"Read the actual law (Official Gazette)",
    legal_intro:"These are the actual road-code laws as published in the Official Gazette. For study and reference.",
    search_law:"Search the law...", open_law:"Open", page:"Page",
    cu_title:"Content updates", cu_none:"Using the questions & signs that shipped with the app.",
    cu_import:"Import update", cu_remove:"Remove", cu_removed:"Update removed",
    school_logo:"Logo", school_stamp:"School stamp", upload:"Choose image",
    my_details:"My details", edit:"Edit", phone:"Phone",
    owner_login:"Sign in as teacher / school owner", owner_account:"Teacher / school-owner account",
    owner_intro:"This is the only account that can edit the school details. Set a private PIN.",
    owner_name:"Teacher / owner name", owner_pin:"Owner PIN (4-8 digits)", owner_badge:"Teacher",
    act_title:"Activate this app", act_intro:"This computer needs an activation code. Send this Machine ID to your code provider, then enter the code you receive.",
    act_machine:"Machine ID (this computer)", act_code:"Code (INGA-XXXX-XXXX-DESK-ROAD)", act_activate:"Activate",
    act_ok:"Activated!", act_bad:"That code is not valid for this computer.",
    report_q:"Report a problem", report_note:"Add a note (optional)", report_send:"Send", report_thanks:"Thank you, we have noted it.",
    dashboard:"School dashboard", candidates:"Candidates", reports_title:"Reported questions", no_reports:"No questions reported.", resolve:"Resolve", export_csv:"Export CSV",
    exams_taken:"Exams", best_score:"Best", avg_score:"Average", last_active:"Last active", exam_ready:"Ready", not_ready:"Not ready", no_candidates:"No candidates yet.",
    backup:"Back up data", restore:"Restore data", backup_done:"Backed up", restore_done:"Restored", restore_bad:"Unrecognized file",
    flag:"Flag", flagged:"Flagged", five_min:"Five minutes remaining.",
    font_size:"Text size", locked_wait:"Too many wrong PINs. Wait", cert_serial:"Certificate no.",
    ob_skip:"Skip", ob_next:"Next", ob_start:"Get started",
    g_learn:"LEARN", g_exam:"EXAM", g_ref:"REFERENCE", g_me:"MY ACCOUNT", g_manage:"MANAGEMENT",
  },
  fr: {
    home:"Accueil", practice:"S'entraîner", exam:"Examen blanc", signs:"Panneaux routiers",
    markings:"Marquages et signaux", practical:"Examen pratique", flash:"Cartes mémo", glossary:"Lexique",
    progress:"Progression", history:"Historique des examens", cert:"Certificat d'entraînement", settings:"Paramètres",
    welcome:"Bienvenue", tagline:"Préparez l'examen théorique du permis provisoire. Fonctionne hors ligne.",
    start_exam:"Démarrer l'examen", start_practice:"S'entraîner",
    questions:"questions", signsN:"panneaux", terms:"termes", readiness:"Préparation",
    passmark:"Seuil de réussite : 12/20", check:"Vérifier", next:"Suivant", finish:"Terminer",
    correct:"Correct !", wrong:"Incorrect", your_score:"Votre score", passed:"Réussi",
    failed:"Échoué", retry:"Réessayer", back:"Retour",
    search_sign:"Rechercher un panneau...", search_term:"Rechercher un terme...",
    all:"Tous", listen:"Écouter", candidate:"Candidat", name:"Nom complet",
    save:"Enregistrer", reset:"Réinitialiser", language:"Langue", theme:"Thème",
    no_history:"Aucun examen passé.", attempts:"examens", avg:"Moyenne",
    best:"Meilleur", get_cert:"Obtenir le certificat", cert_locked:"Réussissez un examen (12/20) pour débloquer le certificat.",
    print:"Imprimer / PDF", flip:"Retourner", weak:"Points à améliorer",
    time_left:"Temps restant", question:"Question", of:"sur",
    school_setup:"Configuration de l'auto-école", school_name:"Nom de l'auto-école",
    location:"Emplacement", contact:"Téléphone / E-mail", save_continue:"Enregistrer et continuer",
    login:"Se connecter", choose_candidate:"Choisir un candidat", create_account:"Créer un compte",
    no_account:"Pas de compte ? Créez-en un", enter_pin:"Saisir le PIN", pin:"PIN (4-8 chiffres)",
    confirm_pin:"Confirmer le PIN", phone10:"Téléphone (10 chiffres)", wrong_pin:"PIN incorrect",
    pin_mismatch:"Les PIN ne correspondent pas", phone_exists:"Ce téléphone a déjà un compte",
    invalid_phone:"Le téléphone doit avoir 10 chiffres", invalid_pin:"Le PIN doit avoir 4-8 chiffres",
    logout:"Déconnexion", change_pin:"Changer le PIN", old_pin:"Ancien PIN", new_pin:"Nouveau PIN",
    school_info:"Infos de l'école", register:"S'inscrire", welcome_school:"Bienvenue",
    lessons:"Leçons", lessons_hint:"Apprenez, puis testez-vous",
    lessons_intro:"Choisissez une leçon, lisez les règles clés, puis commencez un quiz sur ce sujet.",
    trans_review:"Les traductions françaises des questions d'examen sont en cours de révision. En cas de doute, passez au kinyarwanda (la langue de l'examen officiel).",
    key_points:"Points clés", start_quiz:"Commencer le quiz",
    study:"Étudier les questions", study_hint:"Parcourir toutes les Q&R",
    revision:"Fiches de révision", revision_hint:"Imprimez des fiches pour réviser hors de l'ordinateur",
    study_intro:"Étudiez chaque question avec sa réponse avant l'examen. La bonne réponse est en vert.",
    correct_answer:"La bonne réponse",
    legal:"Le Code de la route", legal_hint:"Lire la loi officielle (Journal Officiel)",
    legal_intro:"Voici les textes officiels du code de la route, tels que publiés au Journal Officiel. Pour l'étude et la référence.",
    search_law:"Rechercher dans la loi...", open_law:"Ouvrir", page:"Page",
    cu_title:"Mises à jour du contenu", cu_none:"Utilise les questions et panneaux fournis avec l'application.",
    cu_import:"Importer une mise à jour", cu_remove:"Supprimer", cu_removed:"Mise à jour supprimée",
    school_logo:"Logo", school_stamp:"Cachet de l'école", upload:"Choisir une image",
    my_details:"Mes informations", edit:"Modifier", phone:"Téléphone",
    owner_login:"Se connecter comme enseignant / propriétaire", owner_account:"Compte enseignant / propriétaire",
    owner_intro:"Ce compte est le seul à pouvoir modifier les infos de l'école. Définissez un PIN privé.",
    owner_name:"Nom de l'enseignant / propriétaire", owner_pin:"PIN propriétaire (4-8 chiffres)", owner_badge:"Enseignant",
    act_title:"Activer l'application", act_intro:"Cet ordinateur nécessite un code d'activation. Envoyez ce Machine ID à votre fournisseur, puis saisissez le code reçu.",
    act_machine:"Machine ID (cet ordinateur)", act_code:"Code (INGA-XXXX-XXXX-DESK-ROAD)", act_activate:"Activer",
    act_ok:"Activé !", act_bad:"Ce code n'est pas valide pour cet ordinateur.",
    report_q:"Signaler un problème", report_note:"Ajouter une note (facultatif)", report_send:"Envoyer", report_thanks:"Merci, c'est noté.",
    dashboard:"Tableau de bord", candidates:"Candidats", reports_title:"Questions signalées", no_reports:"Aucune question signalée.", resolve:"Résoudre", export_csv:"Exporter CSV",
    exams_taken:"Examens", best_score:"Meilleur", avg_score:"Moyenne", last_active:"Dernière activité", exam_ready:"Prêt", not_ready:"Pas prêt", no_candidates:"Aucun candidat.",
    backup:"Sauvegarder", restore:"Restaurer", backup_done:"Sauvegardé", restore_done:"Restauré", restore_bad:"Fichier non reconnu",
    flag:"Marquer", flagged:"Marquées", five_min:"Cinq minutes restantes.",
    font_size:"Taille du texte", locked_wait:"Trop de PIN erronés. Attendez", cert_serial:"N° du certificat",
    ob_skip:"Passer", ob_next:"Suivant", ob_start:"Commencer",
    g_learn:"APPRENDRE", g_exam:"EXAMEN", g_ref:"RÉFÉRENCE", g_me:"MON COMPTE", g_manage:"GESTION",
  }
};

const CAT_LABELS = {
  rusange:{rw:"Rusange",en:"General",fr:"Général"},
  ibyapa:{rw:"Ibyapa",en:"Road signs",fr:"Panneaux"},
  amatara:{rw:"Amatara",en:"Lights",fr:"Feux"},
  imirongo:{rw:"Imirongo",en:"Markings",fr:"Marquages"},
  inzira:{rw:"Inzira",en:"Roads",fr:"Routes"},
  umuvuduko:{rw:"Umuvuduko",en:"Speed",fr:"Vitesse"},
  ibipimo:{rw:"Ibipimo",en:"Measures",fr:"Mesures"},
  ibikoresho:{rw:"Ibikoresho",en:"Equipment",fr:"Équipement"},
  ibyaha:{rw:"Ibyaha",en:"Offences",fr:"Infractions"},
  amagambo:{rw:"Amagambo",en:"Terms",fr:"Termes"},
  uruhushya:{rw:"Uruhushya",en:"Licence",fr:"Permis"},
};

// Clean per-category icons (colored rounded tile + white glyph) - used on the lesson cards.
const CAT_ICON = {
  // General rules - clipboard with checks
  rusange:`<rect width="64" height="64" rx="16" fill="#1565c0"/><rect x="18" y="13" width="28" height="39" rx="4" fill="#fff"/><rect x="25" y="9" width="14" height="8" rx="3" fill="#fff"/><rect x="26" y="10" width="12" height="6" rx="2" fill="#1565c0"/><path d="M23 26 l3 3 5-6" stroke="#1565c0" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="34" y="26" width="9" height="2.6" rx="1.3" fill="#1565c0"/><path d="M23 36 l3 3 5-6" stroke="#1565c0" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="34" y="36" width="9" height="2.6" rx="1.3" fill="#1565c0"/>`,
  // Road signs - warning triangle
  ibyapa:`<rect width="64" height="64" rx="16" fill="#e53935"/><polygon points="32,13 53,49 11,49" fill="#fff"/><rect x="30" y="25" width="4" height="13" rx="2" fill="#e53935"/><circle cx="32" cy="44" r="2.6" fill="#e53935"/>`,
  // Lights & signals - traffic light
  amatara:`<rect width="64" height="64" rx="16" fill="#00695c"/><rect x="24" y="10" width="16" height="44" rx="6" fill="#fff"/><circle cx="32" cy="20" r="4.6" fill="#e5484d"/><circle cx="32" cy="32" r="4.6" fill="#ffb020"/><circle cx="32" cy="44" r="4.6" fill="#1db954"/>`,
  // Road markings - road with edges + dashed centre
  imirongo:`<rect width="64" height="64" rx="16" fill="#455a64"/><rect x="19" y="12" width="3.4" height="40" fill="#fff"/><rect x="41.6" y="12" width="3.4" height="40" fill="#fff"/><rect x="30.6" y="14" width="2.8" height="8" fill="#fff"/><rect x="30.6" y="28" width="2.8" height="8" fill="#fff"/><rect x="30.6" y="42" width="2.8" height="8" fill="#fff"/>`,
  // Speed - speedometer
  umuvuduko:`<rect width="64" height="64" rx="16" fill="#e65100"/><path d="M15 43 A 19 19 0 0 1 49 43" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><line x1="32" y1="43" x2="42" y2="29" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><circle cx="32" cy="43" r="3.4" fill="#fff"/>`,
  // Lanes & priority - straight arrow with a right branch
  inzira:`<rect width="64" height="64" rx="16" fill="#6a1b9a"/><path d="M26 50 L26 20" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M20 26 L26 19 L32 26" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 34 L40 34 L40 44" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M34 44 L40 51 L46 44" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  // Dimensions & measures - ruler
  ibipimo:`<rect width="64" height="64" rx="16" fill="#2e7d32"/><rect x="13" y="26" width="38" height="14" rx="2" fill="#fff"/><rect x="19" y="26" width="2.4" height="6" fill="#2e7d32"/><rect x="26" y="26" width="2.4" height="8" fill="#2e7d32"/><rect x="33" y="26" width="2.4" height="6" fill="#2e7d32"/><rect x="40" y="26" width="2.4" height="8" fill="#2e7d32"/><rect x="47" y="26" width="2.4" height="6" fill="#2e7d32"/>`,
  // Licence & permits - ID card
  uruhushya:`<rect width="64" height="64" rx="16" fill="#5d4037"/><rect x="12" y="18" width="40" height="28" rx="4" fill="#fff"/><circle cx="23" cy="28" r="4.4" fill="#5d4037"/><path d="M17 39 a6 6 0 0 1 12 0 z" fill="#5d4037"/><rect x="33" y="25" width="15" height="3" rx="1.5" fill="#5d4037"/><rect x="33" y="32" width="15" height="3" rx="1.5" fill="#5d4037"/><rect x="33" y="39" width="10" height="3" rx="1.5" fill="#5d4037"/>`,
  // Terms / glossary - open book
  amagambo:`<rect width="64" height="64" rx="16" fill="#0277bd"/><path d="M32 20c-4-3-11-3-16-2v25c5-1 12-1 16 2 4-3 11-3 16-2V18c-5-1-12-1-16 2z" fill="#fff"/><line x1="32" y1="22" x2="32" y2="47" stroke="#0277bd" stroke-width="2.4"/>`,
  // General equipment / offences fallbacks reuse general styling
  ibikoresho:`<rect width="64" height="64" rx="16" fill="#37474f"/><path d="M40 20a10 10 0 0 0-13 12l-11 11 5 5 11-11a10 10 0 0 0 12-13l-6 6-5-1-1-5z" fill="#fff"/>`,
  ibyaha:`<rect width="64" height="64" rx="16" fill="#b71c1c"/><rect x="29" y="16" width="6" height="22" rx="3" fill="#fff"/><circle cx="32" cy="46" r="4" fill="#fff"/>`,
};
function catIcon(cat, px){ const svg=CAT_ICON[cat]; return svg?`<svg viewBox="0 0 64 64" style="width:${px||52}px;height:${px||52}px">${svg}</svg>`:'📖'; }
function chipIcon(cat){ const svg=CAT_ICON[cat]; return svg?`<svg viewBox="0 0 64 64" style="width:18px;height:18px;vertical-align:middle;margin-right:6px">${svg}</svg>`:''; }

// ---------- Markings & signals (full port of Android RoadMarkings.ALL, SVG-drawn) ----------
const MK_GROUPS = ['imirongo','amatara','abapolisi'];
const MK_GROUP_LABEL = {
  imirongo:{rw:'Imirongo',en:'Road markings',fr:'Marquages'},
  amatara:{rw:'Amatara',en:'Traffic lights',fr:'Feux'},
  abapolisi:{rw:'Umupolisi',en:'Police signals',fr:'Police'},
};
const MARKINGS = [
  // ---- road markings (imirongo) ----
  ['M_SOLID','solid_white','imirongo',"Umurongo wera ukomeje","Solid white line","Ntugomba kuwurenga cyangwa kunyuranaho; ugabanya ibisate by'umuhanda.","Do not cross or overtake over it; it separates lanes or directions."],
  ['M_BROKEN','broken_white','imirongo',"Umurongo wera ucagaguye","Broken white line","Ushobora kuwurenga cyangwa kunyuranaho iyo umuhanda ufunguye kandi nta kaga.","You may cross or overtake when the road is clear and it is safe."],
  ['M_DOUBLE','double_solid','imirongo',"Imirongo ibiri ikomeje","Double solid line","Birabujijwe kuyirenga cyangwa kunyuranaho impande zombi.","Crossing or overtaking is prohibited from both directions."],
  ['M_MIXED','solid_broken','imirongo',"Ukomeje n'ucagaguye","One solid, one broken","Urenga gusa uvuye ku ruhande rw'umurongo ucagaguye.","Cross only from the side of the broken line."],
  ['M_ZEBRA','zebra','imirongo',"Inzira y'abanyamaguru","Pedestrian crossing (zebra)","Aho abanyamaguru bambukira; guha inzira abanyamaguru.","Where pedestrians cross; give way to pedestrians."],
  ['M_STOP','stop_line','imirongo',"Umurongo wo guhagarara","Stop line","Hagarara mbere y'uyu murongo ku kimenyetso cya STOP cyangwa itara ritukura.","Stop before this line at a STOP sign or red light."],
  ['M_ARROW','lane_arrow','imirongo',"Umwambi w'icyerekezo","Lane direction arrow","Werekana icyerekezo ugomba gukurikira uri muri iki gisate.","Shows the direction you must follow from this lane."],
  ['M_YELLOW','yellow_edge','imirongo',"Umurongo w'umuhondo ku nkombe","Yellow edge line","Birabujijwe guhagarara cyangwa gupaki aho uyu murongo uri.","No stopping or parking where this yellow line is marked."],
  ['M_GIVEWAY','giveway','imirongo',"Umurongo wo gutanga inzira","Give-way line","Guha inzira ibinyabiziga biri ku muhanda ufite uburenganzira.","Give way to traffic on the priority road."],
  ['M_BOX','box_junction','imirongo',"Ubuso bufite imisaraba y'umuhondo","Yellow box junction","Ntwinjire kuri ubu buso keretse igihe aho usohokera hafunguye.","Do not enter the box unless your exit is clear."],
  ['M_HATCH','diagonal_hatch','imirongo',"Ubuso bwambitswe imirongo","Hatched / chevron area","Butandukanya imigendere y'ibinyabiziga; ntugomba kubugendaho.","It separates traffic streams; you must not drive on it."],
  ['M_BUS','bus_lane','imirongo',"Agahanda k'ibinyamitende","Bus / public-transport lane","Kagenewe bisi n'ibinyabiziga rusange gusa mu masaha yagenwe.","Reserved for buses and public transport only during set hours."],
  ['M_CYCLE','cycle_lane','imirongo',"Agahanda k'amagare","Cycle lane","Kagenewe abanyamagare gusa; ibindi binyabiziga ntibikagendamo.","Reserved for cyclists only; other vehicles must keep out."],
  // ---- traffic lights (amatara) ----
  ['L_RED','light_red','amatara',"Itara ritukura","Red light","Hagarara; ntugomba kurenga umurongo wo guhagarara.","Stop; you must not go past the stop line."],
  ['L_AMBER','light_amber','amatara',"Itara ry'umuhondo","Amber light","Itegure guhagarara; ntutangire kwambuka.","Prepare to stop; do not start crossing."],
  ['L_GREEN','light_green','amatara',"Itara ry'icyatsi","Green light","Ushobora gukomeza iyo inzira ifunguye.","You may proceed if the way is clear."],
  ['L_REDAMBER','light_red_amber','amatara',"Umutuku n'umuhondo icyarimwe","Red + amber together","Itara rigiye guhinduka icyatsi; komeza uhagaze kugeza rimyatse icyatsi.","The light is about to turn green; keep waiting until green shows."],
  ['L_ARROW_L','light_arrow_left','amatara',"Umwambi w'icyatsi (ibumoso)","Green arrow (left)","Wemerewe gukata ibumoso gusa igihe uyu mwambi waka.","You may turn left only while this green arrow is lit."],
  ['L_ARROW_R','light_arrow_right','amatara',"Umwambi w'icyatsi (iburyo)","Green arrow (right)","Wemerewe gukata iburyo gusa igihe uyu mwambi waka.","You may turn right only while this green arrow is lit."],
  ['L_ARROW_S','light_arrow_straight','amatara',"Umwambi w'icyatsi (imbere)","Green arrow (straight)","Wemerewe gukomeza imbere gusa igihe uyu mwambi waka.","You may go straight ahead only while this green arrow is lit."],
  ['L_FLASH','light_amber_flash','amatara',"Itara ry'umuhondo rimyatsa","Flashing amber","Komeza witonze utange inzira; ntibitegeka guhagarara ariko witondere icyago.","Proceed with caution and give way; not a stop, but a hazard warning."],
  ['L_PED_STOP','light_ped_stop','amatara',"Umuntu utukura: hagarara","Pedestrian red (stand)","Ishusho itukura y'umuntu uhagaze: abanyamaguru bategereza, ntibambuke.","A red standing figure: pedestrians must wait and not cross."],
  ['L_PED_GO','light_ped_go','amatara',"Umuntu w'icyatsi: ambuka","Pedestrian green (walk)","Ishusho y'icyatsi y'umuntu ugenda: abanyamaguru bashobora kwambuka bitonze.","A green walking figure: pedestrians may cross with care."],
  // ---- police signals (abapolisi) ----
  ['P_STOP_ALL','police_stop_all','abapolisi',"Ukuboko hejuru: buri wese ahagarara","Arm raised up: everyone stops","Umupolisi uzamuye ukuboko hejuru: abaturutse impande zose bagomba guhagarara.","Officer with one arm raised vertically: traffic from every direction must stop."],
  ['P_ARMS_SIDE','police_arms_side','abapolisi',"Amaboko atambitse impande zombi","Arms out sideways","Abaturutse imbere n'inyuma y'umupolisi bahagarara; abari ku mpande ze bashobora gukomeza.","Traffic facing the officer's chest or back stops; traffic to the sides may go."],
  ['P_STOP_FRONT','police_stop_front','abapolisi',"Ukuboko imbere: hagarara","One arm out to the front","Ukuboko kumwe kwatambitswe imbere kubwira ababyerekejeho guhagarara.","One arm extended toward the front tells traffic in front to stop."],
  ['P_GO','police_beckon','abapolisi',"Gutumira ngo utambuke","Beckoning you to proceed","Umupolisi akuzungurutsa ukuboko akwereka ko wemerewe gukomeza.","The officer waves an arm to invite you to move forward."],
  ['P_SLOW','police_slow','abapolisi',"Ukuboko kumanuka: gabanya umuvuduko","Arm moving down: slow down","Umupolisi amanura ukuboko buhoro akwereka ko ugomba kugabanya umuvuduko.","The officer moves an arm up and down to tell you to slow down."],
].map(a=>({id:a[0],kind:a[1],group:a[2],name:{rw:a[3],en:a[4],fr:a[4]},meaning:{rw:a[5],en:a[6],fr:a[6]}}));

// SVG art per marking kind (viewBox 0 0 120 80). Road bg for imirongo; housing for lights; figure for police.
const ROAD = '<rect width="120" height="80" fill="#41474e"/>';
const LIGHT = c=>`<rect x="44" y="4" width="32" height="72" rx="7" fill="#15181c"/>`+
  `<circle cx="60" cy="20" r="10" fill="${c[0]}"/><circle cx="60" cy="40" r="10" fill="${c[1]}"/><circle cx="60" cy="60" r="10" fill="${c[2]}"/>`;
const DIM={r:'#4a1d1f',a:'#4a3a12',g:'#153a1c'}, ON={r:'#e5484d',a:'#ffb020',g:'#1db954'};
// Traffic officer, facing the viewer - a solid figure, not stick lines. Body is drawn first,
// then each arm is a jacketed upper-arm (blue) + skin forearm + a rounded white glove.
const COP_BODY =
  // legs + shoes
  '<rect x="52" y="58" width="7" height="18" rx="3" fill="#0f1f52"/><rect x="61" y="58" width="7" height="18" rx="3" fill="#0f1f52"/>'+
  '<rect x="49" y="73" width="12" height="5" rx="2.5" fill="#08122e"/><rect x="59" y="73" width="12" height="5" rx="2.5" fill="#08122e"/>'+
  // jacket (torso), rounded shoulders, sash, belt
  '<path d="M46 41 Q46 35 52 35 L68 35 Q74 35 74 41 L72 58 Q72 60 70 60 L50 60 Q48 60 48 58 Z" fill="#1c3aa9"/>'+
  '<circle cx="49" cy="41" r="6.5" fill="#1c3aa9"/><circle cx="71" cy="41" r="6.5" fill="#1c3aa9"/>'+
  '<rect x="48" y="41" width="24" height="5" fill="#ffd24a"/><rect x="49" y="54" width="22" height="4" fill="#0f1f52"/>'+
  // neck + head
  '<rect x="56" y="30" width="8" height="6" fill="#e6b58c"/>'+
  '<circle cx="60" cy="23" r="8.5" fill="#e6b58c"/>'+
  // cap dome + peak + badge
  '<path d="M50 17 Q50 8 60 8 Q70 8 70 17 Z" fill="#0f1f52"/><rect x="46" y="16" width="28" height="4" rx="2" fill="#08122e"/><rect x="57" y="10" width="6" height="4" rx="1" fill="#ffd24a"/>';
const GLOVE = (x,y,r=6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#0f1f52" stroke-width="1.5"/>`;
// A full arm: jacketed upper arm (shoulder→elbow) + skin forearm (elbow→hand) + gloved hand.
const arm = (sx,sy,ex,ey,hx,hy) =>
  `<polyline points="${sx},${sy} ${ex},${ey}" fill="none" stroke="#1c3aa9" stroke-width="11" stroke-linecap="round"/>`+
  `<polyline points="${ex},${ey} ${hx},${hy}" fill="none" stroke="#e6b58c" stroke-width="9" stroke-linecap="round"/>`+
  GLOVE(hx,hy);
const ARM_DOWN_L = arm(49,42, 47,51, 46,60);   // resting left arm along the body
const MK_SVG = {
  solid_white: ROAD+'<rect x="57" y="8" width="6" height="64" fill="#fff"/>',
  broken_white: ROAD+'<rect x="57" y="8" width="6" height="16" fill="#fff"/><rect x="57" y="32" width="6" height="16" fill="#fff"/><rect x="57" y="56" width="6" height="16" fill="#fff"/>',
  double_solid: ROAD+'<rect x="50" y="8" width="6" height="64" fill="#fff"/><rect x="64" y="8" width="6" height="64" fill="#fff"/>',
  solid_broken: ROAD+'<rect x="50" y="8" width="6" height="64" fill="#fff"/><rect x="64" y="8" width="6" height="16" fill="#fff"/><rect x="64" y="32" width="6" height="16" fill="#fff"/><rect x="64" y="56" width="6" height="16" fill="#fff"/>',
  zebra: ROAD+[16,32,48,64,80,96].map(x=>`<rect x="${x}" y="10" width="10" height="60" fill="#fff"/>`).join(''),
  stop_line: ROAD+'<rect x="8" y="34" width="104" height="12" fill="#fff"/>',
  lane_arrow: ROAD+'<polygon points="60,14 76,42 66,42 66,66 54,66 54,42 44,42" fill="#fff"/>',
  yellow_edge: ROAD+'<rect x="12" y="8" width="6" height="64" fill="#ffcf33"/><rect x="102" y="8" width="6" height="64" fill="#ffcf33"/>',
  giveway: ROAD+[18,40,62,84].map(x=>`<polygon points="${x},20 ${x+16},20 ${x+8},34" fill="#fff"/>`).join(''),
  box_junction: ROAD+'<rect x="14" y="12" width="92" height="56" fill="none" stroke="#ffcf33" stroke-width="4"/>'+[0,1,2,3,4,5].map(i=>`<line x1="${14+i*18}" y1="12" x2="14" y2="${12+i*11}" stroke="#ffcf33" stroke-width="2"/><line x1="${106-i*18}" y1="68" x2="106" y2="${68-i*11}" stroke="#ffcf33" stroke-width="2"/>`).join(''),
  diagonal_hatch: ROAD+'<rect x="40" y="8" width="40" height="64" fill="none" stroke="#fff" stroke-width="3"/>'+[0,1,2,3,4].map(i=>`<line x1="40" y1="${12+i*14}" x2="80" y2="${8+i*14-6}" stroke="#fff" stroke-width="2"/>`).join(''),
  bus_lane: ROAD+'<rect x="57" y="8" width="6" height="12" fill="#fff"/><rect x="57" y="60" width="6" height="12" fill="#fff"/><text x="60" y="46" font-size="20" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial">BUS</text>',
  cycle_lane: ROAD+'<g stroke="#fff" stroke-width="3" fill="none"><circle cx="44" cy="50" r="10"/><circle cx="78" cy="50" r="10"/><path d="M44 50 L58 50 L66 34 M52 50 L66 34 L78 50"/></g><rect x="62" y="30" width="10" height="4" fill="#fff"/>',
  light_red: LIGHT([ON.r,DIM.a,DIM.g]),
  light_amber: LIGHT([DIM.r,ON.a,DIM.g]),
  light_green: LIGHT([DIM.r,DIM.a,ON.g]),
  light_red_amber: LIGHT([ON.r,ON.a,DIM.g]),
  light_amber_flash: LIGHT([DIM.r,ON.a,DIM.g])+'<line x1="80" y1="40" x2="92" y2="40" stroke="#ffb020" stroke-width="3"/><line x1="80" y1="32" x2="90" y2="26" stroke="#ffb020" stroke-width="3"/><line x1="80" y1="48" x2="90" y2="54" stroke="#ffb020" stroke-width="3"/>',
  light_arrow_left: LIGHT([DIM.r,DIM.a,'#15181c']).replace('cy="60" r="10" fill="#15181c"','cy="60" r="10" fill="#15181c"')+'<polygon points="52,60 68,52 68,68" fill="#1db954"/>',
  light_arrow_right: LIGHT([DIM.r,DIM.a,'#15181c'])+'<polygon points="68,60 52,52 52,68" fill="#1db954"/>',
  light_arrow_straight: LIGHT([DIM.r,DIM.a,'#15181c'])+'<polygon points="60,50 70,62 63,62 63,70 57,70 57,62 50,62" fill="#1db954"/>',
  light_ped_stop: '<rect x="44" y="4" width="32" height="72" rx="7" fill="#15181c"/><circle cx="60" cy="22" r="6" fill="#e5484d"/><rect x="56" y="30" width="8" height="20" rx="3" fill="#e5484d"/><rect x="52" y="34" width="16" height="6" rx="3" fill="#e5484d"/><rect x="55" y="48" width="4" height="16" fill="#e5484d"/><rect x="61" y="48" width="4" height="16" fill="#e5484d"/>',
  light_ped_go: '<rect x="44" y="4" width="32" height="72" rx="7" fill="#15181c"/><circle cx="58" cy="20" r="6" fill="#1db954"/><rect x="55" y="28" width="8" height="18" rx="3" fill="#1db954" transform="rotate(8 59 37)"/><rect x="52" y="30" width="14" height="5" rx="2" fill="#1db954" transform="rotate(20 59 32)"/><rect x="54" y="44" width="5" height="18" fill="#1db954" transform="rotate(18 56 53)"/><rect x="60" y="44" width="5" height="18" fill="#1db954" transform="rotate(-14 62 53)"/>',
  // One arm raised straight up = everyone stops.
  police_stop_all: COP_BODY+ARM_DOWN_L+arm(71,41, 72,27, 72,11),
  // Both arms straight out sideways = traffic to front/back stops, sides may go.
  police_arms_side: COP_BODY+arm(49,41, 35,41, 22,41)+arm(71,41, 85,41, 98,41),
  // One arm raised with an open palm facing the viewer = stop, you in front.
  police_stop_front: COP_BODY+ARM_DOWN_L+
    `<polyline points="71,41 78,31 82,24" fill="none" stroke="#1c3aa9" stroke-width="11" stroke-linecap="round"/>`+
    `<polyline points="82,24 83,20" fill="none" stroke="#e6b58c" stroke-width="9" stroke-linecap="round"/>`+
    '<rect x="76" y="8" width="15" height="15" rx="5" fill="#fff" stroke="#0f1f52" stroke-width="1.5"/>'+
    [80,83.5,87].map(x=>`<line x1="${x}" y1="9" x2="${x}" y2="15" stroke="#0f1f52" stroke-width="1.3" stroke-linecap="round"/>`).join(''),
  // Forearm brought up across the chest with a curved arrow = beckoning you to proceed.
  police_beckon: COP_BODY+ARM_DOWN_L+arm(71,41, 76,49, 62,34)+
    '<path d="M90,28 A 24 24 0 0 1 66 26" fill="none" stroke="#1db954" stroke-width="3.5"/>'+
    '<polygon points="66,20 66,32 58,26" fill="#1db954"/>',
  // Arm held out to the side with a flat palm-down hand and an up/down arrow = slow down.
  police_slow: COP_BODY+ARM_DOWN_L+
    `<polyline points="71,43 84,46 95,47" fill="none" stroke="#1c3aa9" stroke-width="11" stroke-linecap="round"/>`+
    '<rect x="93" y="44" width="14" height="6" rx="3" fill="#fff" stroke="#0f1f52" stroke-width="1.5"/>'+
    '<line x1="100" y1="26" x2="100" y2="40" stroke="#e5484d" stroke-width="3"/><line x1="100" y1="54" x2="100" y2="66" stroke="#e5484d" stroke-width="3"/>'+
    '<polygon points="100,22 95,31 105,31" fill="#e5484d"/><polygon points="100,70 95,61 105,61" fill="#e5484d"/>',
};
function mkName(m){ return m.name[S.lang]||m.name.rw; }
function mkMeaning(m){ return m.meaning[S.lang]||m.meaning.rw; }

// ---------- State ----------
let DB = { questions:[], signs:[], glossary:[] };
let S = {
  lang:"rw", theme:"light", name:"", textScale:1,
  school:{ name:"", location:"", contact:"" },
  owner:null,           // {name, salt, pinHash} - school owner/teacher (edits school info)
  role:"candidate",     // transient: "candidate" | "owner"
  accounts:[],          // {phone, name, salt, pinHash, createdAt}
  currentPhone:null,
  progress:{},          // phone -> {qstats:{}, history:[]}
  reports:[],           // school-wide reported questions: {qid, stem, reason, note, by, phone, date}
  lockouts:{},          // phone -> {fails, until} PIN throttle
  onboarded:false,      // first-run intro shown once per install
  qstats:{},            // live ref to current session's qstats
  history:[],           // live ref to current session's history
};
const OWNER_KEY='__owner__';
function isOwner(){ return S.role==='owner'; }
function t(k){ return (I18N[S.lang] && I18N[S.lang][k]) || I18N.en[k] || k; }
function loc(o){ if(!o) return ""; return o[S.lang] || o.rw || o.en || o.fr || ""; }
function catLabel(c){ const x=CAT_LABELS[c]; return x?loc(x):c; }

// ---- Per-candidate extras: exam-date countdown, daily goal, teacher assignment (#3/#8) ----
function sess(){ const k=sessionKey(); if(k){ if(!S.progress[k]) S.progress[k]={qstats:{},history:[]}; return S.progress[k]; } return {}; }
function todayKey(){ const d=new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }
function bumpDaily(){ const sp=sess(); const k=todayKey(); if(!sp.daily||sp.daily.key!==k) sp.daily={key:k,count:0}; sp.daily.count++; }
function dailyCount(){ const sp=sess(); return (sp.daily&&sp.daily.key===todayKey())?sp.daily.count:0; }
function dailyGoal(){ return sess().dailyGoal||20; }
function daysUntilExam(){ const sp=sess(); if(!sp.testDate) return null; const tgt=new Date(sp.testDate); tgt.setHours(0,0,0,0); const now=new Date(); now.setHours(0,0,0,0); return Math.round((tgt-now)/86400000); }
// Per-category accuracy from a qstats blob, weakest first (unseen categories count as weak).
function weakCatsFrom(qstats, all){
  const cats=[...new Set(all.map(q=>q.category).filter(Boolean))];
  return cats.map(c=>{
    const ids=all.filter(q=>q.category===c).map(q=>q.id);
    let seen=0, correct=0; ids.forEach(id=>{ const st=qstats[id]; if(st&&st.seen){ seen+=st.seen; correct+=st.correct||0; } });
    return { cat:c, seen, acc: seen? correct/seen : 0, total:ids.length };
  }).sort((a,b)=> (a.seen? a.acc : -1) - (b.seen? b.acc : -1));
}

async function persist(){
  await window.api.setStore({
    lang:S.lang, theme:S.theme, school:S.school, owner:S.owner, textScale:S.textScale,
    accounts:S.accounts, currentPhone:S.currentPhone, progress:S.progress,
    reports:S.reports, lockouts:S.lockouts, onboarded:S.onboarded, listenMode:S.listenMode,
  });
}
// The storage key for the current session's progress (candidate phone, or the owner namespace).
function sessionKey(){ return isOwner() ? OWNER_KEY : S.currentPhone; }
// Write the current session's live progress back into its namespace, then save.
function saveProgress(){
  const k=sessionKey();
  // Merge, don't replace: the progress blob also holds daily-goal counters, the test date and any
  // teacher assignment (#3/#8), which a bare {qstats,history} rebuild would silently wipe.
  if(k) S.progress[k] = Object.assign({}, S.progress[k], { qstats:S.qstats, history:S.history });
  return persist();
}

// ---------- Accounts (mirror Android AccountStore: salted SHA-256, 10-digit phone, 4-8 digit PIN) ----------
async function sha256Hex(str){ const b=await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)); return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join(''); }
function newSalt(){ const b=new Uint8Array(16); crypto.getRandomValues(b); return [...b].map(x=>x.toString(16).padStart(2,'0')).join(''); }
function accGet(phone){ return S.accounts.find(a=>a.phone===phone); }
function validPhone(p){ return /^\d{10}$/.test(p); }
function validPin(p){ return /^\d{4,8}$/.test(p); }
async function accRegister(phone,name,pin){
  if(accGet(phone)) return false;
  const salt=newSalt();
  S.accounts.push({ phone, name:(name||'').trim()||phone, salt, pinHash:await sha256Hex(salt+pin), createdAt:Date.now() });
  await persist(); return true;
}
async function accAuth(phone,pin){ const a=accGet(phone); if(!a) return false; return a.pinHash===await sha256Hex(a.salt+pin); }
async function ownerCreate(name,pin){ const salt=newSalt(); S.owner={ name:(name||'').trim()||loc({rw:'Umwarimu',en:'Teacher',fr:'Enseignant'}), salt, pinHash:await sha256Hex(salt+pin) }; await persist(); }
async function ownerAuth(pin){ if(!S.owner) return false; return S.owner.pinHash===await sha256Hex(S.owner.salt+pin); }
async function accChangePin(phone,oldPin,newP){
  const a=accGet(phone); if(!a) return false;
  if(a.pinHash!==await sha256Hex(a.salt+oldPin)) return false;
  if(!validPin(newP)) return false;
  a.salt=newSalt(); a.pinHash=await sha256Hex(a.salt+newP); await persist(); return true;
}

// ---------- Content update: base assets, overlaid by an imported bundle (questions merge by id) ----------
let CONTENT_VERSION = 0;
function applyContent(){
  DB.questions = window.api.loadQuestions() || [];
  DB.signs = window.api.loadSigns() || [];
  DB.glossary = window.api.loadGlossary() || [];
  DB.lessons = window.api.loadLessons() || [];
  DB.gazette = window.api.loadGazette() || [];
  CONTENT_VERSION = 0;
  const up = (typeof CONTENT_BUNDLE !== 'undefined') ? CONTENT_BUNDLE : null;
  if(up){
    CONTENT_VERSION = up.version || 0;
    if(Array.isArray(up.questions)){ // merge/override by id, keep only examinable
      const byId = new Map(DB.questions.map(q=>[q.id,q]));
      for(const q of up.questions){ if(q&&q.id) byId.set(q.id, q); }
      DB.questions = [...byId.values()].filter(q=>q.options&&q.options.some(o=>o.correct));
    }
    if(Array.isArray(up.signs)) DB.signs = up.signs;       // replace wholesale
    if(Array.isArray(up.glossary)) DB.glossary = up.glossary;
  }
}
let CONTENT_BUNDLE = null;

// ---------- Boot ----------
async function boot(){
  applyTheme();
  buildLang();
  document.getElementById('themeToggle').onclick = toggleTheme;
  // Node-locked activation: the app is unusable on this computer until a valid
  // INGA-XXXX-XXXX-DESK-ROAD code (bound to this machine) is entered once.
  const lic = await window.api.licenseInfo();
  if(!lic.activated){ return activationGate(lic.machineId); }
  await bootAfterLicense();
}
async function activationGate(machineId){
  gate(`<h2>🔐 ${t('act_title')}</h2>
    <p class="muted" style="margin:4px 0 14px">${t('act_intro')}</p>
    <div class="field"><label>${t('act_machine')}</label>
      <div class="row"><input id="actMid" value="${machineId}" readonly style="flex:1;font-family:monospace;letter-spacing:1px"/>
      <button class="btn ghost sm" id="actCopy">📋</button></div></div>
    <div class="field"><label>${t('act_code')}</label>
      <input id="actCode" placeholder="INGA-XXXX-XXXX-DESK-ROAD" style="font-family:monospace;letter-spacing:1px;text-transform:uppercase"/></div>
    <div class="err" id="actErr"></div>
    <button class="btn wide" id="actGo">✓ ${t('act_activate')}</button>`);
  document.getElementById('actCopy').onclick=()=>{ navigator.clipboard.writeText(machineId); toast('📋 '+machineId); };
  const go=async()=>{
    const r=await window.api.activate(document.getElementById('actCode').value);
    if(r&&r.ok){ toast('✓ '+t('act_ok')); await bootAfterLicense(); }
    else gateErr('actErr', t('act_bad'));
  };
  document.getElementById('actGo').onclick=go;
  document.getElementById('actCode').addEventListener('keydown',e=>{ if(e.key==='Enter') go(); });
}
async function bootAfterLicense(){
  CONTENT_BUNDLE = await window.api.loadContentUpdate();
  applyContent();
  const saved = await window.api.getStore();
  if(saved){
    S.lang = saved.lang || 'rw';
    S.theme = saved.theme || 'light';
    S.school = saved.school || { name:"", location:"", contact:"" };
    S.accounts = saved.accounts || [];
    S.owner = saved.owner || null;
    S.progress = saved.progress || {};
    S.reports = saved.reports || [];
    S.lockouts = saved.lockouts || {};
    S.textScale = saved.textScale || 1;
    S.onboarded = !!saved.onboarded;
    S.listenMode = !!saved.listenMode;
  }
  S.role='candidate';
  applyTextScale();
  // Single shared machine: never auto-restore a session. Closing/reopening the app requires the
  // candidate to sign in again, so the next person can't land in someone else's account.
  S.currentPhone = (saved && saved.currentPhone) || null;   // web: stay signed in on this device
  applyTheme();
  buildLang();
  document.getElementById('themeToggle').onclick = toggleTheme;
  authGate();
}

// Decide what to show: onboarding (once) → school setup → candidate login → the app.
function authGate(){
  if(!S.onboarded){ return onboardingGate(); }
  if(!S.school || !S.school.name){ return schoolSetup(); }
  if(!S.currentPhone || !accGet(S.currentPhone)){ S.currentPhone=null; return loginScreen(); }
  enterApp();
}
function onboardingGate(){
  const slides=[
    {ic:'🚗',logo:true,t:{rw:'Murakaza neza',en:'Welcome',fr:'Bienvenue'},b:{rw:"Iyi porogaramu igufasha kwitegura ikizamini cy'uruhushya rw'agateganyo, ikora nta interineti.",en:'This app prepares you for the provisional driving-licence theory test. It works fully offline.',fr:"Cette application vous prépare à l'examen théorique du permis provisoire. Fonctionne hors ligne."}},
    {ic:'📚',t:{rw:'Iga kandi wimenyereze',en:'Learn & practise',fr:'Apprenez et entraînez-vous'},b:{rw:"Soma amasomo, wimenyereze ibibazo bigufasha aho udahagaze neza, wisuzume mu 'Iga ibibazo'.",en:'Read lessons, practise questions targeted at your weak spots, and review answers in Study mode.',fr:'Lisez les leçons, entraînez-vous sur vos points faibles et révisez en mode Étude.'}},
    {ic:'📝',t:{rw:'Ikizamini',en:'Mock exam',fr:'Examen blanc'},b:{rw:'Ibibazo 20 mu minota 20. Utsinda ku manota 12/20. Bimeze nk\'ikizamini nyacyo.',en:'20 questions in 20 minutes. Pass at 12/20. Just like the real test.',fr:'20 questions en 20 minutes. Réussite à 12/20. Comme le vrai examen.'}},
    {ic:'🚦',t:{rw:'Ibyapa n\'amategeko',en:'Signs & the law',fr:'Panneaux et loi'},b:{rw:'Reba ibyapa byose, imirongo n\'amatara, ndetse usome amategeko nyayo (Igazeti ya Leta).',en:'Browse all road signs, markings & lights, and read the actual law (Official Gazette).',fr:'Parcourez les panneaux, marquages et feux, et lisez la loi officielle.'}},
  ];
  let i=0;
  const render=()=>{ const sl=slides[i];
    gate(`<div style="text-align:center">
      <div style="font-size:64px">${sl.logo?'<img src="assets/icons/appicon.png" alt="" style="width:120px;height:120px;object-fit:contain"/>':sl.ic}</div>
      <h2 style="margin:6px 0">${loc(sl.t)}</h2>
      <p class="muted" style="line-height:1.6;margin:8px 0 18px">${loc(sl.b)}</p>
      <div class="row" style="justify-content:center;gap:6px;margin-bottom:16px">${slides.map((_,j)=>`<span style="width:8px;height:8px;border-radius:50%;background:${j===i?'var(--blue-600)':'var(--border)'}"></span>`).join('')}</div>
      <button class="btn wide" id="obNext">${i<slides.length-1?t('ob_next')+' →':'✓ '+t('ob_start')}</button>
      ${i<slides.length-1?`<button class="btn ghost wide" id="obSkip" style="margin-top:10px">${t('ob_skip')}</button>`:''}
    </div>`);
    document.getElementById('obNext').onclick=()=>{ if(i<slides.length-1){ i++; render(); } else finish(); };
    const sk=document.getElementById('obSkip'); if(sk) sk.onclick=finish;
  };
  const finish=async()=>{ S.onboarded=true; await persist(); authGate(); };
  render();
}
function enterApp(){
  if(isOwner()){ S.name = (S.owner&&S.owner.name) || loc({rw:'Umwarimu',en:'Teacher',fr:'Enseignant'}); }
  else { const acc = accGet(S.currentPhone); S.name = acc ? acc.name : ''; }
  const k = sessionKey();
  S.progress[k] = S.progress[k] || { qstats:{}, history:[] };
  S.qstats = S.progress[k].qstats;
  S.history = S.progress[k].history;
  hideGate();
  buildNav(); updateCandidateChip();
  go('home');
}
function logout(){ S.currentPhone=null; S.role='candidate'; persist(); loginScreen(); }

function applyTheme(){
  document.documentElement.setAttribute('data-theme', S.theme);
  document.getElementById('themeToggle').textContent = S.theme==='dark'?'☀️':'🌙';
}
function toggleTheme(){ S.theme = S.theme==='dark'?'light':'dark'; applyTheme(); persist(); }
function applyTextScale(){ document.documentElement.style.fontSize = Math.round((S.textScale||1)*16)+'px'; }

// ---- Report a question (candidates/teachers flag a bad question for the owner to review) ----
function reportQuestion(q){
  const reasons=[
    {k:'wrong',rw:'Igisubizo si cyo',en:'Wrong answer',fr:'Réponse fausse'},
    {k:'typo',rw:'Ikosa mu nyandiko',en:'Typo',fr:'Faute de frappe'},
    {k:'unclear',rw:'Ntibisobanutse',en:'Unclear',fr:'Peu clair'},
    {k:'image',rw:'Ishusho ibura/ihariye',en:'Image missing/wrong',fr:'Image manquante'},
    {k:'other',rw:'Ikindi',en:'Other',fr:'Autre'},
  ];
  let chosen='wrong';
  modal(`<h2>⚠ ${t('report_q')}</h2>
    <p class="muted" style="font-size:13px;margin:4px 0 12px">${loc(q.stem).slice(0,120)}…</p>
    <div class="chips" id="rpReasons">${reasons.map((r,i)=>`<div class="chip ${i===0?'active':''}" data-k="${r.k}">${loc(r)}</div>`).join('')}</div>
    <div class="field"><label>${t('report_note')}</label><input id="rpNote" placeholder="${t('report_note')}"/></div>
    <button class="btn wide" id="rpGo">${t('report_send')}</button>`);
  document.querySelectorAll('#rpReasons .chip').forEach(c=>c.onclick=()=>{ document.querySelectorAll('#rpReasons .chip').forEach(x=>x.classList.remove('active')); c.classList.add('active'); chosen=c.dataset.k; });
  document.getElementById('rpGo').onclick=()=>{
    S.reports.unshift({ qid:q.id, stem:loc(q.stem).slice(0,160), reason:chosen,
      note:document.getElementById('rpNote').value.trim(), by:S.name||'', phone:S.currentPhone||'', date:Date.now() });
    persist(); closeModal(); toast('✓ '+t('report_thanks'));
  };
}
window.reportQuestion=reportQuestion;

function buildLang(){
  const el=document.getElementById('langSwitch'); el.innerHTML='';
  ['rw','en','fr'].forEach(l=>{
    const b=document.createElement('button'); b.className='lang-btn'+(S.lang===l?' active':'');
    b.textContent=l.toUpperCase(); b.onclick=()=>{ S.lang=l; persist(); buildNav(); buildLang(); go(current); };
    el.appendChild(b);
  });
}

const NAV_GROUPS = [
  { items:[['home','🏠']] },
  { label:'g_learn', items:[['lessons','📚'],['practice','🎯'],['study','🔎']] },
  { label:'g_exam', items:[['exam','📝']] },
  { label:'g_ref', items:[['signs','🚸'],['markings','🚦'],['practical','🚙'],['flash','🃏'],['glossary','📖'],['legal','⚖️']] },
  { label:'g_me', items:[['progress','📈'],['history','🕘'],['revision','🖨'],['cert','🏅'],['settings','⚙️']] },
];
const OWNER_GROUP = { label:'g_manage', items:[['dashboard','🏫']] };
let current='home';
function buildNav(){
  const nav=document.getElementById('nav'); nav.innerHTML='';
  const groups = NAV_GROUPS.slice();
  if(isOwner()) groups.splice(1, 0, OWNER_GROUP);   // Management group right after Home for owners
  groups.forEach(g=>{
    if(g.label){ const h=document.createElement('div'); h.className='nav-section'; h.textContent=t(g.label); nav.appendChild(h); }
    g.items.forEach(([key,ico])=>{
      const b=document.createElement('button'); b.className='navitem'+(current===key?' active':'');
      b.innerHTML=`<span class="ni-ico">${ico}</span><span>${t(key)}</span>`;
      b.onclick=()=>go(key); nav.appendChild(b);
    });
  });
}
function go(key){
  // Strict exam: block navigating away while an exam is in progress - warn, save, end instead.
  if(EX && !EX.done && key!=='exam'){ confirmLeaveExam(); return; }
  current=key; buildNav(); document.getElementById('topTitle').textContent=t(key);
  speechSynthesis && speechSynthesis.cancel();
  VIEWS[key] ? VIEWS[key]() : VIEWS.home();
  document.getElementById('view').scrollTop=0;
}
const view=()=>document.getElementById('view');
function updateCandidateChip(){
  const chip=document.getElementById('candidateChip');
  if(!S.name){ chip.innerHTML=''; return; }
  const badge = S.school.logo
    ? `<img src="${S.school.logo}" style="height:22px;max-width:60px;object-fit:contain;vertical-align:middle;margin-right:4px"/>`
    : '🏫 ';
  chip.innerHTML = `${S.school.name?`<span style="opacity:.75">${badge}${S.school.name}</span> · `:''}<span class="dot"></span>${S.name}${isOwner()?` <span style="background:var(--gold);color:#3a2a00;font-size:11px;font-weight:800;padding:2px 7px;border-radius:6px;margin-left:6px">${t('owner_badge')}</span>`:''}
    <button class="btn sm ghost" id="chipLogout" style="margin-left:10px">${t('logout')} →</button>`;
  document.getElementById('chipLogout').onclick=logout;
}

// ---------- helpers ----------
function el(html){ const d=document.createElement('div'); d.innerHTML=html.trim(); return d.firstElementChild; }
function toast(msg){ const el=document.getElementById('toast'); el.textContent=msg; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),1900); }
function speak(text){ if(!text||!window.speechSynthesis) return; speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.rate=.92; speechSynthesis.speak(u); }
// Audio-first Listen mode (#5): read the stem, then each option prefixed by its letter.
function speakQuestion(q,opts){
  const parts=[loc(q.stem)];
  opts.forEach((o,i)=>{ const label=(o.image?'':(o[S.lang]||o.rw||'')).trim(); if(label) parts.push(String.fromCharCode(65+i)+': '+label); });
  speak(parts.join('. '));
}
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function correctOpt(q){ return q.options.find(o=>o.correct); }

// sign resolver for option text (mirrors Android SignBank.signForOptionText):
// only when the WHOLE option is a bare sign code (e.g. "Icyapa B5", "C.13a", "A22").
const CODE_ALIASES = { 'A.22':'A.22e' };
function byCode(code){ return DB.signs.find(s=>s.code===code) || null; }
function signForText(txt){
  if(!txt) return null;
  const cleaned = txt.trim().replace(/icyapa/ig,'').trim().replace(/\)+$/,'').trim();
  const m = cleaned.match(/^([A-Fa-f])\.?\s?(\d{1,2})([A-Za-z]?)$/);
  if(!m) return null;
  const code = `${m[1].toUpperCase()}.${m[2]}${(m[3]||'').toLowerCase()}`;
  return byCode(code) || (CODE_ALIASES[code] ? byCode(CODE_ALIASES[code]) : null);
}
// Inline vector art for the 6 signs that have no PNG (parity with Android SignPictograms.kt)
const SIGN_SVG = {
  'A.15': `<polygon points="50,8 94,86 6,86" fill="#fff" stroke="#d92121" stroke-width="7" stroke-linejoin="round"/>
    <circle cx="40" cy="42" r="5" fill="#1a1a1a"/><rect x="37" y="48" width="6" height="16" fill="#1a1a1a"/>
    <line x1="43" y1="52" x2="60" y2="40" stroke="#1a1a1a" stroke-width="4"/><rect x="58" y="34" width="8" height="8" fill="#1a1a1a"/>
    <path d="M46 74 L74 74 L60 60 Z" fill="#1a1a1a"/>`,
  'A.19': `<polygon points="50,8 94,86 6,86" fill="#fff" stroke="#d92121" stroke-width="7" stroke-linejoin="round"/>
    <g fill="#1a1a1a"><rect x="38" y="38" width="5" height="30"/><polygon points="40.5,30 33,42 48,42"/>
    <rect x="57" y="38" width="5" height="30"/><polygon points="59.5,76 52,64 67,64"/></g>`,
  'B.2a': `<polygon points="30,6 70,6 94,30 94,70 70,94 30,94 6,70 6,30" fill="#d92121" stroke="#fff" stroke-width="4"/>
    <text x="50" y="60" font-size="24" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial">STOP</text>`,
  'B.5': `<rect x="8" y="8" width="84" height="84" rx="8" fill="#1565c0"/>
    <polygon points="42,20 42,60 34,60 50,80 66,60 58,60 58,20" fill="#fff"/>
    <polygon points="30,74 30,50 24,50 34,38 44,50 38,50 38,74" fill="#d92121"/>`,
  'B.6': `<rect x="8" y="8" width="84" height="84" rx="8" fill="#fff" stroke="#d92121" stroke-width="7"/>
    <polygon points="44,22 44,58 34,58 52,82 70,58 60,58 60,22" fill="#d92121"/>`,
  'C.20a': `<circle cx="50" cy="50" r="40" fill="#1565c0" stroke="#d92121" stroke-width="8"/>
    <line x1="22" y1="22" x2="78" y2="78" stroke="#d92121" stroke-width="8"/>
    <text x="50" y="62" font-size="34" font-weight="800" fill="#fff" text-anchor="middle" font-family="Arial">I</text>`,
};
function signImg(s,cls){
  if(!s) return '';
  if(s.vector && SIGN_SVG[s.code]) return `<svg class="${cls||''}" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">${SIGN_SVG[s.code]}</svg>`;
  return `<img class="${cls||''}" src="assets/signs/images/${s.assetId}.png" onerror="this.style.display='none'"/>`;
}
function signBig(s,px){
  if(s.vector && SIGN_SVG[s.code]) return `<svg viewBox="0 0 100 100" style="width:${px}px;height:${px}px;background:#fff;border-radius:14px;padding:10px">${SIGN_SVG[s.code]}</svg>`;
  return `<img src="assets/signs/images/${s.assetId}.png" style="width:${px}px;height:${px}px;object-fit:contain;background:#fff;border-radius:14px;padding:10px"/>`;
}
// Downscale an uploaded image (data URL) to fit maxPx, keeping it small in the store.
function downscaleImage(dataUrl, maxPx){
  return new Promise(res=>{
    const img=new Image();
    img.onload=()=>{
      let {width:w,height:h}=img;
      if(w>maxPx||h>maxPx){ const s=maxPx/Math.max(w,h); w=Math.round(w*s); h=Math.round(h*s); }
      const c=document.createElement('canvas'); c.width=w; c.height=h;
      c.getContext('2d').drawImage(img,0,0,w,h);
      res(c.toDataURL('image/png'));
    };
    img.onerror=()=>res(dataUrl);
    img.src=dataUrl;
  });
}
// Resolve an image asset id to its file path. PDF-bank images live in /qimg, signs in /signs/images.
function assetUrl(a){
  if(!a) return '';
  if(/^PDF[QO]_/.test(a)) return `assets/qimg/${a}.png`;
  return `assets/signs/images/${a}.png`;
}
// A question can carry a picture in its stem (a sign, or a PDF-bank stem image).
function questionMedia(q){
  const a = q && q.media && q.media.assetId;
  if(!a) return '';
  const s = DB.signs.find(x=>x.assetId===a);
  const inner = s ? signBig(s,160)
    : `<img src="${assetUrl(a)}" style="max-width:280px;max-height:200px;object-fit:contain;background:#fff;border-radius:14px;padding:10px" onerror="this.style.display='none'"/>`;
  return `<div style="text-align:center;margin:2px 0 18px">${inner}</div>`;
}

// ---------- Modal ----------
function modal(html){
  const r=document.getElementById('modalRoot');
  r.innerHTML=`<div class="modal"><button class="close">✕</button>${html}</div>`;
  r.classList.add('open');
  r.querySelector('.close').onclick=closeModal;
  r.onclick=e=>{ if(e.target===r) closeModal(); };
}
function closeModal(){ document.getElementById('modalRoot').classList.remove('open'); }

// ---------- Auth gate (full-screen overlay: school setup → candidate login) ----------
function gate(html){
  let g=document.getElementById('gate');
  if(!g){ g=document.createElement('div'); g.id='gate'; document.body.appendChild(g); }
  const gbadge = S.school && S.school.logo
    ? `<div class="brand-badge" style="background:#fff;padding:4px"><img src="${S.school.logo}" style="max-width:100%;max-height:100%;object-fit:contain"/></div>`
    : `<div class="brand-badge brand-logo"><img src="assets/icons/appicon.png" alt=""/></div>`;
  g.innerHTML=`<div class="gate-card">
    <div class="gate-brand">${gbadge}
      <div><div style="font-weight:800;font-size:20px">Amategeko y'Umuhanda</div>
      <div class="muted" style="font-size:13px">${S.school&&S.school.name?('🏫 '+S.school.name):t('tagline')}</div></div></div>
    ${html}
    <div class="gate-lang" id="gateLang"></div></div>`;
  const gl=document.getElementById('gateLang');
  ['rw','en','fr'].forEach(l=>{ const b=document.createElement('button'); b.className='lang-btn'+(S.lang===l?' active':''); b.textContent=l.toUpperCase(); b.onclick=()=>{ S.lang=l; persist(); authGate(); }; gl.appendChild(b); });
  return g;
}
function hideGate(){ const g=document.getElementById('gate'); if(g) g.remove(); }
function gateErr(id,msg){ const e=document.getElementById(id); if(e){ e.textContent=msg; e.style.display='block'; } }

function schoolSetup(){
  gate(`<h2>${t('school_setup')} 🏫</h2>
    <p class="muted" style="margin:4px 0 16px">${loc({rw:"Uzuza amakuru y'ishuri rimwe mbere yo guha abanyeshuri iyi mudasobwa.",en:"Set up the school once before candidates use this computer.",fr:"Configurez l'école une fois avant que les candidats utilisent cet ordinateur."})}</p>
    <div class="field"><label>${t('school_name')}</label><input id="scName" value="${S.school.name||''}"/></div>
    <div class="field"><label>${t('location')}</label><input id="scLoc" value="${S.school.location||''}"/></div>
    <div class="field"><label>${t('contact')}</label><input id="scContact" value="${S.school.contact||''}"/></div>
    <div style="border-top:1px solid var(--border);margin:14px 0;padding-top:12px">
      <div style="font-weight:800;margin-bottom:8px">👤 ${t('owner_account')}</div>
      <p class="muted" style="font-size:13px;margin-bottom:10px">${t('owner_intro')}</p>
      <div class="field"><label>${t('owner_name')}</label><input id="scOwner" placeholder="${t('owner_name')}"/></div>
      <div class="row"><div class="field" style="flex:1"><label>${t('owner_pin')}</label><input id="scPin" type="password" inputmode="numeric" maxlength="8"/></div>
        <div class="field" style="flex:1"><label>${t('confirm_pin')}</label><input id="scPin2" type="password" inputmode="numeric" maxlength="8"/></div></div>
    </div>
    <div class="err" id="scErr"></div>
    <button class="btn wide" id="scSave">${t('save_continue')} →</button>`);
  document.getElementById('scSave').onclick=async()=>{
    const name=document.getElementById('scName').value.trim();
    if(!name) return gateErr('scErr', t('school_name'));
    const pin=document.getElementById('scPin').value, pin2=document.getElementById('scPin2').value;
    if(!validPin(pin)) return gateErr('scErr', t('invalid_pin'));
    if(pin!==pin2) return gateErr('scErr', t('pin_mismatch'));
    S.school={ name, location:document.getElementById('scLoc').value.trim(), contact:document.getElementById('scContact').value.trim(), logo:S.school.logo||null, stamp:S.school.stamp||null };
    await ownerCreate(document.getElementById('scOwner').value, pin);
    await persist(); authGate();
  };
}

function loginScreen(){
  const cands=S.accounts;
  gate(`<h2>${t('login')} 👋</h2>
    ${cands.length?`<p class="muted" style="margin:4px 0 12px">${t('choose_candidate')}</p>
      <div class="cand-list">${cands.map(a=>`<button class="cand-btn" data-p="${a.phone}"><span class="dot"></span><div><div style="font-weight:700">${a.name}</div><div class="muted" style="font-size:12px">${a.phone}</div></div></button>`).join('')}</div>`
      :`<p class="muted" style="margin:4px 0 12px">${loc({rw:'Nta konti irahari. Fungura iyawe.',en:'No accounts yet. Create yours.',fr:'Aucun compte. Créez le vôtre.'})}</p>`}
    <button class="btn ghost wide" id="toRegister" style="margin-top:12px">＋ ${t('create_account')}</button>
    <div style="border-top:1px solid var(--border);margin:14px 0 0;padding-top:12px">
      <button class="btn ghost wide" id="toOwner">🏫 ${t('owner_login')}</button></div>`);
  document.querySelectorAll('.cand-btn').forEach(b=>b.onclick=()=>pinPrompt(b.dataset.p));
  document.getElementById('toRegister').onclick=registerScreen;
  document.getElementById('toOwner').onclick=ownerLogin;
}
function ownerLogin(){
  if(!S.owner) return ownerSetup();   // legacy install without an owner yet
  gate(`<h2>🏫 ${t('owner_login')}</h2>
    <p class="muted" style="margin:4px 0 14px">${S.owner.name} · ${S.school.name}</p>
    <div class="field"><input id="owPin" type="password" inputmode="numeric" maxlength="8" placeholder="••••" style="text-align:center;letter-spacing:8px;font-size:20px"/></div>
    <div class="err" id="owErr"></div>
    <button class="btn wide" id="owGo">${t('login')}</button>
    <button class="btn ghost wide" id="owBack" style="margin-top:10px">← ${t('back')}</button>`);
  const go=async()=>{ if(await ownerAuth(document.getElementById('owPin').value)){ S.role='owner'; S.currentPhone=null; enterApp(); } else gateErr('owErr', t('wrong_pin')); };
  document.getElementById('owGo').onclick=go;
  document.getElementById('owPin').addEventListener('keydown',e=>{ if(e.key==='Enter') go(); });
  document.getElementById('owPin').focus();
  document.getElementById('owBack').onclick=loginScreen;
}
function ownerSetup(){
  gate(`<h2>🏫 ${t('owner_account')}</h2>
    <p class="muted" style="margin:4px 0 14px">${t('owner_intro')}</p>
    <div class="field"><label>${t('owner_name')}</label><input id="owName"/></div>
    <div class="row"><div class="field" style="flex:1"><label>${t('owner_pin')}</label><input id="owP1" type="password" inputmode="numeric" maxlength="8"/></div>
      <div class="field" style="flex:1"><label>${t('confirm_pin')}</label><input id="owP2" type="password" inputmode="numeric" maxlength="8"/></div></div>
    <div class="err" id="owsErr"></div>
    <button class="btn wide" id="owsGo">${t('save')}</button>
    <button class="btn ghost wide" id="owsBack" style="margin-top:10px">← ${t('back')}</button>`);
  document.getElementById('owsGo').onclick=async()=>{
    const p1=document.getElementById('owP1').value, p2=document.getElementById('owP2').value;
    if(!validPin(p1)) return gateErr('owsErr', t('invalid_pin'));
    if(p1!==p2) return gateErr('owsErr', t('pin_mismatch'));
    await ownerCreate(document.getElementById('owName').value, p1);
    S.role='owner'; S.currentPhone=null; enterApp();
  };
  document.getElementById('owsBack').onclick=loginScreen;
}
function pinPrompt(phone){
  const a=accGet(phone);
  gate(`<h2>${t('enter_pin')} 🔑</h2>
    <p class="muted" style="margin:4px 0 14px"><span class="dot"></span> ${a.name} · ${a.phone}</p>
    <div class="field"><input id="pinIn" type="password" inputmode="numeric" maxlength="8" placeholder="••••" style="text-align:center;letter-spacing:8px;font-size:20px"/></div>
    <div class="err" id="pinErr"></div>
    <button class="btn wide" id="pinGo">${t('login')}</button>
    <button class="btn ghost wide" id="pinBack" style="margin-top:10px">← ${t('back')}</button>`);
  const go=async()=>{
    const lk=S.lockouts[phone];
    if(lk && lk.until>Date.now()){ gateErr('pinErr', t('locked_wait')+' '+Math.ceil((lk.until-Date.now())/1000)+'s'); return; }
    const pin=document.getElementById('pinIn').value;
    if(await accAuth(phone,pin)){ delete S.lockouts[phone]; S.currentPhone=phone; await persist(); enterApp(); }
    else {
      const f=(S.lockouts[phone]?.fails||0)+1;
      S.lockouts[phone]={ fails:f, until: f>=5 ? Date.now()+30000 : 0 };
      persist();
      gateErr('pinErr', f>=5 ? t('locked_wait')+' 30s' : t('wrong_pin')+' ('+(5-f)+')');
    }
  };
  document.getElementById('pinGo').onclick=go;
  document.getElementById('pinIn').addEventListener('keydown',e=>{ if(e.key==='Enter') go(); });
  document.getElementById('pinIn').focus();
  document.getElementById('pinBack').onclick=loginScreen;
}
function registerScreen(){
  gate(`<h2>${t('create_account')} 🆕</h2>
    <div class="field"><label>${t('name')}</label><input id="rgName"/></div>
    <div class="field"><label>${t('phone10')}</label><input id="rgPhone" inputmode="numeric" maxlength="10"/></div>
    <div class="row" style="gap:10px">
      <div class="field" style="flex:1"><label>${t('pin')}</label><input id="rgPin" type="password" inputmode="numeric" maxlength="8"/></div>
      <div class="field" style="flex:1"><label>${t('confirm_pin')}</label><input id="rgPin2" type="password" inputmode="numeric" maxlength="8"/></div>
    </div>
    <div class="err" id="rgErr"></div>
    <button class="btn wide" id="rgGo">${t('register')}</button>
    <button class="btn ghost wide" id="rgBack" style="margin-top:10px">← ${t('back')}</button>`);
  document.getElementById('rgGo').onclick=async()=>{
    const name=document.getElementById('rgName').value.trim();
    const phone=document.getElementById('rgPhone').value.trim();
    const pin=document.getElementById('rgPin').value, pin2=document.getElementById('rgPin2').value;
    if(!validPhone(phone)) return gateErr('rgErr', t('invalid_phone'));
    if(accGet(phone)) return gateErr('rgErr', t('phone_exists'));
    if(!validPin(pin)) return gateErr('rgErr', t('invalid_pin'));
    if(pin!==pin2) return gateErr('rgErr', t('pin_mismatch'));
    await accRegister(phone,name,pin);
    S.currentPhone=phone; await persist(); enterApp();
  };
  document.getElementById('rgBack').onclick=loginScreen;
}

/* =========================================================
   VIEWS
   ========================================================= */
const VIEWS = {};

// ---- HOME ----
VIEWS.home = function(){
  const total=DB.questions.length;
  const mastered=Object.values(S.qstats).filter(x=>x.box>=3).length;
  const ready=Math.min(100, Math.round((mastered/Math.max(1,total))*100 + avgAccuracy()*0.5));
  const tiles = [
    ['lessons','📚',t('lessons'),{rw:"Iga, hanyuma wisuzumishe",en:"Learn, then quiz yourself",fr:"Apprenez, puis testez-vous"}],
    ['practice','🎯',t('practice'),{rw:"Utangira ku byo utazi neza",en:"Starts with what you know least",fr:"Commence par vos points faibles"}],
    ['study','🔎',t('study'),{rw:"Reba ibibazo n'ibisubizo byose",en:"Browse all questions & answers",fr:"Parcourir toutes les Q&R"}],
    ['legal','⚖️',t('legal'),{rw:"Soma amategeko nyayo (Igazeti ya Leta)",en:"Read the actual law (Official Gazette)",fr:"Lire la loi officielle"}],
    ['exam','📝',t('exam'),{rw:"Ibibazo 20 mu minota 20",en:"20 questions in 20 minutes",fr:"20 questions en 20 minutes"}],
    ['signs','🚸',t('signs'),{rw:"Menya ibyapa n'icyo bisobanura",en:"Learn the signs and what they mean",fr:"Apprenez les panneaux et leur sens"}],
    ['markings','🚦',t('markings'),{rw:"Imirongo yo mu muhanda, amatara, umupolisi",en:"Road markings, traffic lights, police",fr:"Marquages, feux, agent de police"}],
    ['practical','🚙',t('practical'),{rw:"Uko ikizamini gikorwa i Busanza",en:"How the road test works at Busanza",fr:"Le déroulement de l'examen à Busanza"}],
    ['flash','🃏',t('flash'),{rw:"Amakarita yo kwibuka ibyapa",en:"Sign memory flashcards",fr:"Cartes mémo pour les panneaux"}],
    ['glossary','📖',t('glossary'),{rw:"Ibisobanuro by'amagambo y'itegeko",en:"Definitions from the road code",fr:"Définitions du code de la route"}],
    ['progress','📈',t('progress'),{rw:"Ibyo wamenye n'ibyo ugomba kongera",en:"What you have mastered, and what to work on",fr:"Ce qui est acquis, ce qui reste à travailler"}],
    ['history','🕘',t('history'),{rw:"Ibizamini wakoze n'uko wagiye witera imbere",en:"Past attempts and your trend",fr:"Vos tentatives et votre progression"}],
    ['revision','🖨',t('revision'),{rw:"Sohora impapuro zo kwiga (ibyapa, ibibazo)",en:"Print study sheets (signs, weak questions)",fr:"Imprimez des fiches (panneaux, questions)"}],
    ['cert','🏅',t('cert'),{rw:"Icyemezo cy'aho ugeze ku myitozo",en:"A certificate of your practice progress",fr:"Un certificat de votre progression"}],
  ];
  view().innerHTML = `
    <div class="hero">
      <div class="hero-emoji">🚦</div>
      <h1>${t('welcome')}${S.name?', '+S.name:''} 👋</h1>
      <p>${t('tagline')}</p>
      <div class="hero-stats">
        <div class="hs"><div class="n">${total}</div><div class="l">${t('questions')}</div></div>
        <div class="hs"><div class="n">${DB.signs.length}</div><div class="l">${t('signsN')}</div></div>
        <div class="hs"><div class="n">${DB.glossary.length}</div><div class="l">${t('terms')}</div></div>
        <div class="hs"><div class="n">12/20</div><div class="l">${loc({rw:'Amanota atsinda',en:'Pass mark',fr:'Seuil'})}</div></div>
      </div>
      <div class="row" style="margin-top:20px">
        <button class="btn accent" onclick="go('exam')">📝 ${t('start_exam')}</button>
        <button class="btn ghost" onclick="go('practice')" style="color:#fff;background:rgba(255,255,255,.15);border:none">🎯 ${t('start_practice')}</button>
      </div>
    </div>

    <div class="card" style="margin-top:20px">
      <div class="ready">
        <div class="ring" style="--p:${ready}"><span>${ready}%</span></div>
        <div><div style="font-weight:800;font-size:17px">${t('readiness')}</div>
        <div class="muted">${mastered}/${total} ${t('questions')} · ${t('avg')} ${Math.round(avgAccuracy())}%</div></div>
      </div>
    </div>

    ${coachCard(ready)}
    ${assignmentBanner()}
    ${signOfDayCard()}

    <div class="section-title">${t('home')}</div>
    <div class="grid tiles">
      ${tiles.map(([k,ic,nm,ds])=>`<div class="tile" onclick="go('${k}')"><span class="t-ico">${ic}</span><div class="t-name">${nm}</div><div class="t-desc">${loc(ds)}</div></div>`).join('')}
    </div>`;
};

function avgAccuracy(){
  const vals=Object.values(S.qstats).filter(x=>x.seen>0);
  if(!vals.length) return 0;
  const tot=vals.reduce((a,x)=>a+x.correct,0), seen=vals.reduce((a,x)=>a+x.seen,0);
  return seen?tot/seen*100:0;
}

// Exam-date countdown + daily goal ring (#3). Owners don't sit the test, so it's candidates-only.
function coachCard(ready){
  if(isOwner()) return '';
  const days=daysUntilExam();
  const done=dailyCount(), goal=dailyGoal(), pct=Math.min(100,Math.round(done/Math.max(1,goal)*100));
  const goalMet=done>=goal;
  const countdown = days==null
    ? `<div style="flex:1"><div style="font-weight:800;font-size:16px">${loc({rw:'Ushyireho itariki y\'ikizamini',en:'Set your test date',fr:'Définir la date de l\'examen'})}</div>
         <div class="muted" style="font-size:13px">${loc({rw:'Turakwereka igihe gisigaye n\'uko witeguye.',en:'We\'ll show days left and how ready you are.',fr:'Nous afficherons le compte à rebours et votre préparation.'})}</div></div>
       <button class="btn accent sm" onclick="setTestDate()">📅 ${loc({rw:'Shyiraho',en:'Set date',fr:'Définir'})}</button>`
    : `<div style="flex:1">
         <div style="font-weight:800;font-size:26px;color:${days<0?'var(--red)':'var(--blue-700)'}">${days>0?days:(days===0?'0':'')}<span style="font-size:14px;font-weight:700"> ${days<0?loc({rw:'itariki yashize',en:'test date passed',fr:'date passée'}):(days===1?loc({rw:'umunsi',en:'day left',fr:'jour'}):loc({rw:'iminsi',en:'days left',fr:'jours'}))}</span></div>
         <div class="muted" style="font-size:13px">${loc({rw:'Ikizamini',en:'Test',fr:'Examen'})}: ${new Date(sess().testDate).toLocaleDateString()} · ${ready}% ${loc({rw:'witeguye',en:'ready',fr:'prêt'})}
           <button class="btn ghost sm" style="margin-left:6px" onclick="setTestDate()">✎</button></div></div>`;
  return `<div class="card" style="margin-top:12px">
    <div class="row" style="justify-content:space-between;align-items:center;gap:14px">${countdown}</div>
    <div style="margin-top:14px">
      <div class="row" style="justify-content:space-between;font-size:13px;margin-bottom:6px">
        <b>${goalMet?'✅ ':'🎯 '}${loc({rw:'Intego y\'uyu munsi',en:'Today\'s goal',fr:'Objectif du jour'})}</b>
        <span class="muted">${done}/${goal} ${t('questions')}</span></div>
      <div class="q-progress"><div style="width:${pct}%;background:${goalMet?'var(--green,#1B7A3D)':'var(--blue-600)'}"></div></div>
    </div></div>`;
}
window.setTestDate=function(){
  const cur=sess().testDate? new Date(sess().testDate).toISOString().slice(0,10) : '';
  modal(`<h2>📅 ${loc({rw:'Itariki y\'ikizamini',en:'Your test date',fr:'Date de l\'examen'})}</h2>
    <p class="muted" style="margin:8px 0">${loc({rw:'Hitamo itariki wateganyije gukorera ikizamini.',en:'Pick the day you plan to sit the test.',fr:'Choisissez le jour prévu de l\'examen.'})}</p>
    <input type="date" id="tdInput" value="${cur}" style="width:100%;padding:12px;font-size:16px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text)"/>
    <div class="field" style="margin-top:14px"><label>${loc({rw:'Intego ya buri munsi (ibibazo)',en:'Daily goal (questions)',fr:'Objectif quotidien (questions)'})}</label>
      <input type="number" id="tdGoal" min="5" max="200" value="${dailyGoal()}"/></div>
    <div class="row" style="margin-top:16px;justify-content:flex-end">
      ${sess().testDate?`<button class="btn ghost" onclick="clearTestDate()" style="color:var(--red)">${loc({rw:'Siba',en:'Clear',fr:'Effacer'})}</button>`:''}
      <button class="btn accent" onclick="saveTestDate()">✓ ${t('save')||loc({rw:'Bika',en:'Save',fr:'Enregistrer'})}</button></div>`);
};
window.saveTestDate=function(){
  const v=document.getElementById('tdInput').value;
  const g=parseInt(document.getElementById('tdGoal').value,10);
  const sp=sess();
  if(v){ const d=new Date(v+'T00:00:00'); sp.testDate=d.getTime(); }
  if(g>=5&&g<=200) sp.dailyGoal=g;
  saveProgress(); closeModal(); go('home');
};
window.clearTestDate=function(){ const sp=sess(); delete sp.testDate; saveProgress(); closeModal(); go('home'); };

// Sign of the day (#6): a 20-second daily recognition quiz, deterministic per date.
let SOD_STATE=null;
function seededShuffle(a,seed){ a=a.slice(); for(let i=a.length-1;i>0;i--){ seed=(seed*9301+49297)%233280; const j=Math.floor(seed/233280*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function signsForDaily(){ return DB.signs.filter(s=>loc(s.meaning)); }
function signOfDay(){ const pool=signsForDaily(); if(!pool.length) return null; const day=Math.floor(Date.now()/86400000); return pool[day%pool.length]; }
function signOfDayOptions(sign){ const day=Math.floor(Date.now()/86400000); const correct=loc(sign.meaning);
  const others=[...new Set(signsForDaily().filter(s=>s.code!==sign.code).map(s=>loc(s.meaning)).filter(m=>m&&m!==correct))];
  return seededShuffle([...seededShuffle(others,day).slice(0,3), correct], day+7);
}
function signOfDayCard(){
  if(isOwner()) return '';
  const sign=signOfDay(); if(!sign) return '';
  const key='sod-'+Math.floor(Date.now()/86400000);
  if(!SOD_STATE||SOD_STATE.key!==key) SOD_STATE={ key, pick:null, opts:signOfDayOptions(sign) };
  const correct=loc(sign.meaning), st=SOD_STATE;
  return `<div class="card" style="margin-top:12px">
    <b>🚸 ${loc({rw:'Icyapa cy\'uyu munsi',en:'Sign of the day',fr:'Panneau du jour'})}</b>
    <div class="row" style="gap:14px;align-items:center;margin-top:12px">
      ${signBig(sign,72)}
      <div style="flex:1;font-weight:600">${loc({rw:'Iki cyapa gisobanura iki?',en:'What does this sign mean?',fr:'Que signifie ce panneau ?'})}</div></div>
    <div style="margin-top:10px">${st.opts.map((o,i)=>{
      let cls=''; if(st.pick!=null){ if(o===correct) cls=' correct'; else if(o===st.pick) cls=' wrong'; }
      return `<div class="opt${cls}" ${st.pick==null?`onclick="answerSOD(${i})"`:'style="pointer-events:none"'}>
        <div class="k">${String.fromCharCode(65+i)}</div><div>${o}</div></div>`;}).join('')}</div>
    ${st.pick!=null?`<div class="explain" style="margin-top:8px"><b>${st.pick===correct?'✅ '+loc({rw:'Ni byo! Wamenye iki cyapa.',en:'Correct! You know this one.',fr:'Correct !'}):'❌ '+loc({rw:'Reba igisubizo nyacyo hepfo (kigaragara icyatsi).',en:'Not quite — the right answer is highlighted.',fr:'Pas tout à fait — voir la bonne réponse.'})}</b>
      <button class="btn sm ghost" style="margin-left:8px" onclick="go('signs')">${loc({rw:'Menya byinshi',en:'Learn more',fr:'En savoir plus'})} →</button></div>`:''}
  </div>`;
}
window.answerSOD=function(i){ if(!SOD_STATE||SOD_STATE.pick!=null) return; SOD_STATE.pick=SOD_STATE.opts[i]; bumpDaily(); saveProgress(); go('home'); };

// Teacher assignment banner (#8): a candidate sees the topics their instructor asked them to drill.
function assignmentBanner(){
  if(isOwner()) return '';
  const a=sess().assignment;
  if(!a||!a.cats||!a.cats.length) return '';
  const names=a.cats.map(c=>catLabel(c)).join(', ');
  return `<div class="card" style="margin-top:12px;border-left:4px solid var(--gold,#E0A500)">
    <div class="row" style="justify-content:space-between;align-items:center;gap:12px">
      <div style="flex:1"><div style="font-weight:800">👩‍🏫 ${loc({rw:'Umwarimu yaguhaye umwitozo',en:'Your instructor set you a drill',fr:'Votre enseignant vous a assigné un exercice'})}</div>
        <div class="muted" style="font-size:13px">${names}${a.note?` · “${a.note}”`:''}</div></div>
      <button class="btn accent sm" onclick='drillWeak(${JSON.stringify(a.cats)})'>▶ ${loc({rw:'Tangira',en:'Start',fr:'Commencer'})}</button>
    </div></div>`;
}

// ---- PRACTICE (weakest-first) ----
let PR=null;
function pickPractice(cat){
  let pool = DB.questions.filter(q=>!cat||q.category===cat);
  // weakest-first: unseen + low box first
  pool = pool.map(q=>{ const st=S.qstats[q.id]||{box:0,seen:0}; return {q, w:(st.seen===0?-1:st.box)+Math.random()*0.3}; })
             .sort((a,b)=>a.w-b.w).map(x=>x.q);
  return pool;
}
VIEWS.practice = function(){
  const cats = Object.keys(CAT_LABELS).filter(c=>DB.questions.some(q=>q.category===c));
  view().innerHTML = `
    <div class="card" style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;gap:12px">
      <div><b>🎧 ${loc({rw:'Uburyo bwo kumva',en:'Listen mode',fr:'Mode écoute'})}</b>
        <div class="muted" style="font-size:13px">${loc({rw:'Ikibazo n\'ibisubizo bisomwa mu majwi; kanda igisubizo wumvise.',en:'Questions and answers are read aloud; tap the option you heard.',fr:'Questions et réponses lues à voix haute ; touchez l\'option entendue.'})}</div></div>
      <button class="btn ${S.listenMode?'accent':'ghost'}" id="prListen">${S.listenMode?'🔊 '+loc({rw:'Birakora',en:'On',fr:'Activé'}):'🔇 '+loc({rw:'Ntibikora',en:'Off',fr:'Désactivé'})}</button>
    </div>
    ${S.lang!=='rw'&&t('trans_review')?`<div class="card" style="margin-bottom:12px;border-left:4px solid var(--gold,#E0A500);font-size:13px">ℹ️ ${t('trans_review')}</div>`:''}
    <div class="chips" id="prChips">
      <div class="chip active" data-c="">${t('all')}</div>
      ${cats.map(c=>`<div class="chip" data-c="${c}">${chipIcon(c)}${catLabel(c)}</div>`).join('')}
    </div>
    <div id="prArea"></div>`;
  document.getElementById('prListen').onclick=e=>{ S.listenMode=!S.listenMode; persist();
    e.target.className='btn '+(S.listenMode?'accent':'ghost');
    e.target.innerHTML=S.listenMode?('🔊 '+loc({rw:'Birakora',en:'On',fr:'Activé'})):('🔇 '+loc({rw:'Ntibikora',en:'Off',fr:'Désactivé'}));
    if(S.listenMode){ if(PR&&PR.queue[PR.i]) speakQuestion(PR.queue[PR.i], PR._opts||shuffle(PR.queue[PR.i].options)); }
    else if(window.speechSynthesis) speechSynthesis.cancel(); };
  view().querySelectorAll('#prChips .chip').forEach(ch=>ch.onclick=()=>{
    view().querySelectorAll('#prChips .chip').forEach(x=>x.classList.remove('active'));
    ch.classList.add('active'); startPractice(ch.dataset.c);
  });
  startPractice('');
};
let PENDING_DRILL=null;
function pickDrill(cats){
  const set=new Set(cats);
  return DB.questions.filter(q=>set.has(q.category))
    .map(q=>{ const st=S.qstats[q.id]||{box:0,seen:0}; return {q, w:(st.seen===0?-1:st.box)+Math.random()*0.3}; })
    .sort((a,b)=>a.w-b.w).map(x=>x.q).slice(0,20);
}
// From the exam result or a teacher assignment: practise only the weak categories.
window.drillWeak=function(cats){ PENDING_DRILL=(cats||[]).slice(); go('practice'); };
function startPractice(cat){
  if(PENDING_DRILL){ const cats=PENDING_DRILL; PENDING_DRILL=null;
    PR={ queue:pickDrill(cats), i:0, answered:false, drill:cats };
  } else {
    PR={ queue:pickPractice(cat), i:0, answered:false, drill:null };
  }
  renderPractice();
}
function renderPractice(){
  if(!PR.queue.length){ document.getElementById('prArea').innerHTML=`<div class="empty">Nta bibazo.</div>`; return; }
  const q=PR.queue[PR.i];
  const opts=shuffle(q.options); PR._opts=opts;
  document.getElementById('prArea').innerHTML = `
    ${PR.drill?`<div class="card" style="margin-bottom:10px;border-left:4px solid var(--blue-600)"><b>🎯 ${loc({rw:'Umwitozo w\'aho udahagaze neza',en:'Weak-topics drill',fr:'Exercice ciblé'})}</b> <span class="muted">· ${PR.drill.map(c=>catLabel(c)).join(', ')}</span></div>`:''}
    <div class="q-wrap">
      <div class="q-meta"><span>${t('question')} ${PR.i+1} ${t('of')} ${PR.queue.length}</span>
        <span>${catLabel(q.category)} · <button class="btn sm ghost" id="prSpeak">🔊 ${t('listen')}</button>
        <button class="btn sm ghost" id="prReport" title="${t('report_q')}">⚠</button></span></div>
      <div class="q-progress"><div style="width:${(PR.i)/PR.queue.length*100}%"></div></div>
      <div class="q-stem">${loc(q.stem)}</div>
      ${questionMedia(q)}
      <div id="prOpts">${opts.map((o,i)=>optRow(o,i,q)).join('')}</div>
      <div id="prExplain"></div>
      <div class="q-actions">
        <button class="btn ghost" id="prPrev">← ${t('back')}</button>
        <button class="btn" id="prNext" disabled>${t('next')} →</button>
      </div>
    </div>`;
  document.getElementById('prSpeak').onclick=()=>speakQuestion(q,opts);
  document.getElementById('prReport').onclick=()=>reportQuestion(q);
  if(S.listenMode) speakQuestion(q,opts);   // audio-first: auto-read each question
  document.getElementById('prPrev').onclick=()=>{ if(PR.i>0){PR.i--;PR.answered=false;renderPractice();} };
  document.getElementById('prNext').onclick=()=>{ PR.i=(PR.i+1)%PR.queue.length; PR.answered=false; renderPractice(); };
  document.querySelectorAll('#prOpts .opt').forEach(row=>row.onclick=()=>answerPractice(row,q));
  PR.answered=false;
}
function optRow(o,i,q){
  // Picture-option question: the option IS an image (PDFO_*).
  if(o.image){
    return `<div class="opt" data-oid="${o.id}" data-correct="${o.correct}">
      <div class="k">${String.fromCharCode(65+i)}</div>
      <img class="opt-sign" src="${assetUrl(o.image)}" onerror="this.style.display='none'"/></div>`;
  }
  const s=signForText(o[S.lang]||o.rw);
  const label=(o[S.lang]||o.rw||'').trim();
  return `<div class="opt" data-oid="${o.id}" data-correct="${o.correct}">
    <div class="k">${String.fromCharCode(65+i)}</div>
    ${s?signImg(s,'opt-sign'):''}
    <div>${label}${s?` <span class="muted">(${s.code})</span>`:''}</div></div>`;
}
function answerPractice(row,q){
  if(PR.answered) return; PR.answered=true;
  const chosenCorrect = row.dataset.correct==='true';
  document.querySelectorAll('#prOpts .opt').forEach(r=>{
    if(r.dataset.correct==='true') r.classList.add('correct');
    else if(r===row) r.classList.add('wrong');
    r.style.pointerEvents='none';
  });
  recordAnswer(q.id, chosenCorrect);
  const exp=loc(q.explanation);
  document.getElementById('prExplain').innerHTML =
    `<div class="explain"><b>${chosenCorrect?'✅ '+t('correct'):'❌ '+t('wrong')}.</b> ${exp||''}
     ${exp?`<button class="btn sm ghost" style="margin-left:8px" onclick="speak(${JSON.stringify(exp).replace(/"/g,'&quot;')})">🔊</button>`:''}</div>`;
  document.getElementById('prNext').disabled=false;
}
function recordAnswer(id, ok){
  const st=S.qstats[id]||{box:0,seen:0,correct:0,wrong:0};
  st.seen++; if(ok){ st.correct++; st.box=Math.min(5,st.box+1);} else { st.wrong++; st.box=Math.max(0,st.box-1); }
  S.qstats[id]=st; bumpDaily(); saveProgress();
}

// ---- MOCK EXAM ----
let EX=null, TIMER=null;
function stopTimer(){ if(TIMER){ clearInterval(TIMER); TIMER=null; } }
VIEWS.exam = function(){
  if(EX && !EX.done){ renderExam(); return; }
  const rules=[
    {rw:'Ibibazo 20, buri kimwe gifite ibisubizo 4; hitamo kimwe gusa.',en:'20 questions, each with 4 options; choose one only.',fr:'20 questions, 4 options chacune ; choisissez-en une.'},
    {rw:'Ufite iminota 20. Isaha ntihagarara kugeza usoje cyangwa usohotse.',en:'You have 20 minutes. The clock does not stop until you finish or leave.',fr:'Vous avez 20 minutes. Le chrono ne s\'arrête pas.'},
    {rw:'Iyo igihe kirangiye, ikizamini kabikwa cyikora (auto-submit).',en:'When time runs out, the exam is submitted automatically.',fr:'À la fin du temps, l\'examen est soumis automatiquement.'},
    {rw:'Ushobora gusubira inyuma no gukomeza mu kizamini, ndetse ushyire akamenyetso ku kibazo.',en:'You can move back and forward within the exam, and flag a question.',fr:'Vous pouvez naviguer et marquer une question.'},
    {rw:'Utsinda ku manota 12/20. Nta gihombo ku gisubizo kitari cyo, ahubwo subiza byose.',en:'Pass mark is 12/20. No penalty for a wrong answer, so answer them all.',fr:'Seuil 12/20. Aucune pénalité, répondez à tout.'},
    {rw:'Ikizamini gifata ecran yose; ntushobora kujya ku bindi. Nusohoka, amanota abikwa maze kirangire.',en:'The exam takes the full screen; you cannot open other sections. If you leave, your marks are saved and the exam ends.',fr:'L\'examen occupe tout l\'écran ; le quitter enregistre vos points et met fin à l\'examen.'},
  ];
  view().innerHTML=`<div class="q-wrap">
    <div style="text-align:center"><div style="font-size:52px">📝</div>
      <h2 style="margin:8px 0">${t('exam')}</h2>
      <p class="muted">${loc({rw:'Soma amabwiriza mbere yo gutangira',en:'Read the instructions before you start',fr:'Lisez les consignes avant de commencer'})}</p></div>
    <div class="card" style="margin-top:16px">
      ${rules.map(r=>`<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:10px"><span style="color:var(--blue-600);font-weight:800">•</span><span style="line-height:1.5">${loc(r)}</span></div>`).join('')}
    </div>
    <button class="btn wide accent" id="exStart" style="margin-top:16px">▶ ${loc({rw:'Nditeguye, tangira',en:"I'm ready, start",fr:'Je suis prêt, commencer'})}</button>
  </div>`;
  document.getElementById('exStart').onclick=beginExam;
};
function beginExam(){
  const qs=shuffle(DB.questions).slice(0,20).map(q=>({q, opts:shuffle(q.options), pick:null}));
  EX={ qs, i:0, done:false, endAt:Date.now()+20*60*1000 };
  document.getElementById('app').classList.add('exam-active');   // distraction-free full window
  window.api.setFullscreen && window.api.setFullscreen(true);
  renderExam(); startTimer();
}
function endExamMode(){
  document.getElementById('app').classList.remove('exam-active');
  window.api.setFullscreen && window.api.setFullscreen(false);
}
// Strict: leaving mid-exam warns (by name), then saves marks and ends.
function confirmLeaveExam(){
  if(confirm(loc({
    rw:`${S.name}, urashaka gusohoka mu kizamini? Amanota wabonye kugeza ubu azabikwa, ikizamini kirangire.`,
    en:`${S.name}, leave the exam now? Your current marks will be saved and the exam will end.`,
    fr:`${S.name}, quitter l'examen ? Vos points actuels seront enregistrés et l'examen sera terminé.`}))) submitExam();
}
function startTimer(){
  stopTimer();
  TIMER=setInterval(()=>{
    const left=Math.max(0,EX.endAt-Date.now());
    const el=document.getElementById('exTimer');
    if(el){ const m=Math.floor(left/60000),s=Math.floor(left%60000/1000);
      el.textContent=`${m}:${String(s).padStart(2,'0')}`; el.classList.toggle('warn',left<120000); }
    if(!EX.warned5 && left<=5*60*1000){ EX.warned5=true; speak(t('five_min')); toast('⏱ '+t('five_min')); }
    if(left<=0){ stopTimer(); submitExam(); }
  },500);
}
function renderExam(){
  const item=EX.qs[EX.i], q=item.q;
  view().innerHTML=`
    <div class="exam-bar">
      <div style="font-weight:800">📝 ${t('exam')} · <span class="muted" style="font-weight:600">${S.name}</span></div>
      <div class="row"><span style="font-weight:700">⏱ <span class="timer" id="exTimer">20:00</span></span>
        <button class="btn ghost sm" id="exLeave" style="color:var(--red)">${loc({rw:'Sohoka mu kizamini',en:'Leave exam',fr:"Quitter l'examen"})} ✕</button></div>
    </div>
    <div class="q-wrap">
    <div class="q-meta"><span>${t('question')} ${EX.i+1} ${t('of')} 20</span>
      <span class="muted">${loc({rw:'Isaha ntihagarara',en:'The clock keeps running',fr:'Le chrono continue'})}</span></div>
    <div class="q-progress"><div style="width:${(EX.i+1)/20*100}%"></div></div>
    <div class="q-stem">${loc(q.stem)}</div>
    ${questionMedia(q)}
    <div id="exOpts">${item.opts.map((o,i)=>{
      if(o.image) return `<div class="opt${item.pick===o.id?' sel':''}" data-oid="${o.id}"><div class="k">${String.fromCharCode(65+i)}</div><img class="opt-sign" src="${assetUrl(o.image)}" onerror="this.style.display='none'"/></div>`;
      const s=signForText(o[S.lang]||o.rw);
      return `<div class="opt${item.pick===o.id?' sel':''}" data-oid="${o.id}">
      <div class="k">${String.fromCharCode(65+i)}</div>${s?signImg(s,'opt-sign'):''}
      <div>${o[S.lang]||o.rw||''}${s?` <span class="muted">(${s.code})</span>`:''}</div></div>`;
    }).join('')}</div>
    <div class="q-actions">
      <button class="btn ghost" id="exPrev" ${EX.i===0?'disabled':''}>← ${t('back')}</button>
      <div class="row">
        <button class="btn ghost" id="exFlag" title="(F)">${item.flag?'🚩 '+t('flagged'):'⚐ '+t('flag')}</button>
        <button class="btn ghost" id="exNav">▤</button>
        ${EX.i<19?`<button class="btn" id="exNext">${t('next')} →</button>`:`<button class="btn accent" id="exSubmit">${t('finish')} ✓</button>`}
      </div>
    </div></div>`;
  document.querySelectorAll('#exOpts .opt').forEach(r=>r.onclick=()=>{
    item.pick=r.dataset.oid; document.querySelectorAll('#exOpts .opt').forEach(x=>x.classList.remove('sel')); r.classList.add('sel');
  });
  const prev=document.getElementById('exPrev'); if(prev) prev.onclick=()=>{ EX.i--; renderExam(); };
  const nx=document.getElementById('exNext'); if(nx) nx.onclick=()=>{ EX.i++; renderExam(); };
  const sb=document.getElementById('exSubmit'); if(sb) sb.onclick=()=>{ if(confirm(loc({rw:'Soza ikizamini?',en:'Submit the exam?',fr:'Terminer l\'examen ?'}))) submitExam(); };
  document.getElementById('exFlag').onclick=()=>{ item.flag=!item.flag; renderExam(); };
  document.getElementById('exNav').onclick=examNavigator;
  document.getElementById('exLeave').onclick=confirmLeaveExam;
}
function examNavigator(){
  modal(`<h2>${t('question')}</h2><div class="grid" style="grid-template-columns:repeat(5,1fr);gap:8px;margin-top:12px">
    ${EX.qs.map((it,i)=>`<button class="btn ${it.flag?'accent':(it.pick?'':'ghost')} sm" onclick="EX.i=${i};closeModal();renderExam();" style="justify-content:center">${it.flag?'🚩':''}${i+1}</button>`).join('')}</div>`);
}
// Shared "where your marks went" breakdown (exam result + history detail). `cats` = {cat:{correct,total}}.
function catBreakdownHtml(cats, opts){
  opts=opts||{};
  const rows=Object.entries(cats||{}).map(([c,v])=>({c,correct:v.correct,total:v.total,lost:v.total-v.correct}))
    .sort((a,b)=> (b.lost/b.total)-(a.lost/a.total) || b.lost-a.lost);
  if(!rows.length) return '';
  const weakCats=rows.filter(r=>r.lost>0).map(r=>r.c);
  return `<b>📊 ${loc({rw:'Aho amanota yagiye',en:'Where your marks went',fr:'Répartition de vos points'})}</b>
    <div style="margin-top:12px">${rows.map(r=>{const g=Math.round(r.correct/r.total*100);const col=g>=60?'var(--green,#1B7A3D)':'var(--red)';
      return `<div style="margin-bottom:10px"><div class="row" style="justify-content:space-between;font-size:13px;margin-bottom:4px">
        <span>${chipIcon(r.c)}${catLabel(r.c)}</span><b style="color:${col}">${r.correct}/${r.total}</b></div>
        <div class="q-progress"><div style="width:${g}%;background:${col}"></div></div></div>`;}).join('')}</div>
    ${opts.drill&&weakCats.length?`<button class="btn accent wide" style="margin-top:8px" onclick='closeModal();drillWeak(${JSON.stringify(weakCats)})'>🎯 ${loc({rw:'Witoze aho udahagaze neza',en:'Drill my weak topics',fr:'Réviser mes points faibles'})}</button>`:''}`;
}
function submitExam(){
  stopTimer(); EX.done=true; endExamMode();
  let score=0; const cats={}; const missed=[];
  EX.qs.forEach(it=>{ const c=correctOpt(it.q); const cat=it.q.category||'rusange';
    cats[cat]=cats[cat]||{correct:0,total:0}; cats[cat].total++;
    const ok=c&&it.pick===c.id;
    if(ok){ score++; cats[cat].correct++; recordAnswer(it.q.id,true); }
    else { recordAnswer(it.q.id,false); missed.push(it.q.id); } });
  const pct=Math.round(score/20*100), passed=pct>=60;
  S.history.unshift({date:Date.now(),score,total:20,pct,passed,cats,missed}); if(S.history.length>50) S.history.length=50; saveProgress();
  const emoji=passed?'🎉':'💪';
  const msg=passed?loc({rw:`Wakoze neza ${S.name}! Watsinze.`,en:`Well done ${S.name}! You passed.`,fr:`Bravo ${S.name} !`})
                  :loc({rw:`Komeza witoze ${S.name}, urabishoboye!`,en:`Keep practising ${S.name}, you can do it!`,fr:`Continuez ${S.name} !`});
  // Per-category breakdown, weakest first: where the marks were actually lost (#2).
  const breakdown=`<div class="card" style="max-width:560px;margin:14px auto">${catBreakdownHtml(cats,{drill:true})}</div>`;
  view().innerHTML=`<div class="card" style="max-width:560px;margin:10px auto">
    <div class="result-hero">
      <div class="big">${emoji}</div>
      <div class="score ${passed?'pass':'fail'}">${pct}%</div>
      <div class="muted">${score}/20 ${t('questions')}</div>
      <div style="margin:14px 0"><span class="pill ${passed?'pass':'fail'}">${passed?'✓ '+t('passed'):'✗ '+t('failed')}</span></div>
      <p>${msg}</p>
    </div>
    <div class="row" style="justify-content:center;margin-top:8px">
      <button class="btn ghost" onclick="EX=null;go('exam')">↻ ${t('retry')}</button>
      ${passed?`<button class="btn accent" onclick="go('cert')">🏅 ${t('get_cert')}</button>`:''}
      <button class="btn" onclick="go('history')">🕘 ${t('history')}</button>
    </div></div>${breakdown}`;
};

// ---- SIGNS ----
let SIGN_FILTER={fam:'',q:''};
VIEWS.signs = function(){
  const fams=[...new Set(DB.signs.map(s=>s.family))];
  view().innerHTML=`
    <input class="search" id="sgSearch" placeholder="${t('search_sign')}" value="${SIGN_FILTER.q}"/>
    <div class="chips" id="sgChips">
      <div class="chip ${SIGN_FILTER.fam===''?'active':''}" data-f="">${t('all')}</div>
      ${fams.map(f=>`<div class="chip ${SIGN_FILTER.fam===f?'active':''}" data-f="${f}">${loc(DB.signs.find(s=>s.family===f).familyLabel)}</div>`).join('')}
    </div>
    <div class="grid signs-grid" id="sgGrid"></div>`;
  const draw=()=>{
    const list=DB.signs.filter(s=>(!SIGN_FILTER.fam||s.family===SIGN_FILTER.fam)&&
      (!SIGN_FILTER.q||(s.code+loc(s.meaning)).toLowerCase().includes(SIGN_FILTER.q.toLowerCase())));
    document.getElementById('sgGrid').innerHTML=list.length?list.map(s=>`
      <div class="sign-card" onclick='signDetail("${s.code}")'>
        ${signImg(s)}<div class="code">${s.code}</div><div class="fam">${loc(s.familyLabel)}</div></div>`).join(''):`<div class="empty">-</div>`;
  };
  document.getElementById('sgSearch').oninput=e=>{ SIGN_FILTER.q=e.target.value; draw(); };
  view().querySelectorAll('#sgChips .chip').forEach(c=>c.onclick=()=>{ SIGN_FILTER.fam=c.dataset.f;
    view().querySelectorAll('#sgChips .chip').forEach(x=>x.classList.remove('active')); c.classList.add('active'); draw(); });
  draw();
};
window.signDetail=function(code){
  const s=DB.signs.find(x=>x.code===code); if(!s) return;
  modal(`<div style="text-align:center">${signBig(s,150)}
    <h2 style="margin-top:10px">${s.code}</h2>
    <div class="muted" style="font-weight:700">${loc(s.familyLabel)}</div>
    <p style="margin:14px 0;line-height:1.5">${loc(s.meaning)||s.intlName||''}</p>
    <button class="btn ghost" onclick="speak(${JSON.stringify(loc(s.meaning)||'').replace(/"/g,'&quot;')})">🔊 ${t('listen')}</button>
    <div class="muted" style="font-size:11px;margin-top:14px">${s.source&&s.source.document?s.source.document:''}</div></div>`);
};

// ---- MARKINGS ----
VIEWS.markings = function(){
  view().innerHTML=`<div class="chips" id="mkTabs">${MK_GROUPS.map((g,i)=>`<div class="chip ${i===0?'active':''}" data-k="${g}">${loc(MK_GROUP_LABEL[g])}</div>`).join('')}</div><div class="grid tiles" id="mkGrid"></div>`;
  const draw=(g)=>{ document.getElementById('mkGrid').innerHTML=MARKINGS.filter(m=>m.group===g).map(m=>`
    <div class="card" style="text-align:center;cursor:pointer" onclick="speak(${JSON.stringify(mkName(m)+'. '+mkMeaning(m)).replace(/"/g,'&quot;')})">
      <svg viewBox="0 0 120 80" style="width:100%;height:110px;background:var(--surface-2);border-radius:10px">${MK_SVG[m.kind]||''}</svg>
      <div style="font-weight:800;margin-top:10px">${mkName(m)}</div>
      <div class="muted" style="font-size:13px;margin-top:4px">${mkMeaning(m)}</div></div>`).join(''); };
  view().querySelectorAll('#mkTabs .chip').forEach(c=>c.onclick=()=>{ view().querySelectorAll('#mkTabs .chip').forEach(x=>x.classList.remove('active')); c.classList.add('active'); draw(c.dataset.k); });
  draw('imirongo');
};

// ---- PRACTICAL EXAM (continuous, zoomable document view of the 32 Busanza pages) ----
let PX={zoom:100};
VIEWS.practical = function(){
  const total=32;
  const pages=Array.from({length:total},(_,i)=>i+1);
  view().innerHTML=`
    <div class="doc-toolbar">
      <span class="muted" style="font-weight:700">${loc({rw:"Ikizamini cy'imikorere (RNP / Busanza)",en:'Practical test (RNP / Busanza)',fr:'Examen pratique (RNP / Busanza)'})}</span>
      <div class="row">
        <button class="btn ghost sm" id="pxOut">A−</button>
        <span id="pxZ" style="min-width:52px;text-align:center;font-weight:700">${PX.zoom}%</span>
        <button class="btn ghost sm" id="pxIn">A+</button>
        <button class="btn ghost sm" id="pxReset">${loc({rw:'Bisubize',en:'Reset',fr:'Réinit.'})}</button>
      </div>
    </div>
    <div class="doc-scroll" id="pxScroll">
      <div id="pxPages">${pages.map(n=>`
        <div class="doc-page" style="width:${PX.zoom}%">
          <div class="doc-pageno">${loc({rw:'Urupapuro',en:'Page',fr:'Page'})} ${n} / ${total}</div>
          <img src="assets/practical/p${String(n).padStart(2,'0')}.png" loading="lazy"
            style="cursor:zoom-in" onclick="pxZoom(${n})" onerror="this.style.display='none'"/>
        </div>`).join('')}</div>
    </div>`;
  const apply=()=>{ PX.zoom=Math.max(50,Math.min(200,PX.zoom)); document.getElementById('pxZ').textContent=PX.zoom+'%';
    document.querySelectorAll('#pxPages .doc-page').forEach(p=>p.style.width=PX.zoom+'%'); };
  document.getElementById('pxIn').onclick=()=>{ PX.zoom+=15; apply(); };
  document.getElementById('pxOut').onclick=()=>{ PX.zoom-=15; apply(); };
  document.getElementById('pxReset').onclick=()=>{ PX.zoom=100; apply(); };
};
window.pxZoom=function(n){
  modal(`<img src="assets/practical/p${String(n).padStart(2,'0')}.png" style="width:100%;border-radius:8px"/>`);
};

// ---- GUIDED LESSONS (learn, then quiz) ----
// Pick a lesson field in the current language: French, then English, then Kinyarwanda fallback.
function lz(l,base){
  if(S.lang==='fr') return l[base+'Fr']||l[base+'Rw'];
  if(S.lang==='en') return l[base+'En']||l[base+'Rw'];
  return l[base+'Rw'];
}
VIEWS.lessons = function(){
  // only topics that have questions in the bank (mirrors Android)
  const cats = new Set(DB.questions.map(q=>q.category));
  const list = (DB.lessons||[]).filter(l=>cats.has(l.category));
  view().innerHTML = `<p class="muted" style="max-width:640px;margin:0 0 18px">${t('lessons_intro')}</p>
    <div class="grid tiles">${list.map((l,i)=>`
      <div class="tile" onclick="openLesson(${i})"><div style="margin-bottom:10px">${catIcon(l.category,52)}</div>
        <div class="t-name">${lz(l,'title')}</div>
        <div class="t-desc">${catLabel(l.category)}</div></div>`).join('')}</div>`;
  window.__lessonList=list;
};
window.openLesson=function(i){
  const l=window.__lessonList[i]; if(!l) return;
  const intro=lz(l,'intro');
  const points=(S.lang==='fr'?(l.pointsFr||l.pointsRw):(S.lang==='en'?l.pointsEn:l.pointsRw))||[];
  const title=lz(l,'title');
  view().innerHTML=`<div class="q-wrap">
    <button class="btn ghost sm" onclick="go('lessons')">← ${t('lessons')}</button>
    <div class="row" style="align-items:center;gap:14px;margin:14px 0 6px">${catIcon(l.category,48)}<h1 style="font-size:26px;margin:0">${title}</h1></div>
    <div class="card"><p style="line-height:1.6">${intro}
      <button class="btn sm ghost" style="margin-left:8px" onclick="speak(${JSON.stringify(intro).replace(/"/g,'&quot;')})">🔊</button></p></div>
    <div class="section-title">${t('key_points')}</div>
    ${points.map(p=>`<div class="card" style="margin-bottom:10px;display:flex;gap:12px;align-items:flex-start"><span style="color:var(--green);font-weight:800">✓</span><span style="line-height:1.5">${p}</span></div>`).join('')}
    <button class="btn wide accent" style="margin-top:16px" onclick="go('practice');setTimeout(()=>startPractice('${l.category}'),60)">🎯 ${t('start_quiz')}</button>
  </div>`;
};

// ---- STUDY MODE (browse every question with its answer) ----
let STU={q:'',cat:''};
VIEWS.study = function(){
  const cats=[...new Set(DB.questions.map(q=>q.category))];
  view().innerHTML=`<p class="muted" style="margin:0 0 12px">${t('study_intro')}</p>
    <input class="search" id="stuSearch" placeholder="${t('search_term')}" value="${STU.q}"/>
    <div class="chips" id="stuChips"><div class="chip ${STU.cat===''?'active':''}" data-c="">${t('all')}</div>
      ${cats.map(c=>`<div class="chip ${STU.cat===c?'active':''}" data-c="${c}">${chipIcon(c)}${catLabel(c)}</div>`).join('')}</div>
    <div id="stuList"></div>`;
  const draw=()=>{
    const list=DB.questions.filter(q=>(!STU.cat||q.category===STU.cat)&&
      (!STU.q||loc(q.stem).toLowerCase().includes(STU.q.toLowerCase())));
    document.getElementById('stuList').innerHTML= list.length? list.map(q=>{
      const media=q.media&&q.media.assetId?`<div style="margin:8px 0"><img src="${assetUrl(q.media.assetId)}" style="max-height:120px;max-width:180px;object-fit:contain;background:#fff;border-radius:8px;padding:6px"/></div>`:'';
      // Always show ALL 4 options with the correct one(s) highlighted - so options that refer to
      // others ("A na B ni ibisubizo by'ukuri", "Nta gisubizo cy'ukuri kirimo") make sense.
      const opts=q.options.map((o,i)=>{
        const on=o.correct;
        const s=signForText(o.rw);
        return `<div style="display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;margin-top:6px;border:1px solid ${on?'var(--green)':'var(--border)'};background:${on?'rgba(29,185,84,.12)':'var(--surface-2)'}">
          <span class="k" style="width:26px;height:26px;flex:0 0 26px">${String.fromCharCode(65+i)}</span>
          ${o.image?`<img src="${assetUrl(o.image)}" style="width:44px;height:44px;object-fit:contain;background:#fff;border-radius:6px;padding:2px"/>`:''}
          ${s?signImg(s,'opt-sign'):''}
          <span style="flex:1${on?';font-weight:800':''}">${o[S.lang]||o.rw||''}</span>
          ${on?'<span style="color:var(--green);font-weight:800">✓</span>':''}</div>`;
      }).join('');
      return `<div class="card" style="margin-bottom:12px">
        <div style="font-weight:700;line-height:1.4">${loc(q.stem)}</div>${media}
        <div style="margin-top:6px">${opts}</div></div>`;
    }).join('') : `<div class="empty">-</div>`;
  };
  document.getElementById('stuSearch').oninput=e=>{STU.q=e.target.value;draw();};
  view().querySelectorAll('#stuChips .chip').forEach(ch=>ch.onclick=()=>{STU.cat=ch.dataset.c;
    view().querySelectorAll('#stuChips .chip').forEach(x=>x.classList.remove('active'));ch.classList.add('active');draw();});
  draw();
};

// ---- LEGAL REFERENCE (official gazette PDFs + search-in-law) ----
let LEG=null;
VIEWS.legal = function(){
  if(LEG&&LEG.open){ renderGazette(); return; }
  view().innerHTML=`<p class="muted" style="max-width:680px;margin:0 0 16px">${t('legal_intro')}</p>
    <div class="grid" style="grid-template-columns:1fr">
    ${(DB.gazette||[]).map((g,i)=>`<div class="card" style="display:flex;justify-content:space-between;align-items:center;gap:16px;cursor:pointer" onclick="openGazette(${i})">
      <div><div style="font-weight:800;font-size:16px">⚖️ ${S.lang==='en'?g.titleEn:g.titleRw}</div>
      <div class="muted" style="font-size:13px;margin-top:2px">${S.lang==='en'?g.descEn:g.descRw}</div></div>
      <button class="btn sm">${t('open_law')} →</button></div>`).join('')}</div>`;
};
window.openGazette=function(i){ const g=DB.gazette[i]; if(!g) return; LEG={open:g,page:1,q:''}; renderGazette(); };
function renderGazette(){
  const g=LEG.open;
  const idx=window.api.loadGazetteIndex(g.file)||[];
  view().innerHTML=`<div style="max-width:1000px;margin:0 auto">
    <div class="row" style="justify-content:space-between;margin-bottom:12px">
      <button class="btn ghost sm" onclick="LEG=null;go('legal')">← ${t('legal')}</button>
      <b>${S.lang==='en'?g.titleEn:g.titleRw}</b>
    </div>
    <input class="search" id="legSearch" placeholder="${t('search_law')}" value="${LEG.q}"/>
    <div id="legHits" class="chips"></div>
    <div class="card" style="padding:6px;height:70vh">
      <iframe id="legFrame" src="${window.api.gazettePath(g.file)}#page=${LEG.page}" style="width:100%;height:100%;border:none;border-radius:8px"></iframe>
    </div></div>`;
  const drawHits=()=>{
    const q=LEG.q.trim().toLowerCase();
    const box=document.getElementById('legHits');
    if(q.length<3){ box.innerHTML=''; return; }
    const hits=[]; idx.forEach((txt,p)=>{ if((txt||'').toLowerCase().includes(q)) hits.push(p+1); });
    box.innerHTML = hits.length? hits.slice(0,40).map(p=>`<div class="chip" onclick="legGo(${p})">${t('page')} ${p}</div>`).join('')
      : `<span class="muted" style="font-size:13px">-</span>`;
  };
  document.getElementById('legSearch').oninput=e=>{ LEG.q=e.target.value; drawHits(); };
  drawHits();
}
window.legGo=function(p){ LEG.page=p; const f=document.getElementById('legFrame');
  if(f) f.src=window.api.gazettePath(LEG.open.file)+'#page='+p; };

// ---- FLASHCARDS ----
let FC=null;
VIEWS.flash = function(){
  FC={deck:shuffle(DB.signs),i:0,flip:false};
  const draw=()=>{
    const s=FC.deck[FC.i];
    view().innerHTML=`<div style="max-width:460px;margin:10px auto;text-align:center">
      <div class="muted" style="margin-bottom:10px">${FC.i+1} ${t('of')} ${FC.deck.length}</div>
      <div class="card" id="fcCard" style="cursor:pointer;min-height:320px;display:grid;place-items:center">
        ${FC.flip?`<div><h2>${s.code}</h2><p style="margin-top:12px;line-height:1.5">${loc(s.meaning)||s.intlName}</p></div>`
                 :signBig(s,180)}
      </div>
      <div class="row" style="justify-content:center;margin-top:16px">
        <button class="btn ghost" id="fcPrev">←</button>
        <button class="btn" id="fcFlip">↻ ${t('flip')}</button>
        <button class="btn ghost" id="fcNext">→</button>
      </div></div>`;
    document.getElementById('fcCard').onclick=()=>{FC.flip=!FC.flip;draw();};
    document.getElementById('fcFlip').onclick=()=>{FC.flip=!FC.flip;draw();};
    document.getElementById('fcPrev').onclick=()=>{FC.i=(FC.i-1+FC.deck.length)%FC.deck.length;FC.flip=false;draw();};
    document.getElementById('fcNext').onclick=()=>{FC.i=(FC.i+1)%FC.deck.length;FC.flip=false;draw();};
  };
  draw();
};

// ---- GLOSSARY ----
VIEWS.glossary = function(){
  view().innerHTML=`<input class="search" id="glSearch" placeholder="${t('search_term')}"/><div id="glList"></div>`;
  const draw=(q='')=>{
    const list=DB.glossary.filter(g=>!q||(loc(g.term)+loc(g.definition)).toLowerCase().includes(q.toLowerCase()));
    document.getElementById('glList').innerHTML=list.map(g=>`<div class="term">
      <div class="t">${loc(g.term)} <button class="btn sm ghost" style="float:right" onclick="speak(${JSON.stringify(loc(g.term)+'. '+loc(g.definition)).replace(/"/g,'&quot;')})">🔊</button></div>
      <div class="d">${loc(g.definition)}</div>
      ${g.source&&g.source.document?`<div class="src">${g.source.document}${g.source.article?' · Art. '+g.source.article:''}</div>`:''}</div>`).join('');
  };
  document.getElementById('glSearch').oninput=e=>draw(e.target.value);
  draw();
};

// ---- PROGRESS ----
VIEWS.progress = function(){
  const seen=Object.values(S.qstats).filter(x=>x.seen>0).length;
  const mastered=Object.values(S.qstats).filter(x=>x.box>=3).length;
  const acc=Math.round(avgAccuracy());
  // weak categories
  const catAcc={};
  DB.questions.forEach(q=>{ const st=S.qstats[q.id]; if(st&&st.seen){ catAcc[q.category]=catAcc[q.category]||{c:0,s:0}; catAcc[q.category].c+=st.correct; catAcc[q.category].s+=st.seen; }});
  const weak=Object.entries(catAcc).map(([k,v])=>[k,Math.round(v.c/v.s*100)]).sort((a,b)=>a[1]-b[1]).slice(0,5);
  view().innerHTML=`
    <div class="grid stat-tiles">
      <div class="stat"><div class="n">${seen}</div><div class="l">${t('questions')} ${S.lang==='rw'?'wabonye':'seen'}</div></div>
      <div class="stat"><div class="n">${mastered}</div><div class="l">${S.lang==='rw'?'Wamenye neza':'Mastered'}</div></div>
      <div class="stat"><div class="n">${acc}%</div><div class="l">${t('avg')}</div></div>
      <div class="stat"><div class="n">${S.history.length}</div><div class="l">${t('attempts')}</div></div>
    </div>
    <div class="section-title">${t('weak')}</div>
    ${weak.length?weak.map(([c,p])=>`<div class="card" style="margin-bottom:10px"><div class="row" style="justify-content:space-between"><b>${catLabel(c)}</b><span class="muted">${p}%</span></div>
      <div class="q-progress" style="margin-top:8px"><div style="width:${p}%;background:${p<60?'var(--red)':'var(--green)'}"></div></div></div>`).join(''):`<div class="empty">${loc({rw:'Tangira kwimenyereza kugira ngo ubone iterambere.',en:'Practise to see your progress.',fr:'Entraînez-vous.'})}</div>`}`;
};

// ---- HISTORY ----
VIEWS.history = function(){
  if(!S.history.length){ view().innerHTML=`<div class="empty">🕘<br>${t('no_history')}</div>`; return; }
  const best=Math.max(...S.history.map(h=>h.pct));
  const avg=Math.round(S.history.reduce((a,h)=>a+h.pct,0)/S.history.length);
  view().innerHTML=`<div class="grid stat-tiles">
      <div class="stat"><div class="n">${S.history.length}</div><div class="l">${t('attempts')}</div></div>
      <div class="stat"><div class="n">${best}%</div><div class="l">${t('best')}</div></div>
      <div class="stat"><div class="n">${avg}%</div><div class="l">${t('avg')}</div></div>
    </div>
    <div class="section-title">${t('history')}</div>
    ${S.history.map((h,i)=>{const hasCats=h.cats&&Object.keys(h.cats).length;
      return `<div class="card" style="margin-bottom:10px${hasCats?';cursor:pointer':''}" ${hasCats?`onclick="histDetail(${i})"`:''}><div class="row" style="justify-content:space-between">
      <div><b>${h.pct}%</b> <span class="muted">· ${h.score}/${h.total}</span>${hasCats?` <span class="muted" style="font-size:12px">· 📊 ${loc({rw:'reba aho amanota yagiye',en:'view breakdown',fr:'voir le détail'})}</span>`:''}</div>
      <div class="row"><span class="pill ${h.passed?'pass':'fail'}">${h.passed?t('passed'):t('failed')}</span>
      <span class="muted" style="font-size:12px">${new Date(h.date).toLocaleDateString()}</span></div></div></div>`;}).join('')}`;
};
window.histDetail=function(i){
  const h=S.history[i]; if(!h||!h.cats) return;
  modal(`<div style="max-width:520px">
    <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:12px">
      <div><span class="pill ${h.passed?'pass':'fail'}">${h.pct}% · ${h.score}/${h.total}</span></div>
      <span class="muted" style="font-size:12px">${new Date(h.date).toLocaleString()}</span></div>
    ${catBreakdownHtml(h.cats,{drill:true})}</div>`);
};

// ---- CERTIFICATE ----
function certSerial(passed){
  const src=`${S.school.name||''}|${S.name||''}|${passed.score}|${passed.date}|${S.currentPhone||''}`;
  let h=0x811c9dc5; for(let i=0;i<src.length;i++){ h^=src.charCodeAt(i); h=(h*0x01000193)>>>0; }
  const b=h.toString(36).toUpperCase().padStart(7,'0').slice(0,7);
  return 'AMH-'+b.slice(0,4)+'-'+b.slice(4);
}
VIEWS.cert = function(){
  const passed=S.history.find(h=>h.passed);
  if(!passed){ view().innerHTML=`<div class="empty">🏅<br>${t('cert_locked')}</div>`; return; }
  const sc=S.school||{};
  const serial=certSerial(passed);
  view().innerHTML=`
    <div id="certSheet" style="max-width:720px;margin:0 auto;background:#fff;color:#12213f;border:10px solid var(--blue-700);border-radius:16px;padding:40px 44px;text-align:center;box-shadow:var(--shadow)">
      <div style="display:flex;align-items:center;justify-content:center;gap:14px;min-height:56px">
        ${sc.logo?`<img src="${sc.logo}" style="max-height:56px;max-width:110px;object-fit:contain"/>`:''}
        <div>
          <div style="font-size:13px;letter-spacing:3px;color:#1c3aa9;font-weight:800">AMATEGEKO Y'UMUHANDA</div>
          ${sc.name?`<div style="font-weight:800;font-size:16px;color:#12276b">${sc.name}</div>`:''}
          ${sc.location||sc.contact?`<div style="font-size:11px;color:#5a6b8c">${[sc.location,sc.contact].filter(Boolean).join(' · ')}</div>`:''}
        </div>
      </div>
      <div style="font-size:38px;margin-top:10px">🏅</div>
      <h1 style="font-size:28px;margin:6px 0">${loc({rw:"ICYEMEZO CY'IMYITOZO",en:"CERTIFICATE OF PRACTICE",fr:"CERTIFICAT D'ENTRAÎNEMENT"})}</h1>
      <p style="color:#5a6b8c">${loc({rw:"Iki cyemezo kigaragaza ko",en:"This certifies that",fr:"Ce certificat atteste que"})}</p>
      <div style="font-size:26px;font-weight:800;margin:8px 0;color:#12276b">${S.name||'Umukandida'}</div>
      <p style="color:#5a6b8c;max-width:460px;margin:10px auto;line-height:1.5">${loc({rw:`Watsinze ikizamini cy'imyitozo abona amanota ${passed.score}/20 (arenga 12/20 bisabwa).`,en:`Passed the practice mock exam with ${passed.score}/20 (above the 12/20 pass mark).`,fr:`A réussi l'examen blanc avec ${passed.score}/20 (au-dessus de 12/20).`})}</p>
      <div style="margin-top:22px;display:flex;justify-content:space-between;align-items:flex-end;font-size:12px;color:#5a6b8c">
        <div style="text-align:left">${new Date(passed.date).toLocaleDateString()}<br><span style="font-size:10px">${loc({rw:"Itariki",en:"Date",fr:"Date"})}</span><br><span style="font-size:10px;font-family:monospace">${t('cert_serial')}: ${serial}</span></div>
        <div style="text-align:center">
          ${sc.stamp?`<img src="${sc.stamp}" style="max-height:70px;max-width:120px;object-fit:contain"/>`:'<div style="height:40px"></div>'}
          <div style="border-top:1px solid #9fb0d0;padding-top:3px;min-width:120px">${loc({rw:"Kashe n'umukono",en:"Stamp and signature",fr:"Cachet et signature"})}</div>
        </div>
      </div>
    </div>
    <div style="text-align:center;margin-top:18px"><button class="btn" onclick="printCert()">🖨 ${t('print')}</button></div>`;
};
// Print the certificate alone (the sheet is fully inline-styled), via the shared print overlay.
window.printCert=function(){ const c=document.getElementById('certSheet'); if(c) printHtml(`<div style="padding:10px">${c.outerHTML}</div>`); };

// ---- PRINTABLE REVISION SHEETS (#7) ----
// Render an off-screen sheet, print it, then clean up. @media print hides the app and shows #printRoot.
function printHtml(inner){
  document.querySelectorAll('#printRoot').forEach(n=>n.remove());
  const root=document.createElement('div'); root.id='printRoot'; root.innerHTML=inner;
  document.body.appendChild(root);
  const done=()=>{ root.remove(); window.removeEventListener('afterprint',done); };
  window.addEventListener('afterprint',done);
  setTimeout(()=>{ if(document.body.contains(root)){ try{ window.print(); }catch(e){} } }, 30);
  setTimeout(()=>{ if(document.body.contains(root)) done(); }, 120000);
}
function sheetHead(title, sub){
  const sc=S.school||{};
  return `<div class="sheet"><h1>${title}</h1>
    <div class="sheet-sub">${[sc.name,sub,new Date().toLocaleDateString()].filter(Boolean).join(' · ')}</div>`;
}
function signsSheet(fam){
  const list=DB.signs.filter(s=>!fam||s.family===fam);
  const title=loc({rw:"Ibyapa by'umuhanda",en:'Road signs cheat-sheet',fr:'Fiche des panneaux'});
  return sheetHead(title, `${list.length} ${t('signsN')}`)+
    `<div class="sheet-grid">${list.map(s=>`<div class="sheet-cell">${signImg(s)}<div class="sc-code">${s.code}</div><div class="sc-mean">${loc(s.meaning)||s.intlName||''}</div></div>`).join('')}</div></div>`;
}
function weakQuestionsSheet(){
  const scored=DB.questions.map(q=>{const st=S.qstats[q.id]||{seen:0,correct:0,wrong:0,box:0};return {q,st};})
    .filter(x=>x.st.seen>0)
    .sort((a,b)=>(a.st.correct-a.st.wrong)-(b.st.correct-b.st.wrong) || a.st.box-b.st.box);
  const weak=scored.filter(x=>x.st.wrong>0 || x.st.box<=1).slice(0,80);
  const title=loc({rw:'Ibibazo ukwiye kongera',en:'Questions to review',fr:'Questions à revoir'});
  if(!weak.length) return sheetHead(title)+`<p style="color:#3a4a68">${loc({rw:'Banza wimenyereze ibibazo kugira ngo tumenye aho udahagaze neza.',en:'Practise some questions first so we can find your weak spots.',fr:'Entraînez-vous d\'abord pour identifier vos points faibles.'})}</p></div>`;
  return sheetHead(title, `${weak.length} ${t('questions')}`)+weak.map(({q})=>{
    const c=correctOpt(q); const ans=c?(c.image?'🖼':(c[S.lang]||c.rw||'')):'';
    return `<div class="sheet-q"><div class="sq-stem">${loc(q.stem)}</div>
      <div class="sq-ans">✓ ${ans}</div>${loc(q.explanation)?`<div class="sq-exp">${loc(q.explanation)}</div>`:''}</div>`;}).join('')+`</div>`;
}
function glossarySheet(){
  const title=loc({rw:"Amagambo y'itegeko",en:'Road-code glossary',fr:'Glossaire du code'});
  return sheetHead(title, `${DB.glossary.length} ${t('terms')}`)+
    DB.glossary.map(g=>`<div class="sheet-term"><b>${loc(g.term)}</b> — <span>${loc(g.definition)}</span></div>`).join('')+`</div>`;
}
window.printSheet=function(kind,arg){
  if(kind==='signs') printHtml(signsSheet(arg));
  else if(kind==='weak') printHtml(weakQuestionsSheet());
  else if(kind==='glossary') printHtml(glossarySheet());
};
VIEWS.revision = function(){
  const fams=[...new Set(DB.signs.map(s=>s.family))];
  const card=(icon,title,desc,btns)=>`<div class="card" style="margin-bottom:14px">
    <div class="row" style="gap:14px;align-items:flex-start">
      <div style="font-size:34px">${icon}</div>
      <div style="flex:1"><div style="font-weight:800;font-size:16px">${title}</div>
        <div class="muted" style="font-size:13px;margin:4px 0 10px">${desc}</div>
        <div class="row">${btns}</div></div></div></div>`;
  view().innerHTML=`
    <p class="muted" style="margin-bottom:16px">${loc({rw:'Sohora impapuro (🖨) uzige nta mudasobwa, cyangwa uzihe abanyeshuri.',en:'Print sheets to study away from the computer, or hand them to a class.',fr:'Imprimez des fiches pour réviser sans ordinateur, ou à distribuer en classe.'})}</p>
    ${card('🚸', loc({rw:"Ibyapa byose",en:'All road signs',fr:'Tous les panneaux'}),
        loc({rw:`Impapuro z'ibyapa ${DB.signs.length} n'icyo bisobanura.`,en:`A cheat-sheet of all ${DB.signs.length} signs and their meanings.`,fr:`Fiche des ${DB.signs.length} panneaux et leur sens.`}),
        `<button class="btn accent" onclick="printSheet('signs')">🖨 ${loc({rw:'Sohora byose',en:'Print all',fr:'Tout imprimer'})}</button>`+
        `<select id="revFam" class="btn ghost" style="padding:8px">${['',...fams].map(f=>`<option value="${f}">${f?loc(DB.signs.find(s=>s.family===f).familyLabel):loc({rw:'…cyangwa umuryango',en:'…or by family',fr:'…ou par famille'})}</option>`).join('')}</select>`+
        `<button class="btn ghost" onclick="printSheet('signs',document.getElementById('revFam').value)">🖨 ${loc({rw:'Umuryango',en:'Family',fr:'Famille'})}</button>`)}
    ${card('🎯', loc({rw:'Ibibazo ukwiye kongera',en:'My weak questions',fr:'Mes questions faibles'}),
        loc({rw:'Ibibazo wibeshyeho, hamwe n\'igisubizo nyacyo n\'ibisobanuro.',en:'The questions you got wrong, with the correct answer and explanation.',fr:'Vos erreurs, avec la bonne réponse et l\'explication.'}),
        `<button class="btn accent" onclick="printSheet('weak')">🖨 ${loc({rw:'Sohora',en:'Print',fr:'Imprimer'})}</button>`)}
    ${card('📖', loc({rw:"Amagambo y'itegeko",en:'Glossary',fr:'Glossaire'}),
        loc({rw:`Ibisobanuro by'amagambo ${DB.glossary.length}.`,en:`Definitions of all ${DB.glossary.length} terms.`,fr:`Définitions des ${DB.glossary.length} termes.`}),
        `<button class="btn accent" onclick="printSheet('glossary')">🖨 ${loc({rw:'Sohora',en:'Print',fr:'Imprimer'})}</button>`)}`;
};

// ---- TEACHER / OWNER DASHBOARD (candidate stats, reports, backup) ----
function candidateStats(phone){
  const p=S.progress[phone]||{qstats:{},history:[]};
  const hist=p.history||[]; const qs=p.qstats||{};
  const best=hist.length?Math.max(...hist.map(h=>h.pct)):0;
  const avg=hist.length?Math.round(hist.reduce((a,h)=>a+h.pct,0)/hist.length):0;
  const seen=Object.values(qs).filter(x=>x.seen>0).length;
  const last=hist.length?Math.max(...hist.map(h=>h.date)):0;
  const passed=hist.some(h=>h.passed);
  return { exams:hist.length, best, avg, seen, last, ready:passed&&best>=60 };
}
// Instructor drill-down (#8): one candidate's trend, weak topics, and an assign-practice control.
window.candidateDetail=function(phone){
  const a=accGet(phone); if(!a) return;
  const p=S.progress[phone]||{qstats:{},history:[]};
  const hist=(p.history||[]).slice(0,8);
  const weak=weakCatsFrom(p.qstats||{}, DB.questions).filter(w=>w.seen>0 || w.total>0).slice(0,6);
  const assigned=new Set((p.assignment&&p.assignment.cats)||[]);
  const trend=hist.length? hist.map(h=>`<span class="pill ${h.passed?'pass':'fail'}" style="font-size:11px">${h.pct}%</span>`).reverse().join(' ') : `<span class="muted">${t('no_history')}</span>`;
  const weakRows=weak.map(w=>{const g=w.seen?Math.round(w.acc*100):0;const col=w.seen&&g>=70?'var(--green,#1B7A3D)':'var(--red)';
    return `<div class="row" style="justify-content:space-between;align-items:center;margin-bottom:8px">
      <div style="flex:1"><div style="font-size:13px">${chipIcon(w.cat)}${catLabel(w.cat)} <span class="muted">${w.seen?g+'%':loc({rw:'ntibarakoze',en:'not practised',fr:'non pratiqué'})}</span></div>
        <div class="q-progress"><div style="width:${g}%;background:${col}"></div></div></div>
      <label class="row" style="gap:6px;font-size:12px;margin-left:12px;cursor:pointer"><input type="checkbox" class="asgChk" value="${w.cat}" ${assigned.has(w.cat)?'checked':''}/> ${loc({rw:'Umwitozo',en:'Assign',fr:'Assigner'})}</label>
    </div>`;}).join('');
  modal(`<div style="max-width:520px">
    <h2 style="margin-bottom:2px">${a.name}</h2><div class="muted" style="font-size:12px">${a.phone}</div>
    <div style="margin:14px 0"><b style="font-size:13px">${t('history')}</b><div style="margin-top:6px">${trend}</div></div>
    <div><b style="font-size:13px">${loc({rw:'Aho adahagaze neza',en:'Weak topics',fr:'Points faibles'})}</b>
      <div style="margin-top:10px">${weakRows||`<span class="muted">-</span>`}</div></div>
    <div class="field" style="margin-top:10px"><label>${loc({rw:'Ubutumwa (si ngombwa)',en:'Note (optional)',fr:'Note (facultatif)'})}</label>
      <input id="asgNote" value="${(p.assignment&&p.assignment.note)||''}" placeholder="${loc({rw:'urugero: witoze ibyapa mbere y\'ejo',en:'e.g. focus on signs before Friday',fr:'ex : réviser les panneaux'})}"/></div>
    <div class="row" style="margin-top:16px;justify-content:flex-end">
      <button class="btn ghost" onclick="closeModal()">${t('cancel')||loc({rw:'Reka',en:'Cancel',fr:'Annuler'})}</button>
      <button class="btn accent" onclick="assignDrill('${phone}')">✓ ${loc({rw:'Emeza umwitozo',en:'Save assignment',fr:'Enregistrer'})}</button>
    </div></div>`);
};
window.assignDrill=function(phone){
  const cats=[...document.querySelectorAll('.asgChk:checked')].map(c=>c.value);
  const note=(document.getElementById('asgNote').value||'').trim();
  const p=S.progress[phone]||(S.progress[phone]={qstats:{},history:[]});
  if(cats.length) p.assignment={cats,note,date:Date.now(),by:(S.owner&&S.owner.name)||'Teacher'};
  else delete p.assignment;
  persist(); closeModal(); toast(cats.length?loc({rw:'✓ Umwitozo watanzwe',en:'✓ Drill assigned',fr:'✓ Exercice assigné'}):loc({rw:'Umwitozo wakuweho',en:'Assignment cleared',fr:'Exercice retiré'})); go('dashboard');
};
VIEWS.dashboard = function(){
  if(!isOwner()){ return go('home'); }
  const cands=S.accounts.slice().map(a=>({a, s:candidateStats(a.phone)}))
    .sort((x,y)=> (y.s.last||0)-(x.s.last||0));
  const rows = cands.length? cands.map(({a,s})=>{
    const assigned=(S.progress[a.phone]&&S.progress[a.phone].assignment&&S.progress[a.phone].assignment.cats||[]).length;
    return `
    <div class="card" style="margin-bottom:10px;cursor:pointer" onclick='candidateDetail("${a.phone}")'>
      <div class="row" style="justify-content:space-between">
        <div><b>${a.name}</b> <span class="muted" style="font-size:12px">· ${a.phone}</span>${assigned?` <span class="pill" style="background:var(--gold,#E0A500);color:#3a2a00">👩‍🏫 ${loc({rw:'yahawe umwitozo',en:'assigned',fr:'assigné'})}</span>`:''}</div>
        <span class="pill ${s.ready?'pass':'fail'}">${s.ready?t('exam_ready'):t('not_ready')}</span>
      </div>
      <div class="row" style="gap:20px;margin-top:8px;font-size:13px">
        <span class="muted">${t('exams_taken')}: <b style="color:var(--text)">${s.exams}</b></span>
        <span class="muted">${t('best_score')}: <b style="color:var(--text)">${s.best}%</b></span>
        <span class="muted">${t('avg_score')}: <b style="color:var(--text)">${s.avg}%</b></span>
        <span class="muted">${t('last_active')}: <b style="color:var(--text)">${s.last?new Date(s.last).toLocaleDateString():'-'}</b></span>
        <span style="margin-left:auto;color:var(--blue-600);font-size:12px">${loc({rw:'Reba →',en:'View →',fr:'Voir →'})}</span>
      </div>
    </div>`;}).join('') : `<div class="empty">${t('no_candidates')}</div>`;
  const reps = (S.reports||[]);
  const repRows = reps.length? reps.map((r,i)=>`
    <div class="card" style="margin-bottom:10px">
      <div class="row" style="justify-content:space-between">
        <b style="font-size:13px">${r.qid} · <span class="muted">${reasonLabel(r.reason)}</span></b>
        <button class="btn ghost sm" onclick="resolveReport(${i})" style="color:var(--red)">✓ ${t('resolve')}</button>
      </div>
      <div style="font-size:13px;margin-top:4px">${r.stem}…</div>
      ${r.note?`<div class="muted" style="font-size:12px;margin-top:4px">“${r.note}”</div>`:''}
      <div class="muted" style="font-size:11px;margin-top:4px">${r.by||'-'} · ${new Date(r.date).toLocaleDateString()}</div>
    </div>`).join('') : `<div class="empty">${t('no_reports')}</div>`;
  view().innerHTML=`
    <div class="row" style="justify-content:space-between;margin-bottom:6px">
      <div class="section-title" style="margin:0">${t('candidates')} (${cands.length})</div>
      <div class="row"><button class="btn ghost sm" id="dbCsv">📄 ${t('export_csv')}</button>
        <button class="btn ghost sm" id="dbBackup">💾 ${t('backup')}</button>
        <button class="btn ghost sm" id="dbRestore">↺ ${t('restore')}</button></div>
    </div>
    ${rows}
    <div class="section-title">${t('reports_title')} (${reps.length})</div>
    ${repRows}`;
  document.getElementById('dbCsv').onclick=exportCandidatesCsv;
  document.getElementById('dbBackup').onclick=backupData;
  document.getElementById('dbRestore').onclick=restoreData;
};
function reasonLabel(k){ return ({wrong:loc({rw:'Igisubizo si cyo',en:'Wrong answer',fr:'Réponse fausse'}),typo:loc({rw:'Ikosa mu nyandiko',en:'Typo',fr:'Faute'}),unclear:loc({rw:'Ntibisobanutse',en:'Unclear',fr:'Peu clair'}),image:loc({rw:'Ishusho',en:'Image',fr:'Image'}),other:loc({rw:'Ikindi',en:'Other',fr:'Autre'})})[k]||k; }
window.resolveReport=function(i){ S.reports.splice(i,1); persist(); go('dashboard'); };
function csvCell(v){ v=String(v==null?'':v); return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v; }
async function exportCandidatesCsv(){
  const head=['Name','Phone','Exams','Best %','Average %','Questions seen','Exam-ready','Last active'];
  const lines=[head.join(',')];
  for(const a of S.accounts){ const s=candidateStats(a.phone);
    lines.push([a.name,a.phone,s.exams,s.best,s.avg,s.seen,s.ready?'Yes':'No',s.last?new Date(s.last).toISOString().slice(0,10):''].map(csvCell).join(',')); }
  const r=await window.api.saveText({ defaultName:(S.school.name||'school').replace(/\W+/g,'_')+'_candidates.csv', content:'﻿'+lines.join('\r\n'), filters:[{name:'CSV',extensions:['csv']}] });
  if(r&&r.ok) toast('✓ CSV');
}
async function backupData(){
  const payload={ format:'amategeko-backup-v1', date:Date.now(),
    school:S.school, owner:S.owner, accounts:S.accounts, progress:S.progress, reports:S.reports };
  const r=await window.api.saveText({ defaultName:(S.school.name||'school').replace(/\W+/g,'_')+'_backup.json', content:JSON.stringify(payload), filters:[{name:'JSON',extensions:['json']}] });
  if(r&&r.ok) toast('✓ '+t('backup_done'));
}
async function restoreData(){
  const r=await window.api.openText({ filters:[{name:'JSON',extensions:['json']}] });
  if(!r||!r.ok) return;
  try{ const d=JSON.parse(r.content);
    if(d.format!=='amategeko-backup-v1') return toast('⚠ '+t('restore_bad'));
    if(!confirm(loc({rw:'Garura amakuru? Ibiriho bizasimburwa.',en:'Restore data? Current data will be replaced.',fr:'Restaurer ? Les données seront remplacées.'}))) return;
    S.school=d.school||S.school; S.owner=d.owner||S.owner; S.accounts=d.accounts||[]; S.progress=d.progress||{}; S.reports=d.reports||[];
    await persist(); toast('✓ '+t('restore_done')); updateCandidateChip(); go('dashboard');
  }catch(e){ toast('⚠ '+t('restore_bad')); }
}

// ---- SETTINGS ----
VIEWS.settings = function(){
  view().innerHTML=`<div class="card" style="max-width:560px">
    <b>👤 ${t('my_details')}${isOwner()?` <span style="background:var(--gold);color:#3a2a00;font-size:11px;font-weight:800;padding:2px 7px;border-radius:6px;margin-left:6px">${t('owner_badge')}</span>`:''}</b>
    <div class="field" style="margin-top:10px"><label>${t('name')}</label><input id="stName" value="${S.name||''}"/></div>
    ${isOwner()?'':`<div class="field"><label>${t('phone')}</label><input value="${S.currentPhone||''}" disabled style="opacity:.7"/></div>`}
    <div class="row" style="margin-bottom:14px">
      <button class="btn ghost sm" id="stPin">🔑 ${t('change_pin')}</button>
      <button class="btn ghost sm" id="stLogout">${t('logout')} →</button>
    </div>
    <div class="field"><label>${t('language')}</label>
      <select id="stLang">${['rw','en','fr'].map(l=>`<option value="${l}" ${S.lang===l?'selected':''}>${{rw:'Kinyarwanda',en:'English',fr:'Français'}[l]}</option>`).join('')}</select></div>
    <div class="field"><label>${t('theme')}</label>
      <select id="stTheme"><option value="light" ${S.theme==='light'?'selected':''}>Light</option><option value="dark" ${S.theme==='dark'?'selected':''}>Dark</option></select></div>
    <div class="field"><label>${t('font_size')}</label>
      <div class="row"><button class="btn ghost sm" id="fsDown">A−</button>
        <span id="fsVal" style="min-width:56px;text-align:center;font-weight:700">${Math.round((S.textScale||1)*100)}%</span>
        <button class="btn ghost sm" id="fsUp">A+</button></div></div>
    <button class="btn wide" id="stSave">${t('save')}</button>
    <button class="btn ghost wide" id="stReset" style="margin-top:10px;color:var(--red)">🗑 ${t('reset')}</button>
  </div>
  ${isOwner()?`<div class="card" style="max-width:560px;margin-top:16px">
    <b>🏫 ${t('school_info')}</b>
    <div class="field" style="margin-top:10px"><label>${t('school_name')}</label><input id="stSchool" value="${S.school.name||''}"/></div>
    <div class="field"><label>${t('location')}</label><input id="stLoc" value="${S.school.location||''}"/></div>
    <div class="field"><label>${t('contact')}</label><input id="stContact" value="${S.school.contact||''}"/></div>
    <div class="row" style="gap:16px;margin-top:6px">
      <div style="flex:1">
        <label style="display:block;font-weight:700;font-size:13px;margin-bottom:6px;color:var(--muted)">${t('school_logo')}</label>
        <div id="logoPrev" class="img-slot">${S.school.logo?`<img src="${S.school.logo}"/>`:'<span class="muted">-</span>'}</div>
        <div class="row" style="margin-top:6px"><button class="btn ghost sm" id="pickLogo">📷 ${t('upload')}</button>${S.school.logo?`<button class="btn ghost sm" id="rmLogo" style="color:var(--red)">✕</button>`:''}</div>
      </div>
      <div style="flex:1">
        <label style="display:block;font-weight:700;font-size:13px;margin-bottom:6px;color:var(--muted)">${t('school_stamp')}</label>
        <div id="stampPrev" class="img-slot">${S.school.stamp?`<img src="${S.school.stamp}"/>`:'<span class="muted">-</span>'}</div>
        <div class="row" style="margin-top:6px"><button class="btn ghost sm" id="pickStamp">📷 ${t('upload')}</button>${S.school.stamp?`<button class="btn ghost sm" id="rmStamp" style="color:var(--red)">✕</button>`:''}</div>
      </div>
    </div>
    <button class="btn ghost wide" id="stSchoolSave" style="margin-top:12px">${t('save')} 🏫</button>
  </div>
  <div class="card" style="max-width:560px;margin-top:16px">
    <b>🔄 ${t('cu_title')}</b>
    <p class="muted" style="margin-top:8px;line-height:1.5" id="cuStatus">${CONTENT_VERSION>0?loc({rw:`Ivugurura ririho: verisiyo ${CONTENT_VERSION}`,en:`Update installed: version ${CONTENT_VERSION}`,fr:`Mise à jour installée : version ${CONTENT_VERSION}`}):t('cu_none')}</p>
    <div class="row" style="margin-top:10px">
      <button class="btn ghost" id="cuImport" style="flex:1">⬆ ${t('cu_import')}</button>
      ${CONTENT_VERSION>0?`<button class="btn ghost" id="cuRemove" style="flex:1;color:var(--red)">🗑 ${t('cu_remove')}</button>`:''}
    </div>
  </div>`:`<div class="card" style="max-width:560px;margin-top:16px">
    <b>🏫 ${S.school.name||''}</b>
    <div class="muted" style="margin-top:6px;font-size:13px">${[S.school.location,S.school.contact].filter(Boolean).join(' · ')}</div>
    <p class="muted" style="font-size:12px;margin-top:10px">${loc({rw:"Amakuru y'ishuri ahindurwa n'umwarimu/nyir'ishuri gusa.",en:'Only the school owner/teacher can edit school details.',fr:"Seul le propriétaire/enseignant peut modifier l'école."})}</p>
  </div>`}
  <div class="card" style="max-width:560px;margin-top:16px">
    <b>Amategeko y'Umuhanda (Desktop) v1.0.0</b>
    <p class="muted" style="margin-top:8px;line-height:1.6">${loc({rw:"Porogaramu yo kwitegura ikizamini cy'uruhushya rw'agateganyo, ikora nta interineti. Amakuru yose abikwa kuri iyi mudasobwa gusa.",en:"Offline provisional driving-licence theory prep. All data stays on this computer.",fr:"Préparation hors ligne. Toutes les données restent sur cet ordinateur."})}</p>
    <div class="muted" style="margin-top:10px;font-size:13px">Jean Paul Ingabire · Kigali<br>
      <a href="tel:+250786880880" style="color:var(--blue-500)">+250 786 880 880</a> ·
      <a href="mailto:eribangi@gmail.com" style="color:var(--blue-500)">eribangi@gmail.com</a></div>
    <p class="muted" style="font-size:11px;margin-top:10px">Icons: OpenMoji (CC-BY-SA). Signs: Vienna Convention (1968). Pass mark 12/20 (theory).</p>
  </div>`;
  document.getElementById('stSave').onclick=()=>{
    S.name=document.getElementById('stName').value.trim()||S.name;
    if(isOwner()){ if(S.owner) S.owner.name=S.name; }
    else { const acc=accGet(S.currentPhone); if(acc) acc.name=S.name; }   // rename the account
    S.lang=document.getElementById('stLang').value; S.theme=document.getElementById('stTheme').value;
    applyTheme(); buildLang(); buildNav(); updateCandidateChip(); persist(); toast('✓ '+t('save')); go('settings');
  };
  const fsSet=(d)=>{ S.textScale=Math.max(0.85,Math.min(1.4,Math.round(((S.textScale||1)+d)*100)/100)); applyTextScale(); document.getElementById('fsVal').textContent=Math.round(S.textScale*100)+'%'; persist(); };
  document.getElementById('fsUp').onclick=()=>fsSet(0.1);
  document.getElementById('fsDown').onclick=()=>fsSet(-0.1);
  const sss=document.getElementById('stSchoolSave');
  if(sss) sss.onclick=()=>{
    S.school.name=document.getElementById('stSchool').value.trim()||S.school.name;
    S.school.location=document.getElementById('stLoc').value.trim();
    S.school.contact=document.getElementById('stContact').value.trim();
    persist(); updateCandidateChip(); toast('✓ '+t('save'));
  };
  async function pickInto(which){
    const r=await window.api.pickImage();
    if(!r||!r.dataUrl){ if(r&&r.error==='too_big') toast('⚠ '+loc({rw:'Ishusho iraremereye',en:'Image too large',fr:'Image trop grande'})); return; }
    S.school[which]=await downscaleImage(r.dataUrl, 320);
    await persist(); go('settings');
  }
  const pl=document.getElementById('pickLogo'); if(pl) pl.onclick=()=>pickInto('logo');
  const ps=document.getElementById('pickStamp'); if(ps) ps.onclick=()=>pickInto('stamp');
  const rl=document.getElementById('rmLogo'); if(rl) rl.onclick=()=>{ S.school.logo=null; persist(); go('settings'); };
  const rs=document.getElementById('rmStamp'); if(rs) rs.onclick=()=>{ S.school.stamp=null; persist(); go('settings'); };
  document.getElementById('stLogout').onclick=logout;
  document.getElementById('stPin').onclick=()=>{
    modal(`<h2>${t('change_pin')} 🔑</h2>
      <div class="field"><label>${t('old_pin')}</label><input id="cpOld" type="password" inputmode="numeric" maxlength="8"/></div>
      <div class="field"><label>${t('new_pin')}</label><input id="cpNew" type="password" inputmode="numeric" maxlength="8"/></div>
      <div class="err" id="cpErr"></div>
      <button class="btn wide" id="cpGo">${t('save')}</button>`);
    document.getElementById('cpGo').onclick=async()=>{
      const oldP=document.getElementById('cpOld').value, newP=document.getElementById('cpNew').value;
      let ok;
      if(isOwner()){ if(await ownerAuth(oldP) && validPin(newP)){ await ownerCreate(S.owner.name,newP); ok=true; } else ok=false; }
      else ok=await accChangePin(S.currentPhone, oldP, newP);
      if(ok){ closeModal(); toast('✓ '+t('save')); } else gateErr('cpErr', t('wrong_pin')+' / '+t('invalid_pin'));
    };
  };
  document.getElementById('stReset').onclick=()=>{
    if(confirm(loc({rw:'Siba amateka yose n\'iterambere by\'uyu mukandida?',en:'Erase this candidate\'s progress and history?',fr:'Effacer la progression de ce candidat ?'}))){
      S.qstats={}; S.history=[]; saveProgress(); toast('✓'); go('home');
    }
  };
  const cuImp=document.getElementById('cuImport');
  if(cuImp) cuImp.onclick=async()=>{
    const r=await window.api.importContentUpdate();
    if(r&&r.ok){ CONTENT_BUNDLE=await window.api.loadContentUpdate(); applyContent();
      toast(loc({rw:`Ivugurura ryinjijwe (verisiyo ${r.version})`,en:`Update installed (version ${r.version})`,fr:`Mise à jour installée (v${r.version})`})); go('settings'); }
    else if(r&&!r.canceled){ toast('⚠ '+(r.error||loc({rw:'Ivugurura ntiryemewe',en:'Update rejected',fr:'Mise à jour refusée'}))); }
  };
  const cuRm=document.getElementById('cuRemove');
  if(cuRm) cuRm.onclick=async()=>{ await window.api.clearContentUpdate(); CONTENT_BUNDLE=null; applyContent(); toast('✓ '+t('cu_removed')); go('settings'); };
};

// external links
document.addEventListener('click',e=>{
  const a=e.target.closest('a'); if(a&&/^(https?|mailto|tel):/.test(a.href)){ e.preventDefault(); window.api.openExternal(a.href); }
});

// ---- Keyboard support (desktop): 1-4 / A-D select, Enter next/submit, ←/→ navigate, Esc close ----
document.addEventListener('keydown',e=>{
  const modalOpen=document.getElementById('modalRoot').classList.contains('open');
  if(e.key==='Escape'){ if(modalOpen) closeModal(); return; }
  const tag=(e.target.tagName||'').toLowerCase();
  if(tag==='input'||tag==='textarea'||tag==='select'||modalOpen) return;
  const click=id=>{ const el=document.getElementById(id); if(el && !el.disabled){ el.click(); return true; } return false; };
  const pickOpt=(sel)=>{ const opts=[...document.querySelectorAll(sel)]; let i=-1;
    if(/^[1-4]$/.test(e.key)) i=+e.key-1; else if(/^[a-dA-D]$/.test(e.key)) i=e.key.toLowerCase().charCodeAt(0)-97;
    if(i>=0 && opts[i]){ opts[i].click(); return true; } return false; };
  if(current==='practice'){
    if(pickOpt('#prOpts .opt')) { e.preventDefault(); return; }
    if(e.key==='Enter'||e.key==='ArrowRight'){ if(click('prNext')) e.preventDefault(); return; }
    if(e.key==='ArrowLeft'){ if(click('prPrev')) e.preventDefault(); return; }
  } else if(current==='exam' && EX && !EX.done){
    if(pickOpt('#exOpts .opt')){ e.preventDefault(); return; }
    if(e.key==='Enter'||e.key==='ArrowRight'){ if(!click('exNext')) click('exSubmit'); e.preventDefault(); return; }
    if(e.key==='ArrowLeft'){ if(click('exPrev')) e.preventDefault(); return; }
    if(e.key==='f'||e.key==='F'){ if(click('exFlag')) e.preventDefault(); return; }
  }
});

boot();
