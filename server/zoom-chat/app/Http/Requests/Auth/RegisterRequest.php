<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'op_id' => 'required|string|max:32|unique:operators',
            'op_name' => 'required|string|max:64',
            'op_name_kana' => 'nullable|string|max:64',
            'pwd' => 'required|string|min:6',
            'team_id' => 'nullable|exists:teams,team_id'
        ];
    }
}
