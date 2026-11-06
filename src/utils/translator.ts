import { useEffect } from "react";
import type { LangCode } from "@/types";
import { useStore } from "@/store/useStore";

// Comprehensive phrase and term dictionary for Hindi
const HINDI_PHRASES: Record<string, string> = {
  // Brand & Slogans
  "Every Jewel Has a Story.": "हर गहने की एक कहानी है।",
  "Discover India's finest jewelry brands and create something uniquely yours.": "भारत के बेहतरीन ज्वेलरी ब्रांड खोजें और अपना अनोखा गहना बनाएं।",
  "India's Ultimate Jewelry Marketplace": "भारत का प्रमुख ज्वेलरी मार्केटप्लेस",
  "India's ultimate jewelry marketplace — 20 heritage brands, a live customization studio and the nation's finest karigars in one place.": "भारत का प्रमुख ज्वेलरी मार्केटप्लेस — 20 पारंपरिक ब्रांड्स, लाइव कस्टमाइज़ेशन स्टूडियो और देश के सर्वश्रेष्ठ कारीगर एक ही स्थान पर।",
  "Your Heritage. Your Style. Your Story.": "आपकी विरासत। आपकी शैली। आपकी कहानी।",
  "All rights reserved. Frontend prototype — all data is simulated.": "सर्वाधिकार सुरक्षित। प्रोटोटाइप — सभी डेटा सिम्युलेटेड है।",

  // Navigation & General UI
  "Home": "होम",
  "Brands": "ब्रांड्स",
  "Shop": "खरीदें",
  "Customize": "कस्टमाइज़",
  "Bridal Studio": "ब्राइडल स्टूडियो",
  "Collections": "कलेक्शन",
  "Our Crafts": "हमारी कारीगरी",
  "Studios": "स्टूडियो",
  "Studios & Tools": "स्टूडियो व टूल्स",
  "Search": "खोजें",
  "Wishlist": "विशलिस्ट",
  "Cart": "कार्ट",
  "Account": "खाता",
  "My Account": "मेरा खाता",
  "My Dashboard": "मेरा डैशबोर्ड",
  "My Orders": "मेरे ऑर्डर",
  "Saved Designs": "सहेजे गए डिज़ाइन",
  "Sign out": "साइन आउट",
  "Sign in": "साइन इन करें",
  "Create account": "खाता बनाएं",
  "Welcome back": "पुनः स्वागत है",
  "Portals (demo)": "पोर्टल (डेमो)",
  "Admin": "एडमिन",
  "Brand Owner": "ब्रांड ओनर",
  "Artisan": "कारीगर",
  "Admin Portal": "एडमिन पोर्टल",
  "Brand Owner Portal": "ब्रांड ओनर पोर्टल",
  "Artisan Workspace": "कारीगर वर्कस्पेस",
  "Customer Care": "ग्राहक सेवा",
  "Track Order": "ऑर्डर ट्रैक करें",
  "Gold calculator": "गोल्ड कैलकुलेटर",
  "Today's gold rate": "आज का सोने का भाव",
  "Gold rate today": "आज का सोने का भाव",

  // Trust & Assurances
  "BIS Hallmarked": "बीआईएस हॉलमार्क",
  "Certified purity on every piece": "हर गहने पर प्रमाणित शुद्धता",
  "Lifetime Exchange": "आजीवन विनिमय",
  "Transparent buy-back value": "पारदर्शी बायबैक मूल्य",
  "Insured Shipping": "बीमित शिपिंग",
  "Free above ₹10,000": "₹10,000 से अधिक पर मुफ्त डिलीवरी",
  "Certified Gems": "प्रमाणित रत्न",
  "IGI & GIA graded stones": "आईजीआई व जीआईए प्रमाणित रत्न",
  "Free insured shipping on orders above ₹10,000": "₹10,000 से अधिक के ऑर्डर पर मुफ्त बीमित शिपिंग",
  "Flat 10% off on making charges — code SHRI10": "मेकिंग चार्ज पर फ्लैट 10% छूट — कोड SHRI10",
  "New: Akshaya Tritiya Gold Collection is live": "नया: अक्षय तृतीया गोल्ड कलेक्शन लाइव है",

  // Sections
  "Shop by Category": "श्रेणी अनुसार खरीदें",
  "Find Your Perfect Piece": "अपना पसंदीदा गहना खोजें",
  "From everyday gold to bridal heirlooms — ten ways into the world of Indian jewelry.": "रोजमर्रा के सोने से लेकर दुल्हन के आभूषणों तक — भारतीय आभूषणों का वैभव।",
  "The SHRIING Ecosystem": "श्रींग इकोसिस्टम",
  "Explore 20 Indian Brands": "20 भारतीय ब्रांड्स खोजें",
  "Each house has its own palette, philosophy and craft. Step into a storefront and find the one that speaks to you.": "प्रत्येक घराने की अपनी पहचान, दर्शन और कारीगरी है। अपने मनपसंद स्टोर में जाएं।",
  "View all brands with filters": "फ़िल्टर के साथ सभी ब्रांड्स देखें",
  "Customization Studio": "कस्टमाइज़ेशन स्टूडियो",
  "Customize Your Jewelry": "अपना गहना कस्टमाइज़ करें",
  "Change metal, stone and style — watch the design and the price update in real time.": "धातु, रत्न और स्टाइल बदलें — डिज़ाइन और मूल्य तुरंत देखें।",
  "Live preview": "लाइव प्रीव्यू",
  "Metal colour": "धातु का रंग",
  "Stone": "रत्न",
  "Estimated price": "अनुमानित मूल्य",
  "Open Studio": "स्टूडियो खोलें",
  "Start designing": "डिज़ाइन शुरू करें",
  "Design your ring": "अपनी अंगूठी डिज़ाइन करें",
  "Create your necklace": "अपना हार बनाएं",
  "Customize your jhumka": "झुमके कस्टमाइज़ करें",
  "Personalize your pendant": "पेंडेंट पर्सनलाइज़ करें",
  "The Bridal Collection": "शाही दुल्हन संग्रह",
  "Royal Jewels for Your Royal Day": "आपके शाही दिन के लिए शाही आभूषण",
  "Seven regional bridal traditions, one studio. Choose your style, select the components, match your lehenga and build a complete trousseau within your budget.": "सात पारंपरिक ब्राइडल शैलियां, एक स्टूडियो। अपने बजट में संपूर्ण ब्राइडल सेट तैयार करें।",
  "Build Your Bridal Set": "ब्राइडल सेट बनाएं",
  "Shop bridal": "ब्राइडल खरीदें",
  "Karigar Heritage": "कारीगर विरासत",
  "Discover Regional Craftsmanship": "क्षेत्रीय हस्तशिल्प की खोज करें",
  "Behind every SHRIING jewel is a region, a technique and a pair of skilled hands.": "हर श्रींग आभूषण के पीछे एक क्षेत्र, प्राचीन तकनीक और हुनरमंद हाथ हैं।",
  "All crafts": "सभी शिल्प देखें",
  "Most Loved": "सबसे पसंदीदा",
  "Trending Now": "ट्रेंडिंग आभूषण",
  "Shop all": "सभी देखें",
  "Shop All": "सभी देखें",
  "Shop All Jewelry": "सभी आभूषण देखें",
  "Chat with the Stylist": "स्टाइलिस्ट से बात करें",
  "Lehenga Match Studio": "लहंगा मैच स्टूडियो",
  "Personalized Gifting": "पर्सनलाइज़्ड उपहार",
  "Gifts That Say Their Name": "नाम और भावनाओं से जुड़े उपहार",
  "Add a name, date, birthstone and a handwritten note — wrapped in our signature box.": "नाम, जन्म रत्न और हस्तलिखित संदेश जोड़ें — हमारे विशेष उपहार बॉक्स में।",
  "Love Notes": "ग्राहकों के विचार",
  "Stories From Our Customers": "हमारे ग्राहकों के अनुभव",
  "Our Brands": "हमारे ब्रांड्स",
  "Explore": "एक्सप्लोर करें",

  // Studio descriptions
  "AI Jewelry Stylist": "एआई ज्वेलरी स्टाइलिस्ट",
  "Outfit-matched recommendations": "परिधान अनुसार आभूषण सुझाव",
  "Upload your outfit, get a set": "लहंगा फोटो अपलोड करें, सेट पाएं",
  "Heirloom Redesign": "विरासत री-डिज़ाइन",
  "Reimagine old family jewelry": "पुराने पारिवारिक गहनों को नया रूप दें",
  "Apni Kahani": "अपनी कहानी",
  "Messages, handwriting & soundwaves": "संदेश, लिखावट व ध्वनि तरंगें",
  "Virtual Try-On": "वर्चुअल ट्राई-ऑन",
  "See jewelry on you": "गहने पहनकर खुद पर देखें",
  "8 occasions, endless meaning": "8 खास मौके, अनमोल यादें",
  "Gold Price Calculator": "स्वर्ण मूल्य कैलकुलेटर",
  "Live rate, GST & making": "लाइव भाव, जीएसटी व मेकिंग",
  "Old Gold Exchange": "पुराना सोना विनिमय",
  "Indicative exchange value": "सटीक और पारदर्शी एक्सचेंज भाव",
  "Compare Jewelry": "गहनों की तुलना",
  "Side-by-side comparison": "आमने-सामने विस्तृत तुलना",
  "Convertible Jewelry": "परिवर्तनीय आभूषण",
  "One jewel, many ways to wear": "एक गहना, पहनने के अनेक अंदाज़",
  "Wedding Registry": "विवाह उपहार रजिस्ट्री",
  "Curate your bridal gift list": "शादी के उपहारों की सूची बनाएं",
  "Karigar Stories": "कारीगर की कहानियां",
  "Meet the hands behind the gold": "सोने को तराशने वाले हाथों से मिलें",

  // Product Card, Filters & Shop
  "New": "नया",
  "Trending": "ट्रेंडिंग",
  "Sold out": "बिक चुका है",
  "In Stock": "उपलब्ध",
  "Out of Stock": "स्टॉक में नहीं",
  "Quick view": "त्वरित झलक",
  "Add to cart": "कार्ट में जोड़ें",
  "Add to Cart": "कार्ट में जोड़ें",
  "Added to cart": "कार्ट में जोड़ा गया",
  "Buy Now": "अभी खरीदें",
  "Buy now": "अभी खरीदें",
  "View details": "विवरण देखें",
  "Compare": "तुलना करें",
  "Filters": "फ़िल्टर",
  "Filter": "फ़िल्टर",
  "Clear all": "सभी हटाएं",
  "Any weight": "कोई भी वजन",
  "Under 5 g": "5 ग्राम से कम",
  "5 – 20 g": "5 – 20 ग्राम",
  "20 – 60 g": "20 – 60 ग्राम",
  "60 g & above": "60 ग्राम और अधिक",
  "Sort by": "क्रमबद्ध करें",
  "Featured": "विशेष",
  "Price: Low to high": "मूल्य: कम से अधिक",
  "Price: High to low": "मूल्य: अधिक से कम",
  "Highest rated": "सर्वोच्च रेटिंग",
  "Categories": "श्रेणियां",
  "Category": "श्रेणी",
  "Metal": "धातु",
  "Purity": "शुद्धता",
  "Occasion": "अवसर",
  "Craft": "कारीगरी / शिल्प",
  "Price Range": "मूल्य सीमा",
  "Max price": "अधिकतम मूल्य",
  "Weight": "वजन",
  "Ratings": "रेटिंग्स",

  // Jewelry Categories & Types
  "Necklace": "हार (नेकलेस)",
  "Necklaces": "हार (नेकलेस)",
  "Earrings": "झुमके व बालियां",
  "Ring": "अंगूठी",
  "Rings": "अंगूठियां",
  "Bangle": "कंगन",
  "Bangles": "कंगन व चूड़ियां",
  "Bracelet": "ब्रेसलेट",
  "Bracelets": "ब्रेसलेट",
  "Pendant": "पेंडेंट",
  "Pendants": "पेंडेंट",
  "Choker": "चोकर हार",
  "Chokers": "चोकर हार",
  "Jhumka": "झुमका",
  "Jhumkas": "झुमके",
  "Mangalsutra": "मंगलसूत्र",
  "Mangalsutras": "मंगलसूत्र",
  "Nose Pin": "नथ / नोज पिन",
  "Nath": "नथ",
  "Maang Tikka": "मांग टीका",
  "Payal": "पायल",
  "Anklet": "पायल",
  "Waist Belt": "कमरबंद",

  // Metals & Materials
  "Gold": "सोना (गोल्ड)",
  "Diamond": "हीरा (डायमंड)",
  "Silver": "चांदी (सिल्वर)",
  "Platinum": "प्लैटिनम",
  "Yellow Gold": "पीला सोना",
  "Rose Gold": "रोज़ गोल्ड",
  "White Gold": "सफेद सोना",
  "Kundan": "कुंदन",
  "Polki": "पोलकी",
  "Kundan / Polki": "कुंदन / पोलकी",
  "Temple": "मंदिर आभूषण (टेंपल)",
  "Temple Jewelry": "मंदिर आभूषण",
  "Meenakari": "मीनाकारी",
  "Jadau": "जड़ाऊ",
  "Thewa": "थेवा कला",
  "Tarakasi": "तारकशी (फिलीग्री)",
  "Pachchikam": "पच्चीकम",
  "Gemstone": "रत्न (जेमस्टोन)",
  "Gemstones": "रत्न",
  "Ruby": "माणिक (रूबी)",
  "Emerald": "पन्ना (एमराल्ड)",
  "Sapphire": "नीलम (सफायर)",
  "Pearl": "सच्चे मोती (पर्ल)",
  "Pearls": "मोती",
  "Navratna": "नवरत्न",
  "Moissanite": "मोइसानाईट",

  // Occasions
  "Bridal": "दुल्हन (ब्राइडल)",
  "Wedding": "विवाह",
  "Festive": "त्योहार (उत्सव)",
  "Daily Wear": "दैनिक उपयोग",
  "Party": "पार्टी व उत्सव",
  "Engagement": "सगाई",
  "Gift": "उपहार",
  "Heritage": "विरासत",

  // Cart & Checkout
  "Shopping Cart": "शॉपिंग कार्ट",
  "Your Cart": "आपकी कार्ट",
  "Your cart is empty": "आपकी कार्ट खाली है",
  "Continue Shopping": "खरीदारी जारी रखें",
  "Order Summary": "ऑर्डर विवरण",
  "Subtotal": "उप-योग",
  "Estimated GST": "अनुमानित जीएसटी (3%)",
  "Shipping": "शिपिंग",
  "Free": "मुफ्त",
  "Coupon": "कूपन",
  "Apply coupon": "कूपन लागू करें",
  "Apply": "लागू करें",
  "Remove": "हटाएं",
  "Total": "कुल राशि",
  "Proceed to Checkout": "चेकआउट के लिए आगे बढ़ें",
  "Checkout": "चेकआउट",
  "Shipping Address": "शिपिंग का पता",
  "Full name": "पूरा नाम",
  "Email": "ईमेल पता",
  "Mobile": "मोबाइल नंबर",
  "Address": "पता",
  "City": "शहर",
  "State": "राज्य",
  "PIN Code": "पिन कोड",
  "Payment Method": "भुगतान विधि",
  "Cash on Delivery": "कैश ऑन डिलीवरी",
  "Online Payment": "ऑनलाइन भुगतान (यूपीआई / कार्ड)",
  "Place Order": "ऑर्डर दें",
  "Order Confirmation": "ऑर्डर की पुष्टि",

  // Search & Modals
  "Products": "उत्पाद",
  "Trending now": "अभी ट्रेंडिंग",
  "No matching products. Try another keyword.": "कोई उत्पाद नहीं मिला। कृपया दूसरा शब्द खोजें।",
  "Search jewelry, brands, crafts — try 'kundan' or 'ring'": "गहने, ब्रांड, शिल्प खोजें — जैसे 'कुंदन' या 'अंगूठी'",

  // Policies & Footer
  "Privacy Policy": "गोपनीयता नीति",
  "Terms of Service": "सेवा की शर्तें",
  "Shipping & Returns": "शिपिंग और वापसी",
  "BIS Hallmark Policy": "बीआईएस हॉलमार्क नीति",
  "Johari Bazaar, Jaipur 302003": "जौहरी बाज़ार, जयपुर 302003",
  "Back to storefront": "स्टोर पर वापस जाएं",
};

// Common word translations for fallback token replacement
const HINDI_WORDS: [RegExp, string][] = [
  [/\b(\d+)\s*%\s*off\b/gi, "$1% छूट"],
  [/\b(\d+(\.\d+)?)\s*g\b/gi, "$1 ग्राम"],
  [/\b(\d+(\.\d+)?)\s*carats?\b/gi, "$1 कैरेट"],
  [/\b(\d+)\s*reviews?\b/gi, "$1 समीक्षाएं"],
  [/\b(\d+)\s*days?\b/gi, "$1 दिन"],
  [/\bFree\s+delivery\b/gi, "मुफ्त डिलीवरी"],
  [/\bFree\s+shipping\b/gi, "मुफ्त शिपिंग"],
  [/\bIn\s+Stock\b/gi, "उपलब्ध"],
  [/\bOut\s+of\s+Stock\b/gi, "स्टॉक में नहीं"],
  [/\bSold\s+out\b/gi, "बिक चुका है"],
  [/\bAdd\s+to\s+cart\b/gi, "कार्ट में जोड़ें"],
  [/\bQuick\s+view\b/gi, "त्वरित झलक"],
  [/\bCustomize\b/gi, "कस्टमाइज़"],
  [/\bExplore\b/gi, "देखें"],
  [/\bShop\s+now\b/gi, "अभी खरीदें"],
  [/\bBuy\s+now\b/gi, "अभी खरीदें"],
  [/\bDetails\b/gi, "विवरण"],
  [/\bView\s+all\b/gi, "सभी देखें"],
  [/\bSave\b/gi, "सहेजें"],
  [/\bDelete\b/gi, "हटाएं"],
  [/\bEdit\b/gi, "संपादित करें"],
  [/\bCancel\b/gi, "रद्द करें"],
  [/\bConfirm\b/gi, "पुष्टि करें"],
  [/\bTotal\b/gi, "कुल"],
  [/\bSubtotal\b/gi, "उप-योग"],
  [/\bEstimated\b/gi, "अनुमानित"],
  [/\bPrice\b/gi, "मूल्य"],
  [/\bColor\b/gi, "रंग"],
  [/\bSize\b/gi, "आकार"],
  [/\bWeight\b/gi, "वजन"],
  [/\bPurity\b/gi, "शुद्धता"],
  [/\bCollection\b/gi, "कलेक्शन"],
  [/\bHandcrafted\b/gi, "हस्तनिर्मित"],
  [/\bTrending\b/gi, "ट्रेंडिंग"],
  [/\bNew\b/gi, "नया"],
  [/\bReviews\b/gi, "समीक्षाएं"],
  [/\bRating\b/gi, "रेटिंग"],
  [/\bOverview\b/gi, "अवलोकन"],
  [/\bSpecifications\b/gi, "विशेषताएं"],
  [/\bDescription\b/gi, "विवरण"],
  [/\bCertified\b/gi, "प्रमाणित"],
  [/\bHeritage\b/gi, "विरासत"],
  [/\bTraditional\b/gi, "पारंपरिक"],
  [/\bContemporary\b/gi, "आधुनिक"],
  [/\bKarigar\b/gi, "कारीगर"],
  [/\bArtisan\b/gi, "कारीगर"],
  [/\bStudio\b/gi, "स्टूडियो"],
  [/\bRing\b/gi, "अंगूठी"],
  [/\bRings\b/gi, "अंगूठियां"],
  [/\bNecklace\b/gi, "हार"],
  [/\bNecklaces\b/gi, "हार"],
  [/\bEarrings\b/gi, "झुमके"],
  [/\bBangle\b/gi, "कंगन"],
  [/\bBangles\b/gi, "कंगन"],
  [/\bBracelet\b/gi, "ब्रेसलेट"],
  [/\bPendant\b/gi, "पेंडेंट"],
  [/\bChoker\b/gi, "चोकर"],
  [/\bGold\b/gi, "सोना"],
  [/\bDiamond\b/gi, "हीरा"],
  [/\bDiamonds\b/gi, "हीरे"],
  [/\bSilver\b/gi, "चांदी"],
  [/\bPlatinum\b/gi, "प्लैटिनम"],
  [/\bRuby\b/gi, "माणिक"],
  [/\bEmerald\b/gi, "पन्ना"],
  [/\bSapphire\b/gi, "नीलम"],
  [/\bPearl\b/gi, "मोती"],
  [/\bPearls\b/gi, "मोती"],
];

// Helper to translate any string to the target language
export function translateText(text: string, lang: LangCode): string {
  if (lang === "en" || !text) return text;

  // Trim to test
  const leading = text.match(/^\s*/)?.[0] ?? "";
  const trailing = text.match(/\s*$/)?.[0] ?? "";
  const trimmed = text.trim();

  if (!trimmed) return text;

  if (lang === "hi") {
    // 1. Direct exact phrase match
    if (HINDI_PHRASES[trimmed]) {
      return leading + HINDI_PHRASES[trimmed] + trailing;
    }

    // 2. Case-insensitive exact match
    const lowerTrimmed = trimmed.toLowerCase();
    for (const [key, val] of Object.entries(HINDI_PHRASES)) {
      if (key.toLowerCase() === lowerTrimmed) {
        return leading + val + trailing;
      }
    }

    // 3. Fallback regex / word replacements
    let result = trimmed;
    let modified = false;

    // Check if contains key phrases to replace
    for (const [key, val] of Object.entries(HINDI_PHRASES)) {
      if (key.length > 4 && result.includes(key)) {
        result = result.split(key).join(val);
        modified = true;
      }
    }

    // Word replacements
    for (const [regex, replacement] of HINDI_WORDS) {
      if (regex.test(result)) {
        result = result.replace(regex, replacement);
        modified = true;
      }
    }

    if (modified) {
      return leading + result + trailing;
    }
  }

  return text;
}

// Global WeakMap to store original un-translated text for DOM nodes
const originalTextMap = new WeakMap<Node, string>();
const originalPlaceholderMap = new WeakMap<Element, string>();
const originalTitleMap = new WeakMap<Element, string>();

let isTranslatingDOM = false;

function translateDOMTree(root: Element, lang: LangCode) {
  if (isTranslatingDOM) return;
  isTranslatingDOM = true;

  try {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (tag === "script" || tag === "style" || tag === "noscript" || tag === "code") {
          return NodeFilter.FILTER_REJECT;
        }
        if (node.nodeValue && node.nodeValue.trim().length > 0) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      },
    });

    let currentNode = walker.nextNode();
    while (currentNode) {
      const val = currentNode.nodeValue || "";

      if (lang === "en") {
        const orig = originalTextMap.get(currentNode);
        if (orig !== undefined && currentNode.nodeValue !== orig) {
          currentNode.nodeValue = orig;
        }
      } else {
        let orig = originalTextMap.get(currentNode);
        if (orig === undefined) {
          orig = val;
          originalTextMap.set(currentNode, orig);
        }

        const translated = translateText(orig, lang);
        if (translated !== currentNode.nodeValue) {
          currentNode.nodeValue = translated;
        }
      }

      currentNode = walker.nextNode();
    }

    // Also translate input placeholders and buttons/links title attributes
    const inputs = root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[placeholder], textarea[placeholder]");
    inputs.forEach((el) => {
      if (lang === "en") {
        const orig = originalPlaceholderMap.get(el);
        if (orig !== undefined && el.placeholder !== orig) {
          el.placeholder = orig;
        }
      } else {
        let orig = originalPlaceholderMap.get(el);
        if (orig === undefined) {
          orig = el.placeholder;
          originalPlaceholderMap.set(el, orig);
        }
        const translated = translateText(orig, lang);
        if (translated !== el.placeholder) {
          el.placeholder = translated;
        }
      }
    });

    const titled = root.querySelectorAll<HTMLElement>("[title], [aria-label]");
    titled.forEach((el) => {
      const title = el.getAttribute("title");
      if (title) {
        if (lang === "en") {
          const orig = originalTitleMap.get(el);
          if (orig !== undefined) el.setAttribute("title", orig);
        } else {
          let orig = originalTitleMap.get(el);
          if (orig === undefined) {
            orig = title;
            originalTitleMap.set(el, orig);
          }
          el.setAttribute("title", translateText(orig, lang));
        }
      }
    });
  } finally {
    isTranslatingDOM = false;
  }
}

/**
 * Universal Full-Site Translation Hook & Component
 * Translates the full DOM tree and watches for dynamic mutations and route changes.
 */
export function FullSiteTranslator() {
  const lang = useStore((s) => s.language);

  useEffect(() => {
    // Update html lang attribute
    document.documentElement.lang = lang;

    const root = document.getElementById("root");
    if (!root) return;

    // Run initial translation
    translateDOMTree(root, lang);

    // Watch for dynamic route transitions, renders, and modals
    const observer = new MutationObserver((mutations) => {
      if (isTranslatingDOM) return;
      let shouldTranslate = false;

      for (const m of mutations) {
        if (m.type === "childList" && m.addedNodes.length > 0) {
          shouldTranslate = true;
          break;
        }
        if (m.type === "characterData") {
          const target = m.target;
          const orig = originalTextMap.get(target);
          if (orig === undefined) {
            shouldTranslate = true;
            break;
          }
        }
      }

      if (shouldTranslate) {
        translateDOMTree(root, lang);
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [lang]);

  return null;
}
