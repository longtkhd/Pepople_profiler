#!/bin/bash
cd frontend/agency
yarn
yarn build:prod
cp -r assets build
aws s3 sync --delete build s3://ppp-frontend-prod
echo Build agency completed
