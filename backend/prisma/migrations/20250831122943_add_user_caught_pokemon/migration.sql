-- CreateTable
CREATE TABLE "user_caught_pokemon" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "pokemon_id" INTEGER NOT NULL,
    "pokemon_name" TEXT NOT NULL,
    "pokemon_sprite" TEXT NOT NULL,
    "pokemon_type" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "points_reward" INTEGER NOT NULL,
    "caught_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_companion" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_caught_pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_caught_pokemon_user_id_pokemon_id_key" ON "user_caught_pokemon"("user_id", "pokemon_id");

-- AddForeignKey
ALTER TABLE "user_caught_pokemon" ADD CONSTRAINT "user_caught_pokemon_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
