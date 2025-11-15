/**
 * ProgressIndicator Component
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { STATUS_COLORS, STATUS_TEXT } from '../utils/constants';

interface ProgressIndicatorProps {
  status: 'pending' | 'processing' | 'generating' | 'completed' | 'failed';
  progress: number;
  message?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  status,
  progress,
  message
}) => {
  const statusColor = STATUS_COLORS[status];
  const statusText = STATUS_TEXT[status];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {(status === 'processing' || status === 'generating') && (
          <ActivityIndicator size="small" color={statusColor} style={styles.spinner} />
        )}
        <Text style={[styles.statusText, { color: statusColor }]}>
          {statusText}
        </Text>
      </View>

      {message && <Text style={styles.message}>{message}</Text>}

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progress}%`, backgroundColor: statusColor }
            ]}
          />
        </View>
        <Text style={styles.progressText}>{progress}%</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  spinner: {
    marginRight: 8
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600'
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease'
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minWidth: 45,
    textAlign: 'right'
  }
});
