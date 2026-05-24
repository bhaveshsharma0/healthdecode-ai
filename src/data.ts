import { Specialist } from "./types";

export const SPECIALISTS_DATABASE: Specialist[] = [
  {
    name: "Cardiologist",
    icon: "❤️",
    degree_needed: "MBBS → MD General Medicine → DM Cardiology",
    degree_plain: "Heart specialist",
    tier: "Super Specialist",
    years_training: "~13 years",
    what_they_do: "Specialized tests (ECG, Echo, stress tests) to monitor blood pressure, coronary blockages, and heart rhythm disorders.",
    key_question: "Are these symptoms related to physical exertion, and do I need a cardiac marker test?",
    red_flags: "Heavy central chest pressure, pain radiating to the neck or left arm, or breaking into cold sweats.",
    keywords: ["chest pain", "heart", "palpitations", "bp", "cardiac", "pulse", "high blood pressure", "low blood pressure", "hypertension", "arrhythmia", "heavy chest", "tightness in chest", "angina", "fluttering", "heartbeat", "valve", "clot"]
  },
  {
    name: "Neurologist",
    icon: "🧠",
    degree_needed: "MBBS → MD → DM Neurology",
    degree_plain: "Brain and nerve specialist",
    tier: "Super Specialist",
    years_training: "~13 years",
    what_they_do: "Evaluates brain scans (MRI, CT) and nerve conductivity to address chronic migraine, tremors, cognitive declines, and neuropathic pain.",
    key_question: "Could this indicate centralized nerve compression, and is head imaging or an EEG advisable?",
    red_flags: "Sudden slurred speech, drooping on one side of facial muscles, or immediate weakness in limbs.",
    keywords: ["headache", "migraine", "dizziness", "seizure", "numb", "numbness", "memory loss", "tremor", "paralysis", "tingling", "stroke", "brain", "nerve", "fainting", "confusion", "vertigo", "fits"]
  },
  {
    name: "Gastroenterologist",
    icon: "🫃",
    degree_needed: "MBBS → MD → DM Gastroenterology",
    degree_plain: "Digestive system specialist",
    tier: "Super Specialist",
    years_training: "~13 years",
    what_they_do: "Diagnoses stomach, intestine, and gallbladder diseases. Performs endoscopies or colonoscopies to check internal tracks.",
    key_question: "Could my stomach pain point to a food intolerance, an ulcer, or gastroesophageal acid reflux?",
    red_flags: "Inability to swallow fluids, persistent vomiting containing blood, or black tarry stools.",
    keywords: ["stomach pain", "stomach", "acidity", "liver", "jaundice", "ibs", "bloating", "diarrhea", "constipation", "indigestion", "acid reflux", "heartburn", "vomiting", "nausea", "abdomen", "abdominal", "gallbladder", "bowel"]
  },
  {
    name: "Dermatologist",
    icon: "🧴",
    degree_needed: "MBBS → MD Dermatology",
    degree_plain: "Skin specialist",
    tier: "Specialist",
    years_training: "~10 years",
    what_they_do: "Treats diseases of the skin, scalp, and nails. Performs allergy prick tests, skin biopsies, and prescribes specialized topical plans.",
    key_question: "Is this skin condition eczema, psoriasis, or an allergic response, and are topical steroidal lotions safe?",
    red_flags: "A mole changing color or shape rapidly, or a skin rash spreading fast accompanied by a high body fever.",
    keywords: ["skin", "rash", "acne", "hair fall", "hair loss", "eczema", "psoriasis", "itching", "pimple", "mole", "blister", "dry skin", "scalp", "nail infection", "dandruff", "hives"]
  },
  {
    name: "Orthopaedician",
    icon: "🦴",
    degree_needed: "MBBS → MS Orthopaedics",
    degree_plain: "Bone and joint specialist",
    tier: "Specialist",
    years_training: "~10 years",
    what_they_do: "Manages skeletal posture, fractures, and ligament injuries. Determines if skeletal issues need splints, braces, or joint surgeries.",
    key_question: "Is this pain a sign of chronic joint cartilage wear, or is there a structural tendon tear?",
    red_flags: "Joint stiffness accompanied by sudden high fever, or complete inability to bear weight on a limb after an injury.",
    keywords: ["joint pain", "back pain", "fracture", "arthritis", "bone", "spine", "neck pain", "knee pain", "sprain", "dislocation", "muscle pull", "ligament", "rheumatism", "injury", "fractures"]
  },
  {
    name: "ENT Specialist",
    icon: "👂",
    degree_needed: "MBBS → MS ENT",
    degree_plain: "Ear, nose, throat specialist",
    tier: "Specialist",
    years_training: "~10 years",
    what_they_do: "Examines ears, throat passages, sinuses, and larynx. Manages hearing loss, balance disorders, and vocal cords issues.",
    key_question: "Does this ear pain or sinus pressure require targeted antibiotic therapy or allergy management?",
    red_flags: "Sudden complete hearing loss in one ear, or a hard painless neck block growing steadily.",
    keywords: ["ear pain", "hearing loss", "sinus", "tonsils", "nosebleed", "tinnitus", "blocked nose", "sore throat", "throat pain", "difficulty swallowing", "hoarse voice", "earache", "ringing in ear"]
  },
  {
    name: "Ophthalmologist",
    icon: "👁️",
    degree_needed: "MBBS → MS Ophthalmology",
    degree_plain: "Eye specialist",
    tier: "Specialist",
    years_training: "~10 years",
    what_they_do: "Treats eye infections, executes cataract surgeries, checks retinal changes from high diabetes, and operates on glaucoma.",
    key_question: "Do my visual changes warrant immediate corrective lenses, or is there intraocular pressure building?",
    red_flags: "Immediate dark spots floating across vision, sudden flashes of light, or any partial vision loss.",
    keywords: ["eye", "vision", "redness", "blur", "blurry vision", "double vision", "cataract", "dry eye", "itching eye", "glasses", "sight"]
  },
  {
    name: "Pulmonologist",
    icon: "🫁",
    degree_needed: "MBBS → MD Pulmonary Medicine",
    degree_plain: "Lung specialist",
    tier: "Specialist",
    years_training: "~10 years",
    what_they_do: "Assesses lungs tissue and breathing capacities. Prescribes inhalers for asthma, treats tuberculosis, and monitors severe snoring.",
    key_question: "Is my dry cough triggered by hyperactive lung airways, and should we run a spirometry reading?",
    red_flags: "Coughing up bright red blood, or unable to speak a single complete sentence due to gasp for air.",
    keywords: ["breathless", "asthma", "cough", "tb", "tuberculosis", "breathing", "wheezing", "phlegm", "copd", "bronchitis", "chest congestion"]
  },
  {
    name: "Endocrinologist",
    icon: "🧬",
    degree_needed: "MBBS → MD → DM Endocrinology",
    degree_plain: "Hormone specialist",
    tier: "Super Specialist",
    years_training: "~13 years",
    what_they_do: "Controls hormone deficiencies or surpluses. Directs diabetes treatments, thyroid imbalances, PCOS, and growth hormones.",
    key_question: "Does my thyroid profile show clinical hypothyroidism, or do my sugar levels indicate prediabetes?",
    red_flags: "Extreme heart palpitations with zero heat tolerance, or sudden lethargy and disorientation in a diabetic patient.",
    keywords: ["diabetes", "thyroid", "pcos", "hormon", "blood sugar", "insulin", "weight gain", "weight loss", "fatigue", "hair excess", "metabolism", "goitre"]
  },
  {
    name: "Nephrologist",
    icon: "💧",
    degree_needed: "MBBS → MD → DM Nephrology",
    degree_plain: "Kidney specialist",
    tier: "Super Specialist",
    years_training: "~13 years",
    what_they_do: "Diagnoses kidney damage, high blood pressure filtration stresses, kidney fluid edema, and guides dialysis.",
    key_question: "Are my kidney blood markers (creatinine, eGFR) stable, and could medications list be stressing filtration?",
    red_flags: "Sudden visible swelling of both lower feet and eyelids, or a drastic drop in liquid urination output.",
    keywords: ["kidney", "stone", "gout", "dark urine", "kidney pain", "flank pain", "creatinine", "dialysis"]
  },
  {
    name: "Urologist",
    icon: "🚻",
    degree_needed: "MBBS → MS Surgery → MCh Urology",
    degree_plain: "Urinary tract specialist",
    tier: "Super Specialist",
    years_training: "~13 years",
    what_they_do: "Manages urinary leakage, prostate enlargements in men, and executes surgeries for bladder or kidney stones.",
    key_question: "Do my repeating urinary tract infections point to underlying prostate enlargement or blockages?",
    red_flags: "Immediate inability to urinate despite a full painful bladder, or blood coloring your urine pink.",
    keywords: ["urinary", "prostate", "burning urination", "frequent urination", "blood in urine", "bladder", "semen", "testicular", "urine leak"]
  },
  {
    name: "Gynaecologist",
    icon: "🌸",
    degree_needed: "MBBS → MS OBG",
    degree_plain: "Women's health specialist",
    tier: "Specialist",
    years_training: "~10 years",
    what_they_do: "Guides pregnancy, delivers children, treats irregular periods, runs Pap smear scans, and addresses ovarian cysts.",
    key_question: "Could a hormonal balance sheet explain my heavy periods, or should I get a pelvic ultrasound?",
    red_flags: "Severe sudden one-sided lower pelvis cramp, or any unexpected bleeding during active pregnancies.",
    keywords: ["period", "menstru", "pregnancy", "ovary", "uterus", "vagina", "pcos", "white discharge", "breast pain", "fertility", "miscarriage"]
  },
  {
    name: "Psychiatrist",
    icon: "🧠",
    degree_needed: "MBBS → MD Psychiatry",
    degree_plain: "Mental health specialist",
    tier: "Specialist",
    years_training: "~10 years",
    what_they_do: "Diagnoses behavioral and psychological conditions. Prescribes neural balancing medications along with counseling.",
    key_question: "Will specialized temporary therapeutic medicine support stabilization of my sleep and panic scales?",
    red_flags: "Severe disassociation, hearing or seeing non-existent voices, or feeling the urge to self-harm.",
    keywords: ["depression", "anxiety", "panic attack", "bipolar", "insomnia", "hallucination", "stress", "mood swing", "ocd", "shame", "fear", "trauma", "sleep", "psychological"]
  },
  {
    name: "Oncologist",
    icon: "🎗️",
    degree_needed: "MBBS → MD → DM Oncology",
    degree_plain: "Cancer specialist",
    tier: "Super Specialist",
    years_training: "~13 years",
    what_they_do: "Coordinates cancer diagnostics, administers chemotherapies, targeted therapies, and coordinates surgery plans.",
    key_question: "Should we request a biopsy, or is an PET scan warranted to trace this growing knot?",
    red_flags: "A hard, painless static swelling in glands, or losing massive weight with zero lifestyle modifications.",
    keywords: ["cancer", "lump", "tumor", "chemotherapy", "unexplained weight loss", "biopsy", "growth", "lymph node"]
  },
  {
    name: "Rheumatologist",
    icon: "🛡️",
    degree_needed: "MBBS → MD → DM Rheumatology",
    degree_plain: "Autoimmune and joint disease specialist",
    tier: "Super Specialist",
    years_training: "~13 years",
    what_they_do: "Handles chronic inflammatory autoimmune diseases attacking joints. Monitors systemic Lupus or Rheumatoid arthritis.",
    key_question: "Does my morning stiffness lasting over an hour indicate a systemic autoimmune attack pattern?",
    red_flags: "High fever accompanied by immediate swelling inside multiple joints simultaneously without impact injuries.",
    keywords: ["lupus", "rheumatoid", "autoimmune", "swollen joint", "morning stiffness", "fibromyalgia"]
  },
  {
    name: "Paediatrician",
    icon: "🧒",
    degree_needed: "MBBS → MD Paediatrics",
    degree_plain: "Child specialist",
    tier: "Specialist",
    years_training: "~10 years",
    what_they_do: "Handles child development, vaccinations catalogs, pediatric asthma, pediatric infections, and safe dosage scales.",
    key_question: "Are these symptoms typical of common child viruses, and should I avoid adult strength syrup remedies?",
    red_flags: "Child becoming highly unresponsive, lethargic (hard to wake), or exhibiting high fever with a rigid neck.",
    keywords: ["pediatric", "child", "baby", "infant", "toddler", "growth delay", "vaccination", "bedwetting"]
  },
  {
    name: "Haematologist",
    icon: "🩸",
    degree_needed: "MBBS → MD → DM Haematology",
    degree_plain: "Blood specialist",
    tier: "Super Specialist",
    years_training: "~13 years",
    what_they_do: "Treats diseases of blood components: severe anemias, hemophilias, high or low platelet balances, and leukemia cancers.",
    key_question: "Do my red and white counts suggest iron deficiencies, or do I need a targeted bone marrow review?",
    red_flags: "Large, spreading bruises popping up with zero physical hits, or a cut that refuses to coagulate.",
    keywords: ["blood disorder", "anaemia", "hemophilia", "low platelets", "leukemia", "thalassemia", "clotting", "bleeding disorder", "iron deficiency"]
  },
  {
    name: "Infectious Disease Specialist",
    icon: "🦠",
    degree_needed: "MBBS → MD → DM Infectious Diseases",
    degree_plain: "Infection specialist",
    tier: "Super Specialist",
    years_training: "~13 years",
    what_they_do: "Identifies rare, tough, or multi-drug resistant germs, fever of unknown origin, and tropical bacterial infections.",
    key_question: "Should we run localized blood cultures, or do symptoms overlap with recent outside wilderness travel?",
    red_flags: "Spiked fevers leaping past 104°F that lead to sudden delirium or sudden sensitivity to ceiling lights.",
    keywords: ["infection", "hiv", "malaria", "typhoid", "dengue", "fever", "tb", "chronic infection", "parasite", "viral", "bacterial", "fungal", "shingles", "sepsis"]
  },
  {
    name: "Allergist / Immunologist",
    icon: "🌿",
    degree_needed: "MBBS → MD + Fellowship",
    degree_plain: "Allergy and immune specialist",
    tier: "Specialist",
    years_training: "~11 years",
    what_they_do: "Diagnoses hyperactive hypersensitivities. Conducts structural prick testing and maps safe immunotherapies or epinephrine pens.",
    key_question: "Can we locate the ambient trigger (pollen, dust, mold) that keeps inducing my nasal congestion?",
    red_flags: "Swelling of throat walls or lips, or wheezing gasps immediate after taking an experimental medicine or food.",
    keywords: ["allergy", "allergic", "hives", "dust allergy", "food allergy", "pollen", "sneezing", "anaphylaxis", "immunity", "runny nose"]
  },
  {
    name: "Geriatrician",
    icon: "🧓",
    degree_needed: "MBBS → MD Geriatric Medicine",
    degree_plain: "Senior citizen health specialist",
    tier: "Specialist",
    years_training: "~10 years",
    what_they_do: "Integrates medical plans for elderly systems, prevents medication overlap toxicities, checks mobility, and cognitive health.",
    key_question: "Could these new dizzy spells be a side-effect of combining these multiple medications?",
    red_flags: "Sudden sharp decline in cognitive memory, or repetitive unexplained physical falling at home.",
    keywords: ["elderly", "senior", "dementia", "fraility", "alzheimer", "old age", "geriatric", "falls", "weakness in elderly"]
  },
  {
    name: "Dentist",
    icon: "🦷",
    degree_needed: "BDS / MDS",
    degree_plain: "Dental specialist",
    tier: "Dental",
    years_training: "5–8 years",
    what_they_do: "Treats dental structures. Performs root canals, repairs tooth decays, treats bleeding gum gingivitis, and handles wisdom tooth procedures.",
    key_question: "Is this localized pain pointing to deep enamel pulp infection, and is a dental X-ray ready?",
    red_flags: "Oral swelling under the tongue or jaw that makes breathing physically restricted, or a fever.",
    keywords: ["tooth", "teeth", "jaw", "gum", "cavity", "filling", "braces", "root canal", "mouth ulcer", "wisdom tooth", "bleeding gums"]
  },
  {
    name: "Physiotherapist",
    icon: "🏃",
    degree_needed: "BPT / MPT",
    degree_plain: "Rehab and movement expert",
    tier: "Allied Health",
    years_training: "4–6 years",
    what_they_do: "Directs targeted exercise programs, performs deep tissue mobilizations, and aids mechanical recovery of muscles and nerves.",
    key_question: "What exact daily postures or ergonomic modifications will stop sciatica nerve pinches?",
    red_flags: "Sudden loss of bowel or bladder toilet control accompanied by complete groin numbness.",
    keywords: ["movement", "rehab", "posture", "physiotherapy", "stretching", "injury rehab", "sciatica", "paralysis rehab"]
  },
  {
    name: "General Physician",
    icon: "🩺",
    degree_needed: "MBBS or MD General Medicine",
    degree_plain: "General doctor",
    tier: "General",
    years_training: "~6.5 to 10 years",
    what_they_do: "Offers first contact physical checks, coordinates overall wellness, manages basic infections, and refers to specialists.",
    key_question: "Can we treat these general body aches therapeutically before scheduling complex, high-fee specialized scans?",
    red_flags: "Any chest pain, or a severe high fever that refuses to respond to basic paracetamol fluids after 5 days.",
    keywords: ["cold", "fever", "cough", "flu", "weakness", "body ache", "unclear", "general checkup", "viral fever", "tiredness", "headache"]
  }
];

export const EMERGENCY_KEYWORDS = [
  "chest pain", "heart attack", "cant breathe", "can't breathe",
  "difficulty breathing", "stroke", "face drooping", "arm weakness",
  "sudden confusion", "unconscious", "seizure", "severe bleeding",
  "coughing blood", "vomiting blood", "suicidal", "want to die",
  "overdose", "poisoning", "severe burn", "loss of vision",
  "sudden vision loss", "worst headache ever", "sudden paralysis",
  "no pulse", "choking", "anaphylaxis", "throat swelling",
  "fainted", "collapsed", "not breathing", "unresponsive"
];

export const MOTIVATIONAL_QUOTES = [
  "The right doctor is half the cure.",
  "Knowing where to go is the first step to getting better.",
  "Your health deserves the right expert, not just any doctor.",
  "Don't guess which doctor to see — know.",
  "One right specialist visit is worth ten wrong ones."
];

export const PRESET_TEMPLATES = [
  {
    title: "🚨 Cold Sweat & Chest Pain (Emergency Demo)",
    text: "I am having sudden chest pain and feel a cold sweat. It feels like a heavy weight is on my chest and I cannot breathe.",
    ageGroup: "Adult (18–60)",
    sex: "Male",
    duration: "Started today",
    severity: "Severe — very painful or worrying",
    conditions: "Hypertension"
  },
  {
    title: "❤️ Heart Palpitations & Short Breath",
    text: "I have had heart palpitations (fluttering feelings) for 3 days and feel breathable walking up the steps. My BP fluctuates a lot.",
    ageGroup: "Adult (18–60)",
    sex: "Female",
    duration: "2–7 days",
    severity: "Moderate — affecting daily life",
    conditions: "Hypertension"
  },
  {
    title: "🧠 Migraine Headaches & Vertigo",
    text: "I experience throbbing headaches on the right side of my head with nausea, dizzy spells, and vomiting when in lit rooms.",
    ageGroup: "Adult (18–60)",
    sex: "Female",
    duration: "Recurring",
    severity: "Moderate — affecting daily life",
    conditions: "None"
  },
  {
    title: "🧴 Red Skin Rashes & Itching",
    text: "I have dry skin patches, itching, red rashes behind my knees that are starting to bleed when I scratch.",
    ageGroup: "Child (0–12)",
    sex: "Male",
    duration: "1–4 weeks",
    severity: "Moderate — affecting daily life",
    conditions: "Asthma"
  },
  {
    title: "🦴 Shooting Back & Sciatica Pain",
    text: "There is a sharp shooting pain going down from my lower back down to my right leg making it stiff to walk.",
    ageGroup: "Senior (60+)",
    sex: "Male",
    duration: "More than a month",
    severity: "Moderate — affecting daily life",
    conditions: "Osteoarthritis"
  },
  {
    title: "🌸 Women Health & PCOS",
    text: "I have irregular periods, sudden weight gain with chronic cramps in my lower pelvic zone. It has been recurring for months.",
    ageGroup: "Teen (13–17)",
    sex: "Female",
    duration: "Recurring",
    severity: "Moderate — affecting daily life",
    conditions: "Thyroid"
  }
];
