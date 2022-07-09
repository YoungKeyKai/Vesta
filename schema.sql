-- This script is not for use, for illustrative purposes only
-- Schemas have been dropped for now - separate permissions are not needed yet.

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);

CREATE TABLE public.auth_group_permissions (
    id bigint NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);

CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);

CREATE TABLE public.auth_user_groups (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);

CREATE TABLE public.auth_user_user_permissions (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);

CREATE TABLE public.django_migrations (
    id bigint NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);

-- CUSTOM MODELS BEGIN HERE

CREATE TABLE public.uploads (
    id bigint NOT NULL,
    -- FileField uploaded to media directory
    content character varying(100) NOT NULL,
    owner_id bigint NOT NULL,
    uploadtime timestamp with time zone,

    -- Primary Key id
    Foreign Key (owner_id) references public.auth_user (id)
);

CREATE TABLE public.settings (
    id bigint NOT NULL,
    visible boolean NOT NULL,
    "chatOn" boolean NOT NULL,
    owner_id bigint NOT NULL,

    -- Primary Key id
    Foreign Key (owner_id) references public.auth_user (id)
);

CREATE TABLE public.preferences (
    id bigint NOT NULL,
    pricerange int4range NOT NULL,
    timerange daterange NOT NULL,
    location character varying(64)[] NOT NULL,
    owner_id bigint NOT NULL,

    -- Primary Key id
    Foreign Key (owner_id) references public.auth_user (id)
);

CREATE TABLE public.property (
    id bigint NOT NULL,
    name character varying(64) NOT NULL,
    address character varying(128) NOT NULL,
    city character varying(64) NOT NULL,
    country character varying(64) NOT NULL

    -- Primary Key id
);

CREATE TABLE public.listing (
    id bigint NOT NULL,
    unit character varying(16) NOT NULL,
    duration daterange NOT NULL,
    rate int4range NOT NULL,
    utilities character varying(32)[] NOT NULL,
    -- Enum (available, sold, unavailable)
    status character varying(15) NOT NULL,
    floorplan_id bigint,
    owner_id bigint NOT NULL,
    proof_id bigint,
    "propertyID_id" bigint NOT NULL,

    -- Primary Key id
    Foreign Key (owner_id) references public.auth_user (id),
    Foreign Key ("propertyID_id") references public.property (id),
    Constraint floorplan_fk Foreign Key (floorplan_id) references public.uploads (id),
    Constraint proof_fk Foreign Key (proof) references public.uploads (id)
);

CREATE TABLE public.interest (
    id bigint NOT NULL,
    -- Enum (closed, sold, pending)
    status character varying(15) NOT NULL,
    buyer_id bigint,
    listing_id bigint NOT NULL,
    seller_id bigint,

    -- Primary Key id
    Constraint buyer_fk Foreign Key (buyer_id) references public.auth_user (id),    
    Constraint seller_fk Foreign Key (seller_id) references public.auth_user (id),
    Foreign Key (listing_id) references public.listing (id)
);

CREATE TABLE public.flagged_listing (
    id bigint NOT NULL,
    "timestamp" timestamp with time zone,
    -- Enum (Illegal, Unethical, Inappropriate)
    type character varying(20),
    flagger_id bigint NOT NULL,
    listing_id bigint NOT NULL,

    -- Primary Key id, Unique Key (flagger_id, listing_id)
    Foreign Key (flagger_id) references public.auth_user (id),
    Foreign Key (listing_id) references public.listing (id)
);

CREATE TABLE public.blocks (
    id bigint NOT NULL,
    "timestamp" timestamp with time zone,
    blocked_id bigint NOT NULL,
    blocker_id bigint NOT NULL,

    -- Primary Key id, Unique Key (blocker, blocked)
    Constraint blocks_blocker_fk Foreign Key (blocker_id) references public.auth_user (id), 
    Constraint blocks_blocked_fk Foreign Key (blocked_id) references public.auth_user (id) 
);

CREATE TYPE public.message AS (
	sender boolean,
	message text,
	"timestamp" timestamp without time zone
);

CREATE TABLE public.chat (
    id bigint NOT NULL,
    history public.message[] NOT NULL,
    user1_id bigint NOT NULL,
    user2_id bigint NOT NULL,

    -- Primary Key id, Unique Key (user1_id, user2_id)
    Constraint chat_user1_fk Foreign Key (user1_id) references public.auth_user (id),
    Constraint chat_user2_fk Foreign Key (user2_id) references public.auth_user (id)
);