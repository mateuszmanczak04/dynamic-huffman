# Dynamic Huffman Encoding Visualization

An interactive web application that demonstrates the **FGK (Faller-Gallager-Knuth) adaptive Huffman encoding algorithm** with step-by-step visualization.

## Features

- **Independent sender/receiver controls** - encode and decode at your own pace
- **Message queue visualization** - see transmitted bits between sender and receiver
- **Split view** showing encoder (sender) and decoder (receiver) side-by-side
- **Interactive tree visualization** with D3.js showing the dynamic Huffman tree
- **Real-time synchronization** - both trees stay synchronized as messages are processed
- **Customizable input** - encode any message you want
- **Pending message indicator** - see how many messages are waiting to be decoded
- **Full message history** - track all transmitted messages in the queue

## How It Works

The FGK algorithm is an adaptive (dynamic) Huffman encoding algorithm that builds the Huffman tree on-the-fly as characters are processed. Key features:

1. **Initial State**: Start with a single NYT (Not Yet Transmitted) node
2. **First Occurrence**: When a new character appears:
   - Send the path to NYT node + 8-bit ASCII code
   - Split NYT node into new NYT and a leaf for the character
3. **Subsequent Occurrences**: When a character reappears:
   - Send its code path in the tree
   - Update tree weights
4. **Sibling Property**: Nodes are maintained in non-increasing order by weight

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Usage

1. Enter a message in the input field (default: "HELLO")
2. Click **"Encode Next Character"** on the sender side to encode one character at a time
   - Each encoded character is added to the message queue
   - The sender's tree updates to reflect the new character
3. Click **"Decode Next Message"** on the receiver side to decode one message from the queue
   - Messages are decoded in FIFO order
   - The receiver's tree updates to stay synchronized with the sender
4. Watch the **Message Queue** in the middle to see:
   - All transmitted messages with their character and bit representation
   - Total message count and bit count
5. Use **"Reset All"** to clear everything and start over

### Key Observations

- The sender can encode multiple characters before the receiver decodes any
- The message queue shows the "transmission buffer" between sender and receiver
- Both trees stay perfectly synchronized despite independent operations
- The pending message count shows how many messages are waiting to be decoded

## Project Structure

```
src/
├── algorithms/          # Core Huffman algorithm implementation
│   ├── HuffmanNode.ts   # Tree node class
│   ├── HuffmanTree.ts   # FGK algorithm implementation
│   ├── Encoder.ts       # Encoding logic
│   ├── Decoder.ts       # Decoding logic
│   └── types.ts         # TypeScript interfaces
├── hooks/               # React hooks
│   └── useEncoderDecoder.ts  # State management for steps
├── components/          # React components
│   ├── Layout/          # Layout components
│   ├── Controls/        # Input and step controls
│   ├── Encoder/         # Encoder panel
│   ├── Decoder/         # Decoder panel
│   └── Visualization/   # Tree visualization
└── App.tsx              # Main application
```

## Technical Details

### Algorithm Implementation

The FGK algorithm maintains these invariants:

- **Sibling Property**: Nodes are numbered in non-increasing order by weight
- **Tree Update**: After each character, weights are incremented and nodes may be swapped to maintain the sibling property
- **Synchronization**: Both encoder and decoder maintain identical trees

### Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **D3.js** - Tree layout calculations
- **CSS3** - Styling and animations

## License

MIT

## Author

Built with Claude Code
