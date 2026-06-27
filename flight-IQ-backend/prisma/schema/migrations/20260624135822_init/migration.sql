-- CreateEnum
CREATE TYPE "EvType" AS ENUM ('ACC', 'INC');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('Fatal', 'Major', 'Moderate', 'Minor');

-- CreateEnum
CREATE TYPE "InvestigationStatus" AS ENUM ('under_investigation', 'preliminary_report', 'final_report', 'Closed');

-- CreateEnum
CREATE TYPE "FlightPhase" AS ENUM ('pre_flight', 'Taxi', 'Takeoff', 'initial_climb', 'Climb', 'Cruise', 'Descent', 'Approach', 'Landing', 'go_around', 'post_flight');

-- CreateEnum
CREATE TYPE "AircraftCategory" AS ENUM ('Commercial', 'Cargo', 'Private', 'Military', 'Helicopter', 'general_aviation', 'Ultralight', 'Glider', 'Balloon', 'Unknown');

-- CreateEnum
CREATE TYPE "VideoPlatform" AS ENUM ('youtube', 'Vimeo', 'Other');

-- CreateEnum
CREATE TYPE "TimelineEventType" AS ENUM ('Normal', 'Warning', 'Critical');

-- CreateEnum
CREATE TYPE "FactorSeverity" AS ENUM ('High', 'Medium', 'Low');

-- CreateEnum
CREATE TYPE "FactorCategory" AS ENUM ('Primary', 'Contributing', 'Positive');

-- CreateEnum
CREATE TYPE "FindingCategory" AS ENUM ('Personnel', 'Environmental', 'Aircraft', 'Organization', 'Other');

-- CreateEnum
CREATE TYPE "VerificationCodeCategory" AS ENUM ('email_verification', 'forgot_password_verification');

-- CreateEnum
CREATE TYPE "LogSeverity" AS ENUM ('low', 'moderate', 'high', 'emergency');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('active', 'banned', 'suspended');

-- CreateEnum
CREATE TYPE "AuthenticationMethod" AS ENUM ('credentials', 'google');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');

-- CreateTable
CREATE TABLE "airlines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iata_code" TEXT,
    "icao_code" TEXT,
    "country" TEXT,
    "logo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "airlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aircraft" (
    "id" TEXT NOT NULL,
    "ntsb_event_id" TEXT NOT NULL,
    "ntsb_aircraft_key" INTEGER NOT NULL,
    "registration_no" TEXT,
    "make" TEXT,
    "model" TEXT,
    "series" TEXT,
    "serial_no" TEXT,
    "cert_max_gross_weight" INTEGER,
    "ntsb_category" TEXT,
    "category" "AircraftCategory",
    "homebuilt" BOOLEAN NOT NULL DEFAULT false,
    "flight_phase" "FlightPhase",
    "flight_number" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aircraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aircraft_airlines" (
    "aircraft_id" TEXT NOT NULL,
    "airline_id" TEXT NOT NULL,
    "flight_number" TEXT,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aircraft_airlines_pkey" PRIMARY KEY ("aircraft_id","airline_id")
);

-- CreateTable
CREATE TABLE "aircraft_narratives" (
    "id" TEXT NOT NULL,
    "ntsb_event_id" TEXT NOT NULL,
    "ntsb_aircraft_key" INTEGER NOT NULL,
    "narrative_accp" TEXT,
    "narrative_accf" TEXT,
    "narrative_cause" TEXT,
    "narrative_inc" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aircraft_narratives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "findings" (
    "id" TEXT NOT NULL,
    "ntsb_event_id" TEXT NOT NULL,
    "ntsb_aircraft_key" INTEGER NOT NULL,
    "finding_no" INTEGER NOT NULL,
    "finding_code" TEXT,
    "description" TEXT,
    "category" "FindingCategory" NOT NULL DEFAULT 'Other',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "findings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" TEXT NOT NULL,
    "ntsb_event_id" TEXT,
    "ntsb_no" TEXT,
    "slug" TEXT NOT NULL,
    "title" TEXT,
    "ev_type" "EvType",
    "severity" "Severity" NOT NULL,
    "status" "InvestigationStatus" NOT NULL DEFAULT 'under_investigation',
    "incident_date" TIMESTAMP(3) NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "apt_name" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "departure_airport" TEXT,
    "destination_airport" TEXT,
    "fatalities" INTEGER NOT NULL DEFAULT 0,
    "injuries" INTEGER NOT NULL DEFAULT 0,
    "occupants" INTEGER,
    "official_cause" TEXT,
    "summary" TEXT,
    "ai_summary" TEXT,
    "ai_lessons_learned" TEXT,
    "search_text" TEXT,
    "ai_metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incident_aircraft" (
    "incident_id" TEXT NOT NULL,
    "aircraft_id" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT,

    CONSTRAINT "incident_aircraft_pkey" PRIMARY KEY ("incident_id","aircraft_id")
);

-- CreateTable
CREATE TABLE "incident_tags" (
    "incident_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "incident_tags_pkey" PRIMARY KEY ("incident_id","tag_id")
);

-- CreateTable
CREATE TABLE "timeline_events" (
    "id" TEXT NOT NULL,
    "incident_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "phase" "FlightPhase",
    "event" TEXT NOT NULL,
    "type" "TimelineEventType" NOT NULL DEFAULT 'Normal',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contributing_factors" (
    "id" TEXT NOT NULL,
    "incident_id" TEXT NOT NULL,
    "finding_id" TEXT,
    "factor" TEXT NOT NULL,
    "category" "FactorCategory" NOT NULL,
    "description" TEXT,
    "severity" "FactorSeverity" NOT NULL DEFAULT 'Medium',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contributing_factors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "incident_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "platform" "VideoPlatform" NOT NULL DEFAULT 'youtube',
    "url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "channel_name" TEXT,
    "duration" TEXT,
    "view_count" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sources" (
    "id" TEXT NOT NULL,
    "incident_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source_name" TEXT NOT NULL,
    "url" TEXT,
    "published_date" TIMESTAMP(3),
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "incident_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "finger_print" TEXT,
    "code" TEXT NOT NULL,
    "type" "VerificationCodeCategory" NOT NULL,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "password" TEXT,
    "auth_method" "AuthenticationMethod" NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "mail_verified_at" TIMESTAMP(3),
    "account_setup_completed_at" TIMESTAMP(3),
    "status" "AccountStatus" NOT NULL DEFAULT 'active',
    "suspended_at" TIMESTAMP(3),
    "reason_for_suspenion" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActivityLog" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "activity_log" TEXT NOT NULL,
    "severity" "LogSeverity" NOT NULL DEFAULT 'low',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "device_name" TEXT NOT NULL,
    "finger_print" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "airlines_name_key" ON "airlines"("name");

-- CreateIndex
CREATE UNIQUE INDEX "airlines_iata_code_key" ON "airlines"("iata_code");

-- CreateIndex
CREATE UNIQUE INDEX "airlines_icao_code_key" ON "airlines"("icao_code");

-- CreateIndex
CREATE INDEX "airlines_name_idx" ON "airlines"("name");

-- CreateIndex
CREATE INDEX "airlines_country_idx" ON "airlines"("country");

-- CreateIndex
CREATE INDEX "aircraft_ntsb_event_id_idx" ON "aircraft"("ntsb_event_id");

-- CreateIndex
CREATE INDEX "aircraft_registration_no_idx" ON "aircraft"("registration_no");

-- CreateIndex
CREATE INDEX "aircraft_make_idx" ON "aircraft"("make");

-- CreateIndex
CREATE INDEX "aircraft_model_idx" ON "aircraft"("model");

-- CreateIndex
CREATE INDEX "aircraft_make_model_idx" ON "aircraft"("make", "model");

-- CreateIndex
CREATE UNIQUE INDEX "aircraft_ntsb_event_id_ntsb_aircraft_key_key" ON "aircraft"("ntsb_event_id", "ntsb_aircraft_key");

-- CreateIndex
CREATE INDEX "aircraft_airlines_airline_id_idx" ON "aircraft_airlines"("airline_id");

-- CreateIndex
CREATE INDEX "aircraft_narratives_ntsb_event_id_idx" ON "aircraft_narratives"("ntsb_event_id");

-- CreateIndex
CREATE UNIQUE INDEX "aircraft_narratives_ntsb_event_id_ntsb_aircraft_key_key" ON "aircraft_narratives"("ntsb_event_id", "ntsb_aircraft_key");

-- CreateIndex
CREATE INDEX "findings_ntsb_event_id_idx" ON "findings"("ntsb_event_id");

-- CreateIndex
CREATE INDEX "findings_finding_code_idx" ON "findings"("finding_code");

-- CreateIndex
CREATE INDEX "findings_category_idx" ON "findings"("category");

-- CreateIndex
CREATE UNIQUE INDEX "findings_ntsb_event_id_ntsb_aircraft_key_finding_no_key" ON "findings"("ntsb_event_id", "ntsb_aircraft_key", "finding_no");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "tags_name_idx" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "incidents_ntsb_event_id_key" ON "incidents"("ntsb_event_id");

-- CreateIndex
CREATE UNIQUE INDEX "incidents_ntsb_no_key" ON "incidents"("ntsb_no");

-- CreateIndex
CREATE UNIQUE INDEX "incidents_slug_key" ON "incidents"("slug");

-- CreateIndex
CREATE INDEX "incidents_incident_date_idx" ON "incidents"("incident_date");

-- CreateIndex
CREATE INDEX "incidents_slug_idx" ON "incidents"("slug");

-- CreateIndex
CREATE INDEX "incidents_country_idx" ON "incidents"("country");

-- CreateIndex
CREATE INDEX "incidents_city_idx" ON "incidents"("city");

-- CreateIndex
CREATE INDEX "incidents_state_idx" ON "incidents"("state");

-- CreateIndex
CREATE INDEX "incidents_severity_idx" ON "incidents"("severity");

-- CreateIndex
CREATE INDEX "incidents_status_idx" ON "incidents"("status");

-- CreateIndex
CREATE INDEX "incidents_ev_type_idx" ON "incidents"("ev_type");

-- CreateIndex
CREATE INDEX "incidents_incident_date_severity_idx" ON "incidents"("incident_date", "severity");

-- CreateIndex
CREATE INDEX "incident_aircraft_aircraft_id_idx" ON "incident_aircraft"("aircraft_id");

-- CreateIndex
CREATE INDEX "incident_aircraft_incident_id_is_primary_idx" ON "incident_aircraft"("incident_id", "is_primary");

-- CreateIndex
CREATE INDEX "incident_tags_tag_id_idx" ON "incident_tags"("tag_id");

-- CreateIndex
CREATE INDEX "timeline_events_incident_id_sort_order_idx" ON "timeline_events"("incident_id", "sort_order");

-- CreateIndex
CREATE INDEX "contributing_factors_incident_id_sort_order_idx" ON "contributing_factors"("incident_id", "sort_order");

-- CreateIndex
CREATE INDEX "contributing_factors_finding_id_idx" ON "contributing_factors"("finding_id");

-- CreateIndex
CREATE INDEX "videos_incident_id_idx" ON "videos"("incident_id");

-- CreateIndex
CREATE INDEX "sources_incident_id_idx" ON "sources"("incident_id");

-- CreateIndex
CREATE INDEX "sources_source_name_idx" ON "sources"("source_name");

-- CreateIndex
CREATE INDEX "comments_incident_id_created_at_idx" ON "comments"("incident_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "aircraft_airlines" ADD CONSTRAINT "aircraft_airlines_aircraft_id_fkey" FOREIGN KEY ("aircraft_id") REFERENCES "aircraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aircraft_airlines" ADD CONSTRAINT "aircraft_airlines_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "airlines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aircraft_narratives" ADD CONSTRAINT "aircraft_narratives_ntsb_event_id_ntsb_aircraft_key_fkey" FOREIGN KEY ("ntsb_event_id", "ntsb_aircraft_key") REFERENCES "aircraft"("ntsb_event_id", "ntsb_aircraft_key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "findings" ADD CONSTRAINT "findings_ntsb_event_id_ntsb_aircraft_key_fkey" FOREIGN KEY ("ntsb_event_id", "ntsb_aircraft_key") REFERENCES "aircraft"("ntsb_event_id", "ntsb_aircraft_key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_aircraft" ADD CONSTRAINT "incident_aircraft_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_aircraft" ADD CONSTRAINT "incident_aircraft_aircraft_id_fkey" FOREIGN KEY ("aircraft_id") REFERENCES "aircraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_tags" ADD CONSTRAINT "incident_tags_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incident_tags" ADD CONSTRAINT "incident_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributing_factors" ADD CONSTRAINT "contributing_factors_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributing_factors" ADD CONSTRAINT "contributing_factors_finding_id_fkey" FOREIGN KEY ("finding_id") REFERENCES "findings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sources" ADD CONSTRAINT "sources_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp" ADD CONSTRAINT "otp_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivityLog" ADD CONSTRAINT "UserActivityLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
