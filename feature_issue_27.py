import networkx as nx
import matplotlib.pyplot as plt

def create_graph(cypher_query_results):
    """
    Create a directed graph from Cypher query results.
    
    Args:
    cypher_query_results (list): A list of dictionaries containing node IDs and relationships.
    
    Returns:
    nx.DiGraph: A directed graph.
    """
    G = nx.DiGraph()
    
    for result in cypher_query_results:
        try:
            G.add_node(result.get('node_id'))
            for relationship in result.get('relationships', []):
                G.add_edge(relationship.get('start_node'), relationship.get('end_node'))
        except Exception as e:
            print(f"Error: {e}")
    
    return G

def highlight_risky_nodes(G, impact_results, risk_threshold=5):
    """
    Highlight nodes with potential risks from impact analysis.
    
    Args:
    G (nx.DiGraph): A directed graph.
    impact_results (list): A list of dictionaries containing node IDs and risk levels.
    risk_threshold (int): The threshold for highlighting nodes with high risk levels.
    
    Returns:
    None
    """
    for result in impact_results:
        try:
            if result.get('risk_level') > risk_threshold:
                G.nodes[result.get('node_id', None)]['risk'] = True
        except Exception as e:
            print(f"Error: {e}")

def draw_graph(G, pos=None):
    """
    Draw the graph with highlighted nodes.
    
    Args:
    G (nx.DiGraph): A directed graph.
    pos (dict): The node positions. If not provided, uses spring layout.
    
    Returns:
    None
    """
    if pos is None:
        pos = nx.spring_layout(G)
    nx.draw_networkx(G, pos, node_color=['red' if G.nodes[node].get('risk') else 'blue' for node in G.nodes])
    plt.show()

def code_health_dashboard(impact_results, cypher_query_results, risk_threshold=5):
    """
    Create a code health dashboard from impact results and Cypher query results.
    
    Args:
    impact_results (list): A list of dictionaries containing node IDs and risk levels.
    cypher_query_results (list): A list of dictionaries containing node IDs and relationships.
    risk_threshold (int): The threshold for highlighting nodes with high risk levels.
    
    Returns:
    None
    """
    G = create_graph(cypher_query_results)
    highlight_risky_nodes(G, impact_results, risk_threshold)
    draw_graph(G, nx.spring_layout(G))

# Example usage
impact_results = [{'node_id': 'A', 'risk_level': 6}, {'node_id': 'B', 'risk_level': 3}]
cypher_query_results = [{'node_id': 'A', 'relationships': [{'start_node': 'A', 'end_node': 'B'}]}]

code_health_dashboard(impact_results, cypher_query_results)