/**
 * KKA Galaxy Explorer - script.js
 * * Script ini bertanggung jawab untuk:
 * 1. Merender node-node peta konsep secara dinamis dari objek data.
 * 2. Menggambar garis penghubung antar node.
 * 3. Menangani interaksi pengguna (klik pada node).
 * 4. Menampilkan informasi detail pada panel samping.
 */

// Menunggu hingga semua konten HTML selesai dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {

  // === 1. SELEKSI ELEMEN DOM ===
  const galaxyContainer = document.getElementById('galaxy-container');
  const infoPanel = document.getElementById('info-panel');
  const infoTitle = document.getElementById('info-title');
  const infoDescription = document.getElementById('info-description');
  const infoKeypoints = document.getElementById('info-keypoints');
  const infoQuote = document.getElementById('info-quote');
  const closeButton = document.getElementById('close-button');

  // Membuat wadah SVG untuk garis penghubung
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  svg.style.zIndex = '5';
  galaxyContainer.appendChild(svg);


  // === 2. FUNGSI RENDER DINAMIS ===

  /**
   * Fungsi utama untuk merender seluruh galaksi (node dan garis)
   */
  function renderGalaxy() {
    // Membersihkan container sebelum render ulang (jika diperlukan)
    galaxyContainer.querySelectorAll('.node').forEach(n => n.remove());
    svg.innerHTML = '';

    // Memulai proses render dari node pusat (level 0)
    createNodeElement(kkaGalaxyData, 0, null);
  }

  /**
   * Membuat elemen DIV untuk setiap node secara rekursif
   * dan menempatkannya dalam pola melingkar.
   * @param {object} nodeData - Objek data untuk node saat ini.
   * @param {number} level - Level hierarki node (0 untuk pusat).
   * @param {object} parentCoords - Koordinat {x, y} dari node induk.
   */
  function createNodeElement(nodeData, level, parentCoords) {
    const nodeElement = document.createElement('div');
    nodeElement.id = nodeData.id;
    nodeElement.className = `node level-${level}`;
    nodeElement.textContent = nodeData.label;

    // Menentukan posisi node
    const coords = calculateNodePosition(level, parentCoords, nodeData.children.length);
    nodeElement.style.left = `${coords.x}px`;
    nodeElement.style.top = `${coords.y}px`;

    galaxyContainer.appendChild(nodeElement);

    // Menambahkan event listener untuk menampilkan info saat diklik
    nodeElement.addEventListener('click', () => showInfo(nodeData.id));

    // Jika ada node induk, gambar garis penghubung
    if (parentCoords) {
      renderLine(parentCoords, coords);
    }

    // Lakukan rekursi untuk anak-anaknya
    if (nodeData.children && nodeData.children.length > 0) {
      nodeData.children.forEach(childNode => {
        createNodeElement(childNode, level + 1, coords);
      });
    }
  }

  /**
   * Menghitung posisi node. Pusat di tengah, anak-anaknya melingkar.
   */
  function calculateNodePosition(level, parentCoords, childCount) {
    if (level === 0) {
      // Posisi node pusat di tengah layar
      return {
        x: window.innerWidth / 2 - 75, // 75 adalah setengah lebar node level-0
        y: window.innerHeight / 2 - 75, // 75 adalah setengah tinggi node level-0
      };
    }
    
    // Posisi anak-anaknya dalam lingkaran di sekitar induk
    const angle = (Math.random() * 360) * (Math.PI / 180); // Posisi acak di lingkaran
    const radius = 150 + (level * 50); // Jarak dari induk
    const parentWidth = level === 1 ? 150 : 120; // Lebar node induk
    
    return {
      x: parentCoords.x + (parentWidth / 2) + radius * Math.cos(angle),
      y: parentCoords.y + (parentWidth / 2) + radius * Math.sin(angle),
    };
  }

  /**
   * Menggambar garis SVG dari satu titik ke titik lain
   */
  function renderLine(startCoords, endCoords) {
    const line = document.createElementNS(svgNS, 'line');
    // Offset untuk membuat garis berawal/berakhir di tengah node
    const nodeSizeOffset = 75; // Setengah dari ukuran node terbesar
    line.setAttribute('x1', startCoords.x + nodeSizeOffset);
    line.setAttribute('y1', startCoords.y + nodeSizeOffset);
    line.setAttribute('x2', endCoords.x + 45); // 45 adalah setengah lebar node level-2
    line.setAttribute('y2', endCoords.y + 45);
    line.setAttribute('stroke', 'rgba(0, 212, 255, 0.5)');
    line.setAttribute('stroke-width', '2');
    svg.appendChild(line);
  }


  // === 3. LOGIKA PANEL INFORMASI ===

  /**
   * Menampilkan panel informasi dengan konten dari node yang dipilih.
   * @param {string} nodeId - ID dari node yang diklik.
   */
  function showInfo(nodeId) {
    const nodeData = findNodeById(kkaGalaxyData, nodeId);
    if (!nodeData) return;

    const { content } = nodeData;
    infoTitle.textContent = nodeData.label;
    infoDescription.textContent = content.description;
    infoQuote.textContent = `"${content.quote}"`;

    // Mengisi poin-poin kunci
    infoKeypoints.innerHTML = '<ul>' + content.keyPoints.map(point => `<li>${point}</li>`).join('') + '</ul>';

    // Menampilkan panel
    infoPanel.classList.add('visible');
    infoPanel.classList.remove('hidden');
  }

  /**
   * Menyembunyikan panel informasi.
   */
  function hideInfo() {
    infoPanel.classList.add('hidden');
    infoPanel.classList.remove('visible');
  }

  /**
   * Helper function untuk mencari data node berdasarkan ID secara rekursif.
   */
  function findNodeById(data, id) {
    if (data.id === id) {
      return data;
    }
    if (data.children) {
      for (const child of data.children) {
        const found = findNodeById(child, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
  
  // === 4. EVENT LISTENERS ===
  closeButton.addEventListener('click', hideInfo);


  // === INISIALISASI ===
  renderGalaxy();

});


/*
 * === 4. NAVIGASI (SARAN KONSEPTUAL) ===
 * * Fungsionalitas Pan (geser) dan Zoom (perbesar/perkecil) adalah fitur lanjutan
 * yang cukup kompleks untuk diimplementasikan dari nol.
 *
 * PENDEKATAN MANUAL:
 * 1. Pan: Anda perlu menangani event `mousedown`, `mousemove`, dan `mouseup` pada `#galaxy-container`.
 * Saat mouse ditekan, catat posisi awal. Saat mouse bergerak, hitung selisihnya dan
 * aplikasikan `transform: translate(x, y)` pada container.
 * 2. Zoom: Anda perlu menangani event `wheel`. Saat scroll, ubah nilai `transform: scale(value)`
 * pada container. Anda juga perlu menyesuaikan titik asal zoom agar terpusat pada kursor.
 *
 * PENDEKATAN DENGAN LIBRARY (Sangat Direkomendasikan):
 * Untuk hasil yang lebih mulus dan implementasi yang jauh lebih mudah, gunakan library
 * yang sudah ada.
 * * - d3.js (D3-Zoom): Sangat powerful dan cocok jika Anda ingin visualisasi yang sangat
 * terkontrol dan berbasis data. Memberikan kontrol penuh atas perilaku zoom dan pan.
 * * - panzoom.js: Library yang lebih ringan dan fokus hanya pada fungsionalitas pan dan zoom.
 * Lebih mudah diimplementasikan jika Anda hanya butuh fitur tersebut.
 * * Contoh implementasi dengan panzoom.js:
 * const elem = document.getElementById('galaxy-container');
 * const panzoom = Panzoom(elem, {
 * maxScale: 5,
 * minScale: 0.3
 * });
 * elem.addEventListener('wheel', panzoom.zoomWithWheel);
 */
