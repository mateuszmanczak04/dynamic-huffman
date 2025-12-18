import { HuffmanTree } from './HuffmanTree';
import { EncoderState } from './types';

/**
 * Encoder for dynamic Huffman encoding
 * Encodes characters one at a time and updates the tree
 */
export class Encoder {
  private tree: HuffmanTree;
  private processedSymbols: string[];
  private encodedBits: string[];

  constructor() {
    this.tree = new HuffmanTree();
    this.processedSymbols = [];
    this.encodedBits = [];
  }

  /**
   * Encode a single character
   * Returns the bits generated for this character
   */
  encode(symbol: string): string {
    const existingNode = this.tree.findSymbol(symbol);
    let bits = '';

    if (existingNode) {
      // Symbol exists - send its code
      bits = this.tree.getCode(symbol);
    } else {
      // First occurrence - send NYT path + ASCII code
      const nytPath = this.tree.getNYTPath();
      const asciiCode = symbol.charCodeAt(0).toString(2).padStart(8, '0');
      bits = nytPath + asciiCode;
    }

    // Update tree
    this.tree.updateTree(symbol);

    // Store results
    this.processedSymbols.push(symbol);
    this.encodedBits.push(bits);

    return bits;
  }

  /**
   * Encode an entire message
   */
  encodeMessage(message: string): string {
    this.reset();
    let allBits = '';

    for (const char of message) {
      const bits = this.encode(char);
      allBits += bits;
    }

    return allBits;
  }

  /**
   * Get the current state for visualization
   */
  getState(): EncoderState {
    return {
      processedSymbols: [...this.processedSymbols],
      encodedBits: [...this.encodedBits],
      currentSymbol:
        this.processedSymbols.length > 0
          ? this.processedSymbols[this.processedSymbols.length - 1]
          : null,
      treeSnapshot: this.tree.serialize(),
    };
  }

  /**
   * Get the tree instance
   */
  getTree(): HuffmanTree {
    return this.tree;
  }

  /**
   * Get all encoded bits as a single string
   */
  getAllBits(): string {
    return this.encodedBits.join('');
  }

  /**
   * Reset the encoder
   */
  reset(): void {
    this.tree = new HuffmanTree();
    this.processedSymbols = [];
    this.encodedBits = [];
  }

  /**
   * Clone the encoder
   */
  clone(): Encoder {
    const newEncoder = new Encoder();
    newEncoder.tree = this.tree.clone();
    newEncoder.processedSymbols = [...this.processedSymbols];
    newEncoder.encodedBits = [...this.encodedBits];
    return newEncoder;
  }
}
