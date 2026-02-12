'use client';

import { useEffect } from 'react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { Mic, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  disabled?: boolean;
}

export function AudioRecorder({ onRecordingComplete, disabled }: AudioRecorderProps) {
  const {
    recordingState,
    audioBlob,
    recordingTime,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  // When recording completes, send the blob
  useEffect(() => {
    if (audioBlob && recordingState === 'idle') {
      onRecordingComplete(audioBlob);
      resetRecording();
    }
  }, [audioBlob, recordingState, onRecordingComplete, resetRecording]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClick = () => {
    if (recordingState === 'idle') {
      startRecording();
    } else if (recordingState === 'recording') {
      stopRecording();
    }
  };

  const isRecording = recordingState === 'recording';
  const isProcessing = recordingState === 'processing';

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-8 space-y-4 md:space-y-6">
      {/* Recording Button */}
      <button
        onClick={handleClick}
        disabled={disabled || isProcessing}
        className={cn(
          'w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-all duration-300 touch-manipulation',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl shadow-blue-500/30 hover:scale-110 active:scale-95':
              !isRecording && !isProcessing,
            'bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-500/30 animate-pulse':
              isRecording,
            'bg-gradient-to-br from-gray-500 to-gray-600': isProcessing,
          }
        )}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <Square className="w-16 h-16 md:w-20 md:h-20 text-white" fill="white" />
        ) : (
          <Mic className="w-16 h-16 md:w-20 md:h-20 text-white" />
        )}
      </button>

      {/* Timer Display */}
      {isRecording && (
        <div className="text-center">
          <p className="text-3xl md:text-5xl font-mono font-bold text-white mb-1 md:mb-2">
            {formatTime(recordingTime)}
          </p>
          <p className="text-xs md:text-sm text-gray-400">Recording... Click to stop</p>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <div className="text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-8 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-3 md:mb-4" />
          <p className="text-xs md:text-sm text-gray-400">Processing recording...</p>
        </div>
      )}

      {/* Idle State */}
      {recordingState === 'idle' && !audioBlob && (
        <p className="text-xs md:text-sm text-gray-400 text-center max-w-xs px-4">
          Click the microphone to start recording your message
        </p>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-3 md:p-4 max-w-md mx-4">
          <p className="text-red-400 text-xs md:text-sm text-center">{error}</p>
        </div>
      )}

      {/* Max Time Warning */}
      {isRecording && recordingTime > 4 * 60 * 1000 && (
        <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-xl p-2 md:p-3 mx-4">
          <p className="text-yellow-400 text-[10px] md:text-xs text-center">
            Maximum recording time: 5 minutes
          </p>
        </div>
      )}
    </div>
  );
}
