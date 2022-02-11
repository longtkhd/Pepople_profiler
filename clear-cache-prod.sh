#!/bin/bash
aws cloudfront create-invalidation --distribution-id E1CPZ5N4D33FLK --paths /\*
aws cloudfront create-invalidation --distribution-id E24W2NAN72EUQN --paths /\*

echo "clear cache"