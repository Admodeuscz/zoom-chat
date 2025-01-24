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
            ['color_value' => 'linear-gradient( 135deg, #ABDCFF 10%, #0396FF 100%)'],
            ['color_value' => 'linear-gradient( 135deg, #81FBB8 10%, #28C76F 100%)'],
            ['color_value' => 'linear-gradient( 135deg, #FFF6B7 10%, #F6416C 100%)'],
            ['color_value' => 'linear-gradient( 135deg, #E2B0FF 10%, #9F44D3 100%)'],
            ['color_value' => 'linear-gradient( 135deg, #5EFCE8 10%, #736EFE 100%)'],
            ['color_value' => 'linear-gradient( 135deg, #90F7EC 10%, #32CCBC 100%)'],
            ['color_value' => 'linear-gradient( 135deg, #F6CEEC 10%, #D939CD 100%)'],
            ['color_value' => 'linear-gradient( 135deg, #FDD819 10%, #E80505 100%)'],
            ['color_value' => 'linear-gradient( 135deg, #65FDF0 10%, #1D6FA3 100%)'],
            ['color_value' => 'linear-gradient( 135deg, #70F570 10%, #49C628 100%)'],
        ];

        foreach ($colors as $color) {
            Color::create($color);
        }
    }
}
