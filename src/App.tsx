import { useState } from 'react';
import { TreeVisualization } from './components/TreeVisualization';
import { useEncoder } from './hooks/useEncoder';

function App() {
	const [message, setMessage] = useState('HELLO');

	const { encoderTree, encoderProcessedChars, canEncode, encodeNext } = useEncoder(message);

	const nextChar = canEncode ? message[encoderProcessedChars.length] : null;

	return (
		<div className='grid min-h-screen w-full grid-rows-[auto_auto_1fr] gap-3 p-3'>
			<div className='max-w-sm border p-3'>
				<label htmlFor='message-input' className='mb-1 block'>
					Message to encode:
				</label>
				<input
					id='message-input'
					type='text'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder='Enter a message...'
					className='mb-2 w-full border px-3 py-1'
				/>
				<div className='mb-2 text-gray-400'>Length: {message.length} characters</div>
			</div>

			<div className='max-w-3xl'>
				<h2 className='mb-2 text-2xl text-green-600'>Encoder</h2>

				<button
					onClick={encodeNext}
					disabled={!canEncode}
					className='mb-4 bg-green-600 px-3 py-1 text-white'
				>
					Encode Next Character
				</button>

				<div className='border p-3'>
					<p>
						Processed:{' '}
						<span className='font-mono text-neutral-500'>
							{encoderProcessedChars || '(none yet)'}
						</span>
					</p>
					{nextChar && (
						<p>
							Next character to encode:{' '}
							<span className='font-mono text-neutral-500'>{nextChar}</span>
						</p>
					)}
				</div>

				<TreeVisualization treeSnapshot={encoderTree} />
			</div>
		</div>
	);
}

export default App;
