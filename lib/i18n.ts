// Mock i18n system for multi-language support (UI-only, no external libraries)

export type Locale = "en" | "ko" | "fr" | "sw"

export interface LocaleConfig {
  code: Locale
  label: string
  flag: string
  direction: "ltr" | "rtl"
}

export const SUPPORTED_LOCALES: LocaleConfig[] = [
  { code: "en", label: "English", flag: "🇬🇧", direction: "ltr" },
  { code: "ko", label: "한국어", flag: "🇰🇷", direction: "ltr" },
  { code: "fr", label: "Français", flag: "🇫🇷", direction: "ltr" },
  { code: "sw", label: "Swahili", flag: "🇰🇪", direction: "ltr" },
]

// Mock translation messages - expand as needed
const messages: Record<string, Record<Locale, string>> = {
  // Homepage
  "homepage.hero_heading": {
    en: "Buy Quality Korean Vehicles With Confidence",
    ko: "안심하고 한국 중고차를 구매하세요",
    fr: "Achetez des véhicules coréens de qualité en toute confiance",
    sw: "Nunua magari ya Korea kwa uaminifu",
  },
  "homepage.hero_subheading": {
    en: "Discover thousands of verified cars from trusted dealers across Korea",
    ko: "한국 전역의 신뢰할 수 있는 딜러의 검증된 자동차를 발견하세요",
    fr: "Découvrez des milliers de voitures vérifiées auprès de concessionnaires de confiance en Corée",
    sw: "Gundua maelfu ya magari yaliyothibitishwa kutoka kwa wauza waaminifu huko Korea",
  },
  "homepage.trust_line": {
    en: "Your trusted partner in finding the perfect car",
    ko: "완벽한 자동차를 찾는 신뢰할 수 있는 파트너",
    fr: "Votre partenaire de confiance pour trouver la voiture parfaite",
    sw: "Mshirika wako wa kuaminika katika kupata gari kamili",
  },

  // Navigation
  "nav.buyers": {
    en: "For Buyers",
    ko: "구매자용",
    fr: "Pour les acheteurs",
    sw: "Kwa wanunuzi",
  },
  "nav.sellers": {
    en: "For Sellers",
    ko: "판매자용",
    fr: "Pour les vendeurs",
    sw: "Kwa wauzaji",
  },
  "nav.marketplace": {
    en: "Marketplace",
    ko: "마켓플레이스",
    fr: "Marché",
    sw: "Soko",
  },
  "nav.dashboard": {
    en: "Dashboard",
    ko: "대시보드",
    fr: "Tableau de bord",
    sw: "Dashibodi",
  },
  "nav.analytics": {
    en: "Analytics",
    ko: "분석",
    fr: "Analytique",
    sw: "Uchanganuzi",
  },
  "nav.messages": {
    en: "Messages",
    ko: "메시지",
    fr: "Messages",
    sw: "Ujumbe",
  },
  "nav.shop_cars": {
    en: "Shop Cars",
    ko: "차량 검색",
    fr: "Acheter Voitures",
    sw: "Nunua Magari",
  },
  "nav.shop_parts": {
    en: "Shop Parts",
    ko: "부품 검색",
    fr: "Acheter Pièces",
    sw: "Nunua Vipuri",
  },
  "nav.dealers": {
    en: "Dealers",
    ko: "딜러",
    fr: "Concessionnaires",
    sw: "Wauza",
  },
  "nav.orders": {
    en: "Orders",
    ko: "주문 내역",
    fr: "Commandes",
    sw: "Agizo",
  },
  "nav.resources": {
    en: "Resources",
    ko: "리소스",
    fr: "Ressources",
    sw: "Rasilimali",
  },
  "nav.blog": {
    en: "Blog",
    ko: "블로그",
    fr: "Blog",
    sw: "Blogu",
  },
  "nav.dealer_area": {
    en: "Dealer Area",
    ko: "딜러 전용",
    fr: "Espace Revendeur",
    sw: "Eneo la Muuzaji",
  },


  "role.buyer_title": {
    en: "I Want to Buy",
    ko: "차량 구매",
    fr: "Je veux acheter",
    sw: "Nataka kununua",
  },
  "role.seller_title": {
    en: "I Want to Sell",
    ko: "차량 판매",
    fr: "Je veux vendre",
    sw: "Nataka kuuza",
  },
  "role.buyer_desc": {
    en: "Browse thousands of verified cars and find your perfect match",
    ko: "수천 대의 검증된 차량을 찾아보고 완벽한 차량을 찾으세요",
    fr: "Parcourez des milliers de voitures vérifiées et trouvez votre match parfait",
    sw: "Pata maelfu ya magari yaliyothibitishwa na upate mechi yako kamili",
  },
  "role.seller_desc": {
    en: "List your vehicle and reach thousands of potential buyers",
    ko: "차량을 등록하고 수천 명의 잠재 구매자에게 도달하세요",
    fr: "Listez votre véhicule et atteignez des milliers d'acheteurs potentiels",
    sw: "Orodhesha gari lako na ufikie maelfu ya wanunuzi watarajiwa",
  },

  // Search
  "search.placeholder": {
    en: "Search for cars...",
    ko: "차량 검색...",
    fr: "Rechercher des voitures...",
    sw: "Tafuta magari...",
  },
  "search.location": {
    en: "Location",
    ko: "위치",
    fr: "Emplacement",
    sw: "Mahali",
  },
  "search.button": {
    en: "Search",
    ko: "검색",
    fr: "Rechercher",
    sw: "Tafuta",
  },

  // Categories
  "category.luxury": {
    en: "Luxury Cars",
    ko: "럭셔리 카",
    fr: "Voitures de luxe",
    sw: "Magari ya kifahari",
  },
  "category.electric": {
    en: "Electric Vehicles",
    ko: "전기차",
    fr: "Véhicules électriques",
    sw: "Magari ya umeme",
  },
  "category.suv": {
    en: "SUVs & Crossovers",
    ko: "SUV 및 크로스오버",
    fr: "SUV et Crossovers",
    sw: "SUV na Crossovers",
  },

  // Stats
  "stats.active_listings": {
    en: "Active Listings",
    ko: "활성 매물",
    fr: "Annonces actives",
    sw: "Orodha Hai",
  },
  "stats.verified_dealers": {
    en: "Verified Dealers",
    ko: "검증된 딜러",
    fr: "Concessionnaires vérifiés",
    sw: "Wauza waliothibitishwa",
  },
  "stats.happy_customers": {
    en: "Happy Customers",
    ko: "만족한 고객",
    fr: "Clients satisfaits",
    sw: "Wateja wenye furaha",
  },
  "stats.cars_sold": {
    en: "Cars Sold",
    ko: "판매된 차량",
    fr: "Véhitures vendues",
    sw: "Magari yaliyouzwa",
  },
  "stats.updated_daily": {
    en: "Updated Daily",
    ko: "매일 업데이트",
    fr: "Mis à jour quotidiennement",
    sw: "Inasasishwa kila siku",
  },
  "stats.across_korea": {
    en: "Across Korea",
    ko: "한국 전역",
    fr: "Dans toute la Corée",
    sw: "Kote Korea",
  },
  "stats.and_counting": {
    en: "And Counting",
    ko: "계속 증가 중",
    fr: "Et ce n'est pas fini",
    sw: "Na Kuhesabu",
  },
  "stats.this_year": {
    en: "This Year",
    ko: "올해",
    fr: "Cette année",
    sw: "Mwaka huu",
  },

  // Role Selection
  "role.section_subtitle": {
    en: "Whether you're looking to buy your dream car or sell to thousands of potential buyers",
    ko: "꿈의 차를 찾든 수천 명의 잠재 구매자에게 판매하든",
    fr: "Que vous cherchiez à acheter la voiture de vos rêves ou à vendre à des milliers d'acheteurs potentiels",
    sw: "Ikiwa unatafuta kununua gari lako la ndoto au kuuza kwa maelfu ya wanunuzi watarajiwa",
  },
  "role.choose": {
    en: "Choose Your Path",
    ko: "경로 선택",
    fr: "Choisissez votre chemin",
    sw: "Chagua Njia Yako", // Overriding previous 'Choose Your Role' slightly or just adding context
  },
  "trust.section_title": {
    en: "Why Choose Our Platform",
    ko: "왜 우리 플랫폼을 선택해야 할까요",
    fr: "Pourquoi choisir notre plateforme",
    sw: "Kwa nini Chagua Jukwaa Letu",
  },

  // Features Section
  "features.title": {
    en: "Everything You Need in One Platform",
    ko: "하나의 플랫폼에서 필요한 모든 것",
    fr: "Tout ce dont vous avez besoin sur une seule plateforme",
    sw: "Kila Kitu Unachohitaji Katika Jukwaa Moja",
  },
  "features.subtitle": {
    en: "From browsing to financing, we provide end-to-end solutions for your car buying and selling needs",
    ko: "검색부터 금융까지, 차량 구매 및 판매 요구에 대한 엔드 투 엔드 솔루션을 제공합니다",
    fr: "De la navigation au financement, nous fournissons des solutions de bout en bout",
    sw: "Kutoka kwa kuvinjari hadi ufadhili, tunatoa suluhisho la mwisho hadi mwisho",
  },
  "features.inventory_title": {
    en: "Extensive Inventory",
    ko: "방대한 매물",
    fr: "Vaste Inventaire",
    sw: "Orodha Kubwa",
  },
  "features.inventory_desc": {
    en: "10,000+ verified vehicles across all makes, models, and price ranges",
    ko: "모든 제조사, 모델 및 가격대의 10,000대 이상의 검증된 차량",
    fr: "Plus de 10 000 véhicules vérifiés de toutes marques et modèles",
    sw: "Magari 10,000+ yaliyothibitishwa katika aina zote na mitindo",
  },
  "features.history_title": {
    en: "Vehicle History",
    ko: "차량 이력",
    fr: "Historique du véhicule",
    sw: "Historia ya Gari",
  },
  "features.history_desc": {
    en: "Complete accident history, service records, and ownership details",
    ko: "완전한 사고 이력, 정비 기록 및 소유권 세부 정보",
    fr: "Historique complet des accidents et dossiers d'entretien",
    sw: "Historia kamili ya ajali, kumbukumbu za huduma, na maelezo ya umiliki",
  },
  "features.insights_title": {
    en: "Market Insights",
    ko: "시장 인사이트",
    fr: "Aperçu du marché",
    sw: "Maarifa ya Soko",
  },
  "features.insights_desc": {
    en: "Real-time pricing data and market trends to help you decide",
    ko: "결정을 돕기 위한 실시간 가격 데이터 및 시장 동향",
    fr: "Données de prix en temps réel et tendances du marché",
    sw: "Data ya bei ya wakati halisi na mwenendo wa soko kukusaidia kuamua",
  },
  "features.communication_title": {
    en: "Direct Communication",
    ko: "직접 소통",
    fr: "Communication directe",
    sw: "Mawasiliano ya Moja kwa Moja",
  },
  "features.communication_desc": {
    en: "Chat directly with verified dealers and get instant responses",
    ko: "검증된 딜러와 직접 채팅하고 즉시 응답을 받으세요",
    fr: "Discutez directement avec des concessionnaires vérifiés",
    sw: "Zungumza moja kwa moja na wauza waliothibitishwa",
  },
  "features.favorites_title": {
    en: "Save Favorites",
    ko: "즐겨찾기 저장",
    fr: "Enregistrer les favoris",
    sw: "Hifadhi Vipendwa",
  },
  "features.favorites_desc": {
    en: "Create collections of cars you love and receive price drop alerts",
    ko: "좋아하는 차량 컬렉션을 만들고 가격 인하 알림을 받으세요",
    fr: "Créez des collections de voitures que vous aimez",
    sw: "Unda mkusanyiko wa magari unayopenda na upokee arifa za kushuka kwa bei",
  },
  "features.quality_title": {
    en: "Quality Assured",
    ko: "품질 보증",
    fr: "Qualité assurée",
    sw: "Ubora Ulihakikishwa",
  },
  "features.quality_desc": {
    en: "Multi-point inspection reports available for premium listings",
    ko: "프리미엄 매물에 대해 제공되는 다항목 점검 보고서",
    fr: "Rapports d'inspection multipoints disponibles",
    sw: "Ripoti za ukaguzi wa pointi nyingi zinapatikana",
  },
  "features.coverage_title": {
    en: "Nationwide Coverage",
    ko: "전국 커버리지",
    fr: "Couverture nationale",
    sw: "Chanjo ya Kitaifa",
  },
  "features.coverage_desc": {
    en: "Dealers and listings from Seoul, Busan, Incheon, and beyond",
    ko: "서울, 부산, 인천 및 그 외 지역의 딜러 및 매물",
    fr: "Concessionnaires et annonces de Séoul, Busan, Incheon",
    sw: "Wauza na orodha kutoka Seoul, Busan, Incheon, na zaidi",
  },
  "features.support_title": {
    en: "Expert Support",
    ko: "전문가 지원",
    fr: "Support expert",
    sw: "Msaada wa Wataalam",
  },
  "features.support_desc": {
    en: "Dedicated customer service team available 7 days a week",
    ko: "주 7일 이용 가능한 전담 고객 서비스 팀",
    fr: "Équipe de service client dédiée disponible 7j/7",
    sw: "Timu ya huduma kwa wateja iliyojitolea inapatikana siku 7 kwa wiki",
  },

  // About Us
  "about.title": {
    en: "About SK AutoSphere",
    ko: "SK AutoSphere 소개",
    fr: "À propos de SK AutoSphere",
    sw: "Kuhusu SK AutoSphere",
  },
  "about.subtitle": {
    en: "Korea's most trusted automotive marketplace, connecting buyers and sellers since 2020",
    ko: "2020년부터 구매자와 판매자를 연결해 온 한국에서 가장 신뢰받는 자동차 장터",
    fr: "Le marché automobile le plus fiable de Corée",
    sw: "Soko la magari linaloaminika zaidi Korea",
  },
  "about.mission_title": {
    en: "Our Mission",
    ko: "우리의 미션",
    fr: "Notre mission",
    sw: "Dhamira Yetu",
  },
  "about.mission_desc_1": {
    en: "We're on a mission to revolutionize the car buying and selling experience in Korea. By combining cutting-edge technology with a customer-first approach, we make finding your perfect vehicle simple, secure, and transparent.",
    ko: "우리는 한국의 자동차 매매 경험을 혁신하는 임무를 수행하고 있습니다. 최첨단 기술과 고객 우선 접근 방식을 결합하여 완벽한 차량을 쉽고 안전하며 투명하게 찾을 수 있도록 합니다.",
    fr: "Nous avons pour mission de révolutionner l'expérience d'achat et de vente de voitures",
    sw: "Tuko kwenye dhamira ya kubadilisha uzoefu wa kununua na kuuza gari",
  },
  "about.mission_desc_2": {
    en: "Every day, we help thousands of people find their dream cars while providing dealers with the tools they need to reach more customers and grow their businesses.",
    ko: "매일 수천 명의 사람들이 꿈의 차를 찾도록 돕고 딜러에게는 더 많은 고객에게 도달하고 비즈니스를 성장시키는 데 필요한 도구를 제공합니다.",
    fr: "Chaque jour, nous aidons des milliers de personnes à trouver la voiture de leurs rêves",
    sw: "Kila siku, tunasaidia maelfu ya watu kupata magari yao ya ndoto",
  },
  "about.values_title": {
    en: "Our Values",
    ko: "우리의 가치",
    fr: "Nos valeurs",
    sw: "Maadili Yetu",
  },
  "about.value_1_title": {
    en: "Trust & Transparency",
    ko: "신뢰와 투명성",
    fr: "Confiance et transparence",
    sw: "Imani na Uwazi",
  },
  "about.value_1_desc": {
    en: "Every listing is verified, every dealer is vetted",
    ko: "모든 매물이 검증되고, 모든 딜러는 심사를 거칩니다",
    fr: "Chaque annonce est vérifiée",
    sw: "Kila orodha imethibitishwa",
  },
  "about.value_2_title": {
    en: "Innovation",
    ko: "혁신",
    fr: "Innovation",
    sw: "Ubunifu",
  },
  "about.value_2_desc": {
    en: "Leveraging technology to improve every interaction",
    ko: "모든 상호 작용을 개선하기 위해 기술 활용",
    fr: "Tirer parti de la technologie",
    sw: "Kutumia teknolojia",
  },
  "about.value_3_title": {
    en: "Customer Success",
    ko: "고객 성공",
    fr: "Succès client",
    sw: "Mafanikio ya Mteja",
  },
  "about.value_3_desc": {
    en: "Your satisfaction is our top priority",
    ko: "고객의 만족이 우리의 최우선 순위입니다",
    fr: "Votre satisfaction est notre priorité absolue",
    sw: "Kuridhika kwako ndio kipaumbele chetu cha juu",
  },

  // Resources
  "resources.title": {
    en: "Resources & Guides",
    ko: "자료 및 가이드",
    fr: "Ressources et guides",
    sw: "Rasilimali na Miongozo",
  },
  "resources.subtitle": {
    en: "Everything you need to know about buying and selling vehicles internationally",
    ko: "해외 차량 매매에 대해 알아야 할 모든 것",
    fr: "Tout ce que vous devez savoir sur l'achat et la vente de véhicules à l'international",
    sw: "Kila kitu unachohitaji kujua kuhusu kununua na kuuza magari kimataifa",
  },
  "resources.guide_buyer_title": {
    en: "Buyer's Guides",
    ko: "구매자 가이드",
    fr: "Guides de l'acheteur",
    sw: "Miongozo ya Mnunuzi",
  },
  "resources.guide_buyer_desc": {
    en: "Complete guides on purchasing, inspecting, and importing vehicles",
    ko: "차량 구매, 점검 및 수입에 대한 전체 가이드",
    fr: "Guides complets sur l'achat",
    sw: "Miongozo kamili ya ununuzi",
  },
  "resources.guide_import_title": {
    en: "Import Guides",
    ko: "수입 가이드",
    fr: "Guides d'importation",
    sw: "Miongozo ya Uagizaji",
  },
  "resources.guide_import_desc": {
    en: "Country-specific guides for shipping to Ghana, Nigeria, Kenya, and more",
    ko: "가나, 나이지리아, 케냐 등으로의 배송을 위한 국가 별 가이드",
    fr: "Guides spécifiques par pays",
    sw: "Miongozo mahususi kwa nchi",
  },
  "resources.guide_seller_title": {
    en: "Seller's Playbook",
    ko: "판매자 플레이북",
    fr: "Manuel du vendeur",
    sw: "Kitabu cha Mchezo cha Muuzaji",
  },
  "resources.guide_seller_desc": {
    en: "Best practices for creating listings and closing deals faster",
    ko: "매물 등록 생성 및 더 빠른 거래 성사를 위한 모범 사례",
    fr: "Meilleures pratiques pour créer des annonces",
    sw: "Mazoezi bora kwa kuunda orodha",
  },
  "resources.view_all": {
    en: "View All Resources",
    ko: "모든 자료 보기",
    fr: "Voir toutes les ressources",
    sw: "Tazama Rasilimali Zote",
  },
  "resources.learn_more": {
    en: "Learn More",
    ko: "더 알아보기",
    fr: "En savoir plus",
    sw: "Jifunze Zaidi",
  },

  // Financing
  "financing.title": {
    en: "Flexible Financing Options",
    ko: "유연한 금융 옵션",
    fr: "Options de financement flexibles",
    sw: "Chaguzi za Ufadhili Zinazobadilika",
  },
  "financing.subtitle": {
    en: "Get pre-approved in minutes and drive away in your dream car today",
    ko: "몇 분 만에 사전 승인을 받고 오늘 꿈의 차를 운전하세요",
    fr: "Obtenez une pré-approbation en quelques minutes",
    sw: "Pata idhini ya mapema kwa dakika",
  },

  // Footer
  "footer.moto": {
    en: "Korea's premier automotive marketplace connecting buyers and sellers with trust and transparency.",
    ko: "신뢰와 투명성으로 구매자와 판매자를 연결하는 한국 최고의 자동차 장터.",
    fr: "Le premier marché automobile de Corée",
    sw: "Soko kuu la magari la Korea",
  },
  "footer.for_buyers": {
    en: "For Buyers",
    ko: "구매자용",
    fr: "Pour les acheteurs",
    sw: "Kwa Wanunuzi",
  },
  "footer.for_sellers": {
    en: "For Sellers",
    ko: "판매자용",
    fr: "Pour les vendeurs",
    sw: "Kwa Wauza",
  },
  "footer.company": {
    en: "Company",
    ko: "회사",
    fr: "Entreprise",
    sw: "Kampuni",
  },
  "footer.browse_cars": {
    en: "Browse Cars",
    ko: "차량 검색",
    fr: "Parcourir les voitures",
    sw: "Vinjari Magari",
  },
  "footer.advanced_search": {
    en: "Advanced Search",
    ko: "상세 검색",
    fr: "Recherche avancée",
    sw: "Utafutaji wa Juu",
  },
  "footer.financing_options": {
    en: "Financing Options",
    ko: "금융 옵션",
    fr: "Options de financement",
    sw: "Chaguzi za Ufadhili",
  },
  "footer.buyers_guides": {
    en: "Buyer's Guides",
    ko: "구매자 가이드",
    fr: "Guides de l'acheteur",
    sw: "Miongozo ya Mnunuzi",
  },
  "footer.shipping_logistics": {
    en: "Shipping & Logistics",
    ko: "배송 및 물류",
    fr: "Expédition et logistique",
    sw: "Usafirishaji na Vifaa",
  },
  "footer.car_comparison": {
    en: "Car Comparison",
    ko: "차량 비교",
    fr: "Comparaison de voitures",
    sw: "Ulinganisho wa Gari",
  },
  "footer.list_your_car": {
    en: "List Your Car",
    ko: "차량 등록",
    fr: "Inscrivez votre voiture",
    sw: "Orodhesha Gari Lako",
  },
  "footer.dealer_registration": {
    en: "Dealer Registration",
    ko: "딜러 등록",
    fr: "Inscription concessionnaire",
    sw: "Usajili wa Muuzaji",
  },
  "footer.pricing_tools": {
    en: "Pricing Tools",
    ko: "가격 도구",
    fr: "Outils de tarification",
    sw: "Zana za Bei",
  },
  "footer.sellers_guides": {
    en: "Seller's Guides",
    ko: "판매자 가이드",
    fr: "Guides du vendeur",
    sw: "Miongozo ya Muuzaji",
  },
  "footer.marketing_services": {
    en: "Marketing Services",
    ko: "마케팅 서비스",
    fr: "Services marketing",
    sw: "Huduma za Masoko",
  },
  "footer.about_us": {
    en: "About Us",
    ko: "회사 소개",
    fr: "À propos de nous",
    sw: "Kuhusu Sisi",
  },
  "footer.resources_hub": {
    en: "Resources Hub",
    ko: "자료 허브",
    fr: "Centre de ressources",
    sw: "Kituo cha Rasilimali",
  },
  "footer.contact": {
    en: "Contact",
    ko: "문의하기",
    fr: "Contact",
    sw: "Wasiliana",
  },
  "footer.careers": {
    en: "Careers",
    ko: "채용",
    fr: "Carrières",
    sw: "Ajira",
  },
  "footer.blog": {
    en: "Blog",
    ko: "블로그",
    fr: "Blog",
    sw: "Blogu",
  },
  "footer.privacy_policy": {
    en: "Privacy Policy",
    ko: "개인정보 처리방침",
    fr: "Politique de confidentialité",
    sw: "Sera ya Faragha",
  },
  "footer.terms_of_service": {
    en: "Terms of Service",
    ko: "이용 약관",
    fr: "Conditions d'utilisation",
    sw: "Masharti ya Huduma",
  },
  "footer.cookie_policy": {
    en: "Cookie Policy",
    ko: "쿠키 정책",
    fr: "Politique relative aux cookies",
    sw: "Sera ya Vidakuzi",
  },
  "footer.rights_reserved": {
    en: "All rights reserved.",
    ko: "판권 소유.",
    fr: "Tous droits réservés.",
    sw: "Haki zote zimehifadhiwa.",
  },

  // Trust Strip
  "trust_strip.verified_sellers": {
    en: "Verified Sellers",
    ko: "검증된 판매자",
    fr: "Vendeurs vérifiés",
    sw: "Wauza waliothibitishwa",
  },
  "trust_strip.verified_sellers_desc": {
    en: "All sellers identity verified",
    ko: "모든 판매자 신원 확인됨",
    fr: "Identité vérifiée",
    sw: "Kitambulisho kilichothibitishwa",
  },
  "trust_strip.doc_verification": {
    en: "Document Verification",
    ko: "서류 검증",
    fr: "Vérification des documents",
    sw: "Uhakiki wa Nyaraka",
  },
  "trust_strip.doc_verification_desc": {
    en: "Secure document checks",
    ko: "안전한 서류 확인",
    fr: "Contrôles sécurisés",
    sw: "Ukaguzi wa nyaraka salama",
  },
  "trust_strip.quality_assurance": {
    en: "Quality Assurance",
    ko: "품질 보증",
    fr: "Assurance qualité",
    sw: "Uhakikisho wa Ubora",
  },
  "trust_strip.quality_assurance_desc": {
    en: "Inspected vehicles",
    ko: "점검된 차량",
    fr: "Véhicules inspectés",
    sw: "Magari yaliyokaguliwa",
  },
  "trust_strip.secure_trans": {
    en: "Secure Transactions",
    ko: "안전한 거래",
    fr: "Transactions sécurisées",
    sw: "Miamala Salama",
  },
  "trust_strip.secure_trans_desc": {
    en: "Protected payments",
    ko: "보호된 결제",
    fr: "Paiements protégés",
    sw: "Malipo yaliyolindwa",
  },
  "trust.section_subtitle": {
    en: "Your trusted partner in finding the perfect car",
    ko: "완벽한 자동차를 찾는 신뢰할 수 있는 파트너",
    fr: "Votre partenaire de confiance pour trouver la voiture parfaite",
    sw: "Mshirika wako wa kuaminika katika kupata gari kamili",
  },
  "trust.verified_dealers": {
    en: "Verified Dealers",
    ko: "검증된 딜러",
    fr: "Concessionnaires vérifiés",
    sw: "Wauza waliothibitishwa",
  },
  "trust.verified_dealers_desc": {
    en: "All our dealers are thoroughly vetted and verified for your complete safety and peace of mind",
    ko: "모든 딜러는 고객의 안전과 안심을 위해 철저한 심사와 검증을 거칩니다",
    fr: "Tous nos concessionnaires sont minutieusement contrôlés pour votre sécurité et votre tranquillité d'esprit",
    sw: "Wauza wetu wote wanakaguliwa na kuthibitishwa kwa usalama na amani yako kamili",
  },
  "trust.secure_payments": {
    en: "Secure Payments",
    ko: "안전한 결제",
    fr: "Paiements sécurisés",
    sw: "Malipo salama",
  },
  "trust.secure_payments_desc": {
    en: "Your transactions are protected with bank-level security and advanced encryption",
    ko: "귀하의 거래는 은행 수준의 보안과 고급 암호화로 보호됩니다",
    fr: "Vos transactions sont protégées par une sécurité de niveau bancaire et un cryptage avancé",
    sw: "Miamala yako inalindwa na usalama wa kiwango cha benki na usimbaji fiche wa hali ya juu",
  },
  "trust.buyer_protection": {
    en: "Buyer Protection",
    ko: "구매자 보호",
    fr: "Protection de l'acheteur",
    sw: "Ulinzi wa mnunuzi",
  },
  "trust.buyer_protection_desc": {
    en: "Comprehensive protection program ensuring your investment is always secure",
    ko: "귀하의 투자가 항상 안전하도록 보장하는 포괄적인 보호 프로그램",
    fr: "Programme de protection complet garantissant que votre investissement est toujours sécurisé",
    sw: "Mpango kamili wa ulinzi unaohakikisha uwekezaji wako uko salama kila wakati",
  },

  // How It Works
  "how_it_works.title": {
    en: "How It Works",
    ko: "이용 방법",
    fr: "Comment ça marche",
    sw: "Jinsi Inavyofanya Kazi",
  },
  "how_it_works.subtitle": {
    en: "Simple steps to buy or sell your vehicle on SK AutoSphere",
    ko: "SK AutoSphere에서 차량을 구매하거나 판매하는 간단한 단계",
    fr: "Étapes simples pour acheter ou vendre votre véhicule sur SK AutoSphere",
    sw: "Hatua rahisi za kununua au kuuza gari lako kwenye SK AutoSphere",
  },
  "how_it_works.for_buyers": {
    en: "For Buyers",
    ko: "구매자",
    fr: "Pour les acheteurs",
    sw: "Kwa Wanunuzi",
  },
  "how_it_works.buyer_step_1_title": {
    en: "Browse Korean Vehicles",
    ko: "한국 차량 검색",
    fr: "Parcourir les véhicules coréens",
    sw: "Vinjari Magari ya Korea",
  },
  "how_it_works.buyer_step_1_desc": {
    en: "Search through thousands of verified cars, buses, and trucks from trusted Korean dealers",
    ko: "신뢰할 수 있는 한국 딜러의 검증된 차량 수천 대를 검색하세요",
    fr: "Recherchez parmi des milliers de voitures, bus et camions vérifiés",
    sw: "Tafuta kupitia maelfu ya magari yaliyothibitishwa, mabasi, na malori",
  },
  "how_it_works.buyer_step_2_title": {
    en: "Chat with Dealers",
    ko: "딜러와 채팅",
    fr: "Discuter avec les concessionnaires",
    sw: "Zungumza na Wauza",
  },
  "how_it_works.buyer_step_2_desc": {
    en: "Connect directly via WhatsApp, phone, or email to ask questions and negotiate",
    ko: "WhatsApp, 전화 또는 이메일로 직접 연결하여 질문하고 협상하세요",
    fr: "Connectez-vous directement via WhatsApp, téléphone ou e-mail",
    sw: "Ungana moja kwa moja kupitia WhatsApp, simu, au barua pepe",
  },
  "how_it_works.buyer_step_3_title": {
    en: "Ship to Your African Port",
    ko: "아프리카 항구로 배송",
    fr: "Expédier vers votre port africain",
    sw: "Safirisha hadi Bandari Yako ya Afrika",
  },
  "how_it_works.buyer_step_3_desc": {
    en: "Arrange shipping to Tema, Lagos, Mombasa, Conakry, or any major African port",
    ko: "테마, 라고스, 몸바사, 코나크리 또는 주요 아프리카 항구로의 배송을 주선합니다",
    fr: "Organisez l'expédition vers Tema, Lagos, Mombasa, Conakry ou tout autre port majeur",
    sw: "Panga usafirishaji kwenda Tema, Lagos, Mombasa, Conakry, au bandari yoyote kuu ya Afrika",
  },
  "how_it_works.for_dealers": {
    en: "For Dealers",
    ko: "딜러",
    fr: "Pour les concessionnaires",
    sw: "Kwa Wauza",
  },
  "how_it_works.dealer_step_1_title": {
    en: "List Your Vehicle",
    ko: "차량 등록",
    fr: "Listez votre véhicule",
    sw: "Orodhesha Gari Lako",
  },
  "how_it_works.dealer_step_1_desc": {
    en: "Create detailed listings with photos and specs in just 5 minutes",
    ko: "단 5분 만에 사진과 제원이 포함된 상세 매물을 등록하세요",
    fr: "Créez des annonces détaillées avec photos et spécifications en seulement 5 minutes",
    sw: "Unda orodha za kina na picha na vipimo kwa dakika 5 tu",
  },
  "how_it_works.dealer_step_2_title": {
    en: "Receive Buyer Inquiries",
    ko: "구매자 문의 접수",
    fr: "Recevoir des demandes d'acheteurs",
    sw: "Pokea Maswali ya Mnunuzi",
  },
  "how_it_works.dealer_step_2_desc": {
    en: "Get instant notifications when buyers show interest in your vehicles",
    ko: "구매자가 차량에 관심을 보이면 즉시 알림을 받으세요",
    fr: "Recevez des notifications instantanées lorsque les acheteurs s'intéressent à vos véhicules",
    sw: "Pata arifa za papo hapo wanunuzi wanapoonyesha nia ya magari yako",
  },
  "how_it_works.dealer_step_3_title": {
    en: "Track Performance & Revenue",
    ko: "성과 및 수익 추적",
    fr: "Suivre les performances et les revenus",
    sw: "Fuatilia Utendaji na Mapato",
  },
  "how_it_works.dealer_step_3_desc": {
    en: "Monitor views, inquiries, and sales with powerful analytics dashboard",
    ko: "강력한 분석 대시보드로 조회수, 문의 및 판매를 모니터링하세요",
    fr: "Surveillez les vues, les demandes et les ventes avec un tableau de bord analytique puissant",
    sw: "Fuatilia maoni, maswali, na mauzo na dashibodi yenye nguvu ya uchambuzi",
  },

  // CTA Section
  "cta.title": {
    en: "Ready to Find Your Perfect Car?",
    ko: "완벽한 차를 찾을 준비가 되셨나요?",
    fr: "Prêt à trouver votre voiture parfaite ?",
    sw: "Tayari Kupata Gari Lako Kamili?",
  },
  "cta.subtitle": {
    en: "Join thousands of satisfied buyers who have found their dream vehicles through SK AutoSphere.",
    ko: "SK AutoSphere를 통해 꿈의 차를 찾은 수천 명의 만족한 구매자와 함께하세요.",
    fr: "Rejoignez des milliers d'acheteurs satisfaits qui ont trouvé le véhicule de leurs rêves.",
    sw: "Jiunge na maelfu ya wanunuzi walioridhika ambao wamepata magari yao ya ndoto.",
  },
  "cta.button_buy": {
    en: "Browse Cars",
    ko: "차량 보기",
    fr: "Parcourir les voitures",
    sw: "Vinjari Magari",
  },
  "cta.button_sell": {
    en: "Become a Dealer",
    ko: "딜러 되기",
    fr: "Devenir concessionnaire",
    sw: "Kuwa Muuzaji",
  },
}

// Simple translation function
export function t(key: string, locale: Locale): string {
  const entry = messages[key]
  if (!entry) return key
  return entry[locale] ?? entry.en ?? key
}

// Get all keys for a namespace
export function getNamespaceKeys(namespace: string): string[] {
  return Object.keys(messages).filter(key => key.startsWith(namespace + "."))
}

// Format currency based on locale
export function formatCurrency(amount: number, locale: Locale): string {
  const currencyMap: Record<Locale, string> = {
    en: "USD",
    ko: "KRW",
    fr: "EUR",
    sw: "KES",
  }

  return new Intl.NumberFormat(locale === "ko" ? "ko-KR" : locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: currencyMap[locale],
    minimumFractionDigits: 0,
  }).format(amount)
}

// Format date based on locale
export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(
    locale === "ko" ? "ko-KR" : locale === "fr" ? "fr-FR" : locale === "sw" ? "sw-KE" : "en-US"
  ).format(date)
}
