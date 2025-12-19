import { HuffmanNode } from './HuffmanNode';
import { NYTNode } from './NYTNode';
import { TreeSnapshot } from './types';

export class HuffmanTree {
	root: HuffmanNode;
	private nytNode: HuffmanNode;
	private nodeCounter: number;
	private symbolMap: Map<string, HuffmanNode>;

	constructor() {
		this.nodeCounter = 0;
		this.nytNode = new NYTNode(this.nodeCounter++);
		this.root = this.nytNode;
		this.symbolMap = new Map();
	}

	findSymbol(symbol: string): HuffmanNode | null {
		return this.symbolMap.get(symbol) ?? null;
	}

	updateTree(symbol: string): void {
		const existingNode = this.findSymbol(symbol);

		if (existingNode) {
			this.cascaseIncrementWeights(existingNode);
		} else {
			this.splitNYT(symbol);
		}

		this.ensureSiblingProperty(this.root);
	}

	private splitNYT(symbol: string): void {
		const oldNYT = this.nytNode;
		const oldNYTParent = oldNYT.parent;

		const newInternal = new HuffmanNode(this.nodeCounter++, 1, null);

		const newNYT = new NYTNode(this.nodeCounter++);
		newInternal.left = newNYT;
		newNYT.parent = newInternal;

		const leafNode = new HuffmanNode(this.nodeCounter++, 1, symbol);
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

			this.cascaseIncrementWeights(oldNYTParent);
		}

		this.nytNode = newNYT;
		this.symbolMap.set(symbol, leafNode);
	}

	/**
	 * Increaments weights of all nodes from the `node` up to root
	 */
	private cascaseIncrementWeights(node: HuffmanNode): void {
		node.weight++;
		if (node.parent !== null) {
			this.cascaseIncrementWeights(node.parent);
		}
	}

	private swapNodesOfTheSameParent(node1: HuffmanNode, node2: HuffmanNode): void {
		if (node1 === node2) return;
		if (!node1.parent || !node2.parent) return;
		if (node1.parent !== node2.parent) return;

		const parent = node1.parent;

		const buffer = parent.left;
		parent.left = parent.right;
		parent.right = buffer;

		node1.parent = parent;
		node2.parent = parent;
	}

	private ensureSiblingProperty(node: HuffmanNode): void {
		if (node.isLeaf()) return;
		if (!node.left || !node.right) {
			console.error('Bug in algorithm');
			return;
		}

		if (node.left.weight > node.right.weight) {
			this.swapNodesOfTheSameParent(node.left, node.right);
		}

		this.ensureSiblingProperty(node.left);
		this.ensureSiblingProperty(node.right);
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
