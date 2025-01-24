<?php

namespace Database\Seeders;

use App\Models\Color;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colors = [
            ['color_value' => '#0396FF'],
            ['color_value' => '#28C76F'],
            ['color_value' => '#F6416C'],
            ['color_value' => '#9F44D3'],
            ['color_value' => '#736EFE'],
            ['color_value' => '#32CCBC'],
            ['color_value' => '#D939CD'],
            ['color_value' => '#E80505'],
            ['color_value' => '#1D6FA3'],
            ['color_value' => '#49C628'],
        ];

        foreach ($colors as $color) {
            Color::create($color);
        }
    }
}
