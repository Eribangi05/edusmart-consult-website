/* English -> [Français, Ikinyarwanda]
   Kinyarwanda uses everyday savings-group (ikimina) vocabulary: umusanzu = contribution, ubwizigame = savings,
   inguzanyo = loan, umunyamuryango = member, Perezida = President, Umucungamari = Accountant. */
const I18N_DICT = {};
const D = (en, fr, rw) => { I18N_DICT[en] = [fr, rw]; };
const I18N_PATTERNS = [];
const P = (re, fr, rw) => I18N_PATTERNS.push([re, fr, rw]);

/* ---- roles & general ---- */
D('President', 'Président(e)', 'Perezida'); D('Accountant', 'Comptable', 'Umucungamari'); D('Member', 'Membre', 'Umunyamuryango');
D('Members', 'Membres', 'Abanyamuryango'); D('Ikimina', 'Ikimina', 'Ikimina'); D('Web Edition', 'Édition Web', 'Verisiyo y’urubuga');
D('Cancel', 'Annuler', 'Hagarika'); D('Close', 'Fermer', 'Funga'); D('Save', 'Enregistrer', 'Bika'); D('Edit', 'Modifier', 'Hindura'); D('Back', 'Retour', 'Subira inyuma');
D('Search', 'Rechercher', 'Shakisha'); D('Search your name', 'Recherchez votre nom', 'Shakisha izina ryawe'); D('Search member', 'Rechercher un membre', 'Shakisha umunyamuryango');
D('Search name or phone', 'Rechercher un nom ou un téléphone', 'Shakisha izina cyangwa telefoni'); D('Filter log', 'Filtrer le journal', 'Shakisha mu mateka');
D('Search members, pages, actions', 'Rechercher membres, pages, actions', 'Shakisha abanyamuryango, paji, ibikorwa');
D('Theme', 'Thème', 'Ibara ry’ecran'); D('Notifications', 'Notifications', 'Amakuru mashya'); D('Ctrl K', 'Ctrl K', 'Ctrl K');
D('Yes', 'Oui', 'Yego'); D('No', 'Non', 'Oya'); D('All', 'Tous', 'Byose'); D('Active', 'Actif', 'Urakora'); D('Suspended', 'Suspendu', 'Yahagaritswe');
D('Left group', 'A quitté le groupe', 'Yavuye mu kimina'); D('Optional', 'Facultatif', 'Si itegeko'); D('Pending', 'En attente', 'Birategereje'); D('Approved', 'Approuvé', 'Byemejwe');
D('Overdue', 'En retard', 'Byarenze igihe'); D('Paid', 'Payé', 'Yishyuye'); D('Unpaid', 'Impayé', 'Ntiyishyuye'); D('Partial', 'Partiel', 'Yishyuye igice'); D('Paid off', 'Soldé', 'Byarangiye kwishyurwa');
D('Upcoming', 'À venir', 'Bizaza'); D('Held', 'Tenue', 'Yabaye'); D('Received', 'Reçu', 'Yabonye'); D('Waiting', 'En attente', 'Ategereje'); D('Next', 'Suivant', 'Utahiwe'); D('Present', 'Présent', 'Yitabiriye'); D('Absent', 'Absent', 'Ntiyaje');
D('Required', 'Requis', 'Ni ngombwa'); D('Not required', 'Non requis', 'Ntibikenewe'); D('Other', 'Autre', 'Ikindi'); D('None —', 'Aucun —', 'Nta —'); D('Type', 'Type', 'Ubwoko'); D('Note', 'Note', 'Icyitonderwa');
D('Date', 'Date', 'Itariki'); D('Period', 'Période', 'Igihe'); D('Method', 'Mode', 'Uburyo'); D('Amount', 'Montant', 'Amafaranga'); D('Status', 'Statut', 'Imiterere');
D('Role', 'Rôle', 'Inshingano'); D('Phone', 'Téléphone', 'Telefoni'); D('Address', 'Adresse', 'Aho atuye'); D('Goal', 'Objectif', 'Intego'); D('Reference', 'Référence', 'Nomero y’ubwishyu');
D('Export', 'Exporter', 'Sohora'); D('Export CSV', 'Exporter en CSV', 'Sohora muri CSV'); D('Send', 'Envoyer', 'Ohereza'); D('Confirm', 'Confirmer', 'Emeza'); D('Reject', 'Rejeter', 'Anga');
D('Approve', 'Approuver', 'Emeza'); D('Decline', 'Refuser', 'Anga'); D('Acknowledge', 'Prendre acte', 'Emeza ko wabonye'); D('Add', 'Ajouter', 'Ongeraho'); D('Pay', 'Payer', 'Ishyura');
D('Review', 'Examiner', 'Suzuma'); D('Details', 'Détails', 'Ibisobanuro'); D('Statement', 'Relevé', 'Raporo'); D('PDF', 'PDF', 'PDF'); D('Publish', 'Publier', 'Tangaza');
D('Pin', 'Épingler', 'Shyira hejuru'); D('Unpin', 'Détacher', 'Kuraho hejuru'); D('Reset PIN', 'Réinitialiser le code PIN', 'Subiza PIN'); D('Reverse', 'Annuler l’écriture', 'Subiza inyuma');
D('Total', 'Total', 'Igiteranyo'); D('Due', 'Échéance', 'Igihe cyo kwishyura'); D('Payment', 'Paiement', 'Kwishyura'); D('Balance', 'Solde', 'Asigaye'); D('Interest', 'Intérêts', 'Inyungu');
D('Principal', 'Capital', 'Umwenda fatizo'); D('Savings', 'Épargne', 'Ubwizigame'); D('Income', 'Revenus', 'Amafaranga yinjiye'); D('Expenses', 'Dépenses', 'Amafaranga yasohotse');
D('Cash', 'Espèces', 'Amafaranga mu ntoki'); D('Mobile Money', 'Mobile Money', 'Mobile Money'); D('Bank transfer', 'Virement bancaire', 'Kohereza kuri banki'); D('Cheque', 'Chèque', 'Sheki');
D('Daily', 'Quotidien', 'Buri munsi'); D('Weekly', 'Hebdomadaire', 'Buri cyumweru'); D('Every 2 weeks', 'Toutes les 2 semaines', 'Buri byumweru bibiri'); D('Monthly', 'Mensuel', 'Buri kwezi');

/* ---- welcome, setup, login ---- */
D('Your group.', 'Votre groupe.', 'Ikimina cyawe.'); D('Your savings.', 'Votre épargne.', 'Ubwizigame bwawe.'); D('Your future.', 'Votre avenir.', 'Ejo hawe heza.');
D('The complete workspace for savings groups — contributions, loans, rotation and transparent reporting, with the right access for every role.', 'L’espace de travail complet des groupes d’épargne : cotisations, prêts, rotation et rapports transparents, avec les bons accès pour chaque rôle.', 'Igikoresho cyuzuye cy’ibimina: imisanzu, inguzanyo, guhererekanya ikigega na raporo zisobanutse, buri wese akabona ibimureba gusa.');
D('Accountant records every payment', 'Le comptable enregistre chaque paiement', 'Umucungamari yandika buri musanzu wishyuwe'); D('President oversees & approves', 'Le président supervise et approuve', 'Perezida akurikirana kandi akemeza');
D('Members see their own savings', 'Les membres voient leur propre épargne', 'Umunyamuryango abona ubwizigame bwe'); D('PDF receipts & statements', 'Reçus et relevés PDF', 'Inyemezabwishyu na raporo muri PDF');
D('Welcome', 'Bienvenue', 'Murakaza neza'); D('Welcome 👋', 'Bienvenue 👋', 'Murakaza neza 👋');
D("Let's get your savings group running. Choose how you'd like to begin.", 'Lançons votre groupe d’épargne. Choisissez comment commencer.', 'Reka dutangire ikimina cyanyu. Hitamo uko ushaka gutangira.');
D('Create my group', 'Créer mon groupe', 'Fungura ikimina cyanjye'); D('Set up your real group in two minutes', 'Configurez votre vrai groupe en deux minutes', 'Fungura ikimina cyanyu nyacyo mu minota ibiri');
D('Explore with demo data', 'Explorer avec des données de démonstration', 'Gerageza ukoresheje amakuru y’icyitegererezo'); D('A sample group with 13 members, loans and history', 'Un groupe exemple avec 13 membres, prêts et historique', 'Ikimina cy’icyitegererezo gifite abanyamuryango 13, inguzanyo n’amateka');
D('Restore from backup', 'Restaurer une sauvegarde', 'Garura amakuru yabitswe'); D('Import a .json backup file', 'Importer un fichier de sauvegarde .json', 'Injiza dosiye y’amakuru yabitswe (.json)');
D('Create your group', 'Créez votre groupe', 'Fungura ikimina cyanyu'); D('You can change everything later in Settings.', 'Vous pourrez tout modifier plus tard dans les Paramètres.', 'Ushobora guhindura byose nyuma mu Igenamiterere.');
D('The group', 'Le groupe', 'Ikimina'); D('Group name', 'Nom du groupe', 'Izina ry’ikimina'); D('e.g. Twisungane Ikimina', 'p. ex. Twisungane Ikimina', 'urugero: Twisungane Ikimina'); D('Location', 'Localisation', 'Aho giherereye'); D('Kigali', 'Kigali', 'Kigali');
D('Currency', 'Devise', 'Ifaranga'); D('Contribution frequency', 'Fréquence des cotisations', 'Inshuro z’umusanzu'); D('Contribution per period', 'Cotisation par période', 'Umusanzu kuri buri gihe');
D('Loan interest (% per month)', 'Intérêt des prêts (% par mois)', 'Inyungu y’inguzanyo (% ku kwezi)'); D('Full name', 'Nom complet', 'Amazina yombi'); D('4-digit PIN', 'Code PIN à 4 chiffres', 'PIN y’imibare 4');
D('(the person who receives & records money)', '(la personne qui reçoit et enregistre l’argent)', '(ufata akanandika amafaranga)'); D('Create group', 'Créer le groupe', 'Fungura ikimina');
D('Enter your 4-digit PIN', 'Saisissez votre code PIN à 4 chiffres', 'Andika PIN yawe y’imibare 4'); D('Choose your profile to sign in', 'Choisissez votre profil pour vous connecter', 'Hitamo umwirondoro wawe winjire');
D('Demo mode — every PIN is', 'Mode démo — tous les codes PIN sont', 'Uburyo bw’icyitegererezo — PIN zose ni');
D('Sign in', 'Se connecter', 'Injira'); D('Sign out', 'Se déconnecter', 'Sohoka'); D('No match', 'Aucun résultat', 'Nta cyabonetse');

/* ---- navigation sections & titles ---- */
D('Overview', 'Vue d’ensemble', 'Incamake'); D('Group', 'Groupe', 'Ikimina'); D('Community', 'Communauté', 'Abanyamuryango'); D('Admin', 'Administration', 'Ubuyobozi'); D('Cashbook', 'Livre de caisse', 'Igitabo cy’amafaranga');
D('My account', 'Mon compte', 'Konti yanjye'); D('Dashboard', 'Tableau de bord', 'Ibigenderwaho'); D('Analytics', 'Analyses', 'Isesengura'); D('Contributions', 'Cotisations', 'Imisanzu'); D('Loans', 'Prêts', 'Inguzanyo');
D('Requests', 'Demandes', 'Ibisabwa'); D('Finance', 'Finances', 'Imari'); D('Rotation', 'Rotation', 'Guhererekanya'); D('Meetings', 'Réunions', 'Inama'); D('Announcements', 'Annonces', 'Amatangazo');
D('Reports', 'Rapports', 'Raporo'); D('Audit', 'Audit', 'Igenzura'); D('Settings', 'Paramètres', 'Igenamiterere'); D('Profile', 'Profil', 'Umwirondoro');

/* ---- dashboards ---- */
D('Cash in hand', 'Caisse', 'Amafaranga ari mu kigega'); D('Total savings', 'Épargne totale', 'Ubwizigame bwose'); D('Loans out', 'Prêts en cours', 'Inguzanyo zatanzwe'); D('Interest & income', 'Intérêts et revenus', 'Inyungu n’andi yinjiye');
D('Review approvals', 'Examiner les approbations', 'Suzuma ibigomba kwemezwa'); D('Post announcement', 'Publier une annonce', 'Tangaza itangazo'); D('Loans outstanding', 'Encours des prêts', 'Inguzanyo zisigaye'); D('Interest earned', 'Intérêts perçus', 'Inyungu yabonetse');
D('From repaid loans', 'Sur les prêts remboursés', 'Ku nguzanyo zishyuwe'); D('Pot payouts', 'Versements de la cagnotte', 'Ikigega cyahawe abanyamuryango'); D('View board', 'Voir le tableau', 'Reba urutonde');
D('Cash flow', 'Flux de trésorerie', 'Imigendekere y’amafaranga'); D('last 6 months', '6 derniers mois', 'amezi 6 ashize'); D('Collected', 'Collecté', 'Byakusanyijwe'); D('Expected', 'Attendu', 'Byari byitezwe');
D('Recent activity', 'Activité récente', 'Ibikorwa bya vuba'); D('Top savers', 'Meilleurs épargnants', 'Abizigama cyane'); D('No activity yet', 'Aucune activité', 'Nta gikorwa kirabaho'); D('No savings yet', 'Aucune épargne', 'Nta bwizigame burabaho');
D('No upcoming meeting', 'Aucune réunion prévue', 'Nta nama iteganyijwe'); D('Loan repayment', 'Remboursement de prêt', 'Kwishyura inguzanyo'); D('Contribution', 'Cotisation', 'Umusanzu'); D('Today', 'Aujourd’hui', 'Uyu munsi'); D('Yesterday', 'Hier', 'Ejo hashize');
D('overdue loans', 'prêts en retard', 'inguzanyo zarengeje igihe'); D('overdue loan', 'prêt en retard', 'inguzanyo yarengeje igihe');
D('My total savings', 'Mon épargne totale', 'Ubwizigame bwanjye bwose'); D('Group rank', 'Rang dans le groupe', 'Umwanya mu kimina'); D('Reliability', 'Fiabilité', 'Kwiringirwa');
D("You're fully up to date with your contributions. Great job!", 'Vos cotisations sont à jour. Bravo !', 'Imisanzu yawe yose irishyuwe. Komeza gutyo!'); D('You have', 'Vous avez', 'Ufite');
D('in missed contributions. Please pay your accountant.', 'de cotisations manquées. Veuillez payer votre comptable.', 'y’imisanzu itarishyurwa. Nyamuneka ishyura umucungamari.');
D('My savings growth', 'Évolution de mon épargne', 'Uko ubwizigame bwanjye bwiyongera'); D('Your growth chart will appear after your first contribution', 'Votre courbe apparaîtra après votre première cotisation', 'Igishushanyo cyawe kizagaragara nyuma y’umusanzu wa mbere');
D('My loan', 'Mon prêt', 'Inguzanyo yanjye'); D('No active loan', 'Aucun prêt en cours', 'Nta nguzanyo ufite'); D('You can borrow up to', 'Vous pouvez emprunter jusqu’à', 'Ushobora kugurizwa ntarengwa'); D('Request a loan', 'Demander un prêt', 'Saba inguzanyo');
D('Recent contributions', 'Cotisations récentes', 'Imisanzu ya vuba'); D('Latest news', 'Dernières nouvelles', 'Amakuru mashya'); D('Nothing yet', 'Rien pour le moment', 'Nta kirabaho'); D('No news', 'Aucune nouvelle', 'Nta makuru'); D('Nothing here', 'Rien ici', 'Nta kirimo');
D('Repaid', 'Remboursé', 'Byishyuwe'); D('repaid', 'remboursé', 'byishyuwe'); D('Next payment', 'Prochain paiement', 'Igikurikira kwishyurwa');

/* ---- contributions ---- */
D('current', 'actuel', 'ubu'); D('View-only — the accountant records payments', 'Lecture seule — le comptable enregistre les paiements', 'Kureba gusa — umucungamari ni we wandika ubwishyu');
D('Record contribution', 'Enregistrer une cotisation', 'Andika umusanzu'); D('Collection board', 'Tableau de collecte', 'Urutonde rw’imisanzu'); D('Ledger', 'Registre', 'Igitabo'); D('All periods', 'Toutes les périodes', 'Ibihe byose'); D('This period', 'Cette période', 'Iki gihe');
D('Receipt', 'Reçu', 'Inyemezabwishyu'); D('Recorded by', 'Enregistré par', 'Yanditswe na'); D('No contributions found', 'Aucune cotisation trouvée', 'Nta musanzu wabonetse'); D('No members', 'Aucun membre', 'Nta banyamuryango');
D('Record a contribution', 'Enregistrer une cotisation', 'Andika umusanzu'); D('For period', 'Pour la période', 'Ku gihe cya'); D('Date received', 'Date de réception', 'Itariki wakiriweho'); D('Payment method', 'Mode de paiement', 'Uburyo bwo kwishyura');
D('Reference / MoMo txn ID', 'Référence / ID transaction MoMo', 'Nomero y’ubwishyu / MoMo'); D('Save & issue receipt', 'Enregistrer et émettre le reçu', 'Bika utange inyemezabwishyu'); D('Payment recorded', 'Paiement enregistré', 'Ubwishyu bwanditswe');
D('Save PDF receipt', 'Enregistrer le reçu PDF', 'Bika inyemezabwishyu muri PDF'); D('Record another', 'Enregistrer un autre', 'Andika undi');
D('Only the Accountant can record payments', 'Seul le comptable peut enregistrer les paiements', 'Umucungamari wenyine ni we ushobora kwandika ubwishyu'); D('You do not have permission for this action', 'Vous n’avez pas la permission d’effectuer cette action', 'Nta burenganzira ufite bwo gukora iki gikorwa');
D('Reverse entry', 'Annuler l’écriture', 'Subiza inyuma icyanditswe'); D('This removes the entry of', 'Ceci supprime l’écriture de', 'Ibi bikuraho icyanditswe cya'); D('and logs the reversal in the audit trail.', 'et enregistre l’annulation dans le journal d’audit.', 'kandi bikandikwa mu mateka y’ibikorwa.'); D('Reason', 'Motif', 'Impamvu');
D('Entry reversed', 'Écriture annulée', 'Icyanditswe cyasubijwe inyuma'); D('Exported', 'Exporté', 'Byasohowe'); D('Receipt saved', 'Reçu enregistré', 'Inyemezabwishyu yabitswe'); D('Statement saved', 'Relevé enregistré', 'Raporo yabitswe');
D('Payment receipt', 'Reçu de paiement', 'Inyemezabwishyu'); D('Member statement', 'Relevé du membre', 'Raporo y’umunyamuryango');

/* ---- members ---- */
D('Add member', 'Ajouter un membre', 'Ongeramo umunyamuryango'); D('Arrears', 'Arriérés', 'Ibirarane'); D('Reliability', 'Fiabilité', 'Kwiringirwa'); D('No members found', 'Aucun membre trouvé', 'Nta munyamuryango wabonetse');
D('Edit member', 'Modifier le membre', 'Hindura umunyamuryango'); D('National ID', 'Carte d’identité', 'Indangamuntu'); D('Next of kin', 'Personne à contacter', 'Umuvandimwe wo kumenyesha'); D('Savings goal', 'Objectif d’épargne', 'Icyo wizigamira'); D('e.g. School fees', 'p. ex. frais de scolarité', 'urugero: amafaranga y’ishuri');
D('Shares (contribution multiplier)', 'Parts (multiplicateur de cotisation)', 'Ibice (byongera umusanzu)'); D('Join date', 'Date d’adhésion', 'Itariki yinjiriyeho');
D('The member receives temporary PIN', 'Le membre reçoit le code PIN temporaire', 'Umunyamuryango ahabwa PIN y’agateganyo'); D('and should change it after first sign-in.', 'et doit le changer à la première connexion.', 'agomba kuyihindura akimara kwinjira bwa mbere.');
D('Reset the PIN of', 'Réinitialiser le code PIN de', 'Subiza PIN ya'); D('They should change it at next sign-in.', 'Il/elle devra le changer à la prochaine connexion.', 'Agomba kuyihindura ubutaha yinjiye.'); D('Reset to 0000', 'Réinitialiser à 0000', 'Subiza kuri 0000');
D('Only the President can add members', 'Seul le président peut ajouter des membres', 'Perezida wenyine ni we ushobora kongeramo abanyamuryango'); D('Loan balance', 'Solde du prêt', 'Inguzanyo isigaye'); D('Excellent', 'Excellent', 'Nziza cyane'); D('Fair', 'Moyen', 'Ni ho ho'); D('At risk', 'À risque', 'Iri mu kaga');
D('Joined', 'Adhésion', 'Yinjiye'); D('Max loan', 'Prêt maximum', 'Inguzanyo ntarengwa'); D('Contribution history', 'Historique des cotisations', 'Amateka y’imisanzu'); D('Member since', 'Membre depuis', 'Umunyamuryango kuva'); D('None yet', 'Aucun pour le moment', 'Nta na kimwe');

/* ---- loans ---- */
D('Disbursed', 'Décaissé', 'Yatanzwe'); D('Outstanding', 'Solde dû', 'Isigaye'); D('Calculator', 'Calculatrice', 'Ikibaza-mibare'); D('New loan', 'Nouveau prêt', 'Inguzanyo nshya'); D('Borrower', 'Emprunteur', 'Ugurizwa'); D('Terms', 'Conditions', 'Amasezerano'); D('Progress', 'Progression', 'Aho bigeze');
D('Awaiting approval', 'En attente d’approbation', 'Itegereje kwemezwa'); D('Approved · to disburse', 'Approuvé · à décaisser', 'Yemejwe · igomba gutangwa'); D('No loans here', 'Aucun prêt ici', 'Nta nguzanyo ihari'); D('flat', 'fixe', 'ihamye'); D('declining', 'dégressif', 'igabanuka');
D('loan awaiting your approval', 'prêt en attente de votre approbation', 'inguzanyo itegereje ko wemeza'); D('loans awaiting your approval', 'prêts en attente de votre approbation', 'inguzanyo zitegereje ko wemeza');
D('loan approved and ready to disburse', 'prêt approuvé prêt à être décaissé', 'inguzanyo yemejwe ikaba yiteguye gutangwa'); D('loans approved and ready to disburse', 'prêts approuvés prêts à être décaissés', 'inguzanyo zemejwe ziteguye gutangwa');
D('Installments (months)', 'Échéances (mois)', 'Amezi yo kwishyura'); D('Interest % per month', 'Intérêt % par mois', 'Inyungu % ku kwezi'); D('Interest type', 'Type d’intérêt', 'Ubwoko bw’inyungu');
D('Flat', 'Fixe', 'Ihamye'); D('Declining', 'Dégressif', 'Igabanuka'); D('Declining balance', 'Solde dégressif', 'Igabanuka uko wishyura'); D('First repayment', 'Premier remboursement', 'Kwishyura bwa mbere'); D('Guarantor', 'Garant', 'Umwishingizi'); D('Purpose', 'Objet', 'Icyo igenewe');
D('Installment', 'Échéance', 'Igice cyo kwishyura'); D('Total repay', 'Total à rembourser', 'Yose yo kwishyura'); D('Submit for approval', 'Soumettre pour approbation', 'Ohereza kugira ngo yemezwe'); D('Create loan', 'Créer le prêt', 'Fungura inguzanyo');
D('Loan calculator', 'Calculateur de prêt', 'Ikibaza-mibare cy’inguzanyo'); D('Months', 'Mois', 'Amezi'); D('per month', 'par mois', 'ku kwezi'); D('% per month', '% par mois', '% ku kwezi'); D('Start', 'Début', 'Itangira'); D('Months to repay', 'Mois de remboursement', 'Amezi yo kwishyura');
D('Total to repay', 'Total à rembourser', 'Yose yo kwishyura'); D('On track', 'Dans les temps', 'Bigenda neza'); D('Repayment schedule', 'Échéancier de remboursement', 'Igenamigambi ryo kwishyura'); D('Rate', 'Taux', 'Igipimo'); D('Approved by', 'Approuvé par', 'Yemejwe na'); D('Payments', 'Paiements', 'Ubwishyu');
D('No payments yet', 'Aucun paiement', 'Nta bwishyu burabaho'); D('Approve loan', 'Approuver le prêt', 'Emeza inguzanyo'); D('Reject loan', 'Rejeter le prêt', 'Anga inguzanyo'); D('Reason (shared with member)', 'Motif (communiqué au membre)', 'Impamvu (izabwirwa umunyamuryango)');
D('Repayment', 'Remboursement', 'Kwishyura'); D('Record repayment', 'Enregistrer un remboursement', 'Andika ubwishyu bw’inguzanyo'); D('Save repayment', 'Enregistrer le remboursement', 'Bika ubwishyu'); D('Loan statement', 'Relevé de prêt', 'Raporo y’inguzanyo');
D('Loans & repayments', 'Prêts et remboursements', 'Inguzanyo n’ubwishyu bwazo');
D('(3× your savings)', '(3× votre épargne)', '(inshuro 3 z’ubwizigame bwawe)'); D('You have no loans', 'Vous n’avez aucun prêt', 'Nta nguzanyo ufite'); D('Request one when you need it', 'Demandez-en un quand vous en avez besoin', 'Saba imwe igihe uyikeneye');
D('Request loan', 'Demander un prêt', 'Saba inguzanyo'); D('Loan approved', 'Prêt approuvé', 'Inguzanyo yemejwe'); D('Not enough cash', 'Caisse insuffisante', 'Nta mafaranga ahagije mu kigega');
D('Only the President can approve', 'Seul le président peut approuver', 'Perezida wenyine ni we wemeza'); D('Only the Accountant disburses loans', 'Seul le comptable décaisse les prêts', 'Umucungamari wenyine ni we utanga inguzanyo');
D('Loan approved — ready to disburse', 'Prêt approuvé — prêt à être décaissé', 'Inguzanyo yemejwe — yiteguye gutangwa');

/* ---- requests ---- */
D('Loans awaiting approval', 'Prêts en attente d’approbation', 'Inguzanyo zitegereje kwemezwa'); D('Requests & notices', 'Demandes et avis', 'Ibisabwa n’amatangazo'); D('Send notice', 'Envoyer un avis', 'Ohereza ubutumwa'); D('Send a notice', 'Envoyer un avis', 'Ohereza ubutumwa');
D('I will be late', 'Je serai en retard', 'Nzatinda'); D('I will be absent', 'Je serai absent(e)', 'Sinzaboneka'); D('Other message', 'Autre message', 'Ubundi butumwa'); D('Message', 'Message', 'Ubutumwa'); D('Send request', 'Envoyer la demande', 'Ohereza icyifuzo');
D('Note to member (optional)', 'Note au membre (facultatif)', 'Ubutumwa ku munyamuryango (si itegeko)'); D('Loan request', 'Demande de prêt', 'Gusaba inguzanyo'); D('Absence notice', 'Avis d’absence', 'Kumenyesha ko udashobora kuza'); D('Late notice', 'Avis de retard', 'Kumenyesha ko uzatinda');

/* ---- finance ---- */
D('Other income', 'Autres revenus', 'Andi mafaranga yinjiye'); D('Net (income − expenses)', 'Net (revenus − dépenses)', 'Asigaye (yinjiye − yasohotse)'); D('Expenses by category', 'Dépenses par catégorie', 'Amafaranga yasohotse ku bwoko'); D('Income by source', 'Revenus par source', 'Amafaranga yinjiye ku isoko');
D('total', 'total', 'yose'); D('Income & fines', 'Revenus et amendes', 'Yinjiye n’amahazabu'); D('View-only', 'Lecture seule', 'Kureba gusa'); D('Category', 'Catégorie', 'Ubwoko'); D('Description', 'Description', 'Ibisobanuro'); D('Source', 'Source', 'Aho yaturutse');
D('Add expense', 'Ajouter une dépense', 'Ongeraho ikiguzi'); D('Add income', 'Ajouter un revenu', 'Ongeraho amafaranga yinjiye'); D('Stationery', 'Papeterie', 'Ibikoresho by’ibiro'); D('Meeting', 'Réunion', 'Inama'); D('Transport', 'Transport', 'Ubwikorezi'); D('Solidarity', 'Solidarité', 'Ubufasha bw’umuhana');
D('Bank charges', 'Frais bancaires', 'Amafaranga ya banki'); D('Rent', 'Loyer', 'Ubukode'); D('Fine', 'Amende', 'Ihazabu'); D('Membership fee', 'Frais d’adhésion', 'Amafaranga yo kwinjira'); D('Donation', 'Don', 'Impano'); D('No entries yet', 'Aucune écriture', 'Nta cyanditswe');
D('Expense exceeds cash in hand', 'La dépense dépasse la caisse', 'Ikiguzi kiruta amafaranga ari mu kigega'); D('Expense saved', 'Dépense enregistrée', 'Ikiguzi cyabitswe'); D('Income saved', 'Revenu enregistré', 'Amafaranga yinjiye yabitswe');

/* ---- rotation ---- */
D('Next pot recipient', 'Prochain bénéficiaire de la cagnotte', 'Uzahabwa ikigega ubutaha'); D('Edit order', 'Modifier l’ordre', 'Hindura uko bakurikirana'); D('Rotation order', 'Ordre de rotation', 'Uko bakurikirana'); D('Payout history', 'Historique des versements', 'Amateka yo guhabwa ikigega');
D('No rotation yet', 'Aucune rotation', 'Nta gahunda irashyirwaho'); D('Record payout', 'Enregistrer un versement', 'Andika ihabwa ry’ikigega'); D('Record pot payout', 'Enregistrer le versement de la cagnotte', 'Andika guhabwa ikigega'); D('Recipient', 'Bénéficiaire', 'Uhabwa');
D('Pay out', 'Verser', 'Tanga ikigega'); D('Tick members and order them with the arrows.', 'Cochez les membres et ordonnez-les avec les flèches.', 'Hitamo abanyamuryango ubakurikirane ukoresheje utwambi.'); D('Payout recorded', 'Versement enregistré', 'Guhabwa ikigega byanditswe');
D('Not enough cash in hand', 'Caisse insuffisante', 'Nta mafaranga ahagije mu kigega'); D('Use “Edit order” to choose members', 'Utilisez « Modifier l’ordre » pour choisir les membres', 'Kanda “Hindura uko bakurikirana” uhitemo abanyamuryango');

/* ---- meetings & announcements ---- */
D('Schedule meeting', 'Planifier une réunion', 'Tegura inama'); D('Past meetings', 'Réunions passées', 'Inama zabaye'); D('Minutes', 'Procès-verbal', 'Raporo y’inama'); D('Attendance & minutes', 'Présence et procès-verbal', 'Abitabiriye na raporo'); D('Attendance', 'Présence', 'Abitabiriye');
D('Minutes / decisions', 'Procès-verbal / décisions', 'Raporo / imyanzuro'); D('Save & mark held', 'Enregistrer et marquer comme tenue', 'Bika wemeze ko yabaye'); D('Title', 'Titre', 'Umutwe'); D('Time', 'Heure', 'Isaha'); D('Agenda', 'Ordre du jour', 'Ibiganirwaho'); D('No upcoming meetings', 'Aucune réunion à venir', 'Nta nama iteganyijwe'); D('No past meetings', 'Aucune réunion passée', 'Nta nama yabaye');
D('New announcement', 'Nouvelle annonce', 'Itangazo rishya'); D('Pin to top?', 'Épingler en haut ?', 'Ririsha hejuru?'); D('No announcements yet', 'Aucune annonce', 'Nta matangazo arabaho'); D('Published to all members', 'Publié pour tous les membres', 'Ryatangarijwe abanyamuryango bose');
D('Meeting saved', 'Réunion enregistrée', 'Inama yabitswe'); D('You attended ✅', 'Vous étiez présent(e) ✅', 'Witabiriye ✅'); D('You were absent', 'Vous étiez absent(e)', 'Ntiwaje'); D('General meeting', 'Assemblée générale', 'Inama rusange');
D('Only the President posts announcements', 'Seul le président publie des annonces', 'Perezida wenyine ni we utangaza amatangazo'); D('Post an announcement', 'Publier une annonce', 'Tangaza itangazo');

/* ---- analytics ---- */
D('Avg savings / member', 'Épargne moy. / membre', 'Ubwizigame buringaniye ku munyamuryango'); D('Members up-to-date', 'Membres à jour', 'Abanyamuryango bishyuye'); D('No arrears', 'Aucun arriéré', 'Nta birarane'); D('Loan book / savings', 'Prêts / épargne', 'Inguzanyo / ubwizigame');
D('Lending ratio', 'Ratio de prêt', 'Igipimo cy’inguzanyo'); D('Return on savings', 'Rendement de l’épargne', 'Inyungu ku bwizigame'); D('Net gain / savings', 'Gain net / épargne', 'Inyungu nyayo / ubwizigame'); D('Monthly cash flow (12 months)', 'Flux mensuel (12 mois)', 'Imigendekere y’amafaranga buri kwezi (amezi 12)');
D('Cumulative savings', 'Épargne cumulée', 'Ubwizigame bwose bugeze'); D('Savings by member', 'Épargne par membre', 'Ubwizigame bw’umunyamuryango'); D('Loan portfolio', 'Portefeuille de prêts', 'Imiterere y’inguzanyo'); D('disbursed', 'décaissé', 'yatanzwe');
D('Members needing attention', 'Membres à suivre', 'Abanyamuryango bakeneye gukurikiranwa'); D('Everyone is on track', 'Tout le monde est à jour', 'Bose bari ku murongo'); D('Not available', 'Non disponible', 'Ntibiboneka');

/* ---- reports ---- */
D('Group financial statement', 'Situation financière du groupe', 'Raporo y’imari y’ikimina'); D('Cash, savings, loans, income and expenses in one PDF.', 'Caisse, épargne, prêts, revenus et dépenses dans un seul PDF.', 'Amafaranga, ubwizigame, inguzanyo, yinjiye n’yasohotse muri PDF imwe.');
D('Generate PDF', 'Générer le PDF', 'Kora PDF'); D('Member statements', 'Relevés des membres', 'Raporo z’abanyamuryango'); D('Choose any member and export a full PDF statement.', 'Choisissez un membre et exportez son relevé complet en PDF.', 'Hitamo umunyamuryango uhite ubona raporo ye yuzuye muri PDF.');
D('Choose member', 'Choisir un membre', 'Hitamo umunyamuryango'); D('Share-out calculator', 'Calculateur de partage', 'Kubara gusaranganya'); D('Fair year-end distribution proportional to each member’s savings.', 'Partage équitable de fin d’année, proportionnel à l’épargne de chaque membre.', 'Gusaranganya mu mpera z’umwaka hakurikijwe ubwizigame bwa buri wese.');
D('Open calculator', 'Ouvrir le calculateur', 'Fungura ikibaza-mibare'); D('Contributions (Excel/CSV)', 'Cotisations (Excel/CSV)', 'Imisanzu (Excel/CSV)'); D('Every contribution, ready for Excel.', 'Toutes les cotisations, prêtes pour Excel.', 'Imisanzu yose, yiteguye gukoreshwa muri Excel.');
D('Loans (Excel/CSV)', 'Prêts (Excel/CSV)', 'Inguzanyo (Excel/CSV)'); D('All loans with status and balances.', 'Tous les prêts avec statut et soldes.', 'Inguzanyo zose n’aho zigeze zishyurwa.'); D('Expenses & income (CSV)', 'Dépenses et revenus (CSV)', 'Yasohotse n’yinjiye (CSV)');
D('Group cashbook entries.', 'Écritures du livre de caisse.', 'Ibyanditswe mu gitabo cy’amafaranga.'); D('Members register', 'Registre des membres', 'Urutonde rw’abanyamuryango'); D('Contact list with savings & arrears.', 'Liste de contacts avec épargne et arriérés.', 'Urutonde rufite telefoni, ubwizigame n’ibirarane.');
D('Backup all data', 'Sauvegarder toutes les données', 'Bika amakuru yose'); D('Save a full backup file you can restore anywhere.', 'Enregistrez une sauvegarde complète restaurable partout.', 'Bika dosiye yuzuye ushobora kugarura ahandi hose.'); D('Save backup', 'Enregistrer la sauvegarde', 'Bika amakuru'); D('Backup saved', 'Sauvegarde enregistrée', 'Amakuru yabitswe');
D('Share-out plan', 'Plan de partage', 'Gahunda yo gusaranganya'); D('Distributable pool', 'Masse à partager', 'Amafaranga azasaranganywa'); D('Cash + loans out', 'Caisse + prêts en cours', 'Ayo mu kigega + inguzanyo zatanzwe'); D('Growth on savings', 'Croissance de l’épargne', 'Inyongera ku bwizigame'); D('Share %', 'Part %', 'Igice %'); D('Payout', 'Versement', 'Azahabwa');
D('Payout = member savings ÷ total savings × pool. Outstanding loans are counted in the pool and settled as repaid.', 'Versement = épargne du membre ÷ épargne totale × masse. Les prêts en cours sont comptés dans la masse et réglés au fur et à mesure.', 'Azahabwa = ubwizigame bw’umunyamuryango ÷ ubwizigame bwose × amafaranga azasaranganywa. Inguzanyo zisigaye zibarwa mu mafaranga azasaranganywa.');
D('Save PDF', 'Enregistrer en PDF', 'Bika muri PDF'); D('Financial statement', 'Situation financière', 'Raporo y’imari'); D('Monthly summary', 'Récapitulatif mensuel', 'Incamake y’ukwezi'); D('Member balances', 'Soldes des membres', 'Ibyo abanyamuryango bafite'); D('Month', 'Mois', 'Ukwezi');

/* ---- audit & settings ---- */
D('Tamper-evident trail of every action', 'Historique infalsifiable de chaque action', 'Amateka y’ibikorwa byose adashobora guhindurwa'); D('Nothing logged', 'Rien d’enregistré', 'Nta kiranditswe'); D('Group created', 'Groupe créé', 'Ikimina cyafunguwe'); D('Demo group set up', 'Groupe de démonstration créé', 'Ikimina cy’icyitegererezo cyashyizweho');
D('Signed in', 'Connexion', 'Yinjiye'); D('Signed out', 'Déconnexion', 'Yasohotse'); D('Contribution recorded', 'Cotisation enregistrée', 'Umusanzu wanditswe'); D('Loan created', 'Prêt créé', 'Inguzanyo yafunguwe'); D('Loan rejected', 'Prêt rejeté', 'Inguzanyo yanzwe');
D('Loan disbursed', 'Prêt décaissé', 'Inguzanyo yatanzwe'); D('Repayment recorded', 'Remboursement enregistré', 'Ubwishyu bw’inguzanyo bwanditswe'); D('Penalty charged', 'Pénalité appliquée', 'Ihazabu yatanzwe'); D('Expense recorded', 'Dépense enregistrée', 'Ikiguzi cyanditswe'); D('Income recorded', 'Revenu enregistré', 'Amafaranga yinjiye yanditswe');
D('Member added', 'Membre ajouté', 'Umunyamuryango yongeweho'); D('Member updated', 'Membre modifié', 'Umunyamuryango yahinduwe'); D('PIN reset', 'PIN réinitialisé', 'PIN yasubijwe'); D('Pot payout', 'Versement de cagnotte', 'Guhabwa ikigega'); D('Rotation updated', 'Rotation mise à jour', 'Uko bakurikirana byahinduwe');
D('Meeting held', 'Réunion tenue', 'Inama yabaye'); D('Announcement posted', 'Annonce publiée', 'Itangazo ryatangajwe'); D('Announcement removed', 'Annonce supprimée', 'Itangazo ryakuweho'); D('Settings updated', 'Paramètres mis à jour', 'Igenamiterere ryahinduwe'); D('PIN changed', 'PIN modifié', 'PIN yahinduwe');
D('Backup created', 'Sauvegarde créée', 'Amakuru yabitswe'); D('Loan requested', 'Prêt demandé', 'Inguzanyo yasabwe'); D('Loan request approved', 'Demande de prêt approuvée', 'Gusaba inguzanyo byemejwe'); D('Meeting scheduled', 'Réunion planifiée', 'Inama yateguwe'); D('Loan approved', 'Prêt approuvé', 'Inguzanyo yemejwe');
D('Group settings', 'Paramètres du groupe', 'Igenamiterere ry’ikimina'); D('Frequency', 'Fréquence', 'Inshuro'); D('Contribution / period', 'Cotisation / période', 'Umusanzu / igihe'); D('Objective', 'Objectif', 'Intego y’ikimina'); D('Loan policy', 'Politique de prêt', 'Amategeko y’inguzanyo');
D('Interest % / month', 'Intérêt % / mois', 'Inyungu % / ukwezi'); D('Late penalty %', 'Pénalité de retard %', 'Ihazabu yo gutinda %'); D('Grace days', 'Jours de grâce', 'Iminsi y’imbabazi'); D('Max loan (× savings)', 'Prêt max (× épargne)', 'Inguzanyo ntarengwa (× ubwizigame)'); D('President approval', 'Approbation du président', 'Kwemezwa na Perezida');
D('Save settings', 'Enregistrer les paramètres', 'Bika igenamiterere'); D('Settings saved', 'Paramètres enregistrés', 'Igenamiterere ryabitswe'); D('Appearance & language', 'Apparence et langue', 'Isura n’ururimi'); D('Toggle dark mode', 'Basculer le mode sombre', 'Hindura hagati y’umwijima n’umucyo'); D('Dark / light', 'Sombre / clair', 'Umwijima / umucyo');
D('Change my PIN', 'Changer mon code PIN', 'Hindura PIN yanjye'); D('Current PIN', 'Code PIN actuel', 'PIN y’ubu'); D('New PIN (4 digits)', 'Nouveau PIN (4 chiffres)', 'PIN nshya (imibare 4)'); D('Update PIN', 'Mettre à jour le PIN', 'Hindura PIN'); D('PIN updated', 'PIN mis à jour', 'PIN yahinduwe');
D('Danger zone', 'Zone de danger', 'Aho kwitondera'); D('Start over with a clean group or reload the demo data. Make a backup first!', 'Repartez de zéro ou rechargez les données de démonstration. Faites d’abord une sauvegarde !', 'Tangira bushya cyangwa usubizeho amakuru y’icyitegererezo. Banza ubike amakuru yawe!');
D('Erase all data', 'Effacer toutes les données', 'Siba amakuru yose'); D('Erase everything', 'Tout effacer', 'Siba byose'); D('Confirmation', 'Confirmation', 'Kwemeza'); D('to confirm.', 'pour confirmer.', 'kugira ngo wemeze.');
D('This permanently deletes the group, members and history from this computer. Type', 'Ceci supprime définitivement le groupe, les membres et l’historique de cet ordinateur. Tapez', 'Ibi bisiba burundu ikimina, abanyamuryango n’amateka kuri iyi mudasobwa. Andika');
D('What can I do?', 'Que puis-je faire ?', 'Nshobora gukora iki?'); D('Locked for 30 seconds', 'Verrouillé pour 30 secondes', 'Bihagaritswe amasegonda 30'); D('Wrong PIN', 'PIN incorrect', 'PIN si yo'); D('Current PIN is incorrect', 'Le PIN actuel est incorrect', 'PIN y’ubu si yo'); D('New PIN must be 4 digits', 'Le nouveau PIN doit comporter 4 chiffres', 'PIN nshya igomba kuba imibare 4');
D('PINs must be exactly 4 digits', 'Les PIN doivent comporter exactement 4 chiffres', 'PIN zigomba kuba imibare 4 gusa'); D('Group created! Sign in to begin.', 'Groupe créé ! Connectez-vous pour commencer.', 'Ikimina cyafunguwe! Injira utangire.'); D('Backup restored', 'Sauvegarde restaurée', 'Amakuru yagaruwe');
D('That file is not a valid Ikimina backup', 'Ce fichier n’est pas une sauvegarde Ikimina valide', 'Iyi dosiye si amakuru yabitswe ya Ikimina'); D('Type ERASE to confirm', 'Tapez ERASE pour confirmer', 'Andika ERASE kugira ngo wemeze'); D('Enter a valid amount', 'Saisissez un montant valide', 'Andika amafaranga yemewe'); D('Invalid amount', 'Montant invalide', 'Amafaranga si yo');
D('A member with this phone already exists', 'Un membre avec ce téléphone existe déjà', 'Hari umunyamuryango ufite iyi telefoni'); D('The group needs a President', 'Le groupe a besoin d’un président', 'Ikimina gikeneye Perezida'); D('There is already an Accountant — change their role first', 'Il y a déjà un comptable — modifiez d’abord son rôle', 'Hari umucungamari — banza uhindure inshingano ze');
D('Saved', 'Enregistré', 'Byabitswe'); D('Done', 'Terminé', 'Byarangiye'); D('Request sent to the President', 'Demande envoyée au président', 'Icyifuzo cyoherejwe kuri Perezida'); D('Notice sent', 'Avis envoyé', 'Ubutumwa bwoherejwe'); D('Penalty recorded as group income', 'Pénalité enregistrée comme revenu du groupe', 'Ihazabu yanditswe nk’amafaranga y’ikimina yinjiye');
D('Repayment saved', 'Remboursement enregistré', 'Ubwishyu bwabitswe'); D('Locked after 10 minutes of inactivity', 'Verrouillé après 10 minutes d’inactivité', 'Byahagaritswe nyuma y’iminota 10 nta gikorwa');

/* ---- profile permissions ---- */
D('See every transaction and analytics', 'Voir chaque transaction et les analyses', 'Kubona buri gikorwa cy’imari n’isesengura'); D('Approve loans and requests', 'Approuver les prêts et les demandes', 'Kwemeza inguzanyo n’ibisabwa'); D('Post announcements, schedule meetings', 'Publier des annonces, planifier des réunions', 'Gutangaza amatangazo no gutegura inama');
D('Manage members and settings', 'Gérer les membres et les paramètres', 'Gucunga abanyamuryango n’igenamiterere'); D('Receive & record contributions and repayments', 'Recevoir et enregistrer cotisations et remboursements', 'Kwakira no kwandika imisanzu n’ubwishyu bw’inguzanyo'); D('Disburse approved loans, record expenses/income', 'Décaisser les prêts approuvés, enregistrer dépenses/revenus', 'Gutanga inguzanyo zemejwe, kwandika ibyasohotse n’ibyinjiye');
D('Record pot payouts', 'Enregistrer les versements de la cagnotte', 'Kwandika guhabwa ikigega'); D('Issue receipts and reports', 'Émettre reçus et rapports', 'Gutanga inyemezabwishyu na raporo'); D('View your own savings and history', 'Consulter votre épargne et votre historique', 'Kureba ubwizigame bwawe n’amateka yabwo');
D('Request loans, send notices', 'Demander des prêts, envoyer des avis', 'Gusaba inguzanyo no kohereza ubutumwa'); D('Read announcements and meetings', 'Lire annonces et réunions', 'Gusoma amatangazo n’inama'); D('Download your statement & receipts', 'Télécharger votre relevé et vos reçus', 'Gukuramo raporo yawe n’inyemezabwishyu');

/* ---- member savings page ---- */
D('Total saved', 'Total épargné', 'Ubwizigame bwose'); D('Expected / period', 'Attendu / période', 'Ibyitezwe / igihe'); D('Please pay soon', 'Merci de payer bientôt', 'Nyamuneka ishyura vuba'); D('All clear', 'Tout est réglé', 'Nta kirarane'); D('Payment calendar', 'Calendrier des paiements', 'Kalendari y’ubwishyu');
D('Transaction history', 'Historique des transactions', 'Amateka y’ubwishyu'); D('My statement', 'Mon relevé', 'Raporo yanjye');

/* ---- patterns for sentences with variable parts ---- */
P(/^(\d+) contributions recorded$/, '$1 cotisations enregistrées', 'Imisanzu $1 yanditswe');
P(/^(\d+) active loans$/, '$1 prêts en cours', 'Inguzanyo $1 zirimo gukora');
P(/^(\d+) rounds paid$/, '$1 tours versés', 'Inshuro $1 zishyuwe');
P(/^(\d+) loans?$/, '$1 prêt(s)', 'Inguzanyo $1');
P(/^(\d+) payments?$/, '$1 paiement(s)', 'Ubwishyu $1');
P(/^(\d+) entries$/, '$1 écritures', 'Ibyanditswe $1');
P(/^(\d+) paid$/, '$1 payé(s)', '$1 bishyuye');
P(/^(\d+) pending$/, '$1 en attente', '$1 bitegereje');
P(/^(\d+)\/(\d+) paid$/, '$1/$2 payés', '$1/$2 bishyuye');
P(/^(\d+) months$/, '$1 mois', 'Amezi $1');
P(/^(\d+) contributions since (.+)$/, '$1 cotisations depuis $2', 'Imisanzu $1 kuva $2');
P(/^(\d+) days ago$/, 'il y a $1 jours', 'hashize iminsi $1');
P(/^(\d+) mo ago$/, 'il y a $1 mois', 'hashize amezi $1');
P(/^(\d+) yr ago$/, 'il y a $1 an(s)', 'hashize imyaka $1');
P(/^Total group worth (.+) including loans out$/, 'Valeur totale du groupe $1, prêts en cours inclus', 'Agaciro k’ikimina kose ni $1 harimo n’inguzanyo zatanzwe');
P(/^Cash in hand · (President|Accountant|Member) view$/, 'Caisse · vue $1', 'Amafaranga ari mu kigega · uko $1 abibona');
P(/^Review approvals \((\d+)\)$/, 'Examiner les approbations ($1)', 'Suzuma ibigomba kwemezwa ($1)');
P(/^(.+) collection$/, 'Collecte $1', 'Imisanzu ya $1');
P(/^Collection board — (.+)$/, 'Tableau de collecte — $1', 'Urutonde rw’imisanzu — $1');
P(/^(.+) \(current\)$/, '$1 (actuel)', '$1 (ubu)');
P(/^overdue loans?: (.+)$/, 'prêts en retard : $1', 'inguzanyo zarengeje igihe: $1');
P(/^members? (?:have|has) not paid for (.+)$/, 'membre(s) n’ont pas payé pour $1', 'abanyamuryango ntibarishyura umusanzu wa $1');
P(/^(Savings|Income|Expenses|Active|Repaid|Interest earned|[A-Z][A-Za-z ]+): ([\d,]+)$/, '$1 : $2', '$1: $2');
P(/^Wk of (.+)$/, 'Sem. du $1', 'Icyumweru cya $1');
P(/^Suggested pot: (.+) \((\d+) members × (.+)\)$/, 'Cagnotte suggérée : $1 ($2 membres × $3)', 'Ikigega gitegenyijwe: $1 (abanyamuryango $2 × $3)');
P(/^Attendance: (.+)$/, 'Présence : $1', 'Abitabiriye: $1');
P(/^Balance (.+)$/, 'Solde $1', 'Asigaye $1');
P(/^Interest (.+)$/, 'Intérêts $1', 'Inyungu $1');
P(/^Penalty (.+)$/, 'Pénalité $1', 'Ihazabu $1');
P(/^Arrears (.+)$/, 'Arriérés $1', 'Ibirarane $1');
P(/^Round (\d+)$/, 'Tour $1', 'Inshuro ya $1');
P(/^Repayment — (.+)$/, 'Remboursement — $1', 'Kwishyura — $1');
P(/^(\d+)% (flat|declining)$/, '$1 % $2', '$1% $2');
P(/^Charge penalty (.+)$/, 'Appliquer la pénalité $1', 'Tanga ihazabu ya $1');
P(/^Disburse (.+)$/, 'Décaisser $1', 'Tanga $1');
P(/^Loan installment (\d+) of (.+) due (.+)$/, 'Échéance n° $1 de $2 due le $3', 'Igice cya $1 cya $2 kigomba kwishyurwa ku wa $3');
P(/^(.+) is overdue by (.+)$/, '$1 est en retard de $2', '$1 yarengeje igihe cyo kwishyura $2');
P(/^Loan of (.+) for (.+) awaits your approval$/, 'Prêt de $1 pour $2 en attente de votre approbation', 'Inguzanyo ya $1 ya $2 itegereje ko wemeza');
P(/^Approved loan for (.+) is ready to disburse$/, 'Le prêt approuvé de $1 est prêt à être décaissé', 'Inguzanyo ya $1 yemejwe yiteguye gutangwa');
P(/^(.+): (Loan request|Absence notice|Late notice|Message)$/, '$1 : $2', '$1: $2');
P(/^(.+) on (\d.+) at (.+)$/, '$1 le $2 à $3', '$1 ku wa $2 kuri $3');
P(/^Your (.+) contribution is (partly paid|not yet paid) \((.+) remaining\)$/, 'Votre cotisation de $1 : $2 (reste $3)', 'Umusanzu wawe wa $1: $2 (asigaye $3)');
P(/^(partly paid)$/, 'partiellement payée', 'wishyuwe igice');
P(/^(not yet paid)$/, 'pas encore payée', 'ntiwishyurwa');
P(/^(.+) owes$/, '$1 doit', '$1 agomba kwishyura');
P(/^for (.+) · total saved (.+)$/, 'pour $1 · total épargné $2', 'ku gihe cya $1 · ubwizigame bwose $2');
P(/^Your contribution of (.+) was recorded \((.+)\)\. Thank you!$/, 'Votre cotisation de $1 a été enregistrée ($2). Merci !', 'Umusanzu wawe wa $1 wanditswe ($2). Murakoze!');
P(/^Your loan request of (.+) is awaiting approval$/, 'Votre demande de prêt de $1 est en attente d’approbation', 'Gusaba inguzanyo ya $1 bitegereje kwemezwa');
P(/^Your loan of (.+) was approved$/, 'Votre prêt de $1 a été approuvé', 'Inguzanyo yawe ya $1 yemejwe');
P(/^Your loan request was declined: (.+)$/, 'Votre demande de prêt a été refusée : $1', 'Gusaba inguzanyo kwawe byanzwe: $1');
P(/^Your loan of (.+) has been disbursed\. First payment (.+)\.$/, 'Votre prêt de $1 a été décaissé. Premier paiement le $2.', 'Inguzanyo yawe ya $1 yatanzwe. Kwishyura bwa mbere ni ku wa $2.');
P(/^Loan repayment of (.+) received\. Balance (.+)\.$/, 'Remboursement de $1 reçu. Solde : $2.', 'Ubwishyu bwa $1 bwakiriwe. Asigaye: $2.');
P(/^Congratulations — your loan is fully paid!$/, 'Félicitations — votre prêt est entièrement remboursé !', 'Turakwishimiye — inguzanyo yawe yose yarishyuwe!');
P(/^A late-payment penalty of (.+) was charged$/, 'Une pénalité de retard de $1 a été appliquée', 'Wahawe ihazabu yo gutinda kwishyura ya $1');
P(/^Your loan request of (.+) was approved\. The Accountant will disburse it\.$/, 'Votre demande de prêt de $1 a été approuvée. Le comptable la décaissera.', 'Gusaba inguzanyo ya $1 byemejwe. Umucungamari ari bugutange.');
P(/^Your (loan request|late notice|absence notice|message) was (acknowledged|declined)(.*)$/, 'Votre demande a été traitée : $2$3', 'Icyifuzo cyawe cyarasuzumwe: $2$3');
P(/^(acknowledged)$/, 'prise en compte', 'cyemewe'); P(/^(declined)$/, 'refusée', 'cyanzwe');
P(/^You received the pot of (.+)$/, 'Vous avez reçu la cagnotte de $1', 'Wahawe ikigega cya $1');
P(/^Meeting scheduled: (.+) on (.+) at (.+)$/, 'Réunion planifiée : $1 le $2 à $3', 'Inama yateguwe: $1 ku wa $2 kuri $3');
P(/^New meeting: (.+) on (.+)$/, 'Nouvelle réunion : $1 le $2', 'Inama nshya: $1 ku wa $2');
P(/^Not enough cash \((.+) available\)$/, 'Caisse insuffisante ($1 disponibles)', 'Nta mafaranga ahagije mu kigega ($1 ahari)');
P(/^Welcome back, (.+)!$/, 'Content de vous revoir, $1 !', 'Murakaza neza, $1!');
P(/^Too many attempts\. Try again in (\d+)s$/, 'Trop de tentatives. Réessayez dans $1 s', 'Wagerageje kenshi. Ongera ugerageze nyuma y’amasegonda $1');
P(/^(.+) added$/, '$1 ajouté(e)', '$1 yongeweho');
P(/^Above (.+)'s limit of (.+) \((\d+)× savings\)\. Approval is at the President's discretion\.$/, 'Au-dessus de la limite de $1 : $2 ($3× l’épargne). L’approbation est à la discrétion du président.', 'Irenze ingano $1 yemerewe: $2 (inshuro $3 z’ubwizigame). Perezida ni we ubifataho icyemezo.');
P(/^Within borrowing limit of (.+)$/, 'Dans la limite d’emprunt de $1', 'Ntirenze ingano ushobora kugurizwa ya $1');
P(/^Your limit is (.+)$/, 'Votre plafond est de $1', 'Ingano ushobora kugurizwa ni $1');
P(/^Go to (.+)$/, 'Aller à $1', 'Genda kuri $1');
P(/^📣 (.+)$/, '📣 $1', '📣 $1');

/* ---- extra phrases found during the coverage tour ---- */
D('Your limit is', 'Votre plafond est de', 'Ingano ushobora kugurizwa ni'); D('You attended', 'Vous étiez présent(e)', 'Witabiriye'); D('Ikinyarwanda', 'Ikinyarwanda', 'Ikinyarwanda');

P(/^Monthly contributions of (.+)$/, 'Cotisations mensuelles de $1', 'Umusanzu wa buri kwezi ni $1');
P(/^Amount \((.+)\)$/, 'Montant ($1)', 'Amafaranga ($1)');
P(/^Joined (.+)$/, 'Adhésion $1', 'Yinjiye $1');
P(/^(\d+) shares$/, '$1 parts', 'Ibice $1');
P(/^by (.+)$/, 'par $1', 'na $1');
P(/^Weekly contributions of (.+)$/, 'Cotisations hebdomadaires de $1', 'Umusanzu wa buri cyumweru ni $1');
P(/^Daily contributions of (.+)$/, 'Cotisations quotidiennes de $1', 'Umusanzu wa buri munsi ni $1');
P(/^Every 2 weeks contributions of (.+)$/, 'Cotisations toutes les 2 semaines de $1', 'Umusanzu wa buri byumweru bibiri ni $1');
