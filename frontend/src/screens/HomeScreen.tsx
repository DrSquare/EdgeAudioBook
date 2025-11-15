/**
 * HomeScreen - Main screen for EdgeAudioBook application
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import { FileUploader } from '../components/FileUploader';
import { TextEditor } from '../components/TextEditor';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { AudioPlayer } from '../components/AudioPlayer';
import { usePolling } from '../hooks/usePolling';
import { generateAudio } from '../services/api';
import { JobStatus, AudioStatus } from '../types';
import {
  VOICE_OPTIONS,
  SPEED_OPTIONS,
  FORMAT_OPTIONS
} from '../utils/constants';

export const HomeScreen: React.FC = () => {
  // State for upload and text extraction
  const [jobId, setJobId] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);

  // State for audio generation
  const [audioId, setAudioId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioCompleted, setAudioCompleted] = useState(false);
  const [audioDetails, setAudioDetails] = useState<{
    duration: number;
    fileSize: number;
    format: string;
  } | null>(null);

  // State for voice settings
  const [selectedVoice, setSelectedVoice] = useState<'male' | 'female'>('female');
  const [selectedSpeed, setSelectedSpeed] = useState<number>(1.0);
  const [selectedFormat, setSelectedFormat] = useState<'mp3' | 'wav'>('mp3');

  // Polling for text extraction status
  const {
    status: jobStatus,
    startPolling: startJobPolling
  } = usePolling(
    jobId,
    'job',
    (data) => {
      const status = data as JobStatus;
      if (status.extracted_text) {
        setExtractedText(status.extracted_text);
        setIsExtracting(false);
      }
    },
    (error) => {
      Alert.alert('Extraction Failed', error);
      setIsExtracting(false);
    }
  );

  // Polling for audio generation status
  const {
    status: audioStatus,
    startPolling: startAudioPolling
  } = usePolling(
    audioId,
    'audio',
    (data) => {
      const status = data as AudioStatus;
      setAudioDetails({
        duration: status.duration || 0,
        fileSize: status.file_size || 0,
        format: status.format || 'mp3'
      });
      setAudioCompleted(true);
      setIsGenerating(false);
    },
    (error) => {
      Alert.alert('Audio Generation Failed', error);
      setIsGenerating(false);
    }
  );

  const handleUploadSuccess = (newJobId: string) => {
    setJobId(newJobId);
    setIsExtracting(true);
    setExtractedText('');
    setAudioCompleted(false);
  };

  const handleUploadError = (error: string) => {
    Alert.alert('Upload Failed', error);
  };

  const handleGenerateAudio = async () => {
    if (!extractedText.trim()) {
      Alert.alert('Error', 'No text available to generate audio');
      return;
    }

    setIsGenerating(true);
    setAudioCompleted(false);

    try {
      const response = await generateAudio({
        text: extractedText,
        voice: selectedVoice,
        speed: selectedSpeed,
        format: selectedFormat
      });

      setAudioId(response.audio_id);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to generate audio';
      Alert.alert('Error', errorMsg);
      setIsGenerating(false);
    }
  };

  const handleNewDocument = () => {
    setJobId(null);
    setAudioId(null);
    setExtractedText('');
    setIsExtracting(false);
    setIsGenerating(false);
    setAudioCompleted(false);
  };

  // Start polling when jobId is set
  useEffect(() => {
    if (jobId && isExtracting) {
      startJobPolling();
    }
  }, [jobId, isExtracting, startJobPolling]);

  // Start polling when audioId is set
  useEffect(() => {
    if (audioId && isGenerating) {
      startAudioPolling();
    }
  }, [audioId, isGenerating, startAudioPolling]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>EdgeAudioBook</Text>
          <Text style={styles.headerSubtitle}>
            Convert documents to audiobooks using AI
          </Text>
        </View>

        {/* File Upload */}
        {!isExtracting && !extractedText && (
          <FileUploader
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        )}

        {/* Extraction Progress */}
        {isExtracting && jobStatus && (
          <ProgressIndicator
            status={jobStatus.status}
            progress={jobStatus.progress}
            message={jobStatus.message}
          />
        )}

        {/* Text Editor */}
        {extractedText && !isGenerating && !audioCompleted && (
          <>
            <TextEditor
              text={extractedText}
              onTextChange={setExtractedText}
              editable={true}
            />

            {/* Voice Settings */}
            <View style={styles.settingsContainer}>
              <Text style={styles.settingsTitle}>Audio Settings</Text>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Voice:</Text>
                <View style={styles.optionButtons}>
                  {VOICE_OPTIONS.map(option => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        selectedVoice === option.value && styles.optionButtonActive
                      ]}
                      onPress={() => setSelectedVoice(option.value as 'male' | 'female')}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          selectedVoice === option.value && styles.optionButtonTextActive
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Speed:</Text>
                <View style={styles.optionButtons}>
                  {SPEED_OPTIONS.slice(0, 4).map(option => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        selectedSpeed === option.value && styles.optionButtonActive
                      ]}
                      onPress={() => setSelectedSpeed(option.value)}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          selectedSpeed === option.value && styles.optionButtonTextActive
                        ]}
                      >
                        {option.value}x
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Format:</Text>
                <View style={styles.optionButtons}>
                  {FORMAT_OPTIONS.map(option => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        selectedFormat === option.value && styles.optionButtonActive
                      ]}
                      onPress={() => setSelectedFormat(option.value as 'mp3' | 'wav')}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          selectedFormat === option.value && styles.optionButtonTextActive
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleGenerateAudio}
            >
              <Text style={styles.generateButtonText}>Generate Audiobook</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Audio Generation Progress */}
        {isGenerating && audioStatus && (
          <ProgressIndicator
            status={audioStatus.status}
            progress={audioStatus.progress}
            message={audioStatus.message}
          />
        )}

        {/* Audio Player */}
        {audioCompleted && audioDetails && audioId && (
          <>
            <AudioPlayer
              audioId={audioId}
              duration={audioDetails.duration}
              fileSize={audioDetails.fileSize}
              format={audioDetails.format}
            />

            <TouchableOpacity
              style={styles.newDocumentButton}
              onPress={handleNewDocument}
            >
              <Text style={styles.newDocumentButtonText}>
                Process New Document
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5'
  },
  content: {
    padding: 20,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%'
  },
  header: {
    marginBottom: 30,
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666'
  },
  settingsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16
  },
  settingRow: {
    marginBottom: 16
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  optionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2196F3',
    backgroundColor: '#fff'
  },
  optionButtonActive: {
    backgroundColor: '#2196F3'
  },
  optionButtonText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500'
  },
  optionButtonTextActive: {
    color: '#fff'
  },
  generateButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  newDocumentButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  newDocumentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
