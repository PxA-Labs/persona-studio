from gradio_client import Client

try:
    print("Connecting to InstantX/InstantID...")
    client = Client("InstantX/InstantID")
    print(client.view_api(return_format="dict"))
except Exception as e:
    print("Error:", e)
