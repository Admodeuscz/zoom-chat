<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Color;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colors = [
            ['color_value' => '#654321'],
            ['color_value' => '#A9A9A9'],
            ['color_value' => '#696969'],
            ['color_value' => '#708090'],
            ['color_value' => '#36454F'],
            ['color_value' => '#000080'],
            ['color_value' => '#00008B'],
            ['color_value' => '#4169E1'],
            ['color_value' => '#006400'],
            ['color_value' => '#228B22'],
        ];

        foreach ($colors as $color) {
            Color::create($color);
        }
    }
}
