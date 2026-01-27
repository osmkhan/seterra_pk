// Seterra Pakistan - Geography Quiz Game
// Main Application Logic

class SeterraGame {
    constructor() {
        // Game state
        this.currentMode = 'all';
        this.cities = [];
        this.remainingCities = [];
        this.currentCity = null;
        this.attempts = 0;
        this.score = 0;
        this.correctFirstTry = 0;
        this.correctSecondTry = 0;
        this.incorrect = 0;
        this.isPlaying = false;
        this.startTime = null;
        this.timerInterval = null;

        // Map elements
        this.map = null;
        this.markers = {};
        this.cityResults = {};
        this.provinceGeoJsonData = null;
        this.provinceLayer = null;
        this.provinceHighlightLayer = null;
        this.pendingProvinceName = null;

        // DOM elements
        this.targetCityEl = document.getElementById('targetCity');
        this.scoreEl = document.getElementById('score');
        this.timerEl = document.getElementById('timer');
        this.progressEl = document.getElementById('progress');
        this.progressBarEl = document.getElementById('progressBar');
        this.startBtn = document.getElementById('startBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.feedbackEl = document.getElementById('feedback');
        this.resultsPanelEl = document.getElementById('resultsPanel');
        this.finalScoreEl = document.getElementById('finalScore');
        this.finalTimeEl = document.getElementById('finalTime');
        this.firstTryCountEl = document.getElementById('firstTryCount');
        this.cityCountEl = document.getElementById('cityCount');

        // Initialize
        this.init();
    }

    init() {
        this.initMap();
        this.bindEvents();
        this.loadMode('all');
    }

    initMap() {
        // Create map centered on Pakistan
        this.map = L.map('map', {
            center: PAKISTAN_BOUNDS.center,
            zoom: PAKISTAN_BOUNDS.zoom,
            minZoom: PAKISTAN_BOUNDS.minZoom,
            maxZoom: PAKISTAN_BOUNDS.maxZoom,
            maxBounds: PAKISTAN_BOUNDS.bounds,
            maxBoundsViscosity: 1.0
        });

        // Add dark tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);

        // Province boundaries overlay (no labels)
        this.map.createPane('boundaries');
        const boundariesPane = this.map.getPane('boundaries');
        boundariesPane.style.zIndex = 450;
        boundariesPane.style.pointerEvents = 'none';
        boundariesPane.style.mixBlendMode = 'normal';
        boundariesPane.style.filter = 'none';
        this.loadProvinceBorders();
    }

    loadProvinceBorders() {
        const data = window.PROVINCE_BORDERS;
        const featureCount = Array.isArray(data?.features) ? data.features.length : 0;
        console.info('[borders] loaded features:', featureCount);
        if (!featureCount) {
            console.warn('[borders] no features found in provinces.js');
            return;
        }
        this.provinceGeoJsonData = data;
        this.provinceLayer = L.geoJSON(data, {
            pane: 'boundaries',
            style: {
                color: '#cfd8dc',
                weight: 1.2,
                opacity: 0.45,
                fillOpacity: 0,
                lineCap: 'round',
                lineJoin: 'round',
                className: 'province-border'
            }
        }).addTo(this.map);
        if (this.pendingProvinceName) {
            this.highlightProvince(this.pendingProvinceName);
        }
        console.info('[borders] province borders added to map');
    }

    getProvinceNameForRegion(region) {
        const map = {
            punjab: 'Punjab',
            punjabTowns: 'Punjab',
            sindh: 'Sind',
            kpk: 'N.W.F.P.',
            balochistan: 'Baluchistan',
            capital: 'F.C.T.',
            azadKashmir: 'Azad Kashmir',
            gilgitBaltistan: 'Northern Areas'
        };
        return map[region] || null;
    }

    highlightProvince(provinceName) {
        if (!this.provinceGeoJsonData) {
            this.pendingProvinceName = provinceName;
            return;
        }
        this.pendingProvinceName = null;
        if (this.provinceHighlightLayer) {
            this.map.removeLayer(this.provinceHighlightLayer);
        }
        this.provinceHighlightLayer = L.geoJSON(this.provinceGeoJsonData, {
            pane: 'boundaries',
            filter: (feature) => feature?.properties?.NAME_1 === provinceName,
            style: {
                color: '#ffffff',
                weight: 3.2,
                opacity: 1,
                fillOpacity: 0,
                lineCap: 'round',
                lineJoin: 'round',
                className: 'province-border-highlight'
            }
        }).addTo(this.map);
    }

    bindEvents() {
        // Start button
        this.startBtn.addEventListener('click', () => this.startQuiz());

        // Restart button
        this.restartBtn.addEventListener('click', () => this.restartQuiz());

        // Mode navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.isPlaying) {
                    if (!confirm('Changing mode will end the current quiz. Continue?')) {
                        return;
                    }
                    this.endQuiz(true);
                }

                // Update active button
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Load new mode
                const mode = e.target.dataset.mode;
                this.loadMode(mode);
            });
        });
    }

    loadMode(mode) {
        this.currentMode = mode;

        // Get cities for this mode
        if (mode === 'all') {
            this.cities = getAllCities();
        } else {
            this.cities = getCitiesByRegion(mode);
        }

        // Update city count
        this.cityCountEl.textContent = this.cities.length;

        // Clear and redraw markers
        this.clearMarkers();
        this.createMarkers();

        // Reset UI
        this.resetUI();

        // Fit map to show all markers
        this.fitMapToMarkers();
    }

    clearMarkers() {
        for (const name in this.markers) {
            this.map.removeLayer(this.markers[name]);
        }
        this.markers = {};
        this.cityResults = {};
    }

    createMarkers() {
        this.cities.forEach(city => {
            const marker = L.marker([city.lat, city.lng], {
                icon: this.createMarkerIcon()
            }).addTo(this.map);

            // Store reference
            this.markers[city.name] = marker;
            this.cityResults[city.name] = null;

            // Add click handler
            marker.on('click', () => this.handleCityClick(city));

            // Add tooltip with city name (shown on hover in learn mode)
            marker.bindTooltip(city.name, {
                permanent: false,
                direction: 'top',
                className: 'city-label'
            });
        });
    }

    createMarkerIcon(status = 'default') {
        const colors = {
            default: '#0b6b3a',
            correctFirst: '#e8eaed',
            correctSecond: '#fbbc04',
            incorrect: '#ea4335'
        };

        const color = colors[status] || colors.default;
        const size = status === 'default' ? 22 : 24;

        return L.divIcon({
            className: `city-marker ${status !== 'default' ? status.replace(/([A-Z])/g, '-$1').toLowerCase() : ''}`,
            iconSize: [size, size],
            iconAnchor: [size/2, size/2]
        });
    }

    fitMapToMarkers() {
        if (this.cities.length === 0) return;

        const bounds = L.latLngBounds(
            this.cities.map(city => [city.lat, city.lng])
        );

        this.map.fitBounds(bounds, { padding: [50, 50] });
    }

    resetUI() {
        document.body.classList.remove('is-playing');
        this.targetCityEl.textContent = '-';
        this.scoreEl.textContent = '0%';
        this.timerEl.textContent = '0:00';
        this.progressEl.textContent = `0/${this.cities.length}`;
        this.progressBarEl.style.width = '0%';
        this.resultsPanelEl.classList.remove('visible');
        this.startBtn.disabled = false;
        this.startBtn.textContent = 'Start Quiz';
        this.restartBtn.disabled = true;
    }

    startQuiz() {
        // Reset game state
        this.remainingCities = [...this.cities];
        this.shuffleArray(this.remainingCities);
        this.score = 0;
        this.correctFirstTry = 0;
        this.correctSecondTry = 0;
        this.incorrect = 0;
        this.attempts = 0;
        this.isPlaying = true;
        document.body.classList.add('is-playing');
        this.cityResults = {};

        // Reset all markers
        for (const name in this.markers) {
            this.cityResults[name] = null;
            this.markers[name].setIcon(this.createMarkerIcon());
            this.markers[name].getElement()?.classList.remove('disabled', 'highlight');
            this.markers[name].unbindTooltip();
            this.markers[name].bindTooltip(name, {
                permanent: false,
                direction: 'top',
                className: 'city-label'
            });
        }

        // Update UI
        this.startBtn.disabled = true;
        this.startBtn.textContent = 'Playing...';
        this.restartBtn.disabled = false;
        this.resultsPanelEl.classList.remove('visible');

        // Start timer
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);

        // Show first city
        this.nextCity();
    }

    nextCity() {
        if (this.remainingCities.length === 0) {
            this.endQuiz();
            return;
        }

        // Get next city
        this.currentCity = this.remainingCities.shift();
        this.attempts = 0;

        // Update UI
        this.targetCityEl.textContent = this.currentCity.name;
        this.updateProgress();
        const provinceKey = this.currentCity.provinceKey || this.currentCity.region;
        this.highlightProvince(this.getProvinceNameForRegion(provinceKey));

        // Enable all unmarked markers
        for (const name in this.markers) {
            const el = this.markers[name].getElement();
            if (el && this.cityResults[name] === null) {
                el.classList.remove('disabled');
            }
        }
    }

    handleCityClick(city) {
        if (!this.isPlaying || !this.currentCity) return;
        if (this.cityResults[city.name] !== null) return; // Already answered

        this.attempts++;

        if (city.name === this.currentCity.name) {
            // Correct answer
            let status;
            if (this.attempts === 1) {
                this.correctFirstTry++;
                status = 'correctFirst';
                this.showFeedback('Correct!', 'success');
            } else {
                this.correctSecondTry++;
                status = 'correctSecond';
                this.showFeedback('Correct on 2nd try!', 'warning');
            }

            // Update marker
            this.cityResults[city.name] = status;
            const correctMarker = this.markers[city.name];
            correctMarker.setIcon(this.createMarkerIcon(status));
            correctMarker.getElement()?.classList.add('disabled');
            correctMarker.unbindTooltip();
            correctMarker.bindTooltip(city.name, {
                permanent: true,
                direction: 'top',
                className: 'city-label revealed'
            });
            correctMarker.openTooltip();

            // Update score
            this.updateScore();

            // Next city after short delay
            setTimeout(() => this.nextCity(), 500);

        } else {
            // Wrong answer
            if (this.attempts >= 2) {
                // Mark as incorrect after 2 attempts
                this.incorrect++;
                this.cityResults[this.currentCity.name] = 'incorrect';

                // Highlight correct answer
                const correctMarker = this.markers[this.currentCity.name];
                correctMarker.setIcon(this.createMarkerIcon('incorrect'));
                correctMarker.getElement()?.classList.add('highlight', 'disabled');
                correctMarker.unbindTooltip();
                correctMarker.bindTooltip(this.currentCity.name, {
                    permanent: true,
                    direction: 'top',
                    className: 'city-label revealed'
                });
                correctMarker.openTooltip();

                this.showFeedback(`It was ${this.currentCity.name}!`, 'error');
                this.updateScore();

                // Next city after delay
                setTimeout(() => this.nextCity(), 1500);
            } else {
                // First wrong attempt
                this.showFeedback('Try again!', 'error');

                // Briefly flash the wrong marker
                const wrongMarker = this.markers[city.name];
                wrongMarker.getElement()?.classList.add('highlight');
                setTimeout(() => {
                    wrongMarker.getElement()?.classList.remove('highlight');
                }, 300);
            }
        }
    }

    updateScore() {
        const total = this.cities.length;
        const answered = this.correctFirstTry + this.correctSecondTry + this.incorrect;

        // Score calculation: 100% for first try, 50% for second, 0% for incorrect
        const points = this.correctFirstTry * 100 + this.correctSecondTry * 50;
        const maxPoints = answered * 100;
        const percentage = maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;

        this.scoreEl.textContent = `${percentage}%`;
    }

    updateProgress() {
        const total = this.cities.length;
        const completed = this.correctFirstTry + this.correctSecondTry + this.incorrect;

        this.progressEl.textContent = `${completed}/${total}`;
        this.progressBarEl.style.width = `${(completed / total) * 100}%`;
    }

    updateTimer() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        this.timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    showFeedback(message, type) {
        this.feedbackEl.textContent = message;
        this.feedbackEl.className = `feedback visible ${type}`;

        setTimeout(() => {
            this.feedbackEl.classList.remove('visible');
        }, 1500);
    }

    endQuiz(cancelled = false) {
        this.isPlaying = false;
        document.body.classList.remove('is-playing');
        clearInterval(this.timerInterval);

        if (!cancelled) {
            // Calculate final stats
            const total = this.cities.length;
            const points = this.correctFirstTry * 100 + this.correctSecondTry * 50;
            const maxPoints = total * 100;
            const percentage = Math.round((points / maxPoints) * 100);

            // Show results
            this.finalScoreEl.textContent = `${percentage}%`;
            this.finalTimeEl.textContent = this.timerEl.textContent;
            this.firstTryCountEl.textContent = `${this.correctFirstTry}/${total}`;
            this.resultsPanelEl.classList.add('visible');
        }

        // Update buttons
        this.startBtn.disabled = false;
        this.startBtn.textContent = 'Play Again';
        this.targetCityEl.textContent = cancelled ? '-' : 'Complete!';
    }

    restartQuiz() {
        if (this.isPlaying) {
            this.endQuiz(true);
        }
        this.loadMode(this.currentMode);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new SeterraGame();
});
