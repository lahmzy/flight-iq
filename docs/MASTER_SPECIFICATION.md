# FlightIQ - Aviation Intelligence Platform

Version: MVP v1

## Vision

FlightIQ is an aviation investigation and intelligence platform that helps aviation enthusiasts, students, researchers, pilots, and the general public explore aviation incidents and accidents from around the world.

The goal is not merely to store incidents, but to transform aviation investigations into an educational experience through timelines, visualizations, statistics, lessons learned, and eventually AI-powered analysis.

---

# Phase 1 Goals

Build the foundational platform before introducing AI.

Users should be able to:

* Search incidents
* Browse incidents
* Filter incidents
* View incident details
* Explore incidents on a map
* View aircraft profiles
* View statistics

No AI.
No comments.
No authentication.

Read-only platform.

---

# Core Domain Models

## Incident

Represents an aviation incident or accident.

Fields:

* id
* slug
* title
* summary
* investigationStatus
* incidentDate
* location
* latitude
* longitude
* fatalities
* injuries
* aircraftId
* airlineId
* officialCause
* lessonsLearned
* createdAt
* updatedAt

Relationships:

* belongsTo Aircraft
* belongsTo Airline
* hasMany IncidentTags
* hasMany Videos
* hasMany Sources

---

## Aircraft

Fields:

* id
* manufacturer
* model
* aircraftType
* firstFlightYear
* description
* imageUrl

Examples:

* Boeing 737-800
* Airbus A320
* Boeing 787-9

---

## Airline

Fields:

* id
* name
* country
* logoUrl

---

## Tag

Used for grouping incidents.

Examples:

* Pilot Error
* Weather
* Mechanical Failure
* Bird Strike
* Fuel Exhaustion
* Maintenance
* ATC Error
* Runway Excursion
* CFIT
* Stall
* Engine Failure

Fields:

* id
* name
* slug

---

## Video

Links related videos.

Fields:

* id
* incidentId
* youtubeUrl
* title

---

## Source

Official reports.

Fields:

* id
* incidentId
* sourceName
* url

---

# Backend Architecture

NestJS

Modules:

* incidents
* aircraft
* airlines
* tags
* videos
* sources
* statistics
* map

Database:

PostgreSQL

ORM:

Prisma

---

# Initial Database Flow

Aircraft
↓
Incident
↓
Tags
↓
Videos
↓
Sources

Incidents are the central entity.

Everything revolves around incidents.

---

# MVP API Endpoints

## Incidents

GET /incidents

Supports:

* search
* pagination
* sorting
* filtering

Query Examples:

?search=air france
?tag=weather
?aircraft=airbus
?year=2009

---

GET /incidents/:slug

Returns:

* incident details
* aircraft
* airline
* tags
* videos
* sources

---

## Aircraft

GET /aircraft

GET /aircraft/:id

Returns:

* aircraft details
* incident count
* related incidents

---

## Airlines

GET /airlines

GET /airlines/:id

Returns:

* airline details
* incident history

---

## Tags

GET /tags

Returns all available tags.

---

## Statistics

GET /statistics/overview

Returns:

* total incidents
* total fatalities
* total aircraft types
* total airlines

---

GET /statistics/causes

Returns:

* incidents grouped by tags

---

GET /statistics/yearly

Returns:

* incidents grouped by year

---

## Map

GET /map/incidents

Returns:

* latitude
* longitude
* title
* slug

Only fields necessary for map rendering.

---

# Frontend Navigation

Home

Investigations

Map

Aircraft

Statistics

---

# Home Page

Hero Search

Featured Investigations

Browse by Cause

Recent Investigations

Mini Global Map

Platform Statistics

---

# Investigations Page

Search

Filters

* Aircraft
* Airline
* Year
* Cause
* Fatalities

Investigation Cards

Pagination

---

# Incident Details Page

Header

Timeline

Summary

Investigation Details

Contributing Factors

Lessons Learned

Related Videos

Official Reports

Similar Incidents (Tag-Based)

---

# Map Page

Global Interactive Map

Marker Clustering

Filter Sidebar

Incident Preview Cards

---

# Aircraft Page

Aircraft Overview

Incident Statistics

Related Incidents

---

# Statistics Dashboard

Incidents By Year

Incidents By Cause

Most Affected Aircraft

Fatal vs Non Fatal

Geographical Distribution

---

# Phase 2

Authentication

Users

Bookmarks

Comments

Profiles

Saved Investigations

---

# Phase 3

AI Integration

AI Incident Summary

AI Similar Incidents

AI Question Answering

AI Safety Insights

Semantic Search

Investigation Chat Assistant

---

# Development Order

Step 1:
Database Design

Step 2:
Prisma Models

Step 3:
Incident Module

Step 4:
Aircraft Module

Step 5:
Tag Module

Step 6:
Statistics Module

Step 7:
Map Module

Step 8:
Frontend Integration

Step 9:
Authentication

Step 10:
Comments

Step 11:
AI Features

AI must be the final major feature.
