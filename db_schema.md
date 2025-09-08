# 🗄️ **Database Schema Documentation**

**Generated**: 2025-09-08T12:16:01.951Z  
**Database**: PostgreSQL  
**Schema**: public

---

## 📋 **Overview**

This document contains the current real-time schema of the RetroQuest To-Do application database.

---

## 🏗️ **Tables Structure**

### **catchable_pokemon**

**Type**: BASE TABLE  
**Schema**: public

#### **Columns**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `integer(32)` | ❌ | nextval('catchable_pokemon_id_seq'::regclass) | - |
| `pokemon_id` | `integer(32)` | ❌ | - | - |
| `name` | `text` | ❌ | - | - |
| `sprite` | `text` | ❌ | - | - |
| `type` | `text` | ❌ | - | - |
| `rarity` | `text` | ❌ | - | - |
| `difficulty` | `integer(32)` | ❌ | - | - |
| `description` | `text` | ❌ | - | - |
| `catch_requirement` | `text` | ❌ | - | - |
| `points_reward` | `integer(32)` | ❌ | - | - |

#### **Indexes**

- `catchable_pokemon_name_key`: CREATE UNIQUE INDEX catchable_pokemon_name_key ON public.catchable_pokemon USING btree (name)
- `catchable_pokemon_pkey`: CREATE UNIQUE INDEX catchable_pokemon_pkey ON public.catchable_pokemon USING btree (id)
- `catchable_pokemon_pokemon_id_key`: CREATE UNIQUE INDEX catchable_pokemon_pokemon_id_key ON public.catchable_pokemon USING btree (pokemon_id)

---

### **daily_quests**

**Type**: BASE TABLE  
**Schema**: public

#### **Columns**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `quest_id` | `integer(32)` | ❌ | nextval('daily_quests_quest_id_seq'::regclass) | - |
| `user_id` | `integer(32)` | ❌ | - | - |
| `title` | `text` | ❌ | - | - |
| `points` | `integer(32)` | ❌ | 0 | - |
| `is_completed` | `boolean` | ❌ | false | - |
| `created_at` | `timestamp without time zone` | ❌ | CURRENT_TIMESTAMP | - |

#### **Foreign Keys**

- `user_id` → `users.user_id`

#### **Indexes**

- `daily_quests_pkey`: CREATE UNIQUE INDEX daily_quests_pkey ON public.daily_quests USING btree (quest_id)

---

### **gamification**

**Type**: BASE TABLE  
**Schema**: public

#### **Columns**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `gamification_id` | `integer(32)` | ❌ | nextval('gamification_gamification_id_seq'::regclass) | - |
| `user_id` | `integer(32)` | ❌ | - | - |
| `points` | `integer(32)` | ❌ | 0 | - |
| `streak_count` | `integer(32)` | ❌ | 0 | - |
| `badges` | `ARRAY` | ✅ | ARRAY[]::text[] | - |
| `level` | `integer(32)` | ❌ | 1 | - |
| `last_updated` | `timestamp without time zone` | ❌ | CURRENT_TIMESTAMP | - |

#### **Foreign Keys**

- `user_id` → `users.user_id`

#### **Indexes**

- `gamification_pkey`: CREATE UNIQUE INDEX gamification_pkey ON public.gamification USING btree (gamification_id)
- `gamification_user_id_key`: CREATE UNIQUE INDEX gamification_user_id_key ON public.gamification USING btree (user_id)

---

### **pokemon_gifs**

**Type**: BASE TABLE  
**Schema**: public

#### **Columns**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `integer(32)` | ❌ | nextval('pokemon_gifs_id_seq'::regclass) | - |
| `pokemon_id` | `integer(32)` | ❌ | - | - |
| `name` | `text` | ❌ | - | - |
| `gif_data` | `text` | ❌ | - | - |
| `created_at` | `timestamp without time zone` | ❌ | CURRENT_TIMESTAMP | - |

#### **Indexes**

- `pokemon_gifs_pkey`: CREATE UNIQUE INDEX pokemon_gifs_pkey ON public.pokemon_gifs USING btree (id)
- `pokemon_gifs_pokemon_id_key`: CREATE UNIQUE INDEX pokemon_gifs_pokemon_id_key ON public.pokemon_gifs USING btree (pokemon_id)

---

### **pokemon_pets**

**Type**: BASE TABLE  
**Schema**: public

#### **Columns**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `pet_id` | `integer(32)` | ❌ | nextval('pokemon_pets_pet_id_seq'::regclass) | - |
| `name` | `text` | ❌ | - | - |
| `sprite_stage_1` | `text` | ❌ | - | - |
| `sprite_stage_2` | `text` | ❌ | - | - |
| `sprite_stage_3` | `text` | ❌ | - | - |
| `description` | `text` | ❌ | - | - |
| `evolution_levels` | `jsonb` | ❌ | - | - |
| `type` | `text` | ❌ | - | - |

#### **Indexes**

- `pokemon_pets_name_key`: CREATE UNIQUE INDEX pokemon_pets_name_key ON public.pokemon_pets USING btree (name)
- `pokemon_pets_pkey`: CREATE UNIQUE INDEX pokemon_pets_pkey ON public.pokemon_pets USING btree (pet_id)

---

### **task_history**

**Type**: BASE TABLE  
**Schema**: public

#### **Columns**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `history_id` | `integer(32)` | ❌ | nextval('task_history_history_id_seq'::regclass) | - |
| `user_id` | `integer(32)` | ❌ | - | - |
| `task_id` | `integer(32)` | ❌ | - | - |
| `date` | `date` | ❌ | - | - |
| `is_done` | `boolean` | ❌ | - | - |
| `completed_at` | `timestamp without time zone` | ✅ | - | - |
| `title` | `text` | ❌ | - | - |
| `description` | `text` | ✅ | - | - |
| `category` | `text` | ✅ | - | - |
| `priority` | `text` | ✅ | - | - |

#### **Foreign Keys**

- `user_id` → `users.user_id`

#### **Indexes**

- `task_history_pkey`: CREATE UNIQUE INDEX task_history_pkey ON public.task_history USING btree (history_id)

---

### **tasks**

**Type**: BASE TABLE  
**Schema**: public

#### **Columns**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `task_id` | `integer(32)` | ❌ | nextval('tasks_task_id_seq'::regclass) | - |
| `user_id` | `integer(32)` | ❌ | - | - |
| `title` | `text` | ❌ | - | - |
| `description` | `text` | ✅ | - | - |
| `category` | `text` | ✅ | - | - |
| `priority` | `text` | ✅ | 'Medium'::text | - |
| `is_done` | `boolean` | ❌ | false | - |
| `created_at` | `timestamp without time zone` | ❌ | CURRENT_TIMESTAMP | - |
| `updated_at` | `timestamp without time zone` | ❌ | - | - |

#### **Foreign Keys**

- `user_id` → `users.user_id`

#### **Indexes**

- `tasks_pkey`: CREATE UNIQUE INDEX tasks_pkey ON public.tasks USING btree (task_id)

---

### **user_caught_pokemon**

**Type**: BASE TABLE  
**Schema**: public

#### **Columns**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `integer(32)` | ❌ | nextval('user_caught_pokemon_id_seq'::regclass) | - |
| `user_id` | `integer(32)` | ❌ | - | - |
| `caught_at` | `timestamp without time zone` | ❌ | CURRENT_TIMESTAMP | - |
| `is_companion` | `boolean` | ❌ | false | - |
| `catchable_pokemon_id` | `integer(32)` | ❌ | - | - |

#### **Foreign Keys**

- `catchable_pokemon_id` → `catchable_pokemon.id`
- `user_id` → `users.user_id`

#### **Indexes**

- `user_caught_pokemon_pkey`: CREATE UNIQUE INDEX user_caught_pokemon_pkey ON public.user_caught_pokemon USING btree (id)
- `user_caught_pokemon_user_id_catchable_pokemon_id_key`: CREATE UNIQUE INDEX user_caught_pokemon_user_id_catchable_pokemon_id_key ON public.user_caught_pokemon USING btree (user_id, catchable_pokemon_id)

---

### **users**

**Type**: BASE TABLE  
**Schema**: public

#### **Columns**

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `user_id` | `integer(32)` | ❌ | nextval('users_user_id_seq'::regclass) | - |
| `email` | `text` | ❌ | - | - |
| `username` | `text` | ✅ | - | - |
| `password` | `text` | ✅ | - | - |
| `google_id` | `text` | ✅ | - | - |
| `points` | `integer(32)` | ❌ | 0 | - |
| `level` | `integer(32)` | ❌ | 1 | - |
| `pokemon_pet_id` | `integer(32)` | ✅ | - | - |
| `created_at` | `timestamp without time zone` | ❌ | CURRENT_TIMESTAMP | - |

#### **Foreign Keys**

- `pokemon_pet_id` → `pokemon_pets.pet_id`

#### **Indexes**

- `users_email_key`: CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email)
- `users_google_id_key`: CREATE UNIQUE INDEX users_google_id_key ON public.users USING btree (google_id)
- `users_pkey`: CREATE UNIQUE INDEX users_pkey ON public.users USING btree (user_id)

---

## 🔗 **Table Relationships**

### **daily_quests → users**

- user_id → user_id

### **gamification → users**

- user_id → user_id

### **task_history → users**

- user_id → user_id

### **tasks → users**

- user_id → user_id

### **user_caught_pokemon → catchable_pokemon**

- catchable_pokemon_id → id

### **user_caught_pokemon → users**

- user_id → user_id

### **users → pokemon_pets**

- pokemon_pet_id → pet_id

## 📊 **Summary**

- **Total Tables**: 9
- **Total Columns**: 69
- **Total Foreign Keys**: 7
- **Total Indexes**: 17

---

**Note**: This schema is extracted from the live database and reflects the current state at the time of generation.

