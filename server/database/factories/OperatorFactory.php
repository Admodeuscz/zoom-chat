<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class OperatorFactory extends Factory
{
  public function definition(): array
  {
    return [
      'op_id' => $this->faker->unique()->userName(),
      'op_name' => $this->faker->name(),
      'op_name_kana' => $this->faker->name(),
      'pwd' => Hash::make('12345678'),
      'team_id' => '1',
      // Thêm các trường khác nếu cần
    ];
  }
}