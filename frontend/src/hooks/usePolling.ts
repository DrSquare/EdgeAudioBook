/**
 * Custom hook for polling job status
 */
import { useState, useEffect, useCallback } from 'react';
import { getJobStatus, getAudioStatus } from '../services/api';
import { JobStatus, AudioStatus } from '../types';
import { STATUS_POLL_INTERVAL, AUDIO_STATUS_POLL_INTERVAL } from '../utils/constants';

type StatusType = JobStatus | AudioStatus;

export const usePolling = (
  id: string | null,
  type: 'job' | 'audio',
  onComplete?: (data: StatusType) => void,
  onError?: (error: string) => void
) => {
  const [status, setStatus] = useState<StatusType | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollInterval = type === 'job' ? STATUS_POLL_INTERVAL : AUDIO_STATUS_POLL_INTERVAL;

  const fetchStatus = useCallback(async () => {
    if (!id) return;

    try {
      let data: StatusType;
      
      if (type === 'job') {
        data = await getJobStatus(id);
      } else {
        data = await getAudioStatus(id);
      }

      setStatus(data);
      setError(null);

      // Check if job is complete or failed
      if (data.status === 'completed') {
        setIsPolling(false);
        onComplete?.(data);
      } else if (data.status === 'failed') {
        setIsPolling(false);
        const errorMsg = 'error' in data ? data.error : 'Processing failed';
        setError(errorMsg || null);
        onError?.(errorMsg || 'Processing failed');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch status';
      setError(errorMsg);
      setIsPolling(false);
      onError?.(errorMsg);
    }
  }, [id, type, onComplete, onError]);

  useEffect(() => {
    if (!id || !isPolling) return;

    // Initial fetch
    fetchStatus();

    // Set up polling interval
    const intervalId = setInterval(fetchStatus, pollInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [id, isPolling, fetchStatus, pollInterval]);

  const startPolling = useCallback(() => {
    if (id) {
      setIsPolling(true);
      setError(null);
    }
  }, [id]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  return {
    status,
    isPolling,
    error,
    startPolling,
    stopPolling
  };
};
