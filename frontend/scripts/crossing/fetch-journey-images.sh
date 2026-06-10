#!/usr/bin/env bash
# Download curated Unsplash hero photos for journey panels (run once).
set -euo pipefail
DIR="$(cd "$(dirname "$0")/.." && pwd)/public/journey"
mkdir -p "$DIR"
curl -fsSL 'https://images.unsplash.com/photo-1585218420287-4ec639caec21?w=1920&q=85&fit=crop' -o "$DIR/explore-halifax.jpg"
curl -fsSL 'https://images.unsplash.com/photo-1531482615710-688b7849c253?w=1920&q=85&fit=crop' -o "$DIR/build-workshop.jpg"
curl -fsSL 'https://images.unsplash.com/photo-1567894340315-638ef1881459?w=1920&q=85&fit=crop' -o "$DIR/harbour-boats.jpg"
curl -fsSL 'https://images.unsplash.com/photo-1473494716220-587cb4b3742e?w=1920&q=85&fit=crop' -o "$DIR/crew-pier.jpg"
echo "Saved 4 images to public/journey/"
