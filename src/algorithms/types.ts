// Shared types for the Huffman algorithm implementation

export interface TreeNode {
	id: number;
	weight: number;
	symbol: string | null;
	isNYT: boolean;
	left: TreeNode | null;
	right: TreeNode | null;
	parent: TreeNode | null;
}

export interface TreeSnapshot {
	nodes: SerializedNode[];
	rootId: number;
}

export interface SerializedNode {
	id: number;
	weight: number;
	symbol: string | null;
	isNYT: boolean;
	leftId: number | null;
	rightId: number | null;
	parentId: number | null;
}

export interface EncoderState {
	processedSymbols: string[];
	currentSymbol: string | null;
	treeSnapshot: TreeSnapshot;
}

export interface DecoderState {
	decodedMessage: string;
	bitBuffer: string;
	currentBits: string;
	treeSnapshot: TreeSnapshot;
}

export interface Step {
	stepNumber: number;
	character: string;
	isFirstOccurrence: boolean;
	encodedBits: string;
	encoderTreeState: TreeSnapshot;
	decoderTreeState: TreeSnapshot;
	decodedCharacter: string;
	highlightedEncoderNodes: number[];
	highlightedDecoderNodes: number[];
}
