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

        Operator::create([
            'op_id' => 'operator01',
            'op_name' => 'テストユーザー1',
            'op_name_kana' => 'テストユーザー1',
            'pwd' => Hash::make('12345678'),
            'team_id' => $team1->team_id,
        ]);

        Operator::create([
            'op_id' => 'operator02',
            'op_name' => 'テストユーザー2',
            'op_name_kana' => 'テストユーザー2',
            'pwd' => Hash::make('12345678'),
            'team_id' => $team2->team_id,
        ]);
    }
}
