#!/bin/bash

aws cloudfront create-invalidation --distribution-id E130YIRE2R1XSZ --paths /\*
aws cloudfront create-invalidation --distribution-id E2831PMQD18AO5 --paths /\*
aws cloudfront create-invalidation --distribution-id E2NF6V2N72TEUD --paths /\*
aws cloudfront create-invalidation --distribution-id E2XJEZJMBS2V2Y --paths /\*

echo "clear cache"