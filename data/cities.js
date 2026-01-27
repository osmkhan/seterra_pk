// Pakistani Cities Database with Coordinates
// Organized by Province/Region

const CITIES_DATA = {
    // Punjab Province Cities
    punjab: [
        { name: "Lahore", lat: 31.5820, lng: 74.3294, isCapital: true, population: "11.1M" },
        { name: "Faisalabad", lat: 31.4187, lng: 73.0791, population: "3.2M" },
        { name: "Rawalpindi", lat: 33.6261, lng: 73.0714, population: "2.1M" },
        { name: "Multan", lat: 30.1815, lng: 71.4922, population: "1.9M" },
        { name: "Gujranwala", lat: 32.1664, lng: 74.1959, population: "2.0M" },
        { name: "Sialkot", lat: 32.4972, lng: 74.5361, population: "0.7M" },
        { name: "Bahawalpur", lat: 29.3978, lng: 71.6752, population: "0.7M" },
        { name: "Sargodha", lat: 32.0825, lng: 72.6691, population: "0.6M" },
        { name: "Sahiwal", lat: 30.6777, lng: 73.1068, population: "0.4M" },
        { name: "Sheikhupura", lat: 31.7167, lng: 73.9850, population: "0.5M" },
        { name: "Jhang", lat: 31.2780, lng: 72.3118, population: "0.4M" },
        { name: "Rahim Yar Khan", lat: 28.4212, lng: 70.2989, population: "0.4M" },
        { name: "Kasur", lat: 31.1188, lng: 74.4633, population: "0.4M" },
        { name: "Okara", lat: 30.8085, lng: 73.4594, population: "0.2M" },
        { name: "Gujrat", lat: 32.5731, lng: 74.1005, population: "0.4M" },
        { name: "Jhelum", lat: 32.9405, lng: 73.7276, population: "0.2M" },
        { name: "Chiniot", lat: 31.7200, lng: 72.9789, population: "0.2M" },
        { name: "Vehari", lat: 30.0452, lng: 72.3489, population: "0.1M" },
        { name: "Dera Ghazi Khan", lat: 30.0489, lng: 70.6455, population: "0.4M" },
        { name: "Khanewal", lat: 30.2864, lng: 71.9320, population: "0.2M" },
        { name: "Muzaffargarh", lat: 30.0744, lng: 71.1847, population: "0.2M" },
        { name: "Layyah", lat: 30.9648, lng: 70.9399, population: "0.1M" },
        { name: "Attock", lat: 33.7681, lng: 72.3607, population: "0.1M" },
        { name: "Chakwal", lat: 32.9329, lng: 72.8539, population: "0.1M" },
        { name: "Mianwali", lat: 32.5853, lng: 71.5436, population: "0.1M" },
        { name: "Bhakkar", lat: 31.6082, lng: 71.0854, population: "0.1M" },
        { name: "Hafizabad", lat: 32.0694, lng: 73.6880, population: "0.2M" },
        { name: "Narowal", lat: 32.1024, lng: 74.8730, population: "0.1M" },
        { name: "Khushab", lat: 32.2917, lng: 72.3481, population: "0.1M" },
        { name: "Pakpattan", lat: 30.3500, lng: 73.3833, population: "0.2M" }
    ],

    // Punjab Towns (10k-100k range)
    punjabTowns: [
        { name: "Uch Sharif", lat: 29.2330, lng: 71.0670, population: "0.10M" },
        { name: "Dijkot", lat: 31.2175, lng: 72.9958, population: "0.10M" },
        { name: "Khurrianwala", lat: 31.5172, lng: 73.2667, population: "0.10M" },
        { name: "Hujra Shah Muqeem", lat: 30.7330, lng: 73.8170, population: "0.10M" },
        { name: "Dunyapur", lat: 29.8028, lng: 71.7434, population: "0.05M" },
        { name: "Dinga", lat: 32.6410, lng: 73.7243, population: "0.09M" },
        { name: "Chunian", lat: 31.0170, lng: 73.8500, population: "0.09M" },
        { name: "Fort Abbas", lat: 29.1936, lng: 72.8544, population: "0.08M" },
        { name: "Jahanian", lat: 30.0400, lng: 71.8181, population: "0.05M" },
        { name: "Talagang", lat: 32.9278, lng: 72.4111, population: "0.08M" }
    ],

    // Sindh Province Cities
    sindh: [
        { name: "Karachi", lat: 24.8610, lng: 67.0104, isCapital: true, population: "14.9M" },
        { name: "Hyderabad", lat: 25.3969, lng: 68.3772, population: "1.7M" },
        { name: "Sukkur", lat: 27.7139, lng: 68.8369, population: "0.5M" },
        { name: "Larkana", lat: 27.5590, lng: 68.2120, population: "0.5M" },
        { name: "Nawabshah", lat: 26.2483, lng: 68.4017, population: "0.3M" },
        { name: "Mirpur Khas", lat: 25.5310, lng: 69.0101, population: "0.2M" },
        { name: "Jacobabad", lat: 28.2769, lng: 68.4514, population: "0.2M" },
        { name: "Shikarpur", lat: 27.9556, lng: 68.6382, population: "0.2M" },
        { name: "Dadu", lat: 26.7319, lng: 67.7750, population: "0.1M" },
        { name: "Thatta", lat: 24.7461, lng: 67.9236, population: "0.1M" },
        { name: "Badin", lat: 24.6339, lng: 68.8400, population: "0.1M" },
        { name: "Khairpur", lat: 27.5295, lng: 68.7592, population: "0.2M" },
        { name: "Tando Adam", lat: 25.7666, lng: 68.6617, population: "0.1M" },
        { name: "Tando Allahyar", lat: 25.4667, lng: 68.7167, population: "0.1M" },
        { name: "Umerkot", lat: 25.3611, lng: 69.7361, population: "0.1M" }
    ],

    // Khyber Pakhtunkhwa (KPK) Cities
    kpk: [
        { name: "Peshawar", lat: 34.0259, lng: 71.5601, isCapital: true, population: "1.9M" },
        { name: "Mardan", lat: 34.1989, lng: 72.0231, population: "0.4M" },
        { name: "Mingora", lat: 34.7795, lng: 72.3609, population: "0.3M" },
        { name: "Kohat", lat: 33.5869, lng: 71.4414, population: "0.2M" },
        { name: "Abbottabad", lat: 34.1463, lng: 73.2117, population: "0.2M" },
        { name: "Mansehra", lat: 34.3333, lng: 73.2000, population: "0.1M" },
        { name: "Swabi", lat: 34.1167, lng: 72.4667, population: "0.1M" },
        { name: "Nowshera", lat: 34.0153, lng: 71.9747, population: "0.2M" },
        { name: "Dera Ismail Khan", lat: 31.8167, lng: 70.9167, population: "0.2M" },
        { name: "Charsadda", lat: 34.1453, lng: 71.7308, population: "0.1M" },
        { name: "Bannu", lat: 32.9889, lng: 70.6056, population: "0.1M" },
        { name: "Haripur", lat: 33.9944, lng: 72.9331, population: "0.1M" },
        { name: "Chitral", lat: 35.8519, lng: 71.7864, population: "0.05M" },
        { name: "Battagram", lat: 34.6833, lng: 73.0167, population: "0.05M" },
        { name: "Tank", lat: 32.2167, lng: 70.3833, population: "0.05M" }
    ],

    // Balochistan Province Cities
    balochistan: [
        { name: "Quetta", lat: 30.1841, lng: 67.0014, isCapital: true, population: "1.0M" },
        { name: "Gwadar", lat: 25.1264, lng: 62.3225, population: "0.1M" },
        { name: "Turbat", lat: 26.0042, lng: 63.0697, population: "0.2M" },
        { name: "Khuzdar", lat: 27.8000, lng: 66.6167, population: "0.1M" },
        { name: "Hub", lat: 25.0500, lng: 66.8833, population: "0.2M" },
        { name: "Chaman", lat: 30.9236, lng: 66.4597, population: "0.1M" },
        { name: "Sibi", lat: 29.5500, lng: 67.8833, population: "0.1M" },
        { name: "Zhob", lat: 31.3417, lng: 69.4486, population: "0.1M" },
        { name: "Loralai", lat: 30.3706, lng: 68.5972, population: "0.1M" },
        { name: "Dera Murad Jamali", lat: 28.5500, lng: 68.2167, population: "0.1M" },
        { name: "Pasni", lat: 25.2631, lng: 63.4694, population: "0.05M" },
        { name: "Nushki", lat: 29.5500, lng: 66.0167, population: "0.05M" }
    ],

    // Federal Capital
    capital: [
        { name: "Islamabad", lat: 33.7380, lng: 73.0845, isCapital: true, population: "1.0M" }
    ],

    // Azad Kashmir
    azadKashmir: [
        { name: "Muzaffarabad", lat: 34.3700, lng: 73.4711, isCapital: true, population: "0.1M" },
        { name: "Mirpur", lat: 33.1500, lng: 73.7500, population: "0.4M" },
        { name: "Rawalakot", lat: 33.8578, lng: 73.7603, population: "0.1M" },
        { name: "Kotli", lat: 33.5167, lng: 73.9167, population: "0.1M" },
        { name: "Bhimber", lat: 32.9667, lng: 74.0667, population: "0.1M" },
        { name: "Bagh", lat: 33.9735, lng: 73.7918, population: "0.03M" },
        { name: "Hajira", lat: 33.7717, lng: 73.8961, population: "0.03M" },
        { name: "Dhirkot", lat: 34.0392, lng: 73.5769, population: "0.20M" },
        { name: "Pallandri", lat: 33.7153, lng: 73.6861, population: "0.02M" }
    ],

    // Gilgit-Baltistan
    gilgitBaltistan: [
        { name: "Gilgit", lat: 35.9208, lng: 74.3144, isCapital: true, population: "0.1M" },
        { name: "Skardu", lat: 35.2971, lng: 75.6333, population: "0.05M" },
        { name: "Chilas", lat: 35.4128, lng: 74.0972, population: "0.02M" },
        { name: "Hunza", lat: 36.3167, lng: 74.6500, population: "0.02M" },
        { name: "Khaplu", lat: 35.1500, lng: 76.3333, population: "0.01M" }
    ]
};

// Helper function to get all cities
function getAllCities() {
    const allCities = [];
    for (const region in CITIES_DATA) {
        CITIES_DATA[region].forEach(city => {
            allCities.push({ ...city, region: region });
        });
    }
    return allCities;
}

// Helper function to get cities by region
function getCitiesByRegion(region) {
    if (region === 'all') {
        return getAllCities();
    }
    if (region === 'punjabTowns') {
        return [
            ...CITIES_DATA.punjab.map(city => ({ ...city, region: 'punjabTowns' })),
            ...(CITIES_DATA.punjabTowns || []).map(city => ({ ...city, region: 'punjabTowns' }))
        ];
    }
    if (region === 'kashmirGilgit') {
        const azad = (CITIES_DATA.azadKashmir || []).map(city => ({
            ...city,
            region: 'kashmirGilgit',
            provinceKey: 'azadKashmir'
        }));
        const gb = (CITIES_DATA.gilgitBaltistan || []).map(city => ({
            ...city,
            region: 'kashmirGilgit',
            provinceKey: 'gilgitBaltistan'
        }));
        return [...azad, ...gb];
    }
    return CITIES_DATA[region]?.map(city => ({ ...city, region: region })) || [];
}

// Helper to get region display name
function getRegionDisplayName(region) {
    const names = {
        punjab: 'Punjab',
        punjabTowns: 'Punjab Towns',
        sindh: 'Sindh',
        kpk: 'Khyber Pakhtunkhwa',
        balochistan: 'Balochistan',
        capital: 'Federal Capital',
        azadKashmir: 'Azad Kashmir',
        gilgitBaltistan: 'Gilgit-Baltistan',
        kashmirGilgit: 'Kashmir & Gilgit',
        all: 'All Pakistan'
    };
    return names[region] || region;
}

// Pakistan's approximate bounds for map view
const PAKISTAN_BOUNDS = {
    center: [30.3753, 69.3451],
    zoom: 5,
    minZoom: 4,
    maxZoom: 10,
    bounds: [[23.5, 60.5], [37.5, 77.5]]
};
