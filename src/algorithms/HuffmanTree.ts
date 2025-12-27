import { HuffmanNode } from './HuffmanNode';
import { NYTNode } from './NYTNode';
import { TreeSnapshot } from './types';

const MAX_ORDER = 512; // 256 * 2, matching the C implementation

export class HuffmanTree {
	root: HuffmanNode;
	private nytNode: HuffmanNode;
	private symbolMap: Map<string, HuffmanNode>;

	constructor() {
		this.nytNode = new NYTNode(MAX_ORDER);
		this.root = this.nytNode;
		this.symbolMap = new Map();
	}

	updateTree(symbol: string): void {
		let node = this.findSymbol(symbol);

		if (!node) {
			// Split NYT and get the internal node
			const internalNode = this.splitNYT(symbol);
			// Update from the internal node (previousZeroNode in C)
			this.performUpdate(internalNode);
		} else {
			// Symbol exists, update from the leaf node
			this.performUpdate(node);
		}
	}

	/**
	 * Performs the FGK update algorithm starting from the given node.
	 * Based on updateTree from the C implementation.
	 */
	private performUpdate(startNode: HuffmanNode): void {
		let currNode: HuffmanNode | null = startNode;

		// Loop until we reach the root
		while (currNode && !this.isRoot(currNode)) {
			// Find node with same weight but maximum order
			const replaceNode = this.findReplaceNode(currNode, this.root);

			// Swap if found and not the parent (can't swap with parent)
			if (replaceNode && currNode.parent !== replaceNode) {
				this.swapNodes(currNode, replaceNode);
			}

			// Increment weight
			currNode.weight++;

			// Move to parent
			currNode = currNode.parent;
		}

		// Increment root's weight
		if (currNode) {
			currNode.weight++;
		}
	}

	private isRoot(node: HuffmanNode): boolean {
		return node === this.root;
	}

	private findSymbol(symbol: string): HuffmanNode | null {
		return this.symbolMap.get(symbol) ?? null;
	}

	private splitNYT(newSymbol: string): HuffmanNode {
		const oldNYT = this.nytNode;
		const oldNYTParent = oldNYT.parent;
		const oldNYTOrder = oldNYT.id;

		// Create internal node (reuses old NYT's order)
		const newInternal = new HuffmanNode(oldNYTOrder, 0, null);

		// Left child = new NYT with order-2
		const newNYT = new NYTNode(oldNYTOrder - 2);
		newInternal.left = newNYT;
		newNYT.parent = newInternal;

		// Right child = new symbol leaf with order-1, weight 1
		const leafNode = new HuffmanNode(oldNYTOrder - 1, 1, newSymbol);
		newInternal.right = leafNode;
		leafNode.parent = newInternal;

		if (oldNYTParent === null) {
			this.root = newInternal;
		} else {
			if (oldNYTParent.left === oldNYT) {
				oldNYTParent.left = newInternal;
			} else {
				oldNYTParent.right = newInternal;
			}
			newInternal.parent = oldNYTParent;
		}

		this.nytNode = newNYT;
		this.symbolMap.set(newSymbol, leafNode);

		// Return the internal node (previousZeroNode in C code)
		return newInternal;
	}

	/**
	 * Finds a node with the same weight as currNode but with maximum order.
	 * Returns null if no such node exists.
	 * Based on findReplaceNode from the C implementation.
	 */
	private findReplaceNode(currNode: HuffmanNode, searchRoot: HuffmanNode): HuffmanNode | null {
		let result: HuffmanNode = currNode;

		const search = (node: HuffmanNode | null): void => {
			if (node === null) return;

			// If node has higher weight and is not a leaf, search its children
			if (node.weight > result.weight && !node.isLeaf()) {
				search(node.left);
				search(node.right);
			}
			// If node has same weight and higher order, it's a candidate
			else if (node.weight === result.weight && node.id > result.id) {
				result = node;
			}
		};

		search(searchRoot);

		return result !== currNode ? result : null;
	}

	private swapNodes(node1: HuffmanNode, node2: HuffmanNode): void {
		if (node1 === node2) return;
		if (!node1.parent || !node2.parent) return;

		const parent1 = node1.parent;
		const parent2 = node2.parent;
		const isNode1Left = parent1.left === node1;
		const isNode2Left = parent2.left === node2;

		// Swap order numbers (critical for FGK algorithm)
		const tempOrder = node1.id;
		node1.id = node2.id;
		node2.id = tempOrder;

		// Swap references in parents
		if (isNode1Left) {
			parent1.left = node2;
		} else {
			parent1.right = node2;
		}

		if (isNode2Left) {
			parent2.left = node1;
		} else {
			parent2.right = node1;
		}

		// Swap parent references
		node1.parent = parent2;
		node2.parent = parent1;
	}

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
}
