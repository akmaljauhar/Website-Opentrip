-- Migration 002: Add event_location, rename route_name to city in event_routes
-- Run this in Supabase SQL Editor

-- Add event_location column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_location text NOT NULL DEFAULT '';

-- Rename route_name to city in event_routes table
ALTER TABLE event_routes RENAME COLUMN route_name TO city;
