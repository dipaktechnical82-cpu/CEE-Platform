# ADR 002: Public/Private Route Boundary and Search Engine Optimization Strategy

## Status

Accepted

## Context

A medical entrance preparation platform contains two distinct classes of content:

1. **Public Marketing & Educational Discovery**: Landing pages, Nepal MEC syllabus guidelines, medical curriculum breakdowns, FAQ, and public blogs. These require top-tier search visibility, rapid first contentful paint (FCP), and structured schema markup.
2. **Private Educational Records & Live Tests**: Student examination sessions, live test questions, detailed answer analytics, personal profile data, and subscription billing. These must never leak into search engine indexes.

## Decision

1. **Next.js Route Group Separation**:
   - `apps/web/src/app/(public)`: Standard layouts with open crawling rules, canonical tags, and structured JSON-LD schemas.
   - `apps/web/src/app/(auth)`: Restricted layouts with `noindex, nofollow` metadata.
   - `apps/web/src/app/(dashboard)`: Restricted workspaces with strict `noindex, nofollow` metadata.
2. **Dynamic Robots and Sitemap**:
   - `apps/web/src/app/robots.ts` explicitly disallows private paths and known AI crawlers from scraping test material.
   - `apps/web/src/app/sitemap.ts` programmatically feeds search engines only the verified public educational routes.

## Consequences

- Guaranteed boundary protection prevents student rankings or unreleased mock tests from indexing.
- Clean semantic separation allows fine-grained middleware authentication without affecting public page performance.
