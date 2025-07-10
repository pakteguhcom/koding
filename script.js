/**
 * KKA Galaxy Explorer - script.js
 * Script ini bertanggung jawab untuk:
 * 1. Merender node-node peta konsep secara dinamis dari objek data.
 * 2. Menggambar garis penghubung antar node.
 * 3. Menangani interaksi pengguna (klik pada node).
 * 4. Menampilkan informasi detail pada panel samping.
 * 5. Menyesuaikan layout saat ukuran jendela berubah (responsif).
 */

/**
 * Fungsi Debounce untuk menunda eksekusi fungsi agar tidak terlalu sering dijalankan.
 * Ini mencegah browser dari lag saat pengguna mengubah ukuran jendela.
 * @param {Function} func - Fungsi yang ingin ditunda eksekusinya.
 * @param {number} delay - Waktu penundaan dalam milidetik (default 250ms).
 */
function debounce(func, delay = 250) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

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
    let svg = galaxyContainer.querySelector('svg');
    if (!svg) {
        svg = document.createElementNS(svgNS, "svg");
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.zIndex = '5';
        galaxyContainer.appendChild(svg);
    }
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');


    // === 2. FUNGSI RENDER DINAMIS ===

    /**
     * Fungsi utama untuk merender seluruh galaksi (node dan garis)
     */
    function renderGalaxy() {
        // Membersihkan container sebelum render ulang
        galaxyContainer.querySelectorAll('.node').forEach(n => n.remove());
        svg.innerHTML = ''; // Membersihkan garis-garis SVG

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
            renderLine(parentCoords, coords, level);
        }

        // Lakukan rekursi untuk anak-anaknya
        if (nodeData.children && nodeData.children.length > 0) {
            let angleIncrement = (2 * Math.PI) / nodeData.children.length;
            nodeData.children.forEach((childNode, index) => {
                const angle = index * angleIncrement;
                createNodeElement(childNode, level + 1, coords, angle);
            });
        }
    }

    /**
     * Menghitung posisi node. Pusat di tengah, anak-anaknya melingkar.
     */
    function calculateNodePosition(level, parentCoords, childCount, angle) {
        if (level === 0) {
            // Posisi node pusat di tengah layar
            return {
                x: window.innerWidth / 2 - (window.innerWidth > 768 ? 75 : 60), // Setengah lebar node
                y: window.innerHeight / 2 - (window.innerWidth > 768 ? 75 : 60), // Setengah tinggi node
            };
        }
        
        // Posisi anak-anaknya dalam lingkaran di sekitar induk
        const radius = Math.min(window.innerWidth, window.innerHeight) / 4.5 + (level * 20); // Jarak dari induk
        const parentSize = window.innerWidth > 768 ? (level === 1 ? 150 : 120) : (level === 1 ? 120 : 100);
        const childSize = window.innerWidth > 768 ? (level === 2 ? 90: 120) : (level === 2 ? 70 : 100);

        return {
            x: parentCoords.x + (parentSize / 2) - (childSize / 2) + radius * Math.cos(angle),
            y: parentCoords.y + (parentSize / 2) - (childSize / 2) + radius * Math.sin(angle),
        };
    }

    /**
     * Menggambar garis SVG dari satu titik ke titik lain
     */
    function renderLine(startCoords, endCoords, level) {
        const line = document.createElementNS(svgNS, 'line');
        // Offset untuk membuat garis berawal/berakhir di tengah node
        const parentSize = window.innerWidth > 768 ? (level === 1 ? 150 : 120) : (level === 1 ? 120 : 100);
        const childSize = window.innerWidth > 768 ? (level === 2 ? 90: 120) : (level === 2 ? 70 : 100);

        line.setAttribute('x1', startCoords.x + parentSize/2);
        line.setAttribute('y1', startCoords.y + parentSize/2);
        line.setAttribute('x2', endCoords.x + childSize/2);
        line.setAttribute('y2', endCoords.y + childSize/2);
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

    // === 5. EVENT LISTENER UNTUK RESIZE ===
    // Menambahkan event listener saat ukuran jendela berubah,
    // dengan debounce agar tidak memberatkan browser.
    window.addEventListener('resize', debounce(renderGalaxy));

    // === INISIALISASI ===
    renderGalaxy();

});

/*
 * === NAVIGASI (SARAN KONSEPTUAL) ===
 * Fungsionalitas Pan (geser) dan Zoom (perbesar/perkecil) adalah fitur lanjutan
 * yang cukup kompleks untuk diimplementasikan dari nol. Untuk hasil yang lebih
 * mulus dan implementasi yang jauh lebih mudah, sangat disarankan menggunakan
 * library seperti d3.js atau panzoom.js.
 */
