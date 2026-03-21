
  create table "public"."assets" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default now(),
    "owner_wallet" text not null,
    "image_url" text not null,
    "content_hash" text not null,
    "metadata" jsonb default '{}'::jsonb,
    "price_usdc" numeric default 0,
    "trust_level" smallint default 0,
    "status" text default 'available'::text
      );


alter table "public"."assets" enable row level security;


  create table "public"."licenses" (
    "id" uuid not null default gen_random_uuid(),
    "asset_id" uuid,
    "buyer_wallet" text not null,
    "solana_txn" text not null,
    "purchased_at" timestamp with time zone default now(),
    "status" text default 'completed'::text
      );


alter table "public"."licenses" enable row level security;

CREATE UNIQUE INDEX assets_pkey ON public.assets USING btree (id);

CREATE UNIQUE INDEX licenses_pkey ON public.licenses USING btree (id);

CREATE UNIQUE INDEX licenses_solana_txn_key ON public.licenses USING btree (solana_txn);

alter table "public"."assets" add constraint "assets_pkey" PRIMARY KEY using index "assets_pkey";

alter table "public"."licenses" add constraint "licenses_pkey" PRIMARY KEY using index "licenses_pkey";

alter table "public"."licenses" add constraint "licenses_asset_id_fkey" FOREIGN KEY (asset_id) REFERENCES public.assets(id) ON DELETE CASCADE not valid;

alter table "public"."licenses" validate constraint "licenses_asset_id_fkey";

alter table "public"."licenses" add constraint "licenses_solana_txn_key" UNIQUE using index "licenses_solana_txn_key";

grant delete on table "public"."assets" to "anon";

grant insert on table "public"."assets" to "anon";

grant references on table "public"."assets" to "anon";

grant select on table "public"."assets" to "anon";

grant trigger on table "public"."assets" to "anon";

grant truncate on table "public"."assets" to "anon";

grant update on table "public"."assets" to "anon";

grant delete on table "public"."assets" to "authenticated";

grant insert on table "public"."assets" to "authenticated";

grant references on table "public"."assets" to "authenticated";

grant select on table "public"."assets" to "authenticated";

grant trigger on table "public"."assets" to "authenticated";

grant truncate on table "public"."assets" to "authenticated";

grant update on table "public"."assets" to "authenticated";

grant delete on table "public"."assets" to "service_role";

grant insert on table "public"."assets" to "service_role";

grant references on table "public"."assets" to "service_role";

grant select on table "public"."assets" to "service_role";

grant trigger on table "public"."assets" to "service_role";

grant truncate on table "public"."assets" to "service_role";

grant update on table "public"."assets" to "service_role";

grant delete on table "public"."licenses" to "anon";

grant insert on table "public"."licenses" to "anon";

grant references on table "public"."licenses" to "anon";

grant select on table "public"."licenses" to "anon";

grant trigger on table "public"."licenses" to "anon";

grant truncate on table "public"."licenses" to "anon";

grant update on table "public"."licenses" to "anon";

grant delete on table "public"."licenses" to "authenticated";

grant insert on table "public"."licenses" to "authenticated";

grant references on table "public"."licenses" to "authenticated";

grant select on table "public"."licenses" to "authenticated";

grant trigger on table "public"."licenses" to "authenticated";

grant truncate on table "public"."licenses" to "authenticated";

grant update on table "public"."licenses" to "authenticated";

grant delete on table "public"."licenses" to "service_role";

grant insert on table "public"."licenses" to "service_role";

grant references on table "public"."licenses" to "service_role";

grant select on table "public"."licenses" to "service_role";

grant trigger on table "public"."licenses" to "service_role";

grant truncate on table "public"."licenses" to "service_role";

grant update on table "public"."licenses" to "service_role";


  create policy "Public Read Assets"
  on "public"."assets"
  as permissive
  for select
  to public
using (true);



