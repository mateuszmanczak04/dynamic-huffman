import { HuffmanNode } from './HuffmanNode';
import { TreeSnapshot } from './types';

/**
 * Dynamic Huffman Tree using the FGK (Faller-Gallager-Knuth) algorithm
 * Maintains the sibling property: nodes are numbered in non-increasing order by weight
 */
export class HuffmanTree {
  root: HuffmanNode;
  private nytNode: HuffmanNode;
  private nodeCounter: number;
  private symbolMap: Map<string, HuffmanNode>;
  private weightGroups: Map<number, HuffmanNode[]>;

  constructor() {
    // Initialize with a single NYT node
    this.nodeCounter = 0;
    this.nytNode = new HuffmanNode(this.nodeCounter++, 0, null, true);
    this.root = this.nytNode;
    this.symbolMap = new Map();
    this.weightGroups = new Map();
    this.addNodeToWeightGroup(this.nytNode);
  }

  /**
   * Add a node to its weight group for fast lookup
   */
  private addNodeToWeightGroup(node: HuffmanNode): void {
    const weight = node.weight;
    if (!this.weightGroups.has(weight)) {
      this.weightGroups.set(weight, []);
    }
    const group = this.weightGroups.get(weight)!;
    // Prevent duplicates
    if (!group.includes(node)) {
      group.push(node);
    }
  }

  /**
   * Remove a node from its weight group
   */
  private removeNodeFromWeightGroup(node: HuffmanNode, weight: number): void {
    const group = this.weightGroups.get(weight);
    if (group) {
      const index = group.indexOf(node);
      if (index !== -1) {
        group.splice(index, 1);
      }
      if (group.length === 0) {
        this.weightGroups.delete(weight);
      }
    }
  }

  /**
   * Update a node's weight group when its weight changes
   */
  private updateNodeWeightGroup(node: HuffmanNode, oldWeight: number): void {
    this.removeNodeFromWeightGroup(node, oldWeight);
    this.addNodeToWeightGroup(node);
  }

  /**
   * Find the node representing a symbol in the tree
   */
  findSymbol(symbol: string): HuffmanNode | null {
    return this.symbolMap.get(symbol) ?? null;
  }

  /**
   * Get the binary code for a symbol
   * Returns empty string if symbol not found
   */
  getCode(symbol: string): string {
    const node = this.findSymbol(symbol);
    if (!node) return '';
    return node.getPathFromRoot();
  }

  /**
   * Get the path to the NYT node
   */
  getNYTPath(): string {
    return this.nytNode.getPathFromRoot();
  }

  /**
   * Update the tree after processing a symbol
   * This is the core of the FGK algorithm
   */
  updateTree(symbol: string): void {
    const existingNode = this.findSymbol(symbol);

    if (existingNode) {
      // Symbol already exists in tree
      this.incrementNode(existingNode);
    } else {
      // First occurrence of symbol - split NYT node
      this.splitNYT(symbol);
    }
  }

  /**
   * Split the NYT node when a new symbol appears
   */
  private splitNYT(symbol: string): void {
    const oldNYT = this.nytNode;

    // Remove old NYT from weight group
    this.removeNodeFromWeightGroup(oldNYT, oldNYT.weight);

    // Create new internal node to replace old NYT
    const newInternal = new HuffmanNode(this.nodeCounter++, 0, null, false);

    // Create new NYT node (left child)
    const newNYT = new HuffmanNode(this.nodeCounter++, 0, null, true);

    // Create leaf node for the symbol (right child)
    const leafNode = new HuffmanNode(this.nodeCounter++, 1, symbol, false);

    // Set up tree structure
    newInternal.left = newNYT;
    newInternal.right = leafNode;
    newNYT.parent = newInternal;
    leafNode.parent = newInternal;

    // Replace old NYT with new internal node
    if (oldNYT.parent === null) {
      // NYT was root
      this.root = newInternal;
    } else {
      if (oldNYT.parent.left === oldNYT) {
        oldNYT.parent.left = newInternal;
      } else {
        oldNYT.parent.right = newInternal;
      }
      newInternal.parent = oldNYT.parent;
    }

    // Update NYT reference
    this.nytNode = newNYT;

    // Add symbol to map
    this.symbolMap.set(symbol, leafNode);

    // Add new nodes to weight groups
    this.addNodeToWeightGroup(newInternal);
    this.addNodeToWeightGroup(newNYT);
    this.addNodeToWeightGroup(leafNode);

    // Increment weights up to root
    this.incrementNode(newInternal);
  }

  /**
   * Increment a node's weight and maintain sibling property
   */
  private incrementNode(node: HuffmanNode | null): void {
    let iterations = 0;
    while (node !== null) {
      iterations++;

      if (iterations > 100) {
        console.error('INFINITE LOOP DETECTED in incrementNode after 100 iterations!');
        console.error('Current node:', node.id, 'parent:', node.parent?.id);
        break;
      }

      // Find the highest-numbered node in the same weight block
      const leader = this.findBlockLeader(node);

      // Swap if necessary (leader is not this node and not its parent)
      if (leader !== node && leader !== node.parent) {
        this.swapNodes(node, leader);
      } else if (leader !== node && leader === node.parent) {
        console.error('WARNING: Block leader is the parent! This should not happen.');
        console.error('node:', node.id, 'leader:', leader.id, 'parent:', node.parent?.id);
      }

      // Increment weight and update weight group
      const oldWeight = node.weight;
      node.weight++;
      this.updateNodeWeightGroup(node, oldWeight);

      // Move to parent
      node = node.parent;
    }
  }

  /**
   * Find the node with highest ID (most recently created)
   * with the same weight as the given node
   * This maintains the sibling property in the FGK algorithm
   */
  private findBlockLeader(node: HuffmanNode): HuffmanNode {
    const targetWeight = node.weight;
    const group = this.weightGroups.get(targetWeight);

    if (!group || group.length === 0) {
      console.warn('No weight group found for weight', targetWeight, 'returning node itself');
      return node;
    }

    // Find the node with the highest ID in the weight group
    let leader = node;
    for (const candidate of group) {
      if (candidate.id > leader.id) {
        leader = candidate;
      }
    }

    return leader;
  }

  /**
   * Swap two nodes in the tree
   */
  private swapNodes(node1: HuffmanNode, node2: HuffmanNode): void {
    // Don't swap a node with itself
    if (node1 === node2) return;

    const parent1 = node1.parent;
    const parent2 = node2.parent;

    // Check if one node is the parent of the other (parent-child swap)
    if (parent1 === node2 || parent2 === node1) {
      console.error('swapNodes: PARENT-CHILD SWAP DETECTED - THIS SHOULD NOT HAPPEN!');
      console.error('node1:', {
        id: node1.id,
        weight: node1.weight,
        symbol: node1.symbol,
        parent: parent1?.id,
      });
      console.error('node2:', {
        id: node2.id,
        weight: node2.weight,
        symbol: node2.symbol,
        parent: parent2?.id,
      });
      console.error('This indicates a bug in incrementNode or findBlockLeader');
      // Don't swap - this would create corruption
      return;
    }

    // Normal case: nodes are not parent-child
    // Determine which child each node is
    const node1IsLeft = parent1?.left === node1;
    const node2IsLeft = parent2?.left === node2;

    // Swap parent pointers
    if (parent1 === parent2) {
      // Special case: same parent (siblings)
      if (parent1) {
        parent1.left = node2;
        parent1.right = node1;
      }
    } else {
      // Different parents
      if (parent1) {
        if (node1IsLeft) {
          parent1.left = node2;
        } else {
          parent1.right = node2;
        }
      } else {
        // node1 was root
        this.root = node2;
      }

      if (parent2) {
        if (node2IsLeft) {
          parent2.left = node1;
        } else {
          parent2.right = node1;
        }
      } else {
        // node2 was root
        this.root = node1;
      }
    }

    // Swap parent references
    node1.parent = parent2;
    node2.parent = parent1;
  }

  /**
   * Validate that a node has consistent state
   */
  private validateNodeIntegrity(node: HuffmanNode): void {
    const isLeaf = node.left === null && node.right === null;

    if (isLeaf) {
      // Leaf nodes must either be NYT or have a symbol
      if (!node.isNYT && node.symbol === null) {
        console.error('CORRUPTION DETECTED: Leaf node with no symbol and not NYT!', node);
        throw new Error(`Node ${node.id} is a leaf but has symbol=null and isNYT=false`);
      }
    } else {
      // Internal nodes must not have symbols and must not be NYT
      if (node.symbol !== null || node.isNYT) {
        console.error('CORRUPTION DETECTED: Internal node with symbol or marked as NYT!', node);
        throw new Error(
          `Node ${node.id} is internal but has symbol=${node.symbol} or isNYT=${node.isNYT}`
        );
      }
    }
  }

  /**
   * Serialize the tree for visualization
   */
  serialize(): TreeSnapshot {
    const nodes: HuffmanNode[] = [];

    const traverse = (node: HuffmanNode | null) => {
      if (node === null) return;
      nodes.push(node);
      traverse(node.left);
      traverse(node.right);
    };

    traverse(this.root);

    return {
      nodes: nodes.map((n) => n.serialize()),
      rootId: this.root.id,
    };
  }

  /**
   * Get all nodes in the tree (for debugging/visualization)
   */
  getAllNodes(): HuffmanNode[] {
    const nodes: HuffmanNode[] = [];

    const traverse = (node: HuffmanNode | null) => {
      if (node === null) return;
      nodes.push(node);
      traverse(node.left);
      traverse(node.right);
    };

    traverse(this.root);
    return nodes;
  }

  /**
   * Create a deep copy of this tree
   */
  clone(): HuffmanTree {
    const newTree = new HuffmanTree();
    newTree.root = this.root.clone();
    newTree.nodeCounter = this.nodeCounter;

    // Rebuild symbol map, NYT reference, and weight groups
    newTree.symbolMap = new Map();
    newTree.weightGroups = new Map();
    const traverse = (node: HuffmanNode) => {
      if (node.isNYT) {
        newTree.nytNode = node;
      }
      if (node.symbol !== null) {
        newTree.symbolMap.set(node.symbol, node);
      }
      newTree.addNodeToWeightGroup(node);
      if (node.left) traverse(node.left);
      if (node.right) traverse(node.right);
    };
    traverse(newTree.root);

    return newTree;
  }
}
