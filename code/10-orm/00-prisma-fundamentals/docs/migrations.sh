#!/usr/bin/env bash
npx prisma migrate dev --name add-post-tags
npx prisma generate
