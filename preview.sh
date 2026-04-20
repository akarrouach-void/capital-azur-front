#!/usr/bin/env bash

rm -rf ./.next/vactory
mkdir -p ./.next/vactory
cp -r .next/standalone/ ./.next/vactory/
cp -r next.config.js ./.next/vactory/apps/starter
cp -r project.config.js ./.next/vactory/apps/starter
cp -r .next/static/ ./.next/vactory/apps/starter/.next/static
cp -r public/ ./.next/vactory/apps/starter/public
cp -r server.js ./.next/vactory/apps/starter/server.js
cp -r database/ ./.next/vactory/apps/starter/database
cp -r .runtime/ ./.next/vactory/apps/starter/.runtime
cp .env ./.next/vactory/apps/starter/.env
cp -r ../../node_modules/@vactory ./.next/vactory/node_modules/@vactory
cp -r ../../node_modules/@vactorynext ./.next/vactory/node_modules/@vactorynext
cp -r ../../node_modules/@edge-csrf/node-http ./.next/vactory/node_modules/@edge-csrf/node-http
cp -r ../../node_modules/path-to-regexp ./.next/vactory/node_modules/path-to-regexp

node ./.next/vactory/apps/starter/server.js