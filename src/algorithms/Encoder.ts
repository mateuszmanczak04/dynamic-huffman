import { HuffmanTree } from './HuffmanTree';
import { EncoderState } from './types';

export class Encoder {
	private tree: HuffmanTree;
	private processedSymbols: string[];

	constructor() {
		this.tree = new HuffmanTree();
		this.processedSymbols = [];
	}

	encode(symbol: string) {
		this.tree.updateTree(symbol);
		this.processedSymbols.push(symbol);
	}

	getState(): EncoderState {
		return {
			processedSymbols: [...this.processedSymbols],
			currentSymbol:
				this.processedSymbols.length > 0
					? this.processedSymbols[this.processedSymbols.length - 1]
					: null,
			treeSnapshot: this.tree.serialize(),
		};
	}
}
