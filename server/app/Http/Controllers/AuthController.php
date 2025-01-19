<?php

namespace App\Http\Controllers;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\Operator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    public function register(RegisterRequest $request)
    {
        $operator = Operator::create([
            'op_id' => $request->op_id,
            'op_name' => $request->op_name,
            'op_name_kana' => $request->op_name_kana,
            'pwd' => Hash::make($request->pwd),
            'team_id' => $request->team_id
        ]);

        $token = Auth::login($operator);

        return response()->json([
            'message' => 'Đăng ký thành công',
            'operator' => $operator,
            'authorization' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $credentials = [
            'op_id' => $request->op_id,
            'password' => $request->pwd
        ];

        if (!$token = Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Thông tin đăng nhập không chính xác',
            ], 401);
        }

        return response()->json([
            'message' => 'Đăng nhập thành công',
            'operator' => Auth::user(),
            'authorization' => [
                'token' => $token,
                'type' => 'bearer',
            ]
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json([
            'message' => 'Đăng xuất thành công',
        ]);
    }

    public function me()
    {
        return response()->json(Auth::user());
    }

    public function refresh()
    {
        return response()->json([
            'operator' => Auth::user(),
            'authorization' => [
                'token' => Auth::refresh(),
                'type' => 'bearer',
            ]
        ]);
    }
}
