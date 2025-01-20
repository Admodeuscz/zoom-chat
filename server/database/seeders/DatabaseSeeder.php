<?php

namespace Database\Seeders;

use App\Models\Operator;
use App\Models\Team;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $team1 = Team::create([
            'team_name' => 'テストチーム1',
        ]);

        $team2 = Team::create([
            'team_name' => 'テストチーム2',
        ]);

        $this->call([
            OperatorSeeder::class,
            MessageSeeder::class,
        ]);
    }
}
