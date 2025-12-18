import React, { memo } from 'react';
import { TreeVisualization } from '../Visualization/TreeVisualization';
import { TreeSnapshot } from '../../algorithms/types';

interface EncoderPanelProps {
  treeSnapshot: TreeSnapshot;
  processedChars: string;
  nextChar: string | null;
  canEncode: boolean;
  onEncode: () => void;
  highlightedNodes?: number[];
}

export const EncoderPanel = memo(function EncoderPanel({
  treeSnapshot,
  processedChars,
  nextChar,
  canEncode,
  onEncode,
  highlightedNodes = [],
}: EncoderPanelProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      <h2 className="m-0 text-2xl text-blue-500">Encoder</h2>

      <div className="flex gap-2">
        <button
          onClick={onEncode}
          disabled={!canEncode}
          className="rounded-md border-2 border-blue-500 bg-blue-500 px-6 py-3 font-semibold text-white shadow-[0_2px_6px_rgba(74,158,255,0.3)] transition-all hover:enabled:-translate-y-0.5 hover:enabled:border-blue-600 hover:enabled:bg-blue-600 hover:enabled:shadow-[0_4px_8px_rgba(74,158,255,0.4)] disabled:cursor-not-allowed disabled:border-gray-700 disabled:bg-gray-800 disabled:text-gray-600 disabled:opacity-50 disabled:shadow-none"
        >
          Encode Next Character
        </button>
      </div>

      <div className="flex flex-col gap-2 rounded-md border-2 border-blue-500/40 bg-blue-500/10 p-3 shadow-[0_2px_6px_rgba(74,158,255,0.15)]">
        <div className="flex flex-wrap items-center gap-2">
          <strong>Processed:</strong>
          <span className="rounded bg-white/10 px-2 py-1 font-mono">
            {processedChars || '(none yet)'}
          </span>
        </div>
        {nextChar && (
          <div className="flex flex-wrap items-center gap-2 border-t border-blue-500/20 pt-2">
            <strong>Next character to encode:</strong>
            <span className="rounded-md bg-blue-500 px-4 py-2 font-mono text-2xl font-bold text-white shadow-[0_2px_6px_rgba(74,158,255,0.4)]">
              {nextChar}
            </span>
          </div>
        )}
      </div>

      <div className="flex min-h-[300px] flex-1 flex-col overflow-auto">
        <h3 className="mt-0 mb-2 text-lg">Huffman Tree</h3>
        <TreeVisualization treeSnapshot={treeSnapshot} highlightedNodes={highlightedNodes} />
      </div>
    </div>
  );
});
