import { playerService } from '../services/playerService.js';
import { NotificationUtil } from '../utils/notificationUtil.js';
import { formatTime } from '../utils/formatters.js';
import { apiRequest } from '../utils/api.js';

class PlayerController {
    constructor() {
        this.notifier = new NotificationUtil();
        this.initializePlayer();
    }

    async initializePlayer() {
        this.setupEventListeners();
        await this.loadUserPlaylist();
        this.updatePlayerUI();
    }

    setupEventListeners() {
        document.getElementById('playBtn').addEventListener('click', () => this.togglePlay());
        document.getElementById('prevBtn').addEventListener('click', () => this.playPrevious());
        document.getElementById('nextBtn').addEventListener('click', () => this.playNext());
        document.getElementById('volumeSlider').addEventListener('input', (e) => this.setVolume(e.target.value));
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileUpload(e));
        
        playerService.audio.addEventListener('timeupdate', () => this.updateProgress());
        playerService.audio.addEventListener('ended', () => this.playNext());
    }

    togglePlay() {
        if (playerService.audio.paused) {
            playerService.play();
        } else {
            playerService.pause();
        }
        this.updatePlayButton();
    }

    playPrevious() {
        playerService.currentTrackIndex = (playerService.currentTrackIndex - 1 + playerService.playlist.length) % playerService.playlist.length;
        this.loadAndPlayTrack();
    }

    playNext() {
        playerService.currentTrackIndex = (playerService.currentTrackIndex + 1) % playerService.playlist.length;
        this.loadAndPlayTrack();
    }

    setVolume(value) {
        playerService.setVolume(value / 100);
    }

    async handleFileUpload(event) {
        try {
            const file = event.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', localStorage.getItem('userId'));

            const response = await apiRequest('/api/music/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.success) {
                this.notifier.showSuccess('File uploaded successfully');
                await this.loadUserPlaylist();
            } else {
                throw new Error('Failed to upload file');
            }
        } catch (error) {
            this.notifier.showError('File upload failed: ' + error.message);
            console.error('Upload error:', error);
        }
    }

    async loadUserPlaylist() {
        try {
            const userId = localStorage.getItem('userId');
            const response = await apiRequest(`/api/music/playlist/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            playerService.playlist = response;
            this.updatePlaylistUI();
        } catch (error) {
            this.notifier.showError('Failed to load playlist: ' + error.message);
            console.error('Playlist load error:', error);
        }
    }

    loadAndPlayTrack() {
        const currentTrack = playerService.playlist[playerService.currentTrackIndex];
        if (currentTrack) {
            playerService.setTrack(currentTrack.url);
            playerService.play();
            this.updatePlayerUI();
        }
    }

    updatePlayerUI() {
        const currentTrack = playerService.playlist[playerService.currentTrackIndex];
        if (currentTrack) {
            document.getElementById('songTitle').textContent = currentTrack.title;
            // Update other UI elements as needed
        }
        this.updatePlayButton();
    }

    updatePlayButton() {
        const playBtn = document.getElementById('playBtn');
        playBtn.innerHTML = playerService.audio.paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
    }

    updateProgress() {
        const progressBar = document.querySelector('.progress-bar');
        const currentTimeEl = document.querySelector('.current-time');
        const durationEl = document.querySelector('.duration');

        const progress = (playerService.audio.currentTime / playerService.audio.duration) * 100;
        progressBar.style.width = `${progress}%`;

        currentTimeEl.textContent = formatTime(playerService.audio.currentTime);
        durationEl.textContent = formatTime(playerService.audio.duration);
    }

    updatePlaylistUI() {
        const playlistEl = document.getElementById('playlistItems');
        playlistEl.innerHTML = '';
        playerService.playlist.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = track.title;
            li.classList.add('list-group-item');
            li.addEventListener('click', () => {
                playerService.currentTrackIndex = index;
                this.loadAndPlayTrack();
            });
            playlistEl.appendChild(li);
        });
    }
}

export const playerController = new PlayerController();

