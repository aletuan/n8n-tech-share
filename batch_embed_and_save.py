"""
Generate all 20 embeddings in a single batch request and save to Qdrant.
"""

import json

# Read the inputs
with open('embedding_inputs.json', 'r') as f:
    data = json.load(f)

# Extract all text inputs for batch processing
all_texts = [item['text'] for item in data['inputs']]

# Create the batch embedding request payload
batch_request = {
    "model": "text-embedding-3-small",
    "input": all_texts  # OpenAI accepts array of strings for batch processing
}

print("=" * 70)
print("BATCH EMBEDDING REQUEST")
print("=" * 70)
print(f"\n📊 Processing {len(all_texts)} texts in a single API call")
print(f"\n📝 Request payload:")
print(json.dumps(batch_request, indent=2)[:500] + "...")

# Save the batch request for manual execution
with open('batch_embedding_request.json', 'w') as f:
    json.dump(batch_request, f, indent=2)

print(f"\n✅ Batch request saved to: batch_embedding_request.json")
print("\n" + "=" * 70)
print("NEXT STEPS")
print("=" * 70)
print("\n1. Execute batch embedding request via Insomnia MCP")
print("2. Extract all 20 embedding vectors from response")
print("3. Build Qdrant upsert payload with all points")
print("4. Execute 'Save to Qdrant' request")
print("\nThis will populate Qdrant with 20 diverse points!")
