/**
 * KKA Galaxy Explorer - script.js (Versi Final Diperbaiki)
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
 */
function debounce(func, delay = 250) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

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
    
    // === 2. FUNGSI UTAMA & HELPER ===

    function getNodeSize(level) {
        const isDesktop = window.innerWidth > 768;
        if (level === 0) return isDesktop ? 150 : 120;
        if (level === 1) return isDesktop ? 120 : 100;
        return isDesktop ? 90 : 70;
    }

    function renderGalaxy() {
        galaxyContainer.querySelectorAll('.node').forEach(n => n.remove());
        svg.innerHTML = '';
        svg.setAttribute('width', window.innerWidth);
        svg.setAttribute('height', window.innerHeight);
        createNodeElement(kkaGalaxyData, 0, null, 0); // Memulai dengan angle 0
    }

    /**
     * PERBAIKAN: Fungsi ini sekarang menerima 'angle' dengan benar.
     */
    function createNodeElement(nodeData, level, parentCoords, angle) {
        const nodeElement = document.createElement('div');
        const nodeSize = getNodeSize(level);

        nodeElement.id = nodeData.id;
        nodeElement.className = `node level-${level}`;
        nodeElement.textContent = nodeData.label;
        nodeElement.style.width = `${nodeSize}px`;
        nodeElement.style.height = `${nodeSize}px`;

        // PERBAIKAN: Memastikan 'angle' diteruskan ke fungsi kalkulasi
        const coords = calculateNodePosition(level, parentCoords, nodeSize, angle);
        nodeElement.style.left = `${coords.x}px`;
        nodeElement.style.top = `${coords.y}px`;

        galaxyContainer.appendChild(nodeElement);
        nodeElement.addEventListener('click', () => showInfo(nodeData.id));

        if (parentCoords) {
            renderLine(parentCoords, coords, level);
        }

        if (nodeData.children && nodeData.children.length > 0) {
            const angleIncrement = (2 * Math.PI) / nodeData.children.length;
            nodeData.children.forEach((childNode, index) => {
                const newAngle = index * angleIncrement;
                createNodeElement(childNode, level + 1, coords, newAngle);
            });
        }
    }

    /**
     * PERBAIKAN: Fungsi ini sekarang menerima 'angle' dan menghitung posisi dengan benar.
     */
    function calculateNodePosition(level, parentCoords, nodeSize, angle) {
        if (level === 0) {
            return {
                x: window.innerWidth / 2 - (nodeSize / 2),
                y: window.innerHeight / 2 - (nodeSize / 2),
            };
        }
        
        const parentSize = getNodeSize(level - 1);
        const radius = Math.min(window.innerWidth, window.innerHeight) / 5 + (level * 15);
        const parentCenterX = parentCoords.x + parentSize / 2;
        const parentCenterY = parentCoords.y + parentSize / 2;
        
        return {
            x: parentCenterX + radius * Math.cos(angle) - (nodeSize / 2),
            y: parentCenterY + radius * Math.sin(angle) - (nodeSize / 2),
        };
    }

    function renderLine(startCoords, endCoords, level) {
        const line = document.createElementNS(svgNS, 'line');
        const parentSize = getNodeSize(level - 1);
        const childSize = getNodeSize(level);

        line.setAttribute('x1', `${startCoords.x + parentSize / 2}`);
        line.setAttribute('y1', `${startCoords.y + parentSize / 2}`);
        line.setAttribute('x2', `${endCoords.x + childSize / 2}`);
        line.setAttribute('y2', `${endCoords.y + childSize / 2}`);
        line.setAttribute('stroke', 'rgba(0, 212, 255, 0.5)');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
    }

    // === 3. LOGIKA PANEL INFORMASI ===
    function showInfo(nodeId) {
        const nodeData = findNodeById(kkaGalaxyData, nodeId);
        if (!nodeData) return;

        const { content } = nodeData;
        infoTitle.textContent = nodeData.label;
        infoDescription.textContent = content.description;
        infoQuote.textContent = `"${content.quote}"`;
        infoKeypoints.innerHTML = '<ul>' + content.keyPoints.map(point => `<li>${point}</li>`).join('') + '</ul>';

        infoPanel.classList.add('visible');
        infoPanel.classList.remove('hidden');
    }

    function hideInfo() {
        infoPanel.classList.add('hidden');
        infoPanel.classList.remove('visible');
    }

    function findNodeById(data, id) {
        if (data.id === id) return data;
        if (data.children) {
            for (const child of data.children) {
                const found = findNodeById(child, id);
                if (found) return found;
            }
        }
        return null;
    }
    
    // === 4. EVENT LISTENERS ===
    closeButton.addEventListener('click', hideInfo);
    window.addEventListener('resize', debounce(renderGalaxy, 250));

    // === INISIALISASI ===
    renderGalaxy();
});
