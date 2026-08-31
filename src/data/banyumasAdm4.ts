// Pemetaan Resmi Kode Wilayah Tingkat IV Kemendagri untuk Kabupaten Banyumas (33.02)
// Sesuai Data Resmi Kemendagri & API Publik BMKG (api.bmkg.go.id)
// 27 Kecamatan & 331 Desa/Kelurahan

export interface Adm4Mapping {
  kecamatanId: string; // "33.02.01"
  kecamatanName: string;
  defaultAdm4: string; // e.g. "33.02.01.2007"
  defaultDesaName: string;
  desaCodes: Record<string, string>; // Desa Name -> Adm4 Code
}

export const BANYUMAS_ADM4_MAP: Record<string, Adm4Mapping> = {
  // 01 — Lumbir (33.02.01)
  '33.02.01': {
    kecamatanId: '33.02.01',
    kecamatanName: 'Lumbir',
    defaultAdm4: '33.02.01.2007',
    defaultDesaName: 'Lumbir',
    desaCodes: {
      'Cirahab': '33.02.01.2001',
      'Canduk': '33.02.01.2002',
      'Parungkamal': '33.02.01.2003',
      'Besuki': '33.02.01.2004',
      'Karanggayam': '33.02.01.2005',
      'Cidora': '33.02.01.2006',
      'Lumbir': '33.02.01.2007',
      'Dermaji': '33.02.01.2008',
      'Kedunggede': '33.02.01.2009',
      'Cingebul': '33.02.01.2010',
    },
  },

  // 02 — Wangon (33.02.02)
  '33.02.02': {
    kecamatanId: '33.02.02',
    kecamatanName: 'Wangon',
    defaultAdm4: '33.02.02.2005',
    defaultDesaName: 'Wangon',
    desaCodes: {
      'Randegan': '33.02.02.2001',
      'Rawaheng': '33.02.02.2002',
      'Pengadegan': '33.02.02.2003',
      'Pangadegan': '33.02.02.2003',
      'Klapagading': '33.02.02.2004',
      'Wangon': '33.02.02.2005',
      'Banteran': '33.02.02.2006',
      'Jambu': '33.02.02.2007',
      'Jurangbahas': '33.02.02.2008',
      'Cikakak': '33.02.02.2009',
      'Wlahar': '33.02.02.2010',
      'Windunegara': '33.02.02.2011',
      'Klapagading Kulon': '33.02.02.2012',
    },
  },

  // 03 — Jatilawang (33.02.03)
  '33.02.03': {
    kecamatanId: '33.02.03',
    kecamatanName: 'Jatilawang',
    defaultAdm4: '33.02.03.2010',
    defaultDesaName: 'Tunjung',
    desaCodes: {
      'Gunung Wetan': '33.02.03.2001',
      'Gunungwetan': '33.02.03.2001',
      'Pekuncen': '33.02.03.2002',
      'Karanglewas': '33.02.03.2003',
      'Karanganyar': '33.02.03.2004',
      'Margasana': '33.02.03.2005',
      'Adisara': '33.02.03.2006',
      'Kedungwringin': '33.02.03.2007',
      'Bantar': '33.02.03.2008',
      'Tinggarjaya': '33.02.03.2009',
      'Tunjung': '33.02.03.2010',
      'Gentawangi': '33.02.03.2011',
    },
  },

  // 04 — Rawalo (33.02.04)
  '33.02.04': {
    kecamatanId: '33.02.04',
    kecamatanName: 'Rawalo',
    defaultAdm4: '33.02.04.2004',
    defaultDesaName: 'Rawalo',
    desaCodes: {
      'Losari': '33.02.04.2001',
      'Menganti': '33.02.04.2002',
      'Banjarparakan': '33.02.04.2003',
      'Rawalo': '33.02.04.2004',
      'Tambaknegara': '33.02.04.2005',
      'Sidamulih': '33.02.04.2006',
      'Pesawahan': '33.02.04.2007',
      'Tipar': '33.02.04.2008',
      'Sanggrèman': '33.02.04.2009',
      'Sanggreman': '33.02.04.2009',
    },
  },

  // 05 — Kebasen (33.02.05)
  '33.02.05': {
    kecamatanId: '33.02.05',
    kecamatanName: 'Kebasen',
    defaultAdm4: '33.02.05.2009',
    defaultDesaName: 'Kebasen',
    desaCodes: {
      'Adisana': '33.02.05.2001',
      'Bangsa': '33.02.05.2002',
      'Karangsari': '33.02.05.2003',
      'Randegan': '33.02.05.2004',
      'Kaliwedi': '33.02.05.2005',
      'Sawangan': '33.02.05.2006',
      'Kalisalak': '33.02.05.2007',
      'Cindaga': '33.02.05.2008',
      'Kebasen': '33.02.05.2009',
      'Gambarsari': '33.02.05.2010',
      'Tumiyang': '33.02.05.2011',
      'Mandirancan': '33.02.05.2012',
    },
  },

  // 06 — Kemranjen (33.02.06)
  '33.02.06': {
    kecamatanId: '33.02.06',
    kecamatanName: 'Kemranjen',
    defaultAdm4: '33.02.06.2006',
    defaultDesaName: 'Kecila',
    desaCodes: {
      'Grujugan': '33.02.06.2001',
      'Sirau': '33.02.06.2002',
      'Sibalung': '33.02.06.2003',
      'Sibrama': '33.02.06.2004',
      'Kedungpring': '33.02.06.2005',
      'Kecila': '33.02.06.2006',
      'Nusamangir': '33.02.06.2007',
      'Karangjati': '33.02.06.2008',
      'Kebarongan': '33.02.06.2009',
      'Sidamulya': '33.02.06.2010',
      'Pageralang': '33.02.06.2011',
      'Alasmalang': '33.02.06.2012',
      'Petarangan': '33.02.06.2013',
      'Karanggintung': '33.02.06.2014',
      'Karangsalâm': '33.02.06.2015',
      'Karangsalam': '33.02.06.2015',
    },
  },

  // 07 — Sumpiuh (33.02.07)
  '33.02.07': {
    kecamatanId: '33.02.07',
    kecamatanName: 'Sumpiuh',
    defaultAdm4: '33.02.07.1013',
    defaultDesaName: 'Sumpiuh',
    desaCodes: {
      'Kebokura': '33.02.07.1012',
      'Sumpiuh': '33.02.07.1013',
      'Kradenan': '33.02.07.1014',
      'Nusadadi': '33.02.07.2001',
      'Selandaka': '33.02.07.2002',
      'Karanggedang': '33.02.07.2003',
      'Kemiri': '33.02.07.2004',
      'Pandak': '33.02.07.2005',
      'Kuntili': '33.02.07.2006',
      'Lebeng': '33.02.07.2007',
      'Selanegara': '33.02.07.2008',
      'Bogangin': '33.02.07.2009',
      'Banjarpanepen': '33.02.07.2010',
      'Ketanda': '33.02.07.2011',
    },
  },

  // 08 — Tambak (33.02.08)
  '33.02.08': {
    kecamatanId: '33.02.08',
    kecamatanName: 'Tambak',
    defaultAdm4: '33.02.08.2010',
    defaultDesaName: 'Kamulyan',
    desaCodes: {
      'Plangkapan': '33.02.08.2001',
      'Gumelar Lor': '33.02.08.2002',
      'Gumelar Kidul': '33.02.08.2003',
      'Karangpetir': '33.02.08.2004',
      'Gebangsari': '33.02.08.2005',
      'Prembun': '33.02.08.2006',
      'Buniayu': '33.02.08.2007',
      'Pesantren': '33.02.08.2008',
      'Karangpucung': '33.02.08.2009',
      'Kamulyan': '33.02.08.2010',
      'Purwodadi': '33.02.08.2011',
      'Watuagung': '33.02.08.2012',
    },
  },

  // 09 — Somagede (33.02.09)
  '33.02.09': {
    kecamatanId: '33.02.09',
    kecamatanName: 'Somagede',
    defaultAdm4: '33.02.09.2003',
    defaultDesaName: 'Somagede',
    desaCodes: {
      'Tanggeran': '33.02.09.2001',
      'Sokawera': '33.02.09.2002',
      'Somagede': '33.02.09.2003',
      'Klinting': '33.02.09.2004',
      'Kemawi': '33.02.09.2005',
      'Piasa Kulon': '33.02.09.2006',
      'Kanding': '33.02.09.2007',
      'Somakaton': '33.02.09.2008',
      'Plana': '33.02.09.2009',
    },
  },

  // 10 — Kalibagor (33.02.10)
  '33.02.10': {
    kecamatanId: '33.02.10',
    kecamatanName: 'Kalibagor',
    defaultAdm4: '33.02.10.2007',
    defaultDesaName: 'Kalibagor',
    desaCodes: {
      'Srowot': '33.02.10.2001',
      'Suro': '33.02.10.2002',
      'Kaliori': '33.02.10.2003',
      'Wlahar Wetan': '33.02.10.2004',
      'Pekaja': '33.02.10.2005',
      'Karangdadap': '33.02.10.2006',
      'Kalibagor': '33.02.10.2007',
      'Pajerukan': '33.02.10.2008',
      'Petir': '33.02.10.2009',
      'Kalicupak Kidul': '33.02.10.2010',
      'Kalicupak Lor': '33.02.10.2011',
      'Kalisogra Wetan': '33.02.10.2012',
    },
  },

  // 11 — Banyumas (33.02.11)
  '33.02.11': {
    kecamatanId: '33.02.11',
    kecamatanName: 'Banyumas',
    defaultAdm4: '33.02.11.2008',
    defaultDesaName: 'Sudagaran',
    desaCodes: {
      'Binangun': '33.02.11.2001',
      'Pasinggangan': '33.02.11.2002',
      'Kedunggede': '33.02.11.2003',
      'Karangrau': '33.02.11.2004',
      'Kejawar': '33.02.11.2005',
      'Danaraja': '33.02.11.2006',
      'Kedunguter': '33.02.11.2007',
      'Sudagaran': '33.02.11.2008',
      'Pekunden': '33.02.11.2009',
      'Kalisube': '33.02.11.2010',
      'Dawuhan': '33.02.11.2011',
      'Papringan': '33.02.11.2012',
    },
  },

  // 12 — Patikraja (33.02.12)
  '33.02.12': {
    kecamatanId: '33.02.12',
    kecamatanName: 'Patikraja',
    defaultAdm4: '33.02.12.2004',
    defaultDesaName: 'Patikraja',
    desaCodes: {
      'Wlahar Kulon': '33.02.12.2001',
      'Sokawera': '33.02.12.2002',
      'Pegalongan': '33.02.12.2003',
      'Patikraja': '33.02.12.2004',
      'Notog': '33.02.12.2005',
      'Karangendep': '33.02.12.2006',
      'Sawangan Wetan': '33.02.12.2007',
      'Kedungwuluh Kidul': '33.02.12.2008',
      'Kedungrandu': '33.02.12.2009',
      'Kedungwuluh Lor': '33.02.12.2010',
      'Karanganyar': '33.02.12.2011',
      'Sidabowa': '33.02.12.2012',
      'Kedungwringin': '33.02.12.2013',
    },
  },

  // 13 — Purwojati (33.02.13)
  '33.02.13': {
    kecamatanId: '33.02.13',
    kecamatanName: 'Purwojati',
    defaultAdm4: '33.02.13.2005',
    defaultDesaName: 'Purwojati',
    desaCodes: {
      'Gerduren': '33.02.13.2001',
      'Karangtalun Kidul': '33.02.13.2002',
      'Kaliurip': '33.02.13.2003',
      'Karangtalun Lor': '33.02.13.2004',
      'Purwojati': '33.02.13.2005',
      'Klapasawit': '33.02.13.2006',
      'Karangmangu': '33.02.13.2007',
      'Kaliputih': '33.02.13.2008',
      'Kaliwangi': '33.02.13.2009',
      'Kalitapen': '33.02.13.2010',
    },
  },

  // 14 — Ajibarang (33.02.14)
  '33.02.14': {
    kecamatanId: '33.02.14',
    kecamatanName: 'Ajibarang',
    defaultAdm4: '33.02.14.2011',
    defaultDesaName: 'Ajibarang Kulon',
    desaCodes: {
      'Darmakradenan': '33.02.14.2001',
      'Tipar Kidul': '33.02.14.2002',
      'Tiparkidul': '33.02.14.2002',
      'Sawangan': '33.02.14.2003',
      'Jingkang': '33.02.14.2004',
      'Banjarsari': '33.02.14.2005',
      'Kalibenda': '33.02.14.2006',
      'Pancurendang': '33.02.14.2007',
      'Pancasan': '33.02.14.2008',
      'Karangbawang': '33.02.14.2009',
      'Kracak': '33.02.14.2010',
      'Ajibarang Kulon': '33.02.14.2011',
      'Ajibarang Wetan': '33.02.14.2012',
      'Lesmana': '33.02.14.2013',
      'Pandansari': '33.02.14.2014',
      'Ciberung': '33.02.14.2015',
    },
  },

  // 15 — Gumelar (33.02.15)
  '33.02.15': {
    kecamatanId: '33.02.15',
    kecamatanName: 'Gumelar',
    defaultAdm4: '33.02.15.2006',
    defaultDesaName: 'Gumelar',
    desaCodes: {
      'Karangkemojing': '33.02.15.2001',
      'Paningkaban': '33.02.15.2002',
      'Cihonje': '33.02.15.2003',
      'Gancang': '33.02.15.2004',
      'Kedungurang': '33.02.15.2005',
      'Gumelar': '33.02.15.2006',
      'Cilangkap': '33.02.15.2007',
      'Tlaga': '33.02.15.2008',
      'Samudra': '33.02.15.2009',
      'Samudra Kulon': '33.02.15.2010',
    },
  },

  // 16 — Pekuncen (33.02.16)
  '33.02.16': {
    kecamatanId: '33.02.16',
    kecamatanName: 'Pekuncen',
    defaultAdm4: '33.02.16.2013',
    defaultDesaName: 'Pekuncen',
    desaCodes: {
      'Cikembulan': '33.02.16.2001',
      'Candinegara': '33.02.16.2002',
      'Karangklesem': '33.02.16.2003',
      'Cikawung': '33.02.16.2004',
      'Cibangkong': '33.02.16.2005',
      'Petahunan': '33.02.16.2006',
      'Semedo': '33.02.16.2007',
      'Banjaranyar': '33.02.16.2008',
      'Pasiraman Lor': '33.02.16.2009',
      'Pasiraman Kidul': '33.02.16.2010',
      'Tumiyang': '33.02.16.2011',
      'Glempang': '33.02.16.2012',
      'Pekuncen': '33.02.16.2013',
      'Karangkemiri': '33.02.16.2014',
      'Kranggan': '33.02.16.2015',
      'Krajan': '33.02.16.2016',
    },
  },

  // 17 — Cilongok (33.02.17)
  '33.02.17': {
    kecamatanId: '33.02.17',
    kecamatanName: 'Cilongok',
    defaultAdm4: '33.02.17.2010',
    defaultDesaName: 'Cilongok',
    desaCodes: {
      'Panusupan': '33.02.17.2001',
      'Jatisaba': '33.02.17.2002',
      'Kasegeran': '33.02.17.2003',
      'Pejogol': '33.02.17.2004',
      'Langgongsari': '33.02.17.2005',
      'Pageraji': '33.02.17.2006',
      'Sudimara': '33.02.17.2007',
      'Batuanten': '33.02.17.2008',
      'Cipete': '33.02.17.2009',
      'Cilongok': '33.02.17.2010',
      'Pernasidi': '33.02.17.2011',
      'Cikidang': '33.02.17.2012',
      'Karanglo': '33.02.17.2013',
      'Kalisari': '33.02.17.2014',
      'Karangtengah': '33.02.17.2015',
      'Karang Tengah': '33.02.17.2015',
      'Panembangan': '33.02.17.2016',
      'Rancamaya': '33.02.17.2017',
      'Sambirata': '33.02.17.2018',
      'Gununglurah': '33.02.17.2019',
      'Sokawera': '33.02.17.2020',
    },
  },

  // 18 — Karanglewas (33.02.18)
  '33.02.18': {
    kecamatanId: '33.02.18',
    kecamatanName: 'Karanglewas',
    defaultAdm4: '33.02.18.2004',
    defaultDesaName: 'Karanglewas Kidul',
    desaCodes: {
      'Kediri': '33.02.18.2001',
      'Pangebatan': '33.02.18.2002',
      'Tamansari': '33.02.18.2003',
      'Karanglewas Kidul': '33.02.18.2004',
      'Karangkemiri': '33.02.18.2005',
      'Pasir Wetan': '33.02.18.2006',
      'Pasir Lor': '33.02.18.2007',
      'Pasir Kulon': '33.02.18.2008',
      'Jipang': '33.02.18.2009',
      'Karanggude Kulon': '33.02.18.2010',
      'Singasari': '33.02.18.2011',
      'Babakan': '33.02.18.2012',
      'Sunyalangu': '33.02.18.2013',
    },
  },

  // 19 — Sokaraja (33.02.19)
  '33.02.19': {
    kecamatanId: '33.02.19',
    kecamatanName: 'Sokaraja',
    defaultAdm4: '33.02.19.2016',
    defaultDesaName: 'Sokaraja Kulon',
    desaCodes: {
      'Kalikidang': '33.02.19.2001',
      'Wiradadi': '33.02.19.2002',
      'Karangkedawung': '33.02.19.2003',
      'Sokaraja Tengah': '33.02.19.2004',
      'Sokaraja Kidul': '33.02.19.2005',
      'Klahang': '33.02.19.2006',
      'Banjarsari Kidul': '33.02.19.2007',
      'Sokaraja Wetan': '33.02.19.2008',
      'Jompo Kulon': '33.02.19.2009',
      'Banjaranyar': '33.02.19.2010',
      'Lemberang': '33.02.19.2011',
      'Karangduren': '33.02.19.2012',
      'Sokaraja Lor': '33.02.19.2013',
      'Kedondong': '33.02.19.2014',
      'Pamijen': '33.02.19.2015',
      'Sokaraja Kulon': '33.02.19.2016',
      'Karangnanas': '33.02.19.2017',
      'Karangrau': '33.02.19.2018',
    },
  },

  // 20 — Kembaran (33.02.20)
  '33.02.20': {
    kecamatanId: '33.02.20',
    kecamatanName: 'Kembaran',
    defaultAdm4: '33.02.20.2009',
    defaultDesaName: 'Kembaran',
    desaCodes: {
      'Ledug': '33.02.20.2001',
      'Pliken': '33.02.20.2002',
      'Purwodadi': '33.02.20.2003',
      'Karang Tengah': '33.02.20.2004',
      'Karangtengah': '33.02.20.2004',
      'Kramat': '33.02.20.2005',
      'Sambeng Wetan': '33.02.20.2006',
      'Sambeng Kulon': '33.02.20.2007',
      'Purbadana': '33.02.20.2008',
      'Kembaran': '33.02.20.2009',
      'Bojongsari': '33.02.20.2010',
      'Karangsoka': '33.02.20.2011',
      'Dukuhwaluh': '33.02.20.2012',
      'Tambaksari Kidul': '33.02.20.2013',
      'Bantarwuni': '33.02.20.2014',
      'Karangsari': '33.02.20.2015',
      'Linggasari': '33.02.20.2016',
    },
  },

  // 21 — Sumbang (33.02.21)
  '33.02.21': {
    kecamatanId: '33.02.21',
    kecamatanName: 'Sumbang',
    defaultAdm4: '33.02.21.2004',
    defaultDesaName: 'Sumbang',
    desaCodes: {
      'Silado': '33.02.21.2001',
      'Karangturi': '33.02.21.2002',
      'Karangcegak': '33.02.21.2003',
      'Sumbang': '33.02.21.2004',
      'Tambaksogra': '33.02.21.2005',
      'Kebanggan': '33.02.21.2006',
      'Kawungcarang': '33.02.21.2007',
      'Karanggintung': '33.02.21.2008',
      'Datar': '33.02.21.2009',
      'Banjarsari Kulon': '33.02.21.2010',
      'Banjarsari Wetan': '33.02.21.2011',
      'Banteran': '33.02.21.2012',
      'Ciberem': '33.02.21.2013',
      'Susukan': '33.02.21.2014',
      'Sikapat': '33.02.21.2015',
      'Gandatapa': '33.02.21.2016',
      'Kotayasa': '33.02.21.2017',
      'Limpakuwus': '33.02.21.2018',
      'Kedungmalang': '33.02.21.2019',
    },
  },

  // 22 — Baturraden (33.02.22)
  '33.02.22': {
    kecamatanId: '33.02.22',
    kecamatanName: 'Baturraden',
    defaultAdm4: '33.02.22.2011',
    defaultDesaName: 'Karangmangu',
    desaCodes: {
      'Purwosari': '33.02.22.2001',
      'Kutasari': '33.02.22.2002',
      'Pandak': '33.02.22.2003',
      'Pamijen': '33.02.22.2004',
      'Rempoah': '33.02.22.2005',
      'Kebumen': '33.02.22.2006',
      'Karang Tengah': '33.02.22.2007',
      'Karangtengah': '33.02.22.2007',
      'Kemutug Kidul': '33.02.22.2008',
      'Karangsalâm Lor': '33.02.22.2009',
      'Karangsalam Lor': '33.02.22.2009',
      'Kemutug Lor': '33.02.22.2010',
      'Karangmangu': '33.02.22.2011',
      'Ketenger': '33.02.22.2012',
    },
  },

  // 23 — Kedungbanteng (33.02.23)
  '33.02.23': {
    kecamatanId: '33.02.23',
    kecamatanName: 'Kedungbanteng',
    defaultAdm4: '33.02.23.2003',
    defaultDesaName: 'Kedungbanteng',
    desaCodes: {
      'Karangsalam Kidul': '33.02.23.2001',
      'Kebocoran': '33.02.23.2002',
      'Kedungbanteng': '33.02.23.2003',
      'Beji': '33.02.23.2004',
      'Karangnangka': '33.02.23.2005',
      'Keniten': '33.02.23.2006',
      'Dawuhan Wetan': '33.02.23.2007',
      'Dawuhan Kulon': '33.02.23.2008',
      'Baseh': '33.02.23.2009',
      'Kalisalak': '33.02.23.2010',
      'Windujaya': '33.02.23.2011',
      'Kalikesur': '33.02.23.2012',
      'Kutaliman': '33.02.23.2013',
      'Melung': '33.02.23.2014',
    },
  },

  // 24 — Purwokerto Selatan (33.02.24)
  '33.02.24': {
    kecamatanId: '33.02.24',
    kecamatanName: 'Purwokerto Selatan',
    defaultAdm4: '33.02.24.1001',
    defaultDesaName: 'Karangklesem',
    desaCodes: {
      'Karangklesem': '33.02.24.1001',
      'Teluk': '33.02.24.1002',
      'Berkoh': '33.02.24.1003',
      'Purwokerto Kidul': '33.02.24.1004',
      'Purwokerto Kulon': '33.02.24.1005',
      'Karangpucung': '33.02.24.1006',
      'Tanjung': '33.02.24.1007',
    },
  },

  // 25 — Purwokerto Barat (33.02.25)
  '33.02.25': {
    kecamatanId: '33.02.25',
    kecamatanName: 'Purwokerto Barat',
    defaultAdm4: '33.02.25.1007',
    defaultDesaName: 'Kedungwuluh',
    desaCodes: {
      'Karanglewas Lor': '33.02.25.1001',
      'Pasir Kidul': '33.02.25.1002',
      'Rejasari': '33.02.25.1003',
      'Pasirmuncang': '33.02.25.1004',
      'Bantarsoka': '33.02.25.1005',
      'Kober': '33.02.25.1006',
      'Kedungwuluh': '33.02.25.1007',
    },
  },

  // 26 — Purwokerto Timur (33.02.26)
  '33.02.26': {
    kecamatanId: '33.02.26',
    kecamatanName: 'Purwokerto Timur',
    defaultAdm4: '33.02.26.1001',
    defaultDesaName: 'Sokanegara',
    desaCodes: {
      'Sokanegara': '33.02.26.1001',
      'Kranji': '33.02.26.1002',
      'Purwokerto Lor': '33.02.26.1003',
      'Purwokerto Wetan': '33.02.26.1004',
      'Mersi': '33.02.26.1005',
      'Arcawinangun': '33.02.26.1006',
    },
  },

  // 27 — Purwokerto Utara (33.02.27)
  '33.02.27': {
    kecamatanId: '33.02.27',
    kecamatanName: 'Purwokerto Utara',
    defaultAdm4: '33.02.27.1002',
    defaultDesaName: 'Bancarkembar',
    desaCodes: {
      'Purwanegara': '33.02.27.1001',
      'Bancarkembar': '33.02.27.1002',
      'Sumampir': '33.02.27.1003',
      'Pabuwaran': '33.02.27.1004',
      'Pabuaran': '33.02.27.1004',
      'Grendeng': '33.02.27.1005',
      'Karangwangkal': '33.02.27.1006',
      'Bobosan': '33.02.27.1007',
    },
  },
};

// Normalize string helper for matching desa names despite accents or spacing
function normalizeName(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics (è -> e, â -> a)
    .replace(/[^a-z0-9]/g, ''); // strip spaces, hyphens
}

export function getAdm4Code(kecamatanId: string, desaName?: string): string {
  const mapping = BANYUMAS_ADM4_MAP[kecamatanId];
  if (!mapping) return '33.02.27.1002'; // fallback to Purwokerto Utara (Bancarkembar)

  if (desaName) {
    // 1. Direct match
    if (mapping.desaCodes[desaName]) {
      return mapping.desaCodes[desaName];
    }

    // 2. Normalized match
    const normSearch = normalizeName(desaName);
    for (const [name, code] of Object.entries(mapping.desaCodes)) {
      if (normalizeName(name) === normSearch) {
        return code;
      }
    }

    // 3. Partial substring match
    for (const [name, code] of Object.entries(mapping.desaCodes)) {
      if (normalizeName(name).includes(normSearch) || normSearch.includes(normalizeName(name))) {
        return code;
      }
    }
  }

  return mapping.defaultAdm4;
}
