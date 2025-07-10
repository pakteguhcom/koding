const kkaGalaxyData = {
  id: 'kka_pusat',
  label: 'Koding & Kecerdasan Artifisial (KKA)',
  content: {
    description: 'Mata pelajaran pilihan yang membekali peserta didik dengan keterampilan berpikir komputasional, literasi digital, serta pemahaman dan pemanfaatan Kecerdasan Artifisial secara bijak dan bertanggung jawab.',
    keyPoints: [
      'Diselenggarakan untuk jenjang SMP dan SMA/SMK sebagai mapel pilihan',
      'Berfokus pada penguasaan kompetensi abad ke-21',
      'Mendukung pengembangan sumber daya manusia yang unggul dan kompetitif di era digital',
    ],
    quote: 'Integrasi pembelajaran koding dan kecerdasan artifisial (KA) dalam pendidikan memungkinkan penggunaan teknologi secara maksimal untuk mendukung pembangunan nasional.'
  },
  children: [
    {
      id: 'pengantar',
      label: 'Pengantar Mapel KKA',
      content: {
        description: 'Latar belakang, tujuan, dan karakteristik Mata Pelajaran Koding dan Kecerdasan Artifisial dalam Kurikulum Nasional.',
        keyPoints: [
          '**Rasional:** Meningkatkan daya saing SDM, mendukung ekonomi berkelanjutan, dan menghasilkan generasi inovator.',
          '**Tujuan:** Mampu berpikir komputasional, cakap sebagai warga digital, terampil mengelola data, dan terampil berkarya dengan koding & KA.',
          '**Karakteristik:** Menanamkan etika, pembelajaran kontekstual, dan menggunakan pendekatan plugged/unplugged.',
        ],
        quote: 'Mata pelajaran KKA berkontribusi mewujudkan dimensi profil lulusan agar peserta didik memiliki nalar kritis, kemampuan bekerja mandiri, berkomunikasi dan berkolaborasi secara daring...'
      },
      children: []
    },
    {
      id: 'konsep',
      label: 'Konsep Keilmuan',
      content: {
        description: 'Membahas konsep-konsep dasar yang menjadi pilar keilmuan Koding dan Kecerdasan Artifisial.',
        keyPoints: [],
        quote: 'Koding dianggap sebagai pintu gerbang bagi peserta didik untuk memahami konsep-konsep dasar pemrograman dan logika komputasi.'
      },
      children: [
        {
          id: 'konsep_koding',
          label: 'Koding & Pemrograman',
          content: {
            description: 'Koding adalah proses mengubah ide menjadi instruksi yang dapat dipahami komputer, merupakan bagian dari siklus pemrograman yang lebih luas.',
            keyPoints: [
              '**Metode Belajar:** Plugged (dengan komputer), Unplugged (tanpa komputer, misal permainan), dan Internet-based.',
            ],
            quote: 'Koding dan pemrograman adalah dua istilah yang saling terkait, namun keduanya memiliki perbedaan sesuai dengan konteksnya.'
          },
          children: []
        },
        {
          id: 'konsep_ka',
          label: 'Kecerdasan Artifisial',
          content: {
            description: 'Cabang ilmu komputer yang berfokus pada pengembangan sistem yang dapat melakukan tugas yang umumnya memerlukan kecerdasan manusia.',
            keyPoints: [
              '**Definisi:** Kemampuan sistem untuk menginterpretasikan data eksternal, belajar darinya, dan menerapkan pembelajaran untuk mencapai tujuan.',
              '**Lanskap KA:** Terdiri dari Machine Learning, Deep Learning, dan Generative AI.',
            ],
            quote: 'Sejarah perkembangan KA dimulai pada pertengahan abad ke-20 dengan munculnya ide-ide awal yang dikemukakan oleh para pemikir seperti Alan Turing...'
          },
          children: []
        }
      ]
    },
    {
      id: 'elemen',
      label: 'Elemen Kunci KKA',
      content: {
        description: 'Pilar-pilar utama yang membangun kompetensi dalam mata pelajaran Koding dan Kecerdasan Artifisial.',
        keyPoints: [
          'Berpikir Komputasional',
          'Literasi Digital',
          'Literasi dan Etika Kecerdasan Artifisial',
          'Pemanfaatan dan Pengembangan Kecerdasan Artifisial',
          'Algoritma Pemrograman',
          'Analisis Data'
        ],
        quote: 'Elemen dan deskripsi elemen mata pelajaran Koding dan Kecerdasan Artifisial adalah sebagai berikut.'
      },
      children: [
        {
          id: 'elemen_bk',
          label: 'Berpikir Komputasional',
          content: {
            description: 'Keterampilan problem solving yang berjenjang untuk menghasilkan solusi efektif, efisien, dan optimal.',
            keyPoints: [
              '**Dekomposisi:** Memecah masalah kompleks menjadi lebih kecil.',
              '**Pengenalan Pola:** Identifikasi kesamaan yang berulang.',
              '**Abstraksi:** Fokus pada detail yang relevan dan mengabaikan yang tidak perlu.',
              '**Algoritma:** Mengembangkan urutan instruksi yang logis.',
            ],
            quote: 'Berpikir komputasional, seperti yang didefinisikan oleh Wing (2006), disajikan sebagai keterampilan dan pola pikir dasar yang tidak terbatas pada ilmuwan komputer tetapi dapat diterapkan secara universal.'
          },
          children: []
        },
        {
          id: 'elemen_etika',
          label: 'Etika Kecerdasan Artifisial',
          content: {
            description: 'Aspek krusial yang harus dipahami peserta didik terkait keadilan, akuntabilitas, dan transparansi dalam pengembangan dan penggunaan KA.',
            keyPoints: [
              '**Bias & Ketidakadilan:** Sistem KA dapat mencerminkan bias dari data pelatihannya.',
              '**Privasi & Keamanan Data:** Pentingnya melindungi data pribadi yang digunakan sistem KA.',
              '**Tanggung Jawab:** Pengguna bertanggung jawab atas bagaimana mereka menggunakan KA.',
              '**Hak Cipta:** Krusial dalam pemanfaatan KA Generatif.',
            ],
            quote: 'Etika pemanfaatan kecerdasan artifisial (KA) yang relevan untuk peserta didik di sekolah dasar dan menengah mencakup beberapa aspek kunci yang perlu dipahami dan diterapkan sejak dini.'
          },
          children: []
        }
      ]
    }
  ]
};
