import networkx as nx
import matplotlib.pyplot as plt

def code_health_dashboard(impact_results, cypher_query_results):
    # Create a directed graph
    G = nx.DiGraph()

    # Add nodes and edges from Cypher query results
    for result in cypher_query_results:
        G.add_node(result['node_id'])
        for relationship in result['relationships']:
            G.add_edge(relationship['start_node'], relationship['end_node'])

    # Highlight nodes with potential risks from impact analysis
    for result in impact_results:
        if result['risk_level'] > 5:
            G.nodes[result['node_id']]['risk'] = True

    # Draw the graph with highlighted nodes
    pos = nx.spring_layout(G)
    nx.draw_networkx(G, pos, node_color=['red' if G.nodes[node].get('risk') else 'blue' for node in G.nodes])
    plt.show()

# Example usage
impact_results = [{'node_id': 'A', 'risk_level': 6}, {'node_id': 'B', 'risk_level': 3}]
cypher_query_results = [{'node_id': 'A', 'relationships': [{'start_node': 'A', 'end_node': 'B'}]}]
code_health_dashboard(impact_results, cypher_query_results)