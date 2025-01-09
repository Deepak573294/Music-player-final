import { PlayerService } from '../services/playerService.js';
import { NotificationUtil } from '../utils/notificationUtil.js';
import { FileUtil } from '../utils/fileUtil.js';

class PlayerController {
    constructor() {
        this.playerService = new PlayerService();
        this.notifier = new NotificationUtil();
        this.fileUtil = new FileUtil();
        this.initializePlayer();
    }

    async initializePlayer() {
        try {
            await this.setupAudioContext();
            this.setupEventListeners();
            this.setupAudioVisualizer();
            this.loadUserPlaylist();
        } catch (error) {
            this.notifier.showError('Player initialization failed: ' + error.message);
            console.error('Player init error:', error);
        }
    }

    async setupAudioContext() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        // Setup audio processing nodes...
    }

    // Enhanced file handling with validation
    async handleFileUpload(event) {
        try {
            const file = event.target.files[0];
            if (!this.fileUtil.isValidAudioFile(file)) {
                throw new Error('Invalid audio file format');
            }

            const metadata = await this.fileUtil.extractMetadata(file);
            const track = {
                title: metadata.title || file.name,
                artist: metadata.artist || 'Unknown Artist',
                duration: metadata.duration,
                url: URL.createObjectURL(file)
            };

            await this.playerService.addTrack(track);
            this.notifier.showSuccess('Track added successfully');
        } catch (error) {
            this.notifier.showError('File upload failed: ' + error.message);
            console.error('Upload error:', error);
        }
    }

    // Additional enhanced methods...
}

export const playerController = new PlayerController();
