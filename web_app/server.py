#!/usr/bin/env python3
"""
API server for document categorization using a BERT transformer model.
Runs as a Python service alongside the Next.js frontend.
"""

import pickle
import os
import json
import sys
import torch
from flask import Flask, request, jsonify
from pathlib import Path
from transformers import AutoTokenizer, AutoModelForSequenceClassification

app = Flask(__name__)

# Load the BERT model, tokenizer, and categories
MODEL_PATH = Path(__file__).parent / 'models' / 'bert_model'
CATEGORIES_PATH = Path(__file__).parent / 'models' / 'categories.pkl'

print(f"Loading BERT model from {MODEL_PATH}")
print(f"Loading categories from {CATEGORIES_PATH}")

try:
    tokenizer = AutoTokenizer.from_pretrained(str(MODEL_PATH))
    model = AutoModelForSequenceClassification.from_pretrained(str(MODEL_PATH))
    with open(CATEGORIES_PATH, 'rb') as f:
        categories = pickle.load(f)
    print(f"BERT model loaded successfully with {len(categories)} categories")
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model.to(device)
    model.eval()
except FileNotFoundError as e:
    print(f"Error: Model files not found. Please run train_classifier.py first.")
    print(f"Missing: {e}")
    sys.exit(1)


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({'status': 'ok', 'categories': len(categories)}), 200


@app.route('/classify', methods=['POST'])
def classify():
    """
    Classify a document into one of the 20 news categories using BERT.
    
    Request JSON:
    {
        "text": "Your document text here..."
    }
    
    Response JSON:
    {
        "primary_category": "politics",
        "primary_score": 0.95,
        "predictions": [
            {"category": "politics", "score": 0.95},
            {"category": "religion", "score": 0.03},
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing "text" field'}), 400
        
        text = data['text'].strip()
        
        if len(text) < 10:
            return jsonify({'error': 'Text must be at least 10 characters long'}), 400
        
        # Tokenize and prepare input
        inputs = tokenizer(text, return_tensors='pt', truncation=True, max_length=512)
        inputs = {k: v.to(device) for k, v in inputs.items()}
        
        # Get predictions from BERT
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            probabilities = torch.softmax(logits, dim=-1).cpu().numpy()[0]
        
        # Get the predicted category
        prediction_idx = probabilities.argmax()
        primary_category = categories[prediction_idx]
        primary_score = float(probabilities[prediction_idx])
        
        # Sort predictions by score and get top 5
        top_indices = probabilities.argsort()[::-1][:5]
        predictions = [
            {
                'category': categories[idx],
                'score': float(probabilities[idx])
            }
            for idx in top_indices
        ]
        
        return jsonify({
            'primary_category': primary_category,
            'primary_score': primary_score,
            'predictions': predictions
        }), 200
    
    except Exception as e:
        print(f"Error during classification: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3001))
    print(f"Starting API server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
