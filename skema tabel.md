create table public.achievements (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  title text not null,
  description text null,
  icon text null,
  date_earned timestamp with time zone null,
  progress integer null default 0,
  is_completed boolean null default false,
  created_at timestamp with time zone null default now(),
  constraint achievements_pkey primary key (id),
  constraint achievements_user_id_fkey foreign KEY (user_id) references profiles (id)
) TABLESPACE pg_default;

create index IF not exists idx_achievements_user_id on public.achievements using btree (user_id) TABLESPACE pg_default;


_____


create table public.blocks (
  id uuid not null default extensions.uuid_generate_v4 (),
  chapter_id uuid not null,
  type text not null,
  content text null,
  checked boolean null,
  image_url text null,
  position integer not null,
  constraint blocks_pkey primary key (id),
  constraint blocks_chapter_id_fkey foreign KEY (chapter_id) references chapters (id)
) TABLESPACE pg_default;

create index IF not exists idx_blocks_chapter_id on public.blocks using btree (chapter_id) TABLESPACE pg_default;

_________

create table public.books (
  id uuid not null default extensions.uuid_generate_v4 (),
  title text not null,
  author text not null,
  cover_image text null,
  description text null,
  genres text[] null default '{}'::text[],
  page_count integer null default 0,
  published_date text null,
  publisher text null,
  rating numeric(3, 1) null default 0,
  status text null default 'Available'::text,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint books_pkey primary key (id)
) TABLESPACE pg_default;

______


create table public.borrowed_books (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  book_id uuid not null,
  borrow_date timestamp with time zone null default now(),
  due_date timestamp with time zone not null,
  returned_date timestamp with time zone null,
  constraint borrowed_books_pkey primary key (id),
  constraint borrowed_books_user_id_book_id_borrow_date_key unique (user_id, book_id, borrow_date),
  constraint borrowed_books_book_id_fkey foreign KEY (book_id) references books (id),
  constraint borrowed_books_user_id_fkey foreign KEY (user_id) references profiles (id)
) TABLESPACE pg_default;

create index IF not exists idx_borrowed_books_user_id on public.borrowed_books using btree (user_id) TABLESPACE pg_default;

_____

create table public.chapters (
  id uuid not null default extensions.uuid_generate_v4 (),
  project_id uuid not null,
  title text not null,
  status text null default 'Draft'::text,
  last_edited timestamp with time zone null default now(),
  word_count integer null default 0,
  views integer null default 0,
  likes integer null default 0,
  comments integer null default 0,
  constraint chapters_pkey primary key (id),
  constraint chapters_project_id_fkey foreign KEY (project_id) references projects (id)
) TABLESPACE pg_default;

create index IF not exists idx_chapters_project_id on public.chapters using btree (project_id) TABLESPACE pg_default;

_____

create view public.current_user_profile as
select
  id,
  auth0_sub,
  email,
  name,
  role,
  avatar_url,
  created_at,
  updated_at
from
  profiles p
where
  auth0_sub = get_current_auth0_sub ();

_______

create table public.profiles (
  id uuid not null default extensions.uuid_generate_v4 (),
  auth0_sub text not null,
  email text not null,
  name text null,
  role text null default 'reader'::text,
  avatar_url text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint profiles_pkey primary key (id),
…
create index IF not exists idx_profiles_auth0_sub on public.profiles using btree (auth0_sub) TABLESPACE pg_default;

create index IF not exists idx_profiles_email on public.profiles using btree (email) TABLESPACE pg_default;

create trigger on_profile_created
after INSERT on profiles for EACH row
execute FUNCTION handle_new_auth0_user ();

______________

create table public.projects (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  title text not null,
  cover_image text null,
  description text null,
  genres text[] null default '{}'::text[],
  status text null default 'Draft'::text,
  views integer null default 0,
  likes integer null default 0,
…create index IF not exists idx_projects_is_public on public.projects using btree (is_public) TABLESPACE pg_default;

_____________

create table public.projects (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  title text not null,
  cover_image text null,
  description text null,
  genres text[] null default '{}'::text[],
  status text null default 'Draft'::text,
  views integer null default 0,
  likes integer null default 0,
…create index IF not exists idx_projects_is_public on public.projects using btree (is_public) TABLESPACE pg_default;

_________

create table public.reading_stats (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  books_read integer null default 0,
  pages_read integer null default 0,
  hours_read integer null default 0,
  updated_at timestamp with time zone null default now(),
  constraint reading_stats_pkey primary key (id),
  constraint reading_stats_user_id_key unique (user_id),
  constraint reading_stats_user_id_fkey foreign KEY (user_id) references profiles (id)
) TABLESPACE pg_default;

create index IF not exists idx_reading_stats_user_id on public.reading_stats using btree (user_id) TABLESPACE pg_default;