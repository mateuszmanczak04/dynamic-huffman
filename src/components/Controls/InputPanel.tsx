import React from 'react';

interface InputPanelProps {
  message: string;
  onChange: (message: string) => void;
}

export function InputPanel({ message, onChange }: InputPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="message-input" className="text-base font-semibold text-white">
        <strong>Message to encode:</strong>
      </label>
      <input
        id="message-input"
        type="text"
        value={message}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter a message..."
        className="w-full rounded-md border-2 border-gray-600 bg-white/10 px-4 py-3 font-mono text-lg transition-all focus:border-blue-500 focus:bg-white/15 focus:shadow-[0_0_0_3px_rgba(74,158,255,0.2)] focus:outline-none"
      />
      <div className="text-sm font-medium text-gray-400">Length: {message.length} characters</div>
    </div>
  );
}
