#!/bin/bash
cd frontend/admin
yarn
yarn build:prod
cp -r assets build
aws s3 sync --delete build s3://ppp-admin-prod
echo Build admin completed
