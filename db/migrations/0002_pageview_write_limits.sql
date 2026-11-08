-- Apply before deploying the bounded pageview writer. Safe to run again.
-- State stays on each published slug's row rather than growing per visitor.
ALTER TABLE pageviews
  ADD COLUMN IF NOT EXISTS write_window_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS write_window_count INTEGER NOT NULL DEFAULT 0;
