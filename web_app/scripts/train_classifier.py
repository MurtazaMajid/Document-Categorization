#!/usr/bin/env python3
"""
Train a BERT transformer model on the 20 News Groups dataset.
This script downloads the dataset, fine-tunes a BERT model,
and saves it for use in the API server.
"""

import os
import pickle
import torch
from sklearn.datasets import fetch_20newsgroups
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset

# Create models directory
os.makedirs('models', exist_ok=True)

print("Downloading 20 News Groups dataset...")
# Load the 20 news groups dataset
newsgroups = fetch_20newsgroups(
    subset='train',
    remove=('headers', 'footers', 'quotes'),
    download_if_missing=True
)

X_train = newsgroups.data
y_train = newsgroups.target
categories = newsgroups.target_names

print(f"Dataset loaded with {len(X_train)} documents and {len(categories)} categories")
print(f"Categories: {categories}")

# Create HuggingFace dataset
dataset = Dataset.from_dict({
    'text': X_train,
    'label': y_train
})

# Load BERT model and tokenizer
print("\nLoading BERT model...")
model_name = "bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(
    model_name,
    num_labels=len(categories)
)

# Tokenize dataset
def tokenize_function(examples):
    return tokenizer(
        examples['text'],
        padding='max_length',
        truncation=True,
        max_length=512
    )

print("Tokenizing dataset...")
tokenized_dataset = dataset.map(tokenize_function, batched=True, remove_columns=['text'])

# Training arguments
training_args = TrainingArguments(
    output_dir='./models/bert_checkpoint',
    num_train_epochs=2,
    per_device_train_batch_size=8,
    gradient_accumulation_steps=2,
    logging_steps=100,
    save_steps=500,
    save_total_limit=2,
)

# Trainer
print("\nFine-tuning BERT model...")
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
)

trainer.train()

# Save the fine-tuned model and tokenizer
print("\nSaving BERT model...")
model.save_pretrained('models/bert_model')
tokenizer.save_pretrained('models/bert_model')

# Save categories
with open('models/categories.pkl', 'wb') as f:
    pickle.dump(categories, f)

print("Model training complete!")
print(f"Saved to: models/bert_model")
print(f"Categories: {list(categories)}")
