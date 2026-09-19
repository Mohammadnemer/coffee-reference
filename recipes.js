/**
 * recipes.js — Coffee drinks reference data
 *
 * 40 recipes across three pieces of equipment:
 *   capsule  → Nespresso Original machine
 *   filter   → drip / pour-over / immersion
 *   turkish  → ibrik (kanaka) on the stove
 *
 * Shape of one record:
 *   id          unique slug, used for favourites in localStorage
 *   equipment   "capsule" | "filter" | "turkish"
 *   style       array of "hot" | "iced" | "milk" | "dessert"
 *   minutes     rough hands-on time, for the card
 *   baseYield   finished volume in ml that the amounts below produce
 *   caffeine    mg in one serving at baseYield
 *   calories    kcal in one serving at baseYield
 *   name/blurb  { ar, en }
 *   ingredients [{ ar, en, amount, unit, fixed?, mg? }]
 *               unit: "ml" | "g" | "shot" | "tsp" | "tbsp" | "pc" | "scoop"
 *               fixed: true  → never scales with cup size
 *               mg: n        → caffeine per countable unit (shot, capsule).
 *                              Present only where the coffee is counted in
 *                              whole shots, so its caffeine steps with the
 *                              shot count instead of with volume.
 *   steps       [{ ar, en, seconds? }]  seconds → renders a timer
 *   why         { ar, en }  one or two sentences on the mechanism
 *   fixes       [{ problem, cause, fix }] each { ar, en }
 *
 * Scaling: factor = targetCupSize / baseYield.
 *   shot, pc, scoop → Math.max(1, Math.round(x))
 *   ml              → nearest 5
 *   tsp, tbsp       → nearest 0.5
 *   g               → nearest 1
 *
 * Caffeine scaling: the part that comes from ingredients carrying `mg`
 * follows the rounded shot count, so two shots becoming three jumps the
 * figure. Whatever is left over (brewed coffee measured in g or ml) scales
 * continuously, as calories do.
 *
 * Reference figures used for every record, so the arithmetic in the comments
 * above each `caffeine` / `calories` field can be rechecked:
 *   espresso capsule 65 mg · lungo capsule 85 mg · ristretto pull 55 mg
 *   filter 130 mg per 15 g grounds (8.67 mg/g) · turkish 65 mg per 7 g
 *   cold brew concentrate 100 mg/100 ml, shown after its 1:1 dilution
 *   decaf 3 mg · water, ice, milk, syrup and spices contribute no caffeine
 *   espresso 2 kcal/shot · filter coffee 2 kcal/100 ml · whole milk 64/100 ml
 *   condensed milk 321/100 ml · dark chocolate 5.5/g · white chocolate 5.4/g
 *   caramel, chocolate or vanilla sauce 1.0/ml · sugar 16/tsp · honey 64/tbsp
 *   ice cream 140/scoop · tonic 34/100 ml · orange juice 45/100 ml
 *   pistachio paste 6/g · spices, rose water, saffron, peel, ice, water 0
 */

const RECIPES = [

  /* ───────────────────────── CAPSULE — BLACK ───────────────────────── */

  {
    id: "espresso",
    equipment: "capsule",
    style: ["hot"],
    minutes: 2,
    baseYield: 40,
    // caffeine: 1 capsule x 65 mg
    caffeine: 65,
    // calories: espresso 40 ml = 2
    calories: 2,
    name: { ar: "إسبريسو", en: "Espresso" },
    blurb: {
      ar: "الأساس لكل مشروب ثاني — شوت مركّز بكريما ذهبية.",
      en: "The base for everything else — a concentrated shot under golden crema."
    },
    ingredients: [
      { ar: "كبسولة (شدّة ٨–١٢)", en: "Capsule (intensity 8–12)", amount: 1, unit: "pc", mg: 65 },
      { ar: "ماء (من الماكينة)", en: "Water (from the machine)", amount: 40, unit: "ml" }
    ],
    steps: [
      { ar: "شغّل الماكينة واستنى الأضواء تثبت عن الوميض.", en: "Turn the machine on and wait for the lights to stop blinking." },
      { ar: "مرّر دورة فاضية بدون كبسولة داخل الفنجان لتسخينه، ثم كبّ الماء.", en: "Run a blank cycle with no capsule into your cup to warm it, then tip the water out." },
      { ar: "حط الكبسولة، أغلق الرافعة، واختر أقل حجم صبّة.", en: "Load the capsule, close the lever, and select the smallest volume." },
      { ar: "اضغط الصبّ واتركه لين يوقف لحاله.", en: "Press brew and let it run until it stops.", seconds: 30 },
      { ar: "اشربه خلال دقيقتين — الكريما بتتكسر بعدها.", en: "Drink within two minutes — the crema collapses after that." }
    ],
    why: {
      ar: "الضغط العالي بيستخلص الزيوت والسكريات بسرعة، والـ CO₂ المحبوس بالبن بيطلع كرغوة دقيقة هي الكريما. الكبسولة محفوظة بغاز خامل فما بتتأكسد قبل الفتح.",
      en: "High pressure pulls oils and sugars out fast, and CO₂ trapped in the coffee surfaces as the fine foam we call crema. The capsule is packed under inert gas, so the grounds don't oxidise before you open it."
    },
    fixes: [
      { problem: { ar: "ما في كريما", en: "No crema" }, cause: { ar: "الماكينة ما سخّنت، أو الكبسولة قديمة", en: "Machine not up to temperature, or an old capsule" }, fix: { ar: "استنى الأضواء تثبت، وجرّب كبسولة من علبة أحدث", en: "Wait for steady lights, and try a capsule from a newer box" } },
      { problem: { ar: "مرّ ومحروق", en: "Bitter and burnt" }, cause: { ar: "حجم الصبّة كبير على الكبسولة", en: "Shot volume too large for the capsule" }, fix: { ar: "قلّل الخانات لأقل إعداد", en: "Drop to the smallest volume setting" } },
      { problem: { ar: "حامض وفاضي", en: "Sour and thin" }, cause: { ar: "شدّة الكبسولة منخفضة", en: "Capsule intensity too low" }, fix: { ar: "اختار كبسولة شدّة ٩ أو أعلى", en: "Pick an intensity 9 or higher" } }
    ]
  },

  {
    id: "ristretto",
    equipment: "capsule",
    style: ["hot"],
    minutes: 2,
    baseYield: 20,
    // caffeine: 1 capsule pulled short x 55 mg
    caffeine: 55,
    // calories: espresso 20 ml = 1
    calories: 1,
    name: { ar: "ريستريتو", en: "Ristretto" },
    blurb: {
      ar: "نص إسبريسو بالحجم، وضعفه بالكثافة. أحلى وأقل مرارة.",
      en: "Half the volume of an espresso, twice the density. Sweeter, less bitter."
    },
    ingredients: [
      { ar: "كبسولة (شدّة ٩–١٢)", en: "Capsule (intensity 9–12)", amount: 1, unit: "pc", mg: 55 },
      { ar: "ماء", en: "Water", amount: 20, unit: "ml" }
    ],
    steps: [
      { ar: "سخّن الماكينة والفنجان زي الإسبريسو.", en: "Preheat the machine and cup as for espresso." },
      { ar: "حط الكبسولة واختار أصغر حجم.", en: "Load the capsule and pick the smallest volume." },
      { ar: "اضغط الصبّ، وأوقفه يدوياً عند ٢٠ مل تقريباً.", en: "Start the brew and stop it manually at roughly 20 ml.", seconds: 18 }
    ],
    why: {
      ar: "الأحماض والسكريات بتذوب أول، والمركبات المرة بتطلع بآخر الصبّة. لما تقطع الصبّة بدري، بتاخد الحلو وبتترك المرّ بالكبسولة.",
      en: "Acids and sugars dissolve first; the bitter compounds come out at the tail of the shot. Cutting the shot early keeps the sweetness and leaves the bitterness in the capsule."
    },
    fixes: [
      { problem: { ar: "حامض جداً", en: "Too sour" }, cause: { ar: "قطعت الصبّة بدري زيادة", en: "Cut the shot too early" }, fix: { ar: "خليها توصل ٢٥ مل", en: "Let it run to 25 ml" } },
      { problem: { ar: "كمية قليلة مزعجة", en: "Feels like too little" }, cause: { ar: "هاي طبيعة المشروب", en: "That's the drink" }, fix: { ar: "اعمل ريستريتو مضاعف بدل واحد", en: "Pull a double ristretto instead" } }
    ]
  },

  {
    id: "lungo",
    equipment: "capsule",
    style: ["hot"],
    minutes: 2,
    baseYield: 110,
    // caffeine: 1 lungo capsule x 85 mg
    caffeine: 85,
    // calories: coffee 110 ml x 0.02 = 2
    calories: 2,
    name: { ar: "لونغو", en: "Lungo" },
    blurb: {
      ar: "صبّة طويلة من نفس الكبسولة — أخف بالجسم وأوضح بالمرارة.",
      en: "A long pull from the same capsule — lighter bodied, more openly bitter."
    },
    ingredients: [
      { ar: "كبسولة لونغو مخصصة", en: "Dedicated lungo capsule", amount: 1, unit: "pc", mg: 85 },
      { ar: "ماء", en: "Water", amount: 110, unit: "ml" }
    ],
    steps: [
      { ar: "سخّن الماكينة والكوب.", en: "Preheat the machine and cup." },
      { ar: "حط كبسولة لونغو — مش كبسولة إسبريسو.", en: "Load a lungo capsule, not an espresso one." },
      { ar: "اختار أكبر حجم صبّة واضغط.", en: "Select the largest volume and brew.", seconds: 60 }
    ],
    why: {
      ar: "كبسولات اللونغو مطحونة أخشن وفيها بن أكثر، عشان تتحمل مرور ماء أكثر بدون استخلاص زائد. كبسولة الإسبريسو بنفس الإعداد بتطلع مرّة.",
      en: "Lungo capsules are ground coarser and hold more coffee so they can take the extra water without over-extracting. An espresso capsule on the same setting turns bitter."
    },
    fixes: [
      { problem: { ar: "مرّ وخشبي", en: "Bitter and woody" }, cause: { ar: "استعملت كبسولة إسبريسو", en: "Used an espresso capsule" }, fix: { ar: "بدّلها بكبسولة لونغو، أو اعمل أمريكانو", en: "Swap to a lungo capsule, or make an americano" } }
    ]
  },

  {
    id: "americano",
    equipment: "capsule",
    style: ["hot"],
    minutes: 3,
    baseYield: 160,
    // caffeine: 1 shot x 65 mg; water 0
    caffeine: 65,
    // calories: 1 shot = 2; water 0
    calories: 2,
    name: { ar: "أمريكانو", en: "Americano" },
    blurb: {
      ar: "إسبريسو مخفّف بماء ساخن — قهوة سوداء بجسم أنظف من اللونغو.",
      en: "Espresso let down with hot water — black coffee with a cleaner body than a lungo."
    },
    ingredients: [
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 },
      { ar: "ماء ساخن ٩٠–٩٣°", en: "Hot water 90–93°C", amount: 120, unit: "ml" }
    ],
    steps: [
      { ar: "اغلي الماء واستنى ٣٠ ثانية.", en: "Boil water and let it stand for 30 seconds.", seconds: 30 },
      { ar: "صبّ ١٢٠ مل ماء بالكوب.", en: "Pour 120 ml of water into the cup." },
      { ar: "اسحب شوت إسبريسو فوق الماء مباشرة.", en: "Pull the espresso shot straight onto the water.", seconds: 30 }
    ],
    why: {
      ar: "لما القهوة تنزل على الماء، الكريما بتطفو وبتضل. العكس — صبّ ماء فوق الشوت — بيكسرها وبيطيّر الروائح معها.",
      en: "When coffee lands on water the crema floats and survives. Pouring water onto the shot breaks it up and carries the aromatics off with it."
    },
    fixes: [
      { problem: { ar: "مائي", en: "Watery" }, cause: { ar: "ماء كثير", en: "Too much water" }, fix: { ar: "نزّله لـ ٩٠ مل أو ضاعف الشوت", en: "Drop to 90 ml or double the shot" } },
      { problem: { ar: "بارد بسرعة", en: "Goes cold fast" }, cause: { ar: "الكوب ما تسخّن", en: "Cup wasn't preheated" }, fix: { ar: "مرّر دورة فاضية بالكوب أول", en: "Run a blank cycle into the cup first" } }
    ]
  },

  {
    id: "long-black",
    equipment: "capsule",
    style: ["hot"],
    minutes: 3,
    baseYield: 180,
    // caffeine: 2 shots x 65 mg; water 0
    caffeine: 130,
    // calories: 2 shots x 2 = 4; water 0
    calories: 4,
    name: { ar: "لونغ بلاك", en: "Long Black" },
    blurb: {
      ar: "النسخة الأسترالية — أقوى من الأمريكانو وكريماه محفوظة.",
      en: "The Australasian version — stronger than an americano, with the crema intact."
    },
    ingredients: [
      { ar: "ماء ساخن ٩٠–٩٣°", en: "Hot water 90–93°C", amount: 100, unit: "ml" },
      { ar: "شوت إسبريسو مركّز", en: "Concentrated espresso shot", amount: 2, unit: "shot", mg: 65 }
    ],
    steps: [
      { ar: "مرّر دورة فاضية بالكوب لتسخينه، وكبّ الماء.", en: "Run a blank cycle into the cup to warm it, then tip it out." },
      { ar: "اغلي ماء واستنى ٣٠ ثانية، ثم صبّ ١٠٠ مل بالكوب.", en: "Boil water, wait 30 seconds, then pour 100 ml into the cup.", seconds: 30 },
      { ar: "اضبط الماكينة على أقل حجم صبّة.", en: "Set the machine to its smallest volume." },
      { ar: "اسحب الشوت الأول فوق الماء.", en: "Pull the first shot onto the water.", seconds: 30 },
      { ar: "بدّل الكبسولة واسحب الشوت الثاني.", en: "Swap the capsule and pull the second shot.", seconds: 30 },
      { ar: "اتركه ثانيتين لتستقر الكريما، ولا تحرّك.", en: "Leave it a couple of seconds for the crema to settle. Don't stir." }
    ],
    why: {
      ar: "شوتين قصيرين مركّزين + ماء مضاف بيعطيك قوة بدون مرارة. لو مدّدت الصبّة نفسها على نفس الـ ٥ غرام بن، بتستخلص المركبات المرة وبيطلع الطعم خشبي.",
      en: "Two short concentrated shots plus added water give you strength without bitterness. Stretching the shot itself over the same 5 g of coffee pulls the bitter compounds and tastes woody."
    },
    fixes: [
      { problem: { ar: "مرّ ومحروق", en: "Bitter and burnt" }, cause: { ar: "صبّة كبيرة زيادة", en: "Shot volume too large" }, fix: { ar: "قلّل الخانات لأقل إعداد", en: "Reduce to the smallest setting" } },
      { problem: { ar: "خفيف ومائي", en: "Thin and watery" }, cause: { ar: "ماء كثير", en: "Too much water" }, fix: { ar: "نزّل الماء لـ ٨٠ مل", en: "Drop the water to 80 ml" } },
      { problem: { ar: "الكريما اختفت", en: "Crema disappeared" }, cause: { ar: "صببت الماء فوق القهوة", en: "Poured water onto the coffee" }, fix: { ar: "اعكس الترتيب — الماء أولاً", en: "Reverse the order — water first" } }
    ]
  },

  /* ───────────────────────── CAPSULE — MILK ───────────────────────── */

  {
    id: "latte",
    equipment: "capsule",
    style: ["hot", "milk"],
    minutes: 5,
    baseYield: 240,
    // caffeine: 1 shot x 65 mg; milk 0
    caffeine: 65,
    // calories: shot 2 + milk 180 ml x 0.64 (115.2) = 117.2
    calories: 117,
    name: { ar: "لاتيه", en: "Latte" },
    blurb: {
      ar: "شوت واحد بحليب كثير ورغوة رفيعة — أنعم مشروبات الحليب.",
      en: "One shot under a lot of milk and a thin cap of foam — the gentlest milk drink."
    },
    ingredients: [
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 },
      { ar: "حليب كامل الدسم", en: "Whole milk", amount: 180, unit: "ml" }
    ],
    steps: [
      { ar: "اسحب الشوت بكوب ٢٤٠ مل دافي.", en: "Pull the shot into a warm 240 ml cup.", seconds: 30 },
      { ar: "سخّن الحليب لـ ٦٠–٦٥° فقط — لا تغليه.", en: "Heat the milk to 60–65°C only — don't boil it." },
      { ar: "ارغيه: مرطبان محكم، رجّه بقوة، ثم مايكرويف ٣٠ ثانية بدون غطا.", en: "Foam it: seal it in a jar, shake hard, then microwave 30 seconds uncovered.", seconds: 45 },
      { ar: "صبّ الحليب من ارتفاع منخفض، وخلّي ١ سم رغوة فوق.", en: "Pour the milk in from low down, leaving about 1 cm of foam on top." }
    ],
    why: {
      ar: "فوق ٧٠° بروتين الحليب بيتفكك والسكر الطبيعي (اللاكتوز) بيفقد حلاوته ويصير طعمه مطبوخ. ٦٥° هي ذروة الحلاوة.",
      en: "Above 70°C the milk proteins denature and the lactose loses its sweetness, tasting cooked. 65°C is peak sweetness."
    },
    fixes: [
      { problem: { ar: "طعم الحليب مطبوخ", en: "Milk tastes cooked" }, cause: { ar: "سخّنته زيادة", en: "Overheated" }, fix: { ar: "وقّف عند ٦٥° — الكوب بيصير حامي على اليد بس محتمل", en: "Stop at 65°C — hot to hold but bearable" } },
      { problem: { ar: "القهوة اختفت", en: "Coffee disappeared" }, cause: { ar: "حليب كثير على شوت واحد", en: "Too much milk for one shot" }, fix: { ar: "ضاعف الشوت أو انزل لفلات وايت", en: "Double the shot or switch to a flat white" } },
      { problem: { ar: "الرغوة فقاقيع كبيرة", en: "Big bubbly foam" }, cause: { ar: "رجّيت بعد التسخين", en: "Shook after heating" }, fix: { ar: "رجّ وهو بارد، ثم سخّن", en: "Shake cold, then heat" } }
    ]
  },

  {
    id: "cappuccino",
    equipment: "capsule",
    style: ["hot", "milk"],
    minutes: 5,
    baseYield: 180,
    // caffeine: 1 shot x 65 mg; milk 0
    caffeine: 65,
    // calories: shot 2 + milk 120 ml x 0.64 (76.8) = 78.8; cocoa dust ~0
    calories: 79,
    name: { ar: "كابتشينو", en: "Cappuccino" },
    blurb: {
      ar: "ثلاث طبقات متساوية: قهوة، حليب، رغوة كثيفة.",
      en: "Three equal layers: coffee, milk, and a thick cap of foam."
    },
    ingredients: [
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 },
      { ar: "حليب سائل", en: "Steamed milk", amount: 60, unit: "ml" },
      { ar: "رغوة حليب", en: "Milk foam", amount: 60, unit: "ml" },
      { ar: "كاكاو للرش", en: "Cocoa to dust", amount: 1, unit: "pc", fixed: true }
    ],
    steps: [
      { ar: "اسحب الشوت بكوب ١٨٠ مل.", en: "Pull the shot into a 180 ml cup.", seconds: 30 },
      { ar: "ارغي ١٢٠ مل حليب حتى يتضاعف حجمه تقريباً.", en: "Foam 120 ml of milk until it roughly doubles in volume.", seconds: 45 },
      { ar: "صبّ الحليب السائل أول من تحت الرغوة.", en: "Pour the liquid milk first, from under the foam." },
      { ar: "اغرف الرغوة بملعقة فوق، ورشّ كاكاو.", en: "Spoon the foam on top and dust with cocoa." }
    ],
    why: {
      ar: "الرغوة الكثيفة بتعزل الحرارة وبتخلي الرشفة الأولى أخف، فطعم القهوة بيوصل متأخر ومتدرّج — هاد اللي بيميّزه عن اللاتيه.",
      en: "The thick foam insulates and softens the first sip, so the coffee arrives late and gradually — that's what sets it apart from a latte."
    },
    fixes: [
      { problem: { ar: "الرغوة اختفت بسرعة", en: "Foam collapsed quickly" }, cause: { ar: "حليب قليل الدسم أو قديم", en: "Low-fat or old milk" }, fix: { ar: "استعمل حليب كامل الدسم بارد", en: "Use cold whole milk" } },
      { problem: { ar: "الطبقات مختلطة", en: "Layers mixed together" }, cause: { ar: "صببت بسرعة", en: "Poured too fast" }, fix: { ar: "صبّ ببطء من ارتفاع منخفض", en: "Pour slowly from low down" } }
    ]
  },

  {
    id: "flat-white",
    equipment: "capsule",
    style: ["hot", "milk"],
    minutes: 5,
    baseYield: 180,
    // caffeine: 2 ristretto shots x 55 mg; milk 0
    caffeine: 110,
    // calories: 2 ristretto shots x 1 = 2 + milk 120 ml x 0.64 (76.8) = 78.8
    calories: 79,
    name: { ar: "فلات وايت", en: "Flat White" },
    blurb: {
      ar: "شوتين بحليب مخملي ورغوة بالكاد موجودة — القهوة هي البطل.",
      en: "Two shots, velvety milk, barely any foam — the coffee stays in charge."
    },
    ingredients: [
      { ar: "شوت ريستريتو", en: "Ristretto shot", amount: 2, unit: "shot", mg: 55 },
      { ar: "حليب كامل الدسم", en: "Whole milk", amount: 120, unit: "ml" }
    ],
    steps: [
      { ar: "اسحب شوتين ريستريتو بكوب ١٨٠ مل.", en: "Pull two ristretto shots into a 180 ml cup.", seconds: 40 },
      { ar: "سخّن الحليب لـ ٦٠–٦٥° مع رغوة رفيعة جداً (ميكروفوم).", en: "Heat the milk to 60–65°C with a very fine microfoam.", seconds: 45 },
      { ar: "دقّ الإبريق على الطاولة وحرّكه دائرياً لكسر الفقاعات الكبيرة.", en: "Tap the jug on the counter and swirl to knock out large bubbles." },
      { ar: "صبّ بثبات — الرغوة لازم تكون ميلي مترات، مش سنتيمترات.", en: "Pour steadily — the foam should be millimetres, not centimetres." }
    ],
    why: {
      ar: "الريستريتو أحلى وأقل مرارة من الإسبريسو، فبيقدر يظهر من خلف الحليب بدون ما يصير قابض. الرغوة الرفيعة بتخلي القوام مخملي بدل إسفنجي.",
      en: "Ristretto is sweeter and less bitter than espresso, so it reads through the milk without turning harsh. The fine foam gives a velvety rather than spongy texture."
    },
    fixes: [
      { problem: { ar: "طعمه زي اللاتيه", en: "Tastes like a latte" }, cause: { ar: "حليب كثير", en: "Too much milk" }, fix: { ar: "خليه ١٢٠ مل بالضبط", en: "Keep it at exactly 120 ml" } },
      { problem: { ar: "قابض ومرّ", en: "Harsh and bitter" }, cause: { ar: "شوتين إسبريسو بدل ريستريتو", en: "Two espressos instead of ristrettos" }, fix: { ar: "قصّر الصبّة لـ ٢٠ مل لكل شوت", en: "Cut each shot to 20 ml" } }
    ]
  },

  {
    id: "cortado",
    equipment: "capsule",
    style: ["hot", "milk"],
    minutes: 4,
    baseYield: 70,
    // caffeine: 1 shot x 65 mg; milk 0
    caffeine: 65,
    // calories: shot 2 + milk 35 ml x 0.64 (22.4) = 24.4
    calories: 24,
    name: { ar: "كورتادو", en: "Cortado" },
    blurb: {
      ar: "نص قهوة نص حليب بكوب صغير — للي بحب القهوة تظل واضحة.",
      en: "Half coffee, half milk, in a small glass — for when you still want to taste coffee."
    },
    ingredients: [
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 },
      { ar: "حليب دافي بدون رغوة تقريباً", en: "Warm milk, almost no foam", amount: 35, unit: "ml" }
    ],
    steps: [
      { ar: "اسحب الشوت بكوب زجاج صغير ١٠٠ مل.", en: "Pull the shot into a small 100 ml glass.", seconds: 30 },
      { ar: "سخّن ٣٥ مل حليب لـ ٦٠° بدون ما ترغيه كثير.", en: "Warm 35 ml of milk to 60°C without much foam.", seconds: 25 },
      { ar: "صبّه فوق الشوت مباشرة وحرّك مرة.", en: "Pour it straight onto the shot and stir once." }
    ],
    why: {
      ar: "الحليب هون وظيفته تخفيف الحموضة والمرارة بس، مش إضافة قوام. عشان هيك كميته صغيرة ورغوته شبه معدومة.",
      en: "Here the milk is only there to cut acidity and bitterness, not to add texture. That's why the volume is small and the foam almost absent."
    },
    fixes: [
      { problem: { ar: "غرق بالحليب", en: "Drowned in milk" }, cause: { ar: "كمية حليب كبيرة", en: "Too much milk" }, fix: { ar: "النسبة ١:١ بالضبط", en: "Keep it strictly 1:1" } }
    ]
  },

  {
    id: "macchiato",
    equipment: "capsule",
    style: ["hot", "milk"],
    minutes: 3,
    baseYield: 50,
    // caffeine: 1 shot x 65 mg; milk 0
    caffeine: 65,
    // calories: shot 2 + foam 1 tbsp = 15 ml x 0.64 (9.6) = 11.6
    calories: 12,
    name: { ar: "ماكياتو", en: "Macchiato" },
    blurb: {
      ar: "إسبريسو مع ملعقة رغوة فقط — \"ملطّخ\" بالحليب، لا أكثر.",
      en: "Espresso with one spoon of foam — 'stained' with milk, nothing more."
    },
    ingredients: [
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 },
      { ar: "رغوة حليب", en: "Milk foam", amount: 1, unit: "tbsp" }
    ],
    steps: [
      { ar: "اسحب الشوت بفنجان إسبريسو.", en: "Pull the shot into an espresso cup.", seconds: 30 },
      { ar: "ارغي كمية صغيرة حليب.", en: "Foam a small amount of milk.", seconds: 25 },
      { ar: "اغرف ملعقة رغوة فوق الشوت بالنص.", en: "Spoon one dollop of foam into the centre of the shot." }
    ],
    why: {
      ar: "الرغوة بتلطّف الرشفة الأولى بدون ما تغيّر تركيز الشوت — الفكرة إنك تشرب إسبريسو، مش مشروب حليب.",
      en: "The foam softens the first sip without diluting the shot — the point is that you're still drinking espresso, not a milk drink."
    },
    fixes: [
      { problem: { ar: "صار كورتادو", en: "Turned into a cortado" }, cause: { ar: "حطيت حليب سائل مش رغوة", en: "Added liquid milk instead of foam" }, fix: { ar: "اغرف الرغوة من فوق بس", en: "Spoon only from the top of the foam" } }
    ]
  },

  {
    id: "mocha",
    equipment: "capsule",
    style: ["hot", "milk", "dessert"],
    minutes: 6,
    baseYield: 240,
    // caffeine: 1 shot x 65 mg; chocolate and milk 0
    caffeine: 65,
    // calories: dark chocolate 15 g x 5.5 (82.5) + milk 30 ml x 0.64 (19.2) + shot 2 + milk 150 ml x 0.64 (96) = 199.7
    calories: 200,
    name: { ar: "موكا", en: "Mocha" },
    blurb: {
      ar: "لاتيه بشوكولاتة داكنة — الترتيب فيه بيفرق كتير.",
      en: "A latte built on dark chocolate — and the order you build it in matters."
    },
    ingredients: [
      { ar: "شوكولاتة داكنة مبشورة", en: "Grated dark chocolate", amount: 15, unit: "g" },
      { ar: "حليب لإذابة الشوكولاتة", en: "Milk to melt the chocolate", amount: 30, unit: "ml" },
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 },
      { ar: "حليب مبخّر", en: "Steamed milk", amount: 150, unit: "ml" }
    ],
    steps: [
      { ar: "ذوّب الشوكولاتة بـ ٣٠ مل حليب ساخن وحرّك حتى تنعم.", en: "Melt the chocolate into 30 ml of hot milk and stir until smooth.", seconds: 60 },
      { ar: "أضف الشوت وحرّك.", en: "Add the shot and stir." },
      { ar: "ارغي باقي الحليب وكمّل الكوب.", en: "Foam the rest of the milk and top up the cup.", seconds: 45 }
    ],
    why: {
      ar: "الكاكاو ما بيذوب بالإسبريسو الساخن لحاله — بيتكتّل. الحليب فيه دهون وبروتين بتحمل جزيئات الكاكاو، عشان هيك بنذوّب فيه أولاً.",
      en: "Cocoa won't dissolve in hot espresso on its own — it clumps. Milk has the fat and protein to carry the cocoa particles, which is why it goes in first."
    },
    fixes: [
      { problem: { ar: "تكتّلات بالقاع", en: "Lumps at the bottom" }, cause: { ar: "حطيت الكاكاو على الإسبريسو", en: "Cocoa went onto the espresso" }, fix: { ar: "ذوّبه بالحليب الساخن أولاً", en: "Melt it into hot milk first" } },
      { problem: { ar: "حلو زيادة", en: "Too sweet" }, cause: { ar: "شوكولاتة حليب بدل داكنة", en: "Milk chocolate instead of dark" }, fix: { ar: "استعمل ٧٠٪ كاكاو أو أعلى", en: "Use 70% cocoa or higher" } }
    ]
  },

  {
    id: "white-mocha",
    equipment: "capsule",
    style: ["hot", "milk", "dessert"],
    minutes: 6,
    baseYield: 240,
    // caffeine: 2 shots x 65 mg
    caffeine: 130,
    // calories: white chocolate 20 g x 5.4 (108) + milk 30 ml x 0.64 (19.2) + 2 shots x 2 (4) + milk 140 ml x 0.64 (89.6) = 220.8
    calories: 221,
    name: { ar: "وايت موكا", en: "White Mocha" },
    blurb: {
      ar: "بشوكولاتة بيضا — أحلى بكثير، فبده شوت أقوى يوازنه.",
      en: "Built on white chocolate — much sweeter, so it needs a stronger shot to balance."
    },
    ingredients: [
      { ar: "شوكولاتة بيضا", en: "White chocolate", amount: 20, unit: "g" },
      { ar: "حليب للإذابة", en: "Milk to melt", amount: 30, unit: "ml" },
      { ar: "شوت إسبريسو شدّة عالية", en: "High-intensity espresso shot", amount: 2, unit: "shot", mg: 65 },
      { ar: "حليب مبخّر", en: "Steamed milk", amount: 140, unit: "ml" }
    ],
    steps: [
      { ar: "ذوّب الشوكولاتة البيضا بالحليب على حرارة منخفضة — بتحترق بسرعة.", en: "Melt the white chocolate into milk over low heat — it scorches easily.", seconds: 60 },
      { ar: "أضف الشوتين وحرّك.", en: "Add both shots and stir." },
      { ar: "كمّل بالحليب المبخّر.", en: "Top up with steamed milk.", seconds: 45 }
    ],
    why: {
      ar: "الشوكولاتة البيضا ما فيها كاكاو صلب — كلها زبدة كاكاو وسكر. فما بتضيف مرارة توازن، لهيك بنزيد القهوة.",
      en: "White chocolate contains no cocoa solids — it's all cocoa butter and sugar. It adds no balancing bitterness, so you add more coffee instead."
    },
    fixes: [
      { problem: { ar: "الشوكولاتة تحبّبت", en: "Chocolate went grainy" }, cause: { ar: "حرارة عالية", en: "Heat too high" }, fix: { ar: "ذوّبها على نار هادئة جداً أو بحمام مائي", en: "Melt it very gently or over a water bath" } }
    ]
  },

  {
    id: "caramel-macchiato",
    equipment: "capsule",
    style: ["hot", "milk", "dessert"],
    minutes: 5,
    baseYield: 240,
    // caffeine: 1 shot x 65 mg
    caffeine: 65,
    // calories: caramel 20 ml x 1 (20) + milk 160 ml x 0.64 (102.4) + shot 2 + drizzle 1 tsp = 5 ml x 1 (5) = 129.4
    calories: 129,
    name: { ar: "كراميل ماكياتو", en: "Caramel Macchiato" },
    blurb: {
      ar: "مبني بالمقلوب — الشوت بينزل آخر شي، فبتشوف الطبقات.",
      en: "Built upside down — the shot goes in last, so the layers show."
    },
    ingredients: [
      { ar: "صوص كراميل", en: "Caramel sauce", amount: 20, unit: "ml" },
      { ar: "حليب مبخّر", en: "Steamed milk", amount: 160, unit: "ml" },
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 },
      { ar: "كراميل للزخرفة", en: "Caramel to drizzle", amount: 1, unit: "tsp", fixed: true }
    ],
    steps: [
      { ar: "حط الكراميل بقاع الكوب.", en: "Put the caramel in the bottom of the cup." },
      { ar: "ارغي الحليب وصبّه فوق الكراميل.", en: "Foam the milk and pour it over the caramel.", seconds: 45 },
      { ar: "اسحب الشوت فوق الحليب ببطء — لا تحرّك.", en: "Pull the shot slowly over the milk. Don't stir.", seconds: 30 },
      { ar: "زخرف كراميل فوق الرغوة.", en: "Drizzle caramel over the foam." }
    ],
    why: {
      ar: "الإسبريسو أكثف من رغوة الحليب وأخف من الحليب السائل، فبيستقر بالنص ويعمل طبقة بنية واضحة.",
      en: "Espresso is denser than milk foam and lighter than liquid milk, so it settles in between and forms a visible brown band."
    },
    fixes: [
      { problem: { ar: "ما في طبقات", en: "No layers" }, cause: { ar: "صببت الشوت بسرعة", en: "Poured the shot too fast" }, fix: { ar: "صبّه على ظهر ملعقة", en: "Pour it over the back of a spoon" } }
    ]
  },

  {
    id: "cafe-bombon",
    equipment: "capsule",
    style: ["hot", "milk", "dessert"],
    minutes: 3,
    baseYield: 60,
    // caffeine: 1 shot x 65 mg
    caffeine: 65,
    // calories: condensed milk 20 ml x 3.21 (64.2) + shot 2 = 66.2
    calories: 66,
    name: { ar: "كافيه بومبون", en: "Café Bombón" },
    blurb: {
      ar: "إسباني — طبقتين واضحتين من الحليب المكثف والإسبريسو.",
      en: "Spanish — two clean layers of condensed milk and espresso."
    },
    ingredients: [
      { ar: "حليب مكثف محلّى", en: "Sweetened condensed milk", amount: 20, unit: "ml" },
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 }
    ],
    steps: [
      { ar: "حط الحليب المكثف بقاع كوب زجاج صغير شفاف.", en: "Put the condensed milk in a small clear glass." },
      { ar: "اسحب الشوت وصبّه ببطء على ظهر ملعقة.", en: "Pull the shot and pour it slowly over the back of a spoon.", seconds: 30 },
      { ar: "قدّمه بدون تحريك — حرّك قبل الشرب.", en: "Serve unstirred — stir just before drinking." }
    ],
    why: {
      ar: "الحليب المكثف كثافته أعلى بكثير من القهوة بسبب السكر المذاب، فبيضل بالقاع بدون ما يختلط.",
      en: "Condensed milk is far denser than coffee because of the dissolved sugar, so it stays at the bottom without mixing."
    },
    fixes: [
      { problem: { ar: "اختلطوا فوراً", en: "Mixed immediately" }, cause: { ar: "صببت من ارتفاع عالي", en: "Poured from too high" }, fix: { ar: "قرّب الملعقة من سطح الحليب", en: "Hold the spoon close to the milk surface" } }
    ]
  },

  {
    id: "cafe-miel",
    equipment: "capsule",
    style: ["hot", "milk"],
    minutes: 5,
    baseYield: 240,
    // caffeine: 1 shot x 65 mg
    caffeine: 65,
    // calories: honey 1 tbsp (64) + cinnamon 0 + shot 2 + milk 170 ml x 0.64 (108.8) = 174.8
    calories: 175,
    name: { ar: "كافيه مييل", en: "Café Miel" },
    blurb: {
      ar: "لاتيه بعسل وقرفة بدل السكر — حلاوة أعمق وأقل حدة.",
      en: "A latte sweetened with honey and cinnamon instead of sugar — deeper, less sharp."
    },
    ingredients: [
      { ar: "عسل", en: "Honey", amount: 1, unit: "tbsp" },
      { ar: "قرفة مطحونة", en: "Ground cinnamon", amount: 0.5, unit: "tsp", fixed: true },
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 },
      { ar: "حليب مبخّر", en: "Steamed milk", amount: 170, unit: "ml" }
    ],
    steps: [
      { ar: "حرّك العسل والقرفة مع الشوت الساخن حتى يذوبوا.", en: "Stir the honey and cinnamon into the hot shot until dissolved." },
      { ar: "ارغي الحليب وصبّه.", en: "Foam the milk and pour it in.", seconds: 45 },
      { ar: "رشّ قرفة فوق.", en: "Dust with cinnamon." }
    ],
    why: {
      ar: "العسل بيذوب بالسائل الساخن بس — لو حطيته بالحليب الدافي بيضل بالقاع. والقرفة زيوتها العطرية بتتحرر بالحرارة.",
      en: "Honey only dissolves in hot liquid — added to warm milk it just sinks. Cinnamon's aromatic oils are released by the heat."
    },
    fixes: [
      { problem: { ar: "العسل بالقاع", en: "Honey pooled at the bottom" }, cause: { ar: "أضفته للحليب مش للشوت", en: "Added to milk, not to the shot" }, fix: { ar: "حرّكه بالشوت الساخن أولاً", en: "Stir it into the hot shot first" } }
    ]
  },

  /* ───────────────────────── CAPSULE — ICED ───────────────────────── */

  {
    id: "iced-spanish-latte",
    equipment: "capsule",
    style: ["iced", "milk"],
    minutes: 4,
    baseYield: 300,
    // caffeine: 2 shots x 65 mg; ice 0
    caffeine: 130,
    // calories: condensed milk 40 ml x 3.21 (128.4) + milk 120 ml x 0.64 (76.8) + ice 0 + 2 shots x 2 (4) = 209.2
    calories: 209,
    name: { ar: "آيس سبانيش لاتيه", en: "Iced Spanish Latte" },
    blurb: {
      ar: "حليب مكثف بدل السكر — قوام كريمي ثقيل ما بيعطيه السكر العادي.",
      en: "Condensed milk instead of sugar — a heavy creamy body plain sugar can't give."
    },
    ingredients: [
      { ar: "حليب مكثف محلّى", en: "Sweetened condensed milk", amount: 40, unit: "ml" },
      { ar: "حليب بارد كامل الدسم", en: "Cold whole milk", amount: 120, unit: "ml" },
      { ar: "ثلج", en: "Ice", amount: 6, unit: "pc" },
      { ar: "شوت إسبريسو شدّة ١٠+", en: "Espresso shot, intensity 10+", amount: 2, unit: "shot", mg: 65 }
    ],
    steps: [
      { ar: "حط الحليب المكثف بقاع الكوب.", en: "Put the condensed milk in the bottom of the glass." },
      { ar: "أضف الحليب البارد وحرّك منيح حتى يذوب المكثف تماماً.", en: "Add the cold milk and stir well until the condensed milk fully dissolves.", seconds: 40 },
      { ar: "املا الكوب ثلج للأعلى.", en: "Fill the glass to the top with ice." },
      { ar: "اسحب شوتين وصبّهم فوق الثلج ببطء.", en: "Pull two shots and pour them slowly over the ice.", seconds: 40 },
      { ar: "اتركه ثانيتين لتشوف الطبقات، ثم حرّك.", en: "Leave it a moment to see the layers, then stir." }
    ],
    why: {
      ar: "الحليب المكثف مش بس حلاوة — دهونه وبروتينه بيعطوا قوام لزج وثقيل. وعشان هيك بدك شوت شدّة عالية، وإلا القهوة بتختفي تحت الحلاوة.",
      en: "Condensed milk isn't just sweetness — its fat and protein give a thick, clinging body. That's exactly why you need a high-intensity shot, or the coffee vanishes under the sugar."
    },
    fixes: [
      { problem: { ar: "حلو بدون طعم قهوة", en: "Sweet with no coffee flavour" }, cause: { ar: "شوت ضعيف", en: "Weak shot" }, fix: { ar: "شدّة ١٠+ وشوتين مش واحد", en: "Intensity 10+, and two shots not one" } },
      { problem: { ar: "المكثف تكتّل بالقاع", en: "Condensed milk clumped at the bottom" }, cause: { ar: "ما حرّكته قبل الثلج", en: "Didn't stir before adding ice" }, fix: { ar: "ذوّبه بالحليب البارد أولاً", en: "Dissolve it into the cold milk first" } },
      { problem: { ar: "مائي", en: "Watery" }, cause: { ar: "الثلج ذاب", en: "Ice melted" }, fix: { ar: "املا الكوب ثلج كامل — ثلج أكثر بيذوب أقل", en: "Fill the glass with ice — more ice melts less" } }
    ]
  },

  {
    id: "iced-latte",
    equipment: "capsule",
    style: ["iced", "milk"],
    minutes: 3,
    baseYield: 280,
    // caffeine: 1 shot x 65 mg; ice and milk 0
    caffeine: 65,
    // calories: shot 2 + ice 0 + milk 150 ml x 0.64 (96) = 98
    calories: 98,
    name: { ar: "آيس لاتيه", en: "Iced Latte" },
    blurb: {
      ar: "أبسط مشروب بارد — والسر بتبريد الشوت قبل ما يخفف الثلج.",
      en: "The simplest cold drink — the trick is chilling the shot before ice dilutes it."
    },
    ingredients: [
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 },
      { ar: "ثلج", en: "Ice", amount: 6, unit: "pc" },
      { ar: "حليب بارد", en: "Cold milk", amount: 150, unit: "ml" }
    ],
    steps: [
      { ar: "اسحب الشوت على ٣ مكعبات ثلج بكوب صغير — بيبرد فوراً.", en: "Pull the shot onto 3 ice cubes in a small vessel — it chills instantly.", seconds: 30 },
      { ar: "املا الكوب النهائي ثلج وحليب بارد.", en: "Fill the serving glass with ice and cold milk." },
      { ar: "صبّ الشوت المبرّد فوق.", en: "Pour the chilled shot over the top." }
    ],
    why: {
      ar: "الشوت الساخن لما ينزل على ثلج قليل بيذوّبه ويصير ماء. التبريد بالصدمة على ثلج منفصل بيحفظ التركيز.",
      en: "A hot shot poured onto a little ice just melts it into water. Shock-chilling on separate ice keeps the concentration intact."
    },
    fixes: [
      { problem: { ar: "خفيف ومائي", en: "Thin and watery" }, cause: { ar: "الشوت ذوّب الثلج", en: "The shot melted the ice" }, fix: { ar: "برّد الشوت بوعاء منفصل أولاً", en: "Chill the shot in a separate vessel first" } }
    ]
  },

  {
    id: "iced-americano",
    equipment: "capsule",
    style: ["iced"],
    minutes: 3,
    baseYield: 280,
    // caffeine: 2 shots x 65 mg; water and ice 0
    caffeine: 130,
    // calories: 2 shots x 2 = 4
    calories: 4,
    name: { ar: "آيس أمريكانو", en: "Iced Americano" },
    blurb: {
      ar: "منعش وصافي — بتشوف فيه طعم الكبسولة بدون تغطية.",
      en: "Clean and refreshing — you taste the capsule with nothing covering it."
    },
    ingredients: [
      { ar: "ماء بارد", en: "Cold water", amount: 150, unit: "ml" },
      { ar: "ثلج", en: "Ice", amount: 6, unit: "pc" },
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 2, unit: "shot", mg: 65 }
    ],
    steps: [
      { ar: "املا الكوب ثلج وماء بارد.", en: "Fill the glass with ice and cold water." },
      { ar: "اسحب شوتين وصبّهم فوق ببطء.", en: "Pull two shots and pour them slowly on top.", seconds: 40 },
      { ar: "اتركه كطبقات أو حرّك — على ذوقك.", en: "Leave it layered or stir — your call." }
    ],
    why: {
      ar: "البرودة بتخفّف إدراك المرارة وبتبرز الحموضة، فالآيس أمريكانو بيطلع أحمض وأنظف من الساخن بنفس الكبسولة.",
      en: "Cold suppresses perceived bitterness and lifts acidity, so an iced americano reads brighter and cleaner than the same capsule served hot."
    },
    fixes: [
      { problem: { ar: "باهت", en: "Flat" }, cause: { ar: "ماء كثير", en: "Too much water" }, fix: { ar: "نزّل الماء لـ ١٢٠ مل", en: "Drop the water to 120 ml" } }
    ]
  },

  {
    id: "iced-mocha",
    equipment: "capsule",
    style: ["iced", "milk", "dessert"],
    minutes: 4,
    baseYield: 300,
    // caffeine: 1 shot x 65 mg
    caffeine: 65,
    // calories: chocolate sauce 25 ml x 1 (25) + milk 140 ml x 0.64 (89.6) + ice 0 + shot 2 = 116.6
    calories: 117,
    name: { ar: "آيس موكا", en: "Iced Mocha" },
    blurb: {
      ar: "شوكولاتة وحليب بارد وثلج — والصوص أسهل من الكاكاو هون.",
      en: "Chocolate, cold milk and ice — sauce works better than cocoa powder here."
    },
    ingredients: [
      { ar: "صوص شوكولاتة", en: "Chocolate sauce", amount: 25, unit: "ml" },
      { ar: "حليب بارد", en: "Cold milk", amount: 140, unit: "ml" },
      { ar: "ثلج", en: "Ice", amount: 6, unit: "pc" },
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 }
    ],
    steps: [
      { ar: "حرّك الصوص مع الحليب البارد حتى يذوب تماماً.", en: "Stir the sauce into the cold milk until fully dissolved.", seconds: 30 },
      { ar: "أضف الثلج.", en: "Add the ice." },
      { ar: "اسحب الشوت وصبّه فوق.", en: "Pull the shot and pour it over.", seconds: 30 }
    ],
    why: {
      ar: "بودرة الكاكاو ما بتذوب بالبارد أبداً وبتضل محببة. الصوص أصلاً مذاب بشراب سكري، فبينحل بالحليب البارد بسهولة.",
      en: "Cocoa powder never dissolves cold and stays gritty. Sauce is already dissolved in sugar syrup, so it blends into cold milk easily."
    },
    fixes: [
      { problem: { ar: "محبب بالقاع", en: "Gritty at the bottom" }, cause: { ar: "استعملت بودرة كاكاو", en: "Used cocoa powder" }, fix: { ar: "استعمل صوص، أو ذوّب البودرة بماء ساخن أولاً", en: "Use sauce, or dissolve the powder in hot water first" } }
    ]
  },

  {
    id: "iced-caramel-macchiato",
    equipment: "capsule",
    style: ["iced", "milk", "dessert"],
    minutes: 4,
    baseYield: 300,
    // caffeine: 1 shot x 65 mg
    caffeine: 65,
    // calories: caramel 20 ml x 1 (20) + milk 150 ml x 0.64 (96) + ice 0 + shot 2 + drizzle 1 tsp = 5 ml x 1 (5) = 123
    calories: 123,
    name: { ar: "آيس كراميل ماكياتو", en: "Iced Caramel Macchiato" },
    blurb: {
      ar: "نفس فكرة الساخن — الشوت آخر شي، والطبقات بتبين أوضح بالبارد.",
      en: "Same idea as the hot one — shot last, and the layers show more clearly cold."
    },
    ingredients: [
      { ar: "صوص كراميل", en: "Caramel sauce", amount: 20, unit: "ml" },
      { ar: "حليب بارد", en: "Cold milk", amount: 150, unit: "ml" },
      { ar: "ثلج", en: "Ice", amount: 6, unit: "pc" },
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 },
      { ar: "كراميل للزخرفة", en: "Caramel to drizzle", amount: 1, unit: "tsp", fixed: true }
    ],
    steps: [
      { ar: "حط الكراميل بقاع الكوب.", en: "Put the caramel in the bottom of the glass." },
      { ar: "أضف الحليب البارد ثم الثلج.", en: "Add the cold milk, then the ice." },
      { ar: "اسحب الشوت وصبّه فوق الثلج ببطء.", en: "Pull the shot and pour it slowly over the ice.", seconds: 30 },
      { ar: "زخرف كراميل فوق.", en: "Drizzle caramel on top." }
    ],
    why: {
      ar: "الثلج بيبطّئ اختلاط الشوت بالحليب، فالطبقة البنية بتضل واضحة أطول من النسخة الساخنة.",
      en: "The ice slows the shot from mixing into the milk, so the brown band holds longer than in the hot version."
    },
    fixes: [
      { problem: { ar: "الكراميل ما بيذوب", en: "Caramel won't dissolve" }, cause: { ar: "بارد وثقيل", en: "It's cold and thick" }, fix: { ar: "دفّيه ٥ ثواني بالمايكرويف قبل الاستعمال", en: "Warm it 5 seconds in the microwave first" } }
    ]
  },

  {
    id: "espresso-tonic",
    equipment: "capsule",
    style: ["iced"],
    minutes: 3,
    baseYield: 250,
    // caffeine: 1 shot x 65 mg; tonic and citrus 0
    caffeine: 65,
    // calories: tonic 150 ml x 0.34 (51) + shot 2 + citrus 0 = 53
    calories: 53,
    name: { ar: "إسبريسو تونيك", en: "Espresso Tonic" },
    blurb: {
      ar: "قهوة بماء التونيك — نكهة حمضيات فوارة غير متوقعة.",
      en: "Coffee over tonic water — an unexpected, fizzy citrus result."
    },
    ingredients: [
      { ar: "ثلج", en: "Ice", amount: 8, unit: "pc" },
      { ar: "ماء تونيك", en: "Tonic water", amount: 150, unit: "ml" },
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 },
      { ar: "شريحة ليمون أو برتقال", en: "Slice of lemon or orange", amount: 1, unit: "pc", fixed: true }
    ],
    steps: [
      { ar: "املا كوب طويل ثلج للأعلى.", en: "Fill a tall glass to the top with ice." },
      { ar: "صبّ التونيك فوق الثلج — لا ترجّه.", en: "Pour the tonic over the ice. Don't shake it." },
      { ar: "استنى ١٠ ثواني تهدى الفقاعات.", en: "Wait 10 seconds for the bubbles to settle.", seconds: 10 },
      { ar: "اسحب الشوت وصبّه ببطء على ظهر ملعقة.", en: "Pull the shot and pour it slowly over the back of a spoon.", seconds: 30 },
      { ar: "زيّنه بشريحة الحمضيات ولا تحرّك.", en: "Garnish with the citrus and don't stir." }
    ],
    why: {
      ar: "الكينين بالتونيك مرّ-حمضي، وبيتفاعل مع أحماض القهوة (الستريك والماليك) فتطلع نكهة حمضيات واضحة ما كانت ظاهرة بالشوت لحاله.",
      en: "The quinine in tonic is bitter-acidic and plays off the coffee's own citric and malic acids, pushing forward a citrus note that wasn't obvious in the shot alone."
    },
    fixes: [
      { problem: { ar: "فار وطفح", en: "Foamed over" }, cause: { ar: "صببت الشوت بسرعة", en: "Poured the shot too fast" }, fix: { ar: "صبّه على ظهر ملعقة ببطء", en: "Pour it slowly over a spoon" } },
      { problem: { ar: "مرّ جداً", en: "Too bitter" }, cause: { ar: "كبسولة شدّة عالية مع تونيك مرّ", en: "High-intensity capsule with a dry tonic" }, fix: { ar: "جرّب كبسولة أفتح أو تونيك بنكهة حمضيات", en: "Try a lighter capsule or a citrus tonic" } }
    ]
  },

  {
    id: "shakerato",
    equipment: "capsule",
    style: ["iced"],
    minutes: 3,
    baseYield: 120,
    // caffeine: 1 shot x 65 mg
    caffeine: 65,
    // calories: shot 2 + sugar 1 tsp (16) + ice 0 = 18
    calories: 18,
    name: { ar: "شيكراتو", en: "Shakerato" },
    blurb: {
      ar: "إيطالي — إسبريسو مرجوج بالثلج، بيطلع برغوة كثيفة بدون حليب.",
      en: "Italian — espresso shaken with ice, producing a thick foam with no milk at all."
    },
    ingredients: [
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 },
      { ar: "سكر أو شراب سكري", en: "Sugar or simple syrup", amount: 1, unit: "tsp" },
      { ar: "ثلج", en: "Ice", amount: 5, unit: "pc" }
    ],
    steps: [
      { ar: "اسحب الشوت وحرّك السكر فيه وهو ساخن.", en: "Pull the shot and stir the sugar in while it's hot.", seconds: 30 },
      { ar: "حطّه بالشيكر مع الثلج.", en: "Add it to a shaker with the ice." },
      { ar: "رجّ بقوة ٢٠ ثانية حتى يبرد الشيكر من برّا.", en: "Shake hard for 20 seconds until the shaker frosts.", seconds: 20 },
      { ar: "صفّيه بكوب مارتيني أو كوب صغير.", en: "Strain into a martini or small glass." }
    ],
    why: {
      ar: "الرجّ بيدخل هواء على زيوت القهوة والسكر المذاب، فبتتكوّن رغوة ثابتة — نفس مبدأ رغوة الكوكتيلات بدون بياض بيض.",
      en: "Shaking forces air into the coffee's oils and dissolved sugar, building a stable foam — the same principle as a cocktail foam, without egg white."
    },
    fixes: [
      { problem: { ar: "ما طلعت رغوة", en: "No foam formed" }, cause: { ar: "رجّيت قليل، أو بدون سكر", en: "Under-shaken, or no sugar" }, fix: { ar: "السكر ضروري للرغوة — ورجّ ٢٠ ثانية كاملة", en: "Sugar is required for the foam — and shake a full 20 seconds" } }
    ]
  },

  {
    id: "iced-shaken-espresso",
    equipment: "capsule",
    style: ["iced", "milk"],
    minutes: 4,
    baseYield: 300,
    // caffeine: 2 shots x 65 mg
    caffeine: 130,
    // calories: 2 shots x 2 (4) + vanilla syrup 15 ml x 1 (15) + ice 0 + milk 60 ml x 0.64 (38.4) = 57.4
    calories: 57,
    name: { ar: "آيس شيكن إسبريسو", en: "Iced Shaken Espresso" },
    blurb: {
      ar: "شيكراتو بالفانيلا مع رشّة حليب فوق — نسخة المقاهي.",
      en: "A vanilla shakerato with a splash of milk on top — the coffee-shop version."
    },
    ingredients: [
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 2, unit: "shot", mg: 65 },
      { ar: "شراب فانيلا", en: "Vanilla syrup", amount: 15, unit: "ml" },
      { ar: "ثلج", en: "Ice", amount: 8, unit: "pc" },
      { ar: "حليب بارد", en: "Cold milk", amount: 60, unit: "ml" }
    ],
    steps: [
      { ar: "حط الشوتين والفانيلا والثلج بالشيكر.", en: "Put the shots, vanilla and ice in a shaker." },
      { ar: "رجّ بقوة ١٥ ثانية.", en: "Shake hard for 15 seconds.", seconds: 15 },
      { ar: "صبّ الكل (مع الثلج) بالكوب.", en: "Pour everything, ice included, into the glass." },
      { ar: "أضف الحليب البارد فوق بدون تحريك.", en: "Float the cold milk on top without stirring." }
    ],
    why: {
      ar: "الرجّ بيبرّد ويرغي بنفس الوقت، والحليب القليل بيلطّف بدون ما يحوّله للاتيه — القهوة بتضل هي الطعم الأساسي.",
      en: "Shaking chills and aerates at once, and the small amount of milk softens it without turning it into a latte — coffee stays the main flavour."
    },
    fixes: [
      { problem: { ar: "الرغوة راحت بسرعة", en: "Foam vanished fast" }, cause: { ar: "صببت بعد ما هدأ", en: "Poured after it settled" }, fix: { ar: "صبّ فوراً بعد الرجّ", en: "Pour immediately after shaking" } }
    ]
  },

  {
    id: "affogato",
    equipment: "capsule",
    style: ["dessert", "iced"],
    minutes: 2,
    baseYield: 120,
    // caffeine: 1 shot x 65 mg
    caffeine: 65,
    // calories: ice cream 1 scoop (140) + shot 2 = 142
    calories: 142,
    name: { ar: "أفوجاتو", en: "Affogato" },
    blurb: {
      ar: "آيس كريم فانيلا مغرّق بشوت ساخن — أسهل ديزرت بالعالم.",
      en: "Vanilla ice cream drowned in a hot shot — the easiest dessert there is."
    },
    ingredients: [
      { ar: "آيس كريم فانيلا", en: "Vanilla ice cream", amount: 1, unit: "scoop" },
      { ar: "شوت إسبريسو ساخن", en: "Hot espresso shot", amount: 1, unit: "shot", mg: 65 }
    ],
    steps: [
      { ar: "حط كرة آيس كريم بكوب زجاج صغير.", en: "Put a scoop of ice cream in a small glass." },
      { ar: "اسحب الشوت وصبّه فوقها فوراً.", en: "Pull the shot and pour it straight over.", seconds: 30 },
      { ar: "كله بملعقة قبل ما يذوب تماماً.", en: "Eat it with a spoon before it fully melts." }
    ],
    why: {
      ar: "التباين الحراري بيخلي دهون الآيس كريم تذوب على اللسان مع مرارة القهوة بنفس اللحظة — هاد التناقض هو كل الفكرة.",
      en: "The temperature contrast melts the ice cream's fat on the tongue at the same moment the coffee's bitterness hits — that contrast is the whole point."
    },
    fixes: [
      { problem: { ar: "صار حساء", en: "Turned to soup" }, cause: { ar: "استنيت كثير", en: "Waited too long" }, fix: { ar: "برّد الكوب وكله فوراً", en: "Chill the glass and eat it straight away" } }
    ]
  },

  {
    id: "coffee-frappe",
    equipment: "capsule",
    style: ["iced", "milk", "dessert"],
    minutes: 4,
    baseYield: 350,
    // caffeine: 2 shots x 65 mg
    caffeine: 130,
    // calories: 2 shots x 2 (4) + milk 150 ml x 0.64 (96) + sugar 1 tbsp = 3 tsp x 16 (48) + ice 0 = 148
    calories: 148,
    name: { ar: "فرابيه قهوة", en: "Coffee Frappé" },
    blurb: {
      ar: "مخفوق بالخلاط — قوام ثلجي كريمي بدون آيس كريم.",
      en: "Blended — an icy, creamy texture with no ice cream involved."
    },
    ingredients: [
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 2, unit: "shot", mg: 65 },
      { ar: "حليب بارد", en: "Cold milk", amount: 150, unit: "ml" },
      { ar: "سكر أو شراب", en: "Sugar or syrup", amount: 1, unit: "tbsp" },
      { ar: "ثلج", en: "Ice", amount: 10, unit: "pc" }
    ],
    steps: [
      { ar: "برّد الشوتين على ثلج منفصل.", en: "Chill the shots on separate ice." },
      { ar: "حط كل المكونات بالخلاط.", en: "Put everything in the blender." },
      { ar: "اخلط ٣٠ ثانية حتى ينعم.", en: "Blend for 30 seconds until smooth.", seconds: 30 },
      { ar: "صبّه بكوب طويل بارد.", en: "Pour into a tall chilled glass." }
    ],
    why: {
      ar: "الخلط بيكسر بلورات الثلج لحبيبات دقيقة، والسكر بيمنعها من الالتصاق ببعض — عشان هيك بيطلع ناعم مش مجرّش.",
      en: "Blending shatters the ice into fine crystals, and the sugar keeps them from re-fusing — which is why it comes out smooth rather than chunky."
    },
    fixes: [
      { problem: { ar: "انفصل لطبقتين", en: "Separated into layers" }, cause: { ar: "وقف عنه", en: "Left to stand" }, fix: { ar: "اشربه فوراً، أو أضف نص ملعقة حليب بودرة لتثبيته", en: "Drink it straight away, or add half a teaspoon of milk powder to stabilise" } }
    ]
  },

  /* ───────────────────── CAPSULE — REGIONAL ───────────────────── */

  {
    id: "cardamom-latte",
    equipment: "capsule",
    style: ["hot", "milk"],
    minutes: 6,
    baseYield: 240,
    // caffeine: 1 shot x 65 mg; cardamom 0
    caffeine: 65,
    // calories: cardamom 0 + milk 180 ml x 0.64 (115.2) + shot 2 = 117.2
    calories: 117,
    name: { ar: "لاتيه بالهيل", en: "Cardamom Latte" },
    blurb: {
      ar: "مزيج عربي-إيطالي — الهيل بينقّع بالحليب مش بينرش فوق.",
      en: "An Arab-Italian crossover — the cardamom infuses the milk, it isn't dusted on top."
    },
    ingredients: [
      { ar: "حبة هيل أخضر مهروسة", en: "Green cardamom pod, crushed", amount: 1, unit: "pc", fixed: true },
      { ar: "حليب", en: "Milk", amount: 180, unit: "ml" },
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 }
    ],
    steps: [
      { ar: "اهرس حبة الهيل وحطها بالحليب البارد.", en: "Crush the pod and drop it into the cold milk." },
      { ar: "سخّن الحليب على نار هادئة لـ ٦٥° واتركه ينقع ٣ دقائق.", en: "Heat the milk gently to 65°C and let it infuse for 3 minutes.", seconds: 180 },
      { ar: "صفّي الحليب من الهيل.", en: "Strain the cardamom out of the milk." },
      { ar: "ارغي الحليب المصفّى واسحب الشوت، ثم اجمعهم.", en: "Foam the strained milk, pull the shot, and combine.", seconds: 45 }
    ],
    why: {
      ar: "زيوت الهيل العطرية بتذوب بالدهون مش بالماء، عشان هيك الحليب كامل الدسم هو الوسط الصح للنقع. والهيل المطحون الجاهز بيكون فقد أغلب زيوته.",
      en: "Cardamom's aromatic oils are fat-soluble, not water-soluble, which makes whole milk the right medium. Pre-ground cardamom has already lost most of those oils."
    },
    fixes: [
      { problem: { ar: "الطعم باهت", en: "Flavour is faint" }, cause: { ar: "هيل مطحون جاهز", en: "Pre-ground cardamom" }, fix: { ar: "اهرس حبة كاملة لحظة الاستعمال", en: "Crush a whole pod just before using" } },
      { problem: { ar: "الحليب مطبوخ", en: "Milk tastes cooked" }, cause: { ar: "غليته للنقع", en: "Boiled it to infuse" }, fix: { ar: "٦٥° ووقت أطول، مش حرارة أعلى", en: "65°C and more time, not more heat" } }
    ]
  },

  {
    id: "rose-latte",
    equipment: "capsule",
    style: ["hot", "milk"],
    minutes: 5,
    baseYield: 240,
    // caffeine: 1 shot x 65 mg; rose water and syrup 0 mg
    caffeine: 65,
    // calories: rose water 0 + rose syrup 10 ml x 1 (10) + shot 2 + milk 170 ml x 0.64 (108.8) + petals 0 = 120.8
    calories: 121,
    name: { ar: "لاتيه بالورد", en: "Rose Latte" },
    blurb: {
      ar: "ماء ورد وقطرات شراب — عطري وخفيف، شائع بمقاهي الخليج.",
      en: "Rose water with a little syrup — floral and light, a Gulf café staple."
    },
    ingredients: [
      { ar: "ماء ورد", en: "Rose water", amount: 5, unit: "ml" },
      { ar: "شراب ورد أو سكر", en: "Rose syrup or sugar", amount: 10, unit: "ml" },
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 },
      { ar: "حليب مبخّر", en: "Steamed milk", amount: 170, unit: "ml" },
      { ar: "بتلات ورد مجففة", en: "Dried rose petals", amount: 1, unit: "pc", fixed: true }
    ],
    steps: [
      { ar: "حرّك ماء الورد والشراب مع الشوت.", en: "Stir the rose water and syrup into the shot." },
      { ar: "ارغي الحليب وصبّه.", en: "Foam the milk and pour it in.", seconds: 45 },
      { ar: "زيّن ببتلات ورد.", en: "Garnish with rose petals." }
    ],
    why: {
      ar: "ماء الورد مركّز جداً — ٥ مل هي الحد. أكثر من هيك وبيصير طعمه صابوني بدل عطري.",
      en: "Rose water is very concentrated — 5 ml is the ceiling. Past that it reads soapy rather than floral."
    },
    fixes: [
      { problem: { ar: "طعم صابون", en: "Soapy taste" }, cause: { ar: "ماء ورد كثير", en: "Too much rose water" }, fix: { ar: "٥ مل بالضبط، ولا تزيد", en: "Exactly 5 ml, no more" } }
    ]
  },

  {
    id: "saffron-latte",
    equipment: "capsule",
    style: ["hot", "milk"],
    minutes: 15,
    baseYield: 240,
    // caffeine: 1 shot x 65 mg; saffron 0
    caffeine: 65,
    // calories: saffron 0 + milk 20 ml x 0.64 (12.8) + honey 1 tsp = 64/3 (21.3) + shot 2 + milk 160 ml x 0.64 (102.4) = 138.5
    calories: 139,
    name: { ar: "لاتيه بالزعفران", en: "Saffron Latte" },
    blurb: {
      ar: "الزعفران بده نقع — ١٠ دقائق بتفرق عن الرشّ المباشر.",
      en: "Saffron needs to steep — 10 minutes makes all the difference over sprinkling it in."
    },
    ingredients: [
      { ar: "خيوط زعفران", en: "Saffron threads", amount: 3, unit: "pc", fixed: true },
      { ar: "حليب دافي للنقع", en: "Warm milk to steep", amount: 20, unit: "ml" },
      { ar: "عسل", en: "Honey", amount: 1, unit: "tsp" },
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 },
      { ar: "حليب مبخّر", en: "Steamed milk", amount: 160, unit: "ml" }
    ],
    steps: [
      { ar: "انقع خيوط الزعفران بملعقة حليب دافي ١٠ دقائق.", en: "Steep the saffron threads in a spoon of warm milk for 10 minutes.", seconds: 600 },
      { ar: "حرّك العسل مع الشوت الساخن.", en: "Stir the honey into the hot shot." },
      { ar: "أضف الحليب المنقوع بالزعفران (باللون والخيوط).", en: "Add the saffron-steeped milk, threads and all." },
      { ar: "ارغي باقي الحليب وكمّل.", en: "Foam the remaining milk and top up.", seconds: 45 }
    ],
    why: {
      ar: "الكروسين (مادة اللون والطعم بالزعفران) بده وقت ليذوب. بدون نقع بتاخد لون خفيف وطعم شبه معدوم رغم الكلفة.",
      en: "Crocin — the compound carrying saffron's colour and flavour — needs time to dissolve. Without steeping you get faint colour and almost no flavour, despite the cost."
    },
    fixes: [
      { problem: { ar: "ما في طعم زعفران", en: "No saffron flavour" }, cause: { ar: "ما نقعته", en: "Didn't steep it" }, fix: { ar: "١٠ دقائق نقع بحليب دافي مش ساخن", en: "10 minutes in warm, not hot, milk" } }
    ]
  },

  {
    id: "pistachio-latte",
    equipment: "capsule",
    style: ["hot", "milk", "dessert"],
    minutes: 5,
    baseYield: 240,
    // caffeine: 1 shot x 65 mg; pistachio 0
    caffeine: 65,
    // calories: pistachio paste 15 g x 6 (90) + milk 170 ml x 0.64 (108.8) + shot 2 + crushed pistachio 1 tsp ~ 3 g x 6 (18) = 218.8
    calories: 219,
    name: { ar: "لاتيه بالفستق", en: "Pistachio Latte" },
    blurb: {
      ar: "معجون فستق مذوّب بالحليب — غني وكريمي.",
      en: "Pistachio paste melted into the milk — rich and creamy."
    },
    ingredients: [
      { ar: "معجون فستق", en: "Pistachio paste", amount: 15, unit: "g" },
      { ar: "حليب", en: "Milk", amount: 170, unit: "ml" },
      { ar: "شوت إسبريسو", en: "Espresso shot", amount: 1, unit: "shot", mg: 65 },
      { ar: "فستق مجروش", en: "Crushed pistachio", amount: 1, unit: "tsp", fixed: true }
    ],
    steps: [
      { ar: "ذوّب المعجون بـ ٣٠ مل حليب ساخن وحرّك حتى ينعم.", en: "Melt the paste into 30 ml of hot milk and stir until smooth.", seconds: 45 },
      { ar: "أضف الشوت.", en: "Add the shot." },
      { ar: "ارغي باقي الحليب وكمّل، ورشّ فستق مجروش فوق.", en: "Foam the rest of the milk, top up, and scatter crushed pistachio.", seconds: 45 }
    ],
    why: {
      ar: "معجون الفستق دهني وثقيل، وما بينحل بالسائل الساخن مباشرة. الحليب الساخن بيخفف لزوجته تدريجياً فينتشر بدل ما يتكتّل.",
      en: "Pistachio paste is fatty and thick and won't disperse straight into hot liquid. Hot milk loosens it gradually so it spreads rather than clumping."
    },
    fixes: [
      { problem: { ar: "المعجون بالقاع", en: "Paste sank to the bottom" }, cause: { ar: "ما ذوّبته منيح", en: "Not fully emulsified" }, fix: { ar: "حرّكه بالحليب الساخن حتى يختفي تماماً", en: "Stir into hot milk until it disappears completely" } }
    ]
  },

  /* ───────────────────────── FILTER ───────────────────────── */

  {
    id: "pour-over",
    equipment: "filter",
    style: ["hot"],
    minutes: 5,
    baseYield: 240,
    // caffeine: 15 g grounds = 130 mg (filter reference)
    caffeine: 130,
    // calories: filter coffee 240 ml x 0.02 = 4.8
    calories: 5,
    name: { ar: "بور أوفر ١:١٦", en: "Pour-over 1:16" },
    blurb: {
      ar: "النسبة القياسية — ١ غرام بن لكل ١٦ غرام ماء.",
      en: "The standard ratio — 1 g of coffee to every 16 g of water."
    },
    ingredients: [
      { ar: "بن مطحون متوسط", en: "Medium-ground coffee", amount: 15, unit: "g" },
      { ar: "ماء ٩٠–٩٣°", en: "Water at 90–93°C", amount: 240, unit: "ml" }
    ],
    steps: [
      { ar: "بلّل الفلتر الورقي بماء ساخن وكبّ الماء — بيشيل طعم الورق ويسخّن الأدوات.", en: "Rinse the paper filter with hot water and discard it — this removes paper taste and warms the gear." },
      { ar: "حط البن وسوّي سطحه.", en: "Add the coffee and level the bed." },
      { ar: "صبّ ٤٥ مل ماء واتركه ينتفخ ٣٠ ثانية (Bloom).", en: "Pour 45 ml and let it bloom for 30 seconds.", seconds: 30 },
      { ar: "صبّ الباقي بدوائر بطيئة من النص للأطراف.", en: "Pour the rest in slow circles from the centre outwards.", seconds: 120 },
      { ar: "المجموع لازم يخلص خلال ٢:٣٠–٣:٣٠ دقيقة.", en: "The whole brew should finish between 2:30 and 3:30." }
    ],
    why: {
      ar: "الـ Bloom بيطلّع الـ CO₂ المحبوس بالبن الطازج. لو ما طلّعته، الغاز بيصدّ الماء عن جزء من البن وبيطلع الاستخلاص غير متساوٍ.",
      en: "The bloom drives off CO₂ trapped in fresh coffee. Skip it and the gas pushes water away from parts of the bed, giving an uneven extraction."
    },
    fixes: [
      { problem: { ar: "حامض وفاضي", en: "Sour and thin" }, cause: { ar: "تحت الاستخلاص", en: "Under-extracted" }, fix: { ar: "طحنة أنعم، أو صبّ أبطأ", en: "Grind finer, or pour more slowly" } },
      { problem: { ar: "مرّ وجاف باللسان", en: "Bitter and drying" }, cause: { ar: "فوق الاستخلاص", en: "Over-extracted" }, fix: { ar: "طحنة أخشن، أو ماء أبرد بدرجتين", en: "Grind coarser, or drop the water 2°C" } },
      { problem: { ar: "نزل بسرعة", en: "Drained too fast" }, cause: { ar: "طحنة خشنة", en: "Grind too coarse" }, fix: { ar: "انعّم الطحنة درجة", en: "Tighten the grind one step" } }
    ]
  },

  {
    id: "cafe-au-lait",
    equipment: "filter",
    style: ["hot", "milk"],
    minutes: 5,
    baseYield: 240,
    // caffeine: 120 ml brewed at 1:13 = 9.2 g grounds x 8.67 mg/g = 80 mg
    caffeine: 80,
    // calories: coffee 120 ml x 0.02 (2.4) + milk 120 ml x 0.64 (76.8) = 79.2
    calories: 79,
    name: { ar: "كافيه أو ليه", en: "Café au Lait" },
    blurb: {
      ar: "قهوة فلتر وحليب نص بنص — أخف وألطف من اللاتيه.",
      en: "Filter coffee and milk, half and half — lighter and gentler than a latte."
    },
    ingredients: [
      { ar: "قهوة فلتر قوية", en: "Strong filter coffee", amount: 120, unit: "ml" },
      { ar: "حليب ساخن", en: "Hot milk", amount: 120, unit: "ml" }
    ],
    steps: [
      { ar: "حضّر قهوة فلتر بنسبة ١:١٣ (أقوى من العادي).", en: "Brew filter coffee at 1:13 — stronger than usual.", seconds: 180 },
      { ar: "سخّن الحليب لـ ٦٥° بدون رغوة.", en: "Heat the milk to 65°C without foaming." },
      { ar: "صبّهم بنفس الوقت بكوب واسع.", en: "Pour both at the same time into a wide bowl or cup." }
    ],
    why: {
      ar: "هاد مش لاتيه — الأساس قهوة فلتر مش إسبريسو، فالقوام أخف والحموضة أوضح. لهيك بنعمل الفلتر أقوى من المعتاد ليصمد أمام الحليب.",
      en: "This isn't a latte — the base is filter coffee, not espresso, so the body is lighter and the acidity clearer. That's why you brew it stronger than usual, so it holds up to the milk."
    },
    fixes: [
      { problem: { ar: "باهت", en: "Flat" }, cause: { ar: "قهوة فلتر عادية القوة", en: "Normal-strength filter coffee" }, fix: { ar: "اعملها ١:١٣ بدل ١:١٦", en: "Brew at 1:13 instead of 1:16" } }
    ]
  },

  {
    id: "iced-coffee",
    equipment: "filter",
    style: ["iced"],
    minutes: 5,
    baseYield: 300,
    // caffeine: 20 g grounds x 8.67 mg/g (130 mg per 15 g) = 173 mg; ice 0
    caffeine: 173,
    // calories: brewed 160 ml x 0.02 (3.2) + ice 0 = 3.2
    calories: 3,
    name: { ar: "آيس كوفي (الصبّ على الثلج)", en: "Iced Coffee (Japanese style)" },
    blurb: {
      ar: "تحضّرها بتركيز مضاعف وتصبّها على ثلج — بتحفظ النكهات العطرية.",
      en: "Brewed at double strength directly onto ice — it locks in the aromatics."
    },
    ingredients: [
      { ar: "بن مطحون متوسط", en: "Medium-ground coffee", amount: 20, unit: "g" },
      { ar: "ماء ساخن ٩٣°", en: "Hot water at 93°C", amount: 160, unit: "ml" },
      { ar: "ثلج (بالإبريق)", en: "Ice (in the carafe)", amount: 140, unit: "g" }
    ],
    steps: [
      { ar: "حط ١٤٠ غ ثلج بالإبريق تحت الفلتر مباشرة.", en: "Put 140 g of ice in the carafe directly under the filter." },
      { ar: "حضّر البور أوفر بـ ١٦٠ مل ماء فقط — نسبة ١:٨.", en: "Brew the pour-over with only 160 ml of water — a 1:8 ratio.", seconds: 150 },
      { ar: "القهوة بتنزل على الثلج وتبرد فوراً.", en: "The coffee lands on the ice and chills instantly." },
      { ar: "حرّك حتى يذوب الثلج وصبّه على كوب فيه ثلج جديد.", en: "Swirl until the ice melts, then pour over fresh ice." }
    ],
    why: {
      ar: "التبريد الفوري بيحبس المركبات العطرية الطيّارة قبل ما تتبخّر. القهوة اللي تتركها تبرد لحالها بتخسر أغلب رائحتها بالهوا.",
      en: "Flash-chilling traps the volatile aromatics before they evaporate. Coffee left to cool on its own loses most of its aroma to the air."
    },
    fixes: [
      { problem: { ar: "مائية", en: "Watery" }, cause: { ar: "حضّرتها بتركيز عادي", en: "Brewed at normal strength" }, fix: { ar: "نص الماء والباقي ثلج — ١:٨ مش ١:١٦", en: "Half water, half ice — 1:8 not 1:16" } }
    ]
  },

  {
    id: "cold-brew",
    equipment: "filter",
    style: ["iced"],
    minutes: 10,
    baseYield: 700,
    // caffeine: 80 g grounds -> 700 ml concentrate at 100 mg/100 ml = 700 mg; served 1:1, so 700 ml of drink carries half = 350 mg (50 mg per 100 ml as served)
    caffeine: 350,
    // calories: 700 ml of drink at roughly filter strength x 0.02 = 14
    calories: 14,
    name: { ar: "كولد برو", en: "Cold Brew" },
    blurb: {
      ar: "نقع بارد ١٤ ساعة — حلو وناعم وقليل الحموضة. بتضل ١٠ أيام.",
      en: "A 14-hour cold steep — sweet, smooth, low acid. Keeps 10 days."
    },
    ingredients: [
      { ar: "بن طحنة خشنة", en: "Coarse-ground coffee", amount: 80, unit: "g" },
      { ar: "ماء بارد", en: "Cold water", amount: 700, unit: "ml" }
    ],
    steps: [
      { ar: "اخلط البن الخشن مع الماء البارد بمرطبان، وتأكد إن كل البن تبلّل.", en: "Stir the coarse grounds into cold water in a jar, making sure everything is wetted." },
      { ar: "غطّيه وحطّه بالثلاجة ١٤ ساعة.", en: "Cover and refrigerate for 14 hours." },
      { ar: "صفّيه بفلتر ورقي أو قماش — مرتين إذا لزم.", en: "Strain through paper or cloth — twice if needed.", seconds: 300 },
      { ar: "خفّفه ١:١ بماء أو حليب قبل الشرب.", en: "Dilute 1:1 with water or milk before drinking." }
    ],
    why: {
      ar: "الماء البارد ما بيستخلص الأحماض الكلوروجينية ولا الزيوت المرّة — هدول بدهم حرارة. النتيجة حلاوة نظيفة بحموضة أقل بـ ٦٥٪ من القهوة الساخنة.",
      en: "Cold water doesn't extract chlorogenic acids or the bitter oils — those need heat. The result is clean sweetness with around 65% less acidity than hot-brewed coffee."
    },
    fixes: [
      { problem: { ar: "عكر وطيني", en: "Muddy and silty" }, cause: { ar: "طحنة ناعمة", en: "Grind too fine" }, fix: { ar: "طحنة خشنة زي ملح البحر، وصفّيه مرتين", en: "Grind coarse like sea salt, and strain twice" } },
      { problem: { ar: "ضعيف", en: "Weak" }, cause: { ar: "وقت نقع قصير", en: "Steeped too briefly" }, fix: { ar: "مدّده لـ ١٨ ساعة", en: "Extend to 18 hours" } },
      { problem: { ar: "مرّ رغم البرودة", en: "Bitter despite the cold" }, cause: { ar: "نقعته أكثر من ٢٤ ساعة", en: "Steeped beyond 24 hours" }, fix: { ar: "لا تتجاوز ١٨ ساعة", en: "Don't go past 18 hours" } }
    ]
  },

  {
    id: "filter-mocha",
    equipment: "filter",
    style: ["hot", "milk", "dessert"],
    minutes: 6,
    baseYield: 280,
    // caffeine: 200 ml strong filter (1:13) = 15.4 g grounds x 8.67 mg/g = 133 mg; cocoa not in the reference table, counted as 0
    caffeine: 133,
    // calories: coffee 200 ml x 0.02 (4) + cocoa 2 tsp ~ 5 g x 5.5 (27.5, costed as dark chocolate) + sugar 1 tsp (16) + milk 50 ml x 0.64 (32) = 79.5
    calories: 80,
    name: { ar: "موكا بالفلتر", en: "Filter Mocha" },
    blurb: {
      ar: "نسخة أخف من موكا الإسبريسو — بتناسب اللي ما بحب التركيز.",
      en: "A lighter take on the espresso mocha — for when you don't want the intensity."
    },
    ingredients: [
      { ar: "قهوة فلتر قوية", en: "Strong filter coffee", amount: 200, unit: "ml" },
      { ar: "كاكاو خام", en: "Unsweetened cocoa", amount: 2, unit: "tsp" },
      { ar: "سكر", en: "Sugar", amount: 1, unit: "tsp" },
      { ar: "حليب ساخن", en: "Hot milk", amount: 50, unit: "ml" }
    ],
    steps: [
      { ar: "اخلط الكاكاو والسكر بـ ٥٠ مل حليب ساخن حتى ينعم تماماً.", en: "Whisk the cocoa and sugar into 50 ml of hot milk until completely smooth.", seconds: 45 },
      { ar: "أضف القهوة الساخنة تدريجياً وحرّك.", en: "Add the hot coffee gradually, stirring." },
      { ar: "ذوّقه وعدّل السكر.", en: "Taste and adjust the sugar." }
    ],
    why: {
      ar: "القهوة المفلترة أقل كثافة من الإسبريسو، فبتقدر تحمل كمية كاكاو أكبر بدون ما تصير ثقيلة.",
      en: "Filter coffee is less dense than espresso, so it can carry more cocoa without turning heavy."
    },
    fixes: [
      { problem: { ar: "الكاكاو ما ذاب", en: "Cocoa didn't dissolve" }, cause: { ar: "حطيته بالقهوة مباشرة", en: "Added straight to the coffee" }, fix: { ar: "اعمل عجينة بالحليب الساخن أولاً", en: "Make a paste with hot milk first" } }
    ]
  },

  {
    id: "spiced-filter",
    equipment: "filter",
    style: ["hot"],
    minutes: 5,
    baseYield: 240,
    // caffeine: 15 g grounds = 130 mg; spices 0
    caffeine: 130,
    // calories: filter coffee 240 ml x 0.02 = 4.8; spices 0
    calories: 5,
    name: { ar: "قهوة فلتر بالقرفة والهيل", en: "Spiced Filter Coffee" },
    blurb: {
      ar: "البهارات بتنحط مع البن الجاف — النكهة بتتسرّب أثناء الاستخلاص.",
      en: "Spices go in with the dry grounds — the flavour infuses during extraction."
    },
    ingredients: [
      { ar: "بن مطحون متوسط", en: "Medium-ground coffee", amount: 15, unit: "g" },
      { ar: "حبتين هيل مهروستين", en: "Cardamom pods, crushed", amount: 2, unit: "pc", fixed: true },
      { ar: "عود قرفة صغير", en: "Small cinnamon stick", amount: 1, unit: "pc", fixed: true },
      { ar: "ماء ٩٣°", en: "Water at 93°C", amount: 240, unit: "ml" }
    ],
    steps: [
      { ar: "اخلط البهارات المهروسة مع البن الجاف بالفلتر.", en: "Mix the crushed spices into the dry grounds in the filter." },
      { ar: "اعمل Bloom بـ ٤٥ مل ماء لمدة ٣٠ ثانية.", en: "Bloom with 45 ml of water for 30 seconds.", seconds: 30 },
      { ar: "كمّل الصبّ بدوائر بطيئة.", en: "Continue pouring in slow circles.", seconds: 120 }
    ],
    why: {
      ar: "لما تنقع البهارات أثناء الاستخلاص، الماء بيسحب زيوتها بالتدريج مع القهوة. إضافتها بعدين بتعطي طعم سطحي ومنفصل.",
      en: "Steeping the spices during extraction lets the water pull their oils gradually alongside the coffee. Adding them afterwards gives a surface-level, disconnected flavour."
    },
    fixes: [
      { problem: { ar: "البهارات سيطرت", en: "Spices took over" }, cause: { ar: "كمية كبيرة", en: "Too much" }, fix: { ar: "حبة هيل واحدة بس", en: "One cardamom pod only" } }
    ]
  },

  /* ───────────────────────── TURKISH ───────────────────────── */

  {
    id: "turkish-classic",
    equipment: "turkish",
    style: ["hot"],
    minutes: 6,
    baseYield: 70,
    // caffeine: 7 g grounds in a 70 ml cup = 65 mg
    caffeine: 65,
    // calories: coffee 70 ml x 0.02 (1.4) + sugar 1 tsp (16) = 17.4
    calories: 17,
    name: { ar: "قهوة تركية", en: "Classic Turkish" },
    blurb: {
      ar: "البداية من ماء بارد، والرغوة بتنرفع ثلاث مرات — وما بتغلي أبداً.",
      en: "Start from cold water, lift the foam three times — and never let it boil."
    },
    ingredients: [
      { ar: "بن تركي مطحون ناعم جداً", en: "Very finely ground Turkish coffee", amount: 7, unit: "g" },
      { ar: "ماء بارد", en: "Cold water", amount: 70, unit: "ml" },
      { ar: "سكر (اختياري)", en: "Sugar (optional)", amount: 1, unit: "tsp" }
    ],
    steps: [
      { ar: "حط البن والسكر والماء البارد بالكنكة وحرّك مرة وحدة.", en: "Put the coffee, sugar and cold water in the pot and stir once." },
      { ar: "حطها على نار هادئة جداً — لا تحرّك بعد هيك.", en: "Set it on very low heat — don't stir again after this.", seconds: 180 },
      { ar: "لما ترتفع الرغوة، ارفعها عن النار فوراً قبل ما تفور.", en: "When the foam rises, lift it off the heat immediately, before it boils over." },
      { ar: "رجّعها للنار وكرّر الرفع مرتين إضافيتين.", en: "Return it to the heat and repeat the lift twice more.", seconds: 60 },
      { ar: "اغرف الرغوة على الفناجين أولاً، ثم صبّ القهوة ببطء.", en: "Spoon the foam into the cups first, then pour the coffee slowly." },
      { ar: "اتركها دقيقة يستقر الثفل بالقاع.", en: "Let it stand a minute so the grounds settle.", seconds: 60 }
    ],
    why: {
      ar: "هاد استخلاص كامل مقصود — البن ما بينفصل عن الماء، فإنت بتشرب مواد صلبة عالقة. عشان هيك بدها بن غامق قليل الحموضة: التحميص الغامق كسّر الأحماض أصلاً، فما بتطلع حامضة مزعجة.",
      en: "This is full extraction on purpose — the grounds never leave the water, so you're drinking suspended solids. That's why it needs a dark, low-acid coffee: the dark roast has already broken down the acids, so nothing turns harsh."
    },
    fixes: [
      { problem: { ar: "ما طلعت رغوة", en: "No foam" }, cause: { ar: "نار عالية، أو حرّكت أثناء التسخين", en: "Heat too high, or stirred while heating" }, fix: { ar: "نار هادئة جداً وبدون تحريك بعد البداية", en: "Very low heat, and no stirring after the start" } },
      { problem: { ar: "مرّة جداً", en: "Very bitter" }, cause: { ar: "غلت فعلياً", en: "It actually boiled" }, fix: { ar: "ارفعها عند أول ارتفاع للرغوة", en: "Lift it the moment the foam rises" } },
      { problem: { ar: "ثفل بالفم", en: "Grounds in every sip" }, cause: { ar: "صببت بسرعة أو ما استنيت", en: "Poured fast, or didn't let it settle" }, fix: { ar: "صبّ ببطء واتركها دقيقة", en: "Pour slowly and let it rest a minute" } }
    ]
  },

  {
    id: "turkish-cardamom",
    equipment: "turkish",
    style: ["hot"],
    minutes: 6,
    baseYield: 70,
    // caffeine: 7 g grounds = 65 mg; cardamom 0
    caffeine: 65,
    // calories: coffee 70 ml x 0.02 (1.4) + cardamom 0 + sugar 1 tsp (16) = 17.4
    calories: 17,
    name: { ar: "تركية بالهيل", en: "Turkish with Cardamom" },
    blurb: {
      ar: "حبة هيل مهروسة من البداية — النكهة الأشهر بالمنطقة.",
      en: "A crushed pod from the very start — the region's signature."
    },
    ingredients: [
      { ar: "بن تركي", en: "Turkish coffee", amount: 7, unit: "g" },
      { ar: "حبة هيل مهروسة", en: "Cardamom pod, crushed", amount: 1, unit: "pc", fixed: true },
      { ar: "ماء بارد", en: "Cold water", amount: 70, unit: "ml" },
      { ar: "سكر (اختياري)", en: "Sugar (optional)", amount: 1, unit: "tsp" }
    ],
    steps: [
      { ar: "اهرس حبة الهيل وحطها مع البن والماء البارد.", en: "Crush the pod and add it with the coffee and cold water." },
      { ar: "سخّن على نار هادئة بدون تحريك.", en: "Heat gently without stirring.", seconds: 180 },
      { ar: "ارفع الرغوة ثلاث مرات.", en: "Lift the foam three times.", seconds: 60 },
      { ar: "صبّ ببطء واترك الهيل بالكنكة.", en: "Pour slowly, leaving the pod in the pot." }
    ],
    why: {
      ar: "الغلي البطيء بيستخلص زيوت الهيل بالتوازي مع القهوة، فالنكهتين بيندمجوا بدل ما يتنافسوا — وهاد الفرق عن رشّ الهيل بعد الصبّ.",
      en: "The slow heat pulls the cardamom's oils alongside the coffee so the two integrate rather than compete — which is the difference from sprinkling cardamom in afterwards."
    },
    fixes: [
      { problem: { ar: "الهيل خفيف", en: "Cardamom too faint" }, cause: { ar: "حبة كاملة غير مهروسة", en: "Pod left whole" }, fix: { ar: "اهرسها لتنفتح القشرة", en: "Crush it so the husk opens" } }
    ]
  },

  {
    id: "turkish-mastic",
    equipment: "turkish",
    style: ["hot"],
    minutes: 6,
    baseYield: 70,
    // caffeine: 7 g grounds = 65 mg; mastic 0
    caffeine: 65,
    // calories: coffee 70 ml x 0.02 = 1.4; mastic 0
    calories: 1,
    name: { ar: "تركية بالمستكة", en: "Turkish with Mastic" },
    blurb: {
      ar: "نكهة صنوبرية مميزة — شائعة بالشام، والكمية بتفرق كتير.",
      en: "A distinctive pine-resin note — common in the Levant, and quantity matters a lot."
    },
    ingredients: [
      { ar: "بن تركي", en: "Turkish coffee", amount: 7, unit: "g" },
      { ar: "حبة مستكة صغيرة جداً", en: "Very small mastic grain", amount: 1, unit: "pc", fixed: true },
      { ar: "ماء بارد", en: "Cold water", amount: 70, unit: "ml" }
    ],
    steps: [
      { ar: "اسحق حبة المستكة مع قليل من السكر حتى تصير بودرة.", en: "Grind the mastic grain with a little sugar until powdered." },
      { ar: "حطها مع البن والماء البارد.", en: "Add it with the coffee and cold water." },
      { ar: "سخّن على نار هادئة وارفع الرغوة ثلاث مرات.", en: "Heat gently and lift the foam three times.", seconds: 180 }
    ],
    why: {
      ar: "المستكة راتنج، وطعمها بيطغى بسرعة. حبة صغيرة كافية لـ ٤ فناجين — أكثر من هيك وبيصير طعمها زي الصمغ.",
      en: "Mastic is a resin and takes over quickly. One small grain covers four cups — any more and it tastes like glue."
    },
    fixes: [
      { problem: { ar: "طعم راتنجي طاغي", en: "Overwhelming resin taste" }, cause: { ar: "كمية كبيرة", en: "Too much" }, fix: { ar: "حبة بحجم رأس الدبوس تكفي", en: "A pinhead-sized grain is enough" } }
    ]
  },

  {
    id: "turkish-mocha",
    equipment: "turkish",
    style: ["hot", "dessert"],
    minutes: 6,
    baseYield: 70,
    // caffeine: 7 g grounds = 65 mg; cocoa counted as 0
    caffeine: 65,
    // calories: coffee 70 ml x 0.02 (1.4) + cocoa 1 tsp ~ 2.5 g x 5.5 (13.75, costed as dark chocolate) + sugar 1 tsp (16) = 31.2
    calories: 31,
    name: { ar: "موكا تركي", en: "Turkish Mocha" },
    blurb: {
      ar: "كاكاو مع البن من البداية — غني وكثيف جداً.",
      en: "Cocoa in with the grounds from the start — rich and very dense."
    },
    ingredients: [
      { ar: "بن تركي", en: "Turkish coffee", amount: 7, unit: "g" },
      { ar: "كاكاو خام", en: "Unsweetened cocoa", amount: 1, unit: "tsp" },
      { ar: "سكر", en: "Sugar", amount: 1, unit: "tsp" },
      { ar: "ماء بارد", en: "Cold water", amount: 70, unit: "ml" }
    ],
    steps: [
      { ar: "اخلط البن والكاكاو والسكر جاف بالكنكة.", en: "Mix the coffee, cocoa and sugar dry in the pot." },
      { ar: "أضف الماء البارد وحرّك مرة حتى يختفي الكاكاو.", en: "Add cold water and stir once until the cocoa disappears." },
      { ar: "سخّن على نار هادئة وارفع الرغوة ثلاث مرات.", en: "Heat gently and lift the foam three times.", seconds: 180 }
    ],
    why: {
      ar: "الخلط الجاف قبل الماء بيمنع التكتّل — نفس مبدأ خلط الدقيق بالسكر قبل إضافة السائل.",
      en: "Mixing dry before the water prevents clumping — the same principle as combining flour and sugar before adding liquid."
    },
    fixes: [
      { problem: { ar: "تكتّلات كاكاو", en: "Cocoa lumps" }, cause: { ar: "أضفت الكاكاو بعد الماء", en: "Cocoa added after the water" }, fix: { ar: "اخلط كل شي جاف أولاً", en: "Combine everything dry first" } }
    ]
  },

  {
    id: "turkish-orange",
    equipment: "turkish",
    style: ["hot"],
    minutes: 6,
    baseYield: 70,
    // caffeine: 7 g grounds = 65 mg; orange peel 0
    caffeine: 65,
    // calories: coffee 70 ml x 0.02 (1.4) + peel 0 + sugar 1 tsp (16) = 17.4
    calories: 17,
    name: { ar: "تركية بقشر البرتقال", en: "Orange-peel Turkish" },
    blurb: {
      ar: "قشرة برتقال صغيرة بالكنكة — زيوتها بتتزاوج مع التحميص الغامق.",
      en: "A small strip of orange peel in the pot — its oils pair with the dark roast."
    },
    ingredients: [
      { ar: "بن تركي", en: "Turkish coffee", amount: 7, unit: "g" },
      { ar: "قشرة برتقال صغيرة (بدون الجزء الأبيض)", en: "Small orange peel strip, no pith", amount: 1, unit: "pc", fixed: true },
      { ar: "ماء بارد", en: "Cold water", amount: 70, unit: "ml" },
      { ar: "سكر (اختياري)", en: "Sugar (optional)", amount: 1, unit: "tsp" }
    ],
    steps: [
      { ar: "قصّ شريط قشرة برتقال واشطب الجزء الأبيض عنه.", en: "Cut a strip of peel and scrape the white pith off it." },
      { ar: "حطه مع البن والماء البارد.", en: "Add it with the coffee and cold water." },
      { ar: "سخّن على نار هادئة وارفع الرغوة ثلاث مرات.", en: "Heat gently and lift the foam three times.", seconds: 180 },
      { ar: "شيل القشرة قبل الصبّ.", en: "Remove the peel before pouring." }
    ],
    why: {
      ar: "زيت الليمونين بقشرة البرتقال بيتبخّر بالحرارة ويلتصق برغوة القهوة. الجزء الأبيض مرّ جداً — لهيك بنشطبه.",
      en: "The limonene oil in the peel volatilises with the heat and clings to the coffee's foam. The white pith is intensely bitter, which is why you scrape it off."
    },
    fixes: [
      { problem: { ar: "مرّة بشكل غريب", en: "Oddly bitter" }, cause: { ar: "تركت الجزء الأبيض", en: "Left the pith on" }, fix: { ar: "اشطبه أو استعمل مبشرة سطحية بس", en: "Scrape it off, or zest only the surface" } }
    ]
  }

];

/* Filter metadata for the UI ------------------------------------------- */

const EQUIPMENT = [
  { id: "capsule", ar: "كبسولات نسبريسو", en: "Nespresso capsule" },
  { id: "filter",  ar: "قهوة فلتر",        en: "Filter drip" },
  { id: "turkish", ar: "قهوة تركية",       en: "Turkish pot" }
];

const STYLES = [
  { id: "hot",     ar: "ساخن",      en: "Hot" },
  { id: "iced",    ar: "بارد",      en: "Iced" },
  { id: "milk",    ar: "بحليب",     en: "With milk" },
  { id: "dessert", ar: "حلويات",    en: "Dessert" }
];

const UNITS = {
  ml:    { ar: "مل",     en: "ml"     },
  g:     { ar: "غ",      en: "g"      },
  shot:  { ar: "شوت",    en: "shot"   },
  tsp:   { ar: "ملعقة صغيرة", en: "tsp" },
  tbsp:  { ar: "ملعقة كبيرة", en: "tbsp" },
  pc:    { ar: "حبة",    en: "pc"     },
  scoop: { ar: "كرة",    en: "scoop"  }
};

/* Scaling helper ------------------------------------------------------- */

function scaleAmount(ingredient, factor) {
  if (ingredient.fixed) return ingredient.amount;
  const scaled = ingredient.amount * factor;
  switch (ingredient.unit) {
    case "shot":
    case "pc":
    case "scoop":
      return Math.max(1, Math.round(scaled));
    case "ml":
      return Math.max(5, Math.round(scaled / 5) * 5);
    case "tsp":
    case "tbsp":
      return Math.max(0.5, Math.round(scaled * 2) / 2);
    case "g":
      return Math.max(1, Math.round(scaled));
    default:
      return Math.round(scaled);
  }
}

const CUP_SIZES = [120, 180, 240, 350, 470];

/* Nutrition at a given cup size --------------------------------------- */

/* Caffeine from counted shots steps with the shot count; anything else in
   the record (brewed coffee measured by weight or volume) scales with the
   cup, as calories do. Figures are rounded for display only — caffeine to
   the nearest 5 mg, calories to the nearest 5 kcal, never down to zero for
   a drink that carries some. */
function scaleNutrition(recipe, factor) {
  let shotBase = 0, shotScaled = 0;
  for (const ing of recipe.ingredients) {
    if (!ing.mg) continue;
    shotBase += ing.mg * ing.amount;
    shotScaled += ing.mg * scaleAmount(ing, factor);
  }
  const rest = Math.max(0, (recipe.caffeine || 0) - shotBase);
  const caffeine = shotScaled + rest * factor;
  const calories = (recipe.calories || 0) * factor;
  return { caffeine: round5(caffeine), calories: round5(calories) };
}

function round5(n) {
  if (n <= 0) return 0;
  return Math.max(5, Math.round(n / 5) * 5);
}

export { RECIPES, EQUIPMENT, STYLES, UNITS, CUP_SIZES, scaleAmount, scaleNutrition };
