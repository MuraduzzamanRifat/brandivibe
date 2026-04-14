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

/**
 * Top cities per state/region. Used for HTML5 <datalist> autocomplete on
 * the city input — user sees suggestions as they type, but any city not in
 * the list still works because the input remains free-text.
 *
 * Entries are keyed by "Country|State" (or "Country|*" for countries with
 * no state breakdown) so the lookup is deterministic.
 */
const CITIES_BY_STATE_KEY = {
  // ─── United States ───
  "United States|Alabama": ["Birmingham","Montgomery","Mobile","Huntsville","Tuscaloosa","Auburn","Hoover","Decatur"],
  "United States|Alaska": ["Anchorage","Fairbanks","Juneau","Wasilla","Sitka","Ketchikan"],
  "United States|Arizona": ["Phoenix","Tucson","Mesa","Chandler","Scottsdale","Glendale","Gilbert","Tempe","Peoria","Flagstaff","Surprise","Yuma"],
  "United States|Arkansas": ["Little Rock","Fayetteville","Fort Smith","Springdale","Jonesboro","Rogers","Bentonville","Hot Springs"],
  "United States|California": ["Los Angeles","San Diego","San Jose","San Francisco","Fresno","Sacramento","Long Beach","Oakland","Bakersfield","Anaheim","Santa Ana","Riverside","Stockton","Irvine","Chula Vista","Fremont","Santa Clarita","San Bernardino","Modesto","Oxnard","Fontana","Moreno Valley","Glendale","Huntington Beach","Santa Rosa","Rancho Cucamonga","Oceanside","Garden Grove","Santa Clara","Palo Alto","Berkeley","Pasadena","Sunnyvale","Mountain View","Santa Monica","Beverly Hills","Malibu","Napa","Carmel","Monterey","Santa Barbara"],
  "United States|Colorado": ["Denver","Colorado Springs","Aurora","Fort Collins","Lakewood","Thornton","Arvada","Westminster","Pueblo","Boulder","Centennial","Greeley","Longmont","Loveland","Broomfield"],
  "United States|Connecticut": ["Bridgeport","New Haven","Stamford","Hartford","Waterbury","Norwalk","Danbury","New Britain","Greenwich","West Hartford"],
  "United States|Delaware": ["Wilmington","Dover","Newark","Middletown","Smyrna"],
  "United States|District of Columbia": ["Washington"],
  "United States|Florida": ["Jacksonville","Miami","Tampa","Orlando","St. Petersburg","Hialeah","Tallahassee","Fort Lauderdale","Port St. Lucie","Cape Coral","Pembroke Pines","Hollywood","Gainesville","Miramar","Coral Springs","Clearwater","West Palm Beach","Pompano Beach","Lakeland","Miami Beach","Boca Raton","Sarasota","Daytona Beach","Naples","Key West"],
  "United States|Georgia": ["Atlanta","Augusta","Columbus","Macon","Savannah","Athens","Sandy Springs","Roswell","Johns Creek","Albany","Warner Robins","Alpharetta","Marietta","Smyrna","Valdosta","Brookhaven","Dunwoody"],
  "United States|Hawaii": ["Honolulu","Hilo","Kailua","Kaneohe","Waipahu","Pearl City"],
  "United States|Idaho": ["Boise","Meridian","Nampa","Idaho Falls","Pocatello","Caldwell","Coeur d'Alene","Twin Falls"],
  "United States|Illinois": ["Chicago","Aurora","Joliet","Naperville","Rockford","Springfield","Elgin","Peoria","Waukegan","Champaign","Bloomington","Decatur","Evanston","Arlington Heights","Schaumburg","Oak Park","Wheaton","Palatine"],
  "United States|Indiana": ["Indianapolis","Fort Wayne","Evansville","South Bend","Carmel","Fishers","Bloomington","Hammond","Gary","Lafayette","Muncie","Noblesville","Anderson"],
  "United States|Iowa": ["Des Moines","Cedar Rapids","Davenport","Sioux City","Iowa City","Waterloo","Ames","West Des Moines","Council Bluffs","Dubuque"],
  "United States|Kansas": ["Wichita","Overland Park","Kansas City","Olathe","Topeka","Lawrence","Shawnee","Manhattan","Lenexa","Salina"],
  "United States|Kentucky": ["Louisville","Lexington","Bowling Green","Owensboro","Covington","Richmond","Georgetown","Florence","Hopkinsville","Nicholasville"],
  "United States|Louisiana": ["New Orleans","Baton Rouge","Shreveport","Lafayette","Lake Charles","Kenner","Bossier City","Monroe","Alexandria","Houma"],
  "United States|Maine": ["Portland","Lewiston","Bangor","South Portland","Auburn","Biddeford","Sanford","Saco","Augusta","Westbrook"],
  "United States|Maryland": ["Baltimore","Frederick","Rockville","Gaithersburg","Bowie","Hagerstown","Annapolis","Silver Spring","Bethesda","Columbia","Salisbury","Towson","Ellicott City"],
  "United States|Massachusetts": ["Boston","Worcester","Springfield","Cambridge","Lowell","Brockton","New Bedford","Quincy","Lynn","Fall River","Newton","Lawrence","Somerville","Framingham","Haverhill","Waltham","Malden","Brookline"],
  "United States|Michigan": ["Detroit","Grand Rapids","Warren","Sterling Heights","Ann Arbor","Lansing","Flint","Dearborn","Livonia","Westland","Troy","Farmington Hills","Kalamazoo","Wyoming","Rochester Hills","Southfield","Pontiac"],
  "United States|Minnesota": ["Minneapolis","Saint Paul","Rochester","Bloomington","Duluth","Brooklyn Park","Plymouth","Woodbury","Maple Grove","St. Cloud","Eagan","Edina","Eden Prairie"],
  "United States|Mississippi": ["Jackson","Gulfport","Southaven","Hattiesburg","Biloxi","Meridian","Tupelo","Olive Branch","Greenville","Oxford"],
  "United States|Missouri": ["Kansas City","Saint Louis","Springfield","Columbia","Independence","Lee's Summit","O'Fallon","Saint Charles","Saint Joseph","Blue Springs","Joplin","Jefferson City"],
  "United States|Montana": ["Billings","Missoula","Great Falls","Bozeman","Butte","Helena","Kalispell"],
  "United States|Nebraska": ["Omaha","Lincoln","Bellevue","Grand Island","Kearney","Fremont"],
  "United States|Nevada": ["Las Vegas","Henderson","Reno","North Las Vegas","Sparks","Carson City","Elko"],
  "United States|New Hampshire": ["Manchester","Nashua","Concord","Derry","Dover","Rochester","Salem","Merrimack","Portsmouth"],
  "United States|New Jersey": ["Newark","Jersey City","Paterson","Elizabeth","Lakewood","Edison","Woodbridge","Toms River","Hamilton","Trenton","Clifton","Camden","Brick","Cherry Hill","Passaic","Atlantic City","Princeton","Hoboken"],
  "United States|New Mexico": ["Albuquerque","Las Cruces","Rio Rancho","Santa Fe","Roswell","Farmington","Clovis","Hobbs"],
  "United States|New York": ["New York","Buffalo","Rochester","Yonkers","Syracuse","Albany","New Rochelle","Mount Vernon","Schenectady","Utica","White Plains","Troy","Niagara Falls","Binghamton","Freeport","Valley Stream","Long Beach","Ithaca","Brooklyn","Queens","Bronx","Manhattan","Staten Island"],
  "United States|North Carolina": ["Charlotte","Raleigh","Greensboro","Durham","Winston-Salem","Fayetteville","Cary","Wilmington","High Point","Greenville","Asheville","Concord","Gastonia","Jacksonville","Chapel Hill","Rocky Mount","Burlington"],
  "United States|North Dakota": ["Fargo","Bismarck","Grand Forks","Minot","West Fargo","Williston","Dickinson","Mandan"],
  "United States|Ohio": ["Columbus","Cleveland","Cincinnati","Toledo","Akron","Dayton","Parma","Canton","Youngstown","Lorain","Hamilton","Springfield","Kettering","Elyria","Lakewood"],
  "United States|Oklahoma": ["Oklahoma City","Tulsa","Norman","Broken Arrow","Lawton","Edmond","Moore","Midwest City","Enid","Stillwater"],
  "United States|Oregon": ["Portland","Eugene","Salem","Gresham","Hillsboro","Beaverton","Bend","Medford","Springfield","Corvallis","Albany"],
  "United States|Pennsylvania": ["Philadelphia","Pittsburgh","Allentown","Erie","Reading","Scranton","Bethlehem","Lancaster","Harrisburg","York","Wilkes-Barre","State College","Altoona","Bensalem"],
  "United States|Rhode Island": ["Providence","Warwick","Cranston","Pawtucket","East Providence","Woonsocket","Newport"],
  "United States|South Carolina": ["Charleston","Columbia","North Charleston","Mount Pleasant","Rock Hill","Greenville","Summerville","Sumter","Hilton Head Island","Spartanburg","Myrtle Beach","Aiken"],
  "United States|South Dakota": ["Sioux Falls","Rapid City","Aberdeen","Brookings","Watertown","Mitchell","Yankton","Pierre"],
  "United States|Tennessee": ["Nashville","Memphis","Knoxville","Chattanooga","Clarksville","Murfreesboro","Franklin","Jackson","Johnson City","Bartlett","Hendersonville","Kingsport","Collierville","Smyrna"],
  "United States|Texas": ["Houston","San Antonio","Dallas","Austin","Fort Worth","El Paso","Arlington","Corpus Christi","Plano","Laredo","Lubbock","Garland","Irving","Amarillo","Grand Prairie","Brownsville","McKinney","Frisco","Pasadena","Killeen","Mesquite","Waco","McAllen","Carrollton","Midland","Denton","Abilene","Beaumont","Round Rock","Odessa","Richardson","Sugar Land","Tyler","League City"],
  "United States|Utah": ["Salt Lake City","West Valley City","Provo","West Jordan","Orem","Sandy","Ogden","Saint George","Layton","South Jordan","Lehi","Millcreek","Taylorsville","Logan"],
  "United States|Vermont": ["Burlington","South Burlington","Rutland","Essex Junction","Colchester","Bennington","Montpelier"],
  "United States|Virginia": ["Virginia Beach","Chesapeake","Norfolk","Arlington","Richmond","Newport News","Alexandria","Hampton","Roanoke","Portsmouth","Suffolk","Lynchburg","Harrisonburg","Leesburg","Charlottesville","Reston","Fairfax","McLean"],
  "United States|Washington": ["Seattle","Spokane","Tacoma","Vancouver","Bellevue","Kent","Everett","Renton","Yakima","Federal Way","Spokane Valley","Bellingham","Kennewick","Auburn","Pasco","Marysville","Lakewood","Redmond","Kirkland","Olympia"],
  "United States|West Virginia": ["Charleston","Huntington","Morgantown","Parkersburg","Wheeling","Fairmont","Beckley","Martinsburg"],
  "United States|Wisconsin": ["Milwaukee","Madison","Green Bay","Kenosha","Racine","Appleton","Waukesha","Eau Claire","Oshkosh","Janesville","La Crosse"],
  "United States|Wyoming": ["Cheyenne","Casper","Laramie","Gillette","Rock Springs","Sheridan","Jackson"],

  // ─── Canada ───
  "Canada|Alberta": ["Calgary","Edmonton","Red Deer","Lethbridge","St. Albert","Medicine Hat","Airdrie","Grande Prairie","Fort McMurray","Banff"],
  "Canada|British Columbia": ["Vancouver","Victoria","Surrey","Burnaby","Richmond","Abbotsford","Coquitlam","Kelowna","Langley","Saanich","Delta","Kamloops","Nanaimo","Chilliwack","Prince George","Whistler"],
  "Canada|Manitoba": ["Winnipeg","Brandon","Steinbach","Thompson","Portage la Prairie","Winkler","Selkirk"],
  "Canada|New Brunswick": ["Saint John","Moncton","Fredericton","Dieppe","Riverview","Miramichi","Edmundston","Bathurst"],
  "Canada|Newfoundland and Labrador": ["St. John's","Mount Pearl","Corner Brook","Paradise","Conception Bay South","Grand Falls-Windsor","Gander"],
  "Canada|Northwest Territories": ["Yellowknife","Hay River","Inuvik","Fort Smith"],
  "Canada|Nova Scotia": ["Halifax","Sydney","Dartmouth","Truro","New Glasgow","Glace Bay","Kentville","Yarmouth","Bridgewater"],
  "Canada|Nunavut": ["Iqaluit","Rankin Inlet","Arviat","Cambridge Bay"],
  "Canada|Ontario": ["Toronto","Ottawa","Mississauga","Brampton","Hamilton","London","Markham","Vaughan","Kitchener","Windsor","Richmond Hill","Oakville","Burlington","Oshawa","Barrie","Guelph","Cambridge","Waterloo","Kingston","St. Catharines","Whitby","Ajax","Niagara Falls","Pickering","Sault Ste. Marie","Sudbury","Peterborough","Thunder Bay"],
  "Canada|Prince Edward Island": ["Charlottetown","Summerside","Stratford","Cornwall"],
  "Canada|Quebec": ["Montreal","Quebec City","Laval","Gatineau","Longueuil","Sherbrooke","Saguenay","Lévis","Trois-Rivières","Terrebonne","Saint-Jean-sur-Richelieu","Drummondville"],
  "Canada|Saskatchewan": ["Saskatoon","Regina","Prince Albert","Moose Jaw","Swift Current","Yorkton","North Battleford","Estevan"],
  "Canada|Yukon": ["Whitehorse","Dawson City","Watson Lake","Haines Junction"],

  // ─── United Kingdom (no state breakdown, but ship cities per country) ───
  "United Kingdom|England": ["London","Birmingham","Manchester","Leeds","Sheffield","Liverpool","Newcastle upon Tyne","Nottingham","Leicester","Coventry","Bradford","Bristol","Southampton","Portsmouth","Brighton","Plymouth","Derby","Stoke-on-Trent","Wolverhampton","Norwich","York","Cambridge","Oxford","Bath","Reading","Milton Keynes","Ipswich","Exeter"],
  "United Kingdom|Scotland": ["Edinburgh","Glasgow","Aberdeen","Dundee","Stirling","Perth","Inverness","Paisley","St Andrews"],
  "United Kingdom|Wales": ["Cardiff","Swansea","Newport","Wrexham","Bangor","St Davids"],
  "United Kingdom|Northern Ireland": ["Belfast","Derry","Lisburn","Newry","Bangor"],

  // ─── Australia ───
  "Australia|New South Wales": ["Sydney","Newcastle","Central Coast","Wollongong","Maitland","Albury","Wagga Wagga","Port Macquarie","Tamworth","Orange","Dubbo","Bathurst"],
  "Australia|Victoria": ["Melbourne","Geelong","Ballarat","Bendigo","Shepparton","Melton","Mildura","Wodonga","Warrnambool","Traralgon"],
  "Australia|Queensland": ["Brisbane","Gold Coast","Sunshine Coast","Townsville","Cairns","Toowoomba","Mackay","Rockhampton","Bundaberg","Gladstone","Hervey Bay"],
  "Australia|Western Australia": ["Perth","Bunbury","Geraldton","Kalgoorlie","Mandurah","Albany","Broome","Fremantle"],
  "Australia|South Australia": ["Adelaide","Mount Gambier","Whyalla","Gawler","Murray Bridge","Port Lincoln","Port Augusta"],
  "Australia|Tasmania": ["Hobart","Launceston","Devonport","Burnie","Kingston"],
  "Australia|Northern Territory": ["Darwin","Palmerston","Alice Springs","Katherine"],
  "Australia|Australian Capital Territory": ["Canberra"],

  // ─── Germany ───
  "Germany|Berlin": ["Berlin"],
  "Germany|Bavaria": ["Munich","Nuremberg","Augsburg","Würzburg","Regensburg","Ingolstadt","Fürth","Erlangen"],
  "Germany|Baden-Württemberg": ["Stuttgart","Karlsruhe","Mannheim","Freiburg","Heidelberg","Ulm","Heilbronn","Pforzheim","Tübingen"],
  "Germany|Hesse": ["Frankfurt","Wiesbaden","Kassel","Darmstadt","Offenbach"],
  "Germany|North Rhine-Westphalia": ["Cologne","Düsseldorf","Dortmund","Essen","Duisburg","Bochum","Wuppertal","Bielefeld","Bonn","Münster","Aachen","Mönchengladbach","Gelsenkirchen"],
  "Germany|Hamburg": ["Hamburg"],
  "Germany|Lower Saxony": ["Hanover","Braunschweig","Oldenburg","Osnabrück","Wolfsburg","Göttingen"],
  "Germany|Saxony": ["Leipzig","Dresden","Chemnitz","Zwickau","Görlitz"],
  "Germany|Rhineland-Palatinate": ["Mainz","Koblenz","Trier","Ludwigshafen","Kaiserslautern"],

  // ─── India ───
  "India|Maharashtra": ["Mumbai","Pune","Nagpur","Thane","Nashik","Aurangabad","Solapur","Navi Mumbai","Kalyan-Dombivli","Vasai-Virar"],
  "India|Delhi": ["New Delhi","Delhi","Noida","Gurgaon","Faridabad"],
  "India|Karnataka": ["Bangalore","Mysore","Hubli-Dharwad","Mangalore","Belgaum","Gulbarga","Davanagere","Bellary"],
  "India|Tamil Nadu": ["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Erode","Tiruppur","Vellore","Thoothukudi"],
  "India|Uttar Pradesh": ["Lucknow","Kanpur","Ghaziabad","Agra","Meerut","Varanasi","Allahabad","Bareilly","Aligarh","Moradabad"],
  "India|West Bengal": ["Kolkata","Howrah","Durgapur","Asansol","Siliguri","Malda","Bardhaman","Baharampur"],
  "India|Gujarat": ["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Junagadh","Gandhinagar"],
  "India|Telangana": ["Hyderabad","Warangal","Nizamabad","Karimnagar"],
  "India|Andhra Pradesh": ["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Tirupati","Rajahmundry"],
  "India|Punjab": ["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Mohali"],
  "India|Rajasthan": ["Jaipur","Jodhpur","Udaipur","Kota","Ajmer","Bikaner"],
  "India|Kerala": ["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kollam","Kannur"],
  "India|Madhya Pradesh": ["Bhopal","Indore","Jabalpur","Gwalior","Ujjain","Sagar"],
  "India|Haryana": ["Faridabad","Gurgaon","Panipat","Ambala","Karnal","Rohtak"],

  // ─── Brazil ───
  "Brazil|São Paulo": ["São Paulo","Guarulhos","Campinas","São Bernardo do Campo","Santo André","Osasco","Ribeirão Preto","Sorocaba","Santos","Mauá","Mogi das Cruzes"],
  "Brazil|Rio de Janeiro": ["Rio de Janeiro","São Gonçalo","Duque de Caxias","Nova Iguaçu","Niterói","Petrópolis","Campos dos Goytacazes"],
  "Brazil|Minas Gerais": ["Belo Horizonte","Uberlândia","Contagem","Juiz de Fora","Betim","Montes Claros","Ribeirão das Neves","Uberaba"],
  "Brazil|Bahia": ["Salvador","Feira de Santana","Vitória da Conquista","Camaçari","Itabuna","Juazeiro"],
  "Brazil|Paraná": ["Curitiba","Londrina","Maringá","Ponta Grossa","Cascavel","São José dos Pinhais","Foz do Iguaçu"],
  "Brazil|Rio Grande do Sul": ["Porto Alegre","Caxias do Sul","Pelotas","Canoas","Santa Maria","Gravataí","Novo Hamburgo"],
  "Brazil|Pernambuco": ["Recife","Jaboatão dos Guararapes","Olinda","Caruaru","Petrolina","Paulista"],
  "Brazil|Ceará": ["Fortaleza","Caucaia","Juazeiro do Norte","Maracanaú","Sobral"],
  "Brazil|Distrito Federal": ["Brasília","Ceilândia","Taguatinga","Samambaia"],

  // ─── Mexico ───
  "Mexico|Mexico City": ["Mexico City","Iztapalapa","Gustavo A. Madero","Álvaro Obregón","Tlalpan","Coyoacán"],
  "Mexico|Jalisco": ["Guadalajara","Zapopan","Tlaquepaque","Tonalá","Puerto Vallarta","Tlajomulco de Zúñiga"],
  "Mexico|Nuevo León": ["Monterrey","Guadalupe","Apodaca","General Escobedo","Santa Catarina","San Nicolás de los Garza","San Pedro Garza García"],
  "Mexico|Puebla": ["Puebla","Tehuacán","San Martín Texmelucan","Atlixco"],
  "Mexico|Guanajuato": ["León","Irapuato","Celaya","Salamanca","Guanajuato","San Miguel de Allende"],
  "Mexico|Veracruz": ["Veracruz","Xalapa","Coatzacoalcos","Córdoba","Poza Rica","Orizaba"],
  "Mexico|Baja California": ["Tijuana","Mexicali","Ensenada","Rosarito"],
  "Mexico|Quintana Roo": ["Cancún","Playa del Carmen","Chetumal","Cozumel","Tulum"],
  "Mexico|Yucatán": ["Mérida","Valladolid","Progreso","Tizimín"],
  "Mexico|State of Mexico": ["Ecatepec","Nezahualcóyotl","Naucalpan","Tlalnepantla","Chimalhuacán","Toluca","Cuautitlán Izcalli"],
};

/**
 * Cities for countries that don't have states in STATES_BY_COUNTRY —
 * shown when the user picks a country but state is free-text.
 */
const CITIES_BY_COUNTRY = {
  "France": ["Paris","Marseille","Lyon","Toulouse","Nice","Nantes","Strasbourg","Montpellier","Bordeaux","Lille","Rennes","Reims"],
  "Spain": ["Madrid","Barcelona","Valencia","Seville","Zaragoza","Málaga","Murcia","Palma","Las Palmas","Bilbao","Alicante","Granada"],
  "Italy": ["Rome","Milan","Naples","Turin","Palermo","Genoa","Bologna","Florence","Bari","Catania","Venice","Verona"],
  "Netherlands": ["Amsterdam","Rotterdam","The Hague","Utrecht","Eindhoven","Groningen","Tilburg","Almere","Breda","Nijmegen"],
  "Belgium": ["Brussels","Antwerp","Ghent","Charleroi","Liège","Bruges","Namur","Leuven"],
  "Ireland": ["Dublin","Cork","Limerick","Galway","Waterford","Drogheda","Dundalk","Swords","Bray"],
  "Switzerland": ["Zurich","Geneva","Basel","Bern","Lausanne","Winterthur","Lucerne","St. Gallen","Lugano","Zug"],
  "Sweden": ["Stockholm","Gothenburg","Malmö","Uppsala","Västerås","Örebro","Linköping","Helsingborg"],
  "Denmark": ["Copenhagen","Aarhus","Odense","Aalborg","Frederiksberg","Esbjerg"],
  "Norway": ["Oslo","Bergen","Trondheim","Stavanger","Drammen","Fredrikstad"],
  "Finland": ["Helsinki","Espoo","Tampere","Vantaa","Oulu","Turku"],
  "Poland": ["Warsaw","Kraków","Łódź","Wrocław","Poznań","Gdańsk","Szczecin","Bydgoszcz","Lublin"],
  "Portugal": ["Lisbon","Porto","Amadora","Braga","Coimbra","Funchal","Setúbal","Faro","Cascais"],
  "Greece": ["Athens","Thessaloniki","Patras","Piraeus","Larissa","Heraklion","Volos"],
  "Czechia": ["Prague","Brno","Ostrava","Plzeň","Liberec","Olomouc"],
  "Japan": ["Tokyo","Yokohama","Osaka","Nagoya","Sapporo","Fukuoka","Kobe","Kyoto","Kawasaki","Saitama","Hiroshima","Sendai","Chiba"],
  "South Korea": ["Seoul","Busan","Incheon","Daegu","Daejeon","Gwangju","Suwon","Ulsan","Changwon","Seongnam","Goyang"],
  "China": ["Shanghai","Beijing","Guangzhou","Shenzhen","Chengdu","Tianjin","Wuhan","Dongguan","Chongqing","Xi'an","Hangzhou","Nanjing","Suzhou","Qingdao"],
  "Singapore": ["Singapore"],
  "Hong Kong": ["Hong Kong","Kowloon","Tsuen Wan"],
  "Taiwan": ["Taipei","Kaohsiung","Taichung","Tainan","Hsinchu","Taoyuan"],
  "Thailand": ["Bangkok","Chiang Mai","Pattaya","Phuket","Krabi","Hua Hin"],
  "Vietnam": ["Ho Chi Minh City","Hanoi","Da Nang","Can Tho","Hai Phong","Nha Trang"],
  "Indonesia": ["Jakarta","Surabaya","Bandung","Medan","Semarang","Makassar","Palembang","Denpasar","Yogyakarta"],
  "Philippines": ["Manila","Quezon City","Cebu City","Davao","Makati","Taguig","Pasig","Caloocan"],
  "Malaysia": ["Kuala Lumpur","George Town","Johor Bahru","Ipoh","Kota Kinabalu","Shah Alam","Petaling Jaya","Melaka"],
  "United Arab Emirates": ["Dubai","Abu Dhabi","Sharjah","Al Ain","Ajman","Ras Al Khaimah"],
  "Saudi Arabia": ["Riyadh","Jeddah","Mecca","Medina","Dammam","Khobar","Tabuk"],
  "Qatar": ["Doha","Al Rayyan","Al Wakrah","Lusail"],
  "Israel": ["Tel Aviv","Jerusalem","Haifa","Rishon LeZion","Petah Tikva","Ashdod","Netanya","Beer Sheva"],
  "Turkey": ["Istanbul","Ankara","Izmir","Bursa","Adana","Gaziantep","Konya","Antalya","Kayseri"],
  "South Africa": ["Johannesburg","Cape Town","Durban","Pretoria","Port Elizabeth","Bloemfontein","East London"],
  "Nigeria": ["Lagos","Kano","Ibadan","Abuja","Port Harcourt","Benin City","Kaduna"],
  "Kenya": ["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Thika"],
  "Egypt": ["Cairo","Alexandria","Giza","Shubra El Kheima","Port Said","Suez","Luxor"],
  "Argentina": ["Buenos Aires","Córdoba","Rosario","La Plata","Mar del Plata","Tucumán","Salta","Mendoza"],
  "Chile": ["Santiago","Valparaíso","Concepción","La Serena","Antofagasta","Viña del Mar","Temuco"],
  "Colombia": ["Bogotá","Medellín","Cali","Barranquilla","Cartagena","Bucaramanga","Cúcuta","Pereira"],
  "Peru": ["Lima","Arequipa","Trujillo","Chiclayo","Piura","Iquitos","Cusco"],
  "Bangladesh": ["Dhaka","Chittagong","Khulna","Rajshahi","Sylhet","Mymensingh","Rangpur","Comilla","Narayanganj","Gazipur","Barisal","Jessore","Cox's Bazar","Bogra"],
  "Pakistan": ["Karachi","Lahore","Faisalabad","Rawalpindi","Gujranwala","Peshawar","Multan","Islamabad","Hyderabad","Quetta"],
  "Sri Lanka": ["Colombo","Dehiwala-Mount Lavinia","Moratuwa","Negombo","Kandy","Sri Jayawardenepura Kotte","Galle"],
  "Nepal": ["Kathmandu","Pokhara","Lalitpur","Bharatpur","Biratnagar","Birgunj"],
  "New Zealand": ["Auckland","Wellington","Christchurch","Hamilton","Tauranga","Dunedin","Napier","Palmerston North"],
  "Russia": ["Moscow","Saint Petersburg","Novosibirsk","Yekaterinburg","Kazan","Nizhny Novgorod","Chelyabinsk","Samara","Omsk","Rostov-on-Don"],
  "Ukraine": ["Kyiv","Kharkiv","Odessa","Dnipro","Donetsk","Lviv","Zaporizhzhia","Kryvyi Rih"],
};

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
