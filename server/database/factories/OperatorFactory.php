<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class OperatorFactory extends Factory
{
    public function definition(): array
    {
        $fakerJa = \Faker\Factory::create('ja_JP');

        $username = $this->faker->unique()->userName();
        $filteredUsername = preg_replace('/[^a-zA-Z0-9_-]/', '', $username);

        return [
            'op_id' => $filteredUsername,
            'op_name' => $fakerJa->name(),
            'op_name_kana' => $fakerJa->kanaName(),
            'pwd' => Hash::make('12345678'),
            'team_id' => '1',
        ];
    }
}
