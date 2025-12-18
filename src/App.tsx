import { useState } from 'react';
import { useEncoder } from './hooks/useEncoder';
import { InputPanel } from './components/Controls/InputPanel';
import { EncoderPanel } from './components/Encoder/EncoderPanel';

function App() {
  const [message, setMessage] = useState('HELLO');

  const { encoderTree, encoderProcessedChars, canEncode, encodeNext, reset, encodedBits } =
    useEncoder(message);

  // Calculate next character to encode
  const nextChar = canEncode ? message[encoderProcessedChars.length] : null;

  return (
    <div className="grid min-h-screen w-full grid-rows-[auto_auto_1fr] gap-3 p-3">
      <header className="rounded-lg bg-gradient-to-br from-blue-500 to-red-500 p-3 text-center shadow-lg">
        <h1 className="m-0 text-3xl font-bold text-white md:text-2xl">Dynamic Huffman Encoding</h1>
      </header>

      <div className="grid grid-cols-1 items-start gap-3 rounded-lg border border-gray-700 bg-white/5 p-3 md:grid-cols-[1fr_auto_1fr]">
        <InputPanel message={message} onChange={setMessage} />
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={reset}
            className="rounded-md border-2 border-gray-600 bg-gray-700 px-6 py-3 font-semibold whitespace-nowrap text-white transition-all hover:-translate-y-0.5 hover:border-gray-500 hover:bg-gray-600 hover:shadow-lg"
          >
            Reset
          </button>
        </div>
        {encodedBits && (
          <div className="mt-2 rounded bg-gray-800 p-2.5">
            <strong>Encoded bits:</strong> <code className="text-sm">{encodedBits}</code>
          </div>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-3xl">
        <EncoderPanel
          treeSnapshot={encoderTree}
          processedChars={encoderProcessedChars}
          nextChar={nextChar}
          canEncode={canEncode}
          onEncode={encodeNext}
        />
      </div>
    </div>
  );
}

export default App;
