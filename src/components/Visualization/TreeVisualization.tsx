import * as d3 from 'd3';
import { memo, useMemo } from 'react';
import { SerializedNode, TreeSnapshot } from '../../algorithms/types';

interface TreeVisualizationProps {
	treeSnapshot: TreeSnapshot;
}

interface TreeNode extends d3.HierarchyPointNode<SerializedNode> {
	data: SerializedNode;
}

const TreeVisualizationComponent = ({ treeSnapshot }: TreeVisualizationProps) => {
	const { nodes, links } = useMemo(() => {
		if (!treeSnapshot || !treeSnapshot.nodes || treeSnapshot.nodes.length === 0) {
			return { nodes: [], links: [] };
		}

		// Build a map of nodes
		const nodeMap = new Map<number, SerializedNode>();
		treeSnapshot.nodes.forEach((node) => {
			nodeMap.set(node.id, node);
		});

		// Find the root
		const rootNode = nodeMap.get(treeSnapshot.rootId);
		if (!rootNode) {
			return { nodes: [], links: [] };
		}

		// Build hierarchy
		const buildHierarchy = (node: SerializedNode): any => {
			const children: any[] = [];

			if (node.leftId !== null) {
				const leftNode = nodeMap.get(node.leftId);
				if (leftNode) children.push(buildHierarchy(leftNode));
			}

			if (node.rightId !== null) {
				const rightNode = nodeMap.get(node.rightId);
				if (rightNode) children.push(buildHierarchy(rightNode));
			}

			return {
				...node,
				children: children.length > 0 ? children : undefined,
			};
		};

		const hierarchyData = buildHierarchy(rootNode);

		// Create D3 tree layout
		const treeLayout = d3
			.tree<SerializedNode>()
			.size([400, 300])
			.separation((a, b) => (a.parent === b.parent ? 1 : 1.5));

		const root = d3.hierarchy(hierarchyData);
		const treeData = treeLayout(root) as TreeNode;

		// Extract nodes and links
		const layoutNodes = treeData.descendants();
		const layoutLinks = treeData.links();

		return {
			nodes: layoutNodes,
			links: layoutLinks,
		};
	}, [treeSnapshot]);

	if (nodes.length === 0) {
		return (
			<div className='flex min-h-75 w-full items-center justify-center'>
				<p className='text-gray-500 italic'>No tree data available</p>
			</div>
		);
	}

	const width = 500;
	const height = 400;
	const marginTop = 40;
	const marginLeft = 50;

	return (
		<div className='flex min-h-75 w-full items-center justify-center'>
			<svg
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				className='h-auto max-w-full'>
				<g transform={`translate(${marginLeft}, ${marginTop})`}>
					{/* Draw links */}
					{links.map((link, index) => (
						<g key={`link-${index}`}>
							<line
								x1={link.source.x}
								y1={link.source.y}
								x2={link.target.x}
								y2={link.target.y}
								stroke='#999'
								strokeWidth='2'
								fill='none'
							/>
							{/* Edge labels (0/1) */}
							<text
								x={(link.source.x + link.target.x) / 2}
								y={(link.source.y + link.target.y) / 2 - 5}
								fill='#aaa'
								fontSize='12'
								fontWeight='bold'
								textAnchor='middle'>
								{link.target === (link.source as any).children?.[0] ? '0' : '1'}
							</text>
						</g>
					))}

					{/* Draw nodes */}
					{nodes.map((node) => {
						const isNYT = node.data.isNYT;
						const isLeaf = node.data.symbol !== null || isNYT;

						// Determine fill and stroke colors
						let fill, stroke, strokeWidth;
						if (isNYT) {
							fill = '#ff9800';
							stroke = '#f57c00';
							strokeWidth = 2;
						} else if (isLeaf) {
							fill = '#4caf50';
							stroke = '#2e7d32';
							strokeWidth = 2;
						} else {
							fill = '#555';
							stroke = '#888';
							strokeWidth = 2;
						}

						return (
							<g
								key={`node-${node.data.id}`}
								transform={`translate(${node.x}, ${node.y})`}
								className='cursor-pointer'>
								{/* Node shape - rectangles for leaves, circles for internal nodes */}
								{isLeaf ? (
									<rect
										x={-15}
										y={-15}
										width={30}
										height={30}
										fill={fill}
										stroke={stroke}
										strokeWidth={strokeWidth}
										className='transition-all duration-300'
									/>
								) : (
									<circle
										r={15}
										fill={fill}
										stroke={stroke}
										strokeWidth={strokeWidth}
										className='transition-all duration-300'
									/>
								)}

								{/* Node label */}
								<text
									dy='.35em'
									textAnchor='middle'
									fill='white'
									fontSize='12'
									fontWeight='bold'
									pointerEvents='none'>
									{isNYT ? 'NYT' : node.data.symbol || ''}
								</text>

								{/* Weight label */}
								<text
									dy='2.5em'
									textAnchor='middle'
									fill='#aaa'
									fontSize='10'
									pointerEvents='none'>
									w:{node.data.weight}
								</text>
							</g>
						);
					})}
				</g>
			</svg>
		</div>
	);
};

// Memoize to prevent unnecessary re-renders
export const TreeVisualization = memo(TreeVisualizationComponent, (prevProps, nextProps) => {
	// Re-render if tree nodes or highlighted nodes changed
	// We need to compare the actual node data (including weights), not just structure
	const treeEqual =
		JSON.stringify(prevProps.treeSnapshot) === JSON.stringify(nextProps.treeSnapshot);

	return treeEqual;
});
