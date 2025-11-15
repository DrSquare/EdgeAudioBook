/**
 * FileUploader Component
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { uploadFile } from '../services/api';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../utils/constants';

interface FileUploaderProps {
  onUploadSuccess: (jobId: string) => void;
  onUploadError: (error: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadSuccess,
  onUploadError
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });

      if (result && result[0]) {
        const file = result[0];
        
        // Validate file type
        if (ALLOWED_FILE_TYPES.includes(file.type || '')) {
          // Validate file size
          if (file.size && file.size > MAX_FILE_SIZE) {
            Alert.alert('Error', 'File size exceeds 50MB limit');
            return;
          }
          
          setSelectedFile(file.name);
          await handleUpload(file);
        } else {
          Alert.alert('Error', 'Unsupported file type. Please select an image or PDF file.');
        }
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        onUploadError('Failed to pick file');
      }
    }
  };

  const handleUpload = async (file: any) => {
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name
      } as any);

      const response = await uploadFile(formData);
      onUploadSuccess(response.job_id);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';
      onUploadError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Document</Text>
      <Text style={styles.subtitle}>
        Select an image or PDF file to extract text
      </Text>

      <TouchableOpacity
        style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
        onPress={handleFilePick}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadButtonText}>Choose File</Text>
        )}
      </TouchableOpacity>

      {selectedFile && (
        <Text style={styles.selectedFile}>Selected: {selectedFile}</Text>
      )}

      <Text style={styles.supportedFormats}>
        Supported formats: JPG, PNG, BMP, TIFF, PDF
      </Text>
      <Text style={styles.maxSize}>Maximum file size: 50MB</Text>
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
    color: '#333',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20
  },
  uploadButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50
  },
  uploadButtonDisabled: {
    backgroundColor: '#BDBDBD'
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  selectedFile: {
    marginTop: 12,
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic'
  },
  supportedFormats: {
    marginTop: 16,
    fontSize: 12,
    color: '#888'
  },
  maxSize: {
    marginTop: 4,
    fontSize: 12,
    color: '#888'
  }
});
