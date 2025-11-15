/**
 * AudioPlayer Component
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert
} from 'react-native';
import { getDownloadUrl } from '../services/api';

interface AudioPlayerProps {
  audioId: string;
  duration: number;
  fileSize: number;
  format: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioId,
  duration,
  fileSize,
  format
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    const mb = (bytes / (1024 * 1024)).toFixed(2);
    return `${mb} MB`;
  };

  const handlePlayPause = () => {
    // For MVP, this is a placeholder
    // In production, integrate with react-native-sound or similar
    setIsPlaying(!isPlaying);
    Alert.alert(
      'Audio Player',
      'Audio playback would be implemented here using react-native-sound or similar library.'
    );
  };

  const handleDownload = async () => {
    const downloadUrl = getDownloadUrl(audioId);
    
    try {
      // Open download URL in browser
      const supported = await Linking.canOpenURL(downloadUrl);
      if (supported) {
        await Linking.openURL(downloadUrl);
      } else {
        Alert.alert('Error', 'Cannot open download link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download audio file');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audiobook Ready!</Text>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Duration:</Text>
          <Text style={styles.infoValue}>{formatDuration(duration)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>File Size:</Text>
          <Text style={styles.infoValue}>{formatFileSize(fileSize)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Format:</Text>
          <Text style={styles.infoValue}>{format.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlayPause}
        >
          <Text style={styles.playButtonText}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownload}
        >
          <Text style={styles.downloadButtonText}>⬇ Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center'
  },
  infoContainer: {
    marginBottom: 20
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600'
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 12
  },
  playButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
