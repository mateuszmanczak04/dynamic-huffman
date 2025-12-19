import { useCallback, useState } from 'react';
import { Encoder } from '../algorithms/Encoder';

interface UseEncoderResult {
	encoderTree: any;
	encoderProcessedChars: string;
	canEncode: boolean;
	encodeNext: () => void;
}

export function useEncoder(message: string): UseEncoderResult {
	const [encoder] = useState(() => new Encoder());
	const [encoderIndex, setEncoderIndex] = useState(0);

	const encodeNext = useCallback(() => {
		if (encoderIndex >= message.length) return;

		const char = message[encoderIndex];
		encoder.encode(char);
		setEncoderIndex((prev) => prev + 1);
	}, [encoder, encoderIndex, message]);

	const encoderState = encoder.getState();
	const encoderProcessedChars = encoderState.processedSymbols.join('');

	return {
		encoderTree: encoderState.treeSnapshot,
		encoderProcessedChars,
		canEncode: encoderIndex < message.length,
		encodeNext,
	};
}
