<?php

namespace App\Http\Controllers;

use App\Models\Operator;
use App\Traits\HasApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    use HasApiResponses;

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'op_id' => 'required|string|max:32|unique:operators',
            'op_name' => 'required|string|max:64',
            'op_name_kana' => 'nullable|string|max:64',
            'pwd' => 'required|string|min:6',
            'team_id' => 'nullable|exists:teams,team_id'
        ]);

        if ($validator->fails()) {
            return $this->responseApi(['errors' => $validator->errors()], false, 422);
        }

        $operator = Operator::create([
            'op_id' => $request->op_id,
            'op_name' => $request->op_name,
            'op_name_kana' => $request->op_name_kana,
            'pwd' => Hash::make($request->pwd),
            'team_id' => $request->team_id
        ]);

        $token = $operator->createToken('auth-token')->plainTextToken;

        return $this->responseApi([
            'operator' => $operator,
            'access_token' => $token
        ], true, 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'op_id' => 'required|string',
            'pwd' => 'required|string'
        ]);

        if ($validator->fails()) {
            return $this->responseApi(['errors' => $validator->errors()], false, 422);
        }

        $operator = Operator::where('op_id', $request->op_id)->first();

        if (!$operator || !Hash::check($request->pwd, $operator->pwd)) {
            return $this->responseApi(['message' => 'Unauthorized'], false, 401);
        }

        $token = $operator->createToken('auth-token')->plainTextToken;

        return $this->responseApi([
            'operator' => $operator->load('color'),
            'access_token' => $token
        ], true, 200);
    }

    public function me(Request $request)
    {
        return $this->responseApi(Auth::user()->load('color'), true, 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->responseApi(['message' => 'Logout successfully'], true, 200);
    }

    public function refresh(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();
        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->responseApi([
            'operator' => $user,
            'access_token' => $token
        ], true, 200);
    }
}
