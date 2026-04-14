/* Brandivibe Maps Scraper — data file
   ─────────────────────────────────────
   Static dropdown data for the popup:
   - BUSINESS_CATEGORIES: ~70 common Google Maps business types
   - COUNTRIES: all ~200 countries (ISO 3166-1)
   - STATES_BY_COUNTRY: states/regions for the top 8 countries; any
     country not listed here shows a free-text state input instead.

   Plain global arrays so popup.js can use them without ES module
   imports (easier for MV3 popup context).
*/

const BUSINESS_CATEGORIES = [
  // Agencies & creative
  "Marketing agency",
  "Web design agency",
  "Digital agency",
  "Branding agency",
  "PR agency",
  "SEO agency",
  "Advertising agency",
  "Video production company",
  "Photography studio",
  "Graphic design studio",
  "Content agency",
  "Copywriting agency",

  // Professional services
  "Law firm",
  "Accounting firm",
  "Consulting firm",
  "Financial advisor",
  "Insurance agency",
  "Real estate agency",
  "Architecture firm",
  "Interior design firm",
  "Immigration consultant",

  // Health & wellness
  "Dental clinic",
  "Medical clinic",
  "Chiropractor",
  "Physiotherapy clinic",
  "Dermatologist",
  "Optometrist",
  "Veterinarian",
  "Spa",
  "Yoga studio",
  "Pilates studio",
  "Gym",
  "Personal trainer",

  // Food & hospitality
  "Restaurant",
  "Cafe",
  "Coffee shop",
  "Bakery",
  "Bar",
  "Brewery",
  "Winery",
  "Food truck",
  "Catering service",
  "Boutique hotel",
  "Bed and breakfast",

  // Retail
  "Boutique clothing store",
  "Jewelry store",
  "Bookstore",
  "Florist",
  "Wine shop",
  "Gift shop",
  "Art gallery",

  // Trades & home services
  "Plumber",
  "Electrician",
  "HVAC contractor",
  "Landscaper",
  "Roofing contractor",
  "General contractor",
  "Moving company",
  "Cleaning service",
  "Pest control",
  "Locksmith",

  // Auto
  "Auto repair",
  "Car dealership",
  "Auto detailing",
  "Body shop",

  // Beauty
  "Hair salon",
  "Barbershop",
  "Nail salon",
  "Makeup artist",

  // Events
  "Wedding photographer",
  "Wedding planner",
  "Wedding venue",
  "Event planner",

  // Print / other
  "Print shop",
  "Sign maker",
  "Tailor",
  "Dry cleaner",
];

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
  "Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Cyprus","Czechia",
  "Denmark","Djibouti","Dominica","Dominican Republic",
  "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
  "Fiji","Finland","France",
  "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
  "Haiti","Honduras","Hungary",
  "Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy",
  "Jamaica","Japan","Jordan",
  "Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan",
  "Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
  "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
  "Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway",
  "Oman",
  "Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
  "Qatar",
  "Romania","Russia","Rwanda",
  "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
  "Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
  "Vanuatu","Vatican City","Venezuela","Vietnam",
  "Yemen",
  "Zambia","Zimbabwe"
];

const STATES_BY_COUNTRY = {
  "United States": [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
  ],
  "Canada": [
    "Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador","Northwest Territories","Nova Scotia","Nunavut","Ontario","Prince Edward Island","Quebec","Saskatchewan","Yukon"
  ],
  "United Kingdom": [
    "England","Scotland","Wales","Northern Ireland"
  ],
  "Australia": [
    "Australian Capital Territory","New South Wales","Northern Territory","Queensland","South Australia","Tasmania","Victoria","Western Australia"
  ],
  "Germany": [
    "Baden-Württemberg","Bavaria","Berlin","Brandenburg","Bremen","Hamburg","Hesse","Lower Saxony","Mecklenburg-Vorpommern","North Rhine-Westphalia","Rhineland-Palatinate","Saarland","Saxony","Saxony-Anhalt","Schleswig-Holstein","Thuringia"
  ],
  "India": [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"
  ],
  "Brazil": [
    "Acre","Alagoas","Amapá","Amazonas","Bahia","Ceará","Distrito Federal","Espírito Santo","Goiás","Maranhão","Mato Grosso","Mato Grosso do Sul","Minas Gerais","Pará","Paraíba","Paraná","Pernambuco","Piauí","Rio de Janeiro","Rio Grande do Norte","Rio Grande do Sul","Rondônia","Roraima","Santa Catarina","São Paulo","Sergipe","Tocantins"
  ],
  "Mexico": [
    "Aguascalientes","Baja California","Baja California Sur","Campeche","Chiapas","Chihuahua","Coahuila","Colima","Durango","Guanajuato","Guerrero","Hidalgo","Jalisco","Mexico City","Michoacán","Morelos","Nayarit","Nuevo León","Oaxaca","Puebla","Querétaro","Quintana Roo","San Luis Potosí","Sinaloa","Sonora","State of Mexico","Tabasco","Tamaulipas","Tlaxcala","Veracruz","Yucatán","Zacatecas"
  ],
};
