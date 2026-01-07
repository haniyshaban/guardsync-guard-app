import React, { useRef, useEffect, useState } from 'react';
import { Camera, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FacialScannerProps {
  onScanComplete: (success: boolean) => void;
  onCancel: () => void;
}

type ScanStatus = 'idle' | 'initializing' | 'scanning' | 'processing' | 'success' | 'error';

export function FacialScanner({ onScanComplete, onCancel }: FacialScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setStatus('initializing');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStatus('scanning');
    } catch (error) {
      console.error('Camera access denied:', error);
      setStatus('error');
    }
  };

  const performScan = async () => {
    setStatus('processing');
    setProgress(0);

    // Simulate facial recognition processing
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    await new Promise(resolve => setTimeout(resolve, 2500));
    clearInterval(interval);
    setProgress(100);
    setStatus('success');

    // Stop camera
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    setTimeout(() => {
      onScanComplete(true);
    }, 1000);
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'initializing': return 'Initializing camera...';
      case 'scanning': return 'Position your face in the frame';
      case 'processing': return 'Verifying identity...';
      case 'success': return 'Identity verified!';
      case 'error': return 'Camera access denied';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 text-primary mb-2">
          <Shield className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wide uppercase">Facial Recognition</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          {getStatusMessage()}
        </h2>
      </div>

      {/* Scanner Frame */}
      <div className="relative w-72 h-72 mb-8">
        {/* Outer frame */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/30" />
        
        {/* Animated ring */}
        {status === 'scanning' && <div className="pulse-ring" />}
        
        {/* Corner brackets */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <path d="M 20,5 L 5,5 L 5,20" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
          <path d="M 80,5 L 95,5 L 95,20" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
          <path d="M 20,95 L 5,95 L 5,80" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
          <path d="M 80,95 L 95,95 L 95,80" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* Video feed */}
        <div className="absolute inset-4 rounded-full overflow-hidden bg-secondary">
          {status === 'error' ? (
            <div className="w-full h-full flex items-center justify-center">
              <AlertCircle className="w-16 h-16 text-destructive" />
            </div>
          ) : status === 'success' ? (
            <div className="w-full h-full flex items-center justify-center bg-accent/20">
              <CheckCircle className="w-16 h-16 text-accent" />
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          )}
        </div>

        {/* Scan line */}
        {status === 'processing' && (
          <div className="absolute inset-4 rounded-full overflow-hidden">
            <div className="scan-line" />
          </div>
        )}
      </div>

      {/* Progress indicator */}
      {status === 'processing' && (
        <div className="w-64 mb-8">
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full gradient-primary transition-all duration-200 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">{progress}%</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        {status === 'error' && (
          <Button variant="outline" onClick={startCamera}>
            <Camera className="w-4 h-4 mr-2" />
            Retry
          </Button>
        )}
        {status === 'scanning' && (
          <Button variant="gradient" size="lg" onClick={performScan}>
            <Camera className="w-5 h-5 mr-2" />
            Scan Face
          </Button>
        )}
        {(status === 'scanning' || status === 'error' || status === 'initializing') && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        {status === 'processing' && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </div>
        )}
      </div>
    </div>
  );
}
