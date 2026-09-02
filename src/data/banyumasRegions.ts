import { Region } from '../types/weather.js';
import { BANYUMAS_KECAMATAN_BOUNDARY_MAP, BANYUMAS_OFFICIAL_COUNTY_BOUNDARY, BANYUMAS_KECAMATAN_CENTROIDS } from './banyumasGeoJson.js';

export const BANYUMAS_CENTER: [number, number] = [-7.4243, 109.2302]; // Center around Purwokerto/Banyumas
export const BANYUMAS_BOUNDS: [[number, number], [number, number]] = [
  [-7.6650, 108.8800], // Southwest [lat, lng]
  [-7.2300, 109.4500], // Northeast [lat, lng]
];

// Official outer county boundary (dissolved from 27 official kecamatan polygons)
export const BANYUMAS_COUNTY_BOUNDARY: [number, number][] = BANYUMAS_OFFICIAL_COUNTY_BOUNDARY;

// Neighboring Regencies (Kabupaten Tetangga) matching the official map
export const NEIGHBORING_REGENCIES = [
  { name: 'Brebes', lat: -7.3200, lng: 108.8750, position: 'Barat' },
  { name: 'Tegal', lat: -7.1650, lng: 109.1300, position: 'Utara' },
  { name: 'Pemalang', lat: -7.1650, lng: 109.2900, position: 'Timur Laut' },
  { name: 'Purbalingga', lat: -7.3300, lng: 109.3750, position: 'Timur' },
  { name: 'Banjarnegara', lat: -7.4850, lng: 109.4350, position: 'Tenggara' },
  { name: 'Kebumen', lat: -7.6150, lng: 109.4850, position: 'Tenggara' },
  { name: 'Cilacap', lat: -7.6450, lng: 109.0900, position: 'Selatan' },
];

export const BANYUMAS_KECAMATAN: Region[] = [
  {
    id: '33.02.01',
    name: 'Lumbir',
    type: 'kecamatan',
    lat: -7.4626,
    lng: 108.9702,
    elevationMeters: 110,
    postalCode: '53177',
    description: 'Kecamatan di ujung barat daya Banyumas berbatasan langsung dengan Kabupaten Cilacap dan Brebes.',
    villages: ['Cirahab', 'Canduk', 'Parungkamal', 'Besuki', 'Karanggayam', 'Cidora', 'Lumbir', 'Dermaji', 'Kedunggede', 'Cingebul'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.01']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.01'],
  },
  {
    id: '33.02.02',
    name: 'Wangon',
    type: 'kecamatan',
    lat: -7.5108,
    lng: 109.0529,
    elevationMeters: 75,
    postalCode: '53176',
    description: 'Pusat persimpangan jalur lintas selatan Jawa Tengah bagian barat.',
    villages: ['Randegan', 'Rawaheng', 'Pengadegan', 'Klapagading', 'Wangon', 'Banteran', 'Jambu', 'Jurangbahas', 'Cikakak', 'Wlahar', 'Windunegara', 'Klapagading Kulon'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.02']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.02'],
  },
  {
    id: '33.02.03',
    name: 'Jatilawang',
    type: 'kecamatan',
    lat: -7.5441,
    lng: 109.1104,
    elevationMeters: 55,
    postalCode: '53174',
    description: 'Wilayah pertanian dan perlintasan strategis Banyumas barat.',
    villages: ['Gunung Wetan', 'Pekuncen', 'Karanglewas', 'Karanganyar', 'Margasana', 'Adisara', 'Kedungwringin', 'Bantar', 'Tinggarjaya', 'Tunjung', 'Gentawangi'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.03']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.03'],
  },
  {
    id: '33.02.04',
    name: 'Rawalo',
    type: 'kecamatan',
    lat: -7.5243,
    lng: 109.1625,
    elevationMeters: 45,
    postalCode: '53173',
    description: 'Wilayah yang dilintasi aliran Sungai Serayu dan jalur Purwokerto-Cilacap.',
    villages: ['Losari', 'Menganti', 'Banjarparakan', 'Rawalo', 'Tambaknegara', 'Sidamulih', 'Pesawahan', 'Tipar', 'Sanggrèman'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.04']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.04'],
  },
  {
    id: '33.02.05',
    name: 'Kebasen',
    type: 'kecamatan',
    lat: -7.5458,
    lng: 109.2258,
    elevationMeters: 40,
    postalCode: '53172',
    description: 'Kawasan Bendung Gerak Serayu dengan panorama lembah dan terowongan rel Notog-Kebasen.',
    villages: ['Adisana', 'Bangsa', 'Karangsari', 'Randegan', 'Kaliwedi', 'Sawangan', 'Kalisalak', 'Cindaga', 'Kebasen', 'Gambarsari', 'Tumiyang', 'Mandirancan'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.05']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.05'],
  },
  {
    id: '33.02.06',
    name: 'Kemranjen',
    type: 'kecamatan',
    lat: -7.59,
    lng: 109.3098,
    elevationMeters: 30,
    postalCode: '53194',
    description: 'Sentra buah durian Bawor Banyumas dan hasil perkebunan dataran rendah.',
    villages: ['Grujugan', 'Sirau', 'Sibalung', 'Sibrama', 'Kedungpring', 'Kecila', 'Nusamangir', 'Karangjati', 'Kebarongan', 'Sidamulya', 'Pageralang', 'Alasmalang', 'Petarangan', 'Karanggintung', 'Karangsalâm'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.06']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.06'],
  },
  {
    id: '33.02.07',
    name: 'Sumpiuh',
    type: 'kecamatan',
    lat: -7.6005,
    lng: 109.3697,
    elevationMeters: 25,
    postalCode: '53195',
    description: 'Kota kecamatan bagian timur Banyumas dengan stasiun kereta api dan sentra niaga.',
    villages: ['Kebokura', 'Sumpiuh', 'Kradenan', 'Nusadadi', 'Selandaka', 'Karanggedang', 'Kemiri', 'Pandak', 'Kuntili', 'Lebeng', 'Selanegara', 'Bogangin', 'Banjarpanepen', 'Ketanda'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.07']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.07'],
  },
  {
    id: '33.02.08',
    name: 'Tambak',
    type: 'kecamatan',
    lat: -7.5951,
    lng: 109.4108,
    elevationMeters: 32,
    postalCode: '53196',
    description: 'Ujung paling timur Banyumas yang terkenal dengan kuliner Sate Bebek Tambak.',
    villages: ['Plangkapan', 'Gumelar Lor', 'Gumelar Kidul', 'Karangpetir', 'Gebangsari', 'Prembun', 'Buniayu', 'Pesantren', 'Karangpucung', 'Kamulyan', 'Purwodadi', 'Watuagung'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.08']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.08'],
  },
  {
    id: '33.02.09',
    name: 'Somagede',
    type: 'kecamatan',
    lat: -7.5238,
    lng: 109.3451,
    elevationMeters: 80,
    postalCode: '53193',
    description: 'Wilayah perbukitan dan sentra pengrajin batik serta anyaman bambu.',
    villages: ['Tanggeran', 'Sokawera', 'Somagede', 'Klinting', 'Kemawi', 'Piasa Kulon', 'Kanding', 'Somakaton', 'Plana'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.09']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.09'],
  },
  {
    id: '33.02.10',
    name: 'Kalibagor',
    type: 'kecamatan',
    lat: -7.488,
    lng: 109.306,
    elevationMeters: 65,
    postalCode: '53191',
    description: 'Wilayah bekas pabrik gula kolonial dengan hamparan persawahan subur.',
    villages: ['Srowot', 'Suro', 'Kaliori', 'Wlahar Wetan', 'Pekaja', 'Karangdadap', 'Kalibagor', 'Pajerukan', 'Petir', 'Kalicupak Kidul', 'Kalicupak Lor', 'Kalisogra Wetan'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.10']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.10'],
  },
  {
    id: '33.02.11',
    name: 'Banyumas',
    type: 'kecamatan',
    lat: -7.5304,
    lng: 109.2723,
    elevationMeters: 55,
    postalCode: '53192',
    description: 'Kota Lama Banyumas, pusat historis dan budaya Kadipaten Banyumas kuno.',
    villages: ['Binangun', 'Pasinggangan', 'Kedunggede', 'Karangrau', 'Kejawar', 'Danaraja', 'Kedunguter', 'Sudagaran', 'Pekunden', 'Kalisube', 'Dawuhan', 'Papringan'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.11']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.11'],
  },
  {
    id: '33.02.12',
    name: 'Patikraja',
    type: 'kecamatan',
    lat: -7.4762,
    lng: 109.2151,
    elevationMeters: 60,
    postalCode: '53171',
    description: 'Kecamatan strategis selatan Purwokerto yang terhubung langsung dengan pusat kota.',
    villages: ['Wlahar Kulon', 'Sokawera', 'Pegalongan', 'Patikraja', 'Notog', 'Karangendep', 'Sawangan Wetan', 'Kedungwuluh Kidul', 'Kedungrandu', 'Kedungwuluh Lor', 'Karanganyar', 'Sidabowa', 'Kedungwringin'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.12']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.12'],
  },
  {
    id: '33.02.13',
    name: 'Purwojati',
    type: 'kecamatan',
    lat: -7.4863,
    lng: 109.1091,
    elevationMeters: 105,
    postalCode: '53175',
    description: 'Wilayah perbukitan hijau barat daya Purwokerto dengan potensi agroforestri.',
    villages: ['Gerduren', 'Karangtalun Kidul', 'Kaliurip', 'Karangtalun Lor', 'Purwojati', 'Klapasawit', 'Karangmangu', 'Kaliputih', 'Kaliwangi', 'Kalitapen'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.13']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.13'],
  },
  {
    id: '33.02.14',
    name: 'Ajibarang',
    type: 'kecamatan',
    lat: -7.4252,
    lng: 109.0718,
    elevationMeters: 140,
    postalCode: '53163',
    description: 'Kota persimpangan niaga ramai antara Purwokerto, Tegal, dan Jalur Barat.',
    villages: ['Darmakradenan', 'Tipar Kidul', 'Sawangan', 'Jingkang', 'Banjarsari', 'Kalibenda', 'Pancurendang', 'Pancasan', 'Karangbawang', 'Kracak', 'Ajibarang Kulon', 'Ajibarang Wetan', 'Lesmana', 'Pandansari', 'Ciberung'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.14']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.14'],
  },
  {
    id: '33.02.15',
    name: 'Gumelar',
    type: 'kecamatan',
    lat: -7.3894,
    lng: 108.9996,
    elevationMeters: 220,
    postalCode: '53165',
    description: 'Kawasan perbukitan sejuk di lereng barat Banyumas yang berbatasan dengan Brebes.',
    villages: ['Karangkemojing', 'Paningkaban', 'Cihonje', 'Gancang', 'Kedungurang', 'Gumelar', 'Cilangkap', 'Tlaga', 'Samudra', 'Samudra Kulon'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.15']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.15'],
  },
  {
    id: '33.02.16',
    name: 'Pekuncen',
    type: 'kecamatan',
    lat: -7.3537,
    lng: 109.0788,
    elevationMeters: 280,
    postalCode: '53164',
    description: 'Kecamatan gerbang utara Banyumas jalur lintas Tegal-Purwokerto via Curug Nangga.',
    villages: ['Cikembulan', 'Candinegara', 'Karangklesem', 'Cikawung', 'Cibangkong', 'Petahunan', 'Semedo', 'Banjaranyar', 'Pasiraman Lor', 'Pasiraman Kidul', 'Tumiyang', 'Glempang', 'Pekuncen', 'Karangkemiri', 'Kranggan', 'Krajan'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.16']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.16'],
  },
  {
    id: '33.02.17',
    name: 'Cilongok',
    type: 'kecamatan',
    lat: -7.3711,
    lng: 109.1505,
    elevationMeters: 175,
    postalCode: '53162',
    description: 'Kecamatan terluas di barat daya lereng Gunung Slamet, sentra Curug Cipendok.',
    villages: ['Panusupan', 'Jatisaba', 'Kasegeran', 'Pejogol', 'Langgongsari', 'Pageraji', 'Sudimara', 'Batuanten', 'Cipete', 'Cilongok', 'Pernasidi', 'Cikidang', 'Karanglo', 'Kalisari', 'Karangtengah', 'Panembangan', 'Rancamaya', 'Sambirata', 'Gununglurah', 'Sokawera'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.17']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.17'],
  },
  {
    id: '33.02.18',
    name: 'Karanglewas',
    type: 'kecamatan',
    lat: -7.3924,
    lng: 109.1852,
    elevationMeters: 120,
    postalCode: '53161',
    description: 'Kecamatan penyangga barat Purwokerto dengan sentra industri tahu dan kerajinan.',
    villages: ['Kediri', 'Pangebatan', 'Tamansari', 'Karanglewas Kidul', 'Karangkemiri', 'Pasir Wetan', 'Pasir Lor', 'Pasir Kulon', 'Jipang', 'Karanggude Kulon', 'Singasari', 'Babakan', 'Sunyalangu'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.18']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.18'],
  },
  {
    id: '33.02.19',
    name: 'Sokaraja',
    type: 'kecamatan',
    lat: -7.4512,
    lng: 109.2915,
    elevationMeters: 85,
    postalCode: '53181',
    description: 'Pusat kuliner legendaris Soto Sokaraja, Getuk Goreng, dan galeri seni lukis.',
    villages: ['Kalikidang', 'Wiradadi', 'Karangkedawung', 'Sokaraja Tengah', 'Sokaraja Kidul', 'Klahang', 'Banjarsari Kidul', 'Sokaraja Wetan', 'Jompo Kulon', 'Banjaranyar', 'Lemberang', 'Karangduren', 'Sokaraja Lor', 'Kedondong', 'Pamijen', 'Sokaraja Kulon', 'Karangnanas', 'Karangrau'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.19']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.19'],
  },
  {
    id: '33.02.20',
    name: 'Kembaran',
    type: 'kecamatan',
    lat: -7.4125,
    lng: 109.2884,
    elevationMeters: 115,
    postalCode: '53182',
    description: 'Kawasan timur Purwokerto dengan kampus UMP (Universitas Muhammadiyah Purwokerto).',
    villages: ['Ledug', 'Pliken', 'Purwodadi', 'Karang Tengah', 'Kramat', 'Sambeng Wetan', 'Sambeng Kulon', 'Purbadana', 'Kembaran', 'Bojongsari', 'Karangsoka', 'Dukuhwaluh', 'Tambaksari Kidul', 'Bantarwuni', 'Karangsari', 'Linggasari'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.20']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.20'],
  },
  {
    id: '33.02.21',
    name: 'Sumbang',
    type: 'kecamatan',
    lat: -7.3357,
    lng: 109.2578,
    elevationMeters: 240,
    postalCode: '53183',
    description: 'Kecamatan subur lereng timur Gunung Slamet dengan sentra pertanian dan agrowisata.',
    villages: ['Silado', 'Karangturi', 'Karangcegak', 'Sumbang', 'Tambaksogra', 'Kebanggan', 'Kawungcarang', 'Karanggintung', 'Datar', 'Banjarsari Kulon', 'Banjarsari Wetan', 'Banteran', 'Ciberem', 'Susukan', 'Sikapat', 'Gandatapa', 'Kotayasa', 'Limpakuwus', 'Kedungmalang'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.21']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.21'],
  },
  {
    id: '33.02.22',
    name: 'Baturraden',
    type: 'kecamatan',
    lat: -7.3175,
    lng: 109.2248,
    elevationMeters: 620,
    postalCode: '53151',
    description: 'Destinasi wisata utama lereng Gunung Slamet berhawa sejuk dengan mata air panas belerang.',
    villages: ['Purwosari', 'Kutasari', 'Pandak', 'Pamijen', 'Rempoah', 'Kebumen', 'Karang Tengah', 'Kemutug Kidul', 'Karangsalâm Lor', 'Kemutug Lor', 'Karangmangu', 'Ketenger'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.22']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.22'],
  },
  {
    id: '33.02.23',
    name: 'Kedungbanteng',
    type: 'kecamatan',
    lat: -7.3378,
    lng: 109.2002,
    elevationMeters: 230,
    postalCode: '53152',
    description: 'Kawasan lereng Gunung Slamet dengan sumber air alami melimpah dan Curug Gomblang.',
    villages: ['Karangsalam Kidul', 'Kebocoran', 'Kedungbanteng', 'Beji', 'Karangnangka', 'Keniten', 'Dawuhan Wetan', 'Dawuhan Kulon', 'Baseh', 'Kalisalak', 'Windujaya', 'Kalikesur', 'Kutaliman', 'Melung'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.23']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.23'],
  },
  {
    id: '33.02.24',
    name: 'Purwokerto Selatan',
    type: 'kecamatan',
    lat: -7.4486,
    lng: 109.2447,
    elevationMeters: 80,
    postalCode: '53147',
    description: 'Pusat transportasi kota Purwokerto dengan Terminal Bus Bulupitu dan Menara Teratai selatan.',
    villages: ['Karangklesem', 'Teluk', 'Berkoh', 'Purwokerto Kidul', 'Purwokerto Kulon', 'Karangpucung', 'Tanjung'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.24']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.24'],
  },
  {
    id: '33.02.25',
    name: 'Purwokerto Barat',
    type: 'kecamatan',
    lat: -7.422,
    lng: 109.2153,
    elevationMeters: 95,
    postalCode: '53131',
    description: 'Kawasan Stasiun Besar Purwokerto dan pusat pertokoan barat kota.',
    villages: ['Karanglewas Lor', 'Pasir Kidul', 'Rejasari', 'Pasirmuncang', 'Bantarsoka', 'Kober', 'Kedungwuluh'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.25']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.25'],
  },
  {
    id: '33.02.26',
    name: 'Purwokerto Timur',
    type: 'kecamatan',
    lat: -7.4234,
    lng: 109.25,
    elevationMeters: 90,
    postalCode: '53111',
    description: 'Pusat pemerintahan kabupaten, Alun-alun Purwokerto, Rita Supermall, Sokanegara, dan Pasar Wage.',
    villages: ['Sokanegara', 'Kranji', 'Purwokerto Lor', 'Purwokerto Wetan', 'Mersi', 'Arcawinangun'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.26']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.26'],
  },
  {
    id: '33.02.27',
    name: 'Purwokerto Utara',
    type: 'kecamatan',
    lat: -7.4018,
    lng: 109.239,
    elevationMeters: 130,
    postalCode: '53122',
    description: 'Pusat pendidikan tinggi Purwokerto, kampus Universitas Jenderal Soedirman (UNSOED).',
    villages: ['Purwanegara', 'Bancarkembar', 'Sumampir', 'Pabuwaran', 'Grendeng', 'Karangwangkal', 'Bobosan'],
    boundaryCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.27']?.[0],
    boundaryMultiCoords: BANYUMAS_KECAMATAN_BOUNDARY_MAP['33.02.27'],
  },
];

import {
  ALL_BANYUMAS_DESA,
  getDesaCoordinates,
  findNearestDesaFromCoords,
  DesaSpatialInfo,
} from './banyumasDesaGeoportal.js';

export { ALL_BANYUMAS_DESA, getDesaCoordinates, findNearestDesaFromCoords };
export type { DesaSpatialInfo };

// Database of precise village/kelurahan coordinates across Banyumas (All 331 Desa from Geoportal)
export interface VillageCoordInfo {
  name: string;
  kecamatanId: string;
  kecamatanName: string;
  lat: number;
  lng: number;
}

export const BANYUMAS_VILLAGES_COORDS: VillageCoordInfo[] = ALL_BANYUMAS_DESA;

// Map of pastel colors matching official administrative map (image.png)
export const KECAMATAN_ADMIN_COLORS: Record<string, { fill: string; stroke: string }> = {
  '33.02.01': { fill: '#94a3b8', stroke: '#475569' }, // Lumbir (slate blue-gray)
  '33.02.02': { fill: '#fef08a', stroke: '#ca8a04' }, // Wangon (light yellow)
  '33.02.03': { fill: '#6ee7b7', stroke: '#059669' }, // Jatilawang (sage green)
  '33.02.04': { fill: '#bbf7d0', stroke: '#16a34a' }, // Rawalo (light green)
  '33.02.05': { fill: '#d9f99d', stroke: '#65a30d' }, // Kebasen (pale lime)
  '33.02.06': { fill: '#93c5fd', stroke: '#2563eb' }, // Kemranjen (cornflower blue)
  '33.02.07': { fill: '#6ee7b7', stroke: '#0d9488' }, // Sumpiuh (mint)
  '33.02.08': { fill: '#c084fc', stroke: '#7e22ce' }, // Tambak (purple/lilac)
  '33.02.09': { fill: '#86efac', stroke: '#15803d' }, // Somagede (green)
  '33.02.10': { fill: '#86efac', stroke: '#16a34a' }, // Kalibagor (leaf green)
  '33.02.11': { fill: '#67e8f9', stroke: '#0891b2' }, // Banyumas (steel cyan)
  '33.02.12': { fill: '#86efac', stroke: '#15803d' }, // Patikraja (moss green)
  '33.02.13': { fill: '#bae6fd', stroke: '#0284c7' }, // Purwojati (ice blue)
  '33.02.14': { fill: '#99f6e4', stroke: '#0d9488' }, // Ajibarang (cyan/teal)
  '33.02.15': { fill: '#c4b5fd', stroke: '#7c3aed' }, // Gumelar (lavender/purple)
  '33.02.16': { fill: '#a3b18a', stroke: '#4a5d4e' }, // Pekuncen (olive sage)
  '33.02.17': { fill: '#c7d2fe', stroke: '#4f46e5' }, // Cilongok (periwinkle blue)
  '33.02.18': { fill: '#f472b6', stroke: '#be185d' }, // Karanglewas (pink/rose)
  '33.02.19': { fill: '#86efac', stroke: '#16a34a' }, // Kedungbanteng (grass green)
  '33.02.20': { fill: '#fef08a', stroke: '#ca8a04' }, // Baturraden (warm sand yellow)
  '33.02.21': { fill: '#a7f3d0', stroke: '#059669' }, // Sumbang (soft emerald)
  '33.02.22': { fill: '#7dd3fc', stroke: '#0284c7' }, // Kembaran (sky blue)
  '33.02.23': { fill: '#a855f7', stroke: '#6b21a8' }, // Sokaraja (dusty purple)
  '33.02.24': { fill: '#bef264', stroke: '#65a30d' }, // Purwokerto Selatan (lime olive)
  '33.02.25': { fill: '#67e8f9', stroke: '#0891b2' }, // Purwokerto Barat (cyan)
  '33.02.26': { fill: '#c084fc', stroke: '#7e22ce' }, // Purwokerto Timur (lavender)
  '33.02.27': { fill: '#38bdf8', stroke: '#0284c7' }, // Purwokerto Utara (bright sky blue)
};

// Helper to find region by ID or name
export function getKecamatanById(id: string): Region | undefined {
  return BANYUMAS_KECAMATAN.find((k) => k.id === id);
}

export function getKecamatanByName(name: string): Region | undefined {
  const query = name.toLowerCase().trim();
  return BANYUMAS_KECAMATAN.find(
    (k) => k.name.toLowerCase() === query || k.name.toLowerCase().includes(query)
  );
}

// Ray-Casting algorithm to check if a lat/lng point is inside a polygon (supports MultiPolygon rings)
export function isPointInPolygon(point: [number, number], polygon: [number, number][] | [number, number][][]): boolean {
  if (!polygon || polygon.length === 0) return false;
  const [lat, lng] = point;

  // Check if this is a MultiPolygon (array of rings) or single ring
  if (Array.isArray(polygon[0]) && Array.isArray((polygon[0] as any)[0])) {
    const rings = polygon as [number, number][][];
    for (const ring of rings) {
      if (isPointInSingleRing(lat, lng, ring)) return true;
    }
    return false;
  }

  return isPointInSingleRing(lat, lng, polygon as [number, number][]);
}

function isPointInSingleRing(lat: number, lng: number, ring: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];

    const intersect = ((yi > lng) !== (yj > lng)) &&
      (lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Find nearest Kecamatan based on GPS Lat/Lng (Enhanced with Polygon containment check)
export function findNearestKecamatan(lat: number, lng: number): Region {
  // 1. First priority: Check if point is inside any Kecamatan boundary polygon
  for (const kec of BANYUMAS_KECAMATAN) {
    const bounds = kec.boundaryMultiCoords || (kec.boundaryCoords ? [kec.boundaryCoords] : []);
    if (bounds && bounds.length > 0) {
      if (isPointInPolygon([lat, lng], bounds)) {
        return kec;
      }
    }
  }

  // 2. Second priority: Fallback to closest Euclidean distance to centroid
  let closest = BANYUMAS_KECAMATAN[0];
  let minDistance = Number.MAX_VALUE;

  for (const kec of BANYUMAS_KECAMATAN) {
    const dLat = kec.lat - lat;
    const dLng = kec.lng - lng;
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minDistance) {
      minDistance = distSq;
      closest = kec;
    }
  }
  return closest;
}

// High-precision location locator: resolves exact Kecamatan and Desa/Kelurahan
export function findPreciseLocation(lat: number, lng: number): {
  region: Region;
  village: string;
  method: 'village_exact' | 'polygon_containment' | 'nearest_centroid';
  distanceMeters: number;
} {
  // 1. Priority 1: Point in Polygon (Exact Administrative Boundary Determination)
  for (const kec of BANYUMAS_KECAMATAN) {
    const bounds = kec.boundaryMultiCoords || (kec.boundaryCoords ? [kec.boundaryCoords] : []);
    if (bounds && bounds.length > 0) {
      if (isPointInPolygon([lat, lng], bounds)) {
        // Find the closest village strictly within THIS matched Kecamatan
        let bestKecVillage: VillageCoordInfo | null = null;
        let minKecVilDistSq = Number.MAX_VALUE;

        for (const vil of BANYUMAS_VILLAGES_COORDS) {
          if (vil.kecamatanId === kec.id) {
            const dLat = (vil.lat - lat) * 111320;
            const dLng = (vil.lng - lng) * 110574;
            const distSq = dLat * dLat + dLng * dLng;
            if (distSq < minKecVilDistSq) {
              minKecVilDistSq = distSq;
              bestKecVillage = vil;
            }
          }
        }

        const resolvedVillage = bestKecVillage
          ? bestKecVillage.name
          : kec.villages?.[0] || kec.name;

        const distMeters = bestKecVillage
          ? Math.round(Math.sqrt(minKecVilDistSq))
          : 0;

        return {
          region: kec,
          village: resolvedVillage,
          method: 'polygon_containment',
          distanceMeters: distMeters,
        };
      }
    }
  }

  // 2. Priority 2: Check nearest known village coordinates across Banyumas (< 3.0 km)
  let closestVillage: VillageCoordInfo | null = null;
  let minVilDistSq = Number.MAX_VALUE;

  for (const vil of BANYUMAS_VILLAGES_COORDS) {
    const dLat = (vil.lat - lat) * 111320;
    const dLng = (vil.lng - lng) * 110574;
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minVilDistSq) {
      minVilDistSq = distSq;
      closestVillage = vil;
    }
  }

  const nearestVilDistMeters = Math.sqrt(minVilDistSq);
  if (closestVillage && nearestVilDistMeters <= 3000) {
    const parentKec = getKecamatanById(closestVillage.kecamatanId);
    if (parentKec) {
      return {
        region: parentKec,
        village: closestVillage.name,
        method: 'village_exact',
        distanceMeters: Math.round(nearestVilDistMeters),
      };
    }
  }

  // 3. Priority 3: Centroid Fallback
  const nearestKec = findNearestKecamatan(lat, lng);
  const bestVil = closestVillage && closestVillage.kecamatanId === nearestKec.id
    ? closestVillage.name
    : nearestKec.villages?.[0] || nearestKec.name;

  return {
    region: nearestKec,
    village: bestVil,
    method: 'nearest_centroid',
    distanceMeters: Math.round(nearestVilDistMeters),
  };
}