export type Language = {
  code: string;
  name: string;
  nativeName: string;
  rtl?: boolean;
};

export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "ur", name: "Urdu", nativeName: "اردو", rtl: true },
  { code: "ar", name: "Arabic", nativeName: "العربية", rtl: true },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "th", name: "Thai", nativeName: "ไทย" },
  { code: "fa", name: "Persian", nativeName: "فارسی", rtl: true },
  { code: "he", name: "Hebrew", nativeName: "עברית", rtl: true },

  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල" },

  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська" },
  { code: "cs", name: "Czech", nativeName: "Čeština" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina" },
  { code: "ro", name: "Romanian", nativeName: "Română" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά" },
  { code: "sv", name: "Swedish", nativeName: "Svenska" },
  { code: "no", name: "Norwegian", nativeName: "Norsk" },
  { code: "da", name: "Danish", nativeName: "Dansk" },
  { code: "fi", name: "Finnish", nativeName: "Suomi" },
  { code: "is", name: "Icelandic", nativeName: "Íslenska" },
  { code: "et", name: "Estonian", nativeName: "Eesti" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski" },
  { code: "sr", name: "Serbian", nativeName: "Српски" },
  { code: "bs", name: "Bosnian", nativeName: "Bosanski" },
  { code: "bg", name: "Bulgarian", nativeName: "Български" },
  { code: "mk", name: "Macedonian", nativeName: "Македонски" },
  { code: "sq", name: "Albanian", nativeName: "Shqip" },

  { code: "ca", name: "Catalan", nativeName: "Català" },
  { code: "gl", name: "Galician", nativeName: "Galego" },
  { code: "eu", name: "Basque", nativeName: "Euskara" },
  { code: "cy", name: "Welsh", nativeName: "Cymraeg" },
  { code: "ga", name: "Irish", nativeName: "Gaeilge" },
  { code: "mt", name: "Maltese", nativeName: "Malti" },
  { code: "lb", name: "Luxembourgish", nativeName: "Lëtzebuergesch" },

  { code: "af", name: "Afrikaans", nativeName: "Afrikaans" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu" },
  { code: "xh", name: "Xhosa", nativeName: "isiXhosa" },
  { code: "st", name: "Sesotho", nativeName: "Sesotho" },
  { code: "tn", name: "Tswana", nativeName: "Setswana" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá" },
  { code: "ig", name: "Igbo", nativeName: "Igbo" },
  { code: "ha", name: "Hausa", nativeName: "Hausa" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ" },
  { code: "so", name: "Somali", nativeName: "Soomaali" },
  { code: "rw", name: "Kinyarwanda", nativeName: "Kinyarwanda" },
  { code: "mg", name: "Malagasy", nativeName: "Malagasy" },

  { code: "fil", name: "Filipino", nativeName: "Filipino" },
  { code: "jv", name: "Javanese", nativeName: "Basa Jawa" },
  { code: "su", name: "Sundanese", nativeName: "Basa Sunda" },
  { code: "my", name: "Burmese", nativeName: "မြန်မာ" },
  { code: "km", name: "Khmer", nativeName: "ខ្មែរ" },
  { code: "lo", name: "Lao", nativeName: "ລາວ" },
  { code: "mn", name: "Mongolian", nativeName: "Монгол" },

  { code: "ka", name: "Georgian", nativeName: "ქართული" },
  { code: "hy", name: "Armenian", nativeName: "Հայերեն" },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycan" },
  { code: "kk", name: "Kazakh", nativeName: "Қазақша" },
  { code: "ky", name: "Kyrgyz", nativeName: "Кыргызча" },
  { code: "uz", name: "Uzbek", nativeName: "Oʻzbekcha" },
  { code: "tg", name: "Tajik", nativeName: "Тоҷикӣ" },
  { code: "tk", name: "Turkmen", nativeName: "Türkmençe" },

  { code: "ps", name: "Pashto", nativeName: "پښتو", rtl: true },
  { code: "ku", name: "Kurdish", nativeName: "Kurdî" },
  { code: "sd", name: "Sindhi", nativeName: "سنڌي", rtl: true },

  { code: "be", name: "Belarusian", nativeName: "Беларуская" },
  { code: "mo", name: "Moldovan", nativeName: "Moldovenească" },

  { code: "ht", name: "Haitian Creole", nativeName: "Kreyòl Ayisyen" },
  { code: "eo", name: "Esperanto", nativeName: "Esperanto" },
  { code: "la", name: "Latin", nativeName: "Latina" },

  { code: "mi", name: "Maori", nativeName: "Māori" },
  { code: "sm", name: "Samoan", nativeName: "Gagana Samoa" },
  { code: "haw", name: "Hawaiian", nativeName: "ʻŌlelo Hawaiʻi" },

  { code: "ceb", name: "Cebuano", nativeName: "Cebuano" },
  { code: "hmn", name: "Hmong", nativeName: "Hmoob" },

  { code: "yi", name: "Yiddish", nativeName: "ייִדיש", rtl: true },
  { code: "co", name: "Corsican", nativeName: "Corsu" },
  { code: "fy", name: "Frisian", nativeName: "Frysk" },

  { code: "ny", name: "Chichewa", nativeName: "Chichewa" },
  { code: "sn", name: "Shona", nativeName: "ChiShona" },

  { code: "gd", name: "Scottish Gaelic", nativeName: "Gàidhlig" },

  { code: "bho", name: "Bhojpuri", nativeName: "भोजपुरी" },
  { code: "mai", name: "Maithili", nativeName: "मैथिली" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्" },
  { code: "doi", name: "Dogri", nativeName: "डोगरी" },

  { code: "gom", name: "Konkani", nativeName: "कोंकणी" },
  { code: "mni", name: "Manipuri", nativeName: "ꯃꯤꯇꯩ ꯂꯣꯟ" },

  { code: "ak", name: "Akan", nativeName: "Akan" },
  { code: "ee", name: "Ewe", nativeName: "Eʋegbe" },
  { code: "lg", name: "Luganda", nativeName: "Luganda" },
  { code: "om", name: "Oromo", nativeName: "Afaan Oromoo" },
  { code: "ti", name: "Tigrinya", nativeName: "ትግርኛ" },

  { code: "dv", name: "Dhivehi", nativeName: "ދިވެހި", rtl: true },
  { code: "ug", name: "Uyghur", nativeName: "ئۇيغۇرچە", rtl: true },

  { code: "ckb", name: "Kurdish Sorani", nativeName: "کوردی", rtl: true },
  { code: "ilo", name: "Ilocano", nativeName: "Ilocano" },
  { code: "lus", name: "Mizo", nativeName: "Mizo ṭawng" },

  { code: "qu", name: "Quechua", nativeName: "Runasimi" },
  { code: "ay", name: "Aymara", nativeName: "Aymar aru" },
  { code: "gn", name: "Guarani", nativeName: "Avañe'ẽ" },

  { code: "tt", name: "Tatar", nativeName: "Татарча" },
  { code: "ba", name: "Bashkir", nativeName: "Башҡортса" },

  { code: "fo", name: "Faroese", nativeName: "Føroyskt" },
  { code: "br", name: "Breton", nativeName: "Brezhoneg" },
];

export const defaultLanguageCode = "en";

export const defaultLanguage =
  languages.find(
    (language) => language.code === defaultLanguageCode
  ) ?? languages[0];

export function getLanguage(code?: string | null) {
  if (!code) return defaultLanguage;

  return (
    languages.find(
      (language) =>
        language.code.toLowerCase() === code.toLowerCase()
    ) ?? defaultLanguage
  );
}

export function isRtlLanguage(code?: string | null) {
  return Boolean(getLanguage(code).rtl);
}

