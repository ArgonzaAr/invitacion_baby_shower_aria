create table rsvps (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 120),
  guests      int  not null default 0 check (guests between 0 and 8),
  message     text check (char_length(message) <= 500),
  created_at  timestamptz not null default now()
);
