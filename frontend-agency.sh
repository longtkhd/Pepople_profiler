#!/bin/bash
cd frontend/agency
yarn
yarn build:staging
cp -r assets build
aws s3 sync --delete build s3://ppp-frontend
echo Build agency completed
