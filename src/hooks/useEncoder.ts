import { useState, useCallback, useMemo, useEffect } from 'react';
import { Encoder } from '../algorithms/Encoder';

interface UseEncoderResult {
  encoderTree: any;
  encoderProcessedChars: string;
  canEncode: boolean;
  encodeNext: () => void;
  reset: () => void;
  encodedBits: string;
}

export function useEncoder(message: string): UseEncoderResult {
  const [encoder] = useState(() => new Encoder());
  const [encoderIndex, setEncoderIndex] = useState(0);

  // Reset everything when message changes
  const reset = useCallback(() => {
    encoder.reset();
    setEncoderIndex(0);
  }, [encoder]);

  // Reset when message changes
  useEffect(() => {
    reset();
  }, [message, reset]);

  // Encode next character
  const encodeNext = useCallback(() => {
    if (encoderIndex >= message.length) return;

    const char = message[encoderIndex];
    encoder.encode(char);
    setEncoderIndex((prev) => prev + 1);
  }, [encoder, encoderIndex, message]);

  // Memoize encoder state to avoid re-serialization on every render
  const encoderState = useMemo(() => encoder.getState(), [encoder, encoderIndex]);
  const encoderProcessedChars = useMemo(
    () => encoderState.processedSymbols.join(''),
    [encoderState]
  );

  return {
    encoderTree: encoderState.treeSnapshot,
    encoderProcessedChars,
    canEncode: encoderIndex < message.length,
    encodeNext,
    reset,
    encodedBits: encoder.getAllBits(),
  };
}
