-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('Fatal', 'Major', 'Moderate', 'Minor');

-- CreateEnum
CREATE TYPE "InvestigationStatus" AS ENUM ('under_investigation', 'preliminary_report', 'final_report', 'Closed');

-- CreateEnum
CREATE TYPE "FlightPhase" AS ENUM ('pre_flight', 'Taxi', 'Takeoff', 'initial_climb', 'Climb', 'Cruise', 'Descent', 'Approach', 'Landing', 'go_around', 'post_flight');

-- CreateEnum
CREATE TYPE "AircraftCategory" AS ENUM ('Commercial', 'Cargo', 'Private', 'Military', 'Helicopter', 'general_aviation');

-- CreateEnum
CREATE TYPE "VideoPlatform" AS ENUM ('youtube', 'Vimeo', 'Other');

-- CreateEnum
CREATE TYPE "TimelineEventType" AS ENUM ('Normal', 'Warning', 'Critical');

-- CreateEnum
CREATE TYPE "FactorSeverity" AS ENUM ('High', 'Medium', 'Low');

-- CreateEnum
CREATE TYPE "FactorCategory" AS ENUM ('Primary', 'Contributing', 'Positive');

-- CreateTable
CREATE TABLE "Aircraft" (
    "id" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "category" "AircraftCategory" NOT NULL DEFAULT 'Commercial',
    "description" TEXT,
    "firstFlightYear" INTEGER,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aircraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Airline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Airline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "status" "InvestigationStatus" NOT NULL DEFAULT 'under_investigation',
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "country" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "flightNumber" TEXT,
    "registration" TEXT,
    "departureAirport" TEXT,
    "destinationAirport" TEXT,
    "phase" "FlightPhase",
    "occupants" INTEGER,
    "fatalities" INTEGER NOT NULL DEFAULT 0,
    "injuries" INTEGER NOT NULL DEFAULT 0,
    "officialCause" TEXT,
    "lessonsLearned" TEXT,
    "aiSummary" TEXT,
    "aiLessonsLearned" TEXT,
    "searchText" TEXT,
    "aiMetadata" JSONB,
    "aircraftId" TEXT NOT NULL,
    "airlineId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentTag" (
    "incidentId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IncidentTag_pkey" PRIMARY KEY ("incidentId","tagId")
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "phase" "FlightPhase",
    "event" TEXT NOT NULL,
    "type" "TimelineEventType" NOT NULL DEFAULT 'Normal',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributingFactor" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "factor" TEXT NOT NULL,
    "category" "FactorCategory" NOT NULL,
    "description" TEXT,
    "severity" "FactorSeverity" NOT NULL DEFAULT 'Medium',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContributingFactor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "platform" "VideoPlatform" NOT NULL DEFAULT 'youtube',
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "channelName" TEXT,
    "duration" TEXT,
    "viewCount" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "url" TEXT,
    "publishedDate" TIMESTAMP(3),
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Aircraft_manufacturer_idx" ON "Aircraft"("manufacturer");

-- CreateIndex
CREATE INDEX "Aircraft_model_idx" ON "Aircraft"("model");

-- CreateIndex
CREATE UNIQUE INDEX "Aircraft_manufacturer_model_key" ON "Aircraft"("manufacturer", "model");

-- CreateIndex
CREATE UNIQUE INDEX "Airline_name_key" ON "Airline"("name");

-- CreateIndex
CREATE INDEX "Airline_name_idx" ON "Airline"("name");

-- CreateIndex
CREATE INDEX "Airline_country_idx" ON "Airline"("country");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Incident_slug_key" ON "Incident"("slug");

-- CreateIndex
CREATE INDEX "Incident_incidentDate_idx" ON "Incident"("incidentDate");

-- CreateIndex
CREATE INDEX "Incident_slug_idx" ON "Incident"("slug");

-- CreateIndex
CREATE INDEX "Incident_title_idx" ON "Incident"("title");

-- CreateIndex
CREATE INDEX "Incident_country_idx" ON "Incident"("country");

-- CreateIndex
CREATE INDEX "Incident_location_idx" ON "Incident"("location");

-- CreateIndex
CREATE INDEX "Incident_aircraftId_idx" ON "Incident"("aircraftId");

-- CreateIndex
CREATE INDEX "Incident_airlineId_idx" ON "Incident"("airlineId");

-- CreateIndex
CREATE INDEX "Incident_severity_idx" ON "Incident"("severity");

-- CreateIndex
CREATE INDEX "Incident_status_idx" ON "Incident"("status");

-- CreateIndex
CREATE INDEX "Incident_incidentDate_severity_idx" ON "Incident"("incidentDate", "severity");

-- CreateIndex
CREATE INDEX "Incident_aircraftId_incidentDate_idx" ON "Incident"("aircraftId", "incidentDate");

-- CreateIndex
CREATE INDEX "Incident_airlineId_incidentDate_idx" ON "Incident"("airlineId", "incidentDate");

-- CreateIndex
CREATE INDEX "IncidentTag_tagId_idx" ON "IncidentTag"("tagId");

-- CreateIndex
CREATE INDEX "TimelineEvent_incidentId_sortOrder_idx" ON "TimelineEvent"("incidentId", "sortOrder");

-- CreateIndex
CREATE INDEX "ContributingFactor_incidentId_sortOrder_idx" ON "ContributingFactor"("incidentId", "sortOrder");

-- CreateIndex
CREATE INDEX "Video_incidentId_idx" ON "Video"("incidentId");

-- CreateIndex
CREATE INDEX "Source_incidentId_idx" ON "Source"("incidentId");

-- CreateIndex
CREATE INDEX "Source_sourceName_idx" ON "Source"("sourceName");

-- CreateIndex
CREATE INDEX "Comment_incidentId_createdAt_idx" ON "Comment"("incidentId", "createdAt");

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "Airline"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentTag" ADD CONSTRAINT "IncidentTag_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentTag" ADD CONSTRAINT "IncidentTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributingFactor" ADD CONSTRAINT "ContributingFactor_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
