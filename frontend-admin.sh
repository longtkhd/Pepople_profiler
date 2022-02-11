#!/bin/bash
cd frontend/admin
yarn
yarn build:staging
cp -r assets build
aws s3 sync --delete build s3://ppp-admin
echo Build admin completed
