import { SerializedNode } from './types';

/**
 * Node in the dynamic Huffman tree
 * Used in the FGK (Faller-Gallager-Knuth) adaptive Huffman algorithm
 */
export class HuffmanNode {
  id: number;
  weight: number;
  symbol: string | null;
  isNYT: boolean; // Not Yet Transmitted marker
  left: HuffmanNode | null;
  right: HuffmanNode | null;
  parent: HuffmanNode | null;

  constructor(
    id: number,
    weight: number = 0,
    symbol: string | null = null,
    isNYT: boolean = false
  ) {
    this.id = id;
    this.weight = weight;
    this.symbol = symbol;
    this.isNYT = isNYT;
    this.left = null;
    this.right = null;
    this.parent = null;
  }

  /**
   * Check if this is a leaf node (has a symbol or is NYT)
   */
  isLeaf(): boolean {
    return this.left === null && this.right === null;
  }

  /**
   * Get the path from root to this node as a binary string
   * 0 = left, 1 = right
   */
  getPathFromRoot(): string {
    const path: string[] = [];
    let current: HuffmanNode | null = this;

    while (current.parent !== null) {
      if (current.parent.left === current) {
        path.unshift('0');
      } else {
        path.unshift('1');
      }
      current = current.parent;
    }

    return path.join('');
  }

  /**
   * Serialize this node for storage/visualization
   */
  serialize(): SerializedNode {
    return {
      id: this.id,
      weight: this.weight,
      symbol: this.symbol,
      isNYT: this.isNYT,
      leftId: this.left?.id ?? null,
      rightId: this.right?.id ?? null,
      parentId: this.parent?.id ?? null,
    };
  }

  /**
   * Create a deep copy of this node and its subtree
   */
  clone(): HuffmanNode {
    const newNode = new HuffmanNode(this.id, this.weight, this.symbol, this.isNYT);

    if (this.left) {
      newNode.left = this.left.clone();
      newNode.left.parent = newNode;
    }

    if (this.right) {
      newNode.right = this.right.clone();
      newNode.right.parent = newNode;
    }

    return newNode;
  }
}
