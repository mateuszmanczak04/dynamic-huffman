import { HuffmanNode } from './HuffmanNode';

export class NYTNode extends HuffmanNode {
	constructor(id: number) {
		super(id, 0, null, true);
	}
}
